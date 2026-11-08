AWS Certification Learning Site: Data Design

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Learning Site: Data Design|
|Target product|AWS Certification Roadmap Lab|
|Target phases|MVP development → SAA preparation feature expansion → Learning application|
|Purpose|Define the types, storage locations, structures, DynamoDB design, and JSON/Markdown management policies for site data|
|Planned technologies|Next.js / TypeScript / Markdown / JSON / AWS Lambda / API Gateway / DynamoDB|

  

2. Purpose of This Design Document

This document defines the data used by the AWS certification learning site, AWS Certification Roadmap Lab.

The product handles the following types of data.

- AWS glossary data
- AWS service comparison data
- Practice question data
- AWS architecture diagram data
- Blog post data
- Contact inquiry data
- Static operator and policy data
- Future user data
- Future learning history data
- Future weak-area analysis data

The MVP primarily uses Markdown / MDX / JSON to keep costs low and development simple.

From Phase 2 onward, contact inquiries and some question data will be stored in DynamoDB.

From Phase 4 onward, Cognito authentication will be introduced, and per-user learning history, accuracy, and review items will be stored in DynamoDB.

  

3. Basic Data Design Policies

3.1 Basic Policies

|   |   |
|---|---|
|Policy|Description|
|Static data first for the MVP|Manage glossary entries, comparisons, articles, architecture diagrams, and questions in Markdown/JSON|
|DynamoDB only for dynamic data|Store inquiries, future answer history, and learning progress in DynamoDB|
|Source files managed in GitHub|Manage source glossary entries, questions, articles, and architecture diagrams in GitHub|
|Prioritize low cost|Minimize database access in the MVP and serve static content through S3 + CloudFront|
|Ensure extensibility|Define clear JSON structures to allow future migration to DynamoDB and APIs|
|Prioritize SEO|Require title, description, and slug for blog posts, comparisons, and glossary detail pages|
|Plan for a learning application|Design for future per-user learning history and weak-area analysis|

  

4. Data Classification

4.1 Data Inventory

|   |   |   |   |   |
|---|---|---|---|---|
|Data type|Description|MVP storage|Future storage|Update frequency|
|AWS glossary data|AWS service overviews, use cases, and exam points|JSON / MDX|DynamoDB optional|Medium|
|Service comparison data|Articles comparing similar AWS services|MDX|Primarily MDX|Medium|
|Practice question data|CLF/SAA practice questions|JSON|DynamoDB|High|
|Architecture diagram data|AWS architecture diagrams and design explanations|MDX + images|Primarily MDX|Medium|
|Blog post data|SEO articles|MDX|Primarily MDX|High|
|Contact inquiry data|User inquiries|DynamoDB|DynamoDB|Low to medium|
|Operator information|Site operator information|Static pages|Static pages|Low|
|Privacy policy|Personal information, cookies, and advertising disclosures|Static pages|Static pages|Low|
|User data|Signed-in user information|Out of scope|Cognito + DynamoDB|Medium|
|Answer history data|Users' question-answer history|Out of scope|DynamoDB|High|
|Learning progress data|Accuracy and weak categories|Out of scope|DynamoDB|High|
|Daily question data|Questions selected for notifications|Out of scope|DynamoDB|Medium|

  

5. MVP Data Management Policies

5.1 MVP Storage Policy

Manage MVP data as follows.

|   |   |   |
|---|---|---|
|Data|Storage format|Reason|
|AWS glossary|JSON|Easy to use for lists, search, and detail views|
|Practice questions|JSON|Easy to check answers on the client|
|Service comparisons|MDX|Supports flexible tables, prose, and internal links|
|Blog posts|MDX|Easy to manage as SEO articles|
|Architecture explanations|MDX + images|Easy to combine diagrams and text|
|Contact inquiries|DynamoDB|User input must be stored|
|Operator information|Static pages|Infrequently updated|
|Privacy policy|Static pages|Infrequently updated|

5.2 Data Stored in DynamoDB for the MVP

Keep DynamoDB storage to a minimum in the MVP.

|   |   |   |
|---|---|---|
|Data|DynamoDB storage|Reason|
|Contact inquiry data|Required|User input must be stored|
|AWS glossary data|Optional|JSON management is sufficient for the MVP|
|Practice question data|Optional|JSON management is sufficient for the MVP|
|Learning history|Out of scope|No sign-in functionality|
|User information|Out of scope|Cognito has not yet been introduced|

5.3 Data Not Exposed through APIs in the MVP

The following data will not use APIs in the MVP.

|   |   |
|---|---|
|Data|Reason|
|Blog posts|Static generation offers advantages in SEO, speed, and cost|
|Service comparison articles|Static pages are sufficient|
|Architecture explanations|Static pages are sufficient|
|Privacy policy|Static pages are sufficient|
|Operator information|Static pages are sufficient|

  

6. Directory Structure

6.1 Recommended Content Directory

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

6.2 Backend Directory

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

6.3 Infrastructure Directory

infra/

├── sam-template.yaml

├── dynamodb/

│   └── tables.md

├── policies/

│   └── iam-policy-notes.md

└── README.md

  

7. AWS Glossary Data Design

