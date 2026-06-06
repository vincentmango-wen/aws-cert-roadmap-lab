AWS資格学習サイト データ設計書

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト データ設計書|
|対象プロダクト|AWS資格ロードマップラボ|
|対象フェーズ|MVP開発 〜 SAA対策機能拡張 〜 学習アプリ化|
|目的|サイトで扱うデータの種類、保存場所、構造、DynamoDB設計、JSON/Markdown管理方針を定義する|
|想定技術|Next.js / TypeScript / Markdown / JSON / AWS Lambda / API Gateway / DynamoDB|

  

2. 本設計書の目的

本設計書では、AWS資格学習サイト「AWS資格ロードマップラボ」で扱うデータを定義する。

本プロダクトでは、以下の種類のデータを扱う。

- AWS用語データ
- AWSサービス比較データ
- 模擬問題データ
- AWS構成図データ
- ブログ記事データ
- 問い合わせデータ
- 運営者・ポリシー系静的データ
- 将来のユーザーデータ
- 将来の学習履歴データ
- 将来の弱点分析データ

MVPでは、コストを抑え、開発をシンプルにするため、基本的にMarkdown / MDX / JSONで管理する。

Phase 2以降で、問い合わせデータや問題データの一部をDynamoDBに保存する。

Phase 4以降で、Cognito認証を導入し、ユーザー別の学習履歴・正答率・復習対象をDynamoDBに保存する。

  

3. データ設計の基本方針

3.1 基本方針

|   |   |
|---|---|
|方針|内容|
|MVPは静的データ中心|用語、比較、記事、構成図、問題はMarkdown/JSONで管理する|
|動的データのみDynamoDB|問い合わせ、将来の回答履歴、学習進捗はDynamoDBに保存する|
|原本はGitHub管理|用語・問題・記事・構成図の原本はGitHub上で管理する|
|低コスト優先|MVPではDBアクセスを最小化し、S3 + CloudFrontで静的配信する|
|拡張可能性確保|将来的にDynamoDB/API化できるよう、JSON構造を明確にする|
|SEO重視|ブログ、比較、用語詳細はtitle、description、slugを必ず持つ|
|学習アプリ化を想定|将来のユーザー別学習履歴・弱点分析に拡張できる設計にする|

  

4. データ分類

4.1 データ一覧

|   |   |   |   |   |
|---|---|---|---|---|
|データ種別|内容|MVP保存場所|将来保存場所|更新頻度|
|AWS用語データ|AWSサービスの概要・用途・試験ポイント|JSON / MDX|DynamoDB任意|中|
|サービス比較データ|似たAWSサービスの比較記事|MDX|MDX中心|中|
|模擬問題データ|CLF/SAA模擬問題|JSON|DynamoDB|高|
|構成図データ|AWS構成図と設計解説|MDX + 画像|MDX中心|中|
|ブログ記事データ|SEO記事|MDX|MDX中心|高|
|問い合わせデータ|ユーザー問い合わせ|DynamoDB|DynamoDB|低〜中|
|運営者情報|サイト運営者情報|静的ページ|静的ページ|低|
|プライバシーポリシー|個人情報・Cookie・広告説明|静的ページ|静的ページ|低|
|ユーザーデータ|ログインユーザー情報|対象外|Cognito + DynamoDB|中|
|回答履歴データ|ユーザーの問題回答履歴|対象外|DynamoDB|高|
|学習進捗データ|正答率・苦手カテゴリ|対象外|DynamoDB|高|
|毎日1問データ|通知対象問題|対象外|DynamoDB|中|

  

5. MVPデータ管理方針

5.1 MVPでの保存方針

MVPでは、以下のように管理する。

|   |   |   |
|---|---|---|
|データ|保存形式|理由|
|AWS用語|JSON|一覧・検索・詳細表示に使いやすい|
|模擬問題|JSON|クライアント側で正誤判定しやすい|
|サービス比較|MDX|表・文章・内部リンクを柔軟に書ける|
|ブログ記事|MDX|SEO記事として管理しやすい|
|構成図解説|MDX + 画像|図と文章を組み合わせやすい|
|問い合わせ|DynamoDB|ユーザー入力の保存が必要なため|
|運営者情報|静的ページ|更新頻度が低いため|
|プライバシーポリシー|静的ページ|更新頻度が低いため|

5.2 MVPでDynamoDBに保存するもの

MVPでは、DynamoDB保存対象を最小限にする。

|   |   |   |
|---|---|---|
|データ|DynamoDB保存|理由|
|問い合わせデータ|必須|ユーザー入力を保存する必要がある|
|AWS用語データ|任意|MVPではJSON管理で十分|
|模擬問題データ|任意|MVPではJSON管理で十分|
|学習履歴|対象外|ログイン機能がないため|
|ユーザー情報|対象外|Cognito導入前のため|

5.3 MVPでAPI化しないデータ

以下はMVPではAPI化しない。

|   |   |
|---|---|
|データ|理由|
|ブログ記事|静的生成の方がSEO・速度・コスト面で有利|
|サービス比較記事|静的ページで十分|
|構成図解説|静的ページで十分|
|プライバシーポリシー|静的ページで十分|
|運営者情報|静的ページで十分|

  

6. ディレクトリ構成

6.1 推奨コンテンツディレクトリ

frontend/

├── contents/

│   ├── terms/

│   │   └── terms.json

│   ├── questions/

│   │   ├── clf-c02.json

│   │   └── saa-c03.json

│   ├── comparisons/

│   │   ├── s3-vs-ebs-vs-efs.mdx

│   │   ├── rds-vs-dynamodb.mdx

│   │   └── sns-vs-sqs-vs-eventbridge.mdx

│   ├── architectures/

│   │   ├── static-site-s3-cloudfront.mdx

│   │   ├── serverless-api-basic.mdx

│   │   └── three-tier-vpc.mdx

│   ├── blog/

│   │   ├── aws-cloud-practitioner-roadmap.mdx

│   │   ├── aws-free-tier-portfolio.mdx

│   │   └── lambda-api-gateway-beginner.mdx

│   └── site/

│       ├── roadmap.mdx

│       ├── about.mdx

│       ├── privacy.mdx

│       └── disclaimer.mdx

│

├── public/

│   └── images/

│       ├── architectures/

│       ├── blog/

│       └── ogp/

6.2 バックエンドディレクトリ

backend/

├── functions/

│   ├── contact_submit/

│   │   ├── app.py

│   │   └── requirements.txt

│   ├── get_terms/

│   │   ├── app.py

│   │   └── requirements.txt

│   ├── get_questions/

│   │   ├── app.py

│   │   └── requirements.txt

│   ├── submit_answer/

│   │   ├── app.py

│   │   └── requirements.txt

│   └── get_progress/

│       ├── app.py

│       └── requirements.txt

│

├── shared/

│   ├── response.py

│   ├── validation.py

│   └── dynamodb.py

