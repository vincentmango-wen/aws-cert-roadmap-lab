# AWS Cert Roadmap Lab Multilingual Support Policy Design

## 1. Document Information

| Item | Description |
|---|---|
| Document name | Multilingual Support Policy Design |
| Target product | AWS Cert Roadmap Lab |
| Target phase | Phase 5: Global SEO and Localization |
| Target task | P5-001 Finalize multilingual support policy |
| Purpose | Define supported languages, URLs, translation scope, and future expansion policy for English and Chinese support |
| Implementation assumptions | Next.js / TypeScript / Static Export / S3 + CloudFront |
| Created | 2026-06-10 |

---

## 2. Purpose of This Design

This document defines the policy for expanding AWS Cert Roadmap Lab from a Japanese-only learning site into a learning site supporting English and Chinese for global SEO.

The purpose of Phase 5 is not simply translation.

The objectives are as follows.

1. Validate search traffic from English- and Chinese-speaking audiences.
2. Establish a foundation for international SEO as an AWS certification learning site.
3. Provide major content in three languages: Japanese, English, and Chinese.
4. Retain static delivery through S3 + CloudFront and continue low-cost operations.
5. Validate the potential for international traffic before turning the site into a learning app or introducing paid offerings.

---

## 3. Supported Languages

### 3.1 Initially Supported Languages

| locale | Display language | URL Prefix | HTML lang | OGP locale | Support policy |
|---|---|---|---|---|---|
| ja | Japanese | None | ja | ja_JP | Retain existing URLs |
| en | English | /en | en | en_US | Add for English-language SEO |
| zh | Traditional Chinese | /zh | zh-Hant | zh_TW | Add for Taiwan and Traditional Chinese-speaking audiences |

### 3.2 Handling Japanese URLs

Retain existing URLs for Japanese pages.

Example:

| Content | Japanese URL |
|---|---|
| Home | / |
| Glossary | /terms |
| Term detail | /terms/s3 |
| Comparison index | /comparisons |
| Comparison detail | /comparisons/s3-vs-ebs-vs-efs |
| Architecture diagram index | /architectures |
| Architecture diagram detail | /architectures/static-site-s3-cloudfront |
| Blog index | /blog |
| Blog detail | /blog/aws-free-tier-portfolio |
| About | /about |
| Privacy | /privacy |
| Disclaimer | /disclaimer |
| Contact | /contact |

Reasons:

- Preserve existing indexing.
- Avoid disrupting existing standing in Search Console.
- Preserve existing internal links with minimal changes.
- Keep URLs short for Japanese users.

### 3.3 Handling English URLs

Place English pages under `/en`.

Example:

| Content | English URL |
|---|---|
| Home | /en |
| Glossary | /en/terms |
| Term detail | /en/terms/s3 |
| Comparison index | /en/comparisons |
| Comparison detail | /en/comparisons/s3-vs-ebs-vs-efs |
| Architecture diagram index | /en/architectures |
| Architecture diagram detail | /en/architectures/static-site-s3-cloudfront |
| Blog index | /en/blog |
| Blog detail | /en/blog/aws-free-tier-portfolio |
| About | /en/about |
| Privacy | /en/privacy |
| Disclaimer | /en/disclaimer |
| Contact | /en/contact |

### 3.4 Handling Chinese URLs

Place Chinese pages under `/zh`.

Initially use wording oriented toward Traditional Chinese.

Example:

| Content | Chinese URL |
|---|---|
| Home | /zh |
| Glossary | /zh/terms |
| Term detail | /zh/terms/s3 |
| Comparison index | /zh/comparisons |
| Comparison detail | /zh/comparisons/s3-vs-ebs-vs-efs |
| Architecture diagram index | /zh/architectures |
| Architecture diagram detail | /zh/architectures/static-site-s3-cloudfront |
| Blog index | /zh/blog |
| Blog detail | /zh/blog/aws-free-tier-portfolio |
| About | /zh/about |
| Privacy | /zh/privacy |
| Disclaimer | /zh/disclaimer |
| Contact | /zh/contact |

### 3.5 Future Chinese Expansion

Use `/zh-cn` if Simplified Chinese is added in the future.

| locale | Display language | URL Prefix | HTML lang | Purpose |
|---|---|---|---|---|
| zh | Traditional Chinese | /zh | zh-Hant | For Taiwan and Hong Kong |
| zh-cn | Simplified Chinese | /zh-cn | zh-Hans | For mainland China and Simplified Chinese-speaking audiences |

Do not implement `/zh-cn` in the initial stage.

Reasons:

- Keep initial translation costs down.
- Mainland China has a different search engine environment for SEO.
- First validate the response from Taiwan and Traditional Chinese-speaking audiences.

