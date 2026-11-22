# Phase 2 Firsthand Experience Article Outlines (ACR-011 / #321)

## 1. Document Information

| Item | Description |
|---|---|
| Document name | Phase 2 Firsthand Experience Article Outlines |
| Target ticket | #321 [ACR-011] Improve E-E-A-T |
| Created | 2026-08-02 |
| Purpose | Define the heading structure for two articles based on the operator's firsthand experience and the facts to include in each section |
| Status | Outlines only. Body text has not been started |

---

## 2. Role and Constraints of This Document

This document defines **only the heading structure and instructions for what to write under each heading**. It does not write the article bodies.

### 2.1 Why AI Does Not Write the Body Text

The value of these two articles lies in firsthand information only the operator can provide: actual exam dates, actual scores, actual billing amounts, and actual difficulties encountered. Filling these in with AI guesses or generalities would cause two critical problems.

1. Describing fictional credentials or experiences violates Google AdSense policies.
2. It becomes a matter of the operator's personal credibility.

Therefore, **all first-person accounts, experiences, impressions, and measured figures must be written by the operator.**

### 2.2 Why No MDX Files Are Created

The invariants in `frontend/src/contents/blog/__tests__/blog-locale-parity.test.ts` require:

- (R) The registry slug set = the slug set in `contents/blog/ja/`.
- (1) The `ja` / `en` / `zh` slug sets match exactly.

Placing an unfinished article in `ja` would require empty translation files in `en` / `zh` at the same time, accumulating low-quality files in `en` / `zh` while those locales are subject to the sealing policy.

Once the body text is complete, introduce it through a separate ticket that includes translations.

### 2.3 Writing Rules

- Follow the prohibited expression list in §5 of `docs/seo/content-policy.md`. In particular, do not use wording that guarantees passing or suggests that actual exam questions are published (see `content-policy.md` for specific prohibited terms).
- Do not describe exam questions themselves: question text, choices, or specific tested topics. Doing so breaches the AWS certification exam NDA.
- Permitted topics are limited to the study period, learning resources used, the venue and check-in process on exam day, how to read the score report, and general names of areas in which the author was weak.
- Describe fees and billing amounts as text containing figures and breakdowns, not screenshots. Conceal identifiers such as account IDs and bucket names.

### 2.4 Placeholder Convention

Fields the operator must fill in when writing the body are marked with double-brace input markers. The formal marker format is defined in the "Placeholder convention" section of ticket #321.

