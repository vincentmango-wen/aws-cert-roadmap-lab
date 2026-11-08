/**
 * Ensure practicalNote meets the depth gate: at least two paragraphs separated by double newlines and at
 * least 200 characters. Covers all six CLF-C02/SAA-C03 ja/en/zh JSON files. Fail and list every
 * violating questionId. Also count Japanese notes containing CLF-C02 or SAA-C03 and report via
 * console.warn only; exam keywords do not cause failure.
 */
import { describe, expect, it } from "vitest";

import type { Question } from "@/types/question";

import clfEn from "../../../../contents/questions/clf-c02.en.json";
import clfJa from "../../../../contents/questions/clf-c02.ja.json";
import clfZh from "../../../../contents/questions/clf-c02.zh.json";
import saaEn from "../../../../contents/questions/saa-c03.en.json";
import saaJa from "../../../../contents/questions/saa-c03.ja.json";
import saaZh from "../../../../contents/questions/saa-c03.zh.json";

type FileEntry = { name: string; questions: Question[] };

const FILES: FileEntry[] = [
  { name: "clf-c02.ja", questions: clfJa as Question[] },
  { name: "clf-c02.en", questions: clfEn as Question[] },
  { name: "clf-c02.zh", questions: clfZh as Question[] },
  { name: "saa-c03.ja", questions: saaJa as Question[] },
  { name: "saa-c03.en", questions: saaEn as Question[] },
  { name: "saa-c03.zh", questions: saaZh as Question[] },
];

const MIN_CHARS = 200;
const MIN_PARAGRAPHS = 2;

describe("questions practicalNote schema", () => {
  it(`(1) all practicalNote are strings with >= ${MIN_PARAGRAPHS} paragraphs and >= ${MIN_CHARS} chars`, () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      for (const q of questions) {
        const note = q.practicalNote;

        if (typeof note !== "string") {
          violations.push(
            `[${name}] questionId=${q.questionId} — practicalNote missing or not a string (got ${typeof note})`,
          );
          continue;
        }

        const paragraphs = note.split("\n\n").filter((p) => p.trim().length > 0);
        if (paragraphs.length < MIN_PARAGRAPHS) {
          violations.push(
            `[${name}] questionId=${q.questionId} — paragraphs=${paragraphs.length} (need >= ${MIN_PARAGRAPHS})`,
          );
        }

        if (note.length < MIN_CHARS) {
          violations.push(
            `[${name}] questionId=${q.questionId} — chars=${note.length} (need >= ${MIN_CHARS})`,
          );
        }
      }
    }

    expect(
      violations,
      `practicalNote depth violations (${violations.length} found):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });

  it("(2) [warn-only] exam keyword presence in practicalNote (ja files)", () => {
    // Advisory check: warn about Japanese practicalNote fields containing exam-name keywords.
    // Do not fail: content policy permits notes with or without exam keywords.
    const jaFiles: FileEntry[] = FILES.filter((f) => f.name.endsWith(".ja"));
    const withKeyword: string[] = [];

    for (const { name, questions } of jaFiles) {
      for (const q of questions) {
        const note = q.practicalNote ?? "";
        if (note.includes("CLF-C02") || note.includes("SAA-C03")) {
          withKeyword.push(`[${name}] questionId=${q.questionId}`);
        }
      }
    }

    if (withKeyword.length > 0) {
      console.warn(
        `[warn] practicalNote contains exam keyword (CLF-C02 or SAA-C03) in ${withKeyword.length} question(s):\n` +
          withKeyword.join("\n"),
      );
    }

    // Warning only; always passes.
    expect(true).toBe(true);
  });
});