7.1 Data Overview

AWS glossary data manages AWS service overviews, use cases, certification exam points, and differences from similar services.

Applicable screens:

- AWS glossary list
- AWS glossary details
- Related links in service comparison details
- Related links in practice question explanations
- Links to services used in architecture details

7.2 Storage Format

Manage in JSON for the MVP.

frontend/contents/terms/terms.json

Migrate to DynamoDB if an administration interface or search API is added in the future.

7.3 JSON Structure (Japanese Localized Content Specimen)

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

7.4 Field Definitions

|   |   |   |   |
|---|---|---|---|
|Field|Type|Required|Description|
|termId|string|Required|Glossary entry ID; also used in the URL|
|name|string|Required|Official service name|
|shortName|string|Required|Abbreviated name|
|category|string|Required|Service category|
|level|string|Required|beginner / intermediate / advanced|
|examScopes|string[]|Required|Target exams|
|summary|string|Required|Overview|
|oneLine|string|Required|One-line description|
|useCases|string[]|Required|Main use cases|
|examPoints|string[]|Required|CLF exam points|
|saaPoints|string[]|Optional|SAA exam points|
|relatedServices|string[]|Optional|Related service IDs|
|comparisonSlugs|string[]|Optional|Related comparison articles|
|architectureSlugs|string[]|Optional|Related architecture diagrams|
|tags|string[]|Optional|Tags|
|costNotes|string[]|Optional|Cost considerations|
|securityNotes|string[]|Optional|Security considerations|
|updatedAt|string|Required|Last updated date|

7.5 Category Definitions

|   |   |   |
|---|---|---|
|category|Description|Examples|
|Compute|Computing|EC2, Lambda, ECS|
|Storage|Storage|S3, EBS, EFS|
|Database|Databases|RDS, DynamoDB, Aurora|
|Networking|Networking|VPC, Route 53, CloudFront|
|Security|Security|IAM, KMS, WAF|
|Monitoring|Monitoring and logging|CloudWatch, CloudTrail, Config|
|Integration|Application integration|SQS, SNS, EventBridge|
|Analytics|Analytics|Athena, Glue, QuickSight|
|Management|Management|Organizations, Budgets, Cost Explorer|

7.6 Initial Entries

At minimum, include the following AWS glossary entries in the MVP.

|   |   |
|---|---|
|Priority|Service|
|High|IAM|
|High|S3|
|High|EC2|
|High|Lambda|
|High|VPC|
|High|RDS|
|High|DynamoDB|
|High|CloudFront|
|High|Route 53|
|High|CloudWatch|
|High|CloudTrail|
|High|API Gateway|
|High|SQS|
|High|SNS|
|High|EventBridge|
|Medium|EBS|
|Medium|EFS|
|Medium|ELB|
|Medium|Auto Scaling|
|Medium|ACM|
|Medium|KMS|
|Medium|WAF|
|Medium|AWS Budgets|
|Medium|Cost Explorer|
|Medium|Organizations|
|Medium|AWS Config|
|Medium|Secrets Manager|
|Medium|Systems Manager|
|Medium|CloudFormation|
|Medium|Cognito|



8. Service Comparison Data Design

8.1 Data Overview

Service comparison data manages comparison tables and explanations of differences between AWS services that are easily confused on exams.

Applicable screens:

- Service comparison list
- Service comparison details
- Related comparisons in AWS glossary details
- Links within blog posts
- Links within practice question explanations

8.2 Storage Format

Manage in MDX for the MVP.

frontend/contents/comparisons/s3-vs-ebs-vs-efs.mdx

8.3 Frontmatter Structure (Japanese Localized Content Specimen)

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

8.4 Body Structure (Japanese Localized Content Specimen)

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

8.5 Field Definitions

|   |   |   |   |
|---|---|---|---|
|Field|Type|Required|Description|
|comparisonId|string|Required|Comparison article ID|
|slug|string|Required|URL slug|
|title|string|Required|SEO title|
|description|string|Required|SEO description|
|category|string|Required|Category|
|level|string|Required|Difficulty|
|examScopes|string[]|Required|Target exams|
|services|string[]|Required|IDs of services being compared|
|tags|string[]|Optional|Tags|
|priority|string|Optional|high / medium / low|
|published|boolean|Required|Publication status|
|publishedAt|string|Required|Publication date|
|updatedAt|string|Required|Last updated date|

8.6 Initial Articles

|   |   |   |   |
|---|---|---|---|
|comparisonId|slug|title|Priority|
|cmp-001|s3-vs-ebs-vs-efs|Differences between S3, EBS, and EFS|High|
|cmp-002|rds-vs-dynamodb|Differences between RDS and DynamoDB|High|
|cmp-003|sns-vs-sqs-vs-eventbridge|Differences between SNS, SQS, and EventBridge|High|
|cmp-004|iam-user-vs-role-vs-policy|Differences between IAM users, IAM roles, and IAM policies|High|
|cmp-005|cloudwatch-vs-cloudtrail-vs-config|Differences between CloudWatch, CloudTrail, and AWS Config|High|
|cmp-006|alb-vs-nlb-vs-cloudfront|Differences between ALB, NLB, and CloudFront|Medium|
|cmp-007|multi-az-vs-read-replica|Differences between Multi-AZ and Read Replica|Medium|
|cmp-008|security-group-vs-nacl|Differences between Security Group and NACL|Medium|

  

