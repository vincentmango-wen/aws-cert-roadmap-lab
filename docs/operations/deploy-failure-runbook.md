## 1. 目的

このRunbookは、AWS Cert Roadmap Lab のフロントエンド自動デプロイが失敗したときに、原因を切り分けて復旧するための手順書である。

対象は GitHub Actions の `Deploy Frontend` workflow とする。

本プロジェクトでは、Next.js の静的ビルド成果物を Amazon S3 に配置し、Amazon CloudFront 経由で公開する。

デプロイ処理の流れは以下である。

```text
GitHub master branch
  ↓
GitHub Actions
  ↓
npm ci
  ↓
npm run lint
  ↓
npm run typecheck
  ↓
npm run build
  ↓
AWS OIDC 認証
  ↓
aws s3 sync ./out s3://<S3_BUCKET_NAME> --delete
  ↓
aws cloudfront create-invalidation
  ↓
CloudFront URL で公開確認
```

## 2. 対象範囲

## 2.1 対象

このRunbookで扱う対象は以下である。


| 対象               | 内容                                                               |
| ---------------- | ---------------------------------------------------------------- |
| GitHub Actions   | Deploy Frontend workflow                                         |
| Next.js build    | `npm run build`                                                  |
| S3 deploy        | `aws s3 sync ./out s3://... --delete`                            |
| CloudFront       | `create-invalidation` と本番表示                                      |
| IAM / OIDC       | GitHub Actions から AWS への一時認証                                     |
| GitHub Secrets   | `AWS_ROLE_ARN`, `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID`   |
| GitHub Variables | `AWS_REGION`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL` |


## 2.2 対象外

このRunbookでは以下を対象外とする。


| 対象外                       | 理由                           |
| ------------------------- | ---------------------------- |
| Lambda自動デプロイ              | MVPではフロントエンド自動デプロイのみを対象にするため |
| API Gateway作成             | 手動構築済みリソースのため                |
| DynamoDB作成                | 手動構築済みリソースのため                |
| CloudFront Distribution作成 | P2で作成済みリソースのため               |
| S3 Bucket作成               | P2で作成済みリソースのため               |


## 3. 最初に確認すること

デプロイ失敗時は、いきなりAWS設定を変更しない。

まずGitHub Actionsの失敗ステップを確認する。

## 3.1 GitHub Actionsで確認する場所

1. GitHubリポジトリを開く
2. Actionsタブを開く
3. 失敗した `Deploy Frontend` workflow を開く
4. 赤く失敗しているjobを開く
5. 失敗したstep名を確認する
6. エラーメッセージ全文を確認する

## 3.2 失敗ステップ別の確認方針


| 失敗ステップ                    | 主な原因                         | 最初に確認すること                                                      |
| ------------------------- | ---------------------------- | -------------------------------------------------------------- |
| Checkout                  | GitHub側の一時障害、権限不足            | workflow再実行                                                    |
| Setup Node.js             | Node.js version、cache設定      | `node-version` と lock file                                     |
| Install dependencies      | package-lock不整合、依存関係エラー      | ローカルで `npm ci`                                                 |
| Lint                      | ESLintエラー                    | ローカルで `npm run lint`                                           |
| Type check                | TypeScriptエラー                | ローカルで `npm run typecheck`                                      |
| Build                     | Next.js buildエラー、環境変数不足      | ローカルで `npm run build`                                          |
| Configure AWS credentials | OIDC、Trust Policy、Role ARNミス | IAM Role と GitHub Secrets                                      |
| Deploy to S3              | S3バケット名、IAM権限、out不在          | `S3_BUCKET_NAME` と `s3:*` 権限                                   |
| Invalidate CloudFront     | Distribution ID、IAM権限        | `CLOUDFRONT_DISTRIBUTION_ID` と `cloudfront:CreateInvalidation` |


## 4. ローカルで再現する手順

GitHub Actionsのログだけで判断しない。

フロントエンドのエラーはローカルで同じコマンドを実行して再現する。

## 4.1 作業前確認

```bash
git status
git branch
```

期待結果：

```text
作業中の変更内容を把握できる
現在のブランチが確認できる
```

## 4.2 frontendで依存関係を確認

```bash
cd frontend
npm ci
```

期待結果：

```text
依存関係のインストールが成功する
```

失敗した場合：


| 原因                   | 対応                                            |
| -------------------- | --------------------------------------------- |
| package-lock.json不整合 | `package.json` と `package-lock.json` の差分を確認する |
| Node.js version不一致   | ローカルとGitHub ActionsのNode.js versionを揃える       |
| 依存パッケージ取得失敗          | もう一度実行し、継続する場合はエラー全文を確認する                     |


## 4.3 lint確認

```bash
npm run lint
```

期待結果：

```text
ESLintエラーが0件
```

失敗した場合：

```bash
npm run lint -- --debug
```

確認すること：

- 未使用import
- 未使用変数
- React Hooksの依存配列
- ESLint設定ファイル
- `.next` や `out` がlint対象に入っていないか

## 4.4 typecheck確認

```bash
npm run typecheck
```

期待結果：

```text
TypeScriptエラーが0件
```

失敗した場合に確認すること：

- 型定義のimport漏れ
- `null` と `undefined` の扱い
- `generateStaticParams()` の戻り値
- Next.js App Routerの型
- 動的ルートのparams型

## 4.5 build確認

```bash
npm run build
```

期待結果：

```text
out/ ディレクトリが生成される
```

確認コマンド：

```bash
ls -la out
ls -la out/index.html
```

期待結果：

```text
out/index.html が存在する
```

失敗した場合に確認すること：


| 原因             | 対応                                         |
| -------------- | ------------------------------------------ |
| `out/` が生成されない | `next.config.*` の `output: "export"` を確認する |
| 動的ルートで失敗       | `generateStaticParams()` があるか確認する          |
| 画像最適化エラー       | `images.unoptimized: true` を確認する           |
| 環境変数不足         | `.env.local` と GitHub Variables の差分を確認する   |
| API URL不正      | `NEXT_PUBLIC_API_BASE_URL` を確認する           |


## 5. AWS認証エラーの確認

`Configure AWS credentials` で失敗した場合は、OIDC、IAM Role、Trust Policy、GitHub Secretsを確認する。

## 5.1 よくあるエラー


| エラー                                                       | 主な原因                 |
| --------------------------------------------------------- | -------------------- |
| `Could not assume role with OIDC`                         | Trust Policy不一致      |
| `Not authorized to perform sts:AssumeRoleWithWebIdentity` | OIDC条件不一致            |
| `No OpenIDConnect provider found`                         | IAM OIDC Provider未作成 |
| `Request ARN is invalid`                                  | `AWS_ROLE_ARN` の値が不正 |
| `Access denied`                                           | IAM Policy不足         |


## 5.2 GitHub Secrets確認

GitHubで以下を確認する。

```text
Settings
  → Secrets and variables
  → Actions
