# Search Console Indexing Remediation and Revalidation Design

## Document information

| Item | Details |
|---|---|
| Created | 2026-08-09 |
| Target site | https://www.aws-cert-roadmap-lab.com |
| Target property | Search Console domain property `aws-cert-roadmap-lab.com` |
| Status | Awaiting Fumi's confirmation |
| Main goal | Consolidate apex URLs under www and make reachability, canonical, and Search Console checks repeatable |

## 1. Background and observed results

### Search Console observations

The Search Console Page indexing report was checked on 2026-08-09. Its last update was 2026-08-05, with the following results.

| Status | Count | Assessment |
|---|---:|---|
| Indexed | 48 | Record as the current indexed-page count. |
| Not indexed | 160 | Address each category separately. |
| Discovered - currently not indexed | 150 | Await Google's recrawl; not a direct code-remediation target. |
| Not found (404) | 6 | Check old-URL reachability and the state of current URLs. |
| Excluded by noindex tag | 1 | Recheck currently served HTML and proceed to fix validation. |
| Page with redirect | 2 | Revalidate after HTTP / apex normalization. |
| Alternate page with proper canonical tag | 1 | Prevent recurrence by redirecting apex to www with 301. |
| Crawled - currently not indexed | 0 | The current direct indicator of thin content is zero. |

The detailed Search Console URLs were:

- 404: `/terms/cloudformation`, `/terms/elastic-beanstalk`, apex `/blog/s3-cloudfront-static-site`, apex `/contact`, `/questions/clf-002`, `/questions/clf-010`
- noindex: `https://www.aws-cert-roadmap-lab.com/blog/clf-monitoring-cloudwatch-basics`
- redirect: `http://www.aws-cert-roadmap-lab.com/`, `http://aws-cert-roadmap-lab.com/`
- alternate canonical: `https://aws-cert-roadmap-lab.com/`

In current production HTML, the two glossary pages and two question pages classified as 404, as well as the noindex blog post, each returned 200. The blog post's robots value was `index, follow`, and its canonical was the www URL. These reports may retain the state from Google's previous crawl, so verify them through a recrawl after remediation.

### DNS / CloudFront observations

- Authoritative DNS is Cloudflare (`kobe.ns.cloudflare.com` / `deborah.ns.cloudflare.com`). A Route 53 hosted zone exists but is not authoritative, so do not change it for this work.
- Apex `aws-cert-roadmap-lab.com` currently returns `18.204.152.241` and does not reach CloudFront. HTTPS produced a TLS error, and HTTP returned an empty response.
- `www.aws-cert-roadmap-lab.com` points to `d25a018o7xkwid.cloudfront.net` and returns 200 over HTTPS.
- CloudFront distribution `EHIV14NX361T7` has both apex and www in its aliases, and its ACM certificate covers both.
- CloudFront Function `aws-cert-url-rewrite` is deployed. It currently maps `/` to `index.html` and extensionless URLs to `.html`, but does not yet normalize the apex host to www.

## 2. Goals and exclusions

### Goals

1. Make apex requests reach CloudFront.
2. Consolidate apex under `https://www.aws-cert-roadmap-lab.com` using 301 redirects.
3. Preserve existing extensionless-URL rewriting on www.
4. Make Search Console's 404, redirect, and canonical findings ready for revalidation against the site's current canonical-URL policy.
5. Record operational information about DNS, the CloudFront Function, and reachability checks in the repository.

### Exclusions

- Bulk indexing requests for the 150 Discovered - currently not indexed URLs. Observe Google's recrawl progress weekly instead.
- Unnecessary noindex changes to blog posts already serving `index, follow`.
- Changes to the en/zh release policy. Preserve the current Japanese-only sitemap and locale-gating policy.
- Route 53 hosted-zone record changes.
- Changes to S3 bucket configuration, CloudFront origins, certificates, or cache policies.

## 3. Options considered

### Option A: Cloudflare apex → CloudFront, then 301 to www using a CloudFront Function (selected)

Point the Cloudflare apex to the CloudFront domain and inspect Host in the CloudFront viewer-request Function. Return a 301 to www for apex requests, and perform the existing extensionless-URL rewrite for www requests.

- Advantage: Centralizes canonical URLs and addresses the sources of 404, redirect, and canonical issues through the same request path.
- Disadvantage: Requires DNS changes and CloudFront Function deployment.

### Option B: Point apex to CloudFront only

Change DNS only and serve the same content on apex.

- Advantage: Minimal change.
- Disadvantage: Duplicates content across apex and www, potentially leaving Search Console's alternate-canonical finding in place.

### Option C: Add separate redirect handling in Cloudflare

Use a Cloudflare Worker or Redirect Rule to forward apex to www.

- Advantage: No CloudFront Function change.
- Disadvantage: Spreads behavior across DNS, Cloudflare, and CloudFront, complicating responsibility boundaries with the existing CloudFront rewrite.

## 4. Selected design

### 4.1 DNS

Apply the following in Cloudflare DNS.

