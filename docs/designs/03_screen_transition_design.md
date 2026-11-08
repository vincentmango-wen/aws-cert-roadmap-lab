# AWS Certification Learning Site: Screen Inventory and Navigation Design

## 1. Document Information

| Item | Description |
|---|---|
| Document title | AWS Certification Learning Site: Screen Inventory and Navigation Design |
| Product | AWS Certification Roadmap Lab |
| Scope | MVP development through SAA preparation enhancements and monetization preparation |
| Purpose | Define the website's screen structure, URL design, navigation between screens, and each screen's role |
| Planned technologies | Next.js / TypeScript / Tailwind CSS / Markdown or MDX / AWS Serverless |

---

## 2. Purpose of This Design

This document defines the screens required for the AWS certification learning site, AWS Certification Roadmap Lab, and organizes each screen's purpose, displayed elements, user interactions, and navigation.

The product has the following objectives.

1. Enable AWS certification learners to study terminology, comparisons, practice questions, and architecture diagrams
2. Serve as the developer's own AWS portfolio
3. Build a collection of SEO articles and enable future advertising revenue
4. Launch a simple initial MVP that can later expand to include login and learning history

Accordingly, this design emphasizes the following.

- Limit screens to those required for the MVP
- Use an SEO-friendly URL structure
- Provide navigation that beginners can follow easily
- Make the portfolio easy for interviewers to review
- Make it easy to add login and learning-history features later

---

## 3. Basic Screen Design Principles

## 3.1 MVP Policy

The MVP screens focus on the following features.

- Home page
- AWS glossary
- AWS service comparisons
- CLF practice questions
- SAA architecture diagrams
- Blog posts
- Contact
- About the operator
- Privacy policy

Login, account dashboard, learning history, payments, and AI explanations are outside the MVP scope.

## 3.2 URL Design Policy

Use alphanumeric slugs, prioritizing SEO and readability.

Examples:

```text
/terms/s3
/comparisons/s3-vs-ebs-vs-efs
/questions/clf-001
/architectures/serverless-api-basic
/blog/aws-free-tier-portfolio
```

## 3.3 Navigation Policy

Place the following links in the header so users can quickly access the main features.

- Home
- Glossary
- Comparisons
- Practice questions
- Architecture diagrams
- Blog
- Contact

Place the following in the footer.

- About the operator
- Privacy policy
- Contact
- GitHub
- Link to note

## 3.4 Responsive Design Policy

Support desktop, tablet, and smartphone use.

- Desktop: a two-column layout may be used
- Tablet: one or two columns
- Smartphone: one column with a hamburger menu

## 3.5 Advertising Placement Policy

Advertising is not mandatory for the MVP. However, prepare layouts that can accommodate ads in the following locations for future AdSense integration.

- Above the article body
- Within the article body
- Below the article body
- Sidebar
- Below practice-question explanations

Initially, leave ad slots empty or hidden.

---

## 4. Overall Site Structure

## 4.1 Sitemap

```text
/
├── /terms
│   └── /terms/[termId]
├── /comparisons
│   └── /comparisons/[comparisonSlug]
├── /questions
│   ├── /questions/clf
│   └── /questions/[questionId]
├── /architectures
│   └── /architectures/[architectureSlug]
├── /blog
│   └── /blog/[postSlug]
├── /roadmap
├── /contact
├── /about
├── /privacy
├── /disclaimer
└── /github

Future extensions:
├── /login
├── /signup
├── /mypage
├── /mypage/progress
├── /mypage/review
└── /pricing
```

## 4.2 MVP Screens

| Screen ID | Screen name | URL | MVP |
|---|---|---|---|
| SCR-001 | Home page | / | Included |
| SCR-002 | AWS glossary list | /terms | Included |
| SCR-003 | AWS term detail | /terms/[termId] | Included |
| SCR-004 | Service comparison list | /comparisons | Included |
| SCR-005 | Service comparison detail | /comparisons/[comparisonSlug] | Included |
| SCR-006 | Practice-question landing page | /questions | Included |
| SCR-007 | CLF practice-question list | /questions/clf | Included |
| SCR-008 | Practice-question detail | /questions/[questionId] | Included |
| SCR-009 | Architecture diagram list | /architectures | Included |
| SCR-010 | Architecture diagram detail | /architectures/[architectureSlug] | Included |
| SCR-011 | Blog list | /blog | Included |
| SCR-012 | Blog post detail | /blog/[postSlug] | Included |
| SCR-013 | Learning roadmap | /roadmap | Included |
| SCR-014 | Contact | /contact | Included |
| SCR-015 | About the operator | /about | Included |
| SCR-016 | Privacy policy | /privacy | Included |
| SCR-017 | Disclaimer | /disclaimer | Included |
| SCR-018 | GitHub introduction page | /github | Optional |

## 4.3 Future Extension Screens

| Screen ID | Screen name | URL | Implementation phase |
|---|---|---|---|
| SCR-101 | Login | /login | Phase 4 |
| SCR-102 | Sign up | /signup | Phase 4 |
| SCR-103 | Account dashboard | /mypage | Phase 4 |
| SCR-104 | Learning progress | /mypage/progress | Phase 4 |
| SCR-105 | Review questions | /mypage/review | Phase 4 |
| SCR-106 | Weakness analysis | /mypage/weakness | Phase 4 |
| SCR-107 | Pricing page | /pricing | Phase 4 or later |
| SCR-108 | Learning material downloads | /materials | Phase 4 or later |

---

## 5. Shared Layout Design

## 5.1 Structure Shared by All Screens

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ Main Content                 │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 5.2 Header

### Purpose

Provide navigation to the main screens.

### Displayed Elements

| Item | Description | MVP |
|---|---|---|
| Logo | AWS Certification Roadmap Lab | Included |
| Home link | / | Included |
| Glossary link | /terms | Included |
| Comparisons link | /comparisons | Included |
| Practice questions link | /questions | Included |
| Architecture diagrams link | /architectures | Included |
| Blog link | /blog | Included |
| Roadmap link | /roadmap | Included |
| Login button | /login | Future |

### Smartphone Display

- Display a hamburger menu
- Expand the menu when tapped
- Display menu items vertically

## 5.3 Footer

### Purpose

Support credibility, monetization preparation, and navigation to the portfolio.

### Displayed Elements

