import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadBlogContent, listBlogContentSlugs } from "@/app/(site)/blog/blog-content-loader";
import { loadArchitectureContent, listArchitectureContentSlugs } from "@/app/(site)/architectures/architecture-content-loader";
import { loadComparisonContent, listComparisonContentSlugs } from "@/app/(site)/comparisons/comparison-content-loader";
import type { Locale } from "@/i18n/locales";

const loaders = [
  { domain: "blog", load: (locale: Locale, slug: string) => loadBlogContent(locale, slug)?.content ?? null, list: listBlogContentSlugs },
  { domain: "architectures", load: (locale: Locale, slug: string) => loadArchitectureContent(locale, slug, "Fixture title"), list: listArchitectureContentSlugs },
  { domain: "comparisons", load: (locale: Locale, slug: string) => loadComparisonContent(locale, slug, "Fixture title"), list: listComparisonContentSlugs },
];
let root: string;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "locale-directory-paths-"));
  vi.spyOn(process, "cwd").mockReturnValue(root);
});
afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(root, { recursive: true, force: true });
});
function fixture(prefix: string, domain: string, locale: string, body: string) {
  const dir = path.join(root, prefix, "contents", domain, locale);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "fixture.mdx"), `---\ntitle: Fixture title\npublished: false\nnoIndex: true\n---\n# Fixture title\n\n${body}\n`);
  fs.writeFileSync(path.join(dir, "ignored.txt"), "not MDX");
}
for (const loader of loaders) {
  describe(loader.domain, () => {
    for (const locale of ["ja", "en", "zh"] as const) {
      it(`loads ${locale} from frontend cwd and preserves body processing`, () => {
        fixture("", loader.domain, locale, `body-${locale}`);
        expect(loader.load(locale, "fixture")).toBe(`body-${locale}`);
        expect(loader.list(locale)).toEqual(["fixture"]);
      });
      it(`loads ${locale} from repository cwd`, () => {
        fixture("frontend", loader.domain, locale, `fallback-${locale}`);
        expect(loader.load(locale, "fixture")).toBe(`fallback-${locale}`);
      });
    }
    it("prefers contents over frontend/contents", () => {
      fixture("", loader.domain, "ja", "first");
      fixture("frontend", loader.domain, "ja", "second");
      expect(loader.load("ja", "fixture")).toBe("first");
    });
    it("does not search the second directory when the first exists but its file is missing", () => {
      fs.mkdirSync(path.join(root, "contents", loader.domain, "ja"), { recursive: true });
      fixture("frontend", loader.domain, "ja", "second");
      expect(loader.load("ja", "fixture")).toBeNull();
    });
    it("retains missing-directory, missing-file and invalid-slug results", () => {
      expect(loader.load("ja", "fixture")).toBeNull();
      expect(loader.list("ja")).toEqual([]);
      fixture("", loader.domain, "ja", "body");
      expect(loader.load("ja", "missing")).toBeNull();
      expect(loader.load("ja", "../fixture")).toBeNull();
    });
  });
}
it("preserves Blog publication and indexing frontmatter", () => {
  fixture("", "blog", "zh", "body");
  expect(loadBlogContent("zh", "fixture")?.frontmatter).toMatchObject({ title: "Fixture title", published: false, noIndex: true });
});
