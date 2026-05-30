AWS資格学習サイト 開発タスク一覧

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト 開発タスク一覧|
|対象プロダクト|AWS資格ロードマップラボ|
|目的|これまで作成した設計書を、実装可能なタスク単位に分解する|
|対象フェーズ|Phase 0 〜 Phase 4|
|優先実装範囲|MVP：静的学習サイト + 問い合わせAPI + AWS公開 + CI/CD|
|作成日|2026-05-30|

  

2. 本タスク一覧の目的

本書は、AWS資格学習サイト「AWS資格ロードマップラボ」を実装するための開発タスク一覧である。

これまで作成した以下の設計書をもとに、実際に開発・構築できる単位までタスクを分解する。

- 企画書
- 要件定義書
- 画面一覧・画面遷移設計書
- AWS構成図設計書
- データ設計書
- API設計書
- セキュリティ設計書
- コスト管理設計書
- インフラ構築手順書
- Lambda実装設計書
- CI/CD設計書
- 運用監視設計書

MVPでは、作りすぎないことを重視する。

MVPで作るものは以下に限定する。

AWS資格学習サイトの静的ページ

AWS用語集

CLF-C02模擬問題

AWSサービス比較記事

AWS構成図解説

ブログ記事

問い合わせフォーム

API Gateway + Lambda + DynamoDB 問い合わせAPI

S3 + CloudFront + OAC 公開構成

GitHub ActionsによるS3デプロイ

AWS Budgets / CloudWatch Logs 運用監視

MVPでは、以下は作らない。

ログイン機能

ユーザー別学習履歴

正答率保存

復習機能

毎日1問通知

Cognito

SES

WAF

RDS

EC2

NAT Gateway

ALB

AI自動解説

有料会員機能

  

3. フェーズ定義

3.1 フェーズ一覧

|   |   |   |   |
|---|---|---|---|
|Phase|名称|目的|完了基準|
|Phase 0|開発準備|リポジトリ、技術構成、設計書を整える|開発開始できる状態|
|Phase 1|静的サイトMVP|学習サイトとして最低限閲覧できる状態にする|ローカルで主要ページ表示|
|Phase 2|AWS公開・問い合わせAPI|AWS上で公開し、問い合わせ保存できる状態にする|CloudFront公開 + POST /contact成功|
|Phase 3|CI/CD・運用監視|自動デプロイと最低限の運用監視を整える|main pushで自動公開|
|Phase 4|収益化準備|SEO記事・AdSense準備・独自ドメイン検討|収益化申請可能な品質|
|Phase 5|学習アプリ化|ログイン・学習履歴・復習機能を追加|ユーザー別学習管理が可能|

3.2 MVP対象範囲

MVP対象は以下までとする。

Phase 0

Phase 1

Phase 2

Phase 3

Phase 4以降は、MVP公開後に進める。

  

4. 優先度定義

|   |   |
|---|---|
|優先度|意味|
|Must|MVP完成に必須|
|Should|MVP品質を上げるために重要|
|Could|余裕があれば実装|
|Later|Phase 4以降で実装|

  

5. 見積もり単位

5.1 見積もり表記

|   |   |
|---|---|
|表記|目安|
|XS|30分〜1時間|
|S|1〜2時間|
|M|半日|
|L|1日|
|XL|2日以上|

5.2 注意

見積もりは個人開発・学習込みの目安である。

AWS設定やNext.jsのエラー対応により、実際には増える可能性がある。

  

Phase 0：開発準備

6. Phase 0 目的

開発を始める前に、リポジトリ、技術構成、ディレクトリ、基本設定、設計ドキュメントを整える。

  

7. Phase 0 タスク一覧

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|タスク|優先度|見積|依存|完了条件|
|P0-001|GitHubリポジトリ作成|Must|XS|なし|GitHub上にリポジトリがある|
|P0-002|README初期作成|Must|S|P0-001|プロジェクト概要が記載されている|
|P0-003|ディレクトリ構成作成|Must|S|P0-001|frontend / backend / docs / infra がある|
|P0-004|.gitignore作成|Must|XS|P0-001|.env / node_modules / .next / out が除外されている|
|P0-005|設計書格納ディレクトリ作成|Should|XS|P0-003|docs/designs がある|
|P0-006|技術スタック確定|Must|S|なし|Next.js / TypeScript / AWS構成が確定|
|P0-007|ローカルNode.js環境確認|Must|XS|なし|node / npm または pnpm が使える|
|P0-008|AWSアカウント確認|Must|XS|なし|AWS Management Consoleへログインできる|
|P0-009|AWS root MFA設定|Must|S|P0-008|rootユーザーにMFA設定済み|
|P0-010|AWS Budgets初期設定|Must|S|P0-008|月額Budget通知が設定済み|

  

