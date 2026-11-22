AWS Certification Study Site Cost Management Design

1. Document Information

|   |   |
|---|---|
|Item|Description|
|Document name|AWS Certification Study Site Cost Management Design|
|Target product|AWS Certification Roadmap Lab|
|Target phases|MVP development through Phase 4: learning application|
|Purpose|Define a design for operating a portfolio while minimizing AWS costs and preventing unexpected charges|
|Planned technologies|S3 / CloudFront / API Gateway / Lambda / DynamoDB / CloudWatch / IAM / AWS Budgets / Route 53 / ACM / Cognito / EventBridge / SES|
|Created|2026-05-30|

  

2. Purpose of This Design Document

This document defines policies, billing factors, services to use and avoid, monitoring rules, and operational checklists for operating the AWS Certification Roadmap Lab certification study site on AWS at low cost.

The product assumes the following.

- It is an individual portfolio project
- It applies learning from AWS Cloud Practitioner / SAA
- Initial costs should be kept as close to zero as possible
- It uses the AWS Free Tier
- Fixed costs should be minimized before advertising monetization
- AWS Budgets must be configured to prevent unexpected charges

The objective is not to guarantee that costs remain completely zero forever.

This design has the following objectives.

1. Publish the initial MVP using the Free Tier and a low-cost architecture.
2. Avoid AWS services likely to incur fixed costs.
3. Identify settings with billing risks in advance.
4. Prevent unexpected charges with AWS Budgets and operational rules.
5. Offset AWS charges with advertising revenue after traffic increases.
6. Be able to explain in interviews that cost optimization informed the design.

  

7. Fundamental Cost Management Policy

3.1 Basic Policy

|   |   |
|---|---|
|Policy|Description|
|Avoid fixed costs|Do not use always-running EC2, RDS, NAT Gateway, or ALB in the MVP|
|Serverless first|Build primarily with Lambda, API Gateway, DynamoDB, S3, and CloudFront|
|Static delivery first|Deliver glossaries, articles, questions, and architecture diagrams as static files|
|Minimal APIs|Only the contact API is mandatory for the MVP|
|Avoid accumulating logs|Set short CloudWatch Logs retention|
|Optimize images|Reduce S3 storage and CloudFront transfer volume|
|Mandatory billing alerts|Configure AWS Budgets first|
|Make cost reviews routine|Regularly check AWS Billing / Cost Explorer|
|Delete unused resources promptly|Delete resources no longer needed after testing|
|Optional custom domain|Optional initially because Route 53 and domains incur charges|

  

4. Cost Targets

4.1 MVP Targets

The MVP-stage targets are as follows.

|   |   |
|---|---|
|Item|Target|
|Monthly AWS charges|Aim for JPY 0 to several tens of yen|
|Fixed costs|None as a rule|
|Always-running servers|None|
|Fixed database costs|None|
|Contact API|Aim to remain within the Free Tier, assuming infrequent use|
|CloudWatch Logs|Set retention to prevent excessive accumulation|
|Custom domain|Optional for MVP|

4.2 Cost Targets by Phase

|   |   |   |
|---|---|---|
|Phase|Architecture|Cost target|
|Phase 1|S3 + CloudFront static site|Approach zero|
|Phase 2|Add API Gateway + Lambda + DynamoDB|Aim for Free Tier coverage with infrequent use|
|Phase 3|Custom domain and AdSense preparation|Decide whether domain and Route 53 costs are acceptable|
|Phase 4|Cognito, learning history, notifications|Usage-based billing by user count; monitor Free Tier overruns|

  

5. Planned AWS Services and Billing Factors

5.1 MVP Services