9. Practice Question Data Design

9.1 Data Overview

Practice question data manages questions for AWS Cloud Practitioner / SAA certification preparation.

Create 30 Cloud Practitioner questions for the MVP.

Applicable screens:

- Practice question landing page
- CLF practice question list
- Practice question details
- Related questions in glossary details
- Future learning history and weak-area analysis

9.2 Storage Format

Manage in JSON for the MVP.

frontend/contents/questions/clf-c02.json

Allow migration to DynamoDB from Phase 2 onward.

9.3 JSON Structure (Japanese Localized Content Specimen)

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

9.4 Field Definitions

|   |   |   |   |
|---|---|---|---|
|Field|Type|Required|Description|
|questionId|string|Required|Question ID; example: clf-001|
|exam|string|Required|Exam type: CLF-C02 / SAA-C03|
|category|string|Required|Question category|
|domain|string|Required|Exam domain|
|difficulty|string|Required|easy / normal / hard|
|question|string|Required|Question text|
|choices|object[]|Required|Answer choices|
|correctChoiceId|string|Required|Correct choice ID|
|explanation|string|Required|Overall explanation|
|choiceExplanations|object|Optional|Explanation for each choice|
|relatedServices|string[]|Optional|Related AWS services|
|relatedTerms|string[]|Optional|Related glossary entries|
|relatedComparisons|string[]|Optional|Related comparison articles|
|tags|string[]|Optional|Tags|
|published|boolean|Required|Publication status|
|createdAt|string|Required|Creation date|
|updatedAt|string|Required|Last updated date|

9.5 CLF-C02 Category Definitions

|   |   |
|---|---|
|category|Description|
|Cloud Concepts|Cloud concepts, benefits, and the shared responsibility model|
|Security and Compliance|Security, IAM, and compliance|
|Cloud Technology and Services|Core AWS services, deployment, and operations|
|Billing, Pricing, and Support|Pricing, billing, support, and cost management|

9.6 SAA-C03 Category Definitions

Used from Phase 2 onward.

|   |   |
|---|---|
|category|Description|
|Secure Architectures|Secure design|
|Resilient Architectures|Fault-tolerant and highly available design|
|High-Performing Architectures|Performance-oriented design|
|Cost-Optimized Architectures|Cost-optimized design|

9.7 Question ID Rules

|   |   |   |
|---|---|---|
|Exam|ID format|Example|
|Cloud Practitioner|clf- followed by a three-digit sequence number|clf-001|
|Solutions Architect Associate|saa- followed by a three-digit sequence number|saa-001|

9.8 Initial MVP Question Counts

|   |   |   |
|---|---|---|
|Exam|Question count|Priority|
|CLF-C02|30 questions|High|
|SAA-C03|0 questions|Phase 2 onward|

9.9 Target Question Counts from Phase 2 Onward

|   |   |
|---|---|
|Exam|Target question count|
|CLF-C02|100 questions|
|SAA-C03|100 questions|

  

10. Architecture Diagram Data Design

10.1 Data Overview

Architecture diagram data manages AWS architectures for SAA preparation and portfolio explanations.

Applicable screens:

- Architecture diagram list
- Architecture diagram details
- Related architecture diagrams in AWS glossary details
- Links within blog posts
- GitHub README

10.2 Storage Format

Manage in MDX + images for the MVP.

frontend/contents/architectures/serverless-api-basic.mdx

frontend/public/images/architectures/serverless-api-basic.png

10.3 Frontmatter Structure (Japanese Localized Content Specimen)

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

10.4 Body Structure (Japanese Localized Content Specimen)

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

10.5 Field Definitions

|   |   |   |   |
|---|---|---|---|
|Field|Type|Required|Description|
|architectureId|string|Required|Architecture diagram ID|
|slug|string|Required|URL slug|
|title|string|Required|Title|
|description|string|Required|SEO description|
|category|string|Required|Architecture category|
|level|string|Required|Difficulty|
|examScopes|string[]|Required|Target exams|
|services|string[]|Required|IDs of AWS services used|
|tags|string[]|Optional|Tags|
|diagramPath|string|Optional|Architecture diagram image path|
|mermaid|boolean|Optional|Whether a Mermaid diagram is included|
|published|boolean|Required|Publication status|
|publishedAt|string|Required|Publication date|
|updatedAt|string|Required|Last updated date|

10.6 Initial Architectures

|   |   |   |   |
|---|---|---|---|
|architectureId|slug|title|Priority|
|arc-001|static-site-s3-cloudfront|S3 + CloudFront static website architecture|High|
|arc-002|serverless-api-basic|API Gateway + Lambda + DynamoDB serverless API architecture|High|
|arc-003|three-tier-vpc|Three-tier web application architecture in a VPC|Medium|
|arc-004|high-availability-web-app|ALB + Auto Scaling + RDS Multi-AZ high-availability architecture|Medium|
|arc-005|eventbridge-lambda-batch|EventBridge + Lambda batch processing architecture|Medium|

  

