# P5-000-4 English SEO Keyword List

## 1. Document Information

| Item | Description |
|---|---|
| Document name | P5-000-4 English SEO Keyword List |
| Target product | AWS Cert Roadmap Lab |
| Target phase | Phase 5：Global SEO and Localization |
| Target language | English |
| Target URL Prefix | `/en` |
| Purpose | Organize long-tail SEO keywords for English-speaking audiences as a basis for English page creation, metadata, and internal link design |
| Related tasks | P5-000, P5-000-1, P5-000-2, P5-000-3, P5-000-4 |
| Created | 2026-06-10 |

---

## 2. Purpose of This Keyword List

This SEO design document clarifies target search keywords before creating English pages for AWS Cert Roadmap Lab.

Rather than simply translating Japanese pages, Phase 5 targets the following search intents using expressions English-speaking users are likely to search for.

1. Learn the study sequence for AWS certifications.
2. Understand differences between AWS services.
3. Understand AWS terms as a beginner.
4. Learn design patterns through AWS architecture diagrams.
5. Find AWS portfolio implementation examples.

---

## 3. Basic Policy

## 3.1 Target Keyword Policy

| Policy | Description |
|---|---|
| Prioritize long-tail keywords | Do not target overly broad keywords such as `AWS Cloud Practitioner` alone |
| Explicitly target beginners | Actively use `for beginners`, `explained`, and `guide` |
| Emphasize comparisons | Use `vs`, `difference`, and `comparison` to lead to comparison pages |
| Emphasize architecture diagrams | Use `architecture`, `diagram`, and `example` to lead to SAA architecture diagrams |
| Target portfolio searches | Use `portfolio project`, `free tier`, and `serverless project` |
| Exclude exam dump searches | Do not target `exam dump`, `real questions`, or `answers` |

## 3.2 Priority Definitions

| Priority | Meaning | Approach |
|---|---|---|
| A | High value for initial English translation | Incorporate into metadata, body text, and internal links in the initial `/en` release |
| B | Worth creating next | Address after translating terms, comparisons, and architecture diagrams into English |
| C | Target in future expansion | Create articles after the content volume grows |

## 3.3 Search Intent Categories

| Category | Intent | Main corresponding pages |
|---|---|---|
| Roadmap | Learn the study sequence | `/en`, `/en/roadmap`, `/en/blog/...` |
| Terms | Understand AWS terms | `/en/terms`, `/en/terms/[termId]` |
| Comparison | Understand differences between services | `/en/comparisons/[comparisonSlug]` |
| Architecture | Learn AWS architecture diagrams | `/en/architectures/[architectureSlug]` |
| Portfolio | Build implementation examples or portfolios | `/en/blog/...`, `/en/architectures/...` |
| Exam Prep | Deepen understanding of exam coverage | `/en/questions`, `/en/blog/...` |

---

## 4. English SEO Keyword List

## 4.1 Priority A: Keywords to Target First

| No | Keyword | Search Intent | Target URL | Reason |
|---:|---|---|---|---|
| 1 | aws certification roadmap for beginners | Roadmap | `/en/roadmap` | Works well as an entry point to the whole site |
| 2 | aws cloud practitioner study roadmap for beginners | Roadmap | `/en/roadmap` | Matches CLF learners' search intent |
| 3 | aws cloud practitioner key services explained | Terms | `/en/terms` | Can lead to the glossary index |
| 4 | aws cloud practitioner terminology guide | Terms | `/en/terms` | Fits the AWS glossary well |
| 5 | aws shared responsibility model for beginners | Terms | `/en/terms/shared-responsibility-model` | An important security concept in CLF |
| 6 | s3 vs ebs vs efs for beginners | Comparison | `/en/comparisons/s3-vs-ebs-vs-efs` | An existing comparison article to translate into English |
| 7 | rds vs dynamodb for beginners | Comparison | `/en/comparisons/rds-vs-dynamodb` | Clear search intent for a database comparison |
| 8 | sqs vs sns vs eventbridge explained | Comparison | `/en/comparisons/sns-vs-sqs-vs-eventbridge` | Valuable as an integration service comparison |
| 9 | cloudwatch vs cloudtrail vs aws config | Comparison | `/en/comparisons/cloudwatch-vs-cloudtrail-vs-config` | Addresses confusion between monitoring and auditing services |
| 10 | iam user vs role vs policy explained | Comparison | `/en/comparisons/iam-user-vs-role-vs-policy` | Addresses common points of confusion for IAM beginners |
| 11 | aws static website architecture s3 cloudfront | Architecture | `/en/architectures/static-site-s3-cloudfront` | Matches an implemented architecture |
| 12 | s3 cloudfront oac architecture | Architecture | `/en/architectures/static-site-s3-cloudfront` | Can differentiate through private S3 content delivery |
| 13 | api gateway lambda dynamodb architecture | Architecture | `/en/architectures/serverless-api-basic` | Directly relates to the serverless API architecture |
| 14 | aws serverless api architecture for beginners | Architecture | `/en/architectures/serverless-api-basic` | Fits beginner-friendly architecture diagrams |
| 15 | aws portfolio project for beginners | Portfolio | `/en/blog/aws-free-tier-portfolio` | Fits the portfolio message |

