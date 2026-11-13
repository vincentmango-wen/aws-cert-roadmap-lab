import type { Locale, UpdateItem } from "@/contents/updates/types";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { createLocalizedPath } from "@/i18n/locales";
import { ChangeDetails } from "./ChangeDetails";

const linkStyle = "rounded-sm text-sm font-semibold text-sky-700 underline underline-offset-4 hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700";

export function UpdateCard({ item, locale, headingLevel = 2 }: { item: UpdateItem; locale: Locale; headingLevel?: 2 | 3 }) {
  const copy = getDictionary(locale).updates;
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const updatesPath = createLocalizedPath(locale, "/updates");
  return (
    <article id={item.id} data-update-id={item.id} className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold text-sky-800">{copy.categories[item.category]}</p>
      <ChangeDetails item={item} locale={locale} part="metadata" />
      <Heading className="mt-3 break-words text-xl font-bold leading-8 text-slate-950">{item.title}</Heading>
      <p className="mt-3 break-words text-sm leading-7 text-slate-600">{item.summary}</p>
      <ChangeDetails item={item} locale={locale} part="notes" />
      {item.links.length > 0 && <ul className="mt-5 space-y-3">{item.links.map((link) => (
        <li key={link.href}><Link href={link.href} className={linkStyle}>{link.label}</Link></li>
      ))}</ul>}
      {(item.corrects || !!item.corrections?.length) && <ul className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        {item.corrects && <li><Link href={`${updatesPath}#${item.corrects}`} className={linkStyle}>{copy.original}</Link></li>}
        {item.corrections?.map((id, index) => <li key={id}><Link href={`${updatesPath}#${id}`} className={linkStyle}>{copy.correction} {index + 1}</Link></li>)}
      </ul>}
    </article>
  );
}
