AWS資格学習サイト CI/CD設計書

1. 文書情報

|   |   |
|---|---|
|項目|内容|
|文書名|AWS資格学習サイト CI/CD設計書|
|対象プロダクト|AWS資格ロードマップラボ|
|対象フェーズ|MVP開発 〜 Phase 4 学習アプリ化|
|目的|GitHub Actionsを用いて、フロントエンド・Lambda・インフラを安全かつ低コストにデプロイする方針を定義する|
|対象リポジトリ|GitHub Repository|
|CI/CD基盤|GitHub Actions|
|デプロイ先|Amazon S3 / Amazon CloudFront / AWS Lambda / Amazon API Gateway / DynamoDB|

  

2. 本設計書の目的

本設計書では、AWS資格学習サイト「AWS資格ロードマップラボ」のCI/CD設計を定義する。

MVPでは、まず以下の自動化を対象とする。

GitHub mainブランチへpush

  ↓

GitHub Actions起動

  ↓

フロントエンドのLint / Build

  ↓

Next.js静的ファイル生成

  ↓

S3へアップロード

  ↓

CloudFrontキャッシュ無効化

  ↓

本番サイトへ反映

MVPで自動化する対象は、原則としてフロントエンド静的サイトのデプロイである。

Lambda/API Gateway/DynamoDBなどのバックエンド・インフラ自動デプロイは、Phase 2以降で段階的に導入する。

理由：

- MVP初期は構成を単純にするため
- 課金事故や誤削除を避けるため
- AWSコンソール操作で各サービス理解を深めるため
- まず公開実績を優先するため

  

3. CI/CD基本方針

3.1 基本方針

|   |   |
|---|---|
|方針|内容|
|MVPはフロントエンド自動デプロイ中心|S3 + CloudFrontへの静的ファイル配信を自動化する|
|mainブランチのみ本番デプロイ|featureブランチやPRでは本番反映しない|
|PRでは検証のみ|lint、typecheck、buildのみ実行する|
|AWS認証はOIDC推奨|長期アクセスキーをGitHub Secretsに置かない構成を目指す|
|初期はアクセスキー方式も許容|学習初期は簡単な方式で動かしてもよいが、最終的にOIDC化する|
|IAM最小権限|GitHub ActionsにはS3デプロイとCloudFront Invalidationのみ許可する|
|Invalidation乱発禁止|CloudFrontキャッシュ無効化はmainデプロイ時のみ|
|Lambda自動デプロイは後回し|MVP公開後、SAM化してから導入する|
|インフラ削除系権限は付与しない|GitHub ActionsからIAM/RDS/EC2等を操作させない|
|デプロイ結果をREADMEで説明可能にする|ポートフォリオとしてCI/CD構成を説明できる状態にする|

  

4. CI/CD対象範囲

4.1 MVP対象

|   |   |   |
|---|---|---|
|対象|自動化|内容|
|フロントエンドLint|対象|コード品質チェック|
|TypeScript型チェック|対象|型エラー検出|
|フロントエンドBuild|対象|Next.js静的ビルド|
|S3デプロイ|対象|out/ をS3へsync|
|CloudFront Invalidation|対象|デプロイ後にキャッシュ無効化|
|Lambdaデプロイ|対象外|MVPでは手動または別途実施|
|DynamoDB作成|対象外|MVPでは手動構築|
|API Gateway作成|対象外|MVPでは手動構築|
|CloudFront作成|対象外|MVPでは手動構築|

4.2 Phase 2以降の対象

|   |   |   |
|---|---|---|
|対象|自動化|内容|
|Lambda zipデプロイ|Phase 2|Lambdaコード更新を自動化|
|SAMデプロイ|Phase 2以降|API Gateway / Lambda / DynamoDBをIaC管理|
|テスト自動実行|Phase 2|Lambdaユニットテスト|
|dev/prod環境分離|Phase 3以降|検証環境と本番環境の分離|
|Cognito関連|Phase 4|学習アプリ化時に検討|

  

5. 全体CI/CD構成

5.1 MVP構成図

flowchart TD

    Dev[開発者]

    GH[GitHub Repository]

    Actions[GitHub Actions]

    Build[Lint / TypeCheck / Build]

    OIDC[GitHub OIDC or Secrets]

    IAM[IAM Deploy Role]

    S3[(S3 Bucket)]

    CF[CloudFront]

    User[ユーザー]

  

    Dev -->|push / pull request| GH

    GH -->|trigger| Actions

    Actions --> Build

    Actions -->|Assume Role or Access Key| OIDC

    OIDC --> IAM

    IAM -->|aws s3 sync| S3

    IAM -->|create-invalidation| CF

    User -->|HTTPS| CF

    CF --> S3

5.2 MVP処理フロー

1. 開発者がfeatureブランチで作業する

2. GitHubへpushする

3. Pull Requestを作成する

4. GitHub Actionsでlint/typecheck/buildを実行する

5. 問題なければmainへmergeする

6. mainへのpushをトリガーに本番デプロイWorkflowが起動する

7. frontendをビルドする

8. out/配下をS3へsyncする

9. CloudFront Invalidationを実行する

10. CloudFront経由で本番サイトを確認する

  

11. ブランチ戦略

6.1 MVPブランチ構成

