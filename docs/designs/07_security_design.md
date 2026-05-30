AWS資格学習サイト セキュリティ設計書

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト セキュリティ設計書|
|対象プロダクト|AWS資格ロードマップラボ|
|対象フェーズ|MVP開発 〜 Phase 4 学習アプリ化|
|目的|AWS上で安全にWebサイト・API・データを運用するためのセキュリティ方針を定義する|
|想定技術|S3 / CloudFront / OAC / API Gateway / Lambda / DynamoDB / IAM / CloudWatch / AWS Budgets / GitHub Actions / Cognito|

  

2. 本設計書の目的

本設計書では、AWS資格学習サイト「AWS資格ロードマップラボ」におけるセキュリティ要件、脅威、対策、AWSサービスごとの設定方針を定義する。

本プロダクトは個人開発のポートフォリオであるが、以下の理由からセキュリティ設計を明確にする。

1. AWS上に公開するWebサイトであるため
2. 問い合わせフォームで個人情報を受け取るため
3. 将来的にログイン機能・学習履歴機能を追加するため
4. GitHub Actionsによる自動デプロイを行う可能性があるため
5. 採用面接・ポートフォリオでAWS設計力を説明するため

MVPでは、過剰なセキュリティ製品を導入せず、低コストで必要十分な対策を行う。

  

3. セキュリティ基本方針

3.1 基本方針

|   |   |
|---|---|
|方針|内容|
|最小権限の原則|IAMユーザー、IAMロール、Lambda権限、GitHub Actions権限は必要最小限にする|
|S3直接公開禁止|静的サイトはS3を直接公開せず、CloudFront経由で配信する|
|HTTPS配信|CloudFront経由でHTTPS配信する|
|秘密情報の非公開|AWSアクセスキー、APIキー、環境変数、認証情報をGitHubにコミットしない|
|入力値検証|問い合わせフォームやAPI入力値はフロント・バックエンド両方で検証する|
|個人情報の最小収集|問い合わせに必要な情報のみ取得する|
|ログの最小化|CloudWatch Logsに個人情報や秘密情報を出力しない|
|課金事故防止|セキュリティの一部としてAWS Budgetsを設定し、異常利用を検知する|
|段階的強化|MVPでは基本対策、Phase 4でCognito・認証・ユーザー別アクセス制御を追加する|

  

4. セキュリティ対象範囲

4.1 MVP対象範囲

MVPで守る対象は以下である。

|   |   |
|---|---|
|対象|内容|
|AWSアカウント|rootユーザー、IAMユーザー、MFA、請求保護|
|S3|静的サイトファイル、画像、構成図|
|CloudFront|Web配信、HTTPS、OAC|
|API Gateway|問い合わせAPIの入口|
|Lambda|問い合わせ保存処理|
|DynamoDB|問い合わせデータ保存|
|CloudWatch Logs|Lambdaログ|
|GitHub|ソースコード、GitHub Actions、Secrets|
|問い合わせフォーム|名前、メール、件名、本文|

4.2 将来対象範囲

Phase 4以降で守る対象は以下である。

|   |   |
|---|---|
|対象|内容|
|Cognito|ユーザー登録、ログイン、JWT発行|
|UserProfileTable|ユーザープロフィール|
|UserAnswersTable|回答履歴|
|UserProgressTable|学習進捗|
|ReviewItemsTable|復習対象|
|SES|メール通知|
|EventBridge|毎日1問配信トリガー|
|有料機能|将来の決済、教材販売、会員機能|

  

5. 扱う情報の分類

5.1 情報分類

|   |   |   |   |
|---|---|---|---|
|情報種別|例|機密度|保護方針|
|公開情報|AWS用語、記事、比較表、構成図|低|公開前提。改ざん防止を重視|
|準公開情報|GitHub README、設計書|低〜中|秘密情報を含めない|
|個人情報|問い合わせの名前、メールアドレス、本文|中|DynamoDBに保存し、公開しない|
|認証情報|AWSアクセスキー、GitHub Secrets、JWT|高|GitHubにコミットしない。ログにも出さない|
|学習履歴|回答履歴、正答率、苦手分野|中|ユーザー本人のみアクセス可能にする|
|請求情報|AWS請求、Budgets通知|高|アカウント管理者のみ閲覧|

  

6. 脅威モデル

6.1 想定する脅威

|   |   |   |   |
|---|---|---|---|
|脅威ID|脅威|影響|MVP対策|
|TH-001|S3バケットの意図しない公開|静的ファイル以外の情報漏えい|Public Access Block、OAC、Bucket Policy|
|TH-002|AWSアクセスキーの漏えい|AWSリソース不正利用、課金事故|GitHub Secrets、MFA、最小権限|
|TH-003|問い合わせフォームへのスパム投稿|DynamoDB書き込み増加、運用妨害|バリデーション、honeypot、文字数制限、レート制限検討|
|TH-004|XSS|ユーザー環境で不正スクリプト実行|入力値無害化、Reactの自動エスケープ、HTML直接出力禁止|
|TH-005|APIの不正利用|大量リクエスト、データ保存悪用|CORS制限、入力制限、API Gateway制限検討|
|TH-006|IAM権限過多|侵害時の被害拡大|最小権限、AdministratorAccess常用禁止|
|TH-007|CloudWatch Logsへの個人情報出力|ログ経由の情報漏えい|ログ最小化、本文・メール全文を出力しない|
|TH-008|GitHubへの秘密情報コミット|認証情報漏えい|.gitignore、Secrets利用、コミット前確認|
|TH-009|DynamoDBデータへの不正アクセス|個人情報漏えい|Lambda経由のみ、IAM制限|
|TH-010|課金攻撃・大量アクセス|想定外コスト|AWS Budgets、レート制限、ログ監視|
|TH-011|将来のユーザーIDなりすまし|他ユーザーの学習履歴閲覧|Cognito JWT、userIdをJWTから取得|
|TH-012|CORS設定ミス|外部サイトからのAPI悪用|許可Originを本番ドメインに限定|

  

