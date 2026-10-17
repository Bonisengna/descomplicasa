#!/bin/sh
set -eu

umask 077

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)

: "${APP_ROOT:?APP_ROOT is required}"
: "${APP_SERVICE:=descomplicaza}"
: "${APP_HEALTH_URL:=http://127.0.0.1:3000/api/health}"
: "${N8N_HEALTH_URL:=http://127.0.0.1:5678/healthz}"
: "${CANARY_PORT:=3100}"
: "${GITHUB_REPOSITORY:=Bonisengna/descomplicasa}"
: "${RELEASE_API_URL:=https://api.github.com/repos/$GITHUB_REPOSITORY/releases/latest}"
: "${DEPLOY_SCRIPT:=$script_dir/deploy-release.sh}"
: "${PREFLIGHT_SCRIPT:=$script_dir/remote-check.sh}"

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
case "$GITHUB_REPOSITORY" in
  *[!A-Za-z0-9._/-]*|/*|*/|*/*/*|'') echo "Invalid GitHub repository" >&2; exit 1 ;;
esac

test "$APP_SERVICE" != "n8n"
test -x "$DEPLOY_SCRIPT"
test -x "$PREFLIGHT_SCRIPT"
command -v curl >/dev/null
command -v node >/dev/null
command -v sha256sum >/dev/null

lock_dir="$APP_ROOT/.pull-release.lock"
if ! mkdir "$lock_dir" 2>/dev/null; then
  if [ -r "$lock_dir/pid" ]; then
    lock_pid=$(cat "$lock_dir/pid" 2>/dev/null || true)
    case "$lock_pid" in
      *[!0-9]*|'') ;;
      *)
        if kill -0 "$lock_pid" 2>/dev/null; then
          printf 'Another release check is already running.\n'
          exit 0
        fi
        ;;
    esac
  fi
  rm -f "$lock_dir/pid"
  rmdir "$lock_dir" 2>/dev/null || {
    echo "Cannot recover stale release lock: $lock_dir" >&2
    exit 1
  }
  mkdir "$lock_dir"
fi
printf '%s\n' "$$" > "$lock_dir/pid"

work_dir=$(mktemp -d "$APP_ROOT/.pull-release.XXXXXX")
cleanup() {
  if [ -n "$work_dir" ]; then
    case "$work_dir" in
      "$APP_ROOT"/.pull-release.*) rm -rf "$work_dir" ;;
    esac
  fi
  rm -f "$lock_dir/pid"
  rmdir "$lock_dir" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

APP_ROOT="$APP_ROOT" \
APP_SERVICE="$APP_SERVICE" \
APP_HEALTH_URL="$APP_HEALTH_URL" \
N8N_HEALTH_URL="$N8N_HEALTH_URL" \
"$PREFLIGHT_SCRIPT"

curl --proto '=https' --tlsv1.2 --fail --location --silent --show-error \
  --retry 3 --retry-delay 2 --connect-timeout 15 --max-time 60 \
  --header 'Accept: application/vnd.github+json' \
  --header 'X-GitHub-Api-Version: 2022-11-28' \
  --user-agent 'descomplicaza-pull-deployer/1' \
  --output "$work_dir/release.json" \
  "$RELEASE_API_URL"

node "$script_dir/parse-release.mjs" "$work_dir/release.json" "$GITHUB_REPOSITORY" > "$work_dir/release.txt"
test "$(wc -l < "$work_dir/release.txt")" -eq 3
release_id=$(sed -n '1p' "$work_dir/release.txt")
archive_url=$(sed -n '2p' "$work_dir/release.txt")
checksum_url=$(sed -n '3p' "$work_dir/release.txt")

case "$release_id" in
  *[!0-9a-f]*|'') echo "Invalid release revision" >&2; exit 1 ;;
esac
test "${#release_id}" -eq 40

if [ -f "$APP_ROOT/current/REVISION" ] && [ "$(cat "$APP_ROOT/current/REVISION")" = "$release_id" ]; then
  printf 'Release %s is already active and healthy.\n' "$release_id"
  exit 0
fi

curl --proto '=https' --tlsv1.2 --fail --location --silent --show-error \
  --retry 3 --retry-delay 2 --connect-timeout 15 --max-time 300 \
  --output "$work_dir/descomplicaza.tar.gz" \
  "$archive_url"
curl --proto '=https' --tlsv1.2 --fail --location --silent --show-error \
  --retry 3 --retry-delay 2 --connect-timeout 15 --max-time 60 \
  --output "$work_dir/descomplicaza.tar.gz.sha256" \
  "$checksum_url"

expected=$(awk 'NR == 1 { print $1 }' "$work_dir/descomplicaza.tar.gz.sha256")
actual=$(sha256sum "$work_dir/descomplicaza.tar.gz" | awk '{ print $1 }')
case "$expected" in
  *[!0-9a-f]*|'') echo "Invalid release checksum" >&2; exit 1 ;;
esac
test "${#expected}" -eq 64
if [ "$actual" != "$expected" ]; then
  echo "Downloaded release checksum does not match" >&2
  exit 1
fi

inbox="$APP_ROOT/incoming/$release_id"
case "$inbox" in
  "$APP_ROOT"/incoming/*) ;;
  *) echo "Unsafe incoming release path" >&2; exit 1 ;;
esac
mkdir -p "$APP_ROOT/incoming"
rm -rf "$inbox"
mv "$work_dir" "$inbox"
work_dir=

APP_ROOT="$APP_ROOT" \
APP_SERVICE="$APP_SERVICE" \
APP_HEALTH_URL="$APP_HEALTH_URL" \
N8N_HEALTH_URL="$N8N_HEALTH_URL" \
CANARY_PORT="$CANARY_PORT" \
"$DEPLOY_SCRIPT" \
  "$inbox/descomplicaza.tar.gz" \
  "$inbox/descomplicaza.tar.gz.sha256" \
  "$release_id"
