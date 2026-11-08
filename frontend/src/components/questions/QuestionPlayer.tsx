"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChoiceId, Question } from "../../types/question";
import { filterValidOfficialDocs } from "@/lib/official-doc";
import { formatSlugLabel } from "@/lib/format-slug-label";
import {
  questionPlayerLabelsByLocale,
  type QuestionPlayerLabels,
  type QuestionPlayerLocale,
} from "./question-player-labels";

export type { QuestionPlayerLabels, QuestionPlayerLocale } from "./question-player-labels";

/**
 * Related-link data resolved on the server. The questions/[questionId]/page.tsx server component checks
 * existence and passes this type to QuestionPlayer, keeping termGuards (terms.json, 85KB) out of the
 * use-client bundle.
 */
export type ResolvedLink = {
  id: string;
  exists: boolean;
};

type QuestionPlayerProps = {
  /**
   * Locale for UI labels; defaults to ja for compatibility with existing callers.
   */
  locale?: QuestionPlayerLocale;
  /**
   * UI dictionary; defaults to questionPlayerLabelsByLocale[locale] when omitted.
   */
  labels?: QuestionPlayerLabels;
  question: Question;
  previousQuestionId?: string;
  nextQuestionId?: string;
  // The questions/[questionId]/page.tsx server component must resolve and pass every resolved* property.
  // These properties are required at the type level so the server enforces the invariant against linking to nonexistent related IDs.
  resolvedServices: ResolvedLink[];
  resolvedTerms: ResolvedLink[];
  resolvedComparisons: ResolvedLink[];
};

const LOCALE_PREFIX: Record<QuestionPlayerLocale, "" | "/en" | "/zh"> = {
  ja: "",
  en: "/en",
  zh: "/zh",
};

function localizePath(
  locale: QuestionPlayerLocale,
  path: `/${string}`,
): string {
  const prefix = LOCALE_PREFIX[locale];
  return prefix === "" ? path : `${prefix}${path}`;
}

/**
 * Return the exam-list path for question.exam. Fixes P5 R1 Critical-2: the previous hardcoded
 * /questions/clf sent SAA question breadcrumbs/back links (saa-001..saa-030) to the wrong exam.
 */
function getExamListPath(
  exam: Question["exam"],
  locale: QuestionPlayerLocale,
): string {
  if (exam === "SAA-C03") {
    return localizePath(locale, "/questions/saa");
  }
  return localizePath(locale, "/questions/clf");
}

function getExamLabel(
  exam: Question["exam"],
  labels: QuestionPlayerLabels,
): string {
  return exam === "SAA-C03" ? labels.saaLabel : labels.clfLabel;
}

