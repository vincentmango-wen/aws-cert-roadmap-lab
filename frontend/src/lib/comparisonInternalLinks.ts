/**
 * Pure functions resolving comparison MDX internal links for the displayed locale (P5-041). During
 * translation, MDX href values such as /terms/xxx remain the original Japanese paths (design section
 * 6-7: do not alter link URLs). MarkdownContent applies this helper at render time to localize
 * destinations while sharing content. Fall back to Japanese when the same-language destination is
 * unpublished to avoid 404s. Pure functions improve testability and permit server/client imports.
 */
import {
  isExistingArchitectureForLocale,
  isExistingComparisonForLocale,
  isExistingTerm,
} from "./termGuards";
import { createLocalizedPath } from "../i18n/locales";
import type { Locale } from "../i18n/locales";

export type ResolvedInternalLink = {
  /**
   * Final URL passed to Link href or a href.
   */
  href: string;
  /**
   * Whether the destination is external (http(s), mailto, tel or anchor). Callers may use true to select
   * an external-link treatment such as target=_blank.
   */
  isExternal: boolean;
  /**
   * Whether an internal destination exists in the displayed locale. False indicates a Japanese fallback
   * or an unknown internal href preserved unchanged.
   */
  available: boolean;
  /**
   * Whether a missing same-language page caused a Japanese fallback. Callers can use this for UI such as
   * a coming-soon chip.
   */
  fellBackToJa: boolean;
};

const TERMS_PREFIX = "/terms/";
const COMPARISONS_PREFIX = "/comparisons/";
const QUESTIONS_PREFIX = "/questions/";
const ARCHITECTURES_PREFIX = "/architectures/";

/**
 * Resolve a comparison MDX href for the locale.
 * - http(s), mailto, tel and anchors: treat as external and preserve href.
 * - /terms/{id}: localize IDs present in terms.ja.json (published in all locales); preserve unknown IDs,
 * retaining the existing Japanese 404 behavior. Invalid source links must be fixed in MDX.
 * - /comparisons/{slug}: localize published destinations; fall back to Japanese with fellBackToJa:true
 * for untranslated pages; preserve unknown slugs.
 * - /questions/...: use a Japanese fallback while localized routes remain pending under P5-040/separate
 * work.
 * - /architectures/{slug}: localize published destinations (all three locales added in P5-042), fall
 * back to Japanese when untranslated, and preserve unknown slugs.
 * - Other site routes such as /, /about and list pages: apply createLocalizedPath, assuming
 * corresponding en/zh routes exist.
 */
export function resolveInternalLink(
  locale: Locale,
  href: string,
): ResolvedInternalLink {
  if (!href) {
    return { href, isExternal: false, available: false, fellBackToJa: false };
  }

  // Preserve external URLs, anchors, mailto and tel links.
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return { href, isExternal: true, available: true, fellBackToJa: false };
  }

  // Treat unsupported relative and protocol-relative paths as external.
  if (!href.startsWith("/")) {
    return { href, isExternal: true, available: true, fellBackToJa: false };
  }

  // /terms/{id}
  if (href.startsWith(TERMS_PREFIX) && href.length > TERMS_PREFIX.length) {
    const termId = href.slice(TERMS_PREFIX.length).split(/[#?]/)[0];

    if (isExistingTerm(termId)) {
      return {
        href: createLocalizedPath(locale, href),
        isExternal: false,
        available: true,
        fellBackToJa: false,
      };
    }

    // Unknown term IDs also return 404 in Japanese, so preserve the original href.
    return { href, isExternal: false, available: false, fellBackToJa: false };
  }

  // /comparisons/{slug}
  if (
    href.startsWith(COMPARISONS_PREFIX) &&
    href.length > COMPARISONS_PREFIX.length
  ) {
    const slug = href.slice(COMPARISONS_PREFIX.length).split(/[#?]/)[0];

    if (isExistingComparisonForLocale(locale, slug)) {
      return {
        href: createLocalizedPath(locale, href),
        isExternal: false,
        available: true,
        fellBackToJa: false,
      };
    }

    // If Japanese exists but en/zh is unpublished, fall back to the Japanese path.
    // Unknown Japanese slugs remain unchanged (404); invalid source links must be fixed in MDX.
    return {
      href,
      isExternal: false,
      available: false,
      fellBackToJa: locale !== "ja",
    };
  }

  // Localized /questions/... routes are pending under P5-040/separate work,
  // so fall back to Japanese.
  if (href.startsWith(QUESTIONS_PREFIX) || href === "/questions") {
    if (locale === "ja") {
      return { href, isExternal: false, available: true, fellBackToJa: false };
    }
    return {
      href,
      isExternal: false,
      available: false,
      fellBackToJa: true,
    };
  }

  // /architectures/{slug}: P5-042 published all three locales.
  // Use /{locale}/architectures/{slug} when published in that locale; otherwise
  // fall back to Japanese with fellBackToJa:true to avoid 404s.
  if (
    href.startsWith(ARCHITECTURES_PREFIX) &&
    href.length > ARCHITECTURES_PREFIX.length
  ) {
    const slug = href.slice(ARCHITECTURES_PREFIX.length).split(/[#?]/)[0];

    if (isExistingArchitectureForLocale(locale, slug)) {
      return {
        href: createLocalizedPath(locale, href),
        isExternal: false,
        available: true,
        fellBackToJa: false,
      };
    }

    // If Japanese exists but en/zh is unpublished, fall back to the Japanese path.
    // Unknown Japanese slugs remain unchanged (404); invalid source links must be fixed in MDX.
    return {
      href,
      isExternal: false,
      available: false,
      fellBackToJa: locale !== "ja",
    };
  }

  // The /architectures list (without a slug) exists in en/zh too,
  // so use createLocalizedPath for all three locales.
  if (href === "/architectures") {
    return {
      href: createLocalizedPath(locale, href),
      isExternal: false,
      available: true,
      fellBackToJa: false,
    };
  }

  // For other internal routes (/, /about, /contact, /privacy, /disclaimer,
  // /comparisons, /terms, etc.), assume corresponding en/zh routes exist
  // and apply createLocalizedPath.
  return {
    href: createLocalizedPath(locale, href),
    isExternal: false,
    available: true,
    fellBackToJa: false,
  };
}

/**
 * Convenience helper for MarkdownContent and other renderers: extract only the resolved URL for Link
 * href.
 */
export function resolveInternalHref(locale: Locale, href: string): string {
  return resolveInternalLink(locale, href).href;
}
