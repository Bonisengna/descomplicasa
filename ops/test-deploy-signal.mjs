import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import { createDeployReceiver } from "./deploy-signal.mjs";

const revision = "e".repeat(40);
const token = "a".repeat(64);
const authorization = { authorization: `Bearer ${token}` };

async function scenario(t, options = {}) {
  const stages = [];
  const server = createDeployReceiver({
    token,
    checkLatest: async sha => {
      stages.push(["checkLatest", sha]);
      return sha === revision;
    },
    deploy: async sha => stages.push(["deploy", sha]),
    verify: async sha => stages.push(["verify", sha]),
    log: { info() {}, error() {} },
    ...options,
  }).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  return { stages, request: (path, init) => fetch(`${base}${path}`, init) };
}

test("authentication and validation happen before outbound calls", async t => {
  const { stages, request } = await scenario(t);
  assert.equal((await request(`/deploy/${revision}`, { method: "POST" })).status, 401);
  assert.equal((await request("/deploy/not-a-revision", { method: "POST", headers: authorization })).status, 400);
  assert.equal((await request(`/deploy/${revision}`, { method: "POST", headers: authorization, body: "extra" })).status, 400);
  assert.equal((await request("/health", { headers: authorization })).status, 200);
  assert.deepEqual(stages, []);
});

test("only the current release is installed and verified", async t => {
  const { stages, request } = await scenario(t);
  const old = "f".repeat(40);
  assert.equal((await request(`/deploy/${old}`, { method: "POST", headers: authorization })).status, 409);
  const response = await request(`/deploy/${revision}`, { method: "POST", headers: authorization });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok", revision });
  assert.deepEqual(stages, [["checkLatest", old], ["checkLatest", revision], ["deploy", revision], ["verify", revision]]);
});

test("a running deployment excludes a concurrent signal", async t => {
  let started;
  const entered = new Promise(resolve => { started = resolve; });
  let finish;
  const running = new Promise(resolve => { finish = resolve; });
  const { request } = await scenario(t, { deploy: async () => { started(); await running; } });
  const post = () => request(`/deploy/${revision}`, { method: "POST", headers: authorization });
  const first = post();
  try {
    await entered;
    assert.equal((await post()).status, 409);
  } finally {
    finish();
  }
  assert.equal((await first).status, 200);
});

test("a failed health verification is reported as a failed delivery", async t => {
  const { request } = await scenario(t, { verify: async () => { throw Error("Not healthy"); } });
  const response = await request(`/deploy/${revision}`, { method: "POST", headers: authorization });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { status: "deployment_failed" });
});
