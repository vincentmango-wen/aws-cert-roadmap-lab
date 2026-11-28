import { expect, it } from "vitest";
import { snapshotSources, changedRecords, validatePublications, type PublicationRecord } from "../publication-validation";
import type { Announcement } from "../types";

const file = "frontend/contents/questions/test.zh.json";
const termFile = "frontend/contents/terms/terms.zh.json";
const source = (value: string) => new Map([[file, JSON.stringify([{ questionId: "q-1", question: value }])]]);
const before = snapshotSources(source("old"));
const after = snapshotSources(source("new"));
const notice = (): Announcement => ({ id: "synthetic-release", date: "2026-11-28", eventKind: "new", category: "question-bank", published: true,
  translations: { ja: { title: "問題集", summary: "説明" }, en: { title: "Questions", summary: "Summary" }, zh: { title: "題庫", summary: "說明" } },
  links: [{ path: "/questions", labels: { ja: "問題集", en: "Questions", zh: "題庫" } }],
});
const record = (): PublicationRecord => ({ id: "release-one", summary: "Synthetic release", changes: changedRecords(before, after), disposition: "announce", announcementId: "synthetic-release" });
const input = () => ({ before, after, baseRecords: [] as PublicationRecord[], records: [record()], baseAnnouncements: [] as Announcement[], announcements: [notice()], today: "2026-11-28", isPublicPath: (p: string) => ["/questions", "/terms"].includes(p) });

