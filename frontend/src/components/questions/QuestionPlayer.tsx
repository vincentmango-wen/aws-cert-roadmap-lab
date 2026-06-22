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
 * サーバー側で解決済みの関連リンク情報。
 * server component (`questions/[questionId]/page.tsx`) が存在チェックを行い、
 * この型で QuestionPlayer に渡す。
 * これにより "use client" な QuestionPlayer が termGuards (terms.json 85KB) を
 * client bundle に引き込まない。
 */
export type ResolvedLink = {
  id: string;
  exists: boolean;
};

type QuestionPlayerProps = {
  /** UI 文言ローカライズ用 locale。未指定なら 'ja'（既存呼び出し互換性維持）。 */
  locale?: QuestionPlayerLocale;
  /** UI 文言辞書。未指定なら locale に対応する既定辞書（questionPlayerLabelsByLocale[locale]）を使う。 */
  labels?: QuestionPlayerLabels;
  question: Question;
  previousQuestionId?: string;
  nextQuestionId?: string;
  // resolved* は server component (`questions/[questionId]/page.tsx`) で必ず解決して渡される。
  // 「存在しない関連 ID にはリンクを張らない」不変条件を server 側で守るため、型レベルで required にしている。
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
 * question.exam に応じて exam list path を返す。
 * P5 R1 Critical-2 対策: 旧版は常に '/questions/clf' を hardcode していたため
 * SAA 問題 (saa-001..saa-030) の breadcrumb / 戻り link が誤 CLF を指していた。
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
  };

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

            <p className="mt-2 text-sm leading-6 text-slate-800">
              {resolvedLabels.correctAnswerLabel}
              <span className="font-bold">
                {correctChoice
                  ? `${correctChoice.choiceId}. ${correctChoice.text}`
                  : question.correctChoiceId}
              </span>
            </p>
          </div>

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

          {/* 実務での使いどころ: 客観的な実務文脈・よくある誤解の枠（体験談・一人称感想は入れない）。
              practicalNote が存在する設問のみ表示。存在しない場合はセクションごと非表示。 */}
          {question.practicalNote ? (
            <div className="mb-6">
              <h3 className="mb-2 text-base font-bold text-slate-950">
                {resolvedLabels.practicalNoteTitle}
              </h3>
              <p className="whitespace-pre-line leading-7 text-slate-800">{question.practicalNote}</p>
            </div>
          ) : null}

          {/* 公式ドキュメント: officialDocs が存在かつ allowlist を通過した件が1件以上の場合のみ表示。 */}
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
        </section>
      ) : null}

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-950">
          {resolvedLabels.relatedLinksTitle}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 関連サービス: 実在するもののみ表示。1件もなければセクションごと非表示 */}
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

          {/* 関連用語: 実在するもののみ表示。1件もなければセクションごと非表示 */}
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

          {/* 関連比較記事: 実在するもののみ表示。1件もなければセクションごと非表示 */}
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
