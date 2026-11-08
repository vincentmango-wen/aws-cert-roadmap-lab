# AWS Certification Learning Site: Project Proposal

## 1. Project Name

**AWS Cert Roadmap Lab**

Develop a web-based learning site for beginners studying AWS Cloud Practitioner / AWS Solutions Architect Associate, covering AWS service fundamentals, exam preparation, architecture diagrams, terminology comparisons, and practical serverless architectures.

---

## 2. Project Objectives

This project has three objectives.

1. **Turn AWS certification study into tangible output**
   - Organize AWS Cloud Practitioner study material into a glossary, practice questions, and comparison tables.
   - Subsequently, add content on design patterns, architecture diagrams, availability, fault tolerance, and cost optimization alongside Solutions Architect Associate study.

2. **Create a portfolio demonstrating AWS implementation experience**
   - Build a serverless web application using S3, CloudFront, Lambda, API Gateway, DynamoDB, Cognito, CloudWatch, IAM, and other services.
   - Go beyond a simple static site to create a project whose AWS design rationale, cost optimization, and security design can be explained.

3. **Develop a content site that can lead to advertising revenue and learning-material sales**
   - Continually add introductory AWS articles, certification-preparation articles, practice questions, and architecture explanations to attract search traffic.
   - Eventually connect this to Google AdSense, paid note articles, PDF learning materials, and practice-question collections for sale.

---

## 3. Background

I am currently studying for AWS Cloud Practitioner and plan to take the exam at the end of June. After that, I plan to take AWS Solutions Architect Associate around August.

Rather than ending certification study at knowledge acquisition, turn it into practice as follows.

- Write articles about the AWS services learned
- Tabulate comparison points that appear on exams
- Illustrate architecture patterns tested in SAA
- Publish an actual serverless application on AWS
- Explain the design rationale in the GitHub README and portfolio site

This creates evidence of experience designing, implementing, and publishing with AWS while earning certifications.

---

## 4. Problems to Solve

### 4.1 Learner Problems

AWS beginners face the following problems.

- There are many AWS services, and their differences are hard to understand
- Comparisons such as S3 / EBS / EFS, RDS / DynamoDB, and CloudFront / Global Accelerator are difficult
- It is difficult to distinguish exam-focused points from practical usage considerations
- Even after solving practice questions, understanding why a choice is correct can be difficult
- Architecture diagrams do not always make each service's role clear

### 4.2 My Own Problems

As the developer, I face the following problems.

- I want to demonstrate AWS certification study as practical skills
- I need an AWS portfolio project I can explain in interviews
- I want to keep costs as close to zero as possible
- I want to build a web asset that can generate advertising revenue in the future
- As an aspiring AI product PM, I want to demonstrate an understanding of cloud infrastructure

---

## 5. Product Concept

**“A learning site that turns AWS certification study into practical understanding through diagrams, comparisons, and practice questions.”**

Rather than a simple memorization site, it will have the following characteristics.

- Explain topics in an approachable way for beginners
- Emphasize service comparisons
- Cover both exam preparation and practical design
- Use many AWS architecture diagrams
- Be built as a serverless application actually running on AWS
- Serve as a portfolio project itself

---

## 6. Intended Users

### 6.1 Primary Audience

- Beginners studying for AWS Cloud Practitioner
- People preparing to take AWS Solutions Architect Associate
- People aiming to become cloud engineers or web engineers without prior experience
- People who want to clarify differences between AWS services

### 6.2 Secondary Audience

- People building a portfolio to transition into an engineering career
- People who want to build web applications within the AWS Free Tier
- People who want to learn serverless architectures
- Beginners who want to use AWS for AI application development

---

## 7. Value Proposition

### 7.1 Value for Users

- Understand differences between AWS services
- Understand points tested on certification exams
- Check understanding with practice questions
- Visualize AWS design through architecture diagrams
- Understand billing risks that commonly trip up beginners

### 7.2 Value for the Developer

- Produce tangible output from AWS certification study
- Present the project in a portfolio
- Explain AWS design skills
- Build a collection of SEO articles
- Establish a foundation for advertising revenue
- Demonstrate cloud understanding as an aspiring AI product PM

---

## 8. Main Features

## 8.1 MVP Features

Limit the initial release to the following features.

### 1. AWS Glossary

Organize the following for each AWS service.

- Service name
- Category
- What it is used for
- Points tested on exams
- Differences from similar services
- A one-sentence explanation for beginners

Example services:

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
- API Gateway
- SQS
- SNS
- EventBridge

