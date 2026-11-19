import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getArchitectureBySlug } from "@/app/(site)/architectures/architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";
import { readArticleCandidates } from "@/contents/updates/article-sources";

const date = "2026-11-19";
const plan = {
  "ecs-fargate-web-app": [
    ["client", "alb", "https"],
    ["client", "route53", "dns"],
    ["acm", "alb", "tls"],
    ["alb", "target-group", "forward"],
    ["target-group", "task-a", "forward"],
    ["target-group", "task-b", "forward"],
    ["ecs", "task-a", "schedule"],
    ["ecs", "task-b", "schedule"],
  ],
  "private-subnet-vpc-endpoint": [
    ["client", "alb", "ingress"],
    ["alb", "app", "ingress"],
    ["app", "s3-gateway-endpoint", "s3-route"],
    ["app", "ddb-gateway-endpoint", "ddb-route"],
    ["s3-gateway-endpoint", "s3", "s3-route"],
    ["ddb-gateway-endpoint", "dynamodb", "ddb-route"],
  ],
  "three-tier-vpc": [
    ["client", "igw", "https"],
    ["igw", "alb", "https"],
    ["alb", "app-a", "forward"],
    ["alb", "app-b", "forward"],
    ["app-a", "database-endpoint", "db"],
    ["app-b", "database-endpoint", "db"],
    ["database-endpoint", "primary", "db"],
    ["primary", "standby", "replicate"],
  ],
} as const;
const slugs = Object.keys(plan) as (keyof typeof plan)[];

describe("issue #348 final architecture diagrams", () => {
  for (const locale of ["ja", "en", "zh"] as const) {
    for (const slug of slugs) {
      const suffix = locale === "ja" ? "" : `.${locale}`;
      const image = `/images/architectures/${slug}${suffix}.svg`;
      it(`${locale}/${slug} renders the localized diagram and recognized dated correction without Mermaid`, () => {
        const data = getArchitectureBySlug(locale, slug);
        expect(data).not.toBeNull();
        const html = renderToStaticMarkup(createElement(ArchitectureDetailContent, { locale, architecture: data! }));
        const region = html.match(/<div[^>]*role="region"[^>]*>[\s\S]*?<\/div>/)?.[0];
        expect(region).toMatch(/aria-label="[^"]+"/);
        expect(region).toContain('tabindex="0"');
        expect(region).toContain("overflow-x-auto");
        expect(region).toContain("focus-visible:ring-2");
        expect(region?.match(/<img /g)).toHaveLength(1);
        expect(region).toContain(`src="${image}"`);
        expect(region).toContain("width:1000px;max-width:none");
        expect(html).not.toMatch(/flowchart\s+TD|```mermaid|--&gt;/);
        expect(html).toContain("<table");
        const article = readArticleCandidates().find((item) => item.kind === "architecture" && item.slug === slug);
        expect(article?.translations[locale]).toMatchObject({
          updatedAt: date, metadataConflict: false,
          correctionNotes: { entries: [expect.objectContaining({ date })], errors: [] },
        });
      });
      it(`${locale}/${slug} separates route, configuration and auxiliary relationships`, () => {
        const svg = fs.readFileSync(path.join(process.cwd(), "public", image), "utf8");
        expect(svg).toMatch(/viewBox="0 0 1000 [1-9]\d{2}"/);
        for (const [from, to, relationship] of plan[slug]) {
          expect(svg).toContain(`id="${from}"`);
          expect(svg).toContain(`id="${to}"`);
          expect(svg).toContain(`data-from="${from}" data-to="${to}" data-relationship="${relationship}"`);
        }
        if (slug === "ecs-fargate-web-app") {
          expect(svg).not.toMatch(/data-from="route53" data-to="alb" data-relationship="https"/);
          expect(svg).toMatch(/data-relationship="dns"[^>]*stroke-dasharray=/);
          expect(svg).toMatch(/data-relationship="tls"[^>]*stroke-dasharray=/);
          expect(svg).toMatch(/data-relationship="schedule"[^>]*stroke-dasharray=/);
        } else if (slug === "private-subnet-vpc-endpoint") {
          expect(svg).not.toMatch(/data-from="(?:nat|igw)"|data-to="(?:nat|igw)"/);
          expect(svg).not.toContain('data-from="s3-gateway-endpoint" data-to="dynamodb"');
          expect(svg).not.toContain('data-from="ddb-gateway-endpoint" data-to="s3"');
        } else {
          expect(svg.match(/data-to="standby"/g)).toHaveLength(1);
          expect(svg).toMatch(/data-relationship="replicate"[^>]*stroke-dasharray=/);
        }
      });
    }
  }
  it("leaves no raw Mermaid block in any published architecture locale source", () => {
    for (const locale of ["ja", "en", "zh"] as const) {
      const dir = path.join(process.cwd(), "contents", "architectures", locale);
      for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".mdx"))) {
        expect(fs.readFileSync(path.join(dir, file), "utf8"), `${locale}/${file}`).not.toMatch(/^```mermaid/m);
      }
    }
  });
});