6.3 インフラディレクトリ

infra/

├── sam-template.yaml

├── dynamodb/

│   └── tables.md

├── policies/

│   └── iam-policy-notes.md

└── README.md

  

7. AWS用語データ設計

7.1 データ概要

AWS用語データは、AWSサービスの概要、用途、資格試験で問われるポイント、類似サービスとの違いを管理する。

対象画面：

- AWS用語集一覧
- AWS用語詳細
- サービス比較詳細の関連リンク
- 模擬問題解説の関連リンク
- 構成図詳細の使用サービスリンク

7.2 保存形式

MVPではJSONで管理する。

frontend/contents/terms/terms.json

将来的に管理画面や検索APIを追加する場合、DynamoDBへ移行する。

7.3 JSON構造

[

  {

    "termId": "s3",

    "name": "Amazon S3",

    "shortName": "S3",

    "category": "Storage",

    "level": "beginner",

    "examScopes": ["CLF-C02", "SAA-C03"],

    "summary": "オブジェクトストレージサービス。画像、動画、ログ、バックアップ、静的サイトファイルなどを保存できる。",

    "oneLine": "ファイルを安全かつ低コストに保存するためのAWSの代表的なストレージサービス。",

    "useCases": [

      "静的Webサイトのホスティング",

      "画像・動画ファイルの保存",

      "ログ保存",

      "バックアップ",

      "データレイク"

    ],

    "examPoints": [

      "オブジェクトストレージである",

      "高い耐久性を持つ",

      "ストレージクラスを選択できる",

      "ライフサイクルルールでコスト最適化できる",

      "CloudFrontと組み合わせて静的サイト配信に使える"

    ],

    "saaPoints": [

      "静的コンテンツ配信ではS3 + CloudFrontが基本構成になる",

      "アクセス制御にはバケットポリシー、IAM、OACを利用する",

      "長期保存にはGlacier系ストレージクラスを検討する"

    ],

    "relatedServices": ["cloudfront", "ebs", "efs", "iam"],

    "comparisonSlugs": ["s3-vs-ebs-vs-efs"],

    "architectureSlugs": ["static-site-s3-cloudfront"],

    "tags": ["storage", "object-storage", "static-site"],

    "costNotes": [

      "保存容量、リクエスト数、データ転送量で課金される",

      "不要な大容量ファイルを置き続けない"

    ],

    "securityNotes": [

      "バケットを安易にパブリック公開しない",

      "CloudFront経由で配信する場合はOACを利用する"

    ],

    "updatedAt": "2026-05-30"

  }

]

7.4 項目定義

|   |   |   |   |
|---|---|---|---|
|項目|型|必須|内容|
|termId|string|必須|用語ID。URLにも使用する|
|name|string|必須|正式サービス名|
|shortName|string|必須|略称|
|category|string|必須|サービスカテゴリ|
|level|string|必須|beginner / intermediate / advanced|
|examScopes|string[]|必須|対象試験|
|summary|string|必須|概要説明|
|oneLine|string|必須|一言説明|
|useCases|string[]|必須|主な用途|
|examPoints|string[]|必須|CLF向け試験ポイント|
|saaPoints|string[]|任意|SAA向け試験ポイント|
|relatedServices|string[]|任意|関連サービスID|
|comparisonSlugs|string[]|任意|関連比較記事|
|architectureSlugs|string[]|任意|関連構成図|
|tags|string[]|任意|タグ|
|costNotes|string[]|任意|コスト注意点|
|securityNotes|string[]|任意|セキュリティ注意点|
|updatedAt|string|必須|更新日|

7.5 カテゴリ定義

|   |   |   |
|---|---|---|
|category|内容|例|
|Compute|コンピューティング|EC2, Lambda, ECS|
|Storage|ストレージ|S3, EBS, EFS|
|Database|データベース|RDS, DynamoDB, Aurora|
|Networking|ネットワーク|VPC, Route 53, CloudFront|
|Security|セキュリティ|IAM, KMS, WAF|
|Monitoring|監視・ログ|CloudWatch, CloudTrail, Config|
|Integration|アプリ連携|SQS, SNS, EventBridge|
|Analytics|分析|Athena, Glue, QuickSight|
|Management|管理|Organizations, Budgets, Cost Explorer|

7.6 初期登録対象

MVPで最低限登録するAWS用語は以下とする。

|   |   |
|---|---|
|優先度|サービス|
|高|IAM|
|高|S3|
|高|EC2|
|高|Lambda|
|高|VPC|
|高|RDS|
|高|DynamoDB|
|高|CloudFront|
|高|Route 53|
|高|CloudWatch|
|高|CloudTrail|
|高|API Gateway|
|高|SQS|
|高|SNS|
|高|EventBridge|
|中|EBS|
|中|EFS|
|中|ELB|
|中|Auto Scaling|
|中|ACM|
|中|KMS|
|中|WAF|
|中|AWS Budgets|
|中|Cost Explorer|
|中|Organizations|
|中|AWS Config|
|中|Secrets Manager|
|中|Systems Manager|
|中|CloudFormation|
|中|Cognito|

  

8. サービス比較データ設計

8.1 データ概要

サービス比較データは、試験で混同しやすいAWSサービスの違いを比較表と解説で管理する。

対象画面：

- サービス比較一覧
- サービス比較詳細
- AWS用語詳細の関連比較
- ブログ記事内リンク
- 模擬問題解説内リンク

8.2 保存形式

MVPではMDXで管理する。

frontend/contents/comparisons/s3-vs-ebs-vs-efs.mdx

8.3 Frontmatter構造

---

comparisonId: "cmp-001"

slug: "s3-vs-ebs-vs-efs"

title: "S3・EBS・EFSの違いを初心者向けに解説"

description: "AWSの代表的なストレージサービスであるS3、EBS、EFSの違い、試験ポイント、実務での使い分けを整理します。"

category: "Storage"

level: "beginner"

examScopes:

  - "CLF-C02"

  - "SAA-C03"

services:

  - "s3"

  - "ebs"

  - "efs"

tags:

  - "storage"

  - "comparison"

  - "clf"

  - "saa"

priority: "high"

published: true

publishedAt: "2026-06-01"

updatedAt: "2026-06-01"

---

8.4 本文構成

# S3・EBS・EFSの違い

  

## 結論

  

## 比較表

  

| 項目 | S3 | EBS | EFS |

|---|---|---|---|

| 種類 | オブジェクトストレージ | ブロックストレージ | ファイルストレージ |

| 主な用途 | ファイル保存・静的サイト | EC2のディスク | 複数EC2から共有 |

  

## 初学者向け説明

  

## 試験で問われるポイント

  

## 実務での使い分け

  

## よくある間違い

  

## 関連用語

  

- [Amazon S3](/terms/s3)

- [Amazon EBS](/terms/ebs)

- [Amazon EFS](/terms/efs)

  

## 関連問題

8.5 項目定義

