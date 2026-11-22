AWS Certification Learning Site Development Task List

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Learning Site Development Task List|
|Target product|AWS Certification Roadmap Lab|
|Purpose|Break the existing design documents down into implementable tasks|
|Target phases|Phase 0 through Phase 4|
|Priority implementation scope|MVP: Static learning site + contact API + AWS hosting + CI/CD|
|Created|2026-05-30|

  

2. Purpose of This Task List

This document lists the development tasks for implementing the AWS certification learning site, AWS Certification Roadmap Lab.

Based on the following existing design documents, it breaks tasks down into units that can actually be developed and provisioned.

- Project proposal
- Requirements definition
- Screen inventory and navigation design
- AWS architecture diagram design
- Data design
- API design
- Security design
- Cost management design
- Infrastructure setup procedure
- Lambda implementation design
- CI/CD design
- Operations and monitoring design

Avoiding overbuilding is a priority for the MVP.

The MVP is limited to the following.

Static pages for the AWS certification learning site

AWS glossary

CLF-C02 practice questions

AWS service comparison articles

AWS architecture diagram explanations

Blog articles

Contact form

API Gateway + Lambda + DynamoDB contact API

S3 + CloudFront + OAC hosting architecture

S3 deployment with GitHub Actions

AWS Budgets / CloudWatch Logs operations and monitoring

The MVP does not include the following.

Login functionality

Per-user learning history

Saved accuracy rates

Review functionality

Daily question notifications

Cognito

SES

WAF

RDS

EC2

NAT Gateway

ALB

AI-generated explanations

Paid membership features

  

3. Phase Definitions

3.1 Phase List

|   |   |   |   |
|---|---|---|---|
|Phase|Name|Purpose|Completion criteria|
|Phase 0|Development preparation|Set up the repository, technology architecture, and design documents|Ready to begin development|
|Phase 1|Static site MVP|Provide a minimally browsable learning site|Main pages display locally|
|Phase 2|AWS hosting and contact API|Host on AWS and enable contact submission storage|CloudFront hosting + successful POST /contact|
|Phase 3|CI/CD and operations monitoring|Set up automatic deployment and minimal operations monitoring|Automatic publication on main push|
|Phase 4|Monetization preparation|Prepare SEO articles and AdSense; consider a custom domain|Quality sufficient to apply for monetization|
|Phase 5|Learning application|Add login, learning history, and review features|Per-user learning management available|

3.2 MVP Scope

The MVP covers the following phases.

Phase 0

Phase 1

Phase 2

Phase 3

Proceed with Phase 4 onward after the MVP release.

  

4. Priority Definitions

|   |   |
|---|---|
|Priority|Meaning|
|Must|Required to complete the MVP|
|Should|Important for improving MVP quality|
|Could|Implement if time permits|
|Later|Implement from Phase 4 onward|

  

5. Estimation Units

5.1 Estimate Notation

|   |   |
|---|---|
|Notation|Guideline|
|XS|30 minutes–1 hour|
|S|1–2 hours|
|M|Half a day|
|L|1 day|
|XL|2 days or more|

5.2 Notes

Estimates are guidelines for individual development, including learning time.

Actual time may increase due to AWS configuration or Next.js troubleshooting.

  

Phase 0: Development Preparation

6. Phase 0 Purpose

Before starting development, prepare the repository, technology architecture, directories, basic settings, and design documentation.

  

7. Phase 0 Task List

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|Task|Priority|Estimate|Dependencies|Completion criteria|
|P0-001|Create GitHub repository|Must|XS|None|Repository exists on GitHub|
|P0-002|Create initial README|Must|S|P0-001|Project overview is documented|
|P0-003|Create directory structure|Must|S|P0-001|frontend / backend / docs / infra exist|
|P0-004|Create .gitignore|Must|XS|P0-001|.env / node_modules / .next / out are excluded|
|P0-005|Create design document directory|Should|XS|P0-003|docs/designs exists|
|P0-006|Finalize technology stack|Must|S|None|Next.js / TypeScript / AWS architecture finalized|
|P0-007|Check local Node.js environment|Must|XS|None|node / npm or pnpm is available|
|P0-008|Check AWS account|Must|XS|None|AWS Management Console login works|
|P0-009|Configure AWS root MFA|Must|S|P0-008|MFA configured for root user|
|P0-010|Configure initial AWS Budgets|Must|S|P0-008|Monthly Budget notifications configured|

  

