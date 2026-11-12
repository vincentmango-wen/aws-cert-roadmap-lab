import fs from "node:fs";
import path from "node:path";
import { isPublishedLocale } from "@/i18n/release-gate";
import { createLocalizedPath } from "@/i18n/locales";
import { readArticleCandidates } from "./article-sources";
import { aggregateUpdates } from "./aggregate";
import { announcements } from "./announcements";
import { getUpdatesBuildDate } from "./dates";
import type { ArticleCandidate, Locale, UpdateItem } from "./types";

const staticPublicPaths = new Set(["/", "/roadmap", "/questions", "/questions/saa", "/questions/clf", "/blog", "/architectures", "/comparisons", "/terms", "/about", "/updates"]);

export function isPublicUpdatesPath(target: string, locale: Locale, articles?: ArticleCandidate[]): boolean {
  if (!isPublishedLocale(locale)) return false;
  if (staticPublicPaths.has(target)) {
    const frontend = fs.existsSync(path.join(process.cwd(), "src", "app")) ? process.cwd() : path.join(process.cwd(), "frontend");
    return fs.existsSync(path.join(frontend, "src", "app", "(site)", createLocalizedPath(locale, target).slice(1), "page.tsx"));
  }
  const folders = { blog: "blog", architecture: "architectures", comparison: "comparisons" };
  return (articles ?? readArticleCandidates()).some((article) => {
    const t = article.translations[locale];
    return target === `/${folders[article.kind]}/${article.slug}` && !!t?.published && !t.noIndex && t.bodyPresent && !t.metadataConflict;
  });
}
export function selectHomeUpdates(items: UpdateItem[]): UpdateItem[] {
  return items.slice(0, 3);
}

export function getUpdatesInventory() {
  const articles = readArticleCandidates();
  return aggregateUpdates({ articles, announcements, today: getUpdatesBuildDate(), isPublicPath: (target, locale) => isPublicUpdatesPath(target, locale, articles) });
}
