AWS資格学習サイト インフラ構築手順書

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト インフラ構築手順書|
|対象プロダクト|AWS資格ロードマップラボ|
|対象フェーズ|Phase 1 静的サイト公開 / Phase 2 問い合わせAPI追加 / Phase 3 収益化準備 / Phase 4 学習アプリ化|
|目的|AWS上に低コスト・安全・拡張可能な学習サイト基盤を構築する手順を定義する|
|想定作業者|開発者本人|
|基本リージョン|ap-northeast-1 / 東京リージョン|
|例外リージョン|CloudFront用ACM証明書は us-east-1 / バージニア北部|

  

2. 本手順書の目的

本手順書では、AWS資格学習サイト「AWS資格ロードマップラボ」をAWS上に構築するための具体的な手順を定義する。

MVPでは以下を構築対象とする。

S3 + CloudFront 静的サイト配信

API Gateway + Lambda + DynamoDB 問い合わせAPI

CloudWatch Logs ログ確認

IAM 最小権限

AWS Budgets 課金監視

初期段階では、以下は構築しない。

EC2

RDS

NAT Gateway

ALB

ECS

EKS

OpenSearch

SageMaker

WAF

Cognito

SES

理由は、MVPではコストを抑えて公開実績を作ることを最優先にするためである。

  

3. 全体構築フロー

3.1 MVP構築順序

1. AWSアカウント初期安全設定

2. AWS Budgets設定

3. S3バケット作成

4. フロントエンド静的ファイル作成

5. S3へ静的ファイルアップロード

6. CloudFront Distribution作成

7. CloudFront OAC設定

8. S3 Bucket Policy設定

9. CloudFront経由でサイト表示確認

10. DynamoDB ContactsTable作成

11. Lambda contact-submit-function作成

12. Lambda IAM Role設定

13. API Gateway HTTP API作成

14. API GatewayとLambda接続

15. CORS設定

16. 問い合わせAPI動作確認

17. CloudWatch Logs確認

18. GitHub Actionsデプロイ設定

19. READMEに構成図・設計意図を記載

20. 不要リソース確認

3.2 MVP完成時の構成

ユーザー

  ↓ HTTPS

CloudFront

  ↓ OAC

S3 静的サイト

  

ユーザー

  ↓ POST /contact

API Gateway HTTP API

  ↓

Lambda contact-submit-function

  ↓

DynamoDB ContactsTable

  ↓

CloudWatch Logs

  

4. 前提条件

4.1 必要なもの

|   |   |
|---|---|
|項目|内容|
|AWSアカウント|個人AWSアカウント|
|GitHubアカウント|ソースコード管理用|
|ローカル開発環境|Node.js、Python、Git、VS Code|
|フロントエンド|Next.js / TypeScript想定|
|バックエンド|Lambda Python想定|
|決済手段|AWSアカウント作成時に登録済みのカード|

4.2 ローカル推奨環境

|   |   |
|---|---|
|項目|推奨|
|Node.js|LTS版|
|Python|3.11以上|
|パッケージ管理|pnpm または npm|
|Git|最新安定版|
|エディタ|VS Code|
|AWS CLI|任意。最初はコンソール操作でも可|

4.3 リージョン方針

|   |   |
|---|---|
|用途|リージョン|
|S3|ap-northeast-1|
|Lambda|ap-northeast-1|
|DynamoDB|ap-northeast-1|
|API Gateway|ap-northeast-1|
|CloudWatch Logs|ap-northeast-1|
|CloudFront|グローバルサービス|
|ACM CloudFront用|us-east-1|

  

5. 命名規則

5.1 リソース命名方針

プロジェクト名は以下を基本とする。

aws-cert-roadmap-lab

5.2 MVPリソース名

|   |   |
|---|---|
|リソース|名前例|
|S3 Bucket|aws-cert-roadmap-lab-prod|
|CloudFront Distribution|aws-cert-roadmap-lab-prod-cf|
|DynamoDB Table|ContactsTableProd|
|Lambda Function|contact-submit-prod|
|Lambda Role|lambda-contact-submit-role-prod|
|API Gateway|aws-cert-roadmap-lab-api-prod|
|Budget|aws-cert-roadmap-lab-monthly-budget|
|GitHub Actions Role|github-actions-deploy-role-prod|

5.3 注意点

S3バケット名はグローバルで一意である必要がある。

そのため、実際には以下のようにユーザー名や日付を含めてもよい。

aws-cert-roadmap-lab-prod-vincent-2026

  

6. Step 0：AWSアカウント初期安全設定

6.1 rootユーザーMFA設定

目的

AWSアカウント乗っ取りを防ぐ。

手順

1. AWS Management Consoleにrootユーザーでログイン

2. 右上のアカウント名をクリック

3. Security credentialsを開く

4. Multi-factor authentication / MFAを選択

