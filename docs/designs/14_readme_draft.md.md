AWS Cert Roadmap Lab

A portfolio web application for learning AWS serverless architectures through implementation while studying for AWS certifications.

The goal is to turn Cloud Practitioner / Solutions Architect Associate study material into a learning site that actually runs on AWS, rather than just a collection of notes.



Overview

AWS Cert Roadmap Lab is a learning site for people studying for AWS certifications.

Its main features are as follows.

- Learning roadmaps for AWS Cloud Practitioner / SAA
- A glossary of major AWS services
- CLF-C02 practice questions
- AWS service comparison articles
- AWS architecture diagram explanations
- An AWS learning blog
- A contact form
- A serverless contact API

In the MVP, learning content is managed as static files, and only the contact form uses dynamic processing with API Gateway + Lambda + DynamoDB.



Background

I am currently studying for AWS Cloud Practitioner and plan to take Solutions Architect Associate afterward.

Rather than stopping at certification study, I wanted to implement what I learned as real AWS architectures and make it something I could explain as a portfolio project.

This project emphasizes the following.

- Translating AWS certification knowledge into implementation
- Using an AWS architecture that is inexpensive to operate
- Designing for security, IAM, monitoring, and CI/CD
- Eventually expanding into a learning publication that supports SEO and advertising revenue



Demo

Currently in preparation.

Production URL: https://xxxxxxxx.cloudfront.net

A custom domain will be considered after the MVP is published.



Main Features

1. Learning Roadmap

Organize the learning sequence from AWS Cloud Practitioner to Solutions Architect Associate.

Topics covered:

- An overview of learning AWS
- The Cloud Practitioner exam scope
- Foundational knowledge leading to SAA
- Learning priorities by service
- Understanding AWS architectures through implementation



2. AWS Glossary

Organize major AWS services and important concepts in a beginner-friendly way.

Planned initial entries:

- IAM
- S3
- EC2
- Lambda
- VPC
- RDS
- DynamoDB
- CloudFront
- Route 53
- CloudWatch
- CloudTrail
- API Gateway
- SQS
- SNS
- EventBridge
- EBS
- EFS
- ELB
- Auto Scaling
- ACM
- KMS
- WAF
- AWS Budgets
- Cost Explorer
- Organizations
- AWS Config
- Secrets Manager
- Systems Manager
- CloudFormation
- Cognito

The MVP targets at least 30 glossary entries.



3. CLF-C02 Practice Questions

Provide practice questions for AWS Cloud Practitioner.

Create at least 30 questions for the MVP.

Question categories:

|   |   |
|---|---|
|Category|Description|
|Cloud Concepts|Basic cloud concepts|
|Security and Compliance|Security and the shared responsibility model|
|Cloud Technology and Services|Major AWS services|
|Billing, Pricing, and Support|Billing, pricing, and support|

Each question includes the following.

- Question text
- Four answer choices
- Correct answer
- Explanation
- Related AWS services
- Related terms



4. AWS Service Comparison Articles

Compare AWS services that are easily confused both on exams and in practice.

Examples of initial articles:

- Differences between S3 / EBS / EFS
- Differences between EC2 / Lambda / ECS
- Differences between RDS / DynamoDB
- Differences between CloudWatch / CloudTrail / AWS Config
- Differences between SQS / SNS / EventBridge



5. AWS Architecture Diagram Explanations

Create architecture diagram explanations to help readers understand AWS services as real architectures rather than memorizing services individually.

Examples of initial architectures:

- S3 + CloudFront static site architecture
- API Gateway + Lambda + DynamoDB serverless API architecture
- Private S3 content delivery through CloudFront OAC
- Low-cost operational monitoring with AWS Budgets + CloudWatch
- Authenticated API architecture with Cognito + API Gateway + Lambda



6. Contact Form

Store contact form submissions using API Gateway + Lambda + DynamoDB.

Input fields:

- Name
- Email address
- Subject
- Message body
- Honeypot field

The MVP introduces a honeypot and character limits for spam prevention.



Technology Stack

Frontend

|   |   |
|---|---|
|Technology|Purpose|
|Next.js|Web application framework|
|TypeScript|Type-safe development|
|Tailwind CSS|UI styling|
|Markdown / MDX|Learning content management|
|JSON|Glossary and question data management|



AWS

