# Japanese Blog Indexing Content Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve 13 thin Japanese blog articles, remove their Japanese `noIndex` controls, keep `/en` and `/zh` sealed, and verify sitemap/metadata consistency before release.

**Architecture:** Coordinator owns tests, shared registry updates, integration, and final verification. Four workers each own a disjoint set of Japanese MDX files in isolated worktrees and must not modify shared TypeScript, config, lockfiles, or other workers' articles.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, MDX frontmatter, static sitemap generation, locale release gate.

**Spec:** `docs/superpowers/specs/2026-08-20-ja-blog-indexing-content-quality-design.md`

## Global Constraints

- Japanese article pages only are re-opened for indexing.
- `LOCALIZED_ROUTES_PUBLISHED` remains `false`.
- No changes to `/en` or `/zh` MDX content or route publication.
- Workers modify only their assigned `frontend/contents/blog/ja/*.mdx` files.
- Coordinator alone modifies `frontend/src/contents/blog/blogPosts.ts`, tests, and docs.
- Each target article must remove `noIndex: true` from Japanese MDX only.
- Each target article must include at least two AWS official documentation links using `https://docs.aws.amazon.com/`.
- Each target article must include existing internal links only.
- No unverified prices, quotas, or limits may be stated as fixed values.
- Final release is blocked if any target Japanese page is still `noindex`, any target is missing from sitemap, or any `/en` or `/zh` page becomes indexable.

---

## File Structure

- Create `frontend/src/contents/blog/__tests__/blog-indexing-policy.test.ts`: target slug batches, MDX frontmatter checks, article quality guards, metadata robots checks, sitemap checks, registry noIndex checks, and internal link existence checks.
- Modify `frontend/contents/blog/ja/cloudfront-beginner-cdn.mdx`: Worker 1 CloudFront article.
- Modify `frontend/contents/blog/ja/apigateway-beginner-http-api.mdx`: Worker 1 API Gateway article.
- Modify `frontend/contents/blog/ja/dynamodb-beginner-nosql.mdx`: Worker 1 DynamoDB article.
- Modify `frontend/contents/blog/ja/lambda-beginner-serverless.mdx`: Worker 1 Lambda article.
- Modify `frontend/contents/blog/ja/s3-beginner-object-storage.mdx`: Worker 1 S3 article.
- Modify `frontend/contents/blog/ja/saa-decoupling-sqs-sns-eventbridge.mdx`: Worker 2 decoupling article.
- Modify `frontend/contents/blog/ja/saa-multi-az-high-availability.mdx`: Worker 2 Multi-AZ article.
- Modify `frontend/contents/blog/ja/saa-s3-cloudfront-oac-design.mdx`: Worker 2 S3/CloudFront OAC article.
- Modify `frontend/contents/blog/ja/clf-iam-basics.mdx`: Worker 3 IAM article.
- Modify `frontend/contents/blog/ja/clf-aws-global-infrastructure.mdx`: Worker 3 global infrastructure article.
- Modify `frontend/contents/blog/ja/serverless-contact-api-flow.mdx`: Worker 4 contact API article.
- Modify `frontend/contents/blog/ja/lambda-cloudwatch-logs-check.mdx`: Worker 4 Lambda logs article.
- Modify `frontend/contents/blog/ja/aws-portfolio-serverless-architecture.mdx`: Worker 4 portfolio architecture article.
- Modify `frontend/src/contents/blog/blogPosts.ts`: Coordinator removes `noIndex: true` from the same 13 registry entries after worker content is green.
- Optional update `docs/operations/p4-020-search-console-error-check.md`: Coordinator records final verification commands and Search Console follow-up state if the PR needs an operations note.

## Target Batches

```ts
const targetBatches = [
  {
    name: "aws-services",
    displayName: "AWSサービス基礎",
    slugs: [
      "cloudfront-beginner-cdn",
      "apigateway-beginner-http-api",
      "dynamodb-beginner-nosql",
      "lambda-beginner-serverless",
      "s3-beginner-object-storage",
    ],
  },
  {
    name: "saa-design",
    displayName: "SAA設計",
    slugs: [
      "saa-decoupling-sqs-sns-eventbridge",
      "saa-multi-az-high-availability",
      "saa-s3-cloudfront-oac-design",
    ],
  },
  {
    name: "clf-basics",
    displayName: "CLF基礎",
    slugs: ["clf-iam-basics", "clf-aws-global-infrastructure"],
  },
  {
    name: "implementation",
    displayName: "実装・ポートフォリオ",
    slugs: [
      "serverless-contact-api-flow",
      "lambda-cloudwatch-logs-check",
      "aws-portfolio-serverless-architecture",
    ],
  },
] as const;
```

