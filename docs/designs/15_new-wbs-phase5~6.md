# Replacement WBS: Phase 5 Global SEO and Localization

## Source Review Results

* Confirmed information:

  * The current Phase 5 is "Evolve into a Learning App," covering login, learning history, and review features.
  * The MVP policy excludes login, Cognito, paid membership functionality, AI-generated explanations, and similar features.
  * Terms, comparisons, questions, architecture diagrams, and blog posts will primarily be managed with Markdown / MDX / JSON.
  * There is a plan to use SEO articles, the glossary, comparison articles, practice questions, and architecture diagram explanations as paths to monetization.
* Missing information:

  * The existing design documents do not yet define multilingual URLs, hreflang, multilingual sitemaps, or multilingual content management.
* Assumptions for this revision:

  * Keep the existing Japanese URLs unchanged.
  * Use `/en` for English.
  * Use `/zh` for Chinese. Start with a Traditional Chinese focus and allow `/zh-cn` to be added in the future.
  * Replace Phase 5, "Evolve into a Learning App," with "Global SEO and Localization."
  * Postpone the learning app and paid features to Phase 6.
* Implementation impact:

  * Cognito, additional DynamoDB usage, and payment functionality are not required in this phase.
  * Retain the S3 + CloudFront static delivery architecture.
  * More pages will be included in the Next.js static export.
  * sitemap, metadata, canonical, and hreflang implementations are required.

Because the current WBS defines Phase 4 as monetization preparation and Phase 5 as evolution into a learning app, Phase 5 is the target of this replacement.
The current design also centers MVP content management on Markdown / MDX / JSON and minimizes DynamoDB usage outside contact submissions.

---

# 1. Replace Phase Definitions

| Phase | Previous Name | New Name | Objective | Completion Criteria |
| ------- | ------ | ------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Phase 4 | Monetization preparation | Monetization preparation | AdSense, custom domain, Search Console, Analytics, stronger SEO articles | Able to apply for advertising and validate search traffic |
| Phase 5 | Evolve into a learning app | Global SEO and localization | English and Chinese support, international SEO, competitive differentiation, traffic validation by country | Key `/en` `/zh` pages are live in production and can be validated with Search Console and GA |
| Phase 6 | None | Learning app and paid features | Cognito, learning history, review features, PDF learning materials, paths to paid features | Able to implement per-user learning management and paths to paid offerings |

---

# 2. Purpose of Phase 5

The purpose of Phase 5 is more than translation alone.

**The purpose is to validate search traffic from English- and Chinese-speaking audiences and establish a global SEO foundation for an AWS certification learning site.**

Based on the competitive analysis, targeting broad English-language keywords such as "AWS Cloud Practitioner practice exam" would be difficult.
Instead, target the following combination.

```text
AWS certification preparation
× Beginner-friendly
× Glossary
× Service comparisons
× Architecture diagrams
× Japanese, English, and Traditional Chinese
× Implementation portfolio
```

---

# 3. What Phase 5 Includes

| Category | Work |
| -------- | ---------------------------------------------- |
| Competitive analysis | Organize English- and Chinese-language competitors, target keywords, and differentiation messages |
| Multilingual foundation | Implement locale definitions, dictionary files, language-specific URLs, and a language-switching UI |
| SEO foundation | Support language-specific canonical, hreflang, sitemap, metadata, and OGP |
| English support | Add the home page, glossary, comparisons, architecture diagrams, and key pages under `/en` |
| Chinese support | Add the home page, glossary, comparisons, architecture diagrams, and key pages under `/zh` |
| Content translation | Start with 30 terms, 3 key comparisons, 3 architecture diagrams, and 3 priority blog posts |
| Validation | Check Search Console, GA, traffic by country and language, and indexing status |
| README updates | Document global SEO support, localization policy, and competitive differentiation |

---

# 4. What Phase 5 Excludes

