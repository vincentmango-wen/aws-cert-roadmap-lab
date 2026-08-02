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
 * x-default 用の URL。
 *
 * 封印中（`LOCALIZED_ROUTES_PUBLISHED === false`）は `createHreflangAlternates()` が
 * 空を返すため未使用だが、解封時に x-default を再投入するために export を残している。
 */
export function createXDefaultUrl(): string {
  return createAbsoluteUrl(X_DEFAULT_PATHNAME);
}

/**
 * 任意の path に対して ja / en / zh-Hant / x-default の hreflang URL を生成する。
 *
 * path-agnostic 設計のため、terms / comparisons / blog / architectures に加えて
 * questions 系 path (`/questions`, `/questions/clf`, `/questions/saa`,
 * `/questions/<questionId>`) も追加コード不要でそのまま利用できる。
 *
 * 例:
 *   createHreflangAlternates("/questions/clf-001")
 *     → { ja: "https://.../questions/clf-001",
 *         en: "https://.../en/questions/clf-001",
 *         "zh-Hant": "https://.../zh/questions/clf-001",
 *         "x-default": "https://.../questions/clf-001" }
 *
 * ACR-012（#322）の封印中は **空オブジェクトを返す**。
 * hreflang アノテーションは 2 言語以上のクラスタでのみ意味を持ち、ja 単独で
 * `{ ja: url, "x-default": url }` を出すのは canonical と重複する無意味なシグナルで、
 * Search Console に警告が出るため。解封時に自動で 4 件へ戻る。
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