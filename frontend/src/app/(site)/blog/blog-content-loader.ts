/**
 * Server-only localized MDX loader. Read frontend/contents/blog/{ja,en,zh}/<slug>.mdx, extract
 * frontmatter and return {frontmatter, content}. Call only from server components because fs/path are
 * Node-only APIs.
 */
import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/locales";

export type BlogFrontmatterValue = string | boolean | string[];

export type BlogPostFrontmatter = {
  postId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  targetKeywords: string[];
  author: string;
  published: boolean;
  noIndex: boolean;
  publishedAt: string;
  updatedAt: string;
};

const LOCALE_DIR_NAMES: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  zh: "zh",
};

function getBlogLocaleDirectory(locale: Locale): string | null {
  const dirName = LOCALE_DIR_NAMES[locale];
  const candidates = [
    path.join(process.cwd(), "contents", "blog", dirName),
    path.join(process.cwd(), "frontend", "contents", "blog", dirName),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

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

function parseFrontmatterValue(value: string): BlogFrontmatterValue {
  const trimmed = value.trim();

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();

    if (!inner) {
      return [];
    }

    return inner
      .split(",")
      .map((item) => stripQuotes(item))
      .filter((item) => item.length > 0);
  }

  return stripQuotes(trimmed);
}

export function parseFrontmatterBlock(
  frontmatterText: string,
): Record<string, BlogFrontmatterValue> {
  const parsed: Record<string, BlogFrontmatterValue> = {};
  const lines = frontmatterText.split(/\r\n|\n|\r/);

  let currentListKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const listItemMatch = line.match(/^\s*-\s+(.+)$/);

    if (listItemMatch && currentListKey) {
      const currentValue = parsed[currentListKey];
      const nextValue = stripQuotes(listItemMatch[1]);

      if (Array.isArray(currentValue)) {
        currentValue.push(nextValue);
      } else {
        parsed[currentListKey] = [nextValue];
      }

      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyValueMatch) {
      continue;
    }

    const key = keyValueMatch[1];
    const rawValue = keyValueMatch[2];

    if (rawValue.trim() === "") {
      parsed[key] = [];
      currentListKey = key;
      continue;
    }

    parsed[key] = parseFrontmatterValue(rawValue);
    currentListKey = null;
  }

  return parsed;
}

function getString(
  value: BlogFrontmatterValue | undefined,
  fallbackValue: string,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  return fallbackValue;
}

function getBoolean(
  value: BlogFrontmatterValue | undefined,
  fallbackValue: boolean,
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return fallbackValue;
}

function getStringArray(value: BlogFrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => item.length > 0);
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return [];
}

export function removeLeadingH1(content: string, title: string): string {
  const lines = content.split(/\r?\n/);
  const firstContentLineIndex = lines.findIndex(
    (line) => line.trim().length > 0,
  );

  if (firstContentLineIndex === -1) {
    return content;
  }

  const firstLine = lines[firstContentLineIndex].trim();
  const h1Match = firstLine.match(/^#\s+(.+)$/);

  if (!h1Match) {
    return content;
  }

  const h1Text = h1Match[1].trim();

  // The page renders meta.title as H1, so remove a matching leading H1 from the body.
  // Also strip an abbreviated body H1 when title starts with h1Text, avoiding duplicate long/short headings.
  // This matches the architecture-content-loader behavior.
  if (h1Text !== title && !title.startsWith(h1Text)) {
    return content;
  }

  lines.splice(firstContentLineIndex, 1);

  return lines.join("\n").trim();
}

/**
 * Read localized MDX and return frontmatter plus body content without the leading H1. Return null for
 * missing files so builds work before Phase 2 translations exist.
 */
export function loadBlogContent(
  locale: Locale,
  slug: string,
): { frontmatter: BlogPostFrontmatter; content: string } | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const dir = getBlogLocaleDirectory(locale);

  if (!dir) {
    return null;
  }

  const filePath = path.join(dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawFile = fs.readFileSync(filePath, "utf8");
  const fallbackSlug = path.basename(filePath, ".mdx");

  const frontmatterMatch = rawFile.match(
    /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/,
  );

  const frontmatterText = frontmatterMatch?.[1] ?? "";
  const rawContent = frontmatterMatch?.[2]?.trim() ?? rawFile.trim();
  const frontmatter = parseFrontmatterBlock(frontmatterText);

  const slugValue = getString(frontmatter.slug, fallbackSlug);
  const title = getString(frontmatter.title, slugValue);
  const content = removeLeadingH1(rawContent, title);

  return {
    frontmatter: {
      postId: getString(frontmatter.postId, slugValue),
      slug: slugValue,
      title,
      description: getString(
        frontmatter.description,
        "AWS資格学習に関する記事です。",
      ),
      category: getString(frontmatter.category, "AWS"),
      tags: getStringArray(frontmatter.tags),
      targetKeywords: getStringArray(frontmatter.targetKeywords),
      author: getString(frontmatter.author, "AWS Cert Roadmap Lab"),
      published: getBoolean(frontmatter.published, true),
      noIndex: getBoolean(frontmatter.noIndex, false),
      publishedAt: getString(frontmatter.publishedAt, ""),
      updatedAt: getString(frontmatter.updatedAt, ""),
    },
    content,
  };
}

/**
 * Return slugs in the localized MDX directory, without the .mdx extension.
 */
export function listBlogContentSlugs(locale: Locale): string[] {
  const dir = getBlogLocaleDirectory(locale);

  if (!dir) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}
