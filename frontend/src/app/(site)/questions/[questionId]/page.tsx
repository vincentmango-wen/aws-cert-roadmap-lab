import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionPlayer } from "@/components/questions/QuestionPlayer";
import type { ResolvedLink } from "@/components/questions/QuestionPlayer";
import { questionPlayerLabelsByLocale } from "@/components/questions/question-player-labels";
import { buildQuestionQuizJsonLd } from "@/lib/questionJsonLd";
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

  // Check existence on the server and pass resolved structures to the client.
  // Keep the termGuards import (terms.json, 85KB) out of the use-client QuestionPlayer
  // to avoid including the large data file in the client bundle.
  const resolvedServices: ResolvedLink[] = (question.relatedServices ?? []).map(
    (id) => ({ id, exists: isExistingTerm(id) }),
  );
  const resolvedTerms: ResolvedLink[] = (question.relatedTerms ?? []).map(
    (id) => ({ id, exists: isExistingTerm(id) }),
  );
  const resolvedComparisons: ResolvedLink[] = (
    question.relatedComparisons ?? []
  ).map((id) => ({ id, exists: isExistingComparison(id) }));

  // Quiz structured data (Japanese only). To comply with structured-data policies, output only
  // text that QuestionPlayer always renders in static HTML.
  const quizJsonLd = buildQuestionQuizJsonLd(question, LOCALE);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quizJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
    </>
  );
}
