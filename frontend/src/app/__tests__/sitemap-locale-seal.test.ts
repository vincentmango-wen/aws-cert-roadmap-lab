/**
 * sitemap-locale-seal.test.ts
 *
 * ACR-012 (#322) invariant 第 1 層。
 *
 * 封印モード（`LOCALIZED_ROUTES_PUBLISHED === false`）では
 * sitemap から en/zh の `<loc>` と `<xhtml:link>` が完全に消えること、
 * かつ ja の URL が空洞化していないこと（2026-06-28 の「ほぼ全 URL が 404」型の
 * 事故を防ぐ下限ガード）を検証する。
 */
import { describe, expect, it } from "vitest";

import sitemap from "../sitemap";
import { LOCALIZED_ROUTES_PUBLISHED } from "../../i18n/release-gate";
import { getSitemapSiteUrl } from "../../i18n/seo/sitemap";

const SITE_URL = getSitemapSiteUrl();

const SEALED_LOCALE_PATHNAME = /^\/(en|zh)(\/|$)/;

const toPathname = (url: string): string => {
  const pathname = url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) : url;

  return pathname === "" ? "/" : pathname;
};

describe.skipIf(LOCALIZED_ROUTES_PUBLISHED)("sitemap locale seal", () => {
  const items = sitemap();

  it("emits no en/zh <loc> entries", () => {
    const sealedUrls = items
      .map((item) => toPathname(item.url))
      .filter((pathname) => SEALED_LOCALE_PATHNAME.test(pathname));

    expect(sealedUrls).toEqual([]);
  });

  it("emits only a ja self-reference while sealed", () => {
    const alternateKeySets = new Set(
      items.map((item) => Object.keys(item.alternates?.languages ?? {}).sort().join(",")),
    );

    expect([...alternateKeySets]).toEqual(["ja"]);
  });

  it("does not hollow out the sitemap (>= 150 URLs)", () => {
    expect(items.length).toBeGreaterThanOrEqual(150);
  });

  it("keeps the ja /roadmap URL and drops the localized ones", () => {
    const urls = items.map((item) => item.url);

    expect(urls).toContain(`${SITE_URL}/roadmap`);
    expect(urls).not.toContain(`${SITE_URL}/en/roadmap`);
    expect(urls).not.toContain(`${SITE_URL}/zh/roadmap`);
  });
});

describe.runIf(LOCALIZED_ROUTES_PUBLISHED)("sitemap without locale seal", () => {
  const items = sitemap();

  it("emits en/zh <loc> entries again", () => {
    const sealedUrls = items
      .map((item) => toPathname(item.url))
      .filter((pathname) => SEALED_LOCALE_PATHNAME.test(pathname));

    expect(sealedUrls.length).toBeGreaterThan(0);
  });

  it("emits the full 3-locale hreflang cluster", () => {
    const alternateKeySets = new Set(
      items.map((item) => Object.keys(item.alternates?.languages ?? {}).sort().join(",")),
    );

    expect([...alternateKeySets]).toContain("en,ja,x-default,zh-Hant");

    // ja 単独クラスタは `availableLocales: ["ja"]` を明示した route（/terms-of-service）だけ。
    // それ以外の組み合わせ（en 単独 / zh 単独など）が出たら生成ロジックの破損。
    expect([...alternateKeySets].sort()).toEqual([
      "en,ja,x-default,zh-Hant",
      "ja,x-default",
    ]);
  });

  it("emits self-referencing reciprocal alternates and ja x-default", () => {
    const expectedLanguages = {
      ja: `${SITE_URL}/roadmap`,
      en: `${SITE_URL}/en/roadmap`,
      "zh-Hant": `${SITE_URL}/zh/roadmap`,
      "x-default": `${SITE_URL}/roadmap`,
    };
    const roadmapItems = items.filter((item) =>
      [
        `${SITE_URL}/roadmap`,
        `${SITE_URL}/en/roadmap`,
        `${SITE_URL}/zh/roadmap`,
      ].includes(item.url),
    );

    expect(roadmapItems).toHaveLength(3);
    for (const item of roadmapItems) {
      expect(item.alternates?.languages).toEqual(expectedLanguages);
    }
  });

  it("keeps ja-only routes limited to ja and x-default", () => {
    const termsOfService = items.find(
      (item) => item.url === `${SITE_URL}/terms-of-service`,
    );

    expect(termsOfService?.alternates?.languages).toEqual({
      ja: `${SITE_URL}/terms-of-service`,
      "x-default": `${SITE_URL}/terms-of-service`,
    });
  });
});
