AWS Cert Roadmap Lab

AWS資格学習をしながら、AWSサーバーレス構成を実装で学ぶためのポートフォリオWebアプリです。

Cloud Practitioner / Solutions Architect Associate の学習内容を、単なるメモではなく、実際にAWS上で動く学習サイトとして形にすることを目的にしています。

  

概要

AWS Cert Roadmap Lab は、AWS資格学習者向けの学習サイトです。

主な機能は以下です。

- AWS Cloud Practitioner / SAA向け学習ロードマップ
- AWS主要サービスの用語集
- CLF-C02模擬問題
- AWSサービス比較記事
- AWS構成図解説
- AWS学習ブログ
- 問い合わせフォーム
- サーバーレス問い合わせAPI

MVPでは、学習コンテンツは静的ファイルとして管理し、問い合わせフォームのみ API Gateway + Lambda + DynamoDB で動的処理を行います。

  

制作背景

現在、AWS Cloud Practitioner の学習を進めており、その後 Solutions Architect Associate の受験を予定しています。

ただ資格勉強だけで終わらせるのではなく、学んだ内容を実際のAWS構成として実装し、ポートフォリオとして説明できる形にしたいと考えました。

このプロジェクトでは、以下を重視しています。

- AWS資格の知識を実装に落とし込むこと
- 低コストで運用できるAWS構成にすること
- セキュリティ・IAM・監視・CI/CDまで含めて設計すること
- 将来的にSEO・広告収益化できる学習メディアに拡張すること

  

デモ

現在準備中です。

Production URL: https://xxxxxxxx.cloudfront.net

独自ドメインは、MVP公開後に導入を検討します。

  

主要機能

1. 学習ロードマップ

AWS Cloud Practitioner から Solutions Architect Associate までの学習順序を整理します。

対象内容：

- AWS学習の全体像
- Cloud Practitioner の試験範囲
- SAAにつながる基礎知識
- サービス別の学習優先度
- 実装で理解するAWS構成

  

2. AWS用語集

AWS主要サービスや重要概念を、初心者にも分かりやすく整理します。

初期収録予定：

- IAM
- S3
- EC2
- Lambda
- VPC
- RDS
- DynamoDB
- CloudFront
- Route 53
- CloudWatch
- CloudTrail
- API Gateway
- SQS
- SNS
- EventBridge
- EBS
- EFS
- ELB
- Auto Scaling
- ACM
- KMS
- WAF
- AWS Budgets
- Cost Explorer
- Organizations
- AWS Config
- Secrets Manager
- Systems Manager
- CloudFormation
- Cognito

MVPでは30件以上の用語登録を目標にしています。

  

3. CLF-C02模擬問題

AWS Cloud Practitioner向けの模擬問題を提供します。

MVPでは30問以上を作成します。

問題カテゴリ：

|   |   |
|---|---|
|カテゴリ|内容|
|Cloud Concepts|クラウドの基本概念|
|Security and Compliance|セキュリティ・責任共有モデル|
|Cloud Technology and Services|AWS主要サービス|
|Billing, Pricing, and Support|請求・料金・サポート|

各問題には以下を含めます。

- 問題文
- 4択選択肢
- 正解
- 解説
- 関連AWSサービス
- 関連用語

  

4. AWSサービス比較記事

試験でも実務でも混同しやすいAWSサービスを比較します。

初期記事例：

- S3 / EBS / EFS の違い
- EC2 / Lambda / ECS の違い
- RDS / DynamoDB の違い
- CloudWatch / CloudTrail / AWS Config の違い
- SQS / SNS / EventBridge の違い

  

5. AWS構成図解説

AWSサービスを単体で覚えるだけでなく、実際の構成として理解するための構成図解説を作成します。

初期構成例：

