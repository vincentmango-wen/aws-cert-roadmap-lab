# MVP Operation Runbook

## 1. Document information

| Item | Details |
|---|---|
| Document name | MVP Operation Runbook |
| Product | AWS Cert Roadmap Lab |
| Environment | production |
| Branch | master |
| Phase | Phase 3: CI/CD and operational monitoring |
| Purpose | Document post-MVP-launch checks, incident response, and cost-review procedures. |

---

## 2. Purpose of this runbook

This runbook provides a clear investigation sequence when problems occur during MVP operation of AWS Cert Roadmap Lab.

The main problems covered are:

- The site does not load
- Some pages return 404
- Contact form submissions fail
- Lambda errors occur
- Contact submissions are not saved to DynamoDB
- GitHub Actions deployment fails
- AWS costs spike
- Access-key exposure is suspected
- Spam submissions spike

---

## 3. MVP operational policy

Do not build a large monitoring platform for the MVP.

Focus operations on:

- AWS Budgets
- Cost Explorer
- CloudWatch Logs
- CloudWatch Metrics
- GitHub Actions Logs
- Checking DynamoDB items
- Manual availability checks

Do not introduce the following in the MVP:

- CloudWatch Synthetics
- X-Ray
- WAF
- GuardDuty
- Security Hub
- Datadog
- Slack notifications
- SNS notifications
- External synthetic monitoring services

For an individually developed MVP, the priority is stable publication without adding cost or operational overhead.

---

## 4. Severity classification

| Severity | Description | Response target |
|---|---|---|
| Critical | Entire site down, cost spike, or suspected credential exposure | Respond immediately |
| High | Contact API down, repeated Lambda errors, or DynamoDB persistence failures | Respond the same day |
| Medium | Some pages return 404, GitHub Actions failure, or increased 4xx responses | Respond within 1–2 days |
| Low | Minor layout issues, typos, or minor warning logs | Handle as routine tasks |

---

## 5. Daily checklist

Check daily during early development and immediately after MVP launch to prevent unexpected charges.

| Target | Check | Expected state |
|---|---|---|
| Billing Dashboard | Current-month costs | Within budget |
| Budgets notifications | Email notifications | No over-budget alerts |
| GitHub Actions | Latest workflow | success |
| CloudFront URL | Home page rendering | Renders normally |
| /contact | Contact form | Accessible |
| DynamoDB | Test submission result | Saved |
| CloudWatch Logs | ERROR logs | No repeated errors |

---

## 6. Weekly checklist

Check once a week after MVP launch.

| Target | Check | Expected state |
|---|---|---|
| Cost Explorer | Costs by service | Within expectations |
| CloudWatch Logs | ERROR logs | No repeated errors |
| Lambda Metrics | Errors / Duration | Errors are not increasing |
| API Gateway Metrics | 4xx / 5xx / Count | No abnormal increase |
| DynamoDB | ItemCount | No unexplained spike |
| S3 | Object count and size | No unnecessary files |
| GitHub Actions | Failed workflows | No unresolved failures |

---

## 7. Monthly checklist

Check at the end or beginning of each month.

| Target | Check | Expected state |
|---|---|---|
| Total AWS costs | Monthly budget compliance | Within budget |
| Free Tier usage | Trend toward exceeding limits | None |
| Unnecessary resources | EC2 / RDS / NAT Gateway / ALB | Not created |
| CloudWatch Logs | Retention period | 14–30 days |
| S3 | Storage size | No unexplained increase |
| Content | Article, glossary, and question updates | Update status recorded |

---

## 8. INC-001 Site does not load

### Severity

Critical

### Symptoms

- The site does not load at the CloudFront URL
- 403 Forbidden is displayed
- 404 Not Found is displayed
- A 5xx error is displayed
- CSS or JS does not load and the layout breaks

### Investigation order