```

必要なSecrets：


| Secret                       | 用途                               |
| ---------------------------- | -------------------------------- |
| `AWS_ROLE_ARN`               | GitHub Actionsが引き受けるIAM Role ARN |
| `S3_BUCKET_NAME`             | デプロイ先S3バケット名                     |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront Invalidation対象        |


注意：

```text
AWS_SECRET_ACCESS_KEY はOIDC方式では不要。
登録されている場合は、現在のworkflowで参照していないことを確認する。
```

## 5.3 GitHub Variables確認

必要なVariables：


| Variable                   | 用途                         |
| -------------------------- | -------------------------- |
| `AWS_REGION`               | AWS CLI実行リージョン             |
| `NEXT_PUBLIC_API_BASE_URL` | フロントエンドから呼ぶAPI Gateway URL |
| `NEXT_PUBLIC_SITE_URL`     | CloudFrontまたは独自ドメインURL     |


注意：

```text
NEXT_PUBLIC_ が付く値はブラウザに公開される。
秘密情報を入れない。
```

## 5.4 IAM RoleのTrust Policy確認

AWS CLIで確認する。

```bash
aws iam get-role \
  --role-name github-actions-deploy-role-prod \
  --query "Role.AssumeRolePolicyDocument" \
  --output json
```

確認ポイント：


| 項目        | 期待値                                                     |
| --------- | ------------------------------------------------------- |
| Federated | `token.actions.githubusercontent.com` のOIDC Provider    |
| aud       | `sts.amazonaws.com`                                     |
| sub       | `repo:<github-owner>/<repo-name>:ref:refs/heads/master` |


このプロジェクトでは本番ブランチは `master` を使う。

Trust Policyが `refs/heads/main` になっている場合、`master` に修正する。

期待するsub条件：

```json
"token.actions.githubusercontent.com:sub": "repo:<github-owner>/<repo-name>:ref:refs/heads/master"
```

## 5.5 Workflow permissions確認

`deploy-frontend.yml` に以下があることを確認する。

```yaml
permissions:
  id-token: write
  contents: read
