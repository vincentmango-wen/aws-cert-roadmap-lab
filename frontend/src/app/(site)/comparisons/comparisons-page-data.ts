/**
 * comparisons-page-data.ts
 *
 * 一覧ページ用の locale 別ラベル + データ提供 (SSoT).
 * terms の terms-page-data.ts と命名・配置を 1:1 で揃える。
 */
import type { PageMetadataInput } from "@/lib/seo";
import type {
  Comparison,
  ComparisonLocale,
  ComparisonPriority,
} from "@/types/comparison";
import {
  categoryLabelsByLocale,
  comparisonDetailLabelsByLocale,
  type ComparisonCategory,
  getPublishedComparisons,
  levelLabelsByLocale,
  priorityLabelsByLocale,
} from "./comparison-detail-data";

export type ComparisonsListLabels = {
  metadataTitle: string;
  metadataDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  termsCta: string;
  questionsCta: string;
  recommendedSectionTitle: string;
  recommendedSectionDescription: string;
  publishedCountPrefix: string;
  publishedCountSuffix: string;
  categoriesTitle: string;
  categoryDescription: (categoryLabel: string) => string;
  targetServicesLabel: string;
  detailLinkLabel: string;
  usageTitle: string;
  usageStep1Title: string;
  usageStep1Body: string;
  usageStep2Title: string;
  usageStep2Body: string;
  usageStep3Title: string;
  usageStep3Body: string;
  usageCtaLabel: string;
  levelLabels: Record<Comparison["level"], string>;
  priorityLabels: Record<ComparisonPriority, string>;
  categoryLabels: Record<ComparisonCategory, string>;
};

export const comparisonsPageLabelsByLocale: Record<
  ComparisonLocale,
  ComparisonsListLabels
> = {
  ja: {
    metadataTitle: "AWSサービス比較",
    metadataDescription:
      "AWS資格試験で混同しやすいS3、EBS、EFS、RDS、DynamoDB、SNS、SQS、EventBridgeなどの違いを比較して学べるページです。",
    heroEyebrow: "AWS Service Comparisons",
    heroTitle: "AWSサービス比較",
    heroDescription:
      "AWS資格試験で混同しやすいサービスを、用途・試験ポイント・実務での使い分けから整理します。単体の暗記ではなく、「どの場面でどのサービスを選ぶか」を理解するためのページです。",
    termsCta: "用語集を見る",
    questionsCta: "模擬問題を解く",
    recommendedSectionTitle: "おすすめ比較",
    recommendedSectionDescription: "初学者が最初に読んでおきたい比較です。",
    publishedCountPrefix: "公開中:",
    publishedCountSuffix: "件",
    categoriesTitle: "カテゴリ",
    categoryDescription: (categoryLabel) =>
      `${categoryLabel}カテゴリで混同しやすいAWSサービスを比較します。`,
    targetServicesLabel: "対象サービス",
    detailLinkLabel: "詳細を見る →",
    usageTitle: "比較ページの使い方",
    usageStep1Title: "1. 用語を確認する",
    usageStep1Body: "まずは各AWSサービスの概要を用語集で確認します。",
    usageStep2Title: "2. 違いを比較する",
    usageStep2Body:
      "似ているサービスの違いを、用途・試験ポイント・設計観点で整理します。",
    usageStep3Title: "3. 問題で確認する",
    usageStep3Body:
      "最後に模擬問題を解いて、サービスの使い分けを確認します。",
    usageCtaLabel: "模擬問題へ進む",
    levelLabels: levelLabelsByLocale.ja,
    priorityLabels: priorityLabelsByLocale.ja,
    categoryLabels: categoryLabelsByLocale.ja,
  },
  en: {
    metadataTitle: "AWS Service Comparisons",
    metadataDescription:
      "Compare AWS services that are easily confused on certification exams — S3, EBS, EFS, RDS, DynamoDB, SNS, SQS, EventBridge, and more.",
    heroEyebrow: "AWS Service Comparisons",
    heroTitle: "AWS Service Comparisons",
    heroDescription:
      "Organize AWS services that are easily confused on certification exams by use case, exam points, and practical differentiators. Built to help you decide which service to choose in which situation, not just memorize names.",
    termsCta: "View glossary",
    questionsCta: "Go to practice questions",
    recommendedSectionTitle: "Recommended comparisons",
    recommendedSectionDescription:
      "Start with these comparisons if you are new to AWS.",
    publishedCountPrefix: "Published:",
    publishedCountSuffix: " articles",
    categoriesTitle: "Categories",
    categoryDescription: (categoryLabel) =>
      `Compare AWS services in the ${categoryLabel} category that are easily confused.`,
    targetServicesLabel: "Services covered",
    detailLinkLabel: "View details →",
    usageTitle: "How to use this comparison page",
    usageStep1Title: "1. Review the terms",
    usageStep1Body:
      "Start by reviewing each AWS service in the glossary.",
    usageStep2Title: "2. Compare the differences",
    usageStep2Body:
      "Organize the differences between similar services by use case, exam points, and design perspective.",
    usageStep3Title: "3. Confirm with practice questions",
    usageStep3Body:
      "Finally, solve practice questions to confirm how to choose between services.",
    usageCtaLabel: "Go to practice questions",
    levelLabels: levelLabelsByLocale.en,
    priorityLabels: priorityLabelsByLocale.en,
    categoryLabels: categoryLabelsByLocale.en,
  },
  zh: {
    metadataTitle: "AWS 服務比較",
    metadataDescription:
      "比較 AWS 認證考試中容易混淆的 S3、EBS、EFS、RDS、DynamoDB、SNS、SQS、EventBridge 等服務的差異。",
    heroEyebrow: "AWS Service Comparisons",
    heroTitle: "AWS 服務比較",
    heroDescription:
      "從用途、考試重點與實務使用情境的角度,整理 AWS 認證考試中容易混淆的服務。目標是建立「在什麼情境下選擇哪個服務」的判斷力,而非單純記憶服務名稱。",
    termsCta: "查看術語集",
    questionsCta: "前往模擬題",
    recommendedSectionTitle: "推薦比較",
    recommendedSectionDescription:
      "初學者建議先閱讀的比較文章。",
    publishedCountPrefix: "已發布:",
    publishedCountSuffix: " 篇",
    categoriesTitle: "分類",
    categoryDescription: (categoryLabel) =>
      `比較 ${categoryLabel} 分類中容易混淆的 AWS 服務。`,
    targetServicesLabel: "涵蓋服務",
    detailLinkLabel: "查看詳細 →",
    usageTitle: "比較頁面使用方式",
    usageStep1Title: "1. 確認術語",
    usageStep1Body: "首先在術語集中確認各 AWS 服務的概要。",
    usageStep2Title: "2. 比較差異",
    usageStep2Body:
      "從用途、考試重點、設計觀點整理相似服務之間的差異。",
    usageStep3Title: "3. 透過題目確認",
    usageStep3Body:
      "最後解模擬題,確認服務的使用情境。",
    usageCtaLabel: "前往模擬題",
    levelLabels: levelLabelsByLocale.zh,
    priorityLabels: priorityLabelsByLocale.zh,
    categoryLabels: categoryLabelsByLocale.zh,
  },
};

