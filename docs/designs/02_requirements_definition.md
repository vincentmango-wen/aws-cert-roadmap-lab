# AWS Certification Learning Site: Requirements Definition

## 1. Document Information

| Item | Details |
|---|---|
| Document name | AWS Certification Learning Site: Requirements Definition |
| Target product | AWS Cert Roadmap Lab |
| Purpose | Define requirements for a web learning site supporting AWS certification study, a portfolio, and monetization |
| Target phases | MVP development through SAA preparation feature expansion and monetization preparation |
| Intended readers | The developer, portfolio viewers, recruiters, and interviewers |

---

## 2. Product Overview

## 2.1 Product Name

**AWS Cert Roadmap Lab**

## 2.2 Overview

A web learning site providing AWS service fundamentals, terminology explanations, service comparisons, practice questions, AWS architecture diagrams, and practical design patterns for AWS Cloud Practitioner and AWS Solutions Architect Associate learners.

Rather than simply a certification study site, this product aims to turn the developer's AWS learning into tangible output. Building and publishing it on AWS supports job hunting, portfolio presentation, and future advertising revenue.

## 2.3 Development Policy

- Use the AWS Free Tier and keep operating costs as close to zero as possible
- Build primarily with serverless services, without always-on servers
- Reflect Cloud Practitioner study material in the MVP
- Expand architecture diagrams, design patterns, and AWS architecture explanations alongside SAA study
- Increase SEO articles, practice questions, and comparison content with future advertising revenue in mind
- Prepare the GitHub README, architecture diagrams, and design rationale so the project can be explained as a portfolio

---

## 3. Background and Objectives

## 3.1 Background

The developer is currently studying for AWS Cloud Practitioner and also plans to take AWS Solutions Architect Associate afterward.

Rather than ending certification study at memorization, organize and publish the material as a website to achieve the following simultaneously.

- Reinforce AWS certification learning
- Gain AWS service implementation experience
- Make cloud design skills visible
- Create a portfolio for job changes and client work
- Establish future monetization as an SEO content site

## 3.2 Objectives

This product has the following objectives.

1. Systematically organize AWS Cloud Practitioner / SAA study material
2. Provide content that helps beginners understand differences between AWS services
3. Support certification exam preparation through practice questions
4. Connect certification knowledge to practical design through AWS architecture diagrams
5. Build a serverless web application on AWS and present it as a portfolio
6. Establish a foundation for future advertising revenue, learning-material sales, and a learning application

---

## 4. Target Users

## 4.1 Primary Users

| User | Description |
|---|---|
| AWS beginners | People who have started studying AWS Cloud Practitioner |
| Prospective SAA candidates | People who want to learn basic Solutions Architect Associate design patterns |
| Aspiring engineers without experience | People considering building an AWS portfolio |
| Cloud learners | People who want to clarify differences between AWS services |

## 4.2 Secondary Users

| User | Description |
|---|---|
| Recruiters | People assessing the developer's AWS understanding, design skills, and implementation skills |
| Interviewers | People reviewing the portfolio's technology choices and design rationale |
| Future learning-material buyers | People interested in paid PDFs, note articles, and question collections |

---

## 5. Business Requirements

## 5.1 Learning Support Requirements

| ID | Requirement | Priority |
|---|---|---|
| BIZ-001 | AWS beginners must be able to understand an overview of key services | High |
| BIZ-002 | Users must be able to look up terminology related to Cloud Practitioner exam coverage | High |
| BIZ-003 | Users must be able to learn basic AWS architecture patterns tested in SAA | High |
| BIZ-004 | Users must be able to compare differences between similar AWS services | High |
| BIZ-005 | Users must be able to check their understanding through practice questions | High |
| BIZ-006 | Users must be able to understand practical uses as well as exam preparation points | Medium |

## 5.2 Portfolio Requirements

| ID | Requirement | Priority |
|---|---|---|
| BIZ-007 | The website must be published on AWS | High |
| BIZ-008 | The AWS services used and their design rationale must be explainable | High |
| BIZ-009 | The GitHub README must include architecture diagrams, features, and reasons for technology choices | High |
| BIZ-010 | It must be possible to explain low-cost operation through a serverless architecture | High |
| BIZ-011 | The design must account for security, cost, and operational monitoring | High |

## 5.3 Monetization Requirements

