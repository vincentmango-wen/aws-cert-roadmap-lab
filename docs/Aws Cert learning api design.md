AWS資格学習サイト API設計書

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト API設計書|
|対象プロダクト|AWS資格ロードマップラボ|
|対象フェーズ|MVP開発 〜 Phase 4 学習アプリ化|
|目的|フロントエンド、API Gateway、Lambda、DynamoDB間のAPI仕様を定義する|
|想定技術|Amazon API Gateway / AWS Lambda / Python / DynamoDB / Next.js / TypeScript|

  

2. 本設計書の目的

本設計書では、AWS資格学習サイト「AWS資格ロードマップラボ」で利用するAPI仕様を定義する。

MVPでは、問い合わせフォームの送信APIを必須実装とする。

AWS用語、模擬問題、比較記事、構成図、ブログ記事は、MVP段階ではMarkdown / MDX / JSONによる静的管理を基本とする。ただし、将来的にDynamoDB化・API化する可能性があるため、本設計書では拡張用APIも定義する。

本設計書で扱うAPIは以下である。

- 問い合わせ送信API
- AWS用語取得API
- 模擬問題取得API
- 構成図取得API
- ブログ記事メタデータ取得API
- 回答履歴保存API
- 学習進捗取得API
- 復習問題取得API
- 毎日1問取得API

  

3. API設計の基本方針

3.1 基本方針

|   |   |
|---|---|
|方針|内容|
|MVPは最小API|MVPで必須なのは問い合わせ送信APIのみとする|
|静的コンテンツ優先|用語・問題・記事は初期はJSON/MDXで管理する|
|サーバーレス構成|API Gateway + Lambda + DynamoDBで構成する|
|低コスト運用|API呼び出し回数を増やしすぎず、静的配信を優先する|
|拡張可能性確保|将来的なログイン・学習履歴・弱点分析に対応できるAPI設計にする|
|フロント・バック両方でバリデーション|不正入力やスパムを防ぐ|
|レスポンス形式統一|成功・エラーのレスポンス形式を統一する|
|CORS制限|本番フロントエンドドメインのみ許可する|
|最小権限|Lambdaは必要なDynamoDBテーブルにのみアクセスする|

  

4. API構成概要

4.1 API Gateway構成

|   |   |
|---|---|
|項目|方針|
|API種別|HTTP APIを基本とする|
|認証|MVPではなし。Phase 4でCognito JWT Authorizerを導入|
|CORS|本番ドメイン、開発環境のみ許可|
|Lambda統合|Lambda Proxy Integrationを利用|
|レート制限|問い合わせAPIなどに設定を検討|
|ログ|必要最小限でCloudWatchへ出力|

4.2 ベースURL

開発環境

https://api-dev.example.com

本番環境

https://api.example.com

MVPではAPI GatewayのデフォルトURLを利用してもよい。

https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

4.3 APIバージョン方針

初期段階ではURLにバージョンを含めない。

将来的に外部公開API化する場合は、以下のようにする。

/api/v1/contact

/api/v1/questions

MVPではシンプルさを優先する。

  

5. API一覧

5.1 MVP必須API

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|API ID|メソッド|パス|概要|Phase|必須度|
|API-001|POST|/contact|問い合わせ送信|MVP / Phase 2|必須|

5.2 Phase 2以降の任意API

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|API ID|メソッド|パス|概要|Phase|必須度|
|API-002|GET|/terms|AWS用語一覧取得|Phase 2|任意|
|API-003|GET|/terms/{termId}|AWS用語詳細取得|Phase 2|任意|
|API-004|GET|/questions|模擬問題一覧取得|Phase 2|任意|
|API-005|GET|/questions/{questionId}|模擬問題詳細取得|Phase 2|任意|
|API-006|GET|/architectures|構成図一覧取得|Phase 2以降|任意|
|API-007|GET|/architectures/{architectureId}|構成図詳細取得|Phase 2以降|任意|

5.3 Phase 4以降の学習アプリAPI

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|API ID|メソッド|パス|概要|Phase|認証|
|API-101|POST|/answers|回答履歴保存|Phase 4|必須|
|API-102|GET|/progress|学習進捗取得|Phase 4|必須|
|API-103|GET|/review-questions|復習問題取得|Phase 4|必須|
|API-104|GET|/me|ログインユーザー情報取得|Phase 4|必須|
|API-105|PUT|/me|ユーザー設定更新|Phase 4|必須|
|API-106|GET|/daily-question|今日の1問取得|Phase 4|任意|

  

6. 共通仕様

6.1 リクエスト形式

GETリクエスト

- クエリパラメータで検索条件・フィルタ条件を指定する
- 認証が必要なAPIではAuthorizationヘッダーを付与する

POST / PUTリクエスト

- JSON形式で送信する
- Content-Type: application/json を指定する

Content-Type: application/json

6.2 認証ヘッダー

Phase 4以降の認証APIでは、Cognitoで取得したJWTを利用する。

Authorization: Bearer <JWT_TOKEN>

MVPでは認証なし。

6.3 共通成功レスポンス形式

{

  "success": true,

  "data": {},

  "message": "OK",

  "requestId": "req-xxxxxxxx"

}

6.4 共通エラーレスポンス形式

{

  "success": false,

  "error": {

    "code": "VALIDATION_ERROR",

    "message": "入力内容に誤りがあります。",

    "details": [

      {

        "field": "email",

        "message": "正しいメールアドレスを入力してください。"

      }

    ]

  },

  "requestId": "req-xxxxxxxx"

}

6.5 HTTPステータスコード

