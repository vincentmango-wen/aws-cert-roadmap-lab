AWS Certification Study Site Lambda Implementation Design

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Study Site Lambda Implementation Design|
|Target product|AWS Certification Roadmap Lab|
|Target phases|MVP development through Phase 4 learning application|
|Purpose|Define implementation guidelines for backend processing using API Gateway + Lambda + DynamoDB|
|Primary API|POST /contact|
|Implementation language|Python|
|Runtime platform|AWS Lambda|
|Integrated services|Amazon API Gateway / Amazon DynamoDB / Amazon CloudWatch Logs / IAM|

  

2. Purpose of This Design

This document defines implementation guidelines for AWS Lambda, which handles backend processing for the AWS certification study site, AWS Certification Roadmap Lab.

The MVP minimizes dynamic processing and requires only the following Lambda function.

contact-submit-function

This Lambda receives data submitted through the contact form, validates the input, and saves it to ContactsTableProd in DynamoDB.

  

The following Lambda functions are not implemented in the MVP.

get-terms-function

get-questions-function

submit-answer-function

get-progress-function

daily-question-function

These will be implemented in Phase 2 or later, or in Phase 4.

  

3. Basic Lambda Implementation Guidelines

3.1 Basic Guidelines

|   |   |
|---|---|
|Guideline|Description|
|Only the contact Lambda in the MVP|Initially implement only POST /contact|
|Implement in Python|Use Python considering learning experience and future AI feature extensions|
|API Gateway HTTP API integration|Assume Lambda Proxy Integration|
|DynamoDB storage|Save contact data to ContactsTableProd|
|Mandatory input validation|Validate on Lambda as well as the frontend|
|Do not log personal information|Do not output full email or message values to CloudWatch Logs|
|Least-privilege IAM|Allow only PutItem on ContactsTableProd|
|CORS support|Allow only the production frontend Origin|
|Minimize cost|Keep memory, timeout, and log volume small|
|Structure for future expansion|Separate common responses, validation, and DynamoDB operations|

  

4. Lambda Function List

4.1 MVP Lambda Functions

|   |   |   |   |
|---|---|---|---|
|Lambda name|API|Overview|Required|
|contact-submit-function|POST /contact|Save contact form submissions to DynamoDB|Required|

4.2 Future Lambda Extensions

|   |   |   |   |
|---|---|---|---|
|Lambda name|API|Overview|Phase|
|get-terms-function|GET /terms, GET /terms/{termId}|Retrieve AWS terminology data|Phase 2 or later|
|get-questions-function|GET /questions, GET /questions/{questionId}|Retrieve practice questions|Phase 2 or later|
|submit-answer-function|POST /answers|Save user answer history|Phase 4|
|get-progress-function|GET /progress|Retrieve learning progress|Phase 4|
|get-review-questions-function|GET /review-questions|Retrieve review questions|Phase 4|
|get-me-function|GET /me|Retrieve signed-in user information|Phase 4|
|update-me-function|PUT /me|Update user settings|Phase 4|
|daily-question-function|GET /daily-question / EventBridge|Retrieve and notify users of the daily question|Phase 4|

  

5. MVP Lambda Architecture

5.1 Target Architecture

Frontend Contact Form

  ↓ POST /contact

API Gateway HTTP API

  ↓ Lambda Proxy Integration

contact-submit-function

  ↓ PutItem

DynamoDB ContactsTableProd

  ↓ Logs

CloudWatch Logs

5.2 Processing Overview

1. The user fills in the contact form

2. The frontend validates the input

3. Send to POST /contact on API Gateway

4. API Gateway invokes Lambda

5. Lambda parses the JSON

6. Check the honeypot

7. Validate the input on Lambda

8. If valid, generate contactId and createdAt

9. Save to DynamoDB ContactsTableProd

10. Write minimal logs to CloudWatch Logs

11. Return the response through API Gateway

12. Display a completion message on the frontend

  

13. Lambda Runtime Design

6.1 Runtime Settings

|   |   |
|---|---|
|Item|Value|
|Runtime|Python 3.11 or later|
|Architecture|arm64 or x86_64|
|Memory|128MB〜256MB|
|Timeout|3-5 seconds|
|Ephemeral storage|The default is sufficient|
|VPC|Do not connect|
|Provisioned Concurrency|Do not use|
|Lambda Layers|Do not use in the MVP|

6.2 arm64 / x86_64 Guidelines

|   |   |
|---|---|
|Option|Guideline|
|arm64|A candidate when prioritizing cost efficiency|
|x86_64|Also acceptable when prioritizing compatibility|

Either is acceptable for the MVP. Since no external native libraries are used, arm64 is unlikely to cause problems.

6.3 Why No VPC Connection Is Needed

The MVP Lambda only accesses DynamoDB, not RDS or resources inside a VPC.

Therefore, a VPC connection is unnecessary.

Benefits of not connecting to a VPC:

- No NAT Gateway required
- Simple architecture
- Less likely to get stuck on cold starts or network configuration
- Reduced billing risk

  

7. Directory Structure

7.1 Recommended Structure

backend/

├── functions/

│   └── contact_submit/

│       ├── app.py

│       ├── validators.py

│       ├── schemas.py

│       ├── dynamodb_client.py

│       ├── response.py

│       ├── requirements.txt

│       └── tests/

│           ├── test_validator.py

│           └── test_app.py

│

├── shared/

│   ├── logger.py

│   ├── constants.py

│   └── exceptions.py

│

└── README.md

7.2 Acceptable Simplified MVP Structure

The following is also acceptable initially.

backend/

└── functions/

    └── contact_submit/

        ├── app.py

        └── requirements.txt

However, separate the implementation into the following files before it grows larger.

|   |   |
|---|---|
|File|Role|
|app.py|Main Lambda handler|
|validators.py|Input validation|
|response.py|Common response generation|
|dynamodb_client.py|DynamoDB storage operations|
|schemas.py|Types, constants, and data structures|

  

8. contact-submit-function Design

8.1 Basic Information

|   |   |
|---|---|
|Item|Description|
|Lambda name|contact-submit-prod|
|Logical name|contact-submit-function|
|API|POST /contact|
|Runtime|Python 3.11 or later|
|Handler|app.lambda_handler|
|DynamoDB|ContactsTableProd|
|CloudWatch Logs|/aws/lambda/contact-submit-prod|

8.2 Input Data