| ID | Requirement | Priority |
|---|---|---|
| BIZ-012 | It must be possible to publish articles targeting SEO traffic | Medium |
| BIZ-013 | It must be possible to provide basic pages required for Google AdSense review | Medium |
| BIZ-014 | It must be possible to direct users to paid learning materials and note articles in the future | Medium |
| BIZ-015 | The layout must be able to accommodate advertisements | Low |
| BIZ-016 | It must be possible to extend the product with login, learning history, and paid features in the future | Low |

---

## 6. System Scope

## 6.1 MVP Implementation Scope

The MVP includes the following.

| Category | Implementation |
|---|---|
| Frontend | Home page, glossary, comparison pages, practice questions, architecture pages, blog, contact |
| Content | CLF glossary, CLF practice questions, AWS service comparisons, SAA architecture diagrams, SEO articles |
| Infrastructure | S3, CloudFront, Lambda, API Gateway, DynamoDB, CloudWatch, IAM |
| Operations | GitHub README, AWS architecture diagram, cost management, log inspection |
| Monetization preparation | Site operator information, privacy policy, contact page |

## 6.2 Outside MVP Implementation Scope

The MVP does not include the following.

| Category | Excluded functionality | Reason |
|---|---|---|
| Authentication | User registration and login | Reduce initial development cost |
| Payments | Billing features such as Stripe | Unnecessary before monetization |
| AI | AI-generated explanations | Avoid API costs |
| Learning history | Saved per-user accuracy rates | Implement after introducing Cognito |
| Administration interface | Question and article management interface | Markdown/JSON management is sufficient initially |
| Email delivery | Daily question email notifications | Defer EventBridge/SES introduction to Phase 2 or later |

---

## 7. Functional Requirements

## 7.1 Home Page

### Overview

Display the site's purpose, target users, and navigation paths to main content.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-001 | Site overview | Explain that this is an AWS certification learning site | High |
| F-002 | Main content navigation | Display links to the glossary, practice questions, comparisons, architecture diagrams, and blog | High |
| F-003 | Learning roadmap | Display the learning sequence from CLF to SAA | Medium |
| F-004 | Latest articles | List the latest blog articles | Medium |
| F-005 | Popular content | Display paths to frequently read articles and questions | Low |

### Acceptance Criteria

- Users can understand the site's purpose within 3 seconds
- The glossary, practice questions, and comparison pages are accessible in 1 click
- Main navigation paths are clear on mobile too

---

## 7.2 AWS Glossary

### Overview

Provide list and detail views of AWS service overviews, uses, exam points, and related services.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-006 | Terminology listing | List AWS services | High |
| F-007 | Categories | Display categories such as Compute, Storage, and Database | High |
| F-008 | Terminology detail | Display the service overview, uses, and exam points | High |
| F-009 | Related services | Display similar and related services | Medium |
| F-010 | Search | Search by service name or keyword | Medium |
| F-011 | Difficulty | Display beginner / intermediate and similar levels | Low |

### Display Fields

| Field | Details |
|---|---|
| Service name | Example: Amazon S3 |
| Abbreviation | Example: S3 |
| Category | Storage, Compute, Database, etc. |
| Overview | Short explanation for beginners |
| Main uses | Specific use cases |
| Exam points | Topics frequently tested in CLF/SAA |
| Similar services | Services to compare |
| Considerations | Billing, design, and security considerations |

### Acceptance Criteria

- Publish at least 30 AWS services
- Each service includes an overview, uses, and exam points
- The layout is readable on smartphones

---

## 7.3 Service Comparisons

### Overview

Use comparison tables and explanations to clarify differences between AWS services easily confused on exams.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-012 | Comparison article listing | List service comparison articles | High |
| F-013 | Comparison detail | Display differences between multiple services in tables | High |
| F-014 | Exam points | Display differences frequently tested in certification exams | High |
| F-015 | Practical selection guidance | Display how to choose services for actual use cases | Medium |
| F-016 | Related questions | Display practice questions related to the comparison | Low |

### Initial Comparisons

| ID | Comparison topic | Priority |
|---|---|---|
| CMP-001 | Differences between S3 / EBS / EFS | High |
| CMP-002 | Differences between RDS / DynamoDB | High |
| CMP-003 | Differences between SNS / SQS / EventBridge | High |
| CMP-004 | Differences between IAM users / IAM roles / IAM policies | High |
| CMP-005 | Differences between CloudWatch / CloudTrail / AWS Config | High |
| CMP-006 | Differences between ALB / NLB / CloudFront | Medium |
| CMP-007 | Differences between Multi-AZ / Read Replica | Medium |
| CMP-008 | Differences between Security Group / NACL | Medium |

