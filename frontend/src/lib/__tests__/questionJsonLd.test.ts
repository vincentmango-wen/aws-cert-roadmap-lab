/**
 * Structural invariants for buildQuestionQuizJsonLd(). Choice order and correct IDs can change through
 * #312 answer rebalancing; do not hardcode facts such as clf-001's answer being B. Assert that
 * acceptedAnswer corresponds to correctChoiceId instead.
 */
import { describe, expect, it } from "vitest";

import { buildQuestionQuizJsonLd } from "@/lib/questionJsonLd";
import type { Question } from "@/types/question";

import clfJa from "../../../contents/questions/clf-c02.ja.json";

const clfQuestions = clfJa as Question[];

const baseQuestion: Question = {
  questionId: "test-001",
  exam: "CLF-C02",
  category: "Cloud Concepts",
  domain: "Cloud Concepts",
  difficulty: "easy",
  question: "テスト設問",
  choices: [
    { choiceId: "A", text: "選択肢A" },
    { choiceId: "B", text: "選択肢B" },
    { choiceId: "C", text: "選択肢C" },
    { choiceId: "D", text: "選択肢D" },
  ],
  correctChoiceId: "C",
  explanation: "全体解説テキスト",
  choiceExplanations: {
    A: "誤り。A の解説",
    B: "誤り。B の解説",
    C: "正解。C の解説",
    D: "誤り。D の解説",
  },
  practicalNote: "実務メモ",
  officialDocs: [
    { label: "AWS 公式ドキュメント", url: "https://docs.aws.amazon.com/test" },
  ],
  relatedServices: ["ec2"],
  relatedTerms: ["ec2", "scalability"],
  tags: ["scalability", "クラウド"],
  published: true,
  createdAt: "2026-01-01",
  updatedAt: "2026-02-01",
};

type AnswerNode = {
  "@type": string;
  position: number;
  text: string;
  comment?: unknown;
};

type QuestionNode = {
  "@type": string;
  "@id": string;
  eduQuestionType: string;
  text: string;
  answerCount: number;
  acceptedAnswer: AnswerNode & { comment?: { "@type": string; text: string }[] };
  suggestedAnswer: AnswerNode[];
};

function getQuestionNode(jsonLd: Record<string, unknown>): QuestionNode {
  const hasPart = jsonLd.hasPart as QuestionNode[];
  expect(Array.isArray(hasPart)).toBe(true);
  expect(hasPart).toHaveLength(1);
  return hasPart[0];
}

