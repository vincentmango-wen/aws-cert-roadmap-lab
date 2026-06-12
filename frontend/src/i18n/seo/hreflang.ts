import { createAbsoluteUrl } from "@/lib/seo";

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

export function createXDefaultUrl(): string {
  return createAbsoluteUrl(X_DEFAULT_PATHNAME);
}

export function createHreflangAlternates(pathname: string): HreflangAlternates {
  return {
    [HREFLANG_BY_LOCALE.ja]: createAbsoluteUrl(createLocalizedPathname("ja", pathname)),
    [HREFLANG_BY_LOCALE.en]: createAbsoluteUrl(createLocalizedPathname("en", pathname)),
    [HREFLANG_BY_LOCALE.zh]: createAbsoluteUrl(createLocalizedPathname("zh", pathname)),
    "x-default": createAbsoluteUrl(createLocalizedPathname("ja", pathname)),
  };
}