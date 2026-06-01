import type { Metadata } from "next";
import Link from "next/link";
import rawQuestions from "../../../contents/questions/clf-c02.json";
import {
  getBeginnerRecommendedQuestions,
  getPublishedQuestions,
  getQuestionCategorySummaries,
  getQuestionDifficultySummaries,
  QUESTION_DIFFICULTY_LABELS,
} from "../../lib/questions";
import type { Question } from "../../types/question";

export const metadata: Metadata = {
  title: "AWS模擬問題 | AWS資格ロードマップラボ",
  description:
    "AWS Cloud Practitioner / SAA の理解度を確認できる模擬問題ページです。まずはCLF-C02の基礎問題から始められます。",
};

const questions = getPublishedQuestions(rawQuestions as Question[]);
const categorySummaries = getQuestionCategorySummaries(questions);
const difficultySummaries = getQuestionDifficultySummaries(questions);
const beginnerQuestions = getBeginnerRecommendedQuestions(questions, 3);

export default function QuestionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <section className="rounded-3xl bg-slate-950 px-6 py-10 text-white md:px-10 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          Practice
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
          AWS模擬問題
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
          AWS Cloud Practitionerの理解度を確認できる問題集です。
          まずはCLF-C02の基礎問題から解き、AWSサービスの違い・責任共有モデル・料金・サポートを整理しましょう。
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/questions/clf"
            className="rounded-full bg-blue-500 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-400"
          >
            CLF-C02問題を見る
          </Link>
          <Link
            href="/terms"
            className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
          >
            関連用語を復習する
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Cloud Practitioner
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                CLF-C02 模擬問題
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              {questions.length}問
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            クラウドの概念、セキュリティ、主要サービス、料金・サポートを確認できます。
            初学者はここから始めてください。
          </p>

          <Link
            href="/questions/clf"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            問題一覧へ進む
          </Link>
        </article>

        <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Solutions Architect Associate
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-500">
                SAA-C03 模擬問題
              </h2>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-bold text-slate-600">
              将来対応
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            高可用性、セキュアな設計、パフォーマンス、コスト最適化の問題はPhase 2以降で追加します。
          </p>

          <button
            type="button"
            disabled
            className="mt-6 inline-flex cursor-not-allowed rounded-full bg-slate-300 px-5 py-3 text-sm font-bold text-slate-600"
          >
            準備中
          </button>
        </article>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Category</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              カテゴリ別に確認する
            </h2>
          </div>
          <Link
            href="/questions/clf"
            className="text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            すべての問題を見る →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {categorySummaries.map((summary) => (
            <Link
              key={summary.category}
              href="/questions/clf"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-950">
                  {summary.label}
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  {summary.count}問
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {summary.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">Difficulty</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          難易度別の問題数
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {difficultySummaries.map((summary) => (
            <div
              key={summary.difficulty}
              className="rounded-2xl bg-slate-50 p-5"
            >
              <p className="text-sm font-semibold text-slate-600">
                {QUESTION_DIFFICULTY_LABELS[summary.difficulty]}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {summary.count}
                <span className="ml-1 text-base font-semibold text-slate-500">
                  問
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold text-blue-700">Recommended</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          初心者におすすめの問題
        </h2>

        <div className="mt-6 grid gap-4">
          {beginnerQuestions.map((question) => (
            <Link
              key={question.questionId}
              href={`/questions/${question.questionId}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-700">
                    {question.questionId.toUpperCase()} /{" "}
                    {QUESTION_DIFFICULTY_LABELS[question.difficulty]}
                  </p>
                  <h3 className="mt-2 text-base font-bold leading-7 text-slate-950 md:text-lg">
                    {question.question}
                  </h3>
                </div>
                <span className="text-sm font-bold text-blue-700">
                  問題を見る →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}