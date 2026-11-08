/**
 * ACR-008 regression invariants. QuestionListClient once hardcoded Japanese rather than using
 * dictionaries, leaving Japanese UI on /en and /zh question lists. Check dictionary values mechanically
 * because visual review can miss contamination.
 *
 * Invariants:
 * 1. No hiragana or katakana in en/zh string values.
 * 2. No CJK unified ideographs in English values.
 * 3. The detector catches Japanese dictionary content as a positive control.
 *
 * Chinese legitimately uses ideographs, so only hiragana U+3040-U+309F and katakana U+30A0-U+30FF are
 * forbidden there. U+30FB and U+30FC belong to the katakana block; use the Traditional Chinese
 * ideographic comma or U+2027 instead of those middle-dot/long-vowel characters. No exception list is
 * intentional.
 *
 * Key-set parity is already enforced by the UiDictionary annotations on enDictionary/zhDictionary: tsc
 * --noEmit catches missing and excess properties. Do not duplicate that compile-time guarantee with
 * runtime tests.
 */

import { describe, expect, it } from "vitest";

import { enDictionary } from "../en";
import { jaDictionary } from "../ja";
import { zhDictionary } from "../zh";

// ──────────────────────────────────────────────────────────────────────────
// detectors
// ──────────────────────────────────────────────────────────────────────────

/**
 * Hiragana (U+3040-U+309F) / katakana (U+30A0-U+30FF).
 */
const KANA_PATTERN = /[぀-ゟ゠-ヿ]/u;

/**
 * CJK unified ideographs (U+4E00-U+9FFF).
 */
const HAN_PATTERN = /[一-鿿]/u;

type StringEntry = {
  path: string;
  value: string;
};

/**
 * Recursively enumerate dictionary string leaves together with their paths.
 */
function collectStringEntries(node: unknown, path = ""): StringEntry[] {
  if (typeof node === "string") {
    return [{ path, value: node }];
  }

  if (Array.isArray(node)) {
    return node.flatMap((item, index) =>
      collectStringEntries(item, `${path}[${index}]`),
    );
  }

  if (typeof node === "object" && node !== null) {
    return Object.entries(node).flatMap(([key, value]) =>
      collectStringEntries(value, path === "" ? key : `${path}.${key}`),
    );
  }

  return [];
}

function findMatches(
  entries: StringEntry[],
  pattern: RegExp,
): StringEntry[] {
  return entries.filter((entry) => pattern.test(entry.value));
}

function formatMatches(matches: StringEntry[]): string {
  return matches
    .map((match) => `  ${match.path}: ${JSON.stringify(match.value)}`)
    .join("\n");
}

// ──────────────────────────────────────────────────────────────────────────
// datasets
// ──────────────────────────────────────────────────────────────────────────

const jaEntries = collectStringEntries(jaDictionary);
const enEntries = collectStringEntries(enDictionary);
const zhEntries = collectStringEntries(zhDictionary);

// ──────────────────────────────────────────────────────────────────────────
// tests
// ──────────────────────────────────────────────────────────────────────────

describe("dictionaries must not leak Japanese into non-ja locales", () => {
  it("(0) sanity: every dictionary exposes a non-trivial number of string values", () => {
    expect(jaEntries.length).toBeGreaterThan(50);
    expect(enEntries.length).toBe(jaEntries.length);
    expect(zhEntries.length).toBe(jaEntries.length);
  });

  it("(1) en dictionary contains no hiragana / katakana", () => {
    const matches = findMatches(enEntries, KANA_PATTERN);

    expect(
      matches,
      `en dictionary values must not contain hiragana/katakana:\n${formatMatches(matches)}`,
    ).toEqual([]);
  });

  it("(1) zh dictionary contains no hiragana / katakana", () => {
    const matches = findMatches(zhEntries, KANA_PATTERN);

    expect(
      matches,
      `zh dictionary values must not contain hiragana/katakana:\n${formatMatches(matches)}`,
    ).toEqual([]);
  });

  it("(2) en dictionary contains no CJK ideographs", () => {
    const matches = findMatches(enEntries, HAN_PATTERN);

    expect(
      matches,
      `en dictionary values must not contain CJK ideographs:\n${formatMatches(matches)}`,
    ).toEqual([]);
  });

  it("(3) positive control: the kana detector actually fires on the ja dictionary", () => {
    // Prevent invariant (1) from passing when a broken detector always returns false.
    expect(findMatches(jaEntries, KANA_PATTERN).length).toBeGreaterThan(0);
    expect(KANA_PATTERN.test("カテゴリ")).toBe(true);
    expect(KANA_PATTERN.test("すべての難易度")).toBe(true);
    // Valid zh/en values must not produce false positives.
    expect(KANA_PATTERN.test("設計安全架構")).toBe(false);
    expect(KANA_PATTERN.test("All categories")).toBe(false);
  });
});
