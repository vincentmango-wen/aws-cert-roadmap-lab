import { MarkdownContent } from "@/components/comparisons/MarkdownContent";
import type { ArchitectureLocale } from "@/types/architecture";
import { splitArchitectureCorrections } from "./splitArchitectureCorrections";

export function ArchitectureArticleBody({ content, locale }: {
  content: string;
  locale: ArchitectureLocale;
}) {
  const section = splitArchitectureCorrections(content, locale);
  if (!section) return <MarkdownContent content={content} locale={locale} />;

  const { before, after, entries, title } = section;
  const [latest, ...history] = entries;
  return (
    <div className="space-y-7">
      {before.trim() ? <MarkdownContent content={before} locale={locale} /> : null}
      {latest ? (
        <section className="space-y-5" aria-labelledby="architecture-corrections">
          <h2
            className="border-b border-slate-200 pb-3 text-2xl font-bold text-slate-950"
            id="architecture-corrections"
          >
            {title}
          </h2>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900">
              <time dateTime={latest.date}>{latest.date}</time>
            </h3>
            <MarkdownContent content={latest.body} locale={locale} />
          </div>
          {history.map(({ date, body }) => (
            <details key={date} className="rounded-lg border border-slate-200 bg-white">
              <summary className="cursor-pointer rounded-lg px-3 py-2 font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                <time dateTime={date}>{date}</time>
              </summary>
              <div className="border-t border-slate-200 px-3 py-4">
                <MarkdownContent content={body} locale={locale} />
              </div>
            </details>
          ))}
        </section>
      ) : null}
      {after.trim() ? <MarkdownContent content={after} locale={locale} /> : null}
    </div>
  );
}
