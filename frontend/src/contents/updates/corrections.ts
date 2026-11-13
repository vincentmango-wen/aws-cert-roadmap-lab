import { unified } from "unified";
import remarkParse from "remark-parse";
import { isCalendarDate } from "./dates";
import type { CorrectionEntry, Locale, NoteBlock, NoteInline, ParsedCorrections } from "./types";

type MarkdownNode = {
  type: string; value?: string; depth?: number; url?: string;
  ordered?: boolean; start?: number; children?: MarkdownNode[];
};
const headings: Record<Locale, string> = { ja: "訂正内容", en: "Corrections", zh: "更正說明" };
const processor = unified().use(remarkParse);
const parsedCache = new Map<string, ParsedCorrections>();

export function isSafeNoteHref(href: string): boolean {
  if (!href || href.trim() !== href) return false;
  let decoded = href;
  try {
    for (let i = 0; i < 4; i++) {
      if (/[\u0000-\u0020\u007f\\]/.test(decoded) || decoded.split(/[/?#]/).some((part) => part === "." || part === "..")) return false;
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      if (i === 3) return false;
      decoded = next;
    }
    if (href.startsWith("/")) return !decoded.startsWith("//");
    if (!/^https?:\/\//i.test(href)) return false;
    const url = new URL(href);
    return (url.protocol === "https:" || url.protocol === "http:") && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

function inline(node: MarkdownNode, depth = 0): NoteInline {
  if (depth > 32) throw new Error("note-too-deep");
  if (node.type === "text" || node.type === "inlineCode") {
    if (typeof node.value !== "string") throw new Error("invalid-inline-text");
    return { type: node.type === "text" ? "text" : "code", value: node.value };
  }
  if (node.type === "strong" || node.type === "emphasis" || node.type === "link") {
    if (!node.children?.length) throw new Error("empty-inline-content");
    const children = node.children.map((child) => inline(child, depth + 1));
    if (node.type === "link") {
      if (!node.url || !isSafeNoteHref(node.url)) throw new Error("unsafe-note-link");
      return { type: "link", href: node.url, children };
    }
    return { type: node.type, children };
  }
  throw new Error(`unsupported-inline:${node.type}`);
}

export function isSafeNoteBlocks(value: unknown): value is NoteBlock[] {
  const record = (node: unknown): node is Record<string, unknown> => !!node && typeof node === "object" && !Array.isArray(node);
  const inlineValid = (node: unknown, depth: number, inLink = false): boolean => {
    if (depth > 32 || !record(node)) return false;
    if (node.type === "text" || node.type === "code") return typeof node.value === "string";
    if (node.type !== "strong" && node.type !== "emphasis" && node.type !== "link") return false;
    if (node.type === "link" && (inLink || typeof node.href !== "string" || !isSafeNoteHref(node.href))) return false;
    return Array.isArray(node.children) && node.children.length > 0 && node.children.every((child) => inlineValid(child, depth + 1, inLink || node.type === "link"));
  };
  const visible = (node: Record<string, unknown>): boolean => typeof node.value === "string"
    ? node.value.trim().length > 0 : Array.isArray(node.children) && node.children.some((child) => record(child) && visible(child));
  const blockValid = (node: unknown, depth: number): boolean => {
    if (depth > 32 || !record(node)) return false;
    if (node.type === "paragraph") return Array.isArray(node.children) && node.children.length > 0
      && node.children.every((child) => inlineValid(child, 0)) && node.children.some((child) => record(child) && visible(child));
    return node.type === "list" && typeof node.ordered === "boolean" && Array.isArray(node.items) && node.items.length > 0
      && node.items.every((item) => Array.isArray(item) && item.length > 0 && item.every((child) => blockValid(child, depth + 1)));
  };
  return Array.isArray(value) && value.length > 0 && value.every((node) => blockValid(node, 0));
}

function block(node: MarkdownNode, depth = 0): NoteBlock {
  if (depth > 32) throw new Error("note-too-deep");
  if (node.type === "paragraph" && node.children?.length) {
    return { type: "paragraph", children: node.children.map((child) => inline(child)) };
  }
  if (node.type === "list" && node.children?.length) {
    if (node.ordered && node.start !== undefined && node.start !== 1) throw new Error("unsupported-list-start");
    return { type: "list", ordered: node.ordered === true, items: node.children.map((item) => {
      if (item.type !== "listItem" || !item.children?.length) throw new Error("invalid-list-item");
      return item.children.map((child) => block(child, depth + 1));
    }) };
  }
  throw new Error(`unsupported-block:${node.type}`);
}

export function parseCorrectionNotes(body: string, locale: Locale): ParsedCorrections {
  const key = `${locale}\0${body}`;
  const cached = parsedCache.get(key);
  if (cached) return structuredClone(cached);
  const result = parseUncached(body, locale);
  // Bound retained inputs; larger documents still receive complete parsing.
  if (body.length <= 262144) {
    if (parsedCache.size >= 256) {
      const oldest = parsedCache.keys().next().value;
      if (oldest !== undefined) parsedCache.delete(oldest);
    }
    parsedCache.set(key, structuredClone(result));
  }
  return result;
}

function parseUncached(body: string, locale: Locale): ParsedCorrections {
  const result: ParsedCorrections = { entries: [], errors: [] };
  const tree = processor.parse(body) as MarkdownNode;
  let inSection = false, foundSection = false;
  let current: CorrectionEntry | undefined;
  const dates = new Set<string>();
  const finish = () => {
    if (current) {
      if (current.blocks.length === 0) result.errors.push(`empty-entry:${current.date}`);
      else result.entries.push(current);
    }
    current = undefined;
  };
  const headingText = (node: MarkdownNode) => node.children?.every((child) => child.type === "text")
    ? node.children.map((child) => child.value ?? "").join("") : "";
  for (const node of tree.children ?? []) {
    if (node.type === "heading" && node.depth === 2) {
      finish();
      inSection = headingText(node) === headings[locale];
      if (inSection) {
        if (foundSection) result.errors.push("duplicate-correction-section");
        foundSection = true;
      }
      continue;
    }
    if (!inSection) continue;
    if (node.type === "heading" && node.depth === 3) {
      finish();
      const date = headingText(node);
      if (!isCalendarDate(date)) { result.errors.push(`invalid-entry-date:${date}`); continue; }
      if (dates.has(date)) result.errors.push(`duplicate-entry-date:${date}`);
      dates.add(date);
      current = { date, blocks: [] };
      continue;
    }
    if (!current) { result.errors.push("undated-correction-content"); continue; }
    try { current.blocks.push(block(node)); }
    catch (error) { result.errors.push(`${current.date}:${error instanceof Error ? error.message : "invalid-note"}`); }
  }
  finish();
  return result;
}
