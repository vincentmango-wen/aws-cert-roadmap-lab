# Deploying CloudFront URL Normalization

## Purpose

Redirect `aws-cert-roadmap-lab.com` to `https://www.aws-cert-roadmap-lab.com` with HTTP 301, while retaining the existing static HTML rewrite on the www host. Consolidate the apex/HTTP redirects and alternate canonical behavior detected by Search Console into the same CloudFront viewer-request Function.

## Target resources

| Item | Value |
| --- | --- |
| CloudFront Distribution ID | `EHIV14NX361T7` |
| CloudFront domain | `d25a018o7xkwid.cloudfront.net` |
| aliases | `aws-cert-roadmap-lab.com`, `www.aws-cert-roadmap-lab.com` |
| CloudFront Function | `aws-cert-url-rewrite` |
| Function ARN | `arn:aws:cloudfront::526261728564:function/aws-cert-url-rewrite` |
| Runtime | `cloudfront-js-2.0` |
| Function association | viewer-request |
| Canonical URL | `https://www.aws-cert-roadmap-lab.com` |
| DNS management | Cloudflare |
| Authoritative nameservers | `kobe.ns.cloudflare.com`, `deborah.ns.cloudflare.com` |

Route 53 hosted zone `Z023394017OSHJA6GKOI8` is not the authoritative DNS service and must not be changed during this procedure.

## Pre-deployment backup

Work from the repository root and verify that the AWS CLI is authenticated to account `526261728564`.

```bash
BACKUP_DIR="/tmp/aws-cert-url-rewrite-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
aws sts get-caller-identity --query Account --output text
aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage LIVE \
  > "$BACKUP_DIR/live-function-summary.json"
LIVE_ETAG="$(aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage LIVE \
  --query ETag \
  --output text)"
aws cloudfront test-function \
  --name aws-cert-url-rewrite \
  --if-match "$LIVE_ETAG" \
  --stage LIVE \
  --event-object fileb://infra/cloudfront/test-events/apex-request.json \
  > "$BACKUP_DIR/live-apex-test-result.json"
aws cloudfront get-function \
  --name aws-cert-url-rewrite \
  --stage LIVE \
  "$BACKUP_DIR/live-function.js"
aws cloudfront get-distribution-config \
  --id EHIV14NX361T7 \
  > "$BACKUP_DIR/distribution-config.json"
```

Inspect the LIVE Function ETag, FunctionConfig, code, and distribution Function association in the backup. Confirm that the operation does not target a different Function or distribution.

## Update and test DEVELOPMENT, then publish to LIVE

1. Retrieve the target DEVELOPMENT version's ETag.

```bash
DEV_ETAG="$(aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage DEVELOPMENT \
  --query ETag \
  --output text)"
printf 'development etag: %s\n' "$DEV_ETAG"
```

2. Upload `infra/cloudfront/url-rewrite.js` to the DEVELOPMENT version. The current Function Comment is an empty string; keep it empty.

```bash
aws cloudfront update-function \
  --name aws-cert-url-rewrite \
  --if-match "$DEV_ETAG" \
  --function-config '{"Comment":"","Runtime":"cloudfront-js-2.0"}' \
  --function-code fileb://infra/cloudfront/url-rewrite.js
```

3. Retrieve the updated DEVELOPMENT version's ETag and run the apex host test event.

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

Verify that the test result has `statusCode` `301` and Location `https://www.aws-cert-roadmap-lab.com/blog/example?ref=search`. Do not publish if there are errors or unexpected rewrites.

4. Publish to LIVE after the test succeeds.

```bash
aws cloudfront publish-function \
  --name aws-cert-url-rewrite \
  --if-match "$DEV_ETAG"
```

5. Verify the LIVE state and distribution association.

