import type {
    Question,
    QuestionCategory,
    QuestionCategorySummary,
    QuestionDifficulty,
    QuestionDifficultySummary,
  } from "../types/question";
  
  export const QUESTION_CATEGORY_LABELS: Record<QuestionCategory, string> = {
    "Cloud Concepts": "クラウドの概念",
    "Security and Compliance": "セキュリティとコンプライアンス",
    "Cloud Technology and Services": "クラウド技術とサービス",
    "Billing, Pricing, and Support": "請求・料金・サポート",
  };
  
  export const QUESTION_CATEGORY_DESCRIPTIONS: Record<QuestionCategory, string> = {
    "Cloud Concepts":
      "クラウドの価値、責任共有モデル、スケーラビリティ、可用性などを確認します。",
    "Security and Compliance":
      "IAM、責任共有モデル、暗号化、コンプライアンス、セキュリティサービスを確認します。",
    "Cloud Technology and Services":
      "EC2、S3、Lambda、RDS、DynamoDB、VPCなど主要AWSサービスを確認します。",
    "Billing, Pricing, and Support":
      "AWS料金、無料枠、Budgets、Cost Explorer、サポートプランを確認します。",
  };
  
  export const QUESTION_DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
    easy: "初級",
    normal: "標準",
    hard: "やや難しい",
  };
  
  export const QUESTION_CATEGORIES: QuestionCategory[] = [
    "Cloud Concepts",
    "Security and Compliance",
    "Cloud Technology and Services",
    "Billing, Pricing, and Support",
  ];
  
  export const QUESTION_DIFFICULTIES: QuestionDifficulty[] = [
    "easy",
    "normal",
    "hard",
  ];
  
  export function getPublishedQuestions(questions: Question[]): Question[] {
    return questions.filter((question) => question.published);
  }
  
  export function getQuestionCategorySummaries(
    questions: Question[],
  ): QuestionCategorySummary[] {
    return QUESTION_CATEGORIES.map((category) => {
      const count = questions.filter(
        (question) => question.category === category,
      ).length;
  
      return {
        category,
        label: QUESTION_CATEGORY_LABELS[category],
        description: QUESTION_CATEGORY_DESCRIPTIONS[category],
        count,
      };
    });
  }
  
  export function getQuestionDifficultySummaries(
    questions: Question[],
  ): QuestionDifficultySummary[] {
    return QUESTION_DIFFICULTIES.map((difficulty) => {
      const count = questions.filter(
        (question) => question.difficulty === difficulty,
      ).length;
  
      return {
        difficulty,
        label: QUESTION_DIFFICULTY_LABELS[difficulty],
        count,
      };
    });
  }
  
  export function getBeginnerRecommendedQuestions(
    questions: Question[],
    limit: number,
  ): Question[] {
    return questions
      .filter((question) => question.difficulty === "easy")
      .slice(0, limit);
  }
  
  export function formatRelatedServices(relatedServices?: string[]): string {
    if (!relatedServices || relatedServices.length === 0) {
      return "関連サービスなし";
    }
  
    return relatedServices.join(" / ").toUpperCase();
  }