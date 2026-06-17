/**
 * termGuards.ts
 *
 * isExistingTerm / isExistingComparison / isExistingArchitecture:
 * term/comparison/architecture の存在チェックヘルパー。
 * QuestionPlayer や各ページで「存在しない ID へのリンク」を防ぐために使う。
 *
 * SSoT:
 * - terms: terms.ja.json 全件（locale 間で termId は共通 / 全件 published 扱い）
 * - comparisons: comparisons.ts の publishedComparisons（published: true のみ）
 * - architectures: architectures.ts の publishedArchitectures（published: true のみ）
 *
 * NOTE: このファイルは server component でのみ import すること。
 * "use client" なコンポーネントから直接 import すると
 * terms.ja.json(85KB) や comparisons/architectures のデータが client bundle に含まれる。
 * client component には server page 側で解決した真偽値を props 経由で渡す。
 */

import termsJaData from "../../contents/terms/terms.ja.json";
import { publishedComparisons } from "../contents/comparisons/comparisons";
import { publishedArchitectures } from "../contents/architectures/architectures";

type RawTerm = {
  termId: string;
  [key: string]: unknown;
};

const termIdSet: Set<string> = new Set(
  (termsJaData as RawTerm[]).map((t) => t.termId),
);

// SSoT: published フィルタ後の comparison slug 集合
const comparisonSlugSet: Set<string> = new Set(
  publishedComparisons.map((c) => c.slug),
);

// SSoT: published フィルタ後の architecture slug 集合
const architectureSlugSet: Set<string> = new Set(
  publishedArchitectures.map((a) => a.slug),
);

/**
 * termId が terms.ja.json に存在するか判定する。
 * termId は locale 間で共通のため ja で代表する。
 * 存在しない termId へのリンクは 404 になるため、呼び出し元で
 * 「準備中」チップとリンクを切り替えるために使う。
 */
export function isExistingTerm(termId: string): boolean {
  return termIdSet.has(termId);
}

/**
 * slug が publishedComparisons（published: true のみ）に存在するか判定する。
 * 存在しない / 未公開 comparison slug へのリンクは 404 になるため、同様に使う。
 */
export function isExistingComparison(slug: string): boolean {
  return comparisonSlugSet.has(slug);
}

/**
 * slug が publishedArchitectures（published: true のみ）に存在するか判定する。
 * 存在しない / 未公開 architecture slug へのリンクは 404 になるため、同様に使う。
 */
export function isExistingArchitecture(slug: string): boolean {
  return architectureSlugSet.has(slug);
}