## Task 1: Coordinator RED Indexing Policy Test

**Files:**
- Create: `frontend/src/contents/blog/__tests__/blog-indexing-policy.test.ts`

**Interfaces:**
- Consumes: `loadBlogContent(locale, slug)`, `createBlogDetailMetadataInput(locale, slug)`, `getBlogSitemapRoutes()`, `blogPosts`.
- Produces: batch-scoped test names workers can run with `pnpm test -- src/contents/blog/__tests__/blog-indexing-policy.test.ts -t "AWSサービス基礎"`.

- [ ] **Step 1: Create the failing test file**

Use this exact test structure:

```ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getBlogSitemapRoutes } from "../../../app/sitemap";
import { createBlogDetailMetadataInput } from "../../../app/(site)/blog/blog-detail-data";
import { loadBlogContent } from "../../../app/(site)/blog/blog-content-loader";
import { blogPosts } from "../blogPosts";
import architecturesJa from "../../../../contents/architectures/architectures.ja.json";
import comparisonsJa from "../../../../contents/comparisons/comparisons.ja.json";
import termsJa from "../../../../contents/terms/terms.ja.json";

type JsonSlugEntry = { slug?: string; published?: boolean };
type TermEntry = { termId?: string; published?: boolean };

const FRONTEND_ROOT = path.resolve(__dirname, "../../../../");
const JA_BLOG_DIR = path.join(FRONTEND_ROOT, "contents", "blog", "ja");

const targetBatches = [
  {
    name: "aws-services",
    displayName: "AWSサービス基礎",
    slugs: [
      "cloudfront-beginner-cdn",
      "apigateway-beginner-http-api",
      "dynamodb-beginner-nosql",
      "lambda-beginner-serverless",
      "s3-beginner-object-storage",
    ],
  },
  {
    name: "saa-design",
    displayName: "SAA設計",
    slugs: [
      "saa-decoupling-sqs-sns-eventbridge",
      "saa-multi-az-high-availability",
      "saa-s3-cloudfront-oac-design",
    ],
  },
  {
    name: "clf-basics",
    displayName: "CLF基礎",
    slugs: ["clf-iam-basics", "clf-aws-global-infrastructure"],
  },
  {
    name: "implementation",
    displayName: "実装・ポートフォリオ",
    slugs: [
      "serverless-contact-api-flow",
      "lambda-cloudwatch-logs-check",
      "aws-portfolio-serverless-architecture",
    ],
  },
] as const;

const targetSlugs = targetBatches.flatMap((batch) => batch.slugs);

function readJaMdx(slug: string): string {
  return fs.readFileSync(path.join(JA_BLOG_DIR, `${slug}.mdx`), "utf8");
}

function extractBody(rawFile: string): string {
  return rawFile.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/)?.[1] ?? rawFile;
}

function countMatches(content: string, pattern: RegExp): number {
  return [...content.matchAll(pattern)].length;
}

function extractMarkdownLinks(content: string): string[] {
  return [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
}

const publishedSlugs = (entries: JsonSlugEntry[]): Set<string> =>
  new Set(
    entries
      .filter((entry) => entry.published !== false)
      .map((entry) => entry.slug)
      .filter((slug): slug is string => typeof slug === "string" && slug.length > 0),
  );

const existingBlogSlugs = new Set(
  fs
    .readdirSync(JA_BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, "")),
);
const existingComparisonSlugs = publishedSlugs(comparisonsJa as JsonSlugEntry[]);
const existingArchitectureSlugs = publishedSlugs(architecturesJa as JsonSlugEntry[]);
const existingTermIds = new Set(
  (termsJa as TermEntry[])
    .filter((entry) => entry.published !== false)
    .map((entry) => entry.termId)
    .filter((termId): termId is string => typeof termId === "string" && termId.length > 0),
);

function expectInternalLinkExists(slug: string, href: string): void {
  if (href.startsWith("/blog/")) {
    const target = href.replace(/^\/blog\//, "").replace(/\/$/, "");
    expect(existingBlogSlugs.has(target), `${slug} links to missing blog page ${href}`).toBe(true);
    return;
  }

  if (href.startsWith("/comparisons/")) {
    const target = href.replace(/^\/comparisons\//, "").replace(/\/$/, "");
    expect(existingComparisonSlugs.has(target), `${slug} links to missing comparison page ${href}`).toBe(true);
    return;
  }

  if (href.startsWith("/architectures/")) {
    const target = href.replace(/^\/architectures\//, "").replace(/\/$/, "");
    expect(existingArchitectureSlugs.has(target), `${slug} links to missing architecture page ${href}`).toBe(true);
    return;
  }

  if (href.startsWith("/terms/")) {
    const target = href.replace(/^\/terms\//, "").replace(/\/$/, "");
    expect(existingTermIds.has(target), `${slug} links to missing term page ${href}`).toBe(true);
    return;
  }

  expect(
    ["/blog", "/terms", "/questions", "/questions/clf", "/questions/saa", "/roadmap"].includes(href),
    `${slug} links to unsupported internal path ${href}`,
  ).toBe(true);
}

describe("blog indexing policy for Search Console noindex remediation", () => {
  const sitemapPathnames = getBlogSitemapRoutes().map((route) => route.pathname);

  for (const batch of targetBatches) {
    describe(`${batch.displayName} batch`, () => {
      for (const slug of batch.slugs) {
        it(`${slug} has indexable Japanese MDX, metadata, sitemap, official links, and valid internal links`, () => {
          const rawFile = readJaMdx(slug);
          const body = extractBody(rawFile);
          const loaded = loadBlogContent("ja", slug);
          const metadataInput = createBlogDetailMetadataInput("ja", slug);
          const officialDocLinks = extractMarkdownLinks(body).filter((href) =>
            href.startsWith("https://docs.aws.amazon.com/"),
          );
          const internalLinks = extractMarkdownLinks(body).filter((href) => href.startsWith("/"));

          expect(rawFile, `${slug} still has noIndex in ja MDX`).not.toMatch(/^noIndex:\s*true\s*$/m);
          expect(loaded, `${slug} did not load`).not.toBeNull();
          expect(loaded?.frontmatter.published, `${slug} is not published`).toBe(true);
          expect(loaded?.frontmatter.noIndex, `${slug} frontmatter remains noIndex`).toBe(false);
          expect(metadataInput.noIndex, `${slug} metadata remains noIndex`).toBe(false);
          expect(sitemapPathnames, `${slug} missing from blog sitemap routes`).toContain(`/blog/${slug}`);

          expect(countMatches(body, /^##\s+/gm), `${slug} needs enough second-level sections`).toBeGreaterThanOrEqual(7);
          expect(body.length, `${slug} body is still too thin`).toBeGreaterThanOrEqual(5200);
          expect(officialDocLinks.length, `${slug} needs at least two AWS docs links`).toBeGreaterThanOrEqual(2);
          expect(internalLinks.length, `${slug} needs at least two internal links`).toBeGreaterThanOrEqual(2);
          expect(body, `${slug} needs an explicit misconception or failure section`).toMatch(/誤解|失敗|つまずき|注意/);

          for (const href of internalLinks) {
            expectInternalLinkExists(slug, href);
          }
        });
      }
    });
  }

  it("target registry entries no longer carry noIndex", () => {
    for (const slug of targetSlugs) {
      const post = blogPosts.find((entry) => entry.slug === slug);
      expect(post, `registry entry missing for ${slug}`).toBeDefined();
      expect(post?.noIndex, `registry noIndex remains for ${slug}`).not.toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the RED test**

Run from `frontend`:

```bash
pnpm test -- src/contents/blog/__tests__/blog-indexing-policy.test.ts
```

Expected: FAIL for the 13 target article cases because Japanese MDX still contains `noIndex: true`, body length is thin, and AWS official documentation links are missing. The registry test also fails until Task 6.

- [ ] **Step 3: Commit the RED test**

```bash
git add frontend/src/contents/blog/__tests__/blog-indexing-policy.test.ts
git commit -m "test: add blog indexing policy guard"
```

## Task 2: Worker 1 AWS Services Articles

**Files:**
- Modify: `frontend/contents/blog/ja/cloudfront-beginner-cdn.mdx`
- Modify: `frontend/contents/blog/ja/apigateway-beginner-http-api.mdx`
- Modify: `frontend/contents/blog/ja/dynamodb-beginner-nosql.mdx`
- Modify: `frontend/contents/blog/ja/lambda-beginner-serverless.mdx`
- Modify: `frontend/contents/blog/ja/s3-beginner-object-storage.mdx`

**Interfaces:**
- Consumes: Task 1 test named `AWSサービス基礎 batch`.
- Produces: five Japanese MDX files with `published: true`, no `noIndex: true`, body length at least 5200 characters, at least seven `##` sections, at least two AWS docs links, and at least two existing internal links.

