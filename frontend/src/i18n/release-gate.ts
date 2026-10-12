import { defaultLocale, locales, type Locale } from "./locales";

/**
 * en / zh の公開フラグ（#322で導入、#334で公開方針を更新）。
 *
 * `false` = en/zh を非公開にする。sitemapからen/zh URLを外し、これらのページにnoindexを付け、LanguageSwitcherを隠す。
 * `true` = ja/en/zhを公開し、LanguageSwitcherとローカライズsitemapを有効にする。
 *
 * 公開前提条件（#334）:
 *
 *   1. #319でローカライズ済みのFooterを回帰確認する。
 *   2. `/zh/privacy` の繁体字表現を校正する。
 *   3. #305の `/en/roadmap` と `/zh/roadmap` を生成する。
 *   4. `createPageMetadata` を経由しない6ページ
 *      （`en/contact`, `en/privacy`, `zh/contact`, `zh/privacy`, `zh/disclaimer`, `zh`トップ）で
 *      `createLocaleAwareRobots()`を使い、公開時にindex/followとなることを生成HTMLで確認する。
 *   5. sitemapをhreflangの正本として、自己参照・相互参照・日本語を指す`x-default`を出力する。
 *      日本語のみのrouteには日本語URLと`x-default`だけを出力する。
 *   6. LanguageSwitcherをdesktopとmobileで確認する。HTMLのhreflang重複実装と
 *      `openGraph.alternateLocale`は検索公開の条件に含めない。
 *
 * Google AdSenseの再申請とクロール猶予は今回の公開条件外（#323はCLOSEDのまま）。
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

/** 現在 Google に公開してよい locale の集合。封印中は ja のみ。 */
export const publishedLocales: readonly Locale[] = LOCALIZED_ROUTES_PUBLISHED
  ? locales
  : [defaultLocale];

export function isPublishedLocale(locale: Locale): boolean {
  return publishedLocales.includes(locale);
}

/**
 * 封印中の locale prefix 配下の pathname かを判定する。
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
