# November 9–15 content implementation plan

> Execution: inline implementation under the approved weekly scope, followed by independent technical, translation, blind-answer and visual review. Use executing-plans for implementation.

**Goal:** Preserve existing content while adding three complete trilingual articles and ten original translated SAA-C03 questions.

**Architecture:** Frozen historical article identity inventories plus explicit approved additions replace fixed-count assertions. Existing content loaders and registries remain the integration points. Mechanical checks and independent semantic/visual acceptance stay separate.

**Tech stack:** Next.js, TypeScript, MDX, Vitest; AIDD Node 22.13.0/npm 10.9.2.

**Spec:** User-approved 2026-11-09–15 scope transferred into this project chat; no merge or production deployment.

## Constraints and baseline

- Remote origin/master verified at 66e5f13 on 2026-11-09; original checkout remains at 5fae04f with its untracked .serena directory preserved.
- Isolated branch: codex/aws-week-20261109. No tracked AGENTS.md or checkout .agents/skills exists.
- Task identity aws-weekly-2026-11-09; original evidence tmp/weekly-evidence. Never reset repair accounting. Maximum three corrective attempts per issue under the approved scope; harness currently enforces a stricter task-wide three.
- Preserve sealed Downloads/aws-content-pilot-001-delivery.zip. Read-only inspection found recovery-plan Blog, DynamoDB restore-validation architecture and pilot-saa-recovery-01–10. These are not this week's additions.
- Issues #343/#297 and Blog pagination remain deferred.
- Human acceptance stays pending even when automated and independent reviews pass.

## Review focus

- Deleting an old article while adding another must fail, even if totals match.
- Missing a whole locale and duplicate identity with another slug must fail.
- At-least-once delivery must not imply exactly-once business effects.
- Cross-account approval must use an authorized principal in the workflow account; never expose callback tokens in links or logs.
- Pricing, Free Tier eligibility and support retirement must retain date, plan and regional qualifications.

## Task 1: Article contracts

Files: frontend/src/contents/blog/__tests__/blog-locale-parity.test.ts; frontend/src/contents/architectures/__tests__/architectures-locale-parity.test.ts; new shared article-contract helper, frozen inventory and mutation suite under frontend/src/contents/.

- [ ] Complete and preserve original full AIDD baseline before product changes.
- [ ] Capture historical IDs and slugs from 66e5f13, not mutable working inventories.
- [ ] Add failing deletion, missing-translation, duplicate-ID and undeclared-addition fixtures.
- [ ] Implement exact inventory validation; retain existing metadata/body/diagram checks and remove empty-locale bypass for required locales.
- [ ] Run targeted Vitest checks, then review/rebaseline protected tests without replacing original evidence or resetting repairs.

## Task 2: Existing-content maintenance

Files: affected MDX, terms and question entries under frontend/contents; evidence under docs/aidd/.

- [ ] Locate inaccurate CloudFront static IP, API Gateway cache, messaging ordering, Free Tier and Support/Trusted Advisor statements in all three locales.
- [ ] Record official sources and checked date before correction; distinguish REST/HTTP and Standard/FIFO.
- [ ] Correct the same claims across languages; keep maintenance outside new-article totals.
- [ ] List Support migration follow-up, including 2027-01-01 and GovCloud exception.

## Task 3: New articles

Files: three locale MDX files per new Blog/architecture/comparison, their existing registries, and three localized architecture SVGs under frontend/public/images/architectures/.

- [ ] Blog: Lambda/SQS retries, business idempotency keys, conditional writes, partial failure and redrive.
- [ ] Architecture: Standard human approval; success/rejection/timeout, safe callback broker, compensation and IAM boundaries.
- [ ] Comparison: Standard/Express duration, execution semantics, callback, history, billing dimensions and qualified selection examples.
- [ ] Add source revision, official links, applicability and 2026-11-09 fact-check date.
- [ ] Independently review technical accuracy, three-language meaning and desktop/mobile rendering.

## Task 4: Ten questions

Files: frontend/contents/questions/saa-c03.{zh,ja,en}.json and review evidence.

- [ ] Compare all existing and sealed pilot questions before assigning new IDs.
- [ ] Author ten logical scenarios in approved order, four choices with per-choice explanations; translate the same questions into ja/en.
- [ ] Validate metadata, answer distribution, semantic uniqueness and option-length/position hints.
- [ ] Give independent reviewers answer-free questions; record actual answers and rationale against exact artifact hashes before revealing answer keys.

## Task 5: Delivery

- [ ] Full candidate checks and independent review; report passed/failed/not-run separately.
- [ ] Verify GitHub PR state, branch/base and integrations before push. GitHub connector initially unavailable; do not infer no open PRs.
- [ ] Commit, push, draft PR; confirm remote SHA and CI for that SHA.
- [ ] Record risks, unresolved work and human acceptance pending. No merge, auto-merge or production deployment.

## Execution notes

- Native worktree creation completed; sandbox Git access failed with Permission denied. Approved escalated Git branch creation and AIDD initialization succeeded.
- Full baseline started with the unchanged profile. Outcome pending; no tests claimed passed.
- The initial engineering contract needs explicit review/rebaselining before article SVG paths and content deliverable declarations are frozen for authoring; retain the same task identity and repair count.
