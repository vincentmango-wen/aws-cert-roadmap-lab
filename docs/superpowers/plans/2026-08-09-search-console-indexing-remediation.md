# Search Console Indexing Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate canonical URLs for `aws-cert-roadmap-lab.com` under `https://www.aws-cert-roadmap-lab.com`, and resolve Search Console redirect, canonical, 404, and noindex findings consistently with the current site architecture.

**Architecture:** Point the Cloudflare apex DNS record to the CNAME for CloudFront distribution `EHIV14NX361T7`. In CloudFront Function `aws-cert-url-rewrite`, redirect only the apex host to www with HTTP 301, retaining the path and query string. Keep the existing static HTML rewrite for the www host. Do not change Route 53 hosted zone `Z023394017OSHJA6GKOI8`, because it is not authoritative.

**Tech Stack:** CloudFront Functions (`cloudfront-js-2.0`), Cloudflare DNS, AWS CLI, Bash 3.2-compatible scripts, Node.js built-in test runner, Google Search Console.

## Global Constraints

- Use `https://www.aws-cert-roadmap-lab.com` as the canonical base URL.
- Preserve existing CloudFront www delivery, the Function's static HTML rewrite, the ACM certificate, and Cloudflare ACM validation CNAMEs.
- Do not change Route 53 hosted-zone NS/SOA records or existing ACM validation records.
- Do not delete existing `frontend` content URLs solely because Search Console previously reported 404s. Treat them as URLs currently returning 200.
- `/blog/clf-monitoring-cloudwatch-basics` currently serves `index, follow` and a www canonical. Do not speculatively add `noIndex` to its MDX.
- Do not modify or stage existing untracked `.claude/` files.
- Record each external-state change's resource and action in the work log, then verify immediately.

---

## Task 1: Add CloudFront Function source and unit tests

**Files:**
- Create: `infra/cloudfront/url-rewrite.js`
- Create: `infra/cloudfront/url-rewrite.test.mjs`

- [ ] Implement apex→www 301 handling and the existing static HTML rewrite in `infra/cloudfront/url-rewrite.js`.
  - Use `event.request.headers.host.value` to inspect the host.
  - For `aws-cert-roadmap-lab.com`, return 301 to `https://www.aws-cert-roadmap-lab.com` + original `uri` + original query string.
  - URL-encode the CloudFront Functions query-string object and append it to Location.
  - For www or unexpected hosts, preserve the existing behavior: append `index.html` to a trailing `/`, and `.html` to an extensionless path.
  - Do not change handling of `/`, static files, or URLs with extensions.
- [ ] Create `infra/cloudfront/url-rewrite.test.mjs` using Node.js `node:test` and `vm` to verify the Function in an environment similar to CloudFront.
  - Apex `/` returns 301 to www.
  - Apex paths and query strings are preserved in Location.
  - www `/` is rewritten to `/index.html`.
  - Extensionless www paths are rewritten to `.html`.
  - Static files with extensions are unchanged.
- [ ] Run `node --test infra/cloudfront/url-rewrite.test.mjs` and verify all tests pass.
- [ ] Run `git diff --check`.
- [ ] Commit using Conventional Commits.
  - `feat: add Function redirecting apex URLs to www (#133)`

## Task 2: Support macOS system Bash in sitemap reachability checks

**Files:**
- Modify: `scripts/sweep-sitemap-status.sh`

- [ ] Remove the `mapfile` dependency and build the sitemap URL array with a Bash 3.2-compatible while/read loop.
- [ ] Apply `--http1.1` and the existing timeout and User-Agent to URL-checking curl calls, making transient TLS/HTTP2 failures easier to isolate.
- [ ] Run `bash -n scripts/sweep-sitemap-status.sh`.
- [ ] After the Task 6 DNS switch, run `bash scripts/sweep-sitemap-status.sh` and record sitemap URL HTTP statuses.
- [ ] Run `git diff --check`.
- [ ] Commit using Conventional Commits.
  - `fix: support macOS system Bash in reachability checks (#133)`

## Task 3: Document CloudFront Function deployment and test events

**Files:**
- Create: `docs/operations/cloudfront-url-rewrite-setup.md`
- Create: `infra/cloudfront/test-events/apex-request.json`

- [ ] Document these actual target-resource values in the operational procedure:
  - Distribution ID: `EHIV14NX361T7`
  - Distribution domain: `d25a018o7xkwid.cloudfront.net`
  - Function name: `aws-cert-url-rewrite`
  - Runtime: `cloudfront-js-2.0`
  - aliases: `aws-cert-roadmap-lab.com`, `www.aws-cert-roadmap-lab.com`