Receive events from API Gateway HTTP API in Lambda Proxy format. Japanese strings in request, response, and code examples throughout this document are preserved localized payload specimens, not developer prose.

Expected request Body (Japanese localized specimen)

{

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "honeypot": ""

}

8.3 Stored Data

Save the following to DynamoDB (Japanese localized specimen).

{

  "contactId": "contact-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",

  "createdAt": "2026-06-01T10:30:00+09:00",

  "name": "山田太郎",

  "email": "taro@example.com",

  "subject": "S3の記事について",

  "message": "S3とEBSの違いについて質問があります。",

  "sourcePage": "/contact",

  "status": "new",

  "userAgent": "Mozilla/5.0 ..."

}

8.4 Responses

Success (Japanese localized response specimen)

HTTP 201

{

  "success": true,

  "data": {

    "contactId": "contact-xxxxxxxx",

    "status": "new"

  },

  "message": "お問い合わせを受け付けました。",

  "requestId": "req-xxxxxxxx"

}

Validation error (Japanese localized response specimen)

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

      }

    ]

  },

  "requestId": "req-xxxxxxxx"

}

Server error (Japanese localized response specimen)

HTTP 500

{

  "success": false,

  "error": {

    "code": "INTERNAL_SERVER_ERROR",

    "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

  },

  "requestId": "req-xxxxxxxx"

}

  

9. API Gateway Event Design

9.1 Expected HTTP API Event

API Gateway HTTP API Lambda Proxy Integration passes an event roughly like the following (Japanese localized payload specimen).

{

  "version": "2.0",

  "routeKey": "POST /contact",

  "rawPath": "/contact",

  "headers": {

    "content-type": "application/json",

    "origin": "https://xxxxxxxx.cloudfront.net",

    "user-agent": "Mozilla/5.0 ..."

  },

  "requestContext": {

    "http": {

      "method": "POST",

      "path": "/contact"

    },

    "requestId": "xxxxxxxx"

  },

  "body": "{\"name\":\"山田太郎\",\"email\":\"taro@example.com\",\"subject\":\"質問\",\"message\":\"本文\",\"honeypot\":\"\"}",

  "isBase64Encoded": false

}

9.2 Values to Retrieve

|   |   |   |
|---|---|---|
|Value|Source|Purpose|
|method|requestContext.http.method|Identify OPTIONS and POST|
|body|event.body|Contact input|
|origin|headers.origin|CORS evaluation|
|user-agent|headers.user-agent|Optional storage|
|requestId|requestContext.requestId|Log tracing|

9.3 OPTIONS Support

Support CORS preflight requests.

If API Gateway handles CORS, Lambda does not need to handle OPTIONS explicitly.

However, Lambda may also include OPTIONS handling to simplify verification.

Return 200 when method == OPTIONS

  

10. Environment Variable Design

10.1 Required Environment Variables

|   |   |   |
|---|---|---|
|Key|Example|Description|
|CONTACTS_TABLE_NAME|ContactsTableProd|Destination DynamoDB table name|
|ALLOWED_ORIGINS|https://xxxxx.cloudfront.net,https://example.com|List of allowed Origins|
|LOG_LEVEL|INFO|Log level|
|ENV|prod|Environment name|

10.2 Optional Environment Variables

|   |   |   |
|---|---|---|
|Key|Example|Description|
|MAX_MESSAGE_LENGTH|2000|Maximum message length|
|MAX_NAME_LENGTH|100|Maximum name length|
|MAX_SUBJECT_LENGTH|150|Maximum subject length|
|ENABLE_HONEYPOT|true|Enable the honeypot|

10.3 Values That Must Not Be Set

Do not put the following directly in Lambda environment variables.

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

GitHub Token

External API secret keys

JWT private keys

If external API keys become necessary, consider Secrets Manager or SSM Parameter Store.

  

11. CORS Implementation Design

11.1 Basic Guidelines

|   |   |
|---|---|
|Item|Guideline|
|Production Origin|Allow only the CloudFront URL or custom domain|
|Development Origin|Allow localhost only in the development environment|
|Allow Methods|POST, OPTIONS|
|Allow Headers|Content-Type, Authorization|
|Credentials|Do not use in the MVP|

11.2 ALLOWED_ORIGINS Format

https://xxxxxxxx.cloudfront.net,https://example.com,http://localhost:3000

Remove localhost in production.

11.3 Origin Evaluation Logic

1. Retrieve event.headers.origin

2. Split ALLOWED_ORIGINS by commas into an array

3. If origin is in the allowlist, set that origin in Access-Control-Allow-Origin

4. Otherwise, return the production Origin or return 403

11.4 MVP Guidelines

Initially control CORS through API Gateway settings.

On Lambda, add Access-Control-Allow-Origin to the response headers.

  

12. Validation Design

12.1 Validation Guidelines

Validate input in the following two stages.

Frontend: preliminary checks to improve the user experience

Lambda: mandatory checks for security and data protection

Do not trust frontend checks.

12.2 Rules by Field

|   |   |   |
|---|---|---|
|Field|Required|Rule|
|name|Required|1-100 characters|
|email|Required|Email format, at most 255 characters|
|subject|Required|1-150 characters|
|message|Required|1-2,000 characters|
|sourcePage|Optional|At most 255 characters|
|honeypot|Optional|Must be an empty string|

12.3 Email Format Check

Avoid excessively strict email regular expressions.

The following level of checks is sufficient for the MVP.

Contains @

Has characters before and after @

Contains . in the domain part

At most 255 characters

12.4 Prohibited or Restricted Input

|   |   |
|---|---|
|Input|Handling|
|Empty string|Error for required fields|
|Length limit exceeded|Error|
|script tags|May be stored, but must always be escaped when displayed|
|HTML tags|May be stored, but must not be interpreted as HTML|
|Nonempty honeypot|Treat as a bot; do not save|

12.5 Error Detail Format (Japanese Localized Specimen)

{

  "field": "message",

  "message": "本文は2,000文字以内で入力してください。"

}

12.6 Validation Function Example (Japanese Localized Response Specimens)

import re

  

  

def is_valid_email(email: str) -> bool:

    if not email or len(email) > 255:

        return False

    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    return re.match(pattern, email) is not None

  

  

