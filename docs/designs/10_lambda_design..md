AWS資格学習サイト Lambda実装設計書

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト Lambda実装設計書|
|対象プロダクト|AWS資格ロードマップラボ|
|対象フェーズ|MVP開発 〜 Phase 4 学習アプリ化|
|目的|API Gateway + Lambda + DynamoDB によるバックエンド処理の実装方針を定義する|
|主対象API|POST /contact|
|実装言語|Python|
|実行基盤|AWS Lambda|
|連携サービス|Amazon API Gateway / Amazon DynamoDB / Amazon CloudWatch Logs / IAM|

  

2. 本設計書の目的

本設計書では、AWS資格学習サイト「AWS資格ロードマップラボ」のバックエンド処理を担うAWS Lambdaの実装方針を定義する。

MVPでは、動的処理を最小限に抑え、以下のLambdaのみを必須実装とする。

contact-submit-function

このLambdaは、問い合わせフォームから送信されたデータを受け取り、入力値検証を行ったうえで、DynamoDBの ContactsTableProd に保存する。

  

MVPでは、以下のLambdaは実装しない。

get-terms-function

get-questions-function

submit-answer-function

get-progress-function

daily-question-function

これらはPhase 2以降またはPhase 4で実装する。

  

3. Lambda実装の基本方針

3.1 基本方針

|   |   |
|---|---|
|方針|内容|
|MVPは問い合わせLambdaのみ|最初は POST /contact のみ実装する|
|Pythonで実装|学習経験と将来のAI機能拡張を考慮し、Pythonを採用する|
|API Gateway HTTP API連携|Lambda Proxy Integrationを前提とする|
|DynamoDB保存|問い合わせデータをContactsTableProdへ保存する|
|入力値検証を必須化|フロントエンドだけでなくLambda側でも検証する|
|個人情報をログに出さない|email全文、message全文はCloudWatch Logsに出力しない|
|IAM最小権限|ContactsTableProdへのPutItemのみ許可する|
|CORS対応|本番フロントエンドOriginのみ許可する|
|コスト最小化|メモリ・タイムアウト・ログ量を小さくする|
|将来拡張しやすい構成|共通レスポンス、バリデーション、DynamoDB処理を分離する|

  

4. Lambda一覧

4.1 MVP対象Lambda

|   |   |   |   |
|---|---|---|---|
|Lambda名|対応API|概要|必須|
|contact-submit-function|POST /contact|問い合わせフォーム送信内容をDynamoDBに保存する|必須|

4.2 将来拡張Lambda

|   |   |   |   |
|---|---|---|---|
|Lambda名|対応API|概要|Phase|
|get-terms-function|GET /terms, GET /terms/{termId}|AWS用語データ取得|Phase 2以降|
|get-questions-function|GET /questions, GET /questions/{questionId}|模擬問題取得|Phase 2以降|
|submit-answer-function|POST /answers|ユーザー回答履歴保存|Phase 4|
|get-progress-function|GET /progress|学習進捗取得|Phase 4|
|get-review-questions-function|GET /review-questions|復習問題取得|Phase 4|
|get-me-function|GET /me|ログインユーザー情報取得|Phase 4|
|update-me-function|PUT /me|ユーザー設定更新|Phase 4|
|daily-question-function|GET /daily-question / EventBridge|今日の1問取得・通知|Phase 4|

  

5. MVP Lambda構成

5.1 対象構成

Frontend Contact Form

  ↓ POST /contact

API Gateway HTTP API

  ↓ Lambda Proxy Integration

contact-submit-function

  ↓ PutItem

DynamoDB ContactsTableProd

  ↓ Logs

CloudWatch Logs

5.2 処理概要

1. ユーザーが問い合わせフォームを入力する

2. フロントエンドで入力値を検証する

3. API GatewayのPOST /contactへ送信する

4. API GatewayがLambdaを呼び出す

5. LambdaがJSONをパースする

6. honeypotを確認する

7. Lambda側で入力値を検証する

8. 問題なければcontactIdとcreatedAtを生成する

9. DynamoDB ContactsTableProdへ保存する

10. CloudWatch Logsへ最小限のログを出す

11. API Gateway経由でレスポンスを返す

12. フロントエンドで完了メッセージを表示する

  

13. Lambdaランタイム設計

6.1 ランタイム設定

|   |   |
|---|---|
|項目|値|
|Runtime|Python 3.11以上|
|Architecture|arm64 または x86_64|
|Memory|128MB〜256MB|
|Timeout|3〜5秒|
|Ephemeral storage|デフォルトで十分|
|VPC|接続しない|
|Provisioned Concurrency|使用しない|
|Lambda Layers|MVPでは使用しない|

6.2 arm64 / x86_64 方針

|   |   |
|---|---|
|選択肢|方針|
|arm64|コスト効率を重視する場合に候補|
|x86_64|互換性重視ならこちらでもよい|

MVPではどちらでもよいが、外部ネイティブライブラリを使わないため、arm64でも問題になりにくい。

6.3 VPC接続しない理由

MVPのLambdaはDynamoDBへアクセスするだけであり、RDSやVPC内リソースにアクセスしない。

そのため、VPC接続は不要である。

VPC接続しないメリット：

- NAT Gatewayが不要
- 構成がシンプル
- コールドスタートやネットワーク設定で詰まりにくい
- 課金リスクを下げられる

  

7. ディレクトリ構成

7.1 推奨構成

backend/

├── functions/

│   └── contact_submit/

│       ├── app.py

│       ├── validators.py

│       ├── schemas.py

│       ├── dynamodb_client.py

│       ├── response.py

│       ├── requirements.txt

│       └── tests/

│           ├── test_validator.py

│           └── test_app.py

│

├── shared/

│   ├── logger.py

│   ├── constants.py

│   └── exceptions.py

│

└── README.md

7.2 MVPでは簡略化してもよい構成

最初は以下でもよい。

backend/

└── functions/

    └── contact_submit/

        ├── app.py

        └── requirements.txt

ただし、実装が大きくなる前に以下へ分離する。

|   |   |
|---|---|
|ファイル|役割|
|app.py|Lambda handler本体|
|validators.py|入力値検証|
|response.py|共通レスポンス生成|
|dynamodb_client.py|DynamoDB保存処理|
|schemas.py|型・定数・データ構造|

  

8. contact-submit-function 設計

8.1 基本情報