### Acceptance Criteria

- At least 5 comparison articles exist
- Each comparison article includes a conclusion, comparison table, exam points, and practical selection guidance
- The writing makes the differences easy for beginners to understand

---

## 7.4 Practice Questions

### Overview

Let users answer AWS Cloud Practitioner practice questions and review correct answers and explanations.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-017 | Question listing | List practice questions | High |
| F-018 | Question detail | Display question text and choices | High |
| F-019 | Answer selection | Let users select a choice | High |
| F-020 | Correctness feedback | Show correct/incorrect feedback after an answer | High |
| F-021 | Explanation | Explain why the correct answer is correct and why other choices are incorrect | High |
| F-022 | Categories | Display domains such as Cloud Concepts and Security | Medium |
| F-023 | Difficulty | Display easy / normal / hard | Low |

### Initial Question Counts

| Exam | Question count |
|---|---:|
| Cloud Practitioner | 30 questions |
| SAA | Outside MVP scope. Add in Phase 2 or later |

### Question Data Fields

| Field | Details |
|---|---|
| Question ID | Unique ID |
| Exam | CLF-C02 / SAA-C03, etc. |
| Category | Exam domain |
| Question text | Question body |
| Choices | Four choices by default |
| Correct answer | Correct answer number |
| Explanation | Reason the answer is correct |
| Related services | Relevant AWS services |
| Difficulty | easy / normal / hard |

### Acceptance Criteria

- At least 30 Cloud Practitioner questions exist
- Each question has a correct answer and explanation
- Correctness feedback and an explanation appear after answering
- Usable without login

---

## 7.5 SAA Architecture Diagrams

### Overview

Teach AWS architecture patterns tested in SAA through diagrams and explanations.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-024 | Architecture diagram listing | List AWS architecture diagrams | Medium |
| F-025 | Architecture diagram detail | Display the diagram and design rationale | Medium |
| F-026 | Services used | Display AWS services included in the architecture | Medium |
| F-027 | Design points | Display availability, fault tolerance, cost, and security considerations | High |
| F-028 | Exam points | Display topics frequently tested in SAA | High |

### Initial Architecture Diagrams

| ID | Architecture diagram | Priority |
|---|---|---|
| ARC-001 | S3 + CloudFront static website architecture | High |
| ARC-002 | API Gateway + Lambda + DynamoDB serverless API architecture | High |
| ARC-003 | Three-tier web application architecture within a VPC | Medium |
| ARC-004 | ALB + Auto Scaling + RDS Multi-AZ highly available architecture | Medium |
| ARC-005 | EventBridge + Lambda batch-processing architecture | Medium |

### Acceptance Criteria

- Publish at least 5 AWS architecture diagrams
- Each diagram includes design rationale, services used, and exam points
- Explain why the architecture was chosen, rather than providing diagrams alone

---

## 7.6 Blog Articles

### Overview

Publish AWS learning articles to attract SEO traffic.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-029 | Article listing | List blog articles | Medium |
| F-030 | Article detail | Display the article body | Medium |
| F-031 | Categories | Categorize by CLF, SAA, Free Tier, architecture diagrams, etc. | Medium |
| F-032 | Tags | Tag articles with AWS service names and similar terms | Low |
| F-033 | Related articles | Display related articles | Low |

### Initial Article Count

Aim for at least 5 articles at MVP release and at least 20 before applying for AdSense.

### Acceptance Criteria

- At least 5 articles exist at MVP release
- Each article has a title, body, category, and update date
- Include site operator information, contact, and privacy policy pages before applying for AdSense

---

## 7.7 Contact

### Overview

Provide a form for receiving user inquiries, error reports, and work requests.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-034 | Contact form | Accept a name, email, subject, and message | Medium |
| F-035 | Input validation | Validate required fields and email format | High |
| F-036 | Contact submission | Submit through Lambda/API Gateway | Medium |
| F-037 | DynamoDB persistence | Save contact submissions | Medium |
| F-038 | Submission confirmation | Display a submission-complete message | High |
| F-039 | Spam prevention | Include a simple honeypot or similar measure | Low |

### Input Fields

