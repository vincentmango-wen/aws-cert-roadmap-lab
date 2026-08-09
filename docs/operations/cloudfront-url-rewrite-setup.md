# CloudFront URL正規化の反映手順

## 目的

`aws-cert-roadmap-lab.com` を `https://www.aws-cert-roadmap-lab.com` へ301リダイレクトし、www hostでは既存の静的HTML書き換えを継続する。Search Consoleで検出されたapex/httpのリダイレクトとalternate canonicalを、CloudFrontの同一viewer-request Functionで統一する。

## 対象リソース

| 項目 | 値 |
| --- | --- |
| CloudFront Distribution ID | `EHIV14NX361T7` |
| CloudFront domain | `d25a018o7xkwid.cloudfront.net` |
| aliases | `aws-cert-roadmap-lab.com`, `www.aws-cert-roadmap-lab.com` |
| CloudFront Function | `aws-cert-url-rewrite` |
| Function ARN | `arn:aws:cloudfront::526261728564:function/aws-cert-url-rewrite` |
| Runtime | `cloudfront-js-2.0` |
| Function association | viewer-request |
| 正規URL | `https://www.aws-cert-roadmap-lab.com` |
| DNS管理 | Cloudflare |
| 権威nameserver | `kobe.ns.cloudflare.com`, `deborah.ns.cloudflare.com` |

Route 53 Hosted Zone `Z023394017OSHJA6GKOI8` は権威DNSではないため、この作業では変更しない。

## 反映前バックアップ

作業はリポジトリルートで行い、AWS CLIの認証済みアカウントが `526261728564` であることを確認する。

```bash
BACKUP_DIR="/tmp/aws-cert-url-rewrite-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
aws sts get-caller-identity --query Account --output text
aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage LIVE \
  > "$BACKUP_DIR/live-function-summary.json"
aws cloudfront get-function \
  --name aws-cert-url-rewrite \
  --stage LIVE \
  "$BACKUP_DIR/live-function.js"
aws cloudfront get-distribution-config \
  --id EHIV14NX361T7 \
  > "$BACKUP_DIR/distribution-config.json"
```

バックアップに含まれるLIVE FunctionのETag、FunctionConfig、コード、distributionのFunction associationを確認し、異なるFunctionや異なるdistributionを対象にしていないことを確認する。

## DEV版の更新・テスト・LIVE反映

1. 対象のDEV版ETagを取得する。

```bash
DEV_ETAG="$(aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage DEVELOPMENT \
  --query ETag \
  --output text)"
printf 'development etag: %s\n' "$DEV_ETAG"
```

2. `infra/cloudfront/url-rewrite.js` をDEV版へアップロードする。現在のFunction Commentは空文字列であるため、Commentは空のまま維持する。

```bash
aws cloudfront update-function \
  --name aws-cert-url-rewrite \
  --if-match "$DEV_ETAG" \
  --function-config '{"Comment":"","Runtime":"cloudfront-js-2.0"}' \
  --function-code fileb://infra/cloudfront/url-rewrite.js
```

3. 更新後のDEV版ETagを取り直し、apex hostのテストイベントを実行する。

```bash
DEV_ETAG="$(aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage DEVELOPMENT \
  --query ETag \
  --output text)"
aws cloudfront test-function \
  --name aws-cert-url-rewrite \
  --if-match "$DEV_ETAG" \
  --stage DEVELOPMENT \
  --event-object fileb://infra/cloudfront/test-events/apex-request.json \
  --output json
```

テスト結果は、`statusCode` が `301`、Locationが `https://www.aws-cert-roadmap-lab.com/blog/example?ref=search` であることを確認する。エラーや想定外の書き換えがあればpublishしない。

4. テスト成功後にLIVEへpublishする。

```bash
aws cloudfront publish-function \
  --name aws-cert-url-rewrite \
  --if-match "$DEV_ETAG"
```

5. LIVE状態とdistribution associationを確認する。

