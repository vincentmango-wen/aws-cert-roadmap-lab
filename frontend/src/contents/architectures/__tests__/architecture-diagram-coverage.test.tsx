import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getArchitectureBySlug } from "@/app/(site)/architectures/architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";
import { MarkdownContent } from "@/components/comparisons/MarkdownContent";

import { getUpdatesInventory, selectLatestArticles } from "@/contents/updates";

import * as articleSources from "@/contents/updates/article-sources";
import { beforeIssue348Batch2Corrections } from "@/contents/updates/__tests__/fixtures/architecture-dates-before-issue-348-batch2";

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

const slugs = [
  "cloudwatch-monitoring-basic",
  "high-availability-web-app",
  "eventbridge-lambda-batch",
] as const;

// Exercise the published article loader and renderer, not a mock or source grep.
// Diagram semantics and readability additionally require independent visual review.
describe("batch 1 architecture diagrams", () => {
  for (const locale of ["ja", "en", "zh"] as const) {
    for (const slug of slugs) {
      it(`${locale}/${slug} renders its localized image without exposing diagram code`, () => {
        const architecture = getArchitectureBySlug(locale, slug);
        expect(architecture).not.toBeNull();
        const html = renderToStaticMarkup(
          createElement(ArchitectureDetailContent, { locale, architecture: architecture! }),
        );
        const suffix = locale === "ja" ? "" : `.${locale}`;
        const imagePath = `/images/architectures/${slug}${suffix}.svg`;
        expect(html).toContain(`src="${imagePath}"`);
        expect(fs.existsSync(path.join(process.cwd(), "public", imagePath))).toBe(true);
        expect(html).not.toMatch(/flowchart\s+TD|```mermaid|--&gt;/);
      });
    }
    it(`${locale} preserves ordinary fenced code in the shared renderer`, () => {
      const html = renderToStaticMarkup(createElement(MarkdownContent, {
        locale,
        content: '```js\nconst threshold = 5;\n```',
      }));
      expect(html).toContain("<pre");
      expect(html).toContain("<code>const threshold = 5;</code>");
    });
  }
});

it.each(["ja", "en", "zh"] as const)("%s publishes the three dated corrections without changing Blog recommendations", (locale) => {
  vi.stubEnv("UPDATES_BUILD_DATE", "2026-11-17");
  const historical = beforeIssue348Batch2Corrections(articleSources.readArticleCandidates());
  vi.spyOn(articleSources, "readArticleCandidates").mockReturnValue(historical);
  const inventory = getUpdatesInventory();
  const values = inventory.itemsByLocale[locale];
  expect(values).toHaveLength(53);
  expect(values.slice(0, 3).map((entry) => entry.id)).toEqual([
    "architecture:arc-004", "architecture:arc-005", "architecture:arc-010",
  ]);
  for (const entry of values.slice(0, 3)) {
    expect(entry).toMatchObject({ date: "2026-11-17", eventKind: "update", changeNotes: { status: "available", entry: { date: "2026-11-17" } } });
  }
  expect(selectLatestArticles(values).map((entry) => entry.id)).toEqual([
    "blog:blog-002", "blog:blog-008", "blog:blog-015",
  ]);
});