import type { MetadataRoute } from "next";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  createLocalizedSitemapItems,
  type ChangeFrequency,
  type LocalizedSitemapRouteInput,
  type SitemapItem,
} from "../i18n/seo/sitemap";

export const dynamic = "force-static";

type SitemapRouteInput = LocalizedSitemapRouteInput;

type TermContent = {
  termId?: unknown;
  updatedAt?: unknown;
  published?: unknown;
};

type QuestionContent = {
  questionId?: unknown;
  updatedAt?: unknown;
  published?: unknown;
};

type LocalizedContent = {
  slug?: unknown;
  updatedAt?: unknown;
  published?: unknown;
};

type MdxContentMeta = {
  slug: string;
  updatedAt?: string;
  published: boolean;
  noIndex: boolean;
};

const CONTENT_ROOT = path.join(process.cwd(), "contents");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readRequiredJsonArray<T>(relativeFilePath: string): T[] {
  const absoluteFilePath = path.join(CONTENT_ROOT, ...relativeFilePath.split("/"));

  if (!existsSync(absoluteFilePath)) {
    throw new Error(`sitemap生成に必要なファイルが存在しません: ${absoluteFilePath}`);
  }

  const fileContent = readFileSync(absoluteFilePath, "utf8");
  const parsedContent: unknown = JSON.parse(fileContent);

  if (!Array.isArray(parsedContent)) {
    throw new Error(`sitemap生成に必要なJSONが配列ではありません: ${absoluteFilePath}`);
  }

  return parsedContent as T[];
}

function extractFrontmatter(content: string): string {
  if (!content.startsWith("---")) {
    return "";
  }

  const closingMarkerIndex = content.indexOf("\n---", 3);

  if (closingMarkerIndex === -1) {
    return "";
  }

  return content.slice(3, closingMarkerIndex);
}

function readFrontmatterValue(frontmatter: string, key: string): string | undefined {
  const pattern = new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m");
  const match = frontmatter.match(pattern);

  return match?.[1]?.trim();
}

function readMdxContentMetas(directoryName: string): MdxContentMeta[] {
  const directoryPath = path.join(CONTENT_ROOT, directoryName);

  if (!existsSync(directoryPath)) {
    return [];
  }

  return readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => entry.name.endsWith(".mdx"))
    .map((entry) => {
      const slug = entry.name.replace(/\.mdx$/, "");
      const filePath = path.join(directoryPath, entry.name);
      const fileContent = readFileSync(filePath, "utf8");
      const frontmatter = extractFrontmatter(fileContent);

      const publishedValue = readFrontmatterValue(frontmatter, "published");
      const noIndexValue = readFrontmatterValue(frontmatter, "noIndex");
      const updatedAt =
        readFrontmatterValue(frontmatter, "updatedAt") ??
        readFrontmatterValue(frontmatter, "publishedAt");

      return {
        slug,
        updatedAt,
        published: publishedValue !== "false",
        noIndex: noIndexValue === "true",
      };
    })
    .filter((meta) => meta.slug.length > 0 && meta.published && !meta.noIndex)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function getStaticRoutes(): SitemapRouteInput[] {
  return [
    {
      pathname: "/",
      priority: 1.0,
      changeFrequency: "weekly",
    },
    {
      pathname: "/roadmap",
      priority: 0.9,
      changeFrequency: "monthly",
    },
    {
      pathname: "/terms",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      pathname: "/questions",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      pathname: "/questions/clf",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      pathname: "/questions/saa",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      pathname: "/comparisons",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      pathname: "/architectures",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      pathname: "/blog",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      pathname: "/contact",
      priority: 0.4,
      changeFrequency: "yearly",
    },
    {
      pathname: "/about",
      priority: 0.4,
      changeFrequency: "yearly",
    },
    {
      pathname: "/privacy",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      pathname: "/disclaimer",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      // 利用規約は ja のみ提供する。/en /zh の利用規約ページは存在しないため
      // availableLocales を ja に絞り、sitemap に 404 URL を載せない（#305 の 200 ゲート対策）。
      pathname: "/terms-of-service",
      priority: 0.3,
      changeFrequency: "yearly",
      availableLocales: ["ja"],
    },
  ];
}

function getTermRoutes(): SitemapRouteInput[] {
  const terms = readRequiredJsonArray<TermContent>("terms/terms.json");

  return terms
    .filter((term) => term.published !== false)
    .filter((term) => isNonEmptyString(term.termId))
    .map((term) => ({
      pathname: `/terms/${String(term.termId).trim()}`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: isNonEmptyString(term.updatedAt) ? term.updatedAt : undefined,
    }));
}

