# Search Consoleインデックス問題の修正・再検証設計

## 文書情報

| 項目 | 内容 |
|---|---|
| 作成日 | 2026-08-09 |
| 対象サイト | https://www.aws-cert-roadmap-lab.com |
| 対象プロパティ | Search Consoleのドメインプロパティ `aws-cert-roadmap-lab.com` |
| 状態 | ふみさん確認待ち |
| 主目的 | apex URLをwwwへ統一し、到達性・canonical・Search Console検証を再実行できる状態にする |

## 1. 背景と実測結果

### Search Consoleの実測

2026-08-09にSearch Consoleの「ページのインデックス登録」を確認した。レポート最終更新日は2026-08-05で、現状は次のとおりだった。

| 状態 | 件数 | 判断 |
|---|---:|---|
| インデックス登録済み | 48 | 現在の登録済みページ数として記録する |
| インデックス未登録 | 160 | 内訳を分けて対応する |
| 検出 - インデックス未登録 | 150 | Googleの再クロール待ち。コード修正の直接対象にしない |
| 見つかりませんでした（404） | 6 | 旧URLの到達性と現行URLの状態を確認する |
| noindexタグによって除外 | 1 | 現在の配信HTMLを再確認し、修正検証へ進める |
| ページにリダイレクトがある | 2 | HTTP / apexの正規化後に再検証する |
| 代替ページ（適切なcanonicalタグあり） | 1 | apexをwwwへ301統一して再発を防ぐ |
| クロール済み - インデックス未登録 | 0 | 現時点でthin contentの直接指標は0 |

Search Consoleの詳細URLは次のとおりだった。

- 404: `/terms/cloudformation`、`/terms/elastic-beanstalk`、apexの `/blog/s3-cloudfront-static-site`、apexの `/contact`、`/questions/clf-002`、`/questions/clf-010`
- noindex: `https://www.aws-cert-roadmap-lab.com/blog/clf-monitoring-cloudwatch-basics`
- redirect: `http://www.aws-cert-roadmap-lab.com/`、`http://aws-cert-roadmap-lab.com/`
- alternate canonical: `https://aws-cert-roadmap-lab.com/`

現行本番HTMLでは、404に分類された用語2件と問題2件、およびnoindex対象のブログ記事はそれぞれ200応答で、ブログ記事のrobotsは `index, follow`、canonicalはwww URLだった。これらはGoogleの前回クロール時点の状態が残っている可能性があるため、修正後に再クロールで確認する。

### DNS / CloudFrontの実測

- 権威DNSはCloudflare（`kobe.ns.cloudflare.com` / `deborah.ns.cloudflare.com`）。Route 53のHosted Zoneは存在するが権威DNSではないため、本件では変更しない。
- apex `aws-cert-roadmap-lab.com` は現在 `18.204.152.241` を返し、CloudFrontへ到達していない。HTTPSはTLSエラー、HTTPは空応答だった。
- `www.aws-cert-roadmap-lab.com` は `d25a018o7xkwid.cloudfront.net` を向き、HTTPSで200を返す。
- CloudFrontディストリビューション `EHIV14NX361T7` は apex とwwwの両方をAliasesに持ち、ACM証明書も両方を対象にしている。
- CloudFront Function `aws-cert-url-rewrite` はデプロイ済みで、現在は `/` を `index.html`、拡張子なしURLを `.html` に変換している。Hostのapex→www正規化はまだ行っていない。

## 2. 目標と対象外

### 目標

1. apexへのアクセスをCloudFrontへ到達させる。
2. apexを `https://www.aws-cert-roadmap-lab.com` へ301で統一する。
3. www側の既存の拡張子なしURL rewriteを維持する。
4. Search Consoleの404・redirect・canonical指摘を、現行サイトの正規URL方針に合わせて再検証できる状態にする。
5. DNS・CloudFront Function・到達性チェックの運用情報をリポジトリに残す。

### 対象外

- 「検出 - インデックス未登録」150件への一括インデックス登録リクエスト。Googleの再クロール状況を週次で観測する。
- 現在 `index, follow` を返しているブログ記事の不要なnoindex変更。
- en/zhの公開方針変更。現行のja単独sitemap / locale封印方針を維持する。
- Route 53 Hosted Zoneのレコード変更。
- S3バケット構成、CloudFrontのOrigin、証明書、キャッシュポリシーの変更。

## 3. 検討した方式

### 方式A: Cloudflare apex → CloudFront + CloudFront Functionでwwwへ301（採用）

CloudflareのapexをCloudFrontのドメインへ向け、CloudFront Functionのviewer-requestでHostを判定する。apexの場合はwwwへ301を返し、wwwの場合は既存の拡張子なしURL rewriteを実行する。

- 長所: 正規URLを一箇所へ集約でき、404・redirect・canonicalの原因を同じ経路で解消できる。
- 短所: DNS変更とCloudFront Functionの反映が必要。

### 方式B: apexをCloudFrontへ向けるだけ

DNSのみを変更し、apexでも同じコンテンツを返す。

- 長所: 変更が最小。
- 短所: apexとwwwが重複し、Search Consoleのalternate canonicalが残る可能性がある。

### 方式C: Cloudflare側に別のリダイレクト処理を追加

Cloudflare WorkerまたはRedirect Ruleでapexからwwwへ転送する。

- 長所: CloudFront Functionを変更しない。
- 短所: DNS・Cloudflare・CloudFrontに処理が分散し、現行のCloudFront rewriteとの責任境界が複雑になる。

## 4. 採用設計