5. MFA deviceを割り当てる

6. 認証アプリでQRコードを読み取る

7. 連続するMFAコードを入力して有効化する

完了条件

|   |   |
|---|---|
|条件|確認|
|rootユーザーにMFAが設定されている|必須|
|rootアクセスキーが存在しない|必須|

6.2 管理用IAMユーザー作成

目的

rootユーザーを日常利用しないようにする。

手順

1. IAMコンソールを開く

2. Usersを選択

3. Create userを選択

4. ユーザー名を入力

5. Management Console accessを有効化

6. 必要な権限を付与

7. MFAを設定

8. rootユーザーからログアウトし、IAMユーザーでログイン確認

初期学習時の注意

学習初期はAdministratorAccessを一時的に使うこともあるが、長期的には最小権限へ分離する。

ポートフォリオ用には以下を分ける。

管理者用IAMユーザー

Lambda実行ロール

GitHub Actionsデプロイロール

  

7. Step 1：AWS Budgets設定

7.1 目的

課金事故を防ぐ。

このプロジェクトではAWS Budgetsを最初に設定する。

7.2 予算設定方針

|   |   |
|---|---|
|項目|値|
|Budget type|Cost budget|
|Period|Monthly|
|Budget amount|初期は 1 USD または低額|
|Scope|All AWS services|
|Alert threshold|50%、80%、100%、Forecasted 100%|
|Notification|メール|

7.3 コンソール手順

1. AWS Billing and Cost Managementを開く

2. 左メニューからBudgetsを選択

3. Create budgetを選択

4. Cost budgetを選択

5. Monthlyを選択

6. 予算名を入力

   例：aws-cert-roadmap-lab-monthly-budget

7. 予算額を入力

   例：1 USD

8. Alert thresholdを設定

   - Actual 50%

   - Actual 80%

   - Actual 100%

   - Forecasted 100%

9. 通知先メールアドレスを入力

10. 作成する

7.4 完了条件

|   |   |
|---|---|
|条件|確認|
|Monthly Cost Budgetが作成されている|必須|
|通知先メールが設定されている|必須|
|予測超過通知が設定されている|推奨|

  

8. Step 2：S3バケット作成

8.1 目的

静的サイトのビルド成果物を保存する。

8.2 設定方針

|   |   |
|---|---|
|項目|設定|
|Region|ap-northeast-1|
|Bucket name|aws-cert-roadmap-lab-prod-任意の一意名|
|Public Access|すべてブロック|
|Versioning|MVPでは任意。初期は無効でも可|
|Encryption|SSE-S3で可|
|Static website hosting|原則使わない|

重要：CloudFront OACを使うため、S3静的Webサイトホスティングのエンドポイントではなく、通常のS3オリジンとしてCloudFrontに接続する。

8.3 コンソール手順

1. S3コンソールを開く

2. Create bucketを選択

3. Bucket nameを入力

   例：aws-cert-roadmap-lab-prod-vincent-2026

4. AWS Regionでap-northeast-1を選択

5. Block all public accessをONのままにする

6. Bucket Versioningは初期はDisableでよい

7. Default encryptionはSSE-S3を選択

8. Create bucketをクリック

8.4 完了条件

|   |   |
|---|---|
|条件|確認|
|S3バケットが作成されている|必須|
|Block all public accessが有効|必須|
|Static website hostingを有効化していない|推奨|
|バケット名を記録した|必須|

  

9. Step 3：フロントエンド静的ファイル作成

9.1 目的

S3へアップロードする静的ファイルを作成する。

9.2 Next.js想定設定

next.config.js または next.config.mjs に静的エクスポート設定を行う。

const nextConfig = {

  output: 'export',

  images: {

    unoptimized: true,

  },

};

  

export default nextConfig;

9.3 ビルドコマンド例

pnpmの場合：

pnpm install

pnpm build

npmの場合：

npm install

npm run build

静的エクスポート後の出力先は通常以下になる。

out/

9.4 最初の最小ページ

最初の確認用として、以下だけでもよい。

/

/about

/privacy

/terms

/questions

/contact

9.5 完了条件

|   |   |
|---|---|
|条件|確認|
|ビルドが成功する|必須|
|out/ ディレクトリが生成される|必須|
|index.htmlが存在する|必須|
|画像ファイルが大きすぎない|推奨|

  

10. Step 4：S3へ静的ファイルアップロード

10.1 コンソール手順

1. S3コンソールで対象バケットを開く

2. Objectsタブを開く

3. Uploadを選択

4. out/ 配下のファイルとフォルダをアップロード

5. Upload完了を確認

10.2 AWS CLIを使う場合

aws s3 sync ./out s3://aws-cert-roadmap-lab-prod-vincent-2026 --delete

10.3 注意点

S3バケットは非公開のため、S3オブジェクトURLに直接アクセスしても表示できないのが正しい。

