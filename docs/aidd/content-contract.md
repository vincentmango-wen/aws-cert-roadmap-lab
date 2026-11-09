# Manual multilingual content tasks

This extends the existing cooperative AIDD entry point, not a scheduler or publishing system. The accepted `aws-content-pilot-001` artifacts remain sealed and are not imported. User acceptance of that pilot is not evidence that the agent performed visual inspection or calibrated SAA difficulty.

## Reviewed contract before authoring

Keep the existing contract fields (`id`, `goal`, `allowed`, `maxRepairs: 3`, `humanAcceptance`, `prohibited`, `publication`). Give each genuinely new task its own reviewed identity; never rename an existing task to restore repairs. Add the optional `content` section below. This example declares one new logical question, not a new fixed dataset size:

```json
{
  "baseCommit": "9881f79853516d6fe1f2736b5b9b06500552c860",
  "allowedOperations": ["read", "write", "verify"],
  "deliverables": [
    {
      "id": "saa-weekly-addition",
      "kind": "questions",
      "sourceLocale": "zh",
      "sourceRevision": 1,
      "addedIds": ["saa-051"],
      "locales": {
        "zh": {"path": "frontend/contents/questions/saa-c03.zh.json", "sourceRevision": 1},
        "ja": {"path": "frontend/contents/questions/saa-c03.ja.json", "sourceRevision": 1},
        "en": {"path": "frontend/contents/questions/saa-c03.en.json", "sourceRevision": 1}
      }
    },
    {
      "id": "recovery-article",
      "kind": "article",
      "sourceLocale": "zh",
      "sourceRevision": 1,
      "locales": {
        "zh": {"path": "frontend/contents/blog/zh/recovery-example.mdx", "sourceRevision": 1},
        "ja": {"path": "frontend/contents/blog/ja/recovery-example.mdx", "sourceRevision": 1},
        "en": {"path": "frontend/contents/blog/en/recovery-example.mdx", "sourceRevision": 1}
      }
    }
  ]
}
```

Recheck the remote and choose the task's actual full baseline commit; the example SHA is historical, not automatically latest. `init` requires that commit to exist locally and be an ancestor of HEAD. Question files must already exist at that commit; introducing a new exam is outside this minimal extension. Baseline IDs and hashes are read with Git from that commit, never inferred from a requested count. A declared new ID already in the baseline is rejected. Article paths may be new.

All locale paths must be distinct, relative, within `allowed` source paths and outside generated directories. Each locale's declared source revision must match the deliverable's positive source revision. These declarations describe the agreed translation source; they cannot prove a translator actually used it. Every verification also records file hashes. Changed input invalidates previous status/evidence; a new verification does not carry forward semantic acceptance. Changing a frozen contract or verifier requires explicit review/rebaselining, keeping the original repair count, not a new ID to evade limits.

`allowedOperations` is a reviewed cooperative declaration with a closed vocabulary: `read`, `write`, `verify`, `commit`, `push`, `draft-pr`. It must include `verify`. It neither executes these operations nor grants OS/cloud permissions. The CLI still only verifies; deployment safety and user authorization govern Git publication separately. It is not a general agent sandbox.

## Manual entry point

Save the full approved contract under `docs/aidd/tasks/`, with `allowed` covering its declared content paths. Use the existing fixed profile and CLI:

```powershell
node tools/aidd/cli.mjs init tmp/weekly-evidence . docs/aidd/tasks/approved-week.json
node tools/aidd/cli.mjs verify tmp/weekly-evidence baseline
# Author only after baseline passes. Before a corrective batch, record repair.
node tools/aidd/cli.mjs repair tmp/weekly-evidence "finding" "hypothesis" "expected result"
node tools/aidd/cli.mjs verify tmp/weekly-evidence candidate
node tools/aidd/cli.mjs status tmp/weekly-evidence
```

Omitting the final init argument retains `docs/aidd/task.json`. The selected contract path is added to the frozen profile's protected paths; editing the working copy of that contract cannot silently change the active agreement. No arbitrary profile override or skip-install flag is introduced. Full verification still executes the existing install/lint/typecheck/tests/build/HTML checks and requires their existing permissions.

Baseline verification expects exactly the Git baseline question IDs. Candidate verification expects exactly baseline IDs plus declared additions in every locale. Neither deleting an old ID while adding another nor adding undeclared IDs can satisfy a count. Duplicate question IDs, invalid/duplicate choice IDs, empty option explanations, invalid answer keys, mismatched locale metadata/answers and missing/empty deliverable files block verification. Array and question ordering do not change ID identity. The existing frontend tests retain answer-marker, option-order, distribution and enrichment checks.

The frontend parity test now preserves a frozen historical ID inventory instead of asserting 50 items. This permits growth without allowing historical deletions or duplicate IDs. It is not a replacement for task-specific exact-added-ID validation. Future baseline-inventory changes require review, as do all required tests.

The November 9 approved article integration replaces Blog/Architecture fixed totals with frozen historical `(ID, slug)` inventories, explicit approved additions, duplicate rejection and required three-language parity. Comparisons use the same inventory contract. A baseline may contain only historical articles; once an approved article is added, every locale must contain its matching identity. Candidate content verification additionally requires all declared new article files. Existing metadata, body and diagram checks remain. The historical inventory comes from Git commit `66e5f13`, not the mutable candidate. Changing this inventory, approvals or required tests requires reviewed rebaselining; silently increasing a count is not an equivalent gate.

`content-baseline.json` is hashed into task metadata, `content.mjs` is frozen with the engine, and each run seals `content.json` with source versions/digests. Replay uses the verified bundle's frozen Git inventory even when the original commit is absent from its disposable repository. A candidate replay checks candidate additions during setup; a baseline replay checks the baseline set. Repairs remain shared and replay is still verification-only.

## Separate acceptance gates

Mechanical evidence covers file presence, source/revision declarations, exact ID sets, choice structure, required text fields and answer-key/metadata parity. It does **not** prove translation meaning, technical facts, source support, semantic uniqueness of the correct answer, originality, diagram rendering, visual layout, difficulty calibration or absence of answer-position/length hints.

Keep independent blind-answer and semantic/source reviews, then human visual/content acceptance, as separately recorded decisions tied to the exact reviewed hashes/revisions. The machine report always says `semanticReview: pending`. All `humanAcceptance` entries remain pending; there is no agent acceptance command. No JSON equality or successful build promotes these decisions to passed.

This engineering change uses contract `tasks/content-preparation.json` and its own ignored local ledger. It does not reset the sealed content pilot's 3/3 repairs. Its local use of an existing dependency tree is not a substitute for a clean full-profile install or remote CI.
