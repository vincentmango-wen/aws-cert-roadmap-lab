import { defaultLocale, locales, type Locale } from "./locales";

/**
 * en / zh 封印フラグ（ACR-012 / #322）。
 *
 * `false` = ja のみを Google に見せる「AdSense 再申請モード」。
 *   - sitemap から en/zh の `<loc>` と `<xhtml:link>` が消える
 *   - en/zh 全ページの metadata が `robots: { index: false, follow: false }` になる
 *   - Header の LanguageSwitcher が非表示になり、ja 面から en/zh への内部リンクが 0 件になる
 *
 * `true` へ変更すると解封される。**解封前に必ず以下を潰すこと**:
 *
 *   1. #319 `src/components/layout/Footer.tsx` の日本語ハードコード。
 *      セクション見出し・リンクラベル・説明文・コピーライトが全て日本語で、
 *      en/zh 全 380 ページのフッターに日本語が出る。
 *   2. `/zh/privacy` に残る日本語由来の語彙（「配信」「目安」等）。
 *      Phase 2 で「アクセス解析」5 箇所は修正済みだが、他の残留語は未対応。
 *   3. #305 `/en/roadmap` `/zh/roadmap` の実体不在。
 *      Header の navItems / `en/page.tsx` / `zh/page.tsx` / `BlogListContent.tsx` が
 *      リンクしているが `out/en/roadmap.html` `out/zh/roadmap.html` は生成されず、
 *      S3 + CloudFront で 404 になる。
 *   4. `createPageMetadata` を経由しない 6 ページの robots 制御が
 *      `createLocaleAwareRobots()` 呼び出しになっていること
 *      （`en/contact`, `en/privacy`, `zh/contact`, `zh/privacy`, `zh/disclaimer`, `zh` トップ）。
 *      リテラル直書きに戻すと、解封しても 6 ページだけ永久に noindex のまま残る。
 *   5. x-default の再投入。hreflang クラスタは 2 言語以上でのみ意味を持つため、
 *      封印中は `createHreflangAlternates()` が空を返し x-default も出力されない。
 *      解封時に `createXDefaultUrl()` を使って再投入すること。
 *      sitemap 側の生成経路（`createAlternateLanguageUrls`）はもともと x-default を
 *      出力しないので、フラグを true にするだけでは戻らない。ここは手動作業になる。
 *   6. ページ単位の `alternates.languages` と `openGraph.alternateLocale` の再投入。
 *      4 の 6 ページは封印時に手書きの languages（ja / en / zh-Hant / x-default）を
 *      削除しており、フラグと連動していない。解封しても canonical しか戻らない。
 *      `zh/privacy` の `openGraph.alternateLocale` も同様に削除済み。
 *
 * #312（模擬問題の正解偏り）は Phase 1 / ACR-004 で解消済み（CLF の A 率 90% → 26%）。
 * 3 言語に展開しても偏りのシグナルにはならないため、解封の前提条件からは外してある。
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
export const LOCALIZED_ROUTES_PUBLISHED: boolean = false;

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
