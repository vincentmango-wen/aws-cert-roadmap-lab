# AWS Terminology Rules (P5-032)

This document defines how to write AWS service names and terminology in AWS Cert Roadmap Lab.
It is a reference for consistent terminology across Japanese, English, and Traditional Chinese pages.

## 1. Basic Policy

### 1-1. Keep AWS service names in their original English form
- Do not translate AWS service names on any language page (e.g., do not translate "Lambda" into the Japanese "ラムダ" or Chinese "拉姆達").
- Keep the "Amazon" / "AWS" prefixes exactly as in the original.
- Katakana translations, Chinese transliterations, and Chinese semantic translations are all prohibited.

### 1-2. Abbreviations
- Include the official name on the first occurrence in the body (e.g., "Amazon Elastic Compute Cloud (EC2)").
- From the second occurrence onward, the abbreviation alone may be used.
- Prefer abbreviations in headings (h2 / h3) to keep them concise (Japanese heading example: "## ACM の主な用途").

### 1-3. Language-specific surrounding text
- ja: Use Japanese verbs, particles, and conjunctions; keep service names in English.
- en: All English.
- zh: Use Traditional Chinese verbs, particles, and conjunctions; keep service names in English.

### 1-4. Parentheses and symbols
- Use half-width parentheses `( )` consistently in all languages (for searchability, do not use the zh full-width parentheses shown in the original as `( )`).
- In principle, retain half-width colons and slashes (e.g., `TLS/SSL`).

## 2. Naming Matrix for Major AWS Services

The following 53 entries match all termId values in `frontend/contents/terms/terms.ja.json`. Follow the workflow in §7 for new additions.

| Abbreviation | Official name (official English) | ja notation | en notation | zh notation |
|---|---|---|---|---|
| ACM | AWS Certificate Manager | AWS Certificate Manager | AWS Certificate Manager | AWS Certificate Manager |
| API Gateway | Amazon API Gateway | Amazon API Gateway | Amazon API Gateway | Amazon API Gateway |
| App Runner | AWS App Runner | AWS App Runner | AWS App Runner | AWS App Runner |
| Athena | Amazon Athena | Amazon Athena | Amazon Athena | Amazon Athena |
| Aurora | Amazon Aurora | Amazon Aurora | Amazon Aurora | Amazon Aurora |
| Auto Scaling | AWS Auto Scaling | AWS Auto Scaling | AWS Auto Scaling | AWS Auto Scaling |
| AWS Backup | AWS Backup | AWS Backup | AWS Backup | AWS Backup |
| Budgets | AWS Budgets | AWS Budgets | AWS Budgets | AWS Budgets |
| AWS Config | AWS Config | AWS Config | AWS Config | AWS Config |
| AWS CDK | AWS Cloud Development Kit | AWS CDK | AWS CDK | AWS CDK |
| CloudFormation | AWS CloudFormation | AWS CloudFormation | AWS CloudFormation | AWS CloudFormation |
| CloudFront | Amazon CloudFront | Amazon CloudFront | Amazon CloudFront | Amazon CloudFront |
| CloudTrail | AWS CloudTrail | AWS CloudTrail | AWS CloudTrail | AWS CloudTrail |
| CloudWatch | Amazon CloudWatch | Amazon CloudWatch | Amazon CloudWatch | Amazon CloudWatch |
| CodeBuild | AWS CodeBuild | AWS CodeBuild | AWS CodeBuild | AWS CodeBuild |
| CodePipeline | AWS CodePipeline | AWS CodePipeline | AWS CodePipeline | AWS CodePipeline |
| Cognito | Amazon Cognito | Amazon Cognito | Amazon Cognito | Amazon Cognito |
| Cost Explorer | AWS Cost Explorer | AWS Cost Explorer | AWS Cost Explorer | AWS Cost Explorer |
| DynamoDB | Amazon DynamoDB | Amazon DynamoDB | Amazon DynamoDB | Amazon DynamoDB |
| EBS | Amazon Elastic Block Store | Amazon EBS | Amazon EBS | Amazon EBS |
| EC2 | Amazon Elastic Compute Cloud | Amazon EC2 | Amazon EC2 | Amazon EC2 |
| ECR | Amazon Elastic Container Registry | Amazon ECR | Amazon ECR | Amazon ECR |
| ECS | Amazon Elastic Container Service | Amazon ECS | Amazon ECS | Amazon ECS |
| EFS | Amazon Elastic File System | Amazon EFS | Amazon EFS | Amazon EFS |
| Elastic Beanstalk | AWS Elastic Beanstalk | AWS Elastic Beanstalk | AWS Elastic Beanstalk | AWS Elastic Beanstalk |
| ElastiCache | Amazon ElastiCache | Amazon ElastiCache | Amazon ElastiCache | Amazon ElastiCache |
| ELB | Elastic Load Balancing | Elastic Load Balancing (ELB) | Elastic Load Balancing (ELB) | Elastic Load Balancing (ELB) |
| EventBridge | Amazon EventBridge | Amazon EventBridge | Amazon EventBridge | Amazon EventBridge |
| Fargate | AWS Fargate | AWS Fargate | AWS Fargate | AWS Fargate |
| FSx | Amazon FSx | Amazon FSx | Amazon FSx | Amazon FSx |
| Glue | AWS Glue | AWS Glue | AWS Glue | AWS Glue |
| GuardDuty | Amazon GuardDuty | Amazon GuardDuty | Amazon GuardDuty | Amazon GuardDuty |
| IAM | AWS Identity and Access Management | AWS IAM | AWS IAM | AWS IAM |
| Inspector | Amazon Inspector | Amazon Inspector | Amazon Inspector | Amazon Inspector |
| Kinesis | Amazon Kinesis | Amazon Kinesis | Amazon Kinesis | Amazon Kinesis |
| KMS | AWS Key Management Service | AWS KMS | AWS KMS | AWS KMS |
| Lambda | AWS Lambda | AWS Lambda | AWS Lambda | AWS Lambda |
| Organizations | AWS Organizations | AWS Organizations | AWS Organizations | AWS Organizations |
| QuickSight | Amazon QuickSight | Amazon QuickSight | Amazon QuickSight | Amazon QuickSight |
| RDS | Amazon Relational Database Service | Amazon RDS | Amazon RDS | Amazon RDS |
| Redshift | Amazon Redshift | Amazon Redshift | Amazon Redshift | Amazon Redshift |
| Route 53 | Amazon Route 53 | Amazon Route 53 | Amazon Route 53 | Amazon Route 53 |
| S3 | Amazon Simple Storage Service | Amazon S3 | Amazon S3 | Amazon S3 |
| Secrets Manager | AWS Secrets Manager | AWS Secrets Manager | AWS Secrets Manager | AWS Secrets Manager |
| Shield | AWS Shield | AWS Shield | AWS Shield | AWS Shield |
| SNS | Amazon Simple Notification Service | Amazon SNS | Amazon SNS | Amazon SNS |
| SQS | Amazon Simple Queue Service | Amazon SQS | Amazon SQS | Amazon SQS |
| Step Functions | AWS Step Functions | AWS Step Functions | AWS Step Functions | AWS Step Functions |
| Systems Manager | AWS Systems Manager | AWS Systems Manager | AWS Systems Manager | AWS Systems Manager |
| Trusted Advisor | AWS Trusted Advisor | AWS Trusted Advisor | AWS Trusted Advisor | AWS Trusted Advisor |
| VPC | Amazon Virtual Private Cloud | Amazon VPC | Amazon VPC | Amazon VPC |
| WAF | AWS WAF | AWS WAF | AWS WAF | AWS WAF |
| X-Ray | AWS X-Ray | AWS X-Ray | AWS X-Ray | AWS X-Ray |

