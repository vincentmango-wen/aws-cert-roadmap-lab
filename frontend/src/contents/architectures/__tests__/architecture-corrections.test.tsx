import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getArchitectureBySlug } from "@/app/(site)/architectures/architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";
import { MarkdownContent } from "@/components/comparisons/MarkdownContent";
import type { ArchitectureLocale } from "@/types/architecture";

const titles = { ja: "訂正内容", en: "Corrections", zh: "更正說明" } as const;
const sample = "high-availability-web-app";

function render(locale: ArchitectureLocale, content?: string): string {
  const architecture = getArchitectureBySlug(locale, sample)!;
  return renderToStaticMarkup(createElement(ArchitectureDetailContent, {
    locale,
    architecture: content === undefined ? architecture : { ...architecture, content },
  }));
}

function correctionRegion(html: string): string {
  return html.match(/<section[^>]*aria-labelledby="architecture-corrections"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";
}

describe("architecture correction disclosure", () => {
  for (const locale of ["ja", "en", "zh"] as const) {
    it(`${locale} renders the real newest correction fully and the previous one closed`, () => {
      const region = correctionRegion(render(locale));
      expect(region).toContain(`id="architecture-corrections">${titles[locale]}</h2>`);
      expect(region).toContain('<time dateTime="2026-11-19">2026-11-19</time>');
      const [latest, old] = region.split("<details");
      expect(latest).toContain("https://docs.aws.amazon.com/elasticloadbalancing/latest/application/https-listener-certificates.html");
      expect(old).toBeDefined();
      expect(old).toMatch(/^ class="[^"]+">/);
      expect(old).toContain('<time dateTime="2026-11-17">2026-11-17</time></summary>');
      expect(old).toContain("https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html");
      expect(region.match(/<details/g)).toHaveLength(1);
    });
  }

  it("sorts a mixed-order valid section, preserves original text and links, and preserves content position", () => {
    const content = [
      "## Before corrections", "Before body.", "## Corrections",
      "### 2025-01-02", "The first correction.",
      "- Prior body with **bold** and `code`.", "[Prior source](https://example.com/first)",
      "### 2025-08-12", "Newest body.", "[Latest source](https://example.com/new)",
      "### 2025-04-03", "The middle correction.",
      "## After corrections", "After body.",
    ].join("\n\n");
    const html = render("en", content);
    const region = correctionRegion(html);
    expect([...region.matchAll(/<time dateTime="([^"]+)"/g)].map((m) => m[1]))
      .toEqual(["2025-08-12", "2025-04-03", "2025-01-02"]);
    expect(region.match(/<details class="[^"]+">/g)).toHaveLength(2);
    expect(region).not.toMatch(/<details[^>]*(?:\bopen\b|\bname=)/);
    expect(region.match(/<summary class="[^"]*focus-visible:[^"]*">/g)).toHaveLength(2);
    expect(region).toContain("<strong");
    expect(region).toContain("<code");
    expect(region).toContain('href="https://example.com/first"');
    expect(region).toContain('href="https://example.com/new"');
    expect(region).toContain("The middle correction.");
    expect(html.indexOf("Before body.")).toBeLessThan(html.indexOf(region));
    expect(html.indexOf("After body.")).toBeGreaterThan(html.indexOf(region));
  });

  it("preserves a singleton and ignores correction-looking text inside a code fence", () => {
    const one = "## Corrections\n\n### 2025-05-01\n\nOnly correction. [Reference](https://example.com/).";
    const expected = renderToStaticMarkup(createElement(MarkdownContent, { content: one, locale: "en" }));
    expect(render("en", one)).toContain(expected);
    const fenced = "```text\n## Corrections\n### 2025-05-01\nKeep this line in code.\n```";
    const document = render("en", fenced);
    expect(document).toContain("<pre");
    expect(document).toContain("Keep this line in code.");
    expect(correctionRegion(document)).toBe("");
  });

  it("does not invent an empty section and suppresses a bare recognized empty heading", () => {
    expect(correctionRegion(render("en", "## Overview\n\nNo corrections."))).toBe("");
    const empty = "## First\n\nPreserve first.\n\n## Corrections\n\n## Last\n\nPreserve last.";
    const document = render("en", empty);
    expect(document).not.toMatch(/>Corrections<|<details/);
    expect(document).toContain("Preserve first.");
    expect(document).toContain("Preserve last.");
  });

  it.each([
    ["unrecognized heading", "## Correction records\n\n### 2025-10-03\n\nOld style.\n\n### 2025-03-01\n\nOther."],
    ["undated preface", "## Corrections\n\nNon-heading context.\n\n### 2025-04-03\n\nOld."],
    ["duplicate dates", "## Corrections\n\n### 2025-04-03\n\nOne.\n\n### 2025-04-03\n\nTwo."],
    ["invalid date", "## Corrections\n\n### 2025-02-30\n\nLegacy text.\n\n### 2025-01-01\n\nOther."],
    ["missing body", "## Corrections\n\n### 2025-05-03\n\n### 2025-04-03\n\nOther."],
    ["noncanonical source heading", "## Corrections ##\n\n### 2025-05-03\n\nFirst.\n\n### 2025-04-03\n\nSecond."],
    ["unsupported body", "## Corrections\n\n### 2025-07-04\n\n> An old blockquote.\n\n### 2025-04-03\n\nOther."],
    ["duplicate sections", "## Corrections\n\n### 2025-06-03\n\nFirst.\n\n## Corrections\n\n### 2025-04-03\n\nSecond."],
  ])("preserves the entire original body for %s rather than dropping history", (_, content) => {
    const original = renderToStaticMarkup(createElement(MarkdownContent, { content, locale: "en" }));
    const document = render("en", content);
    expect(document).toContain(original);
    expect(document).not.toContain("<details");
  });
});
