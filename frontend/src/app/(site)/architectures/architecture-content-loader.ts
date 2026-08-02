/**
 * architecture-content-loader.ts
 *
 * locale 別 MDX 本文ローダー (server-only).
 * frontend/contents/architectures/{ja,en,zh}/<slug>.mdx を読み込み、frontmatter があれば
 * 剥がして本文だけ返す。本フェーズ (P5-042) では新規 en/zh MDX は frontmatter なしを正とするが、
 * 既存 ja MDX には frontmatter が残っているため、両対応する。
 *
 * NOTE: Node-only API (fs/path) を使うため、server component 経由でのみ呼ぶ。
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

  // ページ上では meta.title が H1 として描画されるため、本文先頭の同タイトル H1 を除く。
  // LONG タイトル vs SHORT body H1 の二重描画を防ぐため、title が h1Text で始まる
  // 短縮一致パターンも strip 対象に含める (comparison-content-loader と同型).
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
 * title: 構成図記事のメタタイトル。本文先頭の H1 がこの title と一致する場合のみ strip する。
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
 * locale 別の MDX ディレクトリに存在する slug 一覧を返す (.mdx 拡張子を除く).
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