| Excluded Work | Reason |
| ----------------- | ------------------------------------- |
| Cognito login | Not needed to validate localization |
| Saving learning history | Requires user registration and expands the scope |
| Stripe payments | Conversion rates cannot be assessed by introducing paid offerings before validating traffic |
| Paid membership functionality | Validate content value and international traffic first |
| Production translation API integration | Increases API expenses and quality management costs |
| IP-based automatic redirects | Makes behavior less predictable for Googlebot, AdSense review, and user verification |
| Migrating content to DynamoDB | Static JSON / MDX is more advantageous for SEO, speed, and cost |
| Introducing WAF | Increases fixed costs and operational overhead at this stage |

---

# 5. Phase 5 Task List

## Phase 5-A: Competitive Analysis and Strategy

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| -------- | ---------------- | -----: | -: | ------- | ------------------------------------------------ |
| P5-000 | Organize global competitors and SEO hypotheses | Must | M | Phase 4 | English- and Chinese-language competitor categories, target keywords, and keywords to avoid are documented |
| P5-000-1 | Prioritize multilingual content | Must | S | P5-000 | The first 20-30 pages to translate are selected |
| P5-000-2 | Create differentiation messages | Must | S | P5-000 | English and Chinese site descriptions, meta descriptions, and OGP wording are defined |
| P5-000-3 | Create a prohibited wording list | Must | S | P5-000 | Prohibited wording such as exam dump, actual exam questions, and guaranteed pass is documented in README or docs |
| P5-000-4 | Create an English SEO keyword list | Should | S | P5-000 | At least 20 English long-tail target keywords are listed |
| P5-000-5 | Create a Chinese SEO keyword list | Should | S | P5-000 | At least 20 Traditional Chinese target keywords are listed |

---

## Phase 5-B: Multilingual Foundation

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | ------------- | ---: | -: | ------ | -------------------------------------- |
| P5-001 | Finalize the multilingual support policy | Must | S | P5-000 | Target languages, URLs, translation scope, and future expansion policy are defined |
| P5-002 | Design multilingual URLs | Must | S | P5-001 | URL rules for `/en` `/zh` are defined |
| P5-003 | Design the i18n directory structure | Must | S | P5-002 | The structure under `src/i18n` is defined |
| P5-004 | Implement locale definitions | Must | S | P5-003 | `ja` `en` `zh` can be handled in a type-safe manner |
| P5-005 | Create UI dictionary files | Must | M | P5-004 | Header, Footer, CTA, search, and filter wording can be retrieved by language |
| P5-006 | Implement the language-switching UI | Must | M | P5-005 | Users can switch between Japanese, English, and Chinese using the same content ID |
| P5-007 | Build the multilingual routing foundation | Must | L | P5-004 | Static pages under `/en/...` `/zh/...` are generated |
| P5-008 | Configure html lang | Must | S | P5-007 | `lang` attributes for `ja` `en` `zh` are output |

---

## Phase 5-C: Multilingual SEO Foundation

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | ----------------------- | -----: | -: | ------ | ------------------------------------- |
| P5-009 | Design canonical / hreflang | Must | M | P5-007 | The specification for outputting canonical and hreflang on each language page is defined |
| P5-010 | Create a multilingual metadata helper | Must | M | P5-009 | title, description, and OGP can be generated by language |
| P5-011 | Support multilingual sitemap generation | Must | M | P5-009 | The sitemap includes Japanese, English, and Chinese URLs |
| P5-012 | Configure x-default | Should | S | P5-009 | hreflang outputs `x-default` |
| P5-013 | Define the multilingual OGP policy | Should | S | P5-010 | The set of pages requiring language-specific OGP images is defined |
| P5-014 | Create and configure English OGP images | Should | M | P5-013 | English pages display English OGP |
| P5-015 | Create and configure Chinese OGP images | Should | M | P5-013 | Chinese pages display Chinese OGP |

---

