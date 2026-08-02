import rawClfQuestionsJa from "../../../../contents/questions/clf-c02.ja.json";
import rawClfQuestionsEn from "../../../../contents/questions/clf-c02.en.json";
import rawClfQuestionsZh from "../../../../contents/questions/clf-c02.zh.json";
import rawSaaQuestionsJa from "../../../../contents/questions/saa-c03.ja.json";
import rawSaaQuestionsEn from "../../../../contents/questions/saa-c03.en.json";
import rawSaaQuestionsZh from "../../../../contents/questions/saa-c03.zh.json";
import type { Question } from "@/types/question";
import type { PageMetadataInput } from "@/lib/seo";
import {
  questionPlayerLabelsByLocale as questionPlayerLabelsByLocaleSource,
  type QuestionPlayerLabels as QuestionPlayerLabelsSource,
  type QuestionPlayerLocale,
} from "@/components/questions/question-player-labels";

export type QuestionDetailLocale = QuestionPlayerLocale;

export type QuestionStaticParams = {
  questionId: string;
};

/**
 * QuestionPlayer UI 文言の型。client component 側 SSoT として
 * components/questions/question-player-labels.ts に切り出し済 (P5 R1 Minor-1/Minor-2)。
 * 後方互換性のためここで re-export する。
 */
export type QuestionPlayerLabels = QuestionPlayerLabelsSource;

/**
 * QuestionPlayer UI 文言辞書 (SSoT は components/questions/question-player-labels.ts)。
 * 後方互換性のためここで re-export する。
 */
export const questionPlayerLabelsByLocale = questionPlayerLabelsByLocaleSource;

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
