import termsEnData from "../../../contents/terms/terms.en.json";
import termsJaData from "../../../contents/terms/terms.ja.json";
import termsZhData from "../../../contents/terms/terms.zh.json";
import type { PageMetadataInput } from "../../lib/seo";

export type TermDetailLocale = "ja" | "en" | "zh";

export type TermCategory =
  | "Compute"
  | "Storage"
  | "Database"
  | "Networking"
  | "Security"
  | "Monitoring"
  | "Integration"
  | "Analytics"
  | "Management";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type ExamScope = "CLF-C02" | "SAA-C03";

export type AwsTerm = {
  termId: string;
  name: string;
  shortName: string;
  category: TermCategory;
  level: DifficultyLevel;
  examScopes: ExamScope[];
  summary: string;
  oneLine: string;
  useCases: string[];
  examPoints: string[];
  saaPoints?: string[];
  relatedServices?: string[];
  comparisonSlugs?: string[];
  architectureSlugs?: string[];
  tags?: string[];
  costNotes?: string[];
  securityNotes?: string[];
  updatedAt: string;
  locale?: TermDetailLocale;
};

export type TermStaticParams = {
  termId: string;
};

export type TermDetailLabels = {
  breadcrumbLabel: string;
  homeLabel: string;
  termsLabel: string;
  backToTermsLabel: string;
  questionsCtaLabel: string;
  oneLineTitle: string;
  summaryTitle: string;
  useCasesTitle: string;
  clfPointsTitle: string;
  saaPointsTitle: string;
  costNotesTitle: string;
  securityNotesTitle: string;
  relatedServicesTitle: string;
  comparisonArticlesTitle: string;
  architectureArticlesTitle: string;
  tagsTitle: string;
  updatedAtLabel: string;
  noSaaPoints: string;
  noCostNotes: string;
  noSecurityNotes: string;
  noRelatedServices: string;
  noComparisonArticles: string;
  noArchitectureArticles: string;
  noTags: string;
  previousTermLabel: string;
  nextTermLabel: string;
  noPreviousTerm: string;
  noNextTerm: string;
  notFoundTitle: string;
  notFoundDescription: string;
  defaultDescription: (termName: string) => string;
  metadataTitle: (termName: string) => string;
};

export const termDetailLabelsByLocale: Record<
  TermDetailLocale,
  TermDetailLabels