10.4 完了条件

|   |   |
|---|---|
|条件|確認|
|S3にindex.htmlがアップロードされている|必須|
|assetsや画像もアップロードされている|必須|
|S3直接URLでアクセスできない|必須|

  

11. Step 5：CloudFront Distribution作成

11.1 目的

S3に配置した静的サイトをHTTPSで配信する。

11.2 設定方針

|   |   |
|---|---|
|項目|設定|
|Origin|S3 bucket|
|Origin access|Origin Access Control / OAC|
|Viewer protocol policy|Redirect HTTP to HTTPS|
|Allowed HTTP methods|GET, HEAD|
|Default root object|index.html|
|Web Application Firewall|MVPでは無効|
|Price class|初期は低コスト優先で範囲を限定してもよい|

11.3 コンソール手順

1. CloudFrontコンソールを開く

2. Create distributionを選択

3. Origin domainで作成したS3バケットを選択

4. Origin accessでOrigin access control settingsを選択

5. Create new OACを選択

6. OAC名を入力

   例：aws-cert-roadmap-lab-oac-prod

7. Viewer protocol policyでRedirect HTTP to HTTPSを選択

8. Allowed HTTP methodsはGET, HEADを選択

9. Default root objectにindex.htmlを入力

10. WAFは初期では無効

11. Create distributionを実行

11.4 作成後に記録する値

|   |   |
|---|---|
|値|用途|
|Distribution ID|Invalidation、Bucket Policy、GitHub Actions|
|Distribution domain name|動作確認URL|
|OAC ID|S3アクセス制御|

  

12. Step 6：S3 Bucket Policy設定

12.1 目的

CloudFront DistributionからのみS3オブジェクトを取得できるようにする。

12.2 Bucket Policy例

以下の値を置換する。

<bucket-name>

<account-id>

<distribution-id>

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

      "Resource": "arn:aws:s3:::<bucket-name>/*",

      "Condition": {

        "StringEquals": {

          "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

        }

      }

    }

  ]

}

12.3 コンソール手順

1. S3コンソールを開く

2. 対象バケットを選択

3. Permissionsタブを開く

4. Bucket policyを編集

5. 上記ポリシーを貼り付ける

6. bucket-name / account-id / distribution-idを置換

7. Save changesをクリック

12.4 完了条件

|   |   |
|---|---|
|条件|確認|
|Bucket Policyが設定されている|必須|
|Principalがcloudfront.amazonaws.comになっている|必須|
|SourceArnが対象Distributionに限定されている|必須|
|S3直接アクセスは拒否される|必須|
|CloudFront経由では表示できる|必須|

  

13. Step 7：CloudFront表示確認

13.1 確認手順

1. CloudFront DistributionのDeploy完了を待つ

2. Distribution domain nameをコピー

   例：https://xxxxxxxx.cloudfront.net

3. ブラウザでアクセスする

4. トップページが表示されることを確認

5. /terms や /about などのページも確認

6. HTTPアクセス時にHTTPSへリダイレクトされることを確認

13.2 確認項目

|   |   |
|---|---|
|項目|期待結果|
|CloudFront URL|表示できる|
|HTTPアクセス|HTTPSへリダイレクト|
|S3直接URL|Access Denied|
|画像|表示される|
|CSS|適用される|
|JS|動作する|

13.3 よくあるエラー

|   |   |   |
|---|---|---|
|エラー|原因|対応|
|Access Denied|Bucket Policy未設定、OAC不一致|Bucket Policyを確認|
|403|S3アクセス許可不足|SourceArn、OACを確認|
|404|ファイル未アップロード|out/ の中身を確認|
|CSSが当たらない|assets未アップロード|S3 syncを確認|
|ページ遷移で404|静的エクスポート設定・CloudFrontエラーページ確認|Next.js設定を確認|

  

14. Step 8：CloudFrontエラーページ設定

14.1 目的

静的サイトでルーティングや404ページを適切に扱う。

14.2 基本方針

Next.js静的エクスポートで各パスにHTMLが生成されている場合、特別なSPAリライトは不要なことが多い。

ただし、存在しないURLにアクセスされた場合は404ページを表示する。

14.3 設定候補

|   |   |   |
|---|---|---|
|HTTP Error Code|Response Page Path|HTTP Response Code|
|403|/404.html|404|
|404|/404.html|404|

14.4 注意点

SPAのようにすべて /index.html へ返す設定も可能だが、SEOサイトでは存在しないページを200で返すのは避けた方がよい。

本プロダクトはSEOメディアでもあるため、原則として404は404として返す。

  

15. Step 9：DynamoDB ContactsTable作成

15.1 目的

問い合わせフォームの送信内容を保存する。

15.2 テーブル設計

