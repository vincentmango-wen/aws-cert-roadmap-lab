# 日本語ブログ13記事の品質改善・インデックス再公開設計

## 1. 背景

2026-08-17更新のGoogle Search Consoleでは、`noindex タグによって除外されました`が14件あり、2026-08-09に開始した検証は13件失敗、1件保留となった。

最新`master`（`48d6e24`）を確認した結果、失敗した13件はGoogle側の反映遅延ではなく、各日本語MDXとブログregistryに`noIndex: true`が明示されている。これらは2026-06-21の変更で「薄い記事」として意図的に除外された記事である。保留中の1件は`clf-monitoring-cloudwatch-basics`で、現在は`noIndex`が解除されている。

13記事は約2.8〜3.5KB、既存のindex対象記事は約6.3〜10.3KBであり、単純なタグ解除だけではコンテンツ品質の懸念が残る。このため、内容を強化してからindex対象へ戻す。

## 2. 目的

- 対象13記事を、検索ユーザーに独立した価値を提供できる内容へ改善する。
- 対象記事から`noIndex`を解除し、Googleがindex可能な静的HTMLを生成する。
- 日本語ページだけを公開対象とし、封印中の`/en`・`/zh`は引き続き`noindex, nofollow`を維持する。
- 4エージェントを独立worktreeで並列稼働させ、ファイル競合と品質のばらつきを制御する。
- sitemap・canonical・robots・内部リンクの整合を自動検証し、同じ問題の再発を防止する。

## 3. 対象範囲

### 3.1 対象記事

| バッチ | slug | 主題 |
|---|---|---|
| AWSサービス基礎 | `cloudfront-beginner-cdn` | CloudFrontとCDN |
| AWSサービス基礎 | `apigateway-beginner-http-api` | API Gateway HTTP API |
| AWSサービス基礎 | `dynamodb-beginner-nosql` | DynamoDBとNoSQL |
| AWSサービス基礎 | `lambda-beginner-serverless` | Lambdaとサーバーレス |
| AWSサービス基礎 | `s3-beginner-object-storage` | S3とオブジェクトストレージ |
| SAA設計 | `saa-decoupling-sqs-sns-eventbridge` | 疎結合とメッセージング |
| SAA設計 | `saa-multi-az-high-availability` | Multi-AZと高可用性 |
| SAA設計 | `saa-s3-cloudfront-oac-design` | S3・CloudFront OAC |
| CLF基礎 | `clf-iam-basics` | IAMの基礎 |
| CLF基礎 | `clf-aws-global-infrastructure` | Region・AZ・Edge Location |
| 実装・ポートフォリオ | `serverless-contact-api-flow` | 問い合わせAPIの処理フロー |
| 実装・ポートフォリオ | `lambda-cloudwatch-logs-check` | Lambdaログ調査 |
| 実装・ポートフォリオ | `aws-portfolio-serverless-architecture` | ポートフォリオのサーバーレス構成 |

### 3.2 対象外

- `en`・`zh`記事本文の加筆と公開。
- `LOCALIZED_ROUTES_PUBLISHED`の変更。
- Search Consoleの404報告に含まれる不正URLの機能追加。
- HTTP・apexからHTTPS・wwwへの正規リダイレクトの変更。
- 対象外ブログ12記事の全面改稿。
- Googleによるindex登録や検索順位そのものの保証。

## 4. 採用する並列構成

4つのworkerエージェントと1つのcoordinatorで進める。workerはそれぞれ独立したGit worktreeとbranchを持ち、担当記事以外を変更しない。coordinatorは共有ファイル、テスト基盤、統合、最終検証を担当する。

| 役割 | branch案 | 変更を許可するファイル |
|---|---|---|
| Coordinator | `codex/index-ja-blog-content-quality` | 共有テスト、`blogPosts.ts`、必要な運用文書 |
| Worker 1 | `codex/index-ja-blog-services` | AWSサービス基礎の日本語MDX 5件 |
| Worker 2 | `codex/index-ja-blog-saa` | SAA設計の日本語MDX 3件 |
| Worker 3 | `codex/index-ja-blog-clf` | CLF基礎の日本語MDX 2件 |
| Worker 4 | `codex/index-ja-blog-implementation` | 実装・ポートフォリオの日本語MDX 3件 |

