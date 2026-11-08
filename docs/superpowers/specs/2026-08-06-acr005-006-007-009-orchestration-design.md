# ACR-005 / ACR-006 / ACR-007 / ACR-009 Parallel Implementation Workflow Design

## Background

Complete the four currently open ACR tickets that can be resolved entirely in code: #314 ACR-005 / #315 ACR-006 / #316 ACR-007 / #319 ACR-009. Fumi requested a workflow that determines whether simultaneous implementation would cause conflicts and completes all four tickets using the most efficient conflict-free approach. Investigation of the actual code identified potential conflicts, the mitigation approach, and execution-environment constraints. This document records those findings as the design.

## Tickets and code investigation findings

| Ticket | Issue | Target files | Notes |
|---|---|---|---|
| ACR-005 | #314 | `.github/workflows/ci.yml` | CI has no test step. The referenced unmerged branch `chore/aws-cert-vitest-and-invariant-tests` is obsolete, differing from current master in 342 files, and cannot be reused. Discard it. |
| ACR-006 | #315 | `frontend/src/components/questions/QuestionListClient.tsx` (around line 122) | Fix wrapping of the Japanese “問題を見る→” (“View question →”) link using layout CSS only. The hard-coded Japanese text without locale support warned about in the Issue was already resolved in #317 (ACR-008), as confirmed by the existing `labels = getDictionary(locale).questions`. Only a layout fix remains. |
| ACR-007 | #316 | Same file (new pagination) | Shares the file with ACR-006. Its Issue explicitly requires sequential execution: #315, then this Issue. |
| ACR-009 | #319 | `frontend/src/components/layout/Footer.tsx` | Currently a Server Component without props. `Header.tsx` detects locale itself using `usePathname()` + `getLocaleFromPathname()`, and no page passes locale to `SiteLayout.tsx`. Using the same self-detection pattern in Footer avoids changes to other files. |

## Conflict analysis

- ACR-006 and ACR-007 edit the same file, `QuestionListClient.tsx`, so they cannot truly run in parallel. **Process them sequentially.**
- ACR-005 (CI YAML), ACR-009 (Footer.tsx), and the ACR-006 → 007 sequence edit entirely independent files. These three tracks can run in parallel without file conflicts.

## Execution-environment constraints

The primary working directory for this session, `/Volumes/DevShare/projects/aws-cert-roadmap-lab`, is an SMB share. Previous `npm test` / `build` runs failed with `EACCES` because of the pnpm symbolic-link structure in `frontend/node_modules` (historical reference: `smb-build-workaround`). Even without file conflicts, multiple agents editing and building the same SMB working tree could contend over `git add` or build output (`.next` / `out/`).

Therefore, **create a fresh clone on local disk and a separate Git worktree for each track.** Do not edit code in the SMB primary working directory. After all tickets are merged, only fast-forward it to `origin/master`.

## Selected design: Three parallel tracks, with sequential work within a track

```text
Track 1 (independent): ACR-005
  Add a test step to CI YAML → push → deliberately fail CI to verify it on the real runner → fix it
  → create PR → merge → close #314

Track 2 (independent): ACR-009
  Rewrite Footer.tsx to use the same locale self-detection pattern as Header.tsx
  → create PR → merge → close #319

Track 3 (sequential internally): ACR-006 → ACR-007
  ACR-006: Fix QuestionListClient.tsx layout (1–2 lines)
    → create PR → merge → close #315
  → rebase onto master in the same worktree
  → ACR-007: Implement pagination
    → create PR → merge → close #316
```

Run the three tracks in parallel, with Track 3 sequential internally. Start all branches from `master`. The Issues' “base branch: dev” text is outdated: investigation confirmed that `dev` has been fully incorporated into `master`, which is now the latest and only integration branch.

### Branch / PR policy

- Follow the existing one-Issue-per-PR convention. ACR-006 and ACR-007 share a file, but remain separate because 006 is small and the Issues have different numbers.
- Branch names: `fix/acr-005-ci-test-step` / `fix/acr-009-footer-i18n` / `fix/acr-006-question-card-stacked-layout` / `feat/acr-007-question-list-pagination`
- The historical workflow for each ticket is implementation → push → create PR with Issue-closing reference → squash merge → delete remote branch, without separate confirmation at each step, following the existing `/pr-merge` flow. This describes the original plan, not authorization to execute those actions during a later documentation-only task.

### Decisions requiring judgment

- **ACR-006**: Left-align the link when it moves below the body, matching the rest of the card.
- **ACR-009**: Preserve the site name “AWS資格ロードマップラボ” and tagline in their original language as branding. Localize only footer section headings.
- **ACR-005**: Discard the unmerged branch `chore/aws-cert-vitest-and-invariant-tests`; investigation confirmed it contains no reusable changes.

## Completion criteria

Follow the acceptance criteria in GitHub Issues #314 / #315 / #316 / #319 exactly. This document does not change them. The work is complete when all four tickets satisfy their Issue acceptance criteria, their PRs are merged, and their Issues are closed.

As the final step, fast-forward the SMB primary working directory to `origin/master` and update outdated statements in the historical `working-clone-location` / `smb-build-workaround` records, such as the SMB copy being stale or `rebalance-question-answers.mjs` being lost, which were already resolved or disproved during that session.

## Out of scope

- The mechanical inventory of other components not using `getDictionary`, suggested in ACR-009, is outside this design and is a candidate for a separate ticket.
- Handling the uncommitted isolated SMB files discovered at the beginning of that session, such as `infra/cloudfront/url-rewrite.js` related to #304, is outside this design.
