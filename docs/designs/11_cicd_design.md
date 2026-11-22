AWS Certification Study Site CI/CD Design

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Study Site CI/CD Design|
|Target product|AWS Certification Roadmap Lab|
|Target phases|MVP development through Phase 4 learning application|
|Purpose|Define guidelines for safe, low-cost deployment of the frontend, Lambda, and infrastructure using GitHub Actions|
|Target repository|GitHub Repository|
|CI/CD platform|GitHub Actions|
|Deployment targets|Amazon S3 / Amazon CloudFront / AWS Lambda / Amazon API Gateway / DynamoDB|

  

2. Purpose of This Design

This document defines the CI/CD design for the AWS certification study site, AWS Certification Roadmap Lab.

The MVP initially automates the following.

Push to the GitHub main branch

  ↓

Start GitHub Actions

  ↓

Frontend Lint / Build

  ↓

Generate Next.js static files

  ↓

Upload to S3

  ↓

Invalidate the CloudFront cache

  ↓

Update the production site

In principle, MVP automation covers deployment of the static frontend site.

Automated deployment of backend and infrastructure components such as Lambda/API Gateway/DynamoDB will be introduced gradually in Phase 2 or later.

Reasons:

- Keep the initial MVP architecture simple
- Avoid unexpected charges and accidental deletion
- Deepen understanding of each service through AWS console operations
- Prioritize an actual public release first

  

3. Basic CI/CD Guidelines

3.1 Basic Guidelines

|   |   |
|---|---|
|Guideline|Description|
|Focus on automated frontend deployment in the MVP|Automate static file delivery through S3 + CloudFront|
|Deploy to production only from main|Do not deploy feature branches or PRs to production|
|Validate only on PRs|Run only lint, typecheck, and build|
|OIDC recommended for AWS authentication|Aim for a setup without long-term access keys in GitHub Secrets|
|Access keys acceptable initially|A simple method is acceptable early in learning, but ultimately migrate to OIDC|
|Least-privilege IAM|Allow GitHub Actions only S3 deployment and CloudFront Invalidation|
|Avoid excessive invalidations|Invalidate the CloudFront cache only during main deployments|
|Defer automated Lambda deployment|Introduce after the MVP release and migration to SAM|
|Do not grant infrastructure deletion permissions|Do not allow GitHub Actions to operate IAM/RDS/EC2 and similar services|
|Make deployment results explainable in the README|Be able to explain the CI/CD architecture as part of the portfolio|

  

4. CI/CD Scope

4.1 MVP Scope

|   |   |   |
|---|---|---|
|Target|Automation|Description|
|Frontend Lint|Included|Code quality checks|
|TypeScript type checking|Included|Detect type errors|
|Frontend Build|Included|Next.js static build|
|S3 deployment|Included|Sync out/ to S3|
|CloudFront Invalidation|Included|Invalidate the cache after deployment|
|Lambda deployment|Excluded|Manual or separate deployment in the MVP|
|DynamoDB creation|Excluded|Manual setup in the MVP|
|API Gateway creation|Excluded|Manual setup in the MVP|
|CloudFront creation|Excluded|Manual setup in the MVP|

4.2 Scope for Phase 2 and Later

|   |   |   |
|---|---|---|
|Target|Automation|Description|
|Lambda zip deployment|Phase 2|Automate Lambda code updates|
|SAM deployment|Phase 2 or later|Manage API Gateway / Lambda / DynamoDB as IaC|
|Automated tests|Phase 2|Lambda unit tests|
|dev/prod separation|Phase 3 or later|Separate test and production environments|
|Cognito-related resources|Phase 4|Consider when building the learning application|

  

5. Overall CI/CD Architecture

5.1 MVP Architecture Diagram

flowchart TD

    Dev[Developer]

    GH[GitHub Repository]

    Actions[GitHub Actions]

    Build[Lint / TypeCheck / Build]

    OIDC[GitHub OIDC or Secrets]

    IAM[IAM Deploy Role]

    S3[(S3 Bucket)]

    CF[CloudFront]

    User[User]

  

    Dev -->|push / pull request| GH

    GH -->|trigger| Actions

    Actions --> Build

    Actions -->|Assume Role or Access Key| OIDC

    OIDC --> IAM

    IAM -->|aws s3 sync| S3

    IAM -->|create-invalidation| CF

    User -->|HTTPS| CF

    CF --> S3

5.2 MVP Processing Flow

1. The developer works on a feature branch

2. Push to GitHub

3. Create a Pull Request

4. Run lint/typecheck/build in GitHub Actions

5. Merge into main if there are no problems

6. A push to main triggers the production deployment Workflow

7. Build frontend

8. Sync the contents of out/ to S3

9. Run CloudFront Invalidation

10. Check the production site through CloudFront

  

11. Branch Strategy

6.1 MVP Branch Structure