8. Phase 0 Detailed Tasks

P0-001 Create GitHub Repository

Description

Create a GitHub repository for the project.

Recommended repository name

aws-cert-roadmap-lab

Completion criteria

- The repository exists on GitHub.
- It can be cloned locally.
- The main branch exists.

  

P0-003 Create Directory Structure

Recommended structure

aws-cert-roadmap-lab/

├── frontend/

├── backend/

├── infra/

├── docs/

│   ├── designs/

│   ├── operations/

│   └── screenshots/

├── .github/

│   └── workflows/

├── .gitignore

└── README.md

Completion criteria

- The directories above have been created.
- Empty directories contain .gitkeep.

  

P0-004 Create .gitignore

Description

Exclude secrets, build artifacts, and dependencies from Git tracking.

Example configuration

.env

.env.local

.env.production

.env.development

node_modules/

.next/

out/

dist/

__pycache__/

*.pyc

*.zip

*.pem

*.key

.DS_Store

aws-credentials.json

Completion criteria

- .env is excluded from Git tracking.
- node_modules is excluded from Git tracking.
- out is excluded from Git tracking.

  

Phase 1: Static Site MVP

9. Phase 1 Purpose

Build a static site that is minimally usable as an AWS certification learning site in the local environment.

AWS hosting is not mandatory at this stage.

  

10. Phase 1 Task List

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|Task|Priority|Estimate|Dependencies|Completion criteria|
|P1-001|Create Next.js project|Must|M|P0|frontend starts|
|P1-002|Configure TypeScript / ESLint|Must|S|P1-001|lint / typecheck work|
|P1-003|Configure Tailwind CSS|Should|S|P1-001|Styles are applied|
|P1-004|Configure static export|Must|S|P1-001|out/ is generated|
|P1-005|Create shared layout|Must|M|P1-001|Header / Footer / Main exist|
|P1-006|Create home page|Must|M|P1-005|/ displays|
|P1-007|Create learning roadmap page|Must|M|P1-005|/roadmap displays|
|P1-008|Create AWS glossary listing page|Must|L|P1-010|/terms displays|
|P1-009|Create AWS term detail page|Must|L|P1-010|/terms/{termId} displays|
|P1-010|Create AWS terms JSON|Must|L|None|At least 30 terms exist|
|P1-011|Create practice question listing page|Must|L|P1-013|/questions displays|
|P1-012|Create practice question detail and answer UI|Must|XL|P1-013|Choices, correctness, and explanations display|
|P1-013|Create CLF-C02 practice questions JSON|Must|XL|None|At least 30 questions exist|
|P1-014|Create service comparison listing page|Should|M|P1-015|/comparisons displays|
|P1-015|Create service comparison MDX|Should|L|None|At least 5 comparison articles exist|
|P1-016|Create architecture diagram listing page|Should|M|P1-017|/architectures displays|
|P1-017|Create architecture explanation MDX|Should|L|None|At least 5 architecture diagram articles exist|
|P1-018|Create blog listing page|Should|M|P1-019|/blog displays|
|P1-019|Create blog article MDX|Should|L|None|At least 5 articles exist|
|P1-020|Create contact page UI|Must|M|P1-005|/contact displays|
|P1-021|Create operator information page|Must|S|P1-005|/about displays|
|P1-022|Create privacy policy|Must|S|P1-005|/privacy displays|
|P1-023|Create disclaimer page|Must|S|P1-005|/disclaimer displays|
|P1-024|Create 404 page|Should|S|P1-005|404 page displays|
|P1-025|Configure SEO metadata|Should|M|Each page|title / description configured|
|P1-026|Configure sitemap generation|Should|M|Each page|sitemap.xml is generated|
|P1-027|Create robots.txt|Should|XS|None|robots.txt exists|
|P1-028|Implement responsive layout|Must|M|Each page|Layout remains intact on mobile|
|P1-029|Verify local display|Must|M|All P1 tasks|Main pages display|
|P1-030|Verify static build|Must|S|All P1 tasks|npm run build succeeds|

  

