import type { Locale, UpdateItem } from "@/contents/updates/types";
import { getDictionary } from "@/i18n/dictionaries";
import { UpdateCard } from "./UpdateCard";

export function UpdatesPage({ items, locale }: { items: UpdateItem[]; locale: Locale }) {
  const copy = getDictionary(locale).updates;
  return <section aria-labelledby="updates-heading" className="mx-auto w-full max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
    <header className="space-y-4"><h1 id="updates-heading" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.title}</h1>
      <p className="leading-8 text-slate-600">{copy.introduction}</p></header>
    {items.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">{copy.empty}</p> :
      <div className="grid grid-cols-1 gap-6">{items.map((item) => <UpdateCard key={item.id} item={item} locale={locale} />)}</div>}
  </section>;
}
