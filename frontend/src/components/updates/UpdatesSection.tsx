import type { Locale, UpdateItem } from "@/contents/updates/types";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { createLocalizedPath } from "@/i18n/locales";
import { UpdateCard } from "./UpdateCard";
import styles from "./UpdatesSection.module.css";

const linkStyle = "inline-flex min-w-0 rounded-sm font-semibold text-sky-700 underline underline-offset-4 hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700";

export function UpdatesSection({ items, locale }: { items: UpdateItem[]; locale: Locale }) {
  const { updates: copy, cta } = getDictionary(locale);
  return <section aria-labelledby="updates-heading" className={`mx-auto max-w-6xl space-y-6 rounded-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 ${styles.section}`}>
    <h2 id="updates-heading" className="text-3xl font-bold text-slate-950">{copy.title}</h2>
    <p className="max-w-3xl leading-7 text-slate-600">{copy.introduction}</p>
    {items.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">{copy.empty}</p> :
      <div className="grid grid-cols-1 gap-6">{items.map((item) => <UpdateCard key={item.id} item={item} locale={locale} headingLevel={3} />)}</div>}
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
      <Link href={createLocalizedPath(locale, "/updates")} className={linkStyle}>{copy.viewAll}</Link>
      <Link href={createLocalizedPath(locale, "/blog")} className={linkStyle}>{cta.readBlog}</Link>
    </div>
  </section>;
}
