/**
 * Server-only localized MDX body loader. Read frontend/contents/architectures/{ja,en,zh}/<slug>.mdx and
 * strip any frontmatter. New en/zh MDX in P5-042 has no frontmatter, while existing Japanese files may
 * retain it; support both. Call only from server components because fs/path are Node-only APIs.
 */
import fs from "fs";
import path from "path";
import type { ArchitectureLocale } from "@/types/architecture";

const LOCALE_DIR_NAMES: Record<ArchitectureLocale, string> = {
  ja: "ja",
  en: "en",
  zh: "zh",
};

function getArchitecturesLocaleDirectory(
  locale: ArchitectureLocale,
): string | null {
  const dirName = LOCALE_DIR_NAMES[locale];
  const candidates = [
    path.join(process.cwd(), "contents", "architectures", dirName),
    path.join(process.cwd(), "frontend", "contents", "architectures", dirName),
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

  // The page renders meta.title as H1, so remove a matching leading H1 from the body.
  // Also strip an abbreviated body H1 when title starts with h1Text, avoiding duplicate long/short headings.
  // This matches the comparison-content-loader behavior.
  if (h1Text !== title && !title.startsWith(h1Text)) {
    return content;
  }

  lines.splice(firstContentLineIndex, 1);

  return lines.join("\n").trim();
}

/**
 * Return the localized MDX body without frontmatter or a matching leading H1. Return null for missing
 * files so builds work before Phase B translations exist. title is the architecture article's metadata
 * title used to decide whether to strip the heading.
 */
export function loadArchitectureContent(
  locale: ArchitectureLocale,
  slug: string,
  title: string,
): string | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const dir = getArchitecturesLocaleDirectory(locale);

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
export function listArchitectureContentSlugs(
  locale: ArchitectureLocale,
): string[] {
  const dir = getArchitecturesLocaleDirectory(locale);

  if (!dir) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}
