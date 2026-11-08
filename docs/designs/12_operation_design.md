AWS Certification Learning Site Operations and Monitoring Design

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Learning Site Operations and Monitoring Design|
|Target product|AWS Certification Roadmap Lab|
|Target phases|MVP development through Phase 4: Learning application|
|Purpose|Define monitoring, logging, alerting, and incident-response policies for operating the AWS-hosted learning site reliably at low cost|
|Target services|S3 / CloudFront / API Gateway / Lambda / DynamoDB / CloudWatch / AWS Budgets / Cost Explorer / IAM / GitHub Actions|
|Default region|ap-northeast-1 / Tokyo Region|

  

2. Purpose of This Design

This document defines the operations and monitoring policy for the AWS certification learning site, AWS Certification Roadmap Lab.

This product is an independently developed portfolio project. A large-scale monitoring platform will not be built during the MVP stage.

However, the following points must be covered.

1. The site can be displayed.
2. The contact form works correctly.
3. Errors are not increasing in Lambda or API Gateway.
4. Contact submissions are saved in DynamoDB.
5. Required logs are available in CloudWatch Logs.
6. CloudWatch Logs does not expose excessive personal information.
7. AWS charges are not increasing unexpectedly.
8. Unnecessary AWS resources are not left behind.
9. GitHub Actions deployments succeed.
10. Incident causes can be investigated and service can be restored.

For the MVP, avoid overengineering monitoring and focus operations on the following.

AWS Budgets

CloudWatch Logs

CloudWatch Metrics

GitHub Actions logs

AWS Billing / Cost Explorer

DynamoDB item checks

Manual checklists

Introduce CloudWatch Alarm, CloudWatch Dashboard, AWS WAF, CloudWatch Synthetics, X-Ray, and similar services incrementally after traffic increases or from Phase 2 onward.

  

3. Basic Operations and Monitoring Policy

3.1 Basic Policy

|   |   |
|---|---|
|Policy|Description|
|Prioritize low cost|Do not add too many monitoring services in the MVP|
|Focus on critical areas|Prioritize site display, the contact API, billing, and logs|
|Allow manual checks|Use daily and weekly manual checks for an independently developed MVP|
|Require Budgets|Configure AWS Budgets first to prevent unexpected billing incidents|
|Set CloudWatch Logs retention|Do not retain logs indefinitely|
|Exclude personal information from logs|Do not output full email addresses, full contact messages, JWTs, etc.|
|Introduce alarms gradually|Keep MVP alarms minimal and add CloudWatch Alarm from Phase 2 onward|
|Maintain incident-response procedures|Document what to check and how to recover|
|Make the portfolio explainable|Be able to explain the operations design in interviews|

  

4. Monitoring Scope

4.1 MVP Monitoring Targets

|   |   |   |
|---|---|---|
|Area|Target|Monitoring details|
|Web delivery|CloudFront|Site display, 4xx/5xx, request count, transfer volume|
|Static files|S3|File existence, storage capacity, object count|
|API|API Gateway|POST /contact invocation count, 4xx/5xx, Latency|
|Processing|Lambda|Invocations, Errors, Duration, Throttles, logs|
|Data storage|DynamoDB|Contact submission storage, write count, throttling|
|Logs|CloudWatch Logs|Lambda logs, retention period, log volume, presence of personal information|
|Cost|AWS Budgets / Cost Explorer|Monthly cost, forecast overruns, cost by service|
|Deployment|GitHub Actions|CI/CD success and failure, deployment history|
|Security|IAM / optional CloudTrail|Permission changes and suspicious activity checks|

4.2 Monitoring Targets from Phase 3 Onward

|   |   |   |
|---|---|---|
|Area|Target|Monitoring details|
|Custom domain|Route 53 / CloudFront / ACM|DNS, certificates, expiration, HTTPS|
|SEO|Search Console|Indexing, search traffic, errors|
|Traffic analytics|Google Analytics|Page views, acquisition, engagement time, popular articles|
|Advertising|AdSense|Revenue, policy violations, abnormal clicks|

4.3 Monitoring Targets from Phase 4 Onward

|   |   |   |
|---|---|---|
|Area|Target|Monitoring details|
|Authentication|Cognito|Sign-ups, login failures, MAU|
|Learning history|DynamoDB|Reads and writes for UserAnswers / UserProgress|
|Notifications|EventBridge / SES|Scheduled execution, email delivery success and failure|
|User features|API Gateway / Lambda|4xx/5xx and Latency for authenticated APIs|

  

5. MVP Operations Architecture

5.1 MVP Monitoring Architecture Diagram

flowchart TD

    User[User]

    CF[CloudFront]

    S3[(S3)]

    APIGW[API Gateway]

    Lambda[AWS Lambda]

    DDB[(DynamoDB)]

    CWLogs[CloudWatch Logs]

    CWMetrics[CloudWatch Metrics]

    Budget[AWS Budgets]

    Cost[Cost Explorer / Billing]

    GH[GitHub Actions]

    Dev[Developer]

  

    User --> CF

    CF --> S3

    User --> APIGW

    APIGW --> Lambda

    Lambda --> DDB

    Lambda --> CWLogs

    CF --> CWMetrics

    APIGW --> CWMetrics

    Lambda --> CWMetrics

    DDB --> CWMetrics

    Budget -->|Email notification| Dev

    Cost --> Dev

    GH -->|CI/CD results| Dev

    Dev --> CWLogs

    Dev --> CWMetrics

5.2 MVP Monitoring Approach

The MVP does not use full-scale 24/7 monitoring.

