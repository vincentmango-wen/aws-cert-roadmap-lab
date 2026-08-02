export type ArchitectureLevel = "beginner" | "intermediate" | "advanced";

export type ExamScope = "CLF-C02" | "SAA-C03";

export type ArchitectureLocale = "ja" | "en" | "zh";

export type ArchitectureCategory =
  | "Static Hosting"
  | "Serverless"
  | "Three Tier"
  | "High Availability"
  | "Batch"
  | "Networking"
  | "Integration"
  | "Container"
  | "Monitoring";

export type ArchitectureSection = {
  title: string;
  body: string;
};

export type ArchitectureMeta = {
  architectureId: string;
  slug: string;
  title: string;
  description: string;
  category: ArchitectureCategory;
  level: ArchitectureLevel;
  examScopes: ExamScope[];
  services: string[];
  tags: string[];
  diagramPath?: string;
  mermaid: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  /**
   * 旧 architectures.ts 由来の inline 本文 (sections[]). 本文 SSoT は MDX に移管したため、
   * JSON データには含めない。compat / 既存 import 互換のため optional フィールドとして残す。
   */
  sections?: ArchitectureSection[];
  locale?: ArchitectureLocale;
};

/**
 * 本文付き型 — 詳細ページが MDX 本文と一緒に扱うときに利用する。
 */
export type Architecture = ArchitectureMeta;

export type ArchitectureArticle = ArchitectureMeta & {
  content: string;
};

/**
 * ja 既存ラベル定義. compat 層 (`src/contents/architectures/architectures.ts`) から
 * re-export して既存 import 経路を維持する.
 */
export const architectureLevelLabels: Record<ArchitectureLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export const architectureCategoryLabels: Record<ArchitectureCategory, string> =
  {
    "Static Hosting": "静的サイト",
    Serverless: "サーバーレス",
    "Three Tier": "3層構成",
    "High Availability": "高可用性",
    Batch: "バッチ",
    Networking: "ネットワーク",
    Integration: "アプリ連携",
    Container: "コンテナ",
    Monitoring: "運用監視",
  };

export const awsServiceLabels: Record<string, string> = {
  s3: "S3",
  cloudfront: "CloudFront",
  iam: "IAM",
  acm: "ACM",
  route53: "Route 53",
  "api-gateway": "API Gateway",
  apigateway: "API Gateway",
  lambda: "Lambda",
  dynamodb: "DynamoDB",
  cloudwatch: "CloudWatch",
  vpc: "VPC",
  alb: "ALB",
  elb: "Elastic Load Balancing",
  "auto-scaling": "Auto Scaling",
  autoscaling: "Auto Scaling",
  rds: "RDS",
  ec2: "EC2",
  eventbridge: "EventBridge",
  sqs: "SQS",
  sns: "SNS",
  ecs: "ECS",
  fargate: "Fargate",
  ecr: "ECR",
  "aws-budgets": "AWS Budgets",
};