|   |   |
|---|---|
|ステータス|用途|
|200|正常取得|
|201|正常作成|
|400|リクエスト不正、バリデーションエラー|
|401|未認証|
|403|権限なし|
|404|対象データなし|
|409|重複・競合|
|429|リクエスト過多|
|500|サーバー内部エラー|

6.6 エラーコード一覧

|   |   |   |
|---|---|---|
|エラーコード|HTTP|内容|
|VALIDATION_ERROR|400|入力値エラー|
|INVALID_JSON|400|JSON形式不正|
|MISSING_REQUIRED_FIELD|400|必須項目不足|
|UNAUTHORIZED|401|認証されていない|
|FORBIDDEN|403|権限がない|
|NOT_FOUND|404|データが存在しない|
|TOO_MANY_REQUESTS|429|リクエスト過多|
|INTERNAL_SERVER_ERROR|500|サーバー内部エラー|
|DYNAMODB_ERROR|500|DynamoDB操作エラー|

6.7 日付形式

日付はISO 8601形式とする。

2026-06-01T10:30:00+09:00

6.8 文字コード

UTF-8

  

7. CORS設計

7.1 CORS基本方針

|   |   |
|---|---|
|項目|方針|
|本番許可Origin|本番フロントエンドドメインのみ|
|開発許可Origin|localhostを開発時のみ許可|
|許可メソッド|GET, POST, PUT, OPTIONS|
|許可ヘッダー|Content-Type, Authorization|
|Cookie利用|MVPでは利用しない|

7.2 本番CORS設定例

{

  "allowOrigins": [

    "https://example.com"

  ],

  "allowMethods": ["GET", "POST", "PUT", "OPTIONS"],

  "allowHeaders": ["Content-Type", "Authorization"],

  "maxAge": 300

}

7.3 開発CORS設定例

{

  "allowOrigins": [

    "http://localhost:3000",

    "https://example.com"

  ],

  "allowMethods": ["GET", "POST", "PUT", "OPTIONS"],

  "allowHeaders": ["Content-Type", "Authorization"],

  "maxAge": 300

}

7.4 注意点

- * は原則使わない
- 本番環境でlocalhostを許可しない
- 認証APIではAuthorizationヘッダーを許可する
- OPTIONSリクエストへの対応を確認する

  

8. API-001 問い合わせ送信API

8.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-001|
|名称|問い合わせ送信API|
|メソッド|POST|
|パス|/contact|
|認証|不要|
|Phase|MVP / Phase 2|
|Lambda|contact-submit-function|
|DynamoDB|ContactsTable|

8.2 目的

ユーザーからの問い合わせ、誤り報告、仕事依頼、フィードバックを受け取り、DynamoDBに保存する。

8.3 リクエスト

Headers

Content-Type: application/json

Body

{

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "honeypot": ""

}

8.4 リクエスト項目

|   |   |   |   |   |
|---|---|---|---|---|
|項目|型|必須|制約|内容|
|name|string|必須|1〜100文字|名前|
|email|string|必須|メール形式、255文字以内|メールアドレス|
|subject|string|必須|1〜150文字|件名|
|message|string|必須|1〜2,000文字|本文|
|sourcePage|string|任意|255文字以内|送信元ページ|
|honeypot|string|任意|空文字であること|スパム対策用隠し項目|

8.5 成功レスポンス

HTTP 201

