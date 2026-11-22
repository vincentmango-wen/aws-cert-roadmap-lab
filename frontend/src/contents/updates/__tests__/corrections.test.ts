import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseCorrectionNotes, isSafeNoteHref } from "../corrections";

describe.each([
  ["ja", "訂正内容"], ["en", "Corrections"], ["zh", "更正說明"],
] as const)("%s correction extraction", (locale, heading) => {
  it("preserves complete bullets, inline meaning and sources for separate versions", () => {
    const result = parseCorrectionNotes(`## ${heading}\n\n### 2026-11-09\n\n- Complete **scope** and *limits*, with \`id\`.\n- Second bullet with [source](https://docs.aws.amazon.com/example).\n\nReferences: [FAQ](https://aws.amazon.com/free/).\n\n### 2026-06-07\n\n- Earlier version.\n\n## Unrelated\n\nNot a correction.`, locale);
    expect(result.errors).toEqual([]);
    expect(result.entries.map((entry) => entry.date)).toEqual(["2026-11-09", "2026-06-07"]);
    expect(result.entries[0].blocks).toEqual([
      { type: "list", ordered: false, items: [
        [{ type: "paragraph", children: [
          { type: "text", value: "Complete " }, { type: "strong", children: [{ type: "text", value: "scope" }] },
          { type: "text", value: " and " }, { type: "emphasis", children: [{ type: "text", value: "limits" }] },
          { type: "text", value: ", with " }, { type: "code", value: "id" }, { type: "text", value: "." },
        ] }],
        [{ type: "paragraph", children: [{ type: "text", value: "Second bullet with " }, { type: "link", href: "https://docs.aws.amazon.com/example", children: [{ type: "text", value: "source" }] }, { type: "text", value: "." }] }],
      ] },
      { type: "paragraph", children: [{ type: "text", value: "References: " }, { type: "link", href: "https://aws.amazon.com/free/", children: [{ type: "text", value: "FAQ" }] }, { type: "text", value: "." }] },
    ]);
    expect(JSON.stringify(result)).not.toContain("Not a correction");
  });
  it("does not mistake code-fenced headings for actual correction sections", () => {
    expect(parseCorrectionNotes(`\`\`\`md\n## ${heading}\n### 2026-11-09\n- Example\n\`\`\``, locale)).toEqual({ entries: [], errors: [] });
  });
  it("reads the full real free-tier note and all three source URLs", () => {
    const body = fs.readFileSync(path.join(process.cwd(), "contents/blog", locale, "aws-free-tier-portfolio.mdx"), "utf8");
    const result = parseCorrectionNotes(body, locale);
    const sourceBullet = body.split(/\r?\n/).find((line) => line.startsWith("- ") && (line.includes("FAQ") || line.includes("official FAQ")))!;
    expect(sourceBullet).toBeTruthy();
    expect(result.errors).toEqual([]);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].date).toBe("2026-11-09");
    expect(result.entries[0].blocks[0]).toEqual({ type: "list", ordered: false, items: [[{ type: "paragraph", children: [{ type: "text", value: sourceBullet.slice(2) }] }]] });
    for (const url of ["https://aws.amazon.com/free/free-tier-faqs/", "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html", "https://docs.aws.amazon.com/hands-on/latest/control-your-costs-free-tier-budgets/control-your-costs-free-tier-budgets.html"]) {
      expect(JSON.stringify(result.entries)).toContain(url);
    }
  });
});

it.each([
  "### 2026-02-30\n- Invalid date",
  "### Unknown date\n- Unknown history",
  "### 2026-11-09\n- One\n### 2026-11-09\n- Two",
  "### 2026-11-09\n",
  "### 2026-11-09\n<script>alert(1)</script>",
  "### 2026-11-09\n<Widget />",
  "### 2026-11-09\n- [Unsafe](javascript:alert)",
  "### 2026-11-09\n> Unsupported quote",
  "Undated note before an entry\n### 2026-11-09\n- Actual note",
])("diagnoses malformed or unsupported notes instead of silently losing meaning: %s", (entry) => {
  expect(parseCorrectionNotes(`## Corrections\n\n${entry}`, "en").errors.length).toBeGreaterThan(0);
});

it.each(["javascript:alert(1)", "data:text/html,x", "//evil.example", "/../private", "/%2e%2e/private", "/%252e%252e/private", "/safe\\evil", "/safe\u0000evil", "https://user:password@example.com/"])("rejects unsafe note link %s", (href) => {
  expect(isSafeNoteHref(href)).toBe(false);
});
it.each(["https://docs.aws.amazon.com/example", "http://example.com/reference", "/zh/blog/example"])("accepts safe note link %s", (href) => {
  expect(isSafeNoteHref(href)).toBe(true);
});

it("reads changed body content instead of returning an older parsed version", () => {
  const body = "## Corrections\n\n### 2026-11-09\n\n- Original note.";
  expect(JSON.stringify(parseCorrectionNotes(body, "en"))).toContain("Original note.");
  const changed = body.replace("2026-11-09", "2026-11-10").replace("Original", "Changed");
  const result = parseCorrectionNotes(changed, "en");
  expect(result.entries[0].date).toBe("2026-11-10");
  expect(JSON.stringify(result)).toContain("Changed note.");
  expect(JSON.stringify(result)).not.toContain("Original note.");
});

it("keeps the same body's locale-specific correction headings separate", () => {
  const body = "## Corrections\n\n### 2026-11-09\n\n- English note.\n\n## 更正說明\n\n### 2026-11-09\n\n- 繁中說明。";
  expect(JSON.stringify(parseCorrectionNotes(body, "en"))).toContain("English note.");
  const zh = JSON.stringify(parseCorrectionNotes(body, "zh"));
  expect(zh).toContain("繁中說明。");
  expect(zh).not.toContain("English note.");
  expect(parseCorrectionNotes(body, "ja")).toEqual({ entries: [], errors: [] });
});

it("isolates caller mutations from every subsequent parsed result", () => {
  const body = "## Corrections\n\n### 2026-11-09\n\n- Independent result.";
  const first = parseCorrectionNotes(body, "en");
  const expected = structuredClone(first);
  first.entries[0].blocks.length = 0;
  first.errors.push("caller corruption");
  const second = parseCorrectionNotes(body, "en");
  expect(second).toEqual(expected);
  second.entries.length = 0;
  expect(parseCorrectionNotes(body, "en")).toEqual(expected);
});