| Item | URL | Purpose |
|---|---|---|
| About the operator | /about | AdSense and credibility requirements |
| Contact | /contact | Inquiries and error reports |
| Privacy policy | /privacy | AdSense and cookie requirements |
| Disclaimer | /disclaimer | Disclaimer for certification and learning information |
| GitHub | External link or /github | Portfolio navigation |
| note | External link | Link to paid articles |

## 5.4 Breadcrumbs

Display breadcrumbs on detail pages to improve SEO and usability.

Examples (Japanese localized website copy):

```text
ホーム > 用語集 > Amazon S3
ホーム > 比較 > S3 / EBS / EFS の違い
ホーム > 模擬問題 > CLF-001
```

Applicable screens:

- Term detail
- Comparison detail
- Practice-question detail
- Architecture diagram detail
- Blog post detail

## 5.5 CTA Design

Place links to the next learning activity at the bottom of each screen.

Examples:

| Current screen | CTA |
|---|---|
| Term detail | View related comparison articles |
| Comparison detail | Answer related practice questions |
| Practice-question detail | Go to the next question |
| Architecture diagram detail | Look up related services in the glossary |
| Blog post detail | View the AWS glossary / Answer practice questions |

---

## 6. Detailed Screen Design

---

# SCR-001 Home Page

## 6.1 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-001 |
| Screen name | Home page |
| URL | / |
| MVP | Included |
| Primary users | AWS beginners, certification learners, recruiters |

## 6.1.1 Purpose

Communicate the site's purpose and guide users to the main content. Show portfolio visitors that this learning site is built on AWS.

## 6.1.2 Displayed Elements

| Item | Description |
|---|---|
| Main headline | Understand AWS certification topics through terminology, comparisons, questions, and architecture diagrams |
| Supporting copy | A learning site that organizes AWS concepts for beginners, from Cloud Practitioner to SAA |
| Primary CTA | Answer practice questions / View the glossary |
| Learning category cards | Glossary, comparisons, practice questions, architecture diagrams, blog |
| CLF learning links | Links to Cloud Practitioner content |
| SAA learning links | Links to SAA architecture diagrams and design patterns |
| Latest articles | Three to five latest blog posts |
| Popular comparisons | Key comparison articles |
| Portfolio description | Brief description of the AWS services used |

## 6.1.3 User Interactions

| Action | Destination |
|---|---|
| View the glossary | /terms |
| Answer practice questions | /questions |
| View service comparisons | /comparisons |
| View architecture diagrams | /architectures |
| View the blog | /blog |
| View GitHub | /github or external GitHub link |

## 6.1.4 Wireframe (Japanese Localized Website Example)

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ Hero                         │
│  AWS資格学習を図解で理解する │
│  [模擬問題を解く] [用語集]    │
├──────────────────────────────┤
│ 学習カテゴリカード           │
│ 用語集 | 比較 | 問題 | 構成図 │
├──────────────────────────────┤
│ CLF / SAA ロードマップ       │
├──────────────────────────────┤
│ 最新記事                     │
├──────────────────────────────┤
│ AWS構成・ポートフォリオ説明  │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 6.1.5 Acceptance Criteria

- The site's purpose is clear above the fold
- The glossary, practice questions, comparisons, and architecture diagrams are accessible in one click
- CTAs are easy to see on smartphones
- The portfolio provides a link to the AWS architecture

---

# SCR-002 AWS Glossary List

## 6.2 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-002 |
| Screen name | AWS glossary list |
| URL | /terms |
| MVP | Included |
| Primary users | AWS beginners and CLF candidates |

## 6.2.1 Purpose

Allow users to browse AWS services and study them by category.

## 6.2.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | AWS glossary |
| Description | Major AWS services organized for beginners |
| Search form | Search by service name or keyword |
| Category filter | Compute / Storage / Database / Network / Security, etc. |
| Term cards | Service name, category, brief description, and detail link |
| Learning priority | Essential for CLF / Important for SAA, etc. |

## 6.2.3 User Interactions

| Action | Behavior |
|---|---|
| Enter a keyword | Filter the term list |
| Select a category | Filter by category |
| Click a term card | Navigate to term detail |
| Click a comparison link | Navigate to a related comparison page |

## 6.2.4 Wireframe (Japanese Localized Website Example)

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ AWS用語集                    │
│ [検索フォーム]               │
│ [カテゴリフィルタ]            │
├──────────────────────────────┤
│ 用語カード一覧               │
│ ┌────┐ ┌────┐ ┌────┐       │
│ │S3  │ │EC2 │ │IAM │       │
│ └────┘ └────┘ └────┘       │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 6.2.5 Acceptance Criteria

- Display at least 30 AWS terms
- Allow filtering by category
- Allow navigation to each term's detail page
- Keep the list layout intact on desktop and smartphones

---

# SCR-003 AWS Term Detail

## 6.3 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-003 |
| Screen name | AWS term detail |
| URL | /terms/[termId] |
| MVP | Included |
| Example | /terms/s3 |

## 6.3.1 Purpose

Help users understand an AWS service's overview, uses, exam topics, and differences from related services.

## 6.3.2 Displayed Elements

| Item | Description |
|---|---|
| Breadcrumbs | Home > Glossary > Service name |
| Service name | Amazon S3, etc. |
| Category | Storage, etc. |
| One-line description | A short explanation for beginners |
| Overview | Basic service explanation |
| Main uses | Practical usage examples |
| CLF exam topics | Topics tested in Cloud Practitioner |
| SAA exam topics | Topics tested in SAA |
| Similar services | Services to compare |
| Considerations | Billing, design, and security considerations |
| Related links | Comparison articles, practice questions, and architecture diagrams |

## 6.3.3 User Interactions

| Action | Destination |
|---|---|
| View related comparisons | /comparisons/[comparisonSlug] |
| Answer related questions | /questions/[questionId] |
| Return to the term list | /terms |
| View the next term | /terms/[nextTermId] |

## 6.3.4 Wireframe (Japanese Localized Website Example)

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ パンくず                     │
│ Amazon S3                    │
│ Storage / CLF重要            │
├──────────────────────────────┤
│ 一言でいうと                 │
├──────────────────────────────┤
│ 概要                         │
│ 主な用途                     │
│ 試験ポイント                 │
│ 注意点                       │
├──────────────────────────────┤
│ 関連比較・関連問題           │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 6.3.5 Acceptance Criteria

