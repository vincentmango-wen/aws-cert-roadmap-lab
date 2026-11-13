import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { announcements } from "../announcements";
import { aggregateUpdates } from "../aggregate";
import { isPublicUpdatesPath, selectHomeUpdates } from "../index";
import type { Announcement, ArticleCandidate } from "../types";

const make = (id = "first", date = "2026-11-09"): Announcement => ({ id, date, eventKind: "update", category: "feature", published: true, links: [], translations: {
  ja: { title: "日本語", summary: "説明", updateNotes: [{ type: "paragraph", children: [{ type: "text", value: "更新内容" }] }] },
  en: { title: "English", summary: "Summary", updateNotes: [{ type: "paragraph", children: [{ type: "text", value: "Complete update" }] }] },
  zh: { title: "繁體中文", summary: "說明", updateNotes: [{ type: "paragraph", children: [{ type: "text", value: "完整更新說明" }] }] },
} });
const run = (values: Announcement[], isPublicPath = () => true) => aggregateUpdates({ articles: [], announcements: values, today: "2026-11-12", isPublicPath });

it("uses explicit announcement events and complete localized update notes", () => {
  expect(run(announcements).itemsByLocale.zh[0]).toMatchObject({ eventKind: "new", changeNotes: { status: "not-applicable" } });
  expect(run([make()]).itemsByLocale.en[0]).toMatchObject({ eventKind: "update", changeNotes: { status: "available", entry: { date: "2026-11-09", blocks: [{ type: "paragraph", children: [{ type: "text", value: "Complete update" }] }] } } });
});

it("rejects unspecified events, incomplete update notes and unsafe note links", () => {
  const missing = make(); delete (missing as Partial<Announcement>).eventKind;
  const incomplete = make(); delete incomplete.translations.zh.updateNotes;
  const unsafe = make(); unsafe.translations.en.updateNotes = [{ type: "paragraph", children: [{ type: "link", href: "javascript:alert(1)", children: [{ type: "text", value: "Unsafe" }] }] }];
  for (const value of [missing, incomplete, unsafe]) {
    expect(run([value]).itemsByLocale.ja).toEqual([]);
    expect(run([value]).diagnostics.length).toBeGreaterThan(0);
  }
});

it("requires a correcting announcement to be explicitly Update", () => {
  const correction = make("second"); correction.corrects = "first"; correction.eventKind = "new";
  expect(run([make(), correction]).itemsByLocale.en.map((value) => value.id)).toEqual(["announcement:first"]);
});

it("contains the exact approved SAA and feature announcements", () => {
  expect(announcements.map((value) => value.id).sort()).toEqual(["latest-articles-and-updates", "saa-c03-051-060"]);
  expect(announcements.find((value) => value.id === "saa-c03-051-060")).toMatchObject({ id: "saa-c03-051-060", category: "question-bank", date: "2026-11-09", published: true, translations: {
    zh: { title: "新增 10 道 SAA-C03 情境題", summary: "新增 10 道 SAA-C03 情境題，提供繁體中文、日文與英文版本，附四個選項、正確答案及逐項解析。" },
    ja: { title: "SAA-C03のシナリオ問題を10問追加", summary: "SAA-C03のシナリオ問題を10問追加しました。日本語・英語・繁体字中国語で、4つの選択肢、正解、各選択肢の解説を確認できます。" },
    en: { title: "10 new SAA-C03 scenario questions", summary: "Added 10 SAA-C03 scenario questions in Japanese, English, and Traditional Chinese, with four choices, the correct answer, and explanations for each choice." },
  }, links: [{ path: "/questions/saa" }] });
  for (const locale of ["ja", "en", "zh"] as const) {
    const questions: { questionId: string; published: boolean }[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), `contents/questions/saa-c03.${locale}.json`), "utf8"));
    for (let i = 51; i <= 60; i++) expect(questions.find((q) => q.questionId === `saa-${String(i).padStart(3, "0")}`)?.published).toBe(true);
    expect(isPublicUpdatesPath("/questions/saa", locale)).toBe(true);
    expect(isPublicUpdatesPath("/does-not-exist", locale)).toBe(false);
  }
});

it("permits a feature with no links but requires a public question link", () => {
  expect(run([make()]).itemsByLocale.ja[0].links).toEqual([]);
  const question = make(); question.category = "question-bank";
  expect(run([question]).itemsByLocale.ja).toEqual([]);
  question.links = [{ path: "/questions/saa", labels: { ja: "問題", en: "Questions", zh: "題庫" } }];
  expect(run([question]).itemsByLocale.en[0].links[0].href).toBe("/en/questions/saa");
  expect(run([question], () => false).itemsByLocale.ja).toEqual([]);
});