8. Phase 0 詳細タスク

P0-001 GitHubリポジトリ作成

内容

GitHubにプロジェクト用リポジトリを作成する。

推奨リポジトリ名

aws-cert-roadmap-lab

完了条件

- GitHub上にリポジトリが存在する
- localにcloneできる
- mainブランチが存在する

  

P0-003 ディレクトリ構成作成

推奨構成

aws-cert-roadmap-lab/

├── frontend/

├── backend/

├── infra/

├── docs/

│   ├── designs/

│   ├── operations/

│   └── screenshots/

├── .github/

│   └── workflows/

├── .gitignore

└── README.md

完了条件

- 上記ディレクトリが作成済み
- 空ディレクトリには .gitkeep を配置

  

P0-004 .gitignore作成

内容

秘密情報・ビルド成果物・依存関係をGit管理から除外する。

設定例

.env

.env.local

.env.production

.env.development

node_modules/

.next/

out/

dist/

__pycache__/

*.pyc

*.zip

*.pem

*.key

.DS_Store

aws-credentials.json

完了条件

- .env がGit管理対象外
- node_modules がGit管理対象外
- out がGit管理対象外

  

Phase 1：静的サイトMVP

9. Phase 1 目的

ローカル環境でAWS資格学習サイトとして最低限使える静的サイトを作る。

この段階ではAWS公開は必須ではない。

  

10. Phase 1 タスク一覧

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|タスク|優先度|見積|依存|完了条件|
|P1-001|Next.jsプロジェクト作成|Must|M|P0|frontendが起動する|
|P1-002|TypeScript / ESLint設定|Must|S|P1-001|lint / typecheckが動く|
|P1-003|Tailwind CSS設定|Should|S|P1-001|スタイルが適用される|
|P1-004|静的export設定|Must|S|P1-001|out/ が生成される|
|P1-005|共通レイアウト作成|Must|M|P1-001|Header / Footer / Mainがある|
|P1-006|トップページ作成|Must|M|P1-005|/ が表示される|
|P1-007|学習ロードマップページ作成|Must|M|P1-005|/roadmap が表示される|
|P1-008|AWS用語集一覧ページ作成|Must|L|P1-010|/terms が表示される|
|P1-009|AWS用語詳細ページ作成|Must|L|P1-010|/terms/{termId} が表示される|
|P1-010|AWS用語JSON作成|Must|L|なし|30件以上の用語がある|
|P1-011|模擬問題一覧ページ作成|Must|L|P1-013|/questions が表示される|
|P1-012|模擬問題詳細・回答UI作成|Must|XL|P1-013|選択肢・正誤・解説が表示される|
|P1-013|CLF-C02模擬問題JSON作成|Must|XL|なし|30問以上の問題がある|
|P1-014|サービス比較一覧ページ作成|Should|M|P1-015|/comparisons が表示される|
|P1-015|サービス比較MDX作成|Should|L|なし|5本以上の比較記事がある|
|P1-016|構成図一覧ページ作成|Should|M|P1-017|/architectures が表示される|
|P1-017|構成図解説MDX作成|Should|L|なし|5本以上の構成図記事がある|
|P1-018|ブログ一覧ページ作成|Should|M|P1-019|/blog が表示される|
|P1-019|ブログ記事MDX作成|Should|L|なし|5本以上の記事がある|
|P1-020|問い合わせページUI作成|Must|M|P1-005|/contact が表示される|
|P1-021|運営者情報ページ作成|Must|S|P1-005|/about が表示される|
|P1-022|プライバシーポリシー作成|Must|S|P1-005|/privacy が表示される|
|P1-023|免責事項ページ作成|Must|S|P1-005|/disclaimer が表示される|
|P1-024|404ページ作成|Should|S|P1-005|404ページが表示される|
|P1-025|SEOメタデータ設定|Should|M|各ページ|title / descriptionが設定済み|
|P1-026|sitemap生成設定|Should|M|各ページ|sitemap.xmlが生成される|
|P1-027|robots.txt作成|Should|XS|なし|robots.txtがある|
|P1-028|レスポンシブ対応|Must|M|各ページ|スマホ表示で崩れない|
|P1-029|ローカル表示確認|Must|M|P1全体|主要ページが表示される|
|P1-030|静的build確認|Must|S|P1全体|npm run build が成功する|

  

