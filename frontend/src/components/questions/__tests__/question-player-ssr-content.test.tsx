/**
 * ACR-010 / #320: verify that QuestionPlayer's initial rendered HTML, matching SSG output, always
 * contains explanations. Previously explanation, choiceExplanations, practicalNote and officialDocs were
 * behind the isSubmitted gate. Its initial false value omitted them from the HTML DOM, leaving them only
 * inside the RSC script payload. That prevented rendered-DOM indexing and was a primary cause of
 * thin-content classification.
 *
 * Use the existing react-dom/server renderToStaticMarkup dependency, without adding jsdom or
 * @testing-library/react, to inspect the actual pre-answer HTML.
 *
 * Invariants:
 * 1. Initial HTML includes the full explanation, A-D choice explanations, practicalNote, every
 * officialDocs label accepted by filterValidOfficialDocs, and the correct choice ID/text.
 * 2. The answer-result section (resultTitle, correctLabel, incorrectLabel, yourAnswerLabel) remains
 * absent until submission.
 * 3. The output contains details but not details open: static HTML starts collapsed, avoiding cloaking.
 *
 * Coverage: six clf/saa x ja/en/zh files, 100 questions x 3 locales = 300 renders.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { filterValidOfficialDocs } from "@/lib/official-doc";
import type { Question } from "@/types/question";

import clfEn from "../../../../contents/questions/clf-c02.en.json";
import clfJa from "../../../../contents/questions/clf-c02.ja.json";
import clfZh from "../../../../contents/questions/clf-c02.zh.json";
import saaEn from "../../../../contents/questions/saa-c03.en.json";
import saaJa from "../../../../contents/questions/saa-c03.ja.json";
import saaZh from "../../../../contents/questions/saa-c03.zh.json";
import { QuestionPlayer } from "../QuestionPlayer";
import {
  questionPlayerLabelsByLocale,
  type QuestionPlayerLocale,
} from "../question-player-labels";

type LocaleEntry = {
  locale: QuestionPlayerLocale;
  questions: Question[];
};

const ENTRIES: LocaleEntry[] = [
  { locale: "ja", questions: [...clfJa, ...saaJa] as Question[] },
  { locale: "en", questions: [...clfEn, ...saaEn] as Question[] },
  { locale: "zh", questions: [...clfZh, ...saaZh] as Question[] },
];

/**
 * Decode renderToStaticMarkup HTML escaping. React escapes only the five characters &, <, >, double
 * quote and apostrophe.
 */