{

  "success": true,

  "data": {

    "contactId": "contact-7f8b2c9a",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-20260601-abc123"

}

8.6 バリデーションエラー

HTTP 400

{

  "success": false,

  "error": {

    "code": "VALIDATION_ERROR",

    "message": "入力内容に誤りがあります。",

    "details": [

      {

        "field": "email",

        "message": "正しいメールアドレスを入力してください。"

      },

      {

        "field": "message",

        "message": "本文を入力してください。"

      }

    ]

  },

  "requestId": "req-20260601-def456"

}

8.7 スパム判定レスポンス

honeypotに値が入っている場合、スパムとみなす。

セキュリティ上、スパム判定時も成功に見せる方針とする。

HTTP 201

{

  "success": true,

  "data": {

    "contactId": null,

    "status": "accepted"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-20260601-spam001"

}

8.8 DynamoDB保存データ

{

  "contactId": "contact-7f8b2c9a",

  "createdAt": "2026-06-01T10:30:00+09:00",

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "status": "new",

  "sourcePage": "/contact",

  "userAgent": "Mozilla/5.0 ..."

}

8.9 Lambda処理フロー

1. API Gatewayからリクエストを受け取る

2. requestIdを生成する

3. JSONパースを行う

4. honeypotを確認する

5. 入力値バリデーションを行う

6. contactIdを生成する

7. createdAtを生成する

8. DynamoDB ContactsTableへ保存する

9. CloudWatch Logsへ最小限のログを出力する

10. 成功レスポンスを返す

8.10 Lambda環境変数

|   |   |
|---|---|
|環境変数|内容|
|CONTACTS_TABLE_NAME|ContactsTable名|
|ALLOWED_ORIGIN|許可するフロントエンドOrigin|
|LOG_LEVEL|INFO / ERRORなど|

8.11 IAM権限

contact-submit-functionに必要な権限は以下のみ。

{

  "Effect": "Allow",

  "Action": [

    "dynamodb:PutItem"

  ],

  "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTable"

}

8.12 ログ出力方針

出力してよいログ：

INFO contact submitted contactId=contact-xxxx

WARN validation error fields=email,message

ERROR dynamodb put item failed requestId=req-xxxx

出力しない情報：

- メールアドレス全文
- 問い合わせ本文全文
- AWS認証情報
- APIキー

8.13 受け入れ条件

|   |   |
|---|---|
|ID|条件|
|AC-API-001|正常な問い合わせを送信できる|
|AC-API-002|問い合わせ内容がDynamoDBに保存される|
|AC-API-003|必須項目未入力時に400を返す|
|AC-API-004|メール形式不正時に400を返す|
|AC-API-005|honeypot入力時はDynamoDBに保存しない|
|AC-API-006|CloudWatch Logsで処理結果を確認できる|
|AC-API-007|CORSが本番ドメインに制限されている|

  

9. API-002 AWS用語一覧取得API

9.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-002|
|名称|AWS用語一覧取得API|
|メソッド|GET|
|パス|/terms|
|認証|不要|
|Phase|Phase 2以降|
|Lambda|get-terms-function|
|DynamoDB|TermsTable|
|MVP必須|いいえ|

9.2 目的

AWS用語一覧を取得する。

MVPではJSON静的管理でよいため、本APIは任意実装とする。

9.3 クエリパラメータ

|   |   |   |   |   |
|---|---|---|---|---|
|パラメータ|型|必須|内容|例|
|category|string|任意|カテゴリ絞り込み|Storage|
|exam|string|任意|試験区分|CLF-C02|
|keyword|string|任意|キーワード検索|s3|
|level|string|任意|難易度|beginner|
|limit|number|任意|取得件数|20|
|nextToken|string|任意|ページング用|xxxxx|

9.4 リクエスト例

GET /terms?category=Storage&exam=CLF-C02&limit=20

9.5 成功レスポンス

HTTP 200

{

  "success": true,

  "data": {

    "items": [

      {

        "termId": "s3",

        "name": "Amazon S3",

        "shortName": "S3",

        "category": "Storage",

        "level": "beginner",

        "examScopes": ["CLF-C02", "SAA-C03"],

        "oneLine": "ファイルを安全かつ低コストに保存するためのAWSの代表的なストレージサービス。",

        "updatedAt": "2026-06-01"

      }

    ],

    "nextToken": null

  },

  "message": "OK",

  "requestId": "req-20260601-terms001"

}

9.6 レスポンス項目

一覧では軽量な情報のみ返す。

|   |   |
|---|---|
|項目|内容|
|termId|用語ID|
|name|正式名称|
|shortName|略称|
|category|カテゴリ|
|level|難易度|
|examScopes|対象試験|
|oneLine|一言説明|
|updatedAt|更新日|

9.7 DynamoDBアクセス方針

MVPでは不要。

DynamoDB化する場合は、以下の設計とする。

|   |   |
|---|---|
|項目|内容|
|テーブル|TermsTable|
|主キー|termId|
|GSI候補|CategoryIndex, ExamScopeIndex|

9.8 注意点

- keyword検索をDynamoDBだけで高精度に行うのは難しい
- MVPではフロントエンド側でJSON検索する方が簡単
- 本格検索が必要になった場合はOpenSearchなどを検討するが、MVPでは使わない

  

10. API-003 AWS用語詳細取得API

10.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-003|
|名称|AWS用語詳細取得API|
|メソッド|GET|
|パス|/terms/{termId}|
|認証|不要|
|Phase|Phase 2以降|
|Lambda|get-terms-function|
|DynamoDB|TermsTable|
|MVP必須|いいえ|

10.2 リクエスト例

GET /terms/s3

10.3 パスパラメータ

|   |   |   |   |
|---|---|---|---|
|パラメータ|型|必須|内容|
|termId|string|必須|AWS用語ID|

10.4 成功レスポンス

HTTP 200

{

  "success": true,

  "data": {

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

      "ログ保存"

    ],

    "examPoints": [

      "オブジェクトストレージである",

      "高い耐久性を持つ",

      "ストレージクラスを選択できる"

    ],

    "saaPoints": [

      "静的コンテンツ配信ではS3 + CloudFrontが基本構成になる"

    ],

    "relatedServices": ["cloudfront", "ebs", "efs"],

    "comparisonSlugs": ["s3-vs-ebs-vs-efs"],

    "architectureSlugs": ["static-site-s3-cloudfront"],

    "tags": ["storage", "object-storage"],

    "costNotes": ["保存容量、リクエスト数、データ転送量で課金される"],

    "securityNotes": ["バケットを安易にパブリック公開しない"],

    "updatedAt": "2026-06-01"

  },

  "message": "OK",

  "requestId": "req-20260601-term001"

}

10.5 Not Foundレスポンス

HTTP 404

{

  "success": false,

  "error": {

    "code": "NOT_FOUND",

    "message": "指定されたAWS用語が見つかりません。"

  },

  "requestId": "req-20260601-term404"

}

10.6 受け入れ条件

|   |   |
|---|---|
|ID|条件|
|AC-API-TERM-001|存在するtermIdで詳細を取得できる|
|AC-API-TERM-002|存在しないtermIdで404を返す|
|AC-API-TERM-003|関連サービス・比較記事・構成図情報を返せる|

  

11. API-004 模擬問題一覧取得API

11.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-004|
|名称|模擬問題一覧取得API|
|メソッド|GET|
|パス|/questions|
|認証|不要|
|Phase|Phase 2以降|
|Lambda|get-questions-function|
|DynamoDB|QuestionsTable|
|MVP必須|いいえ|

11.2 目的

模擬問題一覧を取得する。

MVPではJSON静的管理でもよい。

11.3 クエリパラメータ

|   |   |   |   |   |
|---|---|---|---|---|
|パラメータ|型|必須|内容|例|
|exam|string|任意|試験区分|CLF-C02|
|category|string|任意|カテゴリ|Cloud Concepts|
|difficulty|string|任意|難易度|easy|
|relatedService|string|任意|関連サービス|s3|
|limit|number|任意|取得件数|20|
|nextToken|string|任意|ページング|xxxxx|

11.4 リクエスト例

GET /questions?exam=CLF-C02&category=Cloud%20Concepts&limit=20

11.5 成功レスポンス

HTTP 200

{

  "success": true,

  "data": {

    "items": [

      {

        "questionId": "clf-001",

        "exam": "CLF-C02",

        "category": "Cloud Concepts",

        "difficulty": "easy",

        "question": "AWSクラウドの主な利点として最も適切なものはどれですか？",

        "relatedServices": ["ec2", "auto-scaling"],

        "tags": ["cloud-concepts", "scalability"]

      }

    ],

    "nextToken": null

  },

  "message": "OK",

  "requestId": "req-20260601-questions001"

}

11.6 一覧レスポンスの注意点

一覧APIでは、正解情報を返さない方針とする。

返さない項目：

- correctChoiceId
- explanation
- choiceExplanations

理由：

- 一覧表示に不要
- クライアント側で簡単に正解を見られる状態を避ける

ただし、MVPでJSON静的管理する場合は正解もフロントに含まれるため、厳密な秘匿はできない。資格学習サイトとしては問題ないが、有料問題集化する場合はAPI側で制御する。

  

12. API-005 模擬問題詳細取得API

12.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-005|
|名称|模擬問題詳細取得API|
|メソッド|GET|
|パス|/questions/{questionId}|
|認証|不要|
|Phase|Phase 2以降|
|Lambda|get-questions-function|
|DynamoDB|QuestionsTable|
|MVP必須|いいえ|

12.2 リクエスト例

GET /questions/clf-001

12.3 成功レスポンス

HTTP 200

{

  "success": true,

  "data": {

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

      "C": "セキュリティはAWSとユーザーの責任共有モデルです。",

      "D": "AWSには無料枠がありますが、すべてのサービスが無料ではありません。"

    },

    "relatedServices": ["ec2", "auto-scaling"],

    "relatedTerms": ["shared-responsibility-model"],

    "relatedComparisons": [],

    "tags": ["cloud-concepts", "scalability"],

    "updatedAt": "2026-06-01"

  },

  "message": "OK",

  "requestId": "req-20260601-question001"

}