- [ ] Document the safe AWS CLI deployment order.
  1. Save the LIVE ETag, code, and distribution association.
  2. Upload to DEVELOPMENT with `update-function`.
  3. Verify the apex-host 301 using `test-function`.
  4. Promote to LIVE using `publish-function`.
  5. Wait for Deployed status and verify that the distribution Function association remains intact.
- [ ] Add a test event in `infra/cloudfront/test-events/apex-request.json` with the apex host, URI `/blog/example`, and query string `ref=search`.
- [ ] Document rollback using the saved LIVE code and configuration: update DEVELOPMENT, test, publish, and restore the distribution association.
- [ ] Document the Cloudflare DNS change, the then-current rollback A record `18.204.152.241`, and verification nameservers `kobe.ns.cloudflare.com` / `deborah.ns.cloudflare.com`.
- [ ] Run `git diff --check`.
- [ ] Commit using Conventional Commits.
  - `docs: add CloudFront and DNS deployment procedures (#133)`

## Task 4: Pass local quality gates

**Files:**
- Verify: `infra/cloudfront/url-rewrite.js`
- Verify: `infra/cloudfront/url-rewrite.test.mjs`
- Verify: `scripts/sweep-sitemap-status.sh`
- Verify: `frontend/package.json`

- [ ] Run `node --test infra/cloudfront/url-rewrite.test.mjs`.
- [ ] Run `bash -n scripts/sweep-sitemap-status.sh`.
- [ ] Run `cd frontend && npm run typecheck && npm test`.
- [ ] If frontend tests fail because of dependency-file permissions, run `cd frontend && npm ci`, rerun the same quality gates, and verify no lockfile changes.
- [ ] Run `git diff --check` and `git status --short` to verify only target files changed.

## Task 5: Deploy the CloudFront Function to DEVELOPMENT / LIVE

**Files:**
- Modify external: CloudFront Function `aws-cert-url-rewrite`
- Verify external: Distribution `EHIV14NX361T7`

- [ ] Save the following before deployment:
  - Configuration and ETag from `aws cloudfront describe-function --name aws-cert-url-rewrite --stage LIVE`
  - Current code from `aws cloudfront get-function --name aws-cert-url-rewrite --stage LIVE`
  - Function association from `aws cloudfront get-distribution-config --id EHIV14NX361T7`
- [ ] Upload the locally tested `infra/cloudfront/url-rewrite.js` using `aws cloudfront update-function`. Preserve the Function Comment and use Runtime `cloudfront-js-2.0`.
- [ ] Get the DEVELOPMENT ETag with `DEV_ETAG="$(aws cloudfront describe-function --name aws-cert-url-rewrite --stage DEVELOPMENT --query ETag --output text)"`, then run `aws cloudfront test-function --name aws-cert-url-rewrite --if-match "$DEV_ETAG" --stage DEVELOPMENT --event-object fileb://infra/cloudfront/test-events/apex-request.json` to verify 301, www Location, path, and query string.
- [ ] After the test passes, publish to LIVE with `aws cloudfront publish-function --name aws-cert-url-rewrite --if-match "$DEV_ETAG"`.
- [ ] Use `describe-function --stage LIVE` to verify a deployed status rather than `UNASSOCIATED`.
- [ ] Use `get-distribution-config` to verify the viewer-request association remains `arn:aws:cloudfront::526261728564:function/aws-cert-url-rewrite`.
- [ ] If AWS CLI reports an ETag conflict or test failure, stop deployment and compare with the saved state.

## Task 6: Switch Cloudflare apex DNS to CloudFront

**Files:**
- Modify external: Cloudflare zone `aws-cert-roadmap-lab.com` DNS records

- [ ] Check Cloudflare login state. If signed out, ask Fumi to sign in at `https://dash.cloudflare.com/` and resume afterward.
- [ ] Inspect DNS records for zone `aws-cert-roadmap-lab.com`.
- [ ] Replace the current apex (`@`) A record `18.204.152.241` with this CNAME:
  - Name: `@`
  - Target: `d25a018o7xkwid.cloudfront.net`
  - Proxy status: DNS only (gray cloud)
  - TTL: Auto
