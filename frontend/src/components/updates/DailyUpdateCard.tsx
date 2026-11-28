import type { DailyUpdateGroup } from "@/contents/updates/group-by-date";
import type { Locale } from "@/contents/updates/types";
import { UpdateEntry } from "./UpdateEntry";

export function DailyUpdateCard({ group, locale }: { group: DailyUpdateGroup; locale: Locale }) {
  const id = `date-${group.date}`;
  return <section id={id} data-update-date={group.date} aria-labelledby={`${id}-heading`}
    className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 id={`${id}-heading`} className="text-xl font-bold text-slate-950"><time dateTime={group.date}>{group.date}</time></h2>
    <div className="mt-5 divide-y divide-slate-200">{group.items.map(item =>
      <article key={item.id} id={item.id} data-update-id={item.id} className="min-w-0 scroll-mt-24 py-6 first:pt-0 last:pb-0">
        <UpdateEntry item={item} locale={locale} headingLevel={3} />
      </article>)}
    </div>
  </section>;
}
