AWS資格学習サイト 運用監視設計書

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト 運用監視設計書|
|対象プロダクト|AWS資格ロードマップラボ|
|対象フェーズ|MVP開発 〜 Phase 4 学習アプリ化|
|目的|AWS上で公開した学習サイトを低コストかつ安定的に運用するための監視・ログ・アラート・障害対応方針を定義する|
|対象サービス|S3 / CloudFront / API Gateway / Lambda / DynamoDB / CloudWatch / AWS Budgets / Cost Explorer / IAM / GitHub Actions|
|基本リージョン|ap-northeast-1 / 東京リージョン|

  

2. 本設計書の目的

本設計書では、AWS資格学習サイト「AWS資格ロードマップラボ」の運用監視方針を定義する。

本プロダクトは個人開発のポートフォリオであり、MVP段階では大規模な監視基盤を構築しない。

ただし、以下の観点は必ず押さえる。

1. サイトが表示できること
2. 問い合わせフォームが正常に動くこと
3. LambdaやAPI Gatewayでエラーが増えていないこと
4. DynamoDBに問い合わせが保存されていること
5. CloudWatch Logsに必要なログが出ていること
6. CloudWatch Logsに個人情報を出しすぎていないこと
7. AWS利用料が想定外に増えていないこと
8. 不要なAWSリソースが残っていないこと
9. GitHub Actionsのデプロイが成功していること
10. 障害時に原因調査と復旧ができること

MVPでは、監視機能を作り込みすぎず、以下を中心に運用する。

AWS Budgets

CloudWatch Logs

CloudWatch Metrics

GitHub Actions logs

AWS Billing / Cost Explorer

DynamoDB item確認

手動チェックリスト

CloudWatch Alarm、CloudWatch Dashboard、AWS WAF、CloudWatch Synthetics、X-Rayなどは、アクセス増加後またはPhase 2以降に段階的に導入する。

  

3. 運用監視の基本方針

3.1 基本方針

|   |   |
|---|---|
|方針|内容|
|低コスト優先|MVPでは監視サービスを増やしすぎない|
|重要箇所に絞る|サイト表示、問い合わせAPI、課金、ログを重点監視する|
|手動確認も許容|個人開発MVPでは毎日・週次の手動確認を活用する|
|Budgets必須|課金事故防止のため、AWS Budgetsを最優先で設定する|
|CloudWatch Logs保存期間を設定|ログを無期限保存しない|
|個人情報をログに出さない|email全文、問い合わせ本文全文、JWTなどは出力しない|
|アラームは段階導入|MVPでは最低限、Phase 2以降でCloudWatch Alarmを追加する|
|障害対応手順を持つ|何を確認するか、どう復旧するかを明文化する|
|ポートフォリオ説明性を重視|面接で運用設計を説明できる状態にする|

  

4. 監視対象範囲

4.1 MVP監視対象

|   |   |   |
|---|---|---|
|領域|対象|監視内容|
|Web配信|CloudFront|サイト表示、4xx/5xx、リクエスト数、転送量|
|静的ファイル|S3|ファイル存在、保存容量、オブジェクト数|
|API|API Gateway|POST /contact の呼び出し数、4xx/5xx、Latency|
|処理|Lambda|Invocations、Errors、Duration、Throttles、ログ|
|データ保存|DynamoDB|問い合わせ保存、書き込み数、スロットリング|
|ログ|CloudWatch Logs|Lambdaログ、保存期間、ログ量、個人情報出力有無|
|コスト|AWS Budgets / Cost Explorer|月額費用、予測超過、サービス別費用|
|デプロイ|GitHub Actions|CI/CD成功・失敗、デプロイ履歴|
|セキュリティ|IAM / CloudTrail任意|権限変更、不審な操作の確認|

4.2 Phase 3以降の監視対象

|   |   |   |
|---|---|---|
|領域|対象|監視内容|
|独自ドメイン|Route 53 / CloudFront / ACM|DNS、証明書、有効期限、HTTPS|
|SEO|Search Console|インデックス、検索流入、エラー|
|アクセス解析|Google Analytics|PV、流入、滞在、人気記事|
|広告|AdSense|収益、ポリシー違反、クリック異常|

4.3 Phase 4以降の監視対象

|   |   |   |
|---|---|---|
|領域|対象|監視内容|
|認証|Cognito|サインアップ、ログイン失敗、MAU|
|学習履歴|DynamoDB|UserAnswers / UserProgress の読み書き|
|通知|EventBridge / SES|定期実行、メール送信成功・失敗|
|ユーザー機能|API Gateway / Lambda|認証付きAPIの4xx/5xx、Latency|

  

5. MVP運用構成

5.1 MVP監視構成図

flowchart TD

    User[ユーザー]

    CF[CloudFront]

    S3[(S3)]

    APIGW[API Gateway]

    Lambda[AWS Lambda]

    DDB[(DynamoDB)]

    CWLogs[CloudWatch Logs]

    CWMetrics[CloudWatch Metrics]

    Budget[AWS Budgets]

    Cost[Cost Explorer / Billing]

    GH[GitHub Actions]

    Dev[開発者]

  

    User --> CF

    CF --> S3

    User --> APIGW

    APIGW --> Lambda

    Lambda --> DDB

    Lambda --> CWLogs

    CF --> CWMetrics

    APIGW --> CWMetrics

    Lambda --> CWMetrics

    DDB --> CWMetrics

    Budget -->|メール通知| Dev

    Cost --> Dev

    GH -->|CI/CD結果| Dev

    Dev --> CWLogs

    Dev --> CWMetrics

5.2 MVP監視の考え方