---

## 4.2 Priority B: Keywords to Target in Mid-Phase 5

| No | Keyword | Search Intent | Target URL | Reason |
|---:|---|---|---|---|
| 16 | aws cloud practitioner cloud concepts explained | Exam Prep | `/en/blog/aws-cloud-practitioner-roadmap` | Useful for a CLF foundational concepts article |
| 17 | aws pricing and billing for cloud practitioner | Exam Prep | `/en/blog/aws-cloud-practitioner-roadmap` | Matches search intent for billing and pricing |
| 18 | aws free tier portfolio project | Portfolio | `/en/blog/aws-free-tier-portfolio` | Matches low-cost personal development |
| 19 | serverless aws portfolio project | Portfolio | `/en/blog/aws-free-tier-portfolio` | Fits the Lambda/API Gateway/DynamoDB architecture |
| 20 | deploy static website to s3 cloudfront github actions | Portfolio | `/en/blog/deploy-static-site-s3-cloudfront-github-actions` | Can expand into a CI/CD implementation article |
| 21 | github actions deploy to s3 cloudfront oidc | Portfolio | `/en/blog/github-actions-s3-cloudfront-oidc` | An OIDC architecture has high portfolio value |
| 22 | aws solutions architect associate architecture patterns | Architecture | `/en/architectures` | Can lead to the SAA architecture diagram index |
| 23 | aws saa high availability design examples | Architecture | `/en/architectures/high-availability-web-app` | Leads to a high-availability architecture diagram |
| 24 | aws saa cost optimization examples | Architecture | `/en/architectures` | Matches SAA's cost optimization perspective |
| 25 | three tier architecture on aws diagram | Architecture | `/en/architectures/three-tier-vpc` | Useful for a three-tier architecture diagram page |
| 26 | high availability web application architecture aws | Architecture | `/en/architectures/high-availability-web-app` | Valuable as an SAA design pattern |
| 27 | eventbridge lambda batch architecture | Architecture | `/en/architectures/eventbridge-lambda-batch` | Leads to an EventBridge architecture diagram |
| 28 | alb vs nlb vs cloudfront difference | Comparison | `/en/comparisons/alb-vs-nlb-vs-cloudfront` | Fits a delivery and load balancer comparison article |
| 29 | multi az vs read replica explained | Comparison | `/en/comparisons/multi-az-vs-read-replica` | Fits RDS/SAA learning |
| 30 | security group vs nacl explained | Comparison | `/en/comparisons/security-group-vs-nacl` | Valuable as a VPC security comparison |

---

## 4.3 Priority C: Keywords for Future Expansion

| No | Keyword | Search Intent | Target URL | Reason |
|---:|---|---|---|---|
| 31 | what is amazon s3 for beginners | Terms | `/en/terms/s3` | Useful for a term detail page |
| 32 | what is aws lambda for beginners | Terms | `/en/terms/lambda` | Useful for Lambda term detail |
| 33 | what is amazon dynamodb for beginners | Terms | `/en/terms/dynamodb` | Useful for DynamoDB term detail |
| 34 | what is amazon cloudfront for beginners | Terms | `/en/terms/cloudfront` | Useful for CloudFront term detail |
| 35 | what is amazon api gateway for beginners | Terms | `/en/terms/api-gateway` | Useful for API Gateway term detail |
| 36 | what is aws iam role for beginners | Terms | `/en/terms/iam` | Useful for IAM term detail and comparison articles |
| 37 | aws vpc architecture for beginners | Architecture | `/en/architectures/three-tier-vpc` | Useful for understanding VPC architecture |
| 38 | route 53 cloudfront acm example | Architecture | `/en/architectures/static-site-s3-cloudfront` | Useful for guiding users toward custom domains and HTTPS |
| 39 | aws cloudfront origin access control explained | Terms | `/en/terms/cloudfront` | Can explain OAC implementation experience |
| 40 | aws budgets cost explorer for beginners | Terms | `/en/terms/aws-budgets` | Useful for cost management content |