---

## 4. Basic Multilingual Support Policy

### 4.1 Policy List

| Policy | Description |
|---|---|
| Use Japanese as the reference language | Treat existing Japanese content as the source |
| Adopt URL prefixes | Use /en for English and /zh for Chinese |
| Do not automatically redirect by IP | This makes behavior unpredictable for Googlebot, AdSense review, and user verification |
| Retain the same content IDs | Share slugs such as s3, lambda, and rds-vs-dynamodb across languages |
| Retain static generation | Deliver content inexpensively with S3 + CloudFront |
| Separate UI text from content bodies | Manage Header, Footer, and CTA in dictionaries and article bodies in JSON / MDX |
| Do not integrate a translation API in production | Avoid API costs, quality management, and mistranslation risks |
| Do not translate official AWS names | Retain official names such as Amazon S3 and AWS Lambda |

### 4.2 Automatic Redirect Policy

Do not automatically redirect based on IP address, browser language, or country detection.

Allowed behavior:

- Users explicitly navigate using the language switcher UI.
- Users accessing `/en` see English pages.
- Users accessing `/zh` see Chinese pages.
- Users accessing `/` see Japanese pages.

Prohibited behavior:

- Forcing IP addresses outside Japan to `/en`.
- Forcing Chinese-language browsers to `/zh`.
- Returning a different URL to Googlebot than to users.
- Moving users without a cookie to another language without their choice.

Reasons:

- Stabilize SEO performance.
- Allow users to choose their display language.
- Make URL verification in Search Console easier.
- Avoid display differences during AdSense review.

---

## 5. Translation Scope

### 5.1 Scope to Translate in Phase 5

| Category | Scope | Priority |
|---|---|---|
| Shared UI | Header, Footer, CTA, search, filters | Must |
| Shared pages | Home, About, Privacy, Disclaimer | Must |
| Glossary | 30 major AWS terms | Must |
| Comparison articles | 3 major comparisons | Should |
| Architecture diagram articles | 3 major architecture diagrams | Should |
| Blog | 3 priority blog posts | Should |
| Contact | Contact navigation | Should |
| 404 | 404 display | Should |
| Practice questions | 30 CLF questions | Could |

### 5.2 Shared Pages to Translate First

| Page | English URL | Chinese URL | Priority |
|---|---|---|---|
| Home | /en | /zh | Must |
| About | /en/about | /zh/about | Must |
| Privacy | /en/privacy | /zh/privacy | Must |
| Disclaimer | /en/disclaimer | /zh/disclaimer | Must |
| Contact | /en/contact | /zh/contact | Should |
| 404 | /en/404 | /zh/404 | Should |

### 5.3 AWS Terms to Translate First

Translate the following 30 terms first.

```text
IAM
S3
EC2
Lambda
VPC
RDS
DynamoDB
CloudFront
Route 53
CloudWatch
CloudTrail
API Gateway
SQS
SNS
EventBridge
EBS
EFS
ELB
Auto Scaling
ACM
KMS
WAF
AWS Budgets
Cost Explorer
Organizations
AWS Config
Secrets Manager
Systems Manager
CloudFormation
Cognito
```

### 5.4 Comparison Articles to Translate First

| slug | Japanese-language topic (English translation) | Priority |
|---|---|---|
| s3-vs-ebs-vs-efs | Differences between S3 / EBS / EFS | Should |
| rds-vs-dynamodb | Differences between RDS / DynamoDB | Should |
| iam-user-role-policy | Differences between IAM User / Role / Policy | Should |

### 5.5 Architecture Diagram Articles to Translate First

| slug | Japanese-language topic (English translation) | Priority |
|---|---|---|
| static-site-s3-cloudfront | S3 + CloudFront static site architecture | Should |
| serverless-api-basic | API Gateway + Lambda + DynamoDB architecture | Should |
| three-tier-vpc | Three-tier web app architecture | Should |

### 5.6 Blog Articles to Translate First

| slug | Japanese-language topic (English translation) | Priority |
|---|---|---|
| aws-cloud-practitioner-roadmap | What is AWS Cloud Practitioner? | Should |
| aws-free-tier-portfolio | How to build a portfolio using the AWS Free Tier | Should |
| s3-cloudfront-static-site | How to publish a static site with S3 + CloudFront | Should |

### 5.7 Scope Deferred to the Latter Half of Phase 5

| Scope | Reason |
|---|---|
| Translate 30 CLF questions into English | Large translation volume and time-consuming quality checks |
| Translate 30 CLF questions into Chinese | Exam terminology is prone to mistranslation |
| Multilingual SAA questions | Prioritize SEO validation for terms, comparisons, and architecture diagrams first |
| PDF learning materials | Demand cannot be judged by creating materials before validating traffic |
| Paid conversion paths | Design after confirming international traffic and engagement |

