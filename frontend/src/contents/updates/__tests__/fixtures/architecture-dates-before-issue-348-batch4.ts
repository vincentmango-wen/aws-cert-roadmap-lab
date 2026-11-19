import type { ArticleCandidate } from "../../types";

const batch4Ids = new Set(["arc-003", "arc-006", "arc-009"]);

/** Freeze the date and absent correction notes independently of current content. */
export function beforeIssue348Batch4Corrections(articles: ArticleCandidate[]): ArticleCandidate[] {
  const historical = structuredClone(articles);
  for (const article of historical) {
    if (article.kind !== "architecture" || !batch4Ids.has(article.id)) continue;
    for (const locale of ["ja", "en", "zh"] as const) {
      const translation = article.translations[locale];
      if (!translation) continue;
      translation.updatedAt = "2026-06-21";
      translation.correctionNotes = { entries: [], errors: [] };
    }
  }
  return historical;
}
