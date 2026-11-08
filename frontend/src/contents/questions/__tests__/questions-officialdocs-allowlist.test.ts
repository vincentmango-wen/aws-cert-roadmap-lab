/**
 * Ensure every officialDocs URL passes isValidOfficialDocUrl and every label is a nonempty string.
 * Covers six files: contents/questions/clf-c02.{ja,en,zh}.json and saa-c03.{ja,en,zh}.json. URL
 * violations fail with a complete list; labels must be strings with trim().length > 0.
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
