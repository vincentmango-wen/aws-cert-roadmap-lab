import Link from "next/link";
import { QuestionListClient } from "@/components/questions/QuestionListClient";
import { getDictionary } from "@/i18n/dictionaries";
import { AIF_QUESTION_CATEGORIES } from "@/lib/questions";
import { createPageMetadata } from "@/lib/seo";
import {
  createAifQuestionsListPath,
  createLocalizedQuestionPath,
  createQuestionsListPath,
  getPublishedAifQuestionsByLocale,
  type QuestionDetailLocale,
} from "./question-detail-data";

const text = {
  ja: { title: "AIF-C01模擬問題", description: "AWS Certified AI Practitionerの5つの試験分野を、オリジナルの4択問題で確認しましょう。", link: "AIF-C01の問題を見る", unit: "問", badge: "AI Practitioner" },
  en: { title: "AIF-C01 Practice Questions", description: "Practice all five AWS Certified AI Practitioner exam domains with original multiple-choice questions.", link: "View AIF-C01 questions", unit: "", badge: "AI Practitioner" },
  zh: { title: "AIF-C01 模擬題", description: "透過原創四選一練習題，複習 AWS Certified AI Practitioner 的五個考試領域。", link: "查看 AIF-C01 題庫", unit: " 題", badge: "AI Practitioner" },
} satisfies Record<QuestionDetailLocale, { title: string; description: string; link: string; unit: string; badge: string }>;

export function aifListMetadata(locale: QuestionDetailLocale) {
  const copy = text[locale];
  return createPageMetadata({
    title: copy.title, description: copy.description, path: createAifQuestionsListPath(locale),
    enableLanguageAlternates: true,
    keywords: ["AIF-C01", "AWS Certified AI Practitioner", copy.title],
  });
}

export function AifQuestionCard({ locale }: { locale: QuestionDetailLocale }) {
  const copy = text[locale];
  const count = getPublishedAifQuestionsByLocale(locale).length;
  return (
    <article className="rounded-2xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-violet-700">{copy.badge}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{copy.title}</h2>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold whitespace-nowrap text-violet-700">{count}{copy.unit}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-700">{copy.description}</p>
      <Link href={createAifQuestionsListPath(locale)} className="mt-6 inline-flex rounded-full bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800">{copy.link}</Link>
    </article>
  );
}

export function AifQuestionsPage({ locale }: { locale: QuestionDetailLocale }) {
  const copy = text[locale];
  const labels = getDictionary(locale).questions;
  const questions = getPublishedAifQuestionsByLocale(locale);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <nav className="text-sm text-slate-600" aria-label={labels.breadcrumbQuestions}>
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href={createLocalizedQuestionPath(locale, "/")} className="hover:text-violet-700">{labels.breadcrumbHome}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={createQuestionsListPath(locale)} className="hover:text-violet-700">{labels.breadcrumbQuestions}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-slate-900" aria-current="page">AIF-C01</li>
        </ol>
      </nav>
      <header className="mt-6 mb-8 rounded-3xl border border-violet-200 bg-violet-50 p-7 md:p-10">
        <p className="text-sm font-semibold text-violet-700">{copy.badge}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-700">{copy.description}</p>
      </header>
      <QuestionListClient locale={locale} questions={questions} categories={AIF_QUESTION_CATEGORIES} />
    </div>
  );
}
