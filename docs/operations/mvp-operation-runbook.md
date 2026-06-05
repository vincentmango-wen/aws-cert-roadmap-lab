# MVP Operation Runbook

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| 文書名 | MVP Operation Runbook |
| 対象プロダクト | AWS Cert Roadmap Lab |
| 対象環境 | production |
| 対象ブランチ | master |
| 対象フェーズ | Phase 3：CI/CD・運用監視 |
| 作成目的 | MVP公開後の確認手順、障害対応手順、課金確認手順を明文化する |

---

## 2. このRunbookの目的

このRunbookは、AWS Cert Roadmap Lab のMVP運用で問題が発生したときに、確認順序を迷わないための手順書である。

対象とする主な問題は以下である。

- サイトが表示されない
- 一部ページが404になる
- 問い合わせフォームが送信できない
- Lambdaでエラーが発生する
- DynamoDBに問い合わせが保存されない
- GitHub Actionsのデプロイが失敗する
- AWS費用が急増する
- アクセスキー漏えいが疑われる
- スパム投稿が急増する

---

## 3. MVP運用方針

MVPでは、大規模な監視基盤は作らない。

以下を中心に運用する。

- AWS Budgets
- Cost Explorer
- CloudWatch Logs
- CloudWatch Metrics
- GitHub Actions Logs
- DynamoDB item確認
- 手動死活確認

MVPでは以下は導入しない。

- CloudWatch Synthetics
- X-Ray
- WAF
- GuardDuty
- Security Hub
- Datadog
- Slack通知
- SNS通知
- 外形監視サービス

理由は、個人開発MVPではコストと運用負荷を増やさず、まず公開状態を安定させることを優先するためである。

---

## 4. 重要度分類

| 重要度 | 内容 | 対応目安 |
|---|---|---|
| Critical | サイト全体停止、課金急増、認証情報漏えい疑い | すぐ対応する |
| High | 問い合わせAPI停止、Lambda連続エラー、DynamoDB保存失敗 | 当日中に対応する |
| Medium | 一部ページ404、GitHub Actions失敗、4xx増加 | 1〜2日以内に対応する |
| Low | 軽微な表示崩れ、誤字、軽い警告ログ | 通常タスクとして対応する |

---

## 5. 日次確認チェックリスト

開発初期とMVP公開直後は、課金事故を防ぐため毎日確認する。

| 確認対象 | 確認内容 | 期待状態 |
|---|---|---|
| Billing Dashboard | 当月費用 | 予算内 |
| Budgets通知 | メール通知 | 超過通知なし |
| GitHub Actions | 直近Workflow | success |
| CloudFront URL | トップページ表示 | 正常表示 |
| /contact | 問い合わせフォーム | 表示できる |
| DynamoDB | テスト送信結果 | 保存される |
| CloudWatch Logs | ERRORログ | 連続発生なし |

---

## 6. 週次確認チェックリスト

MVP公開後は、週1回確認する。

| 確認対象 | 確認内容 | 期待状態 |
|---|---|---|
| Cost Explorer | サービス別費用 | 想定内 |
| CloudWatch Logs | ERRORログ | 連続発生なし |
| Lambda Metrics | Errors / Duration | Errorsが増えていない |
| API Gateway Metrics | 4xx / 5xx / Count | 異常増加なし |
| DynamoDB | ItemCount | 不自然な急増なし |
| S3 | オブジェクト数・容量 | 不要ファイルなし |
| GitHub Actions | 失敗Workflow | 未解決の失敗なし |

---

## 7. 月次確認チェックリスト

月末または月初に確認する。

| 確認対象 | 確認内容 | 期待状態 |
|---|---|---|
| AWS総費用 | 月額予算内か | 予算内 |
| 無料枠利用状況 | 超過傾向 | なし |
| 不要リソース | EC2 / RDS / NAT Gateway / ALB | 作成されていない |
| CloudWatch Logs | 保存期間 | 14〜30日 |
| S3 | 容量 | 不自然な増加なし |
| コンテンツ | 記事・用語・問題の更新 | 更新状況を記録 |

---

## 8. INC-001 サイトが表示されない

### 重要度

Critical

### 症状

- CloudFront URLを開いてもサイトが表示されない
- 403 Forbidden が表示される
- 404 Not Found が表示される
- 5xx エラーが表示される
- CSSやJSが読み込まれず画面が崩れる

