/**
 * 模擬問題詳細ページ用 Quiz 構造化データ（JSON-LD）ビルダー。
 *
 * 目的は schema.org 語彙としての機械可読性（Bing / LLM クローラ）と
 * E-E-A-T シグナルの底上げに限られる。Google の practice problems
 * リッチリザルトは 2026-01 にドキュメントごと削除済みで、本対応で
 * 検索結果の見た目は変わらない（Rich Results Test が「有効な項目なし」
 * を返すのが正常）。
 *
 * 設計上の禁止事項（sd-policies 違反 / 手動対策リスクの回避）:
 *   - `eduQuestionType: "Flashcard"` は使わない（Education Q&A はフラッシュカード専用）
 *   - `QAPage` / `FAQPage` は使わない（ユーザー投稿型ページ専用）
 *   - `answerExplanation` は使わない（schema.org に存在しない）。解説は
 *     `Answer.comment` → `{"@type":"Comment","text":…}` に入れる
 *   - `practicalNote` / `difficulty` / `relatedComparisons` / `published` は出力しない
 *
 * また sd-policies「不可視コンテンツのマークアップ禁止」に従い、ここで出力する
 * テキストはすべて QuestionPlayer が静的 HTML に常時出力しているものに限る。
 */
import { filterValidOfficialDocs } from "@/lib/official-doc";
import { createAbsoluteUrl, type SeoLocale } from "@/lib/seo";
import type { ChoiceId, ExamCode, Question } from "@/types/question";

/** 資格コード → 正式名称。educationalAlignment の targetName に使う。 */
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
 * 1 問ぶんの Quiz JSON-LD を組み立てる純関数。
 *
 * `Question` は schema.org 上 `Comment` のサブタイプなので、1 問ページでも
 * トップレベルには置かず `Quiz.hasPart` に長さ 1 の配列でネストする。
 *
 * @param question 対象の模擬問題
 * @param locale 出力ロケール。現状 ja 固定運用だが、en/zh 解封時の
 *   `inLanguage` / URL 切り替えの見落としを防ぐため必須引数とする。
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
