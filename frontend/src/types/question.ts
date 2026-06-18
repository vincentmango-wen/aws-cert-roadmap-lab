export type ExamCode = "CLF-C02" | "SAA-C03";

export type QuestionDifficulty = "easy" | "normal" | "hard";

export type QuestionCategory =
  | "Cloud Concepts"
  | "Security and Compliance"
  | "Cloud Technology and Services"
  | "Billing, Pricing, and Support"
  | "Secure Architectures"
  | "Resilient Architectures"
  | "High-Performing Architectures"
  | "Cost-Optimized Architectures";

export type ChoiceId = "A" | "B" | "C" | "D";

export type QuestionChoice = {
  choiceId: ChoiceId;
  text: string;
};

import type { OfficialDoc } from "@/types/official-doc";
export type { OfficialDoc };

export type Question = {
  questionId: string;
  exam: ExamCode;
  category: QuestionCategory;
  domain: string;
  difficulty: QuestionDifficulty;
  question: string;
  choices: QuestionChoice[];
  correctChoiceId: ChoiceId;
  explanation: string;
  choiceExplanations?: Partial<Record<ChoiceId, string>>;
  /** 客観的な実務での使いどころ・よくある誤解を記述する枠（体験談・一人称感想は入れない）。\n\n 区切りで複数段落。 */
  practicalNote?: string;
  /** 公式ドキュメントへの外部リンク配列。空または未定義の場合はセクション非表示。 */
  officialDocs?: OfficialDoc[];
  relatedServices?: string[];
  relatedTerms?: string[];
  relatedComparisons?: string[];
  tags?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionCategorySummary = {
  category: QuestionCategory;
  label: string;
  description: string;
  count: number;
};

export type QuestionDifficultySummary = {
  difficulty: QuestionDifficulty;
  label: string;
  count: number;
};