11. Phase 1 Key Task Details

P1-001 Create Next.js Project

Description

Create a Next.js project under frontend.

Recommendations

Next.js

TypeScript

App Router

Tailwind CSS

Static Export

Completion criteria

- npm run dev succeeds in frontend.
- The home page displays in the browser.

  

P1-004 Configure Static Export

Description

Configure Next.js static output for delivery through S3 + CloudFront.

Example configuration

const nextConfig = {

  output: 'export',

  images: {

    unoptimized: true,

  },

};

  

export default nextConfig;

Completion criteria

- npm run build generates out/.
- out/index.html exists.

  

P1-010 Create AWS Terms JSON

Description

Create AWS terminology data for AWS Cloud Practitioner / SAA study.

Initial content targets

At least 30 terms.

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

Completion criteria

- frontend/contents/terms/terms.json exists.
- At least 30 terms exist.
- termId values are unique.
- Terms display on listing and detail pages.

  

P1-013 Create CLF-C02 Practice Questions JSON

Description

Create AWS Cloud Practitioner practice questions in JSON.

Initial question count

30 questions

Proposed category distribution

|   |   |
|---|---|
|Category|Question count|
|Cloud Concepts|8|
|Security and Compliance|8|
|Cloud Technology and Services|9|
|Billing, Pricing, and Support|5|

Completion criteria

- frontend/contents/questions/clf-c02.json exists.
- At least 30 questions exist.
- Each question has four choices.
- Answers and explanations are provided.
- Questions can be answered on the practice question screen.

  

P1-020 Create Contact Page UI

Description

Create the contact form UI.

Fields

|   |   |
|---|---|
|Field|Required|
|Name|Required|
|Email address|Required|
|Subject|Required|
|Message|Required|
|honeypot|hidden|

MVP stage

An API connection is not yet required at this stage.

Completion criteria

- /contact displays.
- An input form exists.
- Frontend validation exists.
- A submit button exists.
- A honeypot field exists.

  

Phase 2: AWS Hosting and Contact API

12. Phase 2 Purpose

Host the site on AWS and enable contact form submissions to be saved in DynamoDB.

  

13. Phase 2 Task List

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|Task|Priority|Estimate|Dependencies|Completion criteria|
|P2-001|Create S3 bucket|Must|S|P0-010|Bucket created|
|P2-002|Check S3 Public Access Block|Must|XS|P2-001|All blocks ON|
|P2-003|Upload frontend build artifacts to S3|Must|S|P1-030, P2-001|index.html exists in S3|
|P2-004|Create CloudFront Distribution|Must|M|P2-001|Distribution created|
|P2-005|Configure CloudFront OAC|Must|M|P2-004|OAC configured|
|P2-006|Configure S3 Bucket Policy|Must|S|P2-005|Only CloudFront allowed|
|P2-007|Check CloudFront display|Must|M|P2-006|Site displays at CloudFront URL|
|P2-008|Verify direct S3 access rejection|Must|S|P2-006|Access Denied returned|
|P2-009|Configure CloudFront error pages|Should|S|P2-004|404 displays correctly|
|P2-010|Create DynamoDB ContactsTable|Must|S|P0-010|ContactsTableProd created|
|P2-011|Create Lambda execution role|Must|M|P2-010|PutItem permission only|
|P2-012|Create contact-submit Lambda|Must|M|P2-011|Lambda created|
|P2-013|Configure Lambda environment variables|Must|XS|P2-012|CONTACTS_TABLE_NAME and other variables configured|
|P2-014|Implement Lambda code|Must|L|P2-012|POST processing implemented|
|P2-015|Unit-test Lambda|Must|M|P2-014|Success and failure scenario tests pass|
|P2-016|Create API Gateway HTTP API|Must|M|P2-014|API created|
|P2-017|Create POST /contact Route|Must|S|P2-016|Route created|
|P2-018|Integrate API Gateway with Lambda|Must|S|P2-017|Lambda invocation succeeds|
|P2-019|Configure CORS|Must|S|P2-018|CloudFront Origin allowed|
|P2-020|Check contact API with curl|Must|M|P2-019|201 response|
|P2-021|Verify DynamoDB storage|Must|S|P2-020|Item storage verified|
|P2-022|Check CloudWatch Logs|Must|S|P2-020|Log output verified|
|P2-023|Set CloudWatch Logs retention|Must|XS|P2-022|14–30 days configured|
|P2-024|Connect frontend contact form to API|Must|M|P2-020|Submission available from the screen|
|P2-025|Verify contact submission through CloudFront|Must|M|P2-024|Storage succeeds from production URL|
|P2-026|Test API failure scenarios|Must|M|P2-024|400/405 and similar responses returned|
|P2-027|Verify honeypot behavior|Should|S|P2-024|Spam is not saved|
|P2-028|Review billing|Must|S|All P2 tasks|No unexpected charges|

  

