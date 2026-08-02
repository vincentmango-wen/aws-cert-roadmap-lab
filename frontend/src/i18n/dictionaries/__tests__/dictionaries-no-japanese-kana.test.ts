/**
 * dictionaries-no-japanese-kana.test.ts
 *
 * ACR-008 の再発防止 invariant。
 *
 * 背景:
 *  `QuestionListClient` が辞書を使わず日本語をハードコードしていたため、
 *  `/en` `/zh` の模擬問題一覧に日本語 UI が出たまま公開され続けていた。
 *  「非 ja ロケールに日本語が混ざる」という欠陥は目視では見落とされるので、
 *  辞書の値そのものを機械的に検査する。
 *
 * 検証 invariant:
 *  (1) en / zh 辞書のすべての文字列値に、ひらがな・カタカナが含まれない
 *  (2) en 辞書のすべての文字列値に、CJK 統合漢字が含まれない
 *  (3) 検出器そのものが機能していること（ja 辞書は必ず検出される = positive control）
 *
 * 判定基準について:
 *  zh は漢字を使うため「CJK があれば NG」では誤検出になる。そのため zh には
 *  かな（U+3040–U+309F ひらがな / U+30A0–U+30FF カタカナ）だけを適用する。
 *  なお U+30FB「・」/ U+30FC「ー」はカタカナブロックに含まれるため、zh 側で
 *  中黒を使いたい場合はこのテストが落ちる。その場合は繁体中文で一般的な
 *  「、」または U+2027「‧」に置き換えること（例外リストは意図的に持たない）。
 *
 * 辞書 3 言語のキー集合一致はこのテストでは見ない:
 *  `enDictionary` / `zhDictionary` はオブジェクトリテラルに `: UiDictionary`
 *  を注釈しているため、キーの欠落（missing property）も余分なキー（excess
 *  property check）も `tsc --noEmit` でコンパイルエラーになる。型で完全に
 *  担保されている以上、実行時テストで二重に見る価値はないと判断した。
 */

import { describe, expect, it } from "vitest";

import { enDictionary } from "../en";
import { jaDictionary } from "../ja";
import { zhDictionary } from "../zh";

// ──────────────────────────────────────────────────────────────────────────
// detectors
// ──────────────────────────────────────────────────────────────────────────

/** ひらがな (U+3040–U+309F) / カタカナ (U+30A0–U+30FF) */
const KANA_PATTERN = /[぀-ゟ゠-ヿ]/u;

/** CJK 統合漢字 (U+4E00–U+9FFF) */
const HAN_PATTERN = /[一-鿿]/u;

type StringEntry = {
  path: string;
  value: string;
};

/** 辞書を再帰的に走査し、文字列リーフを `path` 付きで列挙する */
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
    // 検出器が壊れた（常に pass する）状態で (1) が緑になるのを防ぐ。
    expect(findMatches(jaEntries, KANA_PATTERN).length).toBeGreaterThan(0);
    expect(KANA_PATTERN.test("カテゴリ")).toBe(true);
    expect(KANA_PATTERN.test("すべての難易度")).toBe(true);
    // zh / en の正当な値で誤検出しないこと
    expect(KANA_PATTERN.test("設計安全架構")).toBe(false);
    expect(KANA_PATTERN.test("All categories")).toBe(false);
  });
});