7. AWSアカウントセキュリティ

7.1 rootユーザー管理

|   |   |
|---|---|
|項目|方針|
|rootユーザー利用|原則使用しない|
|MFA|必ず有効化する|
|アクセスキー|rootユーザーのアクセスキーは作成しない|
|利用場面|請求、アカウント設定など必要時のみ|

7.2 IAMユーザー方針

|   |   |
|---|---|
|項目|方針|
|日常作業|管理用IAMユーザーまたはIAM Identity Centerを利用|
|MFA|管理ユーザーにもMFAを設定|
|権限|作業内容ごとに最小権限を付与|
|アクセスキー|必要な場合のみ発行。使わないキーは削除|
|ローテーション|長期利用するキーは定期的に更新|

7.3 AWS Budgets

AWS Budgetsはセキュリティ対策の一部として必須設定する。

理由：

- アクセスキー漏えい時の不正利用に気づきやすい
- API大量アクセスによる課金増加を検知できる
- 学習中の設定ミスによる課金事故を防ぎやすい

|   |   |
|---|---|
|項目|方針|
|予算タイプ|Cost Budget|
|対象|全AWSサービス|
|通知|メール通知|
|閾値|低めに設定する|
|優先度|MVP着手前に必須|

  

8. IAM設計

8.1 IAM基本方針

|   |   |
|---|---|
|方針|内容|
|最小権限|必要なActionとResourceのみ許可する|
|権限分離|デプロイ用、Lambda実行用、管理用を分ける|
|AdministratorAccess常用禁止|初期学習時以外は避ける|
|明示的なResource指定|可能な限り * を避ける|
|不要権限削除|使わなくなったロール・ポリシーは削除する|

8.2 IAMロール一覧

|   |   |   |   |
|---|---|---|---|
|ロール名|用途|利用者/サービス|Phase|
|lambda-contact-submit-role|問い合わせLambda実行|Lambda|MVP / Phase 2|
|github-actions-deploy-role|S3デプロイ・CloudFront Invalidation|GitHub Actions|Phase 1以降|
|lambda-get-questions-role|問題取得Lambda実行|Lambda|Phase 2以降|
|lambda-user-progress-role|学習履歴Lambda実行|Lambda|Phase 4|
|eventbridge-daily-question-role|毎日1問配信Lambda実行|EventBridge / Lambda|Phase 4|

8.3 Lambda問い合わせ用IAMポリシー

対象

contact-submit-function

許可する操作

- ContactsTableへのPutItem
- CloudWatch Logsへのログ出力

ポリシー例

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Effect": "Allow",

      "Action": [

        "dynamodb:PutItem"

      ],

      "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTable"

    },

    {

      "Effect": "Allow",

      "Action": [

        "logs:CreateLogGroup",

        "logs:CreateLogStream",

        "logs:PutLogEvents"

      ],

      "Resource": "arn:aws:logs:ap-northeast-1:<account-id>:*"

    }

  ]

}

8.4 GitHub Actions用IAM権限

対象

静的サイトのデプロイ。

許可する操作

- S3へのアップロード
- S3内ファイル削除
- CloudFrontキャッシュ無効化

ポリシー例

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Effect": "Allow",

      "Action": [

        "s3:PutObject",

        "s3:DeleteObject"

      ],

      "Resource": "arn:aws:s3:::aws-cert-roadmap-lab-prod/*"

    },

    {

      "Effect": "Allow",

      "Action": [

        "s3:ListBucket"

      ],

      "Resource": "arn:aws:s3:::aws-cert-roadmap-lab-prod"

    },

    {

      "Effect": "Allow",

      "Action": [

        "cloudfront:CreateInvalidation"

      ],

      "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

    }

  ]

}

8.5 避けるべき権限

MVPでは以下を安易に付与しない。

|   |   |
|---|---|
|権限|理由|
|AdministratorAccess|権限過多で危険|
|dynamodb:*|必要以上のDB操作を許可してしまう|
|s3:*|対象外バケットまで操作可能になる可能性がある|
|iam:*|権限昇格リスクがある|
|cloudfront:*|必要以上のCloudFront操作が可能になる|

  

9. S3セキュリティ設計

9.1 基本方針

|   |   |
|---|---|
|項目|方針|
|Public Access|すべてブロックする|
|直接公開|しない|
|配信経路|CloudFront経由のみ|
|OAC|利用する|
|Bucket Policy|CloudFront Distributionからのアクセスのみ許可|
|静的Webホスティング機能|原則使わない。CloudFront + S3 Originで配信する|

9.2 S3 Public Access Block

以下をすべて有効化する。