|   |   |   |
|---|---|---|
|Branch|Purpose|Deployment|
|main|Production updates|Deploy to production S3|
|feature/*|Feature development|No deployment|
|fix/*|Bug fixes|No deployment|
|docs/*|Documentation changes|No deployment, but reflected after merging into main|

6.2 Basic Workflow

Work on a feature branch

  ↓

Create a Pull Request

  ↓

Run CI

  ↓

Review or self-check

  ↓

Merge into main

  ↓

Deploy to production

6.3 Complex Strategies Not Used in the MVP

Do not use the following in the MVP.

|   |   |
|---|---|
|Strategy|Reason not adopted|
|Git Flow|Too heavyweight for individual development|
|release branch|Unnecessary in the MVP|
|Strict hotfix branch workflow|Excessive for a small project|
|Simultaneous deployment to multiple environments|Increases cost and management overhead|

  

7. GitHub Actions Workflow List

7.1 MVP Workflow

|   |   |   |   |
|---|---|---|---|
|Workflow|File|Trigger|Purpose|
|CI|.github/workflows/ci.yml|pull_request / push|lint/typecheck/build|
|Deploy Frontend|.github/workflows/deploy-frontend.yml|main push / manual|Deploy to S3 + CloudFront|

7.2 Workflows for Phase 2 and Later

|   |   |   |   |
|---|---|---|---|
|Workflow|File|Trigger|Purpose|
|Deploy Lambda|.github/workflows/deploy-lambda.yml|backend changes|Lambda zip deployment|
|Deploy SAM|.github/workflows/deploy-sam.yml|infra changes|SAM deployment|
|Security Check|.github/workflows/security.yml|pull_request|Dependency and secret checks|
|Content Validate|.github/workflows/content-validate.yml|pull_request|JSON/MDX format checks|

  

8. CI Design

8.1 Purpose of CI

At minimum, verify the following on Pull Requests and pushes.

- Dependency installation succeeds
- ESLint passes
- TypeScript type checking passes
- Next.js build succeeds
- Static output is generated

8.2 CI Triggers

on:

  pull_request:

    branches:

      - main

  push:

    branches:

      - main

      - 'feature/**'

      - 'fix/**'

      - 'docs/**'

8.3 CI Steps

1. checkout

2. Set up Node.js

3. Install dependencies

4. lint

5. typecheck

6. build

8.4 ci.yml Example: npm Version

name: CI

  

on:

  pull_request:

    branches:

      - main

  push:

    branches:

      - main

      - 'feature/**'

      - 'fix/**'

      - 'docs/**'

  

jobs:

  frontend-ci:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: npm

          cache-dependency-path: frontend/package-lock.json

  

      - name: Install dependencies

        run: npm ci

  

      - name: Lint

        run: npm run lint

  

      - name: Type check

        run: npm run typecheck

  

      - name: Build

        run: npm run build

8.5 ci.yml Example: pnpm Version

name: CI

  

on:

  pull_request:

    branches:

      - main

  push:

    branches:

      - main

      - 'feature/**'

      - 'fix/**'

      - 'docs/**'

  

jobs:

  frontend-ci:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup pnpm

        uses: pnpm/action-setup@v4

        with:

          version: 9

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: pnpm

          cache-dependency-path: frontend/pnpm-lock.yaml

  

      - name: Install dependencies

        run: pnpm install --frozen-lockfile

  

      - name: Lint

        run: pnpm lint

  

      - name: Type check

        run: pnpm typecheck

  

      - name: Build

        run: pnpm build

8.6 package.json scripts Example

{

  "scripts": {

    "dev": "next dev",

    "build": "next build",

    "lint": "next lint",

    "typecheck": "tsc --noEmit"

  }

}

8.7 CI Completion Criteria

|   |   |
|---|---|
|ID|Condition|
|CI-001|CI runs when a Pull Request is created|
|CI-002|lint succeeds|
|CI-003|typecheck succeeds|
|CI-004|build succeeds|
|CI-005|Do not merge into main if CI fails|

  

9. CD Design: Frontend Deployment

9.1 Purpose of CD

Automatically deploy code merged into the main branch to S3 + CloudFront.

9.2 CD Triggers

|   |   |
|---|---|
|Trigger|Description|
|push to main|Automatic deployment|
|workflow_dispatch|Manual deployment|

9.3 CD Steps

1. checkout

2. Set up Node.js

3. Install dependencies

4. lint

5. typecheck

6. build

7. Authenticate with AWS

8. S3 sync

9. CloudFront Invalidation

10. Display deployment results

9.4 AWS Deployment Methods

Define two methods for the MVP.

|   |   |   |
|---|---|---|
|Method|Recommendation|Description|
|OIDC|Recommended|GitHub Actions assumes an AWS IAM Role using temporary credentials|
|Access keys|Acceptable only initially|Store AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in GitHub Secrets|

  

10. AWS Authentication: OIDC Recommended

10.1 Purpose of OIDC

Avoid storing long-term access keys in GitHub Secrets when accessing AWS from GitHub Actions.

With OIDC, GitHub Actions assumes an AWS IAM Role using a temporary token.

10.2 OIDC Benefits

|   |   |
|---|---|
|Benefit|Description|
|No long-term access keys|Do not store AWS_SECRET_ACCESS_KEY in GitHub|
|Lower exposure risk|Use temporary credentials|
|Easier permission management|Grant least privilege to the IAM Role|
|Stronger portfolio evaluation|Easier to demonstrate security awareness|

10.3 OIDC Components

|   |   |
|---|---|
|Component|Description|
|GitHub OIDC Provider|Register GitHub as a trusted identity provider in AWS IAM|
|IAM Role|Role assumed by GitHub Actions|
|Trust Policy|Allow AssumeRole only from a specific repository and branch|
|Workflow permissions|Grant id-token: write|
|aws-actions/configure-aws-credentials|Action for AWS authentication through OIDC|

10.4 IAM OIDC Provider Creation Overview

1. Open the IAM console

2. Select Identity providers

3. Select Add provider

4. Select OpenID Connect

5. Enter https://token.actions.githubusercontent.com as the Provider URL

6. Enter sts.amazonaws.com as the Audience

7. Create the provider

10.5 Create an IAM Role for GitHub Actions

Example Role name:

github-actions-deploy-role-prod

10.6 Trust Policy Example

Replace <account-id>, <github-owner>, and <repo-name>.

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Effect": "Allow",

      "Principal": {

        "Federated": "arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com"

      },

      "Action": "sts:AssumeRoleWithWebIdentity",

      "Condition": {

        "StringEquals": {

          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"

        },

        "StringLike": {

          "token.actions.githubusercontent.com:sub": "repo:<github-owner>/<repo-name>:ref:refs/heads/main"

        }

      }

    }

  ]

}

10.7 Note: Using an environment

When using GitHub Environments, the OIDC sub condition may change.

Start with a main branch condition.

Review the Trust Policy if a production environment is introduced later.

  

11. IAM Permissions for GitHub Actions

11.1 Required Permissions

Grant only the permissions needed for frontend deployment.

|   |   |
|---|---|
|Permission|Purpose|
|s3:ListBucket|Check differences during S3 sync|
|s3:PutObject|Upload files|
|s3:DeleteObject|Delete unnecessary files when using --delete|
|cloudfront:CreateInvalidation|Invalidate the CloudFront cache|

11.2 IAM Policy Example

Replace <bucket-name>, <account-id>, and <distribution-id>.

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Sid": "AllowListDeployBucket",

      "Effect": "Allow",

      "Action": [

        "s3:ListBucket"

      ],

      "Resource": "arn:aws:s3:::<bucket-name>"

    },

    {

      "Sid": "AllowWriteDeployBucketObjects",

      "Effect": "Allow",

      "Action": [

        "s3:PutObject",

        "s3:DeleteObject"

      ],

      "Resource": "arn:aws:s3:::<bucket-name>/*"

    },

    {

      "Sid": "AllowCloudFrontInvalidation",

      "Effect": "Allow",

      "Action": [

        "cloudfront:CreateInvalidation"

      ],

      "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

    }

  ]

}

11.3 Permissions Not Granted

|   |   |
|---|---|
|Permission|Reason|
|AdministratorAccess|Excessive permissions|
|iam:*|Privilege escalation risk|
|s3:*|Risk of operating on unrelated buckets|
|cloudfront:*|Dangerous because it permits Distribution changes and deletion|
|dynamodb:*|Unnecessary for frontend deployment|
|lambda:*|Unnecessary for frontend deployment|
|apigateway:*|Unnecessary for frontend deployment|
|ec2:*|Unnecessary|
|rds:*|Unnecessary|

  

12. GitHub Secrets / Variables Design

12.1 Secrets / Variables Required for OIDC

AWS access keys are unnecessary with OIDC.

|   |   |   |
|---|---|---|
|Type|Name|Description|
|Secret or Variable|AWS_ROLE_ARN|ARN of the IAM Role to assume|
|Variable|AWS_REGION|ap-northeast-1|
|Secret or Variable|S3_BUCKET_NAME|Destination S3 bucket name|
|Secret or Variable|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|
|Variable|NEXT_PUBLIC_API_BASE_URL|API Gateway URL|
|Variable|NEXT_PUBLIC_SITE_URL|Site URL|

12.2 Secrets Required for Access-Key Authentication

Acceptable only initially.

|   |   |
|---|---|
|Secret name|Description|
|AWS_ACCESS_KEY_ID|Access key for the deployment IAM user|
|AWS_SECRET_ACCESS_KEY|Secret for the deployment IAM user|
|AWS_REGION|ap-northeast-1|
|S3_BUCKET_NAME|Destination S3 bucket name|
|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|

12.3 Values Not to Store in Secrets

|   |   |
|---|---|
|Value|Reason|
|Root user access keys|Do not create them at all|
|Personal email password|Unnecessary|
|DynamoDB data|Actual data, not secrets|
|JWT|Issued at runtime|
|Contact data|Do not store in GitHub|

12.4 Choosing Variables or Secrets

|   |   |   |
|---|---|---|
|Type|Example|Guideline|
|Secret|AWS_SECRET_ACCESS_KEY|Secret information|
|Secret|AWS_ROLE_ARN|Values to hide even if not secret|
|Variable|AWS_REGION|Values safe to disclose|
|Variable|NEXT_PUBLIC_SITE_URL|Values intended to be public|

  

13. Deploy Frontend Workflow: OIDC Version

13.1 deploy-frontend.yml

name: Deploy Frontend

  

on:

  push:

    branches:

      - main

    paths:

      - 'frontend/**'

      - '.github/workflows/deploy-frontend.yml'

  workflow_dispatch:

  

permissions:

  id-token: write

  contents: read

  

jobs:

  deploy-frontend:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: npm

          cache-dependency-path: frontend/package-lock.json

  

      - name: Install dependencies

        run: npm ci

  

      - name: Lint

        run: npm run lint

  

      - name: Type check

        run: npm run typecheck

  

      - name: Build

        run: npm run build

        env:

          NEXT_PUBLIC_API_BASE_URL: ${{ vars.NEXT_PUBLIC_API_BASE_URL }}

          NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL }}

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: Deploy to S3

        run: |

          aws s3 sync ./out s3://${{ secrets.S3_BUCKET_NAME }} --delete

  

      - name: Invalidate CloudFront

        run: |

          aws cloudfront create-invalidation \

            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

            --paths "/*"

13.2 Key Points

|   |   |
|---|---|
|Item|Description|
|permissions.id-token|Required for OIDC|
|role-to-assume|AWS IAM Role ARN|
|paths|Deploy only when frontend changes|
|aws s3 sync --delete|Synchronize S3 and out, deleting unnecessary files|
|create-invalidation|Invalidate the CloudFront cache|

13.3 OIDC Version Acceptance Criteria

|   |   |
|---|---|
|ID|Condition|
|CD-OIDC-001|AWS_SECRET_ACCESS_KEY is absent from GitHub Secrets|
|CD-OIDC-002|id-token: write is configured|
|CD-OIDC-003|The IAM Role can be assumed|
|CD-OIDC-004|Deployment is possible only from the main branch|
|CD-OIDC-005|S3 sync succeeds|
|CD-OIDC-006|CloudFront Invalidation succeeds|

  

14. Deploy Frontend Workflow: Access-Key Version

14.1 Positioning

The access-key version is acceptable for initial learning and verification.

However, ultimately migrate to OIDC.

14.2 deploy-frontend.yml

name: Deploy Frontend

  

on:

  push:

    branches:

      - main

    paths:

      - 'frontend/**'

      - '.github/workflows/deploy-frontend.yml'

  workflow_dispatch:

  

permissions:

  contents: read

  

jobs:

  deploy-frontend:

    runs-on: ubuntu-latest

  

    defaults:

      run:

        working-directory: frontend

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

          cache: npm

          cache-dependency-path: frontend/package-lock.json

  

      - name: Install dependencies

        run: npm ci

  

      - name: Lint

        run: npm run lint

  

      - name: Type check

        run: npm run typecheck

  

      - name: Build

        run: npm run build

        env:

          NEXT_PUBLIC_API_BASE_URL: ${{ vars.NEXT_PUBLIC_API_BASE_URL }}

          NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL }}

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}

          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: Deploy to S3

        run: |

          aws s3 sync ./out s3://${{ secrets.S3_BUCKET_NAME }} --delete

  

      - name: Invalidate CloudFront

        run: |

          aws cloudfront create-invalidation \

            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

            --paths "/*"

14.3 Access-Key Authentication Notes

|   |   |
|---|---|
|Caution|Description|
|Long-term key exposure risk|Storing keys in GitHub Secrets does not eliminate exposure risk|
|Root keys prohibited|Never use root user access keys|
|Least privilege|Grant the deployment IAM user only minimal S3/CloudFront permissions|
|Key removal|Delete access keys after migrating to OIDC|
|Rotation|Rotate regularly if using them long-term|

  

15. CloudFront Invalidation Design

15.1 Purpose

Serve the latest files uploaded to S3 through CloudFront.

15.2 Initial Guidelines

The following is sufficient for the MVP.

aws cloudfront create-invalidation \

  --distribution-id <distribution-id> \

  --paths "/*"

15.3 Cost and Operational Notes

Invalidating /* is convenient, but do not run it too frequently.

It is acceptable in the MVP because deployments are infrequent.

Consider the following for full-scale operation.

|   |   |
|---|---|
|Improvement|Description|
|Hashed filenames|Refresh JS/CSS/assets caches by changing filenames|
|Invalidate HTML only|Invalidate only /index.html and major HTML files|
|Control deployment frequency|Run only when merging into main|
|Manual execution|An option is to run only through workflow_dispatch|

15.4 Future Invalidation Optimization Example

aws cloudfront create-invalidation \

  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \

  --paths "/index.html" "/terms/*" "/blog/*"

  

16. S3 sync Design

16.1 Basic Command

aws s3 sync ./out s3://<bucket-name> --delete

16.2

--delete

Meaning

Delete files from S3 that do not exist in the local out/ directory.

Benefits:

- Old pages do not remain
- Deleted articles do not remain in S3
- Production stays consistent with build artifacts

Cautions:

- An incorrect output directory risks unintended deletion of S3 files
- Always verify working-directory: frontend and ./out
- Do not use the wrong destination bucket name

16.3 Future Cache-Control Proposal

Using different Cache-Control settings for HTML and static assets makes CloudFront operation more stable.

HTML

aws s3 sync ./out s3://$S3_BUCKET_NAME \

  --exclude "*" \

  --include "*.html" \

  --cache-control "no-cache"

assets

aws s3 sync ./out s3://$S3_BUCKET_NAME \

  --exclude "*.html" \

  --cache-control "public,max-age=31536000,immutable"

Avoid excessive complexity in the MVP; ordinary sync is sufficient initially.

  

17. Next.js Static Output Design

17.1 next.config Settings

const nextConfig = {

  output: 'export',

  images: {

    unoptimized: true,

  },

};

  

export default nextConfig;

17.2 Notes

|   |   |
|---|---|
|Item|Caution|
|API Routes|Do not use with static export|
|Server Actions|Do not use on the static site|
|dynamic rendering|Design for static generation|
|next/image|Set unoptimized: true for static export|
|Contact API|Use API Gateway + Lambda, not Next.js API Routes|

17.3 Build Artifacts

frontend/out/

├── index.html

├── terms/

├── questions/

├── contact/

├── _next/

└── images/

17.4 Checks to Perform in CI

|   |   |
|---|---|
|Item|Check|
|out/ is generated|Required|
|index.html exists|Required|
|HTML exists for major pages|Required|
|Images are included|Required|

  

18. Environment Variable Design

18.1 Frontend Environment Variables

|   |   |   |
|---|---|---|
|Variable|Description|Public?|
|NEXT_PUBLIC_API_BASE_URL|API Gateway URL|May be public|
|NEXT_PUBLIC_SITE_URL|CloudFront URL or custom domain|May be public|

18.2 GitHub Variables Examples

|   |   |
|---|---|
|Variable|Example|
|AWS_REGION|ap-northeast-1|
|NEXT_PUBLIC_API_BASE_URL|https://xxxxx.execute-api.ap-northeast-1.amazonaws.com|
|NEXT_PUBLIC_SITE_URL|https://xxxxx.cloudfront.net|

18.3 GitHub Secrets Examples

|   |   |
|---|---|
|Secret|Example|
|AWS_ROLE_ARN|arn:aws:iam:::role/github-actions-deploy-role-prod|
|S3_BUCKET_NAME|aws-cert-roadmap-lab-prod-vincent-2026|
|CLOUDFRONT_DISTRIBUTION_ID|EXXXXXXXXXXXXX|

18.4 Notes

Variables prefixed with NEXT_PUBLIC_ are exposed to the browser.

Never put the following in them.

AWS_SECRET_ACCESS_KEY

OPENAI_API_KEY

DATABASE_PASSWORD

JWT_SECRET

  

19. Path Filter Design

19.1 Purpose

Reduce unnecessary Workflow runs, CI/CD time, and redundant deployments.

19.2 Frontend Deployment Paths

paths:

  - 'frontend/**'

  - '.github/workflows/deploy-frontend.yml'

19.3 Handling Documentation-Only Changes

When only design documents change, do not deploy unless the production site needs updating.

However, design documents published as site content are included under frontend/contents/** and therefore trigger deployment.

19.4 Future backend Paths

paths:

  - 'backend/**'

  - 'infra/**'

  - '.github/workflows/deploy-sam.yml'

  

20. Lambda CI/CD Phase 2

20.1 Why Defer This in the MVP

Automated Lambda deployment is not mandatory in the MVP.

Reasons:

- Initially, learning how it works through the AWS console is more educational
- Lambda code changes are infrequent
- Automating before adopting SAM leaves an incomplete setup
- Avoid accidentally breaking the production API

20.2 Phase 2 Options

|   |   |   |
|---|---|---|
|Method|Description|Recommendation|
|zip deployment|Zip Lambda code and use update-function-code|Medium|
|SAM deployment|Manage API/Lambda/DynamoDB in template.yaml|High|
|CDK|Manage IaC in TypeScript/Python|Medium|
|Terraform|Manage using general-purpose IaC|Medium to high|

20.3 zip Deployment Workflow Example

name: Deploy Lambda Contact

  

on:

  push:

    branches:

      - main

    paths:

      - 'backend/functions/contact_submit/**'

      - '.github/workflows/deploy-lambda-contact.yml'

  workflow_dispatch:

  

permissions:

  id-token: write

  contents: read

  

jobs:

  deploy-lambda:

    runs-on: ubuntu-latest

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: Package Lambda

        working-directory: backend/functions/contact_submit

        run: |

          zip -r contact_submit.zip .

  

      - name: Deploy Lambda

        run: |

          aws lambda update-function-code \

            --function-name contact-submit-prod \

            --zip-file fileb://backend/functions/contact_submit/contact_submit.zip

20.4 Additional zip Deployment Permissions

Automating Lambda deployment requires the following permissions on the GitHub Actions Role.

{

  "Effect": "Allow",

  "Action": [

    "lambda:UpdateFunctionCode"

  ],

  "Resource": "arn:aws:lambda:ap-northeast-1:<account-id>:function:contact-submit-prod"

}

20.5 Notes

The frontend deployment Role and Lambda deployment Role may be separate.

For stronger security, separate them as follows.

|   |   |
|---|---|
|Role|Purpose|
|github-actions-frontend-deploy-role|S3 + CloudFront only|
|github-actions-backend-deploy-role|Lambda updates only|
|github-actions-infra-deploy-role|SAM/CloudFormation only|

  

21. SAM CI/CD in Phase 2 and Later

21.1 Purpose of Adopting SAM

Manage backend resources such as API Gateway, Lambda, and DynamoDB as code.

21.2 Scope

|   |   |
|---|---|
|Resource|SAM management|
|Lambda contact-submit-prod|Included|
|API Gateway POST /contact|Included|
|DynamoDB ContactsTableProd|Included|
|Lambda IAM Role|Included|
|CloudWatch Logs Retention|Consider including|

21.3 deploy-sam.yml Example

name: Deploy SAM Backend

  

on:

  push:

    branches:

      - main

    paths:

      - 'backend/**'

      - 'infra/**'

      - '.github/workflows/deploy-sam.yml'

  workflow_dispatch:

  

permissions:

  id-token: write

  contents: read

  

jobs:

  deploy-sam:

    runs-on: ubuntu-latest

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Python

        uses: actions/setup-python@v5

        with:

          python-version: '3.11'

  

      - name: Setup SAM CLI

        uses: aws-actions/setup-sam@v2

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          role-to-assume: ${{ secrets.AWS_BACKEND_ROLE_ARN }}

          aws-region: ${{ vars.AWS_REGION }}

  

      - name: SAM Build

        working-directory: infra

        run: sam build

  

      - name: SAM Deploy

        working-directory: infra

        run: |

          sam deploy \

            --no-confirm-changeset \

            --no-fail-on-empty-changeset \

            --stack-name aws-cert-roadmap-lab-backend-prod \

            --capabilities CAPABILITY_IAM \

            --region ${{ vars.AWS_REGION }}

21.4 SAM Deployment Notes

|   |   |
|---|---|
|Caution|Description|
|CAPABILITY_IAM|Required to create or change IAM Roles|
|Be careful deleting Stacks|Accidental deletion may remove the API/DynamoDB|
|DynamoDB deletion protection|Consider DeletionPolicy before full-scale operation|
|dev/prod separation|Consider in Phase 3 or later|

  

22. Security Design

22.1 GitHub Actions Security Guidelines

|   |   |
|---|---|
|Item|Guideline|
|OIDC|Recommended|
|Minimize Secrets|Avoid AWS_SECRET_ACCESS_KEY if possible|
|Minimize permissions|Keep Workflow permissions to the minimum necessary|
|main only|Deploy to production only from main|
|Restrict Role trust|Allow AssumeRole only from a specific repo and branch|
|Separate IAM|Consider separate Roles for frontend/backend/infra|
|Logging caution|Do not echo Secrets|

22.2 Workflow permissions

Configure the following for OIDC deployment.

permissions:

  id-token: write

  contents: read

The following is generally sufficient for PR CI.

permissions:

  contents: read

22.3 Handling Pull Requests from Forks

Fork PRs are generally not expected in individual development.

If the project becomes open source, take care not to pass Secrets to external PRs.

22.4 Do Not Output Secrets

Bad example:

- run: echo ${{ secrets.AWS_SECRET_ACCESS_KEY }}

Never perform an operation like this.

  

23. Cost Design

23.1 Potential CI/CD Costs

|   |   |
|---|---|
|Operation|AWS cost factor|
|S3 sync|PUT / DELETE / LIST requests|
|CloudFront Invalidation|Invalidation requests|
|Lambda update|Usually small, but watch deployment frequency|
|SAM deploy|CloudFormation operations and resource creation/changes|
|GitHub Actions execution|Watch GitHub execution-time allowances|

23.2 Cost Reduction Rules

|   |   |
|---|---|
|Rule|Description|
|Deploy only from main|Do not deploy to S3 on feature pushes|
|Control with paths|Deploy frontend only when frontend changes|
|Avoid excessive invalidations|Only when merging into main|
|Stop unused Workflows|Disable or delete unused Workflows|
|No permanent dev environment|Production only is acceptable until Phase 3|

23.3 Deployment Frequency Guidelines

|   |   |
|---|---|
|Phase|Deployment frequency|
|During MVP development|Up to a few times per day|
|After release|Only when needed|
|Article update period|Only when publishing articles|
|After AdSense|Update carefully|

  

24. Rollback Design for Failures

24.1 MVP Rollback Guidelines

Use Git revert for rollback in the MVP.

1. Identify the problematic commit

2. Revert with git revert

3. Push to main

4. Redeploy through GitHub Actions

5. Verify the update on CloudFront

24.2 Using S3 Versioning

If S3 Versioning is enabled, previous versions can be restored.

However, it is not mandatory for the MVP because of cost and management considerations.

24.3 Manual Rollback

Check out an earlier commit locally, rebuild, and redeploy.

git checkout <previous-commit>

cd frontend

npm ci

npm run build

aws s3 sync ./out s3://<bucket-name> --delete

aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"

24.4 Rollback Decision Criteria

|   |   |
|---|---|
|Situation|Response|
|Home page does not display|Roll back immediately|
|Contact form does not work|Investigate the cause, then roll back if necessary|
|Broken CSS|Depends on the scope of impact|
|Article typo|Address with a correction commit|
|Incorrect API URL setting|Correct environment variables and redeploy|

  

25. Post-Deployment Verification

25.1 Checks After Automated Deployment

|   |   |
|---|---|
|Check|Expected result|
|GitHub Actions succeeds|green check|
|New files exist in S3|Updated|
|CloudFront Invalidation was created|Becomes Completed|
|Home page displays|Success|
|/terms displays|Success|
|/questions displays|Success|
|/contact displays|Success|
|Contact submission works|Success|
|404 page works|Success|

25.2 curl Verification Example

curl -I https://xxxxxxxx.cloudfront.net

Expected example:

HTTP/2 200

25.3 Waiting for CloudFront Updates

Invalidation is not instantaneous and may take time to complete.

If GitHub Actions needs to wait for completion, the following can be added.

aws cloudfront wait invalidation-completed \

  --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

  --id <invalidation-id>

Not mandatory in the MVP.

  

26. Deployment Logging Design

26.1 Logs to Check in GitHub Actions

|   |   |
|---|---|
|Step|What to check|
|Install dependencies|No dependency errors|
|Lint|No ESLint errors|
|Type check|No TypeScript errors|
|Build|Next.js build succeeds|
|Configure AWS credentials|AWS authentication succeeds|
|Deploy to S3|sync succeeds|
|Invalidate CloudFront|Invalidation succeeds|

26.2 Values That Must Not Be Logged

- AWS_SECRET_ACCESS_KEY
- AWS_ACCESS_KEY_ID
- Do not carelessly echo AWS_ROLE_ARN
- API keys
- .env contents
- Cognito tokens

  

27. CI/CD Checklist

27.1 Initial Setup Checks

|   |   |
|---|---|
|Check|Status|
|GitHub repository created|Not done / Done|
|frontend directory exists|Not done / Done|
|package.json scripts exist|Not done / Done|
|Static export configured in next.config|Not done / Done|
|S3 bucket name recorded|Not done / Done|
|CloudFront Distribution ID recorded|Not done / Done|

27.2 OIDC Checks

|   |   |
|---|---|
|Check|Status|
|AWS IAM OIDC Provider created|Not done / Done|
|IAM Role for GitHub Actions created|Not done / Done|
|Trust Policy restricted to repo/main|Not done / Done|
|IAM Policy has minimal S3/CloudFront permissions|Not done / Done|
|id-token: write configured in Workflow|Not done / Done|
|AWS_ROLE_ARN configured in GitHub Secrets|Not done / Done|

27.3 Workflow Checks

|   |   |
|---|---|
|Check|Status|
|ci.yml created|Not done / Done|
|deploy-frontend.yml created|Not done / Done|
|CI runs on PRs|Not done / Done|
|CD runs on main pushes|Not done / Done|
|S3 sync succeeds|Not done / Done|
|CloudFront Invalidation succeeds|Not done / Done|

27.4 Security Checks

|   |   |
|---|---|
|Check|Status|
|Root access keys are not used|Not done / Done|
|AdministratorAccess is not used|Not done / Done|
|AWS_SECRET_ACCESS_KEY is not logged|Not done / Done|
|GitHub Secrets contains no unnecessary values|Not done / Done|
|.env is not committed|Not done / Done|

  

28. Troubleshooting

28.1 OIDC AssumeRole Fails

|   |   |
|---|---|
|Cause|Response|
|Missing id-token: write|Add workflow permissions|
|Wrong repo name in Trust Policy|Check <github-owner>/<repo-name>|
|Wrong branch condition|Check refs/heads/main|
|OIDC Provider not created|Check the IAM Identity provider|
|Wrong audience|Check sts.amazonaws.com|

28.2 S3 sync Fails

|   |   |
|---|---|
|Cause|Response|
|Wrong S3_BUCKET_NAME|Check GitHub Secrets|
|Missing s3:PutObject|Check the IAM Policy|
|Missing s3:ListBucket|Check the IAM Policy|
|Missing out directory|Check build settings|
|Wrong working-directory|Check the workflow|

28.3 CloudFront Invalidation Fails

|   |   |
|---|---|
|Cause|Response|
|Wrong Distribution ID|Check Secrets|
|Missing cloudfront:CreateInvalidation|Check the IAM Policy|
|Distribution disabled|Check CloudFront status|
|Incorrect paths argument|Check --paths "/*"|

28.4 Build Fails

|   |   |
|---|---|
|Cause|Response|
|Missing dependencies|Check the lock file|
|TypeScript errors|Run npm run typecheck locally|
|Missing environment variables|Check GitHub Variables|
|Code incompatible with static export|Check use of Next.js dynamic features|

28.5 Deployment Succeeds but the Page Is Old

|   |   |
|---|---|
|Cause|Response|
|CloudFront cache|Check Invalidation|
|Browser cache|hard reload|
|Old files in S3|Check sync results|
|Viewing another Distribution|Check the URL|

  

29. CI/CD Implementation Order by Phase

29.1 Phase 1: Publish the Static Site

1. Deploy manually to S3/CloudFront

2. Add ci.yml

3. Add deploy-frontend.yml

4. Authenticate with AWS using access keys or OIDC

5. S3 sync + CloudFront Invalidation on main pushes

6. Migrate to OIDC

29.2 Phase 2: Add the Contact API

1. Manage Lambda code in GitHub

2. Add Lambda unit tests to CI

3. Add a zip deployment Workflow if necessary

4. Create a SAM template

5. Run SAM build/deploy manually

6. Move SAM deploy to GitHub Actions

29.3 Phase 3: Prepare for Monetization

1. Introduce a custom domain

2. Change NEXT_PUBLIC_SITE_URL to the custom domain

3. Add environment variables for Search Console / Analytics

4. Add sitemap generation verification to CI

5. Check CSP when introducing AdSense tags

29.4 Phase 4: Build the Learning Application

1. Consider managing Cognito settings as IaC

2. Add tests for authenticated APIs

3. Separate backend deploy workflows

4. Separate dev/prod environments

5. Add DB migration and data protection guidelines

  

6. Minimum CI/CD Set for the MVP

30.1 Minimum Set

The following alone is sufficient for the MVP.

ci.yml

  - lint

  - typecheck

  - build

  

deploy-frontend.yml

  - main push

  - build

  - aws s3 sync

  - cloudfront create-invalidation

30.2 What Not to Do in the MVP

Automated SAM deployment

Automated Terraform deployment

Automated Cognito provisioning

Multi-environment deployment

Automated E2E testing

Automated WAF configuration

Automated CloudFront creation

Automated S3 bucket creation

Reasons:

- Delays the MVP release
- Expands IAM permissions
- Increases the risk of unexpected charges
- Makes operations too complex for the initial learning stage

  

31. Content for the GitHub README

31.1 English Version Example

## CI/CD

  

This project uses GitHub Actions for CI/CD.

  

### CI

  

Pull requests run the following checks:

  

- Lint

- TypeScript type check

- Next.js build

  

### CD

  

When changes are merged into the `main` branch, GitHub Actions builds the static frontend, deploys it to Amazon S3, and creates a CloudFront invalidation.

  

### AWS Authentication

  

The recommended setup uses GitHub OIDC to assume an AWS IAM role without storing long-lived AWS access keys in GitHub Secrets.

  

The deployment role only has the minimum permissions required for:

  

- `s3:ListBucket`

- `s3:PutObject`

- `s3:DeleteObject`

- `cloudfront:CreateInvalidation`

31.2 Original Japanese Version Example, Translated into English

## CI/CD

  

This project uses GitHub Actions for CI/CD.

  

### CI

  

The following runs when a Pull Request is created.

  

- Lint

- TypeScript type checking

- Next.js build

  

### CD

  

When changes are merged into the `main` branch, GitHub Actions builds the static frontend, deploys it to Amazon S3, and then runs CloudFront Invalidation.

  

### AWS Authentication

  

The recommended configuration uses GitHub OIDC to temporarily assume an IAM Role without storing long-term AWS access keys in GitHub Secrets.

  

The deployment Role is granted only the following minimum permissions.

  

- `s3:ListBucket`

- `s3:PutObject`

- `s3:DeleteObject`

- `cloudfront:CreateInvalidation`

  

32. Interview Talking Points

32.1 Why Use GitHub Actions?

Because source code is managed in GitHub, validation on Pull Requests and automated deployment after updates to main can be managed in one place.

Introducing CI/CD even for an individual project reduces manual deployment mistakes and demonstrates operational design in the portfolio.

32.2 Why Deploy to Production Only from main?

To avoid accidentally publishing work-in-progress code from feature branches to production.

PRs run lint, typecheck, and build, while only the stable version merged into main is deployed to S3 and CloudFront.

32.3 Why Use OIDC?

To avoid storing long-term AWS access keys in GitHub Secrets.

OIDC allows GitHub Actions to assume an AWS IAM Role temporarily only during execution, reducing credential exposure risk.

32.4 Why Grant GitHub Actions Only Minimal Permissions?

Deployment only requires file synchronization to S3 and CloudFront Invalidation.

Therefore, permissions to operate IAM, DynamoDB, Lambda, EC2, and similar services are not granted.

Even if the Workflow is abused, the scope of impact is limited.

32.5 Why Not Automate Lambda Deployment in the MVP?

The MVP prioritizes stabilizing publication of the static site first.

Lambda is used only for the contact API and changes infrequently, so manual deployment or zip updates are sufficient initially.

Automating deployment after adopting SAM in Phase 2 or later is considered safer and easier to manage.

  

33. Acceptance Criteria

33.1 CI/CD Design Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-CICD-DOC-001|MVP CI/CD scope is defined|
|AC-CICD-DOC-002|CI and CD are separated|
|AC-CICD-DOC-003|The policy to deploy to production only from main is defined|
|AC-CICD-DOC-004|The GitHub OIDC method is defined|
|AC-CICD-DOC-005|Access-key authentication cautions are defined|
|AC-CICD-DOC-006|Least-privilege IAM for GitHub Actions is defined|
|AC-CICD-DOC-007|S3 sync and CloudFront Invalidation are defined|
|AC-CICD-DOC-008|Automated Lambda/SAM deployment is separated into Phase 2 or later|
|AC-CICD-DOC-009|Rollback guidelines are defined|
|AC-CICD-DOC-010|Troubleshooting is defined|

33.2 MVP Implementation Completion Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-CICD-MVP-001|ci.yml has been created|
|AC-CICD-MVP-002|lint/typecheck/build run on Pull Requests|
|AC-CICD-MVP-003|deploy-frontend.yml has been created|
|AC-CICD-MVP-004|Pushes to main deploy to S3|
|AC-CICD-MVP-005|CloudFront Invalidation runs|
|AC-CICD-MVP-006|The GitHub Actions Role has minimal S3/CloudFront permissions|
|AC-CICD-MVP-007|Root access keys are not used|
|AC-CICD-MVP-008|No secrets are output to GitHub Actions logs|
|AC-CICD-MVP-009|The latest site can be verified at the CloudFront URL after deployment|
|AC-CICD-MVP-010|Git revert can roll back a failed deployment|

  

34. Related Design Documents to Create Next

Create the following after this CI/CD design document.

1. Operational monitoring design
2. Development task list
3. GitHub README draft
4. MVP implementation schedule
5. Initial content creation template
6. Test design

  

7. Conclusion

This product's CI/CD prioritizes automated deployment of the static frontend site during the MVP stage.

The following CI/CD implementation is sufficient for the MVP.

On Pull Requests: lint / typecheck / build

On main pushes: build → S3 sync → CloudFront Invalidation

For AWS authentication, ultimately use GitHub OIDC with a configuration that does not store long-term access keys in GitHub Secrets.

  

Restrict GitHub Actions permissions to S3 deployment and CloudFront Invalidation.

s3:ListBucket

s3:PutObject

s3:DeleteObject

cloudfront:CreateInvalidation

In the MVP, do not automate creation of Lambda, API Gateway, DynamoDB, CloudFront, or the S3 bucket itself.

Expanding IaC too far initially complicates permissions, costs, and operations, slowing the path to release.

Add automated backend deployment using Lambda zip deployment or AWS SAM in Phase 2 or later.

This CI/CD design makes it possible to:

- Reduce manual deployment mistakes
- Check quality on PRs
- Publish automatically after updates to main
- Reduce AWS credential exposure risk
- Practice least-privilege IAM
- Explain CI/CD, security, and operational design in interviews
