import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { announcements } from "../../updates/announcements";
import { aggregateUpdates } from "../../updates/aggregate";
import { isPublicUpdatesPath } from "../../updates";

const locales = ["zh", "ja", "en"] as const;
const id = "waf-pricing-correction";
const pricing = "https://aws.amazon.com/waf/pricing/";
const clarification = "https://aws.amazon.com/blogs/security/introducing-aws-waf-simplified-pricing/";

it.each(locales)("keeps the SAA-031 answer and exposes dated WAF guidance with primary sources in %s", (locale) => {
  const read = (name: string) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "contents", name), "utf8"));
  const q = read(`questions/saa-c03.${locale}.json`).find((v: { questionId: string }) => v.questionId === "saa-031");
  const term = read(`terms/terms.${locale}.json`).find((v: { termId: string }) => v.termId === "waf");
  expect(q.correctChoiceId).toBe("B");
  expect(q.practicalNote).not.toContain("\n\n\n");
  if (locale === "zh") {
    for (const record of [q, term]) expect(record.practicalNote).toContain("截至 2027-01-31（含當日）的用量");
    expect(JSON.stringify(announcements.find((entry) => entry.id === id))).toContain("截至 2027-01-31（含當日）的用量");
  }
  expect(q.choices.map((v: { choiceId: string }) => v.choiceId)).toEqual(["A", "B", "C", "D"]);
  for (const record of [q, term]) {
    for (const date of ["2026-11-28", "2026-11-23", "2027-01-31", "2027-02-01"]) expect(record.practicalNote).toContain(date);
    expect(record.officialDocs.map((doc: { url: string }) => doc.url)).toEqual(expect.arrayContaining([pricing, clarification]));
  }
});

it("keeps the WAF announcement undated and hidden pending publication approval", () => {
  const entries = announcements.filter((entry) => entry.id === id);
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({ eventKind: "update", category: "question-bank", published: false, date: "" });
  const result = aggregateUpdates({ articles: [], announcements, today: "2026-12-10", isPublicPath: isPublicUpdatesPath });
  for (const locale of locales) expect(result.itemsByLocale[locale].some((entry) => entry.id === `announcement:${id}`)).toBe(false);
  expect(result.diagnostics).toContainEqual({ code: "unpublished", id: `announcement:${id}` });
});

it("publishes exactly one localized WAF correction with a later synthetic announcement date", () => {
  const entry = announcements.find((value) => value.id === id);
  expect(entry).toBeDefined();
  if (!entry) return;
  // This date is fixture-only, not a release instruction or a production date.
  const candidate = { ...structuredClone(entry), published: true, date: "2026-12-10" };
  const values = announcements.map((value) => value.id === id ? candidate : value);
  const result = aggregateUpdates({ articles: [], announcements: values, today: "2026-12-10", isPublicPath: isPublicUpdatesPath });
  for (const locale of locales) {
    const matches = result.itemsByLocale[locale].filter((value) => value.id === `announcement:${id}`);
    expect(matches).toHaveLength(1);
    const item = matches[0];
    expect(item).toMatchObject({ date: "2026-12-10", dateLabel: "announced", eventKind: "update", changeNotes: { status: "available" } });
    expect(JSON.stringify(item.changeNotes)).toContain("2026-11-28");
    expect(JSON.stringify(item.changeNotes)).toContain(pricing);
    const prefix = locale === "ja" ? "" : `/${locale}`;
    expect(item.links.map((link) => link.href)).toEqual([`${prefix}/questions/saa`, `${prefix}/terms`]);
    expect(result.itemsByLocale[locale][0].id).toBe(`announcement:${id}`);
    expect(result.itemsByLocale[locale].some((value) => value.id === "announcement:lambda-event-functions-timeout-correction")).toBe(true);
  }
  expect(result.diagnostics).toEqual([]);
});