/**
 * CLF (50問) + SAA (30問) を ja JSON SSoT から読み、3 言語 × 80 問 = 240 URL を
 * 生成するための入力を返す。
 *
 * en/zh の専用 JSON が未生成でも `createLocalizedSitemapItems` が自動で locale prefix
 * を付与した URL を出力するため、stub JSON を待たずに sitemap に並べられる
 * (P5-E6 / .en.json / .zh.json 空配列 stub 戦略と整合)。
 */
function getQuestionRoutes(): SitemapRouteInput[] {
  const clfQuestions = readRequiredJsonArray<QuestionContent>("questions/clf-c02.ja.json");
  const saaQuestions = readRequiredJsonArray<QuestionContent>("questions/saa-c03.ja.json");

  return [...clfQuestions, ...saaQuestions]
    .filter((question) => question.published !== false)
    .filter((question) => isNonEmptyString(question.questionId))
    .map((question) => ({
      pathname: `/questions/${String(question.questionId).trim()}`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: isNonEmptyString(question.updatedAt)
        ? question.updatedAt
        : undefined,
    }));
}

/**
 * locale 別 JSON SSoT を起点に detail URL を生成する。
 *
 * P5-034 (comparisons) / P5-042 (architectures) で MDX を locale サブディレクトリ
 * 配下に移したため、旧 `readMdxContentMetas` は contents/<directoryName> 直下を
 * 非再帰走査する設計上、空配列を返してしまい detail URL が sitemap から脱落する
 * regression が発生していた (CR1-H2 共造)。
 *
 * 本関数は ja JSON の slug 集合を「公開されている全 slug 集合」として扱い、
 * createLocalizedSitemapItems が 3 言語の URL を一度に生成する。
 */
function getLocalizedDetailRoutesFromJson(
  jaJsonRelativePath: string,
  routePrefix: string,
  priority: number,
  changeFrequency: ChangeFrequency,
): SitemapRouteInput[] {
  const entries = readRequiredJsonArray<LocalizedContent>(jaJsonRelativePath);

  return entries
    .filter((entry) => entry.published !== false)
    .filter((entry) => isNonEmptyString(entry.slug))
    .map((entry) => ({
      pathname: `${routePrefix}/${String(entry.slug).trim()}`,
      priority,
      changeFrequency,
      lastModified: isNonEmptyString(entry.updatedAt)
        ? String(entry.updatedAt).trim()
        : undefined,
    }));
}

export function getArchitectureSitemapRoutes(): SitemapRouteInput[] {
  return getLocalizedDetailRoutesFromJson(
    "architectures/architectures.ja.json",
    "/architectures",
    0.75,
    "monthly",
  );
}

export function getComparisonSitemapRoutes(): SitemapRouteInput[] {
  return getLocalizedDetailRoutesFromJson(
    "comparisons/comparisons.ja.json",
    "/comparisons",
    0.75,
    "monthly",
  );
}

/**
 * blog detail URL を ja MDX (`contents/blog/ja/<slug>.mdx`) の slug 集合から生成する。
 *
 * P5-050 で MDX を locale サブディレクトリ配下 (ja/en/zh) に移したため、旧
 * `getMdxRoutes("blog", "/blog", ...)` は `contents/blog/` 直下を非再帰走査し
 * 空配列を返すようになっていた。本関数は ja MDX を「公開されている全 slug」の
 * 真の集合として扱い、`createLocalizedSitemapItems` が 3 言語の URL を一度に
 * 生成する。
 */
export function getBlogSitemapRoutes(): SitemapRouteInput[] {
  return readMdxContentMetas(path.join("blog", "ja"))
    .filter((meta) => meta.published)
    .map((meta) => ({
      pathname: `/blog/${meta.slug}`,
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: meta.updatedAt,
    }));
}

function deduplicateByUrl(items: SitemapItem[]): SitemapItem[] {
  const itemMap = new Map<string, SitemapItem>();

  for (const item of items) {
    itemMap.set(item.url, item);
  }

  return Array.from(itemMap.values());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: SitemapRouteInput[] = [
    ...getStaticRoutes(),
    ...getTermRoutes(),
    ...getQuestionRoutes(),
    ...getComparisonSitemapRoutes(),
    ...getArchitectureSitemapRoutes(),
    ...getBlogSitemapRoutes(),
  ];

  const sitemapItems = routes.flatMap(createLocalizedSitemapItems);

  return deduplicateByUrl(sitemapItems).sort((a, b) => a.url.localeCompare(b.url));
}