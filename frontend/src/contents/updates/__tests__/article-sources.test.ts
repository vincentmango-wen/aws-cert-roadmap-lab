import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, expect, it } from "vitest";
import { readArticleCandidates } from "../article-sources";
import { parseFrontmatterBlock } from "@/app/(site)/blog/blog-content-loader";
import { aggregateUpdates } from "../aggregate";
import { isPublishedLocale } from "@/i18n/release-gate";

let root: string;
const registry = [{ postId: "b1", slug: "sample", publishedAt: "2026-11-01", updatedAt: "2026-11-09", published: true }];
const write = (relative: string, text: string) => { const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); };
beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), "updates-source-")); });
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
function seed(kind: "blog" | "architecture" | "comparison", locale: string, extra = "", body = "Actual localized body") {
  const folder = kind === "blog" ? "blog" : `${kind}s`;
  const idKey = kind === "blog" ? "postId" : `${kind}Id`;
  if (kind !== "blog") write(`${folder}/${folder}.${locale}.json`, JSON.stringify([{ [idKey]: "b1", slug: "sample", title: `${locale} title`, description: `${locale} summary`, publishedAt: "2026-11-01", updatedAt: "2026-11-09", published: true }]));
  write(`${folder}/${locale}/sample.mdx`, `---\n${idKey}: b1\nslug: sample\ntitle: ${locale} title\ndescription: ${locale} summary\n${extra}---\n${body}`);
}
const read = () => readArticleCandidates({ contentsRoot: root, blogRegistry: registry });

it("carries each locale's full dated notes and original blog category", () => {
  const headings = { ja: "訂正内容", en: "Corrections", zh: "更正說明" };
  for (const locale of ["ja", "en", "zh"] as const) {
    seed("blog", locale, 'category: "CLF"\n', `Actual body\n\n## ${headings[locale]}\n\n### 2026-11-09\n\n- ${locale} complete note.`);
  }
  const article = read()[0];
  for (const locale of ["ja", "en", "zh"] as const) {
    expect(article.translations[locale]).toMatchObject({
      blogCategory: "CLF",
      correctionNotes: { errors: [], entries: [{ date: "2026-11-09", blocks: [
        { type: "list", ordered: false, items: [[{ type: "paragraph", children: [{ type: "text", value: `${locale} complete note.` }] }]] },
      ] }] },
    });
  }
});

it.each(["blog", "architecture", "comparison"] as const)("reads actual %s translations and bodies", (kind) => {
  for (const locale of ["ja", "en", "zh"]) seed(kind, locale);
  const value = read().find((item) => item.kind === kind)!;
  expect(Object.keys(value.translations)).toHaveLength(3);
  expect(value.translations.en).toMatchObject({ title: "en title", summary: "en summary", bodyPresent: true, publishedAt: "2026-11-01", updatedAt: "2026-11-09" });
});
it("uses blog registry dates but reports explicit MDX disagreement", () => {
  seed("blog", "ja", 'publishedAt: "2026-10-01"\n');
  const translation = read()[0].translations.ja!;
  expect(translation.publishedAt).toBe("2026-11-01");
  expect(translation.metadataConflict).toBe(true);
});
it.each(["blog", "architecture", "comparison"] as const)("preserves %s explicit publication/noindex and empty body", (kind) => {
  seed(kind, "en", "published: false\nnoIndex: true\n", "   ");
  expect(read().find((item) => item.kind === kind)!.translations.en).toMatchObject({ published: false, noIndex: true, bodyPresent: false });
});
it.each(["architecture", "comparison"] as const)("does not supply Japanese fallback for missing %s metadata or body", (kind) => {
  seed(kind, "ja"); seed(kind, "en");
  fs.unlinkSync(path.join(root, `${kind}s/en/sample.mdx`));
  const value = read().find((item) => item.kind === kind)!;
  expect(value.translations.zh).toBeUndefined();
  expect(value.translations.en?.bodyPresent).toBe(false);
});
it("preserves missing blog display fields instead of synthesizing translated copy", () => {
  write("blog/en/sample.mdx", "---\npostId: b1\nslug: sample\n---\nbody");
  expect(read()[0].translations.en).toMatchObject({ title: "", summary: "" });
});

it("reports real-source eligibility with the same IDs and dates in every locale", () => {
  const candidates = readArticleCandidates();
  const inventory = aggregateUpdates({ articles: candidates, announcements: [], today: "2026-11-12", isPublicPath: (_path, locale) => isPublishedLocale(locale) });
  const sequence = (locale: "ja" | "en" | "zh") => inventory.itemsByLocale[locale].map(({ id, date }) => ({ id, date }));
  expect(candidates.length).toBeGreaterThan(0);
  expect(sequence("en")).toEqual(sequence("ja"));
  expect(sequence("zh")).toEqual(sequence("ja"));
  console.info("Real-source updates diagnostics", JSON.stringify({ candidates: candidates.length, eligible: sequence("ja").length, diagnostics: inventory.diagnostics }));
});

// A lost final frontmatter key must neither hide a real date conflict nor
// change eligibility merely because Git or the checkout uses different EOLs.
it.each([
  ["LF, no terminal newline", "\n", ""],
  ["LF, terminal newline", "\n", "\n"],
  ["CRLF, no terminal newline", "\r\n", ""],
  ["CRLF, terminal newline", "\r\n", "\r\n"],
  ["gray-matter terminal CR", "\r\n", "\r"],
])("preserves the final date and existing scalar/list values: %s", (_name, eol, ending) => {
  const input = ['title: "Example"', 'published: true', 'tags:', '  - "aws"', '  - "study"', 'updatedAt: "2026-06-21"'].join(eol) + ending;
  expect(parseFrontmatterBlock(input)).toEqual({ title: "Example", published: true, tags: ["aws", "study"], updatedAt: "2026-06-21" });
});

for (const kind of ["blog", "architecture", "comparison"] as const) {
  for (const [eolName, eol] of [["LF", "\n"], ["CRLF", "\r\n"]] as const) {
    for (const terminalNewline of [false, true]) {
      it.each([
        ["matching", "2026-11-09", false, 1],
        ["conflicting", "2026-11-08", true, 0],
      ] as const)(`${kind} ${eolName} terminalNewline=${terminalNewline} keeps %s final dates observable through the reader`, (_label, date, conflict, count) => {
        for (const locale of ["ja", "en", "zh"] as const) {
          seed(kind, locale, `updatedAt: "${date}"\n`);
          const file = path.join(root, kind === "blog" ? "blog" : `${kind}s`, locale, "sample.mdx");
          const source = fs.readFileSync(file, "utf8").replace(/\r?\n/g, eol) + (terminalNewline ? eol : "");
          fs.writeFileSync(file, source);
        }
        const candidate = read().find((item) => item.kind === kind)!;
        for (const locale of ["ja", "en", "zh"] as const) {
          expect(candidate.translations[locale]).toMatchObject({ updatedAt: "2026-11-09", metadataConflict: conflict });
        }
        const inventory = aggregateUpdates({ articles: [candidate], announcements: [], today: "2026-11-13", isPublicPath: () => true });
        for (const locale of ["ja", "en", "zh"] as const) expect(inventory.itemsByLocale[locale]).toHaveLength(count);
        if (conflict) expect(inventory.diagnostics).toContainEqual(expect.objectContaining({ code: "metadata-conflict", id: `${kind}:b1` }));
      });
    }
  }
}
