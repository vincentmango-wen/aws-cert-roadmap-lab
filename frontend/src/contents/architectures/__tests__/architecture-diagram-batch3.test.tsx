import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getArchitectureBySlug } from "@/app/(site)/architectures/architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";
import { readArticleCandidates } from "@/contents/updates/article-sources";
import { MarkdownContent } from "@/components/comparisons/MarkdownContent";

const slugs = ["static-site-s3-cloudfront", "serverless-api-basic"] as const;
const locales = ["en", "ja", "zh"] as const;
const staticSiteRelations = [
  ["browser", "cloudfront", "viewer"],
  ["cloudfront", "s3", "origin"],
  ["route53", "cloudfront", "dns"],
  ["acm", "cloudfront", "tls"],
  ["actions", "deploy-role", "deployment"],
  ["deploy-role", "s3", "deployment"],
  ["deploy-role", "cloudfront", "deployment"],
] as const;
const apiRelations = [
  ["browser", "frontend", "form-load"],
  ["browser", "http-api", "submit"],
  ["http-api", "lambda", "invoke"],
  ["lambda", "dynamodb", "write"],
] as const;

describe("issue #348 batch 3 architecture diagrams", () => {
  for (const locale of locales) {
    for (const slug of slugs) {
      const staticSite = slug === "static-site-s3-cloudfront";
      const suffix = locale === "ja" ? "" : `.${locale}`;
      const file = `/images/architectures/${slug}${suffix}.svg`;
      const render = () => {
        const architecture = getArchitectureBySlug(locale, slug);
        expect(architecture).not.toBeNull();
        return renderToStaticMarkup(createElement(ArchitectureDetailContent, { locale, architecture: architecture! }));
      };
      it(`${locale}/${slug} uses exactly its localized SVG in an accessible overflow frame`, () => {
        const html = render();
        const region = html.match(/<div[^>]*role="region"[^>]*>[\s\S]*?<\/div>/)?.[0];
        expect(region).toBeDefined();
        expect(region).toMatch(/aria-label="[^"]+"/);
        expect(region).toContain('tabindex="0"');
        expect(region).toContain("overflow-x-auto");
        expect(region).toContain("focus-visible:ring-2");
        expect(region?.match(/<img /g)).toHaveLength(1);
        expect(region).toContain(`src="${file}"`);
        expect(region).toContain("width:1000px");
        expect(region).toContain("max-width:none");
      });
      it(`${locale}/${slug} publishes the complete flow rather than the raw Mermaid fence`, () => {
        const html = render();
        expect(html).not.toMatch(/```mermaid|flowchart\s+TD|--&gt;/);
        expect(html).toContain("<table");
        expect(html).toContain("AWS Budgets");
        const correctionDates = [...html.matchAll(/<h3[^>]*>(\d{4}-\d{2}-\d{2})<\/h3>/g)].map((match) => match[1]);
        expect(correctionDates).toEqual(["2026-11-19"]);
        const article = readArticleCandidates().find((item) => item.kind === "architecture" && item.slug === slug);
        expect(article?.translations[locale]).toMatchObject({
          publishedAt: "2026-06-01", updatedAt: "2026-11-19", metadataConflict: false,
          correctionNotes: { entries: [expect.objectContaining({ date: "2026-11-19" })], errors: [] },
        });
        if (staticSite) {
          expect(html).toContain("AWS:SourceArn");
          expect(html).toContain("arn:aws:cloudfront::111122223333:distribution/");
          expect(html).toContain("private-content-restricting-access-to-s3.html");
        } else {
          expect(html).toContain("CloudWatch Logs");
          expect(html).toContain("PutItem");
          expect(html).toContain("POST /contact");
          expect(html).toContain("http-api-develop-integrations-lambda.html");
        }
      });
      it(`${locale}/${slug} separates the traffic paths and operational associations`, () => {
        const svg = fs.readFileSync(path.join(process.cwd(), "public", file), "utf8");
        const viewBox = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
        expect(Number(viewBox?.[1])).toBe(1000);
        expect(Number(viewBox?.[2])).toBeLessThan(1000);
        for (const [from, to, relationship] of staticSite ? staticSiteRelations : apiRelations) {
          expect(svg).toContain(`id="${from}"`);
          expect(svg).toContain(`id="${to}"`);
          expect(svg).toContain(`data-from="${from}" data-to="${to}" data-relationship="${relationship}"`);
        }
        if (staticSite) {
          expect(svg).toMatch(/data-relationship="dns"[^>]*stroke-dasharray="2 5"/);
          expect(svg).toMatch(/data-relationship="tls"[^>]*stroke-dasharray="8 5"/);
          expect(svg).toMatch(/data-relationship="deployment"[^>]*stroke-dasharray="12 5"/);
        } else {
          expect(svg).toContain("POST /contact");
          expect(svg).not.toMatch(/data-from="frontend" data-to="http-api"/);
        }
      });
    }
    it(`${locale} preserves ordinary code and does not opt in an unrelated diagram`, () => {
      const code = renderToStaticMarkup(createElement(MarkdownContent, {
        locale,
        content: '```js\nconst threshold = 5;\n```',
      }));
      expect(code).toContain("<pre");
      expect(code).toContain("<code>const threshold = 5;</code>");
      const architecture = getArchitectureBySlug(locale, "ecs-fargate-web-app")!;
      const unchanged = renderToStaticMarkup(createElement(ArchitectureDetailContent, { locale, architecture }));
      expect(unchanged).not.toContain('role="region"');
      expect(unchanged).toMatch(/<img[^>]*class="w-full /);
    });
  }
});
