AWS Certification Study Site Infrastructure Setup Guide

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Study Site Infrastructure Setup Guide|
|Target product|AWS Certification Roadmap Lab|
|Target phases|Phase 1: static-site publication / Phase 2: contact API / Phase 3: monetization preparation / Phase 4: learning application|
|Purpose|Define procedures for building a low-cost, secure, extensible learning-site infrastructure on AWS|
|Intended operator|The developer|
|Primary region|ap-northeast-1 / Tokyo Region|
|Exception region|CloudFront ACM certificates: us-east-1 / Northern Virginia|

  

2. Purpose of This Guide

This guide defines concrete procedures for building the AWS Certification Roadmap Lab certification study site on AWS.

The MVP includes the following infrastructure.

S3 + CloudFront static-site delivery

API Gateway + Lambda + DynamoDB contact API

CloudWatch Logs log inspection

IAM least privilege

AWS Budgets billing monitoring

Do not build the following during the initial stage.

EC2

RDS

NAT Gateway

ALB

ECS

EKS

OpenSearch

SageMaker

WAF

Cognito

SES

This is because the MVP prioritizes keeping costs down and establishing a published project.

  

3. Overall Setup Flow

3.1 MVP Setup Sequence

1. Configure initial AWS account security

2. Configure AWS Budgets

3. Create an S3 bucket

4. Build frontend static files

5. Upload static files to S3

6. Create a CloudFront Distribution

7. Configure CloudFront OAC

8. Configure the S3 Bucket Policy

9. Verify site display through CloudFront

10. Create DynamoDB ContactsTable

11. Create Lambda contact-submit-function

12. Configure the Lambda IAM Role

13. Create an API Gateway HTTP API

14. Connect API Gateway and Lambda

15. Configure CORS

16. Verify the contact API

17. Inspect CloudWatch Logs

18. Configure GitHub Actions deployment

19. Document the architecture diagram and design rationale in README

20. Check for unnecessary resources

3.2 Completed MVP Architecture

User

  ↓ HTTPS

CloudFront

  ↓ OAC

S3 static site

  

User

  ↓ POST /contact

API Gateway HTTP API

  ↓

Lambda contact-submit-function

  ↓

DynamoDB ContactsTable

  ↓

CloudWatch Logs

  

4. Prerequisites

4.1 Requirements

|   |   |
|---|---|
|Item|Description|
|AWS account|Personal AWS account|
|GitHub account|Source-code management|
|Local development environment|Node.js, Python, Git, VS Code|
|Frontend|Assumes Next.js / TypeScript|
|Backend|Assumes Lambda Python|
|Payment method|Card registered when creating the AWS account|

4.2 Recommended Local Environment

|   |   |
|---|---|
|Item|Recommendation|
|Node.js|LTS version|
|Python|3.11 or later|
|Package management|pnpm or npm|
|Git|Latest stable version|
|Editor|VS Code|
|AWS CLI|Optional; console operations are acceptable initially|

4.3 Region Policy

|   |   |
|---|---|
|Purpose|Region|
|S3|ap-northeast-1|
|Lambda|ap-northeast-1|
|DynamoDB|ap-northeast-1|
|API Gateway|ap-northeast-1|
|CloudWatch Logs|ap-northeast-1|
|CloudFront|Global service|
|ACM for CloudFront|us-east-1|

  

5. Naming Conventions

5.1 Resource Naming Policy

Use the following as the base project name.

aws-cert-roadmap-lab

5.2 MVP Resource Names

|   |   |
|---|---|
|Resource|Example name|
|S3 Bucket|aws-cert-roadmap-lab-prod|
|CloudFront Distribution|aws-cert-roadmap-lab-prod-cf|
|DynamoDB Table|ContactsTableProd|
|Lambda Function|contact-submit-prod|
|Lambda Role|lambda-contact-submit-role-prod|
|API Gateway|aws-cert-roadmap-lab-api-prod|
|Budget|aws-cert-roadmap-lab-monthly-budget|
|GitHub Actions Role|github-actions-deploy-role-prod|

5.3 Notes

S3 bucket names must be globally unique.

Therefore, actual names may include a username or date as follows.

aws-cert-roadmap-lab-prod-vincent-2026

  

6. Step 0: Initial AWS Account Security

6.1 Configure Root-user MFA

Purpose

Prevent AWS account takeover.

Procedure

1. Sign in to the AWS Management Console as the root user

2. Click the account name in the upper-right corner

3. Open Security credentials

4. Select Multi-factor authentication / MFA

5. Assign an MFA device

6. Scan the QR code with an authenticator app

