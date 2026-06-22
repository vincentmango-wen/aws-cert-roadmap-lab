import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionPlayer } from "@/components/questions/QuestionPlayer";
import type { ResolvedLink } from "@/components/questions/QuestionPlayer";
import { questionPlayerLabelsByLocale } from "@/components/questions/question-player-labels";
import { createPageMetadata } from "@/lib/seo";
import { isExistingTerm, isExistingComparison } from "@/lib/termGuards";
import {
  createQuestionDetailMetadataInput,
  getAdjacentQuestionIds,
  getPublishedQuestionByIdLocale,
  getQuestionStaticParams,
} from "../question-detail-data";

type QuestionDetailPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

const LOCALE = "ja" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return getQuestionStaticParams(LOCALE);
}

export async function generateMetadata({
  params,
}: QuestionDetailPageProps): Promise<Metadata> {
  const { questionId } = await params;
  return createPageMetadata(
    createQuestionDetailMetadataInput(LOCALE, questionId),
  );
}

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps): Promise<React.JSX.Element> {
  const { questionId } = await params;
  const question = getPublishedQuestionByIdLocale(LOCALE, questionId);

  if (!question) {
    notFound();
  }

  const { previousQuestionId, nextQuestionId } = getAdjacentQuestionIds(
    LOCALE,
    questionId,
  );

  // server 側で存在チェックを済ませ、解決済み構造を client に渡す。
  // QuestionPlayer ("use client") から termGuards (terms.json 85KB) の
  // import を排除し client bundle 汚染を解消する。
  const resolvedServices: ResolvedLink[] = (question.relatedServices ?? []).map(
    (id) => ({ id, exists: isExistingTerm(id) }),
  );
  const resolvedTerms: ResolvedLink[] = (question.relatedTerms ?? []).map(
    (id) => ({ id, exists: isExistingTerm(id) }),
  );
  const resolvedComparisons: ResolvedLink[] = (
    question.relatedComparisons ?? []
  ).map((id) => ({ id, exists: isExistingComparison(id) }));

  return (
    <QuestionPlayer
      locale={LOCALE}
      labels={questionPlayerLabelsByLocale[LOCALE]}
      question={question}
      previousQuestionId={previousQuestionId ?? undefined}
      nextQuestionId={nextQuestionId ?? undefined}
      resolvedServices={resolvedServices}
      resolvedTerms={resolvedTerms}
      resolvedComparisons={resolvedComparisons}
    />
  );
}
