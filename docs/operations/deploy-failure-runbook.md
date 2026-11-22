## 1. Purpose

This runbook describes how to isolate causes and recover when automatic frontend deployment for AWS Cert Roadmap Lab fails.

It covers the GitHub Actions `Deploy Frontend` workflow.

This project uploads Next.js static build output to Amazon S3 and publishes it through Amazon CloudFront.

The deployment flow is:

```text
GitHub master branch
  ↓
GitHub Actions
  ↓
npm ci
  ↓
npm run lint
  ↓
npm run typecheck
  ↓
npm run build
  ↓
AWS OIDC authentication
  ↓
aws s3 sync ./out s3://<S3_BUCKET_NAME> --delete
  ↓
aws cloudfront create-invalidation
  ↓
Verify publication at the CloudFront URL
```

## 2. Scope

## 2.1 Included

This runbook covers:


| Target | Details |
| ---------------- | ---------------------------------------------------------------- |
| GitHub Actions   | Deploy Frontend workflow                                         |
| Next.js build    | `npm run build`                                                  |
| S3 deploy        | `aws s3 sync ./out s3://... --delete`                            |
| CloudFront | `create-invalidation` and production rendering |
| IAM / OIDC | Temporary authentication from GitHub Actions to AWS |
| GitHub Secrets   | `AWS_ROLE_ARN`, `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID`   |
| GitHub Variables | `AWS_REGION`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL` |


## 2.2 Excluded

This runbook excludes:


| Excluded item | Reason |
| ------------------------- | ---------------------------- |
| Automatic Lambda deployment | The MVP covers automatic frontend deployment only. |
| API Gateway creation | Resources were created manually. |
| DynamoDB creation | Resources were created manually. |
| CloudFront distribution creation | Resources were created in P2. |
| S3 bucket creation | Resources were created in P2. |


## 3. Initial checks

Do not immediately change AWS settings when deployment fails.

First identify the failed step in GitHub Actions.

## 3.1 Where to look in GitHub Actions

1. Open the GitHub repository.
2. Open the Actions tab.
3. Open the failed `Deploy Frontend` workflow.
4. Open the job marked as failed in red.
5. Identify the failed step.
6. Read the full error message.

## 3.2 Investigation by failed step


| Failed step | Common causes | First checks |
| ------------------------- | ---------------------------- | -------------------------------------------------------------- |
| Checkout | Temporary GitHub outage or insufficient permissions | Rerun the workflow. |
| Setup Node.js | Node.js version or cache configuration | Check `node-version` and the lockfile. |
| Install dependencies | package-lock mismatch or dependency errors | Run `npm ci` locally. |
| Lint | ESLint errors | Run `npm run lint` locally. |
| Type check | TypeScript errors | Run `npm run typecheck` locally. |
| Build | Next.js build errors or missing environment variables | Run `npm run build` locally. |
| Configure AWS credentials | OIDC, trust policy, or role ARN errors | Check the IAM role and GitHub Secrets. |
| Deploy to S3 | Bucket name, IAM permissions, or missing out directory | Check `S3_BUCKET_NAME` and `s3:*` permissions. |
| Invalidate CloudFront | Distribution ID or IAM permissions | Check `CLOUDFRONT_DISTRIBUTION_ID` and `cloudfront:CreateInvalidation`. |


## 4. Reproducing locally

Do not diagnose solely from GitHub Actions logs.

Reproduce frontend errors by running the same commands locally.

## 4.1 Before starting

```bash
git status
git branch
```

Expected result:

```text
Understand the current working changes.
Identify the current branch.
```

## 4.2 Check dependencies in frontend

```bash
cd frontend
npm ci
```

Expected result:

```text
Dependencies install successfully.
```

If this fails:


| Cause | Action |
| -------------------- | --------------------------------------------- |
| package-lock.json mismatch | Compare changes to `package.json` and `package-lock.json`. |
| Node.js version mismatch | Align the local and GitHub Actions Node.js versions. |
| Dependency download failure | Retry; if it persists, inspect the full error message. |


## 4.3 Check lint

```bash
npm run lint
```

Expected result:

```text
Zero ESLint errors.
```

If this fails:

```bash
npm run lint -- --debug
```

Check:

- Unused imports
- Unused variables
- React Hooks dependency arrays
- ESLint configuration files
- Whether `.next` or `out` is included in lint targets

## 4.4 Check typecheck

```bash
npm run typecheck
```

Expected result:

```text
Zero TypeScript errors.
```

If this fails, check:

- Missing type-definition imports
- Handling of `null` and `undefined`
- The return value of `generateStaticParams()`
- Next.js App Router types
- Dynamic-route params types

## 4.5 Check build

```bash
npm run build
```

Expected result:

```text
The out/ directory is generated.
```

Verification commands:

```bash
ls -la out
ls -la out/index.html
```

Expected result:

```text
out/index.html exists.
```

If this fails, check:


| Cause | Action |
| -------------- | ------------------------------------------ |
| `out/` is not generated | Check `output: "export"` in `next.config.*`. |
| Dynamic-route failure | Check for `generateStaticParams()`. |
| Image optimization error | Check `images.unoptimized: true`. |
| Missing environment variables | Compare `.env.local` with GitHub Variables. |
| Invalid API URL | Check `NEXT_PUBLIC_API_BASE_URL`. |


## 5. AWS authentication errors

If `Configure AWS credentials` fails, check OIDC, the IAM role, its trust policy, and GitHub Secrets.

## 5.1 Common errors


| Error | Common cause |
| --------------------------------------------------------- | -------------------- |
| `Could not assume role with OIDC` | Trust policy mismatch |
| `Not authorized to perform sts:AssumeRoleWithWebIdentity` | OIDC condition mismatch |
| `No OpenIDConnect provider found` | IAM OIDC provider has not been created |
| `Request ARN is invalid` | Invalid `AWS_ROLE_ARN` |
| `Access denied` | Insufficient IAM policy permissions |


## 5.2 Check GitHub Secrets

Check the following in GitHub.

```text
Settings
  → Secrets and variables
  → Actions
