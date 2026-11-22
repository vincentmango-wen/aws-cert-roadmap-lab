/**
 * Invariant tests for design section D-4 / architecture review Medium-2. Keep
 * comparisons.{ja,en,zh}.json and localized MDX synchronized, detecting missing translations, slug
 * drift, metadata inconsistency and missing MDX.
 *
 * Task-spec section 3 invariants:
 * 1. Identical JSON slug sets across all locales.
 * 2. Matching comparisonId per slug.
 * 3. Matching services/category/level/examScopes/tags/priority/published/publishedAt/updatedAt.
 * 4. Every contents/comparisons/{ja,en,zh}/<slug>.mdx file exists.
 * 5. Japanese JSON title/description matches Japanese MDX frontmatter (Option A guard, consistent with
 * fix1).
 */
import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import comparisonsEn from "../../../../contents/comparisons/comparisons.en.json";
import comparisonsJa from "../../../../contents/comparisons/comparisons.ja.json";
import comparisonsZh from "../../../../contents/comparisons/comparisons.zh.json";
import type { Comparison } from "../../../types/comparison";

const jaList = comparisonsJa as Comparison[];
const enList = comparisonsEn as Comparison[];
const zhList = comparisonsZh as Comparison[];

// Resolve absolute MDX paths relative to the frontend directory.
// This test lives in frontend/src/contents/comparisons/__tests__/;
// four parent-directory steps from __dirname reach the frontend root.
const FRONTEND_ROOT = path.resolve(__dirname, "../../../../");
const mdxPathFor = (locale: "ja" | "en" | "zh", slug: string): string =>
  path.join(FRONTEND_ROOT, "contents", "comparisons", locale, `${slug}.mdx`);

const toMap = (list: Comparison[]): Map<string, Comparison> =>
  new Map(list.map((c) => [c.slug, c]));

const jaMap = toMap(jaList);
const enMap = toMap(enList);
const zhMap = toMap(zhList);

