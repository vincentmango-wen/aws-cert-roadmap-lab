import { expect, it } from "vitest";
import { aggregateUpdates } from "../aggregate";
import { readArticleCandidates } from "../article-sources";
import { announcements } from "../announcements";
import { isPublicUpdatesPath, selectLatestArticles } from "../index";
import type { UpdateItem } from "../types";

const item = (id: string, category: UpdateItem["category"], date: string): UpdateItem => ({
  id, category, date, dateLabel: "published", title: id, summary: id, links: [], eventKind: "new", changeNotes: { status: "not-applicable" },
});

it("filters blogs before taking three, sorts dates and stable ties, and never mutates input", () => {
  const input = [item("blog:z", "blog", "2026-06-01"), item("announcement:a", "feature", "2026-11-10"), item("blog:b", "blog", "2026-11-09"), item("architecture:a", "architecture", "2026-11-09"), item("blog:a", "blog", "2026-11-09"), item("blog:c", "blog", "2026-06-07")];
  const snapshot = structuredClone(input);
  expect(selectLatestArticles(input).map((value) => value.id)).toEqual(["blog:a", "blog:b", "blog:c"]);
  expect(input).toEqual(snapshot);
  expect(selectLatestArticles([])).toEqual([]);
  expect(selectLatestArticles([input[0]])).toEqual([input[0]]);
});

it("selects 002/008/015 with full current notes from the same 52-item three-locale inventory", () => {
  const articles = readArticleCandidates();
  const result = aggregateUpdates({ articles, announcements, today: "2026-11-13", isPublicPath: (target, locale) => isPublicUpdatesPath(target, locale, articles) });
  for (const locale of ["ja", "en", "zh"] as const) {
    const values = result.itemsByLocale[locale];
    expect(values).toHaveLength(52);
    expect(values.map((value) => value.id)).toEqual(result.itemsByLocale.ja.map((value) => value.id));
    const selected = selectLatestArticles(values);
    expect(selected.map((value) => value.id)).toEqual(["blog:blog-002", "blog:blog-008", "blog:blog-015"]);
    expect(selected.map((value) => value.eventKind)).toEqual(["update", "update", "update"]);
    expect(selected.map((value) => value.changeNotes.status)).toEqual(["available", "available", "available"]);
    expect(selected.map((value) => value.publishedAt)).toEqual(["2026-06-01", "2026-06-07", "2026-06-07"]);
    expect(values.filter((value) => value.category === "blog")[3].id).toBe("blog:blog-026");
    expect(values.slice(0, 3).map((value) => value.id)).toEqual(["announcement:saa-c03-051-060", "architecture:arc-007", "architecture:arc-011"]);
    for (let number = 6; number <= 25; number++) {
      const id = `blog-${String(number).padStart(3, "0")}`;
      expect(values.some((value) => value.id === `blog:${id}`)).toBe(true);
      expect(articles.find((value) => value.id === id)?.translations[locale]).toMatchObject({ noIndex: false, publishedAt: "2026-06-07" });
    }
  }
});