Before merging into `master`, there must be zero such markers across the repository (see #321, "Resolving placeholders (pre-master-merge gate)"). This explanatory section itself contains no markers, so all remaining grep results represent unfilled fields.

---

## 3. Article A: AWS Certification Exam Experience

### 3.1 Proposed Metadata

| Item | Value |
|---|---|
| Proposed slug | `{{FUMI_INPUT: Slug matching the exam taken (e.g. clf-c02-exam-report)}}` |
| category | CLF対策 or SAA対策 (original Japanese category values; match the exam taken) |
| Proposed targetKeywords | `{{FUMI_INPUT: Exam name}} 受験記` / `{{FUMI_INPUT: Exam name}} 勉強時間` / `{{FUMI_INPUT: Exam name}} 当日 流れ` (Japanese search keyword specimens) |
| Expected length | 2,500–3,500 characters (at least 6,000 bytes) |

### 3.2 Heading Structure and Input Instructions

#### H1: My Experience Taking `{{FUMI_INPUT: Exam name}}`

In the opening 2–3 sentences, state when the exam was taken, what the result was, and what readers will learn from the article. Let readers judge its value within the first 3 lines.

#### H2: Exam Background

Provide information that lets readers compare their circumstances with the author's. Use bullet points.

- Exam date: `{{FUMI_INPUT: Exam date (YYYY-MM-DD)}}`
- Exam format: `{{FUMI_INPUT: Test center / Online exam (Pearson VUE or PSI)}}`
- AWS experience at the time of the exam: `{{FUMI_INPUT: Whether and how extensively AWS had been used professionally. Write "None" if there was no experience}}`
- Professional IT experience: `{{FUMI_INPUT: Role and number of years}}`
- Other certifications held: `{{FUMI_INPUT: Certifications held at the time of the exam. Write "None" if there were none}}`

#### H2: Study Period and Study Volume

- Study start date, exam date, and total study period: `{{FUMI_INPUT: Start date and duration}}`
- Average daily study time and total study time: `{{FUMI_INPUT: Measured or approximate hours}}`
- Actual study schedule (daily or weekends only): `{{FUMI_INPUT: Actual schedule}}`

If exact figures cannot be recalled, explicitly label them as approximate and provide estimates. Honest estimates are more trustworthy than fabricated precise figures.

#### H2: Learning Resources Used

List the resources used in a table with columns for resource name, format, cost, period of use, and impressions.

- `{{FUMI_INPUT: List of resources actually used, such as book titles, video courses, and official training names}}`
- State the amount actually paid. Label free resources as "Free".
- **Do not claim to have used resources that were not used.** If this reads as affiliate promotion, it damages E-E-A-T.
- If this site's practice questions were used, they may also be listed, but treat them on the same footing as other resources and do not overpraise them.

#### H2: From Registration to Exam Day

Write this as a sequence of steps. This section provides reproducible information for other exam candidates.

1. Registration method: `{{FUMI_INPUT: Points that actually caused confusion when registering through the AWS Certification account}}`
2. Choosing the exam date and time: `{{FUMI_INPUT: What was actually checked regarding availability and whether rescheduling was possible}}`
3. What to bring and identity verification: `{{FUMI_INPUT: Types and number of identification documents actually presented}}`
4. From venue check-in to taking a seat: `{{FUMI_INPUT: Actual process, including time required, lockers, and handling of personal belongings}}`

For an online exam, describe the advance room check, clearing the desk, and check-in procedure.

#### H2: Impressions During the Exam

**Do not describe question content.** Limit the discussion to the following.

- Time allocation: `{{FUMI_INPUT: Time needed to answer all questions and time spent reviewing}}`
- Perceived question length: `{{FUMI_INPUT: Whether questions felt longer or shorter than expected, etc.}}`
- Use of flags and review features: `{{FUMI_INPUT: How these were actually used}}`

#### H2: Results and How to Read the Score Report

- Pass/fail result and overall score: `{{FUMI_INPUT: Result and score. If the score should remain private, "Passed" alone is acceptable}}`
- Time until results arrived: `{{FUMI_INPUT: Actual time between the exam ending and the result notification}}`
- Explain the score report's structure in general terms. Stay within specifications AWS has publicly disclosed, such as domain ratings like "Meets Competencies" and "Needs Improvement", and the fact that the actual number of correct answers per domain is not shown.

#### H2: Weak Areas and How to Address Them Next

- Areas rated weak by domain: `{{FUMI_INPUT: Use domain names from the exam guide}}`
- Self-analysis of why they were weak: `{{FUMI_INPUT: Reflections on study allocation and insufficient understanding}}`
- Next steps: `{{FUMI_INPUT: Concrete study plan}}`

#### H2: Advice for Future Candidates

Avoid generalities. Write only 3–5 points supported by personal experience. Do not make categorical passing guarantees or effectiveness guarantees such as "do only this and you will pass".

#### H2: Related Links

- This site's roadmap page for the relevant exam
- The practice question page for that exam
- The official AWS exam guide (external link)

---

## 4. Article B: How This Site Was Built on AWS

### 4.1 Proposed Metadata

| Item | Value |
|---|---|
| Proposed slug | `building-this-site-on-aws` |
| category | AWS無料枠・ポートフォリオ (original Japanese category value) |
| Proposed targetKeywords | `S3 CloudFront 静的サイト 実例` / `AWS 個人開発 月額` / `Next.js 静的エクスポート S3` (Japanese search keyword specimens) |
| Expected length | 3,000–4,000 characters (at least 6,000 bytes) |

### 4.2 Primary Sources

Existing materials in this repository that can be referenced when writing the body.

- `docs/operations/deploy-failure-runbook.md`: Deployment failure response procedures
- `docs/operations/mvp-operation-runbook.md`: MVP operating procedures
- `.github/workflows/deploy-frontend.yml`: Actual deployment pipeline definition
- `.github/workflows/ci.yml`: CI definition

These are committed to the repository and publicly available in a form third parties can verify, making them valuable links to support the article.

**Uncommitted materials**: The CloudFront URL rewrite fix (for all extensionless URLs returning 404, the main cause of the 2026-06-28 AdSense rejection), `infra/cloudfront/url-rewrite.js` and
`docs/operations/cloudfront-url-rewrite-setup.md`, exists on the working machine but **has not been committed to the repository** (the "infra commit" in issue #306).
If mentioning this issue in the article, commit those files first so they can be verified, then reference them. Links written before the commit will lead readers to 404 pages.

### 4.3 Heading Structure and Input Instructions

#### H1: How This Site Was Built on AWS

Open with 3 lines stating what was built, which architecture it uses, and how much it actually costs.

#### H2: Architecture Overview

Include an architecture diagram or table. If the site's architectures page already illustrates it, link there.

- Services used and their roles: Amazon S3 / Amazon CloudFront / AWS Lambda / Amazon API Gateway / Amazon DynamoDB / Amazon CloudWatch / AWS Certificate Manager / Amazon Route 53
- Framework: Next.js static export (`output: "export"`)
- CI/CD: GitHub Actions + OIDC

Because this section describes facts, an AI draft would not constitute fabrication. However, always verify that it matches the actual architecture.

#### H2: Why This Architecture Was Chosen

Write this as a record of decisions. If other options were considered, include them.

- Why S3 + CloudFront rather than EC2: `{{FUMI_INPUT: Actual reasons for the decision}}`
- Why a direct AWS setup rather than Amplify or Vercel: `{{FUMI_INPUT: Actual reasons for the decision. If learning was the reason, say so}}`
- Why DynamoDB: `{{FUMI_INPUT: Actual reasons for the decision}}`

#### H2: Actual Monthly Bill

**The core of this article.** Without measured figures, the article loses its value.

- Billing month: `{{FUMI_INPUT: Year and month for which billing was checked}}`
- Total: `{{FUMI_INPUT: Actual total bill (USD)}}`
- Breakdown by service: `{{FUMI_INPUT: Cost Explorer breakdown by service. For amounts below 0.01 USD, write "Less than 0.01 USD"}}`
- Visits or page views in the same month: `{{FUMI_INPUT: A scale metric that can be related to the amount}}`

Always include the following caveats.

- Unit prices change, so the same architecture may not cost the same in the future.
- Amounts vary with Free Tier eligibility and usage.
- More traffic increases CloudFront data transfer charges.

#### H2: Difficulties Encountered and How They Were Resolved

**This is also firsthand experience.** For each case, use 4 stages: symptoms → investigation → cause → remedy.

- Case 1: `{{FUMI_INPUT: An actual difficulty encountered. If describing the CloudFront URL rewrite fix (all extensionless URLs returning 404), first commit infra/cloudfront/ and docs/operations/cloudfront-url-rewrite-setup.md before referencing them}}`
- Case 2: `{{FUMI_INPUT: An actual difficulty encountered (e.g. OIDC trust policy, ACM certificate region, or cache invalidation timing)}}`
- Case 3: `{{FUMI_INPUT: An actual difficulty encountered}}`

Do not add guessed "common pitfalls". Describing traps the author never encountered undermines the credibility of the entire article.

#### H2: Changes Made After Operating the Site

- Architecture or operational changes after launch: `{{FUMI_INPUT: Actual changes and their reasons}}`
- Changes considered but not made: `{{FUMI_INPUT: What was considered but deferred, and why}}`

#### H2: Advice for Others Building the Same Architecture

- What to configure first (such as AWS Budgets)
- How to identify resources that keep incurring charges if not deleted
- Where in this repository to look to follow the implementation

#### H2: Related Links

- The relevant architectures page on this site
- Related blog articles (`s3-cloudfront-static-site`, `github-actions-oidc-deploy`, `aws-budgets-cost-guardrail`)
- GitHub repository

---

## 5. Publication Checklist

Check these items when converting the completed body text into MDX.

- [ ] No input markers remain (the grep for #321's pre-master-merge gate returns zero matches).
- [ ] MDX files have been created in all 3 languages: `ja` / `en` / `zh`.
- [ ] `postId` / `publishedAt` / `updatedAt` / `published` match across all 3 languages.
- [ ] A registry entry has been added to `frontend/src/contents/blog/blogPosts.ts`.
- [ ] Each MDX file's first H1 matches the frontmatter `title`.
- [ ] The prohibited expression grep in §13 of `docs/seo/content-policy.md` returns zero matches.
- [ ] No exam question content, question text, or choices are included.
- [ ] Every stated amount includes the year and month it was checked and a note that unit prices may change.
- [ ] `npm run lint` / `npm run typecheck` / `npm test` / `npm run build` pass.