7. Enter consecutive MFA codes to enable it

Completion criteria

|   |   |
|---|---|
|Criterion|Requirement|
|Root-user MFA configured|Required|
|No root access keys exist|Required|

6.2 Create an Administrative IAM User

Purpose

Avoid using the root user for routine work.

Procedure

1. Open the IAM console

2. Select Users

3. Select Create user

4. Enter a username

5. Enable Management Console access

6. Grant necessary permissions

7. Configure MFA

8. Sign out as root and verify login as the IAM user

Precautions for Initial Learning

AdministratorAccess may be used temporarily during initial learning, but separate permissions according to least privilege over the long term.

Separate the following for the portfolio.

Administrative IAM user

Lambda execution role

GitHub Actions deployment role

  

7. Step 1: Configure AWS Budgets

7.1 Purpose

Prevent unexpected charges.

Configure AWS Budgets first in this project.

7.2 Budget Configuration Policy

|   |   |
|---|---|
|Item|Value|
|Budget type|Cost budget|
|Period|Monthly|
|Budget amount|Initially 1 USD or another low amount|
|Scope|All AWS services|
|Alert threshold|50%、80%、100%、Forecasted 100%|
|Notification|Email|

7.3 Console Procedure

1. Open AWS Billing and Cost Management

2. Select Budgets from the left menu

3. Select Create budget

4. Select Cost budget

5. Select Monthly

6. Enter a budget name

   Example: aws-cert-roadmap-lab-monthly-budget

7. Enter the budget amount

   Example: 1 USD

8. Configure Alert threshold

   - Actual 50%

   - Actual 80%

   - Actual 100%

   - Forecasted 100%

9. Enter the notification email address

10. Create the budget

7.4 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|Monthly Cost Budget created|Required|
|Notification email configured|Required|
|Forecasted overrun notification configured|Recommended|

  

8. Step 2: Create an S3 Bucket

8.1 Purpose

Store static-site build artifacts.

8.2 Configuration Policy

|   |   |
|---|---|
|Item|Setting|
|Region|ap-northeast-1|
|Bucket name|aws-cert-roadmap-lab-prod-<unique-name>|
|Public Access|Block all|
|Versioning|Optional for MVP; may initially be disabled|
|Encryption|SSE-S3 is acceptable|
|Static website hosting|Generally do not use|

Important: Because CloudFront OAC is used, connect CloudFront to a regular S3 origin rather than the S3 static-website hosting endpoint.

8.3 Console Procedure

1. Open the S3 console

2. Select Create bucket

3. Enter the Bucket name

   Example: aws-cert-roadmap-lab-prod-vincent-2026

4. Select ap-northeast-1 for AWS Region

5. Leave Block all public access ON

6. Bucket Versioning may initially remain Disabled

7. Select SSE-S3 for Default encryption

8. Click Create bucket

8.4 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|S3 bucket created|Required|
|Block all public access enabled|Required|
|Static website hosting not enabled|Recommended|
|Bucket name recorded|Required|

  

9. Step 3: Build Frontend Static Files

9.1 Purpose

Create static files to upload to S3.

9.2 Assumed Next.js Configuration

Configure static export in next.config.js or next.config.mjs.

const nextConfig = {

  output: 'export',

  images: {

    unoptimized: true,

  },

};

  

export default nextConfig;

9.3 Example Build Commands

With pnpm:

pnpm install

pnpm build

With npm:

npm install

npm run build

The static export output directory is normally the following.

out/

9.4 Initial Minimal Pages

The following alone are sufficient for initial verification.

/

/about

/privacy

/terms

/questions

/contact

9.5 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|Build succeeds|Required|
|out/ directory generated|Required|
|index.html exists|Required|
|Images are not excessively large|Recommended|

  

10. Step 4: Upload Static Files to S3

10.1 Console Procedure

1. Open the target bucket in the S3 console

2. Open the Objects tab

3. Select Upload

4. Upload the files and folders under out/

5. Confirm upload completion

10.2 Using AWS CLI

aws s3 sync ./out s3://aws-cert-roadmap-lab-prod-vincent-2026 --delete

10.3 Notes

Because the S3 bucket is private, failure to display content through direct S3 object URLs is the correct behavior.

10.4 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|index.html uploaded to S3|Required|
|Assets and images uploaded|Required|
|Direct S3 URL access unavailable|Required|

  

11. Step 5: Create a CloudFront Distribution

11.1 Purpose

Deliver the static site stored in S3 over HTTPS.

11.2 Configuration Policy

