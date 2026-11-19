import type { ArticleCandidate } from "../../types";
import { beforeIssue348Batch4Corrections } from "./architecture-dates-before-issue-348-batch4";

// Before the November 19 batch, these two articles each had the June 21
// registry date and no correction entries in all three translations.
export function beforeIssue348Batch3Corrections(articles: ArticleCandidate[]): ArticleCandidate[] {
  const historical = beforeIssue348Batch4Corrections(articles);
  for (const article of historical) {
    if (article.kind !== "architecture" || !["arc-001", "arc-002"].includes(article.id)) continue;
    for (const locale of ["ja", "en", "zh"] as const) {
      const translation = article.translations[locale];
      if (!translation) continue;
      translation.updatedAt = "2026-06-21";
      translation.correctionNotes = { entries: [], errors: [] };
    }
  }
  return historical;
}