- Display the service overview, uses, and exam topics
- Provide links to related comparison articles and questions
- Use beginner-friendly explanations
- Allow SEO title and description configuration

---

# SCR-004 Service Comparison List

## 6.4 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-004 |
| Screen name | Service comparison list |
| URL | /comparisons |
| MVP | Included |

## 6.4.1 Purpose

List articles comparing AWS services that are easily confused.

## 6.4.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | AWS service comparisons |
| Description | Compare services that are easily confused on exams |
| Comparison categories | Storage / Database / Network / Security, etc. |
| Comparison article cards | Title, services compared, overview, and difficulty |
| Recommended comparisons | Comparisons beginners should read first |

## 6.4.3 Initial Content

| Comparison topic | URL |
|---|---|
| Differences between S3 / EBS / EFS | /comparisons/s3-vs-ebs-vs-efs |
| Differences between RDS / DynamoDB | /comparisons/rds-vs-dynamodb |
| Differences between SNS / SQS / EventBridge | /comparisons/sns-vs-sqs-vs-eventbridge |
| Differences between IAM users / IAM roles / IAM policies | /comparisons/iam-user-vs-role-vs-policy |
| Differences between CloudWatch / CloudTrail / AWS Config | /comparisons/cloudwatch-vs-cloudtrail-vs-config |

## 6.4.4 User Interactions

| Action | Destination |
|---|---|
| Click a comparison article card | /comparisons/[comparisonSlug] |
| Click a related term | /terms/[termId] |
| Go to practice questions | /questions |

## 6.4.5 Acceptance Criteria

- Display at least five comparison articles
- Display the services compared and an overview for each article
- Allow navigation to detail pages

---

# SCR-005 Service Comparison Detail

## 6.5 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-005 |
| Screen name | Service comparison detail |
| URL | /comparisons/[comparisonSlug] |
| MVP | Included |
| Example | /comparisons/s3-vs-ebs-vs-efs |

## 6.5.1 Purpose

Help users understand differences between similar AWS services through comparison tables, exam topics, and practical service-selection guidance.

## 6.5.2 Displayed Elements

| Item | Description |
|---|---|
| Breadcrumbs | Home > Comparisons > Comparison title |
| Title | Differences between S3 / EBS / EFS |
| Conclusion | Present service-selection conclusions first |
| Comparison table | Show differences between services in a table |
| Exam topics | Topics tested in CLF/SAA |
| Practical service selection | Which service to choose for each case |
| Common mistakes | Points beginners easily confuse |
| Related terms | Links to each service's term detail |
| Related questions | Links to practice questions |

## 6.5.3 User Interactions

| Action | Destination |
|---|---|
| Click a related term | /terms/[termId] |
| Answer related questions | /questions/[questionId] |
| Return to the comparison list | /comparisons |
| View the next comparison | /comparisons/[nextSlug] |

## 6.5.4 Wireframe (Japanese Localized Website Example)

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ パンくず                     │
│ S3 / EBS / EFS の違い        │
├──────────────────────────────┤
│ 結論                         │
├──────────────────────────────┤
│ 比較表                       │
├──────────────────────────────┤
│ 試験ポイント                 │
├──────────────────────────────┤
│ 実務での使い分け             │
├──────────────────────────────┤
│ 関連用語・関連問題           │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 6.5.5 Acceptance Criteria

- Display a comparison table
- Put the conclusion first
- Include exam topics and practical service-selection guidance
- Include internal links to related terms

---

# SCR-006 Practice-Question Landing Page

## 6.6 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-006 |
| Screen name | Practice-question landing page |
| URL | /questions |
| MVP | Included |

## 6.6.1 Purpose

Guide users to practice questions by certification and category.

## 6.6.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | AWS practice questions |
| Description | A question bank for checking understanding of CLF/SAA |
| CLF card | Link to Cloud Practitioner questions |
| SAA card | Indication that support is planned for the future |
| Category links | Cloud Concepts / Security / Technology / Billing |
| Recommended questions | Beginner-friendly questions |

## 6.6.3 User Interactions

| Action | Destination |
|---|---|
| Answer CLF questions | /questions/clf |
| Click a question card | /questions/[questionId] |
| View related terms | /terms |

## 6.6.4 Acceptance Criteria

- Allow navigation to the CLF question list
- Make clear that SAA questions are planned for the future
- Provide links to questions beginners should attempt first

---

# SCR-007 CLF Practice-Question List

## 6.7 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-007 |
| Screen name | CLF practice-question list |
| URL | /questions/clf |
| MVP | Included |

## 6.7.1 Purpose

List Cloud Practitioner practice questions and allow users to answer them by category.

## 6.7.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | AWS Cloud Practitioner practice questions |
| Question count | For example, 30 questions in total |
| Category filter | Cloud Concepts / Security / Technology / Billing |
| Difficulty filter | easy / normal / hard |
| Question cards | Question number, category, difficulty, and related services |
| Random question button | Optional feature |

## 6.7.3 User Interactions

| Action | Destination or behavior |
|---|---|
| Click a question card | /questions/[questionId] |
| Select a category | Filter the question list |
| Select a difficulty | Filter the question list |
| Random question | Navigate to a randomly chosen question's detail page |

## 6.7.4 Acceptance Criteria

- Display at least 30 CLF questions
- Show each question's category and difficulty
- Allow navigation to question detail pages

---

# SCR-008 Practice-Question Detail

## 6.8 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-008 |
| Screen name | Practice-question detail |
| URL | /questions/[questionId] |
| MVP | Included |
| Example | /questions/clf-001 |

## 6.8.1 Purpose

Allow users to answer questions, see whether they are correct, and read explanations.

## 6.8.2 Displayed Elements

| Item | Description |
|---|---|
| Breadcrumbs | Home > Practice questions > CLF-001 |
| Question number | CLF-001 |
| Category | Cloud Concepts, etc. |
| Difficulty | easy / normal / hard |
| Question text | Question body |
| Choices | Four options |
| Answer button | Submit an answer after selecting an option |
| Result | Correct / Incorrect |
| Explanation | Reason for the correct answer and additional explanation |
| Related services | Links to term detail pages |
| Next question | Link to the next question |