def validate_contact_input(data: dict) -> list[dict]:

    errors = []

  

    name = str(data.get("name", "")).strip()

    email = str(data.get("email", "")).strip()

    subject = str(data.get("subject", "")).strip()

    message = str(data.get("message", "")).strip()

    source_page = str(data.get("sourcePage", "")).strip()

  

    if not name:

        errors.append({"field": "name", "message": "名前を入力してください。"})

    elif len(name) > 100:

        errors.append({"field": "name", "message": "名前は100文字以内で入力してください。"})

  

    if not is_valid_email(email):

        errors.append({"field": "email", "message": "正しいメールアドレスを入力してください。"})

  

    if not subject:

        errors.append({"field": "subject", "message": "件名を入力してください。"})

    elif len(subject) > 150:

        errors.append({"field": "subject", "message": "件名は150文字以内で入力してください。"})

  

    if not message:

        errors.append({"field": "message", "message": "本文を入力してください。"})

    elif len(message) > 2000:

        errors.append({"field": "message", "message": "本文は2,000文字以内で入力してください。"})

  

    if len(source_page) > 255:

        errors.append({"field": "sourcePage", "message": "送信元ページの値が長すぎます。"})

  

    return errors

  

13. Honeypot Design

13.1 Purpose

Prevent automated bot submissions at low cost.

Do not use reCAPTCHA in the MVP.

Reasons:

- More implementation work
- More external service dependencies
- Excessive for the initial stage

13.2 Frontend

Provide an input field invisible to users.

<input

  type="text"

  name="honeypot"

  tabIndex="-1"

  autoComplete="off"

  style={{ display: 'none' }}

/>

13.3 Lambda

If the honeypot contains a value:

- Do not save to DynamoDB

- Log only a brief message such as spam detected

- Treat the response as successful

13.4 Why Return Success

To make it harder for bots to recognize that they were blocked.

  

14. DynamoDB Storage Design

14.1 Destination Table

|   |   |
|---|---|
|Item|Description|
|Table name|ContactsTableProd|
|Partition key|contactId|
|Sort key|None|
|Billing mode|On-demand recommended|

14.2 PutItem Attributes

|   |   |   |   |
|---|---|---|---|
|Attribute|Type|Required|Description|
|contactId|String|Required|contact- + UUID|
|createdAt|String|Required|ISO 8601 format|
|name|String|Required|Name|
|email|String|Required|Email address|
|subject|String|Required|Subject|
|message|String|Required|Message body|
|sourcePage|String|Optional|Source page|
|status|String|Required|new|
|userAgent|String|Optional|User-Agent|
|requestId|String|Optional|API Gateway requestId|

14.3 Generating contactId

import uuid

  

contact_id = f"contact-{uuid.uuid4()}"

14.4 Generating createdAt

Store in JST.

from datetime import datetime, timezone, timedelta

  

JST = timezone(timedelta(hours=9))

created_at = datetime.now(JST).isoformat()

14.5 DynamoDB Storage Function Example

import boto3

  

  

dynamodb = boto3.resource("dynamodb")

  

  

def save_contact(table_name: str, item: dict) -> None:

    table = dynamodb.Table(table_name)

    table.put_item(Item=item)

14.6 Notes

- Be aware of the cases where DynamoDB can and cannot store empty strings
- Omit optional fields containing empty strings, or verify the behavior for allowing empty strings
- Do not log email or message
- Do not create a contact-list retrieval API in the MVP

  

15. Response Design

15.1 Common Response Guidelines

Standardize all responses to the following format.

Success

{

  "success": true,

  "data": {},

  "message": "OK",

  "requestId": "req-xxxxxxxx"

}

Error (Japanese localized response specimen)

{

  "success": false,

  "error": {

    "code": "ERROR_CODE",

    "message": "エラーメッセージ",

    "details": []

  },

  "requestId": "req-xxxxxxxx"

}

15.2 Response Headers

|   |   |
|---|---|
|Header|Value|
|Content-Type|application/json|
|Access-Control-Allow-Origin|Allowed Origin|
|Access-Control-Allow-Headers|Content-Type,Authorization|
|Access-Control-Allow-Methods|POST,OPTIONS|

15.3 response.py Example

import json

import os

  

  

def get_allowed_origin(event: dict) -> str:

    headers = event.get("headers") or {}

    origin = headers.get("origin") or headers.get("Origin")

    allowed_origins = [

        item.strip()

        for item in os.environ.get("ALLOWED_ORIGINS", "").split(",")

        if item.strip()

    ]

  

    if origin and origin in allowed_origins:

        return origin

  

    if allowed_origins:

        return allowed_origins[0]

  

    return "*"

  

  

def build_headers(event: dict) -> dict:

    return {

        "Content-Type": "application/json",

        "Access-Control-Allow-Origin": get_allowed_origin(event),

        "Access-Control-Allow-Headers": "Content-Type,Authorization",

        "Access-Control-Allow-Methods": "POST,OPTIONS"

    }

  

  