MVPでは、24時間365日の本格監視は行わない。

代わりに、以下を行う。

1. AWS Budgetsで課金異常を検知する

2. CloudWatch LogsでLambdaエラーを確認する

3. CloudWatch MetricsでAPI/Lambdaの実行回数とエラー数を見る

4. GitHub Actionsでデプロイ失敗を確認する

5. 毎日または週次でサイト表示と問い合わせフォームを手動確認する

  

6. 監視レベル定義

6.1 重要度分類

|   |   |   |
|---|---|---|
|重要度|内容|対応方針|
|Critical|サイト全体停止、課金急増、認証情報漏えい|即時対応|
|High|問い合わせAPI停止、Lambda連続エラー、DynamoDB保存失敗|当日対応|
|Medium|一部ページ表示崩れ、4xx増加、CI失敗|1〜2日以内に対応|
|Low|記事誤字、軽微なログ警告、SEO改善|通常タスクとして対応|

6.2 MVPでCritical扱いする事象

|   |   |
|---|---|
|事象|理由|
|AWS Budgets超過通知|課金事故の可能性がある|
|EC2/RDS/NAT Gateway等の想定外課金|不要サービスが作成されている可能性がある|
|CloudFrontでサイト全体が403/404|サイト公開不能|
|AWSアクセスキー漏えい疑い|不正利用リスクが高い|
|DynamoDBに大量スパム投稿|コスト増・運用妨害|

  

7. CloudFront監視設計

7.1 監視目的

CloudFrontは静的サイト配信の入口である。

以下を監視する。

- サイトにアクセスできるか
- 4xx / 5xx が増えていないか
- リクエスト数が急増していないか
- データ転送量が急増していないか
- キャッシュが効いているか

7.2 主要メトリクス

|   |   |   |
|---|---|---|
|メトリクス|内容|MVP確認頻度|
|Requests|リクエスト数|週次|
|BytesDownloaded|ユーザーへ転送したデータ量|週次|
|4xxErrorRate|4xxエラー率|週次 / 障害時|
|5xxErrorRate|5xxエラー率|週次 / 障害時|
|TotalErrorRate|全体エラー率|週次 / 障害時|

7.3 異常とみなす例

|   |   |
|---|---|
|状況|判断|
|5xxErrorRateが急増|CloudFrontまたはOrigin側の問題|
|4xxErrorRateが急増|存在しないURL、S3権限、Botアクセスの可能性|
|Requestsが通常の数倍|バズ、Bot、攻撃の可能性|
|BytesDownloadedが急増|画像肥大化、Bot、バズの可能性|

7.4 確認手順

1. CloudFrontコンソールを開く

2. 対象Distributionを選択

3. Monitoringタブを確認

4. Requests、4xx、5xx、BytesDownloadedを確認

5. 異常があればS3、CloudFront設定、直近デプロイを確認

7.5 MVPアラーム方針

MVPではCloudFrontアラームは必須にしない。

アクセスが増えたら以下を検討する。

|   |   |
|---|---|
|アラーム|条件案|
|CloudFront 5xx増加|5xxErrorRate > 1% が一定時間継続|
|CloudFront 4xx増加|4xxErrorRate > 10% が一定時間継続|
|Requests急増|通常時の数倍|

  

8. S3監視設計

8.1 監視目的

S3は静的ファイル保存先である。

以下を監視する。

- 必要なファイルが存在するか
- 保存容量が増えすぎていないか
- オブジェクト数が異常に増えていないか
- 直接公開されていないか

8.2 主要メトリクス

|   |   |   |
|---|---|---|
|メトリクス|内容|確認頻度|
|BucketSizeBytes|バケット容量|週次 / 月次|
|NumberOfObjects|オブジェクト数|週次 / 月次|

8.3 確認項目

|   |   |
|---|---|
|項目|期待状態|
|Public Access Block|有効|
|Bucket Policy|CloudFront Distributionのみ許可|
|大容量ファイル|置かない|
|動画ファイル|置かない|
|不要な古いビルドファイル|残さない|

8.4 確認手順

1. S3コンソールを開く

2. 対象バケットを開く

3. Objectsでファイル数・サイズを確認

4. PermissionsでPublic Access Blockを確認

5. Bucket PolicyでCloudFront OACのみ許可されているか確認

6. S3直接URLでアクセスできないことを確認

8.5 異常とみなす例

|   |   |
|---|---|
|状況|判断|
|バケット容量が急増|大容量画像・不要ファイルが増えた可能性|
|オブジェクト数が急増|デプロイ設定ミスの可能性|
|S3直接URLで表示できる|セキュリティ設定ミス|
|Public Access Blockが無効|即修正|

  

9. API Gateway監視設計

9.1 監視目的

API Gatewayは問い合わせAPIの入口である。

MVPでは POST /contact のみ監視対象とする。

9.2 主要メトリクス

|   |   |   |
|---|---|---|
|メトリクス|内容|確認頻度|
|Count|APIリクエスト数|週次 / 障害時|
|4xx|クライアントエラー数|週次 / 障害時|
|5xx|サーバーエラー数|週次 / 障害時|
|Latency|API応答時間|週次 / 障害時|
|IntegrationLatency|Lambda連携部分の応答時間|障害時|

9.3 異常とみなす例

|   |   |
|---|---|
|状況|判断|
|5xxが発生|LambdaまたはDynamoDB側の障害可能性|
|4xxが急増|バリデーションエラー、不正アクセス、Botの可能性|
|Countが急増|スパム投稿またはBotの可能性|
|Latencyが急増|Lambda処理遅延、DynamoDB遅延の可能性|

9.4 確認手順