- [ ] **Step 1: Create worktree from the coordinator branch**

```bash
git worktree add ../aws-cert-roadmap-lab-services -b codex/index-ja-blog-services codex/index-ja-blog-content-quality
```

- [ ] **Step 2: Update each frontmatter**

For each of the five files, delete the line:

```yaml
noIndex: true
```

Set:

```yaml
updatedAt: "2026-08-20"
```

- [ ] **Step 3: Expand `cloudfront-beginner-cdn`**

Add concrete sections covering: target reader and decision value, CloudFront vs ALB/API Gateway/S3 website hosting boundary, viewer-to-edge-to-origin flow, cache key and invalidation flow, HTTPS/ACM/OAC security, cost and operational cautions, exam confusion points, common mistakes, and next learning links.

Required AWS docs links:

```md
- [Amazon CloudFront とは](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [Origin Access Control で S3 オリジンへのアクセスを制限する](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
```

Required internal links:

```md
- [ALB・NLB・CloudFrontの違い](/comparisons/alb-vs-nlb-vs-cloudfront)
- [S3とCloudFront OACで安全に静的サイトを配信する設計](/blog/saa-s3-cloudfront-oac-design)
```

- [ ] **Step 4: Expand `apigateway-beginner-http-api`**

Add concrete sections covering: when API Gateway is needed, HTTP API vs REST API at a high level without hard-coded pricing, Lambda proxy flow, CORS request flow, authorization boundary, throttling and logs, exam confusion points, common mistakes, and next learning links.