```bash
aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage LIVE \
  --query 'FunctionSummary.{Stage:FunctionMetadata.Stage,Status:Status,Runtime:FunctionConfig.Runtime,ARN:FunctionMetadata.FunctionARN}' \
  --output table
aws cloudfront get-distribution-config \
  --id EHIV14NX361T7 \
  --query 'DistributionConfig.DefaultCacheBehavior.FunctionAssociations.Items' \
  --output json
aws cloudfront wait distribution-deployed \
  --id EHIV14NX361T7
attempt=1
while [ "$attempt" -le 30 ]; do
  FUNCTION_STATUS="$(aws cloudfront describe-function \
    --name aws-cert-url-rewrite \
    --stage LIVE \
    --query FunctionSummary.Status \
    --output text)"
  [ "$FUNCTION_STATUS" = "DEPLOYED" ] && break
  attempt=$((attempt + 1))
  sleep 2
done
[ "$FUNCTION_STATUS" = "DEPLOYED" ]
aws cloudfront get-distribution \
  --id EHIV14NX361T7 \
  --query 'Distribution.{Status:Status,DomainName:DomainName}' \
  --output table
```

Verify that the LIVE Function Stage is `LIVE`, its Status is the environment's normal value `DEPLOYED`, and the viewer-request association remains `arn:aws:cloudfront::526261728564:function/aws-cert-url-rewrite`. The Function may temporarily remain `IN_PROGRESS` even after the distribution waiter succeeds. Do not proceed to DNS changes until both have finished deploying.

## Cloudflare DNS changes

Open the `aws-cert-roadmap-lab.com` zone in the Cloudflare dashboard and inspect its DNS records.

- Remove the current apex (`@`) A record `18.204.152.241`.
- Add an apex (`@`) CNAME pointing to `d25a018o7xkwid.cloudfront.net`.
- Set Proxy status to DNS only (gray cloud) and TTL to Auto.
- Do not change the `www` CNAME `d25a018o7xkwid.cloudfront.net`.
- Do not change ACM validation CNAMEs, MX, TXT, or unrelated records.

Set the apex CNAME to DNS only because the CloudFront certificate setup does not assume proxying through Cloudflare. Reload the page and verify that exactly one apex CNAME points to CloudFront.

## Post-deployment verification

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

Expected results:

- Apex HTTPS returns 301 and redirects to `https://www.aws-cert-roadmap-lab.com/`.
- www HTTPS returns 200.
- Apex HTTP and www HTTP ultimately redirect to HTTPS on www.
- The apex path and query string are preserved in the www Location.
- Every sitemap URL returns 200, and the sweep reports a non-200 count of 0.

## Rollback

On 2026-08-09, the old A record `18.204.152.241` was confirmed to fail TLS and return a Heroku-originated 204 response. Do not use it as a rollback target. Retain the apex CloudFront CNAME and limit rollback to the faulty Function.

If only the Function needs to be restored, use `live-function.js` from the pre-deployment backup to update, test, and publish the DEVELOPMENT Function. First verify that the backed-up FunctionConfig has an empty Comment and Runtime `cloudfront-js-2.0`.

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
  --function-code "fileb://$BACKUP_DIR/live-function.js"
ROLLBACK_ETAG="$(aws cloudfront describe-function \
  --name aws-cert-url-rewrite \
  --stage DEVELOPMENT \
  --query ETag \
  --output text)"
ROLLBACK_ERROR="$(aws cloudfront test-function \
  --name aws-cert-url-rewrite \
  --if-match "$ROLLBACK_ETAG" \
  --stage DEVELOPMENT \
  --event-object fileb://infra/cloudfront/test-events/apex-request.json \
  --query TestResult.FunctionErrorMessage \
  --output text)"
[ -z "$ROLLBACK_ERROR" ] || {
  printf 'rollback test failed: %s\n' "$ROLLBACK_ERROR" >&2
  exit 1
}
aws cloudfront test-function \
  --name aws-cert-url-rewrite \
  --if-match "$ROLLBACK_ETAG" \
  --stage DEVELOPMENT \
  --event-object fileb://infra/cloudfront/test-events/apex-request.json \
  --query TestResult.FunctionOutput \
  --output text
```

After the error check passes, verify that the displayed `FunctionOutput` matches the expected behavior recorded in the backup's `live-apex-test-result.json`. Run the following publish command as a separate step only after confirming that they match.

```bash
aws cloudfront publish-function \
  --name aws-cert-url-rewrite \
  --if-match "$ROLLBACK_ETAG"
```

After rollback, verify that `curl -4 --http1.1 -I https://www.aws-cert-roadmap-lab.com/` still returns 200 and the distribution association remains in place. Record the cause and time in the work log.
