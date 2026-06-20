# AWS 用語表記ルール (P5-032)

このドキュメントは AWS Cert Roadmap Lab における AWS サービス名・用語の表記ルールを定義する。
日本語・英語・中国語 (繁体字) の各言語ページで用語表記を統一するためのリファレンス。

## 1. 基本方針

### 1-1. AWS サービス名は原文の英語表記を維持
- 各言語ページで AWS サービス名を訳出しない (e.g. "Lambda" を「ラムダ」「拉姆達」に訳さない)
- "Amazon" / "AWS" プレフィックスは原文通り保持
- カタカナ訳 / 中文音訳 / 中文意訳は全面禁止

### 1-2. 略称の扱い
- 本文初出時は正式名称を併記 (e.g. "Amazon Elastic Compute Cloud (EC2)")
- 2 回目以降は略称のみ使用可
- 見出し (h2 / h3) は略称優先で簡潔に (e.g. "## ACM の主な用途")

### 1-3. 言語別の補足表現
- ja: 動詞・助詞・接続詞は日本語、サービス名は英語維持
- en: All English
- zh: 動詞・助詞・接続詞は繁体字中文、サービス名は英語維持

### 1-4. 括弧・記号
- 括弧は半角 `( )` を全言語で統一 (検索性確保のため zh の全角括弧 `( )` は使わない)
- 半角コロン・スラッシュは原則そのまま (e.g. `TLS/SSL`)

## 2. 主要 AWS サービス 表記 matrix

下記 53 件は `frontend/contents/terms/terms.ja.json` の全 termId と一致する。新規追加は §7 のフローに従う。

| 略称 | 正式名称 (公式英語) | ja 表記 | en 表記 | zh 表記 |
|---|---|---|---|---|
| ACM | AWS Certificate Manager | AWS Certificate Manager | AWS Certificate Manager | AWS Certificate Manager |
| API Gateway | Amazon API Gateway | Amazon API Gateway | Amazon API Gateway | Amazon API Gateway |
| App Runner | AWS App Runner | AWS App Runner | AWS App Runner | AWS App Runner |
| Athena | Amazon Athena | Amazon Athena | Amazon Athena | Amazon Athena |
| Aurora | Amazon Aurora | Amazon Aurora | Amazon Aurora | Amazon Aurora |
| Auto Scaling | AWS Auto Scaling | AWS Auto Scaling | AWS Auto Scaling | AWS Auto Scaling |
| AWS Backup | AWS Backup | AWS Backup | AWS Backup | AWS Backup |
| Budgets | AWS Budgets | AWS Budgets | AWS Budgets | AWS Budgets |
| AWS Config | AWS Config | AWS Config | AWS Config | AWS Config |
| AWS CDK | AWS Cloud Development Kit | AWS CDK | AWS CDK | AWS CDK |
| CloudFormation | AWS CloudFormation | AWS CloudFormation | AWS CloudFormation | AWS CloudFormation |
| CloudFront | Amazon CloudFront | Amazon CloudFront | Amazon CloudFront | Amazon CloudFront |
| CloudTrail | AWS CloudTrail | AWS CloudTrail | AWS CloudTrail | AWS CloudTrail |
| CloudWatch | Amazon CloudWatch | Amazon CloudWatch | Amazon CloudWatch | Amazon CloudWatch |
| CodeBuild | AWS CodeBuild | AWS CodeBuild | AWS CodeBuild | AWS CodeBuild |
| CodePipeline | AWS CodePipeline | AWS CodePipeline | AWS CodePipeline | AWS CodePipeline |
| Cognito | Amazon Cognito | Amazon Cognito | Amazon Cognito | Amazon Cognito |
| Cost Explorer | AWS Cost Explorer | AWS Cost Explorer | AWS Cost Explorer | AWS Cost Explorer |
| DynamoDB | Amazon DynamoDB | Amazon DynamoDB | Amazon DynamoDB | Amazon DynamoDB |
| EBS | Amazon Elastic Block Store | Amazon EBS | Amazon EBS | Amazon EBS |
| EC2 | Amazon Elastic Compute Cloud | Amazon EC2 | Amazon EC2 | Amazon EC2 |
| ECR | Amazon Elastic Container Registry | Amazon ECR | Amazon ECR | Amazon ECR |
| ECS | Amazon Elastic Container Service | Amazon ECS | Amazon ECS | Amazon ECS |
| EFS | Amazon Elastic File System | Amazon EFS | Amazon EFS | Amazon EFS |
| Elastic Beanstalk | AWS Elastic Beanstalk | AWS Elastic Beanstalk | AWS Elastic Beanstalk | AWS Elastic Beanstalk |
| ElastiCache | Amazon ElastiCache | Amazon ElastiCache | Amazon ElastiCache | Amazon ElastiCache |
| ELB | Elastic Load Balancing | Elastic Load Balancing (ELB) | Elastic Load Balancing (ELB) | Elastic Load Balancing (ELB) |
| EventBridge | Amazon EventBridge | Amazon EventBridge | Amazon EventBridge | Amazon EventBridge |
| Fargate | AWS Fargate | AWS Fargate | AWS Fargate | AWS Fargate |
| FSx | Amazon FSx | Amazon FSx | Amazon FSx | Amazon FSx |
| Glue | AWS Glue | AWS Glue | AWS Glue | AWS Glue |
| GuardDuty | Amazon GuardDuty | Amazon GuardDuty | Amazon GuardDuty | Amazon GuardDuty |
| IAM | AWS Identity and Access Management | AWS IAM | AWS IAM | AWS IAM |
| Inspector | Amazon Inspector | Amazon Inspector | Amazon Inspector | Amazon Inspector |
| Kinesis | Amazon Kinesis | Amazon Kinesis | Amazon Kinesis | Amazon Kinesis |
| KMS | AWS Key Management Service | AWS KMS | AWS KMS | AWS KMS |
| Lambda | AWS Lambda | AWS Lambda | AWS Lambda | AWS Lambda |
| Organizations | AWS Organizations | AWS Organizations | AWS Organizations | AWS Organizations |
| QuickSight | Amazon QuickSight | Amazon QuickSight | Amazon QuickSight | Amazon QuickSight |
| RDS | Amazon Relational Database Service | Amazon RDS | Amazon RDS | Amazon RDS |
| Redshift | Amazon Redshift | Amazon Redshift | Amazon Redshift | Amazon Redshift |
| Route 53 | Amazon Route 53 | Amazon Route 53 | Amazon Route 53 | Amazon Route 53 |
| S3 | Amazon Simple Storage Service | Amazon S3 | Amazon S3 | Amazon S3 |
| Secrets Manager | AWS Secrets Manager | AWS Secrets Manager | AWS Secrets Manager | AWS Secrets Manager |
| Shield | AWS Shield | AWS Shield | AWS Shield | AWS Shield |
| SNS | Amazon Simple Notification Service | Amazon SNS | Amazon SNS | Amazon SNS |
| SQS | Amazon Simple Queue Service | Amazon SQS | Amazon SQS | Amazon SQS |
| Step Functions | AWS Step Functions | AWS Step Functions | AWS Step Functions | AWS Step Functions |
| Systems Manager | AWS Systems Manager | AWS Systems Manager | AWS Systems Manager | AWS Systems Manager |
| Trusted Advisor | AWS Trusted Advisor | AWS Trusted Advisor | AWS Trusted Advisor | AWS Trusted Advisor |
| VPC | Amazon Virtual Private Cloud | Amazon VPC | Amazon VPC | Amazon VPC |
| WAF | AWS WAF | AWS WAF | AWS WAF | AWS WAF |
| X-Ray | AWS X-Ray | AWS X-Ray | AWS X-Ray | AWS X-Ray |

