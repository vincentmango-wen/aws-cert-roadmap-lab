import type { Metadata } from "next";
import Link from "next/link";
import { QuestionListClient } from "@/components/questions/QuestionListClient";
import { getPublishedClfQuestionsByLocale } from "../../../questions/question-detail-data";
import { createPageMetadata } from "@/lib/seo";

const LOCALE = "zh" as const;

export const metadata: Metadata = createPageMetadata({
  title: "CLF-C02 模擬題",
  description: "AWS Cloud Practitioner（CLF-C02）四選一模擬題練習。",
  path: "/zh/questions/clf",
  keywords: ["CLF-C02", "AWS Cloud Practitioner", "模擬題"],
});

const questions = getPublishedClfQuestionsByLocale(LOCALE);

export default function ChineseClfQuestionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <nav className="text-sm text-slate-600" aria-label="麵包屑">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/zh" className="hover:text-blue-700">
              首頁
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/zh/questions" className="hover:text-blue-700">
              模擬題
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-slate-900">CLF-C02</li>
        </ol>
      </nav>

      <section className="mt-6 rounded-3xl bg-slate-950 px-6 py-10 text-white md:px-10 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          CLF-C02
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
          AWS Cloud Practitioner 模擬題
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
          沿著 CLF-C02 考試領域，確認雲端概念、安全性、核心服務、計費與支援。
        </p>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Questions</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">題目列表</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              可依分類與難度篩選。
            </p>
          </div>

          <Link
            href="/zh/questions"
            className="text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            返回模擬題首頁 →
          </Link>
        </div>

        <div className="mt-6">
          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-900">
                繁體中文 CLF-C02 模擬題即將推出。
              </p>
              <p className="mt-2 text-sm text-slate-600">
                目前可參考日文版：{" "}
                <Link
                  href="/questions/clf"
                  className="text-blue-700 hover:text-blue-900"
                >
                  /questions/clf
                </Link>
                。
              </p>
            </div>
          ) : (
            <QuestionListClient questions={questions} locale="zh" />
          )}
        </div>
      </section>
    </div>
  );
}
