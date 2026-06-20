import { describe, expect, it } from "vitest";

import {
  isExistingArchitecture,
  isExistingComparison,
  isExistingTerm,
} from "../termGuards";
import { publishedArchitectures } from "../../contents/architectures/architectures";
import { publishedComparisons } from "../../contents/comparisons/comparisons";
import termsData from "../../../contents/terms/terms.json";

type RawTerm = { termId: string };

describe("isExistingTerm", () => {
  it("returns true for every termId present in terms.json", () => {
    for (const term of termsData as RawTerm[]) {
      expect(isExistingTerm(term.termId)).toBe(true);
    }
  });

  it("returns false for an unknown termId", () => {
    expect(isExistingTerm("__definitely_not_a_term__")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isExistingTerm("")).toBe(false);
  });

  it("is case-sensitive (does not match upper-cased variants)", () => {
    const sample = (termsData as RawTerm[])[0];

    if (!sample) {
      return;
    }

    const upperCased = sample.termId.toUpperCase();

    if (upperCased === sample.termId) {
      return;
    }

    expect(isExistingTerm(upperCased)).toBe(false);
  });
});

describe("isExistingComparison", () => {
  it("returns true for every slug in publishedComparisons", () => {
    for (const comparison of publishedComparisons) {
      expect(isExistingComparison(comparison.slug)).toBe(true);
    }
  });

  it("returns false for an unknown comparison slug", () => {
    expect(isExistingComparison("__nope__")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isExistingComparison("")).toBe(false);
  });
});

describe("isExistingArchitecture", () => {
  it("returns true for every slug in publishedArchitectures", () => {
    for (const architecture of publishedArchitectures) {
      expect(isExistingArchitecture(architecture.slug)).toBe(true);
    }
  });

  it("returns false for an unknown architecture slug", () => {
    expect(isExistingArchitecture("__nope__")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isExistingArchitecture("")).toBe(false);
  });
});
