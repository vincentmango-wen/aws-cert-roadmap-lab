import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { locales, type Locale } from "@/i18n/locales";
import { blogPosts } from "@/contents/blog/blogPosts";
import { parseFrontmatterBlock, removeLeadingH1 } from "@/app/(site)/blog/blog-content-loader";
import type { ArticleCandidate, ArticleTranslation } from "./types";
import { parseCorrectionNotes } from "./corrections";
export type BlogRegistryEntry = { postId: string; slug: string; publishedAt: string; updatedAt?: string; published: boolean; noIndex?: boolean; category?: string };
type Metadata = Record<string, unknown>;
const text = (value: unknown): string => typeof value === "string" ? value : "";

function readBody(root: string, folder: string, locale: Locale, slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(root, folder, locale, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  // Preserve date strings, rather than allowing YAML to coerce them into Date values.
  const parsed = matter(fs.readFileSync(file, "utf8"), { engines: { yaml: parseFrontmatterBlock } });
  return { data: parsed.data as Metadata, body: parsed.content, sourcePath: file };
}

function translation(meta: Metadata, mdx: ReturnType<typeof readBody>, idKey: string, localizedDisplay: boolean, locale: Locale): ArticleTranslation {
  const explicit = mdx?.data ?? {};
  const id = text(meta[idKey]), slug = text(meta.slug);
  const title = text(localizedDisplay ? explicit.title : meta.title);
  const summary = text(localizedDisplay ? explicit.description : meta.description);
  const conflicts = [idKey, "slug", "publishedAt", "updatedAt"].some((key) =>
    Object.hasOwn(explicit, key) && explicit[key] !== meta[key]);
  const malformedFlag = [meta, explicit].some((record) => ["published", "noIndex"].some((key) =>
    Object.hasOwn(record, key) && typeof record[key] !== "boolean"));
  return {
    id, slug, title, summary, publishedAt: text(meta.publishedAt),
    updatedAt: meta.updatedAt === undefined ? undefined : text(meta.updatedAt),
    published: meta.published === true && explicit.published !== false,
    noIndex: meta.noIndex === true || explicit.noIndex === true,
    bodyPresent: !!mdx && removeLeadingH1(mdx.body, title).trim().length > 0,
    metadataConflict: conflicts || malformedFlag,
    correctionNotes: parseCorrectionNotes(mdx?.body ?? "", locale),
    blogCategory: localizedDisplay ? text(explicit.category ?? meta.category) : undefined,
    sourcePath: mdx?.sourcePath,
  };
}

export function readArticleCandidates(options: { contentsRoot?: string; blogRegistry?: BlogRegistryEntry[] } = {}): ArticleCandidate[] {
  const root = options.contentsRoot ?? (fs.existsSync(path.join(process.cwd(), "contents"))
    ? path.join(process.cwd(), "contents") : path.join(process.cwd(), "frontend", "contents"));
  const candidates: ArticleCandidate[] = (options.blogRegistry ?? blogPosts).map((meta) => {
    const translations: ArticleCandidate["translations"] = {};
    for (const locale of locales) {
      const mdx = readBody(root, "blog", locale, meta.slug);
      if (mdx) translations[locale] = translation(meta, mdx, "postId", true, locale);
    }
    return { kind: "blog", id: meta.postId, slug: meta.slug, translations };
  });
  for (const kind of ["architecture", "comparison"] as const) {
    const folder = `${kind}s`, idKey = `${kind}Id`;
    const grouped = new Map<string, ArticleCandidate>();
    for (const locale of locales) {
      const file = path.join(root, folder, `${folder}.${locale}.json`);
      if (!fs.existsSync(file)) continue;
      const records: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
      if (!Array.isArray(records)) throw new Error(`Expected metadata array: ${file}`);
      for (const meta of records as Metadata[]) {
        const id = text(meta[idKey]), slug = text(meta.slug);
        const candidate = grouped.get(id) ?? { kind, id, slug, translations: {} } as ArticleCandidate;
        if (candidate.translations[locale]) {
          candidate.translations[locale]!.metadataConflict = true;
        } else {
          candidate.translations[locale] = translation(meta, readBody(root, folder, locale, slug), idKey, false, locale);
        }
        grouped.set(id, candidate);
      }
    }
    candidates.push(...grouped.values());
  }
  return candidates;
}
