#!/bin/sh
set -eu

: "${APP_ROOT:?APP_ROOT is required}"
: "${APP_SERVICE:=descomplicaza}"
: "${APP_HEALTH_URL:=http://127.0.0.1:3000/api/health}"
: "${N8N_HEALTH_URL:=http://127.0.0.1:5678/healthz}"
: "${CANARY_PORT:=3100}"
: "${ROLLBACK_RELEASE:=}"
: "${HEALTHCHECK_ATTEMPTS:=45}"

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

test "$APP_SERVICE" != "n8n"
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
test -f "$target/server.js"
revision=$(cat "$target/REVISION")

cleanup_canary() {
  if [ -n "${canary_pid:-}" ]; then
    kill "$canary_pid" 2>/dev/null || true
    wait "$canary_pid" 2>/dev/null || true
  fi
}
trap cleanup_canary EXIT INT TERM

(
  cd "$target"
  APP_REVISION="$revision" HOSTNAME=127.0.0.1 PORT="$CANARY_PORT" node server.js
) > "$target/rollback-canary.log" 2>&1 &
canary_pid=$!

attempt=0
while [ "$attempt" -lt "$HEALTHCHECK_ATTEMPTS" ]; do
  response=$(curl --fail --silent --show-error --max-time 5 "http://127.0.0.1:$CANARY_PORT/api/health" 2>/dev/null || true)
  if printf '%s' "$response" | grep -F "\"revision\":\"$revision\"" >/dev/null; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done
if [ "$attempt" -ge "$HEALTHCHECK_ATTEMPTS" ]; then
  echo "Rollback canary health check failed" >&2
  tail -n 80 "$target/rollback-canary.log" >&2 || true
  exit 1
fi
cleanup_canary
canary_pid=

replacement="$APP_ROOT/.current-rollback-$$"
ln -s "$target" "$replacement"
mv -Tf "$replacement" "$APP_ROOT/current"

if ! sv restart "$APP_SERVICE"; then
  failed="$APP_ROOT/.current-failed-rollback-$$"
  ln -s "$old_target" "$failed"
  mv -Tf "$failed" "$APP_ROOT/current"
  sv restart "$APP_SERVICE" || true
  exit 1
fi

attempt=0
while [ "$attempt" -lt "$HEALTHCHECK_ATTEMPTS" ]; do
  response=$(curl --fail --silent --show-error --max-time 5 "$APP_HEALTH_URL" 2>/dev/null || true)
  if printf '%s' "$response" | grep -F "\"revision\":\"$revision\"" >/dev/null; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done

if [ "$attempt" -ge "$HEALTHCHECK_ATTEMPTS" ] || ! curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null; then
  failed="$APP_ROOT/.current-failed-rollback-$$"
  ln -s "$old_target" "$failed"
  mv -Tf "$failed" "$APP_ROOT/current"
  sv restart "$APP_SERVICE" || true
  echo "Rollback health check failed; original release restored" >&2
  exit 1
fi

previous="$APP_ROOT/.previous-rollback-$$"
ln -s "$old_target" "$previous"
mv -Tf "$previous" "$APP_ROOT/previous"
printf 'Rollback completed: %s\n' "$revision"
