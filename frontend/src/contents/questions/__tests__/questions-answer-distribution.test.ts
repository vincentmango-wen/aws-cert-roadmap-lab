/**
 * ACR-004 / GitHub #312 regression invariants. Previously CLF-C02 correct answers were heavily biased
 * toward A (45/50, 90%) with no D answers; SAA-C03 had 28/50 A answers (56%). Selecting A alone
 * undermined practice-test validity. ACR-010's static explanations made the bias machine-readable,
 * risking a low-quality generated-content signal. scripts/rebalance-question-answers.mjs corrected the
 * order deterministically; these tests prevent recurrence when adding questions.
 *
 * Invariants:
 * 1. No correctChoiceId exceeds 40% of answers. Four choices ideally have 25% each; 20 of 50 leaves room
 * beyond a balanced 12-13 while catching the old 90%/56% bias.
 * 2. Every A/B/C/D choice is correct at least once.
 * 3. Every question lists choices in A,B,C,D order in every locale. questions-locale-parity.test.ts (4)
 * checks only the set, so this adds ordering coverage.
 *
 * Cross-locale correctChoiceId equality is already covered by IMMUTABLE_FIELDS in
 * questions-locale-parity.test.ts (3); do not duplicate it here.
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

/**
 * Maximum share for the most frequent correct-answer letter. Four-choice questions ideally have 25% per
 * letter.
 */
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