12.4 Not Foundレスポンス

HTTP 404

{

  "success": false,

  "error": {

    "code": "NOT_FOUND",

    "message": "指定された問題が見つかりません。"

  },

  "requestId": "req-20260601-question404"

}

12.5 注意点

無料公開問題では、詳細APIで正解と解説を返してよい。

将来的に有料問題や本格学習アプリ化する場合は、以下のように分ける。

- 問題取得API：問題文と選択肢のみ返す
- 回答送信API：回答後に正解と解説を返す

  

13. API-006 構成図一覧取得API

13.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-006|
|名称|構成図一覧取得API|
|メソッド|GET|
|パス|/architectures|
|認証|不要|
|Phase|Phase 2以降|
|MVP必須|いいえ|

13.2 クエリパラメータ

|   |   |   |   |
|---|---|---|---|
|パラメータ|型|必須|内容|
|category|string|任意|構成カテゴリ|
|exam|string|任意|対象試験|
|service|string|任意|使用サービス|
|level|string|任意|難易度|

13.3 成功レスポンス

{

  "success": true,

  "data": {

    "items": [

      {

        "architectureId": "arc-001",

        "slug": "static-site-s3-cloudfront",

        "title": "S3 + CloudFront 静的Webサイト構成",

        "description": "S3に配置した静的サイトをCloudFrontで配信する基本構成です。",

        "category": "Static Hosting",

        "level": "beginner",

        "examScopes": ["CLF-C02", "SAA-C03"],

        "services": ["s3", "cloudfront", "iam"],

        "diagramPath": "/images/architectures/static-site-s3-cloudfront.png",

        "updatedAt": "2026-06-01"

      }

    ]

  },

  "message": "OK",

  "requestId": "req-20260601-arch001"

}

13.4 MVPでの扱い

構成図はMDX静的管理を推奨するため、本APIは基本的に不要。

  

14. API-007 構成図詳細取得API

14.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-007|
|名称|構成図詳細取得API|
|メソッド|GET|
|パス|/architectures/{architectureId}|
|認証|不要|
|Phase|Phase 2以降|
|MVP必須|いいえ|

14.2 成功レスポンス

{

  "success": true,

  "data": {

    "architectureId": "arc-001",

    "slug": "static-site-s3-cloudfront",

    "title": "S3 + CloudFront 静的Webサイト構成",

    "description": "S3に配置した静的サイトをCloudFrontで配信する基本構成です。",

    "category": "Static Hosting",

    "level": "beginner",

    "examScopes": ["CLF-C02", "SAA-C03"],

    "services": ["s3", "cloudfront", "iam", "acm", "route53"],

    "diagramPath": "/images/architectures/static-site-s3-cloudfront.png",

    "flow": [

      "ユーザーがCloudFrontへアクセスする",

      "CloudFrontがS3から静的ファイルを取得する",

      "S3はCloudFront経由のアクセスのみ許可する"

    ],

    "designPoints": {

      "availability": "S3とCloudFrontのマネージドサービスを利用する",

      "security": "S3を直接公開せずOACを利用する",

      "cost": "EC2を使わず低コストにする",

      "performance": "CloudFrontキャッシュで高速配信する"

    },

    "relatedTerms": ["s3", "cloudfront", "iam"],

    "updatedAt": "2026-06-01"

  },

  "message": "OK",

  "requestId": "req-20260601-arch-detail001"

}

14.3 MVPでの扱い

構成図詳細はMDX静的ページで管理するため、MVPではAPI不要。

  

15. API-101 回答履歴保存API

