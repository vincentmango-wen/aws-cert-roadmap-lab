"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { getDictionary } from "../../i18n/dictionaries";
import { createLocalizedPath, type Locale } from "../../i18n/locales";
import {
  QUESTION_CATEGORIES,
  QUESTION_DIFFICULTIES,
  formatRelatedServices,
} from "../../lib/questions";
import {
  getTotalPages,
  getVisibleRange,
  paginate,
  QUESTIONS_PER_PAGE,
} from "../../lib/pagination";
import type {
  Question,
  QuestionCategory,
  QuestionDifficulty,
} from "../../types/question";

type CategoryFilter = "all" | QuestionCategory;

type DifficultyFilter = "all" | QuestionDifficulty;

type QuestionListClientProps = {
  questions: Question[];
  locale: Locale;
};

export function QuestionListClient({
  questions,
  locale,
}: QuestionListClientProps) {
  const labels = getDictionary(locale).questions;
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsTopRef = useRef<HTMLElement>(null);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const categoryMatched =
        selectedCategory === "all" || question.category === selectedCategory;
      const difficultyMatched =
        selectedDifficulty === "all" ||
        question.difficulty === selectedDifficulty;

      return categoryMatched && difficultyMatched;
    });
  }, [questions, selectedCategory, selectedDifficulty]);

  const totalPages = getTotalPages(filteredQuestions.length, QUESTIONS_PER_PAGE);

  const paginatedQuestions = useMemo(
    () => paginate(filteredQuestions, currentPage, QUESTIONS_PER_PAGE),
    [filteredQuestions, currentPage],
  );

  const visibleRange = getVisibleRange(
    filteredQuestions.length,
    currentPage,
    QUESTIONS_PER_PAGE,
  );

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="space-y-8" ref={resultsTopRef}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="question-category-filter"
              className="block text-sm font-semibold text-slate-900"
            >
              {labels.categoryLabel}
            </label>
            <select
              id="question-category-filter"
              value={selectedCategory}
              onChange={(event) => {
                setSelectedCategory(event.target.value as CategoryFilter);
                setCurrentPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">{labels.allCategoriesLabel}</option>
              {QUESTION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {labels.categoryLabels[category]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="question-difficulty-filter"
              className="block text-sm font-semibold text-slate-900"
            >
              {labels.difficultyLabel}
            </label>
            <select
              id="question-difficulty-filter"
              value={selectedDifficulty}
              onChange={(event) => {
                setSelectedDifficulty(event.target.value as DifficultyFilter);
                setCurrentPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">{labels.allDifficultiesLabel}</option>
              {QUESTION_DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {labels.difficultyLabels[difficulty]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          {filteredQuestions.length > QUESTIONS_PER_PAGE ? (
            <>
              {labels.paginationRangeBefore}
              {visibleRange.start}
              {labels.paginationRangeBetweenStartEnd}
              {visibleRange.end}
              {labels.paginationRangeBetweenEndTotal}
              {filteredQuestions.length}
              {labels.paginationRangeAfter}
            </>
          ) : (
            <>
              {labels.filteredCountPrefix}
              {filteredQuestions.length}
              {labels.filteredCountSeparator}
              {questions.length}
              {labels.filteredCountSuffix}
            </>
          )}
        </p>
      </div>

      {filteredQuestions.length > 0 ? (
        <>
          <div className="grid gap-4">
            {paginatedQuestions.map((question) => (
              <Link
                key={question.questionId}
                href={createLocalizedPath(
                  locale,
                  `/questions/${question.questionId}`,
                )}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-3">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {question.questionId.toUpperCase()}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {labels.categoryLabels[question.category]}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {labels.difficultyLabels[question.difficulty]}
                      </span>
                    </div>

                    <h2 className="text-base font-bold leading-relaxed text-slate-950 group-hover:text-blue-700 md:text-lg">
                      {question.question}
                    </h2>

                    <p className="text-sm text-slate-600">
                      {labels.relatedServicesLabel}
                      {labels.labelSeparator}
                      {formatRelatedServices(
                        question.relatedServices,
                        labels.noRelatedServicesLabel,
                      )}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-blue-700">
                    {labels.viewQuestionLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredQuestions.length > QUESTIONS_PER_PAGE ? (
            <nav
              aria-label={labels.paginationNavAriaLabel}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.paginationPreviousLabel}
              </button>
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                  aria-label={`${labels.paginationGoToPageAriaLabelPrefix}${pageNumber}${labels.paginationGoToPageAriaLabelSuffix}`}
                  className={[
                    "min-w-[2.5rem] rounded-full px-3 py-2 text-sm font-semibold transition",
                    pageNumber === currentPage
                      ? "bg-blue-700 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.paginationNextLabel}
              </button>
            </nav>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-900">
            {labels.emptyStateTitle}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {labels.emptyStateDescription}
          </p>
        </div>
      )}
    </section>
  );
}