|   |   |
|---|---|
|項目|値|
|Table name|ContactsTableProd|
|Partition key|contactId|
|Sort key|なし|
|Billing mode|On-demand推奨|
|Encryption|AWS owned key または AWS managed key|
|PITR|MVPでは任意|
|Streams|無効|

15.3 コンソール手順

1. DynamoDBコンソールを開く

2. Tablesを選択

3. Create tableを選択

4. Table nameにContactsTableProdを入力

5. Partition keyにcontactIdを入力

6. TypeはString

7. Table settingsはCustomizeまたはDefault

8. Billing modeはOn-demandを選択

9. Create tableをクリック

15.4 完了条件

|   |   |
|---|---|
|条件|確認|
|ContactsTableProdが作成されている|必須|
|Partition keyがcontactId|必須|
|On-demandになっている|推奨|
|Streamsが無効|推奨|

  

16. Step 10：Lambda実行ロール作成

16.1 目的

問い合わせLambdaがDynamoDBに問い合わせデータを書き込めるようにする。

16.2 権限方針

Lambdaには以下のみ許可する。

DynamoDB ContactsTableProdへのPutItem

CloudWatch Logsへのログ出力

16.3 IAM Role作成手順

1. IAMコンソールを開く

2. Rolesを選択

3. Create roleを選択

4. Trusted entity typeでAWS serviceを選択

5. Use caseでLambdaを選択

6. Role名を入力

   例：lambda-contact-submit-role-prod

7. いったん作成する

8. 後でインラインポリシーを追加する

16.4 インラインポリシー例

