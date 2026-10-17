#!/bin/sh
set -eu

: "${APP_ROOT:?APP_ROOT is required}"
: "${APP_SERVICE:=descomplicaza}"
: "${SV_BIN:=sv}"
: "${CURRENT_HEALTH_URL:=http://127.0.0.1:3000/}"
: "${N8N_HEALTH_URL:=http://127.0.0.1:5678/healthz}"

command -v curl >/dev/null
command -v node >/dev/null
command -v tar >/dev/null
command -v sha256sum >/dev/null
case "$SV_BIN" in
  */*) test -x "$SV_BIN" ;;
  *) command -v "$SV_BIN" >/dev/null ;;
esac

case "$APP_SERVICE" in
  n8n|*/n8n) echo "APP_SERVICE must not target n8n" >&2; exit 1 ;;
esac
test -d "$APP_ROOT"
test -L "$APP_ROOT/current"
test -f "$APP_ROOT/current/server.js"
"$SV_BIN" status "$APP_SERVICE" | grep '^run:' >/dev/null
curl --fail --silent --show-error --max-time 10 "$CURRENT_HEALTH_URL" >/dev/null
curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null

printf 'Preflight passed: application and n8n are healthy.\n'