## Phase 5-D: Localize Common Pages

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | -------------- | -----: | -: | ------ | ------------------------------- |
| P5-016 | Translate the home page into English | Must | M | P5-005 | The `/en` home page is displayed |
| P5-017 | Translate the home page into Chinese | Must | M | P5-005 | The `/zh` home page is displayed |
| P5-018 | Translate About into English | Must | S | P5-007 | `/en/about` is displayed |
| P5-019 | Translate About into Chinese | Must | S | P5-007 | `/zh/about` is displayed |
| P5-020 | Translate Privacy into English | Must | S | P5-007 | `/en/privacy` is displayed |
| P5-021 | Translate Privacy into Chinese | Must | S | P5-007 | `/zh/privacy` is displayed |
| P5-022 | Translate Disclaimer into English | Must | S | P5-007 | `/en/disclaimer` is displayed |
| P5-023 | Translate Disclaimer into Chinese | Must | S | P5-007 | `/zh/disclaimer` is displayed |
| P5-024 | Translate Contact into English | Should | M | P5-007 | `/en/contact` is displayed and the contact path is clear |
| P5-025 | Translate Contact into Chinese | Should | M | P5-007 | `/zh/contact` is displayed and the contact path is clear |
| P5-026 | Localize the 404 page | Should | M | P5-007 | English and Chinese 404 displays can be verified |

---

## Phase 5-E: Localize the AWS Glossary

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | ---------------- | -----: | -: | ------ | ----------------------------------------------------- |
| P5-027 | Split AWS term data into a multilingual structure | Must | L | P5-004 | `terms.ja.json` `terms.en.json` `terms.zh.json` exist |
| P5-028 | Localize the glossary list page | Must | M | P5-027 | `/en/terms` `/zh/terms` are displayed |
| P5-029 | Localize term detail pages | Must | L | P5-027 | `/en/terms/s3` `/zh/terms/s3` are displayed |
| P5-030 | Translate 30 major AWS terms into English | Must | XL | P5-027 | At least 30 English glossary entries exist |
| P5-031 | Translate 30 major AWS terms into Chinese | Must | XL | P5-027 | At least 30 Chinese glossary entries exist |
| P5-032 | Create AWS terminology rules | Must | M | P5-030 | Rules cover official AWS names, abbreviations, Chinese notation, and English notation |
| P5-033 | Localize related links on term detail pages | Should | M | P5-029 | Links to related comparisons and architecture diagrams stay within the same language |

The initial priority terms for translation are as follows.

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

This aligns with the initial entries in the existing data design.

---

## Phase 5-F: Localize Comparison Articles

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | -------------------------------- | -----: | -: | ------ | ------------------------------------------------------- |
| P5-034 | Create a multilingual structure for service comparison MDX | Should | M | P5-007 | `contents/comparisons/en` `contents/comparisons/zh` exist |
| P5-035 | Translate the S3 / EBS / EFS comparison into English | Should | M | P5-034 | `/en/comparisons/s3-vs-ebs-vs-efs` is displayed |
| P5-036 | Translate the S3 / EBS / EFS comparison into Chinese | Should | M | P5-034 | `/zh/comparisons/s3-vs-ebs-vs-efs` is displayed |
| P5-037 | Translate the RDS / DynamoDB comparison into English | Should | M | P5-034 | `/en/comparisons/rds-vs-dynamodb` is displayed |
| P5-038 | Translate the RDS / DynamoDB comparison into Chinese | Should | M | P5-034 | `/zh/comparisons/rds-vs-dynamodb` is displayed |
| P5-039 | Translate the IAM User / Role / Policy comparison into English | Should | M | P5-034 | The English page is displayed |
| P5-040 | Translate the IAM User / Role / Policy comparison into Chinese | Should | M | P5-034 | The Chinese page is displayed |
| P5-041 | Localize internal links in comparison articles | Should | M | P5-035 | Links to related terms and questions stay within the same language |

---