### 2. Service Comparison Pages

Compare services that are easily confused on exams.

Examples:

- Differences between S3 / EBS / EFS
- Differences between RDS / DynamoDB
- Differences between SNS / SQS / EventBridge
- Differences between ALB / NLB / CloudFront
- Differences between IAM users / IAM roles / IAM policies
- Differences between CloudWatch / CloudTrail / AWS Config

### 3. Practice Question Pages

Publish questions for Cloud Practitioner.

Start with approximately 30 questions.

Question data fields:

- Question text
- Choices
- Correct answer
- Explanation
- Related services
- Difficulty
- Exam domain

### 4. SAA Architecture Diagram Pages

Illustrate basic architectures for SAA preparation.

Initial architecture examples:

- Static website architecture
- Serverless API architecture
- Three-tier web application architecture
- Highly available web application architecture
- Batch-processing architecture

### 5. Blog Article Pages

Publish articles aimed at attracting SEO traffic.

Initial article examples:

- What is AWS Cloud Practitioner?
- How to build a portfolio within the AWS Free Tier
- How to publish a static site with S3 and CloudFront
- What is Lambda? An explanation for beginners
- AWS architecture patterns frequently seen in SAA

### 6. Contact Form

Add a contact form to demonstrate practical portfolio functionality.

Input fields:

- Name
- Email address
- Subject
- Message

After submission, use Lambda to send an email notification or save the data in DynamoDB.

---

## 8.2 Future Extensions

### 1. Login Functionality

Implement user registration and login with Cognito.

### 2. Saved Learning History

Store the following in DynamoDB.

- Questions answered
- Accuracy rate
- Incorrectly answered questions
- Items to review

### 3. Weakness Analysis

Calculate accuracy rates by question category.

Examples:

- Security: 70%
- Networking: 45%
- Storage: 80%
- Cost optimization: 60%

### 4. Daily Question Delivery

Use EventBridge and Lambda to deliver one question per day by email or Slack.

### 5. AI Explanation Feature

In the future, add a feature that generates supplementary AI explanations for questions the user answered incorrectly.

However, do not implement AI features initially, to avoid API costs.

---

## 9. AWS Architecture Policy

## 9.1 Basic Policy

- Keep costs as close to zero as possible
- Do not use always-on servers
- Build primarily with serverless services
- Use the Free Tier
- Implement with key services covered in AWS certification study
- Choose an architecture that is easy to explain in interviews

---

## 9.2 MVP Architecture

```text
User
  ↓
CloudFront
  ↓
S3 static website
  ↓
API Gateway
  ↓
Lambda
  ↓
DynamoDB
```

### Services Used

| Service | Purpose | Learning benefit |
|---|---|---|
| S3 | Store static files | Understand object storage |
| CloudFront | CDN delivery | Understand caching and fast delivery |
| Lambda | API processing | Understand serverless computing |
| API Gateway | Expose an HTTP API | Understand API design |
| DynamoDB | Store question and terminology data | Understand NoSQL |
| CloudWatch | Log monitoring | Understand operational monitoring |
| IAM | Permission management | Understand security design |
| Route 53 | When using a custom domain | Understand DNS |
| ACM | HTTPS certificates | Understand TLS/certificates |

---

## 9.3 Extended Architecture

```text
User
  ↓
CloudFront
  ↓
S3 / Frontend
  ↓
API Gateway
  ↓
Lambda
  ↓
DynamoDB

Cognito: Login
EventBridge: Daily question delivery
SES: Email notifications
CloudWatch: Log monitoring
AWS Budgets: Billing alerts
```

---

## 10. Technology Stack

## 10.1 Frontend

Candidates:

- Next.js
- TypeScript
- Tailwind CSS
- Markdown / MDX

Reasons:

- Easy to create an attractive portfolio presentation
- Works well with article content
- Straightforward SEO support
- Also provides TypeScript practice

## 10.2 Backend

Candidates:

- AWS Lambda
- API Gateway
- Node.js or Python

If using Python:

- Can build on existing learning experience
- Works well with future AI feature additions

If using Node.js:

- Consistent with Next.js
- Easier to manage types with the frontend

The initial policy is to **implement Lambda in Python**.

## 10.3 Database

- DynamoDB

Data to store:

- Terminology data
- Practice-question data
- Contact data
- Future learning history

## 10.4 Infrastructure Management

Initially:

- Build manually in the AWS Management Console

In the medium term:

- Convert to IaC using AWS SAM or Terraform

Codifying the architecture before taking SAA would improve its portfolio value.