11. Blog Post Data Design

11.1 Data Overview

Blog post data manages articles aimed at attracting SEO traffic and generating advertising revenue.

Applicable screens:

- Blog list
- Blog details
- Latest articles on the home page
- Related article display
- Sitemap generation

11.2 Storage Format

Manage in MDX.

frontend/contents/blog/aws-free-tier-portfolio.mdx

11.3 Frontmatter Structure (Japanese Localized Content Specimen)

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

11.4 Body Structure (Japanese Localized Content Specimen)

# AWS無料枠でポートフォリオを作る方法

  

## 結論

  

## AWS無料枠で作れる構成

  

## 使うサービス

  

## 課金リスクがあるサービス

  

## 実装ステップ

  

## ポートフォリオとして見せるポイント

  

## まとめ

11.5 Field Definitions

|   |   |   |   |
|---|---|---|---|
|Field|Type|Required|Description|
|postId|string|Required|Post ID|
|slug|string|Required|URL slug|
|title|string|Required|SEO title|
|description|string|Required|SEO description|
|category|string|Required|Article category|
|tags|string[]|Optional|Tags|
|targetKeywords|string[]|Optional|Target SEO keywords|
|author|string|Required|Author|
|eyeCatch|string|Optional|Featured image|
|published|boolean|Required|Publication status|
|publishedAt|string|Required|Publication date|
|updatedAt|string|Required|Last updated date|

11.6 Initial Articles

|   |   |   |   |
|---|---|---|---|
|postId|slug|title|Priority|
|blog-001|aws-cloud-practitioner-roadmap|How to study for AWS Cloud Practitioner|High|
|blog-002|aws-free-tier-portfolio|How to build a portfolio with the AWS Free Tier|High|
|blog-003|s3-cloudfront-static-site|How to publish a static site with S3 and CloudFront|High|
|blog-004|lambda-api-gateway-beginner|A beginner's guide to Lambda and API Gateway|Medium|
|blog-005|dynamodb-vs-rds-beginner|Differences between DynamoDB and RDS|Medium|

11.7 Article Targets before Applying for AdSense

Prepare at least 20 articles before applying for AdSense.

|   |   |
|---|---|
|Category|Target article count|
|CLF preparation|5 articles|
|SAA preparation|5 articles|
|AWS service explanations|5 articles|
|AWS Free Tier and portfolios|3 articles|
|Serverless implementation|2 articles|

  

12. Contact Inquiry Data Design

12.1 Data Overview

Contact inquiry data stores user inquiries, error reports, work requests, and feedback.

Applicable screen:

- Contact page

Storage destination:

- DynamoDB ContactsTable

12.2 DynamoDB Table Design

|   |   |
|---|---|
|Item|Description|
|Table name|ContactsTable|
|Purpose|Store contact inquiry data|
|Phase|Phase 2|
|Billing mode|On-Demand recommended|

12.3 Attribute Definitions

|   |   |   |   |
|---|---|---|---|
|Attribute name|Type|Required|Description|
|contactId|String|Required|Contact inquiry ID; UUID|
|createdAt|String|Required|Submission timestamp in ISO 8601 format|
|name|String|Required|Name|
|email|String|Required|Email address|
|subject|String|Required|Subject|
|message|String|Required|Message body|
|status|String|Required|new / read / done / spam|
|userAgent|String|Optional|Browser information|
|sourcePage|String|Optional|Submission source page|

12.4 Key Design

|   |   |   |
|---|---|---|
|Key|Attribute|Reason|
|Partition Key|contactId|Retrieve each inquiry uniquely|

12.5 Proposed GSI

A GSI is unnecessary until a contact inquiry administration interface is built.

Add one in the future if inquiries need to be managed by status and date.

|   |   |   |   |
|---|---|---|---|
|Index name|Partition Key|Sort Key|Purpose|
|StatusCreatedAtIndex|status|createdAt|List inquiries awaiting action|

12.6 Storage Example (Japanese Localized Content Specimen)

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

12.7 Validation Rules

|   |   |
|---|---|
|Field|Rule|
|name|Required; 1–100 characters|
|email|Required; email format; at most 255 characters|
|subject|Required; 1–150 characters|
|message|Required; 1–2,000 characters|
|status|One of new / read / done / spam|

12.8 Security Considerations

|   |   |
|---|---|
|Item|Description|
|HTML sanitization|Do not execute HTML or scripts in the message body when displaying it|
|Character limits|Prevent cost increases from excessive submissions|
|CORS restrictions|Allow only the frontend domain|
|Spam prevention|Consider a honeypot field and rate limiting|

  

13. User Data Design

13.1 Data Overview

User data will be used by sign-in functionality from Phase 4 onward.

Not implemented in the MVP.

Manage authentication information in Amazon Cognito and store application-specific profiles and settings in DynamoDB.

13.2 Fields Managed by Cognito

|   |   |
|---|---|
|Field|Description|
|sub|Cognito user ID|
|email|Email address|
|email_verified|Email verification status|
|createdAt|User creation timestamp|

13.3 UserProfileTable

