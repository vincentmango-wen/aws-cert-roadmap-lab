import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const privacyPageSource = readFileSync(
  resolve(__dirname, "..", "(site)", "zh", "privacy", "page.tsx"),
  "utf8",
);

describe("Traditional Chinese privacy page wording", () => {
  it("does not use the Japanese term 配信", () => {
    expect(privacyPageSource).not.toContain("配信");
  });

  it("does not use the Japanese term 目安", () => {
    expect(privacyPageSource).not.toContain("目安");
  });
});
