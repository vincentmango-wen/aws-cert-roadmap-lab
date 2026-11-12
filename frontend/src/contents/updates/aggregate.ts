import { createLocalizedPath, locales, type Pathname } from "@/i18n/locales";
import { isCalendarDate } from "./dates";
import type { AggregateInput, Announcement, ArticleKind, UpdateInventory } from "./types";

const folders: Record<ArticleKind, string> = { blog: "blog", architecture: "architectures", comparison: "comparisons" };
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

export function aggregateUpdates(input: AggregateInput): UpdateInventory {
  if (!isCalendarDate(input.today)) throw new Error("Invalid inventory date");
  const result: UpdateInventory = { itemsByLocale: { ja: [], en: [], zh: [] }, diagnostics: [] };
  const counts = new Map<string, number>();
  for (const article of input.articles) {
    const id = `${article.kind}:${article.id}`;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  for (const article of input.articles) {
    const id = `${article.kind}:${article.id}`;
    const reject = (code: string) => { result.diagnostics.push({ code, id }); };
    if (counts.get(id)! > 1) { reject("duplicate-id"); continue; }
    if (!article.id.trim() || !/^[a-z0-9-]+$/.test(article.slug)) { reject("invalid-identity"); continue; }
    if (locales.some((locale) => !article.translations[locale])) { reject("missing-translation"); continue; }
    const translations = locales.map((locale) => article.translations[locale]!);
    if (translations.some((t) => !t.title.trim() || !t.summary.trim() || !t.bodyPresent)) { reject("missing-content"); continue; }
    if (translations.some((t) => t.id !== article.id || t.slug !== article.slug || t.metadataConflict)) { reject("metadata-conflict"); continue; }
    if (translations.some((t) => !t.published || t.noIndex)) { reject("not-recommended"); continue; }
    if (translations.some((t) => !isCalendarDate(t.publishedAt) || (t.updatedAt !== undefined && (!isCalendarDate(t.updatedAt) || t.updatedAt < t.publishedAt)))) { reject("invalid-date"); continue; }
    const reference = translations[0];
    const date = reference.updatedAt ?? reference.publishedAt;
    if (translations.some((t) => t.publishedAt !== reference.publishedAt || (t.updatedAt ?? t.publishedAt) !== date)) { reject("date-mismatch"); continue; }
    if (reference.publishedAt > input.today || date > input.today) { reject("future-date"); continue; }
    const route = `/${folders[article.kind]}/${article.slug}` as Pathname;
    if (locales.some((locale) => !input.isPublicPath(route, locale))) { reject("sealed-or-missing-path"); continue; }
    for (const locale of locales) {
      const t = article.translations[locale]!;
      result.itemsByLocale[locale].push({
        id, category: article.kind, date, dateLabel: date > reference.publishedAt ? "updated" : "published",
        title: t.title, summary: t.summary, links: [{ href: createLocalizedPath(locale, route), label: t.title }],
      });
    }
  }
  const announcementCounts = new Map<string, number>();
  for (const value of input.announcements) announcementCounts.set(value.id, (announcementCounts.get(value.id) ?? 0) + 1);
  const visible = new Map<string, Announcement>();
  for (const value of input.announcements) {
    const reject = (code: string) => result.diagnostics.push({ code, id: `announcement:${value.id}` });
    if (announcementCounts.get(value.id)! > 1) { reject("duplicate-id"); continue; }
    if (!/^[a-z0-9-]+$/.test(value.id)) { reject("invalid-identity"); continue; }
    if (!value.published) { reject("unpublished"); continue; }
    if (!isCalendarDate(value.date)) { reject("invalid-date"); continue; }
    if (value.date > input.today) { reject("future-date"); continue; }
    if (locales.some((locale) => !value.translations[locale]?.title.trim() || !value.translations[locale]?.summary.trim())) { reject("missing-translation"); continue; }
    if (value.category === "question-bank" && value.links.length === 0) { reject("missing-question-link"); continue; }
    if (value.links.some((link) => !/^\/(?:[a-z0-9-]+\/?)*$/.test(link.path) || /^\/(en|zh)(\/|$)/.test(link.path) || locales.some((locale) => !link.labels[locale]?.trim() || !input.isPublicPath(link.path, locale)))) { reject("invalid-public-link"); continue; }
    visible.set(value.id, value);
  }
  // A correction must terminate at a visible original, never a cycle or omitted target.
  const invalid = new Set<string>();
  for (const value of visible.values()) {
    const visited = new Set<string>();
    let current: Announcement | undefined = value;
    while (current?.corrects !== undefined) {
      if (visited.has(current.id)) { invalid.add(value.id); break; }
      visited.add(current.id);
      current = visible.get(current.corrects);
      if (!current) { invalid.add(value.id); break; }
    }
  }
  for (const id of invalid) {
    visible.delete(id);
    result.diagnostics.push({ code: "invalid-correction", id: `announcement:${id}` });
  }
  for (const value of visible.values()) {
    const corrections = [...visible.values()].filter((other) => other.corrects === value.id)
      .sort((a, b) => compare(a.date, b.date) || compare(a.id, b.id)).map((other) => `announcement:${other.id}`);
    for (const locale of locales) result.itemsByLocale[locale].push({
      id: `announcement:${value.id}`, category: value.category, date: value.date, dateLabel: "announced",
      ...value.translations[locale], links: value.links.map((link) => ({ href: createLocalizedPath(locale, link.path), label: link.labels[locale] })),
      corrects: value.corrects === undefined ? undefined : `announcement:${value.corrects}`, corrections,
    });
  }
  const group = (id: string) => id.startsWith("announcement:") ? 0 : 1;
  for (const locale of locales) result.itemsByLocale[locale].sort((a, b) => compare(b.date, a.date) || group(a.id) - group(b.id) || compare(a.id, b.id));
  return result;
}
