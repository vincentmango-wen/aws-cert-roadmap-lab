import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeAll, expect, it } from "vitest";
import { checkGitPublications, readLiteralAnnouncements } from "../publication-git";
import { changedRecords, snapshotSources } from "../publication-validation";

const root = mkdtempSync(path.join(tmpdir(), "issue-375-git-"));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
const put = (p: string, text: string) => { mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); writeFileSync(path.join(root, p), text); };
const file = "frontend/contents/questions/example.zh.json";
const ledger = "frontend/src/contents/updates/publication-records.json";
const noticeFile = "frontend/src/contents/updates/announcements.ts";
const gateFile = "frontend/src/i18n/release-gate.ts";
const content = (question: string) => JSON.stringify([{ questionId: "q-1", question }]);
const commit = () => { git("add", "."); git("-c", "user.name=Synthetic fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "fixture"); return git("rev-parse", "HEAD"); };
let base: string, candidate: string, repeated: string, malformed: string, published: string, sealed: string, sealedCandidate: string;
beforeAll(() => {
  git("init", "-q");
  put(file, content("old")); put(ledger, "[]"); put(noticeFile, 'export const announcements = [];');
  put(gateFile, 'export const LOCALIZED_ROUTES_PUBLISHED: boolean = true;'); base = commit();
  put(file, content("new"));
  const changes = changedRecords(snapshotSources(new Map([[file, content("old")]])), snapshotSources(new Map([[file, content("new")]])));
  put(ledger, JSON.stringify([{ id: "one", summary: "Synthetic typography change", disposition: "no-announcement", reason: "Reviewed fixture", changes }])); candidate = commit();
  put(file, content("newer")); repeated = commit();
  put(file, "{"); malformed = commit();
  put(file, content("new"));
  put(ledger, JSON.stringify([{ id: "release", summary: "Synthetic release", disposition: "announce", announcementId: "release", changes }]));
  put(noticeFile, 'export const announcements = '+JSON.stringify([{ id: "release", category: "question-bank", eventKind: "new", date: "2026-11-28", published: true,
    translations: Object.fromEntries(["ja", "en", "zh"].map(l => [l, { title: l, summary: l }])),
    links: [{ path: "/questions", labels: { ja: "ja", en: "en", zh: "zh" } }] }])+';');
  for (const prefix of ["", "/en", "/zh"]) put(`frontend/src/app/(site)${prefix}/questions/page.tsx`, "export default function Page() { return null; }");
  published = commit();
  put(gateFile, 'export const LOCALIZED_ROUTES_PUBLISHED: boolean = false;'); sealed = commit();
  put("fixture-note.txt", "Same sealed gate, different commit"); sealedCandidate = commit();
});

it("resolves a distinct ancestor base and validates a committed candidate", () => {
  expect(checkGitPublications(root, base, candidate, "2026-11-28")).toMatchObject({ base, candidate, changed: 1, announcements: 0 });
});
it("rejects identical revisions including aliases instead of passing an empty diff", () => {
  expect(() => checkGitPublications(root, base, base, "2026-11-28")).toThrow(/distinct/);
  expect(() => checkGitPublications(root, sealedCandidate, "HEAD", "2026-11-28")).toThrow(/distinct/);
});
it("fails on old exclusions, invalid revisions, reversed ancestry and malformed sources", () => {
  expect(() => checkGitPublications(root, candidate, repeated, "2026-11-28")).toThrow(/uncovered/);
  expect(() => checkGitPublications(root, "missing-ref", candidate, "2026-11-28")).toThrow();
  expect(() => checkGitPublications(root, candidate, base, "2026-11-28")).toThrow(/ancestor/);
  expect(() => checkGitPublications(root, repeated, malformed, "2026-11-28")).toThrow();
});
it("reads only literal announcement data, never executing repository code", () => {
  expect(readLiteralAnnouncements('import type { Announcement } from "./types"; export const announcements: Announcement[] = [];')).toEqual([]);
  expect(() => readLiteralAnnouncements('export const announcements = (() => { throw Error("executed"); })();')).toThrow(/literal/);
  expect(() => readLiteralAnnouncements('export const announcements = [{id: "a", id: "b"}];')).toThrow();
  expect(() => readLiteralAnnouncements('export const announcements = []; announcements.pop();')).toThrow(/literal/);
  expect(() => readLiteralAnnouncements('import "./mutate"; export const announcements = [];')).toThrow(/literal/);
});
it("checks candidate locale publication even when all three routes exist", () => {
  expect(checkGitPublications(root, base, published, "2026-11-28")).toMatchObject({ announcements: 1 });
  expect(() => checkGitPublications(root, base, sealed, "2026-11-28")).toThrow(/publication gate|locale/);
  expect(() => checkGitPublications(root, sealed, sealedCandidate, "2026-11-28")).toThrow(/locale/);
});
it("CLI failures exit nonzero and never report coverage", () => {
  const result = spawnSync(process.execPath, [path.resolve("scripts/check-update-publications.mjs"), "--base", base, "--candidate", base, "--repo", root, "--today", "2026-11-28"], { encoding: "utf8" });
  expect(result.status).not.toBe(0);
  expect(result.stdout).not.toContain("Coverage verified");
  expect(result.stderr).toMatch(/distinct/);
});
const invoke = (from: string, to: string) => spawnSync(process.execPath, [path.resolve("scripts/check-update-publications.mjs"), "--base", from, "--candidate", to, "--repo", root, "--today", "2026-11-28"], { encoding: "utf8" });
it("CLI verifies a distinct covered candidate", () => {
  const good = invoke(base, candidate);
  expect(good.status, good.stderr).toBe(0);
  expect(good.stdout).toContain("Coverage verified");
});
it("CLI propagates stale-coverage failure", () => {
  const bad = invoke(candidate, repeated);
  expect(bad.status, bad.stderr).not.toBe(0);
  expect(bad.stderr).toContain("uncovered");
  expect(bad.stdout).not.toContain("Coverage verified");
});
