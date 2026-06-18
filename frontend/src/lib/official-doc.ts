/**
 * officialDocs の URL 検証ヘルパー（SSoT）。
 *
 * JSON 由来の url: string が `<a href={...}>` に流れる前に scheme / allowlist を検証する。
 * QuestionPlayer.tsx / terms/[termId]/page.tsx の両箇所から共有して参照する。
 *
 * allowlist 設計方針:
 *   - https: スキームのみ許可（javascript: / data: / vbscript: 等を禁止）
 *   - AWS 公式ドメイン 2 種のみ許可（Step3 バッチで追加が必要なら本ファイルのみ更新する）
 */
import type { OfficialDoc } from "@/types/official-doc";

const ALLOWED_PREFIXES = [
  "https://aws.amazon.com/",
  "https://docs.aws.amazon.com/",
] as const;

/**
 * url が allowlist に含まれる場合 true を返す。
 * URL parse 失敗 / allowlist 外ドメイン / https: 以外のスキームはすべて false。
 */
export function isValidOfficialDocUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_PREFIXES.some((prefix) => url.startsWith(prefix));
  } catch {
    return false;
  }
}

/**
 * officialDocs 配列を受け取り、allowlist を通過した項目のみ返す。
 * undefined / 空配列の場合は空配列を返す。
 */
export function filterValidOfficialDocs(
  docs: OfficialDoc[] | undefined,
): OfficialDoc[] {
  if (!docs || docs.length === 0) return [];
  return docs.filter((doc) => isValidOfficialDocUrl(doc.url));
}
