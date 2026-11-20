import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import clfEn from "../../../../contents/questions/clf-c02.en.json";
import clfJa from "../../../../contents/questions/clf-c02.ja.json";
import clfZh from "../../../../contents/questions/clf-c02.zh.json";
import saaEn from "../../../../contents/questions/saa-c03.en.json";
import saaJa from "../../../../contents/questions/saa-c03.ja.json";
import saaZh from "../../../../contents/questions/saa-c03.zh.json";
import type { Question } from "@/types/question";
import { QuestionPlayer, type QuestionPlayerLocale } from "../QuestionPlayer";

const examples = [
  ["ja", saaJa, clfJa, "対象の日付は受信日ではなく", "クエリで他の日付"],
  ["en", saaEn, clfEn, "The team can place each record", "What should it do?"],
  ["zh", saaZh, clfZh, "團隊可以依每筆事件", "哪項調整最合適？"],
] as const;

function renderQuestionStem(question: Question, locale: QuestionPlayerLocale) {
  const html = renderToStaticMarkup(<QuestionPlayer
    question={question}
    locale={locale}
    resolvedServices={[]}
    resolvedTerms={[]}
    resolvedComparisons={[]}
  />);
  const headings = [...html.matchAll(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/g)];
  expect(headings).toHaveLength(1);
  const [, attributes, contents] = headings[0];
  const readText = (value: string) => value
    .replace(/<[^>]*>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  expect(readText(contents)).toBe(question.question);
  const groups = [...contents.matchAll(/<span class="([^"]*)">([\s\S]*?)<\/span>/g)];
  const stemClasses = /class="([^"]+)"/.exec(attributes)?.[1] ?? "";
  const choices = [...html.matchAll(/aria-pressed="false"[^>]*>[\s\S]*?<span class="[^"]*">[A-D]<\/span><span class="([^"]+)">/g)];
  expect(choices).toHaveLength(4);
  return { stemClasses, choices, groups, readText };
}

describe.each(examples)("question stem in %s", (locale, saa, clf, constraints, ask) => {
  const long = saa.find((question) => question.questionId === "saa-068") as Question;
  const short = clf.find((question) => question.questionId === "clf-052") as Question;

  it.each([long, short])("uses the same text size and leading as choices for $questionId", (question) => {
    const { stemClasses, choices } = renderQuestionStem(question, locale);
    const typography = (classes: string) =>
      classes.split(" ").filter((token) => /^(?:sm:)?(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|leading-\d+)$/.test(token)).sort();
    expect(typography(stemClasses)).toEqual(["leading-7", "sm:text-base", "text-sm"]);
    for (const [, choiceClasses] of choices) {
      expect(typography(choiceClasses)).toEqual(typography(stemClasses));
    }
  });

  it("uses intentional display paragraphs for the long stem only", () => {
    const { groups, readText } = renderQuestionStem(long, locale);
    expect(groups).toHaveLength(3);
    expect(groups.every(([, className]) => className.split(" ").includes("block"))).toBe(true);
    expect(readText(groups[1][2]).trimStart().startsWith(constraints)).toBe(true);
    expect(readText(groups[2][2]).trimStart().startsWith(ask)).toBe(true);
    expect(renderQuestionStem(short, locale).groups).toHaveLength(0);
  });

  it("renders all edited text intact when a break marker no longer exists", () => {
    const edited = { ...long, question: long.question.replace(ask, "…") };
    expect(renderQuestionStem(edited, locale).groups).toHaveLength(0);
  });
});

describe.each(examples)("curated long stems in %s", (locale, saa) => {
  it.each(["saa-053", "saa-057", "saa-059", "saa-062", "saa-067"])("preserves exactly three nonempty groups for %s", (id) => {
    const question = saa.find((entry) => entry.questionId === id) as Question;
    const { groups, readText } = renderQuestionStem(question, locale);
    expect(groups).toHaveLength(3);
    expect(groups.every(([, , content]) => readText(content).trim().length > 0)).toBe(true);
  });
});