Instead, perform the following.

1. Detect billing anomalies with AWS Budgets.

2. Check Lambda errors in CloudWatch Logs.

3. Review API/Lambda execution and error counts in CloudWatch Metrics.

4. Check deployment failures in GitHub Actions.

5. Manually check site display and the contact form daily or weekly.

  

6. Monitoring Level Definitions

6.1 Severity Classification

|   |   |   |
|---|---|---|
|Severity|Description|Response policy|
|Critical|Entire site unavailable, sudden billing increase, credential exposure|Respond immediately|
|High|Contact API unavailable, repeated Lambda errors, DynamoDB save failures|Respond the same day|
|Medium|Broken display on some pages, increased 4xx errors, CI failure|Respond within 1–2 days|
|Low|Article typos, minor log warnings, SEO improvements|Handle as normal tasks|

6.2 Events Treated as Critical in the MVP

|   |   |
|---|---|
|Event|Reason|
|AWS Budgets overrun notification|Potential billing incident|
|Unexpected charges for EC2/RDS/NAT Gateway, etc.|Unnecessary services may have been created|
|Entire site returns 403/404 through CloudFront|Site cannot be served publicly|
|Suspected AWS access key exposure|High risk of unauthorized use|
|Large volume of spam submissions in DynamoDB|Increased cost and disruption to operations|

  

7. CloudFront Monitoring Design

7.1 Monitoring Purpose

CloudFront is the entry point for static site delivery.

Monitor the following.

- Whether the site is accessible
- Whether 4xx / 5xx errors are increasing
- Whether request counts are surging
- Whether data transfer volume is surging
- Whether caching is effective

7.2 Key Metrics

|   |   |   |
|---|---|---|
|Metric|Description|MVP check frequency|
|Requests|Request count|Weekly|
|BytesDownloaded|Data transferred to users|Weekly|
|4xxErrorRate|4xx error rate|Weekly / during incidents|
|5xxErrorRate|5xx error rate|Weekly / during incidents|
|TotalErrorRate|Overall error rate|Weekly / during incidents|

7.3 Examples of Abnormal Conditions

|   |   |
|---|---|
|Condition|Assessment|
|Sudden increase in 5xxErrorRate|CloudFront or origin issue|
|Sudden increase in 4xxErrorRate|Possible nonexistent URLs, S3 permissions, or bot traffic|
|Requests several times higher than normal|Possible viral traffic, bots, or attacks|
|Sudden increase in BytesDownloaded|Possible oversized images, bots, or viral traffic|

7.4 Check Procedure

1. Open the CloudFront console.

2. Select the target Distribution.

3. Check the Monitoring tab.

4. Check Requests, 4xx, 5xx, and BytesDownloaded.

5. If anything is abnormal, check S3, CloudFront settings, and recent deployments.

7.5 MVP Alarm Policy

CloudFront alarms are not mandatory for the MVP.

Consider the following when traffic increases.

|   |   |
|---|---|
|Alarm|Proposed condition|
|Increased CloudFront 5xx|5xxErrorRate > 1% persists for a certain period|
|Increased CloudFront 4xx|4xxErrorRate > 10% persists for a certain period|
|Request surge|Several times normal traffic|

  

8. S3 Monitoring Design

8.1 Monitoring Purpose

S3 stores static files.

Monitor the following.

- Whether required files exist
- Whether storage capacity is increasing excessively
- Whether object counts are increasing abnormally
- Whether files are exposed directly to the public

8.2 Key Metrics

|   |   |   |
|---|---|---|
|Metric|Description|Check frequency|
|BucketSizeBytes|Bucket size|Weekly / monthly|
|NumberOfObjects|Object count|Weekly / monthly|

8.3 Check Items

|   |   |
|---|---|
|Item|Expected state|
|Public Access Block|Enabled|
|Bucket Policy|Allow only the CloudFront Distribution|
|Large files|Do not store|
|Video files|Do not store|
|Unnecessary old build files|Do not retain|

8.4 Check Procedure

1. Open the S3 console.

2. Open the target bucket.

3. Check file counts and sizes under Objects.

4. Check Public Access Block under Permissions.

5. Confirm that the Bucket Policy permits only CloudFront OAC.

6. Confirm that direct S3 URLs are inaccessible.

8.5 Examples of Abnormal Conditions

|   |   |
|---|---|
|Condition|Assessment|
|Sudden increase in bucket size|Possible increase in large images or unnecessary files|
|Sudden increase in object count|Possible deployment misconfiguration|
|Content displays through a direct S3 URL|Security misconfiguration|
|Public Access Block disabled|Fix immediately|

  

9. API Gateway Monitoring Design

9.1 Monitoring Purpose

API Gateway is the entry point for the contact API.

Only POST /contact is monitored in the MVP.

9.2 Key Metrics

|   |   |   |
|---|---|---|
|Metric|Description|Check frequency|
|Count|API request count|Weekly / during incidents|
|4xx|Client error count|Weekly / during incidents|
|5xx|Server error count|Weekly / during incidents|
|Latency|API response time|Weekly / during incidents|
|IntegrationLatency|Response time of the Lambda integration|During incidents|

9.3 Examples of Abnormal Conditions

|   |   |
|---|---|
|Condition|Assessment|
|5xx errors occur|Possible Lambda or DynamoDB incident|
|Sudden increase in 4xx|Possible validation errors, unauthorized access, or bots|
|Sudden increase in Count|Possible spam submissions or bots|
|Sudden increase in Latency|Possible Lambda processing or DynamoDB delays|

