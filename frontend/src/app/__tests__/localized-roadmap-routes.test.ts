import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(__dirname, "..");

const roadmapPagePath = (locale: "en" | "zh"): string =>
  resolve(appRoot, "(site)", locale, "roadmap", "page.tsx");

describe("localized roadmap routes", () => {
  it("defines an English Roadmap route", () => {
    expect(existsSync(roadmapPagePath("en"))).toBe(true);
  });

  it("defines a Traditional Chinese Roadmap route", () => {
    expect(existsSync(roadmapPagePath("zh"))).toBe(true);
  });
});
