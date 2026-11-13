import type { Announcement } from "./types";
export const announcements: Announcement[] = [{
  id: "saa-c03-051-060", eventKind: "new", category: "question-bank", date: "2026-11-09", published: true,
  translations: {
    zh: { title: "新增 10 道 SAA-C03 情境題", summary: "新增 10 道 SAA-C03 情境題，提供繁體中文、日文與英文版本，附四個選項、正確答案及逐項解析。" },
    ja: { title: "SAA-C03のシナリオ問題を10問追加", summary: "SAA-C03のシナリオ問題を10問追加しました。日本語・英語・繁体字中国語で、4つの選択肢、正解、各選択肢の解説を確認できます。" },
    en: { title: "10 new SAA-C03 scenario questions", summary: "Added 10 SAA-C03 scenario questions in Japanese, English, and Traditional Chinese, with four choices, the correct answer, and explanations for each choice." },
  },
  links: [{ path: "/questions/saa", labels: { ja: "SAA-C03の問題を見る", en: "View SAA-C03 questions", zh: "查看 SAA-C03 題庫" } }],
}];
