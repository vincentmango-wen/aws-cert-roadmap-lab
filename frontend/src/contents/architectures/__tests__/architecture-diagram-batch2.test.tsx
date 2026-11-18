import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { getArchitectureBySlug } from "@/app/(site)/architectures/architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";
import { MarkdownContent } from "@/components/comparisons/MarkdownContent";
import { getUpdatesInventory, selectLatestArticles } from "@/contents/updates";
import { readArticleCandidates } from "@/contents/updates/article-sources";

afterEach(() => vi.unstubAllEnvs());
const slugs = ["sqs-lambda-async-processing", "sns-sqs-fanout"] as const;
// Catch raw diagram-code leakage and missing localized assets at the real reader boundary.
for (const locale of ["ja", "en", "zh"] as const) {
  for (const slug of slugs) {
    it(`${locale}/${slug} renders a static diagram and readable flow tables`, () => {
      const architecture = getArchitectureBySlug(locale, slug);
      expect(architecture).not.toBeNull();
      const html = renderToStaticMarkup(createElement(ArchitectureDetailContent, { locale, architecture: architecture! }));
      const imagePath = `/images/architectures/${slug}${locale === "ja" ? "" : `.${locale}`}.svg`;
      expect(html).toContain(`src="${imagePath}"`);
      expect(fs.existsSync(path.join(process.cwd(), "public", imagePath))).toBe(true);
      expect(html).not.toMatch(/flowchart\s+TD|```mermaid|--&gt;/);
      expect(html).toContain("<table");
      const correctionHeading = { ja: "訂正内容", en: "Corrections", zh: "更正說明" }[locale];
      expect(html).toMatch(new RegExp(`<h2[^>]*>${correctionHeading}</h2>`));
      expect(html).toContain("sqs:ReceiveMessage");
      expect(html).toContain("sqs:DeleteMessage");
      expect(html).toContain("sqs:GetQueueAttributes");
      if (slug === "sns-sqs-fanout") {
        expect(html).toContain("sns:Publish");
        expect(html).toContain("sqs:SendMessage");
        expect(html).toContain("aws:SourceArn");
      }
    });
  }
  it(`${locale} retains normal fenced code`, () => {
    const html = renderToStaticMarkup(createElement(MarkdownContent, { locale, content: '```js\nconst count = 3;\n```' }));
    expect(html).toContain("<pre");
    expect(html).toContain("<code>const count = 3;</code>");
  });
  it(`${locale} exposes both current corrections without losing history or Blog recommendations`, () => {
    vi.stubEnv("UPDATES_BUILD_DATE", "2026-11-18");
    const inventory = getUpdatesInventory();
    const values = inventory.itemsByLocale[locale];
    expect(values).toHaveLength(53);
    expect(values.slice(0, 2).map((entry) => entry.id)).toEqual(["architecture:arc-007", "architecture:arc-008"]);
    for (const entry of values.slice(0, 2)) {
      expect(entry).toMatchObject({ publishedAt: "2026-06-08", date: "2026-11-18", eventKind: "update", changeNotes: { status: "available", entry: { date: "2026-11-18" } } });
    }
    expect(selectLatestArticles(values).map((entry) => entry.id)).toEqual(["blog:blog-002", "blog:blog-008", "blog:blog-015"]);
    const articles = readArticleCandidates();
    for (const [index, id] of ["arc-007", "arc-008"].entries()) {
      const article = articles.find((value) => value.kind === "architecture" && value.id === id)!;
      expect(article.slug).toBe(slugs[index]);
      expect(article.translations[locale]).toMatchObject({ publishedAt: "2026-06-08", updatedAt: "2026-11-18", metadataConflict: false });
      expect(article.translations[locale]!.correctionNotes!.errors).toEqual([]);
    }
    const notes = articles.find((article) => article.id === "arc-007")!.translations[locale]!.correctionNotes!;
    expect(notes.entries.map((entry) => entry.date).sort()).toEqual(["2026-11-09", "2026-11-18"]);
  });
}