14. Phase 2 Key Task Details

P2-001 Create S3 Bucket

Description

Create an S3 bucket for static site files.

Completion criteria

- The S3 bucket exists.
- Region is ap-northeast-1.
- Public Access Block is enabled.
- Static website hosting is not used.

  

P2-004 Create CloudFront Distribution

Description

Create a CloudFront Distribution with S3 as its Origin.

Completion criteria

- The Distribution is created.
- Default root object is index.html.
- Viewer protocol policy is Redirect HTTP to HTTPS.
- The configuration is designed to use OAC.

  

P2-014 Implement Lambda Code

Description

Implement the POST /contact Lambda in Python.

Required processing

Parse JSON

Check honeypot

Validate input

Generate contactId

Generate createdAt

DynamoDB PutItem

Return success response

Return error response

Output CloudWatch Logs

Completion criteria

- Valid data can be saved in DynamoDB.
- Invalid JSON returns 400.
- Input validation errors return 400.
- Data is not saved when the honeypot is filled.
- Full email and message values are not logged.

  

P2-024 Connect Frontend Contact Form to API

Description

Call API Gateway POST /contact from the contact form.

Completion criteria

- Form input is POSTed to the API.
- The button is disabled during submission.
- A completion message displays on success.
- Field-specific errors display on failure.
- Submission succeeds from CloudFront.

  

Phase 3: CI/CD and Operations Monitoring

15. Phase 3 Purpose

Move away from manual deployment and enable automatic frontend deployment with GitHub Actions.

Also establish minimal operations monitoring.

  

16. Phase 3 Task List

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|Task|Priority|Estimate|Dependencies|Completion criteria|
|P3-001|Create GitHub Actions CI|Must|M|P1|CI runs on PRs|
|P3-002|Prepare lint script|Must|S|P3-001|lint passes|
|P3-003|Prepare typecheck script|Must|S|P3-001|typecheck passes|
|P3-004|Prepare build script|Must|S|P3-001|build passes|
|P3-005|Create IAM Role for GitHub Actions|Must|M|P2|Role created|
|P3-006|Configure GitHub OIDC Provider|Should|M|P3-005|AssumeRole possible through OIDC|
|P3-007|Create IAM Policy for GitHub Actions|Must|M|P3-005|Least-privilege S3/CloudFront access|
|P3-008|Configure GitHub Secrets / Variables|Must|S|P3-005|Required values configured|
|P3-009|Create deploy-frontend workflow|Must|L|P3-008|Deployment on main push|
|P3-010|Verify S3 sync|Must|M|P3-009|Changes reflected in S3|
|P3-011|Verify CloudFront Invalidation|Must|M|P3-009|Latest content display verified|
|P3-012|Check GitHub Actions logs|Must|S|P3-009|Success logs verified|
|P3-013|Create deployment failure runbook|Should|S|P3-009|Documented in docs|
|P3-014|Check CloudWatch Logs retention|Must|XS|P2-023|Not set to Never expire|
|P3-015|Check Lambda Metrics|Must|S|P2-012|Errors/Duration can be reviewed|
|P3-016|Check API Gateway Metrics|Must|S|P2-016|4xx/5xx can be reviewed|
|P3-017|Check DynamoDB Metrics|Should|S|P2-010|Writes and ItemCount can be reviewed|
|P3-018|Review Cost Explorer|Must|S|P2|Costs by service reviewed|
|P3-019|Create operations runbook|Should|M|Operations and monitoring design|Incident investigation order documented|
|P3-020|Add AWS architecture and CI/CD to README|Must|M|P3|README updated|

  

