AWS Certification Learning Site API Design

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document title|AWS Certification Learning Site API Design|
|Target product|AWS Certification Roadmap Lab|
|Target phases|MVP development through Phase 4 learning application|
|Purpose|Define API specifications between the frontend, API Gateway, Lambda, and DynamoDB|
|Planned technologies|Amazon API Gateway / AWS Lambda / Python / DynamoDB / Next.js / TypeScript|

  

2. Purpose of This Design Document

This document defines the API specifications used by the AWS certification learning site, AWS Certification Roadmap Lab.

The inquiry submission API is required for the MVP.

AWS terms, practice questions, comparison articles, architecture diagrams, and blog posts are primarily managed as static Markdown / MDX / JSON in the MVP. However, this document also defines extension APIs because these resources may move to DynamoDB and APIs in the future.

This document covers the following APIs.

- Inquiry submission API
- AWS term retrieval API
- Practice question retrieval API
- Architecture diagram retrieval API
- Blog post metadata retrieval API
- Answer history saving API
- Learning progress retrieval API
- Review question retrieval API
- Daily question retrieval API

  

3. Basic API Design Policies

3.1 Basic Policies

|   |   |
|---|---|
|Policy|Description|
|Minimal MVP APIs|Only the inquiry submission API is required for the MVP|
|Prioritize static content|Initially manage terms, questions, and articles in JSON/MDX|
|Serverless architecture|Use API Gateway + Lambda + DynamoDB|
|Low-cost operation|Prioritize static delivery without excessive API calls|
|Ensure extensibility|Design APIs to support future login, learning history, and weak-area analysis|
|Validate on both frontend and backend|Prevent invalid input and spam|
|Consistent response format|Standardize success and error response formats|
|CORS restrictions|Allow only the production frontend domain|
|Least privilege|Allow Lambda to access only the DynamoDB tables it needs|

  

4. API Architecture Overview

4.1 API Gateway Configuration

|   |   |
|---|---|
|Item|Policy|
|API type|Use HTTP API as the default|
|Authentication|None in the MVP. Introduce a Cognito JWT Authorizer in Phase 4|
|CORS|Allow only the production domain and development environment|
|Lambda integration|Use Lambda Proxy Integration|
|Rate limiting|Consider configuring it for the inquiry API and similar endpoints|
|Logging|Output only necessary logs to CloudWatch|

4.2 Base URLs

Development environment

https://api-dev.example.com

Production environment

https://api.example.com

The MVP may use the default API Gateway URL.

https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

4.3 API Versioning Policy

Do not include a version in URLs initially.

If the APIs are exposed externally in the future, use the following format.

/api/v1/contact

/api/v1/questions

Prioritize simplicity in the MVP.

  

5. API List

5.1 Required MVP APIs

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|API ID|Method|Path|Summary|Phase|Requirement|
|API-001|POST|/contact|Submit an inquiry|MVP / Phase 2|Required|

5.2 Optional APIs from Phase 2 Onward

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|API ID|Method|Path|Summary|Phase|Requirement|
|API-002|GET|/terms|Retrieve an AWS term list|Phase 2|Optional|
|API-003|GET|/terms/{termId}|Retrieve AWS term details|Phase 2|Optional|
|API-004|GET|/questions|Retrieve a practice question list|Phase 2|Optional|
|API-005|GET|/questions/{questionId}|Retrieve practice question details|Phase 2|Optional|
|API-006|GET|/architectures|Retrieve an architecture diagram list|Phase 2 onward|Optional|
|API-007|GET|/architectures/{architectureId}|Retrieve architecture diagram details|Phase 2 onward|Optional|

5.3 Learning Application APIs from Phase 4 Onward

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|API ID|Method|Path|Summary|Phase|Authentication|
|API-101|POST|/answers|Save answer history|Phase 4|Required|
|API-102|GET|/progress|Retrieve learning progress|Phase 4|Required|
|API-103|GET|/review-questions|Retrieve review questions|Phase 4|Required|
|API-104|GET|/me|Retrieve the logged-in user's information|Phase 4|Required|
|API-105|PUT|/me|Update user settings|Phase 4|Required|
|API-106|GET|/daily-question|Retrieve today's question|Phase 4|Optional|

  

6. Common Specifications

6.1 Request Format

GET requests

- Specify search and filter conditions through query parameters
- Include the Authorization header for APIs that require authentication

POST / PUT requests

- Send data in JSON format
- Specify Content-Type: application/json

Content-Type: application/json

6.2 Authentication Header

Authenticated APIs from Phase 4 onward use a JWT obtained from Cognito.

Authorization: Bearer <JWT_TOKEN>

No authentication in the MVP.

6.3 Common Success Response Format

{

  "success": true,

  "data": {},

  "message": "OK",

  "requestId": "req-xxxxxxxx"

}

6.4 Common Error Response Format (Localized Japanese Message Specimen)

{

  "success": false,

  "error": {

    "code": "VALIDATION_ERROR",

    "message": "入力内容に誤りがあります。",

    "details": [

      {

        "field": "email",

        "message": "正しいメールアドレスを入力してください。"

      }

    ]

  },

  "requestId": "req-xxxxxxxx"

}

6.5 HTTP Status Codes

|   |   |
|---|---|
|Status|Usage|
|200|Successful retrieval|
|201|Successful creation|
|400|Invalid request or validation error|
|401|Unauthenticated|
|403|Forbidden|
|404|Requested data not found|
|409|Duplicate or conflict|
|429|Too many requests|
|500|Internal server error|

6.6 Error Code List

|   |   |   |
|---|---|---|
|Error code|HTTP|Description|
|VALIDATION_ERROR|400|Invalid input value|
|INVALID_JSON|400|Invalid JSON format|
|MISSING_REQUIRED_FIELD|400|Missing required field|
|UNAUTHORIZED|401|Not authenticated|
|FORBIDDEN|403|No permission|
|NOT_FOUND|404|Data does not exist|
|TOO_MANY_REQUESTS|429|Too many requests|
|INTERNAL_SERVER_ERROR|500|Internal server error|
|DYNAMODB_ERROR|500|DynamoDB operation error|

