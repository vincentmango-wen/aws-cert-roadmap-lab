import type { QuestionPlayerLocale } from "./question-player-labels";

// Localized starts of the constraint and final-question paragraphs, picked
// editorially. Do not infer breaks from punctuation or viewport dimensions.
const paragraphStarts: Partial<Record<string, Record<QuestionPlayerLocale, readonly string[]>>> = {
  "saa-053": {
    ja: ["アイデンティティポリシーは", "対象キューでの有効な権限"],
    en: ["Its identity policy", "What are its effective permissions"],
    zh: ["身分政策 Allow", "對此佇列的有效權限"],
  },
  "saa-057": {
    ja: ["下流の上限は", "キューのバッファを維持"],
    en: ["The downstream system supports", "Which change most directly"],
    zh: ["下游最多承受", "哪項調整最直接地"],
  },
  "saa-059": {
    ja: ["負荷試験では", "要件が変わらない場合"],
    en: ["Load tests show", "With requirements unchanged"],
    zh: ["兩種 Step Functions 類型", "需求不變時"],
  },
  "saa-062": {
    ja: ["オンプレミスの端末で", "どの方法で名前解決"],
    en: ["The company wants computers", "What should the company do?"],
    zh: ["現在希望地端電腦", "哪個做法可以讓查詢"],
  },
  "saa-067": {
    ja: ["サポート担当者が知っている", "どのプライマリキー"],
    en: ["Support agents have only", "Which primary key meets"],
    zh: ["客服查詢時只持有", "哪個主索引鍵設計"],
  },
  "saa-068": {
    ja: ["対象の日付は受信日ではなく", "クエリで他の日付"],
    en: ["The team can place each record", "What should it do?"],
    zh: ["團隊可以依每筆事件", "哪項調整最合適？"],
  },
};

export function splitQuestionStem(
  questionId: string,
  locale: QuestionPlayerLocale,
  text: string,
): string[] {
  const paragraphs: string[] = [];
  let start = 0;

  for (const marker of paragraphStarts[questionId]?.[locale] ?? []) {
    const end = text.indexOf(marker);
    if (end <= start || end !== text.lastIndexOf(marker)) return [text];
    paragraphs.push(text.slice(start, end));
    start = end;
  }

  return [...paragraphs, text.slice(start)];
}
