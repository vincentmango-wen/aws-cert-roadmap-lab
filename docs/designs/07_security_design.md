AWS Certification Study Site Security Design

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Study Site Security Design|
|Target product|AWS Certification Roadmap Lab|
|Target phases|MVP development through Phase 4: learning application|
|Purpose|Define security policies for safely operating the website, APIs, and data on AWS|
|Planned technologies|S3 / CloudFront / OAC / API Gateway / Lambda / DynamoDB / IAM / CloudWatch / AWS Budgets / GitHub Actions / Cognito|

  

2. Purpose of This Design Document

This document defines security requirements, threats, countermeasures, and per-service AWS configuration policies for the AWS Certification Roadmap Lab certification study site.

Although this product is an individual portfolio project, its security design is explicitly documented for the following reasons.

1. It is a publicly accessible website hosted on AWS.
2. Its contact form receives personal information.
3. Login and learning-history features will be added in the future.
4. Automated deployment through GitHub Actions may be introduced.
5. AWS design skills need to be explained in job interviews and the portfolio.

The MVP implements sufficient essential protections at low cost without introducing excessive security products.

  

3. Fundamental Security Policy

3.1 Basic Policy

|   |   |
|---|---|
|Policy|Description|
|Principle of least privilege|Minimize IAM user, IAM role, Lambda, and GitHub Actions permissions|
|No direct public S3 access|Serve the static site through CloudFront rather than exposing S3 directly|
|HTTPS delivery|Serve content over HTTPS through CloudFront|
|Keep secrets private|Do not commit AWS access keys, API keys, environment variables, or credentials to GitHub|
|Input validation|Validate contact-form and API inputs on both the frontend and backend|
|Minimize personal-data collection|Collect only information necessary to handle inquiries|
|Minimize logging|Do not output personal information or secrets to CloudWatch Logs|
|Prevent unexpected charges|Configure AWS Budgets as a security measure to detect abnormal usage|
|Progressive hardening|Apply basic safeguards in the MVP; add Cognito, authentication, and per-user access control in Phase 4|

  

4. Security Scope

4.1 MVP Scope

The following assets are protected in the MVP.

|   |   |
|---|---|
|Target|Description|
|AWS account|Root user, IAM users, MFA, and billing protection|
|S3|Static-site files, images, and architecture diagrams|
|CloudFront|Web delivery, HTTPS, and OAC|
|API Gateway|Entry point for the contact API|
|Lambda|Contact-submission storage processing|
|DynamoDB|Contact-data storage|
|CloudWatch Logs|Lambda logs|
|GitHub|Source code, GitHub Actions, and Secrets|
|Contact form|Name, email, subject, and message|

4.2 Future Scope

The following assets are protected from Phase 4 onward.

|   |   |
|---|---|
|Target|Description|
|Cognito|User registration, login, and JWT issuance|
|UserProfileTable|User profiles|
|UserAnswersTable|Answer history|
|UserProgressTable|Learning progress|
|ReviewItemsTable|Items requiring review|
|SES|Email notifications|
|EventBridge|Daily-question delivery trigger|
|Paid features|Future payments, study-material sales, and membership features|

  

5. Information Classification

5.1 Information Categories

|   |   |   |   |
|---|---|---|---|
|Information type|Examples|Sensitivity|Protection policy|
|Public information|AWS terms, articles, comparison tables, architecture diagrams|Low|Intended for publication; prioritize tamper prevention|
|Semi-public information|GitHub README, design documents|Low to medium|Exclude secrets|
|Personal information|Contact name, email address, message|Medium|Store in DynamoDB; do not publish|
|Credentials|AWS access keys, GitHub Secrets, JWTs|High|Do not commit to GitHub or write to logs|
|Learning history|Answer history, accuracy, weak areas|Medium|Allow access only to the user concerned|
|Billing information|AWS bills, Budgets notifications|High|Visible only to account administrators|

  

6. Threat Model

6.1 Anticipated Threats

|   |   |   |   |
|---|---|---|---|
|Threat ID|Threat|Impact|MVP countermeasures|
|TH-001|Unintended S3 bucket exposure|Disclosure of information other than static files|Public Access Block, OAC, Bucket Policy|
|TH-002|Leaked AWS access keys|Unauthorized AWS resource usage and unexpected charges|GitHub Secrets, MFA, least privilege|
|TH-003|Contact-form spam|Increased DynamoDB writes and operational disruption|Validation, honeypot, character limits, consideration of rate limits|
|TH-004|XSS|Execution of malicious scripts in users' environments|Input sanitization, React automatic escaping, prohibition of direct HTML output|
|TH-005|API abuse|Excessive requests and misuse of data storage|CORS restrictions, input limits, consideration of API Gateway limits|
|TH-006|Excessive IAM permissions|Greater damage after compromise|Least privilege; no routine use of AdministratorAccess|
|TH-007|Personal information in CloudWatch Logs|Information leakage through logs|Minimize logs; do not log full message bodies or email addresses|
|TH-008|Secrets committed to GitHub|Credential leakage|.gitignore, Secrets, pre-commit checks|
|TH-009|Unauthorized access to DynamoDB data|Personal-information leakage|Lambda-only access, IAM restrictions|
|TH-010|Cost-amplification attacks or high traffic|Unexpected costs|AWS Budgets, rate limits, log monitoring|
|TH-011|Future user-ID impersonation|Access to another user's learning history|Cognito JWT; derive userId from JWT|
|TH-012|CORS misconfiguration|API abuse from external sites|Restrict allowed origins to the production domain|

  

