/**
 * comparison-content-loader.ts
 *
 * locale 別 MDX 本文ローダー (server-only).
 * frontend/contents/comparisons/{ja,en,zh}/<slug>.mdx を読み込み、frontmatter があれば
 * 剥がして本文だけ返す。本フェーズ (P5-034) では新規 en/zh MDX は frontmatter なしを正とするが、
 * 既存 ja MDX には frontmatter が残っているため、両対応する。
 *
 * NOTE: Node-only API (fs/path) を使うため、server component 経由でのみ呼ぶ。
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

  // タイトルと一致するときのみ strip。
  // ページ上では meta.title が H1 として描画されるため、本文先頭の同タイトル H1 を除く。
  // R2 fix: LONG タイトル (例: "S3・EBS・EFSの違いを初心者向けに解説") と
  // body 先頭 H1 (SHORT 例: "S3・EBS・EFSの違い") の二重描画を防ぐため、
  // title が h1Text で始まる短縮一致パターンも strip 対象に含める。
  // 他の H1 (本文中の見出し意図 / title の prefix と無関係) は破壊しないようガード継続。
  if (h1Text !== title && !title.startsWith(h1Text)) {
    return content;
  }

  lines.splice(firstContentLineIndex, 1);

  return lines.join("\n").trim();
}

/**
 * locale 別の MDX ファイルから本文 (frontmatter / leading H1 を除いた content) を返す。
 * ファイルが存在しなければ null を返す (Phase B 翻訳前の空状態でも build エラーにならないため)。
 *
 * title: 比較記事のメタタイトル。本文先頭の H1 がこの title と一致する場合のみ strip する。
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
 * locale 別の MDX ディレクトリに存在する slug 一覧を返す (.mdx 拡張子を除く).
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
