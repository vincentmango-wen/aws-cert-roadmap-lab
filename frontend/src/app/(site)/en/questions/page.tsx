import type { Metadata } from "next";
import Link from "next/link";
import {
  getPublishedClfQuestionsByLocale,
  getPublishedSaaQuestionsByLocale,
} from "../../questions/question-detail-data";
import { createPageMetadata } from "@/lib/seo";

const LOCALE = "en" as const;

export const metadata: Metadata = createPageMetadata({
  title: "AWS Practice Questions",
  description:
    "Practice AWS Cloud Practitioner (CLF-C02) and Solutions Architect Associate (SAA-C03) exam questions with explanations and related AWS services.",
  path: "/en/questions",
  keywords: [
    "AWS practice questions",
    "CLF-C02",
    "SAA-C03",
    "Cloud Practitioner",
    "Solutions Architect Associate",
  ],
});

const clfQuestions = getPublishedClfQuestionsByLocale(LOCALE);
const saaQuestions = getPublishedSaaQuestionsByLocale(LOCALE);

export default function EnglishQuestionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <section className="rounded-3xl bg-slate-950 px-6 py-10 text-white md:px-10 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          Practice
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
          AWS Practice Questions
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
          Practice multiple-choice questions for AWS Cloud Practitioner
          (CLF-C02) and Solutions Architect Associate (SAA-C03).
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/en/questions/clf"
            className="rounded-full bg-blue-500 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-400"
          >
            CLF-C02 questions
          </Link>
          <Link
            href="/en/questions/saa"
            className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
          >
            SAA-C03 questions
          </Link>
          <Link
            href="/en/terms"
            className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
          >
            Review related terms
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
                CLF-C02 Practice Questions
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              {clfQuestions.length}
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Review cloud concepts, security, core services, billing, and
            support. Recommended starting point for beginners.
          </p>

          <Link
            href="/en/questions/clf"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Go to CLF questions
          </Link>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Solutions Architect Associate
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                SAA-C03 Practice Questions
              </h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-emerald-700">
              {saaQuestions.length}
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            Practice secure, resilient, high-performing, and cost-optimized
            architecture design decisions.
          </p>

          <Link
            href="/en/questions/saa"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            Go to SAA questions
          </Link>
        </article>
      </section>

      {clfQuestions.length === 0 && saaQuestions.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-900">
            English questions are coming soon.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Japanese versions are available at{" "}
            <Link
              href="/questions"
              className="text-blue-700 hover:text-blue-900"
            >
              /questions
            </Link>
            .
          </p>
        </section>
      ) : null}
    </div>
  );
}