15.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-101|
|名称|回答履歴保存API|
|メソッド|POST|
|パス|/answers|
|認証|必須|
|Phase|Phase 4|
|Lambda|submit-answer-function|
|DynamoDB|UserAnswersTable, UserProgressTable|

15.2 目的

ログインユーザーの問題回答履歴を保存し、学習進捗を更新する。

15.3 Headers

Content-Type: application/json

Authorization: Bearer <JWT_TOKEN>

15.4 リクエストBody

{

  "questionId": "clf-001",

  "exam": "CLF-C02",

  "category": "Cloud Concepts",

  "selectedChoiceId": "B",

  "correctChoiceId": "B",

  "elapsedSeconds": 23

}

15.5 リクエスト項目

|   |   |   |   |
|---|---|---|---|
|項目|型|必須|内容|
|questionId|string|必須|問題ID|
|exam|string|必須|試験区分|
|category|string|必須|問題カテゴリ|
|selectedChoiceId|string|必須|ユーザーが選んだ選択肢|
|correctChoiceId|string|必須|正解選択肢|
|elapsedSeconds|number|任意|回答にかかった秒数|

15.6 成功レスポンス

HTTP 201

{

  "success": true,

  "data": {

    "answerId": "ans-20260801-001",

    "questionId": "clf-001",

    "isCorrect": true,

    "progress": {

      "exam": "CLF-C02",

      "totalAnswered": 31,

      "correctCount": 25,

      "accuracy": 80.6,

      "weakCategories": ["Security and Compliance"]

    }

  },

  "message": "回答を保存しました。",

  "requestId": "req-20260801-answer001"

}

15.7 Lambda処理フロー

1. JWTからuserIdを取得する

2. リクエストBodyを検証する

3. selectedChoiceIdとcorrectChoiceIdからisCorrectを算出する

4. answerIdを生成する

5. UserAnswersTableへ回答履歴を保存する

6. UserProgressTableを取得する

7. totalAnswered、correctCount、accuracy、categoryStatsを更新する

8. 不正解の場合、reviewQuestionIdsへ追加する

9. 更新後の進捗を返す

15.8 DynamoDB書き込み

UserAnswersTable

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

UserProgressTable

{

  "userId": "cognito-sub-xxxx",

  "exam": "CLF-C02",

  "totalAnswered": 31,

  "correctCount": 25,

  "incorrectCount": 6,

  "accuracy": 80.6,

  "weakCategories": ["Security and Compliance"],

  "reviewQuestionIds": ["clf-004", "clf-012"],

  "updatedAt": "2026-08-01T09:15:00+09:00"

}

15.9 IAM権限

{

  "Effect": "Allow",

  "Action": [

    "dynamodb:PutItem",

    "dynamodb:GetItem",

    "dynamodb:UpdateItem"

  ],

  "Resource": [

    "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/UserAnswersTable",

    "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/UserProgressTable"

  ]

}

15.10 受け入れ条件

|   |   |
|---|---|
|ID|条件|
|AC-API-ANS-001|ログインユーザーのみ回答履歴を保存できる|
|AC-API-ANS-002|回答履歴がUserAnswersTableに保存される|
|AC-API-ANS-003|UserProgressTableが更新される|
|AC-API-ANS-004|不正解問題が復習対象に追加される|
|AC-API-ANS-005|未認証の場合401を返す|

  

16. API-102 学習進捗取得API

16.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-102|
|名称|学習進捗取得API|
|メソッド|GET|
|パス|/progress|
|認証|必須|
|Phase|Phase 4|
|Lambda|get-progress-function|
|DynamoDB|UserProgressTable|

16.2 クエリパラメータ

|   |   |   |   |   |
|---|---|---|---|---|
|パラメータ|型|必須|内容|例|
|exam|string|任意|試験区分|CLF-C02|

16.3 リクエスト例

GET /progress?exam=CLF-C02

Authorization: Bearer <JWT_TOKEN>

16.4 成功レスポンス

{

  "success": true,

  "data": {

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

  },

  "message": "OK",

  "requestId": "req-20260801-progress001"

}

16.5 データなしレスポンス

まだ回答履歴がない場合。

{

  "success": true,

  "data": {

    "userId": "cognito-sub-xxxx",

    "exam": "CLF-C02",

    "totalAnswered": 0,

    "correctCount": 0,

    "incorrectCount": 0,

    "accuracy": 0,

    "categoryStats": {},

    "weakCategories": [],

    "reviewQuestionIds": []

  },

  "message": "学習履歴はまだありません。",

  "requestId": "req-20260801-progress-empty"

}

16.6 受け入れ条件

|   |   |
|---|---|
|ID|条件|
|AC-API-PROG-001|ログインユーザーの進捗を取得できる|
|AC-API-PROG-002|他ユーザーの進捗は取得できない|
|AC-API-PROG-003|学習履歴がない場合も正常レスポンスを返す|
|AC-API-PROG-004|未認証の場合401を返す|

  

17. API-103 復習問題取得API

17.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-103|
|名称|復習問題取得API|
|メソッド|GET|
|パス|/review-questions|
|認証|必須|
|Phase|Phase 4|
|Lambda|get-review-questions-function|
|DynamoDB|UserProgressTable / ReviewItemsTable / QuestionsTable|

17.2 目的

ユーザーが間違えた問題、復習対象に登録された問題を取得する。

17.3 リクエスト例

GET /review-questions?exam=CLF-C02

Authorization: Bearer <JWT_TOKEN>

17.4 成功レスポンス

{

  "success": true,

  "data": {

    "items": [

      {

        "questionId": "clf-004",

        "exam": "CLF-C02",

        "category": "Security and Compliance",

        "difficulty": "normal",

        "question": "IAMロールの説明として適切なものはどれですか？",

        "lastAnsweredAt": "2026-08-01T10:00:00+09:00",

        "reason": "incorrect"

      }

    ]

  },

  "message": "OK",

  "requestId": "req-20260801-review001"

}