1. Open the CloudFront URL.
2. Check the HTTP status returned.
   - 403
   - 404
   - 500
   - 502
   - 503
   - 504
3. Check the latest Deploy Frontend workflow in GitHub Actions.
4. Check these GitHub Actions steps:
   - Install dependencies
   - Lint
   - Type check
   - Build
   - Configure AWS credentials
   - S3 sync
   - CloudFront Invalidation
5. Verify that the S3 bucket contains `index.html`.
6. Verify that the S3 bucket contains static files under `_next/`.
7. Verify that the CloudFront distribution is `Enabled`.
8. Verify that the CloudFront origin points to the correct S3 bucket.
9. Verify that the CloudFront default root object is `index.html`.
10. Verify that the S3 bucket policy permits `s3:GetObject` from the CloudFront distribution.
11. Verify that S3 Block Public Access is enabled.
12. Review recent changes and consider `git revert` if necessary.

### Common causes and responses

| Cause | Response |
|---|---|
| No build output in S3 | Rerun GitHub Actions. |
| Missing `index.html` | Check the `npm run build` result. |
| Incorrect bucket policy | Check the CloudFront distribution ID and SourceArn. |
| Incorrect OAC configuration | Check CloudFront Origin Access Control. |
| CloudFront invalidation not run | Check invalidation history. |
| Publication proceeded despite a failed build | Check the GitHub Actions Build step. |
| CSS / JS returns 404 | Verify static files are included in the S3 sync source. |

### Recovery decision

| Situation | Recovery approach |
|---|---|
| Deployment failure | Fix and rerun GitHub Actions. |
| Caused by a recent code change | Roll back with `git revert`. |
| Missing S3 files | Redeploy. |
| Incorrect bucket policy | Fix the policy. |
| Incorrect CloudFront configuration | Fix Origin / OAC / Default root object. |

---

## 9. INC-002 Some pages return 404

### Severity

Medium

### Symptoms

- The home page loads
- `/terms` and `/questions` load
- Only detail pages such as `/terms/s3` return 404

### Investigation order

1. Check the affected URL.
2. Verify whether the same URL works locally.
3. Verify that `npm run build` succeeds.
4. Verify that Next.js static export generates the target page.
5. Check for its HTML under `out/`.
6. Check that the HTML was uploaded to S3.
7. Check that CloudFront invalidation ran.
8. For dynamic routes, check for `generateStaticParams`.

### Common causes and responses

| Cause | Response |
|---|---|
| Static export does not generate detail pages | Check `generateStaticParams`. |
| Target HTML missing from S3 | Redeploy. |
| Stale CloudFront cache | Check invalidation. |
| Slug mismatch | Compare JSON / MDX slugs with the URL. |
| Filename mismatch | Check filenames under `contents/`. |

---

## 10. INC-003 Contact form submission fails

### Severity

High

### Symptoms

- `/contact` loads
- Submission produces an error
- A CORS error appears
- The response is 400 / 500
- Data is not saved to DynamoDB

### Investigation order

1. Open browser developer tools.
2. Check the HTTP status of `POST /contact` in the Network tab.
3. Check the Console tab for CORS errors.
4. Check the following API Gateway metrics:
   - Count
   - 4xx
   - 5xx
   - Latency
5. Check the following Lambda metrics:
   - Invocations
   - Errors
   - Duration
   - Throttles
6. Find ERROR logs for the request in CloudWatch Logs.
7. Verify whether an item was saved to DynamoDB `ContactsTableProd`.
8. Check Lambda environment variables:
   - `CONTACTS_TABLE_NAME`
   - `ALLOWED_ORIGINS`
   - `LOG_LEVEL`
   - `ENV`
9. Verify the Lambda execution role has `dynamodb:PutItem`.
10. Check API Gateway CORS settings.
11. Check frontend `NEXT_PUBLIC_API_BASE_URL`.

### Interpreting HTTP status codes

