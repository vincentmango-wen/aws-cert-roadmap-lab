# P5-000-5 中国語SEOキーワードリスト

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| 文書名 | 中国語SEOキーワードリスト |
| 対象タスク | P5-000-5 |
| 対象フェーズ | Phase 5：グローバルSEO・ローカライゼーション |
| 対象言語 | 繁體中文 |
| 対象URL prefix | /zh |
| 作成日 | 2026-06-10 |
| 目的 | 繁体字中国語圏の検索流入を狙うためのキーワード、検索意図、対象ページを整理する |

---

## 2. 基本方針

本サイトの中国語SEOでは、ビッグキーワード単体ではなく、以下の掛け合わせを狙う。

```text
AWS 認證
× 初學者
× Cloud Practitioner
× SAA-C03
× 服務比較
× 架構圖
× Serverless
× 作品集
```

英語圏・中国語圏の大手学習サイトと直接競合する「practice exam」「題庫」系は避ける。

本サイトでは、以下を中心に狙う。

- AWS初学者向けの用語理解
- Cloud Practitioner / SAA の学習ロードマップ
- AWSサービス比較
- AWS構成図
- AWSサーバーレス構成
- AWSを使ったポートフォリオ構築

---

## 3. 表記ルール

| 日本語 | 繁體中文で使う表記 | 備考 |
|---|---|---|
| AWS資格 | AWS 認證 / AWS 證照 | 台湾では「證照」も自然 |
| Cloud Practitioner | AWS Certified Cloud Practitioner | 正式名称は英語を維持 |
| Solutions Architect Associate | AWS Certified Solutions Architect - Associate | 正式名称は英語を維持 |
| 模擬問題 | 練習題 / 模擬試題 | 「題庫」は避ける |
| 用語集 | AWS 術語表 / AWS 服務術語 | 検索では「術語」「服務」両方を使う |
| 構成図 | 架構圖 | 中国語圏では自然 |
| サーバーレス | 無伺服器 | AWS文脈では一般的 |
| 静的サイト | 靜態網站 | S3 + CloudFront記事で使用 |
| 比較 | 差異 / 比較 | 検索では「差異」が強い |
| 初心者 | 初學者 | 初学者向け記事で使用 |
| ロードマップ | 學習路線圖 | 学習順序コンテンツで使用 |

---

## 4. 最優先キーワード

| 優先度 | キーワード | 検索意図 | 対象ページ案 | URL案 |
|---|---|---|---|---|
| High | AWS 認證 入門 | AWS資格の全体像を知りたい | 中国語トップ / ロードマップ | /zh |
| High | AWS 證照 入門 | 台湾向けのAWS資格入門を探している | 中国語トップ / ロードマップ | /zh |
| High | AWS Cloud Practitioner 準備 | CLF受験準備をしたい | CLFロードマップ記事 | /zh/blog/aws-cloud-practitioner-roadmap |
| High | AWS Cloud Practitioner 考試準備 | 試験準備の流れを知りたい | CLFロードマップ記事 | /zh/blog/aws-cloud-practitioner-roadmap |
| High | AWS CLF-C02 準備 | CLF-C02対策を探している | CLF問題トップ | /zh/questions |
| High | AWS CLF-C02 考試重點 | 試験で問われる要点を知りたい | CLFロードマップ記事 | /zh/blog/aws-cloud-practitioner-roadmap |
| High | AWS CLF-C02 練習題 | 練習問題を解きたい | CLF問題一覧 | /zh/questions/clf |
| High | AWS Certified Solutions Architect Associate 準備 | SAA受験準備をしたい | SAAロードマップ / 構成図一覧 | /zh/architectures |
| High | AWS SAA-C03 準備 | SAA-C03対策を探している | SAAロードマップ / 構成図一覧 | /zh/architectures |
| High | AWS SAA-C03 架構圖 | SAAで出る構成を図で理解したい | 構成図一覧 | /zh/architectures |

---

## 5. AWS用語集向けキーワード

| 優先度 | キーワード | 検索意図 | 対象ページ案 | URL案 |
|---|---|---|---|---|
| High | AWS 術語表 | AWS用語を一覧で確認したい | 用語集一覧 | /zh/terms |
| High | AWS 服務術語 | AWSサービスの用語を学びたい | 用語集一覧 | /zh/terms |
| High | AWS 初學者 教學 | AWSを基礎から学びたい | 中国語トップ / 用語集 | /zh/terms |
| High | AWS IAM 是什麼 | IAMの役割を知りたい | IAM用語詳細 | /zh/terms/iam |
| High | Amazon S3 是什麼 | S3の概要を知りたい | S3用語詳細 | /zh/terms/s3 |
| High | AWS Lambda 是什麼 | Lambdaの概要を知りたい | Lambda用語詳細 | /zh/terms/lambda |
| High | Amazon VPC 是什麼 | VPCの概要を知りたい | VPC用語詳細 | /zh/terms/vpc |
| Medium | Amazon DynamoDB 是什麼 | DynamoDBの概要を知りたい | DynamoDB用語詳細 | /zh/terms/dynamodb |
| Medium | Amazon CloudFront 是什麼 | CloudFrontの概要を知りたい | CloudFront用語詳細 | /zh/terms/cloudfront |
| Medium | Amazon Route 53 是什麼 | Route 53の概要を知りたい | Route 53用語詳細 | /zh/terms/route-53 |