9.4 Check Procedure

1. Open the API Gateway console.

2. Select the target HTTP API.

3. Check Monitor or CloudWatch Metrics.

4. Review Count / 4xx / 5xx / Latency.

5. If there are 5xx errors, check Lambda Logs.

6. If Count surges, suspect contact-form spam.

9.5 MVP Alarm Policy

Not mandatory for the MVP, but add the following from Phase 2 onward.

|   |   |
|---|---|
|Alarm|Proposed condition|
|API Gateway 5xx|At least 1 in 5 minutes|
|API Gateway Count surge|Several times normal|
|API Gateway Latency|Persistently at least 3 seconds|

  

10. Lambda Monitoring Design

10.1 Monitoring Purpose

Lambda is the core of contact submission storage processing.

Monitor the following.

- Whether Lambda is being invoked
- Whether errors occur
- Whether execution time is increasing
- Whether timeouts occur
- Whether throttling occurs
- Whether logs expose personal information

10.2 Key Metrics

|   |   |   |
|---|---|---|
|Metric|Description|Check frequency|
|Invocations|Execution count|Weekly / during incidents|
|Errors|Error count|Weekly / during incidents|
|Duration|Execution time|Weekly / during incidents|
|Throttles|Throttling count|During incidents|
|ConcurrentExecutions|Concurrent executions|After traffic increases|
|IteratorAge|Only when using streams|Outside MVP scope|

10.3 MVP Lambda Target

|   |   |
|---|---|
|Lambda|Purpose|
|contact-submit-prod|Save contact submissions|

10.4 Examples of Abnormal Conditions

|   |   |
|---|---|
|Condition|Assessment|
|At least 1 Error|Investigate the cause|
|Duration approaches 3 seconds|Timeout risk|
|Throttles occur|Concurrency limit or high traffic|
|Sudden increase in Invocations|Possible spam or bots|
|Timeout occurs|Check Lambda settings or DynamoDB processing|

10.5 Check Procedure

1. Open the Lambda console.

2. Select contact-submit-prod.

3. Open the Monitor tab.

4. Check Invocations / Errors / Duration / Throttles.

5. Open View logs in CloudWatch.

6. Check the error details.

7. Check whether data is saved in DynamoDB.

10.6 Proposed Alarms from Phase 2 Onward

|   |   |   |
|---|---|---|
|Alarm|Proposed condition|Severity|
|Lambda Errors|At least 1 in 5 minutes|High|
|Lambda Duration|Average persistently at least 2 seconds|Medium|
|Lambda Throttles|At least 1|High|
|Lambda Invocations surge|Several times normal|Medium|

  

11. CloudWatch Logs Design

11.1 Purpose

Use CloudWatch Logs to check Lambda execution and investigate error causes.

However, excessive logging increases cost and risks information exposure.

11.2 Log Groups

|   |   |   |
|---|---|---|
|Log group|Target|Retention period|
|/aws/lambda/contact-submit-prod|Contact Lambda|14–30 days|

11.3 Log Retention Period

Always configure a retention period in the MVP.

Recommendation:

14 days or 30 days

Never expire is prohibited.

11.4 Permitted Log Information

|   |   |
|---|---|
|Information|Example|
|requestId|req-xxxx|
|contactId|contact-xxxx|
|status|saved / validation_error|
|errorType|ClientError / ValueError|
|validation field|email / message|
|method|POST|

11.5 Prohibited Log Information

|   |   |
|---|---|
|Information|Reason|
|Full email address|Personal information|
|Full contact message|May contain personal or confidential information|
|JWT|Authentication information|
|Authorization header|Authentication information|
|AWS_SECRET_ACCESS_KEY|Authentication information|
|API key|Authentication information|
|Full Cookie|May contain authentication information|

11.6 Log Examples

Success

INFO request started requestId=req-xxxx method=POST

INFO contact saved requestId=req-xxxx contactId=contact-xxxx

Validation error

WARN validation error requestId=req-xxxx fields=email,message

Honeypot detection

WARN honeypot detected requestId=req-xxxx

DynamoDB error

ERROR dynamodb put_item failed requestId=req-xxxx errorType=ClientError

11.7 Logs Insights Usage Policy

Use only when needed in the MVP.

Example: Search error logs

fields @timestamp, @message

| filter @message like /ERROR/

| sort @timestamp desc

| limit 20

Example: Search validation errors

fields @timestamp, @message

| filter @message like /validation error/

| sort @timestamp desc

| limit 20

11.8 Cost Considerations

- Do not output large volumes of logs.
- Set a retention period.
- Do not repeatedly run Logs Insights unnecessarily.
- Do not routinely enable DEBUG logging in production.

  

12. DynamoDB Monitoring Design

12.1 Monitoring Purpose

DynamoDB stores contact submission data.

Monitor the following.

- Whether contact submissions are saved
- Whether write errors occur
- Whether throttling occurs
- Whether spam causes a sudden increase in records
- Whether storage capacity is increasing excessively

12.2 Target Table

|   |   |
|---|---|
|Table|Purpose|
|ContactsTableProd|Store contact submission data|

12.3 Key Metrics

|   |   |   |
|---|---|---|
|Metric|Description|Check frequency|
|ConsumedWriteCapacityUnits|Write usage|Weekly / during incidents|
|ConsumedReadCapacityUnits|Read usage|Weekly / during incidents|
|ThrottledRequests|Throttling|During incidents|
|UserErrors|User-caused errors|During incidents|
|SystemErrors|AWS-side errors|During incidents|
|TableSizeBytes|Table size|Monthly|
|ItemCount|Item count|Weekly / monthly|