### 確認順序

1. CloudFront URLにアクセスする
2. 表示されたHTTPステータスを確認する
   - 403
   - 404
   - 500
   - 502
   - 503
   - 504
3. GitHub Actionsの直近Deploy Frontend Workflowを確認する
4. GitHub Actionsの以下ステップを確認する
   - Install dependencies
   - Lint
   - Type check
   - Build
   - Configure AWS credentials
   - S3 sync
   - CloudFront Invalidation
5. S3バケットに `index.html` が存在するか確認する
6. S3バケットに `_next/` 配下の静的ファイルが存在するか確認する
7. CloudFront Distribution の Status が `Enabled` であることを確認する
8. CloudFront の Origin が正しいS3バケットを向いているか確認する
9. CloudFront の Default root object が `index.html` であることを確認する
10. S3 Bucket Policy で CloudFront Distribution からの `s3:GetObject` が許可されているか確認する
11. S3 Public Access Block が有効であることを確認する
12. 直近の変更を確認し、必要なら `git revert` を検討する

### よくある原因と対応

| 原因 | 対応 |
|---|---|
| S3にビルド成果物がない | GitHub Actionsを再実行する |
| `index.html` がない | `npm run build` の結果を確認する |
| Bucket Policyミス | CloudFront Distribution IDとSourceArnを確認する |
| OAC設定ミス | CloudFront Origin Access Controlを確認する |
| CloudFront Invalidation未実行 | Invalidation履歴を確認する |
| build失敗のまま反映 | GitHub ActionsのBuildステップを確認する |
| CSS / JSが404 | S3 sync対象に静的ファイルが含まれているか確認する |

### 復旧判断

| 状況 | 復旧方法 |
|---|---|
| デプロイ失敗 | GitHub Actionsを修正して再実行 |
| 直近コード変更が原因 | `git revert` で戻す |
| S3ファイル不足 | 再デプロイ |
| Bucket Policyミス | ポリシーを修正 |
| CloudFront設定ミス | Origin / OAC / Default root object を修正 |

---

## 9. INC-002 一部ページが404になる

### 重要度

Medium

### 症状

- トップページは表示される
- `/terms` や `/questions` は表示される
- `/terms/s3` などの詳細ページだけ404になる

### 確認順序

1. 対象URLを確認する
2. ローカルで同じURLが表示できるか確認する
3. `npm run build` が成功するか確認する
4. Next.js static exportで対象ページが生成されているか確認する
5. `out/` 配下に該当HTMLがあるか確認する
6. S3に該当HTMLがアップロードされているか確認する
7. CloudFront Invalidationが実行されているか確認する
8. 動的ルートの場合、`generateStaticParams` が定義されているか確認する

### よくある原因と対応

| 原因 | 対応 |
|---|---|
| static exportで詳細ページが生成されていない | `generateStaticParams` を確認する |
| S3に対象HTMLがない | 再デプロイ |
| CloudFrontキャッシュが古い | Invalidationを確認する |
| slug不一致 | JSON / MDXのslugとURLを確認する |
| ファイル名不一致 | `contents/` 配下のファイル名を確認する |

---

## 10. INC-003 問い合わせフォーム送信失敗

### 重要度

High

### 症状

- `/contact` は表示される
- 送信するとエラーになる
- CORSエラーが表示される
- 400 / 500 が返る
- DynamoDBに保存されない

### 確認順序

1. ブラウザの開発者ツールを開く
2. Networkタブで `POST /contact` のHTTPステータスを確認する
3. ConsoleタブでCORSエラーの有無を確認する
4. API Gateway Metricsで以下を確認する
   - Count
   - 4xx
   - 5xx
   - Latency
5. Lambda Metricsで以下を確認する
   - Invocations
   - Errors
   - Duration
   - Throttles
6. CloudWatch Logsで対象リクエストのERRORを確認する
7. DynamoDB `ContactsTableProd` にitemが保存されているか確認する
8. Lambda環境変数を確認する
   - `CONTACTS_TABLE_NAME`
   - `ALLOWED_ORIGINS`
   - `LOG_LEVEL`
   - `ENV`
9. Lambda実行ロールに `dynamodb:PutItem` があるか確認する
10. API GatewayのCORS設定を確認する
11. フロントエンドの `NEXT_PUBLIC_API_BASE_URL` を確認する

