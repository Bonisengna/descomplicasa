import { spawn } from "node:child_process";
import { timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isIP } from "node:net";

const releaseApi = "https://api.github.com/repos/Bonisengna/descomplicasa/releases";
const revisionPattern = /^[a-f0-9]{40}$/;
const repositoryHeaders = {
  accept: "application/vnd.github+json",
  "user-agent": "descomplicaza-deploy-signal/1",
};

export function createDeployReceiver({ token, checkLatest, deploy, verify, log = console }) {
  if (!/^[a-f0-9]{64}$/.test(token)) throw Error("Invalid deploy signal token");
  const expectedToken = Buffer.from(`Bearer ${token}`);
  let active = false;

  return createServer({ headersTimeout: 5000, requestTimeout: 10000, maxHeaderSize: 2048 }, async (request, response) => {
    function reply(status, body) {
      if (response.destroyed) return;
      response.writeHead(status, {
        "content-type": "application/json",
        "cache-control": "no-store",
        connection: "close",
      });
      response.end(JSON.stringify(body));
    }

    const authorization = Buffer.from(request.headers.authorization ?? "");
    if (authorization.length !== expectedToken.length || !timingSafeEqual(authorization, expectedToken)) {
      reply(401, { status: "unauthorized" });
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      reply(200, { status: "ok" });
      return;
    }

    const path = request.url ?? "";
    const revision = path.startsWith("/deploy/") ? path.slice(8) : "";
    if (request.method !== "POST" || !revisionPattern.test(revision)
      || request.headers["transfer-encoding"] || !["0", undefined].includes(request.headers["content-length"])) {
      reply(400, { status: "invalid_request" });
      return;
    }
    if (active) {
      reply(409, { status: "deployment_in_progress" });
      return;
    }

    active = true;
    try {
      if (!await checkLatest(revision)) {
        reply(409, { status: "release_is_not_current" });
        return;
      }

      log.info(`Deploy ${revision} started`);
      await deploy(revision);
      await verify(revision);
      log.info(`Deploy ${revision} verified`);
      reply(200, { status: "ok", revision });
    } catch {
      log.error(`Deploy ${revision} did not complete`);
      reply(502, { status: "deployment_failed" });
    } finally {
      active = false;
    }
  });
}

async function checkLatest(revision) {
  const response = await fetch(`${releaseApi}/latest`, {
    headers: repositoryHeaders,
    redirect: "error",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw Error("Release metadata unavailable");
  const release = await response.json();
  return release.tag_name === `deploy-${revision}` && release.target_commitish === revision
    && release.draft === false && release.prerelease === false;
}

function deploy(revision) {
  const executable = fileURLToPath(new URL("./pull-release.sh", import.meta.url));
  const env = { ...process.env, RELEASE_API_URL: `${releaseApi}/tags/deploy-${revision}` };
  return new Promise((resolve, reject) => {
    const installer = spawn(executable, [], { env, stdio: ["ignore", "inherit", "inherit"] });
    installer.once("error", reject);
    installer.once("exit", code => code === 0 ? resolve() : reject(Error("Installer failed")));
  });
}

async function verify(revision) {
  const [site, n8n] = await Promise.all([
    fetch("http://127.0.0.1:3000/api/health", { signal: AbortSignal.timeout(10000), redirect: "error" }),
    fetch("http://127.0.0.1:5678/healthz", { signal: AbortSignal.timeout(10000), redirect: "error" }),
  ]);
  if (!site.ok || !n8n.ok) throw Error("Post-deploy health check failed");
  const health = await site.json();
  if (health.status !== "ok" || health.revision !== revision) throw Error("Unexpected active revision");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.argv[2];
  const [first, second] = (host ?? "").split(".").map(Number);
  if (isIP(host ?? "") !== 4 || first !== 100 || second < 64 || second > 127) {
    throw Error("A private Tailscale IPv4 address is required");
  }
  const token = readFileSync(new URL("./deploy-signal.token", import.meta.url), "utf8").trim();
  const server = createDeployReceiver({ token, checkLatest, deploy, verify });
  server.listen(8787, host, () => console.info("Private deploy signal receiver ready"));
}