- [ ] Do not change the existing `www` CNAME `d25a018o7xkwid.cloudfront.net`.
- [ ] Do not change ACM validation CNAMEs, MX, TXT, or unrelated records.
- [ ] Immediately reread the records in Cloudflare and verify exactly one apex CNAME points to CloudFront.
- [ ] Use `dig +trace aws-cert-roadmap-lab.com A` and direct queries to `kobe.ns.cloudflare.com` / `deborah.ns.cloudflare.com` to verify Cloudflare is authoritative and check updated resolution.

## Task 7: Verify production reachability and canonical URLs

**Files:**
- Verify external: `https://aws-cert-roadmap-lab.com`
- Verify external: `https://www.aws-cert-roadmap-lab.com`
- Verify: `scripts/sweep-sitemap-status.sh`

- [ ] Check the following with `curl -4 --http1.1 -I`.
  - `https://aws-cert-roadmap-lab.com/` returns `301` to `https://www.aws-cert-roadmap-lab.com/`.
  - `https://www.aws-cert-roadmap-lab.com/` returns `200`.
  - `http://aws-cert-roadmap-lab.com/` ultimately redirects to HTTPS www.
  - `http://www.aws-cert-roadmap-lab.com/` redirects to HTTPS www.
- [ ] Verify representative URLs preserve their paths and query strings.
  - `/blog/s3-cloudfront-static-site?ref=search`
  - `/terms/cloudformation`
  - `/questions/clf-002`
- [ ] Verify `https://www.aws-cert-roadmap-lab.com/sitemap.xml` returns `200` and contains only canonical www URLs.
- [ ] Run `bash scripts/sweep-sitemap-status.sh`; verify sitemap URLs return `200`, with `0` redirects and `0` 404s.
- [ ] Verify `/blog/clf-monitoring-cloudwatch-basics` HTML has `robots=index, follow` and a www canonical.

## Task 8: Record Search Console findings and observations

**Files:**
- Create or Modify: `docs/operations/search-console-indexing-remediation.md`

- [ ] Record the Search Console baseline as of 2026-08-09.
  - Not indexed: 160
  - Indexed: 48
  - Reasons: 5
  - Discovered - currently not indexed: 150
  - 404: 6
  - noindex: 1
  - Redirect: 2
  - Alternate page canonical: 1
  - Crawled - currently not indexed: 0
- [ ] For the six historical 404 URLs, distinguish current 200 responses from Search Console's past 404 observations.
- [ ] For the one noindex URL, record that current HTML is index/follow and no noIndex flag was added to MDX.
- [ ] Record that two redirect URLs and one alternate-canonical URL are addressed by DNS/CloudFront normalization from apex/HTTP to HTTPS www.
- [ ] Record authoritative DNS responses before/after the change, CloudFront deployment time, curl results, and sitemap sweep results.
- [ ] Run `git diff --check`.
- [ ] Commit using Conventional Commits.
  - `docs: record Search Console observations and DNS remediation results (#133)`

## Task 9: Start Search Console revalidation and ongoing monitoring

**Files:**
- Modify: `docs/operations/search-console-indexing-remediation.md`

- [ ] After production verification succeeds and the sitemap status is Success, start Search Console Validate fix.
  - 404
  - Page with redirect
  - Alternate page with proper canonical tag
- [ ] Decide whether noindex validation is needed after comparing current HTML with the latest crawled result. Do not start it indiscriminately without checking.
- [ ] Inspect canonical www URLs in Search Console and check indexability and the user-declared canonical.
- [ ] Check exclusion-reason counts and crawl dates on 2026-08-16, 2026-08-23, and 2026-08-30.
- [ ] Do not expect immediate indexing of all 150 Discovered - currently not indexed URLs. Compare sitemap, internal links, and crawl progress weekly.
- [ ] Decide on AdSense resubmission only after checking crawl results from at least 2026-08-16 onward and this validation's results.
- [ ] Add Search Console operation results and the next review date to the same operational document.
- [ ] Commit using Conventional Commits.
  - `docs: record start of Search Console fix validation (#133)`

## Completion Criteria

- [ ] CloudFront Function unit tests pass.
- [ ] Frontend typecheck/tests and Bash syntax checks pass.
- [ ] CloudFront Function DEVELOPMENT tests, LIVE deployment, and distribution-association verification are complete.
- [ ] Cloudflare apex CNAME switch is complete and verified through authoritative and public DNS, with www preserved.
- [ ] Apex/HTTP requests normalize to HTTPS www, and representative www URLs return 200.
- [ ] No sitemap URL returns 404, and canonicals consistently use www.
- [ ] Operational documentation records Search Console's state, actions taken, validation start, and monitoring plan.
- [ ] No unrelated pre-existing user changes or untracked `.claude/` files are included.