---

## 11. Cost Policy

## 11.1 Basic Policy

Keep development and operating costs for this product as close to zero as possible.

To do so, adopt the following policies.

- Do not use always-on EC2 instances
- Do not use RDS
- Do not use NAT Gateway
- Do not use ALB
- Build primarily with Lambda, S3, CloudFront, and DynamoDB
- Set a short retention period for CloudWatch Logs
- Configure AWS Budgets alerts
- Delete unnecessary resources immediately

## 11.2 Areas Requiring Care to Avoid Unexpected Charges

Services requiring particular attention:

- NAT Gateway
- RDS
- EC2
- Elastic IP
- ALB
- Large volumes of CloudWatch Logs
- Large S3 storage volumes
- High-frequency Lambda invocations

## 11.3 Approach to Free Operation

Rather than guaranteeing permanently zero cost, aim for the following.

- Stay within the Free Tier during initial development
- Keep costs effectively close to zero while traffic is low
- Offset AWS costs with advertising revenue after traffic increases
- Regularly inspect the AWS billing dashboard in case pricing structures change

---

## 12. Monetization Policy

## 12.1 Stage 1: Google AdSense

Place advertising slots on blog articles, glossary pages, comparison articles, and practice-question pages.

Expected advertising pages:

- AWS glossary
- Service comparison articles
- Certification-preparation articles
- Practice-question pages
- Architecture explanation pages

## 12.2 Stage 2: Refer Readers to Paid note Articles

Attract visitors with the free site and direct them to paid note articles for deeper material.

Paid article examples:

- A roadmap to passing AWS Cloud Practitioner
- A summary of frequently tested SAA architecture patterns
- Steps to build an AWS Free Tier portfolio
- An AWS portfolio design-document template for beginners

## 12.3 Stage 3: Sell PDF Learning Materials

Once enough content has accumulated, package it as PDF learning materials.

Product examples:

- CLF glossary PDF
- SAA architecture diagram PDF
- AWS service comparison table PDF
- A PDF with 100 practice questions

## 12.4 Stage 4: Become a Small SaaS Product

Add login, learning history, and weakness analysis, and extend the product to monthly subscriptions.

Free version:

- Glossary
- Selected practice questions
- Selected architecture diagrams

Paid version:

- All practice questions
- Saved learning history
- Weakness analysis
- Review functionality
- PDF downloads

---

## 13. SEO Policy

## 13.1 Target Keywords

Initial target keywords (Japanese search-query specimens retained):

- AWS Cloud Practitioner 勉強方法
- AWS Cloud Practitioner 初心者
- AWS SAA 勉強方法
- AWS SAA 構成図
- AWS 無料枠 ポートフォリオ
- S3 CloudFront 静的サイト
- Lambda API Gateway 初心者
- DynamoDB RDS 違い
- S3 EBS EFS 違い
- IAM ロール ユーザー 違い

## 13.2 Article Policy

Rather than merely defining terms, use the following structure.

1. Conclusion
2. Explanation for beginners
3. Points tested on exams
4. Practical use cases
5. Differences from similar services
6. Common mistakes
7. Summary

## 13.3 Differentiation

Differentiate the site from existing AWS explanation sites as follows.

- Explain from a beginner's perspective
- Connect exam preparation to implementation experience
- Use many diagrams
- Include the context of building a portfolio within the Free Tier
- Publish authentic accounts of the developer's own learning journey

---

## 14. Portfolio Presentation

## 14.1 Contents of the GitHub README

- Service overview
- Development background
- Technologies used
- AWS architecture diagram
- Feature list
- Screenshots
- Infrastructure architecture
- Security design
- Cost optimization measures
- Planned future extensions

## 14.2 Points to Explain in Interviews

Explain the following in interviews.

- Why I built this product
- Why I chose a serverless architecture
- Why I used DynamoDB rather than RDS
- Why I did not use EC2
- Why I use CloudFront
- Considerations in IAM permission design
- Measures taken to keep costs low
- How I would add Cognito and EventBridge in the future

## 14.3 Strong Portfolio Statement

> I developed a web-based learning site for Cloud Practitioner / SAA learners to turn AWS certification study into tangible output. Its infrastructure uses a serverless architecture with S3, CloudFront, Lambda, API Gateway, and DynamoDB, keeping costs low without always-on servers. I built it as a portfolio project that uses the AWS services covered in certification study in practice and lets me explain the design rationale, security, and cost optimization.

---

## 15. Development Scope

## 15.1 MVP Scope

