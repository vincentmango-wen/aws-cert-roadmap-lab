/**
 * QuestionPlayer (use client) が消費する UI label 辞書 SSoT。
 *
 * これまで `app/(site)/questions/question-detail-data.ts` (server module / 大規模 JSON import を伴う)
 * に同居していた `questionPlayerLabelsByLocale` を、client component が安全に import できるよう
 * 巨大 JSON import を含まない独立ファイルに切り出した（P5 R1 Minor-1 / Minor-2 共対応）。
 *
 * question-detail-data.ts からは re-export するため後方互換性あり。
 */

export type QuestionPlayerLocale = "ja" | "en" | "zh";

export type QuestionPlayerLabels = {
  breadcrumbLabel: string;
  homeLabel: string;
  questionsLabel: string;
  clfLabel: string;
  saaLabel: string;
  difficultyLabel: string;
  difficulty: {
    easy: string;
    normal: string;
    hard: string;
  };
  choicesTitle: string;
  submitLabel: string;
  retryLabel: string;
  resultTitle: string;
  correctLabel: string;
  incorrectLabel: string;
  yourAnswerLabel: string;
  unselectedLabel: string;
  correctAnswerLabel: string;
  explanationTitle: string;
  choiceExplanationsTitle: string;
  practicalNoteTitle: string;
  officialDocsTitle: string;
  relatedLinksTitle: string;
  relatedServicesTitle: string;
  relatedTermsTitle: string;
  relatedComparisonsTitle: string;
  navAriaLabel: string;
  previousQuestionLabel: string;
  noPreviousQuestionLabel: string;
  nextQuestionLabel: string;
  noNextQuestionLabel: string;
  backToListLabel: string;
};

export const questionPlayerLabelsByLocale: Record<
  QuestionPlayerLocale,
  QuestionPlayerLabels
> = {
  ja: {
    breadcrumbLabel: "パンくず",
    homeLabel: "ホーム",
    questionsLabel: "模擬問題",
    clfLabel: "CLF-C02",
    saaLabel: "SAA-C03",
    difficultyLabel: "難易度",
    difficulty: {
      easy: "やさしい",
      normal: "標準",
      hard: "難しい",
    },
    choicesTitle: "選択肢",
    submitLabel: "回答する",
    retryLabel: "もう一度選ぶ",
    resultTitle: "回答結果",
    correctLabel: "正解です。",
    incorrectLabel: "不正解です。",
    yourAnswerLabel: "あなたの回答：",
    unselectedLabel: "未選択",
    correctAnswerLabel: "正解：",
    explanationTitle: "解説",
    choiceExplanationsTitle: "選択肢ごとの解説",
    practicalNoteTitle: "実務での使いどころ",
    officialDocsTitle: "公式ドキュメント",
    relatedLinksTitle: "関連リンク",
    relatedServicesTitle: "関連サービス",
    relatedTermsTitle: "関連用語",
    relatedComparisonsTitle: "関連比較記事",
    navAriaLabel: "問題ナビゲーション",
    previousQuestionLabel: "前の問題へ",
    noPreviousQuestionLabel: "前の問題なし",
    nextQuestionLabel: "次の問題へ",
    noNextQuestionLabel: "次の問題なし",
    backToListLabel: "一覧に戻る",
  },
  en: {
    breadcrumbLabel: "Breadcrumb",
    homeLabel: "Home",
    questionsLabel: "Practice Questions",
    clfLabel: "CLF-C02",
    saaLabel: "SAA-C03",
    difficultyLabel: "Difficulty",
    difficulty: {
      easy: "Easy",
      normal: "Normal",
      hard: "Hard",
    },
    choicesTitle: "Choices",
    submitLabel: "Submit answer",
    retryLabel: "Try again",
    resultTitle: "Result",
    correctLabel: "Correct.",
    incorrectLabel: "Incorrect.",
    yourAnswerLabel: "Your answer: ",
    unselectedLabel: "Not selected",
    correctAnswerLabel: "Correct answer: ",
    explanationTitle: "Explanation",
    choiceExplanationsTitle: "Per-choice explanations",
    practicalNoteTitle: "Practical Use",
    officialDocsTitle: "Official Documentation",
    relatedLinksTitle: "Related links",
    relatedServicesTitle: "Related services",
    relatedTermsTitle: "Related terms",
    relatedComparisonsTitle: "Related comparison articles",
    navAriaLabel: "Question navigation",
    previousQuestionLabel: "Previous question",
    noPreviousQuestionLabel: "No previous question",
    nextQuestionLabel: "Next question",
    noNextQuestionLabel: "No next question",
    backToListLabel: "Back to list",
  },
  zh: {
    breadcrumbLabel: "麵包屑",
    homeLabel: "首頁",
    questionsLabel: "模擬題",
    clfLabel: "CLF-C02",
    saaLabel: "SAA-C03",
    difficultyLabel: "難度",
    difficulty: {
      easy: "簡單",
      normal: "標準",
      hard: "困難",
    },
    choicesTitle: "選項",
    submitLabel: "送出答案",
    retryLabel: "重新作答",
    resultTitle: "作答結果",
    correctLabel: "答對。",
    incorrectLabel: "答錯。",
    yourAnswerLabel: "您的答案：",
    unselectedLabel: "未選擇",
    correctAnswerLabel: "正確答案：",
    explanationTitle: "解析",
    choiceExplanationsTitle: "各選項解析",
    practicalNoteTitle: "實際使用情境",
    officialDocsTitle: "官方文件",
    relatedLinksTitle: "相關連結",
    relatedServicesTitle: "相關服務",
    relatedTermsTitle: "相關術語",
    relatedComparisonsTitle: "相關比較文章",
    navAriaLabel: "題目導覽",
    previousQuestionLabel: "上一題",
    noPreviousQuestionLabel: "沒有上一題",
    nextQuestionLabel: "下一題",
    noNextQuestionLabel: "沒有下一題",
    backToListLabel: "返回列表",
  },
};