## 6.8.3 User Interactions

| Action | Behavior |
|---|---|
| Select an option | Mark the option as selected |
| Submit an answer | Evaluate correctness and display the explanation |
| Go to the next question | Navigate to the next question detail |
| View related services | Navigate to /terms/[termId] |
| Return to the list | Navigate to /questions/clf |

## 6.8.4 State Design

| State | Display |
|---|---|
| Unanswered | Display the question text, options, and answer button |
| Answered correctly | Display the correct-answer message, explanation, and next-question link |
| Answered incorrectly | Display the incorrect-answer message, correct answer, explanation, and related-term links |

## 6.8.5 Wireframe (Japanese Localized Website Example)

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ パンくず                     │
│ CLF-001 / Cloud Concepts     │
├──────────────────────────────┤
│ 問題文                       │
│ ○ 選択肢A                    │
│ ○ 選択肢B                    │
│ ○ 選択肢C                    │
│ ○ 選択肢D                    │
│ [回答する]                   │
├──────────────────────────────┤
│ 回答後：正誤・解説            │
├──────────────────────────────┤
│ 関連サービス / 次の問題       │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 6.8.6 Acceptance Criteria

- Allow users to select one option and submit an answer
- Display whether the answer is correct after submission
- Display the explanation
- Allow navigation to the next question
- Allow use without login

---

# SCR-009 Architecture Diagram List

## 6.9 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-009 |
| Screen name | Architecture diagram list |
| URL | /architectures |
| MVP | Included |

## 6.9.1 Purpose

Allow users to browse typical AWS architecture patterns for SAA preparation.

## 6.9.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | AWS architecture diagram gallery |
| Description | AWS architecture patterns to understand for SAA |
| Architecture diagram cards | Title, services used, overview, and difficulty |
| Categories | Serverless / Three-tier / Batch / High availability |
| Exam topic tags | Availability, fault tolerance, cost, and security |

## 6.9.3 Initial Content

| Architecture diagram | URL |
|---|---|
| S3 + CloudFront static website architecture | /architectures/static-site-s3-cloudfront |
| API Gateway + Lambda + DynamoDB serverless API architecture | /architectures/serverless-api-basic |
| Three-tier web application architecture within a VPC | /architectures/three-tier-vpc |
| ALB + Auto Scaling + RDS Multi-AZ high-availability architecture | /architectures/high-availability-web-app |
| EventBridge + Lambda batch-processing architecture | /architectures/eventbridge-lambda-batch |

## 6.9.4 User Interactions

| Action | Destination |
|---|---|
| Click an architecture diagram card | /architectures/[architectureSlug] |
| Click a related service | /terms/[termId] |

## 6.9.5 Acceptance Criteria

- Display at least five architecture diagram cards
- Display the AWS services used on each card
- Allow navigation to detail screens

---

# SCR-010 Architecture Diagram Detail

## 6.10 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-010 |
| Screen name | Architecture diagram detail |
| URL | /architectures/[architectureSlug] |
| MVP | Included |
| Example | /architectures/serverless-api-basic |

## 6.10.1 Purpose

Help users understand each service's role, design intent, and exam topics while viewing an AWS architecture diagram.

## 6.10.2 Displayed Elements

| Item | Description |
|---|---|
| Breadcrumbs | Home > Architecture diagrams > Architecture name |
| Title | Basic serverless API architecture, etc. |
| Architecture image | AWS architecture diagram |
| Overview | What the architecture accomplishes |
| Services used | S3, CloudFront, API Gateway, Lambda, DynamoDB, etc. |
| Communication flow | Flow from user access to database storage |
| Design considerations | Availability, fault tolerance, cost, and security |
| SAA exam topics | Frequently tested perspectives |
| Cost considerations | Billing risks and Free Tier considerations |
| Related terms | Links to term detail pages |
| Related comparisons | Links to comparison articles |

## 6.10.3 User Interactions

| Action | Destination |
|---|---|
| Click a related service | /terms/[termId] |
| Click a related comparison | /comparisons/[comparisonSlug] |
| View other architecture diagrams | /architectures |

## 6.10.4 Wireframe (Japanese Localized Website Example)

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ パンくず                     │
│ サーバーレスAPI基本構成      │
├──────────────────────────────┤
│ 構成図                       │
├──────────────────────────────┤
│ 概要                         │
│ 通信フロー                   │
│ 使用サービス                 │
│ 設計ポイント                 │
│ SAA試験ポイント              │
│ コスト注意点                 │
├──────────────────────────────┤
│ 関連用語・関連比較           │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 6.10.5 Acceptance Criteria

- Display the architecture diagram
- Explain the services used and their roles
- Include design considerations
- Include SAA exam topics

---

# SCR-011 Blog List

## 6.11 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-011 |
| Screen name | Blog list |
| URL | /blog |
| MVP | Included |

## 6.11.1 Purpose

List AWS learning articles, certification preparation articles, and Free Tier portfolio articles.

## 6.11.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | AWS learning blog |
| Description | Articles about AWS certification, serverless architecture, and Free Tier portfolios |
| Article cards | Title, summary, category, publication date, and update date |
| Category filter | CLF / SAA / Free Tier / Serverless / Portfolio |
| Tags | AWS service names, etc. |

## 6.11.3 User Interactions

| Action | Destination or behavior |
|---|---|
| Click an article card | /blog/[postSlug] |
| Select a category | Filter the article list |
| Click a tag | Display articles by tag |

## 6.11.4 Acceptance Criteria

- Display at least five articles
- Allow navigation to article detail pages
- Display categories

---

# SCR-012 Blog Post Detail

## 6.12 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-012 |
| Screen name | Blog post detail |
| URL | /blog/[postSlug] |
| MVP | Included |
| Example | /blog/aws-free-tier-portfolio |

## 6.12.1 Purpose

Display AWS learning articles targeting SEO traffic and guide users to the glossary, questions, comparisons, and paid note articles.

## 6.12.2 Displayed Elements

| Item | Description |
|---|---|
| Breadcrumbs | Home > Blog > Article title |
| Title | Article title |
| Publication and update dates | Article dates |
| Categories and tags | CLF, SAA, S3, Lambda, etc. |
| Featured image | Optional |
| Article body | Markdown/MDX body |
| Table of contents | Automatically generated from h2/h3 headings |
| Related articles | Articles in the same category |
| Related terms | Links to the glossary |
| CTA | Practice questions, paid note articles, GitHub, etc. |
| Ad slots | Future AdSense slots |