Build the following for the initial release:

- Home page
- AWS glossary listing
- AWS terminology detail pages
- Service comparison pages
- 30 practice questions
- 5 SAA architecture diagrams
- 5 blog articles
- Contact form
- GitHub README
- AWS architecture diagram

## 15.2 What Not to Build in the MVP

Do not build the following initially.

- Login functionality
- Payment functionality
- AI explanation functionality
- Saved learning history
- Administration interface
- Large numbers of practice questions
- Full-fledged email delivery

Reasons:

- Keep initial development costs low
- Keep AWS costs low
- Establish a published project first
- Make manageable progress alongside certification study

---

## 16. Development Roadmap

## Phase 0: Planning and Design

Timing: Immediately after starting

Tasks:

- Create the project proposal
- Define requirements
- Create the screen list
- Create the AWS architecture diagram
- Design the data
- Create the GitHub repository

Deliverables:

- Project proposal
- Requirements definition document
- AWS architecture diagram
- Screen list
- README draft

---

## Phase 1: MVP Before the Cloud Practitioner Exam

Timing: By the end of June

Objective:

Turn Cloud Practitioner study material into content and create a minimally publishable site.

Tasks:

- Create the home page
- Create the AWS glossary
- Create 30 CLF practice questions
- Create service comparison articles
- Publish with S3 + CloudFront
- Prepare the GitHub README

Deliverables:

- Published website
- CLF content
- Static hosting architecture

---

## Phase 2: Add SAA Preparation Features

Timing: July–August

Objective:

Reflect Solutions Architect Associate study material by adding architecture diagrams and design patterns.

Tasks:

- Add SAA architecture diagram pages
- Explain three-tier web application architectures
- Explain highly available architectures
- Explain serverless architectures
- Add API Gateway + Lambda
- Add DynamoDB integration
- Add CloudWatch log monitoring

Deliverables:

- SAA design content
- Serverless API
- DynamoDB integration
- A README demonstrating AWS design skills

---

## Phase 3: Prepare for Monetization

Timing: After taking the SAA exam

Objective:

Expand SEO articles and prepare the site for advertising review.

Tasks:

- Create at least 20 blog articles
- Create a privacy policy
- Prepare the contact page
- Create site operator information
- Create a sitemap
- Register with Google Search Console
- Configure Google Analytics
- Apply for AdSense

Deliverables:

- A content site ready for an advertising application
- A foundation for SEO traffic
- Paths toward monetization

---

## Phase 4: Become a Learning Application

Timing: Medium to long term

Objective:

Extend the site from an information resource into a learning-management application.

Tasks:

- Add Cognito login
- Save learning history
- Display accuracy rates
- Analyze weaknesses
- Add review functionality
- Send daily question notifications
- Add paths to paid content

Deliverables:

- Learning-management application
- Foundation for a SaaS product
- A product suitable for paid offerings

---

## 17. Success Metrics

## 17.1 Portfolio Metrics

- The GitHub README is complete
- An AWS architecture diagram is published
- A production URL is publicly available
- The AWS services used can be explained
- The cost optimization policy can be explained
- The security design can be explained

## 17.2 Learning Metrics

- At least 50 CLF glossary entries
- At least 30 CLF practice questions
- At least 10 service comparison articles
- At least 5 SAA architecture diagrams
- At least 10 SAA preparation articles

## 17.3 Content-Site Metrics

- At least 20 blog articles
- Google Search Console registration complete
- At least 1,000 monthly page views
- AdSense application complete
- Search traffic is arriving

---

## 18. Risks and Mitigations

## 18.1 AWS Billing Risk

Risk:

- Misconfiguration leads to unexpected charges

Mitigations:

- Configure AWS Budgets
- Configure Billing Alerts
- Do not use NAT Gateway, RDS, or ALB
- Set a short CloudWatch Logs retention period
- Check the billing dashboard daily

---

## 18.2 Content Quality Risk

Risks:

- Information becomes outdated
- Content diverges from exam coverage
- Incorrect explanations are published

Mitigations:

- Consult official AWS documentation
- Display article update dates
- Provide an error-reporting form
- Review content after taking certification exams

---

## 18.3 AdSense Review Risk

Risk:

- Insufficient content prevents approval

Mitigations:

- Prepare at least 20 original articles
- Provide a contact page
- Provide a privacy policy
- Avoid copied content
- Include personal learning experiences, diagrams, and comparisons

---

## 18.4 Development Scope Creep Risk

Risk:

- Adding too much login, AI, and payment functionality prevents completion