<account-id> を置換する。

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Sid": "AllowPutItemToContactsTable",

      "Effect": "Allow",

      "Action": [

        "dynamodb:PutItem"

      ],

      "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTableProd"

    },

    {

      "Sid": "AllowWriteLogs",

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

16.5 完了条件

|   |   |
|---|---|
|条件|確認|
|Lambda用Roleが作成されている|必須|
|ContactsTableProdへのPutItemのみ許可|必須|
|CloudWatch Logs出力権限がある|必須|
|AdministratorAccessを付けていない|必須|

  

17. Step 11：Lambda contact-submit-function作成

17.1 目的

問い合わせAPIの処理を実行する。

17.2 設定方針

|   |   |
|---|---|
|項目|値|
|Function name|contact-submit-prod|
|Runtime|Python 3.11以上|
|Architecture|x86_64 または arm64|
|Execution role|lambda-contact-submit-role-prod|
|Memory|128MB〜256MB|
|Timeout|3〜5秒|
|VPC|接続しない|

17.3 コンソール手順

1. Lambdaコンソールを開く

2. Create functionを選択

3. Author from scratchを選択

4. Function nameにcontact-submit-prodを入力

5. RuntimeでPython 3.11以上を選択

6. Change default execution roleを開く

7. Use an existing roleを選択

8. lambda-contact-submit-role-prodを選択

9. Create functionをクリック

17.4 環境変数

|   |   |
|---|---|
|Key|Value|
|CONTACTS_TABLE_NAME|ContactsTableProd|
|ALLOWED_ORIGIN|CloudFront URLまたは独自ドメイン|
|LOG_LEVEL|INFO|

17.5 最小Lambdaコード例

実装詳細は後続のLambda実装設計書で定義するが、動作確認用の最小イメージは以下。

import json

import os

import uuid

from datetime import datetime, timezone, timedelta

import boto3

  

  

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table(os.environ["CONTACTS_TABLE_NAME"])

  

JST = timezone(timedelta(hours=9))

  

  

def response(status_code, body):

    return {

        "statusCode": status_code,

        "headers": {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN", "*"),

            "Access-Control-Allow-Headers": "Content-Type,Authorization",

            "Access-Control-Allow-Methods": "POST,OPTIONS"

        },

        "body": json.dumps(body, ensure_ascii=False)

    }

  

  

def lambda_handler(event, context):

    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":

        return response(200, {"success": True})

  

    try:

        body = json.loads(event.get("body") or "{}")

    except json.JSONDecodeError:

        return response(400, {

            "success": False,

            "error": {"code": "INVALID_JSON", "message": "JSON形式が不正です。"}

        })

  

    honeypot = body.get("honeypot", "")

    if honeypot:

        return response(201, {

            "success": True,

            "data": {"contactId": None, "status": "accepted"},

            "message": "お問い合わせを受け付けました。"

        })

  

    errors = []

    name = str(body.get("name", "")).strip()

    email = str(body.get("email", "")).strip()

    subject = str(body.get("subject", "")).strip()

    message = str(body.get("message", "")).strip()

    source_page = str(body.get("sourcePage", "")).strip()

  

    if not name or len(name) > 100:

        errors.append({"field": "name", "message": "名前を100文字以内で入力してください。"})

    if not email or "@" not in email or len(email) > 255:

        errors.append({"field": "email", "message": "正しいメールアドレスを入力してください。"})

    if not subject or len(subject) > 150:

        errors.append({"field": "subject", "message": "件名を150文字以内で入力してください。"})

    if not message or len(message) > 2000:

        errors.append({"field": "message", "message": "本文を2000文字以内で入力してください。"})

  

    if errors:

        return response(400, {

            "success": False,

            "error": {

                "code": "VALIDATION_ERROR",

                "message": "入力内容に誤りがあります。",

                "details": errors

            }

        })

  

    contact_id = f"contact-{uuid.uuid4()}"

    created_at = datetime.now(JST).isoformat()

  

    item = {

        "contactId": contact_id,

        "createdAt": created_at,

        "name": name,

        "email": email,

        "subject": subject,

        "message": message,

        "sourcePage": source_page,

        "status": "new"

    }

  

    table.put_item(Item=item)

    print(f"INFO contact saved contactId={contact_id}")

  

    return response(201, {

        "success": True,

        "data": {"contactId": contact_id, "status": "new"},

        "message": "お問い合わせを受け付けました。"

    })

17.6 注意点

上記コードは最小確認用である。

本番品質では以下を改善する。

メール形式バリデーション強化

requestId付与

エラー処理強化

CORS Origin動的判定

ログ出力制御

ユニットテスト

  

18. Step 12：CloudWatch Logs保存期間設定

18.1 目的

ログ蓄積による課金を防ぐ。

18.2 手順

1. CloudWatchコンソールを開く

2. Logs > Log groupsを選択

3. /aws/lambda/contact-submit-prod を開く

4. Retention settingsを選択

5. 14 days または 30 days を選択

6. 保存

18.3 完了条件

|   |   |
|---|---|
|条件|確認|
|Lambdaロググループが存在する|必須|
|RetentionがNever expireではない|必須|
|14日〜30日に設定されている|推奨|

  

19. Step 13：API Gateway HTTP API作成

19.1 目的

問い合わせLambdaをHTTP APIとして公開する。

19.2 設定方針

|   |   |
|---|---|
|項目|値|
|API type|HTTP API|
|API name|aws-cert-roadmap-lab-api-prod|
|Route|POST /contact|
|Integration|Lambda contact-submit-prod|
|CORS|CloudFrontドメインのみ許可|
|Auth|MVPではなし|

19.3 コンソール手順

1. API Gatewayコンソールを開く

2. Create APIを選択

3. HTTP APIを選択

4. Add integrationでLambdaを選択

5. contact-submit-prodを選択

6. API nameにaws-cert-roadmap-lab-api-prodを入力

7. Routeを追加

   Method: POST

   Path: /contact

8. Stageを作成

   例：$default または prod

9. APIを作成

19.4 CORS設定

Allowed origins:

  https://xxxxxxxx.cloudfront.net

  独自ドメイン導入後：https://example.com

  

Allowed methods:

  POST

  OPTIONS

  

Allowed headers:

  Content-Type

  Authorization

開発時のみ以下を許可してもよい。

http://localhost:3000

本番ではlocalhostを削除する。

19.5 Lambda Invoke権限

API Gateway作成時に、Lambdaを呼び出す権限が自動付与されることが多い。

動作しない場合はLambdaのResource-based policyを確認する。

19.6 完了条件

|   |   |
|---|---|
|条件|確認|
|HTTP APIが作成されている|必須|
|POST /contact routeが存在する|必須|
|Lambda統合されている|必須|
|CORSが設定されている|必須|
|Invoke URLを記録した|必須|

  

20. Step 14：問い合わせAPI動作確認

20.1 curlで確認

<api-url> をAPI GatewayのInvoke URLに置き換える。

curl -X POST "<api-url>/contact" \

  -H "Content-Type: application/json" \

  -d '{

    "name": "テスト太郎",

    "email": "test@example.com",

    "subject": "テスト問い合わせ",

    "message": "これはテストです。",

    "sourcePage": "/contact",

    "honeypot": ""

  }'

20.2 期待レスポンス