- S3 + CloudFront 静的サイト構成
- API Gateway + Lambda + DynamoDB サーバーレスAPI構成
- CloudFront OAC によるS3非公開配信
- AWS Budgets + CloudWatch による低コスト運用監視
- Cognito + API Gateway + Lambda による認証付きAPI構成

  

6. 問い合わせフォーム

問い合わせフォームから送信された内容を、API Gateway + Lambda + DynamoDB で保存します。

入力項目：

- 名前
- メールアドレス
- 件名
- 本文
- honeypot項目

スパム対策として、MVPでは honeypot と文字数制限を導入します。

  

技術スタック

フロントエンド

|   |   |
|---|---|
|技術|用途|
|Next.js|Webアプリケーションフレームワーク|
|TypeScript|型安全な開発|
|Tailwind CSS|UIスタイリング|
|Markdown / MDX|学習コンテンツ管理|
|JSON|用語・問題データ管理|

  

AWS

|   |   |
|---|---|
|サービス|用途|
|Amazon S3|静的ファイル配置|
|Amazon CloudFront|CDN配信・HTTPS配信|
|CloudFront OAC|S3直接公開の防止|
|Amazon API Gateway|問い合わせAPI公開|
|AWS Lambda|問い合わせ保存処理|
|Amazon DynamoDB|問い合わせデータ保存|
|Amazon CloudWatch Logs|Lambdaログ確認|
|AWS Budgets|課金監視|
|IAM|最小権限管理|

  

CI/CD

|   |   |
|---|---|
|技術|用途|
|GitHub Actions|CI/CD|
|GitHub OIDC|AWS認証情報の安全な連携|
|AWS CLI|S3デプロイ・CloudFront Invalidation|

  

アーキテクチャ

MVP構成

User

  ↓ HTTPS

CloudFront

  ↓ OAC

S3 Static Site

User

  ↓ POST /contact

API Gateway HTTP API

  ↓

Lambda contact-submit-function

  ↓ PutItem

DynamoDB ContactsTable

  ↓

CloudWatch Logs

  

AWS構成図

flowchart TD

    User[User]

    CF[Amazon CloudFront]

    S3[(Amazon S3)]

    APIGW[Amazon API Gateway]

    Lambda[AWS Lambda]

    DDB[(Amazon DynamoDB)]

    CW[Amazon CloudWatch Logs]

    Budget[AWS Budgets]

    GH[GitHub Actions]

  

    User -->|HTTPS| CF

    CF -->|OAC| S3

  

    User -->|POST /contact| APIGW

    APIGW --> Lambda

    Lambda -->|PutItem| DDB

    Lambda --> CW

  

    GH -->|Build & Deploy| S3

    GH -->|Invalidation| CF

  

    Budget -->|Cost Alert| User

  

設計方針

1. EC2ではなくS3 + CloudFrontを採用

本プロダクトは静的コンテンツが中心です。

そのため、常時起動サーバーであるEC2ではなく、S3 + CloudFrontによる静的配信を採用しています。

理由：

- 固定費を抑えやすい
- サーバー管理が不要
- 静的サイトと相性が良い
- CloudFrontで高速配信できる
- AWS資格学習の内容と直結する

  

2. RDSではなくDynamoDBを採用

MVPで保存するデータは、問い合わせフォームの送信内容のみです。

複雑なリレーションは不要なため、RDSではなくDynamoDBを採用しています。

理由：

- サーバーレス構成と相性が良い
- 小規模な問い合わせ保存に適している
- 管理負荷が低い
- Lambdaから直接扱いやすい
- RDSより固定費を抑えやすい

  

3. S3は直接公開しない

S3バケットは直接公開せず、CloudFront Origin Access Control を使ってCloudFront経由でのみアクセスできるようにしています。

目的：

- S3の意図しない公開を防ぐ
- HTTPS配信をCloudFrontに集約する
- キャッシュ制御をしやすくする
- セキュリティ設計を明確にする

  

4. 動的APIは最小限にする

