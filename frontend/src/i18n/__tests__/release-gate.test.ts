/**
 * release-gate.test.ts
 *
 * ACR-012 (#322) 封印フラグの単体テスト。
 * 封印時 / 解封時の assert を `describe.skipIf` / `describe.runIf` で同居させ、
 * 「解封 = LOCALIZED_ROUTES_PUBLISHED を 1 行変えるだけ」を成立させる。
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { defaultLocale, locales } from "../locales";
import {
  LOCALIZED_ROUTES_PUBLISHED,
  isPublishedLocale,
  isSealedPathname,
  publishedLocales,
} from "../release-gate";

const releaseGateSource = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../release-gate.ts"),
  "utf8",
);

/** `scripts/verify-locale-seal.mjs` の readReleaseGateFlag() と同一の正規表現。 */
const FLAG_DECLARATION = /LOCALIZED_ROUTES_PUBLISHED\s*:\s*boolean\s*=\s*(true|false)/;

describe("release gate constant", () => {
  it("is a boolean", () => {
    expect(typeof LOCALIZED_ROUTES_PUBLISHED).toBe("boolean");
  });

  it("always publishes the default locale", () => {
    expect(publishedLocales).toContain(defaultLocale);
    expect(isPublishedLocale(defaultLocale)).toBe(true);
  });

  /**
   * 第 3 層（`scripts/verify-locale-seal.mjs`）はフラグを TypeScript として import できないため、
   * ソースを正規表現で読み取っている。宣言の書き方が変わるとビルド時検査が
   * 例外で落ちる（= デプロイが止まる）ので、その契約をここで固定する。
   */
  it("keeps the source declaration readable by the build-time checker", () => {
    const match = releaseGateSource.match(FLAG_DECLARATION);

    expect(
      match,
      "release-gate.ts の宣言が scripts/verify-locale-seal.mjs の正規表現と一致しません",
    ).not.toBeNull();
    expect(match?.[1] === "true").toBe(LOCALIZED_ROUTES_PUBLISHED);
  });

  it("keeps the unsealing preconditions documented", () => {
    // 解封手順が消えると「フラグを true にするだけ」で既知欠陥ごと公開されてしまう。
    for (const marker of ["#319", "#305", "#312", "createLocaleAwareRobots", "x-default"]) {
      expect(releaseGateSource, `解封前提条件から ${marker} が消えています`).toContain(marker);
    }
  });
});

describe.skipIf(LOCALIZED_ROUTES_PUBLISHED)("sealed mode (ja only)", () => {
  it("publishes only ja", () => {
    expect([...publishedLocales]).toEqual(["ja"]);
    expect(isPublishedLocale("en")).toBe(false);
    expect(isPublishedLocale("zh")).toBe(false);
  });

  it("seals en/zh locale roots and their descendants", () => {
    expect(isSealedPathname("/en")).toBe(true);
    expect(isSealedPathname("/zh")).toBe(true);
    expect(isSealedPathname("/en/")).toBe(true);
    expect(isSealedPathname("/zh/")).toBe(true);
    expect(isSealedPathname("/en/questions/clf-001")).toBe(true);
    expect(isSealedPathname("/zh/about")).toBe(true);
  });

  it("does not seal ja pathnames", () => {
    expect(isSealedPathname("/")).toBe(false);
    expect(isSealedPathname("/questions/clf-001")).toBe(false);
    expect(isSealedPathname("/about")).toBe(false);
    expect(isSealedPathname("/terms-of-service")).toBe(false);
  });

  it("does not misfire on ja pathnames that merely start with the en/zh letters", () => {
    // `startsWith("/en")` 前方一致誤爆のトラップ専用。
    expect(isSealedPathname("/entertainment")).toBe(false);
    expect(isSealedPathname("/environment")).toBe(false);
    expect(isSealedPathname("/energy")).toBe(false);
    expect(isSealedPathname("/zhuangzi")).toBe(false);
  });
});

describe.runIf(LOCALIZED_ROUTES_PUBLISHED)("released mode (all locales)", () => {
  it("publishes every locale", () => {
    expect([...publishedLocales]).toEqual([...locales]);
    expect(isPublishedLocale("en")).toBe(true);
    expect(isPublishedLocale("zh")).toBe(true);
  });

  it("seals nothing", () => {
    expect(isSealedPathname("/en")).toBe(false);
    expect(isSealedPathname("/zh/about")).toBe(false);
  });
});
