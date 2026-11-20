import rawAifQuestionsJa from "../../../../contents/questions/aif-c01.ja.json";
import rawAifQuestionsEn from "../../../../contents/questions/aif-c01.en.json";
import rawAifQuestionsZh from "../../../../contents/questions/aif-c01.zh.json";
import rawClfQuestionsJa from "../../../../contents/questions/clf-c02.ja.json";
import rawClfQuestionsEn from "../../../../contents/questions/clf-c02.en.json";
import rawClfQuestionsZh from "../../../../contents/questions/clf-c02.zh.json";
import rawSaaQuestionsJa from "../../../../contents/questions/saa-c03.ja.json";
import rawSaaQuestionsEn from "../../../../contents/questions/saa-c03.en.json";
import rawSaaQuestionsZh from "../../../../contents/questions/saa-c03.zh.json";
import { getDictionary } from "@/i18n/dictionaries";
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
 * QuestionPlayer UI-label type. Moved to components/questions/question-player-labels.ts as the
 * client-safe source of truth (P5 R1 Minor-1/Minor-2). Re-exported here for backward compatibility.
 */
export type QuestionPlayerLabels = QuestionPlayerLabelsSource;

/**
 * QuestionPlayer UI dictionary. The source of truth is components/questions/question-player-labels.ts;
 * re-export here for backward compatibility.
 */
export const questionPlayerLabelsByLocale = questionPlayerLabelsByLocaleSource;

const questionsByLocale: Record<
  QuestionDetailLocale,
  { clf: Question[]; saa: Question[]; aif: Question[] }
> = {
  ja: {
    clf: rawClfQuestionsJa as Question[],
    saa: rawSaaQuestionsJa as Question[],
    aif: rawAifQuestionsJa as Question[],
  },
  en: {
    clf: rawClfQuestionsEn as Question[],
    saa: rawSaaQuestionsEn as Question[],
    aif: rawAifQuestionsEn as Question[],
  },
  zh: {
    clf: rawClfQuestionsZh as Question[],
    saa: rawSaaQuestionsZh as Question[],
    aif: rawAifQuestionsZh as Question[],
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
    ...questionsByLocale[locale].aif,
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

export function getPublishedAifQuestionsByLocale(locale: QuestionDetailLocale): Question[] {
  return questionsByLocale[locale].aif.filter((question) => question.published);
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
  const allPublished = getPublishedQuestionsByLocale(locale);
  const isAif = allPublished.find((question) => question.questionId === questionId)?.exam === "AIF-C01";
  const publishedQuestions = allPublished.filter((question) => (question.exam === "AIF-C01") === isAif);
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

export function createAifQuestionsListPath(locale: QuestionDetailLocale): `/${string}` {
  return createLocalizedQuestionPath(locale, "/questions/aif");
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

export function getQuestionCategoryDisplayLabel(locale: QuestionDetailLocale, question: Question): string {
  return question.exam === "AIF-C01"
    ? getDictionary(locale).questions.categoryLabels[question.category]
    : question.category;
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

  const categoryLabel = getQuestionCategoryDisplayLabel(locale, question);

  if (locale === "en") {
    return {
      title: `${question.questionId.toUpperCase()} | ${question.exam} practice question`,
      description: truncateDescription(
        `An AWS practice question in the ${categoryLabel} domain. ${question.question}`,
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
      enableLanguageAlternates: question.exam === "AIF-C01",
    };
  }

  if (locale === "zh") {
    return {
      title: `${question.questionId.toUpperCase()} | ${question.exam} 模擬題`,
      description: truncateDescription(
        `${categoryLabel}領域的 AWS 模擬題。${question.question}`,
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
      enableLanguageAlternates: question.exam === "AIF-C01",
    };
  }

  return {
    title: `${question.questionId.toUpperCase()} | ${question.exam}模擬問題`,
    description: truncateDescription(
      `${categoryLabel}分野のAWS模擬問題です。${question.question}`,
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
    enableLanguageAlternates: question.exam === "AIF-C01",
  };
}