1. API Gatewayコンソールを開く

2. 対象HTTP APIを選択

3. MonitorまたはCloudWatch Metricsを確認

4. Count / 4xx / 5xx / Latencyを見る

5. 5xxがあればLambda Logsを確認

6. Count急増があれば問い合わせスパムを疑う

9.5 MVPアラーム方針

MVPでは必須ではないが、Phase 2以降で以下を追加する。

|   |   |
|---|---|
|アラーム|条件案|
|API Gateway 5xx|5分間で1件以上|
|API Gateway Count急増|通常の数倍|
|API Gateway Latency|3秒以上が継続|

  

10. Lambda監視設計

10.1 監視目的

Lambdaは問い合わせ保存処理の中核である。

以下を監視する。

- Lambdaが呼び出されているか
- エラーが発生していないか
- 実行時間が長くなっていないか
- タイムアウトしていないか
- スロットリングが起きていないか
- ログに個人情報を出していないか

10.2 主要メトリクス

|   |   |   |
|---|---|---|
|メトリクス|内容|確認頻度|
|Invocations|実行回数|週次 / 障害時|
|Errors|エラー回数|週次 / 障害時|
|Duration|実行時間|週次 / 障害時|
|Throttles|スロットリング回数|障害時|
|ConcurrentExecutions|同時実行数|アクセス増加後|
|IteratorAge|ストリーム利用時のみ|MVP対象外|

10.3 MVP対象Lambda

|   |   |
|---|---|
|Lambda|目的|
|contact-submit-prod|問い合わせ保存|

10.4 異常とみなす例

|   |   |
|---|---|
|状況|判断|
|Errorsが1件以上|原因確認対象|
|Durationが3秒に近い|タイムアウトリスク|
|Throttlesが発生|同時実行制限または大量アクセス|
|Invocationsが急増|スパム・Botの可能性|
|Timeout発生|Lambda設定またはDynamoDB処理を確認|

10.5 確認手順

1. Lambdaコンソールを開く

2. contact-submit-prodを選択

3. Monitorタブを開く

4. Invocations / Errors / Duration / Throttlesを確認

5. View logs in CloudWatchを開く

6. エラー内容を確認

7. DynamoDB保存状況を確認

10.6 Phase 2以降のアラーム案

|   |   |   |
|---|---|---|
|アラーム|条件案|重要度|
|Lambda Errors|5分間で1件以上|High|
|Lambda Duration|平均2秒以上が継続|Medium|
|Lambda Throttles|1件以上|High|
|Lambda Invocations急増|通常の数倍|Medium|

  

11. CloudWatch Logs設計

11.1 目的

CloudWatch Logsは、Lambdaの実行状況とエラー原因を確認するために利用する。

ただし、ログ出力しすぎるとコスト増加と情報漏えいにつながる。

11.2 ロググループ

|   |   |   |
|---|---|---|
|ロググループ|対象|保存期間|
|/aws/lambda/contact-submit-prod|問い合わせLambda|14日〜30日|

11.3 ログ保存期間

MVPでは必ず保存期間を設定する。

推奨：

14日 または 30日

Never expire は禁止する。

11.4 出力してよいログ

|   |   |
|---|---|
|情報|例|
|requestId|req-xxxx|
|contactId|contact-xxxx|
|status|saved / validation_error|
|errorType|ClientError / ValueError|
|validation field|email / message|
|method|POST|

11.5 出力してはいけないログ

|   |   |
|---|---|
|情報|理由|
|メールアドレス全文|個人情報|
|問い合わせ本文全文|個人情報・機密情報を含む可能性|
|JWT|認証情報|
|Authorizationヘッダー|認証情報|
|AWS_SECRET_ACCESS_KEY|認証情報|
|APIキー|認証情報|
|Cookie全文|認証情報を含む可能性|

11.6 ログ例

正常

INFO request started requestId=req-xxxx method=POST

INFO contact saved requestId=req-xxxx contactId=contact-xxxx

バリデーションエラー

WARN validation error requestId=req-xxxx fields=email,message

honeypot検知

WARN honeypot detected requestId=req-xxxx

DynamoDBエラー

ERROR dynamodb put_item failed requestId=req-xxxx errorType=ClientError

11.7 Logs Insights利用方針

MVPでは必要時のみ利用する。

例：エラーログ検索

fields @timestamp, @message

| filter @message like /ERROR/

| sort @timestamp desc

| limit 20

例：バリデーションエラー検索

fields @timestamp, @message

| filter @message like /validation error/

| sort @timestamp desc

| limit 20

11.8 コスト注意点

- ログを大量出力しない
- 保存期間を設定する
- Logs Insightsを無駄に何度も実行しない
- DEBUGログを本番で常用しない

  

12. DynamoDB監視設計

12.1 監視目的

DynamoDBは問い合わせデータ保存先である。

以下を監視する。

- 問い合わせが保存されているか
- 書き込みエラーがないか
- スロットリングが起きていないか
- スパムで件数が急増していないか
- 保存容量が増えすぎていないか

12.2 対象テーブル

|   |   |
|---|---|
|テーブル|用途|
|ContactsTableProd|問い合わせデータ保存|

12.3 主要メトリクス

|   |   |   |
|---|---|---|
|メトリクス|内容|確認頻度|
|ConsumedWriteCapacityUnits|書き込み利用量|週次 / 障害時|
|ConsumedReadCapacityUnits|読み取り利用量|週次 / 障害時|
|ThrottledRequests|スロットリング|障害時|
|UserErrors|ユーザー起因エラー|障害時|
|SystemErrors|AWS側エラー|障害時|
|TableSizeBytes|テーブルサイズ|月次|
|ItemCount|アイテム数|週次 / 月次|

