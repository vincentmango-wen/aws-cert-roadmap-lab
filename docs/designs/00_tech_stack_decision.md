# 技術スタック決定メモ

## 1. 文書情報

| 項目 | 内容 |
|---|---|
| 文書名 | 技術スタック決定メモ |
| 対象プロダクト | AWS Cert Roadmap Lab |
| 対象タスク | P0-006 技術スタック確定 |
| 作成日 | 2026-05-30 |
| 目的 | MVP開発で使用する技術スタックを確定する |

---

## 2. 結論

AWS Cert Roadmap Lab のMVPでは、以下の技術スタックを採用する。

| 領域 | 採用技術 |
|---|---|
| フロントエンド | Next.js |
| 言語 | TypeScript |
| ルーティング | App Router |
| スタイリング | Tailwind CSS |
| コンテンツ管理 | JSON / Markdown / MDX |
| バックエンド | AWS Lambda |
| Lambda実装言語 | Python 3.11以上 |
| API | Amazon API Gateway HTTP API |
| データベース | Amazon DynamoDB |
| 静的サイト配信 | Amazon S3 + Amazon CloudFront |
| S3アクセス制御 | CloudFront Origin Access Control |
| ログ | Amazon CloudWatch Logs |
| 課金監視 | AWS Budgets |
| 権限管理 | IAM |
| CI/CD | GitHub Actions |
| AWS認証 | GitHub OIDC |
| パッケージ管理 | npm |
| ローカルNode.js | Node.js LTS |
| ローカルPython | Python 3.11以上 |

---

## 3. フロントエンド

### 3.1 採用技術

| 技術 | 用途 |
|---|---|
| Next.js | Webアプリケーションフレームワーク |
| TypeScript | 型安全な開発 |
| App Router | 画面ルーティング |
| Tailwind CSS | UIスタイリング |
| JSON | AWS用語・模擬問題データ管理 |
| Markdown / MDX | ブログ・比較記事・構成図解説の管理 |

### 3.2 採用理由

Next.jsを採用する理由は以下である。

- 静的サイトとして出力できる
- S3 + CloudFrontで配信しやすい
- SEOページを作りやすい
- ReactベースでUIを作りやすい
- ポートフォリオとして説明しやすい

TypeScriptを採用する理由は以下である。

- 用語データ、問題データ、記事メタデータの型を定義できる
- 実装ミスを事前に検出しやすい
- APIレスポンス形式を型で管理できる
- 実務での利用頻度が高い

Tailwind CSSを採用する理由は以下である。

- 小規模MVPでUIをすばやく作れる
- CSSファイルを増やしすぎずに済む
- レスポンシブ対応がしやすい
- デザインの一貫性を保ちやすい

### 3.3 Next.js設定方針

S3 + CloudFrontで配信するため、静的exportを前提にする。

```js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## 4. コンテンツ管理
### 4.1 採用方針

MVPでは、問い合わせ以外の学習コンテンツは静的ファイルで管理する。
| データ    | 保存形式        | 保存場所                                       |
| ------ | ----------- | ------------------------------------------ |
| AWS用語  | JSON        | `frontend/contents/terms/terms.json`       |
| 模擬問題   | JSON        | `frontend/contents/questions/clf-c02.json` |
| サービス比較 | MDX         | `frontend/contents/comparisons/`           |
| 構成図解説  | MDX         | `frontend/contents/architectures/`         |
| ブログ記事  | MDX         | `frontend/contents/blog/`                  |
| 運営者情報  | MDX または TSX | `frontend/contents/site/`                  |


### 4.2 採用理由
- AWS利用料を抑えられる
- SEOに強い静的ページを生成できる
- CloudFrontキャッシュを活用しやすい
- MVPの開発速度を上げられる
- DynamoDB設計で詰まりにくい

## 5. バックエンド
### 5.1 採用技術
| 技術                   | 用途                  |
| -------------------- | ------------------- |
| AWS Lambda           | 問い合わせ保存処理           |
| Python 3.11以上        | Lambda実装言語          |
| API Gateway HTTP API | `POST /contact` の公開 |
| DynamoDB             | 問い合わせデータ保存          |
| CloudWatch Logs      | Lambdaログ確認          |

### 5.2 採用理由

Lambda + API Gateway + DynamoDB を採用する理由は以下である。

- 常時起動サーバーが不要
- 個人開発MVPで低コストにしやすい
- AWS資格試験の学習内容と直結する
- サーバーレスAPI構成として説明しやすい
- SAAの設計パターン学習になる

Pythonを採用する理由は以下である。

- Lambdaと相性がよい
- 実装が読みやすい
- 将来のAI解説機能と接続しやすい
- 既存のPython学習経験を活かせる

### 5.3 MVPで実装するAPI
| メソッド | パス         | 用途      |
| ---- | ---------- | ------- |
| POST | `/contact` | 問い合わせ送信 |

MVPでは、AWS用語、模擬問題、ブログ、比較記事、構成図はAPI化しない。

## 6. AWS構成
### 6.1 MVP構成
```
User
  ↓ HTTPS
CloudFront
  ↓ OAC
S3 Static Site

User
  ↓ POST /contact
API Gateway HTTP API
  ↓
Lambda Python
  ↓ PutItem
DynamoDB ContactsTableProd
  ↓