```

Required secrets:


| Secret | Purpose |
| ---------------------------- | -------------------------------- |
| `AWS_ROLE_ARN` | IAM role ARN assumed by GitHub Actions |
| `S3_BUCKET_NAME` | Deployment target S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront invalidation target |


Note:

```text
AWS_SECRET_ACCESS_KEY is not needed with OIDC.
If it is registered, verify that the current workflow does not reference it.
```

## 5.3 Check GitHub Variables

Required variables:


| Variable | Purpose |
| -------------------------- | -------------------------- |
| `AWS_REGION` | Region used by AWS CLI |
| `NEXT_PUBLIC_API_BASE_URL` | API Gateway URL called by the frontend |
| `NEXT_PUBLIC_SITE_URL` | CloudFront or custom-domain URL |


Note:

```text
Values prefixed with NEXT_PUBLIC_ are exposed to the browser.
Do not put secrets in them.
```

## 5.4 Check the IAM role trust policy

Check using AWS CLI.

```bash
aws iam get-role \
  --role-name github-actions-deploy-role-prod \
  --query "Role.AssumeRolePolicyDocument" \
  --output json
```

Check the following:


| Item | Expected value |
| --------- | ------------------------------------------------------- |
| Federated | OIDC provider for `token.actions.githubusercontent.com` |
| aud       | `sts.amazonaws.com`                                     |
| sub       | `repo:<github-owner>/<repo-name>:ref:refs/heads/master` |


This project uses `master` as its production branch.

If the trust policy specifies `refs/heads/main`, change it to `master`.

Expected sub condition:

```json
"token.actions.githubusercontent.com:sub": "repo:<github-owner>/<repo-name>:ref:refs/heads/master"
```

## 5.5 Check workflow permissions

Verify that `deploy-frontend.yml` includes:

```yaml
permissions:
  id-token: write
  contents: read