|   |   |
|---|---|
|Service|Purpose|
|Amazon S3|Static file hosting|
|Amazon CloudFront|CDN and HTTPS delivery|
|CloudFront OAC|Preventing direct public access to S3|
|Amazon API Gateway|Exposing the contact API|
|AWS Lambda|Processing contact submissions for storage|
|Amazon DynamoDB|Storing contact data|
|Amazon CloudWatch Logs|Checking Lambda logs|
|AWS Budgets|Cost monitoring|
|IAM|Least-privilege management|



CI/CD

|   |   |
|---|---|
|Technology|Purpose|
|GitHub Actions|CI/CD|
|GitHub OIDC|Secure integration of AWS authentication|
|AWS CLI|S3 deployment and CloudFront Invalidation|



Architecture

MVP Architecture

User

  ↓ HTTPS

CloudFront

  ↓ OAC

S3 Static Site

User

  ↓ POST /contact

API Gateway HTTP API

  ↓

Lambda contact-submit-function

  ↓ PutItem

DynamoDB ContactsTable

  ↓

CloudWatch Logs



AWS Architecture Diagram

flowchart TD

    User[User]

    CF[Amazon CloudFront]

    S3[(Amazon S3)]

    APIGW[Amazon API Gateway]

    Lambda[AWS Lambda]

    DDB[(Amazon DynamoDB)]

    CW[Amazon CloudWatch Logs]

    Budget[AWS Budgets]

    GH[GitHub Actions]



    User -->|HTTPS| CF

    CF -->|OAC| S3



    User -->|POST /contact| APIGW

    APIGW --> Lambda

    Lambda -->|PutItem| DDB

    Lambda --> CW



    GH -->|Build & Deploy| S3

    GH -->|Invalidation| CF



    Budget -->|Cost Alert| User



Design Principles

1. Use S3 + CloudFront Instead of EC2

This product primarily consists of static content.

Therefore, it uses static delivery with S3 + CloudFront rather than an always-running EC2 server.

Reasons:

- Easier to keep fixed costs low
- No server management required
- A good fit for static sites
- Fast delivery through CloudFront
- Directly connected to AWS certification study topics



2. Use DynamoDB Instead of RDS

The only data stored in the MVP is contact form submissions.

Because complex relationships are unnecessary, DynamoDB is used instead of RDS.

Reasons:

- A good fit for a serverless architecture
- Suitable for storing a small volume of contact submissions
- Low administrative overhead
- Easy to access directly from Lambda
- Easier to keep fixed costs low than with RDS



3. Do Not Expose S3 Directly

The S3 bucket is not publicly exposed. CloudFront Origin Access Control allows access only through CloudFront.

Objectives:

- Prevent unintended public access to S3
- Consolidate HTTPS delivery in CloudFront
- Simplify cache control
- Make the security design explicit



4. Keep Dynamic APIs to a Minimum

In the MVP, AWS terms, practice questions, articles, and architecture diagrams are managed as static files.

Only the contact form uses an API.

Reasons:

- Enables SEO-friendly static pages
- Reduces API calls
- Keeps AWS usage costs low
- Keeps the development scope small
- Prioritizes getting the site published



5. Prioritize Low-Cost Operation

The MVP does not use the following services.

- EC2
- RDS
- NAT Gateway
- ALB
- ECS
- EKS
- OpenSearch
- SageMaker
- WAF

Reasons:

- Avoid fixed costs
- They are excessive for an individual MVP project
- Prioritize the AWS Free Tier and low-cost operation
- Reduce the risk of unexpected charges



Security Design

S3 / CloudFront

- Enable S3 Public Access Block
- Do not expose S3 directly
- Use CloudFront OAC
- Allow only the CloudFront Distribution through the Bucket Policy
- Redirect HTTP access to HTTPS



IAM

- Restrict the Lambda execution role to DynamoDB PutItem only
- Restrict the GitHub Actions role to S3 deployment and CloudFront Invalidation only
- Do not create access keys for the root user
- Configure MFA for administrative users
- Avoid routine use of AdministratorAccess



Lambda / API

- Validate input in Lambda
- Use a honeypot for basic spam prevention
- Restrict CORS to the production Origin
- Do not log full email addresses or full contact message bodies to CloudWatch Logs
- Do not connect Lambda to a VPC
- Set a short timeout



GitHub

- Do not commit .env
- Manage required information with GitHub Secrets
- OIDC is recommended for AWS authentication
- Grant GitHub Actions only the minimum required permissions



Cost Optimization

This project uses the following design to keep AWS usage costs low.

|   |   |
|---|---|
|Item|Policy|
|Web delivery|S3 + CloudFront|
|API|API Gateway HTTP API|
|Processing|Lambda|
|DB|DynamoDB|
|Cost monitoring|AWS Budgets|
|Logs|Set CloudWatch Logs retention to 14-30 days|
|Always-running servers|Not used|