11. Phase 1 主要タスク詳細

P1-001 Next.jsプロジェクト作成

内容

frontend配下にNext.jsプロジェクトを作成する。

推奨

Next.js

TypeScript

App Router

Tailwind CSS

Static Export

完了条件

- frontend で npm run dev が成功する
- ブラウザでトップページが表示される

  

P1-004 静的export設定

内容

S3 + CloudFrontで配信できるよう、Next.jsを静的出力にする。

設定例

const nextConfig = {

  output: 'export',

  images: {

    unoptimized: true,

  },

};

  

export default nextConfig;

完了条件

- npm run build で out/ が生成される
- out/index.html が存在する

  

P1-010 AWS用語JSON作成

内容

AWS Cloud Practitioner / SAA学習に使うAWS用語データを作成する。

初期作成対象

最低30件。

IAM

S3

EC2

Lambda

VPC

RDS

DynamoDB

CloudFront

Route 53

CloudWatch

CloudTrail

API Gateway

SQS

SNS

EventBridge

EBS

EFS

ELB

Auto Scaling

ACM

KMS

WAF

AWS Budgets

Cost Explorer

Organizations

AWS Config

Secrets Manager

Systems Manager

CloudFormation

Cognito

完了条件

- frontend/contents/terms/terms.json がある
- 30件以上の用語がある
- termIdが重複していない
- 用語一覧・詳細ページで表示できる

  

P1-013 CLF-C02模擬問題JSON作成

内容

AWS Cloud Practitioner向けの模擬問題をJSONで作成する。

初期問題数

30問

カテゴリ配分案

|   |   |
|---|---|
|カテゴリ|問題数|
|Cloud Concepts|8|
|Security and Compliance|8|
|Cloud Technology and Services|9|
|Billing, Pricing, and Support|5|

完了条件

- frontend/contents/questions/clf-c02.json がある
- 30問以上ある
- 各問題に4択がある
- 正解と解説がある
- 模擬問題画面で回答できる

  

P1-020 問い合わせページUI作成

内容

問い合わせフォームのUIを作成する。

フィールド

|   |   |
|---|---|
|項目|必須|
|名前|必須|
|メールアドレス|必須|
|件名|必須|
|本文|必須|
|honeypot|hidden|

MVP段階

この段階ではAPI接続前でもよい。

完了条件

- /contact が表示される
- 入力フォームがある
- フロント側バリデーションがある
- 送信ボタンがある
- honeypot項目がある

  

Phase 2：AWS公開・問い合わせAPI

12. Phase 2 目的

AWS上にサイトを公開し、問い合わせフォームの送信内容をDynamoDBに保存できるようにする。

  

13. Phase 2 タスク一覧

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|タスク|優先度|見積|依存|完了条件|
|P2-001|S3バケット作成|Must|S|P0-010|バケット作成済み|
|P2-002|S3 Public Access Block確認|Must|XS|P2-001|全ブロックON|
|P2-003|フロントビルド成果物をS3アップロード|Must|S|P1-030, P2-001|S3にindex.htmlがある|
|P2-004|CloudFront Distribution作成|Must|M|P2-001|Distribution作成済み|
|P2-005|CloudFront OAC設定|Must|M|P2-004|OAC設定済み|
|P2-006|S3 Bucket Policy設定|Must|S|P2-005|CloudFrontのみ許可|
|P2-007|CloudFront表示確認|Must|M|P2-006|CloudFront URLで表示|
|P2-008|S3直接アクセス拒否確認|Must|S|P2-006|Access Deniedになる|
|P2-009|CloudFrontエラーページ設定|Should|S|P2-004|404が適切に表示|
|P2-010|DynamoDB ContactsTable作成|Must|S|P0-010|ContactsTableProd作成済み|
|P2-011|Lambda実行ロール作成|Must|M|P2-010|PutItem権限のみ|
|P2-012|contact-submit Lambda作成|Must|M|P2-011|Lambda作成済み|
|P2-013|Lambda環境変数設定|Must|XS|P2-012|CONTACTS_TABLE_NAME等設定済み|
|P2-014|Lambdaコード実装|Must|L|P2-012|POST処理が実装済み|
|P2-015|Lambda単体テスト|Must|M|P2-014|正常・異常系テスト成功|
|P2-016|API Gateway HTTP API作成|Must|M|P2-014|API作成済み|
|P2-017|POST /contact Route作成|Must|S|P2-016|Route作成済み|
|P2-018|API GatewayとLambda統合|Must|S|P2-017|Lambda呼び出し成功|
|P2-019|CORS設定|Must|S|P2-018|CloudFront Origin許可|
|P2-020|curlで問い合わせAPI確認|Must|M|P2-019|201レスポンス|
|P2-021|DynamoDB保存確認|Must|S|P2-020|item保存確認|
|P2-022|CloudWatch Logs確認|Must|S|P2-020|ログ出力確認|
|P2-023|CloudWatch Logs保存期間設定|Must|XS|P2-022|14〜30日設定|
|P2-024|フロント問い合わせフォームとAPI接続|Must|M|P2-020|画面から送信可能|
|P2-025|CloudFront上から問い合わせ送信確認|Must|M|P2-024|本番URLから保存成功|
|P2-026|API異常系テスト|Must|M|P2-024|400/405等が返る|
|P2-027|honeypot動作確認|Should|S|P2-024|スパム保存されない|
|P2-028|課金確認|Must|S|P2全体|想定外課金なし|

  

