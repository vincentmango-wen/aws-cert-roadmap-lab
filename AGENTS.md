# AWS Cert Roadmap Lab — project rules

This file is both the Codex discovery entry point and the single canonical project rule document. The rules were consolidated on 2026-11-12 at the user's request and moved from `AGENT.md` into `AGENTS.md` with explicit user approval on 2026-11-16. Maintain substantive rules here rather than duplicating them. Communicate with the user in Taiwan Traditional Chinese. Creating or moving this file does not authorize resuming updates-center development.

## Workspace and scope

- Work in `C:\Users\vince\Desktop\project\aws-cert-roadmap-lab` on FUMI as requested. Confirm computer, path, branch, HEAD, index and uncommitted/untracked changes before work. Do not silently switch to a different checkout or update local master to match a remote.
- Preserve existing and concurrent work, including `.serena/`. Before destructive restoration, identify ownership, create a recoverable backup outside the affected paths, and verify recovery. Stop affected operations when ownership, baseline or backup safety is uncertain. Do not use `git clean` or `git reset --hard` to clear the workspace.
- Read the applicable project documents and skills. Historical designs describe their original scope; a past task's approval is not standing authorization for another task.
- The updates-center implementation is stopped. The 2026-11-12 restoration and rule consolidation do not authorize restarting it. Issue #348 remains a separate scope and must not be mixed into another feature without approval.

## Required feature workflow

Follow this order: **design → explicit user approval → implementation plan → implementation → testing → review**.

1. **Design:** use `superpowers:brainstorming`; inspect current behavior, requirements, alternatives, scope and acceptance criteria. Present the design before implementing.
2. **Explicit user approval:** wait for the user's clear approval of that design. Silence, a status inquiry or an agent's review is not approval. A material design change must return to this gate.
3. **Implementation plan:** after approval, use `superpowers:writing-plans` to record concrete steps, scope, validation and stopping conditions. Do not turn unresolved ideas into approved requirements.
4. **Implementation:** use the applicable execution skill (`superpowers:executing-plans`, or `superpowers:subagent-driven-development` when delegation is authorized and appropriate). Follow `superpowers:test-driven-development` during implementation: demonstrate the relevant failing test, implement the minimum change, then refactor with passing tests. Use `superpowers:systematic-debugging` for failures rather than speculative fixes.
5. **Testing:** perform overall acceptance and regression verification after implementation; this supplements, rather than replaces, TDD. Use `superpowers:verification-before-completion`. Report actual commands, results, skips and blockers; never substitute older successful results for the current candidate.
6. **Review:** use `superpowers:requesting-code-review` and, for feedback, `superpowers:receiving-code-review`. Review scope, technical correctness, tests, language consistency and applicable desktop/mobile rendering. Automated or agent review does not replace the user's acceptance.

Use other applicable Superpowers skills at the relevant stage, without bypassing the user's scope or approval gates. This workflow does not authorize merge, push or deployment by itself.

## Repair limits and evidence

- Each independently scoped and user-authorized PR or issue task has its own allowance of three repair attempts, including corrections to its baseline and validation harness. Before implementation, record its objective, acceptance criteria, related PRs/issues, predecessor tasks, and repair ledger. A PR and its associated issue represent one task, not two allowances. Multiple issues addressed as one cohesive change share one allowance.
- Task identity follows the underlying problem and acceptance criteria, not its label or container. Continuing, reopening, replacing, splitting, or moving the same unresolved work to another issue, PR, branch, run, bundle, worktree, or clone does not create a new allowance. Review corrections and regressions caused by that work remain attached to its original task. A genuinely independent objective may receive its own allowance even in the same conversation; record why it is independent. If ownership is unclear, diagnose first and obtain user clarification before corrective changes.
- A bug-fix task's first correction counts. An attempt starts when a set of corrective changes begins and includes its verification; interruption still consumes the attempt. A different correction approach starts the next attempt. Pure diagnosis, unchanged reruns, and expected failures in negative test fixtures do not consume attempts, but must be recorded.
- Before exceeding a task's three attempts, report the evidence, cause, proposed correction and risk, and obtain explicit authorization for a bounded additional attempt. Submission or review does not reset the count. One-time exceptions do not authorize further attempts.
- Apply this policy prospectively from its explicit approval. Preserve all existing counts, exceptions and evidence; do not retroactively split or renumber recorded attempts. Any transition for an active task requires an explicit user decision recorded alongside its existing history.
- Baseline failures pause feature implementation. Repair only within the approved scope and remaining allowance. Changes to acceptance requirements, required assertions, verifier, profile, helper, configuration or lockfile need review and the applicable baseline procedure; do not weaken checks, remove required tests or add skips merely to pass.
- Keep task contracts, original outputs, source manifests, repair history and verification evidence. Evidence bundles stay local and are not published automatically. Do not collect or expose credentials, tokens or complete environment dumps.
- An interrupted operation or unconfirmed process stop must be reconciled before retrying. Do not delete active markers or evidence to claim success. Report capability gaps honestly.
- AIDD is a cooperative validation/evidence workflow, not a security sandbox, Supervisor or automatic deployment platform. On 2026-11-12, the user-authorized fast-forward synchronized this local checkout to commit 6c66041341b92310a48a784598ea8fc4be38a62b, which includes the AIDD source and CLI. Source availability does not establish that dependencies have been installed or that the toolchain has been executed or verified in this checkout; none of those actions was performed as part of that synchronization. Introducing or updating tooling is separate work.