{

  "success": true,

  "data": {

    "contactId": "contact-xxxxxxxx",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。"

}

20.3 DynamoDB確認

1. DynamoDBコンソールを開く

2. ContactsTableProdを開く

3. Explore table itemsを開く

4. contactId付きのデータが保存されているか確認

20.4 CloudWatch Logs確認

1. CloudWatch Logsを開く

2. /aws/lambda/contact-submit-prod を開く

3. 最新ログストリームを開く

4. INFO contact saved contactId=... が出ているか確認

5. メールアドレスや本文全文がログに出ていないか確認

20.5 異常系テスト

|   |   |
|---|---|
|テスト|期待結果|
|emailなし|400|
|email形式不正|400|
|message空|400|
|message 2,000文字超過|400|
|honeypotに値あり|201扱い、DynamoDB保存なし|

  

21. Step 15：フロントエンド問い合わせフォーム接続

21.1 環境変数設定

フロントエンドにAPI URLを設定する。

NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

21.2 フロントエンド処理方針

1. フォーム入力

2. フロント側バリデーション

3. POST /contact 呼び出し

4. 成功時に完了メッセージ表示

5. 失敗時にエラーメッセージ表示

21.3 CORS確認

CloudFront上のサイトから問い合わせ送信できるか確認する。

|   |   |
|---|---|
|状況|確認|
|localhostから送信|開発時のみ成功|
|CloudFront URLから送信|成功|
|許可外Originから送信|ブラウザでCORSエラー|

  

22. Step 16：GitHub Actionsデプロイ設定

22.1 目的

mainブランチにpushしたら、自動でS3へデプロイし、CloudFrontキャッシュを無効化する。

22.2 推奨方針

最初は手動デプロイでもよい。

ただし、ポートフォリオ価値を高めるため、GitHub Actionsを導入する。

22.3 GitHub Actions用IAM権限

必要な権限は以下。

s3:PutObject

s3:DeleteObject

s3:ListBucket

cloudfront:CreateInvalidation

22.4 GitHub Secrets

|   |   |
|---|---|
|Secret名|内容|
|AWS_ACCESS_KEY_ID|デプロイ用アクセスキー。OIDC化前のみ|
|AWS_SECRET_ACCESS_KEY|デプロイ用シークレット。OIDC化前のみ|
|AWS_REGION|ap-northeast-1|
|S3_BUCKET_NAME|S3バケット名|
|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|

可能なら、長期アクセスキーではなくGitHub OIDCを利用する。

22.5 workflow例

.github/workflows/deploy.yml

name: Deploy Frontend

  

on:

  push:

    branches:

      - main

  

jobs:

  deploy:

    runs-on: ubuntu-latest

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

  

      - name: Install dependencies

        working-directory: frontend

        run: npm ci

  

      - name: Build

        working-directory: frontend

        run: npm run build

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}

          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

          aws-region: ${{ secrets.AWS_REGION }}

  

      - name: Deploy to S3

        working-directory: frontend

        run: |

          aws s3 sync ./out s3://${{ secrets.S3_BUCKET_NAME }} --delete

  

      - name: Invalidate CloudFront

        run: |

          aws cloudfront create-invalidation \

            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

            --paths "/*"

22.6 コスト注意点

