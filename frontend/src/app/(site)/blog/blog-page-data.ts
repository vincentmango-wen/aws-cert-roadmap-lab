/**
 * blog-page-data.ts
 *
 * 一覧ページ用の locale 別ラベル + データ提供 (SSoT).
 * architectures の architectures-page-data.ts と命名・配置を 1:1 で揃える。
 */
import type { PageMetadataInput } from "@/lib/seo";
import type { BlogPostMeta } from "@/types/blog";
import type { Locale } from "@/i18n/locales";
import { getPublishedBlogPosts } from "./blog-detail-data";

export type BlogListLabels = {
  breadcrumbAriaLabel: string;
  homeLabel: string;
  blogLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  publishedCountLabel: string;
  clfTitle: string;
  clfDescription: string;
  saaTitle: string;
  saaDescription: string;
  latestSectionTitle: string;
  latestSectionDescription: string;
  emptyTitle: string;
  emptyDescription: string;
  readArticleLabel: string;
  introTitle: string;
  introBody: string;
  roadmapCtaLabel: string;
  termsCtaLabel: string;
  questionsCtaLabel: string;
};

export const blogPageLabelsByLocale: Record<Locale, BlogListLabels> = {
  ja: {
    breadcrumbAriaLabel: "パンくず",
    homeLabel: "ホーム",
    blogLabel: "ブログ",
    heroEyebrow: "AWS Learning Blog",
    heroTitle: "AWS学習ブログ",
    heroDescription:
      "AWS資格、サーバーレス、無料枠ポートフォリオに関する記事をまとめています。Cloud Practitionerの基礎から、SAAにつながる構成図・設計パターンまで、初学者が実装と試験対策をつなげて理解できる内容を掲載します。",
    publishedCountLabel: "公開記事",
    clfTitle: "CLF",
    clfDescription: "Cloud Practitioner対策",
    saaTitle: "SAA",
    saaDescription: "構成図・設計パターン",
    latestSectionTitle: "最新記事",
    latestSectionDescription:
      "AWS資格学習とポートフォリオ実装に役立つ記事を掲載しています。",
    emptyTitle: "公開記事がありません",
    emptyDescription: "`published: true` の記事を追加してください。",
    readArticleLabel: "記事を読む →",
    introTitle: "まずはAWSの全体像から学びたい方へ",
    introBody:
      "ブログ記事とあわせて、AWS用語集、サービス比較、模擬問題、構成図を順番に見ると、資格知識と実装イメージをつなげて理解できます。",
    roadmapCtaLabel: "学習ロードマップを見る",
    termsCtaLabel: "AWS用語集を見る",
    questionsCtaLabel: "模擬問題を解く",
  },
  en: {
    breadcrumbAriaLabel: "Breadcrumb",
    homeLabel: "Home",
    blogLabel: "Blog",
    heroEyebrow: "AWS Learning Blog",
    heroTitle: "AWS Learning Blog",
    heroDescription:
      "Posts on AWS certifications, serverless, and free-tier portfolios. From Cloud Practitioner basics to SAA-bound architectures and design patterns — written to help learners connect implementation with exam preparation.",
    publishedCountLabel: "Published articles",
    clfTitle: "CLF",
    clfDescription: "Cloud Practitioner prep",
    saaTitle: "SAA",
    saaDescription: "Architectures & design patterns",
    latestSectionTitle: "Latest articles",
    latestSectionDescription:
      "Articles to help with AWS certification study and portfolio implementation.",
    emptyTitle: "No published articles yet",
    emptyDescription: "Add an article with `published: true`.",
    readArticleLabel: "Read article →",
    introTitle: "Want to start from the AWS big picture?",
    introBody:
      "Read these in order — blog posts, AWS glossary, service comparisons, practice questions, and architecture gallery — to connect exam knowledge with implementation.",
    roadmapCtaLabel: "View the learning roadmap",
    termsCtaLabel: "View AWS glossary",
    questionsCtaLabel: "Go to practice questions",
  },
  zh: {
    breadcrumbAriaLabel: "麵包屑",
    homeLabel: "首頁",
    blogLabel: "部落格",
    heroEyebrow: "AWS Learning Blog",
    heroTitle: "AWS 學習部落格",
    heroDescription:
      "整理 AWS 認證、無伺服器、免費方案作品集相關文章。從 Cloud Practitioner 基礎到通往 SAA 的架構圖與設計模式,協助初學者把實作與考試準備連結起來理解。",
    publishedCountLabel: "已發布文章",
    clfTitle: "CLF",
    clfDescription: "Cloud Practitioner 對策",
    saaTitle: "SAA",
    saaDescription: "架構圖與設計模式",
    latestSectionTitle: "最新文章",
    latestSectionDescription:
      "刊載對 AWS 認證學習與作品集實作有幫助的文章。",
    emptyTitle: "尚無已發布的文章",
    emptyDescription: "請新增 `published: true` 的文章。",
    readArticleLabel: "閱讀文章 →",
    introTitle: "想先從 AWS 整體圖開始學習?",
    introBody:
      "把部落格文章與 AWS 術語集、服務比較、模擬題、架構圖依序看過,可以把考試知識和實作體驗連結起來理解。",
    roadmapCtaLabel: "查看學習路線圖",
    termsCtaLabel: "查看 AWS 術語集",
    questionsCtaLabel: "前往模擬題",
  },
};

export const blogPageMetadataByLocale: Record<Locale, PageMetadataInput> = {
  ja: {
    title: "AWS学習ブログ",
    description:
      "AWS資格、サーバーレス、無料枠ポートフォリオに関する記事をまとめた AWS学習ブログです。",
    path: "/blog",
    keywords: ["AWS", "AWS資格", "AWSブログ", "Cloud Practitioner", "SAA"],
  },
  en: {
    title: "AWS Learning Blog",
    description:
      "Articles on AWS certifications, serverless, and free-tier portfolios.",
    path: "/en/blog",
    keywords: [
      "AWS",
      "AWS Certification",
      "AWS Blog",
      "Cloud Practitioner",
      "SAA",
    ],
  },
  zh: {
    title: "AWS 學習部落格",
    description:
      "AWS 認證、無伺服器、免費方案作品集相關文章整理的 AWS 學習部落格。",
    path: "/zh/blog",
    keywords: ["AWS", "AWS 認證", "AWS 部落格", "Cloud Practitioner", "SAA"],
  },
};

export type BlogPageData = {
  locale: Locale;
  labels: BlogListLabels;
  posts: BlogPostMeta[];
};

export function getBlogPageData(locale: Locale): BlogPageData {
  return {
    locale,
    labels: blogPageLabelsByLocale[locale],
    posts: getPublishedBlogPosts(locale),
  };
}