| Field | Required | Constraint |
|---|---|---|
| Name | Required | Up to 100 characters |
| Email address | Required | Email format |
| Subject | Required | Up to 150 characters |
| Message | Required | Up to 2,000 characters |

### Acceptance Criteria

- Display an error when a required field is missing
- Display an error when the email format is invalid
- Display a completion message after successful submission
- Save contact submissions in DynamoDB

---

## 7.8 Site Operator Information and Privacy Policy

### Overview

Publish site operator information, contact details, and explanations of advertising and analytics.

### Feature List

| ID | Feature | Details | Priority |
|---|---|---|---|
| F-040 | Site operator information | Display the operator's profile, purpose, and contact details | Medium |
| F-041 | Privacy policy | Describe personal information, cookies, advertising, and analytics | Medium |
| F-042 | Disclaimer | Include disclaimers about learning-information accuracy and exam changes | Medium |

### Acceptance Criteria

- Site operator information and the privacy policy are accessible from the footer
- Content is consistent with the contact form
- Descriptions account for advertising and analytics

---

## 8. Nonfunctional Requirements

## 8.1 Availability

| ID | Requirement | Priority |
|---|---|---|
| NF-001 | Serve static content through S3 + CloudFront | High |
| NF-002 | The site should generally be available around the clock | High |
| NF-003 | Static articles and the glossary remain accessible during API failures | Medium |
| NF-004 | Reduce single points of failure where feasible | Medium |

## 8.2 Performance

| ID | Requirement | Priority |
|---|---|---|
| NF-005 | Aim for a perceived initial home-page load within 3 seconds | High |
| NF-006 | Compress images and architecture diagrams for delivery | Medium |
| NF-007 | Use CloudFront caching | High |
| NF-008 | Avoid excessive unnecessary JavaScript | Medium |

## 8.3 Security

| ID | Requirement | Priority |
|---|---|---|
| NF-009 | Keep S3 buckets private by default and serve content through CloudFront | High |
| NF-010 | Configure IAM permissions according to least privilege | High |
| NF-011 | Grant the Lambda execution role only the minimum necessary DynamoDB permissions | High |
| NF-012 | Implement contact-form input validation | High |
| NF-013 | Configure API Gateway rate limits as needed | Medium |
| NF-014 | Do not commit environment variables or secrets to GitHub | High |
| NF-015 | Serve over HTTPS | High |

## 8.4 Operations and Monitoring

| ID | Requirement | Priority |
|---|---|---|
| NF-016 | Lambda execution logs must be inspectable in CloudWatch Logs | High |
| NF-017 | CloudWatch Logs must support investigating error causes | High |
| NF-018 | Configure billing alerts with AWS Budgets | High |
| NF-019 | Configure CloudWatch Logs retention to prevent excessive log growth | Medium |
| NF-020 | Inspect the billing dashboard at least once a month | High |

## 8.5 Cost

| ID | Requirement | Priority |
|---|---|---|
| NF-021 | Do not use always-on EC2 instances | High |
| NF-022 | Do not use RDS in the MVP | High |
| NF-023 | Do not use NAT Gateway | High |
| NF-024 | Do not use ALB in the MVP | High |
| NF-025 | Minimize costs at low traffic volumes with a primarily serverless architecture | High |
| NF-026 | Delete unnecessary AWS resources | High |

## 8.6 Maintainability

| ID | Requirement | Priority |
|---|---|---|
| NF-027 | Manage content in Markdown or JSON | High |
| NF-028 | Manage AWS service information as structured data | High |
| NF-029 | Use a question-data format that makes later additions easy | High |
| NF-030 | Manage source code in GitHub | High |
| NF-031 | Include setup instructions in the README | High |

## 8.7 SEO

| ID | Requirement | Priority |
|---|---|---|
| NF-032 | Set a title and description for each article | Medium |
| NF-033 | Use an appropriate heading structure | Medium |
| NF-034 | Generate a sitemap | Medium |
| NF-035 | Configure robots.txt | Medium |
| NF-036 | Use clear alphanumeric URL slugs | Medium |

---

## 9. AWS Architecture Requirements

## 9.1 MVP Architecture

```text
User
  ↓
CloudFront
  ↓
S3 static site
  ↓
API Gateway
  ↓
Lambda
  ↓
DynamoDB

CloudWatch Logs: Log monitoring
IAM: Permission management
AWS Budgets: Billing monitoring
```

