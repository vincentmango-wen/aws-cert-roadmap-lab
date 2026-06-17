/**
 * termGuards.ts
 *
 * isExistingTerm / isExistingComparison: term/comparison の存在チェックヘルパー。
 * QuestionPlayer や各一覧ページで「存在しない ID へのリンク」を防ぐために使う。
 * terms.json（masterブランチ）の termId 集合と comparisons.ts の slug 集合を
 * Set で保持し O(1) で判定する。
 */

import termsData from "../../contents/terms/terms.json";
import { comparisons } from "../contents/comparisons/comparisons";

type RawTerm = {
  termId: string;
  [key: string]: unknown;
};

const termIdSet: Set<string> = new Set(
  (termsData as RawTerm[]).map((t) => t.termId),
);

const comparisonSlugSet: Set<string> = new Set(
  comparisons.map((c) => c.slug),
);

/**
 * termId が terms.json に存在するか判定する。
 * 存在しない termId へのリンクは 404 になるため、呼び出し元で
 * 「準備中」チップとリンクを切り替えるために使う。
 */
export function isExistingTerm(termId: string): boolean {
  return termIdSet.has(termId);
}

/**
 * slug が comparisons に存在するか判定する。
 * 存在しない comparison slug へのリンクは 404 になるため、同様に使う。
 */
export function isExistingComparison(slug: string): boolean {
  return comparisonSlugSet.has(slug);
}
