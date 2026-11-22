import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createAifQuestionsListPath, getPublishedQuestionsByLocale, getPublishedAifQuestionsByLocale, getQuestionStaticParams } from "@/app/(site)/questions/question-detail-data";
import { getDictionary } from "@/i18n/dictionaries";
import sitemap from "@/app/sitemap";
import { buildQuestionQuizJsonLd } from "@/lib/questionJsonLd";
import { aggregateUpdates } from "@/contents/updates/aggregate";
import { isPublicUpdatesPath } from "@/contents/updates";
import JaIndex from "@/app/(site)/questions/page";
import EnIndex from "@/app/(site)/en/questions/page";
import ZhIndex from "@/app/(site)/zh/questions/page";
import { AifQuestionsPage, aifListMetadata } from "@/app/(site)/questions/aif-page-data";
import { getAvailableLocalesForPathname } from "@/i18n/locales";
import { announcements } from "@/contents/updates/announcements";

const counts = [6, 7, 9, 4, 4];
const categories = ["Fundamentals of AI and ML", "Fundamentals of GenAI", "Applications of Foundation Models", "Guidelines for Responsible AI", "Security, Compliance, and Governance for AI Solutions"] as const;

describe("AIF-C01 batch #369", () => {
  it.each(["ja", "en", "zh"] as const)("registers all 30 original questions, labels and routes in %s", (locale) => {
    const questions = getPublishedAifQuestionsByLocale(locale);
    expect(questions.map((q) => q.questionId)).toEqual(Array.from({ length: 30 }, (_, index) => `aif-c01-${String(index + 1).padStart(3, "0")}`));
    expect(categories.map((category) => questions.filter((q) => q.category === category).length)).toEqual(counts);
    expect(questions.every((q) => q.exam === "AIF-C01" && q.choices.length === 4 &&
      q.choices.filter((choice) => choice.choiceId === q.correctChoiceId).length === 1 &&
      Object.keys(q.choiceExplanations ?? {}).length === 4 && (q.officialDocs?.length ?? 0) > 0)).toBe(true);
    expect(new Set(getPublishedQuestionsByLocale(locale).map((q) => q.questionId)).size).toBe(getPublishedQuestionsByLocale(locale).length);
    expect(getQuestionStaticParams(locale)).toContainEqual({ questionId: "aif-c01-030" });
    expect(categories.every((category) => getDictionary(locale).questions.categoryLabels[category]?.length)).toBe(true);
    expect(createAifQuestionsListPath(locale)).toBe(`${locale === "ja" ? "" : "/" + locale}/questions/aif`);
    const prefix = locale === "ja" ? "" : `/${locale}`;
    const listRoute = createAifQuestionsListPath(locale);
    expect(isPublicUpdatesPath("/questions/aif", locale)).toBe(true);
    const routes = new Set(sitemap().map((route) => new URL(route.url).pathname));
    expect(routes.has(listRoute)).toBe(true);
    expect(questions.every((q) => routes.has(`${prefix}/questions/${q.questionId}`))).toBe(true);
    expect(aifListMetadata(locale).alternates?.canonical).toMatch(new RegExp(`${listRoute}$`));
    expect(Object.keys(aifListMetadata(locale).alternates?.languages ?? {}).sort()).toEqual(["en", "ja", "x-default", "zh-Hant"]);
    expect(getAvailableLocalesForPathname(listRoute)).toEqual(expect.arrayContaining(["ja", "en", "zh"]));
    expect(getAvailableLocalesForPathname(`${prefix}/questions/aif-c01-001`)).toEqual(expect.arrayContaining(["ja", "en", "zh"]));
    for (const question of questions) {
      const quiz = buildQuestionQuizJsonLd(question, locale);
      expect(quiz.educationalAlignment).toContainEqual(expect.objectContaining({ targetName: "AWS Certified AI Practitioner (AIF-C01)" }));
      expect(quiz.hasPart).toMatchObject([{ acceptedAnswer: { text: question.choices.find((c) => c.choiceId === question.correctChoiceId)?.text } }]);
    }
  });
  it.each([["ja", JaIndex], ["en", EnIndex], ["zh", ZhIndex]] as const)("%s index links to the list and shows only AIF category options", (locale, Index) => {
    const index = renderToStaticMarkup(createElement(Index));
    expect(index).toContain(`href="${createAifQuestionsListPath(locale)}"`);
    expect(Object.keys(aifListMetadata(locale).alternates?.languages ?? {}).sort()).toEqual(["en", "ja", "x-default", "zh-Hant"]);
    const list = renderToStaticMarkup(createElement(AifQuestionsPage, { locale }));
    const categorySelect = list.match(/<select[^>]*id="question-category-filter"[^>]*>[\s\S]*?<\/select>/)?.[0];
    expect(categorySelect).toBeDefined();
    expect(categorySelect?.match(/<option\b/g)).toHaveLength(6); // all plus five exam domains
    expect(categorySelect).toContain("Fundamentals of GenAI");
    expect(categorySelect).not.toContain("Cloud Concepts");
  });

  it("keeps answer, choice, category and difficulty structure equivalent across locales", () => {
    const shape = (locale: "ja" | "en" | "zh") => getPublishedAifQuestionsByLocale(locale).map(({ questionId, correctChoiceId, category, domain, difficulty, choices }) =>
      ({ questionId, correctChoiceId, category, domain, difficulty, choices: choices.map((c) => c.choiceId) }));
    expect(shape("zh")).toEqual(shape("ja"));
    expect(shape("en")).toEqual(shape("ja"));
  });
  it("registers a tri-language question-bank announcement", () => {
    expect(announcements.find((entry) => entry.id === "aif-c01-001-030")).toMatchObject({
      date: "2026-11-21", category: "question-bank", translations: { zh: expect.any(Object), ja: expect.any(Object), en: expect.any(Object) }, links: [{ path: "/questions/aif" }],
    });
    const publish = aggregateUpdates({ articles: [], announcements, today: "2026-11-21", isPublicPath: (target, language) => isPublicUpdatesPath(target, language) });
    for (const locale of ["ja", "en", "zh"] as const) {
      expect(publish.itemsByLocale[locale].find((item) => item.id === "announcement:aif-c01-001-030")?.links).toMatchObject([
        { href: createAifQuestionsListPath(locale) },
      ]);
    }
  });
});
