/**
 * question-player-ssr-content.test.tsx
 *
 * ACR-010 / #320。QuestionPlayer の「初期レンダー HTML」（= SSG で出力される静的 HTML と
 * 同じ状態）に、解説本文が常時含まれることを構造的に担保する invariant テスト。
 *
 * 背景:
 *   改修前は explanation / choiceExplanations / practicalNote / officialDocs が
 *   `{isSubmitted ? ... : null}` ゲートの内側にあり、isSubmitted の初期値が false のため
 *   静的 HTML の DOM に一切出力されていなかった（RSC flight payload = <script> 内にのみ存在）。
 *   Google はレンダー後 DOM からテキストを抽出するため、これらは索引対象にならず
 *   thin content 判定の主因になっていた。
 *
 * 方針:
 *   jsdom / @testing-library/react は導入しない（新規依存を増やさない）。
 *   既存 dependency である react-dom/server の renderToStaticMarkup を使い、
 *   「回答前（isSubmitted === false）の初期 HTML」そのものを検査する。
 *
 * 検証 invariant:
 *  (1) 初期 HTML に explanation 全文 / choiceExplanations A-D 全値 / practicalNote 全文 /
 *      filterValidOfficialDocs を通した officialDocs[].label 全件 /
 *      「正解の choiceId + 正解選択肢テキスト」が含まれる
 *  (2) 初期 HTML に回答結果セクション（resultTitle / correctLabel / incorrectLabel /
 *      yourAnswerLabel）が含まれない — 回答結果は回答後のみ、を維持する
 *  (3) 出力に `<details` が含まれ、かつ `<details open` を含まない
 *      （静的 HTML は必ず閉じた状態で出力される = クローキングに該当しない）
 *
 * 対象: clf/saa × ja/en/zh の 6 ファイル（100 問 × 3 言語 = 300 レンダー）。
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
 * renderToStaticMarkup が施す HTML エスケープを復元する。
 * React が escape するのは & < > " ' の 5 文字のみ。
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

/** 全 locale × 全 question の初期 HTML を 1 度だけ生成して使い回す。 */
const RENDERED: { locale: QuestionPlayerLocale; question: Question; html: string; text: string }[] =
  ENTRIES.flatMap(({ locale, questions }) =>
    questions.map((question) => {
      const html = renderInitialMarkup(question, locale);
      return { locale, question, html, text: decodeHtml(html) };
    }),
  );

describe("QuestionPlayer 初期レンダー HTML (SSG 出力相当)", () => {
  it("invariant(1): 解説本文がすべて初期 HTML に含まれる", () => {
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

  it("invariant(2): 回答結果セクションの文言が初期 HTML に含まれない", () => {
    const violations: string[] = [];

    for (const { locale, question, html, text } of RENDERED) {
      const id = `${locale}/${question.questionId}`;
      const labels = questionPlayerLabelsByLocale[locale];

      // resultTitle / yourAnswerLabel は問題本文に出現しない文言なので素の包含で判定する。
      for (const [field, value] of [
        ["resultTitle", labels.resultTitle],
        ["yourAnswerLabel", labels.yourAnswerLabel],
      ] as const) {
        if (text.includes(value)) {
          violations.push(`${id}: ${field} (${JSON.stringify(value)}) が初期 HTML に含まれている`);
        }
      }

      // correctLabel / incorrectLabel は素の包含では判定できない。
      // questions-choice-integrity.test.ts の invariant(3) が保証しているとおり
      // choiceExplanations は正解／誤答マーカー（ja「正解です。」 en "Correct."/"Incorrect."）で
      // 始まる仕様であり、解説本文を常時出力する以上これらの語は必ず HTML に現れる。
      // そこで「回答結果セクションが描画する要素そのもの」の不在を検査する。
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

  it("invariant(3): <details> が存在し open 属性が付いていない", () => {
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
});