17. Phase 3 Key Task Details

P3-001 Create GitHub Actions CI

Description

Run lint, typecheck, and build on Pull Requests.

Completion criteria

- .github/workflows/ci.yml exists.
- The workflow starts when a PR is created.
- lint / typecheck / build succeed.

  

P3-009 Create deploy-frontend Workflow

Description

Automatically deploy to S3 + CloudFront when the main branch is updated.

Completion criteria

- .github/workflows/deploy-frontend.yml exists.
- The workflow starts on main push.
- npm run build succeeds.
- aws s3 sync ./out s3://... --delete succeeds.
- cloudfront create-invalidation succeeds.

  

P3-020 Add AWS Architecture and CI/CD to README

Description

Add portfolio explanation information to the GitHub README.

Items to include

Product overview

Technology stack

AWS architecture

Screen inventory

Main features

CI/CD

Security design

Cost optimization

Planned future extensions

Completion criteria

- The README explains what was built.
- The AWS architecture is explained.
- CI/CD is explained.
- Cost optimization is explained.

  

Phase 4: Monetization Preparation

18. Phase 4 Purpose

Improve content quality and site credibility in preparation for AdSense and SEO traffic.

Carry out this phase after the MVP release.

  

19. Phase 4 Task List

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|Task|Priority|Estimate|Dependencies|Completion criteria|
|P4-001|Consider acquiring a custom domain|Should|S|MVP release|Adoption decision made|
|P4-002|Create Route 53 Hosted Zone|Could|M|P4-001|DNS management started|
|P4-003|Create ACM certificate|Could|M|P4-002|Issued in us-east-1|
|P4-004|Configure CloudFront custom domain|Could|M|P4-003|Site displays on custom domain|
|P4-005|Register with Google Search Console|Should|S|P4-004 optional|Ownership verified|
|P4-006|Submit sitemap.xml|Should|S|P4-005|Sitemap submitted|
|P4-007|Introduce Google Analytics|Should|M|P4-005|Measurement started|
|P4-008|Update privacy policy|Must|S|P4-007|Analytics/AdSense documented|
|P4-009|Create 20 blog articles|Should|XL|P1-019|At least 20 published|
|P4-010|Expand AWS glossary to 50 terms|Should|L|P1-010|At least 50 terms|
|P4-011|Expand CLF questions to 50|Should|XL|P1-013|At least 50 questions|
|P4-012|Create 30 SAA questions|Could|XL|P1-013|SAA questions exist|
|P4-013|Expand service comparisons to 10|Should|XL|P1-015|At least 10 articles|
|P4-014|Expand architecture diagrams to 10|Should|XL|P1-017|At least 10 articles|
|P4-015|Prepare AdSense application|Could|M|P4-008, P4-009|Application preparation complete|
|P4-016|Install AdSense review code|Could|S|P4-015|Code installed|
|P4-017|Add note / X links|Should|S|MVP release|External navigation links exist|
|P4-018|Prepare OGP images|Should|M|Each article|Main pages have OGP images|
|P4-019|Improve internal SEO links|Should|M|Content|Related links exist|
|P4-020|Check Search Console errors|Should|S|P4-005|Errors reviewed|

  

Phase 5: Learning Application

20. Phase 5 Purpose

Expand the static learning site into a learning application that manages each user's learning history, accuracy rate, and review questions.

  