12.4 異常とみなす例

|   |   |
|---|---|
|状況|判断|
|ThrottledRequestsが発生|書き込み急増または設定見直し対象|
|ItemCountが急増|スパム投稿の可能性|
|UserErrorsが増加|Lambda保存処理またはデータ形式の問題|
|TableSizeBytesが急増|長文スパムや不要データ増加|

12.5 確認手順

1. DynamoDBコンソールを開く

2. ContactsTableProdを選択

3. Monitorタブを確認

4. ThrottledRequests、ConsumedWrite、UserErrorsを確認

5. Explore table itemsで件数と中身を確認

6. 明らかなスパムがあれば削除対応を検討

12.6 Phase 2以降のアラーム案

|   |   |
|---|---|
|アラーム|条件案|
|DynamoDB ThrottledRequests|1件以上|
|DynamoDB UserErrors|1件以上|
|ItemCount急増|通常の数倍|

  

13. AWS Budgets監視設計

13.1 目的

AWS Budgetsは、本プロジェクトで最重要の監視項目である。

目的：

- 課金事故を防ぐ
- 不要サービス作成に気づく
- Botアクセスやスパムによるコスト増に気づく
- AWSアクセスキー漏えい時の異常利用に気づく

13.2 Budget設定

|   |   |
|---|---|
|項目|設定|
|Budget type|Cost budget|
|Period|Monthly|
|Scope|All AWS services|
|初期金額|1 USDなど低額|
|通知|メール|

13.3 通知閾値

|   |   |   |
|---|---|---|
|閾値|種別|対応|
|50%|Actual|サービス別費用を確認|
|80%|Actual|不要リソース確認|
|100%|Actual|即確認・必要なら停止/削除|
|100%|Forecasted|月末予測超過の確認|

13.4 Budgets通知時の対応

1. Billing Dashboardを開く

2. Cost Explorerでサービス別費用を確認

3. 想定外のサービスがないか確認

4. リージョン別に不要リソースを確認

5. CloudWatch Logs、API Gateway、Lambda、DynamoDBを確認

6. 不要リソースを削除する

7. 原因を運用メモに残す

13.5 異常サービス例

MVPで以下に課金が出ていたら要確認。

|   |   |
|---|---|
|サービス|判断|
|EC2|原則異常|
|RDS|原則異常|
|NAT Gateway|即確認・削除候補|
|ALB|原則異常|
|OpenSearch|原則異常|
|SageMaker|原則異常|
|WAF|MVPでは原則使わない|

  

14. Cost Explorer / Billing確認設計

14.1 目的

AWS Budgets通知だけでなく、サービス別の費用を定期確認する。

14.2 確認頻度

|   |   |
|---|---|
|フェーズ|頻度|
|開発初期|毎日|
|MVP公開後|週1回|
|独自ドメイン・AdSense導入後|週1回|
|アクセス増加後|週1回以上|

14.3 確認項目

|   |   |
|---|---|
|項目|内容|
|当月総額|予算内か|
|サービス別費用|想定外のサービスがないか|
|リージョン別費用|誤って別リージョンに作っていないか|
|日別費用|急増日がないか|
|Forecast|月末予測が予算内か|

14.4 Cost Explorer確認手順

1. AWS Billing and Cost Managementを開く

2. Cost Explorerを開く

3. Date rangeをThis monthにする

4. Group byをServiceにする

5. 想定外のサービス費用がないか確認

6. 必要に応じてGroup byをRegionにする

7. 急増日があれば対象サービスのメトリクスを確認

  

8. GitHub Actions監視設計

15.1 監視目的

GitHub ActionsはCI/CDの実行基盤である。

以下を監視する。

- CIが成功しているか
- mainへのデプロイが成功しているか
- S3 syncが成功しているか
- CloudFront Invalidationが成功しているか
- Secretsや環境変数の設定ミスがないか

15.2 監視対象Workflow

|   |   |
|---|---|
|Workflow|目的|
|CI|lint / typecheck / build|
|Deploy Frontend|S3 + CloudFrontデプロイ|
|Deploy Lambda|Phase 2以降|
|Deploy SAM|Phase 2以降|

15.3 確認項目

|   |   |
|---|---|
|項目|確認内容|
|Workflow status|success / failure|
|Install dependencies|依存関係エラー|
|Lint|ESLintエラー|
|Type check|TypeScriptエラー|
|Build|Next.js buildエラー|
|Configure AWS credentials|OIDC / Secrets設定エラー|
|S3 sync|権限・バケット名エラー|
|CloudFront Invalidation|Distribution ID・権限エラー|

15.4 デプロイ失敗時の対応

1. GitHub Actionsの失敗ステップを確認する

2. エラーメッセージを確認する

3. ローカルで同じコマンドを実行する

4. AWS認証エラーならOIDC/Secrets/IAMを確認する

5. S3エラーならバケット名と権限を確認する

6. CloudFrontエラーならDistribution IDと権限を確認する

7. 修正commitをpushする

15.5 デプロイ成功後の確認

1. CloudFront URLを開く

2. トップページが最新か確認する

3. 主要ページを確認する

4. 問い合わせフォームをテストする

5. DynamoDB保存を確認する

  

6. サイト死活監視設計

16.1 MVP方針

MVPではCloudWatch Syntheticsは使わない。

理由：

- 監視コストが増える可能性がある
- 個人開発MVPでは手動確認で十分
- まず公開と学習価値を優先する

16.2 手動死活確認

毎日または週次で以下を確認する。

