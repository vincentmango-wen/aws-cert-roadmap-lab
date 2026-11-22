import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import en from "../../../../contents/comparisons/comparisons.en.json";
import ja from "../../../../contents/comparisons/comparisons.ja.json";
import zh from "../../../../contents/comparisons/comparisons.zh.json";

const editions = {
  en: { records: en, headings: ["Selection at a glance", "Comparison table", "Beginner context", "Exam guide and decision cues", "How to choose in practice", "Common misconceptions", "Summary", "Official AWS references", "Related terms", "Related questions", "Corrections"] },
  ja: { records: ja, headings: ["選択のポイント", "比較表", "初学者向け説明", "試験ガイドと判断のポイント", "実務での使い分け", "よくある誤解", "まとめ", "AWS公式リファレンス", "関連用語", "関連問題", "訂正内容"] },
  zh: { records: zh, headings: ["選擇重點", "比較表", "入門說明", "考綱與判斷重點", "實務選型", "常見誤解", "總結", "AWS 官方參考", "相關用語", "相關題目", "更正說明"] },
} as const;
const required = [0, 1, 4, 5, 6, 7];
const sources = new Map<string, string[]>();

it.each(Object.entries(editions))("orders published %s comparisons and supplies matching specific AWS sources", (locale, edition) => {
  for (const item of edition.records.filter(({ published }) => published)) {
    const { slug } = item;
    const text = fs.readFileSync(path.join(process.cwd(), "contents/comparisons", locale, slug + ".mdx"), "utf8");
    const sections = [...text.matchAll(/^## (.+)$/gm)];
    const indexes = sections.map(([, label]) => edition.headings.findIndex((expected) => expected === label));
    expect(indexes, slug).toEqual([...new Set(indexes)].sort((a, b) => a - b));
    expect(indexes.every((index) => index >= 0), slug).toBe(true);
    for (const index of required) expect(indexes, slug).toContain(index);
    const references = indexes.indexOf(7);
    const end = sections[references + 1]?.index ?? text.length;
    const content = text.slice(sections[references].index, end);
    const links = [...content.matchAll(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g)];
    expect(links.length, slug).toBeGreaterThanOrEqual(3);
    for (const [, label, href] of links) {
      expect(label.length, slug).toBeGreaterThan(4);
      expect(new URL(href).hostname, slug).toMatch(/^(docs\.)?aws\.amazon\.com$/);
    }
    const urls = links.map(([, , href]) => href);
    if (sources.has(slug)) expect(urls, slug).toEqual(sources.get(slug));
    else sources.set(slug, urls);
  }
});
