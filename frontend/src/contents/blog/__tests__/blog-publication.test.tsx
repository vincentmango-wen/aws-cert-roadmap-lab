import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "@/i18n/locales";
import { createLocalizedPath } from "@/i18n/locales";
import { blogPosts } from "../blogPosts";
import { loadBlogContent } from "@/app/(site)/blog/blog-content-loader";
import { getPublishedBlogPosts, getBlogPostBySlug, getBlogStaticParams, createBlogDetailMetadataInput } from "@/app/(site)/blog/blog-detail-data";
import sitemap from "@/app/sitemap";
import { createPageMetadata } from "@/lib/seo";
import { SiteLayout } from "@/components/layout/SiteLayout";

const state = vi.hoisted(() => ({
  registryPublished: true, registryNoIndex: false, pathname: "/blog/aws-cert-roadmap",
  hidden: [] as string[], noIndex: [] as string[], missing: [] as string[],
}));
vi.mock("../blogPosts", async (original) => {
  const actual = await original<typeof import("../blogPosts")>();
  return { get blogPosts() { return [{ ...actual.blogPosts[0], published: state.registryPublished, noIndex: state.registryNoIndex }]; } };
});
vi.mock("@/app/(site)/blog/blog-content-loader", async (original) => {
  const actual = await original<typeof import("@/app/(site)/blog/blog-content-loader")>();
  return { ...actual, loadBlogContent: (locale: Locale, slug: string) => {
    if (state.missing.includes(locale)) return null;
    const loaded = actual.loadBlogContent(locale, slug);
    if (!loaded) throw new Error("Expected existing fixture article: " + slug);
    return { ...loaded, frontmatter: { ...loaded.frontmatter,
      published: !state.hidden.includes(locale), noIndex: state.noIndex.includes(locale),
    } };
  } };
});
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
const locales = ["ja", "en", "zh"] as const;
const origin = "https://www.aws-cert-roadmap-lab.com";
const slug = blogPosts[0].slug;
const basePath = "/blog/" + slug;
const href = (locale: Locale) => origin + createLocalizedPath(locale, basePath);
const codes = { ja: "ja", en: "en", zh: "zh-Hant" };
const languages = (allowed: readonly Locale[]) => Object.fromEntries([
  ...allowed.map((locale) => [codes[locale], href(locale)]),
  ...(allowed.includes("ja") ? [["x-default", href("ja")]] : []),
]);
function entries() { return sitemap().filter((entry) => new URL(entry.url).pathname.endsWith(basePath)); }
function metadata(locale: Locale) { return createPageMetadata(createBlogDetailMetadataInput(locale, slug)); }
function header(locale: Locale) {
  state.pathname = createLocalizedPath(locale, basePath);
  return renderToStaticMarkup(createElement(SiteLayout, null, "Article"));
}
beforeEach(() => {
  state.registryPublished = true; state.registryNoIndex = false;
  state.hidden = []; state.noIndex = []; state.missing = [];
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
});
afterEach(() => vi.unstubAllEnvs());

it("registry unpublished closes every route, list, static param, switch link and sitemap URL", () => {
  state.registryPublished = false;
  expect(entries()).toEqual([]);
  for (const locale of locales) {
    expect(getPublishedBlogPosts(locale)).toEqual([]);
    expect(getBlogStaticParams(locale)).toEqual([]);
    expect(getBlogPostBySlug(locale, slug)).toBeNull();
    expect(metadata(locale).robots).toMatchObject({ index: false });
    expect(metadata(locale).alternates?.languages).toBeUndefined();
    for (const target of locales) expect(header(locale)).not.toContain('href="' + createLocalizedPath(target, basePath) + '"');
  }
});

describe.each(locales)("%s publication", (hidden) => {
  it("hides only the unpublished locale, including x-default when Japanese is hidden", () => {
    state.hidden = [hidden];
    const allowed = locales.filter((locale) => locale !== hidden);
    expect(entries().map((entry) => entry.url).sort()).toEqual(allowed.map(href).sort());
    for (const entry of entries()) expect(entry.alternates?.languages).toEqual(languages(allowed));
    for (const locale of locales) {
      const visible = locale !== hidden;
      expect(getPublishedBlogPosts(locale).some((post) => post.slug === slug)).toBe(visible);
      expect(getBlogStaticParams(locale).some((post) => post.postSlug === slug)).toBe(visible);
      expect(getBlogPostBySlug(locale, slug) !== null).toBe(visible);
      if (visible) {
        expect(metadata(locale).alternates?.languages).toEqual(languages(allowed));
        const html = header(locale);
        expect(html).not.toContain('href="' + createLocalizedPath(hidden, basePath) + '"');
        for (const target of allowed) expect(html).toContain('href="' + createLocalizedPath(target, basePath) + '"');
      }
    }
  });
  it("keeps noIndex routable and selectable while excluding it from SEO clusters", () => {
    state.noIndex = [hidden];
    const allowed = locales.filter((locale) => locale !== hidden);
    expect(getBlogPostBySlug(hidden, slug)).not.toBeNull();
    expect(getBlogStaticParams(hidden)).toEqual([{ postSlug: slug }]);
    expect(metadata(hidden).robots).toMatchObject({ index: false, follow: true });
    expect(entries().map((entry) => entry.url).sort()).toEqual(allowed.map(href).sort());
    for (const entry of entries()) expect(entry.alternates?.languages).toEqual(languages(allowed));
    for (const locale of allowed) {
      expect(metadata(locale).alternates?.languages).toEqual(languages(allowed));
      expect(header(locale)).toContain('href="' + createLocalizedPath(hidden, basePath) + '"');
    }
  });
});