---

## 5. Recommended Keywords to Add to Metadata First

## 5.1 `/en`

| Item | Description |
|---|---|
| Primary keyword | aws certification roadmap for beginners |
| Secondary keywords | aws cloud practitioner study roadmap for beginners, aws cloud practitioner key services explained |
| Search intent | Learn how to start studying for AWS certifications |
| Recommended title | AWS Certification Roadmap for Beginners |
| Recommended description | Learn AWS Cloud Practitioner and Solutions Architect basics with beginner-friendly terms, comparisons, practice questions, and architecture diagrams. |

## 5.2 `/en/terms`

| Item | Description |
|---|---|
| Primary keyword | aws cloud practitioner terminology guide |
| Secondary keywords | aws cloud practitioner key services explained, what is amazon s3 for beginners |
| Search intent | Understand major AWS services and terms |
| Recommended title | AWS Cloud Practitioner Terminology Guide |
| Recommended description | A beginner-friendly glossary of AWS services, cloud concepts, exam points, and practical use cases for AWS certification learners. |

## 5.3 `/en/comparisons`

| Item | Description |
|---|---|
| Primary keyword | aws service comparison for beginners |
| Secondary keywords | s3 vs ebs vs efs for beginners, rds vs dynamodb for beginners |
| Search intent | Compare differences between AWS services |
| Recommended title | AWS Service Comparisons for Beginners |
| Recommended description | Compare commonly confused AWS services with simple tables, exam points, and practical use cases for Cloud Practitioner and SAA learners. |

## 5.4 `/en/architectures`

| Item | Description |
|---|---|
| Primary keyword | aws architecture diagrams for beginners |
| Secondary keywords | aws static website architecture s3 cloudfront, aws serverless api architecture for beginners |
| Search intent | Learn design patterns through AWS architecture diagrams |
| Recommended title | AWS Architecture Diagrams for Beginners |
| Recommended description | Learn AWS architecture patterns with beginner-friendly diagrams covering static websites, serverless APIs, three-tier apps, and high availability designs. |

## 5.5 `/en/blog/aws-free-tier-portfolio`

| Item | Description |
|---|---|
| Primary keyword | aws free tier portfolio project |
| Secondary keywords | aws portfolio project for beginners, serverless aws portfolio project |
| Search intent | Build a portfolio using the AWS Free Tier |
| Recommended title | AWS Free Tier Portfolio Project for Beginners |
| Recommended description | Build a beginner-friendly AWS portfolio project using S3, CloudFront, Lambda, API Gateway, DynamoDB, and GitHub Actions. |

---

## 6. Keywords Not to Target

Do not target the following keywords even if they generate traffic, because they pose high risks to site quality, trustworthiness, AdSense review, and compliance with AWS certification policies.

| Keyword | Reason |
|---|---|
| aws cloud practitioner exam dump | Search intent seeks exam dumps and conflicts with the prohibited expression policy |
| clf-c02 real exam questions | Strong intent to obtain actual exam questions |
| aws certification real answers | Strong intent to obtain unauthorized answers |
| pass aws cloud practitioner guaranteed | Passing guarantees undermine trustworthiness |
| aws saa-c03 dump pdf | Strong intent for exam dumps and unlawful PDF distribution |
| free aws exam answers | Strong search intent for unauthorized answers |

---

## 7. Content Creation Priorities

## 7.1 Pages to Translate into English First