it.each(["2026-02-30", "2026-11-13"])("omits invalid or future announcement %s", (date) => expect(run([make("first", date)]).itemsByLocale.ja).toEqual([]));
it("omits unpublished, missing copy, empty labels and invalid links across locales", () => {
  const unpublished = make(); unpublished.published = false;
  const title = make(); title.translations.en.title = " ";
  const summary = make(); summary.translations.zh.summary = "";
  const label = make(); label.links = [{ path: "/questions/saa", labels: { ja: "", en: "Questions", zh: "題庫" } }];
  const external = make(); external.links = [{ path: "https://example.com", labels: { ja: "問題", en: "Questions", zh: "題庫" } }];
  for (const value of [unpublished, title, summary, label, external]) expect(run([value]).itemsByLocale.ja).toEqual([]);
  expect(run([make(), make()]).itemsByLocale.ja).toEqual([]);
});

it("keeps the original and links chronological corrections both ways", () => {
  const original = make("first", "2026-11-01"), newer = make("third", "2026-11-11"), earlier = make("second", "2026-11-09");
  newer.corrects = earlier.corrects = "first";
  const items = run([newer, original, earlier]).itemsByLocale.ja;
  expect(items.find((i) => i.id === "announcement:first")).toMatchObject({ date: "2026-11-01", title: original.translations.ja.title, corrections: ["announcement:second", "announcement:third"] });
  expect(items.find((i) => i.id === "announcement:second")?.corrects).toBe("announcement:first");
});

it("rejects self, dangling and cyclic correction relationships", () => {
  const self = make(); self.corrects = self.id;
  const dangling = make(); dangling.corrects = "missing";
  const a = make("a"), b = make("b"); a.corrects = "b"; b.corrects = "a";
  for (const values of [[self], [dangling], [a, b]]) {
    expect(run(values).itemsByLocale.ja).toEqual([]);
    expect(run(values).diagnostics.length).toBeGreaterThan(0);
  }
});

it("never links originals to omitted future or unpublished corrections", () => {
  const future = make("future", "2026-11-13"), hidden = make("hidden");
  future.corrects = hidden.corrects = "first"; hidden.published = false;
  expect(run([make(), future, hidden]).itemsByLocale.ja).toMatchObject([{ id: "announcement:first", corrections: [] }]);
});

it("sorts mixed items consistently and previews exactly the first three", () => {
  const translation = { id: "z", slug: "sample", title: "title", summary: "summary", published: true, noIndex: false, bodyPresent: true, publishedAt: "2026-11-09" };
  const article: ArticleCandidate = { kind: "blog", id: "z", slug: "sample", translations: { ja: translation, en: translation, zh: translation } };
  const result = aggregateUpdates({ articles: [article], announcements: [make("z"), make("a"), make("new", "2026-11-10")], today: "2026-11-12", isPublicPath: () => true });
  for (const items of Object.values(result.itemsByLocale)) {
    expect(items.map((i) => i.id)).toEqual(["announcement:new", "announcement:a", "announcement:z", "blog:z"]);
    expect(selectHomeUpdates(items)).toEqual(items.slice(0, 3));
    expect(selectHomeUpdates(items.slice(0, 1))).toEqual(items.slice(0, 1));
  }
  expect(selectHomeUpdates([])).toEqual([]);
});

