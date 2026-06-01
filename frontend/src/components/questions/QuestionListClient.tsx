"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  QUESTION_CATEGORIES,
  QUESTION_CATEGORY_LABELS,
  QUESTION_DIFFICULTIES,
  QUESTION_DIFFICULTY_LABELS,
  formatRelatedServices,
} from "../../lib/questions";
import type {
  Question,
  QuestionCategory,
  QuestionDifficulty,
} from "../../types/question";

type CategoryFilter = "all" | QuestionCategory;

type DifficultyFilter = "all" | QuestionDifficulty;

type QuestionListClientProps = {
  questions: Question[];
};

export function QuestionListClient({
  questions,
}: QuestionListClientProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>("all");

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

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="question-category-filter"
              className="block text-sm font-semibold text-slate-900"
            >
              カテゴリ
            </label>
            <select
              id="question-category-filter"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value as CategoryFilter)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">すべてのカテゴリ</option>
              {QUESTION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {QUESTION_CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="question-difficulty-filter"
              className="block text-sm font-semibold text-slate-900"
            >
              難易度
            </label>
            <select
              id="question-difficulty-filter"
              value={selectedDifficulty}
              onChange={(event) =>
                setSelectedDifficulty(event.target.value as DifficultyFilter)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">すべての難易度</option>
              {QUESTION_DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {QUESTION_DIFFICULTY_LABELS[difficulty]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          表示中：{filteredQuestions.length}問 / 全{questions.length}問
        </p>
      </div>

      {filteredQuestions.length > 0 ? (
        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <Link
              key={question.questionId}
              href={`/questions/${question.questionId}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {question.questionId.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {QUESTION_CATEGORY_LABELS[question.category]}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {QUESTION_DIFFICULTY_LABELS[question.difficulty]}
                    </span>
                  </div>

                  <h2 className="text-base font-bold leading-relaxed text-slate-950 group-hover:text-blue-700 md:text-lg">
                    {question.question}
                  </h2>

                  <p className="text-sm text-slate-600">
                    関連サービス：{formatRelatedServices(question.relatedServices)}
                  </p>
                </div>

                <span className="text-sm font-semibold text-blue-700">
                  問題を見る →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-900">
            条件に一致する問題がありません。
          </p>
          <p className="mt-2 text-sm text-slate-600">
            カテゴリまたは難易度の条件を変更してください。
          </p>
        </div>
      )}
    </section>
  );
}