| Name | Type | Value | Proxy |
|---|---|---|---|
| `@` | CNAME | `d25a018o7xkwid.cloudfront.net` | DNS only (gray cloud) |
| `www` | Retain existing CNAME | `d25a018o7xkwid.cloudfront.net` | Unchanged |

Use Cloudflare apex CNAME flattening so apex resolves to CloudFront. Do not enable Cloudflare Proxy or add another TLS/CDN layer in this work.

### 4.2 CloudFront Function

Update the existing `aws-cert-url-rewrite` in this order:

1. If Host is `aws-cert-roadmap-lab.com`, return 301 to the same path under `https://www.aws-cert-roadmap-lab.com`.
2. If Host is `www.aws-cert-roadmap-lab.com`, perform the existing URL rewrite.
3. For unexpected hosts, retain the existing rewrite rather than forcing a www redirect, to avoid breaking current CloudFront behavior.
4. Preserve the query string during redirects so Search Console inspection parameters and future analytics parameters are not lost.

Add `infra/cloudfront/url-rewrite.js` to the repository and keep it aligned with the AWS LIVE Function. Verify changes in DEVELOPMENT before publishing to LIVE, and preserve the distribution's existing viewer-request association.

### 4.3 Reachability checks

`scripts/sweep-sitemap-status.sh` depends on `mapfile`, which is unavailable in the macOS system Bash. Replace it with Bash 3.2-compatible array loading. The verification pass criteria are:

- Total sitemap URLs: 202
- HTTP 200: 202
- non-200: 0
- `/en/` / `/zh/` URLs in the sitemap: 0

### 4.4 Operational records

Update or add:

- `docs/operations/p4-020-search-console-error-check.md`: Add the 2026-08-09 Search Console measurements, the decision for each URL, and revalidation results after the DNS fix.
- `docs/operations/cloudfront-url-rewrite-setup.md`: Record the Function's role, host normalization, and publication / rollback procedures.
- `infra/cloudfront/url-rewrite.js`: Maintain source matching the AWS LIVE Function.

## 5. Data flow and state transitions

```text
HTTP/HTTPS apex request
  → Cloudflare DNS CNAME flattening
  → CloudFront
  → if apex Host, return 301 to HTTPS www
  → if www Host, rewrite URL
  → fetch S3 object
  → 200 HTML
```

The canonical base URL is always `https://www.aws-cert-roadmap-lab.com`. Preserve the current www policy for sitemap, canonical, and OGP URLs.

## 6. Error handling and rollback

- If apex does not resolve to CloudFront after the Cloudflare DNS change, recheck its record value and do not leave a value other than the CloudFront domain.
- If CloudFront Function publication or propagation fails, restore the previous LIVE code. Do not leave DNS switched over alone for an extended period.
- Do not start Search Console fix validation before verifying the apex 301.
- Log the apex response before the DNS change, the CloudFront Function ETag, and DNS / HTTP results after the change.
- If existing www URLs stop returning 200 after the change, roll back the CloudFront Function / Distribution settings before rolling back DNS.

## 7. Verification plan

### Local

- `git diff --check`
- `npm run typecheck` in `frontend`
- `npm test` in `frontend`
- Run the reachability script using macOS system Bash and confirm no mapfile error.

### AWS / DNS

- Query Cloudflare authoritative DNS and verify that apex resolves to CloudFront.
- Verify `http://aws-cert-roadmap-lab.com/` redirects to HTTPS / www.
- Verify `https://aws-cert-roadmap-lab.com/` returns a 301 to www.
- Verify `https://www.aws-cert-roadmap-lab.com/` returns 200.
- Verify `https://www.aws-cert-roadmap-lab.com/terms/cloudformation`, `/questions/clf-002`, and `/blog/clf-monitoring-cloudwatch-basics` return 200.
- Verify all 202 sitemap URLs return 200.

### Search Console

After checking DNS, CloudFront, and the sitemap, record:

1. 404 fix-validation results
2. Redirect fix-validation results
3. Alternate-canonical fix-validation results
4. Current robots directives and crawled HTML for the noindex URL
5. Weekly trends for Indexed / Not indexed / Discovered - currently not indexed
6. Practice question pages' last crawl dates and explanation text in their crawled HTML

Submitting Validate fix in Search Console changes external state. After implementation, confirm the target row and details before submitting. Make the resubmission decision only after at least 14 days have passed since the 2026-08-02 production deployment and Google has crawled the corrected HTML.

## 8. Completion criteria

- Apex resolves to CloudFront.
- Apex returns 301 to www.
- Existing www pages and extensionless-URL rewriting continue to return 200.
- All 202 sitemap URLs return 200.
- The reachability script runs with macOS system Bash.
- CloudFront Function source and procedures are retained in the repository.
- Decisions of fixed, monitoring, or intentionally excluded are recorded for Search Console's 404, redirect, canonical, and noindex findings.
- The 150 Discovered - currently not indexed URLs are explicitly classified as weekly observation targets rather than remediation targets.
