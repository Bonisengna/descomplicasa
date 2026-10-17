#!/bin/sh
set -eu

archive=$(readlink -f "${1:?release archive is required}")
checksum=$(readlink -f "${2:?checksum file is required}")
project_root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
test_root=$(mktemp -d)
app_root="$test_root/descomplicaza"
fake_bin="$test_root/bin"
prod_port=$((40000 + ($$ % 1000)))
canary_port=$((41000 + ($$ % 1000)))
n8n_port=$((42000 + ($$ % 1000)))
pid_file="$test_root/app.pid"

cleanup() {
  if [ -f "$pid_file" ]; then
    kill "$(cat "$pid_file")" 2>/dev/null || true
  fi
  if [ -n "${n8n_pid:-}" ]; then
    kill "$n8n_pid" 2>/dev/null || true
  fi
  case "$test_root" in
    /tmp/*) rm -rf "$test_root" ;;
    *) echo "Refusing to clean unsafe test path: $test_root" >&2 ;;
  esac
}
trap cleanup EXIT INT TERM

mkdir -p "$app_root/releases/old" "$app_root/incoming" "$fake_bin"
tar -xzf "$archive" -C "$app_root/releases/old"
printf 'old\n' > "$app_root/releases/old/REVISION"
ln -s "$app_root/releases/old" "$app_root/current"

cat > "$fake_bin/sv" <<'FAKE_SV'
#!/bin/sh
set -eu

command=${1:?command is required}
service=${2:?service is required}

case "$command" in
  status)
    if [ -f "$TEST_PID_FILE" ] && kill -0 "$(cat "$TEST_PID_FILE")" 2>/dev/null; then
      printf 'run: %s: (pid %s) 1s\n' "$service" "$(cat "$TEST_PID_FILE")"
      exit 0
    fi
    printf 'down: %s\n' "$service" >&2
    exit 1
    ;;
  restart)
    if [ -f "$TEST_PID_FILE" ]; then
      kill "$(cat "$TEST_PID_FILE")" 2>/dev/null || true
      rm -f "$TEST_PID_FILE"
    fi
    release=$(readlink -f "$APP_ROOT/current")
    revision=$(cat "$release/REVISION")
    if [ "${TEST_FAIL_REVISION:-}" = "$revision" ]; then
      exit 0
    fi
    (
      cd "$release"
      nohup env APP_REVISION="$revision" HOSTNAME=127.0.0.1 PORT="$TEST_PROD_PORT" node server.js \
        > "$TEST_LOG_FILE" 2>&1 &
      printf '%s\n' "$!" > "$TEST_PID_FILE"
    )
    ;;
  *)
    echo "Unsupported fake sv command: $command" >&2
    exit 1
    ;;
esac
FAKE_SV
chmod 700 "$fake_bin/sv"

N8N_PORT="$n8n_port" node -e '
  const http = require("node:http");
  http.createServer((request, response) => {
    response.writeHead(request.url === "/healthz" ? 200 : 404, { "content-type": "application/json" });
    response.end(request.url === "/healthz" ? "{\"status\":\"ok\"}" : "{}");
  }).listen(Number(process.env.N8N_PORT), "127.0.0.1");
' > "$test_root/n8n.log" 2>&1 &
n8n_pid=$!

export PATH="$fake_bin:$PATH"
export APP_ROOT="$app_root"
export APP_SERVICE="$test_root/service/descomplicaza"
export SV_BIN="$fake_bin/sv"
export CURRENT_HEALTH_URL="http://127.0.0.1:$prod_port/"
export APP_HEALTH_URL="http://127.0.0.1:$prod_port/api/health"
export N8N_HEALTH_URL="http://127.0.0.1:$n8n_port/healthz"
export CANARY_PORT="$canary_port"
export HEALTHCHECK_ATTEMPTS=8
export TEST_PID_FILE="$pid_file"
export TEST_PROD_PORT="$prod_port"
export TEST_LOG_FILE="$test_root/app.log"

sv restart "$APP_SERVICE"

attempt=0
while [ "$attempt" -lt "$HEALTHCHECK_ATTEMPTS" ]; do
  if curl --fail --silent --max-time 2 "$APP_HEALTH_URL" | grep -F '"revision":"old"' >/dev/null 2>&1 \
    && curl --fail --silent --max-time 2 "$N8N_HEALTH_URL" >/dev/null 2>&1; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done
test "$attempt" -lt "$HEALTHCHECK_ATTEMPTS"
"$project_root/ops/remote-check.sh"

stage_release() {
  release=$1
  inbox="$app_root/incoming/$release"
  mkdir -p "$inbox"
  cp "$archive" "$inbox/descomplicaza.tar.gz"
  cp "$checksum" "$inbox/descomplicaza.tar.gz.sha256"
}

stage_release new
"$project_root/ops/deploy-release.sh" \
  "$app_root/incoming/new/descomplicaza.tar.gz" \
  "$app_root/incoming/new/descomplicaza.tar.gz.sha256" \
  new
test "$(readlink -f "$app_root/current")" = "$app_root/releases/new"
curl --fail --silent "$APP_HEALTH_URL" | grep -F '"revision":"new"' >/dev/null

stage_release new
"$project_root/ops/deploy-release.sh" \
  "$app_root/incoming/new/descomplicaza.tar.gz" \
  "$app_root/incoming/new/descomplicaza.tar.gz.sha256" \
  new

"$project_root/ops/rollback-release.sh"
test "$(readlink -f "$app_root/current")" = "$app_root/releases/old"
curl --fail --silent "$APP_HEALTH_URL" | grep -F '"revision":"old"' >/dev/null

stage_release broken
export TEST_FAIL_REVISION=broken
if "$project_root/ops/deploy-release.sh" \
  "$app_root/incoming/broken/descomplicaza.tar.gz" \
  "$app_root/incoming/broken/descomplicaza.tar.gz.sha256" \
  broken; then
  echo "Broken production release unexpectedly succeeded" >&2
  exit 1
fi
unset TEST_FAIL_REVISION
test "$(readlink -f "$app_root/current")" = "$app_root/releases/old"
curl --fail --silent "$APP_HEALTH_URL" | grep -F '"revision":"old"' >/dev/null
curl --fail --silent "$N8N_HEALTH_URL" >/dev/null

printf 'Release script integration tests passed.\n'