12.4 Examples of Abnormal Conditions

|   |   |
|---|---|
|Condition|Assessment|
|ThrottledRequests occur|Write surge or settings need review|
|Sudden increase in ItemCount|Possible spam submissions|
|Increase in UserErrors|Problem with Lambda save processing or data format|
|Sudden increase in TableSizeBytes|Increase in long spam messages or unnecessary data|

12.5 Check Procedure

1. Open the DynamoDB console.

2. Select ContactsTableProd.

3. Check the Monitor tab.

4. Check ThrottledRequests, ConsumedWrite, and UserErrors.

5. Check record counts and contents in Explore table items.

6. Consider deleting obvious spam.

12.6 Proposed Alarms from Phase 2 Onward

|   |   |
|---|---|
|Alarm|Proposed condition|
|DynamoDB ThrottledRequests|At least 1|
|DynamoDB UserErrors|At least 1|
|ItemCount surge|Several times normal|

  

13. AWS Budgets Monitoring Design

13.1 Purpose

AWS Budgets is the most important monitoring item in this project.

Purpose:

- Prevent billing incidents.
- Detect unnecessary service creation.
- Detect cost increases caused by bot traffic or spam.
- Detect abnormal usage when AWS access keys are exposed.

13.2 Budget Settings

|   |   |
|---|---|
|Item|Setting|
|Budget type|Cost budget|
|Period|Monthly|
|Scope|All AWS services|
|Initial amount|A low amount such as 1 USD|
|Notification|Email|

13.3 Notification Thresholds

|   |   |   |
|---|---|---|
|Threshold|Type|Response|
|50%|Actual|Check costs by service|
|80%|Actual|Check for unnecessary resources|
|100%|Actual|Check immediately; stop/delete if necessary|
|100%|Forecasted|Check the forecast month-end overrun|

13.4 Response to Budgets Notifications

1. Open Billing Dashboard.

2. Check costs by service in Cost Explorer.

3. Check for unexpected services.

4. Check for unnecessary resources by region.

5. Check CloudWatch Logs, API Gateway, Lambda, and DynamoDB.

6. Delete unnecessary resources.

7. Record the cause in the operations notes.

13.5 Examples of Unexpected Services

Investigate charges for the following services in the MVP.

|   |   |
|---|---|
|Service|Assessment|
|EC2|Generally unexpected|
|RDS|Generally unexpected|
|NAT Gateway|Check immediately; consider deletion|
|ALB|Generally unexpected|
|OpenSearch|Generally unexpected|
|SageMaker|Generally unexpected|
|WAF|Generally not used in the MVP|

  

14. Cost Explorer / Billing Review Design

14.1 Purpose

In addition to AWS Budgets notifications, regularly review costs by service.

14.2 Review Frequency

|   |   |
|---|---|
|Phase|Frequency|
|Early development|Daily|
|After MVP release|Once a week|
|After introducing a custom domain and AdSense|Once a week|
|After traffic increases|At least once a week|

14.3 Review Items

|   |   |
|---|---|
|Item|Description|
|Current month total|Whether it is within budget|
|Cost by service|Whether there are unexpected services|
|Cost by region|Whether resources were accidentally created in another region|
|Daily cost|Whether there are days with sharp increases|
|Forecast|Whether the month-end forecast is within budget|

14.4 Cost Explorer Review Procedure

1. Open AWS Billing and Cost Management.

2. Open Cost Explorer.

3. Set Date range to This month.

4. Set Group by to Service.

5. Check for unexpected service costs.

6. Set Group by to Region as needed.

7. If any day shows a surge, check the metrics for the relevant service.

  

8. GitHub Actions Monitoring Design

15.1 Monitoring Purpose

GitHub Actions is the CI/CD execution platform.

Monitor the following.

- Whether CI succeeds
- Whether deployments from main succeed
- Whether S3 sync succeeds
- Whether CloudFront Invalidation succeeds
- Whether Secrets or environment variables are misconfigured

15.2 Monitored Workflows

|   |   |
|---|---|
|Workflow|Purpose|
|CI|lint / typecheck / build|
|Deploy Frontend|S3 + CloudFront deployment|
|Deploy Lambda|From Phase 2 onward|
|Deploy SAM|From Phase 2 onward|

15.3 Check Items

|   |   |
|---|---|
|Item|What to check|
|Workflow status|success / failure|
|Install dependencies|Dependency errors|
|Lint|ESLint errors|
|Type check|TypeScript errors|
|Build|Next.js build errors|
|Configure AWS credentials|OIDC / Secrets configuration errors|
|S3 sync|Permission or bucket name errors|
|CloudFront Invalidation|Distribution ID or permission errors|

15.4 Response to Deployment Failures

1. Check the failed step in GitHub Actions.

2. Check the error message.

3. Run the same command locally.

4. For AWS authentication errors, check OIDC/Secrets/IAM.

5. For S3 errors, check the bucket name and permissions.

6. For CloudFront errors, check the Distribution ID and permissions.

7. Push a fix commit.

15.5 Checks After Successful Deployment

1. Open the CloudFront URL.

2. Confirm that the home page is up to date.

3. Check the main pages.

4. Test the contact form.

5. Confirm that data is saved in DynamoDB.

  

6. Site Availability Monitoring Design

16.1 MVP Policy

Do not use CloudWatch Synthetics in the MVP.

Reasons:

- Monitoring costs may increase.
- Manual checks are sufficient for an independently developed MVP.
- Prioritize releasing the site and its learning value first.

