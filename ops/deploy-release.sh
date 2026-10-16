#!/bin/sh
set -eu

umask 077

archive=${1:?release archive is required}
checksum_file=${2:?checksum file is required}
release_id=${3:?release id is required}

: "${APP_ROOT:?APP_ROOT is required}"
: "${APP_SERVICE:=descomplicaza}"
: "${APP_HEALTH_URL:=http://127.0.0.1:3000/api/health}"
: "${N8N_HEALTH_URL:=http://127.0.0.1:5678/healthz}"
: "${CANARY_PORT:=3100}"
: "${KEEP_RELEASES:=5}"
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
case "$release_id" in
  *[!A-Za-z0-9._-]*|'') echo "Invalid release id" >&2; exit 1 ;;
esac
case "$CANARY_PORT" in
  *[!0-9]*|'') echo "Invalid canary port" >&2; exit 1 ;;
esac
case "$KEEP_RELEASES" in
  *[!0-9]*|'') echo "Invalid release retention" >&2; exit 1 ;;
esac
case "$HEALTHCHECK_ATTEMPTS" in
  *[!0-9]*|'') echo "Invalid health check attempts" >&2; exit 1 ;;
esac

test "$APP_SERVICE" != "n8n"
test "$CANARY_PORT" -ne 3000

releases_dir="$APP_ROOT/releases"
release_dir="$releases_dir/$release_id"
incoming_dir="$releases_dir/.incoming-$release_id"
current_link="$APP_ROOT/current"
previous_link="$APP_ROOT/previous"
expected_inbox="$APP_ROOT/incoming/$release_id"

case "$releases_dir" in
  /|/releases) echo "Unsafe releases directory" >&2; exit 1 ;;
esac
test "$(readlink -f "$(dirname "$archive")")" = "$(readlink -f "$expected_inbox")"

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

restore_previous() {
  old_target=$1
  old_previous=${2:-}
  if [ -n "$old_target" ] && [ -d "$old_target" ]; then
    replacement="$APP_ROOT/.current-rollback-$$"
    ln -s "$old_target" "$replacement"
    mv -Tf "$replacement" "$current_link"
    if [ -n "$old_previous" ] && [ -d "$old_previous" ]; then
      previous_replacement="$APP_ROOT/.previous-rollback-$$"
      ln -s "$old_previous" "$previous_replacement"
      mv -Tf "$previous_replacement" "$previous_link"
    else
      rm -f "$previous_link"
    fi
    sv restart "$APP_SERVICE" || true
    old_revision=$(cat "$old_target/REVISION" 2>/dev/null || true)
    if [ -n "$old_revision" ]; then
      if ! wait_for_revision "$APP_HEALTH_URL" "$old_revision" "$HEALTHCHECK_ATTEMPTS"; then
        echo "WARNING: previous release did not recover its health check" >&2
      fi
    fi
  fi
}

cleanup_canary() {
  if [ -n "${canary_pid:-}" ]; then
    kill "$canary_pid" 2>/dev/null || true
    wait "$canary_pid" 2>/dev/null || true
  fi
}
trap cleanup_canary EXIT INT TERM

sv status "$APP_SERVICE" | grep '^run:' >/dev/null
curl --fail --silent --show-error --max-time 10 "$APP_HEALTH_URL" >/dev/null
curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null
test -L "$current_link"

expected=$(awk 'NR == 1 { print $1 }' "$checksum_file")
actual=$(sha256sum "$archive" | awk '{ print $1 }')
test -n "$expected"
test "$actual" = "$expected"

mkdir -p "$releases_dir"
if [ -d "$release_dir" ]; then
  stored_checksum=$(cat "$release_dir/.artifact.sha256" 2>/dev/null || true)
  test "$stored_checksum" = "$actual"
  candidate_dir="$release_dir"
