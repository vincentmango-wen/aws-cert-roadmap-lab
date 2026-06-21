import rawClfQuestionsJa from "../../../../contents/questions/clf-c02.ja.json";
import rawClfQuestionsEn from "../../../../contents/questions/clf-c02.en.json";
import rawClfQuestionsZh from "../../../../contents/questions/clf-c02.zh.json";
import rawSaaQuestionsJa from "../../../../contents/questions/saa-c03.ja.json";
import rawSaaQuestionsEn from "../../../../contents/questions/saa-c03.en.json";
import rawSaaQuestionsZh from "../../../../contents/questions/saa-c03.zh.json";
import type { Question, QuestionDifficulty } from "@/types/question";
import type { PageMetadataInput } from "@/lib/seo";

export type QuestionDetailLocale = "ja" | "en" | "zh";

export type QuestionStaticParams = {
  questionId: string;
};

export type QuestionPlayerLabels = {
  breadcrumbLabel: string;
  homeLabel: string;
  questionsLabel: string;
  clfLabel: string;
  saaLabel: string;
  difficultyLabel: string;
  difficulty: Record<QuestionDifficulty, string>;
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
  QuestionDetailLocale,
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

const questionsByLocale: Record<
  QuestionDetailLocale,
  { clf: Question[]; saa: Question[] }
> = {
  ja: {
    clf: rawClfQuestionsJa as Question[],
    saa: rawSaaQuestionsJa as Question[],
  },
  en: {
    clf: rawClfQuestionsEn as Question[],
    saa: rawSaaQuestionsEn as Question[],
  },
  zh: {
    clf: rawClfQuestionsZh as Question[],
    saa: rawSaaQuestionsZh as Question[],
  },
};

export function getClfQuestionsByLocale(
  locale: QuestionDetailLocale,
): Question[] {
  return questionsByLocale[locale].clf;
}

export function getSaaQuestionsByLocale(
  locale: QuestionDetailLocale,
): Question[] {
  return questionsByLocale[locale].saa;
}

export function getQuestionsByLocale(
  locale: QuestionDetailLocale,
): Question[] {
  return [
    ...questionsByLocale[locale].clf,
    ...questionsByLocale[locale].saa,
  ];
}

export function getPublishedQuestionsByLocale(
  locale: QuestionDetailLocale,
): Question[] {
  return getQuestionsByLocale(locale).filter((question) => question.published);
}

export function getPublishedClfQuestionsByLocale(
  locale: QuestionDetailLocale,
): Question[] {
  return getClfQuestionsByLocale(locale).filter(
    (question) => question.published,
  );
}

export function getPublishedSaaQuestionsByLocale(
  locale: QuestionDetailLocale,
): Question[] {
  return getSaaQuestionsByLocale(locale).filter(
    (question) => question.published,
  );
}

export function getPublishedQuestionByIdLocale(
  locale: QuestionDetailLocale,
  questionId: string,
): Question | undefined {
  return getPublishedQuestionsByLocale(locale).find(
    (question) => question.questionId === questionId,
  );
}

export function getQuestionStaticParams(
  locale: QuestionDetailLocale,
): QuestionStaticParams[] {
  return getPublishedQuestionsByLocale(locale).map((question) => ({
    questionId: question.questionId,
  }));
}

export function getAdjacentQuestionIds(
  locale: QuestionDetailLocale,
  questionId: string,
): {
  previousQuestionId: string | null;
  nextQuestionId: string | null;
} {
  const publishedQuestions = getPublishedQuestionsByLocale(locale);
  const currentIndex = publishedQuestions.findIndex(
    (question) => question.questionId === questionId,
  );

  if (currentIndex === -1) {
    return {
      previousQuestionId: null,
      nextQuestionId: null,
    };
  }

  const previousQuestion = publishedQuestions[currentIndex - 1] ?? null;
  const nextQuestion = publishedQuestions[currentIndex + 1] ?? null;

  return {
    previousQuestionId: previousQuestion
      ? previousQuestion.questionId
      : null,
    nextQuestionId: nextQuestion ? nextQuestion.questionId : null,
  };
}

export function createLocalizedQuestionPath(
  locale: QuestionDetailLocale,
  path: "/" | `/${string}`,
): `/${string}` {
  if (locale === "ja") {
    return path === "/" ? "/" : path;
  }

  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path}`;
}

export function createQuestionsListPath(
  locale: QuestionDetailLocale,
): `/${string}` {
  return createLocalizedQuestionPath(locale, "/questions");
}

export function createClfQuestionsListPath(
  locale: QuestionDetailLocale,
): `/${string}` {
  return createLocalizedQuestionPath(locale, "/questions/clf");
}

export function createSaaQuestionsListPath(
  locale: QuestionDetailLocale,
): `/${string}` {
  return createLocalizedQuestionPath(locale, "/questions/saa");
}

export function createQuestionDetailPath(
  locale: QuestionDetailLocale,
  questionId: string,
): `/${string}` {
  return createLocalizedQuestionPath(locale, `/questions/${questionId}`);
}

function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}…`;
}