it("does not restore all locales when no language is published", () => {
  state.hidden = [...locales];
  expect(entries()).toEqual([]);
  expect(getPublishedBlogPosts("en")).toEqual([]);
});
it("does not restore all locales when every published language is noIndex", () => {
  state.noIndex = [...locales];
  expect(entries()).toEqual([]);
  for (const locale of locales) expect(getBlogPostBySlug(locale, slug)).not.toBeNull();
});

describe.each(["en", "zh"] as const)("%s existing missing-MDX fallback", (locale) => {
  it.each([false, true])("preserves the Japanese body and registry noIndex=%s", (noIndex) => {
    state.missing = [locale]; state.registryNoIndex = noIndex;
    const post = getBlogPostBySlug(locale, slug);
    expect(post?.content).toBe(loadBlogContent("ja", slug)?.content);
    expect(post?.noIndex).toBe(noIndex);
    expect(getBlogStaticParams(locale)).toEqual([{ postSlug: slug }]);
    expect(metadata(locale).robots).toMatchObject({ index: !noIndex, follow: true });
    expect(entries().some((entry) => entry.url === href(locale))).toBe(!noIndex);
  });
  it("does not change fallback when Japanese is hidden or noIndex", () => {
    state.missing = [locale]; state.hidden = ["ja"]; state.noIndex = ["ja"];
    expect(getBlogPostBySlug(locale, slug)?.content).toBe(loadBlogContent("ja", slug)?.content);
    expect(getBlogPostBySlug(locale, slug)?.noIndex).toBe(false);
    expect(entries().some((entry) => entry.url === href(locale))).toBe(true);
    expect(metadata(locale).alternates?.languages).not.toHaveProperty("ja");
    expect(metadata(locale).alternates?.languages).not.toHaveProperty("x-default");
  });
});
it("retains the existing empty-body fallback if every MDX is absent", () => {
  state.missing = [...locales]; state.registryNoIndex = true;
  for (const locale of locales) expect(getBlogPostBySlug(locale, slug)?.content).toBe("");
  expect(entries()).toEqual([]);
});

// Exercise the real loader defaults, independently of the publication-state doubles above.
it("defaults omitted published to true and preserves explicit false in real MDX", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const actual = await vi.importActual<typeof import("@/app/(site)/blog/blog-content-loader")>("@/app/(site)/blog/blog-content-loader");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "blog-publication-"));
  const mdxDirectory = path.join(directory, "contents", "blog", "en");
  fs.mkdirSync(mdxDirectory, { recursive: true });
  fs.writeFileSync(path.join(mdxDirectory, "default.mdx"), "---\ntitle: Default\n---\nBody");
  fs.writeFileSync(path.join(mdxDirectory, "hidden.mdx"), "---\ntitle: Hidden\npublished: false\n---\nBody");
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(directory);
  try {
    expect(actual.loadBlogContent("en", "default")?.frontmatter.published).toBe(true);
    expect(actual.loadBlogContent("en", "hidden")?.frontmatter.published).toBe(false);
  } finally {
    cwd.mockRestore();
    if (path.dirname(directory) !== path.resolve(os.tmpdir()) || !path.basename(directory).startsWith("blog-publication-")) throw new Error("Unsafe fixture cleanup path");
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
it.each(["/", "/en/blog", "/zh/terms"])("preserves non-detail switch links on %s", (pathname) => {
  state.pathname = pathname;
  const html = renderToStaticMarkup(createElement(SiteLayout, null, "Page"));
  for (const locale of locales) expect(html).toContain('href="' + createLocalizedPath(locale, pathname) + '"');
});
it("normalizes locale prefix, query and hash without restoring a hidden Blog switch target", () => {
  state.hidden = ["en"];
  state.pathname = "/zh/blog/" + slug + "/?source=test#section";
  const html = renderToStaticMarkup(createElement(SiteLayout, null, "Article"));
  expect(html).not.toContain('href="/en/blog/' + slug + '"');
  expect(html).toContain('href="/blog/' + slug + '"');
});
