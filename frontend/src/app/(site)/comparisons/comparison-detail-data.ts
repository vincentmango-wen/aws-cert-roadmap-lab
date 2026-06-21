/**
 * comparison-detail-data.ts
 *
 * locale 別の比較記事メタ + ヘルパー集約 (SSoT).
 * terms の term-detail-data.ts と命名・配置を 1:1 で揃え、3 言語ページが
 * 同じ shape で薄いラッパーを書ける形にする。
 *
 * メタデータは frontend/contents/comparisons/comparisons.{ja,en,zh}.json を読み込む。
 * 本文は comparison-content-loader.ts 経由で MDX から取得する。
 */
import comparisonsEnData from "../../../../contents/comparisons/comparisons.en.json";
import comparisonsJaData from "../../../../contents/comparisons/comparisons.ja.json";
import comparisonsZhData from "../../../../contents/comparisons/comparisons.zh.json";
import type { PageMetadataInput } from "@/lib/seo";
import type {
  Comparison,
  ComparisonArticle,
  ComparisonLevel,
  ComparisonLocale,
  ComparisonPriority,
} from "@/types/comparison";
import {
  createLocalizedPath,
  type Pathname,
} from "@/i18n/locales";
import { loadComparisonContent } from "./comparison-content-loader";

export { createLocalizedPath } from "@/i18n/locales";

export type ComparisonStaticParams = {
  comparisonSlug: string;
};

export type ComparisonDetailLabels = {
  breadcrumbLabel: string;
  homeLabel: string;
  comparisonsLabel: string;
  backToComparisonsLabel: string;
  termsCtaLabel: string;
  questionsCtaLabel: string;
  comparisonTargetServicesTitle: string;
  comparisonTargetServicesDescription: string;
  nextLearningTitle: string;
  nextLearningDescription: string;
  relatedComparisonsTitle: string;
  publishedAtLabel: string;
  updatedAtLabel: string;
  unsetLabel: string;
  notFoundTitle: string;
  notFoundDescription: string;
  defaultDescription: string;
};

export const comparisonDetailLabelsByLocale: Record<
  ComparisonLocale,
  ComparisonDetailLabels
> = {
  ja: {
    breadcrumbLabel: "パンくず",
    homeLabel: "ホーム",
    comparisonsLabel: "比較",
    backToComparisonsLabel: "比較一覧へ戻る",
    termsCtaLabel: "AWS用語集を見る",
    questionsCtaLabel: "模擬問題を解く",
    comparisonTargetServicesTitle: "比較対象サービス",
    comparisonTargetServicesDescription:
      "サービス名をクリックすると、用語詳細ページで復習できます。",
    nextLearningTitle: "次に学ぶ内容",
    nextLearningDescription:
      "比較で違いを理解したら、関連用語と模擬問題で知識を確認してください。資格試験では「似ているサービスの使い分け」が問われます。",
    relatedComparisonsTitle: "関連比較",
    publishedAtLabel: "公開日",
    updatedAtLabel: "更新日",
    unsetLabel: "未設定",
    notFoundTitle: "比較記事が見つかりません",
    notFoundDescription: "指定されたAWSサービス比較記事は見つかりませんでした。",
    defaultDescription: "AWSサービスの違いを比較する記事です。",
  },
  en: {
    breadcrumbLabel: "Breadcrumb",
    homeLabel: "Home",
    comparisonsLabel: "Comparisons",
    backToComparisonsLabel: "Back to comparisons",
    termsCtaLabel: "View AWS glossary",
    questionsCtaLabel: "Go to practice questions",
    comparisonTargetServicesTitle: "Services compared",
    comparisonTargetServicesDescription:
      "Click a service name to review it on the term detail page.",
    nextLearningTitle: "What to learn next",
    nextLearningDescription:
      "After understanding the differences in this comparison, review related terms and practice questions. AWS exams often test how to choose between similar services.",
    relatedComparisonsTitle: "Related comparisons",
    publishedAtLabel: "Published",
    updatedAtLabel: "Updated",
    unsetLabel: "Not set",
    notFoundTitle: "Comparison article not found",
    notFoundDescription:
      "The specified AWS service comparison article was not found.",
    defaultDescription:
      "An article comparing differences between AWS services.",
  },
  zh: {
    breadcrumbLabel: "麵包屑",
    homeLabel: "首頁",
    comparisonsLabel: "比較",
    backToComparisonsLabel: "返回比較列表",
    termsCtaLabel: "查看 AWS 術語集",
    questionsCtaLabel: "前往模擬題",
    comparisonTargetServicesTitle: "比較對象服務",
    comparisonTargetServicesDescription:
      "點擊服務名稱可在術語詳細頁面複習。",
    nextLearningTitle: "接下來學習的內容",
    nextLearningDescription:
      "透過比較了解差異後,請使用相關術語與模擬題確認學習成效。AWS 認證考試經常測驗「相似服務的使用情境差異」。",
    relatedComparisonsTitle: "相關比較",
    publishedAtLabel: "發布日期",
    updatedAtLabel: "更新日期",
    unsetLabel: "未設定",
    notFoundTitle: "找不到比較文章",
    notFoundDescription: "找不到指定的 AWS 服務比較文章。",
    defaultDescription: "比較 AWS 服務差異的文章。",
  },
};