Required AWS docs links:

```md
- [Amazon API Gateway とは](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [HTTP API の使用](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)
```

Required internal links:

```md
- [LambdaとAPI Gatewayを初心者向けに解説](/blog/lambda-api-gateway-beginner)
- [API Gateway + Lambda + DynamoDBで問い合わせAPIを作る流れ](/blog/serverless-contact-api-flow)
```

- [ ] **Step 5: Expand `dynamodb-beginner-nosql`**

Add concrete sections covering: DynamoDB as key-value/document NoSQL, partition key and sort key design, access pattern first thinking, Lambda contact-form flow, DynamoDB vs RDS boundary, consistency and capacity mode cautions without fixed pricing claims, exam confusion points, common mistakes, and next learning links.

Required AWS docs links:

```md
- [Amazon DynamoDB とは](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
- [DynamoDB のコアコンポーネント](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html)
```

Required internal links:

```md
- [DynamoDBとRDSの違い](/blog/dynamodb-vs-rds-beginner)
- [RDSとDynamoDBの選び方](/blog/saa-database-selection-rds-dynamodb)
```

- [ ] **Step 6: Expand `lambda-beginner-serverless`**

Add concrete sections covering: serverless execution model, event source flow, cold start concept without overstating, API Gateway and DynamoDB integration, IAM execution role boundary, CloudWatch Logs operations, cost and timeout cautions, exam confusion points, common mistakes, and next learning links.

Required AWS docs links:

```md
- [AWS Lambda とは](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Lambda 実行ロール](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)
```

Required internal links:

```md
- [LambdaとAPI Gatewayを初心者向けに解説](/blog/lambda-api-gateway-beginner)
- [LambdaのログをCloudWatchで確認する方法](/blog/lambda-cloudwatch-logs-check)
```

- [ ] **Step 7: Expand `s3-beginner-object-storage`**

Add concrete sections covering: object storage model, bucket/key/object boundary, static asset and backup examples, S3 vs EBS/EFS boundary, block public access and bucket policy cautions, lifecycle/storage class caution without fixed pricing claims, exam confusion points, common mistakes, and next learning links.