7. AWS Account Security

7.1 Root User Management

|   |   |
|---|---|
|Item|Policy|
|Root user usage|Do not use as a rule|
|MFA|Always enable|
|Access keys|Do not create root-user access keys|
|Usage scenarios|Only when necessary, such as billing or account settings|

7.2 IAM User Policy

|   |   |
|---|---|
|Item|Policy|
|Routine work|Use an administrative IAM user or IAM Identity Center|
|MFA|Enable MFA for administrative users as well|
|Permissions|Grant the minimum required for each task|
|Access keys|Issue only when necessary; delete unused keys|
|Rotation|Regularly rotate keys used long term|

7.3 AWS Budgets

AWS Budgets must be configured as part of the security measures.

Reasons:

- Makes unauthorized usage following an access-key leak easier to detect
- Detects increasing charges caused by excessive API requests
- Helps prevent unexpected charges from configuration mistakes during learning

|   |   |
|---|---|
|Item|Policy|
|Budget type|Cost Budget|
|Scope|All AWS services|
|Notifications|Email notifications|
|Threshold|Set relatively low|
|Priority|Required before starting the MVP|

  

8. IAM Design

8.1 Fundamental IAM Policy

|   |   |
|---|---|
|Policy|Description|
|Least privilege|Allow only necessary Actions and Resources|
|Permission separation|Separate deployment, Lambda execution, and administration|
|No routine AdministratorAccess|Avoid except during initial learning|
|Explicit Resource specification|Avoid * wherever possible|
|Remove unused permissions|Delete roles and policies no longer used|

8.2 IAM Roles

|   |   |   |   |
|---|---|---|---|
|Role name|Purpose|User/service|Phase|
|lambda-contact-submit-role|Execute contact Lambda|Lambda|MVP / Phase 2|
|github-actions-deploy-role|S3 deployment and CloudFront Invalidation|GitHub Actions|Phase 1 onward|
|lambda-get-questions-role|Execute question-retrieval Lambda|Lambda|Phase 2 onward|
|lambda-user-progress-role|Execute learning-history Lambda|Lambda|Phase 4|
|eventbridge-daily-question-role|Execute daily-question delivery Lambda|EventBridge / Lambda|Phase 4|

8.3 IAM Policy for the Contact Lambda

Target

contact-submit-function

Allowed operations

- PutItem on ContactsTable
- Write logs to CloudWatch Logs

Example policy

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Effect": "Allow",

      "Action": [

        "dynamodb:PutItem"

      ],

      "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTable"

    },

    {

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

8.4 IAM Permissions for GitHub Actions

Target

Static-site deployment.

Allowed operations

- Upload to S3
- Delete files in S3
- Invalidate the CloudFront cache

Example policy

{

  "Version": "2012-10-17",

  "Statement": [

    {

      "Effect": "Allow",

      "Action": [

        "s3:PutObject",

        "s3:DeleteObject"

      ],

      "Resource": "arn:aws:s3:::aws-cert-roadmap-lab-prod/*"

    },

    {

      "Effect": "Allow",

      "Action": [

        "s3:ListBucket"

      ],

      "Resource": "arn:aws:s3:::aws-cert-roadmap-lab-prod"

    },

    {

      "Effect": "Allow",

      "Action": [

        "cloudfront:CreateInvalidation"

      ],

      "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

    }

  ]

}

8.5 Permissions to Avoid

Do not grant the following casually in the MVP.

|   |   |
|---|---|
|Permission|Reason|
|AdministratorAccess|Dangerously excessive permissions|
|dynamodb:*|Allows more database operations than necessary|
|s3:*|May allow operations on unrelated buckets|
|iam:*|Risk of privilege escalation|
|cloudfront:*|Allows more CloudFront operations than necessary|

  

9. S3 Security Design

9.1 Basic Policy

|   |   |
|---|---|
|Item|Policy|
|Public Access|Block all|
|Direct public exposure|Do not expose|
|Delivery path|CloudFront only|
|OAC|Use|
|Bucket Policy|Allow access only from the CloudFront Distribution|
|Static website hosting feature|Generally do not use; deliver through CloudFront + S3 Origin|

9.2 S3 Public Access Block

Enable all of the following.

|   |   |
|---|---|
|Setting|Value|
|Block public access to buckets and objects granted through new ACLs|ON|
|Block public access to buckets and objects granted through any ACLs|ON|
|Block public access to buckets and objects granted through new public bucket policies|ON|
|Block public and cross-account access to buckets and objects through any public bucket policies|ON|

9.3 CloudFront OAC Usage Policy

Use OAC to allow access to the S3 bucket only from CloudFront.

Objectives:

- Avoid direct public exposure of the S3 bucket
- Deliver over HTTPS through CloudFront
- Centralize cache control
- Prevent direct access through S3 URLs

9.4 Example Bucket Policy

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

      "Resource": "arn:aws:s3:::aws-cert-roadmap-lab-prod/*",

      "Condition": {

        "StringEquals": {

          "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"

        }

      }

    }

  ]

}