14. Phase 2 主要タスク詳細

P2-001 S3バケット作成

内容

静的サイトファイル配置用のS3バケットを作成する。

完了条件

- S3バケットが存在する
- Regionはap-northeast-1
- Public Access Blockが有効
- 静的Webホスティングは使わない

  

P2-004 CloudFront Distribution作成

内容

S3をOriginにしたCloudFront Distributionを作成する。

完了条件

- Distributionが作成済み
- Default root objectが index.html
- Viewer protocol policyが Redirect HTTP to HTTPS
- OAC利用前提になっている

  

P2-014 Lambdaコード実装

内容

POST /contact 用のLambdaをPythonで実装する。

必須処理

JSONパース

honeypot確認

入力値検証

contactId生成

createdAt生成

DynamoDB PutItem

成功レスポンス返却

エラーレスポンス返却

CloudWatch Logs出力

完了条件

- 正常データでDynamoDB保存できる
- 不正JSONで400を返す
- 入力値エラーで400を返す
- honeypot入力時は保存しない
- email全文とmessage全文をログに出さない

  

P2-024 フロント問い合わせフォームとAPI接続

内容

問い合わせフォームからAPI Gatewayの POST /contact を呼び出す。

完了条件

- フォーム入力後にAPIへPOSTされる
- 送信中はボタンがdisabledになる
- 成功時に完了メッセージが表示される
- エラー時に項目別エラーが表示される
- CloudFront上から正常送信できる

  

Phase 3：CI/CD・運用監視

15. Phase 3 目的

手動デプロイから脱却し、GitHub Actionsでフロントエンドを自動デプロイできるようにする。

あわせて、最低限の運用監視を整える。

  

16. Phase 3 タスク一覧

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|タスク|優先度|見積|依存|完了条件|
|P3-001|GitHub Actions CI作成|Must|M|P1|PR時にCI実行|
|P3-002|lint script整備|Must|S|P3-001|lintが通る|
|P3-003|typecheck script整備|Must|S|P3-001|typecheckが通る|
|P3-004|build script整備|Must|S|P3-001|buildが通る|
|P3-005|GitHub Actions用IAM Role作成|Must|M|P2|Role作成済み|
|P3-006|GitHub OIDC Provider設定|Should|M|P3-005|OIDCでAssumeRole可能|
|P3-007|GitHub Actions用IAM Policy作成|Must|M|P3-005|S3/CloudFront最小権限|
|P3-008|GitHub Secrets / Variables設定|Must|S|P3-005|必要値が設定済み|
|P3-009|deploy-frontend workflow作成|Must|L|P3-008|main pushでデプロイ|
|P3-010|S3 sync動作確認|Must|M|P3-009|S3へ反映|
|P3-011|CloudFront Invalidation動作確認|Must|M|P3-009|最新表示確認|
|P3-012|GitHub Actionsログ確認|Must|S|P3-009|成功ログ確認|
|P3-013|デプロイ失敗時のRunbook作成|Should|S|P3-009|docsに記載済み|
|P3-014|CloudWatch Logs保存期間確認|Must|XS|P2-023|Never expireではない|
|P3-015|Lambda Metrics確認|Must|S|P2-012|Errors/Duration確認可能|
|P3-016|API Gateway Metrics確認|Must|S|P2-016|4xx/5xx確認可能|
|P3-017|DynamoDB Metrics確認|Should|S|P2-010|書き込み・ItemCount確認可能|
|P3-018|Cost Explorer確認|Must|S|P2|サービス別費用確認|
|P3-019|運用Runbook作成|Should|M|運用監視設計|障害時確認順序がある|
|P3-020|READMEにAWS構成・CI/CD追記|Must|M|P3|README更新済み|

  