|   |   |
|---|---|
|Item|Setting|
|Origin|S3 bucket|
|Origin access|Origin Access Control / OAC|
|Viewer protocol policy|Redirect HTTP to HTTPS|
|Allowed HTTP methods|GET, HEAD|
|Default root object|index.html|
|Web Application Firewall|Disabled for MVP|
|Price class|Initially, the geographic range may be limited to prioritize low cost|

11.3 Console Procedure

1. Open the CloudFront console

2. Select Create distribution

3. Select the created S3 bucket as Origin domain

4. Select Origin access control settings under Origin access

5. Select Create new OAC

6. Enter an OAC name

   Example: aws-cert-roadmap-lab-oac-prod

7. Select Redirect HTTP to HTTPS for Viewer protocol policy

8. Select GET, HEAD for Allowed HTTP methods

9. Enter index.html as Default root object

10. Disable WAF initially

11. Execute Create distribution

11.4 Values to Record After Creation

|   |   |
|---|---|
|Value|Purpose|
|Distribution ID|Invalidation、Bucket Policy、GitHub Actions|
|Distribution domain name|Verification URL|
|OAC ID|S3 access control|

  

12. Step 6: Configure the S3 Bucket Policy

12.1 Purpose

Allow S3 objects to be retrieved only from the CloudFront Distribution.

12.2 Example Bucket Policy

Replace the following values.

<bucket-name>

<account-id>

<distribution-id>

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Sid": "AllowCloudFrontServicePrincipalReadOnly",

      "Effect": "Allow",

      "Principal": {

        "Service": "cloudfront.amazonaws.com"

      },

      "Action": "s3:GetObject",

      "Resource": "arn:aws:s3:::<bucket-name>/*",

      "Condition": {

        "StringEquals": {

          "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

        }

      }

    }

  ]

}

12.3 Console Procedure

1. Open the S3 console

2. Select the target bucket

3. Open the Permissions tab

4. Edit Bucket policy

5. Paste the policy above

6. Replace bucket-name / account-id / distribution-id

7. Click Save changes

12.4 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|Bucket Policy configured|Required|
|Principal is cloudfront.amazonaws.com|Required|
|SourceArn restricted to the target Distribution|Required|
|Direct S3 access denied|Required|
|Content displays through CloudFront|Required|

  

13. Step 7: Verify CloudFront Display

13.1 Verification Procedure

1. Wait for CloudFront Distribution deployment to complete

2. Copy the Distribution domain name

   Example: https://xxxxxxxx.cloudfront.net

3. Open it in a browser

4. Verify that the home page appears

5. Check pages such as /terms and /about as well

6. Verify that HTTP access redirects to HTTPS

13.2 Verification Items

|   |   |
|---|---|
|Item|Expected result|
|CloudFront URL|Content displays|
|HTTP access|Redirects to HTTPS|
|Direct S3 URL|Access Denied|
|Images|Displayed|
|CSS|Applied|
|JS|Works|

13.3 Common Errors

|   |   |   |
|---|---|---|
|Error|Cause|Response|
|Access Denied|Missing Bucket Policy or mismatched OAC|Check Bucket Policy|
|403|Insufficient S3 access permissions|Check SourceArn and OAC|
|404|Files not uploaded|Check out/ contents|
|CSS not applied|Assets not uploaded|Check S3 sync|
|404 on navigation|Check static export settings and CloudFront error pages|Check Next.js configuration|

  

14. Step 8: Configure CloudFront Error Pages

14.1 Purpose

Handle routing and 404 pages appropriately for the static site.

14.2 Basic Policy

When Next.js static export generates HTML for each path, special SPA rewrites are often unnecessary.

However, display a 404 page for nonexistent URLs.

14.3 Candidate Configuration

|   |   |   |
|---|---|---|
|HTTP Error Code|Response Page Path|HTTP Response Code|
|403|/404.html|404|
|404|/404.html|404|

14.4 Notes

Returning /index.html for every path like an SPA is possible, but an SEO site should avoid returning 200 for nonexistent pages.

Since this product is also an SEO publication, generally return 404 responses as 404.

  

15. Step 9: Create DynamoDB ContactsTable

15.1 Purpose

Store contact-form submissions.

15.2 Table Design

|   |   |
|---|---|
|Item|Value|
|Table name|ContactsTableProd|
|Partition key|contactId|
|Sort key|None|
|Billing mode|On-demand recommended|
|Encryption|AWS owned key or AWS managed key|
|PITR|Optional for MVP|
|Streams|Disabled|

15.3 Console Procedure

1. Open the DynamoDB console

2. Select Tables

3. Select Create table

4. Enter ContactsTableProd as Table name