## Phase 5-G: Localize Architecture Diagram Articles

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | --------------------------------------- | -----: | -: | ------ | ----------------------------------------------------------- |
| P5-042 | Create a multilingual structure for architecture diagram MDX | Should | M | P5-007 | `contents/architectures/en` `contents/architectures/zh` exist |
| P5-043 | Translate the S3 + CloudFront static site architecture into English | Should | M | P5-042 | The English architecture diagram article is displayed |
| P5-044 | Translate the S3 + CloudFront static site architecture into Chinese | Should | M | P5-042 | The Chinese architecture diagram article is displayed |
| P5-045 | Translate the API Gateway + Lambda + DynamoDB architecture into English | Should | M | P5-042 | The English architecture diagram article is displayed |
| P5-046 | Translate the API Gateway + Lambda + DynamoDB architecture into Chinese | Should | M | P5-042 | The Chinese architecture diagram article is displayed |
| P5-047 | Translate the three-tier web application architecture into English | Could | M | P5-042 | The English architecture diagram article is displayed |
| P5-048 | Translate the three-tier web application architecture into Chinese | Could | M | P5-042 | The Chinese architecture diagram article is displayed |
| P5-049 | Check language-specific wording in architecture SVGs | Should | M | P5-043 | Japanese text within SVGs is replaced in the English and Chinese versions |

Architecture diagrams are central to competitive differentiation. They are worth translating before practice questions.

---

## Phase 5-H: Localize the Blog

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | ----------------------------- | -----: | -: | ------ | ----------------------------------------- |
| P5-050 | Create a multilingual structure for blog MDX | Should | M | P5-007 | `contents/blog/en` `contents/blog/zh` exist |
| P5-051 | Translate "What Is AWS Cloud Practitioner?" into English | Should | M | P5-050 | The English blog article is displayed |
| P5-052 | Translate "What Is AWS Cloud Practitioner?" into Chinese | Should | M | P5-050 | The Chinese blog article is displayed |
| P5-053 | Translate the AWS Free Tier portfolio article into English | Should | M | P5-050 | The English blog article is displayed |
| P5-054 | Translate the AWS Free Tier portfolio article into Chinese | Should | M | P5-050 | The Chinese blog article is displayed |
| P5-055 | Translate the S3 + CloudFront publishing article into English | Should | M | P5-050 | The English blog article is displayed |
| P5-056 | Translate the S3 + CloudFront publishing article into Chinese | Should | M | P5-050 | The Chinese blog article is displayed |

---

## Phase 5-I: Localize CLF Questions

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | ---------------- | ----: | -: | ------ | --------------------------------------------------------- |
| P5-057 | Create a multilingual structure for CLF question data | Could | M | P5-027 | `clf-c02.ja.json` `clf-c02.en.json` `clf-c02.zh.json` exist |
| P5-058 | Translate 30 CLF questions into English | Could | XL | P5-057 | At least 30 English questions are displayed |
| P5-059 | Translate 30 CLF questions into Chinese | Could | XL | P5-057 | At least 30 Chinese questions are displayed |
| P5-060 | Localize the question UI | Could | L | P5-057 | UI elements such as answer, correct, incorrect, explanation, and next question are localized |
| P5-061 | Add wording clarifying that content is not exam dumps | Must | S | P5-058 | Question pages state that the questions are original, unofficial, and not exam dumps |

Question translation is substantial work, so it can wait until the latter half of Phase 5.
Prioritize terms, comparisons, and architecture diagrams first.

---

## Phase 5-J: Validation and Production Release

| ID | Task | Priority | Estimate | Dependency | Completion Criteria |
| ------ | ---------------- | -----: | -: | ------ | --------------------------------------------- |
| P5-062 | Create a translation quality checklist | Must | M | P5-030 | Rules cover AWS terminology inconsistencies, prohibited wording, and checking official terminology |
| P5-063 | Verify multilingual pages locally | Must | M | P5-029 | Key URLs display locally |
| P5-064 | Verify the static build | Must | S | P5-063 | `npm run build` succeeds and generates `out/en` `out/zh` |
| P5-065 | Verify production deployment | Must | M | P5-064 | `/en` `/zh` display through CloudFront |
| P5-066 | Verify the production sitemap | Must | S | P5-065 | `sitemap.xml` includes multilingual URLs |
| P5-067 | Check Search Console | Must | M | P5-065 | Sitemap submission and checks of URLs to be indexed are complete |
| P5-068 | Check GA by country and language | Must | S | P5-065 | The README documents how to check data by country and language |
| P5-069 | Document multilingual support in the README | Should | M | P5-065 | The README describes the global SEO and localization policies |
| P5-070 | Review Phase 5 completion | Must | M | P5-067 | Completion criteria are met and work can proceed to Phase 6 |