| Status | Common causes | Where to check |
|---|---|---|
| 400 | Invalid input or malformed JSON | Lambda Logs |
| 403 | CORS, permissions, or origin mismatch | API Gateway / Lambda response headers |
| 404 | Incorrect API URL | Frontend environment variables |
| 500 | Lambda exception or DynamoDB error | CloudWatch Logs |
| 502 | Invalid Lambda response format | CloudWatch Logs |
| 504 | Lambda timeout | Lambda Metrics |

### Common causes and responses

| Cause | Response |
|---|---|
| Incorrect CORS configuration | Check `ALLOWED_ORIGINS` and API Gateway CORS. |
| Incorrect API Gateway URL | Check `NEXT_PUBLIC_API_BASE_URL`. |
| Incorrect Lambda environment variable | Check `CONTACTS_TABLE_NAME`. |
| Insufficient IAM permissions | Check the Lambda role's `dynamodb:PutItem`. |
| DynamoDB table-name mismatch | Align the environment variable with the actual table name. |
| Validation error | Check input and response details. |
| Honeypot contains a value | Check the frontend hidden field. |

---

## 11. INC-004 Lambda errors

### Severity

High

### Symptoms

- Errors increase in Lambda Metrics
- API Gateway returns 5xx
- ERROR entries appear in CloudWatch Logs

### Investigation order

1. Open the Lambda console.
2. Select `contact-submit-prod`.
3. Check Errors and Duration in the Monitor tab.
4. Open CloudWatch Logs.
5. Inspect recent ERROR logs.
6. Trace the request by requestId.
7. Classify it as a DynamoDB PutItem error, JSON parsing error, or unexpected exception.
8. Check Lambda environment variables.
9. Verify the Lambda timeout is set to 3–5 seconds.
10. Review recent Lambda code changes.

### Logs to inspect

| Log | Meaning |
|---|---|
| `INFO contact saved` | Saved successfully |
| `WARN validation error` | Invalid input |
| `WARN honeypot detected` | Suspected spam |
| `ERROR dynamodb put_item failed` | DynamoDB persistence failed |
| `ERROR unexpected error` | Unexpected error |

### Information that must not be logged

- Complete email addresses
- Complete contact messages
- Authorization headers
- JWT
- AWS access keys
- API keys

---

## 12. INC-005 DynamoDB persistence fails

### Severity

High

### Symptoms

- Lambda is invoked
- The API returns 500
- No item is saved to DynamoDB

### Investigation order

1. Find `dynamodb put_item failed` in CloudWatch Logs.
2. Check the Lambda environment variable `CONTACTS_TABLE_NAME`.
3. Verify DynamoDB `ContactsTableProd` exists.
4. Verify the DynamoDB table is in `ap-northeast-1`.
5. Check Lambda execution-role permissions.
6. Verify the IAM policy includes:
   - Action: `dynamodb:PutItem`
   - Resource: `arn:aws:dynamodb:ap-northeast-1:<account-id>:table/ContactsTableProd`
7. Check ThrottledRequests in DynamoDB Metrics.
8. Check for a large volume of spam submissions.

### Common causes and responses

| Cause | Response |
|---|---|
| Incorrect table name | Fix the Lambda environment variable. |
| Region mismatch | Check Lambda and DynamoDB regions. |
| Insufficient IAM permissions | Grant `dynamodb:PutItem`. |
| Table not created | Create `ContactsTableProd`. |
| Throttling | Investigate the write spike. |

---

## 13. INC-006 Deployment failure

### Severity

Medium

### Symptoms

- GitHub Actions reports failure
- S3 sync fails
- CloudFront invalidation fails
- OIDC authentication fails

### Investigation order

