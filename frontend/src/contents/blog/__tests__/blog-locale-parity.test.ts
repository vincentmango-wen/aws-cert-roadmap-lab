/**
 * blog-locale-parity.test.ts
 *
 * 設計書 P5-050 §6 の invariant test (scaffold 対応).
 *
 * `frontend/contents/blog/{ja,en,zh}/<slug>.mdx` と `src/contents/blog/blogPosts.ts`
 * registry が、翻訳追加忘れ・slug ズレ・メタデータ不整合・MDX 消失なしに 3 言語
 * 完全並列で維持されていることを構造的に担保する。
 *
 * 検証 invariant:
 *  (R) registry の slug 集合 = ja MDX の slug 集合 (常時発火 / 25 件)
 *  (1) ja/en/zh MDX の slug 集合が完全一致 (en/zh が空でないときのみ)
 *  (2) 同 slug で postId が ja/en/zh 一致
 *  (3) 同 slug で publishedAt/updatedAt/category/published が ja/en/zh 一致
 *      (title / description / tags / targetKeywords は翻訳対象のため除外)
 *  (4) 全 slug について {ja,en,zh}/<slug>.mdx が fs.existsSync = true
 *  (5) 各 MDX の frontmatter に必須フィールドが存在 (非空)
 *  (6) MDX 先頭 H1 が frontmatter title と一致 or title.startsWith(h1Text)
 *
 * scaffold モード (en/zh いずれかが空配列) は将来 locale 追加直後の中間状態
 * (翻訳追加前) を build 落ちさせない安全弁として残置. (R) と ja 単独 invariant は
 * scaffold モードでも常時発火させる.
 */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { blogPosts } from "../blogPosts";

const FRONTEND_ROOT = path.resolve(__dirname, "../../../../");

const mdxDirFor = (locale: "ja" | "en" | "zh"): string =>
  path.join(FRONTEND_ROOT, "contents", "blog", locale);

const mdxPathFor = (locale: "ja" | "en" | "zh", slug: string): string =>
  path.join(mdxDirFor(locale), `${slug}.mdx`);

function listSlugs(locale: "ja" | "en" | "zh"): string[] {
  const dir = mdxDirFor(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""))
    .sort();
}