|   |   |
|---|---|
|Item|Description|
|Table name|UserProfileTable|
|Purpose|Store application-specific user profiles|
|Phase|Phase 4|

13.4 Attribute Definitions

|   |   |   |   |
|---|---|---|---|
|Attribute name|Type|Required|Description|
|userId|String|Required|Cognito sub|
|displayName|String|Optional|Display name|
|email|String|Required|Email address|
|targetExam|String|Optional|CLF-C02 / SAA-C03|
|learningGoal|String|Optional|Learning goal|
|notificationEnabled|Boolean|Optional|Notification setting|
|createdAt|String|Required|Creation timestamp|
|updatedAt|String|Required|Last updated timestamp|

13.5 Key Design

|   |   |
|---|---|
|Key|Attribute|
|Partition Key|userId|

13.6 Storage Example (Japanese Localized Content Specimen)

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

  

14. Answer History Data Design

14.1 Data Overview

Answer history data stores which questions users answered and how they answered them.

Used from Phase 4 onward.

Applicable screens:

- My page
- Learning progress
- Review questions
- Weak-area analysis

14.2 DynamoDB Table Design

|   |   |
|---|---|
|Item|Description|
|Table name|UserAnswersTable|
|Purpose|Store per-user answer history|
|Phase|Phase 4|
|Billing mode|On-Demand recommended|

14.3 Attribute Definitions

|   |   |   |   |
|---|---|---|---|
|Attribute name|Type|Required|Description|
|userId|String|Required|Cognito user ID|
|answerId|String|Required|Answer ID|
|questionId|String|Required|Question ID|
|exam|String|Required|Exam type|
|category|String|Required|Question category|
|selectedChoiceId|String|Required|Selected choice|
|correctChoiceId|String|Required|Correct choice|
|isCorrect|Boolean|Required|Whether the answer is correct|
|answeredAt|String|Required|Answer timestamp|
|elapsedSeconds|Number|Optional|Seconds taken to answer|

14.4 Key Design

|   |   |   |
|---|---|---|
|Key|Attribute|Reason|
|Partition Key|userId|Retrieve answer history by user|
|Sort Key|answeredAt#questionId|Retrieve history in date order|

14.5 Proposed GSIs

|   |   |   |   |
|---|---|---|---|
|Index name|Partition Key|Sort Key|Purpose|
|UserQuestionIndex|userId|questionId|Check answer history for a specific question|
|UserExamIndex|userId|exam|Retrieve answer history by exam|
|UserCategoryIndex|userId|category|Retrieve answer history by category|

14.6 Storage Example

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

  

15. Learning Progress Data Design

15.1 Data Overview

Learning progress data aggregates and stores each user's accuracy, answer count, weak categories, and review items.

These can be aggregated from answer history on demand, but an aggregation table is maintained for display performance.

15.2 DynamoDB Table Design

|   |   |
|---|---|
|Item|Description|
|Table name|UserProgressTable|
|Purpose|Store per-user learning progress|
|Phase|Phase 4|

15.3 Attribute Definitions

|   |   |   |   |
|---|---|---|---|
|Attribute name|Type|Required|Description|
|userId|String|Required|Cognito user ID|
|exam|String|Required|Exam type|
|totalAnswered|Number|Required|Number of answers|
|correctCount|Number|Required|Number of correct answers|
|incorrectCount|Number|Required|Number of incorrect answers|
|accuracy|Number|Required|Accuracy|
|categoryStats|Map|Optional|Results by category|
|weakCategories|List|Optional|Weak categories|
|reviewQuestionIds|List|Optional|Question IDs for review|
|lastAnsweredAt|String|Optional|Most recent answer timestamp|
|updatedAt|String|Required|Last updated timestamp|

15.4 Key Design

|   |   |   |
|---|---|---|
|Key|Attribute|Reason|
|Partition Key|userId|Retrieve by user|
|Sort Key|exam|Separate progress by exam|

15.5 Storage Example

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

  

16. Review Data Design

16.1 Data Overview

Review data manages questions users answered incorrectly and questions that should be revisited after a specified interval.

Not needed for the MVP. Implement from Phase 4 onward.

16.2 Management Approach

Initially, manage this data with reviewQuestionIds in UserProgressTable.

Add ReviewItemsTable if more detailed review scheduling is needed in the future.

16.3 Proposed ReviewItemsTable

|   |   |   |   |
|---|---|---|---|
|Attribute name|Type|Required|Description|
|userId|String|Required|Cognito user ID|
|reviewId|String|Required|Review ID|
|questionId|String|Required|Question ID|
|reason|String|Required|incorrect / bookmarked / scheduled|
|nextReviewAt|String|Optional|Next scheduled review date|
|reviewCount|Number|Required|Review count|
|lastReviewedAt|String|Optional|Last review date|
|status|String|Required|active / done|

16.4 Key Design

|   |   |
|---|---|
|Key|Attribute|
|Partition Key|userId|
|Sort Key|nextReviewAt#questionId|

  

17. Daily Question Data Design

17.1 Data Overview

Daily question data manages questions delivered through EventBridge + Lambda + SES / Slack notifications.

Implement from Phase 4 onward.

17.2 DailyQuestionTable