const approvedFeatureCopy = {
  "zh": {
    "title": "新增「最新文章」與「最新內容與公告」",
    "summary": "首頁新增「最新文章」與「最新內容與公告」，讓你更容易找到近期發布或更新的學習內容，以及網站的新功能與題庫消息。 「最新文章」依文章的發布或更新日期，列出最近的三篇部落格文章，並提供文章連結。 「最新內容與公告」彙整文章、架構與比較內容的發布及更新，以及題庫和網站功能公告。首頁顯示最近三則，完整清單可在「最新內容與公告」頁查看。 每則項目會標示新增或更新及相關日期；更新內容會呈現已記錄的修正說明與來源連結，缺少說明時也會明確標示。上述功能提供繁體中文、英文與日文版本。",
    "homeLabel": "前往首頁查看最新文章",
    "updatesLabel": "查看最新內容與公告"
  },
  "en": {
    "title": "Introducing Latest Articles and Latest Content and Announcements",
    "summary": "The home page adds Latest Articles and Latest Content and Announcements, making it easier to find recently published or updated learning content, new site features, and question-bank news. Latest Articles lists the three most recent blog articles by publication or update date and provides links to the articles. Latest Content and Announcements brings together new and updated articles, architecture guides, and comparisons, as well as question-bank and site-feature announcements. The home page shows the three most recent items; the full list is available on the Latest Content and Announcements page. Each item shows whether it is new or updated and its relevant date. Updated content includes recorded correction notes and source links; missing notes are also clearly indicated. These features are available in Traditional Chinese, English, and Japanese.",
    "homeLabel": "View Latest Articles on the home page",
    "updatesLabel": "View Latest Content and Announcements"
  },
  "ja": {
    "title": "「最新記事」と「最新コンテンツとお知らせ」を追加",
    "summary": "ホームページに「最新記事」と「最新コンテンツとお知らせ」を追加し、最近公開・更新された学習コンテンツや、サイトの新機能、問題集のお知らせを見つけやすくしました。 「最新記事」では、公開日または更新日が新しいブログ記事を3件表示し、各記事へのリンクを掲載しています。 「最新コンテンツとお知らせ」では、記事、アーキテクチャ解説、比較コンテンツの公開・更新情報と、問題集やサイト機能のお知らせをまとめて確認できます。ホームページには最新の3件を表示し、全件は「最新コンテンツとお知らせ」ページで確認できます。 各項目には新規・更新の区分と関連する日付を表示します。更新されたコンテンツには、記録された修正内容と参照元へのリンクを表示し、説明がない場合もその旨を明示します。これらの機能は繁体字中国語、英語、日本語で利用できます。",
    "homeLabel": "ホームページで最新記事を見る",
    "updatesLabel": "最新コンテンツとお知らせを見る"
  }
} as const;

it.each(["ja", "en", "zh"] as const)("publishes the complete approved feature announcement and localized destinations in %s", (locale) => {
  const feature = announcements.find((value) => value.id === "latest-articles-and-updates");
  expect(feature).toBeDefined();
  if (!feature) return;
  const approved = approvedFeatureCopy[locale];
  expect(feature).toMatchObject({ category: "feature", eventKind: "new", date: "2026-11-13", published: true });
  expect(feature.corrects).toBeUndefined();
  expect(feature.translations[locale]).toEqual({ title: approved.title, summary: approved.summary });
  expect(feature.links.map((link) => [link.path, link.labels[locale]])).toEqual([["/", approved.homeLabel], ["/updates", approved.updatesLabel]]);
  const result = aggregateUpdates({ articles: [], announcements, today: "2026-11-13", isPublicPath: (target, language) => isPublicUpdatesPath(target, language) });
  const value = result.itemsByLocale[locale].find((entry) => entry.id === "announcement:latest-articles-and-updates");
  const destinations = { ja: ["/", "/updates"], en: ["/en", "/en/updates"], zh: ["/zh", "/zh/updates"] };
  expect(value).toMatchObject({ eventKind: "new", date: "2026-11-13", dateLabel: "announced", changeNotes: { status: "not-applicable" }, title: approved.title, summary: approved.summary });
  expect(value?.links.map((link) => link.href)).toEqual(destinations[locale]);
  expect(result.diagnostics).toEqual([]);
});

it.each(["unpublished", "missing-title", "missing-summary", "empty-label", "sealed-destination"] as const)("omits the feature consistently across locales when %s", (failure) => {
  const source = announcements.find((value) => value.id === "latest-articles-and-updates");
  expect(source).toBeDefined();
  if (!source) return;
  const feature = structuredClone(source);
  if (failure === "unpublished") feature.published = false;
  if (failure === "missing-title") feature.translations.en.title = "";
  if (failure === "missing-summary") feature.translations.ja.summary = " ";
  if (failure === "empty-label") feature.links[1].labels.zh = "";
  const result = aggregateUpdates({ articles: [], announcements: [feature], today: "2026-11-13", isPublicPath: (target, locale) => !(failure === "sealed-destination" && locale === "en" && target === "/updates") });
  for (const locale of ["ja", "en", "zh"] as const) expect(result.itemsByLocale[locale]).toEqual([]);
  const code = failure === "unpublished" ? "unpublished" : failure === "missing-title" || failure === "missing-summary" ? "missing-translation" : "invalid-public-link";
  expect(result.diagnostics).toContainEqual({ code, id: "announcement:latest-articles-and-updates" });
});
