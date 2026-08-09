# Search Consoleインデックス登録問題の修正・対策 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `aws-cert-roadmap-lab.com` の正規URLを `https://www.aws-cert-roadmap-lab.com` に統一し、Search Consoleで検出されたリダイレクト・canonical・404・noindex指摘を、現行サイト構成と整合する形で解消する。

**Architecture:** Cloudflare DNSのapexをCloudFront distribution `EHIV14NX361T7` のCNAMEへ切り替え、CloudFront Function `aws-cert-url-rewrite` のviewer-request処理でapex hostだけを同一パス・クエリ付きでwwwへ301リダイレクトする。www hostでは既存の静的HTML書き換えを継続する。Route 53 Hosted Zone `Z023394017OSHJA6GKOI8` は権威DNSではないため変更しない。

**Tech Stack:** CloudFront Functions (`cloudfront-js-2.0`), Cloudflare DNS, AWS CLI, Bash 3.2互換スクリプト, Node.js built-in test runner, Google Search Console.

## Global Constraints

- 正規URLは `https://www.aws-cert-roadmap-lab.com` とする。
- CloudFrontの既存www配信、CloudFront Functionの静的HTML書き換え、ACM証明書、CloudflareのACM検証用CNAMEは維持する。
- Route 53 Hosted ZoneのNS/SOAや既存のACM検証レコードは変更しない。
- `frontend` の既存コンテンツURLは、Search Consoleの過去の404記録だけを根拠に削除しない。現在200で配信されているURLとして扱う。
- `/blog/clf-monitoring-cloudwatch-basics` は現行HTMLが `index, follow` かつwww canonicalのため、MDXへ推測で `noIndex` を追加しない。
- `.claude/` の既存未追跡ファイルは変更・stageしない。
- 外部状態の変更は、対象リソースと変更内容を作業ログへ記録し、変更直後に検証する。

---

## Task 1: CloudFront Functionのソースとユニットテストを追加

**Files:**
- Create: `infra/cloudfront/url-rewrite.js`
- Create: `infra/cloudfront/url-rewrite.test.mjs`

- [ ] `infra/cloudfront/url-rewrite.js` に、apex hostをwwwへ301する処理と既存の静的HTML書き換え処理を実装する。
  - `event.request.headers.host.value` をhost判定に使う。
  - `aws-cert-roadmap-lab.com` では `https://www.aws-cert-roadmap-lab.com` + 元の `uri` + 元のquery stringへ301する。
  - query stringはCloudFront Functions形式のオブジェクトをURLエンコードしてLocationへ付与する。
  - www hostや想定外hostでは、末尾 `/` を `index.html` に、拡張子のないパスを `.html` に変換する既存仕様を維持する。
  - `/`、静的ファイル、拡張子付きURLの扱いを変えない。
- [ ] `infra/cloudfront/url-rewrite.test.mjs` をNode.jsの `node:test` と `vm` で作成し、FunctionコードをCloudFront実行環境に近い形で検証する。
  - apexの `/` が301でwwwへ遷移すること。
  - apexのパスとquery stringがLocationに保持されること。
  - wwwの `/` が `/index.html` へ書き換わること。
  - wwwの拡張子なしパスが `.html` へ書き換わること。
  - 拡張子付き静的ファイルが変更されないこと。
- [ ] `node --test infra/cloudfront/url-rewrite.test.mjs` を実行し、全テストが成功することを確認する。
- [ ] `git diff --check` を実行する。
- [ ] Conventional Commitでコミットする。
  - `feat: apex URLをwwwへリダイレクトするFunctionを追加 (#133)`

## Task 2: サイトマップ到達性チェックをmacOS標準Bashへ対応

**Files:**
- Modify: `scripts/sweep-sitemap-status.sh`

- [ ] `mapfile` 依存を除去し、Bash 3.2で動作するwhile/read方式でサイトマップURL配列を構築する。
- [ ] URL確認用のcurlに `--http1.1` と既存のタイムアウト・User-Agentを適用し、TLS/HTTP2の一時的な失敗を切り分けやすくする。
- [ ] `bash -n scripts/sweep-sitemap-status.sh` を実行する。
- [ ] Task 6のDNS切替後に `bash scripts/sweep-sitemap-status.sh` を実行し、サイトマップURLのHTTPステータスを記録する。
- [ ] `git diff --check` を実行する。
- [ ] Conventional Commitでコミットする。
  - `fix: 到達性チェックをmacOS標準Bashに対応 (#133)`

## Task 3: CloudFront Function反映手順とテストイベントを文書化

**Files:**
- Create: `docs/operations/cloudfront-url-rewrite-setup.md`
- Create: `infra/cloudfront/test-events/apex-request.json`

- [ ] 運用手順に、対象リソースを以下の実値で記載する。
  - Distribution ID: `EHIV14NX361T7`
  - Distribution domain: `d25a018o7xkwid.cloudfront.net`
  - Function name: `aws-cert-url-rewrite`
  - Runtime: `cloudfront-js-2.0`
  - aliases: `aws-cert-roadmap-lab.com`, `www.aws-cert-roadmap-lab.com`
