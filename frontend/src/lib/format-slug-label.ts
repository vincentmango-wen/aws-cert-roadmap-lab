/**
 * Format slugs for readable related-link chips/badges: api-gateway -> API / GATEWAY; s3 -> S3. Shared
 * source of truth for term-detail links and QuestionPlayer chips. Extracted from the local
 * formatSlugLabel in terms/[termId]/page.tsx (PR #251).
 */
export function formatSlugLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" / ");
}