export function QuestionPlayer({
  locale = "ja",
  labels,
  question,
  previousQuestionId,
  nextQuestionId,
  resolvedServices,
  resolvedTerms,
  resolvedComparisons,
}: QuestionPlayerProps): React.JSX.Element {
  const resolvedLabels = labels ?? questionPlayerLabelsByLocale[locale];

  const [selectedChoiceId, setSelectedChoiceId] = useState<ChoiceId | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  // Keep explanations independent of isSubmitted (ACR-010).
  // Initially false: SSG output has no open attribute on details.
  // Children always exist in static HTML, but the section initially appears collapsed in the browser.
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);

  const selectedChoice = useMemo(() => {
    return question.choices.find((choice) => choice.choiceId === selectedChoiceId) ?? null;
  }, [question.choices, selectedChoiceId]);

  const correctChoice = useMemo(() => {
    return (
      question.choices.find((choice) => choice.choiceId === question.correctChoiceId) ?? null
    );
  }, [question.choices, question.correctChoiceId]);

  const isCorrect = selectedChoiceId === question.correctChoiceId;

  const difficultyLabel = resolvedLabels.difficulty[question.difficulty];

  const examListPath = getExamListPath(question.exam, locale);
  const examLabel = getExamLabel(question.exam, resolvedLabels);

  const handleSelectChoice = (choiceId: ChoiceId) => {
    if (isSubmitted) {
      return;
    }

    setSelectedChoiceId(choiceId);
  };

  const handleSubmit = () => {
    if (!selectedChoiceId) {
      return;
    }

    setIsSubmitted(true);
    setIsExplanationOpen(true);
  };

  // Retry does not change isExplanationOpen; preserve an open explanation.
  const handleRetry = () => {
    setSelectedChoiceId(null);
    setIsSubmitted(false);
  };

  const getChoiceClassName = (choiceId: ChoiceId): string => {
    const baseClass =
      "w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-slate-500";

    if (!isSubmitted) {
      if (selectedChoiceId === choiceId) {
        return `${baseClass} border-slate-900 bg-slate-100`;
      }

      return `${baseClass} border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50`;
    }

    if (choiceId === question.correctChoiceId) {
      return `${baseClass} border-green-600 bg-green-50`;
    }

    if (choiceId === selectedChoiceId && !isCorrect) {
      return `${baseClass} border-red-600 bg-red-50`;
    }

    return `${baseClass} border-slate-200 bg-white opacity-70`;
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate-600" aria-label={resolvedLabels.breadcrumbLabel}>
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href={localizePath(locale, "/")} className="hover:underline">
              {resolvedLabels.homeLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={localizePath(locale, "/questions")}
              className="hover:underline"
            >
              {resolvedLabels.questionsLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={examListPath} className="hover:underline">
              {examLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-900">{question.questionId.toUpperCase()}</li>
        </ol>
      </nav>

      <p
        role="note"
        className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
      >
        {resolvedLabels.questionDisclaimer}
      </p>

      <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            {question.exam}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {question.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {resolvedLabels.difficultyLabel}：{difficultyLabel}
          </span>
        </div>

        <p className="mb-2 text-sm font-semibold text-slate-500">
          {question.questionId.toUpperCase()}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {question.question}
        </h1>
      </header>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-950">{resolvedLabels.choicesTitle}</h2>

        <div className="space-y-3">
          {question.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.choiceId;

            return (
              <button
                key={choice.choiceId}
                type="button"
                className={getChoiceClassName(choice.choiceId)}
                onClick={() => handleSelectChoice(choice.choiceId)}
                aria-pressed={isSelected}
                disabled={isSubmitted}
              >
                <span className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-bold">
                    {choice.choiceId}
                  </span>
                  <span className="text-sm leading-7 text-slate-900 sm:text-base">
                    {choice.text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={handleSubmit}
            disabled={!selectedChoiceId || isSubmitted}
          >
            {resolvedLabels.submitLabel}
          </button>

          {isSubmitted ? (
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              onClick={handleRetry}
            >
              {resolvedLabels.retryLabel}
            </button>
          ) : null}
        </div>
      </section>

      {isSubmitted ? (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">{resolvedLabels.resultTitle}</h2>

          <div
            className={
              isCorrect
                ? "mb-5 rounded-xl border border-green-600 bg-green-50 p-4"
                : "mb-5 rounded-xl border border-red-600 bg-red-50 p-4"
            }
          >
            <p className="text-base font-bold text-slate-950">
              {isCorrect ? resolvedLabels.correctLabel : resolvedLabels.incorrectLabel}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-800">
              {resolvedLabels.yourAnswerLabel}
              <span className="font-bold">
                {selectedChoice
                  ? `${selectedChoice.choiceId}. ${selectedChoice.text}`
                  : resolvedLabels.unselectedLabel}
              </span>
            </p>
          </div>
        </section>
      ) : null}

      {/* Always render explanations independently of isSubmitted (ACR-010). Initially collapsed details and explicit summary wording prevent pre-answer spoilers. Static HTML has no open attribute, but crawlers can read the body. */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-950">
          {resolvedLabels.explanationSectionTitle}
        </h2>

        <details
          className="group"
          open={isExplanationOpen}
          onToggle={(event) => setIsExplanationOpen(event.currentTarget.open)}
        >
          <summary className="cursor-pointer list-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">
            {resolvedLabels.explanationSummaryLabel}
          </summary>

          <div className="mt-5">
            <p className="mb-5 rounded-xl border border-green-600 bg-green-50 p-4 text-sm leading-6 text-slate-900">
              {resolvedLabels.correctAnswerLabel}
              <span className="font-bold">
                {correctChoice
                  ? `${correctChoice.choiceId}. ${correctChoice.text}`
                  : question.correctChoiceId}
              </span>
            </p>

            <div className="mb-6">
              <h3 className="mb-2 text-base font-bold text-slate-950">
                {resolvedLabels.explanationTitle}
              </h3>
              <p className="whitespace-pre-line leading-7 text-slate-800">{question.explanation}</p>
            </div>

            {question.choiceExplanations ? (
              <div className="mb-6">
                <h3 className="mb-3 text-base font-bold text-slate-950">
                  {resolvedLabels.choiceExplanationsTitle}
                </h3>
                <div className="space-y-3">
                  {question.choices.map((choice) => {
                    const explanation = question.choiceExplanations?.[choice.choiceId];

                    if (!explanation) {
                      return null;
                    }

                    return (
                      <div
                        key={choice.choiceId}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="mb-1 text-sm font-bold text-slate-950">
                          {choice.choiceId}. {choice.text}
                        </p>
                        <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Practical context and common misconceptions: objective information only, without personal anecdotes or first-person opinions. Show this section only when practicalNote exists. */}
            {question.practicalNote ? (
              <div className="mb-6">
                <h3 className="mb-2 text-base font-bold text-slate-950">
                  {resolvedLabels.practicalNoteTitle}
                </h3>
                <p className="whitespace-pre-line leading-7 text-slate-800">{question.practicalNote}</p>
              </div>
            ) : null}

            {/* Official documentation: show only when officialDocs contains at least one allowlisted entry. */}
            {(() => {
              const validDocs = filterValidOfficialDocs(question.officialDocs);
              return validDocs.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-base font-bold text-slate-950">
                    {resolvedLabels.officialDocsTitle}
                  </h3>
                  <ul className="space-y-2">
                    {validDocs.map((doc) => (
                      <li key={doc.url}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-700 underline hover:text-blue-900"
                        >
                          {doc.label}
                          <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}
          </div>
        </details>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-950">
          {resolvedLabels.relatedLinksTitle}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Related services: show only existing entries; hide the entire section when empty. */}
          {resolvedServices.some(({ exists }) => exists) ? (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-700">
                {resolvedLabels.relatedServicesTitle}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {resolvedServices
                  .filter(({ exists }) => exists)
                  .map(({ id: serviceId }) => (
                    <li key={serviceId}>
                      <Link
                        href={localizePath(locale, `/terms/${serviceId}`)}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold !text-slate-700 hover:bg-slate-50"
                      >
                        {formatSlugLabel(serviceId)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {/* Related terms: show only existing entries; hide the entire section when empty. */}
          {resolvedTerms.some(({ exists }) => exists) ? (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-700">
                {resolvedLabels.relatedTermsTitle}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {resolvedTerms
                  .filter(({ exists }) => exists)
                  .map(({ id: termId }) => (
                    <li key={termId}>
                      <Link
                        href={localizePath(locale, `/terms/${termId}`)}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold !text-slate-700 hover:bg-slate-50"
                      >
                        {formatSlugLabel(termId)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {/* Related comparisons: show only existing entries; hide the entire section when empty. */}
          {resolvedComparisons.some(({ exists }) => exists) ? (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-700">
                {resolvedLabels.relatedComparisonsTitle}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {resolvedComparisons
                  .filter(({ exists }) => exists)
                  .map(({ id: slug }) => (
                    <li key={slug}>
                      <Link
                        href={localizePath(locale, `/comparisons/${slug}`)}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold !text-slate-700 hover:bg-slate-50"
                      >
                        {formatSlugLabel(slug)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <nav
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        aria-label={resolvedLabels.navAriaLabel}
      >
        <div>
          {previousQuestionId ? (
            <Link
              href={localizePath(locale, `/questions/${previousQuestionId}`)}
              className="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {resolvedLabels.previousQuestionLabel}
            </Link>
          ) : (
            <span className="inline-flex rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-400">
              {resolvedLabels.noPreviousQuestionLabel}
            </span>
          )}
        </div>

        <Link
          href={examListPath}
          className="inline-flex justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          {resolvedLabels.backToListLabel}
        </Link>

        <div>
          {nextQuestionId ? (
            <Link
              href={localizePath(locale, `/questions/${nextQuestionId}`)}
              className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {resolvedLabels.nextQuestionLabel}
            </Link>
          ) : (
            <span className="inline-flex rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-400">
              {resolvedLabels.noNextQuestionLabel}
            </span>
          )}
        </div>
      </nav>
    </article>
  );
}