type ParsedFrontmatter = {
  postId?: string;
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  tags: string[];
  targetKeywords: string[];
  author?: string;
  published?: boolean;
  noIndex?: boolean;
  publishedAt?: string;
  updatedAt?: string;
};

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(rawFile: string): ParsedFrontmatter | null {
  const m = rawFile.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;

  const text = m[1] ?? "";
  const lines = text.split(/\r?\n/);

  const result: ParsedFrontmatter = {
    tags: [],
    targetKeywords: [],
  };

  let currentListKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    const listItemMatch = line.match(/^\s*-\s+(.+)$/);
    if (listItemMatch && currentListKey) {
      const value = stripQuotes(listItemMatch[1]);
      if (currentListKey === "tags") result.tags.push(value);
      else if (currentListKey === "targetKeywords")
        result.targetKeywords.push(value);
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyValueMatch) continue;

    const key = keyValueMatch[1];
    const rawValue = keyValueMatch[2];

    if (rawValue.trim() === "") {
      currentListKey = key;
      continue;
    }

    currentListKey = null;
    const value = stripQuotes(rawValue);

    if (key === "published" || key === "noIndex") {
      (result as Record<string, unknown>)[key] = value === "true";
    } else {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}

function extractFirstH1(body: string): string | null {
  const lines = body.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (line.length === 0) continue;
    const h1 = line.match(/^#\s+(.+)$/);
    return h1 ? h1[1].trim() : null;
  }
  return null;
}

function loadFrontmatterAndBody(
  locale: "ja" | "en" | "zh",
  slug: string,
): { fm: ParsedFrontmatter; body: string } | null {
  const filePath = mdxPathFor(locale, slug);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const fm = parseFrontmatter(raw);
  if (!fm) return null;

  const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
  const body = (m?.[1] ?? "").trim();

  return { fm, body };
}

const jaSlugs = listSlugs("ja");
const enSlugs = listSlugs("en");
const zhSlugs = listSlugs("zh");

const registrySlugs = blogPosts.map((post) => post.slug).sort();

const isScaffoldMode = enSlugs.length === 0 || zhSlugs.length === 0;

describe("blog locale parity", () => {
  it("(R) registry slug set equals ja MDX slug set (25 entries)", () => {
    expect(new Set(registrySlugs)).toEqual(new Set(jaSlugs));
    expect(registrySlugs.length).toBe(25);
    expect(jaSlugs.length).toBe(25);
  });

  it("(scaffold) every ja MDX file exists and parses with frontmatter", () => {
    for (const slug of jaSlugs) {
      const result = loadFrontmatterAndBody("ja", slug);
      expect(result, `ja MDX failed to parse: ${slug}`).not.toBeNull();
    }
  });

  it("(scaffold) every ja MDX frontmatter has required non-empty fields", () => {
    const required: Array<keyof ParsedFrontmatter> = [
      "postId",
      "slug",
      "title",
      "description",
      "category",
      "publishedAt",
      "updatedAt",
    ];

    for (const slug of jaSlugs) {
      const result = loadFrontmatterAndBody("ja", slug);
      expect(result).not.toBeNull();
      const fm = result!.fm;

      for (const field of required) {
        const value = fm[field];
        expect(
          typeof value === "string" && value.length > 0,
          `ja MDX missing or empty "${String(field)}" for slug=${slug}`,
        ).toBe(true);
      }

      expect(
        fm.tags.length,
        `ja MDX has empty tags for slug=${slug}`,
      ).toBeGreaterThan(0);

      expect(
        fm.slug,
        `ja MDX slug field does not match filename for slug=${slug}`,
      ).toBe(slug);
    }
  });

  it("(scaffold) every ja MDX H1 matches frontmatter title (or title.startsWith(h1))", () => {
    for (const slug of jaSlugs) {
      const result = loadFrontmatterAndBody("ja", slug);
      expect(result).not.toBeNull();
      const { fm, body } = result!;
      const h1 = extractFirstH1(body);
      expect(h1, `MDX first H1 missing slug=${slug}`).not.toBeNull();
      const ok = h1 === fm.title || (fm.title ?? "").startsWith(h1!);
      expect(
        ok,
        `MDX H1 vs title mismatch slug=${slug} h1="${h1}" title="${fm.title}"`,
      ).toBe(true);
    }
  });

  it.skipIf(isScaffoldMode)(
    "(1) ja/en/zh MDX have the same slug set",
    () => {
      expect(new Set(enSlugs)).toEqual(new Set(jaSlugs));
      expect(new Set(zhSlugs)).toEqual(new Set(jaSlugs));
    },
  );

  it.skipIf(isScaffoldMode)(
    "(2) postId is identical across ja/en/zh per slug",
    () => {
      for (const slug of jaSlugs) {
        const ja = loadFrontmatterAndBody("ja", slug);
        const en = loadFrontmatterAndBody("en", slug);
        const zh = loadFrontmatterAndBody("zh", slug);
        expect(ja, `ja missing for slug=${slug}`).not.toBeNull();
        expect(en, `en missing for slug=${slug}`).not.toBeNull();
        expect(zh, `zh missing for slug=${slug}`).not.toBeNull();
        expect(en!.fm.postId).toBe(ja!.fm.postId);
        expect(zh!.fm.postId).toBe(ja!.fm.postId);
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(3) shared metadata fields (publishedAt/updatedAt/published) are identical across ja/en/zh per slug",
    () => {
      // category は ja="AWSサービス解説" / en="AWS Services" / zh="AWS 服務解說" のように
      // locale 別に翻訳されるため、title/description/tags と同様に除外する。
      const SHARED_FIELDS: Array<keyof ParsedFrontmatter> = [
        "publishedAt",
        "updatedAt",
        "published",
      ];

      for (const slug of jaSlugs) {
        const ja = loadFrontmatterAndBody("ja", slug);
        const en = loadFrontmatterAndBody("en", slug);
        const zh = loadFrontmatterAndBody("zh", slug);
        expect(ja).not.toBeNull();
        expect(en).not.toBeNull();
        expect(zh).not.toBeNull();

        for (const field of SHARED_FIELDS) {
          expect(
            en!.fm[field],
            `field "${String(field)}" mismatch between ja and en for slug=${slug}`,
          ).toEqual(ja!.fm[field]);
          expect(
            zh!.fm[field],
            `field "${String(field)}" mismatch between ja and zh for slug=${slug}`,
          ).toEqual(ja!.fm[field]);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(4) every {ja,en,zh}/<slug>.mdx exists on disk",
    () => {
      for (const slug of jaSlugs) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const filePath = mdxPathFor(locale, slug);
          expect(
            fs.existsSync(filePath),
            `MDX missing: ${path.relative(FRONTEND_ROOT, filePath)}`,
          ).toBe(true);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(5) every {ja,en,zh} MDX frontmatter has required non-empty fields",
    () => {
      const required: Array<keyof ParsedFrontmatter> = [
        "postId",
        "slug",
        "title",
        "description",
        "category",
        "publishedAt",
        "updatedAt",
      ];

      for (const slug of jaSlugs) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const result = loadFrontmatterAndBody(locale, slug);
          expect(
            result,
            `MDX missing for slug=${slug} locale=${locale}`,
          ).not.toBeNull();
          const fm = result!.fm;
          for (const field of required) {
            const value = fm[field];
            expect(
              typeof value === "string" && value.length > 0,
              `frontmatter "${String(field)}" empty for slug=${slug} locale=${locale}`,
            ).toBe(true);
          }
          expect(
            fm.tags.length,
            `tags empty for slug=${slug} locale=${locale}`,
          ).toBeGreaterThan(0);
        }
      }
    },
  );

  it.skipIf(isScaffoldMode)(
    "(6) MDX H1 matches frontmatter title in every locale",
    () => {
      for (const slug of jaSlugs) {
        for (const locale of ["ja", "en", "zh"] as const) {
          const result = loadFrontmatterAndBody(locale, slug);
          expect(result).not.toBeNull();
          const { fm, body } = result!;
          const h1 = extractFirstH1(body);
          expect(
            h1,
            `MDX first H1 missing slug=${slug} locale=${locale}`,
          ).not.toBeNull();
          const ok = h1 === fm.title || (fm.title ?? "").startsWith(h1!);
          expect(
            ok,
            `MDX H1 vs title mismatch slug=${slug} locale=${locale} h1="${h1}" title="${fm.title}"`,
          ).toBe(true);
        }
      }
    },
  );
});