|   |   |   |   |
|---|---|---|---|
|項目|型|必須|内容|
|comparisonId|string|必須|比較記事ID|
|slug|string|必須|URLスラッグ|
|title|string|必須|SEOタイトル|
|description|string|必須|SEO説明文|
|category|string|必須|カテゴリ|
|level|string|必須|難易度|
|examScopes|string[]|必須|対象試験|
|services|string[]|必須|比較対象サービスID|
|tags|string[]|任意|タグ|
|priority|string|任意|high / medium / low|
|published|boolean|必須|公開状態|
|publishedAt|string|必須|公開日|
|updatedAt|string|必須|更新日|

8.6 初期作成対象

|   |   |   |   |
|---|---|---|---|
|comparisonId|slug|title|優先度|
|cmp-001|s3-vs-ebs-vs-efs|S3・EBS・EFSの違い|高|
|cmp-002|rds-vs-dynamodb|RDS・DynamoDBの違い|高|
|cmp-003|sns-vs-sqs-vs-eventbridge|SNS・SQS・EventBridgeの違い|高|
|cmp-004|iam-user-vs-role-vs-policy|IAMユーザー・IAMロール・IAMポリシーの違い|高|
|cmp-005|cloudwatch-vs-cloudtrail-vs-config|CloudWatch・CloudTrail・AWS Configの違い|高|
|cmp-006|alb-vs-nlb-vs-cloudfront|ALB・NLB・CloudFrontの違い|中|
|cmp-007|multi-az-vs-read-replica|Multi-AZ・Read Replicaの違い|中|
|cmp-008|security-group-vs-nacl|Security Group・NACLの違い|中|

  

9. 模擬問題データ設計

9.1 データ概要

模擬問題データは、AWS Cloud Practitioner / SAA の資格対策用問題を管理する。

MVPではCloud Practitioner向け30問を作成する。

対象画面：

- 模擬問題トップ
- CLF模擬問題一覧
- 模擬問題詳細
- 用語詳細の関連問題
- 将来の学習履歴・弱点分析

9.2 保存形式

MVPではJSONで管理する。

frontend/contents/questions/clf-c02.json

Phase 2以降でDynamoDBに移行可能とする。

9.3 JSON構造

[

  {

    "questionId": "clf-001",

    "exam": "CLF-C02",

    "category": "Cloud Concepts",

    "domain": "Cloud Concepts",

    "difficulty": "easy",

    "question": "AWSクラウドの主な利点として最も適切なものはどれですか？",

    "choices": [

      {

        "choiceId": "A",

        "text": "物理サーバーの購入が必須になる"

      },

      {

        "choiceId": "B",

        "text": "需要に応じてリソースを拡張・縮小できる"

      },

      {

        "choiceId": "C",

        "text": "すべてのセキュリティ責任がAWS側になる"

      },

      {

        "choiceId": "D",

        "text": "すべてのサービスが無料で利用できる"

      }

    ],

    "correctChoiceId": "B",

    "explanation": "AWSでは必要に応じてリソースを拡張・縮小できるため、需要変動に対応しやすい。",

    "choiceExplanations": {

      "A": "クラウドでは物理サーバーを自分で購入する必要はありません。",

      "B": "正解です。クラウドの代表的な利点はスケーラビリティです。",

      "C": "セキュリティはAWSとユーザーの責任共有モデルです。すべてAWS側ではありません。",

      "D": "AWSには無料枠がありますが、すべてのサービスが無料ではありません。"

    },

    "relatedServices": ["ec2", "auto-scaling"],

    "relatedTerms": ["shared-responsibility-model"],

    "relatedComparisons": [],

    "tags": ["cloud-concepts", "scalability", "clf"],

    "published": true,

    "createdAt": "2026-06-01",

    "updatedAt": "2026-06-01"

  }

]

9.4 項目定義

|   |   |   |   |
|---|---|---|---|
|項目|型|必須|内容|
|questionId|string|必須|問題ID。例：clf-001|
|exam|string|必須|試験区分。CLF-C02 / SAA-C03|
|category|string|必須|問題カテゴリ|
|domain|string|必須|試験ドメイン|
|difficulty|string|必須|easy / normal / hard|
|question|string|必須|問題文|
|choices|object[]|必須|選択肢|
|correctChoiceId|string|必須|正解選択肢ID|
|explanation|string|必須|全体解説|
|choiceExplanations|object|任意|選択肢ごとの解説|
|relatedServices|string[]|任意|関連AWSサービス|
|relatedTerms|string[]|任意|関連用語|
|relatedComparisons|string[]|任意|関連比較記事|
|tags|string[]|任意|タグ|
|published|boolean|必須|公開状態|
|createdAt|string|必須|作成日|
|updatedAt|string|必須|更新日|

9.5 CLF-C02カテゴリ定義

|   |   |
|---|---|
|category|内容|
|Cloud Concepts|クラウドの概念、利点、責任共有モデル|
|Security and Compliance|セキュリティ、IAM、コンプライアンス|
|Cloud Technology and Services|AWS主要サービス、デプロイ、運用|
|Billing, Pricing, and Support|料金、請求、サポート、コスト管理|

9.6 SAA-C03カテゴリ定義

Phase 2以降で利用する。

|   |   |
|---|---|
|category|内容|
|Secure Architectures|セキュアな設計|
|Resilient Architectures|耐障害性・高可用性設計|
|High-Performing Architectures|パフォーマンス設計|
|Cost-Optimized Architectures|コスト最適化設計|

9.7 問題IDルール

|   |   |   |
|---|---|---|
|試験|ID形式|例|
|Cloud Practitioner|clf-連番3桁|clf-001|
|Solutions Architect Associate|saa-連番3桁|saa-001|

9.8 MVP初期問題数

|   |   |   |
|---|---|---|
|試験|問題数|優先度|
|CLF-C02|30問|高|
|SAA-C03|0問|Phase 2以降|

9.9 Phase 2以降の目標問題数

|   |   |
|---|---|
|試験|目標問題数|
|CLF-C02|100問|
|SAA-C03|100問|

  

10. 構成図データ設計

10.1 データ概要

構成図データは、SAA対策およびポートフォリオ説明用のAWSアーキテクチャを管理する。

対象画面：

- 構成図一覧
- 構成図詳細
- AWS用語詳細の関連構成図
- ブログ記事内リンク
- GitHub README

10.2 保存形式

MVPではMDX + 画像で管理する。

frontend/contents/architectures/serverless-api-basic.mdx

frontend/public/images/architectures/serverless-api-basic.png

10.3 Frontmatter構造

---

architectureId: "arc-001"

slug: "static-site-s3-cloudfront"

title: "S3 + CloudFront 静的Webサイト構成"

description: "S3に配置した静的サイトをCloudFrontで高速・安全に配信する基本構成を解説します。"

category: "Static Hosting"

level: "beginner"

examScopes:

  - "CLF-C02"

  - "SAA-C03"