export const levelLabelsByLocale: Record<
  ComparisonLocale,
  Record<ComparisonLevel, string>
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

export const priorityLabelsByLocale: Record<
  ComparisonLocale,
  Record<ComparisonPriority, string>
> = {
  ja: {
    high: "優先度 高",
    medium: "優先度 中",
    low: "優先度 低",
  },
  en: {
    high: "Priority: high",
    medium: "Priority: medium",
    low: "Priority: low",
  },
  zh: {
    high: "優先度 高",
    medium: "優先度 中",
    low: "優先度 低",
  },
};

/**
 * 比較記事の category 表示ラベル (locale 別).
 *
 * key は comparisons.{ja,en,zh}.json 内の category 値 (英語固定: Storage / Database /
 * Networking / Security / Monitoring / Integration) を網羅する。anchor id
 * (#storage 等) は category.toLowerCase() で生成し、URL 安定性のため
 * locale 間で共通の英語 key を利用する (設計書 §4-4).
 */
export type ComparisonCategory =
  | "Storage"
  | "Database"
  | "Networking"
  | "Security"
  | "Monitoring"
  | "Integration";

export const categoryLabelsByLocale: Record<
  ComparisonLocale,
  Record<ComparisonCategory, string>
> = {
  ja: {
    Storage: "ストレージ",
    Database: "データベース",
    Networking: "ネットワーキング",
    Security: "セキュリティ",
    Monitoring: "監視",
    Integration: "統合",
  },
  en: {
    Storage: "Storage",
    Database: "Database",
    Networking: "Networking",
    Security: "Security",
    Monitoring: "Monitoring",
    Integration: "Integration",
  },
  zh: {
    Storage: "儲存",
    Database: "資料庫",
    Networking: "網路",
    Security: "安全",
    Monitoring: "監控",
    Integration: "整合",
  },
};

/**
 * 与えられた category が ComparisonCategory に含まれるかを判定するヘルパー.
 * 含まれれば locale 別ラベルを返し、そうでなければ category 値そのものを返す
 * (フォールバック / 将来の category 追加時の防御).
 */
export function formatCategoryLabel(
  locale: ComparisonLocale,
  category: string,
): string {
  const labels = categoryLabelsByLocale[locale];
  if (category in labels) {
    return labels[category as ComparisonCategory];
  }
  return category;
}

const comparisonsDataByLocale: Record<ComparisonLocale, Comparison[]> = {
  ja: comparisonsJaData as Comparison[],
  en: comparisonsEnData as Comparison[],
  zh: comparisonsZhData as Comparison[],
};

export function getComparisons(locale: ComparisonLocale): Comparison[] {
  return comparisonsDataByLocale[locale];
}

export function getPublishedComparisons(
  locale: ComparisonLocale,
): Comparison[] {
  return getComparisons(locale).filter((comparison) => comparison.published);
}

export function getComparisonMetaBySlug(
  locale: ComparisonLocale,
  slug: string,
): Comparison | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const found = getPublishedComparisons(locale).find(
    (comparison) => comparison.slug === slug,
  );

  return found ?? null;
}

/**
 * locale 別の比較記事 (メタ + 本文 MDX) を取得する。
 * 本文 MDX が存在しなければ空文字を入れる (build を落とさないフォールバック)。
 */
export function getComparisonBySlug(
  locale: ComparisonLocale,
  slug: string,
): ComparisonArticle | null {
  const meta = getComparisonMetaBySlug(locale, slug);

  if (!meta) {
    return null;
  }

  const content = loadComparisonContent(locale, slug, meta.title) ?? "";

  return {
    ...meta,
    content,
  };
}

export function getComparisonStaticParams(
  locale: ComparisonLocale,
): ComparisonStaticParams[] {
  return getPublishedComparisons(locale).map((comparison) => ({
    comparisonSlug: comparison.slug,
  }));
}

export function createComparisonPath(
  locale: ComparisonLocale,
  slug: string,
): Pathname {
  return createLocalizedPath(locale, `/comparisons/${slug}`);
}

export function createComparisonDetailMetadataInput(
  locale: ComparisonLocale,
  slug: string,
): PageMetadataInput {
  const labels = comparisonDetailLabelsByLocale[locale];
  const meta = getComparisonMetaBySlug(locale, slug);

  if (!meta) {
    return {
      title: labels.notFoundTitle,
      description: labels.notFoundDescription,
      path: createComparisonPath(locale, slug),
      noIndex: true,
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    path: createComparisonPath(locale, meta.slug),
    keywords: ["AWS", ...meta.services, ...meta.tags],
    type: "article",
    publishedTime: meta.publishedAt,
    modifiedTime: meta.updatedAt,
    locale,
  };
}
