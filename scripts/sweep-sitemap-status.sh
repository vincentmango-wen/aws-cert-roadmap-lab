#!/usr/bin/env bash
# Request every production sitemap.xml URL and list HTTP statuses; non-200 responses indicate reachability problems.
# Usage: bash scripts/sweep-sitemap-status.sh            # Check the production sitemap
#        bash scripts/sweep-sitemap-status.sh <URL>      # Check another sitemap
# Run in a network-enabled environment, such as the operator's computer, before CI or review resubmission.
set -u
SITEMAP="${1:-https://www.aws-cert-roadmap-lab.com/sitemap.xml}"
UA="Mozilla/5.0 (compatible; reachability-sweep/1.0)"
curl_with_dns() {
  if [ -n "${CURL_DOH_URL:-}" ]; then
    curl --doh-url "$CURL_DOH_URL" "$@"
  else
    curl "$@"
  fi
}
URLS=()
while IFS= read -r url; do
  URLS+=("$url")
done < <(
  curl_with_dns -sS --http1.1 --max-time 30 -A "$UA" "$SITEMAP" \
  | grep -o '<loc>[^<]*</loc>' \
  | sed -e 's#<loc>##' -e 's#</loc>##'
)
if [ "${#URLS[@]}" -eq 0 ]; then
  echo "ERROR: Could not extract URLs from sitemap: $SITEMAP" >&2; exit 1
fi
echo "sitemap: $SITEMAP"; echo "total urls: ${#URLS[@]}"; echo "----------------------------------------"
tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT
for url in "${URLS[@]}"; do
  code="$(curl_with_dns -s --http1.1 -o /dev/null -w '%{http_code}' --max-time 20 -A "$UA" "$url")"
  printf '%s  %s\n' "$code" "$url"; echo "$code" >> "$tmp"
done
echo "----------------------------------------"; echo "=== status summary ==="
sort "$tmp" | uniq -c | sort -rn
non200="$(grep -cv '^200$' "$tmp" || true)"
echo "non-200 count: $non200"
[ "$non200" -eq 0 ] && exit 0 || exit 2