9.5 Permitted and Prohibited S3 Content

|   |   |
|---|---|
|Permitted|Prohibited|
|HTML|AWS access keys|
|CSS|API keys|
|JavaScript|.env files|
|Images|CSVs containing personal information|
|Architecture diagram images|Contact-data backups|
|OGP images|JWTs and credentials|

  

10. CloudFront Security Design

10.1 Basic Policy

|   |   |
|---|---|
|Item|Policy|
|HTTPS|Required|
|HTTP access|Redirect to HTTPS|
|Origin|S3|
|OAC|Enabled|
|Caching|Enabled for static files|
|WAF|Optional for MVP; consider after traffic increases|

10.2 Viewer Protocol Policy

Redirect HTTP to HTTPS

Redirect HTTP requests to HTTPS.

10.3 Security Headers

Consider configuring the following security headers through a CloudFront Response Headers Policy or on the frontend.

|   |   |   |
|---|---|---|
|Header|Recommended value|Purpose|
|Strict-Transport-Security|max-age=31536000; includeSubDomains|Enforce HTTPS|
|X-Content-Type-Options|nosniff|Prevent MIME sniffing|
|X-Frame-Options|DENY or SAMEORIGIN|Prevent clickjacking|
|Referrer-Policy|strict-origin-when-cross-origin|Control Referer information|
|Content-Security-Policy|See below|Mitigate XSS impact|

10.4 Proposed Content Security Policy

Introduce CSP gradually, since an overly strict policy can hinder early MVP development.

Initial proposal

Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.execute-api.ap-northeast-1.amazonaws.com;

Notes

- Adding Google Analytics or AdSense requires additional allowed sources in script-src and img-src
- CSP misconfiguration can prevent advertisements or analytics tags from working
- Initial validation may use Report-Only mode

10.5 WAF Usage Policy

AWS WAF is effective but is not mandatory for the MVP.

Reasons:

- It may increase costs for an individual developer's MVP
- Start with CORS, input limits, and API Gateway-side restrictions
- Consider adoption when traffic grows and spam or attacks increase

Possible adoption points:

- Traffic increases after introducing AdSense
- Contact-form spam increases
- The API receives excessive traffic
- Commercial or paid features are launched

  

11. API Gateway Security Design

11.1 Basic Policy

|   |   |
|---|---|
|Item|Policy|
|API type|HTTP API|
|CORS|Restrict allowed origins|
|Authentication|Not required for MVP; Cognito JWT in Phase 4|
|Rate limiting|Consider for the contact API|
|Input limits|Required in Lambda|
|Error responses|Do not return internal information|

11.2 CORS Policy

In production, restrict allowed origins to the production frontend domain.

Allowed examples

https://example.com

https://www.example.com

Allowed only during development

http://localhost:3000

Configuration to avoid

Access-Control-Allow-Origin: *

11.3 Allowed Methods

Only the following are used in the MVP.

|   |   |
|---|---|
|Method|Purpose|
|POST|Submit an inquiry|
|OPTIONS|CORS preflight|

Add the following in the future.

|   |   |
|---|---|
|Method|Purpose|
|GET|Retrieve terms, questions, and progress|
|PUT|Update user settings|

11.4 API Error Policy

Do not return internal information verbatim.

Bad example:

{

  "message": "DynamoDB ResourceNotFoundException: Table not found ContactsTable"

}

Good example (the Japanese message is a localized site-output example):

{

  "success": false,

  "error": {

    "code": "INTERNAL_SERVER_ERROR",

    "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

  }

}

11.5 API Gateway Logs

Avoid excessive logging in the MVP.

Reasons:

- Keep CloudWatch Logs charges low
- Avoid logging personal information

Record the following only when needed.

- Status code
- Latency
- Request ID
- Whether an error occurred

  

12. Lambda Security Design

12.1 Basic Policy

|   |   |
|---|---|
|Item|Policy|
|Execution roles|Separate by function|
|Permissions|Only required DynamoDB operations|
|Environment variables|Only table names, allowed origins, and similar configuration|
|Input validation|Always perform in Lambda|
|Exception handling|Do not return raw internal errors|
|Logs|Do not output personal information or secrets|
|Timeout|Keep short|