|   |   |
|---|---|
|URL|確認内容|
|/|トップページ表示|
|/terms|用語集表示|
|/questions|模擬問題表示|
|/architectures|構成図一覧表示|
|/blog|ブログ一覧表示|
|/contact|問い合わせフォーム表示|

16.3 curl確認

curl -I https://xxxxxxxx.cloudfront.net

期待：

HTTP/2 200

16.4 Phase 3以降の自動死活監視候補

|   |   |   |
|---|---|---|
|方法|内容|導入判断|
|CloudWatch Synthetics|外形監視|アクセス増加後|
|UptimeRobot等|外部死活監視|低コストなら検討|
|GitHub Actions scheduled curl|定期curl確認|簡易監視として検討|

16.5 GitHub Actions簡易死活監視案

Phase 3以降で、GitHub Actionsのscheduleでトップページ確認を行う案。

name: Health Check

  

on:

  schedule:

    - cron: '0 0 * * *'

  workflow_dispatch:

  

jobs:

  health-check:

    runs-on: ubuntu-latest

    steps:

      - name: Check top page

        run: curl -f -I https://example.com

MVPでは必須ではない。

  

17. セキュリティ監視設計

17.1 MVPで見るべき項目

|   |   |
|---|---|
|項目|確認内容|
|IAM|不要なユーザー・アクセスキーがないか|
|S3|Public Access Blockが有効か|
|CloudFront|OACが設定されているか|
|CloudWatch Logs|個人情報が出ていないか|
|GitHub|.envやAWSキーをコミットしていないか|
|Billing|想定外のサービス利用がないか|

17.2 CloudTrail

MVPではCloudTrailの高度な分析は行わない。

ただし、以下の場合はCloudTrailを確認する。

- AWSアクセスキー漏えい疑い
- 身に覚えのないリソース作成
- 急な課金増加
- IAM権限変更の疑い
- S3公開設定変更の疑い

17.3 CloudTrail確認手順

1. CloudTrailコンソールを開く

2. Event historyを開く

3. 時間帯を指定する

4. Event sourceやUsernameで絞る

5. Create / Delete / Update系イベントを確認する

6. 不審な操作がないか確認する

17.4 GitHub秘密情報チェック

|   |   |
|---|---|
|チェック|内容|
|.env|コミットされていないか|
|AWS_ACCESS_KEY_ID|コードに直書きされていないか|
|AWS_SECRET_ACCESS_KEY|コードに直書きされていないか|
|NEXT_PUBLIC_|秘密情報を入れていないか|
|Actions logs|Secretsをechoしていないか|

  

18. アラート設計

18.1 MVPアラート方針

MVPで必須のアラートはAWS Budgetsのみとする。

理由：

- 個人開発MVPではコストを抑えるため
- 監視設定を増やしすぎると管理負荷が増えるため
- まずは手動確認とログ確認で十分なため

18.2 MVP必須アラート

|   |   |   |
|---|---|---|
|アラート|条件|通知先|
|AWS Budgets 50%|月額予算50%到達|メール|
|AWS Budgets 80%|月額予算80%到達|メール|
|AWS Budgets 100%|月額予算100%到達|メール|
|Forecasted 100%|月末予測で100%超過|メール|

18.3 Phase 2以降のCloudWatch Alarm案

|   |   |   |
|---|---|---|
|アラーム|条件案|重要度|
|Lambda Errors|5分間で1件以上|High|
|API Gateway 5xx|5分間で1件以上|High|
|Lambda Duration|平均2秒以上が継続|Medium|
|DynamoDB ThrottledRequests|1件以上|High|
|API Gateway Count急増|通常の数倍|Medium|
|CloudFront 5xxErrorRate|1%以上が継続|High|

18.4 通知先設計

|   |   |   |
|---|---|---|
|通知先|MVP|Phase 2以降|
|メール|必須|必須|
|SNS Topic|任意|検討|
|Slack|任意|検討|
|Chatwork|任意|検討|

18.5 Slack通知は後回し

MVPではSlack通知は必須にしない。

理由：

- 通知連携の実装が増える
- SNSやLambda連携が必要になる場合がある
- まずはメール通知で十分

  

19. CloudWatch Dashboard設計

19.1 MVP方針

MVPではCloudWatch Dashboardは必須ではない。

ただし、ポートフォリオとして見せたい場合は、簡易ダッシュボードを作る価値がある。

19.2 Dashboardに載せる候補

|   |   |
|---|---|
|ウィジェット|対象|
|CloudFront Requests|サイトアクセス数|
|CloudFront 4xx/5xx|配信エラー|
|Lambda Invocations|問い合わせAPI実行数|
|Lambda Errors|Lambdaエラー|
|Lambda Duration|処理時間|
|API Gateway Count|API呼び出し数|
|API Gateway 4xx/5xx|APIエラー|
|DynamoDB ConsumedWrite|書き込み量|
|DynamoDB ThrottledRequests|スロットリング|

19.3 導入タイミング

|   |   |
|---|---|
|タイミング|判断|
|MVP開発中|不要|
|MVP公開後|任意|
|ポートフォリオ提出前|作ると説明材料になる|
|アクセス増加後|推奨|

  

20. 運用ルーティン

20.1 毎日確認 開発初期

開発初期は、課金事故を防ぐため毎日確認する。

|   |   |
|---|---|
|項目|確認内容|
|Billing Dashboard|当月費用が増えすぎていないか|
|Budgets通知|メールが来ていないか|
|GitHub Actions|直近デプロイが成功しているか|
|CloudFront URL|サイトが表示できるか|
|問い合わせフォーム|テスト送信できるか|

20.2 週次確認 MVP公開後