|   |   |   |   |
|---|---|---|---|
|Attribute name|Type|Required|Description|
|date|String|Required|Delivery date; YYYY-MM-DD|
|questionId|String|Required|ID of the question to deliver|
|exam|String|Required|Exam type|
|title|String|Optional|Notification title|
|message|String|Optional|Notification body|
|sent|Boolean|Required|Whether the notification has been sent|
|sentAt|String|Optional|Sent timestamp|

17.3 Key Design

|   |   |
|---|---|
|Key|Attribute|
|Partition Key|date|

17.4 Storage Example (Japanese Localized Content Specimen)

{

  "date": "2026-08-02",

  "questionId": "clf-015",

  "exam": "CLF-C02",

  "title": "今日のAWS 1問",

  "message": "今日はIAMロールに関する問題です。",

  "sent": false,

  "sentAt": null

}

  

18. Overall DynamoDB Design

18.1 Table Inventory

|   |   |   |   |
|---|---|---|---|
|Table name|Purpose|Phase|Required for MVP|
|ContactsTable|Store contact inquiries|Phase 2|Required|
|TermsTable|Store AWS glossary entries|Phase 2 onward|Optional|
|QuestionsTable|Store practice questions|Phase 2 onward|Optional|
|UserProfileTable|User profiles|Phase 4|Out of scope|
|UserAnswersTable|Answer history|Phase 4|Out of scope|
|UserProgressTable|Learning progress|Phase 4|Out of scope|
|ReviewItemsTable|Review management|Phase 4 onward|Out of scope|
|DailyQuestionTable|Daily question delivery|Phase 4 onward|Out of scope|

18.2 Billing Mode

DynamoDB On-Demand is recommended for an individually developed MVP.

Reasons:

- Traffic volume is unpredictable
- No need to provision unused capacity when initial traffic is low
- Simple to manage
- Makes traffic spikes easier to handle for an individual developer

18.3 Naming Policy

|   |   |
|---|---|
|Environment|Example table name|
|dev|ContactsTableDev|
|prod|ContactsTableProd|

A production-only environment is acceptable for the MVP, but allow environment names in table names to support future environment separation.

  

19. Data Retrieval Policies

19.1 Static Retrieval

Retrieve the following at build time or as static files.

|   |   |
|---|---|
|Data|Retrieval method|
|Glossary data|JSON import|
|Question data|JSON import|
|Comparison articles|Load MDX|
|Blog posts|Load MDX|
|Architecture articles|Load MDX|
|Operator information|Static pages|
|Privacy policy|Static pages|

19.2 API Retrieval

Retrieve and store the following through APIs.

|   |   |   |
|---|---|---|
|Data|API|Phase|
|Submit contact inquiry|POST /contact|Phase 2|
|Glossary list|GET /terms|Optional|
|Question list|GET /questions/clf|Optional|
|Save answer history|POST /answers|Phase 4|
|Retrieve learning progress|GET /progress|Phase 4|

19.3 MVP Recommendation

For the MVP, manage all data except contact inquiries as static data.

Reasons:

- Faster development
- Lower AWS costs
- Good for SEO
- Easy to take advantage of CloudFront caching
- Less likely to get stuck on database design

  

20. Data Update Flows

20.1 MVP Content Update Flow

1. Edit JSON / MDX locally

2. Commit to GitHub

3. Build with GitHub Actions

4. Deploy to S3

5. Invalidate the CloudFront cache

6. Verify rendering on the production site

20.2 Contact Inquiry Storage Flow

1. The user fills in the contact form

2. Validate on the frontend

3. POST to API Gateway

4. Validate again in Lambda

5. Store in DynamoDB ContactsTable

6. Return a success response

7. Display a completion message on the frontend

20.3 Phase 4 Answer History Storage Flow

1. A signed-in user answers a question

2. The frontend sends answer data to the API

3. API Gateway validates the Cognito JWT

4. Lambda saves the answer data in UserAnswersTable

5. Lambda updates UserProgressTable

6. The frontend displays accuracy and review items

  

7. TypeScript Type Definitions

21.1 Term Type

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

21.2 Question Type

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

21.3 ComparisonMeta Type

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

21.4 ArchitectureMeta Type

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

21.5 BlogPostMeta Type

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

21.6 Contact Type

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

21.7 UserAnswer Type

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

21.8 UserProgress Type

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

  

22. Validation Design

22.1 Common Validation Policies

|   |   |
|---|---|
|Policy|Description|
|Validate on both frontend and backend|Do not rely solely on frontend validation|
|Character limits|Prevent cost increases and spam|
|Type checking|Perform checks in TypeScript and Lambda|
|Required field checks|Always validate required fields|
|Unsafe character handling|Sanitize HTML/scripts|

22.2 Contact Inquiry Validation

|   |   |   |
|---|---|---|
|Field|Rule|Example error message (Japanese localized UI specimen)|
|name|1–100 characters|名前を入力してください|
|email|Email format; at most 255 characters|正しいメールアドレスを入力してください|
|subject|1–150 characters|件名を入力してください|
|message|1–2,000 characters|本文を入力してください|

22.3 Question Data Validation