services:

  - "s3"

  - "cloudfront"

  - "iam"

  - "acm"

  - "route53"

tags:

  - "static-site"

  - "cloudfront"

  - "s3"

  - "portfolio"

diagramPath: "/images/architectures/static-site-s3-cloudfront.png"

mermaid: true

published: true

publishedAt: "2026-06-01"

updatedAt: "2026-06-01"

---

10.4 本文構成

# S3 + CloudFront 静的Webサイト構成

  

## 概要

  

## 構成図

  

## この構成で実現できること

  

## 使用AWSサービス

  

## 通信フロー

  

## 設計ポイント

  

### 可用性

  

### セキュリティ

  

### コスト

  

### パフォーマンス

  

## SAA試験で問われるポイント

  

## この構成の注意点

  

## 関連用語

10.5 項目定義

|   |   |   |   |
|---|---|---|---|
|項目|型|必須|内容|
|architectureId|string|必須|構成図ID|
|slug|string|必須|URLスラッグ|
|title|string|必須|タイトル|
|description|string|必須|SEO説明文|
|category|string|必須|構成カテゴリ|
|level|string|必須|難易度|
|examScopes|string[]|必須|対象試験|
|services|string[]|必須|使用AWSサービスID|
|tags|string[]|任意|タグ|
|diagramPath|string|任意|構成図画像パス|
|mermaid|boolean|任意|Mermaid図を含むか|
|published|boolean|必須|公開状態|
|publishedAt|string|必須|公開日|
|updatedAt|string|必須|更新日|

10.6 初期作成対象

|   |   |   |   |
|---|---|---|---|
|architectureId|slug|title|優先度|
|arc-001|static-site-s3-cloudfront|S3 + CloudFront 静的Webサイト構成|高|
|arc-002|serverless-api-basic|API Gateway + Lambda + DynamoDB サーバーレスAPI構成|高|
|arc-003|three-tier-vpc|VPC内3層Webアプリ構成|中|
|arc-004|high-availability-web-app|ALB + Auto Scaling + RDS Multi-AZ 高可用性構成|中|
|arc-005|eventbridge-lambda-batch|EventBridge + Lambda バッチ処理構成|中|

  

11. ブログ記事データ設計

11.1 データ概要

ブログ記事データは、SEO流入と広告収益化を目的とした記事を管理する。

対象画面：

- ブログ一覧
- ブログ詳細
- トップページ最新記事
- 関連記事表示
- サイトマップ生成

11.2 保存形式

MDXで管理する。

frontend/contents/blog/aws-free-tier-portfolio.mdx

11.3 Frontmatter構造

---

postId: "blog-001"

slug: "aws-free-tier-portfolio"

title: "AWS無料枠でポートフォリオを作る方法"

description: "AWS無料枠を活用して、S3、CloudFront、Lambda、DynamoDBを使ったポートフォリオサイトを作る方法を初心者向けに解説します。"

category: "Portfolio"

tags:

  - "aws"

  - "free-tier"

  - "portfolio"

  - "cloudfront"

  - "lambda"

targetKeywords:

  - "AWS 無料枠 ポートフォリオ"

  - "AWS ポートフォリオ 初心者"

  - "S3 CloudFront 静的サイト"

author: "AWS Cert Roadmap Lab"

eyeCatch: "/images/blog/aws-free-tier-portfolio.png"

published: true

publishedAt: "2026-06-01"

updatedAt: "2026-06-01"

---

11.4 本文構成

# AWS無料枠でポートフォリオを作る方法

  

## 結論

  

## AWS無料枠で作れる構成

  

## 使うサービス

  

## 課金リスクがあるサービス

  

## 実装ステップ

  

## ポートフォリオとして見せるポイント

  

## まとめ

11.5 項目定義

|   |   |   |   |
|---|---|---|---|
|項目|型|必須|内容|
|postId|string|必須|記事ID|
|slug|string|必須|URLスラッグ|
|title|string|必須|SEOタイトル|
|description|string|必須|SEO説明文|
|category|string|必須|記事カテゴリ|
|tags|string[]|任意|タグ|
|targetKeywords|string[]|任意|狙うSEOキーワード|
|author|string|必須|著者|
|eyeCatch|string|任意|アイキャッチ画像|
|published|boolean|必須|公開状態|
|publishedAt|string|必須|公開日|
|updatedAt|string|必須|更新日|

11.6 初期記事対象

|   |   |   |   |
|---|---|---|---|
|postId|slug|title|優先度|
|blog-001|aws-cloud-practitioner-roadmap|AWS Cloud Practitionerの勉強方法|高|
|blog-002|aws-free-tier-portfolio|AWS無料枠でポートフォリオを作る方法|高|
|blog-003|s3-cloudfront-static-site|S3とCloudFrontで静的サイトを公開する方法|高|
|blog-004|lambda-api-gateway-beginner|LambdaとAPI Gatewayを初心者向けに解説|中|
|blog-005|dynamodb-vs-rds-beginner|DynamoDBとRDSの違い|中|

11.7 AdSense申請前の記事目標

AdSense申請前には、最低20本以上の記事を用意する。

|   |   |
|---|---|
|カテゴリ|目標記事数|
|CLF対策|5本|
|SAA対策|5本|
|AWSサービス解説|5本|
|AWS無料枠・ポートフォリオ|3本|
|サーバーレス実装|2本|

  

12. 問い合わせデータ設計

12.1 データ概要

問い合わせデータは、ユーザーからの問い合わせ、誤り報告、仕事依頼、フィードバックを保存する。

対象画面：

- 問い合わせ画面

保存先：

- DynamoDB ContactsTable

12.2 DynamoDBテーブル設計

|   |   |
|---|---|
|項目|内容|
|テーブル名|ContactsTable|
|用途|問い合わせデータ保存|
|Phase|Phase 2|
|課金モード|On-Demand推奨|

12.3 属性定義

|   |   |   |   |
|---|---|---|---|
|属性名|型|必須|内容|
|contactId|String|必須|問い合わせID。UUID|
|createdAt|String|必須|送信日時。ISO 8601形式|
|name|String|必須|名前|
|email|String|必須|メールアドレス|
|subject|String|必須|件名|
|message|String|必須|本文|
|status|String|必須|new / read / done / spam|
|userAgent|String|任意|ブラウザ情報|
|sourcePage|String|任意|送信元ページ|

12.4 キー設計

|   |   |   |
|---|---|---|
|キー|属性|理由|
|Partition Key|contactId|問い合わせ単位で一意に取得するため|

12.5 GSI案

問い合わせ管理画面を作るまではGSI不要。

将来、ステータス別・日付順で管理したい場合に追加する。

|   |   |   |   |
|---|---|---|---|
|Index名|Partition Key|Sort Key|用途|
|StatusCreatedAtIndex|status|createdAt|未対応問い合わせ一覧|

12.6 保存例