|   |   |
|---|---|
|項目|確認内容|
|Cost Explorer|サービス別費用|
|CloudWatch Logs|ERRORログ有無|
|Lambda Metrics|Errors / Duration|
|API Gateway Metrics|4xx / 5xx / Count|
|DynamoDB|問い合わせ件数、スパム有無|
|S3|容量、不要ファイル|
|GitHub Actions|失敗Workflow有無|

20.3 月次確認

|   |   |
|---|---|
|項目|確認内容|
|AWS総費用|月額予算内か|
|無料枠利用状況|超過傾向がないか|
|不要リソース|EC2/RDS/NAT Gateway等がないか|
|CloudWatch Logs保存量|保存期間が効いているか|
|記事・コンテンツ|更新状況|
|AdSense収益|Phase 3以降、AWS費用と比較|

  

21. 障害対応設計

21.1 障害分類

|   |   |   |
|---|---|---|
|障害ID|障害|重要度|
|INC-001|サイトが表示されない|Critical|
|INC-002|一部ページが404になる|Medium|
|INC-003|問い合わせフォーム送信失敗|High|
|INC-004|Lambdaエラー発生|High|
|INC-005|DynamoDB保存失敗|High|
|INC-006|デプロイ失敗|Medium|
|INC-007|AWS費用急増|Critical|
|INC-008|アクセスキー漏えい疑い|Critical|
|INC-009|スパム投稿急増|High|

21.2 INC-001 サイトが表示されない

確認順序

1. CloudFront URLにアクセスする

2. エラーコードを確認する 403 / 404 / 500

3. GitHub Actionsの直近デプロイを確認する

4. S3にindex.htmlが存在するか確認する

5. CloudFront DistributionのStatusを確認する

6. OAC / Bucket Policyを確認する

7. 直近変更をgit revertするか判断する

よくある原因

|   |   |
|---|---|
|原因|対応|
|S3ファイル削除|再デプロイ|
|Bucket Policyミス|CloudFront SourceArnを修正|
|CloudFront設定ミス|Origin / OAC確認|
|build失敗のままデプロイ|GitHub Actions確認|
|index.html不在|build成果物確認|

21.3 INC-003 問い合わせフォーム送信失敗

確認順序

1. ブラウザの開発者ツールでHTTPステータス確認

2. CORSエラーか確認

3. API Gateway Metricsで4xx/5xx確認

4. Lambda LogsでERROR確認

5. DynamoDBに保存されているか確認

6. 環境変数 CONTACTS_TABLE_NAME / ALLOWED_ORIGINS を確認

7. IAM Roleのdynamodb:PutItem権限を確認

よくある原因

|   |   |
|---|---|
|原因|対応|
|CORS設定ミス|API Gateway / Lambdaヘッダーを修正|
|Lambda環境変数ミス|CONTACTS_TABLE_NAME確認|
|IAM権限不足|PutItem権限を確認|
|DynamoDBテーブル名違い|テーブル名を修正|
|バリデーションエラー|フォーム入力を確認|

21.4 INC-007 AWS費用急増

確認順序

1. Budgets通知内容を確認する

2. Billing Dashboardを開く

3. Cost ExplorerでService別に確認する

4. Region別に確認する

5. 想定外リソースを削除する

6. CloudTrailで不審操作を確認する

7. 必要ならアクセスキーを無効化する

8. 再発防止策を追加する

即確認すべきサービス

EC2

RDS

NAT Gateway

ALB

OpenSearch

SageMaker

CloudWatch Logs

CloudFront

API Gateway

DynamoDB

21.5 INC-008 アクセスキー漏えい疑い

対応手順

1. 該当IAMアクセスキーを即時無効化する

2. GitHub Secretsを確認する

3. GitHub履歴にキーが残っていないか確認する

4. CloudTrailで不審な操作を確認する

5. Cost Explorerで急増サービスを確認する

6. 不審なリソースを削除する

7. 必要なら新しいキーを発行する

8. OIDC方式への移行を検討する

  

9. 復旧設計

22.1 静的サイト復旧

S3の静的サイトはGitHubから再デプロイできる。

GitHub main branch

  ↓

GitHub Actions

  ↓

S3 sync

  ↓

CloudFront Invalidation

22.2 手動復旧手順

cd frontend

npm ci

npm run build

aws s3 sync ./out s3://<bucket-name> --delete

aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"

22.3 問い合わせAPI復旧

|   |   |
|---|---|
|障害|復旧方法|
|Lambdaコード不具合|以前のコードに戻して再デプロイ|
|環境変数ミス|Lambda環境変数を修正|
|IAM権限不足|Lambda実行ロールを修正|
|DynamoDBテーブル削除|テーブル再作成。ただしデータ復旧は別途必要|
|API Gateway設定ミス|Route / Integration / CORSを修正|

22.4 DynamoDBデータ復旧

MVPではContactsTableのPITRは必須にしない。

理由：

- コスト優先
- 問い合わせデータは重要だが、MVPでは件数が少ない
- まずは削除しない運用を徹底する

本格運用後はPITRを検討する。

22.5 GitHub Actions復旧

|   |   |
|---|---|
|障害|復旧方法|
|Workflow設定ミス|修正commit|
|Secrets不足|GitHub Secrets / Variablesを再設定|
|IAM Roleエラー|Trust Policy / Permission Policyを確認|
|S3 sync失敗|バケット名・権限確認|
|CloudFront失敗|Distribution ID・権限確認|

  

23. データ保持・ログ保持設計

23.1 ログ保持

