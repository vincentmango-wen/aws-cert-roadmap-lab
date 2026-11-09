import { describe, expect, it } from "vitest";
import { assertArticleInventory } from "./article-contract";

const historical = [{ id: "old", slug: "old-article" }];
const approved = [{ id: "new", slug: "new-article" }];
const inventory = () => ({ ja: [...historical], en: [...historical], zh: [...historical] });

describe("article identity contract mutations", () => {
  it("preserves historical entries and permits reviewed additions in every locale", () => {
    expect(() => assertArticleInventory(historical, approved, inventory())).not.toThrow();
    const locales = inventory();
    for (const locale of ["ja", "en", "zh"] as const) locales[locale].push(...approved);
    expect(() => assertArticleInventory(historical, approved, locales)).not.toThrow();
  });
  it("rejects deleting an old article in every language even when total count is unchanged", () => {
    expect(() => assertArticleInventory(historical, approved, { ja: approved, en: approved, zh: approved })).toThrow();
  });
  it("rejects a missing translation or an entirely empty locale", () => {
    const locales = inventory(); locales.ja.push(...approved); locales.zh.push(...approved);
    expect(() => assertArticleInventory(historical, approved, locales)).toThrow();
    expect(() => assertArticleInventory(historical, approved, { ...inventory(), en: [] })).toThrow();
  });
  it("rejects duplicate IDs before building a set, including different slugs", () => {
    const locales = inventory(); locales.ja.push({ id: "old", slug: "another" });
    expect(() => assertArticleInventory(historical, approved, locales)).toThrow();
  });
  it("rejects duplicate slugs, unapproved additions and reassigned historical IDs", () => {
    for (const item of [{ id: "new", slug: "old-article" }, { id: "rogue", slug: "rogue" }, { id: "old", slug: "changed" }]) {
      const locales = inventory(); locales.ja = item.id === "old" ? [item] : [...historical, item];
      expect(() => assertArticleInventory(historical, approved, locales)).toThrow();
    }
  });
  it("rejects overlapping or duplicate approvals", () => {
    expect(() => assertArticleInventory(historical, historical, inventory())).toThrow();
    expect(() => assertArticleInventory(historical, [...approved, ...approved], inventory())).toThrow();
  });
});