Required AWS docs links:

```md
- [Amazon S3 とは](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [S3 Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
```

Required internal links:

```md
- [S3とCloudFrontで静的サイトを公開する方法](/blog/s3-cloudfront-static-site)
- [S3・EBS・EFSの違い](/comparisons/s3-vs-ebs-vs-efs)
```

- [ ] **Step 8: Run worker tests**

Run from the worker's `frontend` directory:

```bash
pnpm test -- src/contents/blog/__tests__/blog-indexing-policy.test.ts -t "AWSサービス基礎"
pnpm test -- src/contents/blog/__tests__/blog-locale-parity.test.ts
git diff --check
```

Expected: the AWSサービス基礎 batch passes. The registry test is not selected by the `-t` filter and remains coordinator-owned.

- [ ] **Step 9: Commit worker changes**

```bash
git add frontend/contents/blog/ja/cloudfront-beginner-cdn.mdx frontend/contents/blog/ja/apigateway-beginner-http-api.mdx frontend/contents/blog/ja/dynamodb-beginner-nosql.mdx frontend/contents/blog/ja/lambda-beginner-serverless.mdx frontend/contents/blog/ja/s3-beginner-object-storage.mdx
git commit -m "docs: improve AWS service blog indexing content"
```

## Task 3: Worker 2 SAA Design Articles

**Files:**
- Modify: `frontend/contents/blog/ja/saa-decoupling-sqs-sns-eventbridge.mdx`
- Modify: `frontend/contents/blog/ja/saa-multi-az-high-availability.mdx`
- Modify: `frontend/contents/blog/ja/saa-s3-cloudfront-oac-design.mdx`

**Interfaces:**
- Consumes: Task 1 test named `SAA設計 batch`.
- Produces: three Japanese MDX files meeting the same indexing and quality test contract.

- [ ] **Step 1: Create worktree**

```bash
git worktree add ../aws-cert-roadmap-lab-saa -b codex/index-ja-blog-saa codex/index-ja-blog-content-quality
```

- [ ] **Step 2: Update frontmatter**

Delete `noIndex: true` and set `updatedAt: "2026-08-20"` in all three files.

- [ ] **Step 3: Expand `saa-decoupling-sqs-sns-eventbridge`**

Cover synchronous coupling risk, SQS queue buffering, SNS fanout, EventBridge event routing, DLQ/retry considerations, SQS vs SNS vs EventBridge selection matrix, SAA exam traps, common mistakes, and next learning links.

Required AWS docs links:

```md
- [Amazon SQS とは](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)
- [Amazon EventBridge とは](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html)
```

Required internal links:

```md
- [SNS・SQS・EventBridgeの違い](/comparisons/sns-vs-sqs-vs-eventbridge)
- [EventBridge + Lambda バッチ処理構成](/architectures/eventbridge-lambda-batch)
```

- [ ] **Step 4: Expand `saa-multi-az-high-availability`**

Cover single point of failure, Multi-AZ across subnets, ALB + Auto Scaling + RDS Multi-AZ flow, backup vs high availability boundary, failover expectations without fixed RTO/RPO claims, cost and operational cautions, SAA exam traps, common mistakes, and next learning links.

Required AWS docs links:

```md
- [AWS グローバルインフラストラクチャ](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/global-infrastructure.html)
- [Amazon RDS Multi-AZ 配置](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
```

Required internal links:

```md
- [Multi-AZとRead Replicaの違い](/comparisons/multi-az-vs-read-replica)
- [高可用性Webアプリ構成](/architectures/high-availability-web-app)
```

- [ ] **Step 5: Expand `saa-s3-cloudfront-oac-design`**

Cover why direct S3 public access is avoided, CloudFront OAC request flow, bucket policy boundary, HTTPS/canonical deployment context, cache invalidation operation, OAC vs public bucket/OAI boundary, SAA exam traps, common mistakes, and next learning links.

Required AWS docs links:

```md
- [CloudFront で OAC を使用して S3 オリジンへのアクセスを制限する](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [Amazon S3 Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
```

Required internal links:

```md
- [Amazon CloudFrontとは？CDNを初心者向けに解説](/blog/cloudfront-beginner-cdn)
- [静的サイト S3 + CloudFront 構成](/architectures/static-site-s3-cloudfront)
```