export const comparisonsPageMetadataByLocale: Record<
  ComparisonLocale,
  PageMetadataInput
> = {
  ja: {
    title: comparisonsPageLabelsByLocale.ja.metadataTitle,
    description: comparisonsPageLabelsByLocale.ja.metadataDescription,
    path: "/comparisons",
    keywords: [
      "AWS",
      "AWS比較",
      "AWSサービス",
      "Cloud Practitioner",
      "SAA",
    ],
  },
  en: {
    title: comparisonsPageLabelsByLocale.en.metadataTitle,
    description: comparisonsPageLabelsByLocale.en.metadataDescription,
    path: "/en/comparisons",
    keywords: [
      "AWS",
      "AWS comparison",
      "AWS services",
      "Cloud Practitioner",
      "Solutions Architect Associate",
    ],
  },
  zh: {
    title: comparisonsPageLabelsByLocale.zh.metadataTitle,
    description: comparisonsPageLabelsByLocale.zh.metadataDescription,
    path: "/zh/comparisons",
    keywords: ["AWS", "AWS 比較", "AWS 服務", "Cloud Practitioner", "SAA"],
  },
};

const priorityOrder: Record<ComparisonPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

export type ComparisonsPageData = {
  locale: ComparisonLocale;
  labels: ComparisonsListLabels;
  detailLabels: typeof comparisonDetailLabelsByLocale.ja;
  comparisons: Comparison[];
  recommendedComparisons: Comparison[];
  categories: string[];
};

export function getComparisonsPageData(
  locale: ComparisonLocale,
): ComparisonsPageData {
  const sorted = [...getPublishedComparisons(locale)].sort((first, second) => {
    const priorityDiff =
      priorityOrder[first.priority] - priorityOrder[second.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return first.title.localeCompare(second.title, locale === "zh" ? "zh-Hant" : locale);
  });

  const categories = Array.from(
    new Set(sorted.map((comparison) => comparison.category)),
  );

  const recommendedComparisons = sorted
    .filter((comparison) => comparison.priority === "high")
    .slice(0, 3);

  return {
    locale,
    labels: comparisonsPageLabelsByLocale[locale],
    detailLabels: comparisonDetailLabelsByLocale[locale],
    comparisons: sorted,
    recommendedComparisons,
    categories,
  };
}