12.2 Contact Lambda Validation

|   |   |
|---|---|
|Field|Rule|
|name|Required; 1–100 characters|
|email|Required; email format; at most 255 characters|
|subject|Required; 1–150 characters|
|message|Required; 1–2,000 characters|
|sourcePage|Optional; at most 255 characters|
|honeypot|Must be an empty string|

12.3 HTML and Script Protection

Apply the following policies even when a contact message contains HTML or scripts.

- Do not display messages until an administration screen exists
- Always escape messages if displayed in the future
- Do not interpret them as HTML in email notifications either
- Do not use React dangerouslySetInnerHTML

12.4 Lambda Timeouts

|   |   |
|---|---|
|Lambda|Recommended timeout|
|contact-submit-function|3–5 seconds|
|get-terms-function|3 seconds|
|get-questions-function|3 seconds|
|submit-answer-function|5 seconds|
|daily-question-function|10 seconds|

Excessively long timeouts can waste execution time because of bugs or external dependencies.

12.5 Lambda Logging Policy

Permitted logs:

INFO request started requestId=req-xxxx

INFO contact saved contactId=contact-xxxx

WARN validation error fields=email,message

ERROR dynamodb error requestId=req-xxxx

Prohibited logs:

email=taro@example.com

message=full contact message body

Authorization=Bearer xxxxx

AWS_SECRET_ACCESS_KEY=xxxxx

  

13. DynamoDB Security Design

13.1 Basic Policy

|   |   |
|---|---|
|Item|Policy|
|Direct public exposure|Do not expose|
|Access path|Lambda only|
|IAM permissions|Only the table operations required by each Lambda|
|Personal information|Do not publish contact data|
|Backups|Consider PITR as needed|
|Encryption|Use AWS-managed encryption|

13.2 ContactsTable Protection Policy

ContactsTable contains personal information.

Stored information:

- Name
- Email address
- Subject
- Message body
- Submission timestamp

Protection policy:

|   |   |
|---|---|
|Item|Description|
|No retrieval through public APIs|POST storage only; do not build a GET listing API|
|No administration screen|Inspect through the AWS console in the MVP|
|Lambda permissions|Start with PutItem only|
|Logging|Do not output full message bodies or email addresses|
|Retention|Review with approximately 1 year as a guideline|

13.3 UserAnswersTable / UserProgressTable Protection Policy

Learning-history data from Phase 4 onward must be accessible only to the user concerned.

Important rules:

- Do not accept userId from the request body
- Obtain userId from the Cognito JWT sub
- Prevent retrieval by specifying another user's userId
- Always use the JWT-derived userId in DynamoDB Queries

13.4 DynamoDB Permission Separation

|   |   |   |
|---|---|---|
|Lambda|Table|Allowed Action|
|contact-submit-function|ContactsTable|PutItem|
|get-questions-function|QuestionsTable|GetItem, Query, Scan|
|submit-answer-function|UserAnswersTable|PutItem|
|submit-answer-function|UserProgressTable|GetItem, UpdateItem|
|get-progress-function|UserProgressTable|GetItem|
|get-review-questions-function|UserProgressTable / QuestionsTable|GetItem, BatchGetItem|

  

14. Contact Form Security

14.1 Anticipated Risks

|   |   |
|---|---|
|Risk|Description|
|Spam submissions|Large numbers of bot submissions|
|XSS strings|Script tags and similar content inserted into messages|
|Long submissions|Increased database usage from excessive text|
|Invalid email addresses|More inquiries that cannot be answered|
|Direct API calls|API calls that bypass the frontend|

14.2 Countermeasures

|   |   |   |
|---|---|---|
|Countermeasure|Description|MVP|
|Frontend validation|Detect input mistakes in advance|Required|
|Lambda validation|Protect against direct API calls|Required|
|honeypot|Hidden field to detect bots|Recommended|
|Character limits|Protect against long or excessive submissions|Required|
|CORS restrictions|Restrict external origins through browsers|Required|
|Rate limiting|Prevent excessive submissions|Under consideration|
|reCAPTCHA|Bot protection|Not required for MVP; consider as needed|

14.3 Honeypot Design

Add an input field invisible to users.

<input type="text" name="honeypot" style="display:none" tabIndex="-1" autoComplete="off" />

Normal users leave it empty; treat automatic completion by a bot as spam.

Processing policy:

- Do not save to DynamoDB if honeypot has a value
- Still return a success response to make detection less obvious to bots

14.4 Contact API Storage Limits

|   |   |
|---|---|
|Field|Limit|
|name|100 characters|
|email|255 characters|
|subject|150 characters|
|message|2,000 characters|
|sourcePage|255 characters|

  

15. Frontend Security

15.1 Basic Policy

|   |   |
|---|---|
|Item|Policy|
|XSS protection|Use normal React escaping and avoid direct HTML insertion|
|External links|Add rel="noopener noreferrer" when using target="_blank"|
|Forms|Validate input|
|Environment variables|Do not place secrets in NEXT_PUBLIC_ variables|
|Dependencies|Avoid adding unnecessary libraries|

