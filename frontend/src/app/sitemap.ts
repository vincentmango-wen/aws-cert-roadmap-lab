export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

type SitemapItem = MetadataRoute.Sitemap[number];

type ChangeFrequency = NonNullable<SitemapItem["changeFrequency"]>;

type SitemapRouteInput = {
  pathname: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  lastModified?: string | Date;
};

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

type MdxContentMeta = {
  slug: string;
  updatedAt?: string;
  published: boolean;
};

const FALLBACK_SITE_URL = "https://aws-cert-roadmap-lab.example.com";

const CONTENT_ROOT = path.join(process.cwd(), "contents");

const BUILD_TIME = new Date();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getSiteUrl(): string {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
  const trimmedSiteUrl = rawSiteUrl.trim().replace(/\/+$/, "");

  if (trimmedSiteUrl.length === 0) {
    return FALLBACK_SITE_URL;
  }

  if (trimmedSiteUrl.startsWith("http://") || trimmedSiteUrl.startsWith("https://")) {
    return trimmedSiteUrl;
  }

  return `https://${trimmedSiteUrl}`;
}

function createAbsoluteUrl(pathname: string): string {
  const siteUrl = getSiteUrl();

  if (pathname === "/") {
    return siteUrl;
  }

  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${normalizedPathname}`;
}

function toLastModified(value?: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }

  if (!isNonEmptyString(value)) {
    return BUILD_TIME;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return BUILD_TIME;
  }

  return parsedDate;
}

function createSitemapItem(route: SitemapRouteInput): SitemapItem {
  return {
    url: createAbsoluteUrl(route.pathname),
    lastModified: toLastModified(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  };
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
      const updatedAt =
        readFrontmatterValue(frontmatter, "updatedAt") ??
        readFrontmatterValue(frontmatter, "publishedAt");

      return {
        slug,
        updatedAt,
        published: publishedValue !== "false",
      };
    })
    .filter((meta) => meta.slug.length > 0)
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

function getQuestionRoutes(): SitemapRouteInput[] {
  const questions = readRequiredJsonArray<QuestionContent>("questions/clf-c02.json");

  return questions
    .filter((question) => question.published !== false)
    .filter((question) => isNonEmptyString(question.questionId))
    .map((question) => ({
      pathname: `/questions/${String(question.questionId).trim()}`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: isNonEmptyString(question.updatedAt) ? question.updatedAt : undefined,
    }));
}

function getMdxRoutes(
  directoryName: string,
  routePrefix: string,
  priority: number,
  changeFrequency: ChangeFrequency,
): SitemapRouteInput[] {
  return readMdxContentMetas(directoryName)
    .filter((meta) => meta.published)
    .map((meta) => ({
      pathname: `${routePrefix}/${meta.slug}`,
      priority,
      changeFrequency,
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
    ...getMdxRoutes("comparisons", "/comparisons", 0.75, "monthly"),
    ...getMdxRoutes("architectures", "/architectures", 0.75, "monthly"),
    ...getMdxRoutes("blog", "/blog", 0.7, "weekly"),
  ];

  const sitemapItems = routes.map(createSitemapItem);

  return deduplicateByUrl(sitemapItems).sort((a, b) => a.url.localeCompare(b.url));
}