{

  "contactId": "contact-7f8b2c9a",

  "createdAt": "2026-06-01T10:30:00+09:00",

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの説明について質問があります。",

  "status": "new",

  "userAgent": "Mozilla/5.0 ...",

  "sourcePage": "/contact"

}

12.7 バリデーションルール

|   |   |
|---|---|
|項目|ルール|
|name|必須、1〜100文字|
|email|必須、メール形式、255文字以内|
|subject|必須、1〜150文字|
|message|必須、1〜2,000文字|
|status|new / read / done / spam のいずれか|

12.8 セキュリティ注意点

|   |   |
|---|---|
|項目|内容|
|HTML無害化|本文にHTMLやscriptが含まれても表示時に実行しない|
|文字数制限|大量投稿によるコスト増加を防ぐ|
|CORS制限|フロントエンドのドメインのみ許可|
|スパム対策|honeypot項目やレート制限を検討する|

  

13. ユーザーデータ設計

13.1 データ概要

ユーザーデータは、Phase 4以降のログイン機能で利用する。

MVPでは実装しない。

認証情報はAmazon Cognitoで管理し、アプリ独自のプロフィールや設定情報はDynamoDBに保存する。

13.2 Cognito管理項目

|   |   |
|---|---|
|項目|内容|
|sub|CognitoユーザーID|
|email|メールアドレス|
|email_verified|メール認証状態|
|createdAt|ユーザー作成日時|

13.3 UserProfileTable

|   |   |
|---|---|
|項目|内容|
|テーブル名|UserProfileTable|
|用途|アプリ独自のユーザープロフィール保存|
|Phase|Phase 4|

13.4 属性定義

|   |   |   |   |
|---|---|---|---|
|属性名|型|必須|内容|
|userId|String|必須|Cognito sub|
|displayName|String|任意|表示名|
|email|String|必須|メールアドレス|
|targetExam|String|任意|CLF-C02 / SAA-C03|
|learningGoal|String|任意|学習目標|
|notificationEnabled|Boolean|任意|通知設定|
|createdAt|String|必須|作成日時|
|updatedAt|String|必須|更新日時|

13.5 キー設計

|   |   |
|---|---|
|キー|属性|
|Partition Key|userId|

13.6 保存例

{

  "userId": "cognito-sub-xxxx",

  "displayName": "fumi",

  "email": "user@example.com",

  "targetExam": "SAA-C03",

  "learningGoal": "2026年8月にSAA合格",

  "notificationEnabled": true,

  "createdAt": "2026-08-01T09:00:00+09:00",

  "updatedAt": "2026-08-01T09:00:00+09:00"

}

  

14. 回答履歴データ設計

14.1 データ概要

回答履歴データは、ユーザーがどの問題にどう回答したかを保存する。

Phase 4以降で利用する。

対象画面：

- マイページ
- 学習進捗
- 復習問題
- 弱点分析

14.2 DynamoDBテーブル設計

|   |   |
|---|---|
|項目|内容|
|テーブル名|UserAnswersTable|
|用途|ユーザー別回答履歴保存|
|Phase|Phase 4|
|課金モード|On-Demand推奨|

14.3 属性定義

|   |   |   |   |
|---|---|---|---|
|属性名|型|必須|内容|
|userId|String|必須|CognitoユーザーID|
|answerId|String|必須|回答ID|
|questionId|String|必須|問題ID|
|exam|String|必須|試験区分|
|category|String|必須|問題カテゴリ|
|selectedChoiceId|String|必須|選択した選択肢|
|correctChoiceId|String|必須|正解選択肢|
|isCorrect|Boolean|必須|正誤|
|answeredAt|String|必須|回答日時|
|elapsedSeconds|Number|任意|回答にかかった秒数|

14.4 キー設計

|   |   |   |
|---|---|---|
|キー|属性|理由|
|Partition Key|userId|ユーザー別に回答履歴を取得するため|
|Sort Key|answeredAt#questionId|日付順に履歴を取得するため|

14.5 GSI案

|   |   |   |   |
|---|---|---|---|
|Index名|Partition Key|Sort Key|用途|
|UserQuestionIndex|userId|questionId|特定問題の回答履歴確認|
|UserExamIndex|userId|exam|試験別の回答履歴取得|
|UserCategoryIndex|userId|category|カテゴリ別の回答履歴取得|

14.6 保存例

{

  "userId": "cognito-sub-xxxx",

  "answerId": "ans-20260801-001",

  "questionId": "clf-001",

  "exam": "CLF-C02",

  "category": "Cloud Concepts",

  "selectedChoiceId": "B",

  "correctChoiceId": "B",

  "isCorrect": true,

  "answeredAt": "2026-08-01T09:15:00+09:00",

  "elapsedSeconds": 23

}

  

15. 学習進捗データ設計

15.1 データ概要

学習進捗データは、ユーザーごとの正答率、回答数、苦手カテゴリ、復習対象を集計して保存する。

回答履歴から都度集計することも可能だが、表示速度を考慮して集計テーブルを持つ。

15.2 DynamoDBテーブル設計

|   |   |
|---|---|
|項目|内容|
|テーブル名|UserProgressTable|
|用途|ユーザー別学習進捗保存|
|Phase|Phase 4|

15.3 属性定義

|   |   |   |   |
|---|---|---|---|
|属性名|型|必須|内容|
|userId|String|必須|CognitoユーザーID|
|exam|String|必須|試験区分|
|totalAnswered|Number|必須|回答数|
|correctCount|Number|必須|正解数|
|incorrectCount|Number|必須|不正解数|
|accuracy|Number|必須|正答率|
|categoryStats|Map|任意|カテゴリ別成績|
|weakCategories|List|任意|苦手カテゴリ|
|reviewQuestionIds|List|任意|復習対象問題ID|
|lastAnsweredAt|String|任意|最終回答日時|
|updatedAt|String|必須|更新日時|

15.4 キー設計

|   |   |   |
|---|---|---|
|キー|属性|理由|
|Partition Key|userId|ユーザー別に取得するため|
|Sort Key|exam|試験別に進捗を分けるため|

15.5 保存例

{

  "userId": "cognito-sub-xxxx",

  "exam": "CLF-C02",

  "totalAnswered": 30,

  "correctCount": 24,

  "incorrectCount": 6,

  "accuracy": 80,

  "categoryStats": {

    "Cloud Concepts": {

      "answered": 10,

      "correct": 9,

      "accuracy": 90

    },

    "Security and Compliance": {

      "answered": 8,

      "correct": 5,

      "accuracy": 62.5

    }

  },

  "weakCategories": ["Security and Compliance"],

  "reviewQuestionIds": ["clf-004", "clf-012", "clf-018"],

  "lastAnsweredAt": "2026-08-01T10:00:00+09:00",

  "updatedAt": "2026-08-01T10:00:00+09:00"

}

  

16. 復習データ設計

16.1 データ概要

復習データは、ユーザーが間違えた問題や、一定期間後に再確認すべき問題を管理する。

