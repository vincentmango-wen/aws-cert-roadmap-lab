# Lambda execution timeout content correction

## Goal and decision

Correct stale references to a universal 15-minute Lambda maximum in the existing CLF and SAA question explanations and Lambda/Fargate glossary notes, in Traditional Chinese, Japanese, and English. The owner approved this scope and an isolated cloud branch on 2026-11-21.

We considered a glossary-only fix (smaller, but it leaves misleading explanations in the bank), an App Runner maintenance change (independent but does not fix those explanations), and a narrow complete Lambda correction (chosen). This is editorial maintenance, not a new site feature, and is independent of PR #373. No modifications to FUMI, the AIF bank, comparison articles, UI, navigation, or publication workflow.

## Rules and acceptance

- On 2026-11-19 AWS announced up to 30 minutes for on-demand Lambda Event Functions in commercial Regions. This is a configurable maximum, not the default or a blanket limit for every execution model and caller; integration or event-source constraints can be lower. Keep Managed Instances and other invocation models distinct, without adding unrelated service limits to the question explanations.
- In each locale, update the CLF-019 and CLF-035 practical notes, SAA-043's B rationale, and the Lambda/Fargate practical notes. Keep SAA-043's disqualifying reasons about step-level retries and visibility. Preserve all stems, choices, correct letters (A/D/A), identifiers, and routes. Preserve independent S3 RTC statements.
- Cite the AWS announcement and existing primary references and record the actual correction date. Do not infer the exam rollout date from the service rollout or the AWS Certification FAQ. No new announcement or schema change.
- Verify disjoint product paths and no integration conflict with the exact current #373 in either order, trilingual semantics, and working generated target pages. Open one independent Ready for review PR; no merge, auto-merge, production deploy, or edit to #373.

Sources: [AWS service announcement](https://aws.amazon.com/about-aws/whats-new/2026/11/aws-lambda-30-minute-ondemand-event-functions/), [AWS Compute Blog](https://aws.amazon.com/blogs/compute/announcing-30-minute-timeout-for-on-demand-aws-lambda-event-functions/), [AWS Certification FAQ](https://aws.amazon.com/certification/faqs/).
