/**
 * sitemap.test.ts
 *
 * CR1-H2 regression guard:
 * - P5-034 (comparisons) と P5-042 (architectures) で MDX を locale サブディレクトリ
 *   配下に移したため、旧 readMdxContentMetas (非再帰 readdirSync) は空配列を返し、
 *   詳細記事 URL が sitemap.xml から全件消えていた。
 * - 本テストは JSON SSoT 起点に切り替えた後の sitemap output に、詳細 URL が
 *   漏れなく含まれることを構造的に検証する。
 *
 * ACR-012 (#322):
 * - ja の assert は常時実行。
 * - en/zh の assert は封印中に必ず落ちるため `describe.runIf(LOCALIZED_ROUTES_PUBLISHED)`
 *   に括り出して skip する。**削除してはいけない** — これが解封時の regression ガード。
 */
import { describe, expect, it } from "vitest";

import sitemap from "../sitemap";
import architecturesJa from "../../../contents/architectures/architectures.ja.json";
import comparisonsJa from "../../../contents/comparisons/comparisons.ja.json";
import { LOCALIZED_ROUTES_PUBLISHED } from "../../i18n/release-gate";

type JsonEntry = { slug: string; published?: boolean };

const SITE_URL = "https://aws-cert-roadmap-lab.example.com";

const publishedSlugs = (entries: JsonEntry[]): string[] =>
  entries.filter((entry) => entry.published !== false).map((entry) => entry.slug);

describe("sitemap localized detail URLs", () => {
  const items = sitemap();
  const urls = items.map((item) => item.url);

  it("contains every published architecture detail URL in ja", () => {
    const slugs = publishedSlugs(architecturesJa as JsonEntry[]);
    expect(slugs.length).toBeGreaterThanOrEqual(10);

    for (const slug of slugs) {
      expect(
        urls,
        `ja architecture URL missing for slug=${slug}`,
      ).toContain(`${SITE_URL}/architectures/${slug}`);
    }
  });

  it("contains every published comparison detail URL in ja", () => {
    const slugs = publishedSlugs(comparisonsJa as JsonEntry[]);
    expect(slugs.length).toBeGreaterThanOrEqual(1);

    for (const slug of slugs) {
      expect(
        urls,
        `ja comparison URL missing for slug=${slug}`,
      ).toContain(`${SITE_URL}/comparisons/${slug}`);
    }
  });

  it("contains /architectures and /comparisons index pages in ja", () => {
    expect(urls).toContain(`${SITE_URL}/architectures`);
    expect(urls).toContain(`${SITE_URL}/comparisons`);
  });
});

describe.runIf(LOCALIZED_ROUTES_PUBLISHED)("sitemap localized detail URLs (en/zh)", () => {
  const items = sitemap();
  const urls = items.map((item) => item.url);

  it("contains every published architecture detail URL in en/zh", () => {
    const slugs = publishedSlugs(architecturesJa as JsonEntry[]);
    expect(slugs.length).toBeGreaterThanOrEqual(10);

    for (const slug of slugs) {
      expect(
        urls,
        `en architecture URL missing for slug=${slug}`,
      ).toContain(`${SITE_URL}/en/architectures/${slug}`);
      expect(
        urls,
        `zh architecture URL missing for slug=${slug}`,
      ).toContain(`${SITE_URL}/zh/architectures/${slug}`);
    }
  });

  it("contains every published comparison detail URL in en/zh", () => {
    const slugs = publishedSlugs(comparisonsJa as JsonEntry[]);
    expect(slugs.length).toBeGreaterThanOrEqual(1);

    for (const slug of slugs) {
      expect(
        urls,
        `en comparison URL missing for slug=${slug}`,
      ).toContain(`${SITE_URL}/en/comparisons/${slug}`);
      expect(
        urls,
        `zh comparison URL missing for slug=${slug}`,
      ).toContain(`${SITE_URL}/zh/comparisons/${slug}`);
    }
  });

  it("contains /architectures and /comparisons index pages in en/zh", () => {
    expect(urls).toContain(`${SITE_URL}/en/architectures`);
    expect(urls).toContain(`${SITE_URL}/zh/architectures`);
    expect(urls).toContain(`${SITE_URL}/en/comparisons`);
    expect(urls).toContain(`${SITE_URL}/zh/comparisons`);
  });
});
