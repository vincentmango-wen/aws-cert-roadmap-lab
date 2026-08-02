import type { Metadata } from "next";
import Link from "next/link";
import { QuestionListClient } from "@/components/questions/QuestionListClient";
import { getPublishedSaaQuestionsByLocale } from "../question-detail-data";
import {
  getQuestionCategorySummaries,
} from "@/lib/questions";
import { createPageMetadata } from "@/lib/seo";

const LOCALE = "ja" as const;

export const metadata: Metadata = createPageMetadata({
  title: "SAA-C03模擬問題一覧",
  description:
    "AWS Solutions Architect Associate SAA-C03の試験対策に使える4択形式の模擬問題一覧です。",
  path: "/questions/saa",
  keywords: ["SAA-C03", "AWS Solutions Architect Associate", "模擬問題"],
});

const questions = getPublishedSaaQuestionsByLocale(LOCALE);
const categorySummaries = getQuestionCategorySummaries(questions);

export default function SaaQuestionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue-700">
              ホーム
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/questions" className="hover:text-blue-700">
              模擬問題
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-slate-900">SAA-C03</li>
        </ol>
      </nav>

      <section className="mt-6 rounded-3xl bg-slate-950 px-6 py-10 text-white md:px-10 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          SAA-C03
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
          AWS Solutions Architect Associate 模擬問題
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
          SAA-C03の試験範囲に沿って、セキュアな設計、耐障害性、性能、コスト最適化の
          観点からアーキテクチャ選定の理解を確認します。
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categorySummaries.map((summary) => (
            <div
              key={summary.category}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm font-semibold text-emerald-200">
                {summary.label}
              </p>
              <p className="mt-2 text-3xl font-bold">
                {summary.count}
                <span className="ml-1 text-base font-semibold text-slate-300">
                  問
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Questions</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              問題一覧
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              カテゴリと難易度で絞り込みできます。
            </p>
          </div>

          <Link
            href="/questions"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            模擬問題トップへ戻る →
          </Link>
        </div>

        <div className="mt-6">
          <QuestionListClient questions={questions} locale="ja" />
        </div>
      </section>
    </div>
  );
}