### HTTPステータス別の見方

| ステータス | 主な原因 | 確認場所 |
|---|---|---|
| 400 | 入力値エラー、不正JSON | Lambda Logs |
| 403 | CORS、権限、Origin不一致 | API Gateway / Lambda response header |
| 404 | API URL間違い | フロント環境変数 |
| 500 | Lambda例外、DynamoDBエラー | CloudWatch Logs |
| 502 | Lambdaレスポンス形式不正 | CloudWatch Logs |
| 504 | Lambda timeout | Lambda Metrics |

### よくある原因と対応

| 原因 | 対応 |
|---|---|
| CORS設定ミス | `ALLOWED_ORIGINS` とAPI Gateway CORSを確認 |
| API Gateway URL間違い | `NEXT_PUBLIC_API_BASE_URL` を確認 |
| Lambda環境変数ミス | `CONTACTS_TABLE_NAME` を確認 |
| IAM権限不足 | Lambda Roleの `dynamodb:PutItem` を確認 |
| DynamoDBテーブル名違い | 実テーブル名と環境変数を合わせる |
| バリデーションエラー | 入力値とレスポンスdetailsを確認 |
| honeypotに値が入っている | フロントのhidden項目を確認 |

---

## 11. INC-004 Lambdaエラー発生

### 重要度

High

### 症状

- Lambda MetricsのErrorsが増えている
- API Gatewayで5xxが出ている
- CloudWatch LogsにERRORが出ている

### 確認順序

1. Lambdaコンソールを開く
2. `contact-submit-prod` を選択する
3. MonitorタブでErrorsとDurationを確認する
4. CloudWatch Logsを開く
5. 直近のERRORログを確認する
6. requestIdで該当リクエストを追跡する
7. DynamoDB PutItemエラーか、JSONパースエラーか、予期しない例外かを分類する
8. Lambda環境変数を確認する
9. Lambda timeoutが3〜5秒に設定されているか確認する
10. 直近のLambdaコード変更を確認する

### 確認するログ

| ログ | 意味 |
|---|---|
| `INFO contact saved` | 保存成功 |
| `WARN validation error` | 入力値エラー |
| `WARN honeypot detected` | スパム疑い |
| `ERROR dynamodb put_item failed` | DynamoDB保存失敗 |
| `ERROR unexpected error` | 想定外エラー |

### 出力してはいけないログ

- メールアドレス全文
- 問い合わせ本文全文
- Authorizationヘッダー
- JWT
- AWSアクセスキー
- APIキー

---

## 12. INC-005 DynamoDB保存失敗

### 重要度

High

### 症状

- Lambdaは呼び出されている
- APIは500を返す
- DynamoDBにitemが保存されない

### 確認順序

1. CloudWatch Logsで `dynamodb put_item failed` を確認する
2. Lambda環境変数 `CONTACTS_TABLE_NAME` を確認する
3. DynamoDBに `ContactsTableProd` が存在するか確認する
4. DynamoDBテーブルのRegionが `ap-northeast-1` であることを確認する
5. Lambda実行ロールの権限を確認する
6. IAM Policyに以下があるか確認する
   - Action: `dynamodb:PutItem`
   - Resource: `arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTableProd`
7. DynamoDB MetricsでThrottledRequestsを確認する
8. 大量スパム投稿が発生していないか確認する

### よくある原因と対応

| 原因 | 対応 |
|---|---|
| テーブル名違い | Lambda環境変数を修正 |
| Region違い | LambdaとDynamoDBのRegionを確認 |
| IAM権限不足 | `dynamodb:PutItem` を付与 |
| テーブル未作成 | `ContactsTableProd` を作成 |
| スロットリング | 書き込み急増の原因を確認 |

---

## 13. INC-006 デプロイ失敗

### 重要度

Medium

### 症状

- GitHub Actionsがfailureになる
- S3 syncが失敗する
- CloudFront Invalidationが失敗する
- OIDC認証に失敗する

### 確認順序