MVPでは不要。Phase 4以降で実装する。

16.2 管理方式

最初はUserProgressTableのreviewQuestionIdsで管理する。

将来的に復習スケジュールを細かく管理する場合は、ReviewItemsTableを追加する。

16.3 ReviewItemsTable案

|   |   |   |   |
|---|---|---|---|
|属性名|型|必須|内容|
|userId|String|必須|CognitoユーザーID|
|reviewId|String|必須|復習ID|
|questionId|String|必須|問題ID|
|reason|String|必須|incorrect / bookmarked / scheduled|
|nextReviewAt|String|任意|次回復習予定日|
|reviewCount|Number|必須|復習回数|
|lastReviewedAt|String|任意|最終復習日|
|status|String|必須|active / done|

16.4 キー設計

|   |   |
|---|---|
|キー|属性|
|Partition Key|userId|
|Sort Key|nextReviewAt#questionId|

  

17. 毎日1問データ設計

17.1 データ概要

毎日1問データは、EventBridge + Lambda + SES / Slack通知で配信する問題を管理する。

Phase 4以降で実装する。

17.2 DailyQuestionTable

|   |   |   |   |
|---|---|---|---|
|属性名|型|必須|内容|
|date|String|必須|配信日。YYYY-MM-DD|
|questionId|String|必須|配信する問題ID|
|exam|String|必須|試験区分|
|title|String|任意|通知タイトル|
|message|String|任意|通知本文|
|sent|Boolean|必須|送信済みか|
|sentAt|String|任意|送信日時|

17.3 キー設計

|   |   |
|---|---|
|キー|属性|
|Partition Key|date|

17.4 保存例

{

  "date": "2026-08-02",

  "questionId": "clf-015",

  "exam": "CLF-C02",

  "title": "今日のAWS 1問",

  "message": "今日はIAMロールに関する問題です。",

  "sent": false,

  "sentAt": null

}

  

18. DynamoDB全体設計

18.1 テーブル一覧

|   |   |   |   |
|---|---|---|---|
|テーブル名|用途|Phase|MVP必須|
|ContactsTable|問い合わせ保存|Phase 2|必須|
|TermsTable|AWS用語保存|Phase 2以降|任意|
|QuestionsTable|模擬問題保存|Phase 2以降|任意|
|UserProfileTable|ユーザープロフィール|Phase 4|対象外|
|UserAnswersTable|回答履歴|Phase 4|対象外|
|UserProgressTable|学習進捗|Phase 4|対象外|
|ReviewItemsTable|復習管理|Phase 4以降|対象外|
|DailyQuestionTable|毎日1問配信|Phase 4以降|対象外|

18.2 課金モード

個人開発MVPでは、DynamoDBはOn-Demandを推奨する。

理由：

- アクセス数が読めないため
- 初期アクセスが少ない場合、無駄なキャパシティを確保しなくてよい
- 管理が簡単
- 個人開発ではスパイクにも対応しやすい

18.3 命名方針

|   |   |
|---|---|
|環境|テーブル名例|
|dev|ContactsTableDev|
|prod|ContactsTableProd|

MVPでは本番環境のみでもよいが、将来的な環境分離を考え、命名には環境名を付けられるようにする。

  

19. データ取得方針

19.1 静的取得

以下はビルド時または静的ファイルとして取得する。

|   |   |
|---|---|
|データ|取得方法|
|用語データ|JSON import|
|問題データ|JSON import|
|比較記事|MDX読み込み|
|ブログ記事|MDX読み込み|
|構成図記事|MDX読み込み|
|運営者情報|静的ページ|
|プライバシーポリシー|静的ページ|

19.2 API取得

以下はAPI経由で取得・保存する。

|   |   |   |
|---|---|---|
|データ|API|Phase|
|問い合わせ送信|POST /contact|Phase 2|
|用語一覧|GET /terms|任意|
|問題一覧|GET /questions/clf|任意|
|回答履歴保存|POST /answers|Phase 4|
|学習進捗取得|GET /progress|Phase 4|

19.3 MVPでの推奨

MVPでは、問い合わせ以外は静的データ管理を推奨する。

理由：

- 開発が速い
- AWSコストが低い
- SEOに強い
- CloudFrontキャッシュを活用しやすい
- データベース設計で詰まりにくい

  

20. データ更新フロー

20.1 MVPのコンテンツ更新フロー

1. ローカルでJSON / MDXを編集する

2. GitHubにコミットする

3. GitHub Actionsでビルドする

4. S3へデプロイする

5. CloudFrontキャッシュを無効化する

6. 本番サイトで表示確認する

20.2 問い合わせ保存フロー

1. ユーザーが問い合わせフォームを入力する

2. フロントエンドでバリデーションする

3. API GatewayへPOSTする

4. Lambdaで再度バリデーションする

5. DynamoDB ContactsTableへ保存する

6. 成功レスポンスを返す

7. フロントエンドで完了メッセージを表示する

20.3 Phase 4の回答履歴保存フロー

1. ログインユーザーが問題に回答する

2. フロントエンドが回答データをAPIへ送信する

3. API GatewayがCognito JWTを検証する

4. Lambdaが回答データをUserAnswersTableへ保存する

5. LambdaがUserProgressTableを更新する

6. フロントエンドが正答率や復習対象を表示する

  

7. TypeScript型定義

21.1 Term型

export type ExamScope = 'CLF-C02' | 'SAA-C03';

  

export type TermCategory =

  | 'Compute'

  | 'Storage'

  | 'Database'

  | 'Networking'

  | 'Security'

  | 'Monitoring'

  | 'Integration'

  | 'Analytics'

  | 'Management';

  

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

  

export type AwsTerm = {

  termId: string;

  name: string;

  shortName: string;

  category: TermCategory;

  level: DifficultyLevel;

  examScopes: ExamScope[];

  summary: string;

  oneLine: string;

  useCases: string[];

  examPoints: string[];

  saaPoints?: string[];

  relatedServices?: string[];

  comparisonSlugs?: string[];

  architectureSlugs?: string[];

  tags?: string[];

  costNotes?: string[];

  securityNotes?: string[];

  updatedAt: string;

};

21.2 Question型

export type QuestionChoice = {

  choiceId: 'A' | 'B' | 'C' | 'D';

  text: string;

};

  

export type Question = {

  questionId: string;

  exam: 'CLF-C02' | 'SAA-C03';

  category: string;

  domain: string;

  difficulty: 'easy' | 'normal' | 'hard';

  question: string;

  choices: QuestionChoice[];

  correctChoiceId: 'A' | 'B' | 'C' | 'D';

  explanation: string;

  choiceExplanations?: Record<string, string>;

  relatedServices?: string[];

  relatedTerms?: string[];

  relatedComparisons?: string[];

  tags?: string[];

  published: boolean;

  createdAt: string;

  updatedAt: string;

};

21.3 ComparisonMeta型

