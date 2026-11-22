import type { ArticleCandidate } from "../../types";

const recordedDates = new Map([
  ["blog-009", "2026-08-20"],
  ["blog-010", "2026-08-02"],
]);

/** Restore the two blog entries as they existed at November 12–18 test dates. */
export function beforeIssue365Corrections(articles: ArticleCandidate[]): ArticleCandidate[] {
  const historical = structuredClone(articles);
  for (const article of historical) {
    const updatedAt = article.kind === "blog" ? recordedDates.get(article.id) : undefined;
    if (!updatedAt) continue;
    for (const locale of ["en", "ja", "zh"] as const) {
      const translation = article.translations[locale];
      if (!translation) continue;
      translation.updatedAt = updatedAt;
      translation.correctionNotes = { entries: [], errors: [] };
    }
  }
  return historical;
}