|   |   |
|---|---|
|設定|値|
|Block public access to buckets and objects granted through new ACLs|ON|
|Block public access to buckets and objects granted through any ACLs|ON|
|Block public access to buckets and objects granted through new public bucket policies|ON|
|Block public and cross-account access to buckets and objects through any public bucket policies|ON|

9.3 CloudFront OAC利用方針

OACを利用し、S3バケットにはCloudFrontからのみアクセスできるようにする。

目的：

- S3バケットの直接公開を避ける
- CloudFront経由でHTTPS配信する
- キャッシュ制御を一元化する
- S3 URLの直接アクセスを防ぐ

9.4 Bucket Policy例

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Sid": "AllowCloudFrontServicePrincipalReadOnly",

      "Effect": "Allow",

      "Principal": {

        "Service": "cloudfront.amazonaws.com"

      },

      "Action": "s3:GetObject",

      "Resource": "arn:aws:s3:::aws-cert-roadmap-lab-prod/*",

      "Condition": {

        "StringEquals": {

          "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

        }

      }

    }

  ]

}

9.5 S3に置いてよいもの・置いてはいけないもの

|   |   |
|---|---|
|置いてよいもの|置いてはいけないもの|
|HTML|AWSアクセスキー|
|CSS|APIキー|
|JavaScript|.envファイル|
|画像|個人情報CSV|
|構成図画像|問い合わせデータのバックアップ|
|OGP画像|JWT、認証情報|

  

10. CloudFrontセキュリティ設計

10.1 基本方針

|   |   |
|---|---|
|項目|方針|
|HTTPS|必須|
|HTTPアクセス|HTTPSへリダイレクト|
|Origin|S3|
|OAC|有効|
|キャッシュ|静的ファイルはキャッシュ有効|
|WAF|MVPでは任意。アクセス増加後に検討|

10.2 Viewer Protocol Policy

Redirect HTTP to HTTPS

HTTPでアクセスされた場合、HTTPSへリダイレクトする。

10.3 セキュリティヘッダー

CloudFront Response Headers Policy またはフロントエンド側で、以下のセキュリティヘッダー設定を検討する。

|   |   |   |
|---|---|---|
|ヘッダー|推奨値|目的|
|Strict-Transport-Security|max-age=31536000; includeSubDomains|HTTPS強制|
|X-Content-Type-Options|nosniff|MIME sniffing防止|
|X-Frame-Options|DENY または SAMEORIGIN|Clickjacking対策|
|Referrer-Policy|strict-origin-when-cross-origin|Referer制御|
|Content-Security-Policy|後述|XSS被害軽減|

10.4 Content Security Policy案

MVP初期では厳しすぎるCSPは開発の妨げになる可能性があるため、段階的に導入する。

初期案

Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.execute-api.ap-northeast-1.amazonaws.com;

注意点

- Google AnalyticsやAdSenseを導入する場合、script-srcやimg-srcの許可先追加が必要
- CSP設定ミスで広告や解析タグが動かなくなる可能性がある
- 最初はReport-Onlyで検証してもよい

10.5 WAF利用方針

AWS WAFは有効だが、MVPでは必須にしない。

理由：

- 個人開発MVPではコスト増加につながる可能性がある
- まずはCORS、入力制限、API Gateway側の制限で対応する
- アクセス増加後、スパム・攻撃が増えた段階で導入を検討する

導入候補タイミング：

- AdSense導入後にアクセスが増えた
- 問い合わせフォームへのスパムが増えた
- APIへの大量アクセスが発生した
- 商用・有料機能を開始した

  

11. API Gatewayセキュリティ設計

11.1 基本方針

|   |   |
|---|---|
|項目|方針|
|API種別|HTTP API|
|CORS|許可Originを限定|
|認証|MVPでは不要。Phase 4でCognito JWT|
|レート制限|問い合わせAPIで検討|
|入力制限|Lambda側で必須|
|エラー応答|内部情報を返さない|

11.2 CORS方針

本番環境では、許可Originを本番フロントエンドのドメインに限定する。

許可する例

https://example.com

https://www.example.com

開発時のみ許可

http://localhost:3000

避ける設定

Access-Control-Allow-Origin: *

11.3 許可メソッド

MVPでは以下のみ。

|   |   |
|---|---|
|メソッド|用途|
|POST|問い合わせ送信|
|OPTIONS|CORSプリフライト|

将来は以下を追加。

|   |   |
|---|---|
|メソッド|用途|
|GET|用語・問題・進捗取得|
|PUT|ユーザー設定更新|

11.4 APIエラー方針

内部情報をそのまま返さない。

悪い例：

{

  "message": "DynamoDB ResourceNotFoundException: Table not found ContactsTable"

}

良い例：

{

  "success": false,

  "error": {

    "code": "INTERNAL_SERVER_ERROR",

    "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

  }

}

11.5 API Gatewayログ

MVPではログを増やしすぎない。

理由：

- CloudWatch Logs課金を抑えるため
- 個人情報をログに出さないため

必要な場合のみ、以下を記録する。

- ステータスコード
- レイテンシ
- リクエストID
- エラー発生有無

  

12. Lambdaセキュリティ設計

12.1 基本方針

|   |   |
|---|---|
|項目|方針|
|実行ロール|機能ごとに分ける|
|権限|必要なDynamoDB操作のみ|
|環境変数|テーブル名、許可Originなどのみ|
|入力値検証|Lambda側で必ず実施|
|例外処理|内部エラーをそのまま返さない|
|ログ|個人情報・秘密情報を出さない|
|タイムアウト|短めに設定|