|   |   |   |   |
|---|---|---|---|
|Service|Purpose|Billing factors|MVP usage policy|
|S3|Static-file storage|Storage capacity, requests, data transfer, management features|Required; store lightweight files only|
|CloudFront|CDN delivery|Data transfer, requests, cache invalidations, etc.|Required for static delivery|
|API Gateway|Contact API|API request count and data transfer|Required in Phase 2; prefer HTTP API|
|Lambda|Contact processing|Requests, execution duration, memory|Required in Phase 2; short executions|
|DynamoDB|Contact storage|Reads, writes, storage, backups, etc.|Required in Phase 2; small-scale usage|
|CloudWatch Logs|Lambda logs|Log ingestion, storage, analysis|Required; short retention|
|IAM|Permission management|Normally no additional charge|Required; least privilege|
|AWS Budgets|Billing monitoring|Budget monitoring has a free allowance; take care with actions|Required; configure first|

5.2 Candidate Services from Phase 3 Onward

|   |   |   |   |
|---|---|---|---|
|Service|Purpose|Billing factors|Usage policy|
|Route 53|Custom-domain DNS|Hosted Zones, queries, etc.|Consider around AdSense application time|
|ACM|SSL/TLS certificates|Public certificates for CloudFront are generally free|Use with a custom domain|
|Cognito|Authentication|MAUs and feature usage|Consider in Phase 4|
|EventBridge|Scheduled execution|Event count|Consider for daily-question delivery|
|SES|Email delivery|Message count and data volume|Consider for notifications|
|WAF|Web protection|Web ACLs, rules, requests|Do not use in MVP|
|Secrets Manager|Secret management|Secret count and API calls|Consider when adding external API keys|

  

6. AWS Services Not Used

6.1 Services Generally Prohibited in the MVP

|   |   |   |
|---|---|---|
|Service|Reason not to use|Alternative|
|Always-running EC2|Charges by runtime; risk of forgetting to stop instances|S3 + CloudFront / Lambda|
|RDS|Likely fixed costs; excessive for MVP|DynamoDB / JSON|
|NAT Gateway|Likely fixed costs even at small scale|Lambda outside a VPC / architecture without a VPC|
|ALB|Likely ongoing charges|API Gateway / CloudFront|
|ECS / EKS|Heavy operational and financial burden for an individual MVP|Lambda|
|OpenSearch|Likely expensive for search|Frontend JSON search|
|ElastiCache|Not needed for MVP|Static caching / CloudFront|
|Redshift|Excessive analytics infrastructure|Not needed|
|SageMaker|Powerful AI capabilities but costly|No AI features initially|
|WAF|Effective but adds MVP costs|Consider after traffic increases|

6.2 Particularly Risky Billing Factors

|   |   |   |
|---|---|---|
|Item|Risk|Countermeasure|
|NAT Gateway|Simply creating one can incur fixed costs|Do not use|
|RDS|Charges from forgotten running instances, storage, and backups|Do not use|
|EC2|Charges from forgotten running instances, EBS, and Elastic IP|Do not use|
|ALB|Likely ongoing charges|Use API Gateway|
|CloudWatch Logs|Accumulating charges from indefinite retention|Set retention|
|Large S3 files|Abandoned images/videos increase storage and transfer costs|Compress and delete|
|High CloudFront transfer volume|Viral traffic or bots increase transfers|Monitor with Budgets; consider WAF if needed|
|Frequent DynamoDB Scans|Read costs rise as data grows|Design Queries; prioritize static management|

  

7. Per-service Cost Design

  

7.1 Amazon S3

7.1.1 Purpose

Use S3 for the following.

- HTML
- CSS
- JavaScript
- Images
- OGP images
- AWS architecture diagram images
- Static JSON

7.1.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Storage capacity|Volume of stored files|
|Requests|GET, PUT, LIST, and other operations|
|Data transfer|Transfers to the internet, etc.|
|Management features|Analytics, replication, lifecycle, etc.|

7.1.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Image compression|Appropriately compress PNG/JPG/WebP|
|No videos|Do not store video learning materials in S3|
|Delete unused files|Avoid retaining excessive old build artifacts|
|Lightweight JSON|Do not let question and term datasets become unnecessarily large|
|Versioning precautions|Manage old versions to prevent accumulation if enabled|
|Log-storage precautions|Do not enable S3 access logs casually|

7.1.4 MVP Rules