MVPでは、AWS用語・模擬問題・記事・構成図は静的ファイルとして管理します。

問い合わせフォームのみAPI化します。

理由：

- SEOに強い静的ページを作れる
- API呼び出しを減らせる
- AWS利用料を抑えられる
- 開発スコープを小さくできる
- まず公開することを優先できる

  

5. 低コスト運用を重視

MVPでは以下のサービスを使いません。

- EC2
- RDS
- NAT Gateway
- ALB
- ECS
- EKS
- OpenSearch
- SageMaker
- WAF

理由：

- 固定費を避けるため
- 個人開発MVPには過剰なため
- AWS無料枠・低コスト運用を重視するため
- 課金事故リスクを下げるため

  

セキュリティ設計

S3 / CloudFront

- S3 Public Access Blockを有効化
- S3を直接公開しない
- CloudFront OACを利用
- Bucket PolicyでCloudFront Distributionからのみ許可
- HTTPアクセスはHTTPSへリダイレクト

  

IAM

- Lambda実行ロールはDynamoDB PutItem のみに制限
- GitHub Actions用ロールはS3デプロイとCloudFront Invalidationのみに制限
- rootユーザーのアクセスキーは作成しない
- 管理ユーザーにはMFAを設定
- AdministratorAccessの常用を避ける

  

Lambda / API

- Lambda側で入力値検証を実施
- honeypotで簡易スパム対策
- CORSは本番Originに限定
- CloudWatch Logsにメールアドレス全文・問い合わせ本文全文を出力しない
- LambdaはVPCに接続しない
- タイムアウトは短めに設定

  

GitHub

- .env はコミットしない
- GitHub Secretsで必要情報を管理
- AWS認証はOIDC方式を推奨
- GitHub Actionsには最小権限のみ付与

  

コスト最適化

本プロジェクトでは、AWS利用料を抑えるために以下の設計を採用しています。

|   |   |
|---|---|
|項目|方針|
|Web配信|S3 + CloudFront|
|API|API Gateway HTTP API|
|処理|Lambda|
|DB|DynamoDB|
|課金監視|AWS Budgets|
|ログ|CloudWatch Logs保存期間を14〜30日に設定|
|常時起動サーバー|使用しない|

MVPで避けるサービス：

EC2

RDS

NAT Gateway

ALB

OpenSearch

SageMaker

  

CI/CD

GitHub Actionsを使って、フロントエンドのCI/CDを構築します。

CI

Pull Request時に以下を実行します。

- Lint
- TypeScript型チェック
- Build

CD

main ブランチへmergeされると、以下を実行します。

GitHub Actions

  ↓

Next.js build

  ↓

S3 sync

  ↓

CloudFront Invalidation

  ↓

本番反映

AWS認証

推奨構成では GitHub OIDC を利用し、長期AWSアクセスキーをGitHub Secretsに保存しない構成を目指します。

GitHub Actions用IAM Roleには以下のみ許可します。

- s3:ListBucket
- s3:PutObject
- s3:DeleteObject
- cloudfront:CreateInvalidation

  

ディレクトリ構成

aws-cert-roadmap-lab/

├── frontend/

│   ├── app/

│   ├── components/

│   ├── contents/

│   │   ├── terms/

│   │   ├── questions/

│   │   ├── comparisons/

│   │   ├── architectures/

│   │   └── blog/

│   ├── lib/

│   └── public/

│

├── backend/

│   └── functions/

│       └── contact_submit/

│           ├── app.py

│           └── requirements.txt

│

├── infra/

│   └── sam-template.yaml

│

├── docs/

│   ├── designs/

│   ├── operations/

│   └── screenshots/

│

├── .github/

│   └── workflows/

│       ├── ci.yml

│       └── deploy-frontend.yml

│

├── .gitignore

└── README.md

  

ローカル開発

前提

- Node.js LTS
- npm または pnpm
- Python 3.11以上
- AWS CLI 任意

