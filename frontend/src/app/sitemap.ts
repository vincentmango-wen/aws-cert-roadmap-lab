import type { MetadataRoute } from "next";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  createLocalizedSitemapItems,
  getSitemapSiteUrl,
  type ChangeFrequency,
  type LocalizedSitemapRouteInput,
  type SitemapItem,
} from "../i18n/seo/sitemap";
import { isPublishedLocale, isSealedPathname } from "../i18n/release-gate";
import { blogPosts } from "@/contents/blog/blogPosts";
import { getPublishedBlogPosts } from "./(site)/blog/blog-detail-data";
import { loadBlogContent } from "./(site)/blog/blog-content-loader";
import { locales, getAvailableLocalesForPathname } from "../i18n/locales";

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
      pathname: "/updates",
      priority: 0.6,
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
      // Terms of service are Japanese-only; corresponding /en and /zh pages do not exist.
      // Limit availableLocales to ja to avoid sitemap URLs returning 404 (#305's HTTP 200 gate).
      pathname: "/terms-of-service",
      priority: 0.3,
      changeFrequency: "yearly",
      availableLocales: getAvailableLocalesForPathname("/terms-of-service"),
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
 * Read CLF and SAA questions from the Japanese JSON source of truth and return inputs for localized URL
 * generation. The original design covered 50 CLF + 30 SAA questions (80 questions x 3 locales = 240
 * URLs). createLocalizedSitemapItems adds locale prefixes even before dedicated en/zh JSON exists,
 * consistent with P5-E6's empty-array .en.json/.zh.json scaffold strategy.
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
 * Generate detail URLs from the localized JSON source of truth. P5-034 (comparisons) and P5-042
 * (architectures) moved MDX into locale subdirectories; the old nonrecursive readMdxContentMetas scan of
 * contents/<directoryName> returned empty arrays and dropped detail URLs from the sitemap (CR1-H2).
 * Treat Japanese JSON slugs as the complete published set and let createLocalizedSitemapItems generate
 * all three locales together.
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

/** Blog sitemap eligibility uses the same localized metadata as article routes. */
export function getBlogSitemapRoutes(): SitemapRouteInput[] {
  const indexableSlugs = Object.fromEntries(locales.map((locale) => [locale,
    new Set(getPublishedBlogPosts(locale).filter((post) => !post.noIndex).map((post) => post.slug)),
  ]));
  return blogPosts.flatMap((post): SitemapRouteInput[] => {
    const availableLocales = locales.filter((locale) =>
      isPublishedLocale(locale) && indexableSlugs[locale].has(post.slug),
    );
    // The generic sitemap helper falls back on empty lists; never pass one for Blog.
    if (availableLocales.length === 0) return [];
    const japanese = loadBlogContent("ja", post.slug)?.frontmatter;
    return [{
      pathname: `/blog/${post.slug}`,
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: japanese?.updatedAt || japanese?.publishedAt || post.updatedAt || post.publishedAt,
      availableLocales,
    }];
  });
}

function deduplicateByUrl(items: SitemapItem[]): SitemapItem[] {
  const itemMap = new Map<string, SitemapItem>();

  for (const item of items) {
    itemMap.set(item.url, item);
  }

  return Array.from(itemMap.values());
}

/**
 * Sitemap sealing layer 2: defensive output filter (ACR-012 / #322). Layer 1 is
 * resolveAvailableLocales() in i18n/seo/sitemap.ts. The sitemap directly caused the 2026-06-28 rejection
 * when almost every declared URL returned 404. Filter again at the output boundary so additional
 * generation paths cannot bypass sealing.
 */
export function filterSealedLocaleUrls(items: SitemapItem[]): SitemapItem[] {
  const siteUrl = getSitemapSiteUrl();

  return items.filter((item) => {
    const pathname = item.url.startsWith(siteUrl) ? item.url.slice(siteUrl.length) : item.url;

    return !isSealedPathname(pathname === "" ? "/" : pathname);
  });
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

  const sitemapItems = routes.flatMap((route) => {
    const items = createLocalizedSitemapItems(route);
    if (route.pathname.startsWith("/blog/") && !route.availableLocales?.includes("ja")) {
      // A hidden Japanese article must not remain the Blog cluster's default destination.
      for (const item of items) {
        if (item.alternates?.languages) delete item.alternates.languages["x-default"];
      }
    }
    if (route.pathname === "/updates") {
      // This index has no recorded modification date; do not substitute build time.
      for (const item of items) delete item.lastModified;
    }
    return items;
  });

  return filterSealedLocaleUrls(deduplicateByUrl(sitemapItems)).sort((a, b) =>
    a.url.localeCompare(b.url),
  );
}
