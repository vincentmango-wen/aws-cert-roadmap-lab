import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionPlayer } from "../../../components/questions/QuestionPlayer";
import type { ResolvedLink } from "../../../components/questions/QuestionPlayer";
import { createPageMetadata } from "../../../lib/seo";
import { isExistingTerm, isExistingComparison } from "../../../lib/termGuards";
import type { Question } from "../../../types/question";
import rawClfQuestions from "../../../../contents/questions/clf-c02.json";
import rawSaaQuestions from "../../../../contents/questions/saa-c03.json";

type QuestionDetailPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

type QuestionStaticParams = {
  questionId: string;
};

const questions = [
  ...(rawClfQuestions as Question[]),
  ...(rawSaaQuestions as Question[]),
];

export function generateStaticParams(): QuestionStaticParams[] {
  return questions
    .filter((question) => question.published)
    .map((question) => ({
      questionId: question.questionId,
    }));
}

function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}…`;
}

export async function generateMetadata({
  params,
}: QuestionDetailPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const question = questions.find((item) => item.questionId === questionId);

  if (!question) {
    return createPageMetadata({
      title: "模擬問題が見つかりません",
      description:
        "指定された模擬問題は見つかりませんでした。模擬問題一覧からAWS資格対策の問題を確認できます。",
      path: `/questions/${questionId}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${question.questionId.toUpperCase()} | ${question.exam}模擬問題`,
    description: truncateDescription(
      `${question.category}分野のAWS模擬問題です。${question.question}`,
      120,
    ),
    path: `/questions/${question.questionId}`,
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
  });
}

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps): Promise<React.JSX.Element> {
  const { questionId } = await params;
  const question = getPublishedQuestions().find(
    (item) => item.questionId === questionId,
  );

  if (!question) {
    notFound();
  }

  const adjacentQuestionIds = getAdjacentQuestionIds(questionId);

  // server 側で存在チェックを済ませ、解決済み構造を client に渡す。
  // QuestionPlayer ("use client") から termGuards (terms.json 85KB) の
  // import を排除し client bundle 汚染を解消する。
  const resolvedServices: ResolvedLink[] = (question.relatedServices ?? []).map(
    (id) => ({ id, exists: isExistingTerm(id) }),
  );
  const resolvedTerms: ResolvedLink[] = (question.relatedTerms ?? []).map(
    (id) => ({ id, exists: isExistingTerm(id) }),
  );
  const resolvedComparisons: ResolvedLink[] = (question.relatedComparisons ?? []).map(
    (id) => ({ id, exists: isExistingComparison(id) }),
  );

  return (
    <QuestionPlayer
      question={question}
      previousQuestionId={adjacentQuestionIds.previousQuestionId ?? undefined}
      nextQuestionId={adjacentQuestionIds.nextQuestionId ?? undefined}
      resolvedServices={resolvedServices}
      resolvedTerms={resolvedTerms}
      resolvedComparisons={resolvedComparisons}
    />
  );
}

function getPublishedQuestions(): Question[] {
  return questions.filter((question) => question.published);
}

function getAdjacentQuestionIds(questionId: string): {
  previousQuestionId: string | null;
  nextQuestionId: string | null;
} {
  const publishedQuestions = getPublishedQuestions();
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
    previousQuestionId: previousQuestion ? previousQuestion.questionId : null,
    nextQuestionId: nextQuestion ? nextQuestion.questionId : null,
  };
}