21. Phase 5 Task List

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|ID|Task|Priority|Estimate|Dependencies|Completion criteria|
|P5-001|Design Cognito adoption|Later|L|MVP|Authentication policy finalized|
|P5-002|Create Cognito User Pool|Later|M|P5-001|User Pool created|
|P5-003|Create login screen|Later|L|P5-002|Login available|
|P5-004|Create registration screen|Later|L|P5-002|Registration available|
|P5-005|Manage authentication state|Later|L|P5-002|Login state can be determined|
|P5-006|Create UserProfileTable|Later|M|P5-002|Profiles can be saved|
|P5-007|Create UserAnswersTable|Later|M|P5-002|Answer history can be saved|
|P5-008|Create UserProgressTable|Later|M|P5-002|Progress can be saved|
|P5-009|Implement POST /answers API|Later|XL|P5-007|Answer history can be saved|
|P5-010|Implement GET /progress API|Later|L|P5-008|Progress can be retrieved|
|P5-011|Create user dashboard|Later|XL|P5-010|Accuracy rate can be displayed|
|P5-012|Create review question feature|Later|XL|P5-009|Incorrectly answered questions can be reviewed|
|P5-013|Analyze weak categories|Later|L|P5-010|Weak areas displayed|
|P5-014|Design daily question feature|Later|M|P5|Policy finalized|
|P5-015|Configure EventBridge|Later|M|P5-014|Scheduled execution available|
|P5-016|Consider SES notifications|Later|L|P5-014|Email notification policy finalized|
|P5-017|Configure notification opt-out|Later|M|P5-016|Users can disable notifications|
|P5-018|Monitor authenticated APIs|Later|M|P5|4xx/5xx monitoring available|
|P5-019|Create account closure and data deletion policy|Later|M|P5|Policy documented|
|P5-020|Consider paid features|Later|XL|After user growth|Policy finalized|

  

Cross-Cutting Tasks

22. Testing Tasks

|   |   |   |   |   |
|---|---|---|---|---|
|ID|Task|Priority|Estimate|Target|
|T-001|Test main frontend screen display|Must|M|Phase 1|
|T-002|Check mobile display|Must|M|Phase 1|
|T-003|Test practice question answers|Must|M|Phase 1|
|T-004|Test contact form success scenarios|Must|M|Phase 2|
|T-005|Test contact form failure scenarios|Must|M|Phase 2|
|T-006|Test honeypot|Should|S|Phase 2|
|T-007|Test API Gateway CORS|Must|S|Phase 2|
|T-008|Test Lambda log output|Must|S|Phase 2|
|T-009|Test DynamoDB storage|Must|S|Phase 2|
|T-010|Test GitHub Actions deployment|Must|M|Phase 3|
|T-011|Test rejection of direct S3 access|Must|S|Phase 2|
|T-012|Test CloudFront display|Must|S|Phase 2|

  

23. Security Tasks

|   |   |   |   |   |
|---|---|---|---|---|
|ID|Task|Priority|Estimate|Completion criteria|
|SEC-001|Check root MFA|Must|XS|MFA enabled|
|SEC-002|Verify no root access key|Must|XS|No root key|
|SEC-003|Check S3 Public Access Block|Must|XS|All blocks ON|
|SEC-004|Check CloudFront OAC|Must|S|OAC configured|
|SEC-005|Check Bucket Policy|Must|S|Only CloudFront allowed|
|SEC-006|Verify Lambda IAM least privilege|Must|S|PutItem only|
|SEC-007|Check GitHub Secrets|Must|S|Only secret information stored|
|SEC-008|Verify .env is not committed|Must|XS|Excluded from Git tracking|
|SEC-009|Check CloudWatch Logs for personal information|Must|S|No full email/message values|
|SEC-010|Restrict CORS to production Origins|Must|S|CloudFront/custom domain only|
|SEC-011|Migrate to GitHub OIDC|Should|M|Long-term keys unnecessary|
|SEC-012|Remove unnecessary IAM permissions|Should|S|No AdministratorAccess|

  

24. Cost Tasks

|   |   |   |   |   |
|---|---|---|---|---|
|ID|Task|Priority|Estimate|Completion criteria|
|COST-001|Create AWS Budgets|Must|S|Budget notifications configured|
|COST-002|Review Cost Explorer|Must|S|Costs by service reviewed|
|COST-003|Verify EC2 is unused|Must|XS|No EC2|
|COST-004|Verify RDS is unused|Must|XS|No RDS|
|COST-005|Verify NAT Gateway is unused|Must|XS|No NAT|
|COST-006|Verify ALB is unused|Must|XS|No ALB|
|COST-007|Set CloudWatch Logs retention|Must|XS|14–30 days|
|COST-008|Check for large S3 files|Should|S|No videos or oversized images|
|COST-009|Check CloudFront transfer volume|Should|S|No sudden increase|
|COST-010|Delete unnecessary resources|Must|M|No unnecessary resources|

  

25. Documentation Tasks

