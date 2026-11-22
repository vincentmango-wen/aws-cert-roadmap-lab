/**
 * Existence helpers for terms, comparisons and architectures, preventing QuestionPlayer and pages from
 * linking to nonexistent IDs. Sources of truth: all terms.ja.json IDs (shared across locales and treated
 * as published), publishedComparisons and publishedArchitectures (published:true only).
 *
 * Localized published sets were added through P5-033/P5-034/P5-042. Comparisons gained en/zh in P5-034;
 * architectures gained them in P5-042, using common slugs. Related sections navigate to same-language
 * pages.
 *
 * Import only from server components. Direct use-client imports would include terms.ja.json (85KB) and
 * comparison/architecture data in the client bundle. Resolve existence on the server and pass booleans
 * to client components via props.
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

// Source of truth: comparison slugs after filtering to published entries.
const comparisonSlugSet: Set<string> = new Set(
  publishedComparisons.map((c) => c.slug),
);

// Source of truth: architecture slugs after filtering to published entries.
const architectureSlugSet: Set<string> = new Set(
  publishedArchitectures.map((a) => a.slug),
);

// Localized published sets: comparisons gained three-language support in P5-033/P5-034;
// architectures followed in P5-042.
// P5-034 added en/zh comparison pages, publishing all 11 slugs in three locales.
// P5-042 added en/zh architecture pages, publishing all 10 slugs in three locales.
// These sets enable same-language internal navigation, including related architecture links on term pages.
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
 * Check termId against terms.ja.json; IDs are shared across locales, so Japanese represents all of them.
 * Callers can choose a coming-soon chip instead of a link to a nonexistent term that would return 404.
 */
export function isExistingTerm(termId: string): boolean {
  return termIdSet.has(termId);
}

/**
 * Check whether a slug exists in publishedComparisons (published:true only), avoiding links to missing
 * or unpublished comparisons that return 404.
 */
export function isExistingComparison(slug: string): boolean {
  return comparisonSlugSet.has(slug);
}

/**
 * Check whether a slug exists in publishedArchitectures (published:true only), avoiding links to missing
 * or unpublished architectures that return 404.
 */
export function isExistingArchitecture(slug: string): boolean {
  return architectureSlugSet.has(slug);
}

/**
 * Localized comparison existence check (P5-033). An empty localized published set returns false; adding
 * published en/zh pages automatically restores links.
 */
export function isExistingComparisonForLocale(
  locale: Locale,
  slug: string,
): boolean {
  return comparisonSlugSetByLocale[locale].has(slug);
}

/**
 * Localized architecture existence check (P5-033). An empty localized published set returns false;
 * adding published en/zh pages automatically restores links.
 */
export function isExistingArchitectureForLocale(
  locale: Locale,
  slug: string,
): boolean {
  return architectureSlugSetByLocale[locale].has(slug);
}
