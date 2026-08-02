/**
 * comparisons.ts (compat re-export)
 *
 * P5-034 で SSoT を `frontend/contents/comparisons/comparisons.ja.json` に移行した後の互換層。
 * 既存の `@/contents/comparisons/comparisons` import を維持するために、ja JSON を読み直して
 * 同じ `publishedComparisons` 配列を export する。
 *
 * - 多言語化前のコンポーネント (termGuards / 一覧 / internalLinks 等) は ja 配列のみで動作する
 * - locale 別データが必要な場合は `src/app/(site)/comparisons/comparison-detail-data.ts` の
 *   `getComparisons(locale)` / `getPublishedComparisons(locale)` を使う
 */
import comparisonsJaData from "../../../contents/comparisons/comparisons.ja.json";
import type { Comparison } from "../../types/comparison";

export const comparisons: Comparison[] = comparisonsJaData as Comparison[];

export const publishedComparisons = comparisons.filter(
  (comparison) => comparison.published,
);
