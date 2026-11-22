# AIDD cooperative pilot implementation plan

> Execution: superpowers:executing-plans, inline in the existing chat.

**Goal:** One repository, one contract/profile, one verification entry point and replayable local evidence.
**Architecture:** A dependency-free Node CLI records task-wide repair attempts and runs the existing frontend checks. Snapshot and result integrity are cooperative drift detection, not a security boundary.
**Tech stack:** Node 22.13.0, npm 10.9.2, existing frontend tools; Node test runner for disposable fixtures.
**Spec:** Accepted conversation v0.2 including the final baseline correction; operational specification will live in docs/aidd/README.md.

## Constraints
- Preserve unrelated work; use codex/aidd-pilot in the managed isolated worktree.
- No product, dependency, workflow or release-flag changes.
- Three repairs shared across the task, including baseline and Harness defects; no fourth without authorization.
- Baseline failure within scope may consume a repair; unrelated failures block.
- No merge, deployment or auto-merge. Publishing requires verified destination and trigger safety.
- No approved 30-minute deadline; measure baseline and final checks.

## Tasks
- [x] Save unmodified frontend baseline: npm ci, lint, typecheck, Vitest JSON, build, HTML language check.
- [x] Write fixture tests before implementation: evidence/state integrity, source drift, protected changes, test identity/skip, shared repair limit, interrupted run and timeout.
- [x] Implement tools/aidd/cli.mjs and focused supporting module, profile and contract. Fixed command interface: init, verify, repair, status, replay. No acceptance or publishing command.
- [ ] Verify fixtures and real frontend through the fixed entry point; replay the bundle in a separate disposable checkout directory.
- [ ] Review changes, preserve evidence and report exact repair count; commit only task files. Publish only if remote/base/integrations are verified safe.

## Review focus
Untracked source must enter the manifest; generated files must not. Existing dirty files must survive. Unknown or absent test reports must block. Protected verification changes require review. Repair counters must survive runs and interrupts.

## Execution ledger
- Original checkout master at 5fae04f28f3878043c67cff591c295491760b059; pre-existing untracked .serena/ retained there.
- Managed worktree created; branch codex/aidd-pilot.
- Host PATH had Node 24.22.1 and no npm. Prepared portable official Node 22.13.0 with SHA256 verified against official SHASUMS256.txt, inside ignored tmp/aidd-bootstrap. This is initial environment setup, not a failed implementation repair.
- Autonomous repair attempts: 0/3.
- Baseline passed: lint, typecheck, 149 Vitest assertions (127 passed, 22 conditional pending), build, HTML lang. Raw evidence: tmp/aidd-bootstrap/.
- Repair 1/3 START: independent review found timeout latch bypass and missing post-manifest after report errors; self-review found new-bundle count reset and replay identity rebasing. Hypothesis: persistent repository task registration, stop guard, always-recorded after manifest and original replay identities close these paths. Expected: new regression fixtures fail before changes, then all fixtures pass. Also enforce exact npm and clean dependency install in the fixed profile. No fourth repair is authorized.
- Repair 1/3 verified: regression suite green; original replay identities also tested.
- Repair 2/3 START: reviewer found replay could fork repair allowance and status did not validate the baseline seal once a candidate existed. Hypothesis: verification-only replay bundles plus baseline seal validation prevent both false continuations. Expected: two focused regressions fail then complete fixture suite passes. Shared total remains 2/3.
- Repair 2/3 verified: 12 fixtures pass; reviewer confirmed both targeted fixes. No further source fix attempted.
- Fixed CLI baseline BASELINE_READY, run 1794121967256-48eb4b. All profile checks exit 0. Final candidate and replay are recorded in tmp/aidd-evidence rather than editing source after verification.
- Publication BLOCKED by unverified external deployments: coordinator found installed Vercel, Render and lovable.dev integrations; Vercel production and branch deployment history exists, trigger settings not fully visible. Per coordinator instruction, local commit only, no push/PR. Existing npm audit (21 vulnerabilities) and Turbopack trace warning are pre-existing and outside task scope.
- Repair 3/3 START: real replay copied 459 source files but its Git manifest omitted two tracked-but-ignored files (.DS_Store, frontend/AWSCLIV2.pkg). The affected replay process tree was identified and terminated; its interrupted evidence is retained, not accepted. Hypothesis: force-index exactly the sealed snapshot and compare its manifest before running checks. Expected: regression fails before fix, then all fixtures and real replay match. Frozen verifier change requires review and explicit baseline revision preserving all three repairs and previous evidence. No fourth repair is authorized.
- Repair 3/3 regression verified: all 13 fixtures pass. Independent reviewer confirmed the narrow fix. Rebaseline procedure preserves previous engine/manifests/task/seals and all repairs; new Vitest assertions must match the archived successful baseline. Final machine results are written to the evidence bundle after this source record is frozen. Publication remains blocked; no fourth repair is authorized.
