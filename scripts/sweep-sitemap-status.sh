#!/usr/bin/env bash
# 本番 sitemap.xml の全URLを叩き HTTP ステータスを列挙。non-200 が到達性の問題箇所。
# 使い方: bash scripts/sweep-sitemap-status.sh            # 本番 sitemap を検証
#         bash scripts/sweep-sitemap-status.sh <URL>      # 別 sitemap を検証
# ネット疎通する環境（ふみさんのマシン等）で実行すること。CI 前・再審査前の到達性ゲート。
set -u
SITEMAP="${1:-https://www.aws-cert-roadmap-lab.com/sitemap.xml}"
UA="Mozilla/5.0 (compatible; reachability-sweep/1.0)"
mapfile -t URLS < <(
  curl -sS --max-time 30 -A "$UA" "$SITEMAP" \
  | grep -o '<loc>[^<]*</loc>' \
  | sed -e 's#<loc>##' -e 's#</loc>##'
)
if [ "${#URLS[@]}" -eq 0 ]; then
  echo "ERROR: sitemap から URL を抽出できません: $SITEMAP" >&2; exit 1
fi
echo "sitemap: $SITEMAP"; echo "total urls: ${#URLS[@]}"; echo "----------------------------------------"
tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT
for url in "${URLS[@]}"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 -A "$UA" "$url")"
  printf '%s  %s\n' "$code" "$url"; echo "$code" >> "$tmp"
done
echo "----------------------------------------"; echo "=== status summary ==="
sort "$tmp" | uniq -c | sort -rn
non200="$(grep -cv '^200$' "$tmp" || true)"
echo "non-200 count: $non200"
[ "$non200" -eq 0 ] && exit 0 || exit 2