## 3. Exam Designations

- CLF-C02 (Cloud Practitioner)
- SAA-C03 (Solutions Architect Associate)
- SAP-C02 (Solutions Architect Professional)

Do not change these designations on any language page. Write exam codes with a half-width hyphen, as in `SAA-C03`.

## 4. Category and Difficulty Notation

### 4-1. Categories (fixed English values / display labels converted through locale-specific categoryLabels)

- Compute
- Storage
- Database
- Networking
- Security
- Monitoring
- Integration
- Analytics
- Management

### 4-2. Difficulty (fixed English values / display labels converted through locale-specific levelLabels)

- beginner
- intermediate
- advanced

Use English keys consistently for category and difficulty fields in JSON data. Convert Japanese and Chinese display labels in the UI label conversion layer (`categoryLabels` / `levelLabels`).

## 5. Singular/Plural Forms and Articles (English Pages)

- Use singular service names (e.g., "an S3 bucket", "a Lambda function").
- Articles for general terms depend on context (e.g., "the IAM role", "an IAM policy").
- Do not use an article when referring to a service as an abstract concept (e.g., "Lambda invokes the function asynchronously").

## 6. Punctuation and Spacing

- ja: Use `、` and `。` for punctuation / do not insert a half-width space between half-width numbers and Japanese text / use half-width parentheses `( )`.
- en: Use standard English punctuation / the Oxford comma is recommended / insert a half-width space before parenthesized abbreviations: `Amazon Elastic Compute Cloud (EC2)`.
- zh (zh-TW): Use full-width punctuation (specimens retained as written in the original: `,` `。` `;`) / insert a half-width space between half-width numbers and Chinese text (localized example: `每月 USD 400`) / use half-width parentheses `( )`.

## 7. Reference Update Rules

When adding a new AWS service to the glossary:

1. Verify the official English name and abbreviation in the official AWS documentation.
2. Add one row to the matrix in §2 of this file (fill in all five columns: abbreviation / official name / ja / en / zh notation).
3. Add an entry with the same `termId` / `shortName` to each of `frontend/contents/terms/terms.ja.json` / `terms.en.json` / `terms.zh.json`.
4. Store the abbreviation (e.g., `S3`, `EC2`) in the `shortName` field and the official name (e.g., `Amazon Simple Storage Service`) in the `name` field.
5. Use identical English notation for `name` / `shortName` in every language (do not translate them across locales).
6. Reviewers check that service names do not appear in the body without a corresponding addition to the matrix.
