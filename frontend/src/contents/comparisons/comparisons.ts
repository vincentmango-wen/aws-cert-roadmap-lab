/**
 * Compatibility re-export after P5-034 moved the source of truth to
 * frontend/contents/comparisons/comparisons.ja.json. Reload Japanese JSON and export the same
 * publishedComparisons array to preserve @/contents/comparisons/comparisons imports. Older components
 * (termGuards, lists, internalLinks) use only the Japanese array. For localized data, use
 * getComparisons(locale) / getPublishedComparisons(locale) from
 * src/app/(site)/comparisons/comparison-detail-data.ts.
 */
import comparisonsJaData from "../../../contents/comparisons/comparisons.ja.json";
import type { Comparison } from "../../types/comparison";

export const comparisons: Comparison[] = comparisonsJaData as Comparison[];

export const publishedComparisons = comparisons.filter(
  (comparison) => comparison.published,
);