workerは次のファイルを変更しない。

- `frontend/src/contents/blog/blogPosts.ts`
- sitemap・robots・SEO共通ロジック
- 共通テストファイル
- `package.json`、lockfile、ビルド設定
- 他workerの担当MDX

## 5. コンテンツ品質基準

単なる文字数増加ではなく、各記事が検索意図へ直接回答し、他記事の言い換えにならないことを重視する。全記事で以下を満たす。

1. 冒頭で対象読者、解決する疑問、記事を読むことで得られる判断材料を明示する。
2. AWSサービスや設計概念の役割を、関連サービスとの境界を含めて説明する。
3. 具体的な処理フロー、構成例、操作例、または判断例を最低1つ含める。
4. Cloud PractitionerまたはSAAで混同しやすいポイントを具体的に説明する。
5. コスト、セキュリティ、可用性、運用のうち関連する注意点を具体化する。
6. よくある誤解または失敗例を最低1つ含める。
7. AWS公式ドキュメントへの有効なHTTPSリンクを最低2件含める。
8. 関連するサイト内ページへ、存在確認済みの内部リンクを設置する。
9. 未確認の数値、料金、制限値を断定しない。変動する内容は公式資料を参照させる。
10. 同じ定型文を13記事へ機械的に複製しない。

記事サイズは品質判定の主基準にしない。ただし、既存index記事との極端な差を検知する補助指標として本文量、見出し数、公式リンク数をレポートする。

## 6. インデックス制御

### 6.1 日本語記事

品質改善を完了した対象MDXから`noIndex: true`を削除する。`blog-content-loader.ts`はfrontmatterに指定がない場合を`false`として扱うため、生成metadataは`index: true, follow: true`になる。

coordinatorは`frontend/src/contents/blog/blogPosts.ts`に残る同一13記事の`noIndex: true`も削除し、registryと日本語MDXの意味を一致させる。

### 6.2 en・zh

`LOCALIZED_ROUTES_PUBLISHED`は`false`のままとする。`createPageMetadata()`のlocale sealが`/en`・`/zh`へ`noindex, nofollow`を強制するため、日本語記事の解除が翻訳ページへ波及しないことを生成HTMLで検証する。

### 6.3 sitemapとcanonical

- `getBlogSitemapRoutes()`は`published: true`かつ`noIndex !== true`の日本語MDXを掲載する。
- 解除した13記事が日本語sitemapへ追加されることを確認する。
- 封印中の`en`・`zh` URLはsitemapへ追加しない。
- canonicalは各日本語記事自身の`https://www.aws-cert-roadmap-lab.com/blog/<slug>`とする。

## 7. テスト戦略

### 7.1 REDテスト

coordinatorがworker開始前に、4バッチを個別のテストケースとして定義する。各ケースは次を検証する。

- 対象日本語MDXに`noIndex: true`が存在しない。
- 対象記事が公開済みとして読み込まれる。
- 対象記事のmetadataが`index: true, follow: true`になる。
- 対象記事がblog sitemap routeへ含まれる。
- 最低限必要な構造とAWS公式リンクを持つ。

テストは開始時点で4ケースとも失敗する。各workerは自分のバッチ名に絞って実行し、担当ケースだけをGREENにする。他バッチの失敗は統合前の想定状態として扱う。

### 7.2 Worker検証

各workerは次を実行する。

- 担当バッチのindexing policyテスト
- 既存のblog locale parityテスト
- 変更ファイルのMarkdown・frontmatter確認
- `git diff --check`

workerはフルbuildを同時実行しない。4つのNext.js buildを並列実行するとCPU・メモリ・I/O負荷が大きく、検証速度と安定性を下げるためである。

### 7.3 統合検証

coordinatorは全commit統合後に次を実行する。