## 9.2 AWS Services Used

| Service | Purpose | MVP usage | Notes |
|---|---|---|---|
| S3 | Store static files | Required | Store frontend build output |
| CloudFront | CDN delivery | Required | HTTPS delivery and caching |
| API Gateway | Expose APIs | Required | Contact and question-retrieval APIs, etc. |
| Lambda | API processing | Required | Serverless processing |
| DynamoDB | Data storage | Required | Store questions, terminology, and contact submissions |
| CloudWatch | Log monitoring | Required | Inspect Lambda logs |
| IAM | Permission management | Required | Least-privilege design |
| AWS Budgets | Billing monitoring | Required | Prevent unexpected charges |
| Route 53 | Custom domain | Optional | When using a custom domain |
| ACM | SSL certificate | Optional | For CloudFront HTTPS |
| Cognito | Authentication | Future | Used for learning-history functionality |
| EventBridge | Scheduled execution | Future | Used for daily question delivery |
| SES | Email notifications | Future | Contact notifications and question delivery |

## 9.3 Reasons for Selecting AWS Services

### S3 + CloudFront

Deliver a static site quickly and at low cost. Publishing a website without EC2 makes this suitable for both Free Tier operation and a portfolio.

### Lambda + API Gateway

Suitable for API operations performed only when needed, such as contact submission and question retrieval. No always-on server is required, keeping costs low.

### DynamoDB

Used to store terminology, question, and contact data. Works well with a serverless architecture and helps keep small-scale operating costs low.

### CloudWatch

Used to inspect Lambda logs, investigate errors, and monitor operations. Demonstrates that the portfolio considers operations as well as development.

### IAM

Used for access control between AWS resources. Following least privilege demonstrates security design skills.

---

## 10. Data Requirements

## 10.1 Data Categories

| Data | Storage location | MVP usage | Contents |
|---|---|---|---|
| AWS terminology data | JSON or DynamoDB | Required | Service name, overview, uses, exam points |
| Practice-question data | JSON or DynamoDB | Required | Question text, choices, correct answer, explanation |
| Comparison article data | Markdown/MDX | Required | Comparison tables, explanations, exam points |
| Blog article data | Markdown/MDX | Required | SEO article body |
| Architecture diagram data | Markdown/images/JSON | Required | Diagram, services used, design rationale |
| Contact data | DynamoDB | Required | Name, email, subject, message, submission timestamp |
| Learning-history data | DynamoDB | Future | Per-user accuracy rates and review items |

## 10.2 Proposed DynamoDB Tables

### TermsTable

Store AWS terminology data.

| Attribute | Type | Contents |
|---|---|---|
| termId | string | Term ID. Example: s3 |
| name | string | Service name |
| category | string | Category |
| summary | string | Overview |
| useCase | string | Uses |
| examPoint | string | Exam points |
| relatedServices | list | Related services |
| difficulty | string | Difficulty |
| updatedAt | string | Update timestamp |

### QuestionsTable

Store practice-question data.

| Attribute | Type | Contents |
|---|---|---|
| questionId | string | Question ID |
| exam | string | Exam |
| category | string | Exam domain |
| question | string | Question text |
| choices | list | Choices |
| answer | number | Correct answer number |
| explanation | string | Explanation |
| relatedServices | list | Related services |
| difficulty | string | Difficulty |
| updatedAt | string | Update timestamp |

### ContactsTable

Store contact data.

| Attribute | Type | Contents |
|---|---|---|
| contactId | string | Contact ID |
| name | string | Name |
| email | string | Email address |
| subject | string | Subject |
| message | string | Message |
| createdAt | string | Submission timestamp |
| status | string | Handling status |

---

## 11. Screen Requirements

## 11.1 Screen List