```

Without `id-token: write`, AWS authentication through OIDC cannot work.

## 6. S3 sync failures

If `Deploy to S3` fails, check the S3 bucket name, IAM permissions, and build output.

## 6.1 Errors in GitHub Actions logs


| Error | Cause |
| --------------------------------------------- | ------------------------------- |
| `NoSuchBucket` | Incorrect `S3_BUCKET_NAME` |
| `AccessDenied` | Insufficient S3 permissions in the IAM policy |
| `The user-provided path ./out does not exist` | Build failed or working-directory is incorrect |
| `InvalidAccessKeyId` | Old access-key settings may remain instead of OIDC |
| `PermanentRedirect` | Bucket-region mismatch |


## 6.2 Check the S3 bucket name

Verify that GitHub Secrets `S3_BUCKET_NAME` matches the actual AWS bucket name.

```bash
aws s3 ls
```

Expected result:

```text
The target S3 bucket appears in the list.
```

## 6.3 Check the out directory

When GitHub Actions uses `frontend` as its working-directory, the S3 sync source is:

```text
frontend/out
```

Check locally.

```bash
cd frontend
npm run build
ls -la out
```

## 6.4 Check the IAM policy

Verify that the GitHub Actions role has at least the following permissions.

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:ListBucket"
  ],
  "Resource": "arn:aws:s3:::<bucket-name>"
}
```

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:DeleteObject"
  ],
  "Resource": "arn:aws:s3:::<bucket-name>/*"
}
```

Permissions that must not be granted:

```text
AdministratorAccess
s3:* on all resources
iam:*
```

## 6.5 Check S3 sync locally

Before syncing directly to production S3, inspect only the build output.

```bash
cd frontend
npm run build
ls -la out
```

Use AWS CLI to check connectivity only.

```bash
aws sts get-caller-identity
aws s3 ls s3://<bucket-name>
```

For a manual production S3 sync, inspect the changes before executing.

```bash
aws s3 sync ./out s3://<bucket-name> --delete --dryrun
```

Review the output. If it is acceptable, execute only when necessary.

```bash
aws s3 sync ./out s3://<bucket-name> --delete
```

## 7. CloudFront invalidation failures

If `Invalidate CloudFront` fails, check the distribution ID and IAM permissions.

## 7.1 Common errors


| Error | Cause |
| -------------------- | ------------------------------------ |
| `NoSuchDistribution` | Incorrect distribution ID |
| `AccessDenied` | Missing `cloudfront:CreateInvalidation` permission |
| `InvalidArgument` | Invalid invalidation path |
| `Throttling` | Too many invalidations in a short period |


## 7.2 Check the distribution ID

```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[].{Id:Id,DomainName:DomainName,Status:Status}" \
  --output table
```

Expected result:

```text
The target CloudFront distribution ID is displayed.
Status is Deployed.
```

## 7.3 Check the IAM policy

Verify that the GitHub Actions role includes:

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:CreateInvalidation"
  ],
  "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"
}
```

## 7.4 Check manual invalidation

Run only when necessary.

