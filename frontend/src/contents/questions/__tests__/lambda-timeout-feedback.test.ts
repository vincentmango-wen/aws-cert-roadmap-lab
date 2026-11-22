import { expect, it } from "vitest";
import en from "../../../../contents/questions/saa-c03.en.json";
import ja from "../../../../contents/questions/saa-c03.ja.json";
import zh from "../../../../contents/questions/saa-c03.zh.json";

it.each([
  [en, "Correction (2026-11-21)"],
  [ja, "訂正内容（2026-11-21）"],
  [zh, "更正說明（2026-11-21）"],
] as const)("separates the SAA-043 option B correction from its rationale ($1)", (bank, label) => {
  const q = bank.find(({ questionId }) => questionId === "saa-043");
  expect(q?.correctChoiceId).toBe("A");
  expect(q?.choiceExplanations.B).toContain(`\n\n${label}`);
});