|   |   |
|---|---|
|Field|Rule|
|questionId|Must be unique|
|choices|Exactly 4 required|
|correctChoiceId|Must exist in choices|
|explanation|Must not be empty|
|exam|One of CLF-C02 / SAA-C03|
|difficulty|One of easy / normal / hard|

22.4 Glossary Data Validation

|   |   |
|---|---|
|Field|Rule|
|termId|Must be unique; alphanumeric characters and hyphens only|
|name|Required|
|category|Predefined categories only|
|summary|Required|
|examPoints|At least 1 entry|
|updatedAt|Date format|

  

23. Data Migration Policy

23.1 Migration from JSON to DynamoDB

Migrate JSON data to DynamoDB as needed from Phase 2 onward.

Candidate data:

- TermsTable
- QuestionsTable

23.2 Migration Procedure

1. Validate the JSON data

2. Create DynamoDB tables

3. Create Python migration scripts

4. Read the JSON

5. Insert records using PutItem / BatchWriteItem

6. Verify the number of inserted records

7. Verify retrieval through the API

8. Switch the frontend data source from JSON to the API

23.3 Migration Script Location

scripts/

├── migrate_terms_to_dynamodb.py

├── migrate_questions_to_dynamodb.py

└── validate_contents.py

23.4 Migration Considerations

|   |   |
|---|---|
|Consideration|Description|
|Duplicate IDs|Check for duplicate termId and questionId values in advance|
|Type mismatches|Convert values to types supported by DynamoDB|
|Bulk writes|Implement retries when using BatchWriteItem|
|Cost|Avoid repeating unnecessary migration tests|
|Source management|Decide whether to retain source files in GitHub after migration|

  

24. Data Backup Policy

24.1 Static Content

Manage the source files for static content in GitHub.

Scope:

- terms.json
- questions JSON
- comparison MDX
- architecture MDX
- blog MDX
- images

Recovery method:

Rebuild from GitHub → Redeploy to S3

24.2 DynamoDB Data

Only contact inquiry data is stored in DynamoDB for the MVP.

|   |   |
|---|---|
|Data|Backup policy|
|ContactsTable|Export to CSV as needed|
|UserAnswersTable|Consider PITR from Phase 4 onward|
|UserProgressTable|Can be recalculated, but consider PITR|

24.3 Importance Classification

|   |   |   |
|---|---|---|
|Data|Importance|Reason|
|Blog, glossary, and question source files|High|Core site value; managed in GitHub|
|Contact inquiries|Medium|User contact information; also requires protection against leaks|
|Learning history|High|Directly affects the user experience|
|Images|Medium|Can be recreated, but requires effort|
|Analytics|Low|Managed by Google|

  

25. Data Security Design

25.1 Handling Personal Information

Data that may constitute personal information:

- Name in a contact inquiry
- Email address
- Contact inquiry message body
- Future user registration email address

25.2 Protection Policies

|   |   |
|---|---|
|Policy|Description|
|Minimal collection|Collect only necessary information|
|Least privilege|Grant Lambda only the minimum necessary permissions for the target table|
|No public exposure|Do not expose contact inquiry data to the frontend|
|Logging precautions|Avoid excessive personal information in CloudWatch Logs|
|GitHub precautions|Do not commit contact inquiry data or email addresses|

25.3 CloudWatch Logs Precautions

Do not log the following verbatim in Lambda logs.

- Email addresses
- Full contact inquiry message bodies
- JWT tokens
- API keys
- AWS credentials

Logging example:

OK: contact submitted contactId=contact-xxxx

NG: validation error field=email

  

26. Data Retention Periods

26.1 MVP Policy

|   |   |
|---|---|
|Data|Retention period|
|Static content|Retain until deleted|
|Contact inquiry data|Review after approximately one year|
|CloudWatch Logs|14–30 days recommended|

26.2 Future Policy

|   |   |
|---|---|
|Data|Retention period|
|User information|Until account closure|
|Answer history|Until account closure or for a defined period|
|Learning progress|Until account closure|
|Closed-account user information|Delete or anonymize|

  

27. SEO Metadata Design

27.1 Common SEO Fields

Set SEO metadata for the following pages.

- Glossary details
- Comparison details
- Architecture diagram details
- Blog details
- Learning roadmap

27.2 SEO Metadata Fields

|   |   |
|---|---|
|Field|Description|
|title|Title displayed in search results|
|description|Description displayed in search results|
|canonical|Canonical URL|
|ogTitle|Title for social media sharing|
|ogDescription|Description for social media sharing|
|ogImage|OGP image|
|updatedAt|Last updated date|

27.3 OGP Image Policy

|   |   |
|---|---|
|Page|OGP image|
|Home|Site-wide OGP image|
|Glossary details|Service-category OGP image|
|Comparison details|Shared comparison article OGP image|
|Blog details|Article-specific OGP image|
|Architecture diagram details|Architecture diagram image or dedicated OGP image|

  

28. Sitemap Generation Data

28.1 Sitemap Scope

|   |   |
|---|---|
|Page|Include?|
|Home page|Include|
|Glossary details|Include|
|Comparison details|Include|
|Practice question details|Include by default|
|Architecture diagram details|Include|
|Blog details|Include|
|Contact|May include|
|Privacy policy|May include|
|Sign-in|Exclude|
|My page|Exclude|

