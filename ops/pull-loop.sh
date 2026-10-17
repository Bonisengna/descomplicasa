#!/bin/sh
set -eu

config_file=${DESCOMPLICAZA_ENV_FILE:-/etc/descomplicaza.env}
test -r "$config_file"

# This file is controlled by the server administrator, not by a release.
. "$config_file"

: "${APP_ROOT:?APP_ROOT is required}"
: "${APP_SERVICE:?APP_SERVICE is required}"
: "${SV_BIN:?SV_BIN is required}"
: "${CURRENT_HEALTH_URL:=http://127.0.0.1:3000/}"
: "${APP_HEALTH_URL:=http://127.0.0.1:3000/api/health}"
: "${N8N_HEALTH_URL:=http://127.0.0.1:5678/healthz}"
: "${CANARY_PORT:=3100}"
: "${GITHUB_REPOSITORY:=Bonisengna/descomplicasa}"
: "${DEPLOY_TOOL_DIR:=/usr/local/lib/descomplicaza-deploy}"
: "${START_SCRIPT:=/usr/local/bin/descomplicaza-start}"
: "${PULL_INTERVAL_SECONDS:=2592000}"

case "$PULL_INTERVAL_SECONDS" in
  *[!0-9]*|'') echo "PULL_INTERVAL_SECONDS must be numeric" >&2; exit 1 ;;
esac
test "$PULL_INTERVAL_SECONDS" -ge 60
test -x "$DEPLOY_TOOL_DIR/pull-release.sh"
test -x "$START_SCRIPT"

export APP_ROOT APP_SERVICE SV_BIN CURRENT_HEALTH_URL APP_HEALTH_URL
export N8N_HEALTH_URL CANARY_PORT GITHUB_REPOSITORY DEPLOY_TOOL_DIR START_SCRIPT

while :; do
  "$DEPLOY_TOOL_DIR/pull-release.sh" || echo "Release check failed; current version was preserved." >&2
  sleep "$PULL_INTERVAL_SECONDS"
done
