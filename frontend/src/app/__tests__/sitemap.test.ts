/**
 * CR1-H2 regression guard: P5-034 (comparisons) and P5-042 (architectures) moved MDX into locale
 * subdirectories. The old nonrecursive readMdxContentMetas returned empty arrays, dropping all detail
 * URLs from sitemap.xml. Verify complete detail-URL coverage after switching to the JSON source of
 * truth.
 *
 * ACR-012 (#322): Japanese assertions always run. Put en/zh assertions under
 * describe.runIf(LOCALIZED_ROUTES_PUBLISHED), since they would fail while sealed. Do not delete them:
 * they protect publication against regressions.
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

  it("contains localized Roadmap index pages in en/zh", () => {
    expect(urls).toContain(`${SITE_URL}/en/roadmap`);
    expect(urls).toContain(`${SITE_URL}/zh/roadmap`);
  });
});
