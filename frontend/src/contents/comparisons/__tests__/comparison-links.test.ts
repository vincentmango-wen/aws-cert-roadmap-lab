import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Root, RootContent } from "mdast";
import matter from "gray-matter";
import {
  formatCategoryLabel,
  getComparisonBySlug,
  getComparisonStaticParams,
} from "../../../app/(site)/comparisons/comparison-detail-data";

const locales = ["ja", "en", "zh"] as const;
type Locale = (typeof locales)[number];
const contentRoot = path.resolve(process.cwd(), "contents");
const origin = "https://www.aws-cert-roadmap-lab.com";
const published = Object.fromEntries(locales.map((locale) => {
  const registry: { slug: string; published: boolean }[] = JSON.parse(
    fs.readFileSync(path.join(contentRoot, "comparisons", `comparisons.${locale}.json`), "utf8"),
  );
  return [locale, new Set(registry.filter((item) => item.published).map((item) => item.slug))];
})) as Record<Locale, Set<string>>;

// Validate the actual URL destination. Japanese has no /ja route prefix.
function comparisonLinkError(href: string): string | null {
  if (!href.startsWith("/") && !href.startsWith("https://") && !href.startsWith("http://")) return null;
  const url = new URL(href, origin);
  if (url.origin !== origin) return null;
  const match = url.pathname.match(/^\/(?:(ja|en|zh)\/)?comparisons\/([^/]+)\/?$/);
  if (!match) return null;
  if (match[1] === "ja") return `Unsupported Japanese prefix: ${href}`;
  const locale = (match[1] ?? "ja") as Locale;
  const slug = decodeURIComponent(match[2]);
  return published[locale].has(slug) && fs.existsSync(path.join(contentRoot, "comparisons", locale, `${slug}.mdx`))
    ? null
    : `Missing published comparison (${locale}): ${href}`;
}

function markdownHrefs(source: string): string[] {
  const hrefs: string[] = [];
  const visit = (node: Root | RootContent) => {
    if (node.type === "link" || node.type === "definition") hrefs.push(node.url);
    if (node.type === "html") {
      for (const match of node.value.matchAll(/\bhref\s*=\s*["']([^"']+)["']/g)) hrefs.push(match[1]);
    }
    if ("children" in node) node.children.forEach(visit);
  };
  visit(unified().use(remarkParse).parse(source));
  return hrefs;
}

function filesUnder(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(filename) : [filename];
  });
}

describe("comparison link validation", () => {
  it.each(["", "/en", "/zh"])("checks %s paths with query/hash without rejecting valid links", (prefix) => {
    for (const suffix of ["", "?from=article", "#overview", "?from=article#overview", "/?from=article#overview"]) {
      expect(comparisonLinkError(`${prefix}/comparisons/rds-vs-dynamodb${suffix}`)).toBeNull();
      expect(comparisonLinkError(`${prefix}/comparisons/not-a-comparison${suffix}`)).toContain("Missing published comparison");
    }
  });

  it("checks same-origin absolute links and rejects the unsupported /ja prefix", () => {
    expect(comparisonLinkError(`${origin}/zh/comparisons/not-a-comparison?x=1#overview`)).toContain("Missing published comparison");
    expect(comparisonLinkError(`${origin}/en/comparisons/rds-vs-dynamodb#overview`)).toBeNull();
    expect(comparisonLinkError("/ja/comparisons/rds-vs-dynamodb")).toContain("Unsupported Japanese prefix");
    for (const href of ["https://example.com/comparisons/missing", "//example.com/comparisons/missing", "#comparisons/missing", "/en/comparisons", "/terms/ec2"]) {
      expect(comparisonLinkError(href)).toBeNull();
    }
  });

  it("extracts inline, reference, and HTML links but ignores code examples", () => {
    const source = [
      "[Japanese](/comparisons/rds-vs-dynamodb#overview)",
      "[English][comparison]",
      "[comparison]: /en/comparisons/rds-vs-dynamodb?from=article#overview",
      '<a href="/zh/comparisons/rds-vs-dynamodb">Chinese</a>',
      "```md", "[example](/comparisons/not-a-comparison)", "```",
    ].join("\n\n");
    expect(markdownHrefs(source)).toEqual([
      "/comparisons/rds-vs-dynamodb#overview",
      "/en/comparisons/rds-vs-dynamodb?from=article#overview",
      "/zh/comparisons/rds-vs-dynamodb",
    ]);
  });

  it.each(locales)("keeps unknown %s comparisons unavailable to detail pages and static routing", (locale) => {
    expect(getComparisonBySlug(locale, "ec2-vs-lambda-vs-ecs")).toBeNull();
    expect(getComparisonStaticParams(locale)).not.toContainEqual({ comparisonSlug: "ec2-vs-lambda-vs-ecs" });
    expect(getComparisonBySlug(locale, "rds-vs-dynamodb")).not.toBeNull();
  });
});