export function createQuestionDetailMetadataInput(
  locale: QuestionDetailLocale,
  questionId: string,
): PageMetadataInput {
  const question = getPublishedQuestionByIdLocale(locale, questionId);

  if (!question) {
    if (locale === "en") {
      return {
        title: "Question not found",
        description:
          "The specified practice question was not found. You can browse other AWS practice questions from the list.",
        path: createQuestionDetailPath(locale, questionId),
        noIndex: true,
      };
    }
    if (locale === "zh") {
      return {
        title: "找不到模擬題",
        description:
          "找不到指定的模擬題。請從模擬題列表瀏覽其他 AWS 模擬題。",
        path: createQuestionDetailPath(locale, questionId),
        noIndex: true,
      };
    }
    return {
      title: "模擬問題が見つかりません",
      description:
        "指定された模擬問題は見つかりませんでした。模擬問題一覧からAWS資格対策の問題を確認できます。",
      path: createQuestionDetailPath(locale, questionId),
      noIndex: true,
    };
  }

  if (locale === "en") {
    return {
      title: `${question.questionId.toUpperCase()} | ${question.exam} practice question`,
      description: truncateDescription(
        `An AWS practice question in the ${question.category} domain. ${question.question}`,
        120,
      ),
      path: createQuestionDetailPath(locale, question.questionId),
      keywords: [
        question.exam,
        question.category,
        question.difficulty,
        "AWS",
        "practice question",
        ...(question.relatedServices ?? []),
        ...(question.tags ?? []),
      ],
      modifiedTime: question.updatedAt,
    };
  }

  if (locale === "zh") {
    return {
      title: `${question.questionId.toUpperCase()} | ${question.exam} 模擬題`,
      description: truncateDescription(
        `${question.category}領域的 AWS 模擬題。${question.question}`,
        120,
      ),
      path: createQuestionDetailPath(locale, question.questionId),
      keywords: [
        question.exam,
        question.category,
        question.difficulty,
        "AWS",
        "模擬題",
        ...(question.relatedServices ?? []),
        ...(question.tags ?? []),
      ],
      modifiedTime: question.updatedAt,
    };
  }

  return {
    title: `${question.questionId.toUpperCase()} | ${question.exam}模擬問題`,
    description: truncateDescription(
      `${question.category}分野のAWS模擬問題です。${question.question}`,
      120,
    ),
    path: createQuestionDetailPath(locale, question.questionId),
    keywords: [
      question.exam,
      question.category,
      question.difficulty,
      "AWS",
      "模擬問題",
      ...(question.relatedServices ?? []),
      ...(question.tags ?? []),
    ],
    modifiedTime: question.updatedAt,
  };
}