## 6.12.3 User Interactions

| Action | Destination |
|---|---|
| Click a related term | /terms/[termId] |
| Click a related article | /blog/[postSlug] |
| Go to practice questions | /questions |
| View a note article | External note link |

## 6.12.4 Acceptance Criteria

- Display the article body
- Allow title / description configuration
- Include internal links to related articles and terms
- Ensure readability on smartphones

---

# SCR-013 Learning Roadmap

## 6.13 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-013 |
| Screen name | Learning roadmap |
| URL | /roadmap |
| MVP | Included |

## 6.13.1 Purpose

Help AWS beginners understand the order in which to study, from Cloud Practitioner to SAA.

## 6.13.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | AWS certification learning roadmap |
| Target audience | Beginners, CLF candidates, and SAA candidates |
| Step 1 | Understand cloud fundamentals |
| Step 2 | Major services such as IAM, S3, EC2, and VPC |
| Step 3 | CLF practice questions |
| Step 4 | Understand SAA architecture diagrams |
| Step 5 | Build an actual portfolio on AWS |
| Related links | Glossary, comparisons, practice questions, and architecture diagrams |

## 6.13.3 User Interactions

| Action | Destination |
|---|---|
| Click a link within a step | Navigate to a related page |
| Answer practice questions | /questions/clf |
| View architecture diagrams | /architectures |

## 6.13.4 Acceptance Criteria

- Beginners can understand the learning sequence
- Each step links to related pages
- Make the difference between CLF and SAA clear

---

# SCR-014 Contact

## 6.14 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-014 |
| Screen name | Contact |
| URL | /contact |
| MVP | Included |

## 6.14.1 Purpose

Receive user inquiries, error reports, work requests, and feedback.

## 6.14.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | Contact us |
| Description | Explain that error reports, inquiries, and work consultations are welcome |
| Name input | Required |
| Email address input | Required |
| Subject input | Required |
| Message body input | Required |
| Submit button | Submit the entered information |
| Completion message | Display on successful submission |
| Error message | Display for invalid input or failed submission |

## 6.14.3 Input Validation

| Field | Condition |
|---|---|
| Name | Required; up to 100 characters |
| Email address | Required; email format |
| Subject | Required; up to 150 characters |
| Message body | Required; up to 2,000 characters |

## 6.14.4 User Interactions

| Action | Behavior |
|---|---|
| Enter data | Enter values in the form |
| Submit | Validate input, then send to API Gateway + Lambda |
| Success | Display a completion message |
| Failure | Display an error message |

## 6.14.5 Wireframe (Japanese Localized Website Example)

```text
┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ お問い合わせ                 │
│ 名前                         │
│ [__________]                 │
│ メール                       │
│ [__________]                 │
│ 件名                         │
│ [__________]                 │
│ 本文                         │
│ [____________________]       │
│ [送信する]                   │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘
```

## 6.14.6 Acceptance Criteria

- Required-field validation works
- Email-format validation works
- A completion message appears after successful submission
- Contact data is stored in DynamoDB

---

# SCR-015 About the Operator

## 6.15 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-015 |
| Screen name | About the operator |
| URL | /about |
| MVP | Included |

## 6.15.1 Purpose

Explain the site operator's information, the site's purpose, and its background as a portfolio.

## 6.15.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | About the operator |
| Operator name | Handle or name |
| Site purpose | AWS certification learning, portfolio, and information sharing |
| Learning background | Explain that the operator is studying CLF/SAA |
| Technologies used | AWS, Next.js, TypeScript, etc. |
| GitHub link | Link to the repository |
| note link | Link to the article platform |
| Contact link | /contact |

## 6.15.3 Acceptance Criteria

- Make the site operator and purpose clear
- Provide a link to GitHub
- Provide a link to the contact page
- Include basic credibility information with AdSense review in mind

---

# SCR-016 Privacy Policy

## 6.16 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-016 |
| Screen name | Privacy policy |
| URL | /privacy |
| MVP | Included |

## 6.16.1 Purpose

Publish policies on personal information, cookies, and advertising, anticipating contact forms, access analytics, and advertisements.

## 6.16.2 Displayed Elements

| Item | Description |
|---|---|
| Purposes of personal information use | Responding to inquiries, etc. |
| Information collected | Name, email address, and inquiry body |
| Cookie use | Analytics and ad delivery planned |
| Google Analytics | Planned for future introduction, or documented when introduced |
| Google AdSense | Planned for future introduction, or documented when introduced |
| Third-party disclosure | Not provided in principle |
| Disclaimer | Cautions about external links and information accuracy |
| Revisions | Possibility of policy changes |

## 6.16.3 Acceptance Criteria

- Accessible from the footer
- Consistent with the contact form
- Include provisions anticipating advertising and analytics

---

# SCR-017 Disclaimer

## 6.17 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-017 |
| Screen name | Disclaimer |
| URL | /disclaimer |
| MVP | Included |

## 6.17.1 Purpose

Publish disclaimers covering AWS certification information, learning information, external links, and content accuracy.

## 6.17.2 Displayed Elements

| Item | Description |
|---|---|
| Information accuracy | Explain that accuracy is pursued but not guaranteed |
| Exam information | Explain that users must always check official AWS information |
| Liability for damages | Explain that the operator is not liable for damages arising from site use |
| External links | Explain that the operator is not responsible for external site content |
| Content updates | Information may become outdated |

## 6.17.3 Acceptance Criteria

- Accessible from the footer
- Encourage users to check official AWS information
- Clearly state the disclaimer for learning information

---

# SCR-018 GitHub Introduction Page

## 6.18 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-018 |
| Screen name | GitHub introduction page |
| URL | /github |
| MVP | Optional |

## 6.18.1 Purpose

Guide portfolio visitors to the GitHub repository, README, AWS architecture diagrams, and reasons for technology choices.

## 6.18.2 Displayed Elements

| Item | Description |
|---|---|
| Page title | GitHub and technology architecture |
| Repository link | External GitHub link |
| Technologies used | Next.js, AWS, DynamoDB, etc. |
| AWS architecture overview | S3, CloudFront, Lambda, etc. |
| Development background | Certification learning and portfolio objectives |
| README highlights | Architecture diagrams, cost design, and security design |