| Screen ID | Screen name | Description | MVP |
|---|---|---|---|
| SCR-001 | Home page | Site overview and main navigation paths | In scope |
| SCR-002 | AWS glossary listing | AWS service listing | In scope |
| SCR-003 | AWS terminology detail | Detailed explanation of each service | In scope |
| SCR-004 | Service comparison listing | Comparison article listing | In scope |
| SCR-005 | Service comparison detail | Comparison tables and explanations | In scope |
| SCR-006 | Practice-question listing | Question and category listings | In scope |
| SCR-007 | Practice-question detail | Answer questions and display explanations | In scope |
| SCR-008 | Architecture diagram listing | AWS architecture diagram listing | In scope |
| SCR-009 | Architecture diagram detail | Diagram and design rationale | In scope |
| SCR-010 | Blog listing | Article listing | In scope |
| SCR-011 | Blog detail | Article body | In scope |
| SCR-012 | Contact | Contact form | In scope |
| SCR-013 | Site operator information | Profile and site purpose | In scope |
| SCR-014 | Privacy policy | Personal information, advertising, cookies | In scope |
| SCR-015 | Learning history | Accuracy rates and review items | Future |
| SCR-016 | Login | User authentication | Future |
| SCR-017 | My page | Learning status display | Future |

## 11.2 Shared Layout Requirements

| Item | Details |
|---|---|
| Header | Logo and links to the glossary, questions, comparisons, architecture diagrams, and blog |
| Footer | Site operator information, contact, privacy policy, and GitHub link |
| Responsive design | Support PCs, tablets, and smartphones |
| CTA | Paths to practice questions, the glossary, and the learning roadmap |
| Ad slots | Space allocation anticipating future AdSense placement |

---

## 12. External Integration Requirements

## 12.1 External Integrations Used in the MVP

| External service | Purpose | MVP usage |
|---|---|---|
| GitHub | Source code management | Required |
| Google Search Console | Inspect search traffic | Used in monetization preparation |
| Google Analytics | Traffic analytics | Used in monetization preparation |
| Google AdSense | Advertising revenue | Used in monetization preparation |

## 12.2 Future External Integrations

| External service | Purpose |
|---|---|
| note | Paid article sales and navigation paths |
| Stripe | Paid learning materials and monthly subscriptions |
| Slack | Daily question notifications |
| OpenAI API | AI-generated explanations |

---

## 13. Constraints

## 13.1 Cost Constraints

- Keep development and initial operating costs as close to zero as possible
- Prioritize the Free Tier
- Avoid architectures prone to ongoing charges
- Always configure AWS Budgets
- Custom domain costs are optional

## 13.2 Technical Constraints

- Use a serverless architecture as the MVP baseline
- Do not use RDS, always-on EC2, NAT Gateway, or ALB in the MVP
- Update content manually at first
- An administration interface is outside MVP scope

## 13.3 Schedule Constraints

- Aim to publish the MVP before the Cloud Practitioner exam at the end of June
- Expand architecture diagrams and design patterns before the SAA exam around August
- Begin full-scale monetization preparation after the SAA exam

## 13.4 Quality Constraints

- Create AWS service information after checking official sources
- Display update dates on articles
- Review regularly for changes in exam coverage and service specifications
- Create original practice questions rather than copying actual exam questions

---

## 14. Security Requirements

## 14.1 Access Control

| ID | Requirement |
|---|---|
| SEC-001 | Do not expose S3 buckets directly; serve through CloudFront |
| SEC-002 | Create IAM roles with least privilege |
| SEC-003 | Restrict Lambda access to DynamoDB to the relevant tables |
| SEC-004 | Do not store administrator AWS access keys in GitHub |
| SEC-005 | Manage CI/CD credentials with GitHub Secrets |

## 14.2 Input Validation

| ID | Requirement |
|---|---|
| SEC-006 | Validate contact-form input |
| SEC-007 | Validate email address format |
| SEC-008 | Set maximum input lengths |
| SEC-009 | Sanitize HTML tags and script input |

## 14.3 Communication

| ID | Requirement |
|---|---|
| SEC-010 | Serve the site over HTTPS |
| SEC-011 | Access the API over HTTPS too |
| SEC-012 | Keep CORS settings to the minimum necessary |

---

## 15. Cost Management Requirements

## 15.1 Required Settings

| ID | Requirement |
|---|---|
| COST-001 | Configure AWS Budgets |
| COST-002 | Send budget-overrun alerts by email |
| COST-003 | Configure CloudWatch Logs retention |
| COST-004 | Delete unnecessary resources regularly |
| COST-005 | Check AWS billing amounts monthly |

## 15.2 Services to Avoid

As a rule, do not use the following in the MVP.

| Service | Reason |
|---|---|
| Always-on EC2 | Charges accrue based on usage duration |
| RDS | Risk of fixed costs after the Free Tier ends |
| NAT Gateway | Charges can easily accrue even at small scale |
| ALB | Ongoing usage charges apply |
| Elastic IP | Risk of charges while unused |

