import { createAbsoluteUrl } from "@/lib/seo";
import { LOCALIZED_ROUTES_PUBLISHED } from "../release-gate";

export type Locale = "ja" | "en" | "zh";

export type HreflangCode = "ja" | "en" | "zh-Hant" | "x-default";

export type LocalizedPathname = `/${string}` | "/";

export type HreflangAlternates = Record<HreflangCode, string>;

const LOCALE_PREFIXES = {
  ja: "",
  en: "/en",
  zh: "/zh",
} as const satisfies Record<Locale, string>;

const HREFLANG_BY_LOCALE = {
  ja: "ja",
  en: "en",
  zh: "zh-Hant",
} as const satisfies Record<Locale, Exclude<HreflangCode, "x-default">>;

const X_DEFAULT_PATHNAME = "/" as const;

function normalizePathname(pathname: string): LocalizedPathname {
  const trimmedPathname = pathname.trim();

  if (trimmedPathname.length === 0 || trimmedPathname === "/") {
    return "/";
  }

  const pathnameWithLeadingSlash = trimmedPathname.startsWith("/")
    ? trimmedPathname
    : `/${trimmedPathname}`;

  return pathnameWithLeadingSlash.replace(/\/+$/, "") as LocalizedPathname;
}

function removeLocalePrefix(pathname: LocalizedPathname): LocalizedPathname {
  if (pathname === "/en" || pathname === "/zh") {
    return "/";
  }

  if (pathname.startsWith("/en/")) {
    return pathname.replace(/^\/en/, "") as LocalizedPathname;
  }

  if (pathname.startsWith("/zh/")) {
    return pathname.replace(/^\/zh/, "") as LocalizedPathname;
  }

  return pathname;
}

export function createBasePathname(pathname: string): LocalizedPathname {
  return removeLocalePrefix(normalizePathname(pathname));
}

export function createLocalizedPathname(locale: Locale, pathname: string): LocalizedPathname {
  const basePathname = createBasePathname(pathname);
  const localePrefix = LOCALE_PREFIXES[locale];

  if (locale === "ja") {
    return basePathname;
  }

  if (basePathname === "/") {
    return localePrefix as LocalizedPathname;
  }

  return `${localePrefix}${basePathname}` as LocalizedPathname;
}

/**
 * URL for x-default. Unused while sealed because createHreflangAlternates() returns an empty object;
 * retain the export to restore x-default on publication.
 */
export function createXDefaultUrl(): string {
  return createAbsoluteUrl(X_DEFAULT_PATHNAME);
}

/**
 * Generate ja/en/zh-Hant/x-default hreflang URLs for any path. The path-agnostic design supports terms,
 * comparisons, blog, architectures and question paths (/questions, /questions/clf, /questions/saa,
 * /questions/<questionId>) without extra code. For /questions/clf-001, ja and x-default point to that
 * path while en/zh-Hant use /en and /zh prefixes.
 *
 * Return an empty object while sealed (ACR-012 / #322). Hreflang is meaningful for multilingual
 * clusters; a Japanese-only ja/x-default pair duplicates canonical signals and triggers Search Console
 * warnings. All four entries return automatically on publication.
 */
export function createHreflangAlternates(pathname: string): Partial<HreflangAlternates> {
  if (!LOCALIZED_ROUTES_PUBLISHED) {
    return {};
  }

  return {
    [HREFLANG_BY_LOCALE.ja]: createAbsoluteUrl(createLocalizedPathname("ja", pathname)),
    [HREFLANG_BY_LOCALE.en]: createAbsoluteUrl(createLocalizedPathname("en", pathname)),
    [HREFLANG_BY_LOCALE.zh]: createAbsoluteUrl(createLocalizedPathname("zh", pathname)),
    "x-default": createAbsoluteUrl(createLocalizedPathname("ja", pathname)),
  };
}