## 6.18.3 Acceptance Criteria

- Allow navigation to the GitHub repository
- Make the technology architecture easy to understand
- Provide navigation that is easy for interviewers to review

---

## 7. Future Extension Screen Design

---

# SCR-101 Login

## 7.1 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-101 |
| Screen name | Login |
| URL | /login |
| Implementation phase | Phase 4 |

## 7.1.1 Purpose

Allow users to log in using Cognito.

## 7.1.2 Displayed Elements

| Item | Description |
|---|---|
| Email address | Login ID |
| Password | Password |
| Login button | Perform authentication |
| Sign-up link | /signup |
| Password reset link | Future |

---

# SCR-102 Sign Up

## 7.2 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-102 |
| Screen name | Sign up |
| URL | /signup |
| Implementation phase | Phase 4 |

## 7.2.1 Purpose

Allow users to create an account for saving their learning history.

## 7.2.2 Displayed Elements

| Item | Description |
|---|---|
| Name | Optional or required |
| Email address | Required |
| Password | Required |
| Sign-up button | Register with Cognito |
| Login link | /login |

---

# SCR-103 Account Dashboard

## 7.3 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-103 |
| Screen name | Account dashboard |
| URL | /mypage |
| Implementation phase | Phase 4 |

## 7.3.1 Purpose

Display the logged-in user's learning status, accuracy rate, and items to review.

## 7.3.2 Displayed Elements

| Item | Description |
|---|---|
| User name | Logged-in user's name |
| Questions answered | Number of questions answered so far |
| Accuracy rate | Overall accuracy rate |
| Weak categories | Categories with low accuracy rates |
| Review questions | List of incorrectly answered questions |
| Learning progress link | /mypage/progress |

---

# SCR-104 Learning Progress

## 7.4 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-104 |
| Screen name | Learning progress |
| URL | /mypage/progress |
| Implementation phase | Phase 4 |

## 7.4.1 Purpose

Visualize learning progress and accuracy rates by category.

## 7.4.2 Displayed Elements

| Item | Description |
|---|---|
| Overall accuracy rate | Accuracy across all questions |
| Accuracy by category | Security, Billing, etc. |
| Answer history | Recently answered questions |
| Chart | Accuracy rate over time |

---

# SCR-105 Review Questions

## 7.5 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-105 |
| Screen name | Review questions |
| URL | /mypage/review |
| Implementation phase | Phase 4 |

## 7.5.1 Purpose

Allow users to review only questions they previously answered incorrectly.

## 7.5.2 Displayed Elements

| Item | Description |
|---|---|
| Review list | Incorrectly answered questions |
| Category | Question category |
| Last answer date | Date the question was last attempted |
| Retry button | Navigate to question detail |

---

# SCR-106 Weakness Analysis

## 7.6 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-106 |
| Screen name | Weakness analysis |
| URL | /mypage/weakness |
| Implementation phase | Phase 4 |

## 7.6.1 Purpose

Display users' weak areas based on accuracy rates by category.

## 7.6.2 Displayed Elements

| Item | Description |
|---|---|
| Weak categories | Categories with low accuracy rates |
| Recommended review questions | Questions related to weak areas |
| Recommended terms | Related AWS terms |
| Recommended comparison articles | Comparison articles that aid understanding |

---

# SCR-107 Pricing Page

## 7.7 Screen Overview

| Item | Description |
|---|---|
| Screen ID | SCR-107 |
| Screen name | Pricing page |
| URL | /pricing |
| Implementation phase | Phase 4 or later |

## 7.7.1 Purpose

Display pricing plans for future paid features, PDF learning materials, and question banks.

## 7.7.2 Displayed Elements

| Item | Description |
|---|---|
| Free plan | Glossary, selected questions, and article access |
| Paid plan | All questions, learning history, weakness analysis, and PDF learning materials |
| PDF learning materials | Individual purchases |
| Paid note articles | External links |

---

## 8. Screen Navigation Design

## 8.1 Basic Navigation Diagram

```text
[Home page]
  ├── [AWS glossary list]
  │      └── [AWS term detail]
  │              ├── [Service comparison detail]
  │              └── [Practice-question detail]
  │
  ├── [Service comparison list]
  │      └── [Service comparison detail]
  │              ├── [AWS term detail]
  │              └── [Practice-question detail]
  │
  ├── [Practice-question landing page]
  │      └── [CLF practice-question list]
  │              └── [Practice-question detail]
  │                      ├── [Next practice-question detail]
  │                      └── [AWS term detail]
  │
  ├── [Architecture diagram list]
  │      └── [Architecture diagram detail]
  │              ├── [AWS term detail]
  │              └── [Service comparison detail]
  │
  ├── [Blog list]
  │      └── [Blog post detail]
  │              ├── [AWS term detail]
  │              ├── [Service comparison detail]
  │              └── [Practice-question detail]
  │
  ├── [Learning roadmap]
  ├── [Contact]
  ├── [About the operator]
  ├── [Privacy policy]
  └── [Disclaimer]
```

## 8.2 Main User Flows

## 8.2.1 Learning Flow for AWS Beginners

```text
Home page
  ↓
Learning roadmap
  ↓
AWS glossary list
  ↓
AWS term detail
  ↓
Service comparison detail
  ↓
CLF practice-question list
  ↓
Practice-question detail
```

### Purpose

Create a path from understanding terminology to practicing questions, rather than asking beginners to start with questions immediately.

## 8.2.2 Question Practice Flow for CLF Candidates

```text
Home page
  ↓
Practice-question landing page
  ↓
CLF practice-question list
  ↓
Practice-question detail
  ↓
Submit an answer
  ↓
View the explanation
  ↓
View related terms
  ↓
Go to the next question
```

### Purpose

Allow users focused on question practice to return from explanations to related knowledge.

## 8.2.3 Architecture Diagram Learning Flow for SAA Learners

```text
Home page
  ↓
Architecture diagram list
  ↓
Architecture diagram detail
  ↓
Review the services used
  ↓
AWS term detail
  ↓
Related comparison articles
```

### Purpose

Connect architecture understanding, which is important for SAA, with service-level knowledge and comparisons.

## 8.2.4 Browsing Flow for Users Arriving Through SEO

