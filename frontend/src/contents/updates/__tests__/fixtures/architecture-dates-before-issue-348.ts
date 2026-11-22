import { beforeIssue348Batch2Corrections } from "./architecture-dates-before-issue-348-batch2";
import { beforeIssue348Batch3Corrections } from "./architecture-dates-before-issue-348-batch3";
import type { ArticleCandidate } from "../../types";

/**
 * Preserve the Nov 12–14 announcement fixtures when Issue 348 changes these
 * articles on Nov 17. Historical assertions stay intact; current real content
 * is covered separately by architecture-diagram-coverage.test.tsx.
 */
export function beforeIssue348Corrections(articles: ArticleCandidate[]): ArticleCandidate[] {
  const historical = beforeIssue348Batch2Corrections(beforeIssue348Batch3Corrections(articles));
  for (const article of historical) {
    if (article.kind !== "architecture" || !["arc-004", "arc-005", "arc-010"].includes(article.id)) continue;
    for (const locale of ["ja", "en", "zh"] as const) {
      const translation = article.translations[locale];
      if (!translation) continue;
      translation.updatedAt = "2026-06-21";
      translation.correctionNotes = { entries: [], errors: [] };
    }
  }
  return historical;
}
