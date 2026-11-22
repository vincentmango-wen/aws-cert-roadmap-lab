import remarkParse from "remark-parse";
import { unified } from "unified";
import { parseCorrectionNotes } from "@/contents/updates/corrections";
import type { ArchitectureLocale } from "@/types/architecture";

const headings = { ja: "訂正内容", en: "Corrections", zh: "更正說明" } as const;
const processor = unified().use(remarkParse);

type CorrectionSource = { date: string; body: string };
type CorrectionSection = {
  title: string;
  before: string;
  after: string;
  entries: CorrectionSource[];
};

/**
 * Extract only canonical, validated architecture sections. Keep correction bodies as exact source
 * slices so the existing renderer retains their text, lists and links. Null means that the caller
 * must render the complete original source (including legacy or unrecognized sections).
 */
export function splitArchitectureCorrections(
  content: string,
  locale: ArchitectureLocale,
): CorrectionSection | null {
  const title = headings[locale];
  if (!content.includes(title)) return null;

  const { children } = processor.parse(content);
  const sectionIndexes = children.flatMap((node, i) => (
    node.type === "heading" && node.depth === 2
    && node.children.length === 1 && node.children[0].type === "text"
    && node.children[0].value === title
      ? [i]
      : []
  ));
  if (sectionIndexes.length !== 1) return null;

  const [sectionIndex] = sectionIndexes;
  const section = children[sectionIndex];
  const start = section.position?.start.offset;
  const headingEnd = section.position?.end.offset;
  if (start === undefined || headingEnd === undefined || content.slice(start, headingEnd) !== `## ${title}`) return null;

  const tail = children.slice(sectionIndex + 1);
  const nextH2 = tail.findIndex((node) => node.type === "heading" && node.depth === 2);
  const nodes = nextH2 === -1 ? tail : tail.slice(0, nextH2);
  const end = nextH2 === -1 ? content.length : tail[nextH2].position?.start.offset;
  if (end === undefined) return null;
  const before = content.slice(0, start);
  const after = content.slice(end);

  // Only a bare heading is a recognized empty section; malformed content is never removed.
  if (nodes.length === 0 && !content.slice(headingEnd, end).trim()) {
    return { title, before, after, entries: [] };
  }

  const notes = parseCorrectionNotes(content, locale);
  if (notes.errors.length || notes.entries.length < 2) return null;
  const dateHeadings = nodes.filter((node) => node.type === "heading" && node.depth === 3);
  if (dateHeadings.length !== notes.entries.length || nodes[0] !== dateHeadings[0]) return null;

  const entries: CorrectionSource[] = [];
  for (const [i, node] of dateHeadings.entries()) {
    const date = notes.entries[i].date;
    const dateStart = node.position?.start.offset;
    const dateEnd = node.position?.end.offset;
    const bodyEnd = i + 1 < dateHeadings.length ? dateHeadings[i + 1].position?.start.offset : end;
    if (dateStart === undefined || dateEnd === undefined || bodyEnd === undefined
      || content.slice(dateStart, dateEnd) !== `### ${date}`) return null;
    const body = content.slice(dateEnd, bodyEnd);
    if (!body.trim()) return null;
    entries.push({ date, body });
  }

  entries.sort((left, right) => left.date === right.date ? 0 : left.date < right.date ? 1 : -1);
  return { title, before, after, entries };
}