1. Open the failed GitHub Actions workflow.
2. Identify the failed step.
3. Read the full error message.
4. Run the same command locally.
5. For dependency errors, check `package-lock.json` and `package.json`.
6. For lint errors, fix the affected files.
7. For TypeScript errors, fix type definitions.
8. For build errors, inspect the Next.js error location.
9. For AWS authentication errors, check the OIDC trust policy.
10. For S3 errors, check the bucket name and IAM policy.
11. For CloudFront errors, check the distribution ID and IAM policy.

### Checks by failed step

| Failed step | Check |
|---|---|
| Install dependencies | lock file、Node.js version |
| Lint | ESLint error locations |
| Type check | TypeScript type errors |
| Build | Next.js build errors |
| Configure AWS credentials | OIDC Provider、Trust Policy、Role ARN |
| S3 sync | Bucket name and S3 permissions |
| CloudFront Invalidation | Distribution ID and CloudFront permissions |

### Notes on the master branch

This repository uses `master` as its production branch.

Use `master`, not `main`, in GitHub Actions triggers, the OIDC trust policy, and branch protection rules.

---

## 14. INC-007 AWS cost spike

### Severity

Critical

### Symptoms

- An AWS Budgets notification arrives
- Current-month costs increase in Billing Dashboard
- Unexpected services appear in Cost Explorer

### Investigation order

1. Read the Budgets notification email.
2. Open Billing Dashboard.
3. Review costs by Service in Cost Explorer.
4. Review costs by Region in Cost Explorer.
5. Check for unexpected services.
6. Check CloudWatch Logs storage volume.
7. Check CloudFront data transfer.
8. Check API Gateway request count.
9. Check DynamoDB write count.
10. Check CloudTrail for suspicious operations.
11. If access-key exposure is suspected, disable the affected key.
12. Record the cause in the monthly notes.

### Services to investigate immediately

Investigate any MVP costs for the following services.

- EC2
- RDS
- NAT Gateway
- ALB
- OpenSearch
- SageMaker
- WAF
- CloudWatch Logs
- CloudFront
- API Gateway
- DynamoDB

### Common causes and responses

| Cause | Response |
|---|---|
| A NAT Gateway was created | Delete it if unnecessary. |
| An EC2 instance was left running | Stop or delete it if unnecessary. |
| RDS was created | Consider deletion because the MVP does not use it. |
| CloudWatch Logs volume increased | Check retention and log output volume. |
| CloudFront data transfer increased | Check bots, image sizes, and traffic spikes. |
| API Gateway Count spiked | Check for spam submissions. |
| DynamoDB writes spiked | Check for spam submissions. |

---

## 15. INC-008 Suspected access-key exposure

### Severity

Critical

### Symptoms

- An access key may have been pushed to GitHub
- AWS reports suspicious operations
- Cost Explorer shows unexpected service usage
- CloudTrail shows unfamiliar operations

### Response order

1. Disable the affected IAM access key immediately.
2. Check GitHub Secrets.
3. Check the GitHub repository for `.env` files or credentials.
4. Check CloudTrail for suspicious operations.
5. Check Cost Explorer for unexpected services.
6. Check for unnecessary resources.
7. If a new access key is needed, reissue it with least privilege.
8. Prefer OIDC for GitHub Actions.
9. Check `.gitignore` to prevent recurrence.
10. Check README and docs for secrets.

### Items to check

- `.env`
- `.env.local`
- `.env.production`
- AWS access key
- AWS secret access key
- GitHub token
- JWT secret
- API key
- private key
- `.pem`
- `.key`

---

## 16. INC-009 Spam submission spike

### Severity

High

### Symptoms

- DynamoDB ItemCount spikes
- API Gateway Count spikes
- Lambda Invocations spike
- Honeypot detection logs increase
- Large numbers of similar contact submissions are saved

### Investigation order

1. Check Count in API Gateway Metrics.
2. Check Invocations in Lambda Metrics.
3. Check ItemCount in DynamoDB Metrics.
4. Find `honeypot detected` in CloudWatch Logs.
5. Review patterns in saved submissions.
6. Distinguish test data from spam.
7. Delete unnecessary spam data.
8. Consider API Gateway rate limiting.
9. Consider introducing reCAPTCHA.
10. If spam continues, consider WAF.