|   |   |
|---|---|
|項目|内容|
|Lambda名|contact-submit-prod|
|論理名|contact-submit-function|
|対応API|POST /contact|
|Runtime|Python 3.11以上|
|Handler|app.lambda_handler|
|DynamoDB|ContactsTableProd|
|CloudWatch Logs|/aws/lambda/contact-submit-prod|

8.2 入力データ

API Gateway HTTP APIからLambda Proxy形式でイベントを受け取る。

想定リクエストBody

{

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "honeypot": ""

}

8.3 保存データ

DynamoDBには以下を保存する。

{

  "contactId": "contact-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",

  "createdAt": "2026-06-01T10:30:00+09:00",

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "status": "new",

  "userAgent": "Mozilla/5.0 ..."

}

8.4 レスポンス

成功時

HTTP 201

{

  "success": true,

  "data": {

    "contactId": "contact-xxxxxxxx",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-xxxxxxxx"

}

バリデーションエラー

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

      }

    ]

  },

  "requestId": "req-xxxxxxxx"

}

サーバーエラー

HTTP 500

{

  "success": false,

  "error": {

    "code": "INTERNAL_SERVER_ERROR",

    "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

  },

  "requestId": "req-xxxxxxxx"

}

  

9. API Gatewayイベント設計

9.1 HTTP APIイベント想定

API Gateway HTTP APIのLambda Proxy Integrationでは、概ね以下のようなイベントが渡される。

{

  "version": "2.0",

  "routeKey": "POST /contact",

  "rawPath": "/contact",

  "headers": {

    "content-type": "application/json",

    "origin": "https://xxxxxxxx.cloudfront.net",

    "user-agent": "Mozilla/5.0 ..."

  },

  "requestContext": {

    "http": {

      "method": "POST",

      "path": "/contact"

    },

    "requestId": "xxxxxxxx"

  },

  "body": "{\"name\":\"山田太郎\",\"email\":\"taro@example.com\",\"subject\":\"質問\",\"message\":\"本文\",\"honeypot\":\"\"}",

  "isBase64Encoded": false

}

9.2 取得する値

|   |   |   |
|---|---|---|
|値|取得元|用途|
|method|requestContext.http.method|OPTIONS判定、POST判定|
|body|event.body|問い合わせ入力|
|origin|headers.origin|CORS判定|
|user-agent|headers.user-agent|任意保存|
|requestId|requestContext.requestId|ログ追跡|

9.3 OPTIONS対応

CORSプリフライトリクエストに対応する。

API Gateway側でCORSを処理する場合、Lambda側でOPTIONSを意識しなくてもよい。

ただし、動作確認しやすくするため、Lambda側にもOPTIONS処理を入れておいてよい。

method == OPTIONS の場合は 200 を返す

  

10. 環境変数設計

10.1 必須環境変数

|   |   |   |
|---|---|---|
|Key|例|内容|
|CONTACTS_TABLE_NAME|ContactsTableProd|保存先DynamoDBテーブル名|
|ALLOWED_ORIGINS|https://xxxxx.cloudfront.net,https://example.com|許可Origin一覧|
|LOG_LEVEL|INFO|ログレベル|
|ENV|prod|環境名|

10.2 任意環境変数

|   |   |   |
|---|---|---|
|Key|例|内容|
|MAX_MESSAGE_LENGTH|2000|本文最大文字数|
|MAX_NAME_LENGTH|100|名前最大文字数|
|MAX_SUBJECT_LENGTH|150|件名最大文字数|
|ENABLE_HONEYPOT|true|honeypot有効化|

10.3 設定してはいけない値

Lambda環境変数に以下を直接入れない。

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

GitHub Token

外部API秘密キー

JWT秘密鍵

外部APIキーが必要になった場合は、Secrets ManagerまたはSSM Parameter Storeを検討する。

  

11. CORS実装設計

11.1 基本方針

|   |   |
|---|---|
|項目|方針|
|本番Origin|CloudFront URLまたは独自ドメインのみ許可|
|開発Origin|localhostは開発環境のみ許可|
|Allow Methods|POST, OPTIONS|
|Allow Headers|Content-Type, Authorization|
|Credentials|MVPでは使用しない|

11.2 ALLOWED_ORIGINS形式

https://xxxxxxxx.cloudfront.net,https://example.com,http://localhost:3000

本番環境ではlocalhostを削除する。

11.3 Origin判定ロジック

1. event.headers.origin を取得

2. ALLOWED_ORIGINSをカンマ区切りで配列化

3. originが許可リストに含まれる場合、そのoriginをAccess-Control-Allow-Originに設定

4. 含まれない場合、本番Originを返す、または403にする

11.4 MVP方針

最初はAPI GatewayのCORS設定で制御する。

Lambda側では、レスポンスヘッダーに Access-Control-Allow-Origin を付与する。

  

12. バリデーション設計

12.1 バリデーション方針

入力値検証は以下の2段階で行う。

フロントエンド：ユーザー体験向上のための事前チェック

Lambda：セキュリティ・データ保護のための必須チェック

フロントエンドのチェックは信用しない。

12.2 項目別ルール

|   |   |   |
|---|---|---|
|項目|必須|ルール|
|name|必須|1〜100文字|
|email|必須|メール形式、255文字以内|
|subject|必須|1〜150文字|
|message|必須|1〜2,000文字|
|sourcePage|任意|255文字以内|
|honeypot|任意|空文字であること|

12.3 メール形式チェック

厳密すぎるメール正規表現は避ける。

MVPでは以下程度でよい。

@ が含まれる

@ の前後に文字がある

ドメイン側に . が含まれる

255文字以内

12.4 禁止・制限する入力

|   |   |
|---|---|
|入力|扱い|
|空文字|必須項目ならエラー|
|文字数超過|エラー|
|scriptタグ|保存自体は可能。ただし表示時は必ずエスケープ|
|HTMLタグ|保存自体は可能。ただしHTMLとして解釈しない|
|honeypot入力あり|Bot扱い。保存しない|

12.5 エラー詳細形式

{

  "field": "message",

  "message": "本文は2,000文字以内で入力してください。"

}

12.6 バリデーション関数イメージ

import re

  

  

def is_valid_email(email: str) -> bool:

    if not email or len(email) > 255:

        return False

    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    return re.match(pattern, email) is not None

  

  

def validate_contact_input(data: dict) -> list[dict]:

    errors = []

  

    name = str(data.get("name", "")).strip()

    email = str(data.get("email", "")).strip()

    subject = str(data.get("subject", "")).strip()

    message = str(data.get("message", "")).strip()

    source_page = str(data.get("sourcePage", "")).strip()

  

    if not name:

        errors.append({"field": "name", "message": "名前を入力してください。"})

    elif len(name) > 100:

        errors.append({"field": "name", "message": "名前は100文字以内で入力してください。"})

  

    if not is_valid_email(email):

        errors.append({"field": "email", "message": "正しいメールアドレスを入力してください。"})

  

    if not subject:

        errors.append({"field": "subject", "message": "件名を入力してください。"})

    elif len(subject) > 150:

        errors.append({"field": "subject", "message": "件名は150文字以内で入力してください。"})

  

    if not message:

        errors.append({"field": "message", "message": "本文を入力してください。"})

    elif len(message) > 2000:

        errors.append({"field": "message", "message": "本文は2,000文字以内で入力してください。"})

  

    if len(source_page) > 255:

        errors.append({"field": "sourcePage", "message": "送信元ページの値が長すぎます。"})

  

    return errors

  

13. honeypot設計

13.1 目的

Botによる自動投稿を低コストで防ぐ。

reCAPTCHAはMVPでは使わない。

理由：

- 実装が増える
- 外部サービス依存が増える
- 初期段階では過剰

13.2 フロントエンド側

ユーザーには見えない入力欄を用意する。

<input

  type="text"

  name="honeypot"

  tabIndex="-1"

  autoComplete="off"

  style={{ display: 'none' }}

/>

13.3 Lambda側

honeypotに値が入っている場合：

- DynamoDBに保存しない

- ログにはspam detected程度だけ出す

- レスポンスは成功扱いにする

13.4 成功扱いにする理由

Botにブロックされたことを悟られにくくするため。

  

14. DynamoDB保存設計

14.1 保存先テーブル

|   |   |
|---|---|
|項目|内容|
|Table name|ContactsTableProd|
|Partition key|contactId|
|Sort key|なし|
|Billing mode|On-demand推奨|

14.2 PutItem項目

|   |   |   |   |
|---|---|---|---|
|属性|型|必須|内容|
|contactId|String|必須|contact- + UUID|
|createdAt|String|必須|ISO 8601形式|
|name|String|必須|名前|
|email|String|必須|メールアドレス|
|subject|String|必須|件名|
|message|String|必須|本文|
|sourcePage|String|任意|送信元ページ|
|status|String|必須|new|
|userAgent|String|任意|User-Agent|
|requestId|String|任意|API Gateway requestId|

14.3 contactId生成

import uuid

  

contact_id = f"contact-{uuid.uuid4()}"

14.4 createdAt生成

JSTで保存する。

from datetime import datetime, timezone, timedelta

  

JST = timezone(timedelta(hours=9))

created_at = datetime.now(JST).isoformat()

14.5 DynamoDB保存関数イメージ

import boto3

  

  

dynamodb = boto3.resource("dynamodb")

  

  

def save_contact(table_name: str, item: dict) -> None:

    table = dynamodb.Table(table_name)

    table.put_item(Item=item)

14.6 注意点

- DynamoDBには空文字を保存できるケースとできないケースの扱いに注意する
- 任意項目が空文字の場合は保存しない、または空文字許容の挙動を確認する
- emailやmessageをログに出さない
- 問い合わせ一覧取得APIはMVPでは作らない

  

15. レスポンス設計

15.1 共通レスポンス方針

すべてのレスポンスは以下の形式に統一する。

成功

{

  "success": true,

  "data": {},

  "message": "OK",

  "requestId": "req-xxxxxxxx"

}

エラー

{

  "success": false,

  "error": {

    "code": "ERROR_CODE",

    "message": "エラーメッセージ",

    "details": []

  },

  "requestId": "req-xxxxxxxx"

}

15.2 レスポンスヘッダー

|   |   |
|---|---|
|Header|値|
|Content-Type|application/json|
|Access-Control-Allow-Origin|許可Origin|
|Access-Control-Allow-Headers|Content-Type,Authorization|
|Access-Control-Allow-Methods|POST,OPTIONS|

15.3 response.pyイメージ

import json

import os

  

  

def get_allowed_origin(event: dict) -> str:

    headers = event.get("headers") or {}

    origin = headers.get("origin") or headers.get("Origin")

    allowed_origins = [

        item.strip()

        for item in os.environ.get("ALLOWED_ORIGINS", "").split(",")

        if item.strip()

    ]

  

    if origin and origin in allowed_origins:

        return origin

  

    if allowed_origins:

        return allowed_origins[0]

  

    return "*"

  

  

def build_headers(event: dict) -> dict:

    return {

        "Content-Type": "application/json",

        "Access-Control-Allow-Origin": get_allowed_origin(event),

        "Access-Control-Allow-Headers": "Content-Type,Authorization",

        "Access-Control-Allow-Methods": "POST,OPTIONS"

    }

  

  

def success_response(event: dict, data=None, message="OK", status_code=200, request_id=None):

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

        "body": json.dumps({

            "success": True,

            "data": data or {},

            "message": message,

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

  

def error_response(event: dict, code: str, message: str, status_code=400, details=None, request_id=None):

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

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

  

16. エラーハンドリング設計

16.1 エラー一覧

|   |   |   |
|---|---|---|
|エラーコード|HTTP|発生条件|
|INVALID_JSON|400|bodyがJSONとして解析できない|
|VALIDATION_ERROR|400|入力値エラー|
|METHOD_NOT_ALLOWED|405|POST / OPTIONS以外|
|DYNAMODB_ERROR|500|DynamoDB保存失敗|
|INTERNAL_SERVER_ERROR|500|想定外エラー|

16.2 INVALID_JSON

{

  "success": false,

  "error": {

    "code": "INVALID_JSON",

    "message": "JSON形式が不正です。",

    "details": []

  },

  "requestId": "req-xxxxxxxx"

}

16.3 VALIDATION_ERROR

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

16.4 DYNAMODB_ERROR

ユーザーには詳細を返さない。

{

  "success": false,

  "error": {

    "code": "INTERNAL_SERVER_ERROR",

    "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。",

    "details": []

  },

  "requestId": "req-xxxxxxxx"

}

CloudWatch Logsには以下程度を出す。

ERROR dynamodb put_item failed requestId=req-xxxx errorType=ClientError

本文全文やemailは出さない。

  

17. ログ設計

17.1 ログ出力方針

|   |   |
|---|---|
|項目|方針|
|requestId|出力する|
|contactId|出力してよい|
|status|出力してよい|
|validation error fields|出力してよい|
|email全文|出力しない|
|message全文|出力しない|
|JWT|出力しない|
|Authorization header|出力しない|
|AWS認証情報|出力しない|

17.2 正常ログ例

INFO request started requestId=req-xxxx method=POST path=/contact

INFO contact saved requestId=req-xxxx contactId=contact-xxxx

17.3 バリデーションエラーログ例

WARN validation error requestId=req-xxxx fields=email,message

17.4 スパム検知ログ例

WARN honeypot detected requestId=req-xxxx

17.5 異常ログ例

ERROR dynamodb put_item failed requestId=req-xxxx errorType=ClientError

ERROR unexpected error requestId=req-xxxx errorType=ValueError

17.6 ログ保存期間

|   |   |
|---|---|
|Log Group|保存期間|
|/aws/lambda/contact-submit-prod|14日〜30日|

  

18. IAM権限設計

18.1 Lambda実行ロール

|   |   |
|---|---|
|項目|内容|
|Role名|lambda-contact-submit-role-prod|
|Trust policy|LambdaサービスからAssumeRole可能|
|DynamoDB権限|ContactsTableProdへのPutItemのみ|
|CloudWatch権限|Logs出力のみ|

18.2 DynamoDB権限

{

  "Effect": "Allow",

  "Action": [

    "dynamodb:PutItem"

  ],

  "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTableProd"

}

18.3 CloudWatch Logs権限

{

  "Effect": "Allow",

  "Action": [

    "logs:CreateLogGroup",

    "logs:CreateLogStream",

    "logs:PutLogEvents"

  ],

  "Resource": "arn:aws:logs:ap-northeast-1:<account-id>:*"

}

18.4 付与しない権限

|   |   |
|---|---|
|権限|理由|
|dynamodb:Scan|問い合わせ保存には不要|
|dynamodb:GetItem|MVPの問い合わせ保存には不要|
|dynamodb:DeleteItem|不要|
|dynamodb:*|権限過多|
|s3:*|不要|
|iam:*|危険|
|AdministratorAccess|絶対に不要|

  

19. app.py 実装設計

19.1 処理フロー

lambda_handler(event, context)

  ↓

requestId取得または生成

  ↓

HTTPメソッド確認

  ↓

OPTIONSなら200返却

  ↓

POST以外なら405返却

  ↓

body JSONパース

  ↓

honeypot確認

  ↓

入力値検証

  ↓

contactId生成

  ↓

createdAt生成

  ↓

DynamoDB item作成

  ↓

PutItem実行

  ↓

成功レスポンス返却

19.2 実装コード案

import json

import os

import uuid

import re

from datetime import datetime, timezone, timedelta

from typing import Any

  

import boto3

from botocore.exceptions import ClientError

  

  

dynamodb = boto3.resource("dynamodb")

JST = timezone(timedelta(hours=9))

  

  

ERROR_MESSAGES = {

    "INVALID_JSON": "JSON形式が不正です。",

    "VALIDATION_ERROR": "入力内容に誤りがあります。",

    "METHOD_NOT_ALLOWED": "許可されていないHTTPメソッドです。",

    "INTERNAL_SERVER_ERROR": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

}

  

  

def get_request_id(event: dict, context: Any) -> str:

    request_context = event.get("requestContext") or {}

    request_id = request_context.get("requestId")

    if request_id:

        return f"req-{request_id}"

    if context and getattr(context, "aws_request_id", None):

        return f"req-{context.aws_request_id}"

    return f"req-{uuid.uuid4()}"

  

  

def get_method(event: dict) -> str:

    request_context = event.get("requestContext") or {}

    http = request_context.get("http") or {}

    return http.get("method", "").upper()

  

  

def get_header(event: dict, key: str) -> str | None:

    headers = event.get("headers") or {}

    key_lower = key.lower()

    for header_key, value in headers.items():

        if header_key.lower() == key_lower:

            return value

    return None

  

  

def get_allowed_origin(event: dict) -> str:

    origin = get_header(event, "origin")

    allowed_origins = [

        item.strip()

        for item in os.environ.get("ALLOWED_ORIGINS", "").split(",")

        if item.strip()

    ]

  

    if origin and origin in allowed_origins:

        return origin

  

    if allowed_origins:

        return allowed_origins[0]

  

    return "*"

  

  

def build_headers(event: dict) -> dict:

    return {

        "Content-Type": "application/json",

        "Access-Control-Allow-Origin": get_allowed_origin(event),

        "Access-Control-Allow-Headers": "Content-Type,Authorization",

        "Access-Control-Allow-Methods": "POST,OPTIONS"

    }

  

  

def success_response(event: dict, data: dict | None = None, message: str = "OK", status_code: int = 200, request_id: str | None = None) -> dict:

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

        "body": json.dumps({

            "success": True,

            "data": data or {},

            "message": message,

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

  

def error_response(event: dict, code: str, status_code: int = 400, details: list[dict] | None = None, request_id: str | None = None) -> dict:

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

        "body": json.dumps({

            "success": False,

            "error": {

                "code": code,

                "message": ERROR_MESSAGES.get(code, "エラーが発生しました。"),

                "details": details or []

            },

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

  

def parse_body(event: dict) -> dict:

    body = event.get("body")

    if not body:

        return {}

    return json.loads(body)

  

  

def is_valid_email(email: str) -> bool:

    if not email or len(email) > 255:

        return False

    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    return re.match(pattern, email) is not None

  

  

def validate_contact_input(data: dict) -> list[dict]:

    errors: list[dict] = []

  

    name = str(data.get("name", "")).strip()

    email = str(data.get("email", "")).strip()

    subject = str(data.get("subject", "")).strip()

    message = str(data.get("message", "")).strip()

    source_page = str(data.get("sourcePage", "")).strip()

  

    if not name:

        errors.append({"field": "name", "message": "名前を入力してください。"})

    elif len(name) > 100:

        errors.append({"field": "name", "message": "名前は100文字以内で入力してください。"})

  

    if not is_valid_email(email):

        errors.append({"field": "email", "message": "正しいメールアドレスを入力してください。"})

  

    if not subject:

        errors.append({"field": "subject", "message": "件名を入力してください。"})

    elif len(subject) > 150:

        errors.append({"field": "subject", "message": "件名は150文字以内で入力してください。"})

  

    if not message:

        errors.append({"field": "message", "message": "本文を入力してください。"})

    elif len(message) > 2000:

        errors.append({"field": "message", "message": "本文は2,000文字以内で入力してください。"})

  

    if len(source_page) > 255:

        errors.append({"field": "sourcePage", "message": "送信元ページの値が長すぎます。"})

  

    return errors

  

  

def sanitize_contact_input(data: dict) -> dict:

    return {

        "name": str(data.get("name", "")).strip(),

        "email": str(data.get("email", "")).strip(),

        "subject": str(data.get("subject", "")).strip(),

        "message": str(data.get("message", "")).strip(),

        "sourcePage": str(data.get("sourcePage", "")).strip()

    }

  

  

def build_contact_item(data: dict, event: dict, request_id: str) -> dict:

    contact_id = f"contact-{uuid.uuid4()}"

    created_at = datetime.now(JST).isoformat()

    user_agent = get_header(event, "user-agent") or ""

  

    item = {

        "contactId": contact_id,

        "createdAt": created_at,

        "name": data["name"],

        "email": data["email"],

        "subject": data["subject"],

        "message": data["message"],

        "status": "new",

        "requestId": request_id

    }

  

    if data.get("sourcePage"):

        item["sourcePage"] = data["sourcePage"]

  

    if user_agent:

        item["userAgent"] = user_agent[:500]

  

    return item

  

  

def save_contact(item: dict) -> None:

    table_name = os.environ["CONTACTS_TABLE_NAME"]

    table = dynamodb.Table(table_name)

    table.put_item(Item=item)

  

  

def lambda_handler(event, context):

    request_id = get_request_id(event, context)

    method = get_method(event)

  

    print(f"INFO request started requestId={request_id} method={method}")

  

    if method == "OPTIONS":

        return success_response(event, data={}, message="OK", status_code=200, request_id=request_id)

  

    if method != "POST":

        print(f"WARN method not allowed requestId={request_id} method={method}")

        return error_response(event, "METHOD_NOT_ALLOWED", status_code=405, request_id=request_id)

  

    try:

        body = parse_body(event)

    except json.JSONDecodeError:

        print(f"WARN invalid json requestId={request_id}")

        return error_response(event, "INVALID_JSON", status_code=400, request_id=request_id)

  

    honeypot = str(body.get("honeypot", "")).strip()

    if honeypot:

        print(f"WARN honeypot detected requestId={request_id}")

        return success_response(

            event,

            data={"contactId": None, "status": "accepted"},

            message="お問い合わせを受け付けました。",

            status_code=201,

            request_id=request_id

        )

  

    errors = validate_contact_input(body)

    if errors:

        fields = ",".join([error["field"] for error in errors])

        print(f"WARN validation error requestId={request_id} fields={fields}")

        return error_response(

            event,

            "VALIDATION_ERROR",

            status_code=400,

            details=errors,

            request_id=request_id

        )

  

    data = sanitize_contact_input(body)

    item = build_contact_item(data, event, request_id)

  

    try:

        save_contact(item)

    except ClientError as error:

        print(f"ERROR dynamodb put_item failed requestId={request_id} errorType={error.__class__.__name__}")

        return error_response(event, "INTERNAL_SERVER_ERROR", status_code=500, request_id=request_id)

    except Exception as error:

        print(f"ERROR unexpected error requestId={request_id} errorType={error.__class__.__name__}")

        return error_response(event, "INTERNAL_SERVER_ERROR", status_code=500, request_id=request_id)

  

    print(f"INFO contact saved requestId={request_id} contactId={item['contactId']}")

  

    return success_response(

        event,

        data={"contactId": item["contactId"], "status": "new"},

        message="お問い合わせを受け付けました。",

        status_code=201,

        request_id=request_id

    )

19.3 実装上の注意点

上記コードはMVP実装の基準コードである。

本番導入前に以下を確認する。

|   |   |
|---|---|
|項目|確認|
|ALLOWED_ORIGINSが本番ドメインのみ|必須|
|CONTACTS_TABLE_NAMEが正しい|必須|
|emailやmessageがログ出力されない|必須|
|DynamoDB PutItem権限のみ|必須|
|Lambdaタイムアウトが短い|推奨|
|CloudWatch Logs保存期間設定済み|必須|

  

20. requirements.txt 設計

20.1 MVP

Lambdaランタイムにはboto3が含まれることが多いため、MVPでは外部依存を最小にする。

# requirements.txt

空でもよい。

20.2 追加してもよい候補

|   |   |   |
|---|---|---|
|ライブラリ|用途|MVP必要性|
|pydantic|入力スキーマ検証|不要。最初は標準ライブラリで十分|
|aws-lambda-powertools|ログ・トレーシング・ユーティリティ|Phase 2以降で検討|
|pytest|テスト|ローカル開発用には推奨|
|moto|AWSモックテスト|Phase 2以降で検討|

20.3 方針

MVPでは依存ライブラリを増やしすぎない。

理由：

- デプロイパッケージが大きくなる
- 脆弱性管理が増える
- 初学者には構成が複雑になる
- 標準ライブラリで十分実装できる

  

21. ローカルテスト設計

21.1 テスト方針

MVPでは以下をテストする。

|   |   |
|---|---|
|テスト種別|内容|
|バリデーションテスト|入力値検証が正しく動くか|
|JSONパーステスト|不正JSONで400になるか|
|honeypotテスト|honeypot入力時に保存しないか|
|レスポンステスト|成功・エラー形式が統一されているか|
|DynamoDB保存テスト|実AWSまたはモックでPutItemできるか|

21.2 最小テストイベント

events/contact_valid.json

{

  "version": "2.0",

  "routeKey": "POST /contact",

  "rawPath": "/contact",

  "headers": {

    "content-type": "application/json",

    "origin": "http://localhost:3000",

    "user-agent": "test-agent"

  },

  "requestContext": {

    "requestId": "test-request-id",

    "http": {

      "method": "POST",

      "path": "/contact"

    }

  },

  "body": "{\"name\":\"テスト太郎\",\"email\":\"test@example.com\",\"subject\":\"テスト\",\"message\":\"これはテストです。\",\"sourcePage\":\"/contact\",\"honeypot\":\"\"}",

  "isBase64Encoded": false

}

21.3 異常系テストイベント

email不正

{

  "version": "2.0",

  "requestContext": {

    "requestId": "test-request-id",

    "http": {

      "method": "POST",

      "path": "/contact"

    }

  },

  "headers": {

    "origin": "http://localhost:3000"

  },

  "body": "{\"name\":\"テスト太郎\",\"email\":\"invalid-email\",\"subject\":\"テスト\",\"message\":\"本文\",\"honeypot\":\"\"}"

}

honeypotあり

{

  "version": "2.0",

  "requestContext": {

    "requestId": "test-request-id",

    "http": {

      "method": "POST",

      "path": "/contact"

    }

  },

  "headers": {

    "origin": "http://localhost:3000"

  },

  "body": "{\"name\":\"bot\",\"email\":\"bot@example.com\",\"subject\":\"spam\",\"message\":\"spam\",\"honeypot\":\"filled\"}"

}

21.4 pytest例

from validators import validate_contact_input

  

  

def test_valid_contact_input():

    data = {

        "name": "テスト太郎",

        "email": "test@example.com",

        "subject": "テスト",

        "message": "これはテストです。"

    }

    errors = validate_contact_input(data)

    assert errors == []

  

  

def test_invalid_email():

    data = {

        "name": "テスト太郎",

        "email": "invalid-email",

        "subject": "テスト",

        "message": "これはテストです。"

    }

    errors = validate_contact_input(data)

    assert any(error["field"] == "email" for error in errors)

  

  

def test_empty_message():

    data = {

        "name": "テスト太郎",

        "email": "test@example.com",

        "subject": "テスト",

        "message": ""

    }

    errors = validate_contact_input(data)

    assert any(error["field"] == "message" for error in errors)

  

22. AWSコンソールでのテスト手順

22.1 Lambda単体テスト

1. Lambdaコンソールを開く

2. contact-submit-prodを開く

3. Testタブを開く

4. New eventを作成

5. API Gateway HTTP API形式のテストイベントを貼り付ける

6. Testを実行

7. レスポンスを確認

8. CloudWatch Logsを確認

9. DynamoDBに保存されているか確認

22.2 API Gateway経由テスト

curlで確認する。

curl -X POST "https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/contact" \

  -H "Content-Type: application/json" \

  -H "Origin: https://xxxxxxxx.cloudfront.net" \

  -d '{

    "name": "テスト太郎",

    "email": "test@example.com",

    "subject": "テスト問い合わせ",

    "message": "これはAPI Gateway経由のテストです。",

    "sourcePage": "/contact",

    "honeypot": ""

  }'

22.3 期待結果

|   |   |
|---|---|
|確認対象|期待結果|
|HTTP status|201|
|success|true|
|contactId|返却される|
|DynamoDB|itemが保存される|
|CloudWatch Logs|contact savedログが出る|
|個人情報ログ|email全文・message全文が出ていない|

  

23. デプロイ設計

23.1 初期デプロイ方針

MVPでは、最初はAWSコンソールから直接コードを貼り付けてもよい。

ただし、最終的にはGitHub管理する。

23.2 推奨デプロイ段階

|   |   |
|---|---|
|段階|方法|
|初回動作確認|AWSコンソールで直接作成|
|MVP整理後|zipアップロード|
|Phase 2以降|AWS SAM|
|本格運用|GitHub Actions + SAM|

23.3 zipデプロイ手順

cd backend/functions/contact_submit

zip -r contact_submit.zip .

aws lambda update-function-code \

  --function-name contact-submit-prod \

  --zip-file fileb://contact_submit.zip

23.4 SAM構成案

infra/sam-template.yaml

AWSTemplateFormatVersion: '2010-09-09'

Transform: AWS::Serverless-2016-10-31

Description: AWS Cert Roadmap Lab Backend

  

Globals:

  Function:

    Runtime: python3.11

    Timeout: 5

    MemorySize: 128

    Architectures:

      - arm64

    Environment:

      Variables:

        ENV: prod

        LOG_LEVEL: INFO

  

Resources:

  ContactsTable:

    Type: AWS::DynamoDB::Table

    Properties:

      TableName: ContactsTableProd

      BillingMode: PAY_PER_REQUEST

      AttributeDefinitions:

        - AttributeName: contactId

          AttributeType: S

      KeySchema:

        - AttributeName: contactId

          KeyType: HASH

  

  ContactSubmitFunction:

    Type: AWS::Serverless::Function

    Properties:

      FunctionName: contact-submit-prod

      CodeUri: ../backend/functions/contact_submit/

      Handler: app.lambda_handler

      Environment:

        Variables:

          CONTACTS_TABLE_NAME: !Ref ContactsTable

          ALLOWED_ORIGINS: "https://example.com,http://localhost:3000"

      Policies:

        - DynamoDBWritePolicy:

            TableName: !Ref ContactsTable

      Events:

        ContactApi:

          Type: HttpApi

          Properties:

            Path: /contact

            Method: POST

23.5 SAMコマンド

sam build

sam deploy --guided

23.6 注意点

最初からSAMにこだわりすぎると、資格学習・MVP公開が遅れる可能性がある。

まずAWSコンソールで動かし、仕組みを理解してからIaC化してよい。

  

24. Lambda設定チェックリスト

24.1 基本設定

|   |   |
|---|---|
|チェック|状態|
|RuntimeがPython 3.11以上|未実施 / 実施済み|
|Handlerがapp.lambda_handler|未実施 / 実施済み|
|Memoryが128MB〜256MB|未実施 / 実施済み|
|Timeoutが3〜5秒|未実施 / 実施済み|
|VPC接続していない|未実施 / 実施済み|
|Provisioned Concurrencyを使っていない|未実施 / 実施済み|

24.2 環境変数

|   |   |
|---|---|
|チェック|状態|
|CONTACTS_TABLE_NAMEを設定した|未実施 / 実施済み|
|ALLOWED_ORIGINSを設定した|未実施 / 実施済み|
|LOG_LEVELを設定した|未実施 / 実施済み|
|秘密情報を環境変数に入れていない|未実施 / 実施済み|

24.3 IAM

|   |   |
|---|---|
|チェック|状態|
|ContactsTableProdへのPutItemのみ許可|未実施 / 実施済み|
|CloudWatch Logs出力権限がある|未実施 / 実施済み|
|AdministratorAccessを付与していない|未実施 / 実施済み|
|不要なDynamoDB権限がない|未実施 / 実施済み|

24.4 ログ

|   |   |
|---|---|
|チェック|状態|
|CloudWatch Logs保存期間を設定した|未実施 / 実施済み|
|email全文をログに出していない|未実施 / 実施済み|
|message全文をログに出していない|未実施 / 実施済み|
|requestIdをログに出している|未実施 / 実施済み|

  

25. フロントエンド連携設計

25.1 APIクライアント

frontend/

└── lib/

    └── api/

        └── contact.ts

25.2 contact.ts例

export type ContactInput = {

  name: string;

  email: string;

  subject: string;

  message: string;

  sourcePage?: string;

  honeypot?: string;

};

  

export type ContactResponse = {

  success: boolean;

  data?: {

    contactId: string | null;

    status: string;

  };

  message?: string;

  error?: {

    code: string;

    message: string;

    details?: Array<{

      field: string;

      message: string;

    }>;

  };

  requestId?: string;

};

  

export async function submitContact(input: ContactInput): Promise<ContactResponse> {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  

  if (!baseUrl) {

    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');

  }

  

  const response = await fetch(`${baseUrl}/contact`, {

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

    },

    body: JSON.stringify(input),

  });

  

  const data = await response.json();

  

  if (!response.ok) {

    return data;

  }

  

  return data;

}

25.3 フロントエンド側の注意点

|   |   |
|---|---|
|項目|方針|
|NEXT_PUBLIC_API_BASE_URL|API Gateway URLを設定|
|フロント側検証|必ず行う。ただしLambda側でも再検証|
|送信中状態|二重送信防止のためボタンをdisabledにする|
|エラー表示|Lambdaのdetailsをフォーム項目に表示|
|honeypot|hidden入力として送る|

  

26. 運用監視設計

26.1 監視対象

|   |   |
|---|---|
|対象|確認内容|
|Lambda Invocations|実行回数が急増していないか|
|Lambda Errors|エラーが発生していないか|
|Lambda Duration|実行時間が長くなっていないか|
|API Gateway 4XX|バリデーションエラー・不正アクセス増加|
|API Gateway 5XX|Lambda・DynamoDB障害|
|DynamoDB Item count|スパム投稿増加|
|CloudWatch Logs|個人情報が出ていないか|

26.2 CloudWatch Logs確認ポイント

INFO contact saved

WARN validation error

WARN honeypot detected

ERROR dynamodb put_item failed

ERROR unexpected error

26.3 アラーム導入タイミング

MVPではAWS Budgetsを最優先とする。

Phase 2以降で以下のCloudWatch Alarmを検討する。

|   |   |
|---|---|
|アラーム|条件|
|Lambda Errors|5分間で1件以上|
|API Gateway 5XX|5分間で1件以上|
|Lambda Invocations急増|通常の数倍|
|DynamoDB ThrottledRequests|1件以上|

  

27. コスト設計

27.1 コスト最小化方針

|   |   |
|---|---|
|項目|方針|
|Lambdaメモリ|128MB〜256MBから開始|
|タイムアウト|3〜5秒|
|Provisioned Concurrency|使わない|
|外部ライブラリ|最小化|
|ログ|必要最小限|
|DynamoDB|PutItemのみ、問い合わせ保存のみ|

27.2 課金リスク

|   |   |
|---|---|
|リスク|対策|
|Botによる大量POST|honeypot、API Gateway制限、必要ならWAF/reCAPTCHA|
|エラー無限出力|ログ量制限、保存期間設定|
|Lambda長時間実行|Timeout短め|
|DynamoDB書き込み増加|レート制限、スパム対策|

  

28. セキュリティ設計

28.1 必須対策

|   |   |
|---|---|
|対策|内容|
|IAM最小権限|DynamoDB PutItemのみ|
|入力値検証|Lambda側で必ず実施|
|CORS制限|本番Originのみ|
|ログ制限|個人情報を出力しない|
|honeypot|Bot対策|
|文字数制限|長文スパム対策|
|秘密情報管理|Lambda環境変数に秘密情報を入れない|

28.2 XSS対策

問い合わせ本文はDynamoDBに保存されるが、MVPでは管理画面表示しない。

将来管理画面を作る場合は、本文をHTMLとして表示せず、必ずエスケープする。

28.3 CORSの限界

CORSはブラウザからの制限であり、curlやBotからの直接アクセスを完全に防ぐものではない。

そのため、以下も必要である。

- Lambda側バリデーション
- honeypot
- 文字数制限
- レート制限検討
- Budgets監視

  

29. 将来拡張Lambda設計

  

29.1 get-questions-function

概要

模擬問題をDynamoDBから取得するLambda。

MVPでは不要。

対応API

GET /questions

GET /questions/{questionId}

方針

|   |   |
|---|---|
|項目|方針|
|一覧API|正解情報を返さない|
|詳細API|無料問題なら正解と解説を返してよい|
|有料化後|回答後にのみ正解を返す設計へ変更|
|DynamoDB|QuestionsTable|

  

29.2 submit-answer-function

概要

ログインユーザーの回答履歴を保存するLambda。

Phase 4で実装する。

対応API

POST /answers

認証

Cognito JWT必須。

重要ルール

userIdはリクエストBodyから受け取らない。

JWTのsubを使う。

保存先

|   |   |
|---|---|
|テーブル|用途|
|UserAnswersTable|回答履歴保存|
|UserProgressTable|正答率・苦手カテゴリ更新|

  

29.3 get-progress-function

概要

ユーザーの学習進捗を取得するLambda。

対応API

GET /progress

認証

Cognito JWT必須。

方針

- JWTのsubでUserProgressTableをQueryする
- 他ユーザーのデータは取得できない
- 学習履歴がない場合はゼロ値を返す

  

29.4 daily-question-function

概要

毎日1問を取得・通知するLambda。

呼び出し元

|   |   |
|---|---|
|呼び出し元|用途|
|API Gateway|トップページに今日の1問を表示|
|EventBridge|毎日1問通知|

注意点

- SESを使う場合はメール送信数に注意
- 通知停止機能を用意する
- まずはWeb表示だけでもよい

  

30. 実装順序

30.1 MVP実装順

1. ContactsTableProdを作成

2. lambda-contact-submit-role-prodを作成

3. contact-submit-prodを作成

4. 環境変数を設定

5. app.pyを実装

6. Lambda単体テスト

7. API Gateway HTTP APIを作成

8. POST /contactとLambdaを接続

9. CORS設定

10. curlでAPIテスト

11. DynamoDB保存確認

12. CloudWatch Logs確認

13. フロントエンド問い合わせフォームと接続

14. CloudFront上の本番サイトから送信確認

15. CloudWatch Logs保存期間設定

30.2 実装しないこと

MVPでは以下を実装しない。

管理画面

問い合わせ一覧取得API

メール通知

ログイン

回答履歴保存

AI自動返信

reCAPTCHA

WAF

理由：

- MVP公開を遅らせるため
- コストが増えるため
- 最初のポートフォリオには過剰なため

  

31. テストケース一覧

31.1 正常系

|   |   |   |
|---|---|---|
|ID|テスト内容|期待結果|
|LT-001|正常な問い合わせを送信|201、DynamoDB保存|
|LT-002|sourcePageなしで送信|201、DynamoDB保存|
|LT-003|日本語本文を送信|201、文字化けなし|
|LT-004|最大文字数以内で送信|201|

31.2 異常系

|   |   |   |
|---|---|---|
|ID|テスト内容|期待結果|
|LT-101|bodyなし|400|
|LT-102|JSON不正|400 INVALID_JSON|
|LT-103|name空|400 VALIDATION_ERROR|
|LT-104|email空|400 VALIDATION_ERROR|
|LT-105|email形式不正|400 VALIDATION_ERROR|
|LT-106|subject空|400 VALIDATION_ERROR|
|LT-107|message空|400 VALIDATION_ERROR|
|LT-108|message 2,000文字超過|400 VALIDATION_ERROR|
|LT-109|POST以外|405 METHOD_NOT_ALLOWED|

31.3 スパム対策

|   |   |   |
|---|---|---|
|ID|テスト内容|期待結果|
|LT-201|honeypotに値あり|201扱い、DynamoDB保存なし|
|LT-202|scriptタグを本文に含む|保存は可。ただしログに本文全文を出さない|
|LT-203|許可外Origin|CORSで制限|

31.4 IAMテスト

|   |   |   |
|---|---|---|
|ID|テスト内容|期待結果|
|LT-301|ContactsTableProdへPutItem|成功|
|LT-302|ContactsTableProdをScan|失敗することが望ましい|
|LT-303|別テーブルへPutItem|失敗|

  

32. 受け入れ基準

32.1 Lambda実装設計書の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-LAMBDA-DOC-001|MVP対象Lambdaが明確である|
|AC-LAMBDA-DOC-002|POST /contactの処理フローが定義されている|
|AC-LAMBDA-DOC-003|入力値バリデーションが定義されている|
|AC-LAMBDA-DOC-004|DynamoDB保存項目が定義されている|
|AC-LAMBDA-DOC-005|共通レスポンス形式が定義されている|
|AC-LAMBDA-DOC-006|エラーハンドリングが定義されている|
|AC-LAMBDA-DOC-007|ログ出力方針が定義されている|
|AC-LAMBDA-DOC-008|IAM最小権限が定義されている|
|AC-LAMBDA-DOC-009|CORS方針が定義されている|
|AC-LAMBDA-DOC-010|将来拡張Lambdaが分離されている|

32.2 MVP実装完了基準

|   |   |
|---|---|
|ID|基準|
|AC-LAMBDA-MVP-001|contact-submit-prodが作成されている|
|AC-LAMBDA-MVP-002|POST /contactからLambdaを呼び出せる|
|AC-LAMBDA-MVP-003|正常な問い合わせがDynamoDBに保存される|
|AC-LAMBDA-MVP-004|不正入力で400が返る|
|AC-LAMBDA-MVP-005|honeypot入力時にDynamoDB保存されない|
|AC-LAMBDA-MVP-006|CloudWatch Logsに個人情報が出力されない|
|AC-LAMBDA-MVP-007|Lambda RoleがContactsTableProdへのPutItemのみ許可している|
|AC-LAMBDA-MVP-008|CloudFront上の問い合わせフォームから送信できる|
|AC-LAMBDA-MVP-009|CloudWatch Logs保存期間が14日〜30日に設定されている|
|AC-LAMBDA-MVP-010|Lambda timeoutが3〜5秒に設定されている|

  

33. READMEに書く説明

GitHub READMEには以下のように記載する。

## Backend / Lambda

  

The MVP backend uses AWS Lambda for the contact form API.

  

- API Gateway exposes `POST /contact`

- Lambda validates the request body

- Honeypot field is used for simple spam protection

- Valid contact data is stored in DynamoDB

- CloudWatch Logs are used for operation logs

- IAM role grants only `dynamodb:PutItem` to the contact table

  

The Lambda function does not log personal information such as email addresses or message bodies.

日本語では以下。

## バックエンド / Lambda

  

MVPでは、問い合わせフォーム用APIとしてAWS Lambdaを利用しています。

  

- API Gatewayで `POST /contact` を公開

- Lambda側で入力値検証を実施

- honeypot項目で簡易スパム対策

- 正常な問い合わせデータをDynamoDBに保存

- CloudWatch Logsで実行ログを確認

- IAM RoleはContactsTableへの `dynamodb:PutItem` のみに制限

  

メールアドレスや問い合わせ本文全文などの個人情報はCloudWatch Logsに出力しない設計にしています。

  

34. 面接で説明するポイント

34.1 なぜLambdaを使うのか

問い合わせ処理は常時起動サーバーを必要としないため、API Gateway + Lambdaのサーバーレス構成を採用しました。

アクセスが少ない段階では低コストで、EC2のようなサーバー管理も不要です。

34.2 なぜVPCに入れないのか

MVPではDynamoDBに保存するだけで、RDSやVPC内リソースにアクセスする必要がありません。

VPCに入れるとNAT Gatewayなどが必要になる可能性があり、コストと構成が複雑になるため、VPC外Lambdaにしています。

34.3 どうやってセキュリティを確保しているか

フロントエンドだけでなくLambda側でも入力値検証を行っています。

IAM RoleはDynamoDBの対象テーブルへのPutItemのみに制限し、CloudWatch Logsにはメールアドレスや本文全文を出さないようにしています。

34.4 どうやって課金事故を防ぐか

Lambdaのタイムアウトを短くし、メモリも小さめから開始します。

問い合わせフォームにはhoneypotと文字数制限を入れ、Botによる大量投稿を抑えます。

また、AWS BudgetsとCloudWatch Logs保存期間設定で課金事故を防ぎます。

  

35. 結論

MVPで実装するLambdaは、問い合わせフォーム用の contact-submit-function のみとする。

このLambdaは、API Gatewayの POST /contact から呼び出され、以下を行う。

JSONパース

honeypot確認

入力値検証

contactId生成

createdAt生成

DynamoDB ContactsTableProdへPutItem

CloudWatch Logsへ最小限ログ出力

共通レスポンス返却

この実装により、以下を実現できる。

- AWSサーバーレス実装経験を示せる
- API Gateway + Lambda + DynamoDBの基本構成を理解できる
- 問い合わせフォームという実用機能を提供できる
- EC2やRDSを使わず低コストにできる
- IAM最小権限、CORS、入力値検証、ログ制御を説明できる

最初に実装すべきバックエンドは、これだけで十分である。

Phase 2以降で問題取得API、Phase 4以降で回答履歴・学習進捗APIを追加する。