---

## 6. サービス比較向けキーワード

| 優先度 | キーワード | 検索意図 | 対象ページ案 | URL案 |
|---|---|---|---|---|
| High | AWS 服務比較 | AWSサービスの違いを一覧で知りたい | 比較一覧 | /zh/comparisons |
| High | S3 EBS EFS 差異 | ストレージサービスの違いを知りたい | S3 / EBS / EFS比較 | /zh/comparisons/s3-vs-ebs-vs-efs |
| High | RDS DynamoDB 差異 | DBサービスの違いを知りたい | RDS / DynamoDB比較 | /zh/comparisons/rds-vs-dynamodb |
| High | SNS SQS EventBridge 差異 | メッセージング系サービスの違いを知りたい | SNS / SQS / EventBridge比較 | /zh/comparisons/sns-vs-sqs-vs-eventbridge |
| High | IAM User Role Policy 差異 | IAMの構成要素を理解したい | IAM比較 | /zh/comparisons/iam-user-vs-role-vs-policy |
| Medium | CloudWatch CloudTrail Config 差異 | 監視・監査系サービスの違いを知りたい | CloudWatch / CloudTrail / Config比較 | /zh/comparisons/cloudwatch-vs-cloudtrail-vs-config |
| Medium | ALB NLB CloudFront 差異 | 配信・ロードバランサの違いを知りたい | ALB / NLB / CloudFront比較 | /zh/comparisons/alb-vs-nlb-vs-cloudfront |
| Medium | Security Group NACL 差異 | VPCセキュリティの違いを知りたい | Security Group / NACL比較 | /zh/comparisons/security-group-vs-nacl |

---

## 7. 構成図・サーバーレス向けキーワード

| 優先度 | キーワード | 検索意図 | 対象ページ案 | URL案 |
|---|---|---|---|---|
| High | AWS 架構圖 初學者 | AWS構成図を基礎から学びたい | 構成図一覧 | /zh/architectures |
| High | S3 CloudFront 靜態網站 | 静的サイト構成を作りたい | S3 + CloudFront構成図 | /zh/architectures/static-site-s3-cloudfront |
| High | CloudFront OAC S3 私有存取 | S3を非公開でCloudFront配信したい | CloudFront OAC構成図 | /zh/architectures/static-site-s3-cloudfront |
| High | API Gateway Lambda DynamoDB 架構 | サーバーレスAPI構成を知りたい | サーバーレスAPI構成図 | /zh/architectures/serverless-api-basic |
| High | AWS 無伺服器 API 教學 | サーバーレスAPIを学びたい | サーバーレスAPI構成図 | /zh/architectures/serverless-api-basic |
| Medium | Lambda API Gateway 教學 | LambdaとAPI Gatewayを連携したい | Lambda / API Gateway記事 | /zh/blog/lambda-api-gateway-beginner |
| Medium | DynamoDB Lambda 教學 | LambdaからDynamoDBを使いたい | サーバーレスAPI構成図 | /zh/architectures/serverless-api-basic |
| Medium | AWS 三層架構 | 3層Webアプリ構成を知りたい | 3層構成図 | /zh/architectures/three-tier-vpc |
| Medium | AWS 高可用性 架構 | 高可用性構成を知りたい | 高可用性Webアプリ構成図 | /zh/architectures/high-availability-web-app |
| Medium | EventBridge Lambda 批次處理 | バッチ処理構成を知りたい | EventBridge + Lambda構成図 | /zh/architectures/eventbridge-lambda-batch |

---

## 8. コスト・セキュリティ向けキーワード

| 優先度 | キーワード | 検索意図 | 対象ページ案 | URL案 |
|---|---|---|---|---|
| High | AWS 免費方案 教學 | AWS無料枠を理解したい | 無料枠ブログ | /zh/blog/aws-free-tier-portfolio |
| High | AWS 成本最佳化 初學者 | AWSコスト最適化を学びたい | コスト記事 / 用語集 | /zh/blog/aws-free-tier-portfolio |
| High | AWS Budgets 教學 | Budgets設定を知りたい | Budgets用語詳細 | /zh/terms/aws-budgets |
| Medium | AWS 責任共擔模型 | 責任共有モデルを理解したい | セキュリティ系用語 / ブログ | /zh/terms/shared-responsibility-model |
| Medium | AWS IAM 最小權限 | IAM最小権限を学びたい | IAM用語詳細 | /zh/terms/iam |
| Medium | S3 公開存取封鎖 | S3の公開防止を知りたい | S3用語詳細 / 構成図 | /zh/terms/s3 |
| Medium | CloudFront HTTPS 設定 | CloudFrontのHTTPS配信を知りたい | CloudFront用語詳細 | /zh/terms/cloudfront |
| Medium | ACM CloudFront 憑證 | CloudFront用証明書を知りたい | ACM用語詳細 | /zh/terms/acm |