it("all content MDX comparison links resolve to published articles", () => {
  const errors = filesUnder(contentRoot).filter((filename) => filename.endsWith(".mdx")).flatMap((filename) =>
    markdownHrefs(fs.readFileSync(filename, "utf8")).flatMap((href) => {
      const error = comparisonLinkError(href);
      return error ? [`${path.relative(contentRoot, filename)}: ${error}`] : [];
    }),
  );
  expect(errors).toEqual([]);
});

it.each(["terms", "questions"])("%s comparison associations resolve, including legacy JSON", (kind) => {
  const errors = filesUnder(path.join(contentRoot, kind)).filter((filename) => filename.endsWith(".json")).flatMap((filename) => {
    const locale = (filename.match(/\.(ja|en|zh)\.json$/)?.[1] ?? "ja") as Locale;
    const prefix = locale === "ja" ? "" : `/${locale}`;
    const records: { termId?: string; questionId?: string; comparisonSlugs?: string[]; relatedComparisons?: string[] }[] = JSON.parse(fs.readFileSync(filename, "utf8"));
    return records.flatMap((record) => [...(record.comparisonSlugs ?? []), ...(record.relatedComparisons ?? [])].flatMap((slug) => {
      const error = comparisonLinkError(`${prefix}/comparisons/${slug}`);
      return error ? [`${path.basename(filename)}:${record.termId ?? record.questionId}: ${error}`] : [];
    }));
  });
  expect(errors).toEqual([]);
});

const computeSlug = "aws-compute-ec2-lambda-ecs";
const computeLabels = { ja: "コンピューティング", en: "Compute", zh: "運算" };
const computeSections = {
  ja: ["選択のポイント", "比較表", "試験ガイドと判断のポイント", "実務での使い分け", "よくある誤解", "まとめ", "AWS公式リファレンス"],
  en: ["Selection at a glance", "Comparison table", "Exam guide and decision cues", "How to choose in practice", "Common misconceptions", "Summary", "Official AWS references"],
  zh: ["選擇重點", "比較表", "考綱與判斷重點", "實務選型", "常見誤解", "總結", "AWS 官方參考"],
};

describe("EC2, Lambda and ECS comparison", () => {
  it.each(locales)("registers one %s page with its actual localized source and category", (locale) => {
    const article = getComparisonBySlug(locale, computeSlug);
    expect(article).toMatchObject({
      comparisonId: "cmp-015", slug: computeSlug, category: "Compute", level: "beginner",
      examScopes: ["CLF-C02", "SAA-C03"], services: ["ec2", "lambda", "ecs"],
      tags: ["compute", "ec2", "lambda", "ecs"], priority: "medium", locale, published: true,
    });
    expect(formatCategoryLabel(locale, "Compute")).toBe(computeLabels[locale]);
    expect(getComparisonStaticParams(locale).filter(({ comparisonSlug }) => comparisonSlug === computeSlug)).toHaveLength(1);

    const input = fs.readFileSync(path.join(contentRoot, "comparisons", locale, computeSlug + ".mdx"), "utf8");
    const source = matter(input);
    expect(source.content.trimStart().split(/\r?\n/)[0]).toBe(`# ${article?.title}`);
    if (locale === "ja") {
      expect(source.data).toMatchObject({
        comparisonId: "cmp-015", slug: computeSlug, title: article?.title, description: article?.description,
      });
    } else {
      expect(source.data).toEqual({});
    }
    expect(article?.content).not.toMatch(/^# /m);
    expect([...article!.content.matchAll(/^## (.+)$/gm)].map((entry) => entry[1])).toEqual(computeSections[locale]);
    expect(article?.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article?.updatedAt).toBeUndefined();

    const zhInput = fs.readFileSync(path.join(contentRoot, "comparisons", "zh", computeSlug + ".mdx"), "utf8");
    const sources = markdownHrefs(matter(zhInput).content);
    expect(sources).toHaveLength(12);
    expect(markdownHrefs(source.content)).toEqual(sources);
  });
});