it("requires coverage and accepts one complete three-locale announcement", () => {
  expect(validatePublications(input())).toEqual({ changed: 1, announcements: 1 });
  expect(() => validatePublications({ ...input(), records: [] })).toThrow(/uncovered/);
});
it("allows one mixed release and a standalone glossary notice without duplicates", () => {
  const files = source("new"); files.set(termFile, JSON.stringify([{ termId: "term", summary: "new" }]));
  const mixed = snapshotSources(files);
  const value = input(); value.after = mixed; value.records[0].changes = changedRecords(before, mixed);
  value.announcements[0].links.push({ ...value.announcements[0].links[0], path: "/terms" });
  expect(validatePublications(value)).toEqual({ changed: 2, announcements: 1 });
  for (const path of ["/questions", "/terms"]) {
    const incomplete = notice(); incomplete.links[0].path = path;
    expect(() => validatePublications({ ...value, announcements: [incomplete] })).toThrow(/destination/);
  }
  const glossary = notice(); glossary.category = "glossary"; glossary.links[0].path = "/terms";
  const termsOnly = snapshotSources(new Map([[termFile, files.get(termFile)!]]));
  const termValue = { ...value, before: new Map<string, string>(), after: termsOnly, records: [{ ...record(), changes: changedRecords(new Map(), termsOnly) }], announcements: [glossary] };
  expect(validatePublications(termValue).announcements).toBe(1);
  expect(() => validatePublications({ ...termValue, announcements: [{ ...glossary, links: [{ ...glossary.links[0], path: "/questions" }] }] })).toThrow(/destination/);
  glossary.links = [];
  expect(() => validatePublications(termValue)).toThrow();
});
it("does not replay an old decision or an old announcement for a later edit", () => {
  const next = snapshotSources(source("third revision"));
  expect(() => validatePublications({ ...input(), before: after, after: next, baseRecords: [record()] })).toThrow(/uncovered/);
  expect(() => validatePublications({ ...input(), before: after, after: next })).toThrow(/stale/);
  expect(() => validatePublications({ ...input(), baseAnnouncements: [notice()] })).toThrow(/historical/);
});
it("preserves the base ledger and rejects duplicate or empty releases", () => {
  expect(() => validatePublications({ ...input(), baseRecords: [record()], records: [] })).toThrow(/history/);
  expect(() => validatePublications({ ...input(), records: [record(), record()] })).toThrow(/duplicate/);
  const duplicate = { ...record(), id: "another" };
  expect(() => validatePublications({ ...input(), records: [record(), duplicate] })).toThrow(/duplicate/);
  expect(() => validatePublications({ ...input(), records: [{ ...record(), changes: [] }] })).toThrow(/empty/);
});
it("requires an exact reasoned exclusion, including on later re-edits", () => {
  const exclusion: PublicationRecord = { id: "formatting", summary: "Display whitespace", changes: changedRecords(before, after), disposition: "no-announcement", reason: "Formatting only; meaning unchanged" };
  expect(validatePublications({ ...input(), records: [exclusion], announcements: [] })).toEqual({ changed: 1, announcements: 0 });
  expect(() => validatePublications({ ...input(), records: [{ ...exclusion, reason: " " }], announcements: [] })).toThrow();
  expect(() => validatePublications({ ...input(), before: after, after: snapshotSources(source("fourth")), records: [exclusion], baseRecords: [exclusion], announcements: [] })).toThrow(/uncovered/);
});
it.each(["blank-title", "missing-locale", "future", "unpublished", "string-published", "bad-link", "missing-notes", "duplicate-notice"])("fails closed for %s", kind => {
  const a = notice(); const value = input(); value.announcements = [a];
  if (kind === "blank-title") a.translations.zh.title = " ";
  if (kind === "missing-locale") delete (a.translations as Partial<Announcement["translations"]>).ja;
  if (kind === "future") a.date = "2026-11-29";
  if (kind === "unpublished") a.published = false;
  if (kind === "string-published") (a as unknown as { published: unknown }).published = "false";
  if (kind === "bad-link") a.links[0].path = "/private";
  if (kind === "missing-notes") a.eventKind = "update";
  if (kind === "duplicate-notice") value.announcements.push(a);
  expect(() => validatePublications(value)).toThrow();
});
it.each(["removed", "unpublished", "missing-locale"])("retains historical release visibility when %s", kind => {
  const a = notice();
  if (kind === "unpublished") a.published = false;
  if (kind === "missing-locale") delete (a.translations as Partial<Announcement["translations"]>).zh;
  expect(() => validatePublications({ ...input(), before: after, baseRecords: [record()], baseAnnouncements: [notice()], announcements: kind === "removed" ? [] : [a] })).toThrow();
});
it("requires the original ledger as an immutable prefix", () => {
  const a = record(), b = { ...record(), id: "two" };
  expect(() => validatePublications({ ...input(), before: after, baseRecords: [a, b], records: [b, a], baseAnnouncements: [notice()] })).toThrow(/history/);
});
it("rejects a fresh content announcement without a release decision", () => {
  expect(() => validatePublications({ ...input(), before: after, records: [] })).toThrow(/unclaimed/);
});
it("canonicalizes keys and top-level ordering, but detects strings and nested array changes", () => {
  const a = new Map([[file, '[{"questionId":"a","nested":[1,2]},{"questionId":"b","text":"x"}]']]);
  const b = new Map([[file, '[ {"text":"x","questionId":"b"}, {"nested":[1,2],"questionId":"a"} ]']]);
  expect(changedRecords(snapshotSources(a), snapshotSources(b))).toEqual([]);
  b.set(file, '[{"questionId":"a","nested":[2,1]},{"questionId":"b","text":"x "}]');
  expect(changedRecords(snapshotSources(a), snapshotSources(b))).toHaveLength(2);
});
it("detects deletes and moves and rejects unknown formats, invalid JSON and duplicate IDs", () => {
  expect(changedRecords(before, new Map())).toHaveLength(1);
  const moved = new Map([[file.replace("test", "moved"), source("old").get(file)!]]);
  expect(changedRecords(before, snapshotSources(moved))).toHaveLength(2);
  for (const files of [new Map([[file, "{"]]), new Map([[file, '{}']]), new Map([[file, '[{"questionId":"q"},{"questionId":"q"}]']]), new Map([[file, '[{}]']]), new Map([["frontend/contents/terms/new.txt", "x"]])]) {
    expect(() => snapshotSources(files)).toThrow();
  }
});