セットアップ

git clone https://github.com/<your-name>/aws-cert-roadmap-lab.git

cd aws-cert-roadmap-lab/frontend

npm install

開発サーバー起動

npm run dev

Lint

npm run lint

型チェック

npm run typecheck

静的ビルド

npm run build

静的出力は以下に生成されます。

frontend/out/

  

環境変数

フロントエンド

NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

NEXT_PUBLIC_SITE_URL=https://xxxxxxxx.cloudfront.net

注意：NEXT_PUBLIC_ が付く環境変数はブラウザに公開されます。

  

以下は絶対に入れません。

AWS_SECRET_ACCESS_KEY

AWS_ACCESS_KEY_ID

OPENAI_API_KEY

DATABASE_PASSWORD

JWT_SECRET

  

API仕様

POST /contact

問い合わせフォームの内容を保存します。

Request

{

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "honeypot": ""

}

Response

{

  "success": true,

  "data": {

    "contactId": "contact-xxxxxxxx",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-xxxxxxxx"

}

Validation

|   |   |
|---|---|
|項目|ルール|
|name|必須、1〜100文字|
|email|必須、メール形式、255文字以内|
|subject|必須、1〜150文字|
|message|必須、1〜2,000文字|
|sourcePage|任意、255文字以内|
|honeypot|空文字|

  

データ設計

ContactsTable

|   |   |   |
|---|---|---|
|属性|型|内容|
|contactId|String|問い合わせID|
|createdAt|String|作成日時|
|name|String|名前|
|email|String|メールアドレス|
|subject|String|件名|
|message|String|本文|
|sourcePage|String|送信元ページ|
|status|String|new / in_progress / closed|
|requestId|String|リクエストID|
|userAgent|String|User-Agent|

MVPでは問い合わせ一覧取得APIや管理画面は作成しません。

  

運用監視

MVPでは、監視を作り込みすぎず、以下を中心に運用します。

- AWS Budgets
- CloudWatch Logs
- CloudWatch Metrics
- Cost Explorer
- GitHub Actionsログ
- 手動死活確認

確認項目：

|   |   |
|---|---|
|対象|確認内容|
|CloudFront|サイト表示、4xx/5xx|
|S3|ファイル存在、直接公開されていないか|
|API Gateway|4xx/5xx、リクエスト数|
|Lambda|Errors、Duration、Logs|
|DynamoDB|問い合わせ保存、ItemCount|
|CloudWatch Logs|個人情報が出力されていないか|
|AWS Budgets|月額費用、予測超過|
|GitHub Actions|CI/CD成功・失敗|

  

MVPスコープ

実装するもの

- トップページ
- 学習ロードマップ
- AWS用語集
- AWS用語詳細
- CLF-C02模擬問題
- 模擬問題回答UI
- AWSサービス比較記事
- AWS構成図解説
- ブログ記事
- 問い合わせフォーム
- 問い合わせAPI
- DynamoDB保存
- S3 + CloudFront公開
- CloudFront OAC
- AWS Budgets
- CloudWatch Logs
- GitHub Actions CI/CD
- README整備

  

MVPでは実装しないもの

- ログイン機能
- Cognito
- ユーザー別学習履歴
- 正答率保存
- 復習問題機能
- 毎日1問メール通知
- SES
- WAF
- RDS
- EC2
- NAT Gateway
- ALB
- AI自動解説
- 決済機能
- 有料会員機能

  

今後の拡張予定

Phase 4：収益化準備

- 独自ドメイン導入
- Google Search Console登録
- Google Analytics導入
- Google AdSense申請
- AWS用語50件以上
- CLF-C02問題50問以上
- SAA-C03問題追加
- 比較記事10本以上
- 構成図解説10本以上
- SEO内部リンク強化

  

Phase 5：学習アプリ化

- Cognitoログイン
- マイページ
- 回答履歴保存
- 正答率表示
- 苦手カテゴリ分析
- 復習問題機能
- 今日の1問
- EventBridgeによる定期処理
- SESによる通知
- 有料教材・有料機能の検討

  

学習・実装で意識したAWS観点

このプロジェクトでは、AWS資格で学ぶ内容を実装に落とし込んでいます。

|   |   |
|---|---|
|AWS学習項目|実装での対応|
|グローバルインフラ|CloudFrontによる配信|
|ストレージ|S3による静的ファイル保存|
|コンピューティング|Lambdaによるサーバーレス処理|
|データベース|DynamoDBによる問い合わせ保存|
|ネットワーク|CloudFront / API Gateway|
|セキュリティ|IAM最小権限 / OAC / CORS|
|監視|CloudWatch Logs / Metrics|
|コスト管理|AWS Budgets / Cost Explorer|
|自動化|GitHub Actions CI/CD|

  

ポートフォリオとしてのアピールポイント

1. AWS資格学習と実装を接続

資格勉強で学んだAWSサービスを、実際に動くWebアプリとして構成しました。

単なる学習メモではなく、AWS上に公開できる形にしています。

  

2. サーバーレス構成

API Gateway + Lambda + DynamoDB を使い、常時起動サーバーなしで問い合わせAPIを実装しています。

  

3. セキュリティ設計

S3を直接公開せず、CloudFront OACを利用しています。

また、IAM権限を最小化し、LambdaにはDynamoDB PutItem のみを付与しています。

  

4. コスト最適化

EC2、RDS、NAT Gateway、ALBを使わず、AWS BudgetsとCloudWatch Logs保存期間設定で課金事故を防ぐ設計にしています。

  

5. CI/CD

GitHub Actionsで、Pull Request時の検証とmainブランチへの自動デプロイを実装します。

  

6. 将来の収益化設計

SEO記事、AWS用語集、模擬問題、構成図解説を増やし、AdSenseや有料教材への拡張を想定しています。

  

開発ロードマップ

|   |   |   |
|---|---|---|
|Phase|内容|状態|
|Phase 0|開発準備・設計|Planned|
|Phase 1|静的サイトMVP|Planned|
|Phase 2|AWS公開・問い合わせAPI|Planned|
|Phase 3|CI/CD・運用監視|Planned|
|Phase 4|収益化準備|Future|
|Phase 5|学習アプリ化|Future|

  

ライセンス

未定です。

個人ポートフォリオとして公開する場合は、以下のどちらかを検討します。

- MIT License
- All Rights Reserved

学習コンテンツを含むため、コンテンツの再利用範囲は慎重に決定します。

  

作者

Name: ふみくん

Role: AWS / AI / Web Development Learner

Goal: AIプロダクト開発・PMを目指すポートフォリオ制作

  

関連ドキュメント

docs/designs/

├── project-plan.md

├── requirements.md

├── screen-list-and-flow.md

├── aws-architecture-design.md

├── data-design.md

├── api-design.md

├── security-design.md

├── cost-management-design.md

├── infrastructure-build-guide.md

├── lambda-implementation-design.md

├── cicd-design.md

├── operations-monitoring-design.md

└── development-tasks.md

  

まとめ

AWS Cert Roadmap Lab は、AWS資格学習を実装に変換するためのポートフォリオです。

MVPでは、静的学習サイトをS3 + CloudFrontで公開し、問い合わせフォームのみAPI Gateway + Lambda + DynamoDBで実装します。

これにより、以下を実践します。

- AWSサーバーレス構成
- S3 + CloudFront + OAC
- API Gateway + Lambda + DynamoDB
- IAM最小権限
- CloudWatch Logs
- AWS Budgets
- GitHub Actions CI/CD
- コスト最適化
- セキュリティ設計
- 将来的なSEO・広告収益化

資格勉強で終わらず、実際にAWS上で動くプロダクトとして公開することを目標にしています。