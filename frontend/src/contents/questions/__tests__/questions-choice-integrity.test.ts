/**
 * questions-choice-integrity.test.ts
 *
 * ACR-003 の eng-test 独立検証で、既存 3 本のテストが取りこぼしていた
 * 「選択肢そのものの整合性」を担保するために追加した invariant テスト。
 *
 * 追加の動機（mutation 注入で実証した穴 / いずれも既存 48 tests は全 pass のまま素通りした）:
 *  - `correctChoiceId` を存在しない "E" に書き換えても検出されない
 *    （JSON は `as Question[]` キャストで読み込むため TS の型検査も効かない）
 *  - `choiceExplanations` のキーを 1 つ削除しても検出されない
 *  - 3 言語そろって `correctChoiceId` が別スロットへずれても検出されない
 *    （locale parity は「ID が 3 言語で一致するか」しか見ないため、
 *      翻訳時に選択肢が並べ替わり ID の指す中身が言語ごとに変わる事故を検出できない）
 *
 * 検証 invariant:
 *  (1) correctChoiceId が {A,B,C,D} のいずれかで、かつ choices に実在する
 *  (2) choiceExplanations が A-D の全キーを持ち、値が非空文字列
 *  (3) 正解マーカー（ja「正解です」/「正解。」, en "Correct.", zh「正解。」/「正確。」）が
 *      付く choiceExplanation が correctChoiceId のスロットと一致し、かつそこ 1 つだけである
 *      — choices が翻訳時に並べ替わると、この対応が崩れて検出できる
 *
 * 対象ファイル (6 件):
 *   contents/questions/clf-c02.{ja,en,zh}.json
 *   contents/questions/saa-c03.{ja,en,zh}.json
 *
 * 注: 「正解の A/B/C/D 分布の偏り」はここでは検証していない。
 *     既存 80 問が A に偏っており（CLF A 率 90% / SAA 30 問時点 77%）、
 *     分布テストを入れると既存データで即 fail するため。是正は ACR-004 のスコープ。
 */
import { describe, expect, it } from "vitest";

import type { ChoiceId, Question } from "@/types/question";

import clfEn from "../../../../contents/questions/clf-c02.en.json";
import clfJa from "../../../../contents/questions/clf-c02.ja.json";
import clfZh from "../../../../contents/questions/clf-c02.zh.json";
import saaEn from "../../../../contents/questions/saa-c03.en.json";
import saaJa from "../../../../contents/questions/saa-c03.ja.json";
import saaZh from "../../../../contents/questions/saa-c03.zh.json";

type Locale = "ja" | "en" | "zh";
type FileEntry = { name: string; locale: Locale; questions: Question[] };

const FILES: FileEntry[] = [
  { name: "clf-c02.ja", locale: "ja", questions: clfJa as Question[] },
  { name: "clf-c02.en", locale: "en", questions: clfEn as Question[] },
  { name: "clf-c02.zh", locale: "zh", questions: clfZh as Question[] },
  { name: "saa-c03.ja", locale: "ja", questions: saaJa as Question[] },
  { name: "saa-c03.en", locale: "en", questions: saaEn as Question[] },
  { name: "saa-c03.zh", locale: "zh", questions: saaZh as Question[] },
];

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];

/** 各ロケールの「この選択肢が正解」を示す接頭辞。既存 1,200 スロット全件で成立する表記ゆれを網羅している。 */
const CORRECT_MARKER: Record<Locale, RegExp> = {
  ja: /^正解(です|。)/,
  en: /^Correct[.。]/,
  zh: /^(正解|正確)[。.]/,
};

describe("questions choice integrity", () => {
  it("(1) correctChoiceId is one of {A,B,C,D} and exists in choices", () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      for (const q of questions) {
        const ids = q.choices.map((c) => c.choiceId);

        if (!CHOICE_IDS.includes(q.correctChoiceId)) {
          violations.push(
            `[${name}] questionId=${q.questionId} — correctChoiceId=${JSON.stringify(q.correctChoiceId)} is not one of A/B/C/D`,
          );
          continue;
        }

        if (!ids.includes(q.correctChoiceId)) {
          violations.push(
            `[${name}] questionId=${q.questionId} — correctChoiceId="${q.correctChoiceId}" not found in choices [${ids.join(",")}]`,
          );
        }
      }
    }

    expect(
      violations,
      `correctChoiceId violations (${violations.length} found):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });

  it("(2) choiceExplanations has all of A-D as non-empty strings", () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      for (const q of questions) {
        const explanations = q.choiceExplanations;

        if (!explanations) {
          violations.push(
            `[${name}] questionId=${q.questionId} — choiceExplanations missing`,
          );
          continue;
        }

        for (const id of CHOICE_IDS) {
          const text = explanations[id];
          if (typeof text !== "string" || text.trim().length === 0) {
            violations.push(
              `[${name}] questionId=${q.questionId} — choiceExplanations["${id}"] missing or empty`,
            );
          }
        }
      }
    }

    expect(
      violations,
      `choiceExplanations violations (${violations.length} found):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });

  it("(3) the correct-answer marker sits on exactly the correctChoiceId slot in every locale", () => {
    const violations: string[] = [];

    for (const { name, locale, questions } of FILES) {
      const marker = CORRECT_MARKER[locale];

      for (const q of questions) {
        const marked = CHOICE_IDS.filter((id) =>
          marker.test((q.choiceExplanations?.[id] ?? "").trim()),
        );

        if (marked.length !== 1 || marked[0] !== q.correctChoiceId) {
          violations.push(
            `[${name}] questionId=${q.questionId} — correctChoiceId="${q.correctChoiceId}" but marker found on [${marked.join(",") || "none"}]`,
          );
        }
      }
    }

    expect(
      violations,
      `correct-answer marker misalignment (${violations.length} found) — ` +
        `this usually means choices were reordered during translation or correctChoiceId points at the wrong slot:\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });
});
