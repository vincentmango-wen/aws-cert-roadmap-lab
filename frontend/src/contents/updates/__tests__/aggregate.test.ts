import { describe, expect, it } from "vitest";
import { aggregateUpdates } from "../aggregate";
import type { ArticleCandidate, ArticleKind, ArticleTranslation } from "../types";

export function article(kind: ArticleKind = "blog", id = "one"): ArticleCandidate {
  const translation = (locale: string): ArticleTranslation => ({ id, slug: "sample", title: `${locale} title`, summary: `${locale} summary`, publishedAt: "2026-11-01", published: true, noIndex: false, bodyPresent: true });
  return { kind, id, slug: "sample", translations: { ja: translation("ja"), en: translation("en"), zh: translation("zh") } };
}
const run = (articles: ArticleCandidate[], isPublicPath = () => true) => aggregateUpdates({ articles, announcements: [], today: "2026-11-12", isPublicPath });

describe.each(["blog", "architecture", "comparison"] as const)("%s eligibility", (kind) => {
  it("localizes a single common inventory", () => {
    const result = run([article(kind)]);
    for (const locale of ["ja", "en", "zh"] as const) {
      expect(result.itemsByLocale[locale]).toMatchObject([{ id: `${kind}:one`, date: "2026-11-01", dateLabel: "published", title: `${locale} title` }]);
    }
    expect(result.diagnostics).toEqual([]);
  });
  it.each([
    ["empty body", { bodyPresent: false }], ["unpublished", { published: false }],
    ["noindex", { noIndex: true }], ["wrong ID", { id: "other" }],
    ["wrong slug", { slug: "other" }], ["different date", { publishedAt: "2026-11-02" }],
    ["empty title", { title: " " }], ["empty summary", { summary: "" }],
    ["explicit conflict", { metadataConflict: true }],
  ])("excludes all locales for %s", (_reason, fields) => {
    const value = article(kind);
    Object.assign(value.translations.en!, fields);
    const result = run([value]);
    expect(Object.values(result.itemsByLocale).every((items) => items.length === 0)).toBe(true);
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });
  it("rejects a missing locale and a sealed destination", () => {
    const value = article(kind); delete value.translations.zh;
    expect(run([value]).itemsByLocale.ja).toEqual([]);
    expect(run([article(kind)], () => false).itemsByLocale.ja).toEqual([]);
  });
});

it.each([
  [undefined, "2026-11-01", "published"], ["2026-11-01", "2026-11-01", "published"],
  ["2026-11-09", "2026-11-09", "updated"],
])("selects effective date %s", (updatedAt, date, dateLabel) => {
  const value = article(); Object.values(value.translations).forEach((t) => { t.updatedAt = updatedAt; });
  expect(run([value]).itemsByLocale.ja).toMatchObject([{ date, dateLabel }]);
});

it.each([
  ["2026-02-30", undefined], ["2026-11-13", undefined],
  ["2026-11-01", "2026-10-31"], ["2026-11-01", "2026-11-13"],
  ["2026-11-01", "2026-02-30"],
])("excludes invalid or future dates without falling back: %s / %s", (publishedAt, updatedAt) => {
  const value = article(); Object.values(value.translations).forEach((t) => Object.assign(t, { publishedAt, updatedAt }));
  expect(run([value]).itemsByLocale.ja).toEqual([]);
});

it("rejects duplicate qualified IDs but keeps equal IDs of different kinds", () => {
  expect(run([article(), article()]).itemsByLocale.ja).toEqual([]);
  expect(run([article(), article("architecture")]).itemsByLocale.ja).toHaveLength(2);
});

it("sorts by date then code-point IDs, independent of titles and input order", () => {
  const values = [article("blog", "z"), article("blog", "a"), article("architecture", "q")];
  Object.values(values[0].translations).forEach((t) => { t.updatedAt = "2026-11-10"; });
  const expected = ["blog:z", "architecture:q", "blog:a"];
  for (const input of [values, [...values].reverse()]) {
    for (const items of Object.values(run(input).itemsByLocale)) expect(items.map((i) => i.id)).toEqual(expected);
  }
});