CloudWatch Logs
```

### 6.2 採用AWSサービス
| サービス                   | 用途            |
| ---------------------- | ------------- |
| Amazon S3              | 静的ファイル配置      |
| Amazon CloudFront      | CDN配信・HTTPS配信 |
| CloudFront OAC         | S3直接公開の防止     |
| Amazon API Gateway     | 問い合わせAPI公開    |
| AWS Lambda             | 問い合わせ保存処理     |
| Amazon DynamoDB        | 問い合わせデータ保存    |
| Amazon CloudWatch Logs | Lambdaログ確認    |
| AWS Budgets            | 課金監視          |
| IAM                    | 最小権限管理        |

### 6.3 MVPでは使わないAWSサービス
| サービス        | 使わない理由               |
| ----------- | -------------------- |
| EC2         | 常時起動コストを避けるため        |
| RDS         | MVPではリレーショナルDBが不要なため |
| NAT Gateway | 固定費が発生しやすいため         |
| ALB         | 常時課金が発生しやすいため        |
| ECS / EKS   | 個人開発MVPには構成が重いため     |
| OpenSearch  | 検索機能には初期段階では過剰なため    |
| SageMaker   | AI機能はMVP対象外のため       |
| WAF         | MVPではコスト増になるため       |
| Cognito     | ログイン機能はMVP対象外のため     |
| SES         | メール通知はMVP対象外のため      |

## 7. CI/CD
### 7.1 採用技術
| 技術             | 用途                                |
| -------------- | --------------------------------- |
| GitHub Actions | CI/CD                             |
| GitHub OIDC    | AWSへの一時認証                         |
| AWS CLI        | S3 sync / CloudFront Invalidation |


### 7.2 CI方針

Pull Requestまたはpush時に以下を実行する。

- lint
- typecheck
- build

### 7.3 CD方針

mainブランチへ反映されたら、以下を実行する。
```
GitHub Actions
  ↓
Next.js build
  ↓
S3 sync
  ↓
CloudFront Invalidation
  ↓
本番反映
```

### 7.4 AWS認証方針

原則としてGitHub OIDCを採用する。

理由：

- 長期AWSアクセスキーをGitHub Secretsに保存しなくてよい
- 権限をIAM Roleで管理できる
- 特定リポジトリ・mainブランチに制限できる
- ポートフォリオとしてセキュリティ意識を説明できる

## 8. パッケージ管理
### 8.1 採用

MVPでは npm を採用する。

### 8.2 採用理由
- Node.jsに標準で付属している
- 初期セットアップが簡単
- GitHub Actionsの設定が分かりやすい
- 個人開発MVPでは十分
- pnpm workspacesは、frontend / backend の分離が固まってから検討できる
### 8.3 将来検討

Phase 1以降でモノレポ管理が重くなった場合は、pnpm workspacesを検討する。

ただし、MVP初期ではnpm単独で進める。

## 9. ローカル開発環境
### 9.1 必須
| ツール     | バージョン方針    |
| ------- | ---------- |
| Node.js | LTS版       |
| npm     | Node.js同梱版 |
| Python  | 3.11以上     |
| Git     | 最新安定版      |
| VS Code | 推奨         |

### 9.2 任意
| ツール     | 用途                     |
| ------- | ---------------------- |
| AWS CLI | S3 sync / AWS確認        |
| SAM CLI | Phase 2以降のLambda/IaC管理 |
| pnpm    | 将来のパッケージ管理候補           |


## 10. 採用しない技術
| 技術               | 採用しない理由                                     |
| ---------------- | ------------------------------------------- |
| Astro            | Next.jsの方が今後の学習アプリ化に拡張しやすいため                |
| Nuxt             | VueではなくReact / Next.jsで統一するため               |
| Express          | Lambda + API Gatewayで十分なため                  |
| FastAPI          | 常時稼働APIサーバー構成を避けるため                         |
| RDS / PostgreSQL | MVPでは問い合わせ保存のみでRDB不要のため                     |
| Prisma           | MVPではRDBを使わないため                             |
| Docker           | MVP初期では構成を増やさないため                           |
| Terraform        | 初期はAWSコンソール理解を優先し、IaCはPhase 2以降でSAMから検討するため |
| Amplify Hosting  | S3 + CloudFrontを自分で構築する方がAWS学習効果が高いため       |

## 11. 後続タスクへの影響
| 後続タスク  | 影響                                                    |
| ------ | ----------------------------------------------------- |
| P0-007 | Node.js LTS、npm、Python 3.11以上を確認する                    |
| P1-001 | Next.js + TypeScript + App Router + Tailwind CSSで作成する |
| P1-004 | `output: 'export'` を設定する                              |
| P1-010 | AWS用語データをJSONで作成する                                    |
| P1-013 | CLF-C02問題データをJSONで作成する                                |
| P2-014 | LambdaはPythonで実装する                                    |
| P3-001 | npm scriptでlint / typecheck / buildを実行する              |
| P3-009 | `frontend/out` をS3へデプロイする                             |

12. 完了条件

P0-006は以下を満たしたら完了とする。

- Next.jsを採用技術として確定している
- TypeScriptを採用技術として確定している
- Tailwind CSSを採用技術として確定している
- App Routerを使う方針が確定している
- Static Exportを使う方針が確定している
- LambdaはPython 3.11以上で実装する方針が確定している
- AWS構成が S3 + CloudFront + OAC + API Gateway + Lambda + DynamoDB + CloudWatch Logs + AWS Budgets + IAM で確定している
- npmを初期パッケージ管理として採用している