Mitigations:

- Keep the MVP primarily a static site
- Establish a public URL first
- Defer monetization and login
- Develop in stages aligned with the certification study schedule

---

## 19. Initial Screen List

| Screen | Description | Priority |
|---|---|---|
| Home page | Site overview and main navigation paths | High |
| AWS glossary listing | List services | High |
| AWS terminology detail | Explain each service | High |
| Service comparison listing | List comparison articles | High |
| Service comparison detail | Explain differences between similar services | High |
| Practice-question listing | List question categories | High |
| Practice-question detail | Question, choices, and explanation | High |
| Architecture diagram listing | List SAA architecture diagrams | Medium |
| Architecture diagram detail | Diagram and design rationale | Medium |
| Blog listing | List SEO articles | Medium |
| Blog detail | Article body | Medium |
| Contact | Contact form | Medium |
| Site operator information | Information about the site operator | Medium |
| Privacy policy | Advertising review and legal compliance | Medium |

---

## 20. Data Design Overview

## 20.1 AWS Terminology Data

Japanese website-content specimen:

```json
{
  "id": "s3",
  "name": "Amazon S3",
  "category": "Storage",
  "summary": "オブジェクトストレージサービス",
  "useCase": "静的サイト、画像保存、バックアップ、ログ保存",
  "examPoint": "耐久性、ストレージクラス、ライフサイクル管理、静的Webホスティング",
  "relatedServices": ["EBS", "EFS", "CloudFront"],
  "difficulty": "beginner"
}
```

## 20.2 Practice-Question Data

Japanese website-content specimen:

```json
{
  "id": "clf-001",
  "exam": "CLF-C02",
  "category": "Cloud Concepts",
  "question": "AWSクラウドの主な利点として適切なものはどれですか？",
  "choices": [
    "初期投資が必ず増える",
    "需要に応じてリソースを拡張できる",
    "物理サーバーの購入が必須になる",
    "すべての運用作業が不要になる"
  ],
  "answer": 1,
  "explanation": "AWSでは必要に応じてリソースを拡張・縮小できるため、需要変動に対応しやすい。",
  "relatedService": ["EC2", "Auto Scaling"],
  "difficulty": "easy"
}
```

## 20.3 Architecture Diagram Data

Japanese website-content specimen:

```json
{
  "id": "serverless-api-basic",
  "title": "サーバーレスAPI基本構成",
  "services": ["CloudFront", "S3", "API Gateway", "Lambda", "DynamoDB"],
  "purpose": "低コストでAPI付きWebアプリを構築する",
  "examPoint": "サーバーレス、スケーラビリティ、運用負荷削減",
  "costNote": "常時起動サーバーを使わないため、小規模アクセスでは低コストにしやすい"
}
```

---

## 21. Initial Content Ideas

## 21.1 CLF Articles

1. What is AWS Cloud Practitioner? An explanation for beginners
2. What is AWS global infrastructure? The difference between Regions and AZs
3. What is IAM? Differences between users, roles, and policies
4. What is S3? A beginner's guide to using it
5. What is EC2? Virtual server fundamentals
6. What is Lambda? Serverless explained for beginners
7. Differences between RDS and DynamoDB
8. What is CloudFront? CDN fundamentals
9. Differences between CloudWatch and CloudTrail
10. Billing considerations for the AWS Free Tier

## 21.2 SAA Articles

1. Highly available architectures frequently tested in SAA
2. How would you build a three-tier web application on AWS?
3. S3 + CloudFront static site architecture
4. API Gateway + Lambda + DynamoDB architecture
5. VPC public subnets and private subnets
6. Auto Scaling and ELB fundamentals
7. Differences between RDS Multi-AZ and Read Replicas
8. When to use SQS, SNS, and EventBridge
9. AWS architectures to avoid when optimizing costs
10. Principles for fault-tolerant AWS design

---

## 22. Project Conclusion

This product can simultaneously support AWS certification study, portfolio creation, SEO content-site operation, and future monetization.

It is particularly well aligned with the current study schedule.

- Create basic terminology, practice questions, and comparison articles before the Cloud Practitioner exam at the end of June
- Add architecture diagrams, design patterns, and a serverless API before the SAA exam around August
- Increase SEO articles after the exams and move toward advertising revenue

Rather than building a large SaaS product from the start, first complete it as **a learning content site published on AWS**. Then gradually extend it with login, learning history, weakness analysis, AI explanations, and paid learning materials.

This approach produces a practical project useful for both certification study and a career-change portfolio while keeping costs low.