17.5 受け入れ条件

|   |   |
|---|---|
|ID|条件|
|AC-API-REV-001|復習対象問題を取得できる|
|AC-API-REV-002|他ユーザーの復習問題は取得できない|
|AC-API-REV-003|復習対象がない場合は空配列を返す|

  

18. API-104 ログインユーザー情報取得API

18.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-104|
|名称|ログインユーザー情報取得API|
|メソッド|GET|
|パス|/me|
|認証|必須|
|Phase|Phase 4|
|Lambda|get-me-function|
|DynamoDB|UserProfileTable|

18.2 成功レスポンス

{

  "success": true,

  "data": {

    "userId": "cognito-sub-xxxx",

    "displayName": "fumi",

    "email": "user@example.com",

    "targetExam": "SAA-C03",

    "learningGoal": "2026年8月にSAA合格",

    "notificationEnabled": true,

    "createdAt": "2026-08-01T09:00:00+09:00",

    "updatedAt": "2026-08-01T09:00:00+09:00"

  },

  "message": "OK",

  "requestId": "req-20260801-me001"

}

18.3 初回ログイン時の扱い

UserProfileTableにデータが存在しない場合、Cognitoの情報をもとに初期プロフィールを作成して返す。

  

19. API-105 ユーザー設定更新API

19.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-105|
|名称|ユーザー設定更新API|
|メソッド|PUT|
|パス|/me|
|認証|必須|
|Phase|Phase 4|
|Lambda|update-me-function|
|DynamoDB|UserProfileTable|

19.2 リクエストBody

{

  "displayName": "fumi",

  "targetExam": "SAA-C03",

  "learningGoal": "2026年8月にSAA合格",

  "notificationEnabled": true

}

19.3 成功レスポンス

{

  "success": true,

  "data": {

    "userId": "cognito-sub-xxxx",

    "displayName": "fumi",

    "targetExam": "SAA-C03",

    "learningGoal": "2026年8月にSAA合格",

    "notificationEnabled": true,

    "updatedAt": "2026-08-01T11:00:00+09:00"

  },

  "message": "ユーザー設定を更新しました。",

  "requestId": "req-20260801-me-update001"

}

19.4 バリデーション

|   |   |
|---|---|
|項目|ルール|
|displayName|100文字以内|
|targetExam|CLF-C02 / SAA-C03 / none|
|learningGoal|500文字以内|
|notificationEnabled|boolean|

  

20. API-106 今日の1問取得API

20.1 概要

|   |   |
|---|---|
|項目|内容|
|API ID|API-106|
|名称|今日の1問取得API|
|メソッド|GET|
|パス|/daily-question|
|認証|任意|
|Phase|Phase 4|
|Lambda|daily-question-function|
|DynamoDB|DailyQuestionTable / QuestionsTable|

20.2 目的

日替わりで1問表示する。

トップページやメール通知と連携できる。

20.3 クエリパラメータ

|   |   |   |   |
|---|---|---|---|
|パラメータ|型|必須|内容|
|date|string|任意|取得対象日。未指定なら当日|
|exam|string|任意|試験区分|

20.4 成功レスポンス

{

  "success": true,

  "data": {

    "date": "2026-08-02",

    "question": {

      "questionId": "clf-015",

      "exam": "CLF-C02",

      "category": "Security and Compliance",

      "difficulty": "easy",

      "question": "責任共有モデルにおいて、ユーザー側の責任はどれですか？",

      "choices": [

        {

          "choiceId": "A",

          "text": "AWSリージョンの物理的な保護"

        },

        {

          "choiceId": "B",

          "text": "IAMユーザーや権限の管理"

        },

        {

          "choiceId": "C",

          "text": "データセンターの電源管理"

        },

        {

          "choiceId": "D",

          "text": "AWSグローバルネットワークの保守"

        }

      ]

    }

  },

  "message": "OK",

  "requestId": "req-20260802-daily001"

}

20.5 注意点

- トップページで使うなら認証不要でよい
- ユーザー別に出題最適化するなら認証必須にする
- MVPでは不要

  

21. Lambda関数設計

21.1 Lambda一覧

|   |   |   |   |
|---|---|---|---|
|Lambda名|対応API|Phase|必須|
|contact-submit-function|POST /contact|MVP / Phase 2|必須|
|get-terms-function|GET /terms, GET /terms/{termId}|Phase 2|任意|
|get-questions-function|GET /questions, GET /questions/{questionId}|Phase 2|任意|
|get-architectures-function|GET /architectures|Phase 2以降|任意|
|submit-answer-function|POST /answers|Phase 4|将来|
|get-progress-function|GET /progress|Phase 4|将来|
|get-review-questions-function|GET /review-questions|Phase 4|将来|
|get-me-function|GET /me|Phase 4|将来|
|update-me-function|PUT /me|Phase 4|将来|
|daily-question-function|GET /daily-question|Phase 4|将来|

21.2 Lambda共通実装方針

|   |   |
|---|---|
|項目|方針|
|実装言語|Python 3.11以上|
|レスポンス形式|共通レスポンス形式を利用|
|バリデーション|Lambda側で必ず実施|
|ログ|requestId、処理結果、エラー種別を出力|
|タイムアウト|3〜10秒程度から開始|
|メモリ|128MB〜256MBから開始|
|環境変数|テーブル名、許可Originなど|
|エラー処理|例外を握りつぶさず、共通エラー形式で返す|

21.3 共通レスポンス生成関数イメージ

