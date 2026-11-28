import { execFileSync } from "node:child_process";
import ts from "typescript";
import { createLocalizedPath } from "@/i18n/locales";
import { changedRecords, parsePublicationRecords, snapshotSources, validatePublications } from "./publication-validation";
import type { Announcement } from "./types";

const ledgerPath = "frontend/src/contents/updates/publication-records.json";
const announcementsPath = "frontend/src/contents/updates/announcements.ts";
const gatePath = "frontend/src/i18n/release-gate.ts";
const isSource = (p: string) => /^frontend\/contents\/(questions|terms)\//.test(p);

/** Interpret a deliberately narrow literal grammar; never import code from a Git revision. */
export function readLiteralAnnouncements(text: string): Announcement[] {
  const syntax = ts.transpileModule(text, { reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ESNext } });
  if (syntax.diagnostics?.some(d => d.category === ts.DiagnosticCategory.Error)) throw new Error("Invalid announcement syntax");
  const file = ts.createSourceFile("announcements.ts", text, ts.ScriptTarget.Latest, true);
  for (const statement of file.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause?.isTypeOnly) continue;
    if (ts.isVariableStatement(statement) && statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      && (statement.declarationList.flags & ts.NodeFlags.Const) !== 0 && statement.declarationList.declarations.length === 1) {
      const name = statement.declarationList.declarations[0].name;
      if (ts.isIdentifier(name) && name.text === "announcements") continue;
    }
    throw new Error("Announcement module must contain only type imports and one literal const export");
  }
  function literal(node: ts.Expression): unknown {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node)) {
      const result: Record<string, unknown> = Object.create(null);
      for (const p of node.properties) {
        if (!ts.isPropertyAssignment(p) || (!ts.isIdentifier(p.name) && !ts.isStringLiteral(p.name))) throw new Error("Expected literal announcement property");
        const key = p.name.text;
        if (Object.hasOwn(result, key)) throw new Error("Duplicate announcement property");
        result[key] = literal(p.initializer);
      }
      return result;
    }
    throw new Error("Expected literal announcement data");
  }
  const declarations = file.statements.filter(ts.isVariableStatement)
    .filter(s => s.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword))
    .flatMap(s => [...s.declarationList.declarations])
    .filter(d => ts.isIdentifier(d.name) && d.name.text === "announcements");
  if (declarations.length !== 1 || !declarations[0].initializer) throw new Error("Missing literal announcements export");
  const values = literal(declarations[0].initializer);
  if (!Array.isArray(values)) throw new Error("Expected announcement array");
  return values as Announcement[];
}

function readRevision(root: string, revision: string) {
  const git = (args: string[], input?: string) => execFileSync("git", args, { cwd: root, input, maxBuffer: 32 * 1024 * 1024, stdio: ["pipe", "pipe", "pipe"] });
  const entries = git(["ls-tree", "-r", "-z", revision]).toString("utf8").split("\0").filter(Boolean).map(line => {
    const match = /^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/.exec(line);
    if (!match) throw new Error("Invalid Git tree entry");
    return { mode: match[1], type: match[2], sha: match[3], path: match[4] };
  });
  const selected = entries.filter(e => isSource(e.path) || [ledgerPath, announcementsPath, gatePath].includes(e.path));
  if (selected.some(e => e.type !== "blob" || !["100644", "100755"].includes(e.mode))) throw new Error("Content sources must be regular Git blobs");
  const files = new Map<string, string>();
  if (selected.length) {
    const bytes = git(["cat-file", "--batch"], selected.map(e => e.sha).join("\n") + "\n");
    let offset = 0;
    for (const entry of selected) {
      const end = bytes.indexOf(10, offset);
      const header = /^([a-f0-9]+) blob (\d+)$/.exec(bytes.subarray(offset, end).toString("utf8"));
      if (!header || header[1] !== entry.sha) throw new Error("Invalid Git blob response");
      const length = Number(header[2]);
      offset = end + 1;
      if (offset + length >= bytes.length || bytes[offset + length] !== 10) throw new Error("Truncated Git blob response");
      files.set(entry.path, new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(offset, offset + length)));
      offset += length + 1;
    }
  }
  const text = files.get(announcementsPath);
  if (text === undefined) throw new Error("Missing announcements source");
  return { files, paths: new Set(entries.filter(e => e.type === "blob" && e.mode !== "120000").map(e => e.path)),
    sources: snapshotSources(new Map([...files].filter(([p]) => isSource(p)))),
    announcements: readLiteralAnnouncements(text),
    records: parsePublicationRecords(JSON.parse(files.get(ledgerPath) ?? "[]")) };
}

export function checkGitPublications(root: string, baseRef: string, candidateRef: string, today: string) {
  const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  const base = git("rev-parse", "--verify", "--end-of-options", `${baseRef}^{commit}`);
  const candidate = git("rev-parse", "--verify", "--end-of-options", `${candidateRef}^{commit}`);
  if (base === candidate) throw new Error("Base and candidate must be distinct Git commits");
  try { git("merge-base", "--is-ancestor", base, candidate); }
  catch { throw new Error("Known base must be an ancestor of candidate"); }
  const before = readRevision(root, base), after = readRevision(root, candidate);
  if (!after.files.has(ledgerPath)) throw new Error("Candidate is missing publication ledger");
  const gateText = after.files.get(gatePath);
  if (!gateText || gateText !== before.files.get(gatePath)) throw new Error("Changed or missing locale publication gate requires separate review");
  const gate = ts.createSourceFile("release-gate.ts", gateText, ts.ScriptTarget.Latest, true);
  const flags = gate.statements.filter(ts.isVariableStatement)
    .filter(s => s.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) && (s.declarationList.flags & ts.NodeFlags.Const) !== 0)
    .flatMap(s => [...s.declarationList.declarations])
    .filter(d => ts.isIdentifier(d.name) && d.name.text === "LOCALIZED_ROUTES_PUBLISHED");
  const flag = flags.length === 1 ? flags[0].initializer?.kind : undefined;
  if (flag !== ts.SyntaxKind.TrueKeyword && flag !== ts.SyntaxKind.FalseKeyword) throw new Error("Unsupported locale publication gate");
  const report = validatePublications({ before: before.sources, after: after.sources, baseRecords: before.records, records: after.records,
    baseAnnouncements: before.announcements, announcements: after.announcements, today,
    isPublicPath: (p, locale) => {
      if (locale !== "ja" && flag !== ts.SyntaxKind.TrueKeyword) return false;
      if (!["/questions", "/questions/clf", "/questions/saa", "/questions/aif", "/terms", "/", "/updates", "/blog"].includes(p)) return false;
      const route = createLocalizedPath(locale, p).replace(/\/$/, "");
      return after.paths.has(`frontend/src/app/(site)${route}/page.tsx`);
    },
  });
  return { base, candidate, ...report, changes: changedRecords(before.sources, after.sources) };
}
