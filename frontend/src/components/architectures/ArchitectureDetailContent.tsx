/**
 * ArchitectureDetailContent.tsx
 *
 * locale 別の構成図記事詳細ページ本体. ja/en/zh いずれの route からも薄いラッパーで呼ばれる.
 * comparisons の ComparisonDetailContent と同型構造.
 */
import Link from "next/link";
import {
  architectureDetailLabelsByLocale,
  createArchitecturePath,
  createLocalizedPath,
  formatArchitectureCategoryLabel,
  getPublishedArchitectures,
  levelLabelsByLocale,
  resolveDiagramPath,
} from "@/app/(site)/architectures/architecture-detail-data";
import { MarkdownContent } from "@/components/comparisons/MarkdownContent";
import {
  isExistingArchitectureForLocale,
  isExistingTerm,
} from "@/lib/termGuards";
import { awsServiceLabels } from "@/types/architecture";
import type {
  ArchitectureArticle,
  ArchitectureLocale,
} from "@/types/architecture";

type ArchitectureDetailContentProps = {
  locale: ArchitectureLocale;
  architecture: ArchitectureArticle;
};

function formatServiceName(service: string): string {
  return awsServiceLabels[service] ?? service;
}

export function ArchitectureDetailContent({
  locale,
  architecture,
}: ArchitectureDetailContentProps) {
  const labels = architectureDetailLabelsByLocale[locale];
  const levelLabels = levelLabelsByLocale[locale];

  const diagramPath = resolveDiagramPath(locale, architecture);

  const relatedArchitectures = getPublishedArchitectures(locale)
    .filter((item) => item.slug !== architecture.slug)
    .filter(
      (item) =>
        item.category === architecture.category ||
        item.services.some((service) =>
          architecture.services.includes(service),
        ),
    )
    .slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav
        className="mb-8 text-sm text-slate-500"
        aria-label={labels.breadcrumbLabel}
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={createLocalizedPath(locale, "/")}
              className="hover:text-slate-900"
            >
              {labels.homeLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={createLocalizedPath(locale, "/architectures")}
              className="hover:text-slate-900"
            >
              {labels.architecturesLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-900">{architecture.title}</li>
        </ol>
      </nav>

      <article className="space-y-10">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
              {formatArchitectureCategoryLabel(locale, architecture.category)}
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              {levelLabels[architecture.level]}
            </span>

            {architecture.examScopes.map((examScope) => (
              <span
                key={examScope}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {examScope}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {architecture.title}
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-slate-700">
            {architecture.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>
              {labels.publishedAtLabel}:{" "}
              {architecture.publishedAt || labels.unsetLabel}
            </span>
            <span>/</span>
            <span>
              {labels.updatedAtLabel}:{" "}
              {architecture.updatedAt || labels.unsetLabel}
            </span>
          </div>

          {architecture.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {architecture.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {diagramPath ? (
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-950">
              {labels.diagramTitle}
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={diagramPath}
              alt={`${architecture.title}${labels.diagramAltSuffix}`}
              className="w-full rounded-2xl border border-slate-200 bg-white"
            />
          </section>
        ) : null}

        {architecture.services.length > 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">
              {labels.usedServicesTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {labels.usedServicesDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {architecture.services.map((service) =>
                isExistingTerm(service) ? (
                  <Link
                    key={service}
                    href={createLocalizedPath(locale, `/terms/${service}`)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {formatServiceName(service)}
                  </Link>
                ) : (
                  <span
                    key={service}
                    className="rounded-full border border-slate-100 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400"
                  >
                    {formatServiceName(service)}
                  </span>
                ),
              )}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {architecture.content ? (
            <MarkdownContent content={architecture.content} locale={locale} />
          ) : architecture.sections && architecture.sections.length > 0 ? (
            <div className="space-y-8">
              {architecture.sections.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 className="border-b border-slate-200 pb-3 text-2xl font-bold text-slate-950">
                    {section.title}
                  </h2>
                  <p className="whitespace-pre-line leading-8 text-slate-700">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          ) : (
            <p className="leading-8 text-slate-700">{architecture.description}</p>
          )}
        </section>

        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-xl font-bold">{labels.nextLearningTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {labels.nextLearningDescription}
            </p>
          </div>

          <Link
            href={createLocalizedPath(locale, "/architectures")}
            className="inline-flex justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            {labels.backToArchitecturesLabel}
          </Link>
        </section>

        {relatedArchitectures.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-950">
              {labels.relatedArchitecturesTitle}
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {relatedArchitectures.map((item) =>
                isExistingArchitectureForLocale(locale, item.slug) ? (
                  <Link
                    key={item.slug}
                    href={createArchitecturePath(locale, item.slug)}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                  >
                    <p className="text-xs font-semibold text-blue-700">
                      {formatArchitectureCategoryLabel(locale, item.category)}
                    </p>
                    <h3 className="mt-2 font-bold leading-7 text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </Link>
                ) : (
                  <div
                    key={item.slug}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      {formatArchitectureCategoryLabel(locale, item.category)}
                    </p>
                    <h3 className="mt-2 font-bold leading-7 text-slate-700">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