5. Enter contactId as Partition key

6. Set Type to String

7. Choose Customize or Default for Table settings

8. Select On-demand for Billing mode

9. Click Create table

15.4 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|ContactsTableProd created|Required|
|Partition key is contactId|Required|
|On-demand selected|Recommended|
|Streams disabled|Recommended|

  

16. Step 10: Create a Lambda Execution Role

16.1 Purpose

Allow the contact Lambda to write contact data to DynamoDB.

16.2 Permission Policy

Allow Lambda only the following.

PutItem to DynamoDB ContactsTableProd

Write logs to CloudWatch Logs

16.3 IAM Role Creation Procedure

1. Open the IAM console

2. Select Roles

3. Select Create role

4. Select AWS service for Trusted entity type

5. Select Lambda for Use case

6. Enter the Role name

   Example: lambda-contact-submit-role-prod

7. Create the role initially

8. Add an inline policy afterward

16.4 Example Inline Policy

Replace <account-id>.

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Sid": "AllowPutItemToContactsTable",

      "Effect": "Allow",

      "Action": [

        "dynamodb:PutItem"

      ],

      "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTableProd"

    },

    {

      "Sid": "AllowWriteLogs",

      "Effect": "Allow",

      "Action": [

        "logs:CreateLogGroup",

        "logs:CreateLogStream",

        "logs:PutLogEvents"

      ],

      "Resource": "arn:aws:logs:ap-northeast-1:<account-id>:*"

    }

  ]

}

16.5 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|Lambda Role created|Required|
|Only PutItem to ContactsTableProd allowed|Required|
|CloudWatch Logs output permissions granted|Required|
|AdministratorAccess not attached|Required|

  

17. Step 11: Create Lambda contact-submit-function

17.1 Purpose

Execute contact API processing.

17.2 Configuration Policy

|   |   |
|---|---|
|Item|Value|
|Function name|contact-submit-prod|
|Runtime|Python 3.11 or later|
|Architecture|x86_64 or arm64|
|Execution role|lambda-contact-submit-role-prod|
|Memory|128MB〜256MB|
|Timeout|3–5 seconds|
|VPC|Do not connect|

17.3 Console Procedure

1. Open the Lambda console

2. Select Create function

3. Select Author from scratch

4. Enter contact-submit-prod as Function name

5. Select Python 3.11 or later as Runtime

6. Open Change default execution role

7. Select Use an existing role

8. Select lambda-contact-submit-role-prod

9. Click Create function

17.4 Environment Variables

|   |   |
|---|---|
|Key|Value|
|CONTACTS_TABLE_NAME|ContactsTableProd|
|ALLOWED_ORIGIN|CloudFront URL or custom domain|
|LOG_LEVEL|INFO|

17.5 Minimal Lambda Code Example

Implementation details are defined in the subsequent Lambda implementation design document. The following is a minimal verification example; Japanese response and validation strings are retained as localized site-output examples.

import json

import os

import uuid

from datetime import datetime, timezone, timedelta

import boto3

  

  

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table(os.environ["CONTACTS_TABLE_NAME"])

  

JST = timezone(timedelta(hours=9))

  

  

def response(status_code, body):

    return {

        "statusCode": status_code,

        "headers": {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN", "*"),

            "Access-Control-Allow-Headers": "Content-Type,Authorization",

            "Access-Control-Allow-Methods": "POST,OPTIONS"

        },

        "body": json.dumps(body, ensure_ascii=False)

    }

  

  

def lambda_handler(event, context):

    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":

        return response(200, {"success": True})

  

    try:

        body = json.loads(event.get("body") or "{}")

    except json.JSONDecodeError:

        return response(400, {

            "success": False,

            "error": {"code": "INVALID_JSON", "message": "JSON形式が不正です。"}

        })

  

    honeypot = body.get("honeypot", "")

    if honeypot:

        return response(201, {

            "success": True,

            "data": {"contactId": None, "status": "accepted"},

            "message": "お問い合わせを受け付けました。"

        })

  

    errors = []

    name = str(body.get("name", "")).strip()

    email = str(body.get("email", "")).strip()

    subject = str(body.get("subject", "")).strip()

    message = str(body.get("message", "")).strip()

    source_page = str(body.get("sourcePage", "")).strip()

  

    if not name or len(name) > 100:

        errors.append({"field": "name", "message": "名前を100文字以内で入力してください。"})

    if not email or "@" not in email or len(email) > 255:

        errors.append({"field": "email", "message": "正しいメールアドレスを入力してください。"})

    if not subject or len(subject) > 150:

        errors.append({"field": "subject", "message": "件名を150文字以内で入力してください。"})

    if not message or len(message) > 2000:

        errors.append({"field": "message", "message": "本文を2000文字以内で入力してください。"})

  

    if errors:

        return response(400, {

            "success": False,

            "error": {

                "code": "VALIDATION_ERROR",

                "message": "入力内容に誤りがあります。",

                "details": errors

            }

        })

  

    contact_id = f"contact-{uuid.uuid4()}"

    created_at = datetime.now(JST).isoformat()

  

    item = {

        "contactId": contact_id,

        "createdAt": created_at,

        "name": name,

        "email": email,

        "subject": subject,

        "message": message,

        "sourcePage": source_page,

        "status": "new"

    }

  

    table.put_item(Item=item)

    print(f"INFO contact saved contactId={contact_id}")

  

    return response(201, {

        "success": True,

        "data": {"contactId": contact_id, "status": "new"},

        "message": "お問い合わせを受け付けました。"

    })

