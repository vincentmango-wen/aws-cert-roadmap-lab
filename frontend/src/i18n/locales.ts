export const locales = ["ja", "en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = "ja" satisfies Locale;

export const prefixedLocales = ["en", "zh"] as const satisfies readonly Locale[];

export type PrefixedLocale = (typeof prefixedLocales)[number];

export type Pathname = "/" | `/${string}`;

export type LocalePrefix = "" | `/${PrefixedLocale}`;

export type HtmlLang = "ja" | "en" | "zh-Hant";

export type OgLocale = "ja_JP" | "en_US" | "zh_TW";

export type TextDirection = "ltr" | "rtl";

export type LocaleConfig = {
  locale: Locale;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  urlPrefix: LocalePrefix;
  htmlLang: HtmlLang;
  ogLocale: OgLocale;
  textDirection: TextDirection;
};

export const localeConfigs = {
  ja: {
    locale: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    shortLabel: "JA",
    urlPrefix: "",
    htmlLang: "ja",
    ogLocale: "ja_JP",
    textDirection: "ltr",
  },
  en: {
    locale: "en",
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
    urlPrefix: "/en",
    htmlLang: "en",
    ogLocale: "en_US",
    textDirection: "ltr",
  },
  zh: {
    locale: "zh",
    label: "Traditional Chinese",
    nativeLabel: "繁體中文",
    shortLabel: "ZH",
    urlPrefix: "/zh",
    htmlLang: "zh-Hant",
    ogLocale: "zh_TW",
    textDirection: "ltr",
  },
} as const satisfies Record<Locale, LocaleConfig>;

export const localePrefixMap = {
  ja: "",
  en: "/en",
  zh: "/zh",
} as const satisfies Record<Locale, LocalePrefix>;

export const htmlLangMap = {
  ja: "ja",
  en: "en",
  zh: "zh-Hant",
} as const satisfies Record<Locale, HtmlLang>;

export const ogLocaleMap = {
  ja: "ja_JP",
  en: "en_US",
  zh: "zh_TW",
} as const satisfies Record<Locale, OgLocale>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function isPrefixedLocale(value: unknown): value is PrefixedLocale {
  return typeof value === "string" && prefixedLocales.includes(value as PrefixedLocale);
}

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale];
}

export function getLocalePrefix(locale: Locale): LocalePrefix {
  return localePrefixMap[locale];
}

export function getHtmlLang(locale: Locale): HtmlLang {
  return htmlLangMap[locale];
}

export function getOgLocale(locale: Locale): OgLocale {
  return ogLocaleMap[locale];
}

export function normalizePathname(pathname: string): Pathname {
  const trimmedPathname = pathname.trim();

  if (trimmedPathname === "" || trimmedPathname === "/") {
    return "/";
  }

  const pathnameWithoutHash = trimmedPathname.split("#")[0] ?? "";
  const pathnameWithoutQuery = pathnameWithoutHash.split("?")[0] ?? "";

  if (pathnameWithoutQuery === "" || pathnameWithoutQuery === "/") {
    return "/";
  }

  const pathnameWithLeadingSlash = pathnameWithoutQuery.startsWith("/")
    ? pathnameWithoutQuery
    : `/${pathnameWithoutQuery}`;

  if (pathnameWithLeadingSlash.length > 1 && pathnameWithLeadingSlash.endsWith("/")) {
    return pathnameWithLeadingSlash.slice(0, -1) as Pathname;
  }

  return pathnameWithLeadingSlash as Pathname;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const normalizedPathname = normalizePathname(pathname);
  const firstSegment = normalizedPathname.split("/")[1];

  if (isPrefixedLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

export function removeLocalePrefix(pathname: string): Pathname {
  const normalizedPathname = normalizePathname(pathname);
  const locale = getLocaleFromPathname(normalizedPathname);
  const prefix = getLocalePrefix(locale);

  if (prefix === "") {
    return normalizedPathname;
  }

  if (normalizedPathname === prefix) {
    return "/";
  }

  if (!normalizedPathname.startsWith(`${prefix}/`)) {
    return normalizedPathname;
  }

  const pathnameWithoutPrefix = normalizedPathname.slice(prefix.length);

  if (pathnameWithoutPrefix === "" || pathnameWithoutPrefix === "/") {
    return "/";
  }

  return pathnameWithoutPrefix as Pathname;
}

export function createLocalizedPath(locale: Locale, pathname: string): Pathname {
  const normalizedPathname = removeLocalePrefix(pathname);
  const prefix = getLocalePrefix(locale);

  if (prefix === "") {
    return normalizedPathname;
  }

  if (normalizedPathname === "/") {
    return prefix;
  }

  return `${prefix}${normalizedPathname}` as Pathname;
}

export function createAlternateLocalePaths(pathname: string): Record<Locale, Pathname> {
  return {
    ja: createLocalizedPath("ja", pathname),
    en: createLocalizedPath("en", pathname),
    zh: createLocalizedPath("zh", pathname),
  };
}

export function getLocaleRouteSegment(locale: Locale): PrefixedLocale | null {
  if (isPrefixedLocale(locale)) {
    return locale;
  }

  return null;
}