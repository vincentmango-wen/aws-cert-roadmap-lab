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
// Stage 2 keeps the existing real-loader/renderer and historical coverage above.
for (const locale of ["ja", "en", "zh"] as const) {
  for (const slug of slugs) {
    it(`${locale}/${slug} provides a horizontal readable diagram frame`, () => {
      const architecture = getArchitectureBySlug(locale, slug)!;
      const html = renderToStaticMarkup(createElement(ArchitectureDetailContent, { locale, architecture }));
      const region = html.match(/<div[^>]*role="region"[^>]*>[\s\S]*?<\/div>/)?.[0];
      expect(region).toBeDefined();
      expect(region).toContain('tabindex="0"');
      expect(region).toMatch(/aria-label="[^"]+"/);
      expect(region).toContain('overflow-x-auto');
      expect(region).toContain('focus-visible:ring-2');
      expect(region?.match(/<img /g)).toHaveLength(1);
      expect(region).toContain('width:1000px');
      expect(region).toContain('max-width:none');
      const suffix = locale === "ja" ? "" : `.${locale}`;
      const svg = fs.readFileSync(path.join(process.cwd(), "public/images/architectures", `${slug}${suffix}.svg`), "utf8");
      const viewBox = svg.match(/viewBox="0 0 (\d+) (\d+)"/)!;
      expect(Number(viewBox[1])).toBe(1000);
      expect(Number(viewBox[1])).toBeGreaterThan(Number(viewBox[2]));
      expect(svg).toContain('font-size="15"');
      // 1440px desktop: 1152 max width - 64 main padding - 50 section - 2 frame = 1036px.
      expect(Number(viewBox[1])).toBeLessThanOrEqual(1036);
      if (slug === "high-availability-web-app") {
        const note = svg.match(/<g id="primary-connection-note">([\s\S]*?)<\/g>/)?.[1];
        expect(note).toBeDefined();
        const baselines = [...note!.matchAll(/y="([\d.]+)"/g)].map((m) => Number(m[1]));
        expect(baselines).toEqual([152, 176]);
      }
      const edges = slug === "cloudwatch-monitoring-basic"
        ? [["user", "cloudfront"], ["user", "api-gateway"], ["cloudfront", "s3"], ["api-gateway", "lambda"], ["lambda", "dynamodb"], ["metric-sources", "metrics"], ["log-source", "logs"], ["budgets", "developer"], ["github", "developer"]]
        : slug === "high-availability-web-app"
          ? [["user", "alb"], ["alb", "ec2-a"], ["alb", "ec2-b"], ["ec2-a", "primary"], ["ec2-b", "primary"], ["primary", "standby"], ["dns", "dns-answer"], ["acm", "tls-listener"]]
          : [["scheduler", "lambda"], ["rule", "lambda"], ["lambda", "dynamodb"], ["logging-lambda", "logs"], ["logs", "log-metrics"], ["lambda-metrics", "alarm"], ["log-metrics", "alarm"], ["notifying-lambda", "destinations"]];
      for (const [from, to] of edges) {
        expect(svg).toContain(`data-from="${from}" data-to="${to}"`);
        expect(svg).toContain(`id="${from}"`);
        expect(svg).toContain(`id="${to}"`);
      }
    });
  }
}