Services to avoid in the MVP:

EC2

RDS

NAT Gateway

ALB

OpenSearch

SageMaker



CI/CD

Build frontend CI/CD using GitHub Actions.

CI

Run the following on Pull Requests.

- Lint
- TypeScript type checking
- Build

CD

When changes are merged into the main branch, run the following.

GitHub Actions

  ↓

Next.js build

  ↓

S3 sync

  ↓

CloudFront Invalidation

  ↓

Production update

AWS Authentication

The recommended configuration uses GitHub OIDC and aims to avoid storing long-lived AWS access keys in GitHub Secrets.

Allow only the following permissions for the GitHub Actions IAM Role.

- s3:ListBucket
- s3:PutObject
- s3:DeleteObject
- cloudfront:CreateInvalidation



Directory Structure

aws-cert-roadmap-lab/

├── frontend/

│   ├── app/

│   ├── components/

│   ├── contents/

│   │   ├── terms/

│   │   ├── questions/

│   │   ├── comparisons/

│   │   ├── architectures/

│   │   └── blog/

│   ├── lib/

│   └── public/

│

├── backend/

│   └── functions/

│       └── contact_submit/

│           ├── app.py

│           └── requirements.txt

│

├── infra/

│   └── sam-template.yaml

│

├── docs/

│   ├── designs/

│   ├── operations/

│   └── screenshots/

│

├── .github/

│   └── workflows/

│       ├── ci.yml

│       └── deploy-frontend.yml

│

├── .gitignore

└── README.md



Local Development

Prerequisites

- Node.js LTS
- npm or pnpm
- Python 3.11 or later
- AWS CLI optional

Setup

git clone https://github.com/<your-name>/aws-cert-roadmap-lab.git

cd aws-cert-roadmap-lab/frontend

npm install

Start the Development Server

npm run dev

Lint

npm run lint

Type Checking

npm run typecheck

Static Build

npm run build

Static output is generated in the following location.

frontend/out/



Environment Variables

Frontend

NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

NEXT_PUBLIC_SITE_URL=https://xxxxxxxx.cloudfront.net

Note: Environment variables prefixed with NEXT_PUBLIC_ are exposed to the browser.



Never include the following.

AWS_SECRET_ACCESS_KEY

AWS_ACCESS_KEY_ID

OPENAI_API_KEY

DATABASE_PASSWORD

JWT_SECRET



API Specification

POST /contact

Store the contact form contents. The request and response below are preserved Japanese-localized API examples.

Request

{

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "honeypot": ""

}

Response