|   |   |   |
|---|---|---|
|ログ|保存期間|理由|
|Lambda Logs|14〜30日|障害調査には十分|
|GitHub Actions Logs|GitHub標準に従う|CI/CD確認用|
|CloudFront標準ログ|MVPでは取得しない|コスト削減|
|API Gateway詳細ログ|MVPでは最小限|コスト削減|

23.2 問い合わせデータ保持

|   |   |
|---|---|
|データ|保持方針|
|ContactsTable|1年を目安に見直し|
|明らかなスパム|削除対象|
|テストデータ|動作確認後に削除してよい|

23.3 個人情報の扱い

問い合わせデータには個人情報が含まれる。

運用ルール：

- DynamoDBの内容をGitHubにコピーしない
- CSVで外部保存しない
- ログに本文全文を出さない
- テストデータは本物の個人情報を使わない

  

24. SLA / SLO設計

24.1 MVPでは正式SLAを持たない

本プロダクトは個人開発ポートフォリオであるため、MVPでは外部ユーザー向けの正式SLAは設定しない。

ただし、運用目標としてSLOを持つ。

24.2 MVP SLO案

|   |   |
|---|---|
|項目|目標|
|トップページ表示|週次確認で正常表示|
|問い合わせAPI|テスト送信で正常保存|
|Lambdaエラー|週次確認で0件を目指す|
|AWS月額費用|予算内|
|CloudWatch Logs保存|14〜30日|
|復旧時間|個人対応可能な範囲で当日中を目指す|

24.3 Phase 3以降のSLO案

|   |   |
|---|---|
|項目|目標|
|サイト可用性|99%以上を目指す|
|問い合わせAPI成功率|99%以上を目指す|
|5xxエラー|1%未満|
|主要ページ表示|3秒以内を目指す|

  

25. 運用ドキュメント管理

25.1 運用メモ

障害や課金増加が発生したら、以下の形式で記録する。

# 運用メモ

  

## YYYY-MM-DD 障害または事象名

  

### 発生内容

  

### 影響範囲

  

### 原因

  

### 対応内容

  

### 再発防止策

  

### 学び

25.2 保存場所

docs/operations/

├── incident-log.md

├── monthly-cost-review.md

└── runbook.md

25.3 ポートフォリオ活用

運用メモは、個人情報や内部情報を除いたうえで、ポートフォリオの改善履歴として使える。

例：

CloudWatch Logs保存期間をNever expireから14日に変更し、ログコスト増加リスクを下げた。

  

26. 運用Runbook

26.1 サイト表示確認Runbook

1. CloudFront URLへアクセス

2. トップページを確認

3. 主要ページを確認

4. 画像・CSS・JSを確認

5. 404ページを確認

6. 問題があればGitHub ActionsとCloudFront/S3を確認

26.2 問い合わせAPI確認Runbook

1. /contactページを開く

2. テスト問い合わせを送信

3. 成功メッセージを確認

4. DynamoDB ContactsTableProdを確認

5. CloudWatch Logsでcontact savedを確認

6. テストデータを削除するかstatusをtestにする

26.3 課金確認Runbook

1. Billing Dashboardを開く

2. 当月費用を見る

3. Cost ExplorerでService別に見る

4. 想定外サービスがないか確認

5. Region別に確認

6. 不要リソースを削除

7. 月次メモに記録

26.4 デプロイ失敗Runbook

1. GitHub Actionsの失敗Workflowを開く

2. 失敗ステップを確認

3. ローカルで同じコマンドを実行

4. AWS認証エラーならOIDC/Secrets/IAMを確認

5. Buildエラーならコード修正

6. S3/CloudFrontエラーなら権限・IDを確認

7. 修正commitをpush

26.5 スパム投稿Runbook

1. API Gateway Countを確認

2. Lambda Invocationsを確認

3. DynamoDB ItemCountを確認

4. honeypot検知ログを確認

5. スパムデータを削除

6. API Gatewayレート制限を検討

7. reCAPTCHAまたはWAF導入を検討

  

8. Phase別運用監視方針

27.1 Phase 1：静的サイト公開

重点監視：

- CloudFront表示確認
- S3 Public Access Block
- AWS Budgets
- GitHub Actions deploy
- Cost Explorer

MVP対応：

手動確認中心で十分。

27.2 Phase 2：問い合わせAPI追加

重点監視：

- API Gateway 4xx/5xx
- Lambda Errors / Duration
- DynamoDB PutItem
- CloudWatch Logs
- スパム投稿

追加検討：

Lambda ErrorsのCloudWatch Alarm

API Gateway 5xxのCloudWatch Alarm

27.3 Phase 3：収益化準備

重点監視：

- 独自ドメインHTTPS
- Search Console
- Analytics
- AdSense
- CloudFront転送量
- コストと収益の比較

追加検討：

外形監視

CloudWatch Dashboard

CloudFront 5xx Alarm

27.4 Phase 4：学習アプリ化

重点監視：

- Cognito認証
- 認証付きAPI
- UserAnswersTable
- UserProgressTable
- SES送信失敗
- EventBridge実行失敗

追加検討：

CloudWatch Alarm

SNS通知

Slack通知

X-Ray

PITR

運用ダッシュボード

  

28. MVPで導入しない監視と理由

|   |   |   |
|---|---|---|
|監視/機能|MVPで導入しない理由|導入タイミング|
|CloudWatch Synthetics|コスト・設定負荷が増える|アクセス増加後|
|X-Ray|問い合わせAPIのみでは過剰|APIが増えた後|
|WAFログ|WAF自体をMVPで使わない|攻撃・スパム増加後|
|CloudFront標準ログ|S3ログ保存でコスト・管理増|本格分析が必要になった後|
|API Gateway詳細ログ|ログ量増加リスク|障害調査が必要になった後|
|GuardDuty|個人MVPではコスト優先|商用化・有料化後|
|Security Hub|MVPでは過剰|本格運用後|
|Datadog等外部監視|コスト増|収益化後|

  

