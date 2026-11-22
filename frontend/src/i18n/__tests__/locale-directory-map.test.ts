import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import * as actualLocales from "@/i18n/locales";

let root: string;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "shared-locale-map-"));
  vi.spyOn(process, "cwd").mockReturnValue(root);
});
afterEach(() => {
  vi.doUnmock("@/i18n/locales");
  vi.resetModules();
  vi.restoreAllMocks();
  fs.rmSync(root, { recursive: true, force: true });
});
it("exports a directory for every supported locale", () => {
  const mapping = (actualLocales as unknown as { LOCALE_DIR_NAMES?: Record<string, string> }).LOCALE_DIR_NAMES;
  expect(mapping).toEqual({ ja: "ja", en: "en", zh: "zh" });
  expect(Object.keys(mapping ?? {}).sort()).toEqual([...actualLocales.locales].sort());
});
it("all three real loaders consume the shared mapping rather than private copies", async () => {
  vi.resetModules();
  // Substitute only the mapping boundary: real loaders and filesystem perform every read.
  vi.doMock("@/i18n/locales", () => ({ ...actualLocales, LOCALE_DIR_NAMES: { ja: "japanese", en: "english", zh: "traditional" } }));
  const blog = await import("@/app/(site)/blog/blog-content-loader");
  const architecture = await import("@/app/(site)/architectures/architecture-content-loader");
  const comparison = await import("@/app/(site)/comparisons/comparison-content-loader");
  for (const domain of ["blog", "architectures", "comparisons"]) {
    for (const directory of ["japanese", "english", "traditional"]) {
      const dir = path.join(root, "contents", domain, directory);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "fixture.mdx"), `${domain}-${directory}`);
    }
  }
  for (const [locale, directory] of [["ja", "japanese"], ["en", "english"], ["zh", "traditional"]] as const) {
    expect.soft(blog.loadBlogContent(locale, "fixture")?.content).toBe(`blog-${directory}`);
    expect.soft(architecture.loadArchitectureContent(locale, "fixture", "Title")).toBe(`architectures-${directory}`);
    expect.soft(comparison.loadComparisonContent(locale, "fixture", "Title")).toBe(`comparisons-${directory}`);
    expect.soft(blog.listBlogContentSlugs(locale)).toEqual(["fixture"]);
    expect.soft(architecture.listArchitectureContentSlugs(locale)).toEqual(["fixture"]);
    expect.soft(comparison.listComparisonContentSlugs(locale)).toEqual(["fixture"]);
  }
});
