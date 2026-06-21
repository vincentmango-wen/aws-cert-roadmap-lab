/**
 * comparisonInternalLinks.ts
 *
 * 比較記事 MDX 本文中の内部リンク href を、表示中の locale に合わせて書き換える
 * pure function 群 (P5-041).
 *
 * 設計指針:
 * - MDX 本文中の `[label](/terms/xxx)` などの href は **agent 翻訳時点では原文 ja パス**で固定
 *   (設計書 §6-7: "リンク `[text](url)` の url は触らない")。
 * - renderer 側 (MarkdownContent) でこの helper を通すことで、同じ MDX を
 *   3 言語ページから共通利用しつつ、リンク先だけ locale 対応に書き換える。
 * - 同一言語に該当ページが存在しない場合は **ja パスへフォールバック**して
 *   404 を避ける ("リンク先がそのロケールで未公開の場合のフォールバック方針").
 *
 * pure function に倒し、テスト容易性 + server / client いずれからも import 可能.
 */
import {
  isExistingComparisonForLocale,
  isExistingTerm,
} from "./termGuards";
import { createLocalizedPath } from "../i18n/locales";
import type { Locale } from "../i18n/locales";

export type ResolvedInternalLink = {
  /** 最終的に <Link href> / <a href> に渡す URL */
  href: string;
  /**
   * external (http(s)://, mailto:, tel:, anchor) かどうか.
   * true なら <a target=_blank> 系で開く判定に使える.
   */
  isExternal: boolean;
  /**
   * 内部リンクで、かつ表示中の locale に該当ページが存在するか.
   * false の場合は ja へフォールバック済み (= href は ja 用パス) または
   * そもそも未知の内部 href (= href は原文のまま) であることを示す.
   */
  available: boolean;
  /**
   * 「同言語にページが無いため ja パスへフォールバックした」フラグ.
   * 呼び出し元が "準備中" chip 表示などの UX 切替に使う.
   */
  fellBackToJa: boolean;
};

const TERMS_PREFIX = "/terms/";
const COMPARISONS_PREFIX = "/comparisons/";
const QUESTIONS_PREFIX = "/questions/";
const ARCHITECTURES_PREFIX = "/architectures/";

/**
 * 比較記事 MDX 本文中の href を locale に合わせて解決する.
 *
 * 解決ルール:
 * - `http(s)://`, `mailto:`, `tel:`, `#anchor` → external 扱い、href はそのまま
 * - `/terms/{id}`:
 *    - termId が terms.ja.json に存在 → `/{locale}/terms/{id}` (terms は全 3 言語公開)
 *    - 存在しない → ja パスのまま (404 を呼ぶが既存 ja 挙動と同じ / 不正リンクの責任は MDX 側)
 * - `/comparisons/{slug}`:
 *    - 該当 locale で公開 → `/{locale}/comparisons/{slug}`
 *    - 未公開 → ja パス (`/comparisons/{slug}`) へフォールバック (fellBackToJa: true)
 *    - そもそも slug が存在しない → ja パスのまま (404)
 * - `/questions/...` / `/architectures/...`:
 *    - 該当 locale ページが現状未整備 (P5-040 系・別 issue) のため、
 *      ja パスへフォールバック (fellBackToJa: true) して 404 を回避.
 * - その他のサイト内ルート (`/`, `/about`, `/comparisons` 一覧, 等):
 *    - en/zh にも対応ルートが存在する前提で createLocalizedPath を適用.
 */
export function resolveInternalLink(
  locale: Locale,
  href: string,
): ResolvedInternalLink {
  if (!href) {
    return { href, isExternal: false, available: false, fellBackToJa: false };
  }

  // external / anchor / mailto / tel はそのまま
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return { href, isExternal: true, available: true, fellBackToJa: false };
  }

  // 相対 path や protocol-relative はサポート外として external 扱い
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

    // 不存在 termId は ja でも 404 になるため、原文のまま返す.
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

    // ja には存在するが en/zh で未公開のケース → ja パスへフォールバック.
    // ja でも存在しない slug は ja パスのまま 404 (= 不正リンクの責任は MDX 側).
    return {
      href,
      isExternal: false,
      available: false,
      fellBackToJa: locale !== "ja",
    };
  }

  // /questions/... — locale 別ルートが現状未整備 (P5-040 系 / 別 issue) のため
  // ja パスへフォールバック.
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

  // /architectures/... — 同上 (ja のみ存在)
  if (href.startsWith(ARCHITECTURES_PREFIX) || href === "/architectures") {
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

  // それ以外の内部ルート (`/`, `/about`, `/contact`, `/privacy`, `/disclaimer`,
  // `/comparisons`, `/terms`, 等) は en/zh にも対応ルートが存在する前提で
  // createLocalizedPath を適用する.
  return {
    href: createLocalizedPath(locale, href),
    isExternal: false,
    available: true,
    fellBackToJa: false,
  };
}

/**
 * MarkdownContent / 他 renderer 用の便利関数:
 * 解決結果から `<Link href>` に渡す URL だけを抜き出す.
 */
export function resolveInternalHref(locale: Locale, href: string): string {
  return resolveInternalLink(locale, href).href;
}