|   |   |   |
|---|---|---|
|ブランチ|用途|デプロイ|
|main|本番反映用|本番S3へデプロイ|
|feature/*|機能開発|デプロイなし|
|fix/*|不具合修正|デプロイなし|
|docs/*|ドキュメント修正|デプロイなし。ただしmain merge後は反映|

6.2 基本運用

featureブランチで作業

  ↓

Pull Request作成

  ↓

CI実行

  ↓

レビューまたは自己確認

  ↓

mainへmerge

  ↓

本番デプロイ

6.3 MVPでは採用しない複雑な戦略

MVPでは以下は使わない。

|   |   |
|---|---|
|戦略|採用しない理由|
|Git Flow|個人開発には重い|
|releaseブランチ|MVPでは不要|
|hotfixブランチ厳格運用|小規模では過剰|
|複数環境同時デプロイ|コスト・管理負荷が増える|

  

7. GitHub Actions Workflow一覧

7.1 MVP Workflow

|   |   |   |   |
|---|---|---|---|
|Workflow|ファイル|トリガー|目的|
|CI|.github/workflows/ci.yml|pull_request / push|lint/typecheck/build|
|Deploy Frontend|.github/workflows/deploy-frontend.yml|main push / manual|S3 + CloudFrontへデプロイ|

7.2 Phase 2以降のWorkflow

|   |   |   |   |
|---|---|---|---|
|Workflow|ファイル|トリガー|目的|
|Deploy Lambda|.github/workflows/deploy-lambda.yml|backend変更時|Lambda zipデプロイ|
|Deploy SAM|.github/workflows/deploy-sam.yml|infra変更時|SAMデプロイ|
|Security Check|.github/workflows/security.yml|pull_request|依存関係・秘密情報チェック|
|Content Validate|.github/workflows/content-validate.yml|pull_request|JSON/MDXの形式チェック|

  

8. CI設計

8.1 CIの目的

Pull Requestやpush時に、最低限以下を検証する。

- 依存関係のインストールが成功する
- ESLintが通る
- TypeScript型チェックが通る
- Next.js buildが成功する
- 静的出力が生成される

8.2 CIトリガー

on:

  pull_request:

    branches:

      - main

  push:

    branches:

      - main

      - 'feature/**'

      - 'fix/**'

      - 'docs/**'

8.3 CI処理内容

1. checkout

2. Node.jsセットアップ

3. 依存関係インストール

4. lint

5. typecheck

6. build

8.4 ci.yml例 npm版

name: CI

  

on:

  pull_request:

    branches:

      - main

  push:

    branches:

      - main

      - 'feature/**'

      - 'fix/**'

      - 'docs/**'

  

jobs:

  frontend-ci:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: npm

          cache-dependency-path: frontend/package-lock.json

  

      - name: Install dependencies

        run: npm ci

  

      - name: Lint

        run: npm run lint

  

      - name: Type check

        run: npm run typecheck

  

      - name: Build

        run: npm run build

8.5 ci.yml例 pnpm版

name: CI

  

on:

  pull_request:

    branches:

      - main

  push:

    branches:

      - main

      - 'feature/**'

      - 'fix/**'

      - 'docs/**'

  

jobs:

  frontend-ci:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup pnpm

        uses: pnpm/action-setup@v4

        with:

          version: 9

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: pnpm

          cache-dependency-path: frontend/pnpm-lock.yaml

  

      - name: Install dependencies

        run: pnpm install --frozen-lockfile

  

      - name: Lint

        run: pnpm lint

  

      - name: Type check

        run: pnpm typecheck

  

      - name: Build

        run: pnpm build

8.6 package.json scripts例

{

  "scripts": {

    "dev": "next dev",

    "build": "next build",

    "lint": "next lint",

    "typecheck": "tsc --noEmit"

  }

}

8.7 CI完了条件

|   |   |
|---|---|
|ID|条件|
|CI-001|Pull Request作成時にCIが実行される|
|CI-002|lintが成功する|
|CI-003|typecheckが成功する|
|CI-004|buildが成功する|
|CI-005|CI失敗時にmainへmergeしない|

  

9. CD設計：フロントエンドデプロイ

9.1 CDの目的

mainブランチへ反映されたコードを、自動でS3 + CloudFrontへデプロイする。

9.2 CDトリガー

|   |   |
|---|---|
|トリガー|内容|
|push to main|自動デプロイ|
|workflow_dispatch|手動デプロイ|

9.3 CD処理内容

1. checkout

2. Node.jsセットアップ

3. 依存関係インストール

4. lint

5. typecheck

6. build

7. AWS認証

8. S3 sync

9. CloudFront Invalidation

10. デプロイ結果表示

9.4 AWSデプロイ方式

MVPでは2種類の方式を定義する。

|   |   |   |
|---|---|---|
|方式|推奨度|内容|
|OIDC方式|推奨|GitHub ActionsがAWS IAM Roleを一時認証でAssumeRoleする|
|アクセスキー方式|初期のみ許容|AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEYをGitHub Secretsに保存する|

  

10. AWS認証方式：OIDC推奨

10.1 OIDC方式の目的

GitHub ActionsからAWSへアクセスする際に、長期アクセスキーをGitHub Secretsに保存しない。

OIDC方式では、GitHub Actionsが一時的なトークンを使ってAWS IAM Roleを引き受ける。

10.2 OIDC方式のメリット

|   |   |
|---|---|
|メリット|内容|
|長期アクセスキー不要|GitHubにAWS_SECRET_ACCESS_KEYを保存しない|
|漏えいリスク低下|一時認証情報を利用する|
|権限管理しやすい|IAM Roleに最小権限を付与できる|
|ポートフォリオ評価が高い|セキュリティ意識を説明しやすい|

10.3 OIDC構成要素

|   |   |
|---|---|
|要素|内容|
|GitHub OIDC Provider|AWS IAMにGitHubを信頼するIDプロバイダーとして登録|
|IAM Role|GitHub ActionsがAssumeRoleするロール|
|Trust Policy|特定リポジトリ・ブランチからのみAssumeRole許可|
|Workflow permissions|id-token: write を付与|
|aws-actions/configure-aws-credentials|OIDCでAWS認証するAction|

10.4 IAM OIDC Provider作成手順概要

1. IAMコンソールを開く

2. Identity providersを選択

3. Add providerを選択

4. OpenID Connectを選択

5. Provider URLに https://token.actions.githubusercontent.com を入力

6. Audienceに sts.amazonaws.com を入力

7. 作成する

10.5 GitHub Actions用IAM Role作成

Role名例：

github-actions-deploy-role-prod

10.6 Trust Policy例

<account-id>、<github-owner>、<repo-name> を置換する。

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Effect": "Allow",

      "Principal": {

        "Federated": "arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com"

      },

      "Action": "sts:AssumeRoleWithWebIdentity",

      "Condition": {

        "StringEquals": {

          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"

        },

        "StringLike": {

          "token.actions.githubusercontent.com:sub": "repo:<github-owner>/<repo-name>:ref:refs/heads/main"

        }

      }

    }

  ]

}

10.7 補足：environmentを使う場合

GitHub Environmentsを使う場合、OIDCのsub条件が変わる場合がある。

最初はmainブランチ条件で始める。

将来的にproduction environmentを使う場合は、Trust Policyを見直す。

  

11. GitHub Actions用IAM権限

11.1 必要権限

フロントエンドデプロイに必要な権限のみ付与する。

|   |   |
|---|---|
|権限|用途|
|s3:ListBucket|S3 sync時に差分確認|
|s3:PutObject|ファイルアップロード|
|s3:DeleteObject|--delete 使用時に不要ファイル削除|
|cloudfront:CreateInvalidation|CloudFrontキャッシュ無効化|

11.2 IAM Policy例

<bucket-name>、<account-id>、<distribution-id> を置換する。

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Sid": "AllowListDeployBucket",

      "Effect": "Allow",

      "Action": [

        "s3:ListBucket"

      ],

      "Resource": "arn:aws:s3:::<bucket-name>"

    },

    {

      "Sid": "AllowWriteDeployBucketObjects",

      "Effect": "Allow",

      "Action": [

        "s3:PutObject",

        "s3:DeleteObject"

      ],

      "Resource": "arn:aws:s3:::<bucket-name>/*"

    },

    {

      "Sid": "AllowCloudFrontInvalidation",

      "Effect": "Allow",

      "Action": [

        "cloudfront:CreateInvalidation"

      ],

      "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

    }

  ]

}

11.3 付与しない権限

|   |   |
|---|---|
|権限|理由|
|AdministratorAccess|権限過多|
|iam:*|権限昇格リスク|
|s3:*|対象外バケット操作リスク|
|cloudfront:*|Distribution変更・削除などが可能になり危険|
|dynamodb:*|フロントデプロイには不要|
|lambda:*|フロントデプロイには不要|
|apigateway:*|フロントデプロイには不要|
|ec2:*|不要|
|rds:*|不要|

  

12. GitHub Secrets / Variables設計

12.1 OIDC方式で必要なSecrets / Variables

OIDC方式では、AWSアクセスキーは不要。

|   |   |   |
|---|---|---|
|種別|名前|内容|
|Secret or Variable|AWS_ROLE_ARN|AssumeRoleするIAM Role ARN|
|Variable|AWS_REGION|ap-northeast-1|
|Secret or Variable|S3_BUCKET_NAME|デプロイ先S3バケット名|
|Secret or Variable|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|
|Variable|NEXT_PUBLIC_API_BASE_URL|API Gateway URL|
|Variable|NEXT_PUBLIC_SITE_URL|サイトURL|

12.2 アクセスキー方式で必要なSecrets

初期のみ許容。

|   |   |
|---|---|
|Secret名|内容|
|AWS_ACCESS_KEY_ID|デプロイ用IAMユーザーのアクセスキー|
|AWS_SECRET_ACCESS_KEY|デプロイ用IAMユーザーのシークレット|
|AWS_REGION|ap-northeast-1|
|S3_BUCKET_NAME|デプロイ先S3バケット名|
|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|

12.3 Secretsに入れてはいけないもの

|   |   |
|---|---|
|値|理由|
|rootユーザーのアクセスキー|作成自体しない|
|個人メールパスワード|不要|
|DynamoDBデータ|秘密情報ではなくデータ本体|
|JWT|実行時に発行されるもの|
|問い合わせデータ|GitHubに保存しない|

12.4 VariablesとSecretsの使い分け

|   |   |   |
|---|---|---|
|種別|例|方針|
|Secret|AWS_SECRET_ACCESS_KEY|秘密情報|
|Secret|AWS_ROLE_ARN|秘密でなくても隠したい値|
|Variable|AWS_REGION|公開されても問題ない値|
|Variable|NEXT_PUBLIC_SITE_URL|公開前提の値|

  

13. Deploy Frontend Workflow：OIDC版

13.1 deploy-frontend.yml

name: Deploy Frontend

  

on:

  push:

    branches:

      - main

    paths:

      - 'frontend/**'

      - '.github/workflows/deploy-frontend.yml'

  workflow_dispatch:

  

permissions:

  id-token: write

  contents: read

  

jobs:

  deploy-frontend:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: npm

          cache-dependency-path: frontend/package-lock.json

  

      - name: Install dependencies

        run: npm ci

  

      - name: Lint

        run: npm run lint

  

      - name: Type check

        run: npm run typecheck

  

      - name: Build

        run: npm run build

        env:

          NEXT_PUBLIC_API_BASE_URL: ${{ vars.NEXT_PUBLIC_API_BASE_URL }}

          NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL }}

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: Deploy to S3

        run: |

          aws s3 sync ./out s3://${{ secrets.S3_BUCKET_NAME }} --delete

  

      - name: Invalidate CloudFront

        run: |

          aws cloudfront create-invalidation \

            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

            --paths "/*"

13.2 重要ポイント

|   |   |
|---|---|
|項目|内容|
|permissions.id-token|OIDC利用に必要|
|role-to-assume|AWS側のIAM Role ARN|
|paths|frontend変更時のみデプロイ|
|aws s3 sync --delete|S3とoutを同期し、不要ファイルを削除|
|create-invalidation|CloudFrontキャッシュを無効化|

13.3 OIDC版の受け入れ条件

|   |   |
|---|---|
|ID|条件|
|CD-OIDC-001|GitHub SecretsにAWS_SECRET_ACCESS_KEYがない|
|CD-OIDC-002|id-token: write が設定されている|
|CD-OIDC-003|IAM RoleをAssumeRoleできる|
|CD-OIDC-004|mainブランチからのみデプロイできる|
|CD-OIDC-005|S3へsyncできる|
|CD-OIDC-006|CloudFront Invalidationできる|

  

14. Deploy Frontend Workflow：アクセスキー版

14.1 位置づけ

アクセスキー版は初期学習・動作確認用として許容する。

ただし、最終的にはOIDC方式へ移行する。

14.2 deploy-frontend.yml

name: Deploy Frontend

  

on:

  push:

    branches:

      - main

    paths:

      - 'frontend/**'

      - '.github/workflows/deploy-frontend.yml'

  workflow_dispatch:

  

permissions:

  contents: read

  

jobs:

  deploy-frontend:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: npm

          cache-dependency-path: frontend/package-lock.json

  

      - name: Install dependencies

        run: npm ci

  

      - name: Lint

        run: npm run lint

  

      - name: Type check

        run: npm run typecheck

  

      - name: Build

        run: npm run build

        env:

          NEXT_PUBLIC_API_BASE_URL: ${{ vars.NEXT_PUBLIC_API_BASE_URL }}

          NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL }}

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}

          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: Deploy to S3

        run: |

          aws s3 sync ./out s3://${{ secrets.S3_BUCKET_NAME }} --delete

  

      - name: Invalidate CloudFront

        run: |

          aws cloudfront create-invalidation \

            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

            --paths "/*"

14.3 アクセスキー方式の注意点

|   |   |
|---|---|
|注意点|内容|
|長期キー漏えいリスク|GitHub Secretsに保存しても漏えいリスクはゼロではない|
|rootキー禁止|rootユーザーのアクセスキーは絶対に使わない|
|最小権限|デプロイ用IAMユーザーにはS3/CloudFront最小権限のみ|
|定期削除|OIDC移行後はアクセスキーを削除する|
|ローテーション|長期利用するなら定期的に更新する|

  

15. CloudFront Invalidation設計

15.1 目的

S3へアップロードした最新ファイルをCloudFront経由で反映する。

15.2 初期方針

MVPでは以下でよい。

aws cloudfront create-invalidation \

  --distribution-id <distribution-id> \

  --paths "/*"

15.3 コスト・運用上の注意

/* のInvalidationは便利だが、頻繁に実行しすぎない。

MVPではデプロイ頻度が少ないため許容する。

本格運用では以下を検討する。

|   |   |
|---|---|
|改善案|内容|
|hash付きファイル名|JS/CSS/assetsはファイル名変更でキャッシュ更新|
|HTMLのみ無効化|/index.html、主要HTMLのみInvalidation|
|デプロイ頻度制御|main merge時のみ実行|
|手動実行|workflow_dispatchのみで実行する選択肢|

15.4 将来のInvalidation最適化例

aws cloudfront create-invalidation \

  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \

  --paths "/index.html" "/terms/*" "/blog/*"

  

16. S3 sync設計

16.1 基本コマンド

aws s3 sync ./out s3://<bucket-name> --delete

16.2

--delete

の意味

ローカルの out/ に存在しないファイルをS3側から削除する。

メリット：

- 古いページが残らない
- 削除済み記事がS3に残らない
- 本番とビルド成果物の整合性が保てる

注意点：

- 出力ディレクトリを間違えるとS3側を意図せず削除する危険がある
- 必ず working-directory: frontend と ./out を確認する
- デプロイ先バケット名を間違えない

16.3 キャッシュ制御の将来案

HTMLと静的アセットでCache-Controlを分けると、CloudFront運用が安定する。

HTML

aws s3 sync ./out s3://$S3_BUCKET_NAME \

  --exclude "*" \

  --include "*.html" \

  --cache-control "no-cache"

assets

aws s3 sync ./out s3://$S3_BUCKET_NAME \

  --exclude "*.html" \

  --cache-control "public,max-age=31536000,immutable"

MVPでは複雑にしすぎず、まず通常のsyncでよい。

  

17. Next.js静的出力設計

17.1 next.config設定

const nextConfig = {

  output: 'export',

  images: {

    unoptimized: true,

  },

};

  

export default nextConfig;

17.2 注意点

|   |   |
|---|---|
|項目|注意|
|API Routes|静的exportでは使わない|
|Server Actions|静的サイトでは使わない|
|dynamic rendering|静的生成できる設計にする|
|next/image|静的exportでは unoptimized: true を設定|
|問い合わせAPI|Next.js API Routesではなく、API Gateway + Lambdaを使う|

17.3 build成果物

frontend/out/

├── index.html

├── terms/

├── questions/

├── contact/

├── _next/

└── images/

17.4 CIで確認すべきこと

|   |   |
|---|---|
|項目|確認|
|out/ が生成される|必須|
|index.htmlがある|必須|
|主要ページのHTMLがある|必須|
|画像が含まれている|必須|

  

18. 環境変数設計

18.1 フロントエンド環境変数

|   |   |   |
|---|---|---|
|変数|内容|公開可否|
|NEXT_PUBLIC_API_BASE_URL|API Gateway URL|公開可|
|NEXT_PUBLIC_SITE_URL|CloudFront URLまたは独自ドメイン|公開可|

18.2 GitHub Variables例

|   |   |
|---|---|
|Variable|例|
|AWS_REGION|ap-northeast-1|
|NEXT_PUBLIC_API_BASE_URL|https://xxxxx.execute-api.ap-northeast-1.amazonaws.com|
|NEXT_PUBLIC_SITE_URL|https://xxxxx.cloudfront.net|

18.3 GitHub Secrets例

|   |   |
|---|---|
|Secret|例|
|AWS_ROLE_ARN|arn:aws:iam:::role/github-actions-deploy-role-prod|
|S3_BUCKET_NAME|aws-cert-roadmap-lab-prod-vincent-2026|
|CLOUDFRONT_DISTRIBUTION_ID|EXXXXXXXXXXXXX|

18.4 注意点

NEXT_PUBLIC_ が付く変数はブラウザに公開される。

以下は絶対に入れない。

AWS_SECRET_ACCESS_KEY

OPENAI_API_KEY

DATABASE_PASSWORD

JWT_SECRET

  

19. パスフィルタ設計

19.1 目的

不要なWorkflow実行を減らし、CI/CD時間と無駄なデプロイを抑える。

19.2 フロントエンドデプロイ対象

paths:

  - 'frontend/**'

  - '.github/workflows/deploy-frontend.yml'

19.3 ドキュメントのみ変更時の扱い

設計書だけを変更した場合、本番サイトに反映する必要がなければデプロイしない。

ただし、設計書をサイト内コンテンツとして公開する場合は、frontend/contents/** に含まれるためデプロイ対象になる。

19.4 将来のbackendパス

paths:

  - 'backend/**'

  - 'infra/**'

  - '.github/workflows/deploy-sam.yml'

  

20. Lambda CI/CD Phase 2

20.1 MVPで後回しにする理由

MVPではLambda自動デプロイを必須にしない。

理由：

- 最初はAWSコンソールで動作理解した方が学習になる
- Lambdaコード変更頻度が低い
- SAM化前に自動化すると構成が中途半端になる
- 誤って本番APIを壊すリスクを避ける

20.2 Phase 2での選択肢

|   |   |   |
|---|---|---|
|方式|内容|推奨度|
|zipデプロイ|Lambdaコードをzip化してupdate-function-code|中|
|SAMデプロイ|template.yamlでAPI/Lambda/DynamoDBを管理|高|
|CDK|TypeScript/PythonでIaC管理|中|
|Terraform|汎用IaCとして管理|中〜高|

20.3 zipデプロイWorkflow例

name: Deploy Lambda Contact

  

on:

  push:

    branches:

      - main

    paths:

      - 'backend/functions/contact_submit/**'

      - '.github/workflows/deploy-lambda-contact.yml'

  workflow_dispatch:

  

permissions:

  id-token: write

  contents: read

  

jobs:

  deploy-lambda:

    runs-on: ubuntu-latest

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: Package Lambda

        working-directory: backend/functions/contact_submit

        run: |

          zip -r contact_submit.zip .

  

      - name: Deploy Lambda

        run: |

          aws lambda update-function-code \

            --function-name contact-submit-prod \

            --zip-file fileb://backend/functions/contact_submit/contact_submit.zip

20.4 zipデプロイ追加権限

Lambdaデプロイを自動化する場合、GitHub Actions Roleに以下が必要になる。

{

  "Effect": "Allow",

  "Action": [

    "lambda:UpdateFunctionCode"

  ],

  "Resource": "arn:aws:lambda:ap-northeast-1:<account-id>:function:contact-submit-prod"

}

20.5 注意点

フロントエンドデプロイRoleとLambdaデプロイRoleは分けてもよい。

セキュリティを重視するなら以下に分離する。

|   |   |
|---|---|
|Role|用途|
|github-actions-frontend-deploy-role|S3 + CloudFrontのみ|
|github-actions-backend-deploy-role|Lambda更新のみ|
|github-actions-infra-deploy-role|SAM/CloudFormationのみ|

  

21. SAM CI/CD Phase 2以降

21.1 SAM化の目的

API Gateway、Lambda、DynamoDBなどのバックエンドリソースをコードで管理する。

21.2 対象

|   |   |
|---|---|
|リソース|SAM管理|
|Lambda contact-submit-prod|対象|
|API Gateway POST /contact|対象|
|DynamoDB ContactsTableProd|対象|
|Lambda IAM Role|対象|
|CloudWatch Logs Retention|対象化検討|

21.3 deploy-sam.yml例

name: Deploy SAM Backend

  

on:

  push:

    branches:

      - main

    paths:

      - 'backend/**'

      - 'infra/**'

      - '.github/workflows/deploy-sam.yml'

  workflow_dispatch:

  

permissions:

  id-token: write

  contents: read

  

jobs:

  deploy-sam:

    runs-on: ubuntu-latest

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Python

        uses: actions/setup-python@v5

        with:

          python-version: '3.11'

  

      - name: Setup SAM CLI

        uses: aws-actions/setup-sam@v2

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          role-to-assume: ${{ secrets.AWS_BACKEND_ROLE_ARN }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: SAM Build

        working-directory: infra

        run: sam build

  

      - name: SAM Deploy

        working-directory: infra

        run: |

          sam deploy \

            --no-confirm-changeset \

            --no-fail-on-empty-changeset \

            --stack-name aws-cert-roadmap-lab-backend-prod \

            --capabilities CAPABILITY_IAM \

            --region ${{ vars.AWS_REGION }}

21.4 SAMデプロイの注意点

|   |   |
|---|---|
|注意点|内容|
|CAPABILITY_IAM|IAM Roleを作成・変更するため必要|
|Stack削除注意|誤って削除するとAPI/DynamoDBが消える可能性|
|DynamoDB削除保護|本格運用前にDeletionPolicy検討|
|dev/prod分離|Phase 3以降で検討|

  

22. セキュリティ設計

22.1 GitHub Actionsセキュリティ方針

|   |   |
|---|---|
|項目|方針|
|OIDC|推奨|
|Secrets最小化|AWS_SECRET_ACCESS_KEYを可能なら使わない|
|権限最小化|Workflow permissionsを必要最小限にする|
|main限定|本番デプロイはmainのみ|
|Role trust制限|特定repo・branchのみAssumeRole可能|
|IAM分離|frontend/backend/infraでRole分離を検討|
|ログ注意|Secretsをechoしない|

22.2 Workflow permissions

OIDCデプロイでは以下を設定する。

permissions:

  id-token: write

  contents: read

PRのCIでは基本的に以下でよい。

permissions:

  contents: read

22.3 Pull Request from forkの扱い

個人開発ではfork PRは基本想定しない。

将来OSS化する場合、外部PRにSecretsを渡さないよう注意する。

22.4 Secrets出力禁止

悪い例：

- run: echo ${{ secrets.AWS_SECRET_ACCESS_KEY }}

このような処理は絶対に行わない。

  

23. コスト設計

23.1 CI/CDで発生し得るコスト

|   |   |
|---|---|
|処理|AWSコスト要素|
|S3 sync|PUT / DELETE / LISTリクエスト|
|CloudFront Invalidation|無効化リクエスト|
|Lambda update|基本的には小さいがデプロイ回数に注意|
|SAM deploy|CloudFormation操作、リソース作成変更|
|GitHub Actions実行|GitHub側の実行時間枠に注意|

23.2 コスト削減ルール

|   |   |
|---|---|
|ルール|内容|
|mainのみデプロイ|feature pushでS3デプロイしない|
|pathsで制御|frontend変更時のみfrontend deploy|
|Invalidation乱発禁止|main merge時のみ|
|不要Workflow停止|使わないWorkflowはdisabledまたは削除|
|dev環境常設しない|Phase 3までは本番のみでもよい|

23.3 デプロイ頻度目安

|   |   |
|---|---|
|フェーズ|デプロイ頻度|
|MVP開発中|1日数回まで|
|公開後|必要時のみ|
|記事更新期|記事公開時のみ|
|AdSense後|慎重に更新|

  

24. 失敗時のロールバック設計

24.1 MVPロールバック方針

MVPでは、ロールバックはGit revertで対応する。

1. 問題のあるcommitを特定

2. git revertで戻す

3. mainへpush

4. GitHub Actionsで再デプロイ

5. CloudFront反映確認

24.2 S3バージョニングを使う場合

S3 Versioningを有効にしている場合、過去バージョンへ戻せる。

ただし、MVPではコスト・管理を考慮して必須にしない。

24.3 手動ロールバック

ローカルで以前のcommitをcheckoutして再ビルド・再デプロイする。

git checkout <previous-commit>

cd frontend

npm ci

npm run build

aws s3 sync ./out s3://<bucket-name> --delete

aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"

24.4 ロールバック判断基準

|   |   |
|---|---|
|状況|対応|
|トップページが表示されない|即ロールバック|
|問い合わせフォームが動かない|原因確認後、必要ならロールバック|
|CSS崩れ|影響範囲次第|
|記事誤字|修正commitで対応|
|API URL設定ミス|環境変数修正後再デプロイ|

  

25. デプロイ後確認

25.1 自動デプロイ後の確認項目

|   |   |
|---|---|
|確認項目|期待結果|
|GitHub Actionsが成功|green check|
|S3に新しいファイルがある|更新済み|
|CloudFront Invalidationが作成された|Completedになる|
|トップページが表示される|成功|
|/termsが表示される|成功|
|/questionsが表示される|成功|
|/contactが表示される|成功|
|問い合わせ送信ができる|成功|
|404ページが動く|成功|

25.2 curl確認例

curl -I https://xxxxxxxx.cloudfront.net

期待例：

HTTP/2 200

25.3 CloudFront反映待ち

Invalidationは即時ではなく、完了まで時間がかかる場合がある。

GitHub Actions上で完了を待つ必要がある場合は、以下を追加できる。

aws cloudfront wait invalidation-completed \

  --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

  --id <invalidation-id>

MVPでは必須ではない。

  

26. デプロイログ設計

26.1 GitHub Actionsで確認するログ

|   |   |
|---|---|
|ステップ|確認内容|
|Install dependencies|依存関係エラーがないか|
|Lint|ESLintエラーがないか|
|Type check|TypeScriptエラーがないか|
|Build|Next.js buildが成功するか|
|Configure AWS credentials|AWS認証に成功するか|
|Deploy to S3|syncに成功するか|
|Invalidate CloudFront|Invalidationに成功するか|

26.2 ログに出してはいけない値

- AWS_SECRET_ACCESS_KEY
- AWS_ACCESS_KEY_ID
- AWS_ROLE_ARNを不用意にechoしない
- APIキー
- .env内容
- Cognitoトークン

  

27. CI/CDチェックリスト

27.1 初期設定チェック

|   |   |
|---|---|
|チェック|状態|
|GitHubリポジトリを作成した|未実施 / 実施済み|
|frontendディレクトリがある|未実施 / 実施済み|
|package.json scriptsがある|未実施 / 実施済み|
|next.configで静的export設定済み|未実施 / 実施済み|
|S3バケット名を控えた|未実施 / 実施済み|
|CloudFront Distribution IDを控えた|未実施 / 実施済み|

27.2 OIDCチェック

|   |   |
|---|---|
|チェック|状態|
|AWS IAM OIDC Providerを作成した|未実施 / 実施済み|
|GitHub Actions用IAM Roleを作成した|未実施 / 実施済み|
|Trust Policyでrepo/mainに限定した|未実施 / 実施済み|
|IAM PolicyがS3/CloudFront最小権限|未実施 / 実施済み|
|Workflowにid-token: writeを設定した|未実施 / 実施済み|
|GitHub SecretsにAWS_ROLE_ARNを設定した|未実施 / 実施済み|

27.3 Workflowチェック

|   |   |
|---|---|
|チェック|状態|
|ci.ymlを作成した|未実施 / 実施済み|
|deploy-frontend.ymlを作成した|未実施 / 実施済み|
|PR時にCIが動く|未実施 / 実施済み|
|main push時にCDが動く|未実施 / 実施済み|
|S3 syncが成功する|未実施 / 実施済み|
|CloudFront Invalidationが成功する|未実施 / 実施済み|

27.4 セキュリティチェック

|   |   |
|---|---|
|チェック|状態|
|rootアクセスキーを使っていない|未実施 / 実施済み|
|AdministratorAccessを使っていない|未実施 / 実施済み|
|AWS_SECRET_ACCESS_KEYをログ出力していない|未実施 / 実施済み|
|GitHub Secretsに不要な値がない|未実施 / 実施済み|
|.envをコミットしていない|未実施 / 実施済み|

  

28. トラブルシューティング

28.1 OIDC AssumeRoleに失敗する

|   |   |
|---|---|
|原因|対応|
|id-token: write がない|workflow permissionsを追加|
|Trust Policyのrepo名違い|<github-owner>/<repo-name> を確認|
|branch条件違い|refs/heads/main を確認|
|OIDC Provider未作成|IAM Identity providerを確認|
|audience違い|sts.amazonaws.com を確認|

28.2 S3 syncに失敗する

|   |   |
|---|---|
|原因|対応|
|S3_BUCKET_NAME違い|GitHub Secretsを確認|
|s3:PutObject不足|IAM Policyを確認|
|s3:ListBucket不足|IAM Policyを確認|
|outディレクトリがない|build設定を確認|
|working-directory違い|workflowを確認|

28.3 CloudFront Invalidationに失敗する

|   |   |
|---|---|
|原因|対応|
|Distribution ID違い|Secretsを確認|
|cloudfront:CreateInvalidation不足|IAM Policyを確認|
|Distributionが無効|CloudFront状態を確認|
|paths指定ミス|--paths "/*" を確認|

28.4 buildに失敗する

|   |   |
|---|---|
|原因|対応|
|依存関係不足|lockファイル確認|
|TypeScriptエラー|npm run typecheck をローカル実行|
|環境変数不足|GitHub Variablesを確認|
|静的export非対応コード|Next.jsの動的機能利用を確認|

28.5 デプロイ成功したが画面が古い

|   |   |
|---|---|
|原因|対応|
|CloudFrontキャッシュ|Invalidation確認|
|ブラウザキャッシュ|hard reload|
|S3に古いファイル|sync結果確認|
|別Distributionを見ている|URL確認|

  

29. Phase別CI/CD実装順序

29.1 Phase 1：静的サイト公開

1. 手動でS3/CloudFrontへデプロイ

2. ci.ymlを追加

3. deploy-frontend.ymlを追加

4. アクセスキー方式またはOIDCでAWS認証

5. main pushでS3 sync + CloudFront Invalidation

6. OIDC方式へ移行

29.2 Phase 2：問い合わせAPI追加

1. LambdaコードをGitHub管理

2. LambdaユニットテストをCIへ追加

3. 必要ならzipデプロイWorkflow追加

4. SAMテンプレート作成

5. SAM build/deployを手動実行

6. SAM deployをGitHub Actions化

29.3 Phase 3：収益化準備

1. 独自ドメイン導入

2. NEXT_PUBLIC_SITE_URLを独自ドメインへ変更

3. Search Console / Analytics用の環境変数追加

4. sitemap生成確認をCIに追加

5. AdSenseタグ導入時にCSP確認

29.4 Phase 4：学習アプリ化

1. Cognito設定をIaC化検討

2. 認証付きAPIのテスト追加

3. backend deploy workflow分離

4. dev/prod環境分離

5. DBマイグレーション・データ保護方針追加

  

6. MVPで実装するCI/CD最小セット

30.1 最小セット

MVPでは以下だけでよい。

ci.yml

  - lint

  - typecheck

  - build

  

deploy-frontend.yml

  - main push

  - build

  - aws s3 sync

  - cloudfront create-invalidation

30.2 MVPでやらないこと

SAM自動デプロイ

Terraform自動デプロイ

Cognito自動構築

複数環境デプロイ

自動E2Eテスト

WAF設定自動化

CloudFront作成自動化

S3バケット作成自動化

理由：

- MVP公開が遅れる
- IAM権限が広がる
- 課金事故リスクが上がる
- 学習初期には運用が複雑すぎる

  

31. GitHub READMEに記載する内容

31.1 英語版例

## CI/CD

  

This project uses GitHub Actions for CI/CD.

  

### CI

  

Pull requests run the following checks:

  

- Lint

- TypeScript type check

- Next.js build

  

### CD

  

When changes are merged into the `main` branch, GitHub Actions builds the static frontend, deploys it to Amazon S3, and creates a CloudFront invalidation.

  

### AWS Authentication

  

The recommended setup uses GitHub OIDC to assume an AWS IAM role without storing long-lived AWS access keys in GitHub Secrets.

  

The deployment role only has the minimum permissions required for:

  

- `s3:ListBucket`

- `s3:PutObject`

- `s3:DeleteObject`

- `cloudfront:CreateInvalidation`

31.2 日本語版例

## CI/CD

  

本プロジェクトでは、GitHub Actionsを使ってCI/CDを構成しています。

  

### CI

  

Pull Request作成時に以下を実行します。

  

- Lint

- TypeScript型チェック

- Next.js build

  

### CD

  

`main` ブランチへmergeされると、GitHub Actionsが静的フロントエンドをビルドし、Amazon S3へデプロイした後、CloudFront Invalidationを実行します。

  

### AWS認証

  

推奨構成ではGitHub OIDCを利用し、長期AWSアクセスキーをGitHub Secretsに保存せず、IAM Roleを一時的にAssumeRoleします。

  

デプロイRoleには、以下の最小権限のみ付与しています。

  

- `s3:ListBucket`

- `s3:PutObject`

- `s3:DeleteObject`

- `cloudfront:CreateInvalidation`

  

32. 面接で説明するポイント

32.1 なぜGitHub Actionsを使うのか

GitHubでソースコードを管理しているため、Pull Request時の検証とmainブランチへの反映後の自動デプロイを一元管理できるからです。

個人開発でもCI/CDを導入することで、手動デプロイミスを減らし、ポートフォリオとして運用設計を示せます。

32.2 なぜmainブランチだけ本番デプロイするのか

featureブランチの作業中コードを誤って本番反映しないためです。

PRではlint、typecheck、buildまで行い、mainへmergeされた安定版のみS3とCloudFrontへデプロイする設計にしています。

32.3 なぜOIDCを使うのか

GitHub Secretsに長期AWSアクセスキーを保存しないためです。

OIDCを使うことで、GitHub Actions実行時だけAWS IAM Roleを一時的に引き受けられるため、認証情報漏えいリスクを下げられます。

32.4 なぜGitHub Actionsに最小権限しか付けないのか

デプロイに必要なのはS3へのファイル同期とCloudFrontのInvalidationだけです。

そのため、IAMやDynamoDB、Lambda、EC2などを操作する権限は付与していません。

仮にWorkflowが悪用されても、影響範囲を限定できます。

32.5 なぜLambdaの自動デプロイをMVPでやらないのか

MVPではまず静的サイト公開を安定させることを優先しています。

Lambdaは問い合わせAPIのみで変更頻度が低いため、最初は手動またはzip更新で十分です。

Phase 2以降でSAM化してから自動デプロイする方が安全で管理しやすいと判断しています。

  

33. 受け入れ基準

33.1 CI/CD設計書の受け入れ基準

|   |   |
|---|---|
|ID|基準|
|AC-CICD-DOC-001|MVP対象のCI/CD範囲が定義されている|
|AC-CICD-DOC-002|CIとCDが分離されている|
|AC-CICD-DOC-003|mainブランチのみ本番デプロイする方針が定義されている|
|AC-CICD-DOC-004|GitHub OIDC方式が定義されている|
|AC-CICD-DOC-005|アクセスキー方式の注意点が定義されている|
|AC-CICD-DOC-006|GitHub Actions用IAM最小権限が定義されている|
|AC-CICD-DOC-007|S3 syncとCloudFront Invalidationが定義されている|
|AC-CICD-DOC-008|Lambda/SAM自動デプロイがPhase 2以降として分離されている|
|AC-CICD-DOC-009|ロールバック方針が定義されている|
|AC-CICD-DOC-010|トラブルシューティングが定義されている|

33.2 MVP実装完了基準

|   |   |
|---|---|
|ID|基準|
|AC-CICD-MVP-001|ci.ymlが作成されている|
|AC-CICD-MVP-002|Pull Request時にlint/typecheck/buildが実行される|
|AC-CICD-MVP-003|deploy-frontend.ymlが作成されている|
|AC-CICD-MVP-004|main pushでS3へデプロイされる|
|AC-CICD-MVP-005|CloudFront Invalidationが実行される|
|AC-CICD-MVP-006|GitHub Actions RoleがS3/CloudFront最小権限である|
|AC-CICD-MVP-007|rootアクセスキーを使っていない|
|AC-CICD-MVP-008|GitHub Actionsログに秘密情報が出力されない|
|AC-CICD-MVP-009|デプロイ後にCloudFront URLで最新サイトが確認できる|
|AC-CICD-MVP-010|失敗時にGit revertでロールバックできる|

  

34. 今後作成する関連設計書

本CI/CD設計書の次に、以下を作成する。

1. 運用監視設計書
2. 開発タスク一覧
3. GitHub README草案
4. MVP実装スケジュール
5. 初期コンテンツ作成テンプレート
6. テスト設計書

  

7. 結論

本プロダクトのCI/CDでは、MVP段階でフロントエンド静的サイトの自動デプロイを最優先とする。

MVPで実装するCI/CDは以下で十分である。

Pull Request時：lint / typecheck / build

main push時：build → S3 sync → CloudFront Invalidation

AWS認証は、最終的にはGitHub OIDCを利用し、長期アクセスキーをGitHub Secretsに保存しない構成を推奨する。

  

GitHub Actionsに付与する権限は、S3へのデプロイとCloudFront Invalidationに限定する。

s3:ListBucket

s3:PutObject

s3:DeleteObject

cloudfront:CreateInvalidation

MVPでは、Lambda、API Gateway、DynamoDB、CloudFront、S3バケットそのものの作成は自動化しない。

理由は、初期段階でIaCを広げすぎると権限・コスト・運用が複雑になり、公開までのスピードが落ちるためである。

Phase 2以降で、Lambda zipデプロイまたはAWS SAMによるバックエンド自動デプロイを追加する。

このCI/CD設計により、以下を実現できる。

- 手動デプロイミスを減らせる
- PR時に品質チェックできる
- main反映後に自動公開できる
- AWS認証情報の漏えいリスクを下げられる
- IAM最小権限を実践できる
- 面接でCI/CD・セキュリティ・運用設計を説明できる