/**
 * ArchitecturesListClient.tsx
 *
 * 一覧ページ本体 (locale 引数で全文言切替). server component として動作する
 * (interactivity 不要 / 既存 ja 一覧と同じ静的 layout).
 * comparisons の ComparisonsListClient と同型構造.
 */
import Link from "next/link";
import {
  createArchitecturePath,
  createLocalizedPath,
} from "@/app/(site)/architectures/architecture-detail-data";
import type { ArchitecturesPageData } from "@/app/(site)/architectures/architectures-page-data";
import { isExistingTerm } from "@/lib/termGuards";
import { awsServiceLabels } from "@/types/architecture";
import type {
  Architecture,
  ArchitectureCategory,
} from "@/types/architecture";

function getCategoryLabel(
  categoryLabels: Record<ArchitectureCategory, string>,
  category: string,
): string {
  if (category in categoryLabels) {
    return categoryLabels[category as ArchitectureCategory];
  }
  return category;
}

function formatServiceName(service: string): string {
  return awsServiceLabels[service] ?? service;
}

type ArchitecturesListClientProps = ArchitecturesPageData;

function ArchitectureCard({
  architecture,
  locale,
  labels,
}: {
  architecture: Architecture;
  locale: ArchitecturesListClientProps["locale"];
  labels: ArchitecturesListClientProps["labels"];
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {getCategoryLabel(labels.categoryLabels, architecture.category)}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {labels.levelLabels[architecture.level]}
        </span>
        {architecture.examScopes.map((examScope) => (
          <span
            key={`${architecture.architectureId}-${examScope}`}
            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
          >
            {examScope}
          </span>
        ))}
      </div>

      <h3 className="mt-4 text-xl font-bold leading-8 text-slate-950">
        <Link
          href={createArchitecturePath(locale, architecture.slug)}
          className="hover:text-blue-700"
        >
          {architecture.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-7 text-slate-700">
        {architecture.description}
      </p>

      <div className="mt-5">
        <h4 className="text-sm font-bold text-slate-900">
          {labels.targetServicesLabel}
        </h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {architecture.services.map((service) =>
            isExistingTerm(service) ? (
              <Link
                key={`${architecture.architectureId}-${service}`}
                href={createLocalizedPath(locale, `/terms/${service}`)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {formatServiceName(service)}
              </Link>
            ) : (
              <span
                key={`${architecture.architectureId}-${service}`}
                className="rounded-full border border-slate-100 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-400"
              >
                {formatServiceName(service)}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-bold text-slate-900">
          {labels.examPointsTagsLabel}
        </h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {architecture.tags.map((tag) => (
            <span
              key={`${architecture.architectureId}-${tag}`}
              className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={createArchitecturePath(locale, architecture.slug)}
          className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {labels.detailLinkLabel}
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export function ArchitecturesListClient({
  locale,
  labels,
  architectures,
  categories,
}: ArchitecturesListClientProps) {
  const totalCount = architectures.length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">
          {labels.heroEyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {labels.heroTitle}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          {labels.heroDescription}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{labels.publishedLabel}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {totalCount}
              {labels.publishedCount}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{labels.examScopeLabel}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {labels.examScopeValue}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{labels.themeLabel}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {labels.themeValue}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-950">
          {labels.categoriesTitle}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              {getCategoryLabel(labels.categoryLabels, category)}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {architectures.map((architecture) => (
          <ArchitectureCard
            key={architecture.architectureId}
            architecture={architecture}
            locale={locale}
            labels={labels}
          />
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold text-slate-950">
          {labels.pointsTitle}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">
              {labels.pointAvailabilityTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {labels.pointAvailabilityBody}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">
              {labels.pointFaultToleranceTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {labels.pointFaultToleranceBody}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">{labels.pointCostTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {labels.pointCostBody}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">
              {labels.pointSecurityTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {labels.pointSecurityBody}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