1. 4バッチすべてのindexing policyテスト。
2. 全Vitest。
3. lintとtypecheck。
4. `pnpm install --frozen-lockfile`。
5. 本番build。
6. 生成された13記事のrobots、canonical、内部リンク確認。
7. 生成された`/en`・`/zh`代表記事の`noindex, nofollow`確認。
8. sitemap掲載URLの200応答確認。

## 8. 競合管理

### 8.1 Git競合

workerのファイル所有を排他的にするため、通常の内容競合は発生しない。共有ファイルはcoordinatorだけが変更する。worker成果はcommit SHA単位で、Worker 1から4の順に統合する。

workerがスコープ外ファイルを変更した場合、そのcommitはそのまま統合せず、担当MDXだけを取り出して再commitする。

### 8.2 内容上の競合

同じ概念の重複説明や用語揺れはGitでは検出できない。統合時に次を横断確認する。

- IAM、CloudFront、Lambda、API Gatewayなどのサービス名表記。
- CloudFront OAC記事とCloudFront入門記事の役割分担。
- Lambda入門、Lambdaログ、問い合わせAPI、ポートフォリオ記事の重複。
- SQS・SNS・EventBridgeの比較説明の整合。
- 関連記事リンクの循環や404。

### 8.3 実行環境の競合

- worktreeごとに生成物を分離する。
- package managerのstoreは共有可能だが、installやbuildはcoordinatorが統合後に行う。
- Search Consoleの検証開始は公開確認後に1回だけ実施し、複数エージェントから操作しない。

## 9. 統合と公開手順

1. coordinatorがREDテストと品質チェック基盤をcommitする。
2. 同じbase SHAから4つのworktreeを作成する。
3. 4workerを同時起動する。
4. workerごとに担当記事を改稿し、担当テストをGREENにしてcommitする。
5. coordinatorが各diffを内容レビューし、順番に統合する。
6. coordinatorがregistryの`noIndex`を削除し、共有テストと文書を整合させる。
7. フルテスト、本番build、静的HTML検査を実行する。
8. PRで13記事、robots、sitemap、locale sealの結果を提示する。
9. merge・deploy後、公開URLを再検査する。
10. Search Consoleで代表記事の「公開URLをテスト」がindex可能になった後、noindex分類の新しい検証を1回開始する。

## 10. エラー処理と中断条件

- AWS公式リンクが404または非公式ドメインの場合は公開しない。
- 担当記事が既存のindex記事と実質重複する場合は、無理に加筆せず統合・canonical・redirect案を再検討する。
- `en`・`zh`の生成HTMLからindex可能なページが1件でも検出された場合はrelease blockerとする。
- 対象日本語記事に`noindex`が1件でも残る場合はrelease blockerとする。
- sitemapとmetadataの判定が不一致の場合は公開しない。
- 本番buildまたは既存テストが失敗した場合は原因を特定するまでPRをmergeしない。

## 11. ロールバック

公開後に重大な内容誤り、重複、またはindex対象外に戻す必要が生じた場合は、該当記事だけに`noIndex: true`を戻し、sitemapから除外する。サイト全体や13記事すべてを一括で戻さず、問題のあるslugに限定する。

en・zhの封印に異常が出た場合は、記事単位の変更ではなくlocale sealを優先して復旧し、Search Console操作を停止する。

## 12. 完了条件

- 13記事が品質基準を満たしている。
- 13記事の日本語MDXとregistryから`noIndex: true`が除去されている。
- 13記事の生成HTMLが`index, follow`を持つ。
- 13記事のcanonicalがHTTPS・wwwの自己参照URLである。
- 13記事が日本語sitemapに含まれ、200応答する。
- `/en`・`/zh`の封印が維持されている。
- 全テスト、lint、typecheck、本番buildが成功する。
- worker間のファイル所有違反と未解決競合がない。
- 公開後の代表URL検査でindex登録可能と判定される。
- Search Consoleの新しい検証を、公開確認後に1回だけ開始できる状態になっている。
