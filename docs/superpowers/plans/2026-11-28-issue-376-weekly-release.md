# Issue #376 Weekly Release Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans (or approved subagent-driven development). Check off only observed work.

**Goal:** One approved Sunday 22:00 Asia/Taipei release of pending frontend changes, without changing S3 sync semantics.

**Architecture:** Update the existing deployment workflow in place so the existing workflow state is not silently replaced. Use a read-only scheduling and eligibility path, a credential-free build, and a gated production job. A unique GitHub tag claims the calendar window before any AWS operation; duplicate or ambiguous claims stop.

**Tech stack:** GitHub Actions, Node test runner, existing AWS CLI deployment.
**Spec:** [Issue #376](https://github.com/vincentmango-wen/aws-cert-roadmap-lab/issues/376), revised weekly-only scope. The owner moved the window to Sunday 22:00 Taipei on 2026-11-28.

## Scope and gates

- [ ] Pin current master. Add failing tests for wrong day, window edges, stale master, non-release PRs, failed or missing checks, no frontend changes, retry and duplicate tag claims.
- [ ] Implement and exercise the release gate and workflow wiring. Maintain explicit owner review, green candidate checks, a protected production environment and a separate activation flag. Do not change build inputs, object comparison, S3 settings or CloudFront in this change.
- [ ] Verify local tests and workflow configuration, review the branch diff and open the implementation PR without merging.
- [ ] Later, separately authorized: follow the cutover and rollback runbook, validate no-write behavior and observe the first eligible production release. No live action or credential changes in the implementation phase.

The retired incremental deployment prototype and PR #382 are predecessors, not dependencies. Preserve their historical repair ledger. The present change implements the owner's weekly-only replacement; publishing a new PR does not reset existing limits.
