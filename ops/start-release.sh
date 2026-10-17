#!/bin/sh
set -eu

config_file=${DESCOMPLICAZA_ENV_FILE:-/etc/descomplicaza.env}
requested_port=${START_PORT:-}
requested_hostname=${START_HOSTNAME:-}

test -r "$config_file"
# This file is controlled by the server administrator, not by a release.
. "$config_file"

: "${APP_ROOT:?APP_ROOT is required}"
: "${PORT:=3000}"
: "${HOSTNAME:=127.0.0.1}"
: "${NODE_BIN:=/usr/local/bin/node}"
: "${NODE_OPTIONS:=--max-old-space-size=512}"

if [ -n "$requested_port" ]; then
  PORT=$requested_port
fi
if [ -n "$requested_hostname" ]; then
  HOSTNAME=$requested_hostname
fi

case "$PORT" in
  *[!0-9]*|'') echo "PORT must be numeric" >&2; exit 1 ;;
esac
test -x "$NODE_BIN"

resolved_app_root=$(readlink -f "$APP_ROOT")
release=${RELEASE_DIR:-$(readlink -f "$APP_ROOT/current")}
release=$(readlink -f "$release")
case "$release" in
  "$resolved_app_root"/releases/*) ;;
  *) echo "Release directory is outside APP_ROOT/releases" >&2; exit 1 ;;
esac
test -d "$release"
test -f "$release/REVISION"
APP_REVISION=$(cat "$release/REVISION")
test -n "$APP_REVISION"

export APP_REVISION PORT HOSTNAME NODE_ENV=production NODE_OPTIONS NEXT_TELEMETRY_DISABLED=1

if [ -f "$release/.legacy-source" ]; then
  legacy_source=$(sed -n '1p' "$release/.legacy-source")
  case "$legacy_source" in
    /*) ;;
    *) echo "Legacy source path must be absolute" >&2; exit 1 ;;
  esac
  test "$(wc -l < "$release/.legacy-source")" -eq 1
  legacy_source=$(readlink -f "$legacy_source")
  test -d "$legacy_source"
  test -f "$legacy_source/package.json"
  test -f "$legacy_source/.next/BUILD_ID"
  test -f "$legacy_source/node_modules/next/dist/bin/next"
  cd "$legacy_source"
  exec "$NODE_BIN" node_modules/next/dist/bin/next start \
    --hostname "$HOSTNAME" \
    --port "$PORT"
fi

test -f "$release/server.js"
test -f "$release/package.json"
test -d "$release/.next/static"
test -d "$release/public"
cd "$release"
exec "$NODE_BIN" server.js
