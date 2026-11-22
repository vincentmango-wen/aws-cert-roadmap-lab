# Quality Improvement and Reindexing Design for 13 Japanese Blog Articles

## 1. Background

The Google Search Console report updated on 2026-08-17 showed 14 pages Excluded by noindex tag. Validation started on 2026-08-09 had failed for 13 pages, with one pending.

Inspection of the latest `master` (`48d6e24`) showed that the 13 failures were not caused by a Google propagation delay. Each Japanese MDX file and its blog registry entry explicitly had `noIndex: true`. These articles had intentionally been excluded as thin content in the 2026-06-21 change. The pending article was `clf-monitoring-cloudwatch-basics`, whose `noIndex` had already been removed.

The 13 articles were about 2.8–3.5 KB each, compared with about 6.3–10.3 KB for existing indexable articles. Simply removing the tag would leave content-quality concerns unresolved. Improve the content before returning these articles to the indexable set.

## 2. Goals

- Improve all 13 articles so each provides independent value to search users.
- Remove their `noIndex` flags and generate static HTML that Google can index.
- Release Japanese pages only, while keeping the gated `/en` and `/zh` versions at `noindex, nofollow`.
- Run four agents in parallel in independent worktrees to control file conflicts and quality variation.
- Automatically verify sitemap, canonical, robots, and internal-link consistency to prevent recurrence.

## 3. Scope

### 3.1 Target articles

| Batch | Slug | Topic |
|---|---|---|
| AWS service fundamentals | `cloudfront-beginner-cdn` | CloudFront and CDNs |
| AWS service fundamentals | `apigateway-beginner-http-api` | API Gateway HTTP API |
| AWS service fundamentals | `dynamodb-beginner-nosql` | DynamoDB and NoSQL |
| AWS service fundamentals | `lambda-beginner-serverless` | Lambda and serverless computing |
| AWS service fundamentals | `s3-beginner-object-storage` | S3 and object storage |
| SAA design | `saa-decoupling-sqs-sns-eventbridge` | Decoupling and messaging |
| SAA design | `saa-multi-az-high-availability` | Multi-AZ and high availability |
| SAA design | `saa-s3-cloudfront-oac-design` | S3 and CloudFront OAC |
| CLF fundamentals | `clf-iam-basics` | IAM fundamentals |
| CLF fundamentals | `clf-aws-global-infrastructure` | Regions, AZs, and edge locations |
| Implementation / portfolio | `serverless-contact-api-flow` | Contact API processing flow |
| Implementation / portfolio | `lambda-cloudwatch-logs-check` | Investigating Lambda logs |
| Implementation / portfolio | `aws-portfolio-serverless-architecture` | Serverless portfolio architecture |

### 3.2 Exclusions

- Expanding or publishing `en` / `zh` article bodies
- Changing `LOCALIZED_ROUTES_PUBLISHED`
- Adding functionality for invalid URLs in Search Console's 404 report
- Changing canonical redirects from HTTP / apex to HTTPS / www
- Fully rewriting the other 12 blog articles
- Guaranteeing Google indexing or search rankings

## 4. Selected parallel structure

Use four workers and one coordinator. Each worker has its own Git worktree and branch and changes only its assigned articles. The coordinator owns shared files, test infrastructure, integration, and final verification.

| Role | Proposed branch | Files allowed to change |
|---|---|---|
| Coordinator | `codex/index-ja-blog-content-quality` | Shared tests, `blogPosts.ts`, and necessary operational documentation |
| Worker 1 | `codex/index-ja-blog-services` | Five Japanese MDX files for AWS service fundamentals |
| Worker 2 | `codex/index-ja-blog-saa` | Three Japanese MDX files for SAA design |
| Worker 3 | `codex/index-ja-blog-clf` | Two Japanese MDX files for CLF fundamentals |
| Worker 4 | `codex/index-ja-blog-implementation` | Three Japanese MDX files for implementation / portfolio |

Workers must not change:

- `frontend/src/contents/blog/blogPosts.ts`
- Shared sitemap, robots, or SEO logic
- Shared test files
- `package.json`, lockfiles, or build configuration
- MDX files assigned to other workers

## 5. Content-quality standards

Prioritize answering the search intent directly and giving each article distinct value, rather than merely increasing word count or paraphrasing other articles. Every article must:

1. Identify its audience, the question it answers, and the decisions it helps readers make at the beginning.
2. Explain the role of the AWS service or design concept, including its boundaries with related services.
3. Include at least one concrete processing flow, architecture example, operational example, or decision example.
4. Explain specific points that are easy to confuse in Cloud Practitioner or SAA study.
5. Make relevant cost, security, availability, and operational cautions concrete.
6. Include at least one common misconception or failure example.
7. Include at least two valid HTTPS links to official AWS documentation.
8. Add links to relevant internal pages whose existence has been verified.
9. Avoid asserting unverified figures, prices, or limits. Refer readers to official sources for changing information.
10. Avoid mechanically copying the same boilerplate into all 13 articles.

Article size is not the main quality criterion. Report body length, heading count, and official-link count only as supporting indicators for detecting extreme differences from existing indexed articles.

## 6. Indexing controls

### 6.1 Japanese articles

Remove `noIndex: true` from the target MDX files after completing the quality improvements. `blog-content-loader.ts` treats an omitted frontmatter flag as `false`, producing metadata with `index: true, follow: true`.

