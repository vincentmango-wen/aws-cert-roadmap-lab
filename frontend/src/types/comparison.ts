export type ComparisonLevel = "beginner" | "intermediate" | "advanced";

export type ComparisonPriority = "high" | "medium" | "low";

export type ComparisonExamScope = "CLF-C02" | "SAA-C03";

export type ComparisonLocale = "ja" | "en" | "zh";

export type Comparison = {
  comparisonId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: ComparisonLevel;
  examScopes: ComparisonExamScope[];
  services: string[];
  tags: string[];
  priority: ComparisonPriority;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  locale?: ComparisonLocale;
};

export type ComparisonArticle = Comparison & {
  content: string;
};