> = {
  ja: {
    breadcrumbLabel: "パンくず",
    homeLabel: "ホーム",
    termsLabel: "用語集",
    backToTermsLabel: "用語一覧に戻る",
    questionsCtaLabel: "関連する模擬問題へ進む",
    oneLineTitle: "一言でいうと",
    summaryTitle: "概要",
    useCasesTitle: "主な用途",
    clfPointsTitle: "CLF-C02 試験ポイント",
    saaPointsTitle: "SAA-C03 試験ポイント",
    costNotesTitle: "コスト注意点",
    securityNotesTitle: "セキュリティ注意点",
    relatedServicesTitle: "関連サービス",
    comparisonArticlesTitle: "関連する比較記事",
    architectureArticlesTitle: "関連する構成図",
    tagsTitle: "タグ",
    updatedAtLabel: "最終更新日",
    noSaaPoints:
      "この用語には、まだSAA-C03向けポイントが登録されていません。",
    noCostNotes: "この用語には、まだコスト注意点が登録されていません。",
    noSecurityNotes:
      "この用語には、まだセキュリティ注意点が登録されていません。",
    noRelatedServices: "この用語には、まだ関連サービスが登録されていません。",
    noComparisonArticles:
      "この用語には、まだ関連比較記事が登録されていません。",
    noArchitectureArticles:
      "この用語には、まだ関連構成図が登録されていません。",
    noTags: "この用語には、まだタグが登録されていません。",
    previousTermLabel: "前の用語",
    nextTermLabel: "次の用語",
    noPreviousTerm: "前の用語はありません。",
    noNextTerm: "次の用語はありません。",
    notFoundTitle: "AWS用語が見つかりません",
    notFoundDescription:
      "指定されたAWS用語は見つかりませんでした。AWS用語集から主要サービスを確認できます。",
    defaultDescription: (termName) =>
      `${termName}の概要、用途、Cloud Practitioner / SAAの試験ポイントを初学者向けに解説します。`,
    metadataTitle: (termName) => `${termName}とは？`,
  },
  en: {
    breadcrumbLabel: "Breadcrumb",
    homeLabel: "Home",
    termsLabel: "Glossary",
    backToTermsLabel: "Back to glossary",
    questionsCtaLabel: "Go to related practice questions",
    oneLineTitle: "In one sentence",
    summaryTitle: "Overview",
    useCasesTitle: "Common use cases",
    clfPointsTitle: "CLF-C02 exam points",
    saaPointsTitle: "SAA-C03 exam points",
    costNotesTitle: "Cost notes",
    securityNotesTitle: "Security notes",
    relatedServicesTitle: "Related services",
    comparisonArticlesTitle: "Related comparison articles",
    architectureArticlesTitle: "Related architecture diagrams",
    tagsTitle: "Tags",
    updatedAtLabel: "Last updated",
    noSaaPoints: "SAA-C03 points have not been added for this term yet.",
    noCostNotes: "Cost notes have not been added for this term yet.",
    noSecurityNotes: "Security notes have not been added for this term yet.",
    noRelatedServices: "Related services have not been added for this term yet.",
    noComparisonArticles:
      "Related comparison articles have not been added for this term yet.",
    noArchitectureArticles:
      "Related architecture diagrams have not been added for this term yet.",
    noTags: "Tags have not been added for this term yet.",
    previousTermLabel: "Previous term",
    nextTermLabel: "Next term",
    noPreviousTerm: "There is no previous term.",
    noNextTerm: "There is no next term.",
    notFoundTitle: "AWS term not found",
    notFoundDescription:
      "The specified AWS term was not found. You can continue learning from the AWS glossary.",
    defaultDescription: (termName) =>
      `Learn the overview, use cases, and Cloud Practitioner / SAA exam points for ${termName}.`,
    metadataTitle: (termName) => `What is ${termName}?`,
  },
  zh: {
    breadcrumbLabel: "麵包屑",
    homeLabel: "首頁",
    termsLabel: "術語集",
    backToTermsLabel: "返回術語列表",
    questionsCtaLabel: "前往相關模擬題",
    oneLineTitle: "一句話說明",
    summaryTitle: "概要",
    useCasesTitle: "主要用途",
    clfPointsTitle: "CLF-C02 考試重點",
    saaPointsTitle: "SAA-C03 考試重點",
    costNotesTitle: "成本注意事項",
    securityNotesTitle: "安全性注意事項",
    relatedServicesTitle: "相關服務",
    comparisonArticlesTitle: "相關比較文章",
    architectureArticlesTitle: "相關架構圖",
    tagsTitle: "標籤",
    updatedAtLabel: "最後更新日",
    noSaaPoints: "此術語尚未登錄SAA-C03相關重點。",
    noCostNotes: "此術語尚未登錄成本注意事項。",
    noSecurityNotes: "此術語尚未登錄安全性注意事項。",
    noRelatedServices: "此術語尚未登錄相關服務。",
    noComparisonArticles: "此術語尚未登錄相關比較文章。",
    noArchitectureArticles: "此術語尚未登錄相關架構圖。",
    noTags: "此術語尚未登錄標籤。",
    previousTermLabel: "上一個術語",
    nextTermLabel: "下一個術語",
    noPreviousTerm: "沒有上一個術語。",
    noNextTerm: "沒有下一個術語。",
    notFoundTitle: "找不到AWS術語",
    notFoundDescription:
      "找不到指定的AWS術語。請從AWS術語集繼續確認主要服務。",
    defaultDescription: (termName) =>
      `說明${termName}的概要、用途，以及Cloud Practitioner / SAA考試重點。`,
    metadataTitle: (termName) => `${termName} 是什麼？`,
  },
};

