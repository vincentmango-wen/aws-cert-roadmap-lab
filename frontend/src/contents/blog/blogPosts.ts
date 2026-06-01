import type { BlogPostMeta } from "../../types/blog";

export const blogPosts: BlogPostMeta[] = [
  {
    postId: "blog-001",
    slug: "aws-cloud-practitioner-roadmap",
    title: "AWS Cloud Practitionerの学習ロードマップ",
    description:
      "AWS Cloud Practitionerをこれから学ぶ初学者向けに、試験範囲、学習順序、最初に押さえるAWSサービスを整理します。",
    category: "CLF",
    tags: ["CLF-C02", "AWS資格", "ロードマップ", "初心者"],
    targetKeywords: [
      "AWS Cloud Practitioner",
      "CLF-C02",
      "AWS資格 勉強方法",
    ],
    author: "AWS資格ロードマップラボ",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    postId: "blog-002",
    slug: "aws-free-tier-portfolio",
    title: "AWS無料枠でポートフォリオを作る方法",
    description:
      "個人開発でAWSポートフォリオを作るときに、無料枠と低コスト構成を使って課金リスクを抑える考え方を解説します。",
    category: "無料枠",
    tags: ["AWS無料枠", "S3", "CloudFront", "Budgets", "ポートフォリオ"],
    targetKeywords: [
      "AWS 無料枠",
      "AWS ポートフォリオ",
      "AWS 個人開発",
    ],
    author: "AWS資格ロードマップラボ",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    postId: "blog-003",
    slug: "lambda-api-gateway-beginner",
    title: "LambdaとAPI Gatewayを初心者向けに解説",
    description:
      "サーバーレスAPIの基本であるAWS LambdaとAmazon API Gatewayの役割、使い分け、資格試験で問われるポイントを整理します。",
    category: "サーバーレス",
    tags: ["Lambda", "API Gateway", "サーバーレス", "HTTP API"],
    targetKeywords: [
      "Lambda 初心者",
      "API Gateway 初心者",
      "サーバーレス API",
    ],
    author: "AWS資格ロードマップラボ",
    published: true,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    postId: "blog-004",
    slug: "s3-cloudfront-static-site",
    title: "S3とCloudFrontで静的サイトを公開する基本構成",
    description:
      "Amazon S3に配置した静的ファイルをCloudFrontで安全に配信する構成を、初学者向けに図解前提で説明します。",
    category: "ポートフォリオ",
    tags: ["S3", "CloudFront", "OAC", "静的サイト", "HTTPS"],
    targetKeywords: [
      "S3 CloudFront 静的サイト",
      "CloudFront OAC",
      "AWS 静的サイト",
    ],
    author: "AWS資格ロードマップラボ",
    published: true,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    postId: "blog-005",
    slug: "dynamodb-vs-rds-beginner",
    title: "DynamoDBとRDSの違い",
    description:
      "Amazon DynamoDBとAmazon RDSの違いを、データ構造、料金、運用、使い分け、AWS資格試験で問われる観点から初心者向けに解説します。",
    category: "AWS Services",
    tags: ["DynamoDB", "RDS", "Database", "比較", "初心者"],
    targetKeywords: [
      "DynamoDB RDS 違い",
      "AWS データベース 比較",
      "DynamoDB 初心者",
    ],
    author: "AWS資格ロードマップラボ",
    published: true,
    publishedAt: "2026-06-03",
    updatedAt: "2026-06-03",
  },
];