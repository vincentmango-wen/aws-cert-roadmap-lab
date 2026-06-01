import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionPlayer } from "../../../components/questions/QuestionPlayer";
import type { Question } from "../../../types/question";
import rawQuestions from "../../../../contents/questions/clf-c02.json";

type QuestionDetailPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

const questions = rawQuestions as Question[];

export function generateStaticParams() {
  return getPublishedQuestions().map((question) => ({
    questionId: question.questionId,
  }));
}

export async function generateMetadata({
  params,
}: QuestionDetailPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const question = getQuestionById(questionId);

  if (!question) {
    return {
      title: "模擬問題が見つかりません | AWS資格ロードマップラボ",
      description: "指定された模擬問題は見つかりませんでした。",
    };
  }

  return {
    title: `AWS CLF模擬問題 ${question.questionId.toUpperCase()} | AWS資格ロードマップラボ`,
    description: `${question.exam}の${question.category}カテゴリの模擬問題です。回答後に正誤判定と解説を確認できます。`,
  };
}

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { questionId } = await params;
  const question = getQuestionById(questionId);

  if (!question) {
    notFound();
  }

  const { previousQuestionId, nextQuestionId } = getAdjacentQuestionIds(question.questionId);

  return (
    <QuestionPlayer
      question={question}
      previousQuestionId={previousQuestionId}
      nextQuestionId={nextQuestionId}
    />
  );
}

function getPublishedQuestions(): Question[] {
  return questions.filter((question) => question.published);
}

function getQuestionById(questionId: string): Question | undefined {
  return getPublishedQuestions().find((question) => question.questionId === questionId);
}

function getAdjacentQuestionIds(questionId: string): {
  previousQuestionId: string | null;
  nextQuestionId: string | null;
} {
  const publishedQuestions = getPublishedQuestions();
  const currentIndex = publishedQuestions.findIndex((question) => question.questionId === questionId);

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