def success_response(data=None, message="OK", status_code=200, request_id=None):

    return {

        "statusCode": status_code,

        "headers": {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": get_allowed_origin(),

            "Access-Control-Allow-Headers": "Content-Type,Authorization",

            "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS"

        },

        "body": json.dumps({

            "success": True,

            "data": data or {},

            "message": message,

            "requestId": request_id

        }, ensure_ascii=False)

    }

def error_response(code, message, status_code=400, details=None, request_id=None):

    return {

        "statusCode": status_code,

        "headers": {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": get_allowed_origin(),

            "Access-Control-Allow-Headers": "Content-Type,Authorization",

            "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS"

        },

        "body": json.dumps({

            "success": False,

            "error": {

                "code": code,

                "message": message,

                "details": details or []

            },

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

22. DynamoDBアクセス設計

22.1 テーブル一覧

|   |   |   |
|---|---|---|
|テーブル|対応API|Phase|
|ContactsTable|POST /contact|MVP / Phase 2|
|TermsTable|GET /terms|Phase 2以降|
|QuestionsTable|GET /questions, GET /daily-question|Phase 2以降|
|UserProfileTable|GET /me, PUT /me|Phase 4|
|UserAnswersTable|POST /answers|Phase 4|
|UserProgressTable|GET /progress, POST /answers|Phase 4|
|ReviewItemsTable|GET /review-questions|Phase 4以降|
|DailyQuestionTable|GET /daily-question|Phase 4|

22.2 DynamoDB操作一覧

|   |   |   |   |
|---|---|---|---|
|API|操作|テーブル|権限|
|POST /contact|PutItem|ContactsTable|dynamodb:PutItem|
|GET /terms|Scan / Query|TermsTable|dynamodb:Scan / Query|
|GET /terms/{termId}|GetItem|TermsTable|dynamodb:GetItem|
|GET /questions|Query / Scan|QuestionsTable|dynamodb:Query / Scan|
|GET /questions/{questionId}|GetItem|QuestionsTable|dynamodb:GetItem|
|POST /answers|PutItem / UpdateItem|UserAnswersTable, UserProgressTable|dynamodb:PutItem / UpdateItem|
|GET /progress|GetItem|UserProgressTable|dynamodb:GetItem|
|GET /review-questions|GetItem / BatchGetItem|UserProgressTable, QuestionsTable|dynamodb:GetItem / BatchGetItem|

22.3 Scan利用方針

MVPや小規模データではScanでも許容できる。

ただし、データ量が増えた場合はGSIを設計し、Queryへ移行する。

Scan許容対象：

- 用語データが数十件程度
- 問題データが数百件程度
- 管理者向けの低頻度処理

Query推奨対象：

- ユーザー別学習履歴
- カテゴリ別問題取得
- 試験区分別問題取得
- 復習問題取得

  

23. 認証・認可設計

23.1 MVP

MVPでは認証なし。

対象API：

- POST /contact

23.2 Phase 4

Phase 4ではAmazon Cognitoを利用する。

認証が必要なAPI：

- POST /answers
- GET /progress
- GET /review-questions
- GET /me
- PUT /me

23.3 認可方針

ログインユーザーは自分のデータのみ操作できる。

|   |   |
|---|---|
|データ|認可条件|
|UserProfileTable|userId = JWTのsub|
|UserAnswersTable|userId = JWTのsub|
|UserProgressTable|userId = JWTのsub|
|ReviewItemsTable|userId = JWTのsub|

23.4 禁止事項

- リクエストBodyのuserIdを信用しない
- userIdは必ずJWTから取得する
- 他ユーザーのuserIdを指定してデータ取得できないようにする

  

24. APIセキュリティ設計

24.1 入力値検証

|   |   |
|---|---|
|API|検証内容|
|POST /contact|必須、文字数、メール形式、honeypot|
|POST /answers|questionId、exam、choiceId、型チェック|
|PUT /me|表示名、目標試験、学習目標、boolean|

24.2 レート制限

問い合わせAPIはスパム対象になりやすいため、API Gateway側でレート制限を検討する。

初期方針：

|   |   |
|---|---|
|API|方針|
|POST /contact|低めのレート制限を設定検討|
|GET /terms|制限緩め|
|GET /questions|制限緩め|
|POST /answers|認証後APIのため中程度|

24.3 ログに出さない情報

- メールアドレス全文
- 問い合わせ本文全文
- JWT
- Authorizationヘッダー
- AWSアクセスキー
- 外部APIキー

24.4 エラーメッセージ方針

内部構造を詳細に返さない。

悪い例：

{

  "message": "DynamoDB table ContactsTable does not exist"

}

良い例：

{

  "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

}

  

25. フロントエンド連携設計

25.1 APIクライアント構成

frontend/

├── lib/

│   ├── api/

│   │   ├── client.ts

│   │   ├── contact.ts

│   │   ├── questions.ts

│   │   ├── terms.ts

│   │   └── progress.ts

25.2 APIクライアント共通処理

- baseURL管理
- JSON変換
- エラーハンドリング
- 認証トークン付与
- タイムアウト処理

25.3 環境変数

NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

25.4 問い合わせ送信フロント処理

1. フォーム入力

2. フロント側バリデーション

3. 送信中状態にする

4. POST /contactを呼び出す

5. 成功時に完了メッセージ表示

6. 失敗時にエラーメッセージ表示

7. 送信中状態を解除する

  

8. APIテスト設計

26.1 テスト対象

MVPで必須のテスト対象はPOST /contact。

26.2 正常系テスト

|   |   |   |
|---|---|---|
|ID|テスト内容|期待結果|
|T-API-001|正常な問い合わせを送信|201、DynamoDB保存|
|T-API-002|sourcePageなしで送信|201、保存成功|
|T-API-003|日本語本文で送信|201、文字化けなし|

26.3 異常系テスト

|   |   |   |
|---|---|---|
|ID|テスト内容|期待結果|
|T-API-004|name未入力|400|
|T-API-005|email未入力|400|
|T-API-006|email形式不正|400|
|T-API-007|subject未入力|400|
|T-API-008|message未入力|400|
|T-API-009|messageが2,000文字超過|400|
|T-API-010|JSON形式不正|400|
|T-API-011|honeypotに値あり|201扱い、DynamoDB保存なし|

26.4 セキュリティテスト

|   |   |   |
|---|---|---|
|ID|テスト内容|期待結果|
|T-SEC-001|scriptタグを含む本文|保存されても実行されない|
|T-SEC-002|許可Origin外から送信|CORSでブロック|
|T-SEC-003|大量連続リクエスト|レート制限または監視対象|
|T-SEC-004|Authorizationヘッダーに不正値|MVPでは無視、Phase 4では401|

  

27. API実装優先度

27.1 MVP実装対象

|   |   |   |
|---|---|---|
|優先度|API|理由|
|1|POST /contact|動的機能として必須。ポートフォリオ価値も高い|

27.2 Phase 2で検討

|   |   |   |
|---|---|---|
|優先度|API|理由|
|2|GET /questions|DynamoDB連携を見せたい場合に有効|
|3|GET /questions/{questionId}|問題データをAPI管理する場合に必要|
|4|GET /terms|用語検索をAPI化したい場合に有効|
|5|GET /terms/{termId}|用語詳細をDB管理する場合に必要|

27.3 Phase 4で実装

|   |   |   |
|---|---|---|
|優先度|API|理由|
|6|POST /answers|学習履歴保存の中核|
|7|GET /progress|マイページ表示に必要|
|8|GET /review-questions|復習機能に必要|
|9|GET /me|ログインユーザー表示に必要|
|10|PUT /me|ユーザー設定変更に必要|
|11|GET /daily-question|継続利用促進に有効|

  

28. MVPでの現実的なAPI方針

28.1 最初に実装するAPI

MVPでは、以下のみ実装する。

POST /contact

理由：

- 問い合わせは動的保存が必要
- Lambda + API Gateway + DynamoDBの実装経験を示せる
- ポートフォリオとして説明しやすい
- コストが低い
- 他のコンテンツは静的管理で十分

28.2 実装しないAPI

MVPでは以下は実装しなくてよい。

GET /terms

GET /terms/{termId}

GET /questions

GET /questions/{questionId}

GET /architectures

理由：

- JSON / MDXの静的管理で十分
- SEOと表示速度の面で静的配信が有利
- APIを増やすと開発・テスト・運用が重くなる
- まず公開することが重要

28.3 ポートフォリオでの説明

MVP時点では、以下のように説明する。

用語集・模擬問題・記事はSEOと低コスト運用を重視し、静的データとして管理しています。

一方で、問い合わせフォームはユーザー入力を保存する必要があるため、API Gateway + Lambda + DynamoDBで実装しています。

これにより、静的配信とサーバーレスAPIを組み合わせた低コストなAWS構成にしています。

  

29. 受け入れ基準

29.1 API設計書の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-API-DOC-001|MVP必須APIが定義されている|
|AC-API-DOC-002|将来拡張APIがMVPと分離されている|
|AC-API-DOC-003|リクエスト形式が定義されている|
|AC-API-DOC-004|レスポンス形式が定義されている|
|AC-API-DOC-005|エラーレスポンス形式が定義されている|
|AC-API-DOC-006|CORS方針が定義されている|
|AC-API-DOC-007|DynamoDBアクセス方針が定義されている|
|AC-API-DOC-008|Lambda処理フローが定義されている|
|AC-API-DOC-009|認証が必要なAPIと不要なAPIが分離されている|

29.2 MVP API受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-API-MVP-001|POST /contactがAPI Gatewayで公開されている|
|AC-API-MVP-002|contact-submit-functionが実装されている|
|AC-API-MVP-003|ContactsTableに問い合わせが保存される|
|AC-API-MVP-004|入力バリデーションが動作する|
|AC-API-MVP-005|CORSが適切に設定されている|
|AC-API-MVP-006|CloudWatch Logsで処理結果を確認できる|
|AC-API-MVP-007|Lambda実行ロールが最小権限である|

  

30. 今後作成する関連設計書

本API設計書の次に、以下を作成する。

1. セキュリティ設計書
2. コスト管理設計書
3. インフラ構築手順書
4. Lambda実装設計書
5. フロントエンド実装設計書
6. 開発タスク一覧
7. GitHub README草案

  

8. 結論

本プロダクトのAPI設計では、MVP段階では問い合わせ送信APIのみを必須実装とする。

用語集、模擬問題、比較記事、構成図、ブログ記事は、初期段階ではJSON / MDXによる静的管理を採用する。これにより、開発コスト、AWS利用コスト、運用負荷を抑えながら、SEOに強い学習サイトを早期公開できる。

一方で、問い合わせフォームはユーザー入力を保存する必要があるため、API Gateway + Lambda + DynamoDBで実装する。これにより、AWSサーバーレス構成の実装経験をポートフォリオとして示せる。

Phase 4以降では、Cognito認証を導入し、回答履歴保存、学習進捗取得、復習問題取得、ユーザー設定更新などのAPIを追加する。これにより、単なる学習メディアから、ユーザー別に学習管理できるアプリへ拡張する。

最初に実装すべきAPIは、以下である。

POST /contact

このAPIを確実に実装し、DynamoDB保存、CloudWatch Logs、CORS、IAM最小権限まで説明できる状態にすることが、MVP段階で最も重要である。