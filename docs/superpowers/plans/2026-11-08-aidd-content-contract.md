# AIDD content contract preparation

> Execution: implement inline, then independent whole-change review. User explicitly requested implementation without another design approval gate.

## Goal and scope

Extend the existing cooperative AIDD harness for manually triggered multilingual content tasks. Keep the accepted standalone pilot and ZIP sealed. Do not add scheduling, publishing, roles, deployment or dependencies.

Base: `9881f79853516d6fe1f2736b5b9b06500552c860`, freshly fetched from origin/master on FUMI. No tracked AGENTS.md or .agents skills exist at this base; preserve the original checkout and its .serena directory.

## Implementation

1. Add an optional, explicit content contract to the existing init path, retaining legacy engineering contracts. Bind a full Git baseline SHA, allowed operations, declared deliverables and source revisions. Capture baseline question IDs from Git rather than a supplied count. Freeze this input with the bundle and replay engine.
2. During verification, check declared article files in all three locales and question IDs, choices, answer keys, explanation completeness and exact baseline-plus-added-ID sets. Baseline verification expects the baseline set; candidate verification expects the declared additions. Snapshot/hash evidence invalidates after source drift. Translation revision declarations are necessary metadata, not proof of semantic correctness.
3. Replace the frontend parity test's hardcoded 50-count assumption with preserved historical ID coverage plus duplicate/set invariants. Keep existing metadata, explanation-marker and answer-distribution tests. Add mutation fixtures for missing/duplicate/reused/undeclared IDs, wrong choice/answer, stale revisions, unsafe paths, baseline mismatch and replay.
4. Document the contract, manual workflow and limitations. Run dependency-free fixtures first, then available required frontend checks without installing packages. Independent review precedes local commit and any authorized safe Draft PR.

## Review focus

- A new ID must be absent from the actual baseline; replacing or deleting an old ID must fail.
- Locale order must not matter, but duplicate IDs and malformed choice IDs must fail.
- Missing translations, mismatched declared source revisions and source drift must not look verified.
- Frozen baseline and verifier data must survive replay without trusting mutable working-tree declarations.
- A mechanical pass must leave translation meaning, technical accuracy, unique answers, visuals and difficulty pending human/independent review.

## Task accounting

Task ID: `aidd-content-contract-prep-2026-11-08`. Separate from the sealed content pilot. Shared repair ceiling: three; no reset by agent/worktree/locale. Record actual correction batches in ignored local evidence. Initial feature implementation and expected red fixtures are not repair batches; failures requiring corrective changes are.

## Environment rulings

- Existing profile requires npm ci; installation is not authorized for this task. Do not weaken that profile. Report unavailable full-profile checks separately and request authorization only if needed.
- Worktree creation succeeded; current-turn sandbox access needs explicit command approval. Preserve all original checkout state.
- Push/Draft PR authorized only after verification of deployment safety; Draft does not suppress previews. Never merge or deploy.
- Ruling: existing Blog/Architecture fixed totals remain fail-closed; this bounded task changes the question-growth gate only. Article declarations are not full site integration. Cost: a later article batch needs a separately reviewed registry/test change before full-profile acceptance.
