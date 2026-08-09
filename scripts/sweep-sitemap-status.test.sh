#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEST_DIRECTORY="$(mktemp -d)"
trap 'rm -rf "$TEST_DIRECTORY"' EXIT
CURL_LOG="$TEST_DIRECTORY/curl.log"
DOH_URL="https://cloudflare-dns.com/dns-query"

PATH="$REPOSITORY_ROOT/scripts/test-fixtures:$PATH" \
SWEEP_CURL_LOG="$CURL_LOG" \
CURL_DOH_URL="$DOH_URL" \
bash "$REPOSITORY_ROOT/scripts/sweep-sitemap-status.sh" >/dev/null

DOH_ARGUMENT_COUNT="$( (grep -o -- '--doh-url' "$CURL_LOG" || true) | wc -l | tr -d ' ')"
DOH_URL_COUNT="$( (grep -oF -- "$DOH_URL" "$CURL_LOG" || true) | wc -l | tr -d ' ')"
if [ "$DOH_ARGUMENT_COUNT" -ne 2 ] || [ "$DOH_URL_COUNT" -ne 2 ]; then
  printf 'FAIL: --doh-url が全curl呼び出しへ渡されていません\n' >&2
  sed -n '1,20p' "$CURL_LOG" >&2
  exit 1
fi

printf 'PASS: CURL_DOH_URL が全curl呼び出しへ渡されました\n'