16.2 Manual Availability Checks

Check the following daily or weekly.

|   |   |
|---|---|
|URL|What to check|
|/|Home page display|
|/terms|Glossary display|
|/questions|Practice questions display|
|/architectures|Architecture diagram listing display|
|/blog|Blog listing display|
|/contact|Contact form display|

16.3 curl Check

curl -I https://xxxxxxxx.cloudfront.net

Expected:

HTTP/2 200

16.4 Automated Availability Monitoring Candidates from Phase 3 Onward

|   |   |   |
|---|---|---|
|Method|Description|Adoption criteria|
|CloudWatch Synthetics|Synthetic monitoring|After traffic increases|
|UptimeRobot or similar|External availability monitoring|Consider if low-cost|
|GitHub Actions scheduled curl|Periodic curl checks|Consider for simple monitoring|

16.5 Proposed Simple Availability Monitoring with GitHub Actions

Proposal for checking the home page with a GitHub Actions schedule from Phase 3 onward.

name: Health Check

  

on:

  schedule:

    - cron: '0 0 * * *'

  workflow_dispatch:

  

jobs:

  health-check:

    runs-on: ubuntu-latest

    steps:

      - name: Check top page

        run: curl -f -I https://example.com

Not mandatory for the MVP.

  

17. Security Monitoring Design

17.1 Items to Check in the MVP

|   |   |
|---|---|
|Item|What to check|
|IAM|Whether unnecessary users or access keys exist|
|S3|Whether Public Access Block is enabled|
|CloudFront|Whether OAC is configured|
|CloudWatch Logs|Whether personal information is exposed|
|GitHub|Whether .env or AWS keys have been committed|
|Billing|Whether unexpected services are being used|

17.2 CloudTrail

Do not perform advanced CloudTrail analysis in the MVP.

However, check CloudTrail in the following cases.

- Suspected AWS access key exposure
- Unrecognized resource creation
- Sudden billing increases
- Suspected IAM permission changes
- Suspected changes to S3 public-access settings

17.3 CloudTrail Check Procedure

1. Open the CloudTrail console.

2. Open Event history.

3. Specify the time range.

4. Filter by Event source or Username.

5. Check Create / Delete / Update events.

6. Check for suspicious activity.

17.4 GitHub Secret Information Checks

|   |   |
|---|---|
|Check|Description|
|.env|Whether it has been committed|
|AWS_ACCESS_KEY_ID|Whether it is hard-coded|
|AWS_SECRET_ACCESS_KEY|Whether it is hard-coded|
|NEXT_PUBLIC_|Whether it contains secret information|
|Actions logs|Whether Secrets are echoed|

  

18. Alert Design

18.1 MVP Alert Policy

AWS Budgets is the only mandatory alert for the MVP.

Reasons:

- Keep costs low for an independently developed MVP.
- Too many monitoring settings increase management overhead.
- Manual and log checks are sufficient initially.

18.2 Mandatory MVP Alerts

|   |   |   |
|---|---|---|
|Alert|Condition|Destination|
|AWS Budgets 50%|50% of monthly budget reached|Email|
|AWS Budgets 80%|80% of monthly budget reached|Email|
|AWS Budgets 100%|100% of monthly budget reached|Email|
|Forecasted 100%|Month-end forecast exceeds 100%|Email|

18.3 Proposed CloudWatch Alarms from Phase 2 Onward

|   |   |   |
|---|---|---|
|Alarm|Proposed condition|Severity|
|Lambda Errors|At least 1 in 5 minutes|High|
|API Gateway 5xx|At least 1 in 5 minutes|High|
|Lambda Duration|Average persistently at least 2 seconds|Medium|
|DynamoDB ThrottledRequests|At least 1|High|
|API Gateway Count surge|Several times normal|Medium|
|CloudFront 5xxErrorRate|Persistently at least 1%|High|

18.4 Notification Destination Design

|   |   |   |
|---|---|---|
|Destination|MVP|From Phase 2 onward|
|Email|Required|Required|
|SNS Topic|Optional|Consider|
|Slack|Optional|Consider|
|Chatwork|Optional|Consider|

18.5 Defer Slack Notifications

Slack notifications are not mandatory for the MVP.

Reasons:

- Additional notification integration implementation is required.
- SNS or Lambda integration may be required.
- Email notifications are sufficient initially.

  

19. CloudWatch Dashboard Design

19.1 MVP Policy

CloudWatch Dashboard is not mandatory for the MVP.

However, a simple dashboard is worth creating if it will be shown in the portfolio.

19.2 Dashboard Widget Candidates

|   |   |
|---|---|
|Widget|Target|
|CloudFront Requests|Site request count|
|CloudFront 4xx/5xx|Delivery errors|
|Lambda Invocations|Contact API execution count|
|Lambda Errors|Lambda errors|
|Lambda Duration|Processing time|
|API Gateway Count|API call count|
|API Gateway 4xx/5xx|API errors|
|DynamoDB ConsumedWrite|Write volume|
|DynamoDB ThrottledRequests|Throttling|

19.3 Adoption Timing

|   |   |
|---|---|
|Timing|Assessment|
|During MVP development|Unnecessary|
|After MVP release|Optional|
|Before portfolio submission|Useful supporting material if created|
|After traffic increases|Recommended|

  

20. Operations Routine

20.1 Daily Checks During Early Development

Check daily during early development to prevent billing incidents.

