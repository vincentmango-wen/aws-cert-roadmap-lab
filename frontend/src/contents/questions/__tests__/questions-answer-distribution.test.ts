/**
 * questions-answer-distribution.test.ts
 *
 * ACR-004 / GitHub Issue #312 の再発防止 invariant テスト。
 *
 * 背景:
 *  是正前は CLF-C02 の正解が A=45/50 (90%) / D=0 に激しく偏っていた
 *  （SAA-C03 も A=28/50 = 56%）。全問 A を選ぶだけで 90% 取れる状態で、
 *  模擬試験として実力を測る機能を果たしていなかった。
 *  さらに ACR-010 で解説・正解を静的 HTML に露出させるため、この偏りが
 *  機械可読になり「自動生成された低品質コンテンツ」シグナルになりうる。
 *
 *  scripts/rebalance-question-answers.mjs で決定論的に並べ替えて是正済み。
 *  ここでは「問題を追加したときに再び偏らないこと」を invariant として固定する。
 *
 * 検証 invariant:
 *  (1) 最頻の correctChoiceId が全体の 40% を超えない
 *      — 4 択なので理想は各 25%。50 問なら 40% = 20 問で、均等配分 (12〜13 問) から
 *        十分な余裕がある一方、是正前の 90% / 56% は確実に捕捉できる閾値。
 *  (2) A/B/C/D すべてに 1 問以上の正解が存在する（「D が 0 件」を必ず落とす）
 *  (3) choices[] が全ファイル・全問で A,B,C,D の順に並んでいる
 *      — 既存 questions-locale-parity.test.ts (4) は choiceId の「集合」しか見ておらず
 *        並び順は検証していないため、ここで補う。全ロケールで同一順序を強制するので
 *        「ロケール間で選択肢の並びがずれる」事故もここで落ちる。
 *
 * 重複回避のメモ:
 *  「3 言語で correctChoiceId が一致すること」は questions-locale-parity.test.ts (3) の
 *  IMMUTABLE_FIELDS に correctChoiceId が含まれており既に検証済みのため、ここには追加しない。
 */
import { describe, expect, it } from "vitest";

import type { ChoiceId, Question } from "@/types/question";

import clfEn from "../../../../contents/questions/clf-c02.en.json";
import clfJa from "../../../../contents/questions/clf-c02.ja.json";
import clfZh from "../../../../contents/questions/clf-c02.zh.json";
import saaEn from "../../../../contents/questions/saa-c03.en.json";
import saaJa from "../../../../contents/questions/saa-c03.ja.json";
import saaZh from "../../../../contents/questions/saa-c03.zh.json";

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];

/** 最頻の正解記号が占めてよい上限比率。4 択の理想は 25%。 */
const MAX_SHARE = 0.4;

type FileEntry = { name: string; questions: Question[] };

const FILES: FileEntry[] = [
  { name: "clf-c02.ja", questions: clfJa as Question[] },
  { name: "clf-c02.en", questions: clfEn as Question[] },
  { name: "clf-c02.zh", questions: clfZh as Question[] },
  { name: "saa-c03.ja", questions: saaJa as Question[] },
  { name: "saa-c03.en", questions: saaEn as Question[] },
  { name: "saa-c03.zh", questions: saaZh as Question[] },
];

const countByChoiceId = (questions: Question[]): Record<ChoiceId, number> => {
  const counts: Record<ChoiceId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of questions) {
    if (CHOICE_IDS.includes(q.correctChoiceId)) {
      counts[q.correctChoiceId] += 1;
    }
  }
  return counts;
};

const formatCounts = (
  counts: Record<ChoiceId, number>,
  total: number,
): string =>
  CHOICE_IDS.map(
    (id) => `${id}=${counts[id]} (${((counts[id] / total) * 100).toFixed(1)}%)`,
  ).join(", ");

describe("questions answer distribution", () => {
  it(`(1) no single correctChoiceId exceeds ${MAX_SHARE * 100}% of a file`, () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      const total = questions.length;
      expect(total, `[${name}] must not be empty`).toBeGreaterThan(0);

      const counts = countByChoiceId(questions);
      for (const id of CHOICE_IDS) {
        const share = counts[id] / total;
        if (share > MAX_SHARE) {
          violations.push(
            `[${name}] correctChoiceId="${id}" is ${(share * 100).toFixed(1)}% ` +
              `of ${total} questions (limit ${MAX_SHARE * 100}%) — ${formatCounts(counts, total)}`,
          );
        }
      }
    }

    expect(
      violations,
      `answer distribution is skewed (${violations.length} found) — ` +
        `learners could game the quiz by always picking the same letter:\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });

  it("(2) every choiceId A-D is the correct answer for at least one question", () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      const counts = countByChoiceId(questions);
      for (const id of CHOICE_IDS) {
        if (counts[id] === 0) {
          violations.push(
            `[${name}] correctChoiceId="${id}" never occurs — ${formatCounts(counts, questions.length)}`,
          );
        }
      }
    }

    expect(
      violations,
      `unused correct-answer slots (${violations.length} found):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });

  it("(3) choices are listed in A,B,C,D order in every file", () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      for (const q of questions) {
        const ids = q.choices.map((c) => c.choiceId);
        if (ids.join(",") !== CHOICE_IDS.join(",")) {
          violations.push(
            `[${name}] questionId=${q.questionId} — choices order is [${ids.join(",")}], expected [A,B,C,D]`,
          );
        }
      }
    }

    expect(
      violations,
      `choice ordering violations (${violations.length} found):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });
});