- [ ] **Step 6: Run worker tests and commit**

```bash
pnpm test -- src/contents/blog/__tests__/blog-indexing-policy.test.ts -t "SAA設計"
pnpm test -- src/contents/blog/__tests__/blog-locale-parity.test.ts
git diff --check
git add frontend/contents/blog/ja/saa-decoupling-sqs-sns-eventbridge.mdx frontend/contents/blog/ja/saa-multi-az-high-availability.mdx frontend/contents/blog/ja/saa-s3-cloudfront-oac-design.mdx
git commit -m "docs: improve SAA design blog indexing content"
```

## Task 4: Worker 3 CLF Basics Articles

**Files:**
- Modify: `frontend/contents/blog/ja/clf-iam-basics.mdx`
- Modify: `frontend/contents/blog/ja/clf-aws-global-infrastructure.mdx`

**Interfaces:**
- Consumes: Task 1 test named `CLF基礎 batch`.
- Produces: two Japanese MDX files meeting the same indexing and quality test contract.

- [ ] **Step 1: Create worktree**

```bash
git worktree add ../aws-cert-roadmap-lab-clf -b codex/index-ja-blog-clf codex/index-ja-blog-content-quality
```

- [ ] **Step 2: Update frontmatter**

Delete `noIndex: true` and set `updatedAt: "2026-08-20"` in both files.

- [ ] **Step 3: Expand `clf-iam-basics`**

Cover IAM identity vs permission boundary, user/group/role/policy distinction, least privilege, MFA and root user caution, Lambda execution role example, IAM role vs access key exam trap, common mistakes, and next learning links.

Required AWS docs links:

```md
- [AWS Identity and Access Management とは](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
- [IAM のセキュリティベストプラクティス](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
```

Required internal links:

```md
- [IAMユーザー・ロール・ポリシーの違い](/comparisons/iam-user-vs-role-vs-policy)
- [AWS責任共有モデルを初心者向けに整理する](/blog/clf-shared-responsibility-model)
```

- [ ] **Step 4: Expand `clf-aws-global-infrastructure`**

Cover Region, Availability Zone, edge location, Local Zone/Wavelength only as boundary concepts, data residency and latency decision examples, CloudFront edge delivery, CLF exam traps, common mistakes, and next learning links.

Required AWS docs links:

```md
- [AWS グローバルインフラストラクチャ](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/global-infrastructure.html)
- [AWS リージョンとアベイラビリティーゾーン](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
```

Required internal links:

```md
- [Route 53・CloudFront・Global Acceleratorの違い](/comparisons/route53-vs-cloudfront-vs-global-accelerator)
- [Amazon CloudFrontとは？CDNを初心者向けに解説](/blog/cloudfront-beginner-cdn)
```

- [ ] **Step 5: Run worker tests and commit**

```bash
pnpm test -- src/contents/blog/__tests__/blog-indexing-policy.test.ts -t "CLF基礎"
pnpm test -- src/contents/blog/__tests__/blog-locale-parity.test.ts
git diff --check
git add frontend/contents/blog/ja/clf-iam-basics.mdx frontend/contents/blog/ja/clf-aws-global-infrastructure.mdx
git commit -m "docs: improve CLF basics blog indexing content"
```

## Task 5: Worker 4 Implementation And Portfolio Articles

**Files:**
- Modify: `frontend/contents/blog/ja/serverless-contact-api-flow.mdx`
- Modify: `frontend/contents/blog/ja/lambda-cloudwatch-logs-check.mdx`
- Modify: `frontend/contents/blog/ja/aws-portfolio-serverless-architecture.mdx`

**Interfaces:**
- Consumes: Task 1 test named `実装・ポートフォリオ batch`.
- Produces: three Japanese MDX files meeting the same indexing and quality test contract.

- [ ] **Step 1: Create worktree**

```bash
git worktree add ../aws-cert-roadmap-lab-implementation -b codex/index-ja-blog-implementation codex/index-ja-blog-content-quality
```

- [ ] **Step 2: Update frontmatter**

Delete `noIndex: true` and set `updatedAt: "2026-08-20"` in all three files.

- [ ] **Step 3: Expand `serverless-contact-api-flow`**

Cover browser-to-API-Gateway-to-Lambda-to-DynamoDB flow, request validation boundary, CORS, IAM execution role, idempotency/basic duplicate submission caution, logging and error response, common mistakes, and next learning links.