```text
Google search
  ↓
Blog post detail
  ↓
Related terms
  ↓
Comparison articles
  ↓
Practice questions
  ↓
Learning roadmap
```

### Purpose

Encourage internal browsing to the glossary, comparisons, and questions rather than ending the visit after a single article.

## 8.2.5 Review Flow for Recruiters and Interviewers

```text
Portfolio URL
  ↓
Home page
  ↓
About the operator
  ↓
GitHub introduction page
  ↓
Review the README
  ↓
Architecture diagram detail
  ↓
Contact
```

### Purpose

Make it easy to review technology choices, AWS architecture, design intent, and development background.

---

## 9. Navigation Design

## 9.1 Header Navigation

| Display name | URL | Priority |
|---|---|---|
| Home | / | High |
| Glossary | /terms | High |
| Comparisons | /comparisons | High |
| Practice questions | /questions | High |
| Architecture diagrams | /architectures | High |
| Blog | /blog | Medium |
| Roadmap | /roadmap | Medium |

## 9.2 Footer Navigation

| Display name | URL | Purpose |
|---|---|---|
| About the operator | /about | Credibility |
| Contact | /contact | Inquiries and error reports |
| Privacy policy | /privacy | Advertising and personal information requirements |
| Disclaimer | /disclaimer | Disclaimer for exam and learning information |
| GitHub | /github or external | Portfolio |
| note | external | Revenue links |

## 9.3 Sidebar Design

On desktop, display a sidebar on blog post, comparison, and term detail pages.

### Displayed Elements

| Item | Description |
|---|---|
| Related articles | Articles in the same category |
| Related terms | Related AWS services |
| Popular questions | Frequently attempted questions |
| Ad slots | Future AdSense slots |

On smartphones, move the sidebar below the main content.

---

## 10. URL Design

## 10.1 URL List

| Screen | Example URL |
|---|---|
| Home | / |
| Term list | /terms |
| Term detail | /terms/s3 |
| Comparison list | /comparisons |
| Comparison detail | /comparisons/s3-vs-ebs-vs-efs |
| Practice-question landing page | /questions |
| CLF question list | /questions/clf |
| Question detail | /questions/clf-001 |
| Architecture diagram list | /architectures |
| Architecture diagram detail | /architectures/serverless-api-basic |
| Blog list | /blog |
| Blog post detail | /blog/aws-free-tier-portfolio |
| Roadmap | /roadmap |
| Contact | /contact |
| About the operator | /about |
| Privacy policy | /privacy |
| Disclaimer | /disclaimer |

## 10.2 Slug Naming Rules

| Type | Rule | Example |
|---|---|---|
| Term | Lowercase service abbreviation | s3, ec2, lambda |
| Comparison | service-vs-service format | rds-vs-dynamodb |
| Question | Exam type followed by sequential number | clf-001 |
| Architecture diagram | Describe the content in English words | serverless-api-basic |
| Blog | Convert the article title into an English slug | aws-free-tier-portfolio |

## 10.3 SEO URL Policy

- Do not use Japanese URLs
- Keep URLs short and meaningful, using alphanumeric characters
- Use hyphens rather than underscores
- Do not include dates in URLs
- Avoid URLs that are difficult to change later

---

## 11. State Transition Design

## 11.1 Practice-Question Detail State Transitions

```text
[Unanswered]
  ↓ Select an option
[Selected]
  ↓ Submit an answer
[Answered]
  ├── Display correct result
  └── Display incorrect result
        ↓
[Display explanation]
  ↓
[Go to the next question]
```

## 11.2 Contact Form State Transitions

```text
[Initial display]
  ↓ Enter data
[Editing]
  ↓ Submit
[Validation]
  ├── Errors found → [Return to editing]
  └── No errors → [Submitting]
                      ├── Success → [Submission complete]
                      └── Failure → [Display error]
```

## 11.3 Search and Filter States

Applicable screens:

- Glossary list
- CLF practice-question list
- Blog list
- Comparison list
- Architecture diagram list

```text
[Display list]
  ↓ Enter a search keyword
[Display search results]
  ↓ Select a category
[Display filtered results]
  ↓ Reset conditions
[Display list]
```

---

## 12. Error Screen Design

## 12.1 404 Page

| Item | Description |
|---|---|
| URL | Nonexistent URL |
| Displayed content | Page not found |
| Links | Home page, glossary, practice questions, and blog |

### Wireframe (Japanese Localized Website Example)

```text
ページが見つかりません
URLが変更されたか、削除された可能性があります。
[トップへ戻る] [用語集を見る] [模擬問題を解く]
```

## 12.2 Equivalent of a 500 Error

Although uncommon because the site is primarily static, display an inline error message when an API error occurs.

Applicable cases:

- Contact submission failure
- Question data retrieval failure
- DynamoDB save failure

Display example (Japanese localized website copy):

```text
送信に失敗しました。時間をおいて再度お試しください。
```

## 12.3 No-Data Display

When there are zero search results.

Display example (Japanese localized website copy):

```text
該当するコンテンツが見つかりませんでした。
検索条件を変更してください。
```

---

## 13. MVP Screen Priorities

## 13.1 Highest-Priority Screens

| Priority | Screen | Reason |
|---|---|---|
| 1 | Home page | Site entry point |
| 2 | AWS glossary list | Core of the learning site |
| 3 | AWS term detail | High SEO and learning value |
| 4 | Practice-question list | Core of certification preparation |
| 5 | Practice-question detail | High user value |
| 6 | Service comparison list | High exam-preparation and SEO value |
| 7 | Service comparison detail | Deepens beginners' understanding |

## 13.2 Next-Priority Screens

| Priority | Screen | Reason |
|---|---|---|
| 8 | Architecture diagram list | Suitable for SAA preparation and a portfolio |
| 9 | Architecture diagram detail | Demonstrates AWS design skills |
| 10 | Blog list | For SEO |
| 11 | Blog post detail | For monetization |
| 12 | Learning roadmap | Improves internal browsing |

## 13.3 Monetization and Credibility Screens

| Priority | Screen | Reason |
|---|---|---|
| 13 | Contact | AdSense, credibility, and work inquiries |
| 14 | About the operator | AdSense and portfolio |
| 15 | Privacy policy | AdSense and cookie requirements |
| 16 | Disclaimer | Disclaimer for certification information |

