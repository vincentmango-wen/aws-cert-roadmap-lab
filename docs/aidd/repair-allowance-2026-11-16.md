# Repair allowance policy approval — 2026-11-16

The user approved the prospective independent-task policy and its exact English wording on 2026-11-16 (Asia/Taipei). The subsequent interrupted handoff was reconciled before editing: no partial rule changes were present.

## Ownership and scope

- Each independently scoped, user-authorized PR or issue task receives three repair attempts. A PR and its associated issue share one allowance; multiple issues delivered as one cohesive change share one allowance.
- Identity follows the underlying problem and acceptance criteria. Renaming, splitting, replacing or reopening unresolved work does not reset attempts. Review corrections and regressions caused by that work retain its history.
- Preserve previous counts and exceptions. The comparison-link/Blog work retains its original 3/3 plus explicitly authorized exceptions 4 and 5; this amendment provides it no additional attempts.
- This independent documentation task is repair-allowance-policy-20261116. Its objective is consistent prospective guidance, separate from PR #351's Blog implementation. Its acceptance criteria are exact approved wording, consistent task ownership, preserved unrelated text/history and verified file scope.

## Version preservation

AGENT.md is the canonical policy and AGENTS.md its discovery entry point. Both previously existed only as locally ignored files. Their reviewed contents are now included explicitly so a fresh checkout can discover the same rules. The existing local .gitignore modification is not part of this change. No other local configuration, raw evidence, credentials, or working notes are included.

The AIDD README carries the approved five policy bullets; content-contract.md records task identity and predecessor requirements and links to that policy. CLI code, configuration, maxRepairs: 3 contracts and historical review records remain unchanged.

## Verification and boundaries

Read-back checks matched the canonical five bullets exactly to the approved proposal. Reverse-replacement checks confirmed unrelated text in the three edited policy documents was preserved. The local task ledger was append-only, and the original proposal, AGENTS.md and user .gitignore bytes were unchanged. Backups, hashes and raw verification evidence remain local.

This is documentation-only work; application lint, typecheck, tests and build are not applicable. Validate the staged file allowlist, policy consistency, local links and git diff --check before submission. Revert the documentation commit to roll back the versioned change; retain historical approval and evidence separately. Draft PR publication is authorized; merge, auto-merge and production deployment are not.
