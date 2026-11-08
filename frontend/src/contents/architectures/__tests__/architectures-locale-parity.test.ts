/**
 * Invariant tests for design P5-042 section 8-2, full-implementation mode. Keep
 * architectures.{ja,en,zh}.json and localized MDX/SVG files synchronized across three locales, detecting
 * missing translations, slug drift, metadata inconsistency, missing MDX and SVG naming errors. Phase 7
 * completed 10 articles in all locales; the scaffold flag remains but all normal invariants now run.
 * Subsequent locale additions, slugs and translations must not update only one language.
 *
 * When en/zh arrays are nonempty, verify:
 * 1. Identical slug sets across ja/en/zh (10 articles).
 * 2. Matching architectureId per slug.
 * 3. Matching services/category/level/examScopes/mermaid/published/publishedAt/updatedAt; exclude
 * translated tags.
 * 4. Every localized MDX file exists.
 * 5. Every SVG exists: <slug>.svg, <slug>.en.svg and <slug>.zh.svg.
 * 6. JSON diagramPath matches the unsuffixed Japanese path in all locales, and resolveDiagramPath
 * returns the files verified in (5).
 * 7. Leading MDX H1 equals the JSON title or is its prefix, allowing removeLeadingH1 to strip it.
 *
 * Scaffold mode (an empty en or zh array) remains a safety valve for temporary states before new
 * translations exist; normal operation does not use it.
 */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import architecturesEn from "../../../../contents/architectures/architectures.en.json";
import architecturesJa from "../../../../contents/architectures/architectures.ja.json";
import architecturesZh from "../../../../contents/architectures/architectures.zh.json";
import type { ArchitectureMeta } from "../../../types/architecture";
import { resolveDiagramPath } from "../../../app/(site)/architectures/architecture-detail-data";

const jaList = architecturesJa as ArchitectureMeta[];
const enList = architecturesEn as ArchitectureMeta[];
const zhList = architecturesZh as ArchitectureMeta[];

// Resolve absolute MDX/SVG paths relative to the frontend directory.
const FRONTEND_ROOT = path.resolve(__dirname, "../../../../");
const mdxPathFor = (locale: "ja" | "en" | "zh", slug: string): string =>
  path.join(FRONTEND_ROOT, "contents", "architectures", locale, `${slug}.mdx`);
const svgPathFor = (locale: "ja" | "en" | "zh", slug: string): string => {
  const suffix = locale === "ja" ? "" : `.${locale}`;
  return path.join(
    FRONTEND_ROOT,
    "public",
    "images",
    "architectures",
    `${slug}${suffix}.svg`,
  );
};

const toMap = (
  list: ArchitectureMeta[],
): Map<string, ArchitectureMeta> => new Map(list.map((a) => [a.slug, a]));

const jaMap = toMap(jaList);
const enMap = toMap(enList);
const zhMap = toMap(zhList);

const isScaffoldMode = enList.length === 0 || zhList.length === 0;