6.7 Date Format

Use ISO 8601 format for dates.

2026-06-01T10:30:00+09:00

6.8 Character Encoding

UTF-8

  

7. CORS Design

7.1 Basic CORS Policy

|   |   |
|---|---|
|Item|Policy|
|Allowed production Origin|Production frontend domain only|
|Allowed development Origin|Allow localhost only during development|
|Allowed methods|GET, POST, PUT, OPTIONS|
|Allowed headers|Content-Type, Authorization|
|Cookie usage|Not used in the MVP|

7.2 Production CORS Configuration Example

{

  "allowOrigins": [

    "https://example.com"

  ],

  "allowMethods": ["GET", "POST", "PUT", "OPTIONS"],

  "allowHeaders": ["Content-Type", "Authorization"],

  "maxAge": 300

}

7.3 Development CORS Configuration Example

{

  "allowOrigins": [

    "http://localhost:3000",

    "https://example.com"

  ],

  "allowMethods": ["GET", "POST", "PUT", "OPTIONS"],

  "allowHeaders": ["Content-Type", "Authorization"],

  "maxAge": 300

}

7.4 Notes

- Do not use * as a general rule
- Do not allow localhost in production
- Allow the Authorization header for authenticated APIs
- Verify support for OPTIONS requests

  

8. API-001 Inquiry Submission API

8.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-001|
|Name|Inquiry submission API|
|Method|POST|
|Path|/contact|
|Authentication|Not required|
|Phase|MVP / Phase 2|
|Lambda|contact-submit-function|
|DynamoDB|ContactsTable|

8.2 Purpose

Receive user inquiries, error reports, work requests, and feedback, and save them to DynamoDB.

8.3 Request (Localized Japanese Input Specimen)

Headers

Content-Type: application/json

Body

{

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "honeypot": ""

}

8.4 Request Fields

|   |   |   |   |   |
|---|---|---|---|---|
|Field|Type|Required|Constraints|Description|
|name|string|Required|1–100 characters|Name|
|email|string|Required|Email format, up to 255 characters|Email address|
|subject|string|Required|1–150 characters|Subject|
|message|string|Required|1–2,000 characters|Message body|
|sourcePage|string|Optional|Up to 255 characters|Source page|
|honeypot|string|Optional|Must be an empty string|Hidden field for spam prevention|

8.5 Success Response (Localized Japanese Message Specimen)

HTTP 201