/* のInvalidationを頻繁に実行しすぎない。

MVPではデプロイ頻度が低いため許容できるが、本格運用では変更ファイルだけ無効化する、またはファイル名にhashを付ける方針にする。

  

23. Step 17：独自ドメイン導入 Phase 3

23.1 導入タイミング

MVPでは不要。

以下のタイミングで導入を検討する。

記事が10〜20本になった

AdSense申請を考え始めた

ポートフォリオとして見栄えを上げたい

長期運用する意思が固まった

23.2 利用サービス

|   |   |
|---|---|
|サービス|用途|
|Route 53|DNS管理|
|ACM|SSL/TLS証明書|
|CloudFront|独自ドメイン配信|

23.3 ACM証明書作成手順

重要：CloudFront用のACM証明書は us-east-1 で作成する。

1. AWSコンソール右上のリージョンをus-east-1に変更

2. ACMを開く

3. Request certificateを選択

4. Public certificateを選択

5. ドメイン名を入力

   例：example.com

   例：www.example.com

6. DNS validationを選択

7. 証明書をリクエスト

8. Route 53で検証用CNAMEを作成

9. StatusがIssuedになるまで待つ

23.4 CloudFrontに独自ドメインを設定

1. CloudFront Distributionを開く

2. GeneralタブでEditまたはAdd alternate domain nameを選択

3. Alternate domain nameにドメインを追加

4. Custom SSL certificateでACM証明書を選択

5. 保存

23.5 Route 53レコード設定

1. Route 53 Hosted Zoneを開く

2. Create recordを選択

3. Aレコードを作成

4. Aliasを有効化

5. Alias targetにCloudFront Distributionを選択

6. 保存

23.6 完了条件

|   |   |
|---|---|
|条件|確認|
|独自ドメインでアクセスできる|必須|
|HTTPSでアクセスできる|必須|
|HTTPがHTTPSへリダイレクトされる|必須|
|CloudFrontデフォルトドメインも必要に応じて動作|任意|

  

24. Step 18：Search Console / Analytics / AdSense準備 Phase 3

24.1 事前に必要なページ

AdSenseやSEO運用を考える場合、以下を用意する。

|   |   |
|---|---|
|ページ|必須度|
|運営者情報|高|
|問い合わせ|高|
|プライバシーポリシー|高|
|免責事項|高|
|記事20本程度|推奨|
|サイトマップ|推奨|
|robots.txt|推奨|

24.2 Google Search Console

1. Google Search Consoleを開く

2. プロパティを追加

3. ドメインまたはURLプレフィックスを選択

4. 所有権確認を行う

5. sitemap.xmlを送信

6. インデックス状況を確認

24.3 Google Analytics

1. Google Analyticsでプロパティ作成

2. 測定IDを取得

3. フロントエンドに設置

4. プライバシーポリシーにアクセス解析利用を記載

24.4 Google AdSense

1. AdSenseにサイトを追加

2. 審査コードをサイトに設置

3. プライバシーポリシーを確認

4. 独自性のある記事を用意

5. 審査申請

24.5 注意点

広告やAnalyticsタグを入れる場合、CSPを設定しているなら許可先の見直しが必要。

  

25. Step 19：Cognito導入 Phase 4

25.1 導入タイミング

CognitoはMVPでは導入しない。

以下を実装する段階で導入する。

ログイン

マイページ

学習履歴

正答率

復習問題

弱点分析

有料機能

25.2 構成

Frontend

  ↓ Login / Signup

Cognito User Pool

  ↓ JWT

API Gateway JWT Authorizer

  ↓

Lambda

  ↓

DynamoDB UserAnswersTable / UserProgressTable

25.3 重要ルール

リクエストBodyのuserIdを信用しない。

必ずCognito JWTのsubをuserIdとして使う。

25.4 導入手順概要

1. Cognito User Pool作成

2. App client作成

3. メールログイン設定

4. フロントエンドにAmplifyまたはCognito SDK導入

5. API GatewayにJWT Authorizer設定

6. 認証付きAPIを追加

7. UserProfileTable作成

8. UserAnswersTable作成

9. UserProgressTable作成

詳細はPhase 4で別途作成する。

  

26. Step 20：不要リソース確認

26.1 確認対象

MVP構築後、以下が作成されていないか確認する。

|   |   |
|---|---|
|リソース|状態|
|EC2|作成されていないこと|
|RDS|作成されていないこと|
|NAT Gateway|作成されていないこと|
|ALB|作成されていないこと|
|Elastic IP|作成されていないこと|
|EBS Volume|不要なものがないこと|
|OpenSearch|作成されていないこと|
|SageMaker|作成されていないこと|
|WAF|MVPでは作成されていないこと|

26.2 全リージョン確認

AWSコンソールでは、リージョンごとにリソースが分かれる。

以下を確認する。

ap-northeast-1

us-east-1

その他、誤って触ったリージョン

26.3 請求確認

1. Billing Dashboardを開く

2. 当月利用額を確認

3. Cost Explorerでサービス別費用を確認

4. 想定外のサービスがないか確認

  

5. 動作確認チェックリスト

27.1 静的サイト

|   |   |
|---|---|
|チェック|期待結果|
|CloudFront URLでトップページ表示|成功|
|/termsが表示される|成功|
|/questionsが表示される|成功|
|/contactが表示される|成功|
|CSSが適用される|成功|
|画像が表示される|成功|
|HTTPがHTTPSへリダイレクトされる|成功|
|S3直接URLが拒否される|成功|

27.2 問い合わせAPI

|   |   |
|---|---|
|チェック|期待結果|
|正常フォーム送信|201|
|DynamoDBに保存|成功|
|CloudWatch Logs出力|成功|
|email不正|400|
|message空|400|
|honeypot入力|保存せず成功扱い|
|許可外Origin|CORSエラー|

27.3 コスト・セキュリティ

|   |   |
|---|---|
|チェック|期待結果|
|AWS Budgets設定済み|成功|
|CloudWatch Logs保存期間設定済み|成功|
|Lambda Roleが最小権限|成功|
|GitHubに.envがない|成功|
|不要リソースなし|成功|

  

28. トラブルシューティング

28.1 CloudFrontでAccess Denied

|   |   |
|---|---|
|原因|対応|
|S3 Bucket Policy未設定|CloudFront Distribution ARNを許可する|
|OAC未設定|CloudFront Origin設定を確認|
|Distribution ID誤り|Bucket PolicyのSourceArnを確認|
|ファイル未アップロード|S3内のindex.htmlを確認|

28.2 CSSやJSが読み込まれない

|   |   |
|---|---|
|原因|対応|
|assets未アップロード|S3 sync対象を確認|
|パス設定ミス|Next.jsの出力設定を確認|
|CloudFrontキャッシュ|Invalidation実行|

28.3 問い合わせAPIがCORSエラー

|   |   |
|---|---|
|原因|対応|
|Origin未許可|API Gateway CORSにCloudFront URLを追加|
|OPTIONS未対応|API Gateway CORS設定を確認|
|Lambda側ヘッダー不足|Access-Control-Allow-Originを確認|

28.4 LambdaがDynamoDBに保存できない

|   |   |
|---|---|
|原因|対応|
|IAM権限不足|dynamodb:PutItemを確認|
|テーブル名誤り|環境変数CONTACTS_TABLE_NAMEを確認|
|リージョン違い|LambdaとDynamoDBのリージョンを確認|
|JSON不正|Lambdaログを確認|

28.5 AWS料金が発生している

|   |   |
|---|---|
|原因|対応|
|不要リソース作成|Cost Explorerで特定して削除|
|CloudWatch Logs肥大化|保存期間設定|
|API大量アクセス|API Gatewayメトリクス確認|
|NAT Gateway誤作成|即削除|
|RDS誤作成|即削除|

  

29. 削除手順

29.1 一時停止・削除したい場合

課金を止めたい場合は、以下を削除する。

1. CloudFront DistributionをDisable

2. CloudFront DistributionをDelete

3. S3バケット内オブジェクト削除

4. S3バケット削除

5. API Gateway削除

6. Lambda削除

7. DynamoDB ContactsTable削除

8. CloudWatch Logs削除

9. IAM Role削除

10. Route 53 Hosted Zone削除 任意

11. ACM証明書削除 任意

29.2 注意点

CloudFrontはDisable後、削除可能になるまで時間がかかる。

S3バケットは中身が空でないと削除できない。

Route 53 Hosted Zoneやドメイン登録は削除・更新タイミングに注意する。

  

30. READMEに記載するインフラ概要

GitHub READMEには以下を記載する。

## AWS Architecture

  

This project uses a serverless architecture on AWS.

  

- Amazon S3: Static site hosting storage

- Amazon CloudFront: CDN and HTTPS delivery

- Origin Access Control: Restrict direct access to S3

- Amazon API Gateway: Contact form API endpoint

- AWS Lambda: Contact form processing

- Amazon DynamoDB: Contact data storage

- Amazon CloudWatch Logs: Lambda logs

- AWS Budgets: Cost monitoring

  

The project avoids always-on resources such as EC2, RDS, NAT Gateway, and ALB in the MVP phase to minimize cost.

日本語では以下。

## AWS構成

  

本プロジェクトは、AWSのサーバーレス構成で構築しています。

  

- Amazon S3：静的ファイル配置

- Amazon CloudFront：CDN配信・HTTPS配信

- Origin Access Control：S3直接公開の防止

- Amazon API Gateway：問い合わせAPIの公開

- AWS Lambda：問い合わせ保存処理

- Amazon DynamoDB：問い合わせデータ保存

- Amazon CloudWatch Logs：Lambdaログ確認

- AWS Budgets：課金監視

  

MVPでは、EC2、RDS、NAT Gateway、ALBなどの常時課金が発生しやすいサービスは使用せず、低コスト運用を重視しています。

  

31. 構築完了の定義

MVPインフラは、以下を満たしたら完了とする。

|   |   |
|---|---|
|ID|完了条件|
|INF-001|AWS Budgetsが設定されている|
|INF-002|S3バケットが作成され、Public Access Blockが有効である|
|INF-003|CloudFront Distributionが作成されている|
|INF-004|OACでCloudFrontからのみS3へアクセスできる|
|INF-005|CloudFront URLでサイトが表示される|
|INF-006|S3直接URLではアクセスできない|
|INF-007|DynamoDB ContactsTableProdが作成されている|
|INF-008|Lambda contact-submit-prodが作成されている|
|INF-009|Lambda実行ロールが最小権限である|
|INF-010|API Gateway POST /contactが作成されている|
|INF-011|問い合わせフォームからDynamoDBへ保存できる|
|INF-012|CloudWatch LogsでLambdaログを確認できる|
|INF-013|CloudWatch Logs保存期間が設定されている|
|INF-014|GitHubに秘密情報が含まれていない|
|INF-015|EC2、RDS、NAT Gateway、ALBを使用していない|

  

32. 次に作成するドキュメント

本手順書の次に、以下を作成する。

1. Lambda実装設計書
2. CI/CD設計書
3. 運用監視設計書
4. 開発タスク一覧
5. GitHub README草案
6. MVP実装スケジュール
7. 初期コンテンツ作成テンプレート

  

8. 結論

本インフラ構築手順では、MVPを以下の構成で構築する。

S3 + CloudFront + OAC

API Gateway + Lambda + DynamoDB

CloudWatch Logs

IAM最小権限

AWS Budgets

この構成により、以下を実現する。

- AWS上で公開されたポートフォリオを作れる
- EC2やRDSを使わず、固定費を抑えられる
- S3を直接公開せず、CloudFront経由で安全に配信できる
- 問い合わせAPIでサーバーレス実装経験を示せる
- DynamoDB、Lambda、API Gateway、CloudWatch、IAMを実践できる
- AWS Budgetsで課金事故を防げる

最初に作るべき範囲は、静的サイト公開と問い合わせAPIまでで十分である。

Cognito、SES、EventBridge、独自ドメイン、AdSense対応は、MVP公開後に段階的に追加する。