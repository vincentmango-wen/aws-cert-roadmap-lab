/**
 * questions-practicalnote-schema.test.ts
 *
 * 全 questions の practicalNote が「段落数 >= 2 かつ 200 字以上」の
 * depth gating を満たすことを構造的に担保する。
 *
 * 対象ファイル (6 件):
 *   contents/questions/clf-c02.{ja,en,zh}.json
 *   contents/questions/saa-c03.{ja,en,zh}.json
 *
 * 検証 invariant:
 *  (1) 全 question の practicalNote が string かつ split('\n\n') で段落 >= 2、
 *      かつ文字数 >= 200
 *      — 違反があれば失敗 + 違反 questionId を全件 list 表示
 *  (2) practicalNote に試験名キーワード混入確認 (緩い / warn のみ)
 *      — ja: 'CLF-C02' または 'SAA-C03' のいずれかが含まれる問題を集計して
 *        console.warn で報告する (fail 化しない)
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
    // 緩い確認: ja の practicalNote に試験名キーワードが混入しているものを warn で報告。
    // fail 化しない — content policy 上は exam キーワードを入れても入れなくても可。
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

    // warn のみ — 常に pass
    expect(true).toBe(true);
  });
});