{

  "success": true,

  "data": {

    "contactId": "contact-7f8b2c9a",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-20260601-abc123"

}

8.6 Validation Error (Localized Japanese Message Specimen)

HTTP 400

{

  "success": false,

  "error": {

    "code": "VALIDATION_ERROR",

    "message": "入力内容に誤りがあります。",

    "details": [

      {

        "field": "email",

        "message": "正しいメールアドレスを入力してください。"

      },

      {

        "field": "message",

        "message": "本文を入力してください。"

      }

    ]

  },

  "requestId": "req-20260601-def456"

}

8.7 Spam Detection Response (Localized Japanese Message Specimen)

Treat a request as spam if honeypot contains a value.

For security, the policy is to make the response appear successful even when spam is detected.

HTTP 201

{

  "success": true,

  "data": {

    "contactId": null,

    "status": "accepted"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-20260601-spam001"

}

8.8 Data Saved to DynamoDB (Localized Japanese Input Specimen)

{

  "contactId": "contact-7f8b2c9a",

  "createdAt": "2026-06-01T10:30:00+09:00",

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "status": "new",

  "sourcePage": "/contact",

  "userAgent": "Mozilla/5.0 ..."

}

8.9 Lambda Processing Flow

1. Receive the request from API Gateway

2. Generate requestId

3. Parse JSON

4. Check honeypot

5. Validate input values

6. Generate contactId

7. Generate createdAt

8. Save to DynamoDB ContactsTable

9. Output minimal logs to CloudWatch Logs

10. Return a success response

8.10 Lambda Environment Variables

|   |   |
|---|---|
|Environment variable|Description|
|CONTACTS_TABLE_NAME|ContactsTable name|
|ALLOWED_ORIGIN|Allowed frontend Origin|
|LOG_LEVEL|INFO / ERROR, etc.|

8.11 IAM Permissions

The only permissions required by contact-submit-function are the following.

{

  "Effect": "Allow",

  "Action": [

    "dynamodb:PutItem"

  ],

  "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTable"

}

8.12 Logging Policy

Information that may be logged:

INFO contact submitted contactId=contact-xxxx

WARN validation error fields=email,message

ERROR dynamodb put item failed requestId=req-xxxx

Information that must not be logged:

- Full email addresses
- Full inquiry message bodies
- AWS credentials
- API keys

8.13 Acceptance Criteria

|   |   |
|---|---|
|ID|Condition|
|AC-API-001|Valid inquiries can be submitted|
|AC-API-002|Inquiry details are saved to DynamoDB|
|AC-API-003|Returns 400 when required fields are missing|
|AC-API-004|Returns 400 for an invalid email format|
|AC-API-005|Does not save to DynamoDB when honeypot has a value|
|AC-API-006|Processing results can be checked in CloudWatch Logs|
|AC-API-007|CORS is restricted to the production domain|

  

9. API-002 AWS Term List Retrieval API

9.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-002|
|Name|AWS term list retrieval API|
|Method|GET|
|Path|/terms|
|Authentication|Not required|
|Phase|Phase 2 onward|
|Lambda|get-terms-function|
|DynamoDB|TermsTable|
|Required for MVP|No|

9.2 Purpose

Retrieve a list of AWS terms.

This API is optional because static JSON management is sufficient for the MVP.

9.3 Query Parameters

|   |   |   |   |   |
|---|---|---|---|---|
|Parameter|Type|Required|Description|Example|
|category|string|Optional|Filter by category|Storage|
|exam|string|Optional|Exam classification|CLF-C02|
|keyword|string|Optional|Keyword search|s3|
|level|string|Optional|Difficulty level|beginner|
|limit|number|Optional|Number of items to retrieve|20|
|nextToken|string|Optional|Pagination token|xxxxx|

9.4 Request Example

GET /terms?category=Storage&exam=CLF-C02&limit=20

9.5 Success Response (Localized Japanese Learning Content Specimen)

HTTP 200

{

  "success": true,

  "data": {

    "items": [

      {

        "termId": "s3",

        "name": "Amazon S3",

        "shortName": "S3",

        "category": "Storage",

        "level": "beginner",

        "examScopes": ["CLF-C02", "SAA-C03"],

        "oneLine": "ファイルを安全かつ低コストに保存するためのAWSの代表的なストレージサービス。",

        "updatedAt": "2026-06-01"

      }

    ],

    "nextToken": null

  },

  "message": "OK",

  "requestId": "req-20260601-terms001"

}

9.6 Response Fields

Return only lightweight information in the list.

|   |   |
|---|---|
|Field|Description|
|termId|Term ID|
|name|Official name|
|shortName|Abbreviation|
|category|Category|
|level|Difficulty level|
|examScopes|Applicable exams|
|oneLine|One-line description|
|updatedAt|Last updated date|

9.7 DynamoDB Access Policy

Not required for the MVP.

Use the following design if migrating to DynamoDB.

|   |   |
|---|---|
|Item|Description|
|Table|TermsTable|
|Primary key|termId|
|Candidate GSIs|CategoryIndex, ExamScopeIndex|

9.8 Notes

- High-precision keyword search is difficult with DynamoDB alone
- Searching JSON on the frontend is simpler for the MVP
- Consider OpenSearch or similar services if full-featured search becomes necessary, but do not use them for the MVP

  

10. API-003 AWS Term Detail Retrieval API

10.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-003|
|Name|AWS term detail retrieval API|
|Method|GET|
|Path|/terms/{termId}|
|Authentication|Not required|
|Phase|Phase 2 onward|
|Lambda|get-terms-function|
|DynamoDB|TermsTable|
|Required for MVP|No|

10.2 Request Example

GET /terms/s3

10.3 Path Parameters

|   |   |   |   |
|---|---|---|---|
|Parameter|Type|Required|Description|
|termId|string|Required|AWS term ID|

10.4 Success Response (Localized Japanese Learning Content Specimen)

HTTP 200

{

  "success": true,

  "data": {

    "termId": "s3",

    "name": "Amazon S3",

    "shortName": "S3",

    "category": "Storage",

    "level": "beginner",

    "examScopes": ["CLF-C02", "SAA-C03"],

    "summary": "オブジェクトストレージサービス。画像、動画、ログ、バックアップ、静的サイトファイルなどを保存できる。",

    "oneLine": "ファイルを安全かつ低コストに保存するためのAWSの代表的なストレージサービス。",

    "useCases": [

      "静的Webサイトのホスティング",

      "画像・動画ファイルの保存",

      "ログ保存"

    ],

    "examPoints": [

      "オブジェクトストレージである",

      "高い耐久性を持つ",

      "ストレージクラスを選択できる"

    ],

    "saaPoints": [

      "静的コンテンツ配信ではS3 + CloudFrontが基本構成になる"

    ],

    "relatedServices": ["cloudfront", "ebs", "efs"],

    "comparisonSlugs": ["s3-vs-ebs-vs-efs"],

    "architectureSlugs": ["static-site-s3-cloudfront"],

    "tags": ["storage", "object-storage"],

    "costNotes": ["保存容量、リクエスト数、データ転送量で課金される"],

    "securityNotes": ["バケットを安易にパブリック公開しない"],

    "updatedAt": "2026-06-01"

  },

  "message": "OK",

  "requestId": "req-20260601-term001"

}

10.5 Not Found Response (Localized Japanese Message Specimen)

HTTP 404

{

  "success": false,

  "error": {

    "code": "NOT_FOUND",

    "message": "指定されたAWS用語が見つかりません。"

  },

  "requestId": "req-20260601-term404"

}

10.6 Acceptance Criteria

|   |   |
|---|---|
|ID|Condition|
|AC-API-TERM-001|Details can be retrieved for an existing termId|
|AC-API-TERM-002|Returns 404 for a nonexistent termId|
|AC-API-TERM-003|Can return related services, comparison articles, and architecture diagram information|

  

11. API-004 Practice Question List Retrieval API

11.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-004|
|Name|Practice question list retrieval API|
|Method|GET|
|Path|/questions|
|Authentication|Not required|
|Phase|Phase 2 onward|
|Lambda|get-questions-function|
|DynamoDB|QuestionsTable|
|Required for MVP|No|

11.2 Purpose

Retrieve a list of practice questions.

Static JSON management is also acceptable for the MVP.

11.3 Query Parameters

|   |   |   |   |   |
|---|---|---|---|---|
|Parameter|Type|Required|Description|Example|
|exam|string|Optional|Exam classification|CLF-C02|
|category|string|Optional|Category|Cloud Concepts|
|difficulty|string|Optional|Difficulty level|easy|
|relatedService|string|Optional|Related service|s3|
|limit|number|Optional|Number of items to retrieve|20|
|nextToken|string|Optional|Pagination|xxxxx|

11.4 Request Example

GET /questions?exam=CLF-C02&category=Cloud%20Concepts&limit=20

11.5 Success Response (Localized Japanese Learning Content Specimen)

HTTP 200

{

  "success": true,

  "data": {

    "items": [

      {

        "questionId": "clf-001",

        "exam": "CLF-C02",

        "category": "Cloud Concepts",

        "difficulty": "easy",

        "question": "AWSクラウドの主な利点として最も適切なものはどれですか？",

        "relatedServices": ["ec2", "auto-scaling"],

        "tags": ["cloud-concepts", "scalability"]

      }

    ],

    "nextToken": null

  },

  "message": "OK",

  "requestId": "req-20260601-questions001"

}

11.6 List Response Notes

The list API should not return correct-answer information.

Fields not returned:

- correctChoiceId
- explanation
- choiceExplanations

Reasons:

- Not needed for list display
- Avoid making correct answers easily visible on the client

However, if the MVP uses static JSON management, correct answers are also included on the frontend, so strict concealment is not possible. This is acceptable for a certification learning site, but access should be controlled by the API if the content becomes a paid question bank.

  

12. API-005 Practice Question Detail Retrieval API

12.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-005|
|Name|Practice question detail retrieval API|
|Method|GET|
|Path|/questions/{questionId}|
|Authentication|Not required|
|Phase|Phase 2 onward|
|Lambda|get-questions-function|
|DynamoDB|QuestionsTable|
|Required for MVP|No|

12.2 Request Example

GET /questions/clf-001

12.3 Success Response (Localized Japanese Learning Content Specimen)

HTTP 200

{

  "success": true,

  "data": {

    "questionId": "clf-001",

    "exam": "CLF-C02",

    "category": "Cloud Concepts",

    "domain": "Cloud Concepts",

    "difficulty": "easy",

    "question": "AWSクラウドの主な利点として最も適切なものはどれですか？",

    "choices": [

      {

        "choiceId": "A",

        "text": "物理サーバーの購入が必須になる"

      },

      {

        "choiceId": "B",

        "text": "需要に応じてリソースを拡張・縮小できる"

      },

      {

        "choiceId": "C",

        "text": "すべてのセキュリティ責任がAWS側になる"

      },

      {

        "choiceId": "D",

        "text": "すべてのサービスが無料で利用できる"

      }

    ],

    "correctChoiceId": "B",

    "explanation": "AWSでは必要に応じてリソースを拡張・縮小できるため、需要変動に対応しやすい。",

    "choiceExplanations": {

      "A": "クラウドでは物理サーバーを自分で購入する必要はありません。",

      "B": "正解です。クラウドの代表的な利点はスケーラビリティです。",

      "C": "セキュリティはAWSとユーザーの責任共有モデルです。",

      "D": "AWSには無料枠がありますが、すべてのサービスが無料ではありません。"

    },

    "relatedServices": ["ec2", "auto-scaling"],

    "relatedTerms": ["shared-responsibility-model"],

    "relatedComparisons": [],

    "tags": ["cloud-concepts", "scalability"],

    "updatedAt": "2026-06-01"

  },

  "message": "OK",

  "requestId": "req-20260601-question001"

}

12.4 Not Found Response (Localized Japanese Message Specimen)

HTTP 404

{

  "success": false,

  "error": {

    "code": "NOT_FOUND",

    "message": "指定された問題が見つかりません。"

  },

  "requestId": "req-20260601-question404"

}

12.5 Notes

For freely available questions, the detail API may return the correct answer and explanation.

For future paid questions or a full learning application, split the APIs as follows.

- Question retrieval API: Return only the question text and choices
- Answer submission API: Return the correct answer and explanation after an answer is submitted

  

13. API-006 Architecture Diagram List Retrieval API

13.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-006|
|Name|Architecture diagram list retrieval API|
|Method|GET|
|Path|/architectures|
|Authentication|Not required|
|Phase|Phase 2 onward|
|Required for MVP|No|

13.2 Query Parameters

|   |   |   |   |
|---|---|---|---|
|Parameter|Type|Required|Description|
|category|string|Optional|Architecture category|
|exam|string|Optional|Applicable exam|
|service|string|Optional|Service used|
|level|string|Optional|Difficulty level|

13.3 Success Response (Localized Japanese Learning Content Specimen)

{

  "success": true,

  "data": {

    "items": [

      {

        "architectureId": "arc-001",

        "slug": "static-site-s3-cloudfront",

        "title": "S3 + CloudFront 静的Webサイト構成",

        "description": "S3に配置した静的サイトをCloudFrontで配信する基本構成です。",

        "category": "Static Hosting",

        "level": "beginner",

        "examScopes": ["CLF-C02", "SAA-C03"],

        "services": ["s3", "cloudfront", "iam"],

        "diagramPath": "/images/architectures/static-site-s3-cloudfront.png",

        "updatedAt": "2026-06-01"

      }

    ]

  },

  "message": "OK",

  "requestId": "req-20260601-arch001"

}

13.4 Treatment in the MVP

Static MDX management is recommended for architecture diagrams, so this API is generally unnecessary.

  

14. API-007 Architecture Diagram Detail Retrieval API

14.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-007|
|Name|Architecture diagram detail retrieval API|
|Method|GET|
|Path|/architectures/{architectureId}|
|Authentication|Not required|
|Phase|Phase 2 onward|
|Required for MVP|No|

14.2 Success Response (Localized Japanese Learning Content Specimen)

{

  "success": true,

  "data": {

    "architectureId": "arc-001",

    "slug": "static-site-s3-cloudfront",

    "title": "S3 + CloudFront 静的Webサイト構成",

    "description": "S3に配置した静的サイトをCloudFrontで配信する基本構成です。",

    "category": "Static Hosting",

    "level": "beginner",

    "examScopes": ["CLF-C02", "SAA-C03"],

    "services": ["s3", "cloudfront", "iam", "acm", "route53"],

    "diagramPath": "/images/architectures/static-site-s3-cloudfront.png",

    "flow": [

      "ユーザーがCloudFrontへアクセスする",

      "CloudFrontがS3から静的ファイルを取得する",

      "S3はCloudFront経由のアクセスのみ許可する"

    ],

    "designPoints": {

      "availability": "S3とCloudFrontのマネージドサービスを利用する",

      "security": "S3を直接公開せずOACを利用する",

      "cost": "EC2を使わず低コストにする",

      "performance": "CloudFrontキャッシュで高速配信する"

    },

    "relatedTerms": ["s3", "cloudfront", "iam"],

    "updatedAt": "2026-06-01"

  },

  "message": "OK",

  "requestId": "req-20260601-arch-detail001"

}

14.3 Treatment in the MVP

Architecture diagram details are managed as static MDX pages, so no API is needed for the MVP.

  

15. API-101 Answer History Saving API

15.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-101|
|Name|Answer history saving API|
|Method|POST|
|Path|/answers|
|Authentication|Required|
|Phase|Phase 4|
|Lambda|submit-answer-function|
|DynamoDB|UserAnswersTable, UserProgressTable|

15.2 Purpose

Save the logged-in user's question answer history and update learning progress.

15.3 Headers

Content-Type: application/json

Authorization: Bearer <JWT_TOKEN>

15.4 Request Body

{

  "questionId": "clf-001",

  "exam": "CLF-C02",

  "category": "Cloud Concepts",

  "selectedChoiceId": "B",

  "correctChoiceId": "B",

  "elapsedSeconds": 23

}

15.5 Request Fields

|   |   |   |   |
|---|---|---|---|
|Field|Type|Required|Description|
|questionId|string|Required|Question ID|
|exam|string|Required|Exam classification|
|category|string|Required|Question category|
|selectedChoiceId|string|Required|Choice selected by the user|
|correctChoiceId|string|Required|Correct choice|
|elapsedSeconds|number|Optional|Time taken to answer, in seconds|

15.6 Success Response (Localized Japanese Message Specimen)

HTTP 201

{

  "success": true,

  "data": {

    "answerId": "ans-20260801-001",

    "questionId": "clf-001",

    "isCorrect": true,

    "progress": {

      "exam": "CLF-C02",

      "totalAnswered": 31,

      "correctCount": 25,

      "accuracy": 80.6,

      "weakCategories": ["Security and Compliance"]

    }

  },

  "message": "回答を保存しました。",

  "requestId": "req-20260801-answer001"

}

15.7 Lambda Processing Flow

1. Get userId from the JWT

2. Validate the request Body

3. Calculate isCorrect from selectedChoiceId and correctChoiceId

4. Generate answerId

5. Save the answer history to UserAnswersTable

6. Retrieve UserProgressTable

7. Update totalAnswered, correctCount, accuracy, and categoryStats

8. If the answer is incorrect, add it to reviewQuestionIds

9. Return the updated progress

15.8 DynamoDB Writes

UserAnswersTable

{

  "userId": "cognito-sub-xxxx",

  "answerId": "ans-20260801-001",

  "questionId": "clf-001",

  "exam": "CLF-C02",

  "category": "Cloud Concepts",

  "selectedChoiceId": "B",

  "correctChoiceId": "B",

  "isCorrect": true,

  "answeredAt": "2026-08-01T09:15:00+09:00",

  "elapsedSeconds": 23

}

UserProgressTable

{

  "userId": "cognito-sub-xxxx",

  "exam": "CLF-C02",

  "totalAnswered": 31,

  "correctCount": 25,

  "incorrectCount": 6,

  "accuracy": 80.6,

  "weakCategories": ["Security and Compliance"],

  "reviewQuestionIds": ["clf-004", "clf-012"],

  "updatedAt": "2026-08-01T09:15:00+09:00"

}

15.9 IAM Permissions

{

  "Effect": "Allow",

  "Action": [

    "dynamodb:PutItem",

    "dynamodb:GetItem",

    "dynamodb:UpdateItem"

  ],

  "Resource": [

    "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/UserAnswersTable",

    "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/UserProgressTable"

  ]

}

15.10 Acceptance Criteria

|   |   |
|---|---|
|ID|Condition|
|AC-API-ANS-001|Only logged-in users can save answer history|
|AC-API-ANS-002|Answer history is saved to UserAnswersTable|
|AC-API-ANS-003|UserProgressTable is updated|
|AC-API-ANS-004|Incorrectly answered questions are added for review|
|AC-API-ANS-005|Returns 401 if unauthenticated|

  

16. API-102 Learning Progress Retrieval API

16.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-102|
|Name|Learning progress retrieval API|
|Method|GET|
|Path|/progress|
|Authentication|Required|
|Phase|Phase 4|
|Lambda|get-progress-function|
|DynamoDB|UserProgressTable|

16.2 Query Parameters

|   |   |   |   |   |
|---|---|---|---|---|
|Parameter|Type|Required|Description|Example|
|exam|string|Optional|Exam classification|CLF-C02|

16.3 Request Example

GET /progress?exam=CLF-C02

Authorization: Bearer <JWT_TOKEN>

16.4 Success Response

{

  "success": true,

  "data": {

    "userId": "cognito-sub-xxxx",

    "exam": "CLF-C02",

    "totalAnswered": 30,

    "correctCount": 24,

    "incorrectCount": 6,

    "accuracy": 80,

    "categoryStats": {

      "Cloud Concepts": {

        "answered": 10,

        "correct": 9,

        "accuracy": 90

      },

      "Security and Compliance": {

        "answered": 8,

        "correct": 5,

        "accuracy": 62.5

      }

    },

    "weakCategories": ["Security and Compliance"],

    "reviewQuestionIds": ["clf-004", "clf-012", "clf-018"],

    "lastAnsweredAt": "2026-08-01T10:00:00+09:00",

    "updatedAt": "2026-08-01T10:00:00+09:00"

  },

  "message": "OK",

  "requestId": "req-20260801-progress001"

}

16.5 No Data Response (Localized Japanese Message Specimen)

When no answer history exists yet.

{

  "success": true,

  "data": {

    "userId": "cognito-sub-xxxx",

    "exam": "CLF-C02",

    "totalAnswered": 0,

    "correctCount": 0,

    "incorrectCount": 0,

    "accuracy": 0,

    "categoryStats": {},

    "weakCategories": [],

    "reviewQuestionIds": []

  },

  "message": "学習履歴はまだありません。",

  "requestId": "req-20260801-progress-empty"

}

16.6 Acceptance Criteria

|   |   |
|---|---|
|ID|Condition|
|AC-API-PROG-001|The logged-in user's progress can be retrieved|
|AC-API-PROG-002|Other users' progress cannot be retrieved|
|AC-API-PROG-003|Returns a successful response even when there is no learning history|
|AC-API-PROG-004|Returns 401 if unauthenticated|

  

17. API-103 Review Question Retrieval API

17.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-103|
|Name|Review question retrieval API|
|Method|GET|
|Path|/review-questions|
|Authentication|Required|
|Phase|Phase 4|
|Lambda|get-review-questions-function|
|DynamoDB|UserProgressTable / ReviewItemsTable / QuestionsTable|

17.2 Purpose

Retrieve questions the user answered incorrectly and questions registered for review.

17.3 Request Example

GET /review-questions?exam=CLF-C02

Authorization: Bearer <JWT_TOKEN>

17.4 Success Response (Localized Japanese Learning Content Specimen)

{

  "success": true,

  "data": {

    "items": [

      {

        "questionId": "clf-004",

        "exam": "CLF-C02",

        "category": "Security and Compliance",

        "difficulty": "normal",

        "question": "IAMロールの説明として適切なものはどれですか？",

        "lastAnsweredAt": "2026-08-01T10:00:00+09:00",

        "reason": "incorrect"

      }

    ]

  },

  "message": "OK",

  "requestId": "req-20260801-review001"

}

17.5 Acceptance Criteria

|   |   |
|---|---|
|ID|Condition|
|AC-API-REV-001|Questions marked for review can be retrieved|
|AC-API-REV-002|Other users' review questions cannot be retrieved|
|AC-API-REV-003|Returns an empty array if there are no questions to review|

  

18. API-104 Logged-In User Information Retrieval API

18.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-104|
|Name|Logged-in user information retrieval API|
|Method|GET|
|Path|/me|
|Authentication|Required|
|Phase|Phase 4|
|Lambda|get-me-function|
|DynamoDB|UserProfileTable|

18.2 Success Response (Localized Japanese User Input Specimen)

{

  "success": true,

  "data": {

    "userId": "cognito-sub-xxxx",

    "displayName": "fumi",

    "email": "user@example.com",

    "targetExam": "SAA-C03",

    "learningGoal": "2026年8月にSAA合格",

    "notificationEnabled": true,

    "createdAt": "2026-08-01T09:00:00+09:00",

    "updatedAt": "2026-08-01T09:00:00+09:00"

  },

  "message": "OK",

  "requestId": "req-20260801-me001"

}

18.3 First Login Handling

If no data exists in UserProfileTable, create and return an initial profile based on the Cognito information.

  

19. API-105 User Settings Update API

19.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-105|
|Name|User settings update API|
|Method|PUT|
|Path|/me|
|Authentication|Required|
|Phase|Phase 4|
|Lambda|update-me-function|
|DynamoDB|UserProfileTable|

19.2 Request Body (Localized Japanese User Input Specimen)

{

  "displayName": "fumi",

  "targetExam": "SAA-C03",

  "learningGoal": "2026年8月にSAA合格",

  "notificationEnabled": true

}

19.3 Success Response (Localized Japanese User Input and Message Specimen)

{

  "success": true,

  "data": {

    "userId": "cognito-sub-xxxx",

    "displayName": "fumi",

    "targetExam": "SAA-C03",

    "learningGoal": "2026年8月にSAA合格",

    "notificationEnabled": true,

    "updatedAt": "2026-08-01T11:00:00+09:00"

  },

  "message": "ユーザー設定を更新しました。",

  "requestId": "req-20260801-me-update001"

}

19.4 Validation

|   |   |
|---|---|
|Field|Rule|
|displayName|Up to 100 characters|
|targetExam|CLF-C02 / SAA-C03 / none|
|learningGoal|Up to 500 characters|
|notificationEnabled|boolean|

  

20. API-106 Today's Question Retrieval API

20.1 Overview

|   |   |
|---|---|
|Item|Description|
|API ID|API-106|
|Name|Today's question retrieval API|
|Method|GET|
|Path|/daily-question|
|Authentication|Optional|
|Phase|Phase 4|
|Lambda|daily-question-function|
|DynamoDB|DailyQuestionTable / QuestionsTable|

20.2 Purpose

Display one question that changes daily.

It can be integrated with the homepage and email notifications.

20.3 Query Parameters

|   |   |   |   |
|---|---|---|---|
|Parameter|Type|Required|Description|
|date|string|Optional|Date to retrieve. Defaults to today if omitted|
|exam|string|Optional|Exam classification|

20.4 Success Response (Localized Japanese Learning Content Specimen)

{

  "success": true,

  "data": {

    "date": "2026-08-02",

    "question": {

      "questionId": "clf-015",

      "exam": "CLF-C02",

      "category": "Security and Compliance",

      "difficulty": "easy",

      "question": "責任共有モデルにおいて、ユーザー側の責任はどれですか？",

      "choices": [

        {

          "choiceId": "A",

          "text": "AWSリージョンの物理的な保護"

        },

        {

          "choiceId": "B",

          "text": "IAMユーザーや権限の管理"

        },

        {

          "choiceId": "C",

          "text": "データセンターの電源管理"

        },

        {

          "choiceId": "D",

          "text": "AWSグローバルネットワークの保守"

        }

      ]

    }

  },

  "message": "OK",

  "requestId": "req-20260802-daily001"

}

20.5 Notes

- Authentication is not required if used on the homepage
- Require authentication if optimizing question selection for individual users
- Not required for the MVP

  

21. Lambda Function Design

21.1 Lambda Function List

|   |   |   |   |
|---|---|---|---|
|Lambda name|Associated API|Phase|Requirement|
|contact-submit-function|POST /contact|MVP / Phase 2|Required|
|get-terms-function|GET /terms, GET /terms/{termId}|Phase 2|Optional|
|get-questions-function|GET /questions, GET /questions/{questionId}|Phase 2|Optional|
|get-architectures-function|GET /architectures|Phase 2 onward|Optional|
|submit-answer-function|POST /answers|Phase 4|Future|
|get-progress-function|GET /progress|Phase 4|Future|
|get-review-questions-function|GET /review-questions|Phase 4|Future|
|get-me-function|GET /me|Phase 4|Future|
|update-me-function|PUT /me|Phase 4|Future|
|daily-question-function|GET /daily-question|Phase 4|Future|

21.2 Common Lambda Implementation Policies

|   |   |
|---|---|
|Item|Policy|
|Implementation language|Python 3.11 or later|
|Response format|Use the common response format|
|Validation|Always perform validation in Lambda|
|Logging|Output requestId, processing results, and error types|
|Timeout|Start at approximately 3–10 seconds|
|Memory|Start at 128MB–256MB|
|Environment variables|Table names, allowed Origin, etc.|
|Error handling|Do not silently suppress exceptions; return them in the common error format|

21.3 Example Common Response Generation Functions

def success_response(data=None, message="OK", status_code=200, request_id=None):

    return {

        "statusCode": status_code,

        "headers": {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": get_allowed_origin(),

            "Access-Control-Allow-Headers": "Content-Type,Authorization",

            "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS"

        },

        "body": json.dumps({

            "success": True,

            "data": data or {},

            "message": message,

            "requestId": request_id

        }, ensure_ascii=False)

    }

def error_response(code, message, status_code=400, details=None, request_id=None):

    return {

        "statusCode": status_code,

        "headers": {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": get_allowed_origin(),

            "Access-Control-Allow-Headers": "Content-Type,Authorization",

            "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS"

        },

        "body": json.dumps({

            "success": False,

            "error": {

                "code": code,

                "message": message,

                "details": details or []

            },

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

22. DynamoDB Access Design

22.1 Table List

|   |   |   |
|---|---|---|
|Table|Associated API|Phase|
|ContactsTable|POST /contact|MVP / Phase 2|
|TermsTable|GET /terms|Phase 2 onward|
|QuestionsTable|GET /questions, GET /daily-question|Phase 2 onward|
|UserProfileTable|GET /me, PUT /me|Phase 4|
|UserAnswersTable|POST /answers|Phase 4|
|UserProgressTable|GET /progress, POST /answers|Phase 4|
|ReviewItemsTable|GET /review-questions|Phase 4 onward|
|DailyQuestionTable|GET /daily-question|Phase 4|

22.2 DynamoDB Operation List

|   |   |   |   |
|---|---|---|---|
|API|Operation|Table|Permission|
|POST /contact|PutItem|ContactsTable|dynamodb:PutItem|
|GET /terms|Scan / Query|TermsTable|dynamodb:Scan / Query|
|GET /terms/{termId}|GetItem|TermsTable|dynamodb:GetItem|
|GET /questions|Query / Scan|QuestionsTable|dynamodb:Query / Scan|
|GET /questions/{questionId}|GetItem|QuestionsTable|dynamodb:GetItem|
|POST /answers|PutItem / UpdateItem|UserAnswersTable, UserProgressTable|dynamodb:PutItem / UpdateItem|
|GET /progress|GetItem|UserProgressTable|dynamodb:GetItem|
|GET /review-questions|GetItem / BatchGetItem|UserProgressTable, QuestionsTable|dynamodb:GetItem / BatchGetItem|

22.3 Scan Usage Policy

Scan is acceptable for the MVP or small datasets.

However, design GSIs and migrate to Query if the data volume increases.

Cases where Scan is acceptable:

- Term data containing a few dozen entries
- Question data containing a few hundred entries
- Infrequent administrative processing

Cases where Query is recommended:

- Learning history by user
- Question retrieval by category
- Question retrieval by exam classification
- Review question retrieval

  

23. Authentication and Authorization Design

23.1 MVP

No authentication in the MVP.

Applicable API:

- POST /contact

23.2 Phase 4

Use Amazon Cognito in Phase 4.

APIs requiring authentication:

- POST /answers
- GET /progress
- GET /review-questions
- GET /me
- PUT /me

23.3 Authorization Policy

Logged-in users may access and modify only their own data.

|   |   |
|---|---|
|Data|Authorization condition|
|UserProfileTable|userId = JWT sub|
|UserAnswersTable|userId = JWT sub|
|UserProgressTable|userId = JWT sub|
|ReviewItemsTable|userId = JWT sub|

23.4 Prohibited Practices

- Do not trust userId in the request Body
- Always obtain userId from the JWT
- Prevent data retrieval by specifying another user's userId

  

24. API Security Design

24.1 Input Validation

|   |   |
|---|---|
|API|Validation checks|
|POST /contact|Required fields, character limits, email format, honeypot|
|POST /answers|questionId, exam, choiceId, type checks|
|PUT /me|Display name, target exam, learning goal, boolean|

24.2 Rate Limiting

The inquiry API is likely to attract spam, so consider rate limiting in API Gateway.

Initial policy:

|   |   |
|---|---|
|API|Policy|
|POST /contact|Consider a relatively low rate limit|
|GET /terms|Relaxed limits|
|GET /questions|Relaxed limits|
|POST /answers|Moderate limits because this API requires authentication|

24.3 Information That Must Not Be Logged

- Full email addresses
- Full inquiry message bodies
- JWT
- Authorization headers
- AWS access keys
- External API keys

24.4 Error Message Policy

Do not return detailed internal structure information.

Bad example:

{

  "message": "DynamoDB table ContactsTable does not exist"

}

Good example (localized Japanese message specimen):

{

  "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

}

  

25. Frontend Integration Design

25.1 API Client Structure

frontend/

├── lib/

│   ├── api/

│   │   ├── client.ts

│   │   ├── contact.ts

│   │   ├── questions.ts

│   │   ├── terms.ts

│   │   └── progress.ts

25.2 Common API Client Processing

- baseURL management
- JSON conversion
- Error handling
- Authentication token attachment
- Timeout handling

25.3 Environment Variables

NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

25.4 Frontend Inquiry Submission Flow

1. Enter form data

2. Validate on the frontend

3. Set the submitting state

4. Call POST /contact

5. Display a completion message on success

6. Display an error message on failure

7. Clear the submitting state

  

8. API Test Design

26.1 Test Targets

POST /contact is the required test target for the MVP.

26.2 Success-Case Tests

|   |   |   |
|---|---|---|
|ID|Test description|Expected result|
|T-API-001|Submit a valid inquiry|201, saved to DynamoDB|
|T-API-002|Submit without sourcePage|201, saved successfully|
|T-API-003|Submit a Japanese message body|201, no character corruption|

26.3 Error-Case Tests

|   |   |   |
|---|---|---|
|ID|Test description|Expected result|
|T-API-004|name not entered|400|
|T-API-005|email not entered|400|
|T-API-006|Invalid email format|400|
|T-API-007|subject not entered|400|
|T-API-008|message not entered|400|
|T-API-009|message exceeds 2,000 characters|400|
|T-API-010|Invalid JSON format|400|
|T-API-011|honeypot contains a value|Treated as 201, not saved to DynamoDB|

26.4 Security Tests

|   |   |   |
|---|---|---|
|ID|Test description|Expected result|
|T-SEC-001|Message body containing a script tag|Not executed even if saved|
|T-SEC-002|Submit from outside the allowed Origin|Blocked by CORS|
|T-SEC-003|Large number of consecutive requests|Rate limited or monitored|
|T-SEC-004|Invalid value in the Authorization header|Ignored in the MVP; 401 in Phase 4|

  

27. API Implementation Priorities

27.1 MVP Implementation Scope

|   |   |   |
|---|---|---|
|Priority|API|Reason|
|1|POST /contact|Required dynamic feature with high portfolio value|

27.2 Consider in Phase 2

|   |   |   |
|---|---|---|
|Priority|API|Reason|
|2|GET /questions|Useful for demonstrating DynamoDB integration|
|3|GET /questions/{questionId}|Required when managing question data through APIs|
|4|GET /terms|Useful for exposing term search through an API|
|5|GET /terms/{termId}|Required when managing term details in a database|

27.3 Implement in Phase 4

|   |   |   |
|---|---|---|
|Priority|API|Reason|
|6|POST /answers|Core functionality for saving learning history|
|7|GET /progress|Required for the My Page display|
|8|GET /review-questions|Required for the review feature|
|9|GET /me|Required to display logged-in user information|
|10|PUT /me|Required to change user settings|
|11|GET /daily-question|Useful for encouraging continued use|

  

28. Practical API Policy for the MVP

28.1 API to Implement First

Implement only the following for the MVP.

POST /contact

Reasons:

- Inquiries require dynamic storage
- Demonstrates implementation experience with Lambda + API Gateway + DynamoDB
- Easy to explain as a portfolio project
- Low cost
- Static management is sufficient for other content

28.2 APIs Not to Implement

The following APIs do not need to be implemented for the MVP.

GET /terms

GET /terms/{termId}

GET /questions

GET /questions/{questionId}

GET /architectures

Reasons:

- Static JSON / MDX management is sufficient
- Static delivery benefits SEO and display speed
- More APIs increase development, testing, and operational workload
- Launching first is important

28.3 Portfolio Explanation

Explain the MVP as follows.

The glossary, practice questions, and articles are managed as static data to prioritize SEO and low-cost operation.

The inquiry form, on the other hand, is implemented with API Gateway + Lambda + DynamoDB because user input needs to be saved.

This creates a low-cost AWS architecture that combines static delivery with a serverless API.

  

29. Acceptance Criteria

29.1 API Design Document Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-API-DOC-001|Required MVP APIs are defined|
|AC-API-DOC-002|Future extension APIs are separated from the MVP|
|AC-API-DOC-003|Request formats are defined|
|AC-API-DOC-004|Response formats are defined|
|AC-API-DOC-005|Error response formats are defined|
|AC-API-DOC-006|The CORS policy is defined|
|AC-API-DOC-007|The DynamoDB access policy is defined|
|AC-API-DOC-008|Lambda processing flows are defined|
|AC-API-DOC-009|APIs requiring authentication are separated from those that do not|

29.2 MVP API Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-API-MVP-001|POST /contact is exposed through API Gateway|
|AC-API-MVP-002|contact-submit-function is implemented|
|AC-API-MVP-003|Inquiries are saved to ContactsTable|
|AC-API-MVP-004|Input validation works|
|AC-API-MVP-005|CORS is configured appropriately|
|AC-API-MVP-006|Processing results can be checked in CloudWatch Logs|
|AC-API-MVP-007|The Lambda execution role follows least privilege|

  

30. Related Design Documents to Create Next

Create the following after this API design document.

1. Security design document
2. Cost management design document
3. Infrastructure setup guide
4. Lambda implementation design document
5. Frontend implementation design document
6. Development task list
7. GitHub README draft

  

8. Conclusion

This product's API design requires only the inquiry submission API for the MVP.

The glossary, practice questions, comparison articles, architecture diagrams, and blog posts initially use static JSON / MDX management. This allows an SEO-friendly learning site to launch early while keeping development costs, AWS usage costs, and operational workload low.

The inquiry form, on the other hand, is implemented with API Gateway + Lambda + DynamoDB because user input needs to be saved. This demonstrates implementation experience with an AWS serverless architecture as part of the portfolio.

From Phase 4 onward, introduce Cognito authentication and add APIs for saving answer history, retrieving learning progress, retrieving review questions, and updating user settings. This extends the product from a learning content site into an application that manages learning for individual users.

The first API to implement is the following.

POST /contact

The most important goal for the MVP is to implement this API reliably and be able to explain DynamoDB storage, CloudWatch Logs, CORS, and least-privilege IAM permissions.