import type { MetadataRoute } from "next";
import type { Locale } from "../locales";
import { createLocalizedPath, locales } from "../locales";

export type SitemapItem = MetadataRoute.Sitemap[number];

export type ChangeFrequency = NonNullable<SitemapItem["changeFrequency"]>;

export type LocalizedSitemapRouteInput = {
  pathname: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  lastModified?: string | Date;
  availableLocales?: readonly Locale[];
  alternatePathname?: string;
};

const FALLBACK_SITE_URL = "https://aws-cert-roadmap-lab.example.com";

const BUILD_TIME = new Date();

const hreflangByLocale = {
  ja: "ja",
  en: "en",
  zh: "zh-Hant",
} satisfies Record<Locale, string>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getSitemapSiteUrl(): string {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
  const trimmedSiteUrl = rawSiteUrl.trim().replace(/\/+$/, "");

  if (trimmedSiteUrl.length === 0) {
    return FALLBACK_SITE_URL;
  }

  if (trimmedSiteUrl.startsWith("http://") || trimmedSiteUrl.startsWith("https://")) {
    return trimmedSiteUrl;
  }

  return `https://${trimmedSiteUrl}`;
}

export function normalizeSitemapPathname(pathname: string): `/${string}` | "/" {
  const trimmedPathname = pathname.trim();

  if (trimmedPathname.length === 0 || trimmedPathname === "/") {
    return "/";
  }

  const prefixedPathname = trimmedPathname.startsWith("/")
    ? trimmedPathname
    : `/${trimmedPathname}`;

  return prefixedPathname.replace(/\/+$/, "") as `/${string}`;
}

export function createSitemapAbsoluteUrl(pathname: string): string {
  const siteUrl = getSitemapSiteUrl();
  const normalizedPathname = normalizeSitemapPathname(pathname);

  if (normalizedPathname === "/") {
    return siteUrl;
  }

  return `${siteUrl}${normalizedPathname}`;
}

export function toSitemapLastModified(value?: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }

  if (!isNonEmptyString(value)) {
    return BUILD_TIME;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return BUILD_TIME;
  }

  return parsedDate;
}

function resolveAvailableLocales(availableLocales?: readonly Locale[]): Locale[] {
  if (!availableLocales) {
    return [...locales];
  }

  const uniqueLocales = new Set<Locale>();

  for (const locale of availableLocales) {
    if (locales.includes(locale)) {
      uniqueLocales.add(locale);
    }
  }

  if (uniqueLocales.size === 0) {
    return [...locales];
  }

  return [...uniqueLocales];
}

export function createAlternateLanguageUrls(
  pathname: string,
  availableLocales?: readonly Locale[],
): Record<string, string> {
  const normalizedPathname = normalizeSitemapPathname(pathname);
  const resolvedLocales = resolveAvailableLocales(availableLocales);

  return resolvedLocales.reduce<Record<string, string>>((languageUrls, locale) => {
    const hreflang = hreflangByLocale[locale];
    const localizedPathname = createLocalizedPath(locale, normalizedPathname);

    return {
      ...languageUrls,
      [hreflang]: createSitemapAbsoluteUrl(localizedPathname),
    };
  }, {});
}

export function createLocalizedSitemapItems(
  route: LocalizedSitemapRouteInput,
): SitemapItem[] {
  const normalizedPathname = normalizeSitemapPathname(route.pathname);
  const alternatePathname = normalizeSitemapPathname(
    route.alternatePathname ?? normalizedPathname,
  );
  const availableLocales = resolveAvailableLocales(route.availableLocales);
  const alternates = createAlternateLanguageUrls(alternatePathname, availableLocales);

  return availableLocales.map((locale) => {
    const localizedPathname = createLocalizedPath(locale, normalizedPathname);

    return {
      url: createSitemapAbsoluteUrl(localizedPathname),
      lastModified: toSitemapLastModified(route.lastModified),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: alternates,
      },
    };
  });
}