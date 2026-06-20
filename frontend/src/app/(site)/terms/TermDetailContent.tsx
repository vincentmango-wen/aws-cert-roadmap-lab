import Link from "next/link";
import type { ReactNode } from "react";
import {
  categoryLabelsByLocale,
  createLocalizedPath,
  createTermDetailPath,
  formatSlugLabel,
  getAdjacentTerms,
  getRelatedTerms,
  levelLabelsByLocale,
  termDetailLabelsByLocale,
  type AwsTerm,
  type TermDetailLocale,
} from "./term-detail-data";
import {
  isExistingComparisonForLocale,
  isExistingArchitectureForLocale,
} from "@/lib/termGuards";
import { filterValidOfficialDocs } from "@/lib/official-doc";

type TermDetailContentProps = {
  locale: TermDetailLocale;
  term: AwsTerm;
};

function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "blue" | "green" | "orange";
}) {
  const variantClassName: Record<
    "default" | "blue" | "green" | "orange",
    string
  > = {
    default: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${variantClassName[variant]}`}
    >
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 text-slate-700">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyMessage({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
      {children}
    </p>
  );
}

export function TermDetailContent({ locale, term }: TermDetailContentProps) {
  const labels = termDetailLabelsByLocale[locale];
  const categoryLabels = categoryLabelsByLocale[locale];
  const levelLabels = levelLabelsByLocale[locale];

  const relatedTerms = getRelatedTerms(locale, term.relatedServices);
  const { previousTerm, nextTerm } = getAdjacentTerms(locale, term.termId);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate-500" aria-label={labels.breadcrumbLabel}>
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={createLocalizedPath(locale, "/")}
              className="hover:text-blue-700"
            >
              {labels.homeLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={createLocalizedPath(locale, "/terms")}
              className="hover:text-blue-700"
            >
              {labels.termsLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-800">{term.name}</li>
        </ol>
      </nav>

      <header className="mt-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap gap-2">
          <Badge variant="blue">{term.category}</Badge>
          <Badge variant="green">{categoryLabels[term.category]}</Badge>
          <Badge variant="orange">{levelLabels[term.level]}</Badge>
          {term.examScopes.map((examScope) => (
            <Badge key={examScope}>{examScope}</Badge>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            {term.shortName}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {term.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {term.oneLine}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href={createLocalizedPath(locale, "/terms")}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
          >
            {labels.backToTermsLabel}
          </Link>
          <Link
            href={createLocalizedPath(locale, "/questions")}
            className="rounded-2xl bg-blue-700 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            {labels.questionsCtaLabel}
          </Link>
        </div>
      </header>

      <main className="mt-10 grid gap-6">
        <Section title={labels.oneLineTitle}>
          <p className="text-lg leading-8">{term.oneLine}</p>
        </Section>

        <Section title={labels.summaryTitle}>
          <p className="leading-8">{term.summary}</p>
        </Section>

        <Section title={labels.useCasesTitle}>
          <BulletList items={term.useCases} />
        </Section>

        <Section title={labels.clfPointsTitle}>
          <BulletList items={term.examPoints} />
        </Section>

        <Section title={labels.saaPointsTitle}>
          {term.saaPoints && term.saaPoints.length > 0 ? (
            <BulletList items={term.saaPoints} />
          ) : (
            <EmptyMessage>{labels.noSaaPoints}</EmptyMessage>
          )}
        </Section>

        {term.practicalNote ? (
          <Section title={labels.practicalNoteTitle}>
            <p className="whitespace-pre-line leading-8">{term.practicalNote}</p>
          </Section>
        ) : null}

        {(() => {
          const validDocs = filterValidOfficialDocs(term.officialDocs);
          if (validDocs.length === 0) return null;
          return (
            <Section title={labels.officialDocsTitle}>
              <ul className="space-y-2">
                {validDocs.map((doc) => (
                  <li key={doc.url}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline hover:text-blue-900"
                    >
                      {doc.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          );
        })()}

        <section className="grid gap-6 lg:grid-cols-2">
          <Section title={labels.costNotesTitle}>
            {term.costNotes && term.costNotes.length > 0 ? (
              <BulletList items={term.costNotes} />
            ) : (
              <EmptyMessage>{labels.noCostNotes}</EmptyMessage>
            )}
          </Section>

          <Section title={labels.securityNotesTitle}>
            {term.securityNotes && term.securityNotes.length > 0 ? (
              <BulletList items={term.securityNotes} />
            ) : (
              <EmptyMessage>{labels.noSecurityNotes}</EmptyMessage>
            )}
          </Section>
        </section>

        <Section title={labels.relatedServicesTitle}>
          {relatedTerms.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedTerms.map((relatedTerm) => (
                <Link
                  key={relatedTerm.termId}
                  href={createTermDetailPath(locale, relatedTerm.termId)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="font-bold text-slate-950">{relatedTerm.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {relatedTerm.oneLine}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyMessage>{labels.noRelatedServices}</EmptyMessage>
          )}
        </Section>

        <section className="grid gap-6 lg:grid-cols-2">
          {/* 関連比較記事: 実在する slug のみ表示。1件もなければ EmptyMessage */}
          <Section title={labels.comparisonArticlesTitle}>
            {(() => {
              const existingSlugs =
                term.comparisonSlugs?.filter((slug) =>
                  isExistingComparisonForLocale(locale, slug),
                ) ?? [];
              return existingSlugs.length > 0 ? (
                <div className="space-y-3">
                  {existingSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={createLocalizedPath(locale, `/comparisons/${slug}`)}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {formatSlugLabel(slug)}
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyMessage>{labels.noComparisonArticles}</EmptyMessage>
              );
            })()}
          </Section>

          {/* 関連構成図: 実在する slug のみ表示。1件もなければ EmptyMessage */}
          <Section title={labels.architectureArticlesTitle}>
            {(() => {
              const existingSlugs =
                term.architectureSlugs?.filter((slug) =>
                  isExistingArchitectureForLocale(locale, slug),
                ) ?? [];
              return existingSlugs.length > 0 ? (
                <div className="space-y-3">
                  {existingSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={createLocalizedPath(
                        locale,
                        `/architectures/${slug}`,
                      )}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {formatSlugLabel(slug)}
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyMessage>{labels.noArchitectureArticles}</EmptyMessage>
              );
            })()}
          </Section>
        </section>

        <Section title={labels.tagsTitle}>
          {term.tags && term.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {term.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : (
            <EmptyMessage>{labels.noTags}</EmptyMessage>
          )}

          <p className="mt-6 text-sm text-slate-500">
            {labels.updatedAtLabel}: {term.updatedAt}
          </p>
        </Section>

        <nav
          className="grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2"
          aria-label={`${labels.previousTermLabel} / ${labels.nextTermLabel}`}
        >
          {previousTerm ? (
            <Link
              href={createTermDetailPath(locale, previousTerm.termId)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            >
              <p className="text-sm text-slate-500">
                {labels.previousTermLabel}
              </p>
              <p className="mt-1 font-bold">{previousTerm.name}</p>
            </Link>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500">
              {labels.noPreviousTerm}
            </div>
          )}

          {nextTerm ? (
            <Link
              href={createTermDetailPath(locale, nextTerm.termId)}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            >
              <p className="text-sm text-slate-500">{labels.nextTermLabel}</p>
              <p className="mt-1 font-bold">{nextTerm.name}</p>
            </Link>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-right text-sm text-slate-500">
              {labels.noNextTerm}
            </div>
          )}
        </nav>
      </main>
    </div>
  );
}