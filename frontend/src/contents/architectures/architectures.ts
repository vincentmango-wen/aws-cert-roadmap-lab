export type ArchitectureLevel = "beginner" | "intermediate" | "advanced";

export type ExamScope = "CLF-C02" | "SAA-C03";

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
  sections?: ArchitectureSection[];
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
  apigateway: "API Gateway",
  "api-gateway": "API Gateway",
  lambda: "Lambda",
  dynamodb: "DynamoDB",
  cloudwatch: "CloudWatch",
  vpc: "VPC",
  alb: "ALB",
  elb: "Elastic Load Balancing",
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
    diagramPath: "/images/architectures/static-site-s3-cloudfront.svg",
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
    diagramPath: "/images/architectures/serverless-api-basic.svg",
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
    diagramPath: "/images/architectures/three-tier-vpc.svg",
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
    diagramPath: "/images/architectures/high-availability-web-app.svg",
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
    diagramPath: "/images/architectures/eventbridge-lambda-batch.svg",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    architectureId: "arc-006",
    slug: "private-subnet-vpc-endpoint",
    title: "VPC Endpoint プライベート接続構成",
    description:
      "プライベートサブネット内のアプリケーションから、インターネットを経由せずにS3やDynamoDBへアクセスするVPC Endpoint構成です。",
    category: "Networking",
    level: "intermediate",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["vpc", "s3", "dynamodb", "iam"],
    tags: ["VPC Endpoint", "Private Subnet", "S3", "DynamoDB", "低コスト"],
    diagramPath: "/images/architectures/private-subnet-vpc-endpoint.svg",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    sections: [
      {
        title: "概要",
        body: "VPC Endpointは、VPC内のリソースからAWSサービスへプライベートに接続するための入口です。プライベートサブネットのアプリケーションがS3やDynamoDBへアクセスする場合、インターネットゲートウェイやNAT Gatewayを経由せずに通信できます。\n\nSAAでは、セキュリティを高めながらNAT Gatewayの固定費を避ける構成として問われやすいです。",
      },
      {
        title: "通信フロー",
        body: "1. アプリケーションはプライベートサブネット内で動作します。\n2. アプリケーションがS3またはDynamoDBへアクセスします。\n3. ルートテーブルに設定されたVPC Endpoint経由でAWSサービスへ通信します。\n4. IAM PolicyとEndpoint Policyでアクセス可否が評価されます。\n5. 許可された操作だけが実行されます。",
      },
      {
        title: "設計ポイント",
        body: "S3とDynamoDBにはGateway Endpointを使えます。Gateway EndpointはNAT Gatewayを使う構成よりコストを抑えやすいです。\n\nInterface Endpointは多くのAWSサービスに対応しますが、時間課金とデータ処理課金が発生します。すべてのサービスに作るのではなく、通信要件とコストを見て選びます。\n\nセキュリティ面では、IAM PolicyだけでなくEndpoint Policyでもアクセス先を制限します。",
      },
      {
        title: "SAA試験ポイント",
        body: "プライベートサブネットからS3へアクセスしたい、インターネットを経由したくない、NAT Gatewayのコストを避けたい、という条件が出たらVPC Endpointを候補にします。\n\nGateway EndpointとInterface Endpointの違い、Endpoint Policyによる制限、ルートテーブルへの関連付けを押さえます。",
      },
    ],
  },
  {
    architectureId: "arc-007",
    slug: "sqs-lambda-async-processing",
    title: "SQS + Lambda 非同期処理構成",
    description:
      "Amazon SQSで処理依頼をキューイングし、AWS Lambdaで順番に処理する非同期サーバーレス構成です。",
    category: "Serverless",
    level: "intermediate",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["sqs", "lambda", "dynamodb", "cloudwatch", "iam"],
    tags: ["SQS", "Lambda", "非同期処理", "DLQ", "疎結合"],
    diagramPath: "/images/architectures/sqs-lambda-async-processing.svg",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    sections: [
      {
        title: "概要",
        body: "SQS + Lambdaは、重い処理や失敗しやすい処理を非同期化するための代表的な構成です。APIやアプリケーションはSQSへメッセージを送るだけにし、Lambdaがキューからメッセージを受け取って処理します。\n\nユーザーへの応答とバックエンド処理を分離できるため、疎結合でスケールしやすい設計になります。",
      },
      {
        title: "通信フロー",
        body: "1. ユーザーまたは外部システムがAPIへリクエストします。\n2. APIまたはアプリケーションがSQSへメッセージを送信します。\n3. SQSが処理待ちメッセージを保持します。\n4. LambdaがSQSイベントで起動します。\n5. Lambdaが処理結果をDynamoDBなどへ保存します。\n6. 規定回数失敗したメッセージはDLQへ退避します。",
      },
      {
        title: "設計ポイント",
        body: "Lambda処理は重複実行される可能性があるため、冪等性を前提にします。同じメッセージを複数回処理してもデータが壊れない設計にします。\n\n可視性タイムアウトはLambdaの最大処理時間より長く設定します。処理失敗を調査できるようにDLQを設定します。\n\nLambdaの同時実行数を制御すれば、DynamoDBや外部APIへ負荷をかけすぎない設計にできます。",
      },
      {
        title: "SAA試験ポイント",
        body: "急なリクエスト増加を吸収したい、コンポーネントを疎結合にしたい、処理を非同期化したい、という条件ではSQSが候補になります。\n\n失敗メッセージの退避にはDLQ、順序保証が必要な場合はFIFOキューを検討します。",
      },
    ],
  },
  {
    architectureId: "arc-008",
    slug: "sns-sqs-fanout",
    title: "SNS + SQS ファンアウト構成",
    description:
      "Amazon SNSで1つのイベントを複数のSQSキューへ配信し、通知・更新・分析などの処理を分岐する構成です。",
    category: "Integration",
    level: "intermediate",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["sns", "sqs", "lambda", "cloudwatch", "iam"],
    tags: ["SNS", "SQS", "Fanout", "Pub/Sub", "イベント駆動"],
    diagramPath: "/images/architectures/sns-sqs-fanout.svg",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    sections: [
      {
        title: "概要",
        body: "SNS + SQSのファンアウト構成は、1つのイベントを複数の処理へ同時に配信するための設計です。注文作成イベントを、メール通知、在庫更新、分析ログ保存へ分岐させるようなケースで使います。\n\n発行側はSNS TopicへPublishするだけでよく、処理側はそれぞれ独立したSQSキューでメッセージを受け取ります。",
      },
      {
        title: "通信フロー",
        body: "1. アプリケーションがSNS TopicへイベントをPublishします。\n2. SNSが購読設定に基づいて複数のSQSキューへメッセージを配信します。\n3. 各SQSキューが処理待ちメッセージを保持します。\n4. 各Lambdaが担当キューからメッセージを取得します。\n5. Lambdaごとに通知、更新、分析などの処理を実行します。",
      },
      {
        title: "設計ポイント",
        body: "処理ごとにSQSキューを分けることで、1つの処理が失敗しても他の処理へ影響しにくくなります。\n\nSQS Queue Policyでは、指定したSNS Topicからのメッセージだけを受け付けるように制限します。\n\n購読先を増やすとSQSリクエスト数とLambda実行回数も増えるため、不要な購読先は作りません。",
      },
      {
        title: "SAA試験ポイント",
        body: "1つのイベントを複数のシステムへ配信したい場合はSNSが候補です。さらに処理側の一時障害に備えたい場合はSNS + SQSを組み合わせます。\n\n疎結合、ファンアウト、イベント駆動というキーワードと一緒に覚えます。",
      },
    ],
  },
  {
    architectureId: "arc-009",
    slug: "ecs-fargate-web-app",
    title: "ECS Fargate コンテナWebアプリ構成",
    description:
      "ECS Fargateでコンテナ化したWebアプリを実行し、ALBでHTTPSアクセスを受ける基本構成です。",
    category: "Container",
    level: "intermediate",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: ["ecs", "fargate", "ecr", "elb", "vpc", "cloudwatch", "iam"],
    tags: ["ECS", "Fargate", "Container", "ALB", "ECR"],
    diagramPath: "/images/architectures/ecs-fargate-web-app.svg",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    sections: [
      {
        title: "概要",
        body: "ECS Fargateは、コンテナ化したWebアプリケーションをサーバー管理なしで実行する構成です。EC2インスタンスの管理を避けながら、DockerイメージをAWS上で動かせます。\n\n外部公開にはALBを使い、コンテナイメージはECRに保存します。",
      },
      {
        title: "通信フロー",
        body: "1. ユーザーがRoute 53で管理されたドメインへHTTPSアクセスします。\n2. ALBがリクエストを受け付けます。\n3. ALBがターゲットグループ経由でECS Fargateタスクへ転送します。\n4. Fargateタスク上のコンテナがリクエストを処理します。\n5. コンテナログをCloudWatch Logsへ出力します。\n6. デプロイ時はECRからコンテナイメージを取得します。",
      },
      {
        title: "設計ポイント",
        body: "ALBはパブリックサブネットに配置し、ECSタスクはプライベートサブネットに配置します。ECSタスクのSecurity GroupはALBからの通信だけを許可します。\n\nFargateはvCPU、メモリ、実行時間で課金されます。個人MVPではS3 + CloudFrontよりコストが高くなりやすいため、このプロジェクト本体では採用せず、学習用構成として扱います。",
      },
      {
        title: "SAA試験ポイント",
        body: "コンテナを動かしたいがEC2管理を避けたい場合はFargateが候補になります。外部公開にはALB、イメージ保存にはECR、ログ確認にはCloudWatch Logsを使います。\n\nタスク実行ロールとタスクロールの違いも押さえます。",
      },
    ],
  },
  {
    architectureId: "arc-010",
    slug: "cloudwatch-monitoring-basic",
    title: "CloudWatch サーバーレス運用監視構成",
    description:
      "CloudFront、API Gateway、Lambda、DynamoDBをCloudWatch LogsとMetricsで確認する、MVP向けの運用監視構成です。",
    category: "Monitoring",
    level: "beginner",
    examScopes: ["CLF-C02", "SAA-C03"],
    services: [
      "cloudwatch",
      "cloudfront",
      "apigateway",
      "lambda",
      "dynamodb",
      "aws-budgets",
    ],
    tags: ["CloudWatch", "Logs", "Metrics", "Budgets", "運用監視"],
    diagramPath: "/images/architectures/cloudwatch-monitoring-basic.svg",
    mermaid: true,
    published: true,
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    sections: [
      {
        title: "概要",
        body: "この構成は、S3 + CloudFrontで公開した静的サイトと、API Gateway + Lambda + DynamoDBの問い合わせAPIを低コストで監視するための基本構成です。\n\nMVPでは大規模な監視基盤を作り込まず、CloudWatch Logs、CloudWatch Metrics、AWS Budgets、GitHub Actionsログを中心に確認します。",
      },
      {
        title: "監視対象",
        body: "CloudFrontではリクエスト数、4xx、5xx、転送量を確認します。API GatewayではCount、4xx、5xx、Latencyを確認します。LambdaではInvocations、Errors、Duration、Throttlesを確認します。\n\nDynamoDBでは書き込み数やスロットリング、CloudWatch LogsではLambdaのエラー内容を確認します。",
      },
      {
        title: "設計ポイント",
        body: "CloudWatch Logsにはメールアドレス全文や問い合わせ本文全文を出力しません。ログにはrequestId、status、errorCode、validationErrorFieldsなど、調査に必要な情報だけを残します。\n\nログ保存期間は7日または14日に設定し、無期限保存によるログ課金を避けます。",
      },
      {
        title: "SAA試験ポイント",
        body: "運用監視ではCloudWatch LogsとCloudWatch Metricsを分けて理解します。Lambda Errors、Duration、Throttles、API Gateway 4xx/5xx、DynamoDB Throttlesは障害調査で重要です。\n\n課金事故対策としてAWS Budgetsを設定する点も、このプロジェクトのコスト管理設計とつながります。",
      },
    ],
  },
];

export const publishedArchitectures = architectures.filter(
  (architecture) => architecture.published,
);