The coordinator also removes `noIndex: true` for the same 13 articles from `frontend/src/contents/blog/blogPosts.ts`, keeping the registry and Japanese MDX semantics aligned.

### 6.2 en / zh

Keep `LOCALIZED_ROUTES_PUBLISHED` set to `false`. The locale gate in `createPageMetadata()` forces `noindex, nofollow` for `/en` and `/zh`. Verify in generated HTML that enabling Japanese articles does not enable their translations.

### 6.3 Sitemap and canonical

- `getBlogSitemapRoutes()` includes Japanese MDX with `published: true` and `noIndex !== true`.
- Verify that the 13 newly enabled articles are added to the Japanese sitemap.
- Do not add gated `en` / `zh` URLs to the sitemap.
- Each Japanese article's canonical is its own `https://www.aws-cert-roadmap-lab.com/blog/<slug>` URL.

## 7. Test strategy

### 7.1 RED tests

Before workers start, the coordinator defines a separate test case for each of the four batches. Each case verifies:

- The target Japanese MDX does not contain `noIndex: true`.
- The target articles load as published.
- Their metadata is `index: true, follow: true`.
- They are included in blog sitemap routes.
- They have the minimum required structure and official AWS links.

All four cases fail initially. Each worker filters execution to its own batch name and makes only its assigned case GREEN. Failures in other batches are expected before integration.

### 7.2 Worker verification

Each worker runs:

- Its batch's indexing-policy test
- Existing blog locale-parity tests
- Markdown and frontmatter checks for changed files
- `git diff --check`

Workers do not run full builds simultaneously. Four parallel Next.js builds impose heavy CPU, memory, and I/O loads, reducing verification speed and stability.

### 7.3 Integration verification

After integrating all commits, the coordinator runs:

1. Indexing-policy tests for all four batches
2. The full Vitest suite
3. Lint and typecheck
4. `pnpm install --frozen-lockfile`
5. The production build
6. Robots, canonical, and internal-link checks on the 13 generated articles
7. `noindex, nofollow` checks on representative generated `/en` and `/zh` articles
8. HTTP 200 checks for sitemap URLs

## 8. Conflict management

### 8.1 Git conflicts

Exclusive file ownership should prevent ordinary content conflicts. Only the coordinator changes shared files. Integrate worker results by commit SHA, in Worker 1 through Worker 4 order.

If a worker changes out-of-scope files, do not integrate that commit unchanged. Extract and recommit only the assigned MDX changes.

### 8.2 Content conflicts

Git cannot detect duplicate explanations or inconsistent terminology. During integration, review:

- Service-name usage, including IAM, CloudFront, Lambda, and API Gateway
- The division of scope between the CloudFront OAC and CloudFront introductory articles
- Overlap between Lambda fundamentals, Lambda logs, the contact API, and portfolio articles
- Consistency of SQS / SNS / EventBridge comparisons
- Circular related-article navigation and 404 links

### 8.3 Execution-environment conflicts

- Isolate generated output by worktree.
- Package-manager stores may be shared, but the coordinator runs installs and builds after integration.
- Start Search Console validation only once, after publication checks. Do not have multiple agents operate it.

## 9. Integration and release sequence

1. The coordinator commits RED tests and the quality-check infrastructure.
2. Create four worktrees from the same base SHA.
3. Start all four workers simultaneously.
4. Each worker rewrites its assigned articles, makes its assigned tests GREEN, and commits.
5. The coordinator reviews each diff's content and integrates them sequentially.
6. The coordinator removes registry `noIndex` flags and aligns shared tests and documentation.
7. Run the full test suite, production build, and static-HTML inspection.
8. Present results for the 13 articles, robots, sitemap, and locale gating in the PR.
9. Recheck public URLs after merge and deployment.
10. After Search Console's Test live URL reports representative articles as indexable, start one new validation for the noindex category.

## 10. Error handling and stop conditions

- Do not publish if an official AWS link returns 404 or points to an unofficial domain.
- If an assigned article substantially duplicates an existing indexed article, reconsider consolidation, canonical, or redirect options rather than forcing additional text.
- Treat even one indexable generated `en` / `zh` page as a release blocker.
- Treat any remaining `noindex` on a target Japanese article as a release blocker.
- Do not publish if sitemap and metadata decisions disagree.
- Do not merge the PR while the production build or existing tests fail until the cause is identified.

## 11. Rollback

If publication exposes a serious factual error, duplication, or another reason to exclude an article again, restore `noIndex: true` only for the affected article and remove it from the sitemap. Limit rollback to the problematic slug rather than reverting the entire site or all 13 articles.

If en / zh gating fails, prioritize restoring the locale gate rather than article-level changes, and stop Search Console operations.

## 12. Completion criteria

- All 13 articles meet the quality standards.
- `noIndex: true` has been removed from their Japanese MDX and registry entries.
- Their generated HTML has `index, follow`.
- Their canonicals are self-referencing HTTPS / www URLs.
- They appear in the Japanese sitemap and return 200.
- `/en` and `/zh` remain gated.
- All tests, lint, typecheck, and the production build succeed.
- There are no worker file-ownership violations or unresolved conflicts.
- Post-publication inspection finds representative URLs indexable.
- One new Search Console validation can be started after publication verification.