---

## 14. MVP Implementation Order

## 14.1 Recommended Implementation Order

```text
1. Shared layout
2. Home page
3. Glossary list
4. Term detail
5. Service comparison list
6. Service comparison detail
7. Practice-question list
8. Practice-question detail
9. Architecture diagram list
10. Architecture diagram detail
11. Blog list
12. Blog post detail
13. Learning roadmap
14. Contact
15. About the operator
16. Privacy policy
17. Disclaimer
18. 404 page
```

## 14.2 Minimum Launch Version

The initial release may consist of only the following screens.

| Screen | Requirement level |
|---|---|
| Home page | Required |
| Glossary list | Required |
| Term detail | Required |
| Practice-question list | Required |
| Practice-question detail | Required |
| Service comparison list | Required |
| Service comparison detail | Required |
| About the operator | Recommended |
| Privacy policy | Recommended |

Architecture diagrams, the blog, and contact may be added in the next stage. However, add them early when considering portfolio value and AdSense preparation.

---

## 15. Data Retrieval Policy by Screen

## 15.1 Screens Suitable for Static Generation

The following may be statically generated.

| Screen | Data format |
|---|---|
| Home page | Static + some JSON |
| Glossary list | JSON / retrieved from DynamoDB at build time |
| Term detail | JSON / Markdown |
| Comparison list | Markdown metadata |
| Comparison detail | Markdown / MDX |
| Architecture diagram list | JSON / Markdown |
| Architecture diagram detail | Markdown / images |
| Blog list | Markdown metadata |
| Blog post detail | Markdown / MDX |
| Roadmap | Markdown |
| About the operator | Static |
| Privacy policy | Static |
| Disclaimer | Static |

## 15.2 Screens Requiring Dynamic Processing

| Screen | Dynamic processing |
|---|---|
| Practice-question detail | Answers can be evaluated on the client |
| Contact | API Gateway + Lambda + DynamoDB |
| Future account dashboard | Cognito + Lambda + DynamoDB |

## 15.3 Practical MVP Policy

The MVP may manage term, question, and article data in JSON / Markdown and use Lambda + DynamoDB only for contact inquiries.

However, add the following in Phase 2 to demonstrate AWS usage in the portfolio.

- Retrieve question data from DynamoDB
- Store contact data in DynamoDB
- Use Lambda/API Gateway
- Monitor with CloudWatch Logs

---

## 16. Component Design Policy

## 16.1 Shared Components

| Component | Purpose |
|---|---|
| Header | Header shared by all screens |
| Footer | Footer shared by all screens |
| Breadcrumb | Breadcrumb navigation |
| Card | Term, article, and question cards |
| Tag | Category and difficulty display |
| SearchBox | Search form |
| CategoryFilter | Category filtering |
| CTABox | Links to the next action |
| RelatedLinks | Related articles and terms |
| AdPlaceholder | Future ad slots |

## 16.2 Screen-Specific Components

| Component | Purpose |
|---|---|
| TermCard | Term list card |
| ComparisonTable | Service comparison table |
| QuestionCard | Question list card |
| QuestionPlayer | Question-answering UI |
| ArchitectureCard | Architecture diagram card |
| ArticleCard | Blog post card |
| ContactForm | Contact form |
| RoadmapStep | Learning roadmap step display |

---

## 17. Accessibility Requirements

| ID | Requirement |
|---|---|
| A11Y-001 | Buttons and links are keyboard-operable |
| A11Y-002 | Images have alt attributes |
| A11Y-003 | Architecture diagrams have supplementary text |
| A11Y-004 | Do not rely on color alone to indicate correct or incorrect answers |
| A11Y-005 | Display form errors as text |
| A11Y-006 | Use a correct heading hierarchy |

---

## 18. SEO Requirements

## 18.1 SEO Settings by Screen

| Screen | Example title (Japanese localized website copy) | Description policy |
|---|---|---|
| Home | AWS資格ロードマップラボ | Describe the AWS certification learning site |
| Term detail | Amazon S3とは？AWS初心者向けに解説 | Include the service name, uses, and exam topics |
| Comparison detail | S3・EBS・EFSの違いを初心者向けに解説 | Include the names of the services being compared |
| Question detail | AWS CLF模擬問題 CLF-001 | Include the exam type and category |
| Architecture diagram detail | サーバーレスAPI構成をAWSで解説 | Include the names of the services used |
| Blog post detail | Article title | Include search keywords |

## 18.2 Internal Linking Policy

- Link from term detail pages to comparison articles
- Link from comparison articles to term detail pages
- Link from practice-question explanations to related terms
- Link from blog posts to the glossary, questions, and comparisons
- Link from architecture diagram detail pages to term detail pages for the services used

---

## 19. Acceptance Criteria

## 19.1 Screen Inventory Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-SCR-001 | MVP screens are listed |
| AC-SCR-002 | Each screen has a defined URL |
| AC-SCR-003 | Each screen has a clear purpose |
| AC-SCR-004 | Each screen's main displayed elements are defined |
| AC-SCR-005 | Each screen's main navigation destinations are defined |
| AC-SCR-006 | Future extension screens are separated from the MVP |

## 19.2 Navigation Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-TRN-001 | Main features are accessible from the home page |
| AC-TRN-002 | Users can return from detail pages to list pages |
| AC-TRN-003 | Terms, comparisons, questions, and architecture diagrams are interlinked |
| AC-TRN-004 | Users arriving through SEO can browse other content |
| AC-TRN-005 | Recruiters can reach GitHub, architecture diagrams, and contact |

---

## 20. Conclusion

This screen inventory and navigation design defines the screens required for the AWS certification learning site's MVP, grouped into learning, SEO, portfolio, and credibility features.

The MVP focuses on the home page, glossary, service comparisons, practice questions, architecture diagrams, blog, contact, operator information, and privacy policy.

It is particularly important to encourage internal browsing rather than isolated page visits, as shown below.

```text
Glossary → Comparisons → Practice questions → Explanations → Related terms
Blog → Glossary → Architecture diagrams → Comparisons → Questions
Architecture diagrams → Services used → Comparison articles → Practice questions
```

This navigation creates a site structure that improves learning efficiency while also supporting SEO, advertising monetization, and portfolio evaluation.

