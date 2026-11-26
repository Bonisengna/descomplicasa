#!/data/data/com.termux/files/usr/bin/sh
set -eu
umask 077

host=${1:?Use the private Tailscale IP of the phone}
prefix=/data/data/com.termux/files/usr
services=$prefix/var/service
signal_service=$services/descomplicaza-signal
old_service=$services/descomplicaza-pull
log_dir=$prefix/var/log/descomplicaza-signal
sv_bin=$prefix/bin/sv
tool_dir=/usr/local/lib/descomplicaza-deploy

case "$host" in
  100.*) case "$host" in *[!0-9.]* ) exit 2 ;; esac ;;
  *) echo 'Expected a private Tailscale address.' >&2; exit 2 ;;
esac
test -x "$sv_bin"
test -d "$services"
command -v proot-distro >/dev/null

stage=$(mktemp -d "$prefix/var/tmp/descomplicaza-signal.XXXXXX")
cleanup() {
  rm -f -- "$stage/deploy-signal.mjs" "$stage/service/run" "$stage/service/log/run"
  rmdir -- "$stage/service/log" "$stage/service" "$stage" 2>/dev/null || true
}
trap cleanup EXIT
if [ -n "${RECEIVER_BASE64:-}" ]; then
  printf '%s' "$RECEIVER_BASE64" | base64 -d > "$stage/deploy-signal.mjs"
else
  cp -- "$(dirname "$0")/deploy-signal.mjs" "$stage/deploy-signal.mjs"
fi

proot-distro login debian -- sh -s -- "$stage/deploy-signal.mjs" "$host" <<'DEBIAN'
set -eu
umask 077
tool_dir=/usr/local/lib/descomplicaza-deploy
test -x "$tool_dir/pull-release.sh"
test -r /etc/descomplicaza.env
/usr/local/bin/node -e '
  const [ip] = process.argv.slice(1);
  const [a,b] = ip.split(".").map(Number);
  if (require("node:net").isIP(ip) !== 4 || a !== 100 || b < 64 || b > 127) process.exit(2);
' "$2"
/usr/local/bin/node --check "$1"
receiver=$tool_dir/deploy-signal.mjs
token_file=$tool_dir/deploy-signal.token
if [ -e "$receiver" ]; then
  cmp -s -- "$1" "$receiver" || { echo 'Installed receiver differs, review before replacing.' >&2; exit 2; }
else
  install -m 700 "$1" "$receiver"
fi
if [ ! -e "$token_file" ]; then
  /usr/local/bin/node -e '
    require("node:fs").writeFileSync(process.argv[1], require("node:crypto").randomBytes(32).toString("hex") + "\n", { mode: 0o600, flag: "wx" });
  ' "$token_file"
fi
test -f "$token_file"
test ! -L "$token_file"
chmod 600 "$token_file"
DEBIAN

mkdir -p "$stage/service/log" "$log_dir"
printf '%s\n' '#!/data/data/com.termux/files/usr/bin/sh' 'exec 2>&1' \
  "exec proot-distro login debian -- /usr/local/bin/node $tool_dir/deploy-signal.mjs $host" > "$stage/service/run"
printf '%s\n' '#!/data/data/com.termux/files/usr/bin/sh' "exec $prefix/bin/svlogd -tt $log_dir" > "$stage/service/log/run"
chmod 700 "$stage/service/run" "$stage/service/log/run"
if [ -e "$signal_service" ]; then
  cmp -s "$stage/service/run" "$signal_service/run" || { echo 'Existing signal service differs.' >&2; exit 2; }
else
  mv -- "$stage/service" "$signal_service"
fi
"$sv_bin" -w 20 up "$signal_service"

attempt=0
while :; do
  code=$(curl --noproxy '*' --silent --output /dev/null --write-out '%{http_code}' --connect-timeout 2 --max-time 3 "http://$host:8787/health") || true
  [ "$code" = 401 ] && break
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 10 ]; then
    echo 'Private receiver did not return the expected authentication challenge.' >&2
    tail -n 12 "$log_dir/current" >&2 || true
    exit 2
  fi
  sleep 1
done
echo 'PRIVATE_RECEIVER_READY'

if [ -d "$old_service" ]; then
  proot-distro login debian -- sh -s -- "$sv_bin" "$old_service" <<'DEBIAN'
set -eu
umask 077
. /etc/descomplicaza.env
test "$APP_ROOT" = /srv/descomplicaza
lock=$APP_ROOT/.pull-release.lock
if ! mkdir "$lock"; then
  echo 'Release lock exists. Wait for the ongoing deploy and retry.' >&2
  exit 2
fi
trap 'rm -f -- "$lock/pid"; rmdir -- "$lock"' EXIT
printf '%s\n' "$$" > "$lock/pid"
"$1" -w 20 stop "$2"
install -m 600 /dev/null "$2/down"
echo 'PERIODIC_PULL_DISABLED'
DEBIAN
fi

if [ "${EXPORT_SIGNAL_TOKEN:-}" = 1 ] && [ ! -t 1 ]; then
  proot-distro login debian -- sh -c 'printf "DEPLOY_KEY="; cat /usr/local/lib/descomplicaza-deploy/deploy-signal.token'
fi