17. Phase 3 主要タスク詳細

P3-001 GitHub Actions CI作成

内容

Pull Request時にlint、typecheck、buildを実行する。

完了条件

- .github/workflows/ci.yml がある
- PR作成時にWorkflowが起動する
- lint / typecheck / buildが成功する

  

P3-009 deploy-frontend workflow作成

内容

mainブランチ更新時にS3 + CloudFrontへ自動デプロイする。

完了条件

- .github/workflows/deploy-frontend.yml がある
- main pushでWorkflowが起動する
- npm run build が成功する
- aws s3 sync ./out s3://... --delete が成功する
- cloudfront create-invalidation が成功する

  

P3-020 READMEにAWS構成・CI/CD追記

内容

GitHub READMEにポートフォリオ説明用の情報を記載する。

記載項目

プロダクト概要

技術スタック

AWS構成

画面一覧

主要機能

CI/CD

セキュリティ設計

コスト最適化

今後の拡張予定

完了条件

- READMEを読めば何を作ったか分かる
- AWS構成が説明されている
- CI/CDが説明されている
- コスト最適化が説明されている

  

Phase 4：収益化準備

18. Phase 4 目的

AdSenseやSEO流入を見据え、コンテンツ品質とサイト信頼性を高める。

このPhaseはMVP公開後に実施する。

  

19. Phase 4 タスク一覧

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|タスク|優先度|見積|依存|完了条件|
|P4-001|独自ドメイン取得検討|Should|S|MVP公開|導入判断済み|
|P4-002|Route 53 Hosted Zone作成|Could|M|P4-001|DNS管理開始|
|P4-003|ACM証明書作成|Could|M|P4-002|us-east-1でIssued|
|P4-004|CloudFront独自ドメイン設定|Could|M|P4-003|独自ドメイン表示|
|P4-005|Google Search Console登録|Should|S|P4-004任意|所有権確認済み|
|P4-006|sitemap.xml送信|Should|S|P4-005|sitemap送信済み|
|P4-007|Google Analytics導入|Should|M|P4-005|計測開始|
|P4-008|プライバシーポリシー更新|Must|S|P4-007|Analytics/AdSense記載|
|P4-009|ブログ記事20本作成|Should|XL|P1-019|20本以上公開|
|P4-010|AWS用語50件化|Should|L|P1-010|50件以上|
|P4-011|CLF問題50問化|Should|XL|P1-013|50問以上|
|P4-012|SAA問題30問作成|Could|XL|P1-013|SAA問題がある|
|P4-013|サービス比較10本化|Should|XL|P1-015|10本以上|
|P4-014|構成図10本化|Should|XL|P1-017|10本以上|
|P4-015|AdSense申請準備|Could|M|P4-008, P4-009|申請準備完了|
|P4-016|AdSense審査コード設置|Could|S|P4-015|コード設置済み|
|P4-017|note / X導線設置|Should|S|MVP公開|外部導線がある|
|P4-018|OGP画像整備|Should|M|各記事|主要ページにOGPあり|
|P4-019|SEO内部リンク整備|Should|M|コンテンツ|関連リンクがある|
|P4-020|Search Consoleエラー確認|Should|S|P4-005|エラー確認済み|

  

Phase 5：学習アプリ化

20. Phase 5 目的

単なる静的学習サイトから、ユーザー別に学習履歴・正答率・復習問題を管理できる学習アプリへ拡張する。

  