### MVP controls

- honeypot
- Input-length limits
- Lambda-side validation
- CORS restrictions
- CloudWatch Logs checks
- AWS Budgets checks

### Controls to consider after the MVP

- API Gateway throttling
- reCAPTCHA
- WAF
- IP restrictions
- CloudWatch Alarm

---

## 17. Site rendering runbook

### When to run

- After deployment
- During weekly checks
- Before submitting the portfolio
- When site rendering is faulty

### Verification order

1. Open the CloudFront URL.
2. Check the home page.
3. Check `/terms`.
4. Check `/questions`.
5. Check `/architectures`.
6. Check `/blog`.
7. Check `/contact`.
8. Verify CSS is applied.
9. Verify images render.
10. Check the 404 page.
11. If there is a problem, check GitHub Actions, CloudFront, and S3.

---

## 18. Contact API verification runbook

### When to run

- After API changes
- After frontend changes
- After deployment
- During weekly checks
- When contact submissions fail

### Verification order

1. Open `/contact` through the CloudFront URL.
2. Submit a test inquiry.
3. Verify the submission-complete message.
4. Check DynamoDB `ContactsTableProd`.
5. Find `contact saved` in CloudWatch Logs.
6. Verify 5xx responses have not increased in API Gateway Metrics.
7. Verify Errors have not increased in Lambda Metrics.
8. Delete test data or set its `status` to `test`.

### Example test input

| Field | Value |
|---|---|
| name | Test User |
| email | test@example.com |
| subject | Operation check |
| message | This is a test contact from operation runbook. |
| sourcePage | /contact |
| honeypot | Empty string |

---

## 19. Cost verification runbook

### When to run

- Daily
- When a Budgets notification arrives
- During monthly checks
- After creating AWS resources

### Verification order

1. Open Billing Dashboard.
2. Check current-month costs.
3. Open Cost Explorer.
4. Review costs by Service.
5. Review costs by Region.
6. Check for unexpected services.
7. Delete unnecessary resources.
8. Record the results in monthly notes.

### Services with expected MVP costs

- S3
- CloudFront
- API Gateway
- Lambda
- DynamoDB
- CloudWatch Logs
- AWS Budgets

### Services whose MVP costs require investigation

- EC2
- RDS
- NAT Gateway
- ALB
- OpenSearch
- SageMaker
- WAF
- ECS
- EKS

---

## 20. GitHub Actions verification runbook

### When to run

- After pushing
- After creating a pull request
- When deployment fails
- When site rendering is faulty

### Verification order

1. Open the GitHub repository.
2. Open the Actions tab.
3. Check the latest workflow.
4. Verify `CI` succeeded.
5. Verify `Deploy Frontend` succeeded.
6. If it failed, open the failed step.
7. Read the full error message.
8. Run the same command locally.
9. For AWS authentication errors, check the OIDC trust policy.
10. For S3 / CloudFront errors, check the IAM policy and GitHub Variables.

---

## 21. Rollback policy

### Policy

The MVP does not use complex blue/green deployments.

If a problematic change reaches production, use Git to restore the previous stable version.

### Verification order

1. Review recent merge commits.
2. Identify the commit causing the problem.
3. Undo it with `git revert`.
4. Apply the fix commit to `master`.
5. Verify GitHub Actions Deploy Frontend succeeds.
6. Verify recovery at the CloudFront URL.

### Caution

Do not use `git reset --hard` or `git push --force`.

---

## 22. Record format

When an incident or anomaly is found, record it using the following format.

```text
Date:
Incident ID:
Severity:
Summary:
Detected by:
Affected area:
Confirmed metrics:
Root cause:
Action taken:
Result:
Follow-up:
