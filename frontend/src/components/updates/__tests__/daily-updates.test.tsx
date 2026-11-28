import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { groupUpdatesByDate } from "@/contents/updates/group-by-date";
import { selectHomeUpdates } from "@/contents/updates";
import { UpdatesPage } from "../UpdatesPage";
import { UpdatesSection } from "../UpdatesSection";
import type { Locale, UpdateItem } from "@/contents/updates/types";

const entry = (id: string, date = "2026-11-22"): UpdateItem => ({
  id, date, dateLabel: "announced", category: "question-bank", eventKind: "new",
  title: `Title ${id}`, summary: `Summary ${id}`, links: [{ href: "/terms", label: "Terms" }],
  changeNotes: { status: "not-applicable" },
});

it("groups descending dates without mutation or losing stable same-day order", () => {
  const items = [entry("older", "2026-11-20"), entry("z"), entry("a"), entry("middle", "2026-11-21")];
  const saved = structuredClone(items);
  const groups = groupUpdatesByDate(items);
  expect(groups.map(g => g.date)).toEqual(["2026-11-22", "2026-11-21", "2026-11-20"]);
  expect(groups[0].items.map(i => i.id)).toEqual(["z", "a"]);
  expect(items).toEqual(saved);
  expect(groupUpdatesByDate([])).toEqual([]);
});

it.each(["ja", "en", "zh"] as Locale[])("preserves mixed-day content, old anchors and home isolation in %s", locale => {
  const prefix = locale === "ja" ? "" : `/${locale}`;
  const items = Array.from({ length: 6 }, (_, n) => entry(`announcement:item-${n}`));
  items[0] = { ...items[0], eventKind: "update", corrects: "announcement:old",
    changeNotes: { status: "available", entry: { date: "2026-11-21", blocks: [
      { type: "paragraph", children: [{ type: "text", value: "2026-11-21 recorded correction, full scope retained." }] },
    ] } }, links: [{ href: `${prefix}/terms`, label: "Localized terms" }] };
  items[1] = { ...items[1], category: "blog", dateLabel: "updated", eventKind: "update", publishedAt: "2026-06-01" };
  items.push({ ...entry("announcement:old", "2026-11-09"), corrections: [items[0].id] });
  const html = renderToStaticMarkup(createElement(UpdatesPage, { items, locale }));
  expect([...html.matchAll(/data-update-date="([^"]+)"/g)].map(m => m[1])).toEqual(["2026-11-22", "2026-11-09"]);
  expect([...html.matchAll(/data-update-id="([^"]+)"/g)].map(m => m[1])).toEqual(items.map(i => i.id));
  expect(html.match(/<h2\b/g)).toHaveLength(2);
  expect(html.match(/<h3\b/g)).toHaveLength(7);
  for (const item of items) { expect(html).toContain(item.title); expect(html).toContain(item.summary); }
  expect(html).toContain('id="date-2026-11-22"');
  expect(html).toContain('id="announcement:old"');
  expect(html).toContain(`href="${prefix}/updates#announcement:old"`);
  expect(html).toContain(`href="${prefix}/updates#announcement:item-0"`);
  expect(html).toContain(`href="${prefix}/terms"`);
  expect(html).toContain("2026-11-21 recorded correction, full scope retained.");
  expect(html).toContain('dateTime="2026-06-01"');
  expect(html).not.toContain("line-clamp");
  expect(html).toContain("focus-visible:");
  const home = renderToStaticMarkup(createElement(UpdatesSection, { items: selectHomeUpdates(items), locale }));
  expect([...home.matchAll(/data-update-id="([^"]+)"/g)].map(m => m[1])).toEqual(items.slice(0, 5).map(i => i.id));
  expect(home).not.toContain("data-update-date");
  expect(home.match(/shadow-sm/g)).toHaveLength(5);
  expect(renderToStaticMarkup(createElement(UpdatesPage, { items: [], locale }))).not.toContain("data-update-date");
});