|   |   |
|---|---|
|Item|What to check|
|Billing Dashboard|Whether current-month costs are increasing excessively|
|Budgets notifications|Whether notification emails have arrived|
|GitHub Actions|Whether the latest deployment succeeded|
|CloudFront URL|Whether the site displays|
|Contact form|Whether a test submission works|

20.2 Weekly Checks After MVP Release

|   |   |
|---|---|
|Item|What to check|
|Cost Explorer|Costs by service|
|CloudWatch Logs|Presence of ERROR logs|
|Lambda Metrics|Errors / Duration|
|API Gateway Metrics|4xx / 5xx / Count|
|DynamoDB|Contact submission count and presence of spam|
|S3|Capacity and unnecessary files|
|GitHub Actions|Presence of failed workflows|

20.3 Monthly Checks

|   |   |
|---|---|
|Item|What to check|
|Total AWS cost|Whether it is within the monthly budget|
|Free Tier usage|Whether usage is trending toward an overrun|
|Unnecessary resources|Whether EC2/RDS/NAT Gateway or similar resources exist|
|CloudWatch Logs storage|Whether retention is effective|
|Articles and content|Update status|
|AdSense revenue|Compare with AWS costs from Phase 3 onward|

  

21. Incident-Response Design

21.1 Incident Classification

|   |   |   |
|---|---|---|
|Incident ID|Incident|Severity|
|INC-001|Site does not display|Critical|
|INC-002|Some pages return 404|Medium|
|INC-003|Contact form submission fails|High|
|INC-004|Lambda errors occur|High|
|INC-005|DynamoDB save fails|High|
|INC-006|Deployment fails|Medium|
|INC-007|AWS costs surge|Critical|
|INC-008|Suspected access key exposure|Critical|
|INC-009|Spam submissions surge|High|

21.2 INC-001 Site Does Not Display

Check order

1. Access the CloudFront URL.

2. Check the error code: 403 / 404 / 500.

3. Check the latest deployment in GitHub Actions.

4. Check whether index.html exists in S3.

5. Check the CloudFront Distribution Status.

6. Check OAC / Bucket Policy.

7. Decide whether to git revert the latest changes.

Common causes

|   |   |
|---|---|
|Cause|Response|
|S3 files deleted|Redeploy|
|Incorrect Bucket Policy|Fix CloudFront SourceArn|
|CloudFront misconfiguration|Check Origin / OAC|
|Deployment despite a failed build|Check GitHub Actions|
|Missing index.html|Check build artifacts|

21.3 INC-003 Contact Form Submission Failure

Check order

1. Check the HTTP status in browser developer tools.

2. Check whether there is a CORS error.

3. Check 4xx/5xx in API Gateway Metrics.

4. Check ERROR entries in Lambda Logs.

5. Check whether data is saved in DynamoDB.

6. Check the CONTACTS_TABLE_NAME / ALLOWED_ORIGINS environment variables.

7. Check the IAM Role's dynamodb:PutItem permission.

Common causes

|   |   |
|---|---|
|Cause|Response|
|CORS misconfiguration|Fix API Gateway / Lambda headers|
|Incorrect Lambda environment variables|Check CONTACTS_TABLE_NAME|
|Insufficient IAM permissions|Check PutItem permission|
|Incorrect DynamoDB table name|Fix the table name|
|Validation error|Check form input|

21.4 INC-007 AWS Cost Surge

Check order

1. Review the Budgets notification details.

2. Open Billing Dashboard.

3. Review costs by Service in Cost Explorer.

4. Review costs by Region.

5. Delete unexpected resources.

6. Check CloudTrail for suspicious activity.

7. Disable access keys if necessary.

8. Add preventive measures.

Services to check immediately

EC2

RDS

NAT Gateway

ALB

OpenSearch

SageMaker

CloudWatch Logs

CloudFront

API Gateway

DynamoDB

21.5 INC-008 Suspected Access Key Exposure

Response procedure

1. Immediately disable the affected IAM access key.

2. Check GitHub Secrets.

3. Check whether the key remains in GitHub history.

4. Check CloudTrail for suspicious activity.

5. Check Cost Explorer for services with surging costs.

6. Delete suspicious resources.

7. Issue a new key if necessary.

8. Consider migrating to OIDC.

  

9. Recovery Design

22.1 Static Site Recovery

The static site in S3 can be redeployed from GitHub.

GitHub main branch

  ↓

GitHub Actions

  ↓

S3 sync

  ↓

CloudFront Invalidation

22.2 Manual Recovery Procedure

cd frontend

npm ci

npm run build

aws s3 sync ./out s3://<bucket-name> --delete

aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"

22.3 Contact API Recovery

|   |   |
|---|---|
|Incident|Recovery method|
|Lambda code defect|Restore the previous code and redeploy|
|Incorrect environment variables|Fix Lambda environment variables|
|Insufficient IAM permissions|Fix the Lambda execution role|
|DynamoDB table deleted|Recreate the table; data recovery is a separate step|
|API Gateway misconfiguration|Fix Route / Integration / CORS|

22.4 DynamoDB Data Recovery

PITR for ContactsTable is not mandatory in the MVP.

Reasons:

- Prioritize cost.
- Contact data is important, but there are few records in the MVP.
- First enforce operational practices that avoid deletion.

Consider PITR after full-scale operations begin.

22.5 GitHub Actions Recovery

|   |   |
|---|---|
|Incident|Recovery method|
|Workflow misconfiguration|Commit a fix|
|Missing Secrets|Reconfigure GitHub Secrets / Variables|
|IAM Role error|Check Trust Policy / Permission Policy|
|S3 sync failure|Check bucket name and permissions|
|CloudFront failure|Check Distribution ID and permissions|

  

