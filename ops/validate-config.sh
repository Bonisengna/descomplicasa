#!/usr/bin/env bash
set -euo pipefail

required=(TS_OAUTH_CLIENT_ID TS_AUDIENCE DEPLOY_HOST DEPLOY_USER APP_ROOT)

for name in "${required[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    printf 'Missing required repository variable: %s\n' "$name" >&2
    exit 1
  fi
done

[[ "$DEPLOY_HOST" =~ ^[A-Za-z0-9._:-]+$ ]] || { echo "DEPLOY_HOST contains unsupported characters" >&2; exit 1; }
[[ "$DEPLOY_USER" =~ ^[A-Za-z_][A-Za-z0-9_-]*$ ]] || { echo "DEPLOY_USER contains unsupported characters" >&2; exit 1; }
[[ "$APP_ROOT" =~ ^/[A-Za-z0-9._/-]+$ ]] || { echo "APP_ROOT must be a simple absolute path" >&2; exit 1; }
[[ "${APP_SERVICE:-descomplicaza}" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "APP_SERVICE contains unsupported characters" >&2; exit 1; }
[[ "${CANARY_PORT:-3100}" =~ ^[0-9]+$ ]] || { echo "CANARY_PORT must be numeric" >&2; exit 1; }
[[ "${APP_HEALTH_URL:-http://127.0.0.1:3000/api/health}" =~ ^http://127\.0\.0\.1:[0-9]+/[A-Za-z0-9._/-]+$ ]] || { echo "APP_HEALTH_URL must be a loopback HTTP URL" >&2; exit 1; }
[[ "${N8N_HEALTH_URL:-http://127.0.0.1:5678/healthz}" =~ ^http://127\.0\.0\.1:[0-9]+/[A-Za-z0-9._/-]+$ ]] || { echo "N8N_HEALTH_URL must be a loopback HTTP URL" >&2; exit 1; }

case "$APP_ROOT" in
  /|/bin|/boot|/dev|/etc|/home|/opt|/proc|/root|/run|/srv|/sys|/tmp|/usr|/var)
    echo "APP_ROOT is too broad" >&2
    exit 1
    ;;
esac
