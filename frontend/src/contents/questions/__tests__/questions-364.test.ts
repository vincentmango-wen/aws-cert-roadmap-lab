import { describe, expect, it } from "vitest";
import clfEn from "../../../../contents/questions/clf-c02.en.json";
import clfJa from "../../../../contents/questions/clf-c02.ja.json";
import clfZh from "../../../../contents/questions/clf-c02.zh.json";
import saaEn from "../../../../contents/questions/saa-c03.en.json";
import saaJa from "../../../../contents/questions/saa-c03.ja.json";
import saaZh from "../../../../contents/questions/saa-c03.zh.json";

const answerKey = {
  "saa-061": "D", "saa-062": "B", "saa-063": "A", "saa-064": "C",
  "saa-065": "B", "saa-066": "D", "saa-067": "C", "saa-068": "A",
  "clf-051": "A", "clf-052": "C",
};
const banks = [
  ["ja", [...saaJa, ...clfJa]], ["en", [...saaEn, ...clfEn]], ["zh", [...saaZh, ...clfZh]],
] as const;
const normalized = (stem: string) => stem.normalize("NFKC").toLowerCase().replace(/[\p{P}\p{Z}\s]/gu, "");

describe("issue #364 learning pilot", () => {
  it.each(banks)("includes each reviewed question exactly once in %s", (_locale, bank) => {
    for (const [id, answer] of Object.entries(answerKey)) {
      const records = bank.filter((q) => q.questionId === id);
      expect(records, id).toHaveLength(1);
      const [q] = records;
      expect(q.correctChoiceId, id).toBe(answer);
      expect(q.published, id).toBe(true);
      expect(Object.keys(q.choiceExplanations ?? {}).sort(), id).toEqual(["A", "B", "C", "D"]);
      expect(bank.filter((other) => normalized(other.question) === normalized(q.question)), id).toHaveLength(1);
    }
  });
});
