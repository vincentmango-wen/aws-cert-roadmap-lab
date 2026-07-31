/**
 * questions-locale-parity.test.ts
 *
 * P3b 完了後の invariant テスト。
 * `contents/questions/{exam}.{ja,en,zh}.json` が 3 言語完全並列で
 * 維持されていることを構造的に担保する。
 *
 * 検証 invariant (task spec T1):
 *  (1) clf-c02.{ja,en,zh}.json の questionId 集合が完全一致 (50 件 × 3 言語)
 *  (2) saa-c03.{ja,en,zh}.json の questionId 集合が完全一致 (50 件 × 3 言語)
 *  (3) 各 questionId について immutable フィールドが ja/en/zh で完全一致:
 *      exam, category, domain, difficulty, correctChoiceId, published,
 *      relatedServices, relatedTerms, relatedComparisons, tags
 *  (4) 各 questionId について choices 配列の長さ (4 件) +
 *      choiceId 集合 (A,B,C,D) が ja/en/zh で一致
 *  (5) practicalNote と officialDocs が ja/en/zh ともに存在
 *      (= 全 240 問が enrichment 持ち)
 */

import { describe, expect, it } from "vitest";

import clfEn from "../../../../contents/questions/clf-c02.en.json";
import clfJa from "../../../../contents/questions/clf-c02.ja.json";
import clfZh from "../../../../contents/questions/clf-c02.zh.json";
import saaEn from "../../../../contents/questions/saa-c03.en.json";
import saaJa from "../../../../contents/questions/saa-c03.ja.json";
import saaZh from "../../../../contents/questions/saa-c03.zh.json";
import type { Question } from "../../../types/question";

// ──────────────────────────────────────────────────────────────────────────
// helpers
// ──────────────────────────────────────────────────────────────────────────

const toMap = (list: Question[]): Map<string, Question> =>
  new Map(list.map((q) => [q.questionId, q]));

/** 配列を要素順不問で比較するため sorted Set に変換 */
const sortedArr = (arr: string[] | undefined): string[] =>
  [...(arr ?? [])].sort();

// ──────────────────────────────────────────────────────────────────────────
// datasets
// ──────────────────────────────────────────────────────────────────────────

type ExamDataset = {
  name: string;
  expectedCount: number;
  ja: Question[];
  en: Question[];
  zh: Question[];
};

const DATASETS: ExamDataset[] = [
  {
    name: "CLF-C02",
    expectedCount: 50,
    ja: clfJa as Question[],
    en: clfEn as Question[],
    zh: clfZh as Question[],
  },
  {
    name: "SAA-C03",
    expectedCount: 50,
    ja: saaJa as Question[],
    en: saaEn as Question[],
    zh: saaZh as Question[],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// tests
// ──────────────────────────────────────────────────────────────────────────

describe("questions locale parity", () => {
  for (const dataset of DATASETS) {
    const { name, expectedCount, ja, en, zh } = dataset;

    const jaMap = toMap(ja);
    const enMap = toMap(en);
    const zhMap = toMap(zh);

    describe(`${name}`, () => {
      it(`(1)/(2) ja/en/zh have the same questionId set (${expectedCount} items each)`, () => {
        const jaIds = new Set(ja.map((q) => q.questionId));
        const enIds = new Set(en.map((q) => q.questionId));
        const zhIds = new Set(zh.map((q) => q.questionId));

        expect(
          ja.length,
          `ja should have ${expectedCount} questions`,
        ).toBe(expectedCount);
        expect(
          en.length,
          `en should have ${expectedCount} questions`,
        ).toBe(expectedCount);
        expect(
          zh.length,
          `zh should have ${expectedCount} questions`,
        ).toBe(expectedCount);

        expect(enIds, "en questionId set must equal ja").toEqual(jaIds);
        expect(zhIds, "zh questionId set must equal ja").toEqual(jaIds);
      });

      it("(3) immutable metadata fields are identical across ja/en/zh per questionId", () => {
        const IMMUTABLE_FIELDS = [
          "exam",
          "category",
          "domain",
          "difficulty",
          "correctChoiceId",
          "published",
        ] as const;

        const ARRAY_FIELDS = [
          "relatedServices",
          "relatedTerms",
          "relatedComparisons",
          "tags",
        ] as const;

        for (const qid of jaMap.keys()) {
          const jaQ = jaMap.get(qid)!;
          const enQ = enMap.get(qid);
          const zhQ = zhMap.get(qid);

          expect(enQ, `en entry missing for questionId=${qid}`).toBeDefined();
          expect(zhQ, `zh entry missing for questionId=${qid}`).toBeDefined();

          // scalar fields
          for (const field of IMMUTABLE_FIELDS) {
            expect(
              enQ![field],
              `field "${field}" mismatch (en) questionId=${qid}`,
            ).toEqual(jaQ[field]);
            expect(
              zhQ![field],
              `field "${field}" mismatch (zh) questionId=${qid}`,
            ).toEqual(jaQ[field]);
          }

          // array fields — compare sorted to be order-insensitive
          for (const field of ARRAY_FIELDS) {
            expect(
              sortedArr(enQ![field] as string[] | undefined),
              `field "${field}" mismatch (en) questionId=${qid}`,
            ).toEqual(sortedArr(jaQ[field] as string[] | undefined));
            expect(
              sortedArr(zhQ![field] as string[] | undefined),
              `field "${field}" mismatch (zh) questionId=${qid}`,
            ).toEqual(sortedArr(jaQ[field] as string[] | undefined));
          }
        }
      });

      it("(4) choices length is 4 and choiceId set is {A,B,C,D} across ja/en/zh per questionId", () => {
        const EXPECTED_CHOICE_IDS = new Set(["A", "B", "C", "D"]);

        for (const qid of jaMap.keys()) {
          const jaQ = jaMap.get(qid)!;
          const enQ = enMap.get(qid);
          const zhQ = zhMap.get(qid);

          expect(enQ, `en entry missing for questionId=${qid}`).toBeDefined();
          expect(zhQ, `zh entry missing for questionId=${qid}`).toBeDefined();

          for (const [locale, q] of [
            ["ja", jaQ],
            ["en", enQ!],
            ["zh", zhQ!],
          ] as const) {
            expect(
              q.choices.length,
              `choices.length must be 4 (${locale}) questionId=${qid}`,
            ).toBe(4);

            const choiceIds = new Set(q.choices.map((c) => c.choiceId));
            expect(
              choiceIds,
              `choices must contain exactly {A,B,C,D} (${locale}) questionId=${qid}`,
            ).toEqual(EXPECTED_CHOICE_IDS);
          }
        }
      });

      it("(5) practicalNote and officialDocs exist on all questions across ja/en/zh", () => {
        const allEntries: Array<{ locale: string; q: Question }> = [
          ...ja.map((q) => ({ locale: "ja", q })),
          ...en.map((q) => ({ locale: "en", q })),
          ...zh.map((q) => ({ locale: "zh", q })),
        ];

        for (const { locale, q } of allEntries) {
          expect(
            q.practicalNote,
            `practicalNote missing (${locale}) questionId=${q.questionId}`,
          ).toBeTruthy();

          expect(
            q.officialDocs,
            `officialDocs missing (${locale}) questionId=${q.questionId}`,
          ).toBeDefined();

          expect(
            (q.officialDocs ?? []).length,
            `officialDocs must have at least 1 entry (${locale}) questionId=${q.questionId}`,
          ).toBeGreaterThan(0);
        }
      });
    });
  }
});
