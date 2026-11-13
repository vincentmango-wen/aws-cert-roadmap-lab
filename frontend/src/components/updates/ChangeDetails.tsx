import type { Locale, NoteBlock, NoteInline, UpdateItem } from "@/contents/updates/types";
import { isSafeNoteBlocks } from "@/contents/updates/corrections";
import { getDictionary } from "@/i18n/dictionaries";

type Tone = "article" | "updates";
function renderInline(nodes: NoteInline[], tone: Tone): React.ReactNode {
  return nodes.map((node, index) => {
    if (node.type === "text") return node.value;
    if (node.type === "code") return <code key={index} className="break-words rounded bg-slate-100 px-1">{node.value}</code>;
    if (node.type === "strong") return <strong key={index}>{renderInline(node.children, tone)}</strong>;
    if (node.type === "emphasis") return <em key={index}>{renderInline(node.children, tone)}</em>;
    if (node.type === "link") return <a key={index} href={node.href} className={`rounded-sm break-words underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 ${tone === "article" ? "text-[#115e59] hover:text-[#134e4a] focus-visible:outline-[#0f766e]" : "text-sky-700 hover:text-sky-900 focus-visible:outline-sky-700"}`}>{renderInline(node.children, tone)}</a>;
    return null;
  });
}

function renderBlock(block: NoteBlock, index: number, tone: Tone): React.JSX.Element {
  if (block.type === "paragraph") return <p key={index} className="break-words">{renderInline(block.children, tone)}</p>;
  const List = block.ordered ? "ol" : "ul";
  return <List key={index} className={`space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
    {block.items.map((blocks, itemIndex) => <li key={itemIndex} className="min-w-0 space-y-2">{blocks.map((child, childIndex) => renderBlock(child, childIndex, tone))}</li>)}
  </List>;
}

export function ChangeDetails({ item, locale, part = "all", tone = "updates" }: {
  item: UpdateItem; locale: Locale; part?: "all" | "metadata" | "notes"; tone?: Tone;
}) {
  const copy = getDictionary(locale).updates;
  const notes = item.changeNotes;
  const available = notes.status === "available" && isSafeNoteBlocks(notes.entry.blocks);
  return <>
    {part !== "notes" && <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
      <span data-event-kind={item.eventKind} aria-label={copy.eventDescriptions[item.eventKind]} className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">{copy.events[item.eventKind]}</span>
      <p data-date-kind="effective">{copy.dates[item.dateLabel]} <time dateTime={item.date}>{item.date}</time></p>
      {item.eventKind === "update" && item.publishedAt && <p data-date-kind="published">{copy.dates.published} <time dateTime={item.publishedAt}>{item.publishedAt}</time></p>}
    </div>}
    {part !== "metadata" && notes.status !== "not-applicable" && <div data-change-notes={available ? "available" : "missing"} className="mt-4 min-w-0 space-y-2 break-words text-sm leading-7 text-slate-700">
      <p className="font-semibold">{copy.notes}</p>
      {available && notes.status === "available" ? notes.entry.blocks.map((block, index) => renderBlock(block, index, tone)) : <p>{copy.missingNotes}</p>}
    </div>}
  </>;
}
