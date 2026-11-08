/**
 * Server-only localized MDX body loader. Read frontend/contents/comparisons/{ja,en,zh}/<slug>.mdx and
 * strip any frontmatter. New en/zh MDX in P5-034 has no frontmatter, while existing Japanese files may
 * retain it; support both. Call only from server components because fs/path are Node-only APIs.
 */
import fs from "fs";
import path from "path";
import type { ComparisonLocale } from "@/types/comparison";

const LOCALE_DIR_NAMES: Record<ComparisonLocale, string> = {
  ja: "ja",
  en: "en",
  zh: "zh",
};

function getComparisonsLocaleDirectory(
  locale: ComparisonLocale,
): string | null {
  const dirName = LOCALE_DIR_NAMES[locale];
  const candidates = [
    path.join(process.cwd(), "contents", "comparisons", dirName),
    path.join(process.cwd(), "frontend", "contents", "comparisons", dirName),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function stripFrontmatter(rawFile: string): string {
  const frontmatterMatch = rawFile.match(
    /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/,
  );

  if (frontmatterMatch) {
    return (frontmatterMatch[2] ?? "").trim();
  }

  return rawFile.trim();
}

function removeLeadingH1(content: string, title: string): string {
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

  // Strip only headings matching the title.
  // The page renders meta.title as H1, so remove a matching leading H1 from the body.
  // R2 fix: avoid rendering both a long title (e.g. a beginner's guide to S3/EBS/EFS differences)
  // and a short body H1 (e.g. S3/EBS/EFS differences).
  // Also strip abbreviated matches where title starts with h1Text.
  // Keep unrelated H1 headings that are intentional body headings rather than title prefixes.
  if (h1Text !== title && !title.startsWith(h1Text)) {
    return content;
  }

  lines.splice(firstContentLineIndex, 1);

  return lines.join("\n").trim();
}

/**
 * Return the localized MDX body without frontmatter or a matching leading H1. Return null for missing
 * files so builds work before Phase B translations exist. title is the comparison article's metadata
 * title used to decide whether to strip the heading.
 */
export function loadComparisonContent(
  locale: ComparisonLocale,
  slug: string,
  title: string,
): string | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const dir = getComparisonsLocaleDirectory(locale);

  if (!dir) {
    return null;
  }

  const filePath = path.join(dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawFile = fs.readFileSync(filePath, "utf8");
  const withoutFrontmatter = stripFrontmatter(rawFile);

  return removeLeadingH1(withoutFrontmatter, title);
}

/**
 * Return slugs in the localized MDX directory, without the .mdx extension.
 */
export function listComparisonContentSlugs(
  locale: ComparisonLocale,
): string[] {
  const dir = getComparisonsLocaleDirectory(locale);

  if (!dir) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}