|   |   |   |   |   |
|---|---|---|---|---|
|ID|Task|Priority|Estimate|Completion criteria|
|DOC-001|Create README draft|Must|M|Overview is clear|
|DOC-002|Add AWS architecture explanation|Must|M|Architecture explained|
|DOC-003|Add security explanation|Should|S|Least privilege, OAC, etc. explained|
|DOC-004|Add cost optimization explanation|Should|S|Reasons for not using EC2/RDS explained|
|DOC-005|Add CI/CD explanation|Should|S|GitHub Actions explained|
|DOC-006|Add screen screenshots|Should|M|README contains images|
|DOC-007|Create operations runbook|Should|M|Incident-response procedures exist|
|DOC-008|Create portfolio explanation|Must|M|Interview explanation available|
|DOC-009|Document planned extensions|Should|S|Phase 4/5 documented|
|DOC-010|Create learning log article|Could|L|Article for note/X available|

  

MVP Release Decision

26. Mandatory MVP Release Conditions

The MVP is releasable when the following conditions are met.

|   |   |   |
|---|---|---|
|ID|Condition|Requirement|
|MVP-001|Home page displays|Required|
|MVP-002|AWS glossary displays|Required|
|MVP-003|AWS term details display|Required|
|MVP-004|At least 30 CLF practice questions exist|Required|
|MVP-005|Practice questions can be answered|Required|
|MVP-006|At least 5 service comparison articles exist|Recommended|
|MVP-007|At least 5 architecture diagram explanations exist|Recommended|
|MVP-008|At least 5 blog articles exist|Recommended|
|MVP-009|Contact page exists|Required|
|MVP-010|Contact API works|Required|
|MVP-011|Contact submissions are saved in DynamoDB|Required|
|MVP-012|Site is published through CloudFront|Required|
|MVP-013|Direct S3 access is rejected|Required|
|MVP-014|AWS Budgets is configured|Required|
|MVP-015|CloudWatch Logs retention is configured|Required|
|MVP-016|Automatic deployment with GitHub Actions works|Recommended|
|MVP-017|README is maintained|Required|
|MVP-018|No .env or AWS keys on GitHub|Required|
|MVP-019|EC2/RDS/NAT Gateway/ALB are not used|Required|
|MVP-020|No major layout breakage on mobile|Required|

  

27. Items That Can Be Deferred Beyond the MVP

The following are not needed at the MVP stage.

|   |   |
|---|---|
|Item|Reason|
|Custom domain|The site can be published at the CloudFront URL|
|AdSense|There may be insufficient content|
|Google Analytics|Can be added after MVP release|
|Search Console|Can be added after MVP release|
|Cognito|Login is unnecessary|
|Learning history|Static questions are sufficient for the MVP|
|100 SAA questions|Can be expanded before the August exam|
|WAF|Excessive for initial traffic|
|reCAPTCHA|Observe results with honeypot first|
|Automatic SAM deployment|Can wait until Phase 2 onward|

  

Recommended Implementation Order

28. Shortest Route

The shortest route to a presentable portfolio is as follows.

1. Create GitHub repository.

2. Create Next.js static site.

3. Create home / glossary / questions / contact pages.

4. Create 30 AWS terms.

5. Create 30 CLF questions.

6. Publish with S3 + CloudFront.

7. Create contact API with DynamoDB + Lambda + API Gateway.

8. Connect the frontend contact form.

9. Automate deployment with GitHub Actions.

10. Prepare README.

11. Share the development process on note / X.

12. Order for Maximum Learning Value

To combine AWS certification study with portfolio value, use the following order.

1. AWS Budgets

2. S3

3. CloudFront

4. OAC / Bucket Policy

5. IAM least privilege

6. DynamoDB

7. Lambda

8. API Gateway

9. CloudWatch Logs

10. GitHub Actions

11. OIDC

12. Cost Explorer

This order also directly aligns with the Cloud Practitioner and SAA study scope.

  

30. Proposed Two-Week MVP Schedule

Week 1: Build the Local MVP