28.2 Data Required for Sitemap Generation

|   |   |
|---|---|
|Field|Source|
|URL|slug|
|lastmod|updatedAt|
|priority|Page type|
|changefreq|Page type|

  

29. Data Naming Conventions

29.1 ID Naming

|   |   |   |
|---|---|---|
|Data|Naming format|Example|
|AWS glossary|Lowercase service name|s3, lambda, cloudfront|
|Comparison articles|cmp- followed by a three-digit sequence number|cmp-001|
|Practice questions|Exam abbreviation followed by a hyphen and three-digit sequence number|clf-001, saa-001|
|Architecture diagrams|arc- followed by a three-digit sequence number|arc-001|
|Blog posts|blog- followed by a three-digit sequence number|blog-001|
|Contact inquiries|contact- followed by a random ID|contact-7f8b2c9a|
|Answers|ans- followed by date and sequence number, separated by hyphens|ans-20260801-001|

29.2 Slug Naming

|   |   |   |
|---|---|---|
|Data|Naming format|Example|
|Glossary entries|Same as termId|s3|
|Comparisons|service-vs-service|s3-vs-ebs-vs-efs|
|Architecture diagrams|Describe the content in English|serverless-api-basic|
|Blog posts|Express SEO keywords in English|aws-free-tier-portfolio|

29.3 Date Format

Use ISO 8601 as the standard date format.

2026-06-01

2026-06-01T10:30:00+09:00

  

30. Minimum Dataset for MVP Implementation

30.1 Data Required for a Minimal Launch

|   |   |
|---|---|
|Data|Minimum count|
|AWS glossary|30 entries|
|CLF practice questions|30 questions|
|Service comparisons|5 articles|
|Architecture diagrams|5 entries|
|Blog posts|5 articles|
|Operator information|1 page|
|Privacy policy|1 page|
|Disclaimer|1 page|

30.2 Target Data before Applying for AdSense

|   |   |
|---|---|
|Data|Target count|
|AWS glossary|At least 50 entries|
|CLF practice questions|At least 50 questions|
|SAA practice questions|At least 30 questions|
|Service comparisons|At least 10 articles|
|Architecture diagrams|At least 10 entries|
|Blog posts|At least 20 articles|

  

31. Key Data Design Decisions

31.1 Why Focus on Markdown/JSON for the MVP?

The reasons are as follows.

- Faster development
- Lower costs
- Easy version history management in GitHub
- Works well with SEO
- Allows launch without spending excessive time on database design
- Easy high-speed delivery through CloudFront

31.2 Why Use DynamoDB Only for Contact Inquiries?

Contact inquiries are dynamic data generated by user input and cannot be persisted through static files.

They also demonstrate implementation experience with Lambda + API Gateway + DynamoDB in the portfolio, making this worthwhile even for the MVP.

31.3 Why Not Store Questions in DynamoDB from the Start?

At the MVP stage, question data does not need frequent updates through an administration interface.

JSON management offers the following advantages.

- Easy to edit
- Easy to review
- Changes can be tracked in GitHub
- Can be displayed without implementing an API
- No additional cost

However, migrate to DynamoDB when implementing the following in the future.

- Adding questions through an administration interface
- A random-question API
- Per-user question selection optimization
- Question recommendations based on accuracy

  

32. Acceptance Criteria

32.1 MVP Data Design Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-DATA-001|The JSON structure for AWS glossary data is defined|
|AC-DATA-002|The JSON structure for practice question data is defined|
|AC-DATA-003|The frontmatter structure for comparison articles is defined|
|AC-DATA-004|The frontmatter structure for architecture articles is defined|
|AC-DATA-005|The frontmatter structure for blog posts is defined|
|AC-DATA-006|The DynamoDB design for contact inquiry data is defined|
|AC-DATA-007|It is clear which MVP data will and will not use DynamoDB|
|AC-DATA-008|TypeScript type definitions are provided|

32.2 Phase 4 Data Design Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-DATA-009|The user data design is defined|
|AC-DATA-010|The answer history data design is defined|
|AC-DATA-011|The learning progress data design is defined|
|AC-DATA-012|The review data design is defined|
|AC-DATA-013|The daily question delivery data design is defined|

  

33. Related Design Documents to Create Next

Create the following after this data design document.

1. API design document
2. Security design document
3. Cost management design document
4. Development task list
5. GitHub README draft
6. Initial data creation templates

  

7. Conclusion

This product's data design primarily uses Markdown / MDX / JSON during the MVP stage, storing only dynamic contact inquiry data in DynamoDB.

This enables the following.

- Faster development
- Lower AWS usage costs
- SEO-friendly static pages
- Safe content management in GitHub
- Demonstration of Lambda + API Gateway + DynamoDB implementation experience

In the future, add Cognito authentication and store per-user answer history, learning progress, review questions, and weak-area analysis in DynamoDB to evolve from a learning content site into a learning application.

This design combines practical value as an AWS certification learning site, clear demonstration of skills as a portfolio, and extensibility for future monetization and SaaS development.
