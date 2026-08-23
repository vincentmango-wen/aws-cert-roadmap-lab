import type { BlogPostMeta } from "../../types/blog";

/**
 * blogPosts.ts (registry SSoT)
 *
 * 25 件のブログ記事の共通メタ (postId / slug / publishedAt / updatedAt /
 * published / author / category / tags / targetKeywords / title / description).
 *
 * - locale 共通フィールド (postId / slug / publishedAt / updatedAt / published /
 *   category) は本ファイルが正本.
 * - locale 別の表示用 title / description / tags / targetKeywords は、
 *   本フェーズ (P5-050) では ja の値を初期値として保持する。後続フェーズで
 *   `contents/blog/{en,zh}/<slug>.mdx` の frontmatter を読んで locale 別に
 *   差し替える `blog-content-loader.ts` 経由で取得する。
 * - title / description / tags 等が翻訳されるとき、各 locale MDX frontmatter を
 *   優先 (registry はフォールバック).
 *
 * locale-parity test (`__tests__/blog-locale-parity.test.ts`) で
 * 「registry の slug 集合 = ja MDX の slug 集合」を不変条件として検証する.
 */
export const blogPosts: BlogPostMeta[] = [
  {
    postId: "blog-001",
    slug: "aws-cloud-practitioner-roadmap",
    title: "AWS Cloud Practitionerの勉強方法",
    description:
      "AWS Cloud Practitionerをこれから学ぶ初心者向けに、試験範囲、学習順序、覚えるべきAWSサービス、実装で理解する方法を解説します。",
    category: "CLF",
    tags: ["aws", "clf-c02", "cloud-practitioner", "beginner", "roadmap"],
    targetKeywords: [
      "AWS Cloud Practitioner 勉強方法",
      "CLF-C02 初心者",
      "AWS 資格 勉強順序",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    postId: "blog-002",
    slug: "aws-free-tier-portfolio",
    title: "AWS無料枠でポートフォリオを作る方法",
    description:
      "AWS無料枠を活用して、S3、CloudFront、Lambda、DynamoDBを使ったポートフォリオサイトを作る方法を初心者向けに解説します。",
    category: "Portfolio",
    tags: ["aws", "free-tier", "portfolio", "cloudfront", "lambda"],
    targetKeywords: [
      "AWS 無料枠 ポートフォリオ",
      "AWS ポートフォリオ 初心者",
      "S3 CloudFront 静的サイト",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    postId: "blog-003",
    slug: "s3-cloudfront-static-site",
    title: "S3とCloudFrontで静的サイトを公開する方法",
    description:
      "Amazon S3とAmazon CloudFrontを使って、Next.jsの静的サイトを安全に公開する基本構成を初心者向けに解説します。",
    category: "Serverless",
    tags: ["aws", "s3", "cloudfront", "static-site", "oac"],
    targetKeywords: [
      "S3 CloudFront 静的サイト",
      "Next.js S3 CloudFront",
      "CloudFront OAC S3",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    postId: "blog-004",
    slug: "lambda-api-gateway-beginner",
    title: "LambdaとAPI Gatewayを初心者向けに解説",
    description:
      "AWS LambdaとAmazon API Gatewayの役割、違い、連携方法、問い合わせフォームAPIでの使い方を初心者向けに解説します。",
    category: "Serverless",
    tags: ["aws", "lambda", "api-gateway", "serverless", "backend"],
    targetKeywords: [
      "Lambda API Gateway 初心者",
      "AWS Lambda とは",
      "API Gateway とは",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    postId: "blog-005",
    slug: "dynamodb-vs-rds-beginner",
    title: "DynamoDBとRDSの違い",
    description:
      "Amazon DynamoDBとAmazon RDSの違いを、データ構造、料金、運用、使い分け、AWS資格試験で問われる観点から初心者向けに解説します。",
    category: "AWS Services",
    tags: ["aws", "dynamodb", "rds", "database", "comparison"],
    targetKeywords: [
      "DynamoDB RDS 違い",
      "AWS データベース 比較",
      "DynamoDB 初心者",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    postId: "blog-006",
    slug: "clf-shared-responsibility-model",
    title: "AWS責任共有モデルを初心者向けに整理する",
    description:
      "Cloud Practitionerで頻出のAWS責任共有モデルについて、AWS側と利用者側の責任範囲を初学者向けに整理します。",
    category: "CLF対策",
    tags: ["CLF-C02", "責任共有モデル", "セキュリティ", "IAM"],
    targetKeywords: [
      "AWS 責任共有モデル",
      "Cloud Practitioner セキュリティ",
      "AWS 初心者",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-02",
  },
  {
    postId: "blog-007",
    slug: "clf-aws-global-infrastructure",
    title: "AWSグローバルインフラストラクチャを初心者向けに解説",
    description:
      "リージョン、アベイラビリティゾーン、エッジロケーションの違いをCloud Practitioner向けに整理します。",
    category: "CLF対策",
    tags: ["CLF-C02", "リージョン", "AZ", "CloudFront"],
    targetKeywords: [
      "AWS リージョン AZ 違い",
      "AWS グローバルインフラ",
      "Cloud Practitioner",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-008",
    slug: "clf-aws-pricing-basics",
    title: "AWS料金の基本をCloud Practitioner向けに整理する",
    description:
      "従量課金、無料枠、リザーブド、Savings Plansなど、AWS料金の基本を初学者向けに整理します。",
    category: "CLF対策",
    tags: ["CLF-C02", "料金", "AWS Budgets", "Cost Explorer"],
    targetKeywords: [
      "AWS 料金 基本",
      "AWS 無料枠",
      "Cloud Practitioner 請求",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-02",
  },
  {
    postId: "blog-009",
    slug: "clf-iam-basics",
    title: "IAMの基本をCloud Practitioner向けに整理する",
    description:
      "IAMユーザー、IAMグループ、IAMロール、IAMポリシーの基本と、最小権限の考え方を整理します。",
    category: "CLF対策",
    tags: ["CLF-C02", "IAM", "セキュリティ", "最小権限"],
    targetKeywords: [
      "AWS IAM 初心者",
      "IAM ロール ポリシー 違い",
      "Cloud Practitioner IAM",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-010",
    slug: "clf-monitoring-cloudwatch-basics",
    title: "CloudWatchの基本をCloud Practitioner向けに解説",
    description:
      "CloudWatch Logs、Metrics、Alarmの役割を、個人開発の運用監視と結びつけて整理します。",
    category: "CLF対策",
    tags: ["CLF-C02", "CloudWatch", "監視", "ログ"],
    targetKeywords: [
      "CloudWatch 初心者",
      "AWS 監視 基本",
      "Cloud Practitioner CloudWatch",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-02",
  },
  {
    postId: "blog-011",
    slug: "saa-multi-az-high-availability",
    title: "SAAで重要なMulti-AZ高可用性設計を整理する",
    description:
      "SAA-C03で問われやすいMulti-AZ、冗長化、単一障害点の考え方を初心者向けに整理します。",
    category: "SAA対策",
    tags: ["SAA-C03", "Multi-AZ", "高可用性", "RDS", "ALB"],
    targetKeywords: [
      "SAA Multi-AZ",
      "AWS 高可用性 設計",
      "単一障害点 AWS",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-012",
    slug: "saa-vpc-public-private-subnet",
    title: "VPCのPublic SubnetとPrivate SubnetをSAA向けに整理する",
    description:
      "VPC、Public Subnet、Private Subnet、Internet Gateway、NAT Gatewayの役割をSAA対策として整理します。",
    category: "SAA対策",
    tags: ["SAA-C03", "VPC", "Subnet", "NAT Gateway", "Internet Gateway"],
    targetKeywords: [
      "VPC Public Subnet Private Subnet",
      "SAA VPC 基礎",
      "AWS ネットワーク 初心者",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-02",
  },
  {
    postId: "blog-013",
    slug: "saa-s3-cloudfront-oac-design",
    title: "S3とCloudFront OACで安全に静的サイトを配信する設計",
    description:
      "S3を直接公開せずCloudFront OAC経由で配信する構成を、SAAとポートフォリオ観点で解説します。",
    category: "SAA対策",
    tags: ["SAA-C03", "S3", "CloudFront", "OAC", "静的サイト"],
    targetKeywords: [
      "CloudFront OAC S3",
      "S3 静的サイト セキュリティ",
      "SAA CloudFront",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-014",
    slug: "saa-database-selection-rds-dynamodb",
    title: "SAA向けにRDSとDynamoDBの選び方を整理する",
    description:
      "リレーショナルDBとNoSQLの違い、RDSとDynamoDBの使い分けをSAA対策として整理します。",
    category: "SAA対策",
    tags: ["SAA-C03", "RDS", "DynamoDB", "Database", "NoSQL"],
    targetKeywords: [
      "RDS DynamoDB 違い",
      "SAA データベース 選び方",
      "AWS Database 初心者",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-02",
  },
  {
    postId: "blog-015",
    slug: "saa-decoupling-sqs-sns-eventbridge",
    title: "SQS・SNS・EventBridgeで疎結合設計を理解する",
    description:
      "SAAで重要な疎結合設計について、SQS、SNS、EventBridgeの役割と使い分けを整理します。",
    category: "SAA対策",
    tags: ["SAA-C03", "SQS", "SNS", "EventBridge", "疎結合"],
    targetKeywords: [
      "SQS SNS EventBridge 違い",
      "AWS 疎結合 設計",
      "SAA メッセージング",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-016",
    slug: "s3-beginner-object-storage",
    title: "Amazon S3とは？オブジェクトストレージを初心者向けに解説",
    description:
      "Amazon S3の基本、ユースケース、課金ポイント、セキュリティ注意点をAWS初学者向けに整理します。",
    category: "AWSサービス解説",
    tags: ["S3", "Storage", "CLF-C02", "SAA-C03"],
    targetKeywords: [
      "Amazon S3 とは",
      "S3 初心者",
      "オブジェクトストレージ AWS",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-017",
    slug: "lambda-beginner-serverless",
    title: "AWS Lambdaとは？サーバーレスを初心者向けに解説",
    description:
      "AWS Lambdaの基本、メリット、注意点、API GatewayやDynamoDBとの組み合わせを初心者向けに整理します。",
    category: "AWSサービス解説",
    tags: ["Lambda", "Serverless", "API Gateway", "DynamoDB"],
    targetKeywords: [
      "AWS Lambda とは",
      "Lambda 初心者",
      "サーバーレス AWS",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-018",
    slug: "apigateway-beginner-http-api",
    title: "Amazon API Gatewayとは？HTTP APIを初心者向けに解説",
    description:
      "API Gatewayの役割、HTTP API、Lambda連携、CORSの注意点をAWS初学者向けに整理します。",
    category: "AWSサービス解説",
    tags: ["API Gateway", "HTTP API", "Lambda", "CORS"],
    targetKeywords: [
      "API Gateway とは",
      "HTTP API AWS",
      "API Gateway Lambda 初心者",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-019",
    slug: "dynamodb-beginner-nosql",
    title: "Amazon DynamoDBとは？NoSQLを初心者向けに解説",
    description:
      "DynamoDBの基本、テーブル、パーティションキー、オンデマンド課金、Lambda連携を初心者向けに整理します。",
    category: "AWSサービス解説",
    tags: ["DynamoDB", "NoSQL", "Lambda", "Database"],
    targetKeywords: [
      "DynamoDB とは",
      "DynamoDB 初心者",
      "AWS NoSQL",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-020",
    slug: "cloudfront-beginner-cdn",
    title: "Amazon CloudFrontとは？CDNを初心者向けに解説",
    description:
      "CloudFrontの基本、CDN、キャッシュ、S3配信、HTTPS、Invalidationを初心者向けに整理します。",
    category: "AWSサービス解説",
    tags: ["CloudFront", "CDN", "S3", "Cache"],
    targetKeywords: [
      "CloudFront とは",
      "CDN AWS 初心者",
      "CloudFront S3 配信",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-021",
    slug: "aws-portfolio-serverless-architecture",
    title: "AWSポートフォリオでサーバーレス構成を選ぶ理由",
    description:
      "個人開発ポートフォリオでS3、CloudFront、API Gateway、Lambda、DynamoDBを選ぶ理由を整理します。",
    category: "AWS無料枠・ポートフォリオ",
    tags: ["ポートフォリオ", "Serverless", "S3", "CloudFront", "Lambda"],
    targetKeywords: [
      "AWS ポートフォリオ サーバーレス",
      "AWS 個人開発 構成",
      "AWS 無料枠 ポートフォリオ",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-022",
    slug: "aws-budgets-cost-guardrail",
    title: "AWS Budgetsで個人開発の課金事故を防ぐ",
    description:
      "AWS Budgetsの役割、設定すべき閾値、Cost Explorerとの使い分けを個人開発向けに整理します。",
    category: "AWS無料枠・ポートフォリオ",
    tags: ["AWS Budgets", "Cost Explorer", "コスト管理", "個人開発"],
    targetKeywords: [
      "AWS Budgets 設定",
      "AWS 課金事故 防止",
      "個人開発 AWS コスト",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-02",
  },
  {
    postId: "blog-023",
    slug: "github-actions-oidc-deploy",
    title: "GitHub Actions OIDCでAWSデプロイを安全にする",
    description:
      "GitHub ActionsからAWSへデプロイするときに、長期アクセスキーを使わずOIDCで一時認証する考え方を解説します。",
    category: "AWS無料枠・ポートフォリオ",
    tags: ["GitHub Actions", "OIDC", "IAM", "CI/CD", "CloudFront"],
    targetKeywords: [
      "GitHub Actions OIDC AWS",
      "AWS デプロイ OIDC",
      "GitHub Actions IAM Role",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-02",
  },
  {
    postId: "blog-024",
    slug: "serverless-contact-api-flow",
    title: "API Gateway + Lambda + DynamoDBで問い合わせAPIを作る流れ",
    description:
      "問い合わせフォームをサーバーレスAPIで保存する流れを、フロントエンドからDynamoDB保存まで整理します。",
    category: "サーバーレス実装",
    tags: ["API Gateway", "Lambda", "DynamoDB", "Contact Form", "Serverless"],
    targetKeywords: [
      "問い合わせフォーム AWS Lambda",
      "API Gateway Lambda DynamoDB",
      "サーバーレス API 初心者",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
  {
    postId: "blog-025",
    slug: "lambda-cloudwatch-logs-check",
    title: "LambdaのログをCloudWatchで確認する方法",
    description:
      "Lambda実行時のログをCloudWatch Logsで確認し、問い合わせAPIのエラー調査に使う流れを整理します。",
    category: "サーバーレス実装",
    tags: ["Lambda", "CloudWatch Logs", "運用監視", "Serverless"],
    targetKeywords: [
      "Lambda CloudWatch Logs 確認",
      "AWS Lambda ログ",
      "CloudWatch Logs 初心者",
    ],
    author: "AWS Cert Roadmap Lab",
    published: true,
    publishedAt: "2026-06-07",
    updatedAt: "2026-08-20",
  },
];