|   |   |
|---|---|
|Rule|Description|
|S3 capacity|Initial target: within 100MB|
|Images|Target: at most 300KB per image|
|OGP images|Start with the minimum necessary|
|Videos|Prohibited|
|Backups|Manage originals in GitHub; do not store backups in S3|

  

7.2 Amazon CloudFront

7.2.1 Purpose

Use CloudFront for the following.

- Fast static-site delivery
- HTTPS delivery
- Prevent direct S3 exposure
- Reduce S3 requests through caching

7.2.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Data transfer volume|Transfer from CloudFront to users|
|Request count|HTTP/HTTPS requests|
|Cache invalidation|Watch for invalidations exceeding the free allowance|
|CloudFront Functions / Lambda@Edge|Additional charges when used|
|Logs|Take care when using standard or real-time logs|

7.2.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Use caching|Cache static files for longer periods|
|Minimize invalidations|Do not invalidate /* every time|
|Optimize images|Reduce transfer volume|
|Avoid unnecessary edge features|Do not use CloudFront Functions / Lambda@Edge in MVP|
|Do not enable logs casually|CloudFront logs may remain disabled until needed|

7.2.4 MVP Rules

|   |   |
|---|---|
|Rule|Description|
|Invalidation|Only during deployment|
|Invalidation paths|Changed files only if possible; otherwise /* is acceptable initially, with low frequency|
|Edge processing|Do not use|
|WAF|Do not use|

  

7.3 API Gateway

7.3.1 Purpose

Use API Gateway for the following.

- Expose the contact API
- Future question-retrieval API
- Future learning-history API

7.3.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|API calls|Charges based on request count|
|Data transfer|Response data volume|
|Caching|Take care with REST API caching|
|WebSocket|Message count and connection duration if used|

7.3.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Prefer HTTP API|Easier to keep simple and low-cost than REST API|
|Minimize API count|Only POST /contact for MVP|
|Do not expose static data through APIs|Initially deliver terms, articles, and questions through JSON/MDX|
|Lightweight responses|Do not return unnecessary data|
|No caching feature|API Gateway caching is unnecessary in MVP|

7.3.4 MVP Rules

|   |   |
|---|---|
|Rule|Description|
|Required APIs|Only POST /contact|
|Authentication|None in MVP|
|CORS|Restrict to production domain|
|Rate limiting|Consider when spam increases|

  

7.4 AWS Lambda

7.4.1 Purpose

Use Lambda for the following.

- Save contact submissions
- Future question retrieval
- Future answer-history storage
- Future daily-question delivery

7.4.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Request count|Lambda invocation count|
|Execution duration|Runtime in milliseconds|
|Memory size|More allocated memory increases cost|
|Response streaming|Watch data volume when used|
|Provisioned Concurrency|Do not use in MVP|

7.4.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Short execution|Save contact submissions within a few seconds|
|Start with minimal memory|Start around 128MB–256MB|
|Short timeouts|Generally 3–5 seconds|
|Prohibit Provisioned Concurrency|Do not use in MVP|
|Avoid external API calls|Unnecessary for contact storage alone|
|Prevent infinite retries|Design error retries carefully|

7.4.4 MVP Rules

|   |   |
|---|---|
|Rule|Description|
|Lambda count|Start with one: contact-submit-function only|
|Memory|128MB–256MB|
|Timeout|3–5 seconds|
|VPC connection|None|
|Provisioned Concurrency|Prohibited|
|Lambda Layers|Do not use unless needed|

  

7.5 DynamoDB

7.5.1 Purpose

Use DynamoDB for the following.

- Contact-data storage
- Future question-data storage
- Future user answer-history storage
- Future learning-progress storage

7.5.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Reads|Read Request / RCU|
|Writes|Write Request / WCU|
|Storage|Stored data volume|
|Backups|On-demand backups and PITR|
|Streams|When using DynamoDB Streams|
|Global Tables|Multi-region replication|

7.5.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|ContactsTable only for MVP|Minimize table count|
|Consider On-Demand or Free Tier usage|On-Demand is easier to manage for small-scale or unknown traffic|
|Avoid large Scans|Design Queries/GSIs after data grows|
|Use backups cautiously|PITR is not mandatory for MVP|
|Disable Streams|Do not use in MVP|
|Prohibit Global Tables|Do not use in MVP|

7.5.4 MVP Rules

|   |   |
|---|---|
|Rule|Description|
|Tables|Start with ContactsTable only|
|Stored data|Contact data only|
|Read API|Do not build in MVP|
|PITR|Optional in MVP; disable if cost is the priority|
|Streams|Disabled|
|Global Tables|Prohibited|

  

7.6 CloudWatch Logs

7.6.1 Purpose

Use CloudWatch Logs for the following.

- Inspect Lambda execution logs
- Investigate contact API errors
- Future API monitoring

7.6.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Log ingestion|Log volume emitted by Lambda and other services|
|Log storage|Retention period and stored volume|
|Logs Insights|Query analysis volume|
|Live Tail|Usage duration|
|Metrics and alarms|Number of custom metrics and alarms|

7.6.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Set log retention|Do not retain indefinitely|
|Reduce log volume|Do not output full message bodies or huge JSON objects|
|No routine DEBUG logging|Primarily INFO or WARN in production|
|Do not overuse Logs Insights|Use only when necessary|
|Prohibit personal-information logging|Also important for security|

7.6.4 MVP Rules

|   |   |
|---|---|
|Rule|Description|
|Retention|14–30 days|
|Log level|INFO or higher|
|Prohibited output|Full email addresses, full contact messages, JWTs, API keys|
|Logs Insights|Only during error investigations|

  

7.7 Route 53

7.7.1 Purpose

Use Route 53 when using a custom domain.

Uses:

- Custom-domain DNS management
- Configure Alias records to CloudFront
- ACM certificate validation

7.7.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Hosted Zone|Monthly charge per hosted zone|
|DNS queries|Number of DNS requests|
|Domain registration|Domain purchase and renewal charges|

7.7.3 Usage Policy

Not mandatory for MVP.

Reasons:

- Functionality can be verified with the default CloudFront domain
- A custom domain can incur fixed costs
- It can be introduced when applying for AdSense or launching fully

7.7.4 Adoption Timing

|   |   |
|---|---|
|Timing|Decision|
|During MVP development|Unnecessary|
|Portfolio publication|Desirable but not mandatory|
|AdSense application|Custom domain recommended|
|Full-scale operations|Recommended|

  

7.8 ACM

7.8.1 Purpose

Use ACM for HTTPS certificates on the custom domain.

7.8.2 Cost Policy

Additional costs can generally be minimized when using public certificates configured for CloudFront.

Note that CloudFront certificates should generally be issued in us-east-1.

7.8.3 MVP Rules

|   |   |
|---|---|
|Rule|Description|
|Default CloudFront domain|ACM unnecessary|
|Custom domain|Use ACM|
|Certificate region|us-east-1|

  

7.9 Cognito Phase 4

7.9.1 Purpose

Use Cognito for future login and learning-history features.

Uses:

- User registration
- Login
- JWT issuance
- Protect authenticated APIs

7.9.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|MAU|Monthly active users|
|Advanced security features|Possible extra costs when enabled|
|SMS|Billing risk when using phone-number verification|

7.9.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Do not use in MVP|Login is unnecessary|
|Primarily email authentication|Do not use SMS authentication|
|Defer advanced features|Do not enable until needed|

  

7.10 EventBridge Phase 4

7.10.1 Purpose

Use EventBridge for future scheduled processing.

Uses:

- Daily-question delivery
- Scheduled aggregation
- Maintenance processing

7.10.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Event count|Events generated and processed|
|Scheduler|Scheduled execution count|

7.10.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Infrequent execution|Start around once per day|
|No unnecessary schedules|Do not leave unused rules|
|Keep Lambda integrations short|Minimize execution duration|

  

7.11 SES Phase 4

7.11.1 Purpose

Use SES for future email notifications.

Uses:

- Contact notifications
- Daily-question delivery
- Study reminders

7.11.2 Billing Factors

|   |   |
|---|---|
|Billing factor|Description|
|Email count|Messages sent|
|Data volume|Attachments and message-body volume|
|Incoming email|When using receiving features|

7.11.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Do not use in MVP|Unnecessary for contact storage alone|
|No attachments|Avoid increasing data volume|
|Limit delivery frequency|Around once daily|
|Notification opt-out|Avoid unnecessary sending|

  

8. Cost Design by Phase

8.1 Phase 1: Publish the Static Site

Services used

- S3
- CloudFront
- IAM
- AWS Budgets

Cost policy

|   |   |
|---|---|
|Item|Policy|
|Content|Primarily static files|
|Images|Compress before deployment|
|API|None|
|DB|None|
|Logs|Minimal|
|Fixed costs|Aim for none|

Goal

First establish a public URL on AWS.

However, do not use EC2, RDS, ALB, or NAT Gateway.

  

8.2 Phase 2: Add the Contact API

Services used

- API Gateway
- Lambda
- DynamoDB
- CloudWatch Logs

Cost policy

|   |   |
|---|---|
|Item|Policy|
|API count|Only POST /contact|
|Lambda|128MB–256MB, 3–5 seconds|
|DynamoDB|ContactsTable only|
|CloudWatch Logs|Retain for 14–30 days|
|Rate limiting|Consider when spam increases|

Goal

Demonstrate serverless API implementation experience while minimizing dynamic processing.

  

8.3 Phase 3: Prepare for Monetization

Services used

- Route 53
- ACM
- CloudFront
- Google Search Console
- Google Analytics
- Google AdSense

Cost policy

|   |   |
|---|---|
|Item|Policy|
|Custom domain|Decide around AdSense application time|
|Route 53|Decide whether Hosted Zone charges are acceptable|
|Analytics|Primarily free tools|
|AdSense|Aim to offset AWS costs with advertising revenue|

Goal

Decide whether monthly fixed costs are justified as preparation for advertising monetization.

  

8.4 Phase 4: Develop into a Learning Application

Services used

- Cognito
- API Gateway
- Lambda
- DynamoDB
- EventBridge
- SES
- CloudWatch

Cost policy

|   |   |
|---|---|
|Item|Policy|
|Login|Implement with Cognito|
|Learning history|Store in DynamoDB|
|Notifications|Optional initially; do not send bulk emails|
|AI explanations|Defer because API costs are incurred|
|Paid features|Implement after revenue prospects emerge|

Goal

Expand from free media into a learning application, investing gradually according to user count.

  

9. AWS Budgets Design

9.1 Budgets Configuration Policy

Configure AWS Budgets first in this project.

Reasons:

- Detect unexpected charges early
- Notice abnormal usage following AWS access-key leakage
- Detect configuration mistakes during learning
- Maintain awareness of Free Tier overruns

9.2 Proposed Budgets

|   |   |   |
|---|---|---|
|Budget name|Amount|Purpose|
|aws-cert-lab-monthly-budget|1 USD|Detect anomalies in the initial MVP|
|aws-cert-lab-warning-budget|5 USD|Warnings after full launch|
|aws-cert-lab-growth-budget|10 USD|Manage limits after traffic increases|

Start with a low alert threshold of around 1 USD.

Adjust the budget to account for fixed costs if using a custom domain or Route 53.

9.3 Notification Thresholds

|   |   |
|---|---|
|Threshold|Notification|
|50%|Early caution|
|80%|Warning|
|100%|Overrun notification|
|Forecasted 100%|Forecasted overrun notification|

9.4 Notification Destinations

|   |   |
|---|---|
|Destination|Purpose|
|Email|Required|
|SNS|Consider in future|
|Slack|Consider in future|

9.5 About Budgets Actions

Budgets Actions can apply control actions to IAM, EC2/RDS, and other resources when a budget is exceeded.

Not mandatory for MVP.

Reasons:

- This project does not use EC2/RDS
- Notifications are sufficient initially
- Budgets with actions require attention to charges depending on configuration count and usage

MVP policy:

Budget notifications are mandatory.

Do not use Budget Actions.

  

10. CloudWatch Logs Cost Management

10.1 Retention

|   |   |   |
|---|---|---|
|Log group|Retention|Reason|
|/aws/lambda/contact-submit-function|14–30 days|Sufficient for investigating contact failures|
|/aws/lambda/get-questions-function|14–30 days|Future API|
|/aws/lambda/submit-answer-function|30 days|Learning-history API|
|/aws/lambda/daily-question-function|14–30 days|Verify notifications|

10.2 Log Output Rules

|   |   |
|---|---|
|Permitted output|Prohibited output|
|requestId|Full email address|
|statusCode|Full contact message body|
|contactId|JWT|
|errorCode|Authorization header|
|validation error fields|AWS access keys|

10.3 Log Cost Reduction Rules

- Do not routinely use DEBUG logs in production
- Do not output complete request bodies
- Minimize exception stacks to what is necessary
- Do not run CloudWatch Logs Insights unnecessarily
- Always configure log retention

  

11. Data Transfer Management

11.1 Causes of Increased Data Transfer

|   |   |
|---|---|
|Cause|Countermeasure|
|Large images|Convert to WebP and compress|
|Unnecessary JavaScript|Reduce bundle size|
|Large numbers of OGP images|Use shared OGP images|
|Video delivery|Do not host on S3/CloudFront|
|Bot access|Use WAF or robots.txt as needed|
|Viral traffic|Monitor with Budgets|

11.2 Image Optimization Rules

|   |   |
|---|---|
|Type|Target size|
|Article images|At most 300KB|
|Architecture diagram images|At most 500KB|
|OGP images|At most 300KB|
|Logo|At most 100KB|

11.3 Frontend Optimization

|   |   |
|---|---|
|Item|Policy|
|Unnecessary libraries|Do not add|
|Code splitting|Use standard Next.js features|
|Markdown|Static generation|
|Images|lazy loading|
|API calls|Minimum necessary|

  

12. CI/CD Cost Management

12.1 GitHub Actions

GitHub Actions costs are outside AWS, but pay attention to its free allowance and usage limits.

12.2 AWS-side Cost Factors

|   |   |
|---|---|
|Process|AWS cost factor|
|S3 uploads|PUT requests|
|Old-file deletion|DELETE requests|
|CloudFront Invalidation|Number of invalidation paths|
|Reruns after deployment failure|More PUTs/invalidations|

12.3 Cost Reduction Policy

|   |   |
|---|---|
|Policy|Description|
|Production deployment only from main|Reduce unnecessary deployments|
|Build checks only for pull requests|Do not deploy to S3|
|Limit invalidation frequency|Only when necessary|
|Optimize cache paths|Include hashes in asset filenames|

12.4 Deployment Rules

feature branch push → lint / build only

main branch merge → S3 deploy + CloudFront invalidation

  

13. Evaluating Custom-domain Costs

13.1 Advantages of a Custom Domain

|   |   |
|---|---|
|Advantage|Description|
|Credibility|Improves portfolio presentation|
|SEO|Supports long-term operations|
|AdSense|Can benefit review and operations|
|Branding|Easier to develop as a learning publication|

13.2 Disadvantages of a Custom Domain

|   |   |
|---|---|
|Disadvantage|Description|
|Domain cost|Annual fees|
|Route 53 cost|Possible Hosted Zone and other charges|
|Management workload|DNS, certificates, and renewals require management|

13.3 Decision Criteria

|   |   |
|---|---|
|Situation|Decision|
|During MVP development|Default CloudFront domain is sufficient|
|Listed in GitHub portfolio|Custom domain is desirable|
|AdSense application|Custom domain recommended|
|Serious monetization plans|Introduce a custom domain|

13.4 Recommended Decision

No custom domain until the MVP is published.

Add a custom domain when there are 10–20 articles and an AdSense application is being considered.

  

14. Advertising Monetization and AWS Costs

14.1 Before Monetization

Minimize AWS costs before monetization.

|   |   |
|---|---|
|Policy|Description|
|No fixed costs|No EC2/RDS/ALB/NAT Gateway|
|Primarily static delivery|S3 + CloudFront|
|Minimal APIs|Contact only|
|Optional custom domain|Wait until needed|

14.2 After Monetization

Once AdSense or paid note articles generate revenue, allow the following investments.

|   |   |
|---|---|
|Investment|Decision criterion|
|Custom domain|Acceptable for monetization and SEO|
|Route 53|Acceptable for custom-domain operation|
|Cognito|Acceptable if learning history adds value|
|SES|Acceptable if needed to improve user retention|
|WAF|Acceptable if traffic growth or attacks require it|

14.3 Break-even Approach

Evaluate monthly AWS costs as follows.

Monthly advertising revenue + paid-article revenue >= monthly AWS costs

Initial targets:

|   |   |
|---|---|
|Metric|Target|
|Monthly AWS costs|JPY 0 to within several hundred yen|
|Monthly page views|At least 1,000PV|
|AdSense|Apply and pass review|
|note links|Installed|

  

15. Cost Monitoring Operations

15.1 Daily Checks

Check AWS charges daily during early development.

|   |   |
|---|---|
|Item|What to check|
|Billing Dashboard|Current-month costs|
|Budgets notifications|Budget and forecasted overruns|
|Cost Explorer|Services with sharply rising costs|
|CloudWatch Logs|Sudden log-volume increases|
|API Gateway|Sudden request increases|
|Lambda|Sudden increases in errors or invocations|

15.2 Weekly Checks

|   |   |
|---|---|
|Item|What to check|
|S3 capacity|Whether unused files are accumulating|
|CloudFront transfers|Whether volume has increased sharply|
|DynamoDB item count|Whether spam is increasing|
|CloudWatch Logs storage|Whether retention is working|
|Unused resources|Whether created resources were abandoned|

15.3 Monthly Checks

|   |   |
|---|---|
|Item|What to check|
|Monthly AWS costs|Whether within budget|
|Per-service costs|Whether unexpected services incur charges|
|Free Tier usage|Whether usage is trending toward an overrun|
|AdSense revenue|Whether it can offset AWS costs|
|Optimization targets|Review expensive services|

  

16. Unexpected-charge Response Flow

16.1 When a Budgets Notification Arrives

1. Open the AWS Billing Dashboard.

2. Check the service with rising costs in Cost Explorer.

3. Check the affected region.

4. Identify the affected resources.

5. Stop or delete them if unnecessary.

6. Check CloudWatch Logs and API Gateway metrics.

7. Check for possible AWS access-key leakage.

8. Reflect recurrence-prevention measures in the design document.

16.2 When an Unexpected Service Incurs Charges

1. Check the service name.

2. Check whether you remember creating it.

3. Check all regions.

4. Delete unnecessary resources.

5. Check IAM access keys.

6. Check operation history in CloudTrail.

7. Disable access keys if necessary.

16.3 When Access-key Leakage Is Suspected

1. Immediately disable the affected access key.

2. Check IAM-user permissions.

3. Check CloudTrail for suspicious operations.

4. Check Cost Explorer for services with sharply rising costs.

5. Delete suspicious resources.

6. Check whether keys remain in GitHub history.

7. Update GitHub Secrets.

16.4 When Spam Increases DynamoDB Writes

1. Check API Gateway request counts.

2. Check the ContactsTable item count.

3. Confirm that the honeypot works.

4. Consider API Gateway rate limiting.

5. Consider reCAPTCHA if necessary.

6. Delete clearly identified spam data.

  

7. Region Management

17.1 Primary Region

The primary region for this product is as follows.

ap-northeast-1 / Tokyo Region

Reasons:

- The site targets Japan
- The developer uses it in Japan
- Low latency
- Standardizing on Tokyo makes AWS learning resources easier to manage

17.2 Exception

Generally manage ACM certificates for CloudFront in the following region.

us-east-1 / Northern Virginia

17.3 Rules for Preventing Region Mistakes

|   |   |
|---|---|
|Rule|Description|
|Check region before creation|Check the region in the upper-right corner of the console|
|Check unused regions|Review resources in all regions once monthly|
|Understand the ACM exception|CloudFront certificates use us-east-1|
|Delete unused resources|Do not leave test resources created in other regions|

  

18. Cost Policy by Environment

18.1 MVP Environment

A production-only environment is acceptable for the MVP.

Reasons:

- Keep costs down for individual development
- More environments mean more S3, API, DynamoDB, and log resources
- Prioritize reaching publication first

18.2 Future Environment Separation

Separate the following environments in the future.

|   |   |   |
|---|---|---|
|Environment|Purpose|Cost policy|
|local|Local development|Free|
|dev|AWS test environment|Create only when needed|
|prod|Production environment|Continuously operated|

18.3 Dev Environment Rules

|   |   |
|---|---|
|Rule|Description|
|Not permanent|Create only when needed|
|Minimal data|Test data only|
|Short log retention|Around 7 days|
|Delete after testing|Delete unused resources|

  

19. IaC and Cost Management

19.1 Benefits of IaC

|   |   |
|---|---|
|Advantage|Description|
|Resource visibility|Code shows what was created|
|Easy deletion|Delete by stack|
|Reproducibility|Recreate the same architecture|
|Prevent unexpected charges|Identify unused resources easily|

19.2 Recommended Tools

|   |   |
|---|---|
|Tool|Policy|
|AWS SAM|Recommended for Lambda/API Gateway/DynamoDB-focused architectures|
|Terraform|High future portfolio value|
|AWS CDK|Useful when managing with TypeScript/Python|

19.3 MVP Policy

Initially build manually through the AWS console for learning benefits.

Consider IaC through AWS SAM from Phase 2 onward.

19.4 Deletion Rules

After adopting IaC, make test environments deletable as follows.

sam delete

Or with Terraform:

terraform destroy

  

20. Cost Optimization Design Decisions

20.1 Why S3 + CloudFront Instead of EC2?

|   |   |   |
|---|---|---|
|Aspect|EC2|S3 + CloudFront|
|Fixed costs|Likely|Low|
|Operations|OS management required|Managed|
|Static site|Excessive|Suitable|
|Portfolio explanation|Server-building focus|Cloud-design focus|

Conclusion:

Because this product primarily consists of static content, use S3 + CloudFront rather than EC2.

20.2 Why DynamoDB Instead of RDS?

|   |   |   |
|---|---|---|
|Aspect|RDS|DynamoDB|
|Fixed costs|Likely|Easy to use in a serverless manner|
|MVP data|Excessive|Sufficient for contact storage|
|Operations|Database management required|Managed|
|Scaling|Design required|Easy to scale automatically|

Conclusion:

Since the MVP only stores contact submissions, use DynamoDB rather than RDS.

20.3 Why Not Use NAT Gateway?

This product does not require Lambda inside a VPC.

Therefore, NAT Gateway is unnecessary.

Conclusion:

There is no requirement for outbound communication from private VPC subnets, so NAT Gateway is not used.

20.4 Why Not Put Question Data in a Database Initially?

|   |   |   |
|---|---|---|
|Aspect|JSON/MDX|DynamoDB|
|Cost|Low|API/database access occurs|
|SEO|Easy static generation|SSR/API design required|
|Development speed|Fast|More implementation work|
|Management|Changes tracked in GitHub|Often needs an administration screen|

Conclusion:

In the MVP, manage questions, terms, and articles in JSON/MDX, and store only contact submissions in DynamoDB.

  

21. Anticipated Cost Risks in the MVP Architecture

21.1 Normal Traffic

Assumptions:

- Several hundred to several thousand monthly page views for an individual portfolio
- Several to several dozen inquiries per month
- Static site centered on images and articles

In this case, the main costs are limited to the following.

|   |   |
|---|---|
|Service|Risk|
|S3|Too many images or files stored|
|CloudFront|Traffic spikes and images|