15.2 Handling dangerouslySetInnerHTML

Generally do not use it.

When displaying MDX or Markdown, restrict it to your own trusted content.

Do not display user input as HTML.

15.3 Environment Variable Precautions

Next.js environment variables prefixed with NEXT_PUBLIC_ are exposed to the browser.

Permitted values:

NEXT_PUBLIC_API_BASE_URL

NEXT_PUBLIC_SITE_URL

Prohibited values:

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

OPENAI_API_KEY

GOOGLE_CLIENT_SECRET

JWT_SECRET

  

16. GitHub and CI/CD Security

16.1 GitHub Management Policy

|   |   |
|---|---|
|Item|Policy|
|Public Repository|May be public, but must not contain secrets|
|Secrets|Manage through GitHub Secrets|
|.env|Never commit|
|.gitignore|Always configure|
|Branch protection|Protect the main branch when time permits|
|Dependabot|Consider enabling dependency-update notifications|

16.2 Example .gitignore

.env

.env.local

.env.production

.env.development

node_modules/

.next/

out/

dist/

__pycache__/

*.pem

*.key

aws-credentials.json

16.3 Values Stored in GitHub Secrets

|   |   |
|---|---|
|Secret name|Description|
|AWS_ROLE_ARN|IAM role ARN for GitHub Actions|
|AWS_ACCESS_KEY_ID|Only when not using OIDC|
|AWS_SECRET_ACCESS_KEY|Only when not using OIDC|
|S3_BUCKET_NAME|Deployment destination S3 bucket|
|CLOUDFRONT_DISTRIBUTION_ID|CloudFront Distribution ID|

16.4 Recommendation: GitHub OIDC

Prefer assuming an AWS role through GitHub OIDC to storing long-lived access keys in GitHub Secrets.

Access keys are acceptable in the MVP, but aim for OIDC to strengthen the portfolio.

16.5 GitHub Actions Permissions

Grant GitHub Actions only the permissions necessary for deployment.

Allowed operations:

- S3 PutObject
- S3 DeleteObject
- S3 ListBucket
- CloudFront CreateInvalidation

Disallowed operations:

- IAM operations
- All DynamoDB operations
- Operations on all S3 buckets
- AdministratorAccess

  

17. Cognito Authentication Design: Phase 4

17.1 Basic Policy

Use Amazon Cognito when adding login functionality in Phase 4.

|   |   |
|---|---|
|Item|Policy|
|Authentication method|Cognito User Pool|
|Login ID|Email address|
|Password|Follow the Cognito policy|
|JWT|Validate in API Gateway|
|User ID|Use Cognito sub|

17.2 Proposed Password Policy

|   |   |
|---|---|
|Item|Policy|
|Minimum length|At least 8 characters|
|Uppercase letters|Recommended|
|Lowercase letters|Recommended|
|Digits|Recommended|
|Symbols|Optional|

17.3 JWT Usage Policy

Attach the JWT to the Authorization header for authenticated APIs.

Authorization: Bearer <JWT_TOKEN>

Validate through the API Gateway JWT Authorizer.

17.4 Per-user Data Access Control

Important rules:

Do not trust userId in the request body.

Always use JWT sub as userId.

Bad example:

{

  "userId": "other-user-id",

  "questionId": "clf-001"

}

Recommended approach:

userId = JWT claims sub

17.5 APIs Requiring Authentication

|   |   |
|---|---|
|API|Authentication|
|POST /answers|Required|
|GET /progress|Required|
|GET /review-questions|Required|
|GET /me|Required|
|PUT /me|Required|

  

18. SES and Email Notification Security: Phase 4

18.1 Intended Uses

Amazon SES may be used in the future.

Uses:

- Contact notifications
- Daily-question delivery
- Study reminders

18.2 Precautions

|   |   |
|---|---|
|Item|Policy|
|Recipients|Only email addresses authorized by users|
|Opt-out|Allow users to stop notifications|
|Message body|Do not include excessive personal information|
|Anti-spoofing|Consider SPF/DKIM when using a custom domain|
|Sending limits|Do not send in bulk|

  

19. CloudWatch Logs Design

19.1 Logging Policy

|   |   |
|---|---|
|Item|Policy|
|requestId|Log|
|contactId|May be logged|
|Processing result|Log|
|Error type|Log|
|Email address|Do not log|
|Contact message body|Do not log|
|JWT|Do not log|
|Authorization header|Do not log|

19.2 Log Retention

Configure CloudWatch Logs retention in the MVP.

|   |   |
|---|---|
|Log group|Retention period|
|/aws/lambda/contact-submit-function|14–30 days|
|/aws/lambda/get-questions-function|14–30 days|
|/aws/lambda/submit-answer-function|30 days|

Do not retain logs indefinitely.

19.3 Alert Policy