---

# 6. Implementation Priorities

## Sequence for Delivering Published Value Quickly

```text
1. P5-000 through P5-000-5: Competitors and SEO hypotheses
2. P5-001 through P5-008: Multilingual foundation
3. P5-009 through P5-015: SEO foundation
4. P5-016 through P5-026: Home and common pages
5. P5-027 through P5-033: Glossary
6. P5-034 through P5-049: Comparisons and architecture diagrams
7. P5-050 through P5-056: Blog
8. P5-057 through P5-061: Questions
9. P5-062 through P5-070: Validation, README, and completion review
```

## First Implementation Task

Start with this task.

```text
P5-000: Organize global competitors and SEO hypotheses
```

Before translating, it is necessary to decide which pages will attract traffic and differentiate the site when translated.

---

# 7. Recommended Directory Structure

```text
frontend/
├── src/
│   ├── i18n/
│   │   ├── locales.ts
│   │   ├── routes.ts
│   │   ├── metadata.ts
│   │   └── dictionaries/
│   │       ├── ja.ts
│   │       ├── en.ts
│   │       └── zh.ts
│   └── app/
│       ├── page.tsx
│       ├── terms/
│       ├── comparisons/
│       ├── architectures/
│       ├── blog/
│       ├── en/
│       │   ├── page.tsx
│       │   ├── terms/
│       │   ├── comparisons/
│       │   ├── architectures/
│       │   └── blog/
│       └── zh/
│           ├── page.tsx
│           ├── terms/
│           ├── comparisons/
│           ├── architectures/
│           └── blog/
├── contents/
│   ├── terms/
│   │   ├── terms.ja.json
│   │   ├── terms.en.json
│   │   └── terms.zh.json
│   ├── questions/
│   │   ├── clf-c02.ja.json
│   │   ├── clf-c02.en.json
│   │   └── clf-c02.zh.json
│   ├── comparisons/
│   │   ├── ja/
│   │   ├── en/
│   │   └── zh/
│   ├── architectures/
│   │   ├── ja/
│   │   ├── en/
│   │   └── zh/
│   └── blog/
│       ├── ja/
│       ├── en/
│       └── zh/
└── public/
    └── images/
        ├── ogp/
        │   ├── ja/
        │   ├── en/
        │   └── zh/
        └── architectures/
            ├── ja/
            ├── en/
            └── zh/
```

---

# 8. Completion Criteria

Phase 5 is complete when the following requirements are met.

| Item | Completion Criteria |
| ----- | --------------------------------------------------------- |
| Competitive analysis | English- and Chinese-language competitors, target keywords, and differentiation strategy are documented |
| URL | `/en` `/zh` can be displayed through CloudFront |
| UI | Header, Footer, CTA, search, and filters can be displayed in English and Chinese |
| SEO | canonical, hreflang, sitemap, metadata, and OGP are output by language |
| Glossary | At least 30 AWS terms can be displayed in English and Chinese |
| Comparison articles | At least 3 key comparison articles can be displayed in English and Chinese |
| Architecture diagrams | At least 3 key architecture diagrams can be displayed in English and Chinese |
| Common pages | about, privacy, disclaimer, and contact can be displayed in English and Chinese |
| Quality | Official AWS names, prohibited wording, and translation terminology rules are defined |
| build | `npm run lint` `npm run typecheck` `npm run build` pass |
| Production verification | `https://www.aws-cert-roadmap-lab.com/en` and `/zh` return 200 |
| Analytics | The README explains how to check Search Console and GA by country and language |
| Cost | No new fixed AWS costs have been added |

---
