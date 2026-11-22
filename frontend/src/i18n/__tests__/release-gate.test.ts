/**
 * ACR-012 (#322) release-flag unit tests. Keep sealed/published assertions together using
 * describe.skipIf / describe.runIf so publication requires changing only LOCALIZED_ROUTES_PUBLISHED.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { defaultLocale, getAvailableLocalesForPathname, locales } from "../locales";
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

/**
 * Same regular expression as readReleaseGateFlag() in scripts/verify-locale-seal.mjs.
 */
const FLAG_DECLARATION = /LOCALIZED_ROUTES_PUBLISHED\s*:\s*boolean\s*=\s*(true|false)/;

describe("release gate constant", () => {
  it("is a boolean", () => {
    expect(typeof LOCALIZED_ROUTES_PUBLISHED).toBe("boolean");
  });

  it("publishes localized routes for the approved release", () => {
    expect(LOCALIZED_ROUTES_PUBLISHED).toBe(true);
  });

  it("always publishes the default locale", () => {
    expect(publishedLocales).toContain(defaultLocale);
    expect(isPublishedLocale(defaultLocale)).toBe(true);
  });

  /**
   * Layer 3 (scripts/verify-locale-seal.mjs) cannot import the TypeScript flag, so it reads the source
   * with a regular expression. Changing the declaration syntax would throw during build validation and
   * block deployment; preserve that contract here.
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
    // Without documented preconditions, simply setting the flag to true could publish known defects.
    for (const marker of ["#319", "#305", "#334", "createLocaleAwareRobots", "x-default"]) {
      expect(releaseGateSource, `解封前提条件から ${marker} が消えています`).toContain(marker);
    }
  });
});

describe("available locales for a pathname", () => {
  it("hides locale switches for the Japanese-only terms of service route", () => {
    expect(getAvailableLocalesForPathname("/terms-of-service")).toEqual(["ja"]);
    expect(getAvailableLocalesForPathname("/terms-of-service/")).toEqual(["ja"]);
  });

  it("returns all locales for translated routes", () => {
    expect(getAvailableLocalesForPathname("/zh/roadmap")).toEqual([...locales]);
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
    // Trap for incorrect startsWith("/en") prefix matching.
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
