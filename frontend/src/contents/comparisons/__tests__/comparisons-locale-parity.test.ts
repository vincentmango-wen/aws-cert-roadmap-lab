/**
 * comparisons-locale-parity.test.ts
 *
 * 設計書 §D-4 / architecture review Medium-2 対応の invariant test。
 *
 * `contents/comparisons/comparisons.{ja,en,zh}.json` と各 locale 配下の MDX が、
 * 翻訳追加忘れ・slug ズレ・メタデータ不整合・MDX 消失なしに 3 言語完全並列で
 * 維持されていることを構造的に担保する。
 *
 * 検証 invariant（task spec § 3）:
 *  (1) ja/en/zh JSON の slug 集合が完全一致
 *  (2) 同 slug で comparisonId が ja/en/zh 一致
 *  (3) 同 slug で services/category/level/examScopes/tags/priority/published/
 *      publishedAt/updatedAt が ja/en/zh 一致
 *  (4) 全 slug について contents/comparisons/{ja,en,zh}/<slug>.mdx が
 *      fs.existsSync = true
 *  (5) ja JSON の title/description が ja MDX frontmatter と一致
 *      (Option A 採用ガード / fix1 と整合)
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

// frontend ディレクトリ基準で MDX の絶対パスを解決する。
// 本テストファイルは frontend/src/contents/comparisons/__tests__/ 配下にあるため、
// __dirname から 4 つ上ると frontend ルートに到達する。
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
    // locale 非依存メタ。title/description は翻訳対象のため対象外。
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

  // (6) MDX 先頭 H1 が JSON title と一致 or title.startsWith(h1Text) であること。
  // R2 fix: removeLeadingH1 のガード緩和 (LONG タイトル vs SHORT body H1 の二重描画防止) と
  // 整合させ、loader が strip できない先頭 H1 を構造的に検出する。
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
        if (!h1Match) continue; // 先頭 H1 が無ければ問題なし

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
});