17.6 Notes

The code above is for minimal verification.

Improve the following for production quality.

Stronger email-format validation

Add requestId

Stronger error handling

Dynamic CORS origin determination

Log output control

Unit tests

  

18. Step 12: Configure CloudWatch Logs Retention

18.1 Purpose

Prevent charges from accumulating logs.

18.2 Procedure

1. Open the CloudWatch console

2. Select Logs > Log groups

3. Open /aws/lambda/contact-submit-prod

4. Select Retention settings

5. Select 14 days or 30 days

6. Save

18.3 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|Lambda log group exists|Required|
|Retention is not Never expire|Required|
|Set to 14–30 days|Recommended|

  

19. Step 13: Create an API Gateway HTTP API

19.1 Purpose

Expose the contact Lambda as an HTTP API.

19.2 Configuration Policy

|   |   |
|---|---|
|Item|Value|
|API type|HTTP API|
|API name|aws-cert-roadmap-lab-api-prod|
|Route|POST /contact|
|Integration|Lambda contact-submit-prod|
|CORS|Allow only the CloudFront domain|
|Auth|None for MVP|

19.3 Console Procedure

1. Open the API Gateway console

2. Select Create API

3. Select HTTP API

4. Select Lambda under Add integration

5. Select contact-submit-prod

6. Enter aws-cert-roadmap-lab-api-prod as API name

7. Add a Route

   Method: POST

   Path: /contact

8. Create a Stage

   Example: $default or prod

9. Create the API

19.4 CORS Configuration

Allowed origins:

  https://xxxxxxxx.cloudfront.net

  After adding a custom domain: https://example.com

  

Allowed methods:

  POST

  OPTIONS

  

Allowed headers:

  Content-Type

  Authorization

The following may also be allowed during development only.

http://localhost:3000

Remove localhost in production.

19.5 Lambda Invoke Permission

Permission to invoke Lambda is often granted automatically when creating API Gateway.

If it does not work, check the Lambda resource-based policy.

19.6 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|HTTP API created|Required|
|POST /contact route exists|Required|
|Lambda integrated|Required|
|CORS configured|Required|
|Invoke URL recorded|Required|

  

20. Step 14: Verify the Contact API

20.1 Verify with curl

Replace <api-url> with the API Gateway Invoke URL. The Japanese test payload below exercises localized input.

curl -X POST "<api-url>/contact" \

  -H "Content-Type: application/json" \

  -d '{

    "name": "テスト太郎",

    "email": "test@example.com",

    "subject": "テスト問い合わせ",

    "message": "これはテストです。",

    "sourcePage": "/contact",

    "honeypot": ""

  }'

20.2 Expected Response (Localized Japanese Example)

