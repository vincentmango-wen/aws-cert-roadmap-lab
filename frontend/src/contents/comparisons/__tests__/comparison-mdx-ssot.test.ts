import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { publishedComparisons } from "../comparisons";

/**
 * comparison MDX (contents/comparisons/*.mdx) と publishedComparisons (TS)
 * の slug 集合が完全一致することを検証する invariant test。
 *
 * 背景: isExistingComparison は publishedComparisons を参照する一方、
 * comparison 詳細ルート (/comparisons/[comparisonSlug]) の notFound() は
 * MDX frontmatter 由来 → SSoT 二重化。drift が起きると false 準備中 /
 * false link 化のリスクが出るため、CI で機械的に潰す。
 *
 * 参考: engineering-fe-be-enum-ssot.md / engineering-review-independence.md
 *   §自己制約 1 盲点 9 (enum SSoT 不在による FE/BE mismatch)
 */
function getComparisonMdxDirectory(): string {
  const candidates = [
    path.join(process.cwd(), "contents", "comparisons"),
    path.join(process.cwd(), "frontend", "contents", "comparisons"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("comparison MDX directory not found");
}

function readSlugFromFrontmatter(filePath: string): string {
  const raw = fs.readFileSync(filePath, "utf8");
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatterMatch) {
    throw new Error(`frontmatter missing in ${filePath}`);
  }

  const frontmatterText = frontmatterMatch[1];
  const slugLine = frontmatterText
    .split(/\r?\n/)
    .find((line) => line.startsWith("slug:"));

  if (!slugLine) {
    throw new Error(`slug missing in frontmatter of ${filePath}`);
  }

  const slugValue = slugLine.replace(/^slug:\s*/, "").trim();
  return slugValue.replace(/^["']|["']$/g, "");
}

function getMdxSlugs(): string[] {
  const directory = getComparisonMdxDirectory();

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => readSlugFromFrontmatter(path.join(directory, fileName)))
    .sort();
}

describe("comparison MDX ↔ publishedComparisons SSoT invariant", () => {
  const mdxSlugs = getMdxSlugs();
  const tsSlugs = publishedComparisons.map((c) => c.slug).sort();

  it("MDX slug set equals publishedComparisons slug set", () => {
    expect(mdxSlugs).toEqual(tsSlugs);
  });

  it("MDX slug set has no duplicates", () => {
    expect(new Set(mdxSlugs).size).toBe(mdxSlugs.length);
  });

  it("publishedComparisons slug set has no duplicates", () => {
    expect(new Set(tsSlugs).size).toBe(tsSlugs.length);
  });
});