describe("comparisons locale parity", () => {
  it("(1) ja/en/zh have the same slug set", () => {
    const jaSlugs = new Set(jaList.map((c) => c.slug));
    const enSlugs = new Set(enList.map((c) => c.slug));
    const zhSlugs = new Set(zhList.map((c) => c.slug));

    expect(enSlugs).toEqual(jaSlugs);
    expect(zhSlugs).toEqual(jaSlugs);
  });

  it("(2) comparisonId is identical across ja/en/zh per slug", () => {
    for (const slug of jaMap.keys()) {
      const ja = jaMap.get(slug);
      const en = enMap.get(slug);
      const zh = zhMap.get(slug);
      expect(en, `en entry missing for slug=${slug}`).toBeDefined();
      expect(zh, `zh entry missing for slug=${slug}`).toBeDefined();
      expect(en!.comparisonId, `comparisonId mismatch (en) slug=${slug}`).toBe(
        ja!.comparisonId,
      );
      expect(zh!.comparisonId, `comparisonId mismatch (zh) slug=${slug}`).toBe(
        ja!.comparisonId,
      );
    }
  });

  it("(3) shared metadata fields are identical across ja/en/zh per slug", () => {
    // Locale-independent metadata; exclude translated title and description.
    const SHARED_FIELDS = [
      "services",
      "category",
      "level",
      "examScopes",
      "tags",
      "priority",
      "published",
      "publishedAt",
      "updatedAt",
    ] as const;

    for (const slug of jaMap.keys()) {
      const ja = jaMap.get(slug)!;
      const en = enMap.get(slug)!;
      const zh = zhMap.get(slug)!;

      for (const field of SHARED_FIELDS) {
        expect(
          en[field],
          `field "${field}" mismatch between ja and en for slug=${slug}`,
        ).toEqual(ja[field]);
        expect(
          zh[field],
          `field "${field}" mismatch between ja and zh for slug=${slug}`,
        ).toEqual(ja[field]);
      }
    }
  });

  it("(4) every {ja,en,zh}/<slug>.mdx file exists on disk", () => {
    for (const slug of jaMap.keys()) {
      for (const locale of ["ja", "en", "zh"] as const) {
        const filePath = mdxPathFor(locale, slug);
        expect(
          fs.existsSync(filePath),
          `MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
        ).toBe(true);
      }
    }
  });

  it("(5) ja JSON title/description match ja MDX frontmatter (Option A guard)", () => {
    for (const slug of jaMap.keys()) {
      const ja = jaMap.get(slug)!;
      const filePath = mdxPathFor("ja", slug);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      expect(
        data.title,
        `ja MDX frontmatter.title mismatch for slug=${slug}`,
      ).toBe(ja.title);
      expect(
        data.description,
        `ja MDX frontmatter.description mismatch for slug=${slug}`,
      ).toBe(ja.description);
    }
  });

  // (6) Leading MDX H1 equals the JSON title or is a prefix of it.
  // R2 fix: match the relaxed removeLeadingH1 guard for long titles and short body H1 headings,
  // detecting leading headings that the loader cannot strip.
  it("(6) MDX leading H1 matches JSON title (or is a short prefix-aligned variant)", () => {
    const localeMaps: Array<["ja" | "en" | "zh", Map<string, Comparison>]> = [
      ["ja", jaMap],
      ["en", enMap],
      ["zh", zhMap],
    ];

    for (const [locale, map] of localeMaps) {
      for (const slug of map.keys()) {
        const entry = map.get(slug)!;
        const filePath = mdxPathFor(locale, slug);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { content } = matter(raw);
        const firstContentLine = content
          .split(/\r?\n/)
          .find((line) => line.trim().length > 0);

        if (!firstContentLine) continue;
        const h1Match = firstContentLine.trim().match(/^#\s+(.+)$/);
        if (!h1Match) continue; // No leading H1 is acceptable.

        const h1Text = h1Match[1].trim();
        const matchesExactly = h1Text === entry.title;
        const matchesShortPrefix = entry.title.startsWith(h1Text);

        expect(
          matchesExactly || matchesShortPrefix,
          `MDX leading H1 "${h1Text}" must equal or be a starting prefix of JSON title "${entry.title}" (locale=${locale}, slug=${slug}). loader removeLeadingH1 cannot strip this and will render as a duplicate heading.`,
        ).toBe(true);
      }
    }
  });

  // (7) ACR-002: examScopes, level and priority values must belong to their type unions.
  // comparison-detail-data.ts loads JSON using an as Comparison[] assertion,
  // so tsc cannot detect typos such as SAA-CO3. Invariant (3) only checks cross-locale equality;
  // the same typo in all three files would pass, and examScopes values
  // are rendered directly as chips by ComparisonDetailContent and ComparisonsListClient.
  // Since cmp-013 still requires manually entering examScopes in three files, validate the allowed values automatically.
  it("(7) examScopes/level/priority values are within the declared unions", () => {
    const VALID_EXAM_SCOPES = new Set<string>(["CLF-C02", "SAA-C03", "AIF-C01"]);
    const VALID_LEVELS = new Set<string>([
      "beginner",
      "intermediate",
      "advanced",
    ]);
    const VALID_PRIORITIES = new Set<string>(["high", "medium", "low"]);

    const localeLists: Array<["ja" | "en" | "zh", Comparison[]]> = [
      ["ja", jaList],
      ["en", enList],
      ["zh", zhList],
    ];

    for (const [locale, list] of localeLists) {
      for (const entry of list) {
        for (const scope of entry.examScopes) {
          expect(
            VALID_EXAM_SCOPES.has(scope),
            `unknown examScope "${scope}" (locale=${locale}, slug=${entry.slug}). It would be rendered verbatim as an exam chip.`,
          ).toBe(true);
        }
        expect(
          VALID_LEVELS.has(entry.level),
          `unknown level "${entry.level}" (locale=${locale}, slug=${entry.slug})`,
        ).toBe(true);
        expect(
          VALID_PRIORITIES.has(entry.priority),
          `unknown priority "${entry.priority}" (locale=${locale}, slug=${entry.slug})`,
        ).toBe(true);
      }
    }
  });
});