## 3. 試験区分の表記

- CLF-C02 (Cloud Practitioner)
- SAA-C03 (Solutions Architect Associate)
- SAP-C02 (Solutions Architect Professional)

各言語ページで上記表記を変えない。試験コードは半角ハイフン区切りで `SAA-C03` のように記述する。

## 4. カテゴリ・難易度の表記

### 4-1. カテゴリ (英語固定値 / 表示用ラベルは locale 別 categoryLabels で変換)

- Compute
- Storage
- Database
- Networking
- Security
- Monitoring
- Integration
- Analytics
- Management

### 4-2. 難易度 (英語固定値 / 表示用ラベルは locale 別 levelLabels で変換)

- beginner
- intermediate
- advanced

JSON データ上のカテゴリ・難易度フィールドは英語キーで統一する。表示用の日本語・中国語ラベルは UI 側のラベル変換層 (`categoryLabels` / `levelLabels`) で行う。

## 5. 単語の単複・冠詞 (英語ページ)

- サービス名は単数形 (e.g. "an S3 bucket", "a Lambda function")
- 一般用語の冠詞は文脈による (e.g. "the IAM role", "an IAM policy")
- 抽象概念としてのサービスを指すときは無冠詞 (e.g. "Lambda invokes the function asynchronously")

## 6. 句読点と空白

- ja: 句読点は `、` と `。` を使用 / 半角数字と日本語の間に半角スペースを入れない / 括弧は半角 `( )`
- en: 標準英語句読点 / Oxford comma 推奨 / 略称の括弧書きは半角スペース `Amazon Elastic Compute Cloud (EC2)`
- zh (zh-TW): 全角句読点 `,` `。` `;` を使用 / 半角数字と中文の間に半角スペースを挿入 (e.g. `每月 USD 400`) / 括弧は半角 `( )`

## 7. リファレンス更新ルール

新規 AWS サービスを用語集に追加する場合:

1. 公式英語名と略称を AWS 公式ドキュメントで確認
2. 本ファイル §2 matrix に 1 行追加 (略称 / 正式名称 / ja / en / zh 表記の 5 列を埋める)
3. `frontend/contents/terms/terms.ja.json` / `terms.en.json` / `terms.zh.json` の各々に同 `termId` / `shortName` で追加
4. 略称 (例: `S3`, `EC2`) は `shortName` フィールドに、正式名 (例: `Amazon Simple Storage Service`) は `name` フィールドに格納
5. `name` / `shortName` は全言語で同一の英語表記とする (locale を跨いで翻訳しない)
6. レビュアーは matrix への追記が無いままサービス名が本文に出現していないかをチェックする