1. GitHub Actionsの失敗Workflowを開く
2. 失敗したステップを確認する
3. エラーメッセージ全文を読む
4. ローカルで同じコマンドを実行する
5. 依存関係エラーなら `package-lock.json` と `package.json` を確認する
6. Lintエラーなら該当ファイルを修正する
7. TypeScriptエラーなら型定義を修正する
8. BuildエラーならNext.jsのエラー箇所を確認する
9. AWS認証エラーならOIDC Trust Policyを確認する
10. S3エラーならバケット名とIAM Policyを確認する
11. CloudFrontエラーならDistribution IDとIAM Policyを確認する

### ステップ別の確認ポイント

| 失敗ステップ | 確認すること |
|---|---|
| Install dependencies | lock file、Node.js version |
| Lint | ESLintエラー箇所 |
| Type check | TypeScript型エラー |
| Build | Next.js buildエラー |
| Configure AWS credentials | OIDC Provider、Trust Policy、Role ARN |
| S3 sync | Bucket名、s3権限 |
| CloudFront Invalidation | Distribution ID、cloudfront権限 |

### masterブランチ運用の注意

このリポジトリでは本番ブランチを `master` とする。

GitHub Actionsのトリガー、OIDC Trust Policy、ブランチ保護ルールでは `main` ではなく `master` を使う。

---

## 14. INC-007 AWS費用急増

### 重要度

Critical

### 症状

- AWS Budgetsから通知が来た
- Billing Dashboardの当月費用が増えている
- Cost Explorerで想定外サービスが表示される

### 確認順序

1. Budgets通知メールの内容を確認する
2. Billing Dashboardを開く
3. Cost ExplorerでService別に確認する
4. Cost ExplorerでRegion別に確認する
5. 想定外サービスがないか確認する
6. CloudWatch Logsの保存量を確認する
7. CloudFrontの転送量を確認する
8. API Gatewayのリクエスト数を確認する
9. DynamoDBの書き込み数を確認する
10. CloudTrailで不審な操作がないか確認する
11. アクセスキー漏えいが疑われる場合は、該当キーを無効化する
12. 原因を月次メモに記録する

### 即確認すべきサービス

MVPでは以下のサービスに費用が出ていたら要確認。

- EC2
- RDS
- NAT Gateway
- ALB
- OpenSearch
- SageMaker
- WAF
- CloudWatch Logs
- CloudFront
- API Gateway
- DynamoDB

### よくある原因と対応

| 原因 | 対応 |
|---|---|
| NAT Gatewayを作成した | 不要なら削除 |
| EC2を停止し忘れた | 不要なら停止または削除 |
| RDSを作成した | MVPでは使わないため削除判断 |
| CloudWatch Logsが増えた | 保存期間とログ出力量を確認 |
| CloudFront転送量が増えた | Bot、画像サイズ、アクセス急増を確認 |
| API Gateway Count急増 | スパム投稿を確認 |
| DynamoDB書き込み急増 | スパム投稿を確認 |

---

## 15. INC-008 アクセスキー漏えい疑い

### 重要度

Critical

### 症状

- GitHubにアクセスキーをpushした可能性がある
- AWSから不審な操作通知がある
- Cost Explorerで想定外のサービス利用がある
- CloudTrailに見覚えのない操作がある

### 対応順序

1. 該当IAMアクセスキーをすぐ無効化する
2. GitHub Secretsを確認する
3. GitHubリポジトリに `.env` や認証情報が含まれていないか確認する
4. CloudTrailで不審操作を確認する
5. Cost Explorerで想定外サービスを確認する
6. 不要リソースを確認する
7. 新しいアクセスキーが必要な場合は、最小権限で再発行する
8. GitHub ActionsはOIDC方式を優先する
9. 再発防止として `.gitignore` を確認する
10. READMEやdocsに秘密情報が含まれていないか確認する

### 確認対象

- `.env`
- `.env.local`
- `.env.production`
- AWS access key
- AWS secret access key
- GitHub token
- JWT secret
- API key
- private key
- `.pem`
- `.key`

---

## 16. INC-009 スパム投稿急増

### 重要度

High

### 症状

- DynamoDBのItemCountが急増する
- API Gateway Countが急増する
- Lambda Invocationsが急増する
- honeypot検知ログが増える
- 同じような問い合わせが大量に保存される

### 確認順序

