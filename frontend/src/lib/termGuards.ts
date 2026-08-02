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
 * locale 別 published セット (P5-033 → P5-034 → P5-042 で 3 言語化完了):
 * - comparisons は P5-034 で en/zh ページを追加済 (3 言語共通 slug)。
 * - architectures は P5-042 で en/zh ページを追加済 (3 言語共通 slug)。
 * - terms / comparisons / architectures の関連セクションは、同言語ページへ
 *   自動遷移する (= 同一言語内遷移を完了条件として担保)。
 *
 * NOTE: このファイルは server component でのみ import すること。
 * "use client" なコンポーネントから直接 import すると
 * terms.ja.json(85KB) や comparisons/architectures のデータが client bundle に含まれる。
 * client component には server page 側で解決した真偽値を props 経由で渡す。
 */

import termsJaData from "../../contents/terms/terms.ja.json";
import { publishedComparisons } from "../contents/comparisons/comparisons";
import { publishedArchitectures } from "../contents/architectures/architectures";
import type { Locale } from "../i18n/locales";

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

// locale 別 published セット (P5-033 / P5-034 で comparison 系を 3 言語公開化 /
// P5-042 で architectures 系も 3 言語公開化).
// comparisons は P5-034 で en/zh ページを追加し、11 slug すべてを 3 言語公開する。
// architectures は P5-042 で en/zh ページを追加し、10 slug すべてを 3 言語公開する。
// 内部リンク (terms の関連構成図セクション等) はこれにより同言語遷移が有効化される。
const comparisonSlugSetByLocale: Record<Locale, Set<string>> = {
  ja: comparisonSlugSet,
  en: comparisonSlugSet,
  zh: comparisonSlugSet,
};

const architectureSlugSetByLocale: Record<Locale, Set<string>> = {
  ja: architectureSlugSet,
  en: architectureSlugSet,
  zh: architectureSlugSet,
};

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

/**
 * locale 別の comparison 存在チェック (P5-033)。
 * en/zh では空セットを参照するため、必ず false を返す。
 * 将来 en/zh 配下に comparisons ページを追加したら自動的にリンク表示が復活する。
 */
export function isExistingComparisonForLocale(
  locale: Locale,
  slug: string,
): boolean {
  return comparisonSlugSetByLocale[locale].has(slug);
}

/**
 * locale 別の architecture 存在チェック (P5-033)。
 * en/zh では空セットを参照するため、必ず false を返す。
 * 将来 en/zh 配下に architectures ページを追加したら自動的にリンク表示が復活する。
 */
export function isExistingArchitectureForLocale(
  locale: Locale,
  slug: string,
): boolean {
  return architectureSlugSetByLocale[locale].has(slug);
}
