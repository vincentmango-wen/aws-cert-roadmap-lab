import { describe, expect, it } from "vitest";
import { readArticleCandidates } from "../article-sources";
import { beforeIssue348Batch2Corrections } from "./fixtures/architecture-dates-before-issue-348-batch2";

// Catch loss of historical correction bodies, source mutation, and over-broad restoration.
describe("batch 2 historical content fixture", () => {
  for (const locale of ["ja", "en", "zh"] as const) {
    it(`${locale} restores the complete pre-batch history without changing other metadata`, () => {
      const input = readArticleCandidates();
      const original = structuredClone(input);
      for (const article of input) {
        if (!["arc-007", "arc-008"].includes(article.id)) continue;
        const translation = article.translations[locale]!;
        translation.updatedAt = "2026-11-18";
        translation.correctionNotes = { entries: [], errors: ["later-data"] };
        translation.title = "Keep this later title";
      }
      const before = structuredClone(input);
      const historical = beforeIssue348Batch2Corrections(input);
      expect(input).toEqual(before);
      for (const id of ["arc-007", "arc-008"]) {
        const restored = historical.find((article) => article.id === id)!.translations[locale]!;
        const old = original.find((article) => article.id === id)!.translations[locale]!;
        expect(restored.updatedAt).toBe(id === "arc-007" ? "2026-11-09" : "2026-06-21");
        expect(restored.correctionNotes).toEqual({
          entries: old.correctionNotes!.entries.filter((entry) => entry.date === "2026-11-09"),
          errors: [],
        });
        expect(restored.title).toBe("Keep this later title");
      }
      expect(historical.filter((article) => !["arc-007", "arc-008"].includes(article.id)))
        .toEqual(original.filter((article) => !["arc-007", "arc-008"].includes(article.id)));
      historical[0].translations[locale]!.title = "Changed result";
      expect(input).toEqual(before);
    });
  }
  it("preserves missing translations and ignores identical IDs of another kind", () => {
    const input = readArticleCandidates().filter((article) => article.id === "arc-007");
    delete input[0].translations.en;
    input.push({ ...structuredClone(input[0]), kind: "blog" });
    input[1].translations.ja!.updatedAt = "2026-11-18";
    const result = beforeIssue348Batch2Corrections(input);
    expect(result[0].translations.en).toBeUndefined();
    expect(result[1]).toEqual(input[1]);
  });
});