---

## 16. SEO and Monetization Requirements

## 16.1 SEO Requirements

| ID | Requirement |
|---|---|
| SEO-001 | Set an appropriate title for each page |
| SEO-002 | Set a description for each page |
| SEO-003 | Use h1, h2, and h3 appropriately |
| SEO-004 | Design internal links |
| SEO-005 | Create a sitemap |
| SEO-006 | Create robots.txt |
| SEO-007 | Use clear article URL slugs |
| SEO-008 | Display update dates on articles |

## 16.2 AdSense Preparation Requirements

| ID | Requirement |
|---|---|
| ADS-001 | Prepare at least 20 original articles |
| ADS-002 | Provide a site operator information page |
| ADS-003 | Provide a contact page |
| ADS-004 | Provide a privacy policy page |
| ADS-005 | Avoid copied content |
| ADS-006 | Use a layout designed for advertising placement |

## 16.3 Monetization Path Requirements

| ID | Requirement |
|---|---|
| MON-001 | It must be possible to place links to paid note articles |
| MON-002 | It must be possible to direct users to PDF learning-material sales pages |
| MON-003 | Use an architecture that can support future paid membership functionality |

---

## 17. Development Environment Requirements

## 17.1 Local Environment

| Item | Details |
|---|---|
| OS | Both macOS and Windows 11 can be supported |
| Editor | VS Code |
| Node.js | LTS release |
| Python | 3.11 or later recommended |
| Package management | pnpm or npm |
| Version control | Git / GitHub |

## 17.2 Frontend Technologies

| Technology | Purpose |
|---|---|
| Next.js | Web application development |
| TypeScript | Type-safe implementation |
| Tailwind CSS | UI styling |
| Markdown/MDX | Article and explanatory content management |

## 17.3 Backend Technologies

| Technology | Purpose |
|---|---|
| AWS Lambda | API processing |
| Python | Lambda implementation language |
| API Gateway | Expose an HTTP API |
| DynamoDB | Data storage |

## 17.4 Infrastructure Management

| Stage | Policy |
|---|---|
| Initial | Build manually in the AWS Management Console |
| Medium term | Convert to IaC using AWS SAM or Terraform |
| Future | Automated deployment with GitHub Actions |

---

## 18. Development Phases

## Phase 0: Design Preparation

### Objective

Prepare the documentation, architecture, and repository needed before development.

### Tasks

- Create the project proposal
- Create the requirements definition document
- Create the screen list
- Design screen transitions
- Create the AWS architecture diagram
- Design the data
- Create the GitHub repository

### Deliverables

- Project proposal
- Requirements definition document
- Screen list and screen transition diagram
- AWS architecture diagram
- README draft

---

## Phase 1: Publish the CLF MVP

### Objective

Publish a minimal site reflecting Cloud Practitioner study material.

### Tasks

- Implement the home page
- Implement the glossary
- Implement service comparison pages
- Implement 30 practice questions
- Create 5 blog articles
- Publish with S3 + CloudFront
- Prepare the GitHub README

### Deliverables

- Published website
- CLF glossary
- CLF practice questions
- Service comparison articles
- GitHub README

---

## Phase 2: Add SAA Features

### Objective

Add content reflecting Solutions Architect Associate study material and demonstrating design skills.

### Tasks

- Create 5 SAA architecture diagrams
- Implement architecture diagram detail pages
- Introduce API Gateway + Lambda
- Integrate DynamoDB
- Implement the contact form
- Inspect CloudWatch Logs

### Deliverables

- SAA architecture diagram pages
- Serverless API
- DynamoDB integration
- Contact functionality

---

## Phase 3: Monetization Preparation

### Objective

Prepare for an AdSense application and SEO traffic.

### Tasks

- Create at least 20 blog articles
- Create site operator information
- Create a privacy policy
- Register with Google Search Console
- Configure Google Analytics
- Create a sitemap
- Prepare the AdSense application

### Deliverables

- SEO article collection
- A site ready for monetization
- Readiness to apply for AdSense

---

## Phase 4: Become a Learning Application

### Objective

Add login, learning history, and weakness analysis to extend the product into a learning application.

### Tasks

- Add Cognito authentication
- Save learning history
- Display accuracy rates
- Analyze weaknesses
- Add review functionality
- Deliver one question daily
- Add paths to paid content