Prioritize AWS Budgets in the MVP; introduce CloudWatch Alarms from Phase 2 onward.

Candidate alerts:

|   |   |
|---|---|
|Alert|Condition|
|Lambda Errors|Repeated errors within a specified period|
|API Gateway 5XX|Increase in 5XX responses|
|API Gateway 4XX|Sharp increase in 4XX responses|
|DynamoDB Throttling|Throttling occurs|

  

20. Personal Information Protection Design

20.1 Personal Information Collected

The following personal information may be collected in the MVP.

|   |   |   |
|---|---|---|
|Item|Collection point|Purpose|
|Name|Contact form|Handle inquiries|
|Email address|Contact form|Send replies|
|Contact message body|Contact form|Handle inquiries|

Information that may be added from Phase 4 onward:

|   |   |
|---|---|
|Item|Purpose|
|Login email address|User authentication|
|Learning history|Display learning progress|
|Accuracy|Analyze weak areas|
|Notification preferences|Daily-question delivery|

20.2 Purposes of Personal Information Use

- Reply to inquiries
- Respond to error reports
- Improve the site
- Display learning history in the future
- Notify the user concerned

20.3 Prohibition on Publishing Personal Information

Do not display the following on public pages.

- Contact data
- Email address
- Learning history
- Accuracy
- Cognito userId

20.4 Alignment with the Privacy Policy

Include the following in the privacy policy.

- Information collected
- Purposes of use
- Cookie usage
- Planned Google Analytics usage
- Planned Google AdSense usage
- Whether information is provided to third parties
- Contact details
- Disclaimer

  

21. Security Precautions for AdSense and Analytics

21.1 Google Analytics

Implementation precautions:

- Explicitly disclose web analytics usage in the privacy policy
- Do not send personally identifiable information to Analytics
- Do not include contact messages or email addresses in events

21.2 Google AdSense

Implementation precautions:

- Explicitly disclose advertising and cookie usage in the privacy policy
- Install advertising code correctly
- Do not click your own advertisements
- Do not encourage fraudulent clicks

21.3 Alignment with CSP

Adding AdSense or Analytics requires additional allowed sources in CSP.

Check the following before implementation.

- script-src
- img-src
- connect-src
- frame-src

  

22. Environment Variable and Secret Management

22.1 Lambda Environment Variables

Values permitted in Lambda:

|   |   |   |
|---|---|---|
|Environment variable|Description|Sensitivity|
|CONTACTS_TABLE_NAME|DynamoDB table name|Low|
|ALLOWED_ORIGIN|Allowed origin|Low|
|LOG_LEVEL|Log level|Low|

Values requiring care when configured directly in Lambda:

|   |   |
|---|---|
|Environment variable|Policy|
|External API keys|Consider Secrets Manager or SSM Parameter Store|
|Email credentials|Use SES/IAM roles if possible|
|JWT private keys|Do not manage independently because Cognito is used|

22.2 Frontend Environment Variables

Configure only values that can be exposed to the browser.

Permitted examples:

NEXT_PUBLIC_API_BASE_URL

NEXT_PUBLIC_SITE_URL

Prohibited examples:

AWS_SECRET_ACCESS_KEY

AWS_ACCESS_KEY_ID

OPENAI_API_KEY

DATABASE_PASSWORD

JWT_SECRET

22.3 Secrets Manager Usage Policy

Not mandatory for the MVP.

Consider using it when handling the following in the future.

- External AI API keys
- Stripe secret keys
- External email-service keys
- Administrator tokens

  

23. Dependency Security

23.1 Frontend Dependencies

|   |   |
|---|---|
|Item|Policy|
|Adding packages|Keep to the necessary minimum|
|Unknown libraries|Do not use casually|
|npm audit|Check regularly|
|Dependabot|Consider enabling|
|Lock files|Manage package-lock.json / pnpm-lock.yaml|

23.2 Python Dependencies

|   |   |
|---|---|
|Item|Policy|
|requirements.txt|Manage explicitly|
|Unnecessary libraries|Do not install|
|boto3|May not need to be added if included in the Lambda runtime|
|Version pinning|Pin as needed|

23.3 Basic Dependency Rules

- Remove unused packages
- Do not judge solely by star counts
- Check whether maintenance is recent
- Investigate security warnings

  

24. Security Test Design

24.1 MVP Test Scope

|   |   |
|---|---|
|Target|Test|
|S3|Direct URL access is not possible|
|CloudFront|HTTPS access works|
|API Gateway|CORS is restricted|
|Lambda|Invalid input returns an error|
|DynamoDB|Contact submissions are stored|
|GitHub|No secrets are committed|
|CloudWatch Logs|No personal information is logged|

24.2 Contact Form Tests

|   |   |   |
|---|---|---|
|ID|Test|Expected result|
|SEC-T-001|Empty name|400 error|
|SEC-T-002|Invalid email format|400 error|
|SEC-T-003|message exceeds 2,000 characters|400 error|
|SEC-T-004|Input a script tag|Not executed even if stored|
|SEC-T-005|honeypot contains input|Return success without saving|
|SEC-T-006|Submit from an unauthorized origin|Blocked by CORS|

