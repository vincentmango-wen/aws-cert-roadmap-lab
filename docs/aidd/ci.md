# Lightweight AIDD CI

`AIDD CI` runs a single Ubuntu job with Node 22.13.0, matching the current frontend CI and pilot profile. It uses only Node built-ins and Git available on the runner. It does not install frontend dependencies or execute the full pilot profile.

## Scope and triggers

- PRs targeting `main`, `master`, or `dev`: run for `tools/aidd/**`, `docs/aidd/task.json`, or `.github/workflows/aidd-ci.yml` changes, including draft PR updates.
- Pushes: only `master`, with the same paths. Feature branch pushes do not run this job, avoiding a push/PR pair for the same feature update. A matching merge to master is intentionally checked again.
- `workflow_dispatch`: no inputs. Do not rely on a manual entry point before this new workflow reaches the default branch. The first authorized PR can exercise the PR trigger; manually dispatch only when separately authorized.
- Other documentation and product-only changes do not trigger this job. A docs-only PR with no matching path will have no AIDD run, not a passing AIDD result.
- Same-PR/ref older runs are canceled. A five-minute job timeout bounds runaway fixtures; this is not the AIDD task's overall time budget. No savings amount is guaranteed.

## What is checked

1. Node syntax of `cli.mjs` and `pilot.mjs`.
2. Parse the real pilot profile and contract, validate required field types, unique check IDs, positive timeouts, known report format, explicit human acceptance and the three-repair limit. Check the profile Node version against the executing Node.
3. Execute `node --test tools/aidd/pilot.test.mjs`, including disposable multilingual-contract, baseline-ID and replay fixtures. Its imported content validator is parsed and exercised by this same entry point.

The fixtures use their own temporary profiles/contracts, so JSON validation is a separate step. The JSON step never executes check commands. This is basic configuration validation, not a general schema engine or a substitute for the full profile. Keep the Node pin aligned when the frontend CI version changes; frontend CI-only edits do not trigger this workflow.

## Permissions and deployment

Only `contents: read`; checkout does not persist credentials. No secrets, command inputs, `pull_request_target`, deployment job, dependency installation or cache is used. Existing frontend CI and AWS deployment workflow are unchanged; these CI/docs changes do not match their current path filters. A future branch push may independently trigger Vercel Preview: this workflow does not prevent or authorize it.

## Validation status and task boundary

Local validation uses Node 22.13.0 on Windows in a fresh worktree with no `frontend/node_modules`. It checks the YAML structure/trigger cases, executes the embedded configuration check (including invalid disposable JSON cases), checks syntax, and runs fixtures. Local results are not Ubuntu/GitHub Actions results; runner provisioning, event delivery and cancellation still require an authorized remote run.

This task has a separate contract in `tasks/lightweight-ci.json` and local evidence in `tmp/aidd-ci-evidence/`; it does not reset or overwrite the original pilot's three repairs. No Harness or product behavior changes are included.

References: [GitHub workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch), [workflow syntax and concurrency](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax).
