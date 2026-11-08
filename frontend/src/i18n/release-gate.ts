import { defaultLocale, locales, type Locale } from "./locales";

/**
 * Publication flag for en/zh (introduced in #322; publication policy updated in #334).
 * false: remove en/zh URLs from the sitemap, add noindex to those pages and hide LanguageSwitcher.
 * true: publish ja/en/zh and enable LanguageSwitcher and localized sitemaps.
 *
 * Publication preconditions (#334):
 * 1. Regression-check the Footer localized in #319.
 * 2. Proofread Traditional Chinese wording on /zh/privacy.
 * 3. Generate /en/roadmap and /zh/roadmap from #305.
 * 4. Use createLocaleAwareRobots() on the six pages bypassing createPageMetadata (en/contact,
 * en/privacy, zh/contact, zh/privacy, zh/disclaimer and the zh homepage). Verify index/follow in
 * generated HTML when published.
 * 5. Use the sitemap as the hreflang source of truth, emitting self/reciprocal references and x-default
 * pointing to Japanese. Japanese-only routes emit only the Japanese URL and x-default.
 * 6. Check LanguageSwitcher on desktop and mobile. Duplicate HTML hreflang implementation and
 * openGraph.alternateLocale are not search-publication prerequisites.
 *
 * AdSense reapplication and crawl waiting periods are outside this release's conditions; #323 remains
 * CLOSED.
 *
 * Keep the explicit : boolean annotation. A bare = false narrows the type to the false literal, making
 * LOCALIZED_ROUTES_PUBLISHED branches appear unreachable and destabilizing lint/typecheck. Import
 * nothing except ./locales: Header.tsx uses use client, so node:fs or other server imports would break
 * its bundle.
 *
 * NOTE: scripts/verify-locale-seal.mjs reads this constant with
 * /LOCALIZED_ROUTES_PUBLISHED\s*:\s*boolean\s*=\s*(true|false)/. Renaming it causes build validation to
 * throw rather than silently disabling the check.
 */
export const LOCALIZED_ROUTES_PUBLISHED: boolean = true;

/**
 * Locales currently eligible for publication to Google; only ja while sealed.
 */
export const publishedLocales: readonly Locale[] = LOCALIZED_ROUTES_PUBLISHED
  ? locales
  : [defaultLocale];

export function isPublishedLocale(locale: Locale): boolean {
  return publishedLocales.includes(locale);
}

/**
 * Check whether a pathname is under a sealed locale prefix. Always match segment boundaries:
 * startsWith("/en") would also match Japanese paths such as /entertainment or /environment and
 * incorrectly noindex them.
 */
export function isSealedPathname(pathname: string): boolean {
  if (LOCALIZED_ROUTES_PUBLISHED) {
    return false;
  }

  return (
    pathname === "/en" ||
    pathname.startsWith("/en/") ||
    pathname === "/zh" ||
    pathname.startsWith("/zh/")
  );
}