{

  "success": true,

  "data": {

    "contactId": "contact-xxxxxxxx",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。"

}

20.3 Verify DynamoDB

1. Open the DynamoDB console

2. Open ContactsTableProd

3. Open Explore table items

4. Confirm that data with a contactId is saved

20.4 Verify CloudWatch Logs

1. Open CloudWatch Logs

2. Open /aws/lambda/contact-submit-prod

3. Open the latest log stream

4. Check for INFO contact saved contactId=...

5. Confirm that full email addresses and message bodies are not logged

20.5 Error-path Tests

|   |   |
|---|---|
|Test|Expected result|
|Missing email|400|
|Invalid email format|400|
|Empty message|400|
|message exceeds 2,000 characters|400|
|honeypot contains a value|Treated as 201; no DynamoDB storage|

  

21. Step 15: Connect the Frontend Contact Form

21.1 Configure Environment Variables

Configure the API URL in the frontend.

NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

21.2 Frontend Processing Policy

1. Enter form data

2. Validate on the frontend

3. Call POST /contact

4. Display a completion message on success

5. Display an error message on failure

21.3 Verify CORS

Confirm that inquiries can be submitted from the site on CloudFront.

|   |   |
|---|---|
|Scenario|Expected behavior|
|Submission from localhost|Succeeds only during development|
|Submission from CloudFront URL|Succeeds|
|Submission from unauthorized origin|Browser CORS error|

  

22. Step 16: Configure GitHub Actions Deployment

22.1 Purpose

Automatically deploy to S3 and invalidate the CloudFront cache when pushing to main.

22.2 Recommended Policy

Manual deployment is acceptable initially.

However, introduce GitHub Actions to strengthen the portfolio.

22.3 IAM Permissions for GitHub Actions

The following permissions are required.

s3:PutObject

s3:DeleteObject

s3:ListBucket

cloudfront:CreateInvalidation

22.4 GitHub Secrets

|   |   |
|---|---|
|Secret name|Description|
|AWS_ACCESS_KEY_ID|Deployment access key; only before OIDC migration|
|AWS_SECRET_ACCESS_KEY|Deployment secret; only before OIDC migration|
|AWS_REGION|ap-northeast-1|
|S3_BUCKET_NAME|S3 bucket name|
|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|

Use GitHub OIDC rather than long-lived access keys if possible.

22.5 Example Workflow

.github/workflows/deploy.yml

name: Deploy Frontend

  

on:

  push:

    branches:

      - main

  

jobs:

  deploy:

    runs-on: ubuntu-latest

  

    steps:

      - name: Checkout

        uses: actions/checkout@v4

  

      - name: Setup Node.js

        uses: actions/setup-node@v4

        with:

          node-version: 20

  

      - name: Install dependencies

        working-directory: frontend

        run: npm ci

  

      - name: Build

        working-directory: frontend

        run: npm run build

  

      - name: Configure AWS credentials

        uses: aws-actions/configure-aws-credentials@v4

        with:

          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}

          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

          aws-region: ${{ secrets.AWS_REGION }}

  

      - name: Deploy to S3

        working-directory: frontend

        run: |

          aws s3 sync ./out s3://${{ secrets.S3_BUCKET_NAME }} --delete

  

      - name: Invalidate CloudFront

        run: |

          aws cloudfront create-invalidation \

            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \

            --paths "/*"

22.6 Cost Precautions