21. Phase 5 タスク一覧

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|タスク|優先度|見積|依存|完了条件|
|P5-001|Cognito導入設計|Later|L|MVP|認証方針確定|
|P5-002|Cognito User Pool作成|Later|M|P5-001|User Pool作成済み|
|P5-003|ログイン画面作成|Later|L|P5-002|ログイン可能|
|P5-004|新規登録画面作成|Later|L|P5-002|登録可能|
|P5-005|認証状態管理|Later|L|P5-002|ログイン状態判定可能|
|P5-006|UserProfileTable作成|Later|M|P5-002|プロフィール保存可能|
|P5-007|UserAnswersTable作成|Later|M|P5-002|回答履歴保存可能|
|P5-008|UserProgressTable作成|Later|M|P5-002|進捗保存可能|
|P5-009|POST /answers API実装|Later|XL|P5-007|回答履歴保存可能|
|P5-010|GET /progress API実装|Later|L|P5-008|進捗取得可能|
|P5-011|マイページ作成|Later|XL|P5-010|正答率表示可能|
|P5-012|復習問題機能作成|Later|XL|P5-009|不正解問題を復習可能|
|P5-013|弱点カテゴリ分析|Later|L|P5-010|苦手分野表示|
|P5-014|毎日1問機能設計|Later|M|P5|方針確定|
|P5-015|EventBridge設定|Later|M|P5-014|定期実行可能|
|P5-016|SES通知検討|Later|L|P5-014|メール通知方針確定|
|P5-017|通知停止設定|Later|M|P5-016|ユーザーが停止可能|
|P5-018|認証付きAPI監視|Later|M|P5|4xx/5xx監視可能|
|P5-019|退会・データ削除方針作成|Later|M|P5|方針文書化|
|P5-020|有料機能検討|Later|XL|利用者増加後|方針確定|

  

横断タスク

22. テスト関連タスク

|   |   |   |   |   |
|---|---|---|---|---|
|ID|タスク|優先度|見積|対象|
|T-001|フロント主要画面表示テスト|Must|M|Phase 1|
|T-002|スマホ表示確認|Must|M|Phase 1|
|T-003|模擬問題回答テスト|Must|M|Phase 1|
|T-004|問い合わせフォーム正常系テスト|Must|M|Phase 2|
|T-005|問い合わせフォーム異常系テスト|Must|M|Phase 2|
|T-006|honeypotテスト|Should|S|Phase 2|
|T-007|API Gateway CORSテスト|Must|S|Phase 2|
|T-008|Lambdaログ確認テスト|Must|S|Phase 2|
|T-009|DynamoDB保存確認テスト|Must|S|Phase 2|
|T-010|GitHub Actionsデプロイテスト|Must|M|Phase 3|
|T-011|S3直接アクセス拒否テスト|Must|S|Phase 2|
|T-012|CloudFront表示テスト|Must|S|Phase 2|

  

23. セキュリティ関連タスク

|   |   |   |   |   |
|---|---|---|---|---|
|ID|タスク|優先度|見積|完了条件|
|SEC-001|root MFA確認|Must|XS|MFA有効|
|SEC-002|rootアクセスキーなし確認|Must|XS|root keyなし|
|SEC-003|S3 Public Access Block確認|Must|XS|全ブロックON|
|SEC-004|CloudFront OAC確認|Must|S|OAC設定済み|
|SEC-005|Bucket Policy確認|Must|S|CloudFrontのみ許可|
|SEC-006|Lambda IAM最小権限確認|Must|S|PutItemのみ|
|SEC-007|GitHub Secrets確認|Must|S|秘密情報のみ格納|
|SEC-008|.env未コミット確認|Must|XS|Git管理外|
|SEC-009|CloudWatch Logs個人情報確認|Must|S|email/message全文なし|
|SEC-010|CORS本番Origin限定|Must|S|CloudFront/独自ドメインのみ|
|SEC-011|GitHub OIDC移行|Should|M|長期キー不要|
|SEC-012|不要IAM権限削除|Should|S|AdministratorAccessなし|

  

24. コスト関連タスク

|   |   |   |   |   |
|---|---|---|---|---|
|ID|タスク|優先度|見積|完了条件|
|COST-001|AWS Budgets作成|Must|S|予算通知設定済み|
|COST-002|Cost Explorer確認|Must|S|サービス別費用確認済み|
|COST-003|EC2未使用確認|Must|XS|EC2なし|
|COST-004|RDS未使用確認|Must|XS|RDSなし|
|COST-005|NAT Gateway未使用確認|Must|XS|NATなし|
|COST-006|ALB未使用確認|Must|XS|ALBなし|
|COST-007|CloudWatch Logs保存期間設定|Must|XS|14〜30日|
|COST-008|S3大容量ファイル確認|Should|S|動画・巨大画像なし|
|COST-009|CloudFront転送量確認|Should|S|急増なし|
|COST-010|不要リソース削除|Must|M|不要リソースなし|

  

25. ドキュメント関連タスク

