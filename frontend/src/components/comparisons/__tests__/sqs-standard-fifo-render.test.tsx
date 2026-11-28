import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { MarkdownContent } from "../MarkdownContent";
import { getComparisons } from "@/app/(site)/comparisons/comparison-detail-data";
import { loadComparisonContent } from "@/app/(site)/comparisons/comparison-content-loader";

it.each(["zh", "ja", "en"] as const)("renders the %s SQS candidate as one scrollable diagram with a localized onward link", (locale) => {
  const slug = "sqs-standard-vs-fifo";
  const meta = getComparisons(locale).find((item) => item.slug === slug);
  expect(meta).toBeDefined();
  if (!meta) return;
  const content = loadComparisonContent(locale, slug, meta.title);
  expect(content).not.toBeNull();
  const html = renderToStaticMarkup(<MarkdownContent content={content!} locale={locale} />);
  expect([...html.matchAll(/<pre\b/g)]).toHaveLength(1);
  expect(html).toMatch(/<pre class="[^"]*overflow-x-auto/);
  expect(html).toContain("A1 → A2");
  expect(html).toContain("B1 → B2");
  const prefix = locale === "ja" ? "" : `/${locale}`;
  expect(html).toContain(`href="${prefix}/comparisons/sns-vs-sqs-vs-eventbridge"`);
  expect(html).not.toContain("```text");
  // Optional local-only artifact: exercise the actual renderer without publishing routes.
  if (process.env.ISSUE_386_RENDER_DIR) {
    fs.mkdirSync(process.env.ISSUE_386_RENDER_DIR, { recursive: true });
    fs.writeFileSync(path.join(process.env.ISSUE_386_RENDER_DIR, `${locale}.html`), `<!doctype html><html lang="${locale === "zh" ? "zh-Hant" : locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main><h1>${meta.title}</h1>${html}</main></body></html>`);
  }
});