else
  if ! tar -tzf "$archive" | awk '
    /^\// { bad = 1 }
    {
      count = split($0, part, "/")
      for (index = 1; index <= count; index += 1) {
        if (part[index] == "..") bad = 1
      }
    }
    END { exit bad ? 1 : 0 }
  '; then
    echo "Release archive contains an unsafe path" >&2
    exit 1
  fi
  rm -rf "$incoming_dir"
  mkdir "$incoming_dir"
  tar -xzf "$archive" -C "$incoming_dir"
  printf '%s\n' "$release_id" > "$incoming_dir/REVISION"
  printf '%s\n' "$actual" > "$incoming_dir/.artifact.sha256"
  candidate_dir="$incoming_dir"
fi

test -f "$candidate_dir/server.js"
test -f "$candidate_dir/package.json"
test -d "$candidate_dir/.next/static"
test -d "$candidate_dir/public"
test "$(cat "$candidate_dir/REVISION")" = "$release_id"

(
  cd "$candidate_dir"
  APP_REVISION="$release_id" HOSTNAME=127.0.0.1 PORT="$CANARY_PORT" node server.js
) > "$candidate_dir/canary.log" 2>&1 &
canary_pid=$!

if ! wait_for_revision "http://127.0.0.1:$CANARY_PORT/api/health" "$release_id" "$HEALTHCHECK_ATTEMPTS"; then
  echo "Canary health check failed" >&2
  tail -n 80 "$candidate_dir/canary.log" >&2 || true
  exit 1
fi
cleanup_canary
canary_pid=

if [ "$candidate_dir" = "$incoming_dir" ]; then
  mv "$incoming_dir" "$release_dir"
fi

old_target=$(readlink -f "$current_link")
test -d "$old_target"
if [ "$old_target" = "$release_dir" ]; then
  wait_for_revision "$APP_HEALTH_URL" "$release_id" "$HEALTHCHECK_ATTEMPTS"
  curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null
  rm -rf "$expected_inbox"
  printf 'Release %s is already active and healthy.\n' "$release_id"
  exit 0
fi

old_previous=
if [ -L "$previous_link" ]; then
  old_previous=$(readlink -f "$previous_link")
fi
replacement="$APP_ROOT/.current-$release_id-$$"
ln -s "$release_dir" "$replacement"
mv -Tf "$replacement" "$current_link"

previous_replacement="$APP_ROOT/.previous-$release_id-$$"
ln -s "$old_target" "$previous_replacement"
mv -Tf "$previous_replacement" "$previous_link"

if ! sv restart "$APP_SERVICE"; then
  restore_previous "$old_target" "$old_previous"
  echo "Service restart failed; previous release restored" >&2
  exit 1
fi

if ! wait_for_revision "$APP_HEALTH_URL" "$release_id" "$HEALTHCHECK_ATTEMPTS"; then
  restore_previous "$old_target" "$old_previous"
  echo "Production health check failed; previous release restored" >&2
  exit 1
fi

if ! curl --fail --silent --show-error --max-time 10 "$N8N_HEALTH_URL" >/dev/null; then
  restore_previous "$old_target" "$old_previous"
  echo "n8n health check failed; previous application release restored" >&2
  exit 1
fi

current_target=$(readlink -f "$current_link")
previous_target=$(readlink -f "$previous_link")
kept=0
find "$releases_dir" -mindepth 1 -maxdepth 1 -type d ! -name '.incoming-*' -printf '%T@ %p\n' \
  | sort -nr \
  | while IFS=' ' read -r _ directory; do
      kept=$((kept + 1))
      if [ "$kept" -le "$KEEP_RELEASES" ] || [ "$directory" = "$current_target" ] || [ "$directory" = "$previous_target" ]; then
        continue
      fi
      case "$directory" in
        "$releases_dir"/*) rm -rf "$directory" ;;
        *) echo "Refusing to remove unsafe path: $directory" >&2; exit 1 ;;
      esac
    done

rm -rf "$expected_inbox"
printf 'Release %s is healthy; n8n remained healthy.\n' "$release_id"