|   |   |   |   |   |
|---|---|---|---|---|
|ID|タスク|優先度|見積|完了条件|
|DOC-001|README草案作成|Must|M|概要が分かる|
|DOC-002|AWS構成説明追加|Must|M|構成が説明済み|
|DOC-003|セキュリティ説明追加|Should|S|最小権限/OAC等を説明|
|DOC-004|コスト最適化説明追加|Should|S|EC2/RDS未使用理由を説明|
|DOC-005|CI/CD説明追加|Should|S|GitHub Actions説明済み|
|DOC-006|画面スクリーンショット追加|Should|M|READMEに画像あり|
|DOC-007|運用Runbook作成|Should|M|障害対応手順あり|
|DOC-008|ポートフォリオ説明文作成|Must|M|面接用説明がある|
|DOC-009|今後の拡張予定作成|Should|S|Phase 4/5が記載済み|
|DOC-010|学習ログ記事作成|Could|L|note/X用記事あり|

  

MVPリリース判定

26. MVPリリース必須条件

MVPは以下を満たしたらリリース可能とする。

|   |   |   |
|---|---|---|
|ID|条件|必須|
|MVP-001|トップページが表示できる|必須|
|MVP-002|AWS用語集が表示できる|必須|
|MVP-003|AWS用語詳細が表示できる|必須|
|MVP-004|CLF模擬問題が30問以上ある|必須|
|MVP-005|模擬問題に回答できる|必須|
|MVP-006|サービス比較記事が5本以上ある|推奨|
|MVP-007|構成図解説が5本以上ある|推奨|
|MVP-008|ブログ記事が5本以上ある|推奨|
|MVP-009|問い合わせページがある|必須|
|MVP-010|問い合わせAPIが動く|必須|
|MVP-011|DynamoDBに問い合わせが保存される|必須|
|MVP-012|CloudFrontで公開されている|必須|
|MVP-013|S3直接アクセスが拒否される|必須|
|MVP-014|AWS Budgetsが設定済み|必須|
|MVP-015|CloudWatch Logs保存期間が設定済み|必須|
|MVP-016|GitHub Actionsで自動デプロイできる|推奨|
|MVP-017|READMEが整備されている|必須|
|MVP-018|.envやAWSキーがGitHubにない|必須|
|MVP-019|EC2/RDS/NAT Gateway/ALBを使っていない|必須|
|MVP-020|スマホで大きく崩れない|必須|

  

27. MVP後回し条件

以下はMVP時点でなくてもよい。

|   |   |
|---|---|
|項目|理由|
|独自ドメイン|CloudFront URLで公開可能|
|AdSense|コンテンツ不足の可能性がある|
|Google Analytics|MVP公開後でよい|
|Search Console|MVP公開後でよい|
|Cognito|ログイン不要|
|学習履歴|MVPでは静的問題で十分|
|SAA問題100問|8月受験前に拡張でよい|
|WAF|初期アクセスでは過剰|
|reCAPTCHA|honeypotで様子見|
|SAM自動デプロイ|Phase 2以降でよい|

  

推奨実装順序

28. 最短ルート

最短でポートフォリオとして見せられる順番は以下。

1. GitHubリポジトリ作成

2. Next.js静的サイト作成

3. トップ / 用語集 / 問題 / 問い合わせページ作成

4. AWS用語30件作成

5. CLF問題30問作成

6. S3 + CloudFrontで公開

7. DynamoDB + Lambda + API Gatewayで問い合わせAPI作成

8. フロント問い合わせフォームと接続

9. GitHub Actionsで自動デプロイ

10. README整備

11. note / Xで制作過程を発信

12. 学習効果が高い順番

AWS資格学習とポートフォリオ価値を両立するなら、以下の順番がよい。

1. AWS Budgets

2. S3

3. CloudFront

4. OAC / Bucket Policy

5. IAM最小権限

6. DynamoDB

7. Lambda

8. API Gateway

9. CloudWatch Logs

10. GitHub Actions

11. OIDC

12. Cost Explorer

この順番は、Cloud PractitionerとSAAの学習範囲にも直結する。

  

30. 2週間MVPスケジュール案

Week 1：ローカルMVP作成

|   |   |
|---|---|
|Day|タスク|
|Day 1|GitHub作成、Next.js初期化、ディレクトリ整理|
|Day 2|レイアウト、トップ、ロードマップ、運営者ページ作成|
|Day 3|AWS用語JSON 30件、用語一覧・詳細ページ作成|
|Day 4|CLF問題JSON 30問、問題一覧・回答UI作成|
|Day 5|問い合わせページ、プライバシー、免責事項作成|
|Day 6|比較記事・構成図・ブログを最低限追加|
|Day 7|レスポンシブ、SEOメタ、build確認|