{

  "success": true,

  "data": {

    "contactId": "contact-xxxxxxxx",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-xxxxxxxx"

}

Validation

|   |   |
|---|---|
|Field|Rule|
|name|Required, 1-100 characters|
|email|Required, email format, up to 255 characters|
|subject|Required, 1-150 characters|
|message|Required, 1-2,000 characters|
|sourcePage|Optional, up to 255 characters|
|honeypot|Empty string|



Data Design

ContactsTable

|   |   |   |
|---|---|---|
|Attribute|Type|Description|
|contactId|String|Contact ID|
|createdAt|String|Creation date and time|
|name|String|Name|
|email|String|Email address|
|subject|String|Subject|
|message|String|Message body|
|sourcePage|String|Submission source page|
|status|String|new / in_progress / closed|
|requestId|String|Request ID|
|userAgent|String|User-Agent|

The MVP does not include an API to retrieve a list of contact submissions or an administration screen.



Operational Monitoring

Rather than overengineering monitoring, the MVP focuses on the following.

- AWS Budgets
- CloudWatch Logs
- CloudWatch Metrics
- Cost Explorer
- GitHub Actions logs
- Manual availability checks

Items to check:

|   |   |
|---|---|
|Target|Checks|
|CloudFront|Site display, 4xx/5xx|
|S3|File existence, whether direct public access is disabled|
|API Gateway|4xx/5xx, request count|
|Lambda|Errors, Duration, Logs|
|DynamoDB|Contact submission storage, ItemCount|
|CloudWatch Logs|Whether personal information is being logged|
|AWS Budgets|Monthly costs, forecast overruns|
|GitHub Actions|CI/CD success or failure|



MVP Scope

What Will Be Implemented

- Home page
- Learning roadmap
- AWS glossary
- AWS term details
- CLF-C02 practice questions
- Practice question answering UI
- AWS service comparison articles
- AWS architecture diagram explanations
- Blog articles
- Contact form
- Contact API
- DynamoDB storage
- S3 + CloudFront publication
- CloudFront OAC
- AWS Budgets
- CloudWatch Logs
- GitHub Actions CI/CD
- README documentation



What Will Not Be Implemented in the MVP

- Login functionality
- Cognito
- Per-user learning history
- Saving accuracy rates
- Review questions
- Daily question email notifications
- SES
- WAF
- RDS
- EC2
- NAT Gateway
- ALB
- AI-generated explanations
- Payment functionality
- Paid membership functionality



Planned Future Extensions

Phase 4: Monetization Preparation

- Introduce a custom domain
- Register with Google Search Console
- Introduce Google Analytics
- Apply for Google AdSense
- At least 50 AWS terms
- At least 50 CLF-C02 questions
- Add SAA-C03 questions
- At least 10 comparison articles
- At least 10 architecture diagram explanations
- Strengthen internal links for SEO



Phase 5: Evolve into a Learning App

- Cognito login
- My page
- Save answer history
- Display accuracy rates
- Analyze weak categories
- Review questions
- Question of the day
- Scheduled processing with EventBridge
- Notifications with SES
- Consider paid learning materials and features



AWS Perspectives Emphasized in Study and Implementation

This project translates AWS certification study topics into implementation.

|   |   |
|---|---|
|AWS Study Topic|Implementation|
|Global infrastructure|Delivery through CloudFront|
|Storage|Static file storage with S3|
|Computing|Serverless processing with Lambda|
|Databases|Contact submission storage with DynamoDB|
|Networking|CloudFront / API Gateway|
|Security|IAM least privilege / OAC / CORS|
|Monitoring|CloudWatch Logs / Metrics|
|Cost management|AWS Budgets / Cost Explorer|
|Automation|GitHub Actions CI/CD|



Portfolio Highlights

1. Connecting AWS Certification Study with Implementation

I assembled the AWS services learned during certification study into a working web application.

Rather than just study notes, the result can be published on AWS.



2. Serverless Architecture

The contact API uses API Gateway + Lambda + DynamoDB without an always-running server.



3. Security Design

S3 is not directly exposed; CloudFront OAC is used instead.

IAM permissions are also minimized, granting Lambda only DynamoDB PutItem.



4. Cost Optimization

The design avoids EC2, RDS, NAT Gateway, and ALB, and prevents unexpected charges through AWS Budgets and CloudWatch Logs retention settings.



5. CI/CD

Implement Pull Request validation and automatic deployment from the main branch using GitHub Actions.



6. Design for Future Monetization

The plan is to expand SEO articles, the AWS glossary, practice questions, and architecture diagram explanations, with future support for AdSense and paid learning materials.



Development Roadmap

|   |   |   |
|---|---|---|
|Phase|Description|Status|
|Phase 0|Development preparation and design|Planned|
|Phase 1|Static site MVP|Planned|
|Phase 2|AWS publication and contact API|Planned|
|Phase 3|CI/CD and operational monitoring|Planned|
|Phase 4|Monetization preparation|Future|
|Phase 5|Evolve into a learning app|Future|



License

Not yet decided.

If published as a personal portfolio, consider either of the following.

- MIT License
- All Rights Reserved

Because the project includes learning content, the permitted scope of content reuse will be decided carefully.



Author

Name: Fumikun

Role: AWS / AI / Web Development Learner

Goal: Build a portfolio toward AI product development and PM roles



Related Documents

docs/designs/

├── project-plan.md

├── requirements.md

├── screen-list-and-flow.md

├── aws-architecture-design.md

├── data-design.md

├── api-design.md

├── security-design.md

├── cost-management-design.md

├── infrastructure-build-guide.md

├── lambda-implementation-design.md

├── cicd-design.md

├── operations-monitoring-design.md

└── development-tasks.md



Summary

AWS Cert Roadmap Lab is a portfolio for turning AWS certification study into implementation.

In the MVP, the static learning site is published with S3 + CloudFront, and only the contact form is implemented with API Gateway + Lambda + DynamoDB.

This provides hands-on practice with the following.

- AWS serverless architecture
- S3 + CloudFront + OAC
- API Gateway + Lambda + DynamoDB
- IAM least privilege
- CloudWatch Logs
- AWS Budgets
- GitHub Actions CI/CD
- Cost optimization
- Security design
- Future SEO and advertising monetization

The goal is to go beyond certification study and publish a product that actually runs on AWS.
