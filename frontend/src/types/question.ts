export type ExamCode = "CLF-C02" | "SAA-C03";

export type QuestionDifficulty = "easy" | "normal" | "hard";

export type QuestionCategory =
  | "Cloud Concepts"
  | "Security and Compliance"
  | "Cloud Technology and Services"
  | "Billing, Pricing, and Support";

export type ChoiceId = "A" | "B" | "C" | "D";

export type QuestionChoice = {
  choiceId: ChoiceId;
  text: string;
};

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