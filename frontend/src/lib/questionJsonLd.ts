/**
 * Quiz JSON-LD builder for practice-question detail pages. Its purpose is schema.org machine readability
 * for Bing/LLM crawlers and stronger E-E-A-T signals. Google's practice-problems rich results and
 * documentation were removed in January 2026; this does not change search-result appearance, and Rich
 * Results Test reporting no valid items is expected.
 *
 * Design restrictions to avoid structured-data policy violations/manual actions:
 * - Do not use eduQuestionType: Flashcard; Education Q&A is for flashcards.
 * - Do not use QAPage/FAQPage in this implementation.
 * - Do not use the nonexistent schema.org answerExplanation property; use Answer.comment with a Comment
 * object containing text.
 * - Do not emit practicalNote, difficulty, relatedComparisons or published.
 *
 * To comply with the prohibition on marking up invisible content, emit only text that QuestionPlayer
 * always includes in static HTML.
 */
import { filterValidOfficialDocs } from "@/lib/official-doc";
import { createAbsoluteUrl, type SeoLocale } from "@/lib/seo";
import type { ChoiceId, ExamCode, Question } from "@/types/question";

/**
 * Certification code to official name, used for educationalAlignment.targetName.
 */
const examLabelByExam: Record<ExamCode, string> = {
  "CLF-C02": "AWS Certified Cloud Practitioner (CLF-C02)",
  "SAA-C03": "AWS Certified Solutions Architect – Associate (SAA-C03)",
};

function createQuestionDetailUrl(
  questionId: string,
  locale: SeoLocale,
): string {
  const path =
    locale === "ja"
      ? `/questions/${questionId}`
      : `/${locale}/questions/${questionId}`;

  return createAbsoluteUrl(path);
}

function isNonEmpty(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function createComment(text: string): Record<string, unknown> {
  return {
    "@type": "Comment",
    text,
  };
}

function resolveChoiceExplanation(
  question: Question,
  choiceId: ChoiceId,
): string | undefined {
  const value = question.choiceExplanations?.[choiceId];

  return isNonEmpty(value) ? value : undefined;
}

function buildKeywords(question: Question): string | undefined {
  const source = [
    ...(question.tags ?? []),
    ...(question.relatedServices ?? []),
    ...(question.relatedTerms ?? []),
  ].filter(isNonEmpty);

  const unique = [...new Set(source)];

  if (unique.length === 0) {
    return undefined;
  }

  return unique.join(", ");
}

function buildEducationalAlignment(
  question: Question,
): Record<string, unknown>[] {
  const alignment: Record<string, unknown>[] = [
    {
      "@type": "AlignmentObject",
      alignmentType: "educationalSubject",
      targetName: examLabelByExam[question.exam],
    },
  ];

  if (isNonEmpty(question.domain) && question.domain !== question.category) {
    alignment.push({
      "@type": "AlignmentObject",
      alignmentType: "educationalSubject",
      targetName: question.domain,
    });
  }

  return alignment;
}

function buildCitation(
  question: Question,
): Record<string, unknown>[] | undefined {
  const docs = filterValidOfficialDocs(question.officialDocs);

  if (docs.length === 0) {
    return undefined;
  }

  return docs.map((doc) => ({
    "@type": "WebPage",
    name: doc.label,
    url: doc.url,
  }));
}

/**
 * Pure function building Quiz JSON-LD for one question. Since schema.org Question is a Comment subtype,
 * nest even a single question in a one-element Quiz.hasPart array rather than at the top level.
 * @param question The practice question.
 * @param locale Output locale. Required even during Japanese-only operation so inLanguage and URL
 * changes are not overlooked when publishing en/zh.
 */
export function buildQuestionQuizJsonLd(
  question: Question,
  locale: SeoLocale,
): Record<string, unknown> {
  const url = createQuestionDetailUrl(question.questionId, locale);

  const correctIndex = question.choices.findIndex(
    (choice) => choice.choiceId === question.correctChoiceId,
  );
  const correctChoice =
    correctIndex === -1 ? undefined : question.choices[correctIndex];

  const acceptedComments: Record<string, unknown>[] = [];
  if (correctChoice) {
    const correctChoiceExplanation = resolveChoiceExplanation(
      question,
      correctChoice.choiceId,
    );
    if (correctChoiceExplanation) {
      acceptedComments.push(createComment(correctChoiceExplanation));
    }
  }
  if (isNonEmpty(question.explanation)) {
    acceptedComments.push(createComment(question.explanation));
  }

  const acceptedAnswer = correctChoice
    ? {
        "@type": "Answer",
        position: correctIndex,
        text: correctChoice.text,
        ...(acceptedComments.length > 0 ? { comment: acceptedComments } : {}),
      }
    : undefined;

  const suggestedAnswer = question.choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ choice }) => choice.choiceId !== question.correctChoiceId)
    .map(({ choice, index }) => {
      const explanation = resolveChoiceExplanation(question, choice.choiceId);

      return {
        "@type": "Answer",
        position: index,
        text: choice.text,
        ...(explanation ? { comment: createComment(explanation) } : {}),
      };
    });

  const questionPart: Record<string, unknown> = {
    "@type": "Question",
    "@id": `${url}#question`,
    eduQuestionType: "Multiple choice",
    text: question.question,
    answerCount: 1,
    ...(acceptedAnswer ? { acceptedAnswer } : {}),
    ...(suggestedAnswer.length > 0 ? { suggestedAnswer } : {}),
  };

  const keywords = buildKeywords(question);
  const citation = buildCitation(question);

  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": `${url}#quiz`,
    url,
    learningResourceType: "Practice problem",
    inLanguage: locale,
    educationalAlignment: buildEducationalAlignment(question),
    about: {
      "@type": "Thing",
      name: question.category,
    },
    assesses: question.category,
    ...(keywords ? { keywords } : {}),
    ...(citation ? { citation } : {}),
    datePublished: question.createdAt,
    dateModified: question.updatedAt,
    hasPart: [questionPart],
  };
}
