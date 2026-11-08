/**
 * ACR-012 (#322), invariant layer 1. In sealed mode (LOCALIZED_ROUTES_PUBLISHED === false), verify that
 * all en/zh loc and xhtml:link entries disappear from the sitemap while enough Japanese URLs remain. The
 * minimum-count guard prevents a repeat of the 2026-06-28 incident where almost all listed URLs returned
 * 404.
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

    // Only routes explicitly declaring availableLocales: ["ja"] (/terms-of-service) form Japanese-only clusters.
    // Other single-locale combinations (en-only or zh-only) indicate broken generation logic.
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