### 4.1 DNS

Cloudflare DNSで次を行う。

| 名前 | 種別 | 値 | Proxy |
|---|---|---|---|
| `@` | CNAME | `d25a018o7xkwid.cloudfront.net` | DNS only（グレー雲） |
| `www` | 既存CNAMEを維持 | `d25a018o7xkwid.cloudfront.net` | 現状維持 |

Cloudflareのapex CNAME flatteningにより、apexでもCloudFrontへ解決できる状態にする。Cloudflare Proxyを有効化して別のTLS/CDN層を追加することは、本作業では行わない。

### 4.2 CloudFront Function

既存の `aws-cert-url-rewrite` を次の順序に変更する。

1. Hostが `aws-cert-roadmap-lab.com` の場合、`https://www.aws-cert-roadmap-lab.com` に同じパスで301を返す。
2. Hostが `www.aws-cert-roadmap-lab.com` の場合、既存のURL rewriteを実行する。
3. 想定外のHostは、CloudFrontの既存動作を壊さないため、wwwへの強制転送対象にせず既存rewriteを適用する。
4. リダイレクト時はクエリ文字列を保持する。Search Consoleの検査パラメータや将来の計測パラメータを失わせない。

リポジトリには `infra/cloudfront/url-rewrite.js` を追加し、AWS上のLIVE Functionと同じ内容を管理する。Functionの変更はDEVでコード検証後にLIVEへPublishし、ディストリビューションの既存viewer-request関連付けを維持する。

### 4.3 到達性チェック

`scripts/sweep-sitemap-status.sh` はmacOS標準Bashで利用できない `mapfile` に依存しているため、Bash 3.2互換の配列読み込みへ変更する。検証結果は次を合格条件とする。

- sitemap URL総数: 202
- HTTP 200: 202
- non-200: 0
- sitemap内の `/en/` / `/zh/`: 0

### 4.4 運用記録

次のファイルを更新または追加する。

- `docs/operations/p4-020-search-console-error-check.md`: 2026-08-09のSearch Console実測値、各URLの対応判断、DNS修正後の再検証結果を追記
- `docs/operations/cloudfront-url-rewrite-setup.md`: Functionの役割、Host正規化、公開・ロールバック手順を記録
- `infra/cloudfront/url-rewrite.js`: AWS上のLIVE Functionと一致するソースを管理

## 5. データフローと状態遷移

```text
HTTP/HTTPS apex request
  → Cloudflare DNS CNAME flattening
  → CloudFront
  → apex Hostならwww HTTPSへ301
  → www HostならURL rewrite
  → S3 object取得
  → 200 HTML
```

正規URLは常に `https://www.aws-cert-roadmap-lab.com` とする。sitemap・canonical・OGP URLも現行のwww方針を維持する。

## 6. エラー処理とロールバック

- CloudflareのDNS反映後にapexがCloudFrontへ解決できない場合、Cloudflareのapexレコード値を再確認し、CloudFrontドメイン以外の値を残さない。
- CloudFront FunctionのPublishまたは反映に失敗した場合、Functionコードを直前のLIVE内容へ戻し、DNSだけが切り替わった状態を長時間残さない。
- apexの301確認前にSearch Consoleの修正検証を開始しない。
- DNS変更前のapex応答、CloudFront FunctionのETag、変更後のDNS・HTTP結果をログに残す。
- 変更後にwwwの既存URLが200でなくなった場合は、DNS変更ではなくCloudFront Function / Distribution設定を先にロールバックする。

## 7. 検証計画

### ローカル

- `git diff --check`
- `frontend` の `npm run typecheck`
- `frontend` の `npm test`
- 到達性scriptをmacOS標準Bashで実行し、mapfileエラーが出ないことを確認

### AWS / DNS

- Cloudflare権威DNSへ問い合わせ、apexがCloudFrontへ解決することを確認
- `http://aws-cert-roadmap-lab.com/` がHTTPS/wwwへリダイレクトされることを確認
- `https://aws-cert-roadmap-lab.com/` がwwwへ301されることを確認
- `https://www.aws-cert-roadmap-lab.com/` が200であることを確認
- `https://www.aws-cert-roadmap-lab.com/terms/cloudformation`、`/questions/clf-002`、`/blog/clf-monitoring-cloudwatch-basics` が200であることを確認
- sitemap全202 URLが200であることを確認

### Search Console

DNS・CloudFront・サイトマップの確認後、次を記録する。

1. 404の修正検証結果
2. redirectの修正検証結果
3. alternate canonicalの修正検証結果
4. noindex対象URLの現行robotsとクロール済みHTML
5. 登録済み / 未登録 / 検出-未登録の週次推移
6. 模擬問題ページの最終クロール日とクロール済みHTMLの解説本文

Search Consoleの「修正を検証」送信は外部状態を変更するため、実装後に対象行と内容を確認してから実行する。再申請判断は、2026-08-02の本番反映日から最低14日経過し、Googleが修正後HTMLをクロール済みであることを確認した後に行う。

## 8. 完了条件

- apexがCloudFrontへ解決する
- apexがwwwへ301される
- wwwの既存ページと拡張子なしURL rewriteが200を維持する
- sitemapの202 URLがすべて200になる
- 到達性scriptがmacOS標準Bashで実行できる
- CloudFront Functionのソースと手順がリポジトリに残る
- Search Consoleの404・redirect・canonical・noindexについて、修正済み／経過観察／意図的除外の判断が記録される
- 「検出 - インデックス未登録」150件は、修正対象ではなく週次観測対象として明記される