12.2 問い合わせLambdaのバリデーション

|   |   |
|---|---|
|項目|ルール|
|name|必須、1〜100文字|
|email|必須、メール形式、255文字以内|
|subject|必須、1〜150文字|
|message|必須、1〜2,000文字|
|sourcePage|任意、255文字以内|
|honeypot|空文字であること|

12.3 HTML・スクリプト対策

問い合わせ本文にHTMLやscriptが含まれても、以下の方針で扱う。

- 管理画面を作るまでは画面表示しない
- 将来表示する場合は必ずエスケープする
- メール通知する場合もHTMLとして解釈しない
- Reactで dangerouslySetInnerHTML を使わない

12.4 Lambdaタイムアウト

|   |   |
|---|---|
|Lambda|推奨タイムアウト|
|contact-submit-function|3〜5秒|
|get-terms-function|3秒|
|get-questions-function|3秒|
|submit-answer-function|5秒|
|daily-question-function|10秒|

タイムアウトを長くしすぎると、バグや外部依存で無駄な実行時間が発生する可能性がある。

12.5 Lambdaログ方針

出してよいログ：

INFO request started requestId=req-xxxx

INFO contact saved contactId=contact-xxxx

WARN validation error fields=email,message

ERROR dynamodb error requestId=req-xxxx

出してはいけないログ：

email=taro@example.com

message=問い合わせ本文全文

Authorization=Bearer xxxxx

AWS_SECRET_ACCESS_KEY=xxxxx

  

13. DynamoDBセキュリティ設計

13.1 基本方針

|   |   |
|---|---|
|項目|方針|
|直接公開|しない|
|アクセス経路|Lambda経由のみ|
|IAM権限|Lambdaごとに必要なテーブル操作のみ|
|個人情報|問い合わせデータは公開しない|
|バックアップ|必要に応じてPITRを検討|
|暗号化|AWS管理の暗号化を利用|

13.2 ContactsTable保護方針

ContactsTableには個人情報が含まれる。

保存される情報：

- 名前
- メールアドレス
- 件名
- 本文
- 送信日時

保護方針：

|   |   |
|---|---|
|項目|内容|
|公開APIから取得させない|POST保存のみ。GET一覧APIは作らない|
|管理画面なし|MVPではAWSコンソールで確認する|
|Lambda権限|PutItemのみから開始する|
|ログ出力|本文・メール全文を出力しない|
|保持期間|1年を目安に見直し|

13.3 UserAnswersTable / UserProgressTable保護方針

Phase 4以降の学習履歴データは、ユーザー本人のみアクセス可能にする。

重要ルール：

- userIdはリクエストBodyから受け取らない
- userIdはCognito JWTのsubから取得する
- 他ユーザーのuserIdを指定して取得できないようにする
- DynamoDB Query時は必ずJWT由来のuserIdを使う

13.4 DynamoDB権限分離

|   |   |   |
|---|---|---|
|Lambda|テーブル|許可Action|
|contact-submit-function|ContactsTable|PutItem|
|get-questions-function|QuestionsTable|GetItem, Query, Scan|
|submit-answer-function|UserAnswersTable|PutItem|
|submit-answer-function|UserProgressTable|GetItem, UpdateItem|
|get-progress-function|UserProgressTable|GetItem|
|get-review-questions-function|UserProgressTable / QuestionsTable|GetItem, BatchGetItem|

  

14. 問い合わせフォームセキュリティ

14.1 想定リスク

|   |   |
|---|---|
|リスク|内容|
|スパム投稿|Botによる大量投稿|
|XSS文字列投稿|scriptタグなどを本文に入れられる|
|長文投稿|大量文字によるDB容量増加|
|メールアドレス不正|返信不能な問い合わせ増加|
|API直接呼び出し|フロントを通さずAPIを呼ばれる|

14.2 対策

|   |   |   |
|---|---|---|
|対策|内容|MVP|
|フロント側バリデーション|入力ミスを事前検知|必須|
|Lambda側バリデーション|API直接呼び出し対策|必須|
|honeypot|Bot検知用隠し項目|推奨|
|文字数制限|長文・大量投稿対策|必須|
|CORS制限|ブラウザ経由の外部Origin制限|必須|
|レート制限|大量投稿対策|検討|
|reCAPTCHA|Bot対策|MVPでは不要、必要時検討|

14.3 honeypot設計

フォームにユーザーから見えない入力項目を置く。

<input type="text" name="honeypot" style="display:none" tabIndex="-1" autoComplete="off" />

通常ユーザーは入力しないが、Botが自動入力した場合はスパム扱いとする。

処理方針：

- honeypotに値がある場合はDynamoDBに保存しない
- ただし、Botに気づかれにくいよう成功レスポンスを返す

14.4 問い合わせAPIの保存制限

|   |   |
|---|---|
|項目|上限|
|name|100文字|
|email|255文字|
|subject|150文字|
|message|2,000文字|
|sourcePage|255文字|

  

15. フロントエンドセキュリティ

15.1 基本方針

|   |   |
|---|---|
|項目|方針|
|XSS対策|Reactの通常エスケープを利用し、HTML直接挿入を避ける|
|外部リンク|target="_blank" の場合は rel="noopener noreferrer" を付与|
|フォーム|入力値を検証する|
|環境変数|NEXT_PUBLIC_ に秘密情報を入れない|
|依存パッケージ|不要なライブラリを増やさない|

