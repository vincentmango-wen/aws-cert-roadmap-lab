import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { blogPosts } from "../blog/blogPosts";
import { assertArticleInventory, type ArticleIdentity } from "./article-contract";
import baseline from "./baseline-article-identities.json";
import approvals from "./approved-article-additions.json";

const root = path.resolve(__dirname, "../../..");
const locales = ["ja", "en", "zh"] as const;
type Locale = typeof locales[number];

describe("reviewed article inventories", () => {
  for (const kind of ["blog", "architectures", "comparisons"] as const) {
    it(`${kind}: preserves historical ID/slug pairs, approved growth and complete translations`, () => {
      const inventories = {} as Record<Locale, ArticleIdentity[]>;
      for (const locale of locales) {
        const directory = path.join(root, "contents", kind, locale);
        const slugs = fs.readdirSync(directory).filter(f => f.endsWith(".mdx")).map(f => f.slice(0, -4)).sort();
        if (kind === "blog") {
          inventories[locale] = slugs.map(slug => {
            const { data, content } = matter(fs.readFileSync(path.join(directory, `${slug}.mdx`), "utf8"));
            expect(content.trim().length).toBeGreaterThan(0);
            expect(data.slug).toBe(slug);
            return { id: data.postId, slug };
          });
          expect(slugs).toEqual(blogPosts.map(p => p.slug).sort());
        } else {
          const registry: Record<string, string>[] = JSON.parse(fs.readFileSync(path.join(root, "contents", kind, `${kind}.${locale}.json`), "utf8"));
          inventories[locale] = registry.map(entry => ({ id: entry[kind === "architectures" ? "architectureId" : "comparisonId"], slug: entry.slug }));
          expect(slugs).toEqual(registry.map(entry => entry.slug).sort());
          for (const slug of slugs) expect(fs.readFileSync(path.join(directory, `${slug}.mdx`), "utf8").trim().length).toBeGreaterThan(0);
        }
      }
      assertArticleInventory(baseline[kind], approvals[kind], inventories);
      if (kind === "blog") assertArticleInventory(baseline.blog, approvals.blog, {
        ...inventories, ja: blogPosts.map(p => ({ id: p.postId, slug: p.slug })),
      });
    });
  }
});
