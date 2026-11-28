import type { Locale, UpdateItem } from "@/contents/updates/types";
import { UpdateEntry } from "./UpdateEntry";

export function UpdateCard({ item, locale, headingLevel = 2 }: { item: UpdateItem; locale: Locale; headingLevel?: 2 | 3 }) {
  return <article id={item.id} data-update-id={item.id} className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <UpdateEntry item={item} locale={locale} headingLevel={headingLevel} />
  </article>;
}