---

## 9. ポートフォリオ向けキーワード

| 優先度 | キーワード | 検索意図 | 対象ページ案 | URL案 |
|---|---|---|---|---|
| High | AWS 作品集 | AWSポートフォリオ例を探している | 中国語トップ / GitHubページ | /zh |
| High | AWS 專案作品集 | AWSプロジェクト例を探している | GitHub誘導ページ | /zh/github |
| High | AWS 靜態網站 部署 | AWSで静的サイトを公開したい | S3 + CloudFront記事 | /zh/blog/aws-free-tier-portfolio |
| Medium | AWS CloudFront S3 部署 | CloudFront + S3デプロイを学びたい | S3 + CloudFront構成図 | /zh/architectures/static-site-s3-cloudfront |
| Medium | AWS GitHub Actions 部署 | GitHub ActionsでAWSへデプロイしたい | CI/CDブログ / README | /zh/blog/aws-github-actions-deploy |
| Medium | AWS OIDC GitHub Actions | OIDCで安全にAWSデプロイしたい | CI/CDブログ / README | /zh/blog/aws-github-actions-deploy |

---

## 10. 狙わないキーワード

以下は検索流入があっても狙わない。

| キーワード | 狙わない理由 |
|---|---|
| AWS 題庫 | exam dump系と誤解されやすい |
| AWS CCP 題庫 | 本番問題コピー目的の検索意図が混ざる |
| AWS SAA 題庫 | 本番問題コピー目的の検索意図が混ざる |
| AWS 考古題 | 試験ダンプと誤解されやすい |
| AWS 真題 | 本番問題の流出を期待する検索意図が強い |
| AWS 考試答案 | 不正受験を期待する検索意図が強い |
| AWS dumps | 禁止表現 |
| AWS exam dump | 禁止表現 |
| AWS 保證通過 | 合格保証はできない |
| AWS 快速通過 | 品質の低い試験ハックに寄る |

本サイトでは、以下の表現を使う。

- 練習題
- 模擬試題
- 例題
- 解說
- 學習重點
- 考試準備
- 學習路線圖

---

## 11. 優先実装順

### Step 1：最初に対応するキーワード

1. AWS 認證 入門
2. AWS Cloud Practitioner 準備
3. AWS CLF-C02 準備
4. AWS 術語表
5. AWS 服務比較
6. S3 EBS EFS 差異
7. RDS DynamoDB 差異
8. AWS 架構圖 初學者
9. S3 CloudFront 靜態網站
10. API Gateway Lambda DynamoDB 架構

### Step 2：次に対応するキーワード

1. AWS SAA-C03 準備
2. AWS SAA-C03 架構圖
3. SNS SQS EventBridge 差異
4. IAM User Role Policy 差異
5. AWS 免費方案 教學
6. AWS Budgets 教學
7. AWS 作品集
8. AWS 靜態網站 部署

### Step 3：余裕があれば対応するキーワード

1. CloudWatch CloudTrail Config 差異
2. Security Group NACL 差異
3. AWS 高可用性 架構
4. EventBridge Lambda 批次處理
5. AWS GitHub Actions 部署
6. AWS OIDC GitHub Actions

---

## 12. meta title / description 作成ルール

### titleルール

```text
{主キーワード}｜AWS資格ロードマップラボ
```

例：

```text
AWS Cloud Practitioner 準備｜AWS資格ロードマップラボ
S3 EBS EFS 差異｜AWS資格ロードマップラボ
AWS 架構圖 初學者｜AWS資格ロードマップラボ
```

### descriptionルール

```text
AWS初學者向けに、{主題}を用語、比較表、架構圖、練習題で整理します。Cloud Practitioner / SAA-C03 の學習に役立つ非官方學習內容です。
```

### 注意

- 「官方」は使わない
- 「保證通過」は使わない
- 「真題」「題庫」は使わない
- AWS正式名称は英語表記を維持する
- サービス名は Amazon S3 / AWS Lambda のように正式名称を優先する

---

## 13. 完了条件

- 繁体字中国語キーワードが20個以上ある
- 検索意図が定義されている
- 対象ページ案が定義されている
- 狙わないキーワードが定義されている
- 後続の `/zh` metadata、sitemap、hreflang 設計に利用できる
