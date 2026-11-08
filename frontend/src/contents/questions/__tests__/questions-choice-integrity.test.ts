/**
 * Choice-integrity invariants added during independent ACR-003 engineering verification. Mutation tests
 * exposed gaps that all 48 existing tests missed: a nonexistent correctChoiceId E (JSON type assertions
 * bypass TS validation), a deleted choiceExplanations key, and a wrong correct-answer slot shared by all
 * locales. Locale parity alone compares IDs, not whether their meaning still matches after translated
 * choices are reordered.
 *
 * Invariants:
 * 1. correctChoiceId belongs to A/B/C/D and exists in choices.
 * 2. choiceExplanations contains all A-D keys with nonempty string values.
 * 3. Exactly one explanation starts with its locale's correct-answer marker, and its slot matches
 * correctChoiceId. Reordered translations break this relationship.
 *
 * Coverage: contents/questions/clf-c02.{ja,en,zh}.json and saa-c03.{ja,en,zh}.json.
 * Answer-letter distribution is intentionally separate. At creation, the 80-question dataset was biased
 * toward A (CLF 90%, SAA 77% at 30 questions); a distribution test would immediately fail. ACR-004 owns
 * that correction.
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

/**
 * Localized prefixes identifying a correct choice. Covers spelling variants found across all 1,200
 * existing slots.
 */
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