15.2 dangerouslySetInnerHTMLの扱い

原則使用しない。

MDXやMarkdownを表示する場合は、信頼できる自分のコンテンツのみを対象にする。

ユーザー入力をHTMLとして表示しない。

15.3 環境変数の注意点

Next.jsの NEXT_PUBLIC_ が付く環境変数はブラウザに公開される。

置いてよいもの：

NEXT_PUBLIC_API_BASE_URL

NEXT_PUBLIC_SITE_URL

置いてはいけないもの：

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

OPENAI_API_KEY

GOOGLE_CLIENT_SECRET

JWT_SECRET

  

16. GitHub・CI/CDセキュリティ

16.1 GitHub管理方針

|   |   |
|---|---|
|項目|方針|
|Public Repository|公開してよいが秘密情報を含めない|
|Secrets|GitHub Secretsで管理|
|.env|コミット禁止|
|.gitignore|必ず設定|
|ブランチ保護|余裕があればmainブランチ保護を設定|
|Dependabot|依存関係更新通知を有効化検討|

16.2 .gitignore例

.env

.env.local

.env.production

.env.development

node_modules/

.next/

out/

dist/

__pycache__/

*.pem

*.key

aws-credentials.json

16.3 GitHub Secretsに入れるもの

|   |   |
|---|---|
|Secret名|内容|
|AWS_ROLE_ARN|GitHub Actions用IAMロールARN|
|AWS_ACCESS_KEY_ID|OIDCを使わない場合のみ|
|AWS_SECRET_ACCESS_KEY|OIDCを使わない場合のみ|
|S3_BUCKET_NAME|デプロイ先S3バケット|
|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|

16.4 推奨：GitHub OIDC

長期アクセスキーをGitHub Secretsに保存するより、GitHub OIDCでAWSロールを引き受ける方が望ましい。

MVPではアクセスキー方式でもよいが、ポートフォリオ価値を高めるならOIDC化を目指す。

16.5 GitHub Actions権限

GitHub Actionsにはデプロイに必要な権限のみ付与する。

許可する操作：

- S3へのPutObject
- S3のDeleteObject
- S3のListBucket
- CloudFrontのCreateInvalidation

許可しない操作：

- IAM操作
- DynamoDB全操作
- S3全バケット操作
- AdministratorAccess

  

17. Cognito認証設計 Phase 4

17.1 基本方針

Phase 4でログイン機能を追加する場合、Amazon Cognitoを利用する。

|   |   |
|---|---|
|項目|方針|
|認証方式|Cognito User Pool|
|ログインID|メールアドレス|
|パスワード|Cognitoポリシーに従う|
|JWT|API Gatewayで検証|
|ユーザーID|Cognito subを利用|

17.2 パスワードポリシー案

|   |   |
|---|---|
|項目|方針|
|最小文字数|8文字以上|
|英大文字|推奨|
|英小文字|推奨|
|数字|推奨|
|記号|任意|

17.3 JWT利用方針

認証付きAPIでは、AuthorizationヘッダーにJWTを付与する。

Authorization: Bearer <JWT_TOKEN>

API GatewayのJWT Authorizerで検証する。

17.4 ユーザー別データアクセス制御

重要ルール：

リクエストBodyのuserIdを信用しない。

必ずJWTのsubをuserIdとして使う。

悪い例：

{

  "userId": "other-user-id",

  "questionId": "clf-001"

}

良い方針：

userId = JWT claims sub

17.5 認証が必要なAPI

|   |   |
|---|---|
|API|認証|
|POST /answers|必須|
|GET /progress|必須|
|GET /review-questions|必須|
|GET /me|必須|
|PUT /me|必須|

  

18. SES・メール通知セキュリティ Phase 4

18.1 利用目的

将来的にAmazon SESを利用する可能性がある。

用途：

- 問い合わせ通知
- 毎日1問配信
- 学習リマインド

18.2 注意点

|   |   |
|---|---|
|項目|方針|
|送信先|ユーザーが許可したメールアドレスのみ|
|オプトアウト|通知停止できるようにする|
|本文|個人情報を過度に含めない|
|なりすまし対策|独自ドメイン利用時はSPF/DKIM設定を検討|
|送信制限|大量送信しない|

  

19. CloudWatch Logs設計

19.1 ログ出力方針

|   |   |
|---|---|
|項目|方針|
|requestId|出力する|
|contactId|出力してよい|
|処理結果|出力する|
|エラー種別|出力する|
|メールアドレス|出力しない|
|問い合わせ本文|出力しない|
|JWT|出力しない|
|Authorizationヘッダー|出力しない|

19.2 ログ保存期間

MVPではCloudWatch Logsの保存期間を設定する。

|   |   |
|---|---|
|ロググループ|保存期間|
|/aws/lambda/contact-submit-function|14日〜30日|
|/aws/lambda/get-questions-function|14日〜30日|
|/aws/lambda/submit-answer-function|30日|

ログ保存期間を無期限にしない。

19.3 アラート方針

MVPではAWS Budgetsを最優先とし、CloudWatch AlarmはPhase 2以降で導入する。

候補アラート：

|   |   |
|---|---|
|アラート|条件|
|Lambda Errors|一定期間内にエラーが連続発生|
|API Gateway 5XX|5XXが増加|
|API Gateway 4XX|4XXが急増|
|DynamoDB Throttling|スロットリング発生|

  

