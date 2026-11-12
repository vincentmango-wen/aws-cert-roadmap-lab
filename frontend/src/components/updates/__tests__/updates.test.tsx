import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { UpdateCard } from "../UpdateCard";
import { UpdatesPage } from "../UpdatesPage";
import { UpdatesSection } from "../UpdatesSection";
import { getDictionary } from "@/i18n/dictionaries";
import type { UpdateItem } from "@/contents/updates/types";
import JaHome from "@/app/(site)/page";
import EnHome from "@/app/(site)/en/page";
import ZhHome from "@/app/(site)/zh/page";

vi.mock("@/contents/updates", () => ({
  getUpdatesInventory: () => ({ itemsByLocale: Object.fromEntries(["ja", "en", "zh"].map((locale) => [locale, ["one", "two", "three", "four"].map((id) => ({ id: `announcement:${id}`, category: "feature", date: "2026-11-09", dateLabel: "announced", title: `${locale} ${id}`, summary: "Summary", links: [] }))])), diagnostics: [] }),
  selectHomeUpdates: (items: UpdateItem[]) => items.slice(0, 3),
}));
const item: UpdateItem = { id: "announcement:sample", category: "question-bank", date: "2026-11-09", dateLabel: "announced", title: "Title", summary: "Summary", links: [{ href: "/zh/questions/saa", label: "查看 SAA-C03 題庫" }] };

describe.each(["ja", "en", "zh"] as const)("%s presentation", (locale) => {
  it("renders localized categories, dates, semantic time and focusable links", () => {
    const html = renderToStaticMarkup(<UpdateCard item={item} locale={locale} />);
    const labels = getDictionary(locale).updates;
    expect(html).toContain(labels.categories["question-bank"]);
    expect(html).toContain(labels.dates.announced);
    expect(html).toContain('<time dateTime="2026-11-09">');
    expect(html).toContain('href="/zh/questions/saa"');
    expect(html).toContain("focus-visible:");
  });
  it("renders empty and linkless states without invented buttons or nested main", () => {
    const html = renderToStaticMarkup(<UpdatesPage items={[]} locale={locale} />);
    expect(html).toContain(getDictionary(locale).updates.empty);
    expect(html).not.toContain("<main");
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    const card = renderToStaticMarkup(<UpdateCard item={{ ...item, category: "feature", links: [] }} locale={locale} />);
    expect(card).not.toContain("<a "); expect(card).not.toContain("<button");
  });
  it("renders correction links using localized full-page anchors", () => {
    const html = renderToStaticMarkup(<UpdateCard item={{ ...item, corrects: "announcement:old", corrections: ["announcement:new"] }} locale={locale} />);
    const prefix = locale === "ja" ? "" : `/${locale}`;
    expect(html).toContain(`href="${prefix}/updates#announcement:old"`);
    expect(html).toContain(`href="${prefix}/updates#announcement:new"`);
  });
  it("puts the updates link in Footer siteInfo", () => {
    expect(getDictionary(locale).footer.sections.siteInfo.linkKeys).toContain("updates");
    expect(getDictionary(locale).navigation.updates).toBe(getDictionary(locale).updates.title);
  });
});

it("uses the approved Traditional Chinese introduction and empty state", () => {
  const html = renderToStaticMarkup(<UpdatesPage items={[]} locale="zh" />);
  expect(html).toContain("依文章發布或更新日期與公告日期，查看最近的學習內容、題庫與網站功能消息。文章清單顯示目前版本，並非完整修訂歷史。");
  expect(html).toContain("目前尚無可顯示的內容或公告");
});
it("uses a mobile single-column and desktop three-column home preview", () => {
  const html = renderToStaticMarkup(<UpdatesSection items={[item]} locale="zh" />);
  expect(html).toContain("grid-cols-1"); expect(html).toContain("lg:grid-cols-3");
  expect(html).toContain('href="/zh/updates"');
});
it.each([["ja", JaHome], ["en", EnHome], ["zh", ZhHome]] as const)("places exactly the first three after Blog before Portfolio in %s", (locale, Home) => {
  const html = renderToStaticMarkup(<Home />);
  const updates = html.indexOf('id="updates-heading"');
  const prefix = locale === "ja" ? "" : `/${locale}`;
  const blog = html.indexOf(`href="${prefix}/blog/aws-cloud-practitioner-roadmap"`);
  expect(updates).toBeGreaterThan(blog);
  expect(html.indexOf("Portfolio Architecture")).toBeGreaterThan(updates);
  expect([...html.matchAll(/data-update-id="([^"]+)"/g)].map((match) => match[1])).toEqual(["announcement:one", "announcement:two", "announcement:three"]);
});

it.each([
  ["ja", JaHome, "学習カテゴリ"],
  ["en", EnHome, "Learn AWS by connecting concepts to architecture"],
  ["zh", ZhHome, "學習分類"],
] as const)("places articles and updates immediately after Hero before learning categories in %s", (locale, Home, learningHeading) => {
  const html = renderToStaticMarkup(<Home />);
  const sections = html.match(/<section\b[^>]*>[\s\S]*?<\/section>/g) ?? [];
  const prefix = locale === "ja" ? "" : `/${locale}`;
  expect(sections).toHaveLength(6);
  expect(sections[0]).toContain("<h1");
  expect(sections[1]).toContain(`href="${prefix}/blog"`);
  expect(sections[1]).toContain(`href="${prefix}/blog/aws-cloud-practitioner-roadmap"`);
  expect(sections[2]).toContain('id="updates-heading"');
  expect(sections[3]).toContain(learningHeading);
  expect(sections[4]).toContain("Cloud Practitioner");
  expect(sections[5]).toContain("Portfolio Architecture");
});
