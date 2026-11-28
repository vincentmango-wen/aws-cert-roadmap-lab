import { expect, it } from "vitest";
import { createComparisonPath, getComparisons, getComparisonBySlug, getComparisonStaticParams } from "@/app/(site)/comparisons/comparison-detail-data";
import { loadComparisonContent } from "@/app/(site)/comparisons/comparison-content-loader";
import { readArticleCandidates } from "../../updates/article-sources";
import { aggregateUpdates } from "../../updates/aggregate";

const slug = "sqs-standard-vs-fifo";
const locales = ["zh", "ja", "en"] as const;
const paths = { zh: `/zh/comparisons/${slug}`, ja: `/comparisons/${slug}`, en: `/en/comparisons/${slug}` };
const sections = {
  zh: ["選擇重點", "比較表", "考綱與判斷重點", "實務選型", "常見誤解", "總結", "AWS 官方參考"],
  ja: ["選択のポイント", "比較表", "試験ガイドと判断のポイント", "実務での使い分け", "よくある誤解", "まとめ", "AWS公式リファレンス"],
  en: ["Selection at a glance", "Comparison table", "Exam guide and decision cues", "How to choose in practice", "Common misconceptions", "Summary", "Official AWS references"],
};

it.each(locales)("loads a complete %s SQS candidate without publishing its route", (locale) => {
  const entries = getComparisons(locale).filter((item) => item.slug === slug);
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({ comparisonId: "cmp-016", published: false, publishedAt: "", services: ["sqs"], examScopes: ["SAA-C03"] });
  const content = loadComparisonContent(locale, slug, entries[0].title);
  expect(content).not.toBeNull();
  expect([...content!.matchAll(/^## (.+)$/gm)].map((match) => match[1])).toEqual(sections[locale]);
  expect([...content!.matchAll(/^```text$/gm)]).toHaveLength(1);
  expect(content).toContain("A1 → A2");
  expect(content).toContain("MessageGroupId");
  expect(content).toContain("MessageDeduplicationId");
  expect(content).toContain("ReceiveMessage");
  if (locale === "ja") expect(content).toContain("A1 の処理が完了してから A2 を処理する");
  expect(content).toContain("(/comparisons/sns-vs-sqs-vs-eventbridge)");
  const urls = [...content!.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
  expect(urls).toEqual([
    "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html",
    "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html",
    "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html",
    "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html#SQS-SendMessage-request-MessageGroupId",
  ]);
  expect(createComparisonPath(locale, slug)).toBe(paths[locale]);
  expect(getComparisonBySlug(locale, slug)).toBeNull();
  expect(getComparisonStaticParams(locale)).not.toContainEqual({ comparisonSlug: slug });
});

it("uses the existing comparison update source without a duplicate manual announcement", () => {
  const article = readArticleCandidates().find((item) => item.kind === "comparison" && item.slug === slug);
  expect(article).toBeDefined();
  if (!article) return;
  const hidden = aggregateUpdates({ articles: [article], announcements: [], today: "2026-12-10", isPublicPath: () => true });
  for (const locale of locales) expect(hidden.itemsByLocale[locale]).toEqual([]);
  const fixture = structuredClone(article);
  for (const locale of locales) Object.assign(fixture.translations[locale]!, { published: true, publishedAt: "2026-12-10" });
  const result = aggregateUpdates({ articles: [fixture], announcements: [], today: "2026-12-10", isPublicPath: () => true });
  expect(result.diagnostics).toEqual([]);
  for (const locale of locales) {
    expect(result.itemsByLocale[locale]).toHaveLength(1);
    expect(result.itemsByLocale[locale][0]).toMatchObject({ id: "comparison:cmp-016", eventKind: "new", links: [{ href: paths[locale] }] });
  }
});