Required AWS docs links:

```md
- [API Gateway HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)
- [Lambda と API Gateway の使用](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)
```

Required internal links:

```md
- [Amazon API Gatewayとは？HTTP APIを初心者向けに解説](/blog/apigateway-beginner-http-api)
- [Amazon DynamoDBとは？NoSQLを初心者向けに解説](/blog/dynamodb-beginner-nosql)
```

- [ ] **Step 4: Expand `lambda-cloudwatch-logs-check`**

Cover Lambda log group/log stream flow, structured logging, request ID correlation, API Gateway 4xx/5xx boundary, IAM permission to write logs, retention/cost cautions, common mistakes, and next learning links.

Required AWS docs links:

```md
- [Lambda 関数のログ記録](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html)
- [CloudWatch Logs とは](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)
```

Required internal links:

```md
- [CloudWatchの基本をCloud Practitioner向けに解説](/blog/clf-monitoring-cloudwatch-basics)
- [API Gateway + Lambda + DynamoDBで問い合わせAPIを作る流れ](/blog/serverless-contact-api-flow)
```

- [ ] **Step 5: Expand `aws-portfolio-serverless-architecture`**

Cover why a portfolio uses S3/CloudFront/API Gateway/Lambda/DynamoDB, request and deployment flow, least privilege and OIDC boundary, cost guardrails, observability, SAA/CLF learning value, common mistakes, and next learning links.

Required AWS docs links:

```md
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [AWS Lambda とは](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
```

Required internal links:

```md
- [AWS無料枠でポートフォリオを作る方法](/blog/aws-free-tier-portfolio)
- [AWS Budgetsで個人開発の課金事故を防ぐ](/blog/aws-budgets-cost-guardrail)
```

- [ ] **Step 6: Run worker tests and commit**

```bash
pnpm test -- src/contents/blog/__tests__/blog-indexing-policy.test.ts -t "実装・ポートフォリオ"
pnpm test -- src/contents/blog/__tests__/blog-locale-parity.test.ts
git diff --check
git add frontend/contents/blog/ja/serverless-contact-api-flow.mdx frontend/contents/blog/ja/lambda-cloudwatch-logs-check.mdx frontend/contents/blog/ja/aws-portfolio-serverless-architecture.mdx
git commit -m "docs: improve serverless implementation blog indexing content"
```

## Task 6: Coordinator Registry Update And Integration

**Files:**
- Modify: `frontend/src/contents/blog/blogPosts.ts`
- Merge: worker commits from `codex/index-ja-blog-services`, `codex/index-ja-blog-saa`, `codex/index-ja-blog-clf`, `codex/index-ja-blog-implementation`

**Interfaces:**
- Consumes: worker commits with disjoint Japanese MDX changes.
- Produces: coordinator branch with all 13 MDX updates and registry `noIndex` removed for the same 13 slugs.

- [ ] **Step 1: Review worker scopes before integrating**

```bash
git diff --name-only codex/index-ja-blog-content-quality..codex/index-ja-blog-services
git diff --name-only codex/index-ja-blog-content-quality..codex/index-ja-blog-saa
git diff --name-only codex/index-ja-blog-content-quality..codex/index-ja-blog-clf
git diff --name-only codex/index-ja-blog-content-quality..codex/index-ja-blog-implementation
```

Expected: each worker branch changes only its assigned Japanese MDX files.

- [ ] **Step 2: Merge worker commits in fixed order**

```bash
git merge --no-ff codex/index-ja-blog-services -m "merge: integrate AWS services blog content"
git merge --no-ff codex/index-ja-blog-saa -m "merge: integrate SAA blog content"
git merge --no-ff codex/index-ja-blog-clf -m "merge: integrate CLF blog content"
git merge --no-ff codex/index-ja-blog-implementation -m "merge: integrate implementation blog content"
```

- [ ] **Step 3: Remove registry noIndex for the target slugs**

In `frontend/src/contents/blog/blogPosts.ts`, remove only the `noIndex: true,` line from these entries:

```txt
clf-aws-global-infrastructure
clf-iam-basics
saa-multi-az-high-availability
saa-s3-cloudfront-oac-design
saa-decoupling-sqs-sns-eventbridge
s3-beginner-object-storage
lambda-beginner-serverless
apigateway-beginner-http-api
dynamodb-beginner-nosql
cloudfront-beginner-cdn
aws-portfolio-serverless-architecture
serverless-contact-api-flow
lambda-cloudwatch-logs-check
```