1. API Gateway MetricsでCountを確認する
2. Lambda MetricsでInvocationsを確認する
3. DynamoDB MetricsでItemCountを確認する
4. CloudWatch Logsで `honeypot detected` を確認する
5. 保存された問い合わせの傾向を確認する
6. テストデータとスパムデータを分類する
7. 不要なスパムデータを削除する
8. API Gatewayのレート制限を検討する
9. reCAPTCHA導入を検討する
10. スパムが継続する場合はWAF導入を検討する

### MVPでの対策

- honeypot
- 文字数制限
- Lambda側バリデーション
- CORS制限
- CloudWatch Logs確認
- AWS Budgets確認

### MVP後に検討する対策

- API Gateway throttling
- reCAPTCHA
- WAF
- IP制限
- CloudWatch Alarm

---

## 17. サイト表示確認Runbook

### 実行タイミング

- デプロイ後
- 週次確認
- ポートフォリオ提出前
- サイト表示不具合時

### 確認順序

1. CloudFront URLへアクセスする
2. トップページを確認する
3. `/terms` を確認する
4. `/questions` を確認する
5. `/architectures` を確認する
6. `/blog` を確認する
7. `/contact` を確認する
8. CSSが適用されているか確認する
9. 画像が表示されているか確認する
10. 404ページを確認する
11. 問題があればGitHub Actions、CloudFront、S3を確認する

---

## 18. 問い合わせAPI確認Runbook

### 実行タイミング

- API変更後
- フロントエンド変更後
- デプロイ後
- 週次確認
- 問い合わせ失敗時

### 確認順序

1. CloudFront URLから `/contact` を開く
2. テスト問い合わせを送信する
3. 送信完了メッセージを確認する
4. DynamoDB `ContactsTableProd` を確認する
5. CloudWatch Logsで `contact saved` を確認する
6. API Gateway Metricsで5xxが増えていないか確認する
7. Lambda MetricsでErrorsが増えていないか確認する
8. テストデータを削除するか、`status` を `test` に変更する

### テスト入力例

| 項目 | 値 |
|---|---|
| name | Test User |
| email | test@example.com |
| subject | Operation check |
| message | This is a test contact from operation runbook. |
| sourcePage | /contact |
| honeypot | 空文字 |

---

## 19. 課金確認Runbook

### 実行タイミング

- 毎日
- Budgets通知受信時
- 月次確認
- AWSリソース作成後

### 確認順序

1. Billing Dashboardを開く
2. 当月費用を確認する
3. Cost Explorerを開く
4. Service別に費用を確認する
5. Region別に費用を確認する
6. 想定外サービスがないか確認する
7. 不要リソースを削除する
8. 月次メモに記録する

### MVPで費用が出ても想定内のサービス

- S3
- CloudFront
- API Gateway
- Lambda
- DynamoDB
- CloudWatch Logs
- AWS Budgets

### MVPで費用が出たら要確認のサービス

- EC2
- RDS
- NAT Gateway
- ALB
- OpenSearch
- SageMaker
- WAF
- ECS
- EKS

---

## 20. GitHub Actions確認Runbook

### 実行タイミング

- push後
- pull request作成後
- デプロイ失敗時
- サイト表示不具合時

### 確認順序

1. GitHubリポジトリを開く
2. Actionsタブを開く
3. 直近のWorkflowを確認する
4. `CI` が成功しているか確認する
5. `Deploy Frontend` が成功しているか確認する
6. 失敗している場合は失敗ステップを開く
7. エラーメッセージ全文を確認する
8. ローカルで同じコマンドを実行する
9. AWS認証エラーならOIDC Trust Policyを確認する
10. S3 / CloudFrontエラーならIAM PolicyとGitHub Variablesを確認する

---

## 21. ロールバック方針

### 方針

MVPでは複雑なBlue/Green Deployは使わない。

問題がある変更を本番に反映した場合は、Gitで直前の安定版に戻す。

### 確認順序

1. 直近のmerge commitを確認する
2. 問題の原因となったcommitを特定する
3. `git revert` で取り消す
4. 修正commitを `master` に反映する
5. GitHub ActionsのDeploy Frontend成功を確認する
6. CloudFront URLで復旧を確認する

### 注意

`git reset --hard` や `git push --force` は使わない。

---

## 22. 記録フォーマット

障害や異常を確認したら、以下の形式で記録する。

```text
Date:
Incident ID:
Severity:
Summary:
Detected by:
Affected area:
Confirmed metrics:
Root cause:
Action taken:
Result:
Follow-up: