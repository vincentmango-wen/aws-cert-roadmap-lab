/**
 * Client-safe source of truth for QuestionPlayer UI labels. questionPlayerLabelsByLocale previously
 * lived in app/(site)/questions/question-detail-data.ts, a server module importing large JSON datasets.
 * Extracting it into this independent file keeps those imports out of client components (P5 R1
 * Minor-1/Minor-2). question-detail-data.ts re-exports it for backward compatibility.
 */

export type QuestionPlayerLocale = "ja" | "en" | "zh";

export type QuestionPlayerLabels = {
  breadcrumbLabel: string;
  homeLabel: string;
  questionsLabel: string;
  clfLabel: string;
  saaLabel: string;
  questionDisclaimer: string;
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
  /**
   * H2 for the explanation section, always present in the DOM and initially collapsed in details.
   */
  explanationSectionTitle: string;
  /**
   * Summary label for explanations. Explicitly warn that opening the section reveals the correct answer.
   */
  explanationSummaryLabel: string;
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
    questionDisclaimer:
      "この問題は学習目的で独自に作成した非公式の練習問題です。AWS公式試験問題、実試験問題、試験ダンプではありません。",
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
    explanationSectionTitle: "解説と正解",
    explanationSummaryLabel:
      "解説と正解を読む（先に自分で回答してから開くのがおすすめです）",
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
    questionDisclaimer:
      "These questions are independently created for study purposes. They are not official AWS exam questions, actual exam questions, leaked questions, or exam dumps.",
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
    explanationSectionTitle: "Explanation and answer",
    explanationSummaryLabel:
      "Read the explanation and correct answer (spoiler — try answering first)",
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
    questionDisclaimer:
      "這些題目為學習目的而獨立製作，並非 AWS 官方考題、實際考題、外流題或考題庫。",
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
    explanationSectionTitle: "解析與正確答案",
    explanationSummaryLabel: "閱讀解析與正確答案（劇透：建議先自行作答）",
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