export const levelLabelsByLocale: Record<
  TermDetailLocale,
  Record<DifficultyLevel, string>
> = {
  ja: {
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
  },
  en: {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  },
  zh: {
    beginner: "初級",
    intermediate: "中級",
    advanced: "進階",
  },
};

export const categoryLabelsByLocale: Record<
  TermDetailLocale,
  Record<TermCategory, string>
> = {
  ja: {
    Compute: "コンピューティング",
    Storage: "ストレージ",
    Database: "データベース",
    Networking: "ネットワーク",
    Security: "セキュリティ",
    Monitoring: "監視・ログ",
    Integration: "アプリケーション統合",
    Analytics: "分析",
    Management: "管理",
  },
  en: {
    Compute: "Compute",
    Storage: "Storage",
    Database: "Database",
    Networking: "Networking",
    Security: "Security",
    Monitoring: "Monitoring",
    Integration: "Application Integration",
    Analytics: "Analytics",
    Management: "Management",
  },
  zh: {
    Compute: "運算",
    Storage: "儲存",
    Database: "資料庫",
    Networking: "網路",
    Security: "安全性",
    Monitoring: "監控與日誌",
    Integration: "應用程式整合",
    Analytics: "分析",
    Management: "管理",
  },
};

const termsDataByLocale: Record<TermDetailLocale, AwsTerm[]> = {
  ja: termsJaData as AwsTerm[],
  en: termsEnData as AwsTerm[],
  zh: termsZhData as AwsTerm[],
};

export function getTerms(locale: TermDetailLocale): AwsTerm[] {
  return termsDataByLocale[locale];
}

export function getTermById(
  locale: TermDetailLocale,
  termId: string,
): AwsTerm | undefined {
  return getTerms(locale).find((term) => term.termId === termId);
}

export function getRelatedTerms(
  locale: TermDetailLocale,
  termIds: string[] | undefined,
): AwsTerm[] {
  if (!termIds || termIds.length === 0) {
    return [];
  }

  return termIds
    .map((termId) => getTermById(locale, termId))
    .filter((term): term is AwsTerm => term !== undefined);
}

export function getAdjacentTerms(
  locale: TermDetailLocale,
  currentTermId: string,
): {
  previousTerm: AwsTerm | undefined;
  nextTerm: AwsTerm | undefined;
} {
  const terms = getTerms(locale);
  const currentIndex = terms.findIndex((term) => term.termId === currentTermId);

  if (currentIndex === -1) {
    return {
      previousTerm: undefined,
      nextTerm: undefined,
    };
  }

  return {
    previousTerm: terms[currentIndex - 1],
    nextTerm: terms[currentIndex + 1],
  };
}

export function getTermStaticParams(
  locale: TermDetailLocale,
): TermStaticParams[] {
  return getTerms(locale).map((term) => ({
    termId: term.termId,
  }));
}

export function createLocalizedPath(
  locale: TermDetailLocale,
  path: "/" | `/${string}`,
): `/${string}` {
  if (locale === "ja") {
    return path;
  }

  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path}`;
}

export function createTermDetailPath(
  locale: TermDetailLocale,
  termId: string,
): `/${string}` {
  return createLocalizedPath(locale, `/terms/${termId}`);
}

export function formatSlugLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" / ");
}

export function createTermDetailMetadataInput(
  locale: TermDetailLocale,
  termId: string,
): PageMetadataInput {
  const labels = termDetailLabelsByLocale[locale];
  const term = getTermById(locale, termId);

  if (!term) {
    return {
      title: labels.notFoundTitle,
      description: labels.notFoundDescription,
      path: createTermDetailPath(locale, termId),
      noIndex: true,
    };
  }

  return {
    title: labels.metadataTitle(term.name),
    description:
      term.oneLine || term.summary || labels.defaultDescription(term.name),
    path: createTermDetailPath(locale, term.termId),
    keywords: [
      term.name,
      term.shortName,
      term.category,
      "AWS",
      "Cloud Practitioner",
      "SAA",
    ],
    modifiedTime: term.updatedAt,
  };
}