export type ComparisonMeta = {

  comparisonId: string;

  slug: string;

  title: string;

  description: string;

  category: string;

  level: DifficultyLevel;

  examScopes: ExamScope[];

  services: string[];

  tags?: string[];

  priority?: 'high' | 'medium' | 'low';

  published: boolean;

  publishedAt: string;

  updatedAt: string;

};

21.4 ArchitectureMeta型

export type ArchitectureMeta = {

  architectureId: string;

  slug: string;

  title: string;

  description: string;

  category: string;

  level: DifficultyLevel;

  examScopes: ExamScope[];

  services: string[];

  tags?: string[];

  diagramPath?: string;

  mermaid?: boolean;

  published: boolean;

  publishedAt: string;

  updatedAt: string;

};

21.5 BlogPostMeta型

export type BlogPostMeta = {

  postId: string;

  slug: string;

  title: string;

  description: string;

  category: string;

  tags?: string[];

  targetKeywords?: string[];

  author: string;

  eyeCatch?: string;

  published: boolean;

  publishedAt: string;

  updatedAt: string;

};

21.6 Contact型

export type ContactInput = {

  name: string;

  email: string;

  subject: string;

  message: string;

  sourcePage?: string;

};

  

export type ContactRecord = ContactInput & {

  contactId: string;

  createdAt: string;

  status: 'new' | 'read' | 'done' | 'spam';

  userAgent?: string;

};

21.7 UserAnswer型

export type UserAnswer = {

  userId: string;

  answerId: string;

  questionId: string;

  exam: 'CLF-C02' | 'SAA-C03';

  category: string;

  selectedChoiceId: 'A' | 'B' | 'C' | 'D';

  correctChoiceId: 'A' | 'B' | 'C' | 'D';

  isCorrect: boolean;

  answeredAt: string;

  elapsedSeconds?: number;

};

21.8 UserProgress型

export type CategoryStat = {

  answered: number;

  correct: number;

  accuracy: number;

};

  

export type UserProgress = {

  userId: string;

  exam: 'CLF-C02' | 'SAA-C03';

  totalAnswered: number;

  correctCount: number;

  incorrectCount: number;

  accuracy: number;

  categoryStats?: Record<string, CategoryStat>;

  weakCategories?: string[];

  reviewQuestionIds?: string[];

  lastAnsweredAt?: string;

  updatedAt: string;

};

  

22. バリデーション設計

22.1 共通バリデーション方針

|   |   |
|---|---|
|方針|内容|
|フロント・バック両方で検証|フロントだけに依存しない|
|文字数制限|コスト増加・スパム対策|
|型チェック|TypeScriptとLambda側で実施|
|必須チェック|required項目は必ず検証|
|不正文字対策|HTML/scriptを無害化する|

22.2 問い合わせバリデーション

|   |   |   |
|---|---|---|
|項目|ルール|エラーメッセージ例|
|name|1〜100文字|名前を入力してください|
|email|メール形式、255文字以内|正しいメールアドレスを入力してください|
|subject|1〜150文字|件名を入力してください|
|message|1〜2,000文字|本文を入力してください|

22.3 問題データバリデーション

|   |   |
|---|---|
|項目|ルール|
|questionId|重複不可|
|choices|4件必須|
|correctChoiceId|choices内に存在すること|
|explanation|空文字不可|
|exam|CLF-C02 / SAA-C03 のいずれか|
|difficulty|easy / normal / hard のいずれか|

22.4 用語データバリデーション

|   |   |
|---|---|
|項目|ルール|
|termId|重複不可、英数字とハイフンのみ|
|name|必須|
|category|定義済みカテゴリのみ|
|summary|必須|
|examPoints|1件以上|
|updatedAt|日付形式|

  

23. データ移行方針

23.1 JSONからDynamoDBへの移行

Phase 2以降で、必要に応じてJSONデータをDynamoDBへ移行する。

対象候補：

- TermsTable
- QuestionsTable

23.2 移行手順

1. JSONデータを検証する

2. DynamoDBテーブルを作成する

3. 移行用Pythonスクリプトを作成する

4. JSONを読み込む

5. PutItem / BatchWriteItemで登録する

6. 登録件数を確認する

7. API経由で取得確認する

8. フロントエンドの取得元をJSONからAPIへ切り替える

23.3 移行用スクリプト配置

scripts/

├── migrate_terms_to_dynamodb.py

├── migrate_questions_to_dynamodb.py

└── validate_contents.py

23.4 移行時の注意点

|   |   |
|---|---|
|注意点|内容|
|ID重複|termId、questionIdの重複を事前チェックする|
|型不一致|DynamoDBに保存できる型に変換する|
|大量書き込み|BatchWriteItemを使う場合はリトライ処理を入れる|
|コスト|不要な移行テストを繰り返さない|
|原本管理|移行後も原本をGitHubに残すか方針を決める|

  

24. データバックアップ方針

24.1 静的コンテンツ

静的コンテンツの原本はGitHubで管理する。

対象：

- terms.json
- questions JSON
- comparison MDX
- architecture MDX
- blog MDX
- images

復旧方法：

GitHubから再ビルド → S3へ再デプロイ

24.2 DynamoDBデータ

MVPでは問い合わせデータのみDynamoDBに保存する。

|   |   |
|---|---|
|データ|バックアップ方針|
|ContactsTable|必要に応じてCSVエクスポート|
|UserAnswersTable|Phase 4以降、PITR検討|
|UserProgressTable|再集計可能だが、PITR検討|

24.3 重要度分類

|   |   |   |
|---|---|---|
|データ|重要度|理由|
|ブログ・用語・問題原本|高|サイト価値の中心。GitHub管理|
|問い合わせ|中|ユーザー連絡情報。漏えい対策も必要|
|学習履歴|高|ユーザー体験に直結|
|画像|中|再作成可能だが手間がかかる|
|アクセス解析|低|Google側で管理|

  

25. データセキュリティ設計

25.1 個人情報の扱い

個人情報に該当する可能性があるデータ：

- 問い合わせの名前
- メールアドレス
- 問い合わせ本文
- 将来のユーザー登録メールアドレス

25.2 保護方針

|   |   |
|---|---|
|方針|内容|
|最小収集|必要な情報だけ取得する|
|最小権限|Lambdaから対象テーブルへの必要最小限の権限のみ付与|
|公開禁止|問い合わせデータはフロントエンドに公開しない|
|ログ注意|個人情報をCloudWatch Logsに出しすぎない|
|GitHub注意|問い合わせデータやメールアドレスをコミットしない|

25.3 CloudWatch Logs注意点

Lambdaログに以下をそのまま出力しない。

- メールアドレス
- 問い合わせ本文全文
- JWTトークン
- APIキー
- AWS認証情報

ログ出力例：

OK: contact submitted contactId=contact-xxxx

NG: validation error field=email

  

26. データ保持期間

26.1 MVP方針