def success_response(event: dict, data=None, message="OK", status_code=200, request_id=None):

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

        "body": json.dumps({

            "success": True,

            "data": data or {},

            "message": message,

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

  

def error_response(event: dict, code: str, message: str, status_code=400, details=None, request_id=None):

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

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

  

16. Error Handling Design

16.1 Error List

|   |   |   |
|---|---|---|
|Error code|HTTP|Trigger|
|INVALID_JSON|400|body cannot be parsed as JSON|
|VALIDATION_ERROR|400|Invalid input|
|METHOD_NOT_ALLOWED|405|Method other than POST / OPTIONS|
|DYNAMODB_ERROR|500|Failed to save to DynamoDB|
|INTERNAL_SERVER_ERROR|500|Unexpected error|

16.2 INVALID_JSON

{

  "success": false,

  "error": {

    "code": "INVALID_JSON",

    "message": "JSON形式が不正です。",

    "details": []

  },

  "requestId": "req-xxxxxxxx"

}

16.3 VALIDATION_ERROR

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

16.4 DYNAMODB_ERROR

Do not return details to the user.

{

  "success": false,

  "error": {

    "code": "INTERNAL_SERVER_ERROR",

    "message": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。",

    "details": []

  },

  "requestId": "req-xxxxxxxx"

}

Write only something like the following to CloudWatch Logs.

ERROR dynamodb put_item failed requestId=req-xxxx errorType=ClientError

Do not output the full message body or email.

  

17. Logging Design

17.1 Logging Guidelines

|   |   |
|---|---|
|Item|Guideline|
|requestId|Log|
|contactId|May be logged|
|status|May be logged|
|validation error fields|May be logged|
|Full email|Do not log|
|Full message|Do not log|
|JWT|Do not log|
|Authorization header|Do not log|
|AWS credentials|Do not log|

17.2 Success Log Example

INFO request started requestId=req-xxxx method=POST path=/contact

INFO contact saved requestId=req-xxxx contactId=contact-xxxx

17.3 Validation Error Log Example

WARN validation error requestId=req-xxxx fields=email,message

17.4 Spam Detection Log Example

WARN honeypot detected requestId=req-xxxx

17.5 Error Log Example

ERROR dynamodb put_item failed requestId=req-xxxx errorType=ClientError

ERROR unexpected error requestId=req-xxxx errorType=ValueError

17.6 Log Retention

|   |   |
|---|---|
|Log Group|Retention period|
|/aws/lambda/contact-submit-prod|14-30 days|

  

18. IAM Permission Design

18.1 Lambda Execution Role

|   |   |
|---|---|
|Item|Description|
|Role name|lambda-contact-submit-role-prod|
|Trust policy|Allow AssumeRole from the Lambda service|
|DynamoDB permissions|Only PutItem on ContactsTableProd|
|CloudWatch permissions|Log output only|

18.2 DynamoDB Permissions

{

  "Effect": "Allow",

  "Action": [

    "dynamodb:PutItem"

  ],

  "Resource": "arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTableProd"

}

18.3 CloudWatch Logs Permissions

{

  "Effect": "Allow",

  "Action": [

    "logs:CreateLogGroup",

    "logs:CreateLogStream",

    "logs:PutLogEvents"

  ],

  "Resource": "arn:aws:logs:ap-northeast-1:<account-id>:*"

}

18.4 Permissions Not Granted

|   |   |
|---|---|
|Permission|Reason|
|dynamodb:Scan|Unnecessary for saving contacts|
|dynamodb:GetItem|Unnecessary for saving contacts in the MVP|
|dynamodb:DeleteItem|Unnecessary|
|dynamodb:*|Excessive permissions|
|s3:*|Unnecessary|
|iam:*|Dangerous|
|AdministratorAccess|Absolutely unnecessary|

  

19. app.py Implementation Design

19.1 Processing Flow

lambda_handler(event, context)

  ↓

Retrieve or generate requestId

  ↓

Check HTTP method

  ↓

Return 200 for OPTIONS

  ↓

Return 405 for methods other than POST

  ↓

Parse body JSON

  ↓

Check honeypot

  ↓

Validate input

  ↓

Generate contactId

  ↓

Generate createdAt

  ↓

Build DynamoDB item

  ↓

Execute PutItem

  ↓

Return success response

19.2 Proposed Implementation Code (Japanese Localized Response Specimens)

import json

import os

import uuid

import re

from datetime import datetime, timezone, timedelta

from typing import Any

  

import boto3

from botocore.exceptions import ClientError

  

  

dynamodb = boto3.resource("dynamodb")

JST = timezone(timedelta(hours=9))

  

  

ERROR_MESSAGES = {

    "INVALID_JSON": "JSON形式が不正です。",

    "VALIDATION_ERROR": "入力内容に誤りがあります。",

    "METHOD_NOT_ALLOWED": "許可されていないHTTPメソッドです。",

    "INTERNAL_SERVER_ERROR": "サーバー内部でエラーが発生しました。時間をおいて再度お試しください。"

}

  

  

def get_request_id(event: dict, context: Any) -> str:

    request_context = event.get("requestContext") or {}

    request_id = request_context.get("requestId")

    if request_id:

        return f"req-{request_id}"

    if context and getattr(context, "aws_request_id", None):

        return f"req-{context.aws_request_id}"

    return f"req-{uuid.uuid4()}"

  

  

def get_method(event: dict) -> str:

    request_context = event.get("requestContext") or {}

    http = request_context.get("http") or {}

    return http.get("method", "").upper()

  

  

def get_header(event: dict, key: str) -> str | None:

    headers = event.get("headers") or {}

    key_lower = key.lower()

    for header_key, value in headers.items():

        if header_key.lower() == key_lower:

            return value

    return None

  

  

def get_allowed_origin(event: dict) -> str:

    origin = get_header(event, "origin")

    allowed_origins = [

        item.strip()

        for item in os.environ.get("ALLOWED_ORIGINS", "").split(",")

        if item.strip()

    ]

  

    if origin and origin in allowed_origins:

        return origin

  

    if allowed_origins:

        return allowed_origins[0]

  

    return "*"

  

  

def build_headers(event: dict) -> dict:

    return {

        "Content-Type": "application/json",

        "Access-Control-Allow-Origin": get_allowed_origin(event),

        "Access-Control-Allow-Headers": "Content-Type,Authorization",

        "Access-Control-Allow-Methods": "POST,OPTIONS"

    }

  

  

def success_response(event: dict, data: dict | None = None, message: str = "OK", status_code: int = 200, request_id: str | None = None) -> dict:

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

        "body": json.dumps({

            "success": True,

            "data": data or {},

            "message": message,

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

  

def error_response(event: dict, code: str, status_code: int = 400, details: list[dict] | None = None, request_id: str | None = None) -> dict:

    return {

        "statusCode": status_code,

        "headers": build_headers(event),

        "body": json.dumps({

            "success": False,

            "error": {

                "code": code,

                "message": ERROR_MESSAGES.get(code, "エラーが発生しました。"),

                "details": details or []

            },

            "requestId": request_id

        }, ensure_ascii=False)

    }

  

  

def parse_body(event: dict) -> dict:

    body = event.get("body")

    if not body:

        return {}

    return json.loads(body)

  

  

def is_valid_email(email: str) -> bool:

    if not email or len(email) > 255:

        return False

    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    return re.match(pattern, email) is not None

  

  

def validate_contact_input(data: dict) -> list[dict]:

    errors: list[dict] = []

  

    name = str(data.get("name", "")).strip()

    email = str(data.get("email", "")).strip()

    subject = str(data.get("subject", "")).strip()

    message = str(data.get("message", "")).strip()

    source_page = str(data.get("sourcePage", "")).strip()

  

    if not name:

        errors.append({"field": "name", "message": "名前を入力してください。"})

    elif len(name) > 100:

        errors.append({"field": "name", "message": "名前は100文字以内で入力してください。"})

  

    if not is_valid_email(email):

        errors.append({"field": "email", "message": "正しいメールアドレスを入力してください。"})

  

    if not subject:

        errors.append({"field": "subject", "message": "件名を入力してください。"})

    elif len(subject) > 150:

        errors.append({"field": "subject", "message": "件名は150文字以内で入力してください。"})

  

    if not message:

        errors.append({"field": "message", "message": "本文を入力してください。"})

    elif len(message) > 2000:

        errors.append({"field": "message", "message": "本文は2,000文字以内で入力してください。"})

  

    if len(source_page) > 255:

        errors.append({"field": "sourcePage", "message": "送信元ページの値が長すぎます。"})

  

    return errors

  

  

def sanitize_contact_input(data: dict) -> dict:

    return {

        "name": str(data.get("name", "")).strip(),

        "email": str(data.get("email", "")).strip(),

        "subject": str(data.get("subject", "")).strip(),

        "message": str(data.get("message", "")).strip(),

        "sourcePage": str(data.get("sourcePage", "")).strip()

    }

  

  

def build_contact_item(data: dict, event: dict, request_id: str) -> dict:

    contact_id = f"contact-{uuid.uuid4()}"

    created_at = datetime.now(JST).isoformat()

    user_agent = get_header(event, "user-agent") or ""

  

    item = {

        "contactId": contact_id,

        "createdAt": created_at,

        "name": data["name"],

        "email": data["email"],

        "subject": data["subject"],

        "message": data["message"],

        "status": "new",

        "requestId": request_id

    }

  

    if data.get("sourcePage"):

        item["sourcePage"] = data["sourcePage"]

  

    if user_agent:

        item["userAgent"] = user_agent[:500]

  

    return item

  

  

def save_contact(item: dict) -> None:

    table_name = os.environ["CONTACTS_TABLE_NAME"]

    table = dynamodb.Table(table_name)

    table.put_item(Item=item)

  

  

def lambda_handler(event, context):

    request_id = get_request_id(event, context)

    method = get_method(event)

  

    print(f"INFO request started requestId={request_id} method={method}")

  

    if method == "OPTIONS":

        return success_response(event, data={}, message="OK", status_code=200, request_id=request_id)

  

    if method != "POST":

        print(f"WARN method not allowed requestId={request_id} method={method}")

        return error_response(event, "METHOD_NOT_ALLOWED", status_code=405, request_id=request_id)

  

    try:

        body = parse_body(event)

    except json.JSONDecodeError:

        print(f"WARN invalid json requestId={request_id}")

        return error_response(event, "INVALID_JSON", status_code=400, request_id=request_id)

  

    honeypot = str(body.get("honeypot", "")).strip()

    if honeypot:

        print(f"WARN honeypot detected requestId={request_id}")

        return success_response(

            event,

            data={"contactId": None, "status": "accepted"},

            message="お問い合わせを受け付けました。",

            status_code=201,

            request_id=request_id

        )

  

    errors = validate_contact_input(body)

    if errors:

        fields = ",".join([error["field"] for error in errors])

        print(f"WARN validation error requestId={request_id} fields={fields}")

        return error_response(

            event,

            "VALIDATION_ERROR",

            status_code=400,

            details=errors,

            request_id=request_id

        )

  

    data = sanitize_contact_input(body)

    item = build_contact_item(data, event, request_id)

  

    try:

        save_contact(item)

    except ClientError as error:

        print(f"ERROR dynamodb put_item failed requestId={request_id} errorType={error.__class__.__name__}")

        return error_response(event, "INTERNAL_SERVER_ERROR", status_code=500, request_id=request_id)

    except Exception as error:

        print(f"ERROR unexpected error requestId={request_id} errorType={error.__class__.__name__}")

        return error_response(event, "INTERNAL_SERVER_ERROR", status_code=500, request_id=request_id)

  

    print(f"INFO contact saved requestId={request_id} contactId={item['contactId']}")

  

    return success_response(

        event,

        data={"contactId": item["contactId"], "status": "new"},

        message="お問い合わせを受け付けました。",

        status_code=201,

        request_id=request_id

    )

19.3 Implementation Notes

The code above is the baseline implementation for the MVP.

Check the following before production deployment.

|   |   |
|---|---|
|Item|Check|
|ALLOWED_ORIGINS contains only production domains|Required|
|CONTACTS_TABLE_NAME is correct|Required|
|email and message are not logged|Required|
|Only DynamoDB PutItem permission is granted|Required|
|Lambda timeout is short|Recommended|
|CloudWatch Logs retention is configured|Required|

  

20. requirements.txt Design

20.1 MVP

Since the Lambda runtime often includes boto3, minimize external dependencies in the MVP.

# requirements.txt

It may be empty.

20.2 Optional Candidates

|   |   |   |
|---|---|---|
|Library|Purpose|MVP necessity|
|pydantic|Input schema validation|Unnecessary; the standard library is sufficient initially|
|aws-lambda-powertools|Logging, tracing, and utilities|Consider in Phase 2 or later|
|pytest|Testing|Recommended for local development|
|moto|Mock AWS testing|Consider in Phase 2 or later|

20.3 Guidelines

Do not add too many dependencies in the MVP.

Reasons:

- Larger deployment packages
- More vulnerability management
- More complex setup for beginners
- The standard library is sufficient for implementation

  

21. Local Test Design

21.1 Testing Guidelines

Test the following in the MVP.

|   |   |
|---|---|
|Test type|Description|
|Validation test|Does input validation work correctly?|
|JSON parsing test|Does invalid JSON return 400?|
|Honeypot test|Is saving skipped when the honeypot is populated?|
|Response test|Are success and error formats consistent?|
|DynamoDB storage test|Does PutItem work with real AWS or mocks?|

21.2 Minimal Test Event (Japanese Localized Payload Specimen)

events/contact_valid.json

{

  "version": "2.0",

  "routeKey": "POST /contact",

  "rawPath": "/contact",

  "headers": {

    "content-type": "application/json",

    "origin": "http://localhost:3000",

    "user-agent": "test-agent"

  },

  "requestContext": {

    "requestId": "test-request-id",

    "http": {

      "method": "POST",

      "path": "/contact"

    }

  },

  "body": "{\"name\":\"テスト太郎\",\"email\":\"test@example.com\",\"subject\":\"テスト\",\"message\":\"これはテストです。\",\"sourcePage\":\"/contact\",\"honeypot\":\"\"}",

  "isBase64Encoded": false

}

21.3 Error-Case Test Events (Japanese Localized Payload Specimens)

Invalid email

{

  "version": "2.0",

  "requestContext": {

    "requestId": "test-request-id",

    "http": {

      "method": "POST",

      "path": "/contact"

    }

  },

  "headers": {

    "origin": "http://localhost:3000"

  },

  "body": "{\"name\":\"テスト太郎\",\"email\":\"invalid-email\",\"subject\":\"テスト\",\"message\":\"本文\",\"honeypot\":\"\"}"

}

Populated honeypot

{

  "version": "2.0",

  "requestContext": {

    "requestId": "test-request-id",

    "http": {

      "method": "POST",

      "path": "/contact"

    }

  },

  "headers": {

    "origin": "http://localhost:3000"

  },

  "body": "{\"name\":\"bot\",\"email\":\"bot@example.com\",\"subject\":\"spam\",\"message\":\"spam\",\"honeypot\":\"filled\"}"

}

21.4 pytest Examples (Japanese Localized Test Specimens)

from validators import validate_contact_input

  

  

def test_valid_contact_input():

    data = {

        "name": "テスト太郎",

        "email": "test@example.com",

        "subject": "テスト",

        "message": "これはテストです。"

    }

    errors = validate_contact_input(data)

    assert errors == []

  

  

def test_invalid_email():

    data = {

        "name": "テスト太郎",

        "email": "invalid-email",

        "subject": "テスト",

        "message": "これはテストです。"

    }

    errors = validate_contact_input(data)

    assert any(error["field"] == "email" for error in errors)

  

  

def test_empty_message():

    data = {

        "name": "テスト太郎",

        "email": "test@example.com",

        "subject": "テスト",

        "message": ""

    }

    errors = validate_contact_input(data)

    assert any(error["field"] == "message" for error in errors)

  

22. AWS Console Testing Procedure

22.1 Lambda Unit Test

1. Open the Lambda console

2. Open contact-submit-prod

3. Open the Test tab

4. Create a New event

5. Paste a test event in API Gateway HTTP API format

6. Run Test

7. Check the response

8. Check CloudWatch Logs

9. Verify that the data was saved to DynamoDB

22.2 Testing Through API Gateway

Verify with curl (Japanese localized test payload specimen).

curl -X POST "https://xxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/contact" \

  -H "Content-Type: application/json" \

  -H "Origin: https://xxxxxxxx.cloudfront.net" \

  -d '{

    "name": "テスト太郎",

    "email": "test@example.com",

    "subject": "テスト問い合わせ",

    "message": "これはAPI Gateway経由のテストです。",

    "sourcePage": "/contact",

    "honeypot": ""

  }'

22.3 Expected Results

|   |   |
|---|---|
|Check target|Expected result|
|HTTP status|201|
|success|true|
|contactId|Returned|
|DynamoDB|The item is saved|
|CloudWatch Logs|A contact saved log is output|
|Personal information in logs|No full email or message is output|

  

23. Deployment Design

23.1 Initial Deployment Guidelines

For the MVP, initially pasting code directly into the AWS console is acceptable.

However, ultimately manage it in GitHub.

23.2 Recommended Deployment Stages

|   |   |
|---|---|
|Stage|Method|
|Initial verification|Create directly in the AWS console|
|After organizing the MVP|zip upload|
|Phase 2 or later|AWS SAM|
|Full-scale operation|GitHub Actions + SAM|

23.3 zip Deployment Procedure

cd backend/functions/contact_submit

zip -r contact_submit.zip .

aws lambda update-function-code \

  --function-name contact-submit-prod \

  --zip-file fileb://contact_submit.zip

23.4 Proposed SAM Configuration

infra/sam-template.yaml

AWSTemplateFormatVersion: '2010-09-09'

Transform: AWS::Serverless-2016-10-31

Description: AWS Cert Roadmap Lab Backend

  

Globals:

  Function:

    Runtime: python3.11

    Timeout: 5

    MemorySize: 128

    Architectures:

      - arm64

    Environment:

      Variables:

        ENV: prod

        LOG_LEVEL: INFO

  

Resources:

  ContactsTable:

    Type: AWS::DynamoDB::Table

    Properties:

      TableName: ContactsTableProd

      BillingMode: PAY_PER_REQUEST

      AttributeDefinitions:

        - AttributeName: contactId

          AttributeType: S

      KeySchema:

        - AttributeName: contactId

          KeyType: HASH

  

  ContactSubmitFunction:

    Type: AWS::Serverless::Function

    Properties:

      FunctionName: contact-submit-prod

      CodeUri: ../backend/functions/contact_submit/

      Handler: app.lambda_handler

      Environment:

        Variables:

          CONTACTS_TABLE_NAME: !Ref ContactsTable

          ALLOWED_ORIGINS: "https://example.com,http://localhost:3000"

      Policies:

        - DynamoDBWritePolicy:

            TableName: !Ref ContactsTable

      Events:

        ContactApi:

          Type: HttpApi

          Properties:

            Path: /contact

            Method: POST

23.5 SAM Commands

sam build

sam deploy --guided

23.6 Notes

Focusing too heavily on SAM from the start may delay certification study and the MVP release.

It is acceptable to first get it working in the AWS console, understand the mechanism, and then convert it to IaC.

  

24. Lambda Configuration Checklist

24.1 Basic Settings

|   |   |
|---|---|
|Check|Status|
|Runtime is Python 3.11 or later|Not done / Done|
|Handler is app.lambda_handler|Not done / Done|
|Memory is 128MB-256MB|Not done / Done|
|Timeout is 3-5 seconds|Not done / Done|
|Not connected to a VPC|Not done / Done|
|Provisioned Concurrency is not used|Not done / Done|

24.2 Environment Variables

|   |   |
|---|---|
|Check|Status|
|CONTACTS_TABLE_NAME is configured|Not done / Done|
|ALLOWED_ORIGINS is configured|Not done / Done|
|LOG_LEVEL is configured|Not done / Done|
|No secrets are stored in environment variables|Not done / Done|

24.3 IAM

|   |   |
|---|---|
|Check|Status|
|Only PutItem on ContactsTableProd is allowed|Not done / Done|
|CloudWatch Logs output permission is present|Not done / Done|
|AdministratorAccess is not granted|Not done / Done|
|No unnecessary DynamoDB permissions|Not done / Done|

24.4 Logs

|   |   |
|---|---|
|Check|Status|
|CloudWatch Logs retention is configured|Not done / Done|
|Full email is not logged|Not done / Done|
|Full message is not logged|Not done / Done|
|requestId is logged|Not done / Done|

  

25. Frontend Integration Design

25.1 API Client

frontend/

└── lib/

    └── api/

        └── contact.ts

25.2 contact.ts Example

export type ContactInput = {

  name: string;

  email: string;

  subject: string;

  message: string;

  sourcePage?: string;

  honeypot?: string;

};

  

export type ContactResponse = {

  success: boolean;

  data?: {

    contactId: string | null;

    status: string;

  };

  message?: string;

  error?: {

    code: string;

    message: string;

    details?: Array<{

      field: string;

      message: string;

    }>;

  };

  requestId?: string;

};

  

export async function submitContact(input: ContactInput): Promise<ContactResponse> {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  

  if (!baseUrl) {

    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');

  }

  

  const response = await fetch(`${baseUrl}/contact`, {

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

    },

    body: JSON.stringify(input),

  });

  

  const data = await response.json();

  

  if (!response.ok) {

    return data;

  }

  

  return data;

}

25.3 Frontend Notes

|   |   |
|---|---|
|Item|Guideline|
|NEXT_PUBLIC_API_BASE_URL|Set the API Gateway URL|
|Frontend validation|Always validate, but also revalidate on Lambda|
|Submitting state|Disable the button to prevent duplicate submissions|
|Error display|Display Lambda details beside form fields|
|honeypot|Send as a hidden input|

  

26. Operational Monitoring Design

26.1 Monitoring Targets

|   |   |
|---|---|
|Target|What to check|
|Lambda Invocations|Whether invocations are increasing sharply|
|Lambda Errors|Whether errors are occurring|
|Lambda Duration|Whether execution time is increasing|
|API Gateway 4XX|Increases in validation errors or unauthorized access|
|API Gateway 5XX|Lambda or DynamoDB failures|
|DynamoDB Item count|Increased spam submissions|
|CloudWatch Logs|Whether personal information is being output|

26.2 CloudWatch Logs Checkpoints

INFO contact saved

WARN validation error

WARN honeypot detected

ERROR dynamodb put_item failed

ERROR unexpected error

26.3 When to Introduce Alarms

Prioritize AWS Budgets in the MVP.

Consider the following CloudWatch Alarms in Phase 2 or later.

|   |   |
|---|---|
|Alarm|Condition|
|Lambda Errors|At least one in 5 minutes|
|API Gateway 5XX|At least one in 5 minutes|
|Spike in Lambda Invocations|Several times the normal volume|
|DynamoDB ThrottledRequests|At least one|

  

27. Cost Design

27.1 Cost Minimization Guidelines

|   |   |
|---|---|
|Item|Guideline|
|Lambda memory|Start with 128MB-256MB|
|Timeout|3-5 seconds|
|Provisioned Concurrency|Do not use|
|External libraries|Minimize|
|Logs|Minimum necessary|
|DynamoDB|Only PutItem, only contact storage|

27.2 Billing Risks

|   |   |
|---|---|
|Risk|Countermeasure|
|Large volumes of bot POSTs|Honeypot, API Gateway limits, WAF/reCAPTCHA if necessary|
|Endless error output|Limit log volume and configure retention|
|Long Lambda executions|Short timeout|
|Increased DynamoDB writes|Rate limiting and spam protection|

  

28. Security Design

28.1 Required Measures

|   |   |
|---|---|
|Measure|Description|
|Least-privilege IAM|DynamoDB PutItem only|
|Input validation|Always perform on Lambda|
|CORS restrictions|Production Origin only|
|Log restrictions|Do not output personal information|
|honeypot|Bot protection|
|Character limits|Protection against long spam messages|
|Secret management|Do not put secrets in Lambda environment variables|

28.2 XSS Protection

Contact message bodies are saved to DynamoDB, but are not displayed in an admin interface in the MVP.

If an admin interface is built later, always escape message bodies rather than displaying them as HTML.

28.3 CORS Limitations

CORS is a browser restriction and does not completely prevent direct access from curl or bots.

The following are therefore also necessary.

- Lambda-side validation
- honeypot
- Character limits
- Consider rate limiting
- Budgets monitoring

  

29. Future Lambda Extension Design

  

29.1 get-questions-function

Overview

A Lambda that retrieves practice questions from DynamoDB.

Not needed in the MVP.

Supported APIs

GET /questions

GET /questions/{questionId}

Guidelines

|   |   |
|---|---|
|Item|Guideline|
|List API|Do not return correct-answer information|
|Detail API|May return the correct answer and explanation for free questions|
|After monetization|Change the design to return the correct answer only after submission|
|DynamoDB|QuestionsTable|

  

29.2 submit-answer-function

Overview

A Lambda that saves answer history for signed-in users.

Implement in Phase 4.

Supported API

POST /answers

Authentication

Cognito JWT required.

Important Rule

Do not accept userId from the request Body.

Use the JWT sub.

Storage Destination

|   |   |
|---|---|
|Table|Purpose|
|UserAnswersTable|Save answer history|
|UserProgressTable|Update accuracy and weak categories|

  

29.3 get-progress-function

Overview

A Lambda that retrieves a user's learning progress.

Supported API

GET /progress

Authentication

Cognito JWT required.

Guidelines

- Query UserProgressTable using the JWT sub
- Other users' data cannot be retrieved
- Return zero values if there is no learning history

  

29.4 daily-question-function

Overview

A Lambda that retrieves and notifies users of one question each day.

Invocation Sources

|   |   |
|---|---|
|Invocation source|Purpose|
|API Gateway|Display the daily question on the home page|
|EventBridge|Daily question notification|

Notes

- Watch email sending volume when using SES
- Provide an unsubscribe feature
- Starting with web display only is acceptable

  

30. Implementation Order

30.1 MVP Implementation Order

1. Create ContactsTableProd

2. Create lambda-contact-submit-role-prod

3. Create contact-submit-prod

4. Configure environment variables

5. Implement app.py

6. Run Lambda unit tests

7. Create an API Gateway HTTP API

8. Connect POST /contact to Lambda

9. Configure CORS

10. Test the API with curl

11. Verify DynamoDB storage

12. Check CloudWatch Logs

13. Connect the frontend contact form

14. Verify submission from the production site on CloudFront

15. Configure CloudWatch Logs retention

30.2 Features Not Implemented

Do not implement the following in the MVP.

Admin interface

Contact-list retrieval API

Email notifications

Login

Answer history storage

AI automatic replies

reCAPTCHA

WAF

Reasons:

- They delay the MVP release
- They increase costs
- They are excessive for an initial portfolio

  

31. Test Case List

31.1 Success Cases

|   |   |   |
|---|---|---|
|ID|Test|Expected result|
|LT-001|Submit a valid contact|201, saved to DynamoDB|
|LT-002|Submit without sourcePage|201, saved to DynamoDB|
|LT-003|Submit a Japanese message body|201, no garbled characters|
|LT-004|Submit within maximum character limits|201|

31.2 Error Cases

|   |   |   |
|---|---|---|
|ID|Test|Expected result|
|LT-101|Missing body|400|
|LT-102|Invalid JSON|400 INVALID_JSON|
|LT-103|Empty name|400 VALIDATION_ERROR|
|LT-104|Empty email|400 VALIDATION_ERROR|
|LT-105|Invalid email format|400 VALIDATION_ERROR|
|LT-106|Empty subject|400 VALIDATION_ERROR|
|LT-107|Empty message|400 VALIDATION_ERROR|
|LT-108|message exceeds 2,000 characters|400 VALIDATION_ERROR|
|LT-109|Method other than POST|405 METHOD_NOT_ALLOWED|

31.3 Spam Protection

|   |   |   |
|---|---|---|
|ID|Test|Expected result|
|LT-201|Populated honeypot|Treated as 201, not saved to DynamoDB|
|LT-202|script tags in the message body|May be saved, but the full body is not logged|
|LT-203|Disallowed Origin|Restricted by CORS|

31.4 IAM Tests

|   |   |   |
|---|---|---|
|ID|Test|Expected result|
|LT-301|PutItem on ContactsTableProd|Success|
|LT-302|Scan ContactsTableProd|Should preferably fail|
|LT-303|PutItem on another table|Failure|

  

32. Acceptance Criteria

32.1 Lambda Implementation Design Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-LAMBDA-DOC-001|MVP Lambda scope is clear|
|AC-LAMBDA-DOC-002|POST /contact processing flow is defined|
|AC-LAMBDA-DOC-003|Input validation is defined|
|AC-LAMBDA-DOC-004|DynamoDB storage attributes are defined|
|AC-LAMBDA-DOC-005|Common response format is defined|
|AC-LAMBDA-DOC-006|Error handling is defined|
|AC-LAMBDA-DOC-007|Logging guidelines are defined|
|AC-LAMBDA-DOC-008|Least-privilege IAM is defined|
|AC-LAMBDA-DOC-009|CORS guidelines are defined|
|AC-LAMBDA-DOC-010|Future Lambda extensions are separated|

32.2 MVP Implementation Completion Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-LAMBDA-MVP-001|contact-submit-prod has been created|
|AC-LAMBDA-MVP-002|Lambda can be invoked through POST /contact|
|AC-LAMBDA-MVP-003|Valid contacts are saved to DynamoDB|
|AC-LAMBDA-MVP-004|Invalid input returns 400|
|AC-LAMBDA-MVP-005|No DynamoDB save occurs when the honeypot is populated|
|AC-LAMBDA-MVP-006|No personal information is output to CloudWatch Logs|
|AC-LAMBDA-MVP-007|The Lambda Role allows only PutItem on ContactsTableProd|
|AC-LAMBDA-MVP-008|Submission works from the contact form on CloudFront|
|AC-LAMBDA-MVP-009|CloudWatch Logs retention is set to 14-30 days|
|AC-LAMBDA-MVP-010|Lambda timeout is set to 3-5 seconds|

  

33. README Description

Include the following description in the GitHub README.

## Backend / Lambda

  

The MVP backend uses AWS Lambda for the contact form API.

  

- API Gateway exposes `POST /contact`

- Lambda validates the request body

- Honeypot field is used for simple spam protection

- Valid contact data is stored in DynamoDB

- CloudWatch Logs are used for operation logs

- IAM role grants only `dynamodb:PutItem` to the contact table

  

The Lambda function does not log personal information such as email addresses or message bodies.

English translation of the original Japanese version follows.

## Backend / Lambda

  

The MVP uses AWS Lambda as the API for the contact form.

  

- Expose `POST /contact` through API Gateway

- Validate input on Lambda

- Use a honeypot field for basic spam protection

- Save valid contact data to DynamoDB

- Check execution logs in CloudWatch Logs

- Restrict the IAM Role to `dynamodb:PutItem` on ContactsTable

  

The design does not output personal information, such as email addresses or full contact message bodies, to CloudWatch Logs.

  

34. Interview Talking Points

34.1 Why Use Lambda?

Contact processing does not require an always-running server, so I adopted a serverless architecture using API Gateway + Lambda.

It is inexpensive at low traffic volumes and does not require server management as EC2 does.

34.2 Why Not Use a VPC?

The MVP only saves data to DynamoDB and does not need to access RDS or resources inside a VPC.

Putting Lambda in a VPC could require a NAT Gateway and increase cost and architectural complexity, so Lambda runs outside a VPC.

34.3 How Is Security Ensured?

Input is validated on Lambda as well as on the frontend.

The IAM Role is restricted to PutItem on the target DynamoDB table, and email addresses and full message bodies are not output to CloudWatch Logs.

34.4 How Are Unexpected Charges Prevented?

I keep the Lambda timeout short and start with a small memory allocation.

The contact form uses a honeypot and character limits to reduce large volumes of bot submissions.

I also prevent unexpected charges with AWS Budgets and CloudWatch Logs retention settings.

  

35. Conclusion

The only Lambda implemented in the MVP is contact-submit-function for the contact form.

This Lambda is invoked through POST /contact on API Gateway and performs the following.

Parse JSON

Check honeypot

Validate input

Generate contactId

Generate createdAt

PutItem into DynamoDB ContactsTableProd

Write minimal logs to CloudWatch Logs

Return a common response

This implementation makes it possible to:

- Demonstrate AWS serverless implementation experience
- Understand the basic API Gateway + Lambda + DynamoDB architecture
- Provide a practical contact form feature
- Keep costs low without EC2 or RDS
- Explain least-privilege IAM, CORS, input validation, and logging controls

This is sufficient for the first backend implementation.

Add question retrieval APIs in Phase 2 or later, and answer history and learning progress APIs in Phase 4 or later.
