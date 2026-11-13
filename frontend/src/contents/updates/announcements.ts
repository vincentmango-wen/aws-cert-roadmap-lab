import type { Announcement } from "./types";
export const announcements: Announcement[] = [{
  id: "saa-c03-051-060", eventKind: "new", category: "question-bank", date: "2026-11-09", published: true,
  translations: {
    zh: { title: "新增 10 道 SAA-C03 情境題", summary: "新增 10 道 SAA-C03 情境題，提供繁體中文、日文與英文版本，附四個選項、正確答案及逐項解析。" },
    ja: { title: "SAA-C03のシナリオ問題を10問追加", summary: "SAA-C03のシナリオ問題を10問追加しました。日本語・英語・繁体字中国語で、4つの選択肢、正解、各選択肢の解説を確認できます。" },
    en: { title: "10 new SAA-C03 scenario questions", summary: "Added 10 SAA-C03 scenario questions in Japanese, English, and Traditional Chinese, with four choices, the correct answer, and explanations for each choice." },
  },
  links: [{ path: "/questions/saa", labels: { ja: "SAA-C03の問題を見る", en: "View SAA-C03 questions", zh: "查看 SAA-C03 題庫" } }],
}, {
  "id": "latest-articles-and-updates",
  "eventKind": "new",
  "category": "feature",
  "date": "2026-11-13",
  "published": true,
  "translations": {
    "zh": {
      "title": "新增「最新文章」與「最新內容與公告」",
      "summary": "首頁新增「最新文章」與「最新內容與公告」，讓你更容易找到近期發布或更新的學習內容，以及網站的新功能與題庫消息。 「最新文章」依文章的發布或更新日期，列出最近的三篇部落格文章，並提供文章連結。 「最新內容與公告」彙整文章、架構與比較內容的發布及更新，以及題庫和網站功能公告。首頁顯示最近三則，完整清單可在「最新內容與公告」頁查看。 每則項目會標示新增或更新及相關日期；更新內容會呈現已記錄的修正說明與來源連結，缺少說明時也會明確標示。上述功能提供繁體中文、英文與日文版本。"
    },
    "en": {
      "title": "Introducing Latest Articles and Latest Content and Announcements",
      "summary": "The home page adds Latest Articles and Latest Content and Announcements, making it easier to find recently published or updated learning content, new site features, and question-bank news. Latest Articles lists the three most recent blog articles by publication or update date and provides links to the articles. Latest Content and Announcements brings together new and updated articles, architecture guides, and comparisons, as well as question-bank and site-feature announcements. The home page shows the three most recent items; the full list is available on the Latest Content and Announcements page. Each item shows whether it is new or updated and its relevant date. Updated content includes recorded correction notes and source links; missing notes are also clearly indicated. These features are available in Traditional Chinese, English, and Japanese."
    },
    "ja": {
      "title": "「最新記事」と「最新コンテンツとお知らせ」を追加",
      "summary": "ホームページに「最新記事」と「最新コンテンツとお知らせ」を追加し、最近公開・更新された学習コンテンツや、サイトの新機能、問題集のお知らせを見つけやすくしました。 「最新記事」では、公開日または更新日が新しいブログ記事を3件表示し、各記事へのリンクを掲載しています。 「最新コンテンツとお知らせ」では、記事、アーキテクチャ解説、比較コンテンツの公開・更新情報と、問題集やサイト機能のお知らせをまとめて確認できます。ホームページには最新の3件を表示し、全件は「最新コンテンツとお知らせ」ページで確認できます。 各項目には新規・更新の区分と関連する日付を表示します。更新されたコンテンツには、記録された修正内容と参照元へのリンクを表示し、説明がない場合もその旨を明示します。これらの機能は繁体字中国語、英語、日本語で利用できます。"
    }
  },
  "links": [
    {
      "path": "/",
      "labels": {
        "zh": "前往首頁查看最新文章",
        "en": "View Latest Articles on the home page",
        "ja": "ホームページで最新記事を見る"
      }
    },
    {
      "path": "/updates",
      "labels": {
        "zh": "查看最新內容與公告",
        "en": "View Latest Content and Announcements",
        "ja": "最新コンテンツとお知らせを見る"
      }
    }
  ]
}];
