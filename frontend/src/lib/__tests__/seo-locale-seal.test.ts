/**
 * seo-locale-seal.test.ts
 *
 * ACR-012 (#322) invariant 第 2 層。
 *
 * `createPageMetadata` / `createLocaleAwareRobots` が
 * - 封印中の en/zh path に `{index:false, follow:false}` を返すこと
 * - ja path を巻き添えにしないこと（特に `/entertainment` 前方一致誤爆）
 * - 封印中は hreflang alternates を一切生やさないこと
 * を検証する。
 */
import { describe, expect, it } from "vitest";

import { LOCALIZED_ROUTES_PUBLISHED } from "@/i18n/release-gate";
import { createLocaleAwareRobots, createPageMetadata } from "../seo";

const baseInput = {
  title: "x",
  description: "y",
} as const;

const robotsOf = (path: `/${string}` | "/") =>
  createPageMetadata({ ...baseInput, path }).robots;

describe.skipIf(LOCALIZED_ROUTES_PUBLISHED)("createPageMetadata robots under locale seal", () => {
  const sealedRobots = {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  };

  it.each([
    "/en",
    "/zh",
    "/en/questions/clf-001",
    "/zh/about",
    "/en/comparisons/s3-ebs-efs",
  ] as const)("marks %s as noindex, nofollow", (path) => {
    expect(robotsOf(path)).toEqual(sealedRobots);
  });

  it.each(["/", "/questions/clf-001", "/about", "/terms-of-service"] as const)(
    "keeps %s indexable",
    (path) => {
      expect(robotsOf(path)).toEqual({ index: true, follow: true });
    },
  );

  it("does not misfire on /entertainment (startsWith(\"/en\") trap)", () => {
    expect(robotsOf("/entertainment")).toEqual({ index: true, follow: true });
    expect(robotsOf("/environment")).toEqual({ index: true, follow: true });
    expect(robotsOf("/zhuangzi")).toEqual({ index: true, follow: true });
  });

  it("preserves the existing ja noIndex semantics (follow stays true)", () => {
    expect(createPageMetadata({ ...baseInput, path: "/404", noIndex: true }).robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it("emits no hreflang alternates even when enableLanguageAlternates is set", () => {
    const metadata = createPageMetadata({
      ...baseInput,
      path: "/questions/clf-001",
      enableLanguageAlternates: true,
    });

    expect(metadata.alternates?.languages).toBeUndefined();
  });

  it("keeps a self-referencing canonical on sealed pages", () => {
    const metadata = createPageMetadata({ ...baseInput, path: "/en/privacy" });

    expect(metadata.alternates?.canonical).toContain("/en/privacy");
  });

  it("createLocaleAwareRobots seals en/zh and spares ja", () => {
    expect(createLocaleAwareRobots("/zh/contact")).toEqual(sealedRobots);
    expect(createLocaleAwareRobots("/contact")).toEqual({ index: true, follow: true });
    expect(createLocaleAwareRobots("/entertainment")).toEqual({ index: true, follow: true });
  });
});

describe.runIf(LOCALIZED_ROUTES_PUBLISHED)("createPageMetadata robots without locale seal", () => {
  it("keeps en/zh indexable", () => {
    expect(robotsOf("/en")).toEqual({ index: true, follow: true });
    expect(robotsOf("/zh/about")).toEqual({ index: true, follow: true });
  });

  it("emits the full hreflang cluster when requested", () => {
    const metadata = createPageMetadata({
      ...baseInput,
      path: "/questions/clf-001",
      enableLanguageAlternates: true,
    });

    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual([
      "en",
      "ja",
      "x-default",
      "zh-Hant",
    ]);
  });
});