Do not invalidate /* too frequently.

This is acceptable for the MVP because deployments are infrequent, but full-scale operations should invalidate only changed files or use hashed filenames.

  

23. Step 17: Add a Custom Domain in Phase 3

23.1 Adoption Timing

Not required for MVP.

Consider adoption at the following points.

There are 10–20 articles

An AdSense application is being considered

You want better portfolio presentation

You have decided to operate the site long term

23.2 Services Used

|   |   |
|---|---|
|Service|Purpose|
|Route 53|DNS management|
|ACM|SSL/TLS certificates|
|CloudFront|Custom-domain delivery|

23.3 ACM Certificate Creation Procedure

Important: Create ACM certificates for CloudFront in us-east-1.

1. Change the region in the upper-right corner of the AWS console to us-east-1

2. Open ACM

3. Select Request certificate

4. Select Public certificate

5. Enter the domain name

   Example: example.com

   Example: www.example.com

6. Select DNS validation

7. Request the certificate

8. Create the validation CNAME in Route 53

9. Wait until Status becomes Issued

23.4 Configure the Custom Domain in CloudFront

1. Open the CloudFront Distribution

2. Select Edit or Add alternate domain name on the General tab

3. Add the domain under Alternate domain name

4. Select the ACM certificate under Custom SSL certificate

5. Save

23.5 Configure Route 53 Records

1. Open the Route 53 Hosted Zone

2. Select Create record

3. Create an A record

4. Enable Alias

5. Select the CloudFront Distribution as Alias target

6. Save

23.6 Completion Criteria

|   |   |
|---|---|
|Criterion|Requirement|
|Custom domain accessible|Required|
|HTTPS access works|Required|
|HTTP redirects to HTTPS|Required|
|Default CloudFront domain also works as needed|Optional|

  

24. Step 18: Prepare Search Console / Analytics / AdSense in Phase 3

24.1 Prerequisite Pages

Prepare the following when considering AdSense and SEO operations.

|   |   |
|---|---|
|Page|Priority|
|About the operator|High|
|Contact|High|
|Privacy policy|High|
|Disclaimer|High|
|Approximately 20 articles|Recommended|
|Sitemap|Recommended|
|robots.txt|Recommended|

24.2 Google Search Console

1. Open Google Search Console

2. Add a property

3. Select Domain or URL prefix

4. Verify ownership

5. Submit sitemap.xml

6. Check indexing status

24.3 Google Analytics

1. Create a property in Google Analytics

2. Obtain the measurement ID

3. Install it on the frontend

4. Disclose analytics usage in the privacy policy

24.4 Google AdSense

1. Add the site to AdSense

2. Install the review code on the site

3. Check the privacy policy

4. Prepare original articles

5. Apply for review

24.5 Notes

When adding advertising or Analytics tags, review allowed sources if CSP is configured.

  

25. Step 19: Add Cognito in Phase 4

25.1 Adoption Timing

Do not introduce Cognito in the MVP.

Introduce it when implementing the following.

Login

My page

Learning history

Accuracy

Review questions

Weak-area analysis

Paid features

25.2 Architecture

Frontend

  ↓ Login / Signup

Cognito User Pool

  ↓ JWT

API Gateway JWT Authorizer

  ↓

Lambda

  ↓

DynamoDB UserAnswersTable / UserProgressTable

25.3 Important Rules

Do not trust userId in the request body.

Always use Cognito JWT sub as userId.

25.4 Setup Overview

1. Create a Cognito User Pool

2. Create an App client

3. Configure email login

4. Add Amplify or the Cognito SDK to the frontend

5. Configure a JWT Authorizer in API Gateway

6. Add authenticated APIs

7. Create UserProfileTable

8. Create UserAnswersTable

9. Create UserProgressTable

Create detailed documentation separately in Phase 4.

  

26. Step 20: Check for Unnecessary Resources

26.1 Inspection Targets

After building the MVP, check that the following have not been created.

|   |   |
|---|---|
|Resource|State|
|EC2|Must not exist|
|RDS|Must not exist|
|NAT Gateway|Must not exist|
|ALB|Must not exist|
|Elastic IP|Must not exist|
|EBS Volume|No unnecessary volumes|
|OpenSearch|Must not exist|
|SageMaker|Must not exist|
|WAF|Must not exist in MVP|

26.2 Check All Regions

Resources in the AWS console are separated by region.

Check the following.

ap-northeast-1

us-east-1

Any other region accidentally used

26.3 Billing Check

1. Open Billing Dashboard

2. Check current-month usage charges

3. Check per-service costs in Cost Explorer

4. Check for unexpected services

  

5. Functional Verification Checklist

27.1 Static Site

|   |   |
|---|---|
|Check|Expected result|
|Home page displays at CloudFront URL|Success|
|/terms displays|Success|
|/questions displays|Success|
|/contact displays|Success|
|CSS applied|Success|
|Images displayed|Success|
|HTTP redirects to HTTPS|Success|
|Direct S3 URL denied|Success|

27.2 Contact API

|   |   |
|---|---|
|Check|Expected result|
|Valid form submission|201|
|Stored in DynamoDB|Success|
|CloudWatch Logs output|Success|
|Invalid email|400|
|Empty message|400|
|Honeypot input|Success without storage|
|Unauthorized origin|CORS error|

27.3 Cost and Security

|   |   |
|---|---|
|Check|Expected result|
|AWS Budgets configured|Success|
|CloudWatch Logs retention configured|Success|
|Lambda Role follows least privilege|Success|
|No .env in GitHub|Success|
|No unnecessary resources|Success|

  

28. Troubleshooting

28.1 Access Denied in CloudFront

|   |   |
|---|---|
|Cause|Response|
|S3 Bucket Policy missing|Allow the CloudFront Distribution ARN|
|OAC not configured|Check CloudFront Origin configuration|
|Incorrect Distribution ID|Check SourceArn in Bucket Policy|
|Files not uploaded|Check index.html in S3|

28.2 CSS or JS Does Not Load

|   |   |
|---|---|
|Cause|Response|
|Assets not uploaded|Check S3 sync targets|
|Incorrect path configuration|Check Next.js output settings|
|CloudFront cache|Run Invalidation|

28.3 CORS Error in the Contact API

|   |   |
|---|---|
|Cause|Response|
|Origin not allowed|Add CloudFront URL to API Gateway CORS|
|OPTIONS not handled|Check API Gateway CORS configuration|
|Lambda headers missing|Check Access-Control-Allow-Origin|

28.4 Lambda Cannot Save to DynamoDB

|   |   |
|---|---|
|Cause|Response|
|Insufficient IAM permissions|Check dynamodb:PutItem|
|Incorrect table name|Check CONTACTS_TABLE_NAME environment variable|
|Region mismatch|Check Lambda and DynamoDB regions|
|Invalid JSON|Check Lambda logs|

28.5 AWS Charges Are Accruing

|   |   |
|---|---|
|Cause|Response|
|Unnecessary resources created|Identify with Cost Explorer and delete|
|CloudWatch Logs accumulation|Configure retention|
|Excessive API access|Check API Gateway metrics|
|Accidentally created NAT Gateway|Delete immediately|
|Accidentally created RDS|Delete immediately|

  

29. Deletion Procedure

29.1 When Pausing or Deleting the Infrastructure

Delete the following to stop charges.

1. Disable the CloudFront Distribution

2. Delete the CloudFront Distribution

3. Delete objects in the S3 bucket

4. Delete the S3 bucket

5. Delete API Gateway

6. Delete Lambda

7. Delete DynamoDB ContactsTable

8. Delete CloudWatch Logs

9. Delete the IAM Role

10. Delete the Route 53 Hosted Zone (optional)

11. Delete the ACM certificate (optional)

29.2 Notes

After disabling CloudFront, it takes time before deletion becomes possible.

An S3 bucket cannot be deleted until empty.

Pay attention to deletion and renewal timing for Route 53 Hosted Zones and domain registrations.

  

30. Infrastructure Overview for README

Include the following in the GitHub README.

## AWS Architecture

  

This project uses a serverless architecture on AWS.

  

- Amazon S3: Static site hosting storage

- Amazon CloudFront: CDN and HTTPS delivery

- Origin Access Control: Restrict direct access to S3

- Amazon API Gateway: Contact form API endpoint

- AWS Lambda: Contact form processing

- Amazon DynamoDB: Contact data storage

- Amazon CloudWatch Logs: Lambda logs

- AWS Budgets: Cost monitoring

  

The project avoids always-on resources such as EC2, RDS, NAT Gateway, and ALB in the MVP phase to minimize cost.

English translation of the original Japanese alternative:

## AWS Architecture

  

This project is built using a serverless AWS architecture.

  

- Amazon S3: static-file hosting

- Amazon CloudFront: CDN delivery and HTTPS

- Origin Access Control: prevention of direct S3 exposure

- Amazon API Gateway: expose the contact API

- AWS Lambda: save contact submissions

- Amazon DynamoDB: store contact data

- Amazon CloudWatch Logs: inspect Lambda logs

- AWS Budgets: billing monitoring

  

The MVP prioritizes low-cost operations without services likely to incur ongoing charges, such as EC2, RDS, NAT Gateway, or ALB.

  

31. Definition of Setup Completion

MVP infrastructure is complete when the following conditions are met.

|   |   |
|---|---|
|ID|Completion criterion|
|INF-001|AWS Budgets configured|
|INF-002|S3 bucket created with Public Access Block enabled|
|INF-003|CloudFront Distribution created|
|INF-004|OAC allows S3 access only from CloudFront|
|INF-005|Site displays at CloudFront URL|
|INF-006|Direct S3 URL inaccessible|
|INF-007|DynamoDB ContactsTableProd created|
|INF-008|Lambda contact-submit-prod created|
|INF-009|Lambda execution role follows least privilege|
|INF-010|API Gateway POST /contact created|
|INF-011|Contact form can save to DynamoDB|
|INF-012|Lambda logs visible in CloudWatch Logs|
|INF-013|CloudWatch Logs retention configured|
|INF-014|No secrets in GitHub|
|INF-015|No EC2, RDS, NAT Gateway, or ALB used|

  

32. Documents to Create Next

Create the following after this guide.

1. Lambda implementation design
2. CI/CD design
3. Operations and monitoring design
4. Development task list
5. GitHub README draft
6. MVP implementation schedule
7. Initial-content creation template

  

8. Conclusion

This infrastructure guide builds the MVP with the following architecture.

S3 + CloudFront + OAC

API Gateway + Lambda + DynamoDB

CloudWatch Logs

IAM least privilege

AWS Budgets

This architecture provides the following.

- A portfolio published on AWS
- Reduced fixed costs without EC2 or RDS
- Secure delivery through CloudFront without direct S3 exposure
- Demonstration of serverless implementation experience through the contact API
- Practical use of DynamoDB, Lambda, API Gateway, CloudWatch, and IAM
- Prevention of unexpected charges through AWS Budgets

Static-site publication and the contact API are sufficient for the initial implementation scope.

Add Cognito, SES, EventBridge, a custom domain, and AdSense support gradually after publishing the MVP.