- [ ] AWS CLIでの安全な反映順を記載する。
  1. LIVE版のETag・コード・distribution associationを保存する。
  2. `update-function` でDEV版へアップロードする。
  3. `test-function` でapex hostの301を確認する。
  4. `publish-function` でLIVEへ昇格する。
  5. distributionのFunction associationが維持され、状態がDeployedになるまで待つ。
- [ ] `infra/cloudfront/test-events/apex-request.json` に、hostがapexでURI `/blog/example`、query string `ref=search` のテストイベントを記載する。
- [ ] ロールバック手順として、保存したLIVEコードと設定を使ってDEV更新・test・publishを行い、distribution associationを復元する手順を記載する。
- [ ] Cloudflare DNS変更の手順、戻し先の現行Aレコード `18.204.152.241`、検証用nameserver `kobe.ns.cloudflare.com` / `deborah.ns.cloudflare.com` を記載する。
- [ ] `git diff --check` を実行する。
- [ ] Conventional Commitでコミットする。
  - `docs: CloudFrontとDNSの反映手順を追加 (#133)`

## Task 4: ローカル品質ゲートを通す

**Files:**
- Verify: `infra/cloudfront/url-rewrite.js`
- Verify: `infra/cloudfront/url-rewrite.test.mjs`
- Verify: `scripts/sweep-sitemap-status.sh`
- Verify: `frontend/package.json`

- [ ] `node --test infra/cloudfront/url-rewrite.test.mjs` を実行する。
- [ ] `bash -n scripts/sweep-sitemap-status.sh` を実行する。
- [ ] `cd frontend && npm run typecheck && npm test` を実行する。
- [ ] `frontend` のテスト実行が依存ファイルの権限エラーで失敗した場合は、`cd frontend && npm ci` の後に同じ品質ゲートを再実行し、lockfileの差分が発生していないことを確認する。
- [ ] `git diff --check` と `git status --short` を実行し、対象ファイル以外を変更していないことを確認する。

## Task 5: CloudFront FunctionをDEV/LIVEへ反映

**Files:**
- Modify external: CloudFront Function `aws-cert-url-rewrite`
- Verify external: Distribution `EHIV14NX361T7`

- [ ] 反映前に以下を保存する。
  - `aws cloudfront describe-function --name aws-cert-url-rewrite --stage LIVE` の設定とETag
  - `aws cloudfront get-function --name aws-cert-url-rewrite --stage LIVE` の現行コード
  - `aws cloudfront get-distribution-config --id EHIV14NX361T7` のFunction association
- [ ] ローカルテスト済みの `infra/cloudfront/url-rewrite.js` を `aws cloudfront update-function` でアップロードする。Function configはCommentを維持し、Runtimeは `cloudfront-js-2.0` とする。
- [ ] `DEV_ETAG="$(aws cloudfront describe-function --name aws-cert-url-rewrite --stage DEVELOPMENT --query ETag --output text)"` でDEV版のETagを取得し、`aws cloudfront test-function --name aws-cert-url-rewrite --if-match "$DEV_ETAG" --stage DEVELOPMENT --event-object fileb://infra/cloudfront/test-events/apex-request.json` を実行して301・www Location・パス・query stringを確認する。
- [ ] テスト成功後、`aws cloudfront publish-function --name aws-cert-url-rewrite --if-match "$DEV_ETAG"` でLIVEへ反映する。
- [ ] `describe-function --stage LIVE` でStatusが `UNASSOCIATED` ではなくDeployed相当になったことを確認する。
- [ ] `get-distribution-config` でviewer-request associationが `arn:aws:cloudfront::526261728564:function/aws-cert-url-rewrite` のままであることを確認する。
- [ ] AWS CLIのETag競合やテスト失敗が起きた場合は、反映を止めて保存済み状態との差分を確認する。

## Task 6: Cloudflareのapex DNSをCloudFrontへ切り替え

**Files:**
- Modify external: Cloudflare zone `aws-cert-roadmap-lab.com` DNS records

- [ ] Cloudflareのログイン状態を確認する。未ログインの場合は、ふみさんに `https://dash.cloudflare.com/` へサインインしてもらい、完了後に作業を再開する。
- [ ] 対象zone `aws-cert-roadmap-lab.com` のDNSレコードを確認する。
- [ ] apex (`@`) の現行Aレコード `18.204.152.241` を、以下のCNAMEへ置き換える。
  - Name: `@`
  - Target: `d25a018o7xkwid.cloudfront.net`
  - Proxy status: DNS only（灰色雲）
  - TTL: Auto
- [ ] `www` の既存CNAME `d25a018o7xkwid.cloudfront.net` を変更しない。
- [ ] ACM検証用CNAME、MX、TXT、その他の無関係なレコードを変更しない。
- [ ] 変更直後にCloudflare画面上のレコードを再取得し、apexが単一のCloudFront向けCNAMEであることを確認する。
- [ ] `dig +trace aws-cert-roadmap-lab.com A` と、`kobe.ns.cloudflare.com` / `deborah.ns.cloudflare.com` への直接問い合わせで、権威DNSがCloudflareであることと変更後の名前解決を確認する。