|   |   |
|---|---|
|Day|Tasks|
|Day 1|Create GitHub repository, initialize Next.js, organize directories|
|Day 2|Create layout, home, roadmap, and operator information pages|
|Day 3|Create JSON for 30 AWS terms and term listing/detail pages|
|Day 4|Create JSON for 30 CLF questions and question listing/answer UI|
|Day 5|Create contact page, privacy policy, and disclaimer|
|Day 6|Add minimal comparison articles, architecture diagrams, and blog articles|
|Day 7|Check responsive layout, SEO metadata, and build|

Week 2: AWS Hosting, API, and CI/CD

|   |   |
|---|---|
|Day|Tasks|
|Day 8|Configure AWS Budgets, S3, CloudFront, and OAC|
|Day 9|Upload to S3, check CloudFront display, verify direct S3 access rejection|
|Day 10|Create DynamoDB, Lambda Role, and Lambda|
|Day 11|Configure API Gateway and CORS, test with curl, verify DynamoDB storage|
|Day 12|Connect frontend contact form and test through CloudFront|
|Day 13|Configure GitHub Actions CI/CD and verify deployment on main push|
|Day 14|Prepare README, add screenshots, perform final checks, write an article to share|

  

31. Risk List

|   |   |   |
|---|---|---|
|Risk|Impact|Mitigation|
|Difficulties with Next.js static export|Delayed S3 publication|Focus on static pages without dynamic features|
|Difficulties with AWS configuration|Delayed publication|Build manually first, migrate to IaC later|
|CORS difficulties|Contact submissions fail|Check headers in both API Gateway and Lambda|
|OAC/Bucket Policy difficulties|CloudFront cannot display site|Check SourceArn and Distribution ID|
|GitHub Actions OIDC difficulties|Automatic deployment unavailable|Allow access keys initially, migrate to OIDC later|
|Time-consuming content creation|MVP delay|Initially limit content to 30 terms, 30 questions, and 5 articles|
|Billing incident|Financial burden|Budgets and verification that EC2/RDS/NAT Gateway are unused|
|Scope expansion|Failure to complete|Do not build login or learning history in the MVP|

  

32. Portfolio Highlights After Completion

After completing the MVP, highlight the following.

32.1 AWS Design Skills

Secure static site delivery with S3 + CloudFront + OAC.

Contact API implemented with API Gateway + Lambda + DynamoDB.

Consideration of IAM least privilege, CloudWatch Logs, and AWS Budgets.

32.2 Cost Optimization

Reduce cost through static delivery and serverless architecture without EC2, RDS, NAT Gateway, or ALB.

Prevent billing incidents with AWS Budgets and CloudWatch Logs retention settings.

32.3 Security

Deliver through CloudFront OAC without exposing S3 directly.

Restrict the Lambda IAM Role to DynamoDB PutItem only.

Do not log contact message bodies or full email addresses.

32.4 CI/CD

Run lint/typecheck/build in GitHub Actions and automatically deploy to S3 + CloudFront on main push.

Aim for an OIDC-based architecture that does not use long-term AWS access keys.

32.5 Alignment with Learning and Sharing

By turning AWS certification study itself into a product, the project can be presented as a portfolio that applies Cloud Practitioner/SAA knowledge in implementation.

  

33. Related Documents to Create Next

Create the following after this task list.

1. GitHub README draft
2. Detailed MVP implementation schedule
3. Initial content creation templates
4. Test design
5. Release procedure
6. Explanatory materials for portfolio submission
7. Development story draft for a note article

  

8. Conclusion

Do not build a large learning application from the outset in this product's MVP development.

First, complete the following.

AWS certification learning site

AWS glossary

CLF-C02 practice questions

AWS service comparisons

AWS architecture diagram explanations

Contact form

AWS hosting

Serverless contact API

CI/CD

Minimal operations monitoring

README preparation

These alone are sufficient to turn AWS Cloud Practitioner and SAA study content into a portfolio.

The following points are especially likely to be valued.

- S3 + CloudFront + OAC
- API Gateway + Lambda + DynamoDB
- IAM least privilege
- AWS Budgets
- CloudWatch Logs
- GitHub Actions CI/CD
- Cost optimization
- Security design
- Content design with SEO and advertising monetization in mind

Aim to develop the MVP in two weeks.

After the MVP release, incrementally expand with a custom domain, AdSense, additional SAA questions, and Cognito-based learning history features.