|   |   |
|---|---|
|データ|保持期間|
|静的コンテンツ|削除しない限り保持|
|問い合わせデータ|1年を目安に見直し|
|CloudWatch Logs|14日〜30日を推奨|

26.2 将来方針

|   |   |
|---|---|
|データ|保持期間|
|ユーザー情報|退会まで|
|回答履歴|退会まで、または一定期間|
|学習進捗|退会まで|
|退会ユーザー情報|削除または匿名化|

  

27. SEO用メタデータ設計

27.1 共通SEO項目

以下のページにはSEOメタデータを設定する。

- 用語詳細
- 比較詳細
- 構成図詳細
- ブログ詳細
- 学習ロードマップ

27.2 SEOメタデータ項目

|   |   |
|---|---|
|項目|内容|
|title|検索結果に表示されるタイトル|
|description|検索結果に表示される説明文|
|canonical|正規URL|
|ogTitle|SNSシェア用タイトル|
|ogDescription|SNSシェア用説明|
|ogImage|OGP画像|
|updatedAt|更新日|

27.3 OGP画像方針

|   |   |
|---|---|
|ページ|OGP画像|
|トップ|サイト共通OGP|
|用語詳細|サービスカテゴリ別OGP|
|比較詳細|比較記事共通OGP|
|ブログ詳細|記事別OGP|
|構成図詳細|構成図画像または専用OGP|

  

28. サイトマップ生成データ

28.1 サイトマップ対象

|   |   |
|---|---|
|対象|含めるか|
|トップページ|含める|
|用語詳細|含める|
|比較詳細|含める|
|模擬問題詳細|原則含める|
|構成図詳細|含める|
|ブログ詳細|含める|
|問い合わせ|含めてもよい|
|プライバシーポリシー|含めてもよい|
|ログイン|含めない|
|マイページ|含めない|

28.2 サイトマップ生成に必要なデータ

|   |   |
|---|---|
|項目|取得元|
|URL|slug|
|lastmod|updatedAt|
|priority|ページ種別|
|changefreq|ページ種別|

  

29. データ命名規則

29.1 ID命名

|   |   |   |
|---|---|---|
|データ|命名形式|例|
|AWS用語|小文字サービス名|s3, lambda, cloudfront|
|比較記事|cmp-連番3桁|cmp-001|
|模擬問題|試験略称-連番3桁|clf-001, saa-001|
|構成図|arc-連番3桁|arc-001|
|ブログ|blog-連番3桁|blog-001|
|問い合わせ|contact-ランダムID|contact-7f8b2c9a|
|回答|ans-日付-連番|ans-20260801-001|

29.2 slug命名

|   |   |   |
|---|---|---|
|データ|命名形式|例|
|用語|termIdと同じ|s3|
|比較|service-vs-service|s3-vs-ebs-vs-efs|
|構成図|内容を英語で表現|serverless-api-basic|
|ブログ|SEOキーワードを英語化|aws-free-tier-portfolio|

29.3 日付形式

日付はISO 8601形式を基本とする。

2026-06-01

2026-06-01T10:30:00+09:00

  

30. MVP実装時の最小データセット

30.1 最小公開に必要なデータ

|   |   |
|---|---|
|データ|最小件数|
|AWS用語|30件|
|CLF模擬問題|30問|
|サービス比較|5本|
|構成図|5本|
|ブログ記事|5本|
|運営者情報|1ページ|
|プライバシーポリシー|1ページ|
|免責事項|1ページ|

30.2 AdSense申請前の目標データ

|   |   |
|---|---|
|データ|目標件数|
|AWS用語|50件以上|
|CLF模擬問題|50問以上|
|SAA模擬問題|30問以上|
|サービス比較|10本以上|
|構成図|10本以上|
|ブログ記事|20本以上|

  

31. データ設計上の重要な判断

31.1 なぜMVPではMarkdown/JSON中心にするのか

理由は以下である。

- 開発が速い
- コストが低い
- GitHubで履歴管理しやすい
- SEOと相性が良い
- DB設計に時間を使いすぎずに公開できる
- CloudFrontで高速配信しやすい

31.2 なぜ問い合わせだけDynamoDBにするのか

問い合わせはユーザー入力によって発生する動的データであり、静的ファイルでは保存できないため。

また、Lambda + API Gateway + DynamoDB の実装経験をポートフォリオで示せるため、MVPでも導入価値が高い。

31.3 なぜ問題データを最初からDynamoDBにしないのか

MVP段階では、問題データは頻繁に管理画面から更新する必要がない。

JSON管理の方が以下の点で有利である。

- 編集しやすい
- レビューしやすい
- GitHubで差分管理できる
- API実装なしで表示できる
- コストがかからない

ただし、将来的に以下を実装する場合はDynamoDB化する。

- 管理画面から問題追加
- ランダム出題API
- ユーザー別出題最適化
- 正答率に応じた問題推薦

  

32. 受け入れ基準

32.1 MVPデータ設計の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-DATA-001|AWS用語データのJSON構造が定義されている|
|AC-DATA-002|模擬問題データのJSON構造が定義されている|
|AC-DATA-003|比較記事のFrontmatter構造が定義されている|
|AC-DATA-004|構成図記事のFrontmatter構造が定義されている|
|AC-DATA-005|ブログ記事のFrontmatter構造が定義されている|
|AC-DATA-006|問い合わせデータのDynamoDB設計が定義されている|
|AC-DATA-007|MVPでDynamoDB化するデータとしないデータが明確である|
|AC-DATA-008|TypeScript型定義が用意されている|

32.2 Phase 4データ設計の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-DATA-009|ユーザーデータ設計が定義されている|
|AC-DATA-010|回答履歴データ設計が定義されている|
|AC-DATA-011|学習進捗データ設計が定義されている|
|AC-DATA-012|復習データ設計が定義されている|
|AC-DATA-013|毎日1問配信データ設計が定義されている|

  

33. 今後作成する関連設計書

本データ設計書の次に、以下を作成する。

1. API設計書
2. セキュリティ設計書
3. コスト管理設計書
4. 開発タスク一覧
5. GitHub README草案
6. 初期データ作成テンプレート

  

7. 結論

本プロダクトのデータ設計では、MVP段階ではMarkdown / MDX / JSONを中心に管理し、動的データである問い合わせのみDynamoDBに保存する。

これにより、以下を実現する。

- 開発スピードを上げる
- AWS利用コストを抑える
- SEOに強い静的ページを作る
- GitHubでコンテンツを安全に管理する
- Lambda + API Gateway + DynamoDBの実装経験も示す

将来的には、Cognitoによる認証を追加し、ユーザー別の回答履歴、学習進捗、復習問題、弱点分析をDynamoDBに保存することで、単なる学習メディアから学習アプリへ拡張する。

この設計により、AWS資格学習サイトとしての実用性、ポートフォリオとしての説明力、将来的な収益化・SaaS化の拡張性を両立できる。