20. 個人情報保護設計

20.1 取得する個人情報

MVPで取得する可能性がある個人情報は以下である。

|   |   |   |
|---|---|---|
|項目|取得場所|目的|
|名前|問い合わせフォーム|問い合わせ対応|
|メールアドレス|問い合わせフォーム|返信対応|
|問い合わせ本文|問い合わせフォーム|問い合わせ対応|

Phase 4以降で追加される可能性がある情報：

|   |   |
|---|---|
|項目|目的|
|ログインメールアドレス|ユーザー認証|
|学習履歴|学習進捗表示|
|正答率|弱点分析|
|通知設定|毎日1問配信|

20.2 個人情報の利用目的

- 問い合わせへの返信
- 誤り報告への対応
- サイト改善
- 将来的な学習履歴表示
- ユーザー本人への通知

20.3 個人情報の公開禁止

以下は公開ページに表示しない。

- 問い合わせデータ
- メールアドレス
- 学習履歴
- 正答率
- Cognito userId

20.4 プライバシーポリシーとの整合

プライバシーポリシーには以下を記載する。

- 取得する情報
- 利用目的
- Cookie利用
- Google Analytics利用予定
- Google AdSense利用予定
- 第三者提供の有無
- 問い合わせ先
- 免責事項

  

21. AdSense・Analytics導入時のセキュリティ注意点

21.1 Google Analytics

導入時の注意点：

- プライバシーポリシーにアクセス解析の利用を明記する
- 個人を特定できる情報をAnalyticsへ送信しない
- 問い合わせ本文やメールアドレスをイベントに含めない

21.2 Google AdSense

導入時の注意点：

- プライバシーポリシーに広告配信・Cookie利用を明記する
- 広告コードを正しく設置する
- 自分で広告をクリックしない
- 不正クリックを誘導しない

21.3 CSPとの整合

AdSenseやAnalyticsを導入すると、CSPの許可先追加が必要になる。

導入前に以下を確認する。

- script-src
- img-src
- connect-src
- frame-src

  

22. 環境変数・秘密情報管理

22.1 Lambda環境変数

Lambdaに設定してよい値：

|   |   |   |
|---|---|---|
|環境変数|内容|秘密度|
|CONTACTS_TABLE_NAME|DynamoDBテーブル名|低|
|ALLOWED_ORIGIN|許可Origin|低|
|LOG_LEVEL|ログレベル|低|

Lambdaに直接設定する場合に注意が必要な値：

|   |   |
|---|---|
|環境変数|方針|
|外部APIキー|Secrets ManagerまたはSSM Parameter Storeを検討|
|メール認証情報|可能ならSES/IAMロールで対応|
|JWT秘密鍵|Cognitoを使うため自前管理しない|

22.2 フロントエンド環境変数

ブラウザに公開される値のみ設定する。

設定してよい例：

NEXT_PUBLIC_API_BASE_URL

NEXT_PUBLIC_SITE_URL

設定してはいけない例：

AWS_SECRET_ACCESS_KEY

AWS_ACCESS_KEY_ID

OPENAI_API_KEY

DATABASE_PASSWORD

JWT_SECRET

22.3 Secrets Manager利用方針

MVPでは必須ではない。

将来的に以下を扱う場合は利用を検討する。

- 外部AI APIキー
- Stripe秘密キー
- 外部メールサービスキー
- 管理者用トークン

  

23. 依存関係セキュリティ

23.1 フロントエンド依存関係

|   |   |
|---|---|
|項目|方針|
|パッケージ追加|必要最小限にする|
|不明なライブラリ|安易に使わない|
|npm audit|定期確認|
|Dependabot|有効化検討|
|lockファイル|package-lock.json / pnpm-lock.yamlを管理|

23.2 Python依存関係

|   |   |
|---|---|
|項目|方針|
|requirements.txt|明示的に管理|
|不要ライブラリ|入れない|
|boto3|Lambdaランタイムに含まれる場合は追加不要なケースあり|
|バージョン固定|必要に応じて固定|

23.3 依存関係の基本ルール

- 使わないパッケージは削除する
- star数だけで判断しない
- 最近メンテナンスされているか確認する
- セキュリティ警告が出たら確認する

  

24. セキュリティテスト設計

24.1 MVPテスト対象

|   |   |
|---|---|
|対象|テスト内容|
|S3|直接URLでアクセスできないこと|
|CloudFront|HTTPSでアクセスできること|
|API Gateway|CORSが制限されていること|
|Lambda|不正入力でエラーを返すこと|
|DynamoDB|問い合わせが保存されること|
|GitHub|秘密情報がコミットされていないこと|
|CloudWatch Logs|個人情報が出力されていないこと|

24.2 問い合わせフォームテスト

|   |   |   |
|---|---|---|
|ID|テスト|期待結果|
|SEC-T-001|name空欄|400エラー|
|SEC-T-002|email形式不正|400エラー|
|SEC-T-003|message 2,000文字超過|400エラー|
|SEC-T-004|scriptタグ入力|保存されても実行されない|
|SEC-T-005|honeypot入力あり|保存せず成功扱い|
|SEC-T-006|許可外Originから送信|CORSでブロック|

24.3 IAMテスト