```

`id-token: write` がない場合、OIDCでAWS認証できない。

## 6. S3 sync失敗時の確認

`Deploy to S3` で失敗した場合は、S3バケット名、IAM権限、build成果物を確認する。

## 6.1 GitHub Actionsログで見るエラー


| エラー                                           | 原因                              |
| --------------------------------------------- | ------------------------------- |
| `NoSuchBucket`                                | `S3_BUCKET_NAME` が間違っている        |
| `AccessDenied`                                | IAM PolicyにS3権限が不足              |
| `The user-provided path ./out does not exist` | buildが失敗、またはworking-directory違い |
| `InvalidAccessKeyId`                          | OIDCではなく古いアクセスキー設定が残っている可能性     |
| `PermanentRedirect`                           | バケットリージョンの不一致                   |


## 6.2 S3バケット名確認

GitHub Secretsの `S3_BUCKET_NAME` とAWS上のバケット名が一致しているか確認する。

```bash
aws s3 ls
```

期待結果：

```text
対象のS3バケットが一覧に表示される
```

## 6.3 outディレクトリ確認

GitHub Actions上では `frontend` をworking-directoryにしている場合、S3 sync対象は以下になる。

```text
frontend/out
```

ローカルで確認する。

```bash
cd frontend
npm run build
ls -la out
```

## 6.4 IAM Policy確認

GitHub Actions用Roleに最低限以下があることを確認する。

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:ListBucket"
  ],
  "Resource": "arn:aws:s3:::<bucket-name>"
}
```

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:DeleteObject"
  ],
  "Resource": "arn:aws:s3:::<bucket-name>/*"
}
```

付与してはいけない権限：

```text
AdministratorAccess
s3:* を全リソースに付与
iam:*
```

## 6.5 S3 syncのローカル確認

本番S3へ直接syncする前に、build成果物だけ確認する。

```bash
cd frontend
npm run build
ls -la out
```

AWS CLIで接続確認だけ行う。

```bash
aws sts get-caller-identity
aws s3 ls s3://<bucket-name>
```

本番S3へ手動syncする場合は、差分を確認してから実行する。

```bash
aws s3 sync ./out s3://<bucket-name> --delete --dryrun
```

出力内容を確認して問題がなければ、必要な場合のみ実行する。

```bash
aws s3 sync ./out s3://<bucket-name> --delete
```

## 7. CloudFront Invalidation失敗時の確認

`Invalidate CloudFront` で失敗した場合は、Distribution IDとIAM権限を確認する。

## 7.1 よくあるエラー


| エラー                  | 原因                                   |
| -------------------- | ------------------------------------ |
| `NoSuchDistribution` | Distribution IDが間違っている               |
| `AccessDenied`       | `cloudfront:CreateInvalidation` 権限不足 |
| `InvalidArgument`    | Invalidation pathが不正                 |
| `Throttling`         | 短時間にInvalidationを実行しすぎている            |


## 7.2 Distribution ID確認

```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[].{Id:Id,DomainName:DomainName,Status:Status}" \
  --output table
