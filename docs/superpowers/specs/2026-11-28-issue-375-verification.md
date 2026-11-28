# Issue 375 verification — 2026-11-28

## Candidate and scope

Verified source commit: `47179442a9cfe8e6644edb77a13d34b2af10a202`.
Known reviewed dev base: `aaaa046902498e9373cf8de3e5b2f49b9b9f8af6`.
Subsequent submission commit changes documentation only; frontend tree identity is checked before push. Dedicated branch: `codex/issue-375-daily-updates`. Desktop master remains clean at `e8cc5a40f3857bf3a09194a66cf805dbf5ab8043`.

Design, plan and independent review are separate documents in docs/superpowers. Raw local evidence is retained under `C:/Users/vince/Documents/Codex/aws-cert-roadmap-lab/issue-375/implementation-20261128`; it is not published with the PR. The previous progress.md remains unchanged. Repair allowance is 3/3, with the original history preserved in the continuation ledger. Further corrective work requires explicit authorization.

## Actual final commands

Run on FUMI with Node 22.13.0 / npm 10.9.2 in frontend:

| Command | Result |
| --- | --- |
| npm run lint | exit 0 |
| npm run typecheck | exit 0 |
| npm test -- --maxWorkers=1 | exit 0; node:test 2 passed; Vitest 52 files, 665 passed, 22 inherited skips; 133.33 seconds |
| npm run build | exit 0; 822 generated routes; existing dynamic-filesystem build warnings retained in log |
| npm run check:html-lang | exit 0; 821 HTML files checked |
| npm run check:locale-seal | exit 0 |
| node scripts/check-update-publications.mjs --base aaaa046902498e9373cf8de3e5b2f49b9b9f8af6 --candidate 47179442a9cfe8e6644edb77a13d34b2af10a202 | exit 0; zero source changes and zero new notices, as intended |
| Same CLI with --base 47179442a9cfe8e6644edb77a13d34b2af10a202 --candidate HEAD | exit 1; distinct-commit rejection; no coverage-success marker |

The default parallel baseline failed on Windows path/CRLF assumptions and six timeout cases. The two portability assertions retain their original semantics. Single-worker verification retains every test, assertion and timeout; default parallel success is not claimed. No CI/configuration/lockfile change or new skip was made.

TDD evidence: daily grouping, pure validation and Git collection each failed for missing implementation before passing. Review regression run failed 8 cases, with a separate immutable-prefix RED fixture, then focused 48/48 passed before the final full run. CLI positive and failure cases use separate invocations under the unchanged default timeout.

Negative acceptance covers resolved same-commit aliases, stale record/notice replay after re-editing questions or terms, missing/malformed sources, unknown format, unsupported executable announcement syntax, historical notice visibility, locale gates, required destination kinds, and failed CLI exit/no success marker. Synthetic repositories supply content changes; no WAF material or actual announcement was added.

## Browser acceptance

Final generated artifact served locally on loopback. Canonical paths: /updates, /en/updates, /zh/updates and their home routes. At 320, 390 and 1280 CSS pixels, all three update pages have 59 entries in 14 date groups, no horizontal overflow; all homes retain the original five entries and zero date groups. Initial refresh accidentally probed /ja paths; those zero-entry results remain in raw evidence and are excluded, then canonical Japanese paths were verified.

Existing mixed article/announcement days, full correction notes, original dates and item anchors remain visible. Keyboard Tab/Shift+Tab showed 2px solid focus and Enter reached the localized question destination. Old announcement:saa-c03-051-060 settles at 96px in all three locales and remains at 96px after reload. An immediate reload during pending smooth scrolling restored zero; settled-navigation/reload results are separately recorded. No application change was made for that observation. Screenshots and DOM results are local. Physical-device testing and 200% zoom are not claimed.

## Review and release boundaries

The fresh independent review and all finding dispositions are in 2026-11-28-issue-375-review.md. No outstanding finding is silently deferred. Editorial meaning, accepted known-base provenance and exclusion reasons still require human review.

Protected-scope diff is empty for workflows, infra, backend, learning content, real announcements, package manifests and lockfiles. Existing CI/AIDD and Preview integrations may run for the authorized dev PR. AWS deployment workflow is master-push/manual only and unchanged. No merge, AWS action or dev/master write was performed. PR #385 remains on its existing release head; #386 content is excluded. Remote CI results are separate from the local results above and are reported at submission time.