---

## 6. Scope Not to Translate

### 6.1 Features Not Implemented in Phase 5

| Scope | Reason |
|---|---|
| Cognito login | Unnecessary for localization validation |
| Saving learning history | Requires user registration and substantially expands implementation scope |
| Stripe payments | There is little evidence for decisions if payment paths are built before validating traffic |
| Paid membership features | First validate traffic with free content |
| Production translation API integration | Increases API costs, quality management costs, and mistranslation risks |
| IP-based automatic redirects | Makes behavior unpredictable for SEO and AdSense review |
| Migrating content to DynamoDB | Static JSON / MDX is preferable for SEO, speed, and cost |
| Introducing WAF | Increases fixed costs and operational load at the current stage |

### 6.2 Handling Official AWS Names

Do not translate AWS service names.

Examples (Chinese naming specimens):

| NG | OK |
|---|---|
| 亞馬遜簡單儲存服務 | Amazon S3 |
| AWS拉姆達 | AWS Lambda |
| 雲端前端 | Amazon CloudFront |
| 動態資料庫 | Amazon DynamoDB |

On Chinese pages, add explanatory text only when needed.

Example (Chinese user-facing text):

```text
Amazon S3 是 AWS 的物件儲存服務。
```

---

## 7. SEO Policy

### 7.1 canonical Policy

Each page uses itself as its canonical.

| Page | canonical |
|---|---|
| /terms/s3 | https://www.aws-cert-roadmap-lab.com/terms/s3 |
| /en/terms/s3 | https://www.aws-cert-roadmap-lab.com/en/terms/s3 |
| /zh/terms/s3 | https://www.aws-cert-roadmap-lab.com/zh/terms/s3 |

Reasons:

- Japanese, English, and Chinese should be evaluated as separate pages.
- Pointing an English page's canonical to a Japanese page makes the English page less likely to receive credit.

### 7.2 hreflang Policy

Emit the following hreflang entries for pages sharing the same content ID.

Example: S3 term detail

```text
ja: /terms/s3
en: /en/terms/s3
zh-Hant: /zh/terms/s3
x-default: /terms/s3
```

Output example:

```html
<link rel="alternate" hreflang="ja" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
<link rel="alternate" hreflang="en" href="https://www.aws-cert-roadmap-lab.com/en/terms/s3" />
<link rel="alternate" hreflang="zh-Hant" href="https://www.aws-cert-roadmap-lab.com/zh/terms/s3" />
<link rel="alternate" hreflang="x-default" href="https://www.aws-cert-roadmap-lab.com/terms/s3" />
```

### 7.3 Sitemap Policy

Include Japanese, English, and Chinese URLs in `sitemap.xml`.

Include:

- Japanese URLs
- English URLs
- Chinese URLs
- Term detail URLs
- Comparison detail URLs
- Architecture diagram detail URLs
- Blog detail URLs
- Shared page URLs

At Phase 5 completion, aim to have `out/en` and `out/zh` generated and multilingual URLs included in the sitemap.

### 7.4 Metadata Policy

Vary the following by language.

| Item | ja | en | zh |
|---|---|---|---|
| title | Japanese | English | Traditional Chinese |
| description | Japanese | English | Traditional Chinese |
| keywords | Primarily Japanese | English SEO keywords | Traditional Chinese SEO keywords |
| openGraph.locale | ja_JP | en_US | zh_TW |
| html lang | ja | en | zh-Hant |

### 7.5 OGP Policy

Initially share the existing OGP images.

However, create language-specific OGP images for the following pages in the future.

| Page | OGP policy |
|---|---|
| Home | Create language-specific OGP images |
| Glossary index | Create language-specific OGP images |
| Comparison index | Create language-specific OGP images |
| Architecture diagram index | Create language-specific OGP images |
| Priority blog articles | Create language-specific OGP images |

---

## 8. Content Management Policy

### 8.1 UI Text

Manage UI text in dictionaries under `src/i18n`.

Planned structure:

```text
frontend/src/i18n/
├── locales.ts
├── dictionaries/
│   ├── ja.ts
│   ├── en.ts
│   └── zh.ts
└── routes.ts
```

Scope:

- Header
- Footer
- CTA
- Search form
- Category filters
- Breadcrumbs
- Buttons
- Error messages
- 404 text

### 8.2 AWS Term Data

Separate AWS term JSON by language.

Planned structure:

```text
frontend/contents/terms/
├── terms.ja.json
├── terms.en.json
└── terms.zh.json
```

Share slugs across languages.

Example:

```text
s3
lambda
cloudfront
rds-vs-dynamodb
```