23. Data and Log Retention Design

23.1 Log Retention

|   |   |   |
|---|---|---|
|Log|Retention period|Reason|
|Lambda Logs|14–30 days|Sufficient for incident investigation|
|GitHub Actions Logs|Follow GitHub defaults|CI/CD checks|
|CloudFront standard logs|Do not collect in the MVP|Reduce cost|
|API Gateway detailed logs|Minimal in the MVP|Reduce cost|

23.2 Contact Data Retention

|   |   |
|---|---|
|Data|Retention policy|
|ContactsTable|Review after approximately 1 year|
|Obvious spam|Eligible for deletion|
|Test data|May be deleted after functional verification|

23.3 Handling Personal Information

Contact data contains personal information.

Operations rules:

- Do not copy DynamoDB contents to GitHub.
- Do not export and store externally as CSV.
- Do not output full message bodies in logs.
- Do not use real personal information in test data.

  

24. SLA / SLO Design

24.1 No Formal SLA for the MVP

Because this product is an independently developed portfolio project, the MVP does not establish a formal SLA for external users.

However, maintain SLOs as operational targets.

24.2 Proposed MVP SLOs

|   |   |
|---|---|
|Item|Target|
|Home page display|Displays correctly in weekly checks|
|Contact API|Test submissions are saved correctly|
|Lambda errors|Aim for 0 in weekly checks|
|Monthly AWS cost|Within budget|
|CloudWatch Logs retention|14–30 days|
|Recovery time|Aim for same-day recovery within the developer's individual capacity|

24.3 Proposed SLOs from Phase 3 Onward

|   |   |
|---|---|
|Item|Target|
|Site availability|Aim for at least 99%|
|Contact API success rate|Aim for at least 99%|
|5xx errors|Less than 1%|
|Main page display|Aim for within 3 seconds|

  

25. Operations Documentation Management

25.1 Operations Notes

When an incident or cost increase occurs, record it in the following format.

# Operations Notes

  

## YYYY-MM-DD Incident or Event Name

  

### What Happened

  

### Impact

  

### Cause

  

### Response

  

### Preventive Measures

  

### Lessons Learned

25.2 Storage Location

docs/operations/

├── incident-log.md

├── monthly-cost-review.md

└── runbook.md

25.3 Portfolio Use

After removing personal and internal information, operations notes can serve as the portfolio's improvement history.

Example:

Changed CloudWatch Logs retention from Never expire to 14 days, reducing the risk of rising log costs.

  

26. Operations Runbooks

26.1 Site Display Check Runbook

1. Access the CloudFront URL.

2. Check the home page.

3. Check the main pages.

4. Check images, CSS, and JS.

5. Check the 404 page.

6. If there is a problem, check GitHub Actions and CloudFront/S3.

26.2 Contact API Check Runbook

1. Open the /contact page.

2. Send a test contact submission.

3. Check the success message.

4. Check DynamoDB ContactsTableProd.

5. Check for contact saved in CloudWatch Logs.

6. Delete test data or set status to test.

26.3 Billing Check Runbook

1. Open Billing Dashboard.

2. Review current-month costs.

3. Review costs by Service in Cost Explorer.

4. Check for unexpected services.

5. Review costs by Region.

6. Delete unnecessary resources.

7. Record the review in the monthly notes.

26.4 Deployment Failure Runbook

1. Open the failed GitHub Actions workflow.

2. Check the failed step.

3. Run the same command locally.

4. For AWS authentication errors, check OIDC/Secrets/IAM.

5. For Build errors, fix the code.

6. For S3/CloudFront errors, check permissions and IDs.

7. Push a fix commit.

26.5 Spam Submission Runbook

1. Check API Gateway Count.

2. Check Lambda Invocations.

3. Check DynamoDB ItemCount.

4. Check honeypot detection logs.

5. Delete spam data.

6. Consider API Gateway rate limiting.

7. Consider introducing reCAPTCHA or WAF.

  

8. Operations and Monitoring Policy by Phase

27.1 Phase 1: Static Site Release

Monitoring priorities:

- CloudFront display checks
- S3 Public Access Block
- AWS Budgets
- GitHub Actions deploy
- Cost Explorer

MVP approach:

Primarily manual checks are sufficient.

27.2 Phase 2: Add the Contact API

Monitoring priorities:

- API Gateway 4xx/5xx
- Lambda Errors / Duration
- DynamoDB PutItem
- CloudWatch Logs
- Spam submissions

Consider adding:

CloudWatch Alarm for Lambda Errors

CloudWatch Alarm for API Gateway 5xx

27.3 Phase 3: Prepare for Monetization

Monitoring priorities:

- Custom-domain HTTPS
- Search Console
- Analytics
- AdSense
- CloudFront transfer volume
- Comparison of costs and revenue

Consider adding:

Synthetic monitoring

CloudWatch Dashboard

CloudFront 5xx Alarm

27.4 Phase 4: Learning Application

Monitoring priorities:

- Cognito authentication
- Authenticated APIs
- UserAnswersTable
- UserProgressTable
- SES delivery failures
- EventBridge execution failures

Consider adding:

CloudWatch Alarm

SNS notifications

Slack notifications

X-Ray

PITR

Operations dashboard

  

28. Monitoring Excluded from the MVP and Reasons

