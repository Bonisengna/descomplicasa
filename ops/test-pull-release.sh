#!/bin/sh
set -eu

project_root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
test_root=$(mktemp -d)
app_root="$test_root/app"
fake_bin="$test_root/bin"
revision=0123456789abcdef0123456789abcdef01234567
archive_url="https://github.com/Bonisengna/descomplicasa/releases/download/deploy-$revision/descomplicaza.tar.gz"
checksum_url="$archive_url.sha256"

cleanup() {
  case "$test_root" in
    /tmp/*) rm -rf "$test_root" ;;
    *) echo "Refusing to clean unsafe test path: $test_root" >&2 ;;
  esac
}
trap cleanup EXIT INT TERM

mkdir -p "$app_root/incoming" "$fake_bin" "$test_root/fixtures"
printf 'verified release payload\n' > "$test_root/fixtures/descomplicaza.tar.gz"
(
  cd "$test_root/fixtures"
  sha256sum descomplicaza.tar.gz > descomplicaza.tar.gz.sha256
)
archive_size=$(wc -c < "$test_root/fixtures/descomplicaza.tar.gz")
checksum_size=$(wc -c < "$test_root/fixtures/descomplicaza.tar.gz.sha256")

cat > "$test_root/fixtures/release.json" <<EOF
{
  "draft": false,
  "prerelease": false,
  "tag_name": "deploy-$revision",
  "target_commitish": "$revision",
  "assets": [
    {
      "name": "descomplicaza.tar.gz",
      "state": "uploaded",
      "size": $archive_size,
      "browser_download_url": "$archive_url"
    },
    {
      "name": "descomplicaza.tar.gz.sha256",
      "state": "uploaded",
      "size": $checksum_size,
      "browser_download_url": "$checksum_url"
    }
  ]
}
EOF

cat > "$fake_bin/curl" <<'EOF'
#!/bin/sh
set -eu

output=
url=
while [ "$#" -gt 0 ]; do
  case "$1" in
    --output)
      output=$2
      shift 2
      ;;
    --header|--user-agent|--retry|--retry-delay|--connect-timeout|--max-time|--proto)
      shift 2
      ;;
    --tlsv1.2|--fail|--location|--silent|--show-error)
      shift
      ;;
    *)
      url=$1
      shift
      ;;
  esac
done

printf '%s\n' "$url" >> "$TEST_CURL_LOG"
case "$url" in
  https://api.github.test/latest) source_file="$TEST_FIXTURES/release.json" ;;
  */descomplicaza.tar.gz.sha256) source_file="$TEST_FIXTURES/descomplicaza.tar.gz.sha256" ;;
  */descomplicaza.tar.gz) source_file="$TEST_FIXTURES/descomplicaza.tar.gz" ;;
  *) echo "Unexpected test URL: $url" >&2; exit 1 ;;
esac
cp "$source_file" "$output"
EOF

cat > "$test_root/preflight.sh" <<'EOF'
#!/bin/sh
set -eu
test "$APP_SERVICE" = descomplicaza
test -d "$APP_ROOT"
EOF

cat > "$test_root/deploy.sh" <<'EOF'
#!/bin/sh
set -eu
archive=${1:?}
checksum=${2:?}
revision=${3:?}
test "$(sha256sum "$archive" | awk '{ print $1 }')" = "$(awk 'NR == 1 { print $1 }' "$checksum")"
printf '%s\n' "$revision" >> "$TEST_DEPLOY_LOG"
EOF

chmod 700 "$fake_bin/curl" "$test_root/preflight.sh" "$test_root/deploy.sh"

export PATH="$fake_bin:$PATH"
export APP_ROOT="$app_root"
export APP_SERVICE=descomplicaza
export GITHUB_REPOSITORY=Bonisengna/descomplicasa
export RELEASE_API_URL=https://api.github.test/latest
export PREFLIGHT_SCRIPT="$test_root/preflight.sh"
export DEPLOY_SCRIPT="$test_root/deploy.sh"
export TEST_FIXTURES="$test_root/fixtures"
export TEST_CURL_LOG="$test_root/curl.log"
export TEST_DEPLOY_LOG="$test_root/deploy.log"

"$project_root/ops/pull-release.sh"
test "$(cat "$TEST_DEPLOY_LOG")" = "$revision"
test -f "$app_root/incoming/$revision/descomplicaza.tar.gz"

mkdir -p "$app_root/releases/$revision"
printf '%s\n' "$revision" > "$app_root/releases/$revision/REVISION"
ln -s "$app_root/releases/$revision" "$app_root/current"
"$project_root/ops/pull-release.sh"
test "$(wc -l < "$TEST_DEPLOY_LOG")" -eq 1

printf '%064d  descomplicaza.tar.gz\n' 0 > "$test_root/fixtures/descomplicaza.tar.gz.sha256"
rm -rf "$app_root/current"
if "$project_root/ops/pull-release.sh"; then
  echo "A release with an invalid checksum unexpectedly reached deployment" >&2
  exit 1
fi
test "$(wc -l < "$TEST_DEPLOY_LOG")" -eq 1

sed "s/\"target_commitish\": \"$revision\"/\"target_commitish\": \"ffffffffffffffffffffffffffffffffffffffff\"/" \
  "$test_root/fixtures/release.json" > "$test_root/fixtures/invalid-release.json"
if node "$project_root/ops/parse-release.mjs" "$test_root/fixtures/invalid-release.json" "$GITHUB_REPOSITORY" >/dev/null 2>&1; then
  echo "Mismatched release metadata unexpectedly passed validation" >&2
  exit 1
fi

if APP_SERVICE="$test_root/service/n8n" "$project_root/ops/pull-release.sh" >/dev/null 2>&1; then
  echo "The pull deployer unexpectedly accepted the n8n service" >&2
  exit 1
fi

printf 'Pull release tests passed.\n'