describe("buildQuestionQuizJsonLd", () => {
  it("(1) correctChoiceId becomes acceptedAnswer and remaining choices become suggestedAnswer", () => {
    const jsonLd = buildQuestionQuizJsonLd(baseQuestion, "ja");
    const node = getQuestionNode(jsonLd);

    expect(jsonLd["@type"]).toBe("Quiz");
    expect(node["@type"]).toBe("Question");
    expect(node.eduQuestionType).toBe("Multiple choice");
    expect(node.answerCount).toBe(1);

    const correctIndex = baseQuestion.choices.findIndex(
      (choice) => choice.choiceId === baseQuestion.correctChoiceId,
    );
    expect(node.acceptedAnswer.text).toBe(
      baseQuestion.choices[correctIndex].text,
    );
    expect(node.acceptedAnswer.position).toBe(correctIndex);

    expect(node.suggestedAnswer).toHaveLength(
      baseQuestion.choices.length - 1,
    );
    const suggestedTexts = node.suggestedAnswer.map((answer) => answer.text);
    expect(suggestedTexts).not.toContain(
      baseQuestion.choices[correctIndex].text,
    );
    // position retains the index in the choices array.
    for (const answer of node.suggestedAnswer) {
      expect(baseQuestion.choices[answer.position].text).toBe(answer.text);
      expect(answer["@type"]).toBe("Answer");
    }
  });

  it("(1b) acceptedAnswer matches correctChoiceId for every real clf-c02.ja.json question", () => {
    const violations: string[] = [];

    for (const question of clfQuestions) {
      const jsonLd = buildQuestionQuizJsonLd(question, "ja");
      const node = getQuestionNode(jsonLd);
      const correctChoice = question.choices.find(
        (choice) => choice.choiceId === question.correctChoiceId,
      );

      if (!correctChoice) {
        violations.push(`${question.questionId}: correctChoice not found`);
        continue;
      }
      if (node.acceptedAnswer.text !== correctChoice.text) {
        violations.push(`${question.questionId}: acceptedAnswer text mismatch`);
      }
      if (node.suggestedAnswer.length !== question.choices.length - 1) {
        violations.push(
          `${question.questionId}: suggestedAnswer length=${node.suggestedAnswer.length}`,
        );
      }
      if (node.text !== question.question) {
        violations.push(`${question.questionId}: question text mismatch`);
      }
    }

    expect(
      violations,
      `violations (${violations.length}):\n${violations.join("\n")}`,
    ).toHaveLength(0);
  });

  it("(2) acceptedAnswer.comment contains the correct-choice explanation before the overall explanation", () => {
    const jsonLd = buildQuestionQuizJsonLd(baseQuestion, "ja");
    const node = getQuestionNode(jsonLd);
    const comments = node.acceptedAnswer.comment ?? [];

    expect(comments).toHaveLength(2);
    expect(comments[0]).toEqual({
      "@type": "Comment",
      text: baseQuestion.choiceExplanations?.[baseQuestion.correctChoiceId],
    });
    expect(comments[1]).toEqual({
      "@type": "Comment",
      text: baseQuestion.explanation,
    });

    // Incorrect answers have a single comment object.
    for (const answer of node.suggestedAnswer) {
      const choiceId = baseQuestion.choices[answer.position].choiceId;
      expect(answer.comment).toEqual({
        "@type": "Comment",
        text: baseQuestion.choiceExplanations?.[choiceId],
      });
    }
  });

  it("(2b) incorrect choices without choiceExplanations omit the comment key", () => {
    const question: Question = {
      ...baseQuestion,
      choiceExplanations: { C: "正解。C の解説" },
    };
    const node = getQuestionNode(buildQuestionQuizJsonLd(question, "ja"));

    for (const answer of node.suggestedAnswer) {
      expect(Object.keys(answer)).not.toContain("comment");
    }
  });

  it("(3) empty officialDocs omits the citation key", () => {
    const withDocs = buildQuestionQuizJsonLd(baseQuestion, "ja");
    expect(Object.keys(withDocs)).toContain("citation");
    expect(withDocs.citation).toEqual([
      {
        "@type": "WebPage",
        name: "AWS 公式ドキュメント",
        url: "https://docs.aws.amazon.com/test",
      },
    ]);

    const emptyArray = buildQuestionJsonLdWith({ officialDocs: [] });
    expect(Object.keys(emptyArray)).not.toContain("citation");

    const undefinedDocs = buildQuestionJsonLdWith({ officialDocs: undefined });
    expect(Object.keys(undefinedDocs)).not.toContain("citation");

    // URLs outside the allowlist also produce zero valid entries.
    const invalidOnly = buildQuestionJsonLdWith({
      officialDocs: [{ label: "外部", url: "https://example.com/doc" }],
    });
    expect(Object.keys(invalidOnly)).not.toContain("citation");
  });

  it("(4) keywords combine and deduplicate tags, relatedServices and relatedTerms", () => {
    const jsonLd = buildQuestionQuizJsonLd(baseQuestion, "ja");

    // Fixture tags include scalability and the Japanese cloud label; services include ec2; related terms include ec2 and scalability.
    expect(jsonLd.keywords).toBe("scalability, クラウド, ec2");

    const noKeywords = buildQuestionJsonLdWith({
      tags: [],
      relatedServices: undefined,
      relatedTerms: [],
    });
    expect(Object.keys(noKeywords)).not.toContain("keywords");
  });

  it("(5) JSON.stringify plus replacement leaves no raw less-than characters", () => {
    const question: Question = {
      ...baseQuestion,
      question: "<script>alert(1)</script> を含む設問",
      explanation: "解説に <b>タグ</b> と </script> が入るケース",
    };
    const serialized = JSON.stringify(
      buildQuestionQuizJsonLd(question, "ja"),
    ).replace(/</g, "\\u003c");

    expect(serialized.indexOf("<")).toBe(-1);
    expect(serialized).toContain("\\u003cscript>");
    // Escaped JSON decodes to the same value.
    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    expect(getQuestionNode(parsed).text).toBe(question.question);
  });

  it("(6) does not emit prohibited properties or values", () => {
    const serialized = JSON.stringify(buildQuestionQuizJsonLd(baseQuestion, "ja"));

    expect(serialized).not.toContain("answerExplanation");
    expect(serialized).not.toContain("Flashcard");
    expect(serialized).not.toContain("QAPage");
    expect(serialized).not.toContain("FAQPage");
    expect(serialized).not.toContain("practicalNote");
    expect(serialized).not.toContain(baseQuestion.practicalNote);
    expect(serialized).not.toContain("difficulty");
    expect(serialized).not.toContain("relatedComparisons");
    expect(serialized).not.toContain("published");
  });

  it("(7) url and inLanguage change with the locale", () => {
    const ja = buildQuestionQuizJsonLd(baseQuestion, "ja");
    const en = buildQuestionQuizJsonLd(baseQuestion, "en");

    expect(ja.inLanguage).toBe("ja");
    expect(String(ja.url).endsWith("/questions/test-001")).toBe(true);
    expect(ja["@id"]).toBe(`${String(ja.url)}#quiz`);
    expect(getQuestionNode(ja)["@id"]).toBe(`${String(ja.url)}#question`);

    expect(en.inLanguage).toBe("en");
    expect(String(en.url).endsWith("/en/questions/test-001")).toBe(true);
  });

  it("(8) educationalAlignment includes the certification name and has two entries only when domain differs from category", () => {
    const sameDomain = buildQuestionQuizJsonLd(baseQuestion, "ja");
    expect(sameDomain.educationalAlignment).toEqual([
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: "AWS Certified Cloud Practitioner (CLF-C02)",
      },
    ]);
    expect(sameDomain.about).toEqual({
      "@type": "Thing",
      name: baseQuestion.category,
    });
    expect(sameDomain.assesses).toBe(baseQuestion.category);
    expect(sameDomain.learningResourceType).toBe("Practice problem");
    expect(sameDomain.datePublished).toBe(baseQuestion.createdAt);
    expect(sameDomain.dateModified).toBe(baseQuestion.updatedAt);

    const saa = buildQuestionJsonLdWith({
      exam: "SAA-C03",
      category: "Secure Architectures",
      domain: "Design Secure Architectures",
    });
    expect(saa.educationalAlignment).toEqual([
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: "AWS Certified Solutions Architect – Associate (SAA-C03)",
      },
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: "Design Secure Architectures",
      },
    ]);
  });
});

function buildQuestionJsonLdWith(
  overrides: Partial<Question>,
): Record<string, unknown> {
  return buildQuestionQuizJsonLd({ ...baseQuestion, ...overrides }, "ja");
}