## Task 7: 本番到達性とcanonicalを検証

**Files:**
- Verify external: `https://aws-cert-roadmap-lab.com`
- Verify external: `https://www.aws-cert-roadmap-lab.com`
- Verify: `scripts/sweep-sitemap-status.sh`

- [ ] 以下を `curl -4 --http1.1 -I` で確認する。
  - `https://aws-cert-roadmap-lab.com/` は `301` で `https://www.aws-cert-roadmap-lab.com/` へ遷移する。
  - `https://www.aws-cert-roadmap-lab.com/` は `200` である。
  - `http://aws-cert-roadmap-lab.com/` は最終的にhttpsのwwwへ遷移する。
  - `http://www.aws-cert-roadmap-lab.com/` はhttpsのwwwへ遷移する。
- [ ] 代表URLで同一パスとquery stringが保持されることを確認する。
  - `/blog/s3-cloudfront-static-site?ref=search`
  - `/terms/cloudformation`
  - `/questions/clf-002`
- [ ] `https://www.aws-cert-roadmap-lab.com/sitemap.xml` が `200` で、canonicalのwww URLだけを含むことを確認する。
- [ ] `bash scripts/sweep-sitemap-status.sh` を実行し、サイトマップURLが `200`、リダイレクトは `0`、404は `0` であることを確認する。
- [ ] `/blog/clf-monitoring-cloudwatch-basics` のHTMLが `robots=index, follow` とwww canonicalであることを確認する。

## Task 8: Search Console指摘と実測結果を記録

**Files:**
- Create or Modify: `docs/operations/search-console-indexing-remediation.md`

- [ ] Search Consoleの2026-08-09時点ベースラインを記録する。
  - 未登録: 160
  - 登録済み: 48
  - 理由: 5
  - 検出 - インデックス未登録: 150
  - 404: 6
  - noindex: 1
  - リダイレクト: 2
  - 代替ページcanonical: 1
  - クロール済み - インデックス未登録: 0
- [ ] 6件の過去404 URLは、現行サイトで200となっているURLと、Search Consoleが過去に404を観測した履歴を分けて記録する。
- [ ] noindexの1 URLは、現行HTMLがindex/followであることと、MDX側にnoIndex指定を追加していないことを記録する。
- [ ] redirect 2件とalternate canonical 1件は、apex/httpからhttpsのwwwへ統一するDNS/CloudFront構成で対策することを記録する。
- [ ] DNS変更前後の権威DNS応答、CloudFront反映時刻、curl結果、サイトマップスイープ結果を記録する。
- [ ] `git diff --check` を実行する。
- [ ] Conventional Commitでコミットする。
  - `docs: Search Console実測とDNS修正結果を記録 (#133)`

## Task 9: Search Consoleの再検証を開始し、継続監視を設定

**Files:**
- Modify: `docs/operations/search-console-indexing-remediation.md`

- [ ] 本番検証が成功し、sitemapが `成功しました` であることを確認してから、Search Consoleの「修正を検証」を開始する。
  - 404
  - ページにリダイレクトがあります
  - 代替ページ（適切なcanonicalタグあり）
- [ ] noindexの検証は、現行HTMLと直近クロール結果の差分を確認した後に必要性を判断し、未確認のまま一律に開始しない。
- [ ] Search ConsoleのURL検査で、canonicalのwww URLを検査し、インデックス登録可能性とユーザー指定canonicalを確認する。
- [ ] 2026-08-16、2026-08-23、2026-08-30にSearch Consoleの未登録理由数とクロール日を確認する。
- [ ] `検出 - インデックス未登録` 150件は直ちに全件登録を期待せず、サイトマップ・内部リンク・クロール状況を週次で比較する。
- [ ] AdSense審査再申請は、少なくとも2026-08-16以降のクロール結果と今回の検証結果を確認してから判断する。
- [ ] Search Console操作結果と次回確認日を同じ運用ドキュメントへ追記する。
- [ ] Conventional Commitでコミットする。
  - `docs: Search Console修正検証の開始を記録 (#133)`

## Completion Criteria

- [ ] CloudFront Functionのユニットテストが成功している。
- [ ] frontend typecheck/test、Bash構文チェックが成功している。
- [ ] CloudFront FunctionのDEVテスト・LIVE反映・distribution association確認が完了している。
- [ ] Cloudflare apex CNAME切替が完了し、wwwを維持したまま権威DNSと公開DNSで確認できている。
- [ ] apex/httpのリクエストがhttpsのwwwへ正規化され、wwwの代表URLが200である。
- [ ] sitemapのURLに404がなく、canonicalがwwwへ統一されている。
- [ ] Search Consoleの現状、実施内容、再検証開始、継続監視予定が運用ドキュメントに記録されている。
- [ ] 変更対象以外の既存ユーザー変更や `.claude/` の未追跡ファイルを巻き込んでいない。