## Human review, Git and deployment

- Local verification, remote CI, readiness for review, human acceptance, merge authorization and deployment authorization are separate states. Human acceptance remains pending until the user actually accepts.
- Commit, push and PR creation must be within the current task's authorization. Once ready to submit, open new PRs as Ready for review, not Draft. Before any authorized push/PR, inspect remote, head/base, workflows, branch protection and external integrations. Opening a PR can trigger GitHub Actions and Preview deployments; it does not authorize a merge or production deployment.
- Do not push to master or another branch that would deploy before the required review. If deployment side effects cannot be established as authorized, stop before the action and report them.
- PR approval alone is not a merge or deployment instruction. Do not enable auto-merge. Merge and production deployment require explicit applicable user authorization; a past task's conditional authorization must not be reused.
- `master` is the production branch. The current AWS frontend workflow can deploy on matching master changes or manual dispatch. Deployment commands in the README are documentation, not permission to execute them.
- Branch/worktree strategy, dev/update separation, CI reductions, Supervisor/multi-agent platform expansion and new recurring schedules must not be represented as settled decisions without supporting approval. The historical AIDD isolated-checkout recommendation does not override the user's current instruction to use the desktop checkout; resolve isolation needs before changing workspaces.

## Content and documentation

- Maintain developer documentation, code comments and Issue/PR descriptions in English. Keep the main README in English with matching Japanese and Taiwan Traditional Chinese versions. Website content remains Japanese, English and Traditional Chinese, with Taiwan Traditional Chinese as the primary content priority. Preserve existing locale URLs; primary content priority does not authorize rerouting them.
- The long-term goal covers all AWS certifications; do not claim current content already does. Historical MVP scope and future proposals remain distinguishable from delivered features.
- Verify technical claims against primary AWS sources and record relevant applicability and time-sensitive conditions. Keep translations semantically consistent. Use original practice questions, not leaked exam material; check uniqueness, one correct answer and explanations. Do not lower language or verification standards to meet quantity targets.
- Public text should describe reader-relevant facts. Keep internal translation revisions, development discussion and routine workflow status in internal review records.
- For substantive corrections to published learning content, state what changed, the affected claim/scope, supporting primary sources and the actual recorded correction date. Maintain equivalent notes in all three languages; append newer dated entries while preserving older entries. Do not invent or backdate history. Unknown historical dates must be identified as unknown; a routine source-check date is not a correction date. Typography-only changes do not require a correction note.
- Weekly delivery quantities, schedules, budgets and publishing permissions require the relevant approved plan; one approved week is not a permanent publishing mandate.

## Validation and source of these rules

Use the checks appropriate to the approved change. Current frontend scripts include `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check:html-lang` and `npm run check:locale-seal`; inspect their current definitions before use. Do not alter deployment settings or install a different validation platform as a side effect of a documentation/restoration task.

The consolidation preserves these sources, with the latest explicit user instruction taking precedence:

- The 2026-11-19 owner decision: open new PRs as Ready for review instead of Draft without changing merge or production deployment approval requirements.
- The user's 2026-11-16 approval of the repair-allowance amendment: independently scoped and authorized PR/issue tasks each receive three attempts prospectively; a PR and its associated issue share one allowance. Existing task histories and one-time exceptions are retained. The comparison-link/Blog task keeps its original 3/3 plus explicitly authorized exceptions 4 and 5, with no additional allowance from this amendment.
- The user's 2026-11-12 restoration/rules request: desktop workspace, safe restoration, required feature stages, renewed approval for material design changes, no resumed updates-center development.
- `README.md`, `README.zh-TW.md`, `docs/README.md`, localization policy and `.github/workflows/deploy-frontend.yml` at local baseline `5fae04f28f3878043c67cff591c295491760b059`.
- Existing AIDD rules read from locally available commit `6c66041341b92310a48a784598ea8fc4be38a62b`: `docs/aidd/README.md` and `docs/aidd/weekly-2026-11-09-review.md`, including the user's PR correction-cycle clarification. These were read with `git show`; this does not update or adopt that commit as the local baseline.
- The existing reader-facing correction policy in `frontend/docs/p5-032-aws-terminology-rules.md` at that same locally available commit, and the recorded content-review decisions.

No root `AGENT.md` or `AGENTS.md` existed in this checkout when this consolidation began. Existing project documents have been preserved. Future unresolved or conflicting rules must be called out for clarification, not silently promoted to policy.

Migration note (2026-11-16): Historical references to `AGENT.md` describe the policy location at that time; use this `AGENTS.md` for current work. The original document remains recoverable from commit `be5b339e236e19da0ea0c06d9bf724cd05b1172b`. This migration does not change task ownership, repair counts, exceptions or release authorization.

File-specific language exception approved on 2026-11-16: `docs/aidd/README.md` uses Traditional Chinese explanatory prose, retaining necessary technical terms and commands. This explicit user requirement overrides the general English developer-document preference for that file only.