Do not remove `noIndex: true` from `/en` or `/zh` MDX files.

- [ ] **Step 4: Run the indexing policy test**

```bash
pnpm test -- src/contents/blog/__tests__/blog-indexing-policy.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit registry update if not included in a merge commit**

```bash
git add frontend/src/contents/blog/blogPosts.ts
git commit -m "docs: reopen improved Japanese blog articles for indexing"
```

## Task 7: Coordinator Final Verification

**Files:**
- Verify only unless a test exposes a defect.

**Interfaces:**
- Consumes: integrated coordinator branch from Task 6.
- Produces: release-ready branch and evidence for PR/merge review.

- [ ] **Step 1: Confirm en/zh noIndex remains in content**

```bash
git diff --name-only origin/master...HEAD | grep -E '^frontend/contents/blog/(en|zh)/' && exit 1 || true
grep -R '^noIndex: true$' frontend/contents/blog/en frontend/contents/blog/zh >/tmp/en-zh-noindex.txt
wc -l /tmp/en-zh-noindex.txt
```

Expected: no en/zh files changed in git diff, and existing en/zh `noIndex: true` lines are still present.

- [ ] **Step 2: Run full test, lint, typecheck, install, and build**

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm install --frozen-lockfile
pnpm build
```

Expected: all commands pass. `pnpm build` also runs `set-html-lang` and `verify-locale-seal`.

- [ ] **Step 3: Verify generated Japanese article HTML**

After build, inspect `.next/server/app/(site)/blog/<slug>.html` or the generated equivalent path for the 13 slugs. Each target page must contain a self canonical URL under `https://www.aws-cert-roadmap-lab.com/blog/<slug>` and must not contain `noindex`.

Use this script from `frontend`:

```bash
node - <<'NODE'
const fs = require("fs");
const path = require("path");
const slugs = [
  "cloudfront-beginner-cdn",
  "apigateway-beginner-http-api",
  "dynamodb-beginner-nosql",
  "lambda-beginner-serverless",
  "s3-beginner-object-storage",
  "saa-decoupling-sqs-sns-eventbridge",
  "saa-multi-az-high-availability",
  "saa-s3-cloudfront-oac-design",
  "clf-iam-basics",
  "clf-aws-global-infrastructure",
  "serverless-contact-api-flow",
  "lambda-cloudwatch-logs-check",
  "aws-portfolio-serverless-architecture",
];
const root = path.join(process.cwd(), ".next", "server", "app", "(site)", "blog");
for (const slug of slugs) {
  const candidates = [
    path.join(root, slug, "index.html"),
    path.join(root, slug + ".html"),
    path.join(root, slug, "page.html"),
  ];
  const file = candidates.find((candidate) => fs.existsSync(candidate));
  if (!file) throw new Error(`missing generated html for ${slug}`);
  const html = fs.readFileSync(file, "utf8");
  if (/noindex/i.test(html)) throw new Error(`noindex remains in generated html for ${slug}`);
  if (!html.includes(`https://www.aws-cert-roadmap-lab.com/blog/${slug}`)) {
    throw new Error(`canonical URL missing for ${slug}`);
  }
}
NODE
```

- [ ] **Step 4: Verify sealed locale HTML**

```bash
pnpm check:locale-seal
```

Expected: PASS and `/en` `/zh` remain `noindex, nofollow`.

- [ ] **Step 5: Final diff guard**

```bash
git diff --check
git status --short --branch
```

Expected: no whitespace errors and only intentional commits on `codex/index-ja-blog-content-quality`.

## Self-Review

- Spec coverage: all 13 target slugs are assigned exactly once; Japanese MDX and registry noIndex removal are covered; `/en` and `/zh` sealing checks are covered; sitemap and metadata checks are covered; rollback remains article-scoped by keeping `noIndex: true` semantics unchanged.
- Placeholder scan: no placeholder markers or unspecified implementation steps remain.
- Type consistency: test imports use existing exported functions `getBlogSitemapRoutes`, `createBlogDetailMetadataInput`, `loadBlogContent`, and `blogPosts`; batch names match worker commands.