describe("architectures locale parity", () => {
  it("(scaffold) ja JSON contains the expected 10 published architectures", () => {
    expect(jaList.length).toBe(10);
  });

  it("(scaffold) every ja MDX file exists on disk", () => {
    for (const slug of jaMap.keys()) {
      const filePath = mdxPathFor("ja", slug);
      expect(
        fs.existsSync(filePath),
        `ja MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
      ).toBe(true);
    }
  });

  it.skipIf(isScaffoldMode)(
    "(1) ja/en/zh have the same slug set",
    () => {
      const jaSlugs = new Set(jaList.map((a) => a.slug));
      const enSlugs = new Set(enList.map((a) => a.slug));
      const zhSlugs = new Set(zhList.map((a) => a.slug));

      expect(enSlugs).toEqual(jaSlugs);
      expect(zhSlugs).toEqual(jaSlugs);
    },
  );

  it.skipIf(isScaffoldMode)(
    "(2) architectureId is identical across ja/en/zh per slug",
    () => {
      for (const slug of jaMap.keys()) {
        const ja = jaMap.get(slug);
        const en = enMap.get(slug);
        const zh = zhMap.get(slug);
        expect(en, `en entry missing for slug=${slug}`).toBeDefined();
        expect(zh, `zh entry missing for slug=${slug}`).toBeDefined();
        expect(
          en!.architectureId,
          `architectureId mismatch (en) slug=${slug}`,
        ).toBe(ja!.architectureId);
        expect(
          zh!.architectureId,
          `architectureId mismatch (zh) slug=${slug}`,
        ).toBe(ja!.architectureId);
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(3) shared metadata fields are identical across ja/en/zh per slug",
    () => {
      // Locale-independent metadata; exclude translated title, description and tags.
      const SHARED_FIELDS = [
        "services",
        "category",
        "level",
        "examScopes",
        "mermaid",
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
    },
  );

  it.skipIf(isScaffoldMode)(
    "(4) every {ja,en,zh}/<slug>.mdx file exists on disk",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = mdxPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(5) every locale-specific SVG file exists on disk",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = svgPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `SVG missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(6) diagramPath is identical across ja/en/zh per slug, and resolveDiagramPath(locale, meta) resolves to the file existence checked in (5)",
    () => {
      // CR1-M2: the old test reimplemented resolveDiagramPath, which could hide divergence.
      // Import and test the actual source-of-truth function instead of maintaining a second implementation.
      // Invariant: resolveDiagramPath(locale, meta) returns the existing file verified in (5).
      for (const slug of jaMap.keys()) {
        const ja = jaMap.get(slug)!;
        const en = enMap.get(slug)!;
        const zh = zhMap.get(slug)!;

        // (6-a) All three JSON diagramPath values match the unsuffixed Japanese path.
        expect(en.diagramPath, `diagramPath mismatch (en) slug=${slug}`).toBe(
          ja.diagramPath,
        );
        expect(zh.diagramPath, `diagramPath mismatch (zh) slug=${slug}`).toBe(
          ja.diagramPath,
        );

        // (6-b) resolveDiagramPath(locale, meta) must match the file verified in (5).
        // Convert the /images/... URL to a filesystem path
        // using the rule /images/<rest> -> public/images/<rest>.
        for (const locale of ["ja", "en", "zh"] as const) {
          const meta =
            locale === "ja" ? ja : locale === "en" ? en : zh;
          const resolved = resolveDiagramPath(locale, meta);
          expect(resolved, `resolveDiagramPath undefined slug=${slug} locale=${locale}`).toBeDefined();

          const expectedFsPath = svgPathFor(locale, slug);
          // resolved is a URL path such as /images/architectures/foo.en.svg.
          // Prefix it with public/ to convert to a filesystem path, then verify
          // that it points to the same path as (5).
          const resolvedFsPath = path.join(
            FRONTEND_ROOT,
            "public",
            resolved!.replace(/^\//, ""),
          );
          expect(
            resolvedFsPath,
            `resolveDiagramPath path mismatch slug=${slug} locale=${locale}`,
          ).toBe(expectedFsPath);
          expect(
            fs.existsSync(resolvedFsPath),
            `resolveDiagramPath resolves to a missing file slug=${slug} locale=${locale} resolved=${resolved}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(7) MDX first H1 matches JSON title (or title.startsWith(h1Text))",
    () => {
      // Match the loader's removeLeadingH1 rule: exact equality or title.startsWith(h1Text).
      // This permits a short body H1 paired with a longer title.
      const stripFrontmatter = (rawFile: string): string => {
        const m = rawFile.match(
          /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/,
        );
        return m ? (m[2] ?? "").trim() : rawFile.trim();
      };

      const extractFirstH1 = (body: string): string | null => {
        const lines = body.split(/\r?\n/);
        for (const raw of lines) {
          const line = raw.trim();
          if (line.length === 0) continue;
          const h1 = line.match(/^#\s+(.+)$/);
          return h1 ? h1[1].trim() : null;
        }
        return null;
      };

      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const meta = (locale === "ja" ? jaMap : locale === "en" ? enMap : zhMap).get(
            slug,
          )!;
          const filePath = mdxPathFor(locale, slug);
          const raw = fs.readFileSync(filePath, "utf8");
          const body = stripFrontmatter(raw);
          const h1 = extractFirstH1(body);
          expect(
            h1,
            `MDX first H1 missing slug=${slug} locale=${locale}`,
          ).not.toBeNull();
          const ok = h1 === meta.title || meta.title.startsWith(h1!);
          expect(
            ok,
            `MDX H1 vs JSON title mismatch slug=${slug} locale=${locale} h1="${h1}" title="${meta.title}"`,
          ).toBe(true);
        }
      }
    },
  );

  // Additional Step 6 invariants.

  it("(8) en JSON contains exactly 10 architectures", () => {
    expect(enList.length).toBe(10);
  });

  it("(9) zh JSON contains exactly 10 architectures", () => {
    expect(zhList.length).toBe(10);
  });

  it.skipIf(isScaffoldMode)(
    "(10) every {ja,en,zh}/<slug>.mdx exists (explicit per-slug per-locale check)",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = mdxPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(11) every slug has all 3 locale SVG files: <slug>.svg / <slug>.en.svg / <slug>.zh.svg",
    () => {
      for (const slug of jaMap.keys()) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = svgPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `SVG missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(12) shared metadata fields (category/level/examScopes/services/publishedAt/mermaid) are identical across ja/en/zh per slug",
    () => {
      // Exclude translated tags; invariant (13) ensures they are nonempty.
      const SHARED_FIELDS = [
        "category",
        "level",
        "examScopes",
        "services",
        "publishedAt",
        "mermaid",
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
    },
  );

  it.skipIf(isScaffoldMode)(
    "(13) title and description are non-empty strings for every slug in all 3 locales",
    () => {
      for (const slug of jaMap.keys()) {
        for (const [locale, map] of [
          ["ja", jaMap],
          ["en", enMap],
          ["zh", zhMap],
        ] as const) {
          const meta = map.get(slug)!;
          expect(
            meta.title,
            `title is empty for slug=${slug} locale=${locale}`,
          ).toBeTruthy();
          expect(
            meta.description,
            `description is empty for slug=${slug} locale=${locale}`,
          ).toBeTruthy();
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(14) tags array is non-empty for every slug in all 3 locales",
    () => {
      for (const slug of jaMap.keys()) {
        for (const [locale, map] of [
          ["ja", jaMap],
          ["en", enMap],
          ["zh", zhMap],
        ] as const) {
          const meta = map.get(slug)!;
          expect(
            meta.tags,
            `tags is missing for slug=${slug} locale=${locale}`,
          ).toBeDefined();
          expect(
            (meta.tags as string[]).length,
            `tags is empty array for slug=${slug} locale=${locale}`,
          ).toBeGreaterThan(0);
        }
      }
    },
  );
});
