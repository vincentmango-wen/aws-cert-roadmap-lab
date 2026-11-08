# Technology Stack Decision Memo

## 1. Document Information

| Item | Details |
|---|---|
| Document name | Technology Stack Decision Memo |
| Target product | AWS Cert Roadmap Lab |
| Target task | P0-006 Finalize the technology stack |
| Created | 2026-05-30 |
| Purpose | Finalize the technology stack for MVP development |

---

## 2. Conclusion

The MVP of AWS Cert Roadmap Lab will use the following technology stack.

| Area | Selected technology |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| Routing | App Router |
| Styling | Tailwind CSS |
| Content management | JSON / Markdown / MDX |
| Backend | AWS Lambda |
| Lambda implementation language | Python 3.11 or later |
| API | Amazon API Gateway HTTP API |
| Database | Amazon DynamoDB |
| Static site delivery | Amazon S3 + Amazon CloudFront |
| S3 access control | CloudFront Origin Access Control |
| Logging | Amazon CloudWatch Logs |
| Billing monitoring | AWS Budgets |
| Permission management | IAM |
| CI/CD | GitHub Actions |
| AWS authentication | GitHub OIDC |
| Package management | npm |
| Local Node.js | Node.js LTS |
| Local Python | Python 3.11 or later |

---

## 3. Frontend

### 3.1 Selected Technologies

| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| TypeScript | Type-safe development |
| App Router | Page routing |
| Tailwind CSS | UI styling |
| JSON | Managing AWS terminology and practice-question data |
| Markdown / MDX | Managing blog posts, comparison articles, and architecture explanations |

### 3.2 Reasons for Selection

Next.js is selected for the following reasons.

- Can export a static site
- Easy to serve with S3 + CloudFront
- Easy to create SEO pages
- Easy to build UI with React
- Easy to explain as a portfolio project

TypeScript is selected for the following reasons.

- Can define types for terminology data, question data, and article metadata
- Makes implementation errors easier to detect in advance
- Can manage API response formats through types
- Widely used in professional development

Tailwind CSS is selected for the following reasons.

- Enables fast UI development for a small MVP
- Avoids creating too many CSS files
- Makes responsive design straightforward
- Helps maintain design consistency

### 3.3 Next.js Configuration Policy

Static export is the baseline for delivery through S3 + CloudFront.

```js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## 4. Content Management
### 4.1 Selected Approach

In the MVP, learning content other than contact submissions is managed as static files.
| Data | Storage format | Storage location |
| ------ | ----------- | ------------------------------------------ |
| AWS terminology | JSON | `frontend/contents/terms/terms.json` |
| Practice questions | JSON | `frontend/contents/questions/clf-c02.json` |
| Service comparisons | MDX | `frontend/contents/comparisons/` |
| Architecture explanations | MDX | `frontend/contents/architectures/` |
| Blog posts | MDX | `frontend/contents/blog/` |
| Site operator information | MDX or TSX | `frontend/contents/site/` |


### 4.2 Reasons for Selection
- Keeps AWS costs low
- Can generate SEO-friendly static pages
- Makes CloudFront caching easy to use
- Speeds up MVP development
- Reduces the likelihood of getting stuck on DynamoDB design

## 5. Backend
### 5.1 Selected Technologies
| Technology | Purpose |
| -------------------- | ------------------- |
| AWS Lambda | Saving contact submissions |
| Python 3.11 or later | Lambda implementation language |
| API Gateway HTTP API | Exposing `POST /contact` |
| DynamoDB | Storing contact data |
| CloudWatch Logs | Inspecting Lambda logs |

### 5.2 Reasons for Selection

Lambda + API Gateway + DynamoDB are selected for the following reasons.

- No always-on server is required
- Makes it easy to keep a solo-developed MVP inexpensive
- Directly relates to AWS certification study topics
- Easy to explain as a serverless API architecture
- Provides practice with SAA design patterns

Python is selected for the following reasons.

- Works well with Lambda
- Readable implementation
- Easy to connect to future AI explanation features
- Builds on existing Python learning experience

### 5.3 API Implemented in the MVP
| Method | Path | Purpose |
| ---- | ---------- | ------- |
| POST | `/contact` | Submit a contact inquiry |

The MVP does not expose AWS terminology, practice questions, blogs, comparison articles, or architecture diagrams through APIs.

## 6. AWS Architecture
### 6.1 MVP Architecture
```
User
  ↓ HTTPS
CloudFront
  ↓ OAC
S3 Static Site

User
  ↓ POST /contact
API Gateway HTTP API
  ↓
Lambda Python
  ↓ PutItem
DynamoDB ContactsTableProd
  ↓