|   |   |   |
|---|---|---|
|Monitoring/feature|Reason for MVP exclusion|Adoption timing|
|CloudWatch Synthetics|Increases cost and configuration effort|After traffic increases|
|X-Ray|Excessive for only the contact API|After more APIs are added|
|WAF logs|WAF itself is not used in the MVP|After attacks or spam increase|
|CloudFront standard logs|S3 log storage increases cost and management effort|When full-scale analysis is needed|
|API Gateway detailed logs|Risk of increased log volume|When incident investigation is needed|
|GuardDuty|Prioritize cost for a personal MVP|After commercialization or paid features|
|Security Hub|Excessive for the MVP|After full-scale operations begin|
|External monitoring such as Datadog|Increases cost|After monetization|

  

29. Points to Explain in the Portfolio

29.1 Example Operations and Monitoring Explanation

For the MVP, I avoid overengineering monitoring and operate primarily with AWS Budgets, CloudWatch Logs, CloudWatch Metrics, and GitHub Actions logs.

  

I configure AWS Budgets with billing incident prevention as the top priority, and review Lambda logs in CloudWatch Logs.

I set a retention period for CloudWatch Logs and follow a policy of not logging personal information such as contact message bodies or email addresses.

  

The design adds CloudWatch Alarms for Lambda Errors, API Gateway 5xx, DynamoDB ThrottledRequests, and similar metrics once traffic increases.

29.2 Common Interview Questions and Answers

Q1. How do you detect incidents?

In the MVP, I check AWS Budgets, GitHub Actions failures, CloudWatch Logs, and CloudWatch Metrics.

For the contact API, I check Lambda Errors and API Gateway 5xx, and plan to add CloudWatch Alarm from Phase 2 onward.

Q2. Why not create all CloudWatch Alarms from the start?

To keep costs and operational overhead low for an independently developed MVP.

I prioritize Budgets and log checks initially, then add the most important alarms when traffic increases.

Q3. What do you log?

I log requestId, contactId, error types, validation error field names, and similar information.

I do not log full email addresses, full contact messages, JWTs, or Authorization headers.

Q4. How do you handle billing incidents?

I configure low-threshold notifications in AWS Budgets and, when notified, review costs by service and region in Cost Explorer.

If services not used in the MVP, such as EC2, RDS, or NAT Gateway, incur costs, I investigate immediately and delete them if unnecessary.

Q5. Where do you look when the contact form does not work?

First, I check the HTTP status and CORS errors in the browser.

Then I check API Gateway 4xx/5xx, Lambda Logs, Lambda Errors, DynamoDB storage status, IAM permissions, and Lambda environment variables in that order.

  

30. Acceptance Criteria

30.1 Operations and Monitoring Design Acceptance Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-OPS-DOC-001|MVP monitoring targets are defined|
|AC-OPS-DOC-002|Monitoring items for CloudFront / S3 / API Gateway / Lambda / DynamoDB are defined|
|AC-OPS-DOC-003|CloudWatch Logs output policy and retention period are defined|
|AC-OPS-DOC-004|AWS Budgets monitoring policy is defined|
|AC-OPS-DOC-005|Cost Explorer review policy is defined|
|AC-OPS-DOC-006|GitHub Actions monitoring policy is defined|
|AC-OPS-DOC-007|Incident-response runbooks are defined|
|AC-OPS-DOC-008|Monitoring excluded from the MVP and its reasons are defined|
|AC-OPS-DOC-009|Monitoring expansion policy by phase is defined|
|AC-OPS-DOC-010|Operations and monitoring points that can be explained in interviews are organized|

30.2 MVP Operations and Monitoring Implementation Completion Criteria

|   |   |
|---|---|
|ID|Criterion|
|AC-OPS-MVP-001|AWS Budgets is configured|
|AC-OPS-MVP-002|Lambda logs can be reviewed in CloudWatch Logs|
|AC-OPS-MVP-003|CloudWatch Logs retention is set to 14–30 days|
|AC-OPS-MVP-004|Lambda Logs do not contain full email or message values|
|AC-OPS-MVP-005|API Gateway 4xx/5xx can be reviewed|
|AC-OPS-MVP-006|Lambda Errors / Duration can be reviewed|
|AC-OPS-MVP-007|Contact data storage in DynamoDB can be verified|
|AC-OPS-MVP-008|GitHub Actions CI/CD results can be reviewed|
|AC-OPS-MVP-009|Costs by service can be reviewed in Cost Explorer|
|AC-OPS-MVP-010|Site display and contact API check runbooks are available|

  

31. Related Design Documents to Create Next

Create the following after this operations and monitoring design.

1. Development task list
2. GitHub README draft
3. MVP implementation schedule
4. Test design
5. Initial content creation templates
6. Release procedure
7. Explanatory materials for portfolio submission

  

8. Conclusion

Avoid overengineering operations monitoring during the MVP stage of this product.

The following are mandatory initially.

AWS Budgets

CloudWatch Logs

CloudWatch Metrics

GitHub Actions logs

Cost Explorer / Billing review

Manual availability checks

The following five points are especially important.

1. Detect billing incidents with AWS Budgets.
2. Check Lambda errors in CloudWatch Logs.
3. Do not expose personal information in CloudWatch Logs.
4. Check basic API Gateway / Lambda / DynamoDB metrics.
5. Document incident investigation order in runbooks.

CloudWatch Alarm, Dashboard, Synthetics, X-Ray, WAF, GuardDuty, and similar features are not mandatory for the MVP.

Introduce them incrementally as traffic increases, AdSense is introduced, login features are added, or paid features launch.

This design aims to keep costs low while producing a portfolio that demonstrates practical AWS operations and monitoring fundamentals.