```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

Note:

```text
Do not frequently invalidate /*.
This is acceptable for the MVP's low deployment frequency. As article updates increase, consider invalidating only changed files.
```

## 8. Deployment succeeds but the page is stale

If GitHub Actions succeeds but CloudFront serves an old page, check caching and S3 updates.

## 8.1 Investigation order

1. Verify that GitHub Actions `Deploy to S3` succeeded.
2. Verify that GitHub Actions `Invalidate CloudFront` succeeded.
3. Check that S3 contains the latest `index.html`.
4. Check the CloudFront invalidation status.
5. Check without browser caching.

## 8.2 Check CloudFront

```bash
curl -I https://<cloudfront-domain>
```

Expected result:

```text
HTTP/2 200
```

## 8.3 Check index.html in S3

```bash
aws s3 ls s3://<bucket-name>/index.html
```

Expected result:

```text
index.html exists.
Its modification time is close to the latest deployment time.
```

## 8.4 Check invalidation

```bash
aws cloudfront list-invalidations \
  --distribution-id <distribution-id> \
  --output table
```

Expected result:

```text
The latest invalidation is Completed.
```

## 9. Production returns 403 / 404

If the entire site returns 403 or 404 at the CloudFront URL, check S3, OAC, the bucket policy, and the default root object.

## 9.1 For 403

Common causes:


| Cause | Action |
| ------------------------ | ------------------------------------- |
| Invalid S3 bucket policy | Check the CloudFront distribution ARN. |
| Incorrect OAC configuration | Check CloudFront Origin Access Control. |
| Changed S3 Block Public Access | Keep Block Public Access enabled and allow access through OAC. |
| Missing `index.html` | Check build and S3 sync. |


## 9.2 For 404

Common causes:


| Cause | Action |
| --------------------------------- | ------------------------------ |
| Missing `index.html` | Check `out/index.html` and its S3 upload. |
| Missing Next.js static export | Check `generateStaticParams()`. |
| CloudFront default root object not set | Verify it is set to `index.html`. |
| Insufficient SPA / static HTML error-page configuration | Check CloudFront Error Pages. |


## 10. Rollback procedure

If production rendering is affected, use Git revert to restore the previous state.

## 10.1 Identify the problematic commit

```bash
git log --oneline -10
```

## 10.2 Create a revert branch

```bash
git checkout master
git pull origin master
git checkout -b fix/revert-deploy-failure
```

## 10.3 Revert the problematic commit

```bash
git revert <commit-hash>
```

If there are conflicts:

```bash
git status
```

After fixing the affected files:

```bash
git add .
git revert --continue
```

## 10.4 Verify locally

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm run build
```

Expected result:

```text
lint / typecheck / build all succeed.
out/ is generated.
```

## 10.5 Create a PR

Include the following in the PR description.

```markdown
## Summary

Reverted the change that caused deployment to fail.

## Cause

- Affected commit:
- Failed step:
- Error summary:

## Changes

- Reverted the problematic commit
- Verified lint/typecheck/build locally

## Verification

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm run build
```

## Results

- GitHub Actions CI：
- Deploy Frontend：
- CloudFront rendering:

```

## 11. Do not log secrets

Do not display the following in GitHub Actions or local checks.

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
GitHub Token
API keys
JWT_SECRET
DATABASE_PASSWORD
```

Prohibited example:

```yaml
- run: echo ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

Prohibited example:

```bash
env
printenv
```

Reason:

```text
Secrets in GitHub Actions logs can lead to credential exposure.
```

## 12. Failure record template

When deployment fails, record it in `docs/operations/incident-log.md` using this format.

```markdown
## YYYY-MM-DD Deployment failure

### What happened

- Workflow：
- Failed step:
- Error summary:

### Impact

- Production site rendering:
- Contact form:
- CloudFront URL：

### Cause

-

### Response

-

### Prevention

-

### Lessons learned

-
```

## 13. Decision criteria

## 13.1 Cases requiring immediate recovery

Address the following immediately.


| Situation | Reason |
| -------------------- | -------------------------------- |
| CloudFront returns 403 for the entire site | The production site is unavailable. |
| CloudFront returns 404 for the entire site | The production site is unavailable. |
| Repeated deployment failures on master | Production updates are blocked. |
| AWS authentication error | OIDC / IAM configuration may be incorrect. |
| S3 sync deletes many files | `--delete` may remove production files. |


## 13.2 Cases to address the same day


| Situation | Reason |
| ---------------- | ------------------- |
| Layout problems on only some pages | The impact is limited. |
| Only invalidation fails | If S3 is updated, rerunning invalidation can restore service. |
| lint/typecheck fails | The workflow stopped before production publication. |
| build fails | The workflow stopped before production publication. |


## 14. Post-recovery checks

After recovery, check:

```bash
curl -I https://<cloudfront-domain>
```

Expected result:

```text
HTTP/2 200
```

Pages to inspect in a browser:


| URL | Check |
| ---------------- | -------------- |
| `/` | Home page renders |
| `/terms` | Glossary renders |
| `/questions` | Practice question page renders |
| `/architectures` | Architecture page renders |
| `/blog` | Blog list renders |
| `/contact` | Contact page renders |


GitHub Actions checks:


| Item | Expected result |
| --------------------- | ------- |
| Deploy Frontend       | success |
| Deploy to S3          | success |
| Invalidate CloudFront | success |


AWS checks:


| Item | Expected result |
| ------------- | -------------------------------- |
| S3 | `index.html` exists |
| CloudFront | Distribution Status is `Deployed` |
| Invalidation | Status is `Completed` |
| Cost Explorer | No unexpected service costs |


## 15. Completion criteria

This runbook is complete when it documents:

- The investigation order for deployment failures
- Causes and responses by failed step
- Commands for local reproduction
- OIDC / IAM / Secrets / Variables checks
- Checks for S3 sync failures
- Checks for CloudFront invalidation failures
- Rollback procedures
- Rules against logging secrets

