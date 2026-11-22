# Lambda timeout content correction implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Check off the verified steps as completed.

**Goal:** Correct three explanations and two glossary entries in all three locales without depending on PR #373.

**Architecture:** Edit existing localized content records, not their renderers or schemas. Use an isolated branch from verified remote master and check integration without changing either remote branch.

**Tech Stack:** Git, existing JSON content, Node.js, Vitest, Next.js static export, GitHub, Vercel Preview.

**Spec:** `docs/superpowers/specs/2026-11-21-lambda-timeout-design.md`

## Constraints and review focus

Only the nine `frontend/contents/questions/{clf-c02,saa-c03}.{zh,ja,en}.json` and `frontend/contents/terms/terms.{zh,ja,en}.json` files, plus the design and plan, belong in the PR. Distinguish general maximum from defaults and integration deadlines, diagnose incorrect distractor reasoning while preserving answer keys, avoid rewriting unrelated 15-minute quotas, preserve metadata and sources, and check the three locales for equivalent meaning. No FUMI, #373, infrastructure, settings, merges, or production changes.

## Task: Verify, edit, test, review, publish for review

- [x] Record live master and #373 exact refs, initial paths/no overlap, repo directions and workflow side effects in isolated cloud; record initial repair ledger 0/3.
- [x] Run scoped checks on clean baseline. Snapshot question and glossary identities and non-target records. Prove a targeted validation fails for stale time-limit text and checks A/D/A with unchanged stems and choices.
- [x] Change CLF-019 and CLF-035 practical notes, SAA-043 option B explanation, and the Lambda/Fargate practical notes in zh/ja/en. Add official service announcement links through the existing reference fields and record the actual correction date consistent with site content policy. Preserve all unrelated content and dates.
- [x] Rerun scoped checks and inspect semantic diff and contract preservation. Run frontend `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check:html-lang`, and `npm run check:locale-seal`. Inspect generated paths and source links for all 15 targets. Record output, skips, and limitations.
- [ ] Independently review sources and wording in the three locales, exact allowed changes, and non-regressions. Recheck remote refs and both merge orders in isolation; if overlap or a material scope change appears, stop and report rather than rewriting #373.
- [ ] Push one dedicated branch and open Ready for review against the verified base, with design, plan, and test evidence linked. Confirm exact head, GitHub checks, and nonproduction preview. Do not merge or deploy.
