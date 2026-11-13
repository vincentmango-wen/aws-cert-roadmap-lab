import { describe, expect, it } from "vitest";
import { aggregateUpdates } from "../aggregate";
import type { ArticleCandidate, ArticleKind, ArticleTranslation } from "../types";

export function article(kind: ArticleKind = "blog", id = "one"): ArticleCandidate {
  const translation = (locale: string): ArticleTranslation => ({ id, slug: "sample", title: `${locale} title`, summary: `${locale} summary`, publishedAt: "2026-11-01", published: true, noIndex: false, bodyPresent: true });
  return { kind, id, slug: "sample", translations: { ja: translation("ja"), en: translation("en"), zh: translation("zh") } };
}
const run = (articles: ArticleCandidate[], isPublicPath = () => true) => aggregateUpdates({ articles, announcements: [], today: "2026-11-12", isPublicPath });

function notes(value: ArticleCandidate, date: string) {
  for (const locale of ["ja", "en", "zh"] as const) value.translations[locale]!.correctionNotes = {
    errors: [], entries: [{ date, blocks: [{ type: "paragraph", children: [{ type: "text", value: `${locale} complete correction.` }] }] }],
  };
  return value;
}

it("distinguishes same-day first publication from a recorded same-day correction without expiry", () => {
  const fresh = article();
  expect(run([fresh]).itemsByLocale.en[0]).toMatchObject({ eventKind: "new", publishedAt: "2026-11-01", changeNotes: { status: "not-applicable" } });
  notes(fresh, "2026-11-01");
  const result = aggregateUpdates({ articles: [fresh], announcements: [], today: "2027-11-01", isPublicPath: () => true });
  for (const locale of ["ja", "en", "zh"] as const) expect(result.itemsByLocale[locale][0]).toMatchObject({
    eventKind: "update", dateLabel: "updated", date: "2026-11-01", publishedAt: "2026-11-01",
    changeNotes: { status: "available", entry: { date: "2026-11-01", blocks: [{ type: "paragraph", children: [{ type: "text", value: `${locale} complete correction.` }] }] } },
  });
});

it("retains both recorded dates and selects only the current correction entry", () => {
  const value = notes(article(), "2026-11-09");
  for (const t of Object.values(value.translations)) {
    t.updatedAt = "2026-11-09";
    t.correctionNotes!.entries.unshift({ date: "2026-11-02", blocks: [{ type: "paragraph", children: [{ type: "text", value: "Old note" }] }] });
  }
  const item = run([value]).itemsByLocale.en[0];
  expect(item).toMatchObject({ eventKind: "update", publishedAt: "2026-11-01", updatedAt: "2026-11-09", changeNotes: { status: "available", entry: { date: "2026-11-09" } } });
  expect(JSON.stringify(item.changeNotes)).not.toContain("Old note");
});

it.each(["absent", "older", "future", "one-locale-missing", "malformed"])("discloses %s notes consistently without removing the article", (condition) => {
  const value = notes(article(), "2026-11-09");
  for (const t of Object.values(value.translations)) t.updatedAt = "2026-11-09";
  if (condition === "absent") for (const t of Object.values(value.translations)) delete t.correctionNotes;
  if (condition === "older" || condition === "future") for (const t of Object.values(value.translations)) t.correctionNotes!.entries[0].date = condition === "older" ? "2026-11-02" : "2026-11-13";
  if (condition === "one-locale-missing") delete value.translations.zh!.correctionNotes;
  if (condition === "malformed") value.translations.en!.correctionNotes!.errors.push("invalid-entry-date");
  const result = run([value]);
  for (const locale of ["ja", "en", "zh"] as const) expect(result.itemsByLocale[locale]).toMatchObject([{ eventKind: "update", changeNotes: { status: "missing" } }]);
  expect(result.diagnostics.length).toBeGreaterThan(0);
});

it("keeps one consistent Update event for a same-day correction with incomplete locale notes", () => {
  const value = notes(article(), "2026-11-01");
  delete value.translations.zh!.correctionNotes;
  for (const items of Object.values(run([value]).itemsByLocale)) expect(items[0]).toMatchObject({ eventKind: "update", dateLabel: "updated", changeNotes: { status: "missing" } });
});

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
