# Quiz and glossary publication checks

Articles reach Updates through article metadata and current-version correction notes. Question/term JSON edits do not create announcements: #370 and the later #374 notice explicitly registered localized announcements. The checker verifies editorial decisions; it does not decide factual importance, write copy, publish content or run a deployment.

## Editorial sequence

1. Agree the exact known Git base with the reviewer. Record its full SHA before editing; for a PR use its reviewed base, not a moving alias silently refreshed at the end.
2. Make the intended content changes. Write a reader-relevant announcement in `frontend/src/contents/updates/announcements.ts` for a public release, with a new stable ID, three equivalent localized titles/summaries and publicly available localized destination links. Updates require three equivalent correction notes. Use category `question-bank` or `glossary`; a mixed release uses one notice and lists both destinations. Dates reflect the actual announcement, not a Git timestamp. The actual correction date remains in the notes.
3. Append a decision to `frontend/src/contents/updates/publication-records.json`. Each decision has a unique `id`, internal `summary`, exact `changes`, and either `disposition: "announce"` plus `announcementId`, or `disposition: "no-announcement"` plus a reviewed nonblank `reason`. One record can list multiple question/term changes across locales. Do not edit old records. Formatting/internal decisions must not produce public placeholder announcements.
4. Commit the candidate locally. Run the command below. Uncovered-change errors include the complete `changes` array of source keys and before/after SHA-256 fingerprints; use those exact transitions when writing the decision, then commit and check the new candidate. The command does not modify files and always checks Git blobs, not uncommitted edits.
5. The reviewer checks the supplied base, content/translation accuracy, classifications and reasons, exact candidate SHA and exit code. A failure is **not covered**. Do not publish on a failed check, missing base, or missing/partial result. Review actual three-locale pages as well as the check output.

From `frontend`, using the already installed lockfile dependencies:

```text
node scripts/check-update-publications.mjs --base <reviewed-full-base-sha> --candidate <committed-candidate-sha> --today YYYY-MM-DD
```

`--today` is the reviewed Taiwan calendar date, never a future date chosen to bypass publication gating. Omitting it uses the existing Updates build-date function. `--repo` optionally selects a repository for isolated fixtures. Base/candidate are mandatory, must resolve to different commits and the base must be an ancestor. The checker cannot independently decide whether a caller-selected ancestor is the organization's approved base; that provenance remains a review responsibility.

Success prints `Coverage verified for committed snapshots only`, resolved SHAs, counts and changed fingerprints, and exits zero. It is not approval, deployment evidence, or verification of working-tree edits. Failure exits nonzero and does not print the success marker. Preserve the complete output and its exit code separately from this document.

## Decision example (synthetic; never copy these digests)

```json
{
  "id": "example-copy-edit",
  "summary": "Correct display spacing in one glossary entry",
  "disposition": "no-announcement",
  "reason": "Typography only; the meaning and references are unchanged",
  "changes": [
    {
      "key": "frontend/contents/terms/terms.zh.json#example",
      "before": "<actual SHA-256 from the reviewed base>",
      "after": "<actual SHA-256 from the candidate>"
    }
  ]
}
```

For a public release, replace disposition/reason with `"disposition": "announce"` and `"announcementId": "new-notice-id"`. An addition has `before: null`; a deletion has `after: null`. Paths include locale names where applicable; unlocalized legacy JSON is covered under its own source path. Source moves require deletion/addition coverage. JSON indentation, object key ordering and top-level record order are not changes, but strings and nested array order remain significant.

## Guardrails and limits

- All files under `frontend/contents/questions/` and `frontend/contents/terms/` are inspected. Unknown file formats, invalid arrays/IDs, duplicate IDs within a source, malformed JSON, invalid Git objects and symlink sources fail closed. New content sources must stay under these roots; moving the content architecture outside them requires a reviewed checker update, not an exclusion workaround.
- A decision already in the known base cannot cover a later edit. Fresh decisions must match exact base-to-candidate fingerprints. Existing base announcements cannot be reused to announce a later release. Multiple changes belonging to one announcement go in one record; duplicate claims fail.
- Existing base ledger entries are immutable. For multiple edits within one not-yet-submitted PR, record the net base-to-final transition, rather than appending contradictory intermediate decisions. Once accepted into the next reviewed base, append a new decision for later edits.
- Fresh quiz/glossary announcements require a corresponding content release. Every claimed notice must survive the existing aggregator and appear exactly once in each locale. Blank text, missing translation/notes, unpublished/future entries, absent public routes and duplicate notices fail.
- Supported announcement destinations are existing question indexes, terms, home, updates and blog index routes. New destination kinds require reviewed support rather than bypassing the check. Announcement data must remain literal TypeScript objects/arrays; the checker parses literals and never executes code from a Git revision.
- Historical announcements are preserved without fabricated retroactive decisions. The prospective ledger starts empty in #375; this PR adds no real content release or #386 material.
- Local checks are mandatory editorial evidence but are not wired into CI by this change. Human review is still required for substantive corrections, proper dates, translation parity and exclusion reasons. Deployment authorization remains separate.

## Daily updates presentation

The standalone three-locale Updates pages group existing effective dates (publication, update or announcement date) newest first. Asia/Taipei date boundaries are unchanged; full dates and correction dates remain distinct. Every entry retains its old anchor and full notes. Homepage selection remains the latest five entries, not five days. There is no new pagination/filtering or automatic reconstruction of article history.