Week 2：AWS公開・API・CI/CD

|   |   |
|---|---|
|Day|タスク|
|Day 8|AWS Budgets、S3、CloudFront、OAC設定|
|Day 9|S3アップロード、CloudFront表示確認、S3直接アクセス拒否確認|
|Day 10|DynamoDB、Lambda Role、Lambda作成|
|Day 11|API Gateway、CORS、curlテスト、DynamoDB保存確認|
|Day 12|フロント問い合わせフォーム接続、CloudFront上でテスト|
|Day 13|GitHub Actions CI/CD設定、main pushデプロイ確認|
|Day 14|README整備、スクショ追加、最終確認、発信用記事作成|

  

31. リスク一覧

|   |   |   |
|---|---|---|
|リスク|影響|対策|
|Next.js静的exportで詰まる|S3公開が遅れる|動的機能を使わず静的ページ中心にする|
|AWS設定で詰まる|公開が遅れる|まず手動構築、後でIaC化|
|CORSで詰まる|問い合わせ送信できない|API GatewayとLambda両方のヘッダー確認|
|OAC/Bucket Policyで詰まる|CloudFront表示不可|SourceArnとDistribution IDを確認|
|GitHub Actions OIDCで詰まる|自動デプロイ不可|最初はアクセスキー方式も許容、後でOIDC化|
|コンテンツ作成に時間がかかる|MVP遅延|最初は30用語・30問・5記事に絞る|
|課金事故|金銭負担|Budgets、EC2/RDS/NAT Gateway未使用確認|
|scope拡大|完成しない|MVPではログイン・学習履歴を作らない|

  

32. 完了後のポートフォリオ訴求ポイント

MVP完成後、以下をアピールできる。

32.1 AWS設計力

S3 + CloudFront + OACで静的サイトを安全に配信。

API Gateway + Lambda + DynamoDBで問い合わせAPIを実装。

IAM最小権限、CloudWatch Logs、AWS Budgetsまで考慮。

32.2 コスト最適化

EC2、RDS、NAT Gateway、ALBを使わず、静的配信とサーバーレス構成で低コスト化。

AWS BudgetsとCloudWatch Logs保存期間設定で課金事故を防止。

32.3 セキュリティ

S3を直接公開せずCloudFront OAC経由で配信。

Lambda IAM RoleはDynamoDB PutItemのみに制限。

問い合わせ本文やメールアドレス全文をログに出さない。

32.4 CI/CD

GitHub Actionsでlint/typecheck/buildを実行し、main pushでS3 + CloudFrontへ自動デプロイ。

OIDC方式により長期AWSアクセスキーを使わない構成を目指す。

32.5 学習・発信との相性

AWS資格学習そのものをプロダクト化しており、Cloud Practitioner/SAAの知識を実装に落とし込んだポートフォリオとして説明できる。

  

33. 次に作成する関連ドキュメント

本タスク一覧の次に、以下を作成する。

1. GitHub README草案
2. MVP実装スケジュール詳細版
3. 初期コンテンツ作成テンプレート
4. テスト設計書
5. リリース手順書
6. ポートフォリオ提出用説明資料
7. note記事用の開発ストーリー草案

  

8. 結論

本プロダクトのMVP開発では、最初から大きな学習アプリを作らない。

まずは以下を完成させる。

AWS資格学習サイト

AWS用語集

CLF-C02模擬問題

AWSサービス比較

AWS構成図解説

問い合わせフォーム

AWS公開

サーバーレス問い合わせAPI

CI/CD

最低限の運用監視

README整備

これだけで、AWS Cloud PractitionerとSAAの学習内容を十分にポートフォリオ化できる。

特に評価されやすいポイントは以下である。

- S3 + CloudFront + OAC
- API Gateway + Lambda + DynamoDB
- IAM最小権限
- AWS Budgets
- CloudWatch Logs
- GitHub Actions CI/CD
- コスト最適化
- セキュリティ設計
- SEO/広告収益化を見据えたコンテンツ設計

開発は、2週間MVPを目安に進める。

MVP公開後、独自ドメイン、AdSense、SAA問題追加、Cognitoによる学習履歴機能へ段階的に拡張する。