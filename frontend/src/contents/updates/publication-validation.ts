import { createHash } from "node:crypto";
import { aggregateUpdates } from "./aggregate";
import { locales } from "@/i18n/locales";
import type { Announcement, Locale } from "./types";

export type SourceSnapshot = Map<string, string>;
export type PublicationChange = { key: string; before: string | null; after: string | null };
type Decision = { id: string; summary: string; changes: PublicationChange[] };
export type PublicationRecord = Decision & (
  | { disposition: "announce"; announcementId: string }
  | { disposition: "no-announcement"; reason: string }
);

/** JSON indentation/key order is not an editorial change; array order and strings are. */
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([key, v]) => `${JSON.stringify(key)}:${canonical(v)}`).join(",")}}`;
  const result = JSON.stringify(value);
  if (result === undefined) throw new Error("Unsupported publication value");
  return result;
}

export function snapshotSources(files: ReadonlyMap<string, string>): SourceSnapshot {
  const snapshot = new Map<string, string>();
  for (const [file, text] of files) {
    if (!/^frontend\/contents\/(questions|terms)\/[a-zA-Z0-9_./-]+\.json$/.test(file) || file.split("/").includes("..")) {
      throw new Error(`Unsupported content source: ${file}`);
    }
    const records: unknown = JSON.parse(text);
    if (!Array.isArray(records)) throw new Error(`Expected content array: ${file}`);
    const idField = file.startsWith("frontend/contents/questions/") ? "questionId" : "termId";
    for (const record of records) {
      const id = record?.[idField];
      if (typeof id !== "string" || !/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid content identity: ${file}`);
      const key = `${file}#${id}`;
      if (snapshot.has(key)) throw new Error(`Duplicate content identity: ${key}`);
      snapshot.set(key, createHash("sha256").update(canonical(record)).digest("hex"));
    }
  }
  return snapshot;
}

export function changedRecords(before: SourceSnapshot, after: SourceSnapshot): PublicationChange[] {
  return [...new Set([...before.keys(), ...after.keys()])].sort()
    .filter(key => before.get(key) !== after.get(key))
    .map(key => ({ key, before: before.get(key) ?? null, after: after.get(key) ?? null }));
}

const nonblank = (s: unknown): s is string => typeof s === "string" && !!s.trim();

export function parsePublicationRecords(value: unknown): PublicationRecord[] {
  if (!Array.isArray(value)) throw new Error("Expected publication records array");
  const ids = new Set<string>();
  for (const r of value) {
    if (!r || !nonblank(r.id) || !/^[a-z0-9-]+$/.test(r.id) || !nonblank(r.summary)) throw new Error("Invalid publication record");
    if (ids.has(r.id)) throw new Error(`duplicate publication ID: ${r.id}`);
    ids.add(r.id);
    if (!Array.isArray(r.changes) || !r.changes.length) throw new Error(`empty publication changes: ${r.id}`);
    for (const c of r.changes) {
      if (!c || !nonblank(c.key) || c.before === c.after || ![c.before, c.after].every(v => v === null || (typeof v === "string" && /^[a-f0-9]{64}$/.test(v)))) throw new Error(`Invalid change: ${r.id}`);
    }
    if (r.disposition === "announce") {
      if (!nonblank(r.announcementId) || "reason" in r) throw new Error(`Invalid announcement decision: ${r.id}`);
    } else if (r.disposition === "no-announcement") {
      if (!nonblank(r.reason) || "announcementId" in r) throw new Error(`Invalid exclusion: ${r.id}`);
    } else throw new Error(`Invalid disposition: ${r.id}`);
  }
  return value as PublicationRecord[];
}

export function validatePublications(input: {
  before: SourceSnapshot; after: SourceSnapshot;
  baseRecords: PublicationRecord[]; records: PublicationRecord[];
  baseAnnouncements: Announcement[]; announcements: Announcement[]; today: string;
  isPublicPath: (path: string, locale: Locale) => boolean;
}): { changed: number; announcements: number } {
  const oldRecords = parsePublicationRecords(input.baseRecords);
  const records = parsePublicationRecords(input.records);
  for (const old of oldRecords) {
    const current = records.find(r => r.id === old.id);
    if (!current || canonical(current) !== canonical(old)) throw new Error(`Publication history changed: ${old.id}`);
  }
  const oldIds = new Set(oldRecords.map(r => r.id));
  const fresh = records.filter(r => !oldIds.has(r.id));
  const changes = changedRecords(input.before, input.after);
  const pending = new Map(changes.map(c => [c.key, c]));
  const covered = new Set<string>();
  const claimed = new Set<string>();
  const oldNotices = new Set(input.baseAnnouncements.map(a => a.id));
  const inventory = aggregateUpdates({ articles: [], announcements: input.announcements, today: input.today, isPublicPath: input.isPublicPath });
  for (const r of fresh) {
    for (const c of r.changes) {
      if (covered.has(c.key)) throw new Error(`duplicate coverage: ${c.key}`);
      const expected = pending.get(c.key);
      if (!expected || canonical(expected) !== canonical(c)) throw new Error(`stale publication decision: ${r.id}/${c.key}`);
      covered.add(c.key);
    }
    if (r.disposition === "announce") {
      const id = r.announcementId;
      if (oldNotices.has(id)) throw new Error(`historical announcement cannot cover new changes: ${id}`);
      if (claimed.has(id)) throw new Error(`duplicate announcement claim: ${id}`);
      const announcement = input.announcements.find(a => a.id === id);
      if (!announcement || !["question-bank", "glossary"].includes(announcement.category)) throw new Error(`Invalid content announcement: ${id}`);
      if (inventory.diagnostics.some(d => d.id === `announcement:${id}`) || locales.some(locale => inventory.itemsByLocale[locale].filter(item => item.id === `announcement:${id}`).length !== 1)) {
        throw new Error(`Announcement must be visible exactly once per locale: ${id}`);
      }
      claimed.add(id);
    }
  }
  const uncovered = changes.filter(c => !covered.has(c.key));
  if (uncovered.length) throw new Error(`uncovered content changes:\n${JSON.stringify(uncovered, null, 2)}`);
  for (const a of input.announcements) if (!oldNotices.has(a.id) && ["question-bank", "glossary"].includes(a.category) && !claimed.has(a.id)) {
    throw new Error(`unclaimed content announcement: ${a.id}`);
  }
  return { changed: changes.length, announcements: claimed.size };
}
