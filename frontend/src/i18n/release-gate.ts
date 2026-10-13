import { defaultLocale, locales, type Locale } from "./locales";

/**
 * en / zh の公開制御（ACR-012 / #322）。
 *
 * 現在は AdSense 再申請を見送り、3 言語での開発を優先するため公開中。
 * `false` にすると ja のみが公開対象となり、言語スイッチャーを隠し、
 * en/zh の sitemap・robots・hreflang を封印する。必要になれば再度切り替えられる。
 *
 * 既知の多言語課題は #319（共通フッター翻訳）、#305（roadmap ページ）などで追跡する。
 * これらは開発プレビューで言語を切り替えるためのブロッカーにはしない。
 *
 * `: boolean` の明示注釈は必須。`= false` だけだと型が `false` リテラルに narrow され、
 * `if (LOCALIZED_ROUTES_PUBLISHED)` 分岐が到達不能扱いになって lint / typecheck が不安定になる。
 *
 * このファイルは `./locales` 以外を import しないこと。
 * `Header.tsx` は `"use client"` のため、`node:fs` 等が混ざるとクライアントバンドルが壊れる。
 *
 * NOTE: `scripts/verify-locale-seal.mjs` が
 * `/LOCALIZED_ROUTES_PUBLISHED\s*:\s*boolean\s*=\s*(true|false)/` でこの定数を読み取る。
 * リネームするとビルド時検査が例外で落ちる（黙って無効化されないための仕掛け）。
 */
export const LOCALIZED_ROUTES_PUBLISHED: boolean = true;

/** 現在公開対象の locale の集合。 */
export const publishedLocales: readonly Locale[] = LOCALIZED_ROUTES_PUBLISHED
  ? locales
  : [defaultLocale];

export function isPublishedLocale(locale: Locale): boolean {
  return publishedLocales.includes(locale);
}

/**
 * 封印時に locale prefix 配下の pathname かを判定する。
 *
 * `pathname.startsWith("/en")` の前方一致は `/entertainment` `/environment` のような
 * ja パスを誤検知して ja 面を巻き添えで noindex にするため、必ずセグメント境界で判定する。
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