CloudWatch Logs
```

### 6.2 Selected AWS Services
| Service | Purpose |
| ---------------------- | ------------- |
| Amazon S3 | Storing static files |
| Amazon CloudFront | CDN delivery and HTTPS delivery |
| CloudFront OAC | Preventing direct public access to S3 |
| Amazon API Gateway | Exposing the contact API |
| AWS Lambda | Saving contact submissions |
| Amazon DynamoDB | Storing contact data |
| Amazon CloudWatch Logs | Inspecting Lambda logs |
| AWS Budgets | Billing monitoring |
| IAM | Least-privilege permission management |

### 6.3 AWS Services Not Used in the MVP
| Service | Reason for not using it |
| ----------- | -------------------- |
| EC2 | Avoid always-on running costs |
| RDS | The MVP does not need a relational database |
| NAT Gateway | Prone to fixed costs |
| ALB | Prone to ongoing charges |
| ECS / EKS | Too much architectural overhead for a solo-developed MVP |
| OpenSearch | Excessive for search functionality at the initial stage |
| SageMaker | AI features are outside MVP scope |
| WAF | Adds cost to the MVP |
| Cognito | Login functionality is outside MVP scope |
| SES | Email notifications are outside MVP scope |

## 7. CI/CD
### 7.1 Selected Technologies
| Technology | Purpose |
| -------------- | --------------------------------- |
| GitHub Actions | CI/CD |
| GitHub OIDC | Temporary authentication to AWS |
| AWS CLI | S3 sync / CloudFront Invalidation |


### 7.2 CI Policy

Run the following on a pull request or push.

- lint
- typecheck
- build

### 7.3 CD Policy

After changes reach the main branch, run the following.
```
GitHub Actions
  ↓
Next.js build
  ↓
S3 sync
  ↓
CloudFront Invalidation
  ↓
Production deployment
```

### 7.4 AWS Authentication Policy

Use GitHub OIDC as the default approach.

Reasons:

- No need to store long-term AWS access keys in GitHub Secrets
- Permissions can be managed through an IAM Role
- Access can be restricted to a specific repository and the main branch
- Demonstrates security awareness in the portfolio

## 8. Package Management
### 8.1 Selection

Use npm for the MVP.

### 8.2 Reasons for Selection
- Included with Node.js by default
- Simple initial setup
- Straightforward GitHub Actions configuration
- Sufficient for a solo-developed MVP
- pnpm workspaces can be considered once the frontend / backend separation is established
### 8.3 Future Consideration

Consider pnpm workspaces if monorepo management becomes cumbersome in Phase 1 or later.

However, use npm alone during the initial MVP stage.

## 9. Local Development Environment
### 9.1 Required
| Tool | Version policy |
| ------- | ---------- |
| Node.js | LTS release |
| npm | Version bundled with Node.js |
| Python | 3.11 or later |
| Git | Latest stable release |
| VS Code | Recommended |

### 9.2 Optional
| Tool | Purpose |
| ------- | ---------------------- |
| AWS CLI | S3 sync / AWS inspection |
| SAM CLI | Lambda/IaC management from Phase 2 onward |
| pnpm | Future package-management candidate |


## 10. Technologies Not Selected
| Technology | Reason for not selecting it |
| ---------------- | ------------------------------------------- |
| Astro | Next.js is easier to extend into a learning application later |
| Nuxt | Standardize on React / Next.js rather than Vue |
| Express | Lambda + API Gateway are sufficient |
| FastAPI | Avoid an always-running API server architecture |
| RDS / PostgreSQL | The MVP only stores contact submissions and does not need an RDB |
| Prisma | The MVP does not use an RDB |
| Docker | Avoid adding architectural components in the initial MVP |
| Terraform | Prioritize understanding the AWS console initially; consider IaC starting with SAM in Phase 2 or later |
| Amplify Hosting | Building S3 + CloudFront directly provides more AWS learning value |

## 11. Impact on Subsequent Tasks
| Subsequent task | Impact |
| ------ | ----------------------------------------------------- |
| P0-007 | Verify Node.js LTS, npm, and Python 3.11 or later |
| P1-001 | Create the project with Next.js + TypeScript + App Router + Tailwind CSS |
| P1-004 | Configure `output: 'export'` |
| P1-010 | Create AWS terminology data in JSON |
| P1-013 | Create CLF-C02 question data in JSON |
| P2-014 | Implement Lambda in Python |
| P3-001 | Run lint / typecheck / build through npm scripts |
| P3-009 | Deploy `frontend/out` to S3 |

12. Completion Criteria

P0-006 is complete when all of the following are satisfied.

- Next.js is confirmed as a selected technology
- TypeScript is confirmed as a selected technology
- Tailwind CSS is confirmed as a selected technology
- The decision to use App Router is finalized
- The decision to use Static Export is finalized
- The decision to implement Lambda in Python 3.11 or later is finalized
- The AWS architecture is finalized as S3 + CloudFront + OAC + API Gateway + Lambda + DynamoDB + CloudWatch Logs + AWS Budgets + IAM
- npm is selected as the initial package manager