function decodeHtml(html: string): string {
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function renderInitialMarkup(
  question: Question,
  locale: QuestionPlayerLocale,
): string {
  return renderToStaticMarkup(
    <QuestionPlayer
      locale={locale}
      question={question}
      resolvedServices={[]}
      resolvedTerms={[]}
      resolvedComparisons={[]}
    />,
  );
}

/**
 * Generate initial HTML once for every locale/question pair and reuse it.
 */
const RENDERED: { locale: QuestionPlayerLocale; question: Question; html: string; text: string }[] =
  ENTRIES.flatMap(({ locale, questions }) =>
    questions.map((question) => {
      const html = renderInitialMarkup(question, locale);
      return { locale, question, html, text: decodeHtml(html) };
    }),
  );

describe("QuestionPlayer initial-render HTML (equivalent to SSG output)", () => {
  it("invariant(1): initial HTML contains all explanation content", () => {
    const violations: string[] = [];

    for (const { locale, question, text } of RENDERED) {
      const id = `${locale}/${question.questionId}`;

      const expectations: { field: string; value: string }[] = [
        { field: "explanation", value: question.explanation },
      ];

      for (const choice of question.choices) {
        const choiceExplanation = question.choiceExplanations?.[choice.choiceId];
        if (choiceExplanation) {
          expectations.push({
            field: `choiceExplanations.${choice.choiceId}`,
            value: choiceExplanation,
          });
        }
      }

      if (question.practicalNote) {
        expectations.push({ field: "practicalNote", value: question.practicalNote });
      }

      for (const doc of filterValidOfficialDocs(question.officialDocs)) {
        expectations.push({ field: `officialDocs[${doc.url}].label`, value: doc.label });
      }

      const correctChoice = question.choices.find(
        (choice) => choice.choiceId === question.correctChoiceId,
      );
      if (correctChoice) {
        expectations.push({
          field: "correctChoice",
          value: `${correctChoice.choiceId}. ${correctChoice.text}`,
        });
      } else {
        violations.push(`${id}: correctChoiceId=${question.correctChoiceId} が choices に存在しない`);
      }

      for (const { field, value } of expectations) {
        if (!text.includes(value)) {
          violations.push(`${id}: ${field} が初期 HTML に含まれない`);
        }
      }
    }

    expect(violations, `初期 HTML に欠落している解説フィールド:\n${violations.join("\n")}`).toEqual(
      [],
    );
  });

  it("invariant(2): initial HTML excludes answer-result section labels", () => {
    const violations: string[] = [];

    for (const { locale, question, html, text } of RENDERED) {
      const id = `${locale}/${question.questionId}`;
      const labels = questionPlayerLabelsByLocale[locale];

      // Use plain containment for resultTitle/yourAnswerLabel because these labels do not occur in question bodies.
      for (const [field, value] of [
        ["resultTitle", labels.resultTitle],
        ["yourAnswerLabel", labels.yourAnswerLabel],
      ] as const) {
        if (text.includes(value)) {
          violations.push(`${id}: ${field} (${JSON.stringify(value)}) が初期 HTML に含まれている`);
        }
      }

      // Plain containment is insufficient for correctLabel/incorrectLabel.
      // As guaranteed by invariant (3) in questions-choice-integrity.test.ts,
      // choiceExplanations begin with localized correct/incorrect markers (English: Correct./Incorrect.).
      // These words necessarily appear in HTML because explanations are always rendered.
      // Instead, assert the absence of the exact elements rendered by the answer-result section.
      for (const [field, value] of [
        ["correctLabel", labels.correctLabel],
        ["incorrectLabel", labels.incorrectLabel],
      ] as const) {
        const resultMarkup = `<p class="text-base font-bold text-slate-950">${value}</p>`;
        if (html.includes(resultMarkup)) {
          violations.push(`${id}: ${field} の回答結果ブロックが初期 HTML に含まれている`);
        }
      }
    }

    expect(
      violations,
      `初期 HTML に混入した回答結果文言:\n${violations.join("\n")}`,
    ).toEqual([]);
  });

  it("invariant(3): details exists without the open attribute", () => {
    const violations: string[] = [];

    for (const { locale, question, html } of RENDERED) {
      const id = `${locale}/${question.questionId}`;

      if (!html.includes("<details")) {
        violations.push(`${id}: <details> が初期 HTML に存在しない`);
      }

      if (/<details[^>]*\sopen(\s|>|=)/.test(html)) {
        violations.push(`${id}: <details> に open 属性が付いている`);
      }
    }

    expect(violations, `<details> の invariant 違反:\n${violations.join("\n")}`).toEqual([]);
  });

  it("invariant(4): approved localized disclaimers appear before the answer UI", () => {
    for (const { locale, text } of RENDERED) {
      const disclaimer = questionPlayerLabelsByLocale[locale].questionDisclaimer;
      const disclaimerIndex = text.indexOf(disclaimer);
      const choicesIndex = text.indexOf(questionPlayerLabelsByLocale[locale].choicesTitle);

      expect(disclaimerIndex, `${locale}: 免責文が初期 HTML に含まれる`).toBeGreaterThanOrEqual(0);
      expect(disclaimerIndex, `${locale}: 免責文が回答UIより前にある`).toBeLessThan(choicesIndex);
    }
  });
});