|   |   |   |
|---|---|---|
|ID|テスト|期待結果|
|IAM-T-001|LambdaがContactsTableにPutItemできる|成功|
|IAM-T-002|LambdaがContactsTableをScanできない|失敗|
|IAM-T-003|GitHub ActionsがS3へPutObjectできる|成功|
|IAM-T-004|GitHub ActionsがIAM操作できない|失敗|

24.4 S3 / CloudFrontテスト

|   |   |   |
|---|---|---|
|ID|テスト|期待結果|
|S3-T-001|S3オブジェクトURLへ直接アクセス|拒否|
|S3-T-002|CloudFront URLへアクセス|表示成功|
|CF-T-001|HTTPでアクセス|HTTPSへリダイレクト|
|CF-T-002|セキュリティヘッダー確認|設定済みであること|

  

25. インシデント対応方針

25.1 想定インシデント

|   |   |
|---|---|
|インシデント|例|
|AWSアクセスキー漏えい|GitHubに誤コミット|
|課金急増|API大量アクセス、キー漏えい|
|問い合わせスパム|Bot投稿増加|
|個人情報漏えい|DynamoDBデータ誤公開|
|サイト改ざん|デプロイ権限の悪用|

25.2 AWSアクセスキー漏えい時の対応

1. 該当アクセスキーを即時無効化する

2. GitHub履歴から削除が必要か確認する

3. AWS CloudTrailで不正操作の有無を確認する

4. AWS請求ダッシュボードを確認する

5. 必要ならAWSサポートに相談する

6. 新しいキーを発行する場合は最小権限にする

7. GitHub Secretsを更新する

25.3 課金急増時の対応

1. AWS Budgets通知を確認する

2. Cost Explorerで増加サービスを特定する

3. 該当リソースを停止または削除する

4. CloudWatch LogsやAPI Gatewayメトリクスを確認する

5. 不正アクセスが疑われる場合はキーを無効化する

6. 再発防止としてレート制限や権限制限を強化する

25.4 問い合わせスパム増加時の対応

1. ContactsTableの投稿件数を確認する

2. honeypotが機能しているか確認する

3. API Gatewayのリクエスト数を確認する

4. レート制限を設定する

5. 必要に応じてreCAPTCHAやWAFを検討する

6. 明らかなスパムデータを削除する

  

7. MVPセキュリティチェックリスト

26.1 AWSアカウント

|   |   |
|---|---|
|チェック|状態|
|rootユーザーにMFAを設定した|未実施 / 実施済み|
|rootアクセスキーを作成していない|未実施 / 実施済み|
|管理用IAMユーザーにMFAを設定した|未実施 / 実施済み|
|AWS Budgetsを設定した|未実施 / 実施済み|

26.2 S3 / CloudFront

|   |   |
|---|---|
|チェック|状態|
|S3 Public Access Blockを有効化した|未実施 / 実施済み|
|S3を直接公開していない|未実施 / 実施済み|
|CloudFront OACを設定した|未実施 / 実施済み|
|Bucket PolicyでCloudFrontのみ許可した|未実施 / 実施済み|
|HTTPをHTTPSへリダイレクトした|未実施 / 実施済み|

26.3 API / Lambda / DynamoDB

|   |   |
|---|---|
|チェック|状態|
|CORSを本番ドメインに限定した|未実施 / 実施済み|
|Lambdaで入力値検証を実装した|未実施 / 実施済み|
|Lambda実行ロールを最小権限にした|未実施 / 実施済み|
|ContactsTableへのPutItemのみ許可した|未実施 / 実施済み|
|CloudWatch Logsに個人情報を出していない|未実施 / 実施済み|
|CloudWatch Logs保存期間を設定した|未実施 / 実施済み|

26.4 GitHub

|   |   |
|---|---|
|チェック|状態|
|.envを.gitignoreに入れた|未実施 / 実施済み|
|AWSアクセスキーをコミットしていない|未実施 / 実施済み|
|GitHub Secretsを利用している|未実施 / 実施済み|
|GitHub Actions権限を最小化した|未実施 / 実施済み|
|不要なSecretsを削除した|未実施 / 実施済み|

  

27. Phase別セキュリティ実装方針

27.1 Phase 1：静的サイト公開

必須対応：

- root MFA
- AWS Budgets
- S3 Public Access Block
- CloudFront OAC
- HTTPS配信
- GitHub秘密情報管理

27.2 Phase 2：サーバーレスAPI追加

必須対応：

- API Gateway CORS制限
- Lambda入力値検証
- DynamoDB最小権限
- CloudWatch Logs保存期間設定
- 問い合わせスパム対策

27.3 Phase 3：収益化準備

必須対応：

- プライバシーポリシー整備
- Cookie / Analytics / AdSense記載
- セキュリティヘッダー設定
- 独自ドメインHTTPS
- 外部スクリプト利用時のCSP見直し

27.4 Phase 4：学習アプリ化

必須対応：

- Cognito認証
- JWT検証
- ユーザー別アクセス制御
- userIdをJWTから取得
- 学習履歴の本人限定アクセス
- 通知停止機能
- 退会・データ削除方針

  

28. ポートフォリオで説明するポイント

28.1 S3 / CloudFront

説明例：

静的サイトはS3に配置していますが、S3バケットは直接公開していません。CloudFront Origin Access Controlを利用し、CloudFront経由でのみファイルを取得できる構成にしています。HTTPアクセスはHTTPSへリダイレクトし、静的コンテンツを安全に配信しています。