### Deliverables

- Learning-management functionality
- Per-user data storage
- Foundation for a SaaS product

---

## 19. Acceptance Criteria

## 19.1 MVP Acceptance Criteria

The MVP is complete when the following criteria are met.

| ID | Acceptance criterion |
|---|---|
| AC-001 | The site is published on AWS |
| AC-002 | The home page displays |
| AC-003 | At least 30 AWS glossary entries exist |
| AC-004 | At least 5 service comparison articles exist |
| AC-005 | At least 30 CLF practice questions exist |
| AC-006 | Practice questions support answering, correctness feedback, and explanation display |
| AC-007 | At least 5 blog articles exist |
| AC-008 | The GitHub README includes an architecture diagram and reasons for technology choices |
| AC-009 | AWS Budgets is configured |
| AC-010 | Lambda logs can be inspected in CloudWatch Logs |

## 19.2 Phase 2 Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| AC-011 | At least 5 SAA architecture diagrams exist |
| AC-012 | Each diagram includes design rationale |
| AC-013 | The API using API Gateway + Lambda works |
| AC-014 | Data can be saved in DynamoDB |
| AC-015 | The contact form works |

## 19.3 Monetization Preparation Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| AC-016 | At least 20 articles exist |
| AC-017 | A site operator information page exists |
| AC-018 | A privacy policy page exists |
| AC-019 | A contact page exists |
| AC-020 | Google Search Console registration is complete |
| AC-021 | A sitemap exists |

---

## 20. Success Metrics

## 20.1 Learning Outcome Metrics

| Metric | Target |
|---|---:|
| Published CLF terms | At least 50 |
| CLF practice questions | At least 30 |
| Service comparison articles | At least 10 |
| SAA architecture diagrams | At least 5 |
| SAA articles | At least 10 |

## 20.2 Portfolio Metrics

| Metric | Target |
|---|---|
| Production URL | Published |
| GitHub README | Complete |
| AWS architecture diagram | Published |
| Technology explanations | Published |
| Cost optimization policy | Published |
| Security policy | Published |

## 20.3 Content-Site Metrics

| Metric | Initial target |
|---|---:|
| Article count | At least 20 |
| Monthly page views | 1,000 PV |
| Search traffic | Traffic is arriving |
| AdSense application | Complete |
| Path to note | Established |

---

## 21. Risks and Mitigations

## 21.1 Billing Risks

| Risk | Mitigation |
|---|---|
| Exceeding the AWS Free Tier | Configure AWS Budgets |
| Leaving unnecessary resources running | Inspect resources regularly |
| CloudWatch Logs keep growing | Configure retention |
| Using expensive services such as NAT Gateway | Prohibit them in the MVP |

## 21.2 Development Delay Risks

| Risk | Mitigation |
|---|---|
| Too many features prevent completion | Fix the MVP scope |
| Authentication and payments consume time | Defer them to Phase 4 or later |
| Content creation takes time | Turn CLF study material directly into articles |

## 21.3 Content Quality Risks

| Risk | Mitigation |
|---|---|
| AWS information becomes outdated | Display update dates and review regularly |
| Content diverges from exam coverage | Check official exam guides |
| Practice-question quality is low | Emphasize explanations and understanding over question count |

## 21.4 Monetization Risks

| Risk | Mitigation |
|---|---|
| AdSense review is unsuccessful | Prepare original articles, operator information, contact, and policy pages |
| Page views do not grow | Continue creating long-tail SEO articles |
| Revenue is low | Expand into paid note articles and PDF learning materials |

---

## 22. Design Documents to Create Next

After this requirements definition document, create the following design documents.

1. Screen list and screen transition design
2. AWS architecture diagram design
3. Data design
4. API design
5. Security design
6. Cost management design
7. Development task list
8. GitHub README draft

---

## 23. Conclusion

This product is a web learning site built as a portfolio demonstrating AWS implementation experience while turning AWS Cloud Practitioner and Solutions Architect Associate study into tangible output.

The MVP focuses on the glossary, service comparisons, practice questions, architecture diagrams, and blog articles, and is published with a serverless architecture using S3, CloudFront, Lambda, API Gateway, and DynamoDB.

Initially, do not implement login, payments, or AI features. First complete the product as a learning content site that can be published at low cost. Then gradually expand it with SAA preparation content, contact functionality, SEO articles, AdSense preparation, and learning-history functionality.