| Priority | Page | Target URL | Primary keyword |
|---:|---|---|---|
| 1 | English home | `/en` | aws certification roadmap for beginners |
| 2 | English roadmap | `/en/roadmap` | aws cloud practitioner study roadmap for beginners |
| 3 | English glossary | `/en/terms` | aws cloud practitioner terminology guide |
| 4 | S3 / EBS / EFS comparison | `/en/comparisons/s3-vs-ebs-vs-efs` | s3 vs ebs vs efs for beginners |
| 5 | RDS / DynamoDB comparison | `/en/comparisons/rds-vs-dynamodb` | rds vs dynamodb for beginners |
| 6 | SNS / SQS / EventBridge comparison | `/en/comparisons/sns-vs-sqs-vs-eventbridge` | sqs vs sns vs eventbridge explained |
| 7 | Static site architecture | `/en/architectures/static-site-s3-cloudfront` | aws static website architecture s3 cloudfront |
| 8 | Serverless API architecture | `/en/architectures/serverless-api-basic` | api gateway lambda dynamodb architecture |
| 9 | AWS Free Tier portfolio article | `/en/blog/aws-free-tier-portfolio` | aws free tier portfolio project |
| 10 | S3 + CloudFront publishing article | `/en/blog/deploy-static-site-s3-cloudfront-github-actions` | deploy static website to s3 cloudfront github actions |

## 7.2 Internal Link Policy

| Source | Destination | Purpose |
|---|---|---|
| `/en` | `/en/roadmap` | Guide users to the study sequence |
| `/en/roadmap` | `/en/terms` | Guide users to understanding terms |
| `/en/terms/s3` | `/en/comparisons/s3-vs-ebs-vs-efs` | Guide users to understanding comparisons |
| `/en/comparisons/s3-vs-ebs-vs-efs` | `/en/architectures/static-site-s3-cloudfront` | Guide users to an implementation architecture |
| `/en/architectures/static-site-s3-cloudfront` | `/en/blog/aws-free-tier-portfolio` | Guide users to the portfolio article |
| `/en/blog/aws-free-tier-portfolio` | `/en/contact` | Guide users to inquiries and portfolio review |

---

## 8. Metadata Creation Rules

## 8.1 Title Rules

| Rule | Description |
|---|---|
| Character count | Aim for 45–65 characters |
| Primary keyword | Place as early as possible |
| Site name | Append `\| AWS Cert Roadmap Lab` only on pages that need it |
| Exaggerated wording | Do not use `guaranteed`, `real exam`, or `dump` |

## 8.2 Description Rules

| Rule | Description |
|---|---|
| Character count | Aim for 120–160 characters |
| Search intent | Clearly state what users can learn |
| Audience | Use `beginners` and `AWS certification learners` |
| Prohibited expressions | Do not use wording that could be mistaken for passing guarantees, actual exam questions, or official questions |

## 8.3 H1 Rules

| Page type | H1 example |
|---|---|
| Home | AWS Certification Roadmap for Beginners |
| Glossary | AWS Cloud Practitioner Terminology Guide |
| Comparison | S3 vs EBS vs EFS: What Is the Difference? |
| Architecture diagram | AWS Static Website Architecture with S3 and CloudFront |
| Blog | How to Build an AWS Free Tier Portfolio Project |

---

## 9. Validation Methods

## 9.1 Local Validation

- Markdown tables are intact.
- There are at least 20 keywords.
- Prohibited keywords are absent from the target keyword list.
- Target URLs are under `/en`.

## 9.2 Post-Implementation Validation

- Pages under `/en` are generated.
- Each page's title / description includes its primary keyword.
- The sitemap includes English URLs.
- hreflang mutually references Japanese, English, and Chinese pages.
- English URLs are eligible for indexing in Search Console.
- GA can show traffic by country and language.

---

## 10. Completion Criteria

P5-000-4 is complete when the following requirements are met.

| Criterion | Requirement |
|---|---|
| There are at least 20 English long-tail keywords | Required |
| Each keyword has a search intent | Required |
| Each keyword has a planned URL | Required |
| Priority A/B/C is assigned | Required |
| Prohibited keywords are explicit | Required |
| A metadata policy exists for subsequent tasks | Required |
| Content priorities under `/en` are decided | Required |

---

## 11. Connection to Subsequent Tasks

| Next task | Connection |
|---|---|
| P5-000-5 | Use the same structure for Chinese SEO keywords |
| P5-001 | Reflect the English SEO policy in the multilingual support policy |
| P5-009 | Use `/en` URLs in canonical / hreflang design |
| P5-010 | Use titles / descriptions from this list in the multilingual metadata helper |
| P5-011 | Register target URLs in the multilingual sitemap |
| P5-016 | Incorporate the primary keyword into the English home page |
| P5-030 | Incorporate Terms keywords when translating English term data |
| P5-035 | Incorporate Comparison keywords when translating comparison articles into English |
| P5-043 | Incorporate Architecture keywords when translating architecture diagram articles into English |