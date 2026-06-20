/**
 * formatSlugLabel
 *
 * 関連リンクの chip / バッジで表示する slug を、視認性の高い形式に整形する。
 * 例: "api-gateway" → "API / GATEWAY"
 *     "s3"          → "S3"
 *
 * SSoT: term 詳細ページの関連リンク chip、QuestionPlayer の関連チップで使用。
 * 過去 terms/[termId]/page.tsx にローカル定義していた formatSlugLabel を
 * 共有 util に切り出した（PR #251 由来）。
 */
export function formatSlugLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" / ");
}