```bash
aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage LIVE \
  --query 'FunctionSummary.{Status:Status,Runtime:FunctionConfig.Runtime,ARN:FunctionMetadata.FunctionARN}' \
  --output table
aws cloudfront get-distribution-config \
  --id EHIV14NX361T7 \
  --query 'DistributionConfig.DefaultCacheBehavior.FunctionAssociations.Items' \
  --output json
```

LIVE FunctionのStatusが `DEPLOYED` で、viewer-request associationが `arn:aws:cloudfront::526261728564:function/aws-cert-url-rewrite` のままであることを確認する。distributionのDeployed反映を確認するまではDNS変更へ進まない。

## Cloudflare DNS変更

Cloudflare dashboardの対象zone `aws-cert-roadmap-lab.com` を開き、DNSレコードを確認する。

- apex (`@`) の現行Aレコード `18.204.152.241` を削除する。
- apex (`@`) にCNAME `d25a018o7xkwid.cloudfront.net` を追加する。
- Proxy statusはDNS only（灰色雲）、TTLはAutoにする。
- `www` のCNAME `d25a018o7xkwid.cloudfront.net` は変更しない。
- ACM検証用CNAME、MX、TXT、その他の無関係なレコードは変更しない。

CloudFrontの証明書がCloudflare経由のプロキシを想定していないため、apex CNAMEはDNS onlyにする。画面を再読み込みし、apexにCloudFront向けCNAMEが1件だけ存在することを確認する。

## 反映後の確認

```bash
dig +trace aws-cert-roadmap-lab.com A
dig @kobe.ns.cloudflare.com aws-cert-roadmap-lab.com CNAME +short
dig @deborah.ns.cloudflare.com aws-cert-roadmap-lab.com CNAME +short
curl -4 --http1.1 -I https://aws-cert-roadmap-lab.com/
curl -4 --http1.1 -I https://www.aws-cert-roadmap-lab.com/
curl -4 --http1.1 -I http://aws-cert-roadmap-lab.com/
curl -4 --http1.1 -I http://www.aws-cert-roadmap-lab.com/
curl -4 --http1.1 -I 'https://aws-cert-roadmap-lab.com/blog/s3-cloudfront-static-site?ref=search'
curl -4 --http1.1 -I https://www.aws-cert-roadmap-lab.com/terms/cloudformation
bash scripts/sweep-sitemap-status.sh
```

期待結果は次のとおり。

- apex HTTPSは301で `https://www.aws-cert-roadmap-lab.com/` へ遷移する。
- www HTTPSは200である。
- apex/httpとwww/httpは最終的にhttpsのwwwへ遷移する。
- apexのパスとquery stringはwwwのLocationへ保持される。
- sitemap URLの全件が200で、スイープのnon-200 countが0である。

## ロールバック

公開URLの確認でエラーが発生した場合は、まずCloudflare DNSを現行Aレコードへ戻し、名前解決の安定を待つ。

- apex (`@`) のCNAME `d25a018o7xkwid.cloudfront.net` を削除する。
- apex (`@`) にA `18.204.152.241` を戻す。
- `www` とACM検証レコードは変更しない。

Functionだけを戻す必要がある場合は、反映前バックアップの `live-function.js` を使い、DEV Functionを更新・test・publishする。バックアップ取得時のFunctionConfigが空Comment、Runtime `cloudfront-js-2.0` であることを確認してから実行する。

```bash
ROLLBACK_ETAG="$(aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage DEVELOPMENT \
  --query ETag \
  --output text)"
aws cloudfront update-function \
  --name aws-cert-url-rewrite \
  --if-match "$ROLLBACK_ETAG" \
  --function-config '{"Comment":"","Runtime":"cloudfront-js-2.0"}' \
  --function-code fileb://$BACKUP_DIR/live-function.js
ROLLBACK_ETAG="$(aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage DEVELOPMENT \
  --query ETag \
  --output text)"
aws cloudfront publish-function \
  --name aws-cert-url-rewrite \
  --if-match "$ROLLBACK_ETAG"
```

ロールバック後も `curl -4 --http1.1 -I https://www.aws-cert-roadmap-lab.com/` が200であること、distribution associationが残っていることを確認し、原因と時刻を作業ログへ記録する。