### 8.3 MDX Content

Manage comparisons, architecture diagrams, and blog content in language-specific directories.

Planned structure:

```text
frontend/contents/comparisons/
├── ja/
├── en/
└── zh/

frontend/contents/architectures/
├── ja/
├── en/
└── zh/

frontend/contents/blog/
├── ja/
├── en/
└── zh/
```

### 8.4 Images and SVG

Initially share images and SVGs.

However, create language-specific SVGs when an SVG contains Japanese text.

Planned structure:

```text
frontend/public/images/architectures/
├── ja/
├── en/
└── zh/
```

---

## 9. Routing Policy

### 9.1 Basic Rules

| Language | URL Prefix | Example |
|---|---|---|
| ja | None | /terms/s3 |
| en | /en | /en/terms/s3 |
| zh | /zh | /zh/terms/s3 |

### 9.2 Slug Policy

Keep shared slugs alphanumeric.

Example:

| Content | ja | en | zh |
|---|---|---|---|
| S3 term | /terms/s3 | /en/terms/s3 | /zh/terms/s3 |
| Lambda term | /terms/lambda | /en/terms/lambda | /zh/terms/lambda |
| S3/EBS/EFS comparison | /comparisons/s3-vs-ebs-vs-efs | /en/comparisons/s3-vs-ebs-vs-efs | /zh/comparisons/s3-vs-ebs-vs-efs |

Reasons:

- Makes language switching easy to implement.
- Simplifies sitemap generation.
- Makes URL mappings easy to verify in Search Console.
- Works well with official AWS service names.

---

## 10. Quality Management Policy

### 10.1 Translation Quality

Follow these rules when translating.

1. Do not translate official AWS service names.
2. Retain official English names for AWS certification exams.
3. Do not use wording suggesting exam dumps, actual exam questions, or guaranteed passes.
4. Initially standardize Chinese on Traditional Chinese.
5. Do not paraphrase in ways that change the meaning of the Japanese source.
6. Follow the terminology notation rules table.

### 10.2 Prohibited Expressions

Do not use the following expressions.

| Expression | Reason |
|---|---|
| exam dump | Suggests a violation of exam rules |
| real exam questions | Suggests reuse of actual exam questions |
| guaranteed pass | Passing cannot be guaranteed |
| official AWS exam questions | Could be mistaken for official AWS questions |
| leaked questions | Suggests illicit acquisition |
| 100% pass | Constitutes a passing guarantee |

### 10.3 Disclaimer

Maintain the following policy on question, article, and architecture diagram pages.

```text
This site is an independent learning project and is not affiliated with Amazon Web Services.
```

Use the following as the standard Chinese user-facing text.

```text
本站是獨立學習專案，與 Amazon Web Services 無關。
```

---

## 11. Future Expansion Policy

### 11.1 Items to Consider in Phase 6

| Scope | Policy |
|---|---|
| Cognito | Consider when introducing learning history and a personal account page |
| Learning history | Design after confirming multilingual traffic |
| Paid learning materials | Design after confirming international traffic, engagement, and clicks |
| PDF learning materials | Create after demand in English and Chinese becomes clear |
| `/zh-cn` | Add after demand for Simplified Chinese becomes clear |
| SES notifications | Consider after user registration |
| WAF | Consider introducing it if bots or attacks increase |

### 11.2 Decision Criteria

Proceed to Phase 6 when the following conditions are met.

| Item | Criterion |
|---|---|
| Search Console | `/en` and `/zh` URLs become eligible for indexing |
| GA | Traffic from English- and Chinese-speaking audiences can be confirmed |
| Engagement | Terms, comparisons, and architecture diagram pages receive views |
| Inquiries | There are inquiries or clicks from international users |
| Content quality | Inconsistencies in translated terminology are under control |

---

## 12. Completion Criteria

P5-001 is complete when the following requirements are met.

| Criterion | Requirement |
|---|---|
| Supported languages are defined | Required |
| URL Prefix policy is defined | Required |
| Policy for retaining Japanese URLs is defined | Required |
| English URL policy is defined | Required |
| Chinese URL policy is defined | Required |
| Translation scope is defined | Required |
| Scope not to translate is defined | Required |
| SEO policy is defined | Required |
| Content management policy is defined | Required |
| Future expansion policy is defined | Required |

---

## 13. Connection to Subsequent Tasks

After P5-001 is complete, proceed in the following order.

1. P5-002 Multilingual URL design
2. P5-003 i18n directory design
3. P5-004 Locale definition implementation
4. P5-005 UI dictionary file creation
5. P5-006 Language switcher UI implementation
6. P5-007 Multilingual routing foundation creation

In P5-002, determine the specific Next.js App Router directory structure based on the URL policy in this document.
