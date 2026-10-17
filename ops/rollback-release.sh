#!/bin/sh
set -eu

: "${APP_ROOT:?APP_ROOT is required}"
: "${APP_SERVICE:=descomplicaza}"
: "${SV_BIN:=sv}"
: "${CURRENT_HEALTH_URL:=http://127.0.0.1:3000/}"
: "${APP_HEALTH_URL:=http://127.0.0.1:3000/api/health}"
: "${N8N_HEALTH_URL:=http://127.0.0.1:5678/healthz}"
: "${CANARY_PORT:=3100}"
: "${ROLLBACK_RELEASE:=}"
: "${HEALTHCHECK_ATTEMPTS:=45}"
script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
: "${START_SCRIPT:=$script_dir/start-release.sh}"

case "$APP_ROOT" in
  /*) ;;
  *) echo "APP_ROOT must be absolute" >&2; exit 1 ;;
esac
case "$APP_ROOT" in
  /|/bin|/boot|/dev|/etc|/home|/opt|/proc|/root|/run|/srv|/sys|/tmp|/usr|/var)
    echo "APP_ROOT is too broad" >&2
    exit 1
    ;;
esac

case "$APP_SERVICE" in
  n8n|*/n8n) echo "APP_SERVICE must not target n8n" >&2; exit 1 ;;
esac
case "$SV_BIN" in
  */*) test -x "$SV_BIN" ;;
  *) command -v "$SV_BIN" >/dev/null ;;
esac
test -x "$START_SCRIPT"
case "$CANARY_PORT" in
  *[!0-9]*|'') echo "Invalid canary port" >&2; exit 1 ;;
esac
case "$HEALTHCHECK_ATTEMPTS" in
  *[!0-9]*|'') echo "Invalid health check attempts" >&2; exit 1 ;;
esac
test "$CANARY_PORT" -ne 3000
test -L "$APP_ROOT/current"
curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null

old_target=$(readlink -f "$APP_ROOT/current")
if [ -n "$ROLLBACK_RELEASE" ]; then
  case "$ROLLBACK_RELEASE" in
    *[!A-Za-z0-9._-]*) echo "Invalid rollback release" >&2; exit 1 ;;
  esac
  target="$APP_ROOT/releases/$ROLLBACK_RELEASE"
else
  test -L "$APP_ROOT/previous"
  target=$(readlink -f "$APP_ROOT/previous")
fi

test -d "$target"
if [ ! -f "$target/server.js" ] && [ ! -f "$target/.legacy-source" ]; then
  echo "Rollback target has neither server.js nor a legacy source marker" >&2
  exit 1
fi
test -f "$target/REVISION"
revision=$(cat "$target/REVISION")

wait_for_revision() {
  url=$1
  wanted=$2
  attempts=${3:-30}
  count=0
  while [ "$count" -lt "$attempts" ]; do
    response=$(curl --fail --silent --show-error --max-time 5 "$url" 2>/dev/null || true)
    if printf '%s' "$response" | grep -F "\"revision\":\"$wanted\"" >/dev/null; then
      return 0
    fi
    count=$((count + 1))
    sleep 1
  done
  return 1
}

wait_for_http() {
  url=$1
  attempts=${2:-30}
  count=0
  while [ "$count" -lt "$attempts" ]; do
    if curl --fail --silent --show-error --max-time 5 "$url" >/dev/null 2>&1; then
      return 0
    fi
    count=$((count + 1))
    sleep 1
  done
  return 1
}

restore_original() {
  failed="$APP_ROOT/.current-failed-rollback-$$"
  ln -s "$old_target" "$failed"
  mv -Tf "$failed" "$APP_ROOT/current"
  "$SV_BIN" restart "$APP_SERVICE" || true
  if [ -f "$old_target/.legacy-source" ]; then
    wait_for_http "$CURRENT_HEALTH_URL" "$HEALTHCHECK_ATTEMPTS" || true
  else
    old_revision=$(cat "$old_target/REVISION")
    wait_for_revision "$APP_HEALTH_URL" "$old_revision" "$HEALTHCHECK_ATTEMPTS" || true
  fi
}

cleanup_canary() {
  if [ -n "${canary_pid:-}" ]; then
    kill "$canary_pid" 2>/dev/null || true
    wait "$canary_pid" 2>/dev/null || true
  fi
}
trap cleanup_canary EXIT INT TERM

DESCOMPLICAZA_ENV_FILE=${DESCOMPLICAZA_ENV_FILE:-/etc/descomplicaza.env} \
RELEASE_DIR="$target" START_HOSTNAME=127.0.0.1 START_PORT="$CANARY_PORT" \
  "$START_SCRIPT" > "$target/rollback-canary.log" 2>&1 &
canary_pid=$!

if [ -f "$target/.legacy-source" ]; then
  canary_ok=false
  if wait_for_http "http://127.0.0.1:$CANARY_PORT/" "$HEALTHCHECK_ATTEMPTS"; then
    canary_ok=true
  fi
else
  canary_ok=false
  if wait_for_revision "http://127.0.0.1:$CANARY_PORT/api/health" "$revision" "$HEALTHCHECK_ATTEMPTS"; then
    canary_ok=true
  fi
fi
if [ "$canary_ok" != true ]; then
  echo "Rollback canary health check failed" >&2
  tail -n 80 "$target/rollback-canary.log" >&2 || true
  exit 1
fi
cleanup_canary
canary_pid=

replacement="$APP_ROOT/.current-rollback-$$"
ln -s "$target" "$replacement"
mv -Tf "$replacement" "$APP_ROOT/current"

if ! "$SV_BIN" restart "$APP_SERVICE"; then
  restore_original
  exit 1
fi

if [ -f "$target/.legacy-source" ]; then
  production_ok=false
  if wait_for_http "$CURRENT_HEALTH_URL" "$HEALTHCHECK_ATTEMPTS"; then
    production_ok=true
  fi
else
  production_ok=false
  if wait_for_revision "$APP_HEALTH_URL" "$revision" "$HEALTHCHECK_ATTEMPTS"; then
    production_ok=true
  fi
fi

if [ "$production_ok" != true ] || ! curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null; then
  restore_original
  echo "Rollback health check failed; original release restored" >&2
  exit 1
fi

previous="$APP_ROOT/.previous-rollback-$$"
ln -s "$old_target" "$previous"
mv -Tf "$previous" "$APP_ROOT/previous"
printf 'Rollback completed: %s\n' "$revision"
