#!/bin/sh
set -eu

umask 077

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
legacy_source=${LEGACY_SOURCE:-/opt/descomplicaza/descomplicasa}
app_root=${APP_ROOT:-/srv/descomplicaza}
config_file=${DESCOMPLICAZA_ENV_FILE:-/etc/descomplicaza.env}
tool_dir=${DEPLOY_TOOL_DIR:-/usr/local/lib/descomplicaza-deploy}
start_script=${START_SCRIPT:-/usr/local/bin/descomplicaza-start}
pull_loop=/usr/local/bin/descomplicaza-pull-loop
termux_prefix=/data/data/com.termux/files/usr
app_service=$termux_prefix/var/service/descomplicaza
pull_service=$termux_prefix/var/service/descomplicaza-pull
sv_bin=$termux_prefix/bin/sv

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this bootstrap as root inside Debian." >&2
  exit 1
fi

case "$legacy_source" in
  /*) ;;
  *) echo "LEGACY_SOURCE must be absolute" >&2; exit 1 ;;
esac
case "$app_root" in
  /|/bin|/boot|/dev|/etc|/home|/opt|/proc|/root|/run|/srv|/sys|/tmp|/usr|/var|*[!A-Za-z0-9._/-]*)
    echo "APP_ROOT is unsafe" >&2
    exit 1
    ;;
  /*) ;;
  *) echo "APP_ROOT must be absolute" >&2; exit 1 ;;
esac

for file in deploy-release.sh parse-release.mjs pull-release.sh remote-check.sh rollback-release.sh start-release.sh pull-loop.sh; do
  test -f "$script_dir/$file"
done
test -f "$script_dir/runit/pull/run"
test -f "$script_dir/runit/pull/log/run"

legacy_source=$(readlink -f "$legacy_source")
test -d "$legacy_source"
test -f "$legacy_source/package.json"
test -f "$legacy_source/.next/BUILD_ID"
test -f "$legacy_source/node_modules/next/dist/bin/next"
test -x /usr/local/bin/node
test -x "$sv_bin"

legacy_revision=${LEGACY_REVISION:-$(git -C "$legacy_source" rev-parse HEAD)}
case "$legacy_revision" in
  *[!0-9a-f]*|'') echo "LEGACY_REVISION must be a lowercase Git SHA" >&2; exit 1 ;;
esac
test "${#legacy_revision}" -eq 40
test "$(git -C "$legacy_source" rev-parse HEAD)" = "$legacy_revision"

curl --fail --silent --show-error --max-time 10 http://127.0.0.1:3000/ >/dev/null
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:5678/healthz >/dev/null
"$sv_bin" status "$app_service" | grep '^run:' >/dev/null

legacy_release="$app_root/releases/legacy-$legacy_revision"
mkdir -p "$legacy_release" "$app_root/incoming" "$tool_dir"
if [ -e "$legacy_release/.legacy-source" ]; then
  test "$(sed -n '1p' "$legacy_release/.legacy-source")" = "$legacy_source"
else
  printf '%s\n' "$legacy_source" > "$legacy_release/.legacy-source"
fi
if [ -e "$legacy_release/REVISION" ]; then
  test "$(cat "$legacy_release/REVISION")" = "$legacy_revision"
else
  printf '%s\n' "$legacy_revision" > "$legacy_release/REVISION"
fi

if [ -L "$app_root/current" ]; then
  test "$(readlink -f "$app_root/current")" = "$legacy_release" || {
    echo "APP_ROOT/current already points to a different release; refusing to replace it." >&2
    exit 1
  }
elif [ -e "$app_root/current" ]; then
  echo "APP_ROOT/current exists and is not a symbolic link." >&2
  exit 1
else
  current_tmp="$app_root/.current-bootstrap-$$"
  ln -s "$legacy_release" "$current_tmp"
  mv -Tf "$current_tmp" "$app_root/current"
fi

config_tmp=$(mktemp)
canary_pid=
cleanup() {
  rm -f "$config_tmp"
  if [ -n "$canary_pid" ]; then
    kill "$canary_pid" 2>/dev/null || true
    wait "$canary_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

cat > "$config_tmp" <<EOF
APP_ROOT=$app_root
PORT=3000
HOSTNAME=127.0.0.1
NODE_BIN=/usr/local/bin/node
NODE_OPTIONS=--max-old-space-size=512
APP_SERVICE=$app_service
SV_BIN=$sv_bin
START_SCRIPT=$start_script
CURRENT_HEALTH_URL=http://127.0.0.1:3000/
APP_HEALTH_URL=http://127.0.0.1:3000/api/health
N8N_HEALTH_URL=http://127.0.0.1:5678/healthz
CANARY_PORT=3100
GITHUB_REPOSITORY=Bonisengna/descomplicasa
DEPLOY_TOOL_DIR=$tool_dir
PULL_INTERVAL_SECONDS=2592000
EOF

if [ -e "$config_file" ] && ! cmp -s "$config_tmp" "$config_file"; then
  config_backup="$config_file.pre-cicd"
  if [ ! -e "$config_backup" ]; then
    cp -p "$config_file" "$config_backup"
  fi
fi
install -m 600 "$config_tmp" "$config_file"

for file in deploy-release.sh parse-release.mjs pull-release.sh remote-check.sh rollback-release.sh start-release.sh; do
  install -m 700 "$script_dir/$file" "$tool_dir/$file"
done
install -m 700 "$script_dir/pull-loop.sh" "$pull_loop"

if [ -e "$start_script" ] && [ ! -e "$start_script.pre-cicd" ]; then
  cp -p "$start_script" "$start_script.pre-cicd"
fi
install -m 700 "$script_dir/start-release.sh" "$start_script"

if curl --fail --silent --max-time 2 http://127.0.0.1:3100/ >/dev/null 2>&1; then
  echo "Canary port 3100 is already in use." >&2
  exit 1
fi
DESCOMPLICAZA_ENV_FILE="$config_file" RELEASE_DIR="$legacy_release" \
START_HOSTNAME=127.0.0.1 START_PORT=3100 "$start_script" \
  > "$legacy_release/bootstrap-canary.log" 2>&1 &
canary_pid=$!

attempt=0
while [ "$attempt" -lt 45 ]; do
  if curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3100/ >/dev/null 2>&1; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done
if [ "$attempt" -ge 45 ]; then
  echo "Legacy canary did not become healthy; the running service was not restarted." >&2
  tail -n 80 "$legacy_release/bootstrap-canary.log" >&2 || true
  exit 1
fi
kill "$canary_pid" 2>/dev/null || true
wait "$canary_pid" 2>/dev/null || true
canary_pid=

install -d -m 755 "$pull_service/log"
install -m 700 "$script_dir/runit/pull/run" "$pull_service/run"
install -m 700 "$script_dir/runit/pull/log/run" "$pull_service/log/run"
if [ ! -e "$pull_service/down" ]; then
  : > "$pull_service/down"
fi
chmod 600 "$pull_service/down"

DESCOMPLICAZA_ENV_FILE="$config_file" "$tool_dir/remote-check.sh"

printf '%s\n' \
  "Bootstrap validated without restarting the live site." \
  "Legacy rollback: $legacy_release" \
  "The 30-day pull service is installed but intentionally remains disabled." \
  "Next: run one manual pull, validate the site, then remove $pull_service/down and start the service."