29. ポートフォリオで説明するポイント

29.1 運用監視の説明例

MVPでは監視を作り込みすぎず、AWS Budgets、CloudWatch Logs、CloudWatch Metrics、GitHub Actionsログを中心に運用しています。

  

課金事故防止を最優先にAWS Budgetsを設定し、LambdaのログはCloudWatch Logsで確認します。

CloudWatch Logsには保存期間を設定し、問い合わせ本文やメールアドレスなどの個人情報は出力しない方針です。

  

アクセスが増えた段階で、Lambda Errors、API Gateway 5xx、DynamoDB ThrottledRequestsなどのCloudWatch Alarmを追加する設計にしています。

29.2 面接で聞かれやすい質問と回答

Q1. どうやって障害に気づきますか？

MVPではAWS Budgets、GitHub Actionsの失敗、CloudWatch Logs、CloudWatch Metricsを確認します。

問い合わせAPIについてはLambda ErrorsやAPI Gateway 5xxを確認し、Phase 2以降でCloudWatch Alarmを追加する想定です。

Q2. なぜ最初からCloudWatch Alarmを全部作らないのですか？

個人開発MVPではコストと運用負荷を抑えるためです。

最初はBudgetsとログ確認を優先し、アクセスが増えた段階で重要なアラームから追加します。

Q3. ログには何を出しますか？

requestId、contactId、エラー種別、バリデーションエラーのfield名などを出します。

一方で、メールアドレス全文や問い合わせ本文全文、JWT、Authorizationヘッダーは出しません。

Q4. 課金事故にはどう対応しますか？

AWS Budgetsで低い閾値の通知を設定し、通知が来たらCost Explorerでサービス別・リージョン別に費用を確認します。

EC2、RDS、NAT GatewayなどMVPで使わないサービスに費用が出ていたら即確認し、不要なら削除します。

Q5. 問い合わせフォームが動かない場合、どこを見ますか？

まずブラウザのHTTPステータスとCORSエラーを確認します。

次にAPI Gatewayの4xx/5xx、Lambda Logs、Lambda Errors、DynamoDB保存状況、IAM権限、Lambda環境変数を順番に確認します。

  

30. 受け入れ基準

30.1 運用監視設計書の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-OPS-DOC-001|MVPの監視対象が定義されている|
|AC-OPS-DOC-002|CloudFront / S3 / API Gateway / Lambda / DynamoDBの監視項目が定義されている|
|AC-OPS-DOC-003|CloudWatch Logsの出力方針と保存期間が定義されている|
|AC-OPS-DOC-004|AWS Budgetsの監視方針が定義されている|
|AC-OPS-DOC-005|Cost Explorerの確認方針が定義されている|
|AC-OPS-DOC-006|GitHub Actionsの監視方針が定義されている|
|AC-OPS-DOC-007|障害対応Runbookが定義されている|
|AC-OPS-DOC-008|MVPで導入しない監視と理由が定義されている|
|AC-OPS-DOC-009|Phase別の監視拡張方針が定義されている|
|AC-OPS-DOC-010|面接で説明できる運用監視ポイントが整理されている|

30.2 MVP運用監視の実装完了基準

|   |   |
|---|---|
|ID|基準|
|AC-OPS-MVP-001|AWS Budgetsが設定されている|
|AC-OPS-MVP-002|CloudWatch LogsでLambdaログを確認できる|
|AC-OPS-MVP-003|CloudWatch Logs保存期間が14〜30日に設定されている|
|AC-OPS-MVP-004|Lambda Logsにemail全文・message全文が出ていない|
|AC-OPS-MVP-005|API Gatewayの4xx/5xxを確認できる|
|AC-OPS-MVP-006|LambdaのErrors / Durationを確認できる|
|AC-OPS-MVP-007|DynamoDBに問い合わせデータが保存されていることを確認できる|
|AC-OPS-MVP-008|GitHub ActionsのCI/CD結果を確認できる|
|AC-OPS-MVP-009|Cost Explorerでサービス別費用を確認できる|
|AC-OPS-MVP-010|サイト表示確認Runbookと問い合わせAPI確認Runbookが用意されている|

  

31. 今後作成する関連設計書

本運用監視設計書の次に、以下を作成する。

1. 開発タスク一覧
2. GitHub README草案
3. MVP実装スケジュール
4. テスト設計書
5. 初期コンテンツ作成テンプレート
6. リリース手順書
7. ポートフォリオ提出用説明資料

  

8. 結論

本プロダクトの運用監視では、MVP段階で監視を作り込みすぎない。

最初に必須とするのは以下である。

AWS Budgets

CloudWatch Logs

CloudWatch Metrics

GitHub Actions logs

Cost Explorer / Billing確認

手動死活確認

特に重要なのは、以下の5点である。

1. AWS Budgetsで課金事故を検知する
2. CloudWatch LogsでLambdaエラーを確認する
3. CloudWatch Logsに個人情報を出さない
4. API Gateway / Lambda / DynamoDBの基本メトリクスを確認する
5. 障害時の確認順序をRunbook化する

CloudWatch Alarm、Dashboard、Synthetics、X-Ray、WAF、GuardDutyなどは、MVPでは必須にしない。

アクセス増加、AdSense導入、ログイン機能追加、有料化のタイミングで段階的に導入する。

この設計により、コストを抑えつつ、AWS運用監視の基本を実践したポートフォリオとして説明できる状態を目指す。