28.2 IAM

説明例：

IAMは最小権限を意識し、Lambda実行ロールには対象DynamoDBテーブルへのPutItem権限のみを付与しています。GitHub Actions用ロールにもS3デプロイとCloudFrontキャッシュ無効化に必要な権限だけを付与する方針です。

28.3 問い合わせAPI

説明例：

問い合わせフォームはAPI Gateway + Lambda + DynamoDBで実装します。フロントエンドだけでなくLambda側でも入力値検証を行い、honeypotや文字数制限でスパム対策を行います。CloudWatch Logsにはメールアドレスや本文全文を出力しない方針です。

28.4 将来のCognito

説明例：

将来的にログイン機能を追加する場合はCognitoを利用し、API GatewayでJWTを検証します。学習履歴APIではリクエストBodyのuserIdを信用せず、JWTのsubをuserIdとして使い、本人のデータのみ取得・更新できる設計にします。

  

29. 採用するセキュリティ対策と採用しない対策

29.1 MVPで採用する対策

|   |   |
|---|---|
|対策|理由|
|MFA|AWSアカウント保護に必須|
|AWS Budgets|課金事故検知に必須|
|S3 Public Access Block|意図しない公開を防ぐ|
|CloudFront OAC|S3直接公開を避ける|
|HTTPS|通信保護に必要|
|IAM最小権限|被害範囲を抑える|
|CORS制限|外部OriginからのAPI利用を制限|
|Lambda入力値検証|API直接呼び出し対策|
|CloudWatch Logs最小化|個人情報漏えい防止|
|GitHub Secrets|認証情報管理|

29.2 MVPでは採用しない対策

|   |   |   |
|---|---|---|
|対策|採用しない理由|将来導入タイミング|
|AWS WAF|MVPではコスト・運用負荷が増える|アクセス増加後|
|reCAPTCHA|初期フォームには過剰|スパム増加後|
|Cognito|MVPではログイン不要|Phase 4|
|Secrets Manager|MVPでは秘密情報が少ない|外部APIキー利用時|
|GuardDuty|個人MVPではコスト優先|商用化・有料化後|
|マルチアカウント構成|個人開発には過剰|本格運用後|

  

30. 受け入れ基準

30.1 セキュリティ設計書の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-SEC-DOC-001|AWSアカウント保護方針が定義されている|
|AC-SEC-DOC-002|IAM最小権限方針が定義されている|
|AC-SEC-DOC-003|S3 / CloudFront / OACの保護方針が定義されている|
|AC-SEC-DOC-004|API Gateway / Lambdaの保護方針が定義されている|
|AC-SEC-DOC-005|DynamoDBの保護方針が定義されている|
|AC-SEC-DOC-006|問い合わせフォームのスパム・入力対策が定義されている|
|AC-SEC-DOC-007|GitHub SecretsとCI/CDの方針が定義されている|
|AC-SEC-DOC-008|CloudWatch Logsで出してよい情報・出してはいけない情報が定義されている|
|AC-SEC-DOC-009|Phase 4のCognito認証方針が定義されている|
|AC-SEC-DOC-010|MVPで採用しないセキュリティ対策と理由が定義されている|

30.2 MVP実装時の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-SEC-MVP-001|rootユーザーにMFAが設定されている|
|AC-SEC-MVP-002|AWS Budgetsが設定されている|
|AC-SEC-MVP-003|S3 Public Access Blockが有効である|
|AC-SEC-MVP-004|CloudFront OAC経由でS3配信している|
|AC-SEC-MVP-005|S3オブジェクトURLへ直接アクセスできない|
|AC-SEC-MVP-006|CloudFront経由でHTTPSアクセスできる|
|AC-SEC-MVP-007|Lambda実行ロールが最小権限である|
|AC-SEC-MVP-008|問い合わせAPIに入力値検証がある|
|AC-SEC-MVP-009|CORSが本番ドメインに限定されている|
|AC-SEC-MVP-010|CloudWatch Logsに個人情報が出力されていない|
|AC-SEC-MVP-011|GitHubに.envやアクセスキーが含まれていない|

  

31. 今後作成する関連設計書

本セキュリティ設計書の次に、以下を作成する。

1. コスト管理設計書
2. インフラ構築手順書
3. Lambda実装設計書
4. CI/CD設計書
5. 運用監視設計書
6. 開発タスク一覧
7. GitHub README草案

  

8. 結論

本プロダクトでは、MVP段階から以下のセキュリティ対策を必須とする。

- AWSアカウントのMFA設定
- AWS Budgetsによる課金監視
- S3 Public Access Block
- CloudFront OACによるS3直接公開防止
- HTTPS配信
- IAM最小権限
- API GatewayのCORS制限
- Lambdaでの入力値検証
- DynamoDBへの最小権限アクセス
- CloudWatch Logsへの個人情報出力禁止
- GitHub Secretsによる認証情報管理

MVPでは、WAF、Cognito、Secrets Manager、reCAPTCHAなどは必須にしない。理由は、個人開発の初期段階ではコスト・運用負荷が増え、公開までのスピードを落とすためである。

ただし、アクセス増加、スパム増加、ログイン機能追加、有料化のタイミングで、段階的にセキュリティを強化する。

この設計により、低コストな個人開発でありながら、AWSの基本的なセキュリティ原則を実践したポートフォリオとして説明できる状態を目指す。