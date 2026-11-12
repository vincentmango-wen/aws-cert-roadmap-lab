import type { Locale } from "@/i18n/locales";
export type { Locale } from "@/i18n/locales";
export type ArticleKind = "blog" | "architecture" | "comparison";
export type AnnouncementKind = "question-bank" | "feature";
export type DateLabel = "published" | "updated" | "announced";
export type ArticleTranslation = {
  id: string; slug: string; title: string; summary: string;
  publishedAt: string; updatedAt?: string; published: boolean; noIndex: boolean;
  bodyPresent: boolean; metadataConflict?: boolean;
};
export type ArticleCandidate = {
  kind: ArticleKind; id: string; slug: string;
  translations: Partial<Record<Locale, ArticleTranslation>>;
};
export type Announcement = {
  id: string; category: AnnouncementKind; date: string; published: boolean;
  translations: Record<Locale, { title: string; summary: string }>;
  links: Array<{ path: string; labels: Record<Locale, string> }>;
  corrects?: string;
};
export type UpdateItem = {
  id: string; category: ArticleKind | AnnouncementKind; date: string; dateLabel: DateLabel;
  title: string; summary: string; links: Array<{ href: string; label: string }>;
  corrects?: string; corrections?: string[];
};
export type Diagnostic = { code: string; id: string; locale?: Locale; sourcePath?: string };
export type UpdateInventory = { itemsByLocale: Record<Locale, UpdateItem[]>; diagnostics: Diagnostic[] };
export type AggregateInput = {
  articles: ArticleCandidate[]; announcements: Announcement[]; today: string;
  isPublicPath: (path: string, locale: Locale) => boolean;
};
