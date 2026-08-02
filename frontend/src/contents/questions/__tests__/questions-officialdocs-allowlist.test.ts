/**
 * questions-officialdocs-allowlist.test.ts
 *
 * 全 questions の officialDocs URL が allowlist（isValidOfficialDocUrl）を通過し、
 * label が非空文字列であることを構造的に担保する。
 *
 * 対象ファイル (6 件):
 *   contents/questions/clf-c02.{ja,en,zh}.json
 *   contents/questions/saa-c03.{ja,en,zh}.json
 *
 * 検証 invariant:
 *  (1) 全 question の officialDocs[].url が isValidOfficialDocUrl() で true
 *      — 違反 URL があれば失敗 + 全件 list 表示
 *  (2) 全 officialDocs[].label が typeof 'string' && trim().length > 0
 */
import { describe, expect, it } from "vitest";

import { isValidOfficialDocUrl } from "@/lib/official-doc";
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

describe("questions officialDocs allowlist", () => {
  it("(1) all officialDocs[].url pass isValidOfficialDocUrl()", () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      for (const q of questions) {
        if (!q.officialDocs || q.officialDocs.length === 0) continue;
        for (const doc of q.officialDocs) {
          if (!isValidOfficialDocUrl(doc.url)) {
            violations.push(
              `[${name}] questionId=${q.questionId} url="${doc.url}"`,
            );
          }
        }
      }
    }

    expect(
      violations,
      `URL allowlist violations (${violations.length} found):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });

  it("(2) all officialDocs[].label are non-empty strings", () => {
    const violations: string[] = [];

    for (const { name, questions } of FILES) {
      for (const q of questions) {
        if (!q.officialDocs || q.officialDocs.length === 0) continue;
        for (const doc of q.officialDocs) {
          if (typeof doc.label !== "string" || doc.label.trim().length === 0) {
            violations.push(
              `[${name}] questionId=${q.questionId} label=${JSON.stringify(doc.label)}`,
            );
          }
        }
      }
    }

    expect(
      violations,
      `Empty/invalid label violations (${violations.length} found):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });
});
