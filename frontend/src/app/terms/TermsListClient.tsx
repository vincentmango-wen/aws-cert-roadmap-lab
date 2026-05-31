"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type TermCategory =
  | "Compute"
  | "Storage"
  | "Database"
  | "Networking"
  | "Security"
  | "Monitoring"
  | "Integration"
  | "Management";

export type TermLevel = "beginner" | "intermediate" | "advanced";

export type ExamScope = "CLF-C02" | "SAA-C03";

export type TermSummary = {
  termId: string;
  name: string;
  shortName: string;
  category: TermCategory;
  level: TermLevel;
  examScopes: ExamScope[];
  priority: string;
  oneLine: string;
};

type TermsListClientProps = {
  terms: TermSummary[];
};

const categories: Array<"All" | TermCategory> = [
  "All",
  "Compute",
  "Storage",
  "Database",
  "Networking",
  "Security",
  "Monitoring",
  "Integration",
  "Management",
];

const examScopes: Array<"All" | ExamScope> = [
  "All",
  "CLF-C02",
  "SAA-C03",
];

const categoryLabels: Record<"All" | TermCategory, string> = {
  All: "すべて",
  Compute: "Compute",
  Storage: "Storage",
  Database: "Database",
  Networking: "Networking",
  Security: "Security",
  Monitoring: "Monitoring",
  Integration: "Integration",
  Management: "Management",
};

const levelLabels: Record<TermLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export function TermsListClient({ terms }: TermsListClientProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<"All" | TermCategory>("All");
  const [selectedExam, setSelectedExam] =
    useState<"All" | ExamScope>("All");

  const filteredTerms = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return terms.filter((term) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        term.name.toLowerCase().includes(normalizedKeyword) ||
        term.shortName.toLowerCase().includes(normalizedKeyword) ||
        term.oneLine.toLowerCase().includes(normalizedKeyword) ||
        term.termId.toLowerCase().includes(normalizedKeyword);

      const matchesCategory =
        selectedCategory === "All" || term.category === selectedCategory;

      const matchesExam =
        selectedExam === "All" || term.examScopes.includes(selectedExam);

      return matchesKeyword && matchesCategory && matchesExam;
    });
  }, [keyword, selectedCategory, selectedExam, terms]);

  const beginnerCount = terms.filter(
    (term) => term.level === "beginner",
  ).length;

  const saaCount = terms.filter((term) =>
    term.examScopes.includes("SAA-C03"),
  ).length;

  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-sm sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-bold text-sky-100">
            AWS Glossary
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                AWS用語集
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                AWS Cloud PractitionerとSAAの学習に必要な主要サービスを、
                カテゴリ、試験区分、学習優先度で整理しています。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">{terms.length}</p>
                <p className="mt-1 text-sm text-slate-300">登録用語</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">{beginnerCount}</p>
                <p className="mt-1 text-sm text-slate-300">初級用語</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">{saaCount}</p>
                <p className="mt-1 text-sm text-slate-300">SAA対象</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px_200px]">
            <div>
              <label
                htmlFor="term-search"
                className="text-sm font-bold text-slate-800"
              >
                キーワード検索
              </label>
              <input
                id="term-search"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="例：S3, Lambda, セキュリティ"
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="text-sm font-bold text-slate-800"
              >
                カテゴリ
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value as "All" | TermCategory,
                  )
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="exam-filter"
                className="text-sm font-bold text-slate-800"
              >
                試験区分
              </label>
              <select
                id="exam-filter"
                value={selectedExam}
                onChange={(event) =>
                  setSelectedExam(event.target.value as "All" | ExamScope)
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                {examScopes.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam === "All" ? "すべて" : exam}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-bold text-slate-900">
              {filteredTerms.length}
            </span>
            <span>件表示中</span>
            {keyword.trim().length > 0 && (
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                keyword: {keyword}
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                category: {selectedCategory}
              </span>
            )}
            {selectedExam !== "All" && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                exam: {selectedExam}
              </span>
            )}
          </div>
        </div>

        {filteredTerms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              該当する用語がありません
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              検索キーワード、カテゴリ、試験区分を変更してください。
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTerms.map((term) => (
              <article
                key={term.termId}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                    {term.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {levelLabels[term.level]}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    {term.priority}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-slate-500">
                    {term.shortName}
                  </p>
                  <h2 className="mt-1 text-xl font-bold leading-7 text-slate-950">
                    {term.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {term.oneLine}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {term.examScopes.map((exam) => (
                    <span
                      key={exam}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
                    >
                      {exam}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href={`/terms/${term.termId}`}
                    className="inline-flex text-sm font-bold text-sky-700 hover:text-sky-900"
                  >
                    詳細を見る
                    <span aria-hidden="true" className="ml-1">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-100 p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
                Next Step
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                用語を覚えたら、比較と問題で確認する
              </h2>
              <p className="mt-4 leading-7 text-slate-700">
                AWS試験では、サービス名を覚えるだけでは足りません。
                似ているサービスとの違いを比較し、模擬問題で選択肢を判断できる状態にします。
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/comparisons"
                className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
              >
                サービス比較を見る
              </Link>
              <Link
                href="/questions"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                模擬問題へ進む
              </Link>
              <Link
                href="/architectures"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                AWS構成図を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}