```

期待結果：

```text
対象のCloudFront Distribution IDが表示される
Status が Deployed
```

## 7.3 IAM Policy確認

GitHub Actions用Roleに以下があることを確認する。

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:CreateInvalidation"
  ],
  "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"
}
```

## 7.4 手動Invalidation確認

必要な場合のみ実行する。

```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

注意：

```text
/* のInvalidationを高頻度で実行しない。
MVPではデプロイ頻度が低いため許容するが、記事更新が増えたら変更ファイル単位のInvalidationを検討する。
```

## 8. デプロイは成功したが画面が古い場合

GitHub Actionsが成功しているのにCloudFrontで古い画面が表示される場合は、キャッシュまたはS3反映を確認する。

## 8.1 確認順序

1. GitHub Actionsの `Deploy to S3` が成功しているか確認する
2. GitHub Actionsの `Invalidate CloudFront` が成功しているか確認する
3. S3に最新の `index.html` があるか確認する
4. CloudFront Invalidationのステータスを確認する
5. ブラウザキャッシュを避けて確認する

## 8.2 CloudFront確認

```bash
curl -I https://<cloudfront-domain>
```

期待結果：

```text
HTTP/2 200
```

## 8.3 S3上のindex.html確認

```bash
aws s3 ls s3://<bucket-name>/index.html
```

期待結果：

```text
index.html が存在する
更新日時が直近デプロイ時刻に近い
```

## 8.4 Invalidation確認

```bash
aws cloudfront list-invalidations \
  --distribution-id <distribution-id> \
  --output table
```

期待結果：

```text
直近のInvalidationがCompleted
```

## 9. 本番サイトが403 / 404になった場合

CloudFront URLでサイト全体が403または404になる場合は、S3、OAC、Bucket Policy、Default root objectを確認する。

## 9.1 403の場合

主な原因：


| 原因                       | 対応                                    |
| ------------------------ | ------------------------------------- |
| S3 Bucket Policy不正       | CloudFront Distribution ARNを確認する      |
| OAC設定ミス                  | CloudFront Origin Access Controlを確認する |
| S3 Public Access Block変更 | Public Access Blockは有効のまま、OAC経由許可にする  |
| `index.html` が存在しない      | buildとS3 syncを確認する                    |


## 9.2 404の場合

主な原因：


| 原因                                | 対応                             |
| --------------------------------- | ------------------------------ |
| `index.html` 不在                   | `out/index.html` とS3配置を確認する    |
| Next.js静的export漏れ                 | `generateStaticParams()` を確認する |
| CloudFront Default root object未設定 | `index.html` が設定されているか確認する     |
| SPA/静的HTMLのエラーページ設定不足             | CloudFront Error Pagesを確認する    |


## 10. ロールバック手順

本番表示に影響がある場合は、Git revertで前の状態へ戻す。

## 10.1 問題commitを確認

```bash
git log --oneline -10
```

## 10.2 revert用ブランチを作成

```bash
git checkout master
git pull origin master
git checkout -b fix/revert-deploy-failure
```

## 10.3 問題commitをrevert

```bash
git revert <commit-hash>
```

コンフリクトが出た場合：

```bash
git status
```

対象ファイルを修正後：

```bash
git add .
git revert --continue
```

## 10.4 ローカル確認

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm run build
```

期待結果：

```text
lint / typecheck / build がすべて成功する
out/ が生成される
```

## 10.5 PR作成

以下をPR本文に記載する。

```markdown
## 概要

デプロイ失敗の原因となった変更をrevertしました。

## 原因

- 該当commit：
- 失敗ステップ：
- エラー概要：

## 対応内容

- 問題commitをrevert
- ローカルでlint/typecheck/build確認

## 動作確認

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm run build
```

## 確認結果

- GitHub Actions CI：
- Deploy Frontend：
- CloudFront表示：

```

## 11. 秘密情報をログに出さないルール

GitHub Actionsやローカル確認で以下を表示しない。

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
GitHub Token
APIキー
JWT_SECRET
DATABASE_PASSWORD
```

禁止例：

```yaml
- run: echo ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

禁止例：

```bash
env
printenv
```

理由：

```text
GitHub Actionsログに秘密情報が出ると、認証情報漏えいにつながるため。
```

## 12. 失敗内容の記録テンプレート

デプロイ失敗が発生した場合は、`docs/operations/incident-log.md` に以下の形式で記録する。

```markdown
## YYYY-MM-DD デプロイ失敗

### 発生内容

- Workflow：
- 失敗ステップ：
- エラー概要：

### 影響範囲

- 本番サイト表示：
- 問い合わせフォーム：
- CloudFront URL：

### 原因

-

### 対応内容

-

### 再発防止策

-

### 学び

-
```

## 13. 判断基準

## 13.1 すぐ復旧対応するケース

以下はすぐ対応する。


| 状況                   | 理由                               |
| -------------------- | -------------------------------- |
| CloudFrontでサイト全体が403 | 本番サイトが見られないため                    |
| CloudFrontでサイト全体が404 | 本番サイトが見られないため                    |
| masterへのデプロイが連続失敗    | 本番更新が止まるため                       |
| AWS認証エラー             | OIDC / IAM設定ミスの可能性があるため          |
| S3 syncでファイル削除が大量発生  | `--delete` により本番ファイルが消える可能性があるため |


## 13.2 当日中に対応するケース


| 状況               | 理由                  |
| ---------------- | ------------------- |
| 一部ページだけ表示崩れ      | 影響範囲が限定的なため         |
| Invalidationだけ失敗 | S3反映済みなら再実行で復旧できるため |
| lint/typecheck失敗 | 本番反映前に止まっているため      |
| build失敗          | 本番反映前に止まっているため      |


## 14. 復旧後の確認

復旧後は以下を確認する。

```bash
curl -I https://<cloudfront-domain>
```

期待結果：

```text
HTTP/2 200
```

ブラウザで確認するページ：


| URL              | 確認内容           |
| ---------------- | -------------- |
| `/`              | トップページが表示される   |
| `/terms`         | 用語集が表示される      |
| `/questions`     | 模擬問題ページが表示される  |
| `/architectures` | 構成図ページが表示される   |
| `/blog`          | ブログ一覧が表示される    |
| `/contact`       | 問い合わせページが表示される |


GitHub Actionsで確認すること：


| 項目                    | 期待結果    |
| --------------------- | ------- |
| Deploy Frontend       | success |
| Deploy to S3          | success |
| Invalidate CloudFront | success |


AWSで確認すること：


| 項目            | 期待結果                             |
| ------------- | -------------------------------- |
| S3            | `index.html` が存在する               |
| CloudFront    | Distribution Status が `Deployed` |
| Invalidation  | Status が `Completed`             |
| Cost Explorer | 想定外のサービス費用がない                    |


## 15. 完了条件

このRunbookの完了条件は以下である。

- デプロイ失敗時の確認順序が書かれている
- 失敗ステップ別の原因と対応が書かれている
- ローカル再現コマンドが書かれている
- OIDC / IAM / Secrets / Variables の確認項目が書かれている
- S3 sync失敗時の確認項目が書かれている
- CloudFront Invalidation失敗時の確認項目が書かれている
- ロールバック手順が書かれている
- 秘密情報をログに出さないルールが書かれている

