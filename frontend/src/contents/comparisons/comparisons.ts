import type { Comparison } from "../../types/comparison";

export const comparisons: Comparison[] = [
  {
    comparisonId: "cmp-001",
    slug: "s3-vs-ebs-vs-efs",
    title: "S3・EBS・EFSの違い",
    description:
      "AWSの代表的なストレージサービスであるS3、EBS、EFSの違いを、保存方式・主な用途・試験ポイントから比較します。",
    category: "Storage",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["s3", "ebs", "efs"],
    tags: ["storage", "comparison", "clf", "saa"],
    priority: "high",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    comparisonId: "cmp-002",
    slug: "rds-vs-dynamodb",
    title: "RDS・DynamoDBの違い",
    description:
      "リレーショナルデータベースのRDSと、NoSQLデータベースのDynamoDBを、データ構造・スケーリング・コストの観点で比較します。",
    category: "Database",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["rds", "dynamodb"],
    tags: ["database", "comparison", "clf", "saa"],
    priority: "high",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    comparisonId: "cmp-003",
    slug: "sns-vs-sqs-vs-eventbridge",
    title: "SNS・SQS・EventBridgeの違い",
    description:
      "AWSの代表的な連携サービスであるSNS、SQS、EventBridgeを、通知・キュー・イベントルーティングの違いから整理します。",
    category: "Integration",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["sns", "sqs", "eventbridge"],
    tags: ["integration", "messaging", "comparison", "clf", "saa"],
    priority: "high",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    comparisonId: "cmp-004",
    slug: "iam-user-vs-role-vs-policy",
    title: "IAMユーザー・IAMロール・IAMポリシーの違い",
    description:
      "IAMユーザー、IAMロール、IAMポリシーの役割を整理し、AWS権限管理で何をどの場面で使うかを比較します。",
    category: "Security",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["iam"],
    tags: ["security", "iam", "comparison", "clf", "saa"],
    priority: "high",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    comparisonId: "cmp-005",
    slug: "cloudwatch-vs-cloudtrail-vs-config",
    title: "CloudWatch・CloudTrail・AWS Configの違い",
    description:
      "監視、操作履歴、リソース設定管理の違いを整理し、CloudWatch、CloudTrail、AWS Configの使い分けを比較します。",
    category: "Monitoring",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["cloudwatch", "cloudtrail", "config"],
    tags: ["monitoring", "governance", "comparison", "clf", "saa"],
    priority: "high",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
];

export const publishedComparisons = comparisons.filter(
  (comparison) => comparison.published,
);