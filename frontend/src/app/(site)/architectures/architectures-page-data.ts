/**
 * architectures-page-data.ts
 *
 * 一覧ページ用の locale 別ラベル + データ提供 (SSoT).
 * comparisons の comparisons-page-data.ts と命名・配置を 1:1 で揃える。
 */
import type { PageMetadataInput } from "@/lib/seo";
import type {
  Architecture,
  ArchitectureCategory,
  ArchitectureLocale,
} from "@/types/architecture";
import {
  architectureCategoryLabelsByLocale,
  architectureDetailLabelsByLocale,
  getPublishedArchitectures,
  levelLabelsByLocale,
} from "./architecture-detail-data";

export type ArchitecturesListLabels = {
  metadataTitle: string;
  metadataDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  termsCta: string;
  questionsCta: string;
  publishedLabel: string;
  examScopeLabel: string;
  themeLabel: string;
  publishedCount: string;
  examScopeValue: string;
  themeValue: string;
  categoriesTitle: string;
  targetServicesLabel: string;
  examPointsTagsLabel: string;
  detailLinkLabel: string;
  pointsTitle: string;
  pointAvailabilityTitle: string;
  pointAvailabilityBody: string;
  pointFaultToleranceTitle: string;
  pointFaultToleranceBody: string;
  pointCostTitle: string;
  pointCostBody: string;
  pointSecurityTitle: string;
  pointSecurityBody: string;
  levelLabels: Record<Architecture["level"], string>;
  categoryLabels: Record<ArchitectureCategory, string>;
};

export const architecturesPageLabelsByLocale: Record<
  ArchitectureLocale,
  ArchitecturesListLabels
> = {
  ja: {
    metadataTitle: "AWS構成図ギャラリー",
    metadataDescription:
      "S3 + CloudFront、API Gateway + Lambda + DynamoDB、3層Webアプリなど、SAA対策に役立つAWS構成図を解説します。",
    heroEyebrow: "Architecture",
    heroTitle: "AWS構成図ギャラリー",
    heroDescription:
      "SAAで理解したいAWS構成パターンを、使用サービス・設計ポイント・試験観点で整理します。サービス単体の暗記ではなく、構成としてAWSを理解するための入口です。",
    termsCta: "用語集を見る",
    questionsCta: "模擬問題を解く",
    publishedLabel: "掲載構成",
    examScopeLabel: "対象試験",
    themeLabel: "学習テーマ",
    publishedCount: "件",
    examScopeValue: "CLF / SAA",
    themeValue: "設計理解",
    categoriesTitle: "カテゴリ",
    targetServicesLabel: "使用AWSサービス",
    examPointsTagsLabel: "試験ポイントタグ",
    detailLinkLabel: "詳細を見る",
    pointsTitle: "構成図で見るポイント",
    pointAvailabilityTitle: "可用性",
    pointAvailabilityBody:
      "障害時もサービスを継続しやすい構成かを確認します。",
    pointFaultToleranceTitle: "耐障害性",
    pointFaultToleranceBody:
      "単一障害点を減らす設計になっているかを確認します。",
    pointCostTitle: "コスト",
    pointCostBody: "固定費と従量課金の違いを意識して構成を見ます。",
    pointSecurityTitle: "セキュリティ",
    pointSecurityBody:
      "公開範囲、IAM、ネットワーク分離、暗号化を確認します。",
    levelLabels: levelLabelsByLocale.ja,
    categoryLabels: architectureCategoryLabelsByLocale.ja,
  },
  en: {
    metadataTitle: "AWS Architecture Gallery",
    metadataDescription:
      "AWS architecture patterns helpful for the SAA exam — S3 + CloudFront static sites, API Gateway + Lambda + DynamoDB serverless APIs, three-tier web apps, and more.",
    heroEyebrow: "Architecture",
    heroTitle: "AWS Architecture Gallery",
    heroDescription:
      "Organize AWS architecture patterns for the SAA exam by services used, design points, and exam perspective. Built to help you understand AWS as architecture, not as a list of services to memorize.",
    termsCta: "View glossary",
    questionsCta: "Go to practice questions",
    publishedLabel: "Architectures",
    examScopeLabel: "Exam scope",
    themeLabel: "Learning theme",
    publishedCount: "",
    examScopeValue: "CLF / SAA",
    themeValue: "Design",
    categoriesTitle: "Categories",
    targetServicesLabel: "AWS services used",
    examPointsTagsLabel: "Exam point tags",
    detailLinkLabel: "View details",
    pointsTitle: "What to look for in architecture diagrams",
    pointAvailabilityTitle: "Availability",
    pointAvailabilityBody:
      "Check whether the design keeps the service running through failures.",
    pointFaultToleranceTitle: "Fault tolerance",
    pointFaultToleranceBody:
      "Check whether the design reduces single points of failure.",
    pointCostTitle: "Cost",
    pointCostBody:
      "Look at the architecture with fixed costs vs. usage-based pricing in mind.",
    pointSecurityTitle: "Security",
    pointSecurityBody:
      "Check exposure, IAM, network isolation, and encryption.",
    levelLabels: levelLabelsByLocale.en,
    categoryLabels: architectureCategoryLabelsByLocale.en,
  },
  zh: {
    metadataTitle: "AWS 架構圖集",
    metadataDescription:
      "S3 + CloudFront、API Gateway + Lambda + DynamoDB、三層 Web 應用程式等對 SAA 認證考試有幫助的 AWS 架構圖解說。",
    heroEyebrow: "Architecture",
    heroTitle: "AWS 架構圖集",
    heroDescription:
      "從使用服務、設計重點、考試觀點整理 SAA 認證考試需要理解的 AWS 架構模式。目標是「以架構模式理解 AWS」,而非單純記憶個別服務。",
    termsCta: "查看術語集",
    questionsCta: "前往模擬題",
    publishedLabel: "收錄架構",
    examScopeLabel: "對應考試",
    themeLabel: "學習主題",
    publishedCount: " 件",
    examScopeValue: "CLF / SAA",
    themeValue: "設計理解",
    categoriesTitle: "分類",
    targetServicesLabel: "使用的 AWS 服務",
    examPointsTagsLabel: "考試重點標籤",
    detailLinkLabel: "查看詳細",
    pointsTitle: "閱讀架構圖的觀點",
    pointAvailabilityTitle: "可用性",
    pointAvailabilityBody:
      "確認在故障時是否仍能持續提供服務的設計。",
    pointFaultToleranceTitle: "容錯性",
    pointFaultToleranceBody:
      "確認設計是否減少單點故障。",
    pointCostTitle: "成本",
    pointCostBody:
      "從固定費用與用量計費的差異閱讀架構。",
    pointSecurityTitle: "安全性",
    pointSecurityBody:
      "確認公開範圍、IAM、網路隔離與加密。",
    levelLabels: levelLabelsByLocale.zh,
    categoryLabels: architectureCategoryLabelsByLocale.zh,
  },
};