24.3 IAM Tests

|   |   |   |
|---|---|---|
|ID|Test|Expected result|
|IAM-T-001|Lambda can PutItem to ContactsTable|Success|
|IAM-T-002|Lambda cannot Scan ContactsTable|Failure|
|IAM-T-003|GitHub Actions can PutObject to S3|Success|
|IAM-T-004|GitHub Actions cannot perform IAM operations|Failure|

24.4 S3 / CloudFront Tests

|   |   |   |
|---|---|---|
|ID|Test|Expected result|
|S3-T-001|Access an S3 object URL directly|Denied|
|S3-T-002|Access the CloudFront URL|Displayed successfully|
|CF-T-001|Access over HTTP|Redirected to HTTPS|
|CF-T-002|Check security headers|Configured|

  

25. Incident Response Policy

25.1 Anticipated Incidents

|   |   |
|---|---|
|Incident|Example|
|AWS access-key leak|Accidental GitHub commit|
|Sudden cost increase|Excessive API traffic or key leakage|
|Contact spam|Increasing bot submissions|
|Personal-information leak|Accidental DynamoDB data exposure|
|Website tampering|Misuse of deployment permissions|

25.2 Response to an AWS Access-key Leak

1. Immediately disable the affected access key.

2. Check whether removal from GitHub history is necessary.

3. Check AWS CloudTrail for unauthorized operations.

4. Review the AWS billing dashboard.

5. Contact AWS Support if necessary.

6. Apply least privilege when issuing a replacement key.

7. Update GitHub Secrets.

25.3 Response to a Sudden Cost Increase

1. Check AWS Budgets notifications.

2. Identify the service with rising costs in Cost Explorer.

3. Stop or delete the affected resources.

4. Check CloudWatch Logs and API Gateway metrics.

5. Disable keys if unauthorized access is suspected.

6. Strengthen rate limits and permission restrictions to prevent recurrence.

25.4 Response to Increasing Contact Spam

1. Check the submission count in ContactsTable.

2. Confirm that the honeypot works.

3. Check API Gateway request counts.

4. Configure rate limiting.

5. Consider reCAPTCHA or WAF as necessary.

6. Delete clearly identified spam data.

  

7. MVP Security Checklist

26.1 AWS Account

|   |   |
|---|---|
|Check|Status|
|Root-user MFA configured|Not done / Done|
|No root access keys created|Not done / Done|
|Administrative IAM-user MFA configured|Not done / Done|
|AWS Budgets configured|Not done / Done|

26.2 S3 / CloudFront

|   |   |
|---|---|
|Check|Status|
|S3 Public Access Block enabled|Not done / Done|
|S3 not exposed directly|Not done / Done|
|CloudFront OAC configured|Not done / Done|
|Bucket Policy allows only CloudFront|Not done / Done|
|HTTP redirected to HTTPS|Not done / Done|

26.3 API / Lambda / DynamoDB

|   |   |
|---|---|
|Check|Status|
|CORS restricted to production domain|Not done / Done|
|Input validation implemented in Lambda|Not done / Done|
|Lambda execution role follows least privilege|Not done / Done|
|Only PutItem to ContactsTable allowed|Not done / Done|
|No personal information in CloudWatch Logs|Not done / Done|
|CloudWatch Logs retention configured|Not done / Done|

26.4 GitHub

|   |   |
|---|---|
|Check|Status|
|.env included in .gitignore|Not done / Done|
|No AWS access keys committed|Not done / Done|
|GitHub Secrets used|Not done / Done|
|GitHub Actions permissions minimized|Not done / Done|
|Unnecessary Secrets deleted|Not done / Done|

  

27. Security Implementation by Phase

27.1 Phase 1: Publish the Static Site

Required measures:

- root MFA
- AWS Budgets
- S3 Public Access Block
- CloudFront OAC
- HTTPS delivery
- GitHub secret management

27.2 Phase 2: Add Serverless APIs

Required measures:

- API Gateway CORS restrictions
- Lambda input validation
- DynamoDB least privilege
- CloudWatch Logs retention configuration
- Contact-spam protection

27.3 Phase 3: Prepare for Monetization

Required measures:

- Establish a privacy policy
- Document Cookie / Analytics / AdSense usage
- Configure security headers
- HTTPS for the custom domain
- Review CSP when using external scripts

27.4 Phase 4: Develop into a Learning Application

Required measures:

- Cognito authentication
- JWT validation
- Per-user access control
- Derive userId from JWT
- Restrict learning-history access to the user concerned
- Notification opt-out functionality
- Account closure and data deletion policy

  

28. Points to Explain in the Portfolio

28.1 S3 / CloudFront

Example explanation:

The static site is stored in S3, but the S3 bucket is not directly public. CloudFront Origin Access Control ensures that files can be retrieved only through CloudFront. HTTP requests are redirected to HTTPS to deliver static content securely.

28.2 IAM

Example explanation:

IAM follows least privilege: the Lambda execution role is granted only PutItem permission on the target DynamoDB table. The GitHub Actions role is also intended to receive only the permissions needed for S3 deployment and CloudFront cache invalidation.

28.3 Contact API

Example explanation:

The contact form is implemented with API Gateway + Lambda + DynamoDB. Inputs are validated in Lambda as well as on the frontend, while a honeypot and character limits help prevent spam. Email addresses and complete message bodies are not written to CloudWatch Logs.

28.4 Future Cognito Integration

Example explanation:

If login is added in the future, Cognito will be used and JWTs validated in API Gateway. Learning-history APIs will not trust userId in the request body; they will use JWT sub as userId so users can retrieve and update only their own data.

  

29. Adopted and Deferred Security Measures

29.1 Measures Adopted in the MVP

|   |   |
|---|---|
|Measure|Reason|
|MFA|Essential for AWS account protection|
|AWS Budgets|Essential for detecting unexpected charges|
|S3 Public Access Block|Prevent unintended exposure|
|CloudFront OAC|Avoid direct S3 exposure|
|HTTPS|Required to protect communications|
|IAM least privilege|Limit the impact of compromise|
|CORS restrictions|Restrict API usage from external origins|
|Lambda input validation|Protect against direct API calls|
|CloudWatch Logs minimization|Prevent personal-information leakage|
|GitHub Secrets|Credential management|

29.2 Measures Not Adopted in the MVP

|   |   |   |
|---|---|---|
|Measure|Reason for deferral|Future adoption point|
|AWS WAF|Increases MVP costs and operational workload|After traffic increases|
|reCAPTCHA|Excessive for the initial form|After spam increases|
|Cognito|Login not needed in the MVP|Phase 4|
|Secrets Manager|Few secrets in the MVP|When external API keys are used|
|GuardDuty|Cost takes priority for an individual MVP|After commercialization or paid features|
|Multi-account architecture|Excessive for individual development|After full-scale operations begin|

  

30. Acceptance Criteria

30.1 Security Design Document Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-SEC-DOC-001|AWS account protection policy is defined|
|AC-SEC-DOC-002|IAM least-privilege policy is defined|
|AC-SEC-DOC-003|S3 / CloudFront / OAC protection policy is defined|
|AC-SEC-DOC-004|API Gateway / Lambda protection policy is defined|
|AC-SEC-DOC-005|DynamoDB protection policy is defined|
|AC-SEC-DOC-006|Contact-form spam and input protections are defined|
|AC-SEC-DOC-007|GitHub Secrets and CI/CD policies are defined|
|AC-SEC-DOC-008|Information permitted and prohibited in CloudWatch Logs is defined|
|AC-SEC-DOC-009|Phase 4 Cognito authentication policy is defined|
|AC-SEC-DOC-010|Security measures deferred from the MVP and reasons are defined|

30.2 MVP Implementation Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-SEC-MVP-001|Root-user MFA is configured|
|AC-SEC-MVP-002|AWS Budgets is configured|
|AC-SEC-MVP-003|S3 Public Access Block is enabled|
|AC-SEC-MVP-004|S3 content is served through CloudFront OAC|
|AC-SEC-MVP-005|S3 object URLs cannot be accessed directly|
|AC-SEC-MVP-006|HTTPS access works through CloudFront|
|AC-SEC-MVP-007|Lambda execution role follows least privilege|
|AC-SEC-MVP-008|Contact API has input validation|
|AC-SEC-MVP-009|CORS is restricted to the production domain|
|AC-SEC-MVP-010|CloudWatch Logs contains no personal information|
|AC-SEC-MVP-011|GitHub contains no .env files or access keys|

  

31. Related Design Documents to Create Next

Create the following after this security design document.

1. Cost management design
2. Infrastructure setup guide
3. Lambda implementation design
4. CI/CD design
5. Operations and monitoring design
6. Development task list
7. GitHub README draft

  

8. Conclusion

This product requires the following security measures starting at the MVP stage.

- MFA configuration for the AWS account
- Billing monitoring with AWS Budgets
- S3 Public Access Block
- Prevention of direct S3 exposure through CloudFront OAC
- HTTPS delivery
- IAM least privilege
- API Gateway CORS restrictions
- Input validation in Lambda
- Least-privilege access to DynamoDB
- No personal information in CloudWatch Logs
- Credential management through GitHub Secrets

WAF, Cognito, Secrets Manager, reCAPTCHA, and similar tools are not mandatory for the MVP because they increase costs and operational workload during early individual development and delay publication.

However, security will be strengthened incrementally as traffic or spam increases, login is added, or paid features are introduced.

This design aims to make the low-cost individual project presentable as a portfolio that applies fundamental AWS security principles.
