#!/bin/sh
set -eu

: "${APP_ROOT:?APP_ROOT is required}"
: "${APP_SERVICE:=descomplicaza}"
: "${APP_HEALTH_URL:=http://127.0.0.1:3000/api/health}"
: "${N8N_HEALTH_URL:=http://127.0.0.1:5678/healthz}"

command -v curl >/dev/null
command -v node >/dev/null
command -v sv >/dev/null
command -v tar >/dev/null
command -v sha256sum >/dev/null

test "$APP_SERVICE" != "n8n"
test -d "$APP_ROOT"
test -L "$APP_ROOT/current"
test -f "$APP_ROOT/current/server.js"
sv status "$APP_SERVICE" | grep '^run:' >/dev/null
curl --fail --silent --show-error --max-time 10 "$APP_HEALTH_URL" >/dev/null
curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null

printf 'Preflight passed: application and n8n are healthy.\n'