export const architecturesPageMetadataByLocale: Record<
  ArchitectureLocale,
  PageMetadataInput
> = {
  ja: {
    title: architecturesPageLabelsByLocale.ja.metadataTitle,
    description: architecturesPageLabelsByLocale.ja.metadataDescription,
    path: "/architectures",
    keywords: ["AWS 構成図", "SAA", "サーバーレス", "CloudFront"],
  },
  en: {
    title: architecturesPageLabelsByLocale.en.metadataTitle,
    description: architecturesPageLabelsByLocale.en.metadataDescription,
    path: "/en/architectures",
    keywords: [
      "AWS architecture",
      "SAA",
      "Serverless",
      "CloudFront",
      "Cloud Practitioner",
    ],
  },
  zh: {
    title: architecturesPageLabelsByLocale.zh.metadataTitle,
    description: architecturesPageLabelsByLocale.zh.metadataDescription,
    path: "/zh/architectures",
    keywords: ["AWS 架構", "SAA", "Serverless", "CloudFront"],
  },
};

export type ArchitecturesPageData = {
  locale: ArchitectureLocale;
  labels: ArchitecturesListLabels;
  detailLabels: typeof architectureDetailLabelsByLocale.ja;
  architectures: Architecture[];
  categories: string[];
};

export function getArchitecturesPageData(
  locale: ArchitectureLocale,
): ArchitecturesPageData {
  const architectures = getPublishedArchitectures(locale);
  const categories = Array.from(
    new Set(architectures.map((architecture) => architecture.category)),
  );

  return {
    locale,
    labels: architecturesPageLabelsByLocale[locale],
    detailLabels: architectureDetailLabelsByLocale[locale],
    architectures,
    categories,
  };
}
