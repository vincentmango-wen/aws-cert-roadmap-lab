export type ArchitectureLevel = "beginner" | "intermediate" | "advanced";

export type ExamScope = "CLF-C02" | "SAA-C03";

export type ArchitectureCategory =
  | "Static Hosting"
  | "Serverless"
  | "Three Tier"
  | "High Availability"
  | "Batch";

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
};

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
  };

export const awsServiceLabels: Record<string, string> = {
  s3: "S3",
  cloudfront: "CloudFront",
  iam: "IAM",
  acm: "ACM",
  route53: "Route 53",
  apigateway: "API Gateway",
  lambda: "Lambda",
  dynamodb: "DynamoDB",
  cloudwatch: "CloudWatch",
  vpc: "VPC",
  alb: "ALB",
  autoscaling: "Auto Scaling",
  rds: "RDS",
  ec2: "EC2",
  eventbridge: "EventBridge",
};

export const architectures: ArchitectureMeta[] = [
  {
    architectureId: "arc-001",
    slug: "static-site-s3-cloudfront",
    title: "S3 + CloudFront 静的Webサイト構成",
    description:
      "S3に配置した静的サイトをCloudFrontで高速・安全に配信する基本構成です。S3直接公開を避け、OACでCloudFront経由のアクセスに限定します。",
    category: "Static Hosting",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["s3", "cloudfront", "iam", "acm", "route53"],
    tags: ["静的サイト", "CDN", "HTTPS", "OAC", "低コスト"],
    diagramPath: "/images/architectures/static-site-s3-cloudfront.png",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    architectureId: "arc-002",
    slug: "serverless-api-basic",
    title: "API Gateway + Lambda + DynamoDB サーバーレスAPI構成",
    description:
      "API Gatewayを入口にし、Lambdaで処理し、DynamoDBへ保存するサーバーレスAPIの基本構成です。問い合わせフォームや小規模APIに向いています。",
    category: "Serverless",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["apigateway", "lambda", "dynamodb", "cloudwatch", "iam"],
    tags: ["サーバーレス", "HTTP API", "NoSQL", "ログ監視", "従量課金"],
    diagramPath: "/images/architectures/serverless-api-basic.png",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    architectureId: "arc-003",
    slug: "three-tier-vpc",
    title: "VPC内3層Webアプリ構成",
    description:
      "Public Subnet、Private Subnet、Database Subnetを分け、Web層・アプリ層・DB層を分離する基本的な3層Webアプリ構成です。",
    category: "Three Tier",
    level: "intermediate",
    examScopes: ["SAA-C03"],
    services: ["vpc", "alb", "ec2", "rds", "iam"],
    tags: ["VPC", "Subnet", "3層構成", "セキュリティ", "ネットワーク分離"],
    diagramPath: "/images/architectures/three-tier-vpc.png",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    architectureId: "arc-004",
    slug: "high-availability-web-app",
    title: "ALB + Auto Scaling + RDS Multi-AZ 高可用性構成",
    description:
      "複数AZにWebサーバーを配置し、ALBで負荷分散し、Auto ScalingとRDS Multi-AZで可用性を高める構成です。",
    category: "High Availability",
    level: "intermediate",
    examScopes: ["SAA-C03"],
    services: ["alb", "autoscaling", "ec2", "rds", "cloudwatch"],
    tags: ["高可用性", "Multi-AZ", "負荷分散", "Auto Scaling", "耐障害性"],
    diagramPath: "/images/architectures/high-availability-web-app.png",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    architectureId: "arc-005",
    slug: "eventbridge-lambda-batch",
    title: "EventBridge + Lambda バッチ処理構成",
    description:
      "EventBridgeのスケジュールをトリガーにLambdaを実行する定期バッチ構成です。毎日1問配信や定期集計処理の土台になります。",
    category: "Batch",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["eventbridge", "lambda", "cloudwatch", "iam"],
    tags: ["バッチ処理", "スケジュール実行", "イベント駆動", "自動化"],
    diagramPath: "/images/architectures/eventbridge-lambda-batch.png",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
];

export const publishedArchitectures = architectures.filter(
  (architecture) => architecture.published,
);