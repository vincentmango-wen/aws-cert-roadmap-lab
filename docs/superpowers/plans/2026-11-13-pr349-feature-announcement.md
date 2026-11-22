# PR349 Feature Announcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task after explicit plan approval. Steps use checkbox (`- [ ]`) syntax for tracking. Recommend native execution followed by independent final review; this small data change does not need parallel implementation.

**Goal:** Add one complete, equivalent three-language announcement introducing Latest Articles and Latest Content and Announcements, with an announcement creation date of 2026-11-13.

**Architecture:** Append one `Announcement` to the existing data array and reuse aggregation, localized links, cards and page rendering. No new page, schema, sorting logic, component, dependency or deployment configuration is needed. Update only the reviewed data-dependent test expectations and task acceptance contract, retaining every original safety requirement.

**Tech Stack:** Existing Next.js 16.2.6, React 19.2.4, TypeScript, Vitest 4.1.9 and AIDD; existing isolated Node 22.13.0/npm 10.9.2 toolchain.

**Spec:** The approved design is reproduced in [Approved design and publication date](#approved-design-and-publication-date) below. The coordinator relayed the user's explicit approval on 2026-11-13: title and feature description, three locales, existing announcement card, home/full-updates destinations, and November 13 as announcement creation date rather than production release date. That design approval authorizes this planning document only; implementation awaits explicit approval of this plan.

## Global Constraints

- Work on FUMI in `C:/Users/vince/Desktop/project/aws-cert-roadmap-lab`, branch `codex/home-articles-updates-20261112`. Planning HEAD is `be04c37dc20a310f69cf1d20915d2e35f3d11fa2`; inspect again at execution time. Do not revert to the obsolete restoration task.
- Preserve `.gitignore`, all `.serena/` files, root `AGENT.md`/`AGENTS.md`, existing source, evidence, backups and concurrent work. No clean, hard reset or destructive cleanup.
- Feature workflow remains design -> explicit approval -> implementation plan -> implementation with TDD -> overall testing -> review. This file does not authorize implementation or publication by itself.
- Actual repairs remain **20**, CLI count **3**, with exceptions **4-20** retained. This approved feature addition is not permission for repair21 or a counter reset. Expected TDD assertion failures are recorded separately; unexpected regressions, fixture/Harness defects or a new corrective approach require stopping and reporting before correction.
- Existing extra-CA permission expired after the one isolated pnpm installation. No new trust changes, downloads/toolchain replacement, dependency/lockfile edits, profile changes, timeout increases, skipped tests or evidence deletion.
- After plan approval and successful execution/review, update the existing PR349 under its applicable authorization. No new PR, merge, auto-merge or production deployment. A changed announcement still needs its own verification and user acceptance; acceptance of be04c37 is not acceptance of this future candidate.

## Approved design and publication date

Add `id: "latest-articles-and-updates"`, `category: "feature"`, `eventKind: "new"`, `date: "2026-11-13"`, `published: true`. Leave `corrects` and `updateNotes` absent. The aggregated item ID is `announcement:latest-articles-and-updates`, date label is `announced`, and notes status is `not-applicable`; this is a new feature announcement, not a correction of the SAA announcement.

The date records announcement creation in Asia/Taipei. It is not a claim that the feature reached production on that day. Keep it fixed even if authorized production publication occurs later; any actual production release record belongs to separate release evidence. Do not write “launched on November 13,” “now live in production,” or equivalent claims. Existing UI labels already say announcement date; no global label change is needed.

At design investigation, PR349 remained open/unmerged and be04c37 had successful Frontend CI, AIDD CI and Vercel Preview. The most recent observed Production deployment referenced 6c66041. Recheck these facts before any later authorized push; never infer production release from Preview success.

Reuse `summary` for the complete prose below. The current renderer displays it as a single wrapping paragraph; paragraph breaks in this document are editorial reading aids, not a request for rich-body support. Join each locale's paragraphs with a single space. Preserve complete sentences without ellipses or clamping. Retain the SAA entry in its current array position and append the feature entry; sorting remains the aggregator's responsibility.

Two approaches were considered: reuse the existing announcement card, or introduce a dedicated feature article/page. The user approved the existing card and two existing destinations. A new content type/page would expand scope without helping this announcement.

### Exact Traditional Chinese copy

**Title:** 新增「最新文章」與「最新內容與公告」

首頁新增「最新文章」與「最新內容與公告」，讓你更容易找到近期發布或更新的學習內容，以及網站的新功能與題庫消息。

「最新文章」依文章的發布或更新日期，列出最近的三篇部落格文章，並提供文章連結。

「最新內容與公告」彙整文章、架構與比較內容的發布及更新，以及題庫和網站功能公告。首頁顯示最近三則，完整清單可在「最新內容與公告」頁查看。

每則項目會標示新增或更新及相關日期；更新內容會呈現已記錄的修正說明與來源連結，缺少說明時也會明確標示。上述功能提供繁體中文、英文與日文版本。

**Home link label:** 前往首頁查看最新文章

**Updates link label:** 查看最新內容與公告

### Exact English copy

**Title:** Introducing Latest Articles and Latest Content and Announcements

The home page adds Latest Articles and Latest Content and Announcements, making it easier to find recently published or updated learning content, new site features, and question-bank news.

Latest Articles lists the three most recent blog articles by publication or update date and provides links to the articles.

Latest Content and Announcements brings together new and updated articles, architecture guides, and comparisons, as well as question-bank and site-feature announcements. The home page shows the three most recent items; the full list is available on the Latest Content and Announcements page.

Each item shows whether it is new or updated and its relevant date. Updated content includes recorded correction notes and source links; missing notes are also clearly indicated. These features are available in Traditional Chinese, English, and Japanese.

**Home link label:** View Latest Articles on the home page

**Updates link label:** View Latest Content and Announcements

### Exact Japanese copy

**Title:** 「最新記事」と「最新コンテンツとお知らせ」を追加

ホームページに「最新記事」と「最新コンテンツとお知らせ」を追加し、最近公開・更新された学習コンテンツや、サイトの新機能、問題集のお知らせを見つけやすくしました。

「最新記事」では、公開日または更新日が新しいブログ記事を3件表示し、各記事へのリンクを掲載しています。

「最新コンテンツとお知らせ」では、記事、アーキテクチャ解説、比較コンテンツの公開・更新情報と、問題集やサイト機能のお知らせをまとめて確認できます。ホームページには最新の3件を表示し、全件は「最新コンテンツとお知らせ」ページで確認できます。

各項目には新規・更新の区分と関連する日付を表示します。更新されたコンテンツには、記録された修正内容と参照元へのリンクを表示し、説明がない場合もその旨を明示します。これらの機能は繁体字中国語、英語、日本語で利用できます。

**Home link label:** ホームページで最新記事を見る

**Updates link label:** 最新コンテンツとお知らせを見る

### Destinations and inventory

Store unprefixed paths `/` and `/updates` in the announcement. `createLocalizedPath` produces Japanese `/` and `/updates`, English `/en` and `/en/updates`, and Traditional Chinese `/zh` and `/zh/updates`; preserve the existing home-path normalization rather than inventing anchors or prefixed source paths. Both links must pass the existing public-path checks in all three locales.

For build dates on/after 2026-11-13, every locale has 53 items. Home Updates shows, in order:

1. `announcement:latest-articles-and-updates`
2. `announcement:saa-c03-051-060`
3. `architecture:arc-007`

`architecture:arc-011` becomes fourth in the full list; it is not removed. Latest Articles remains `blog:blog-002`, `blog:blog-008`, `blog:blog-015`, with original dates and complete current notes unchanged. A fixed build date of 2026-11-12 still excludes the future feature announcement and retains the original 52-item inventory and original home order. A later date keeps `eventKind: "new"`; New is an event classification, not an expiring freshness badge.

## File map

- Modify `frontend/src/contents/updates/announcements.ts`: append only the new data entry and exact three-locale copy.
- Modify `frontend/src/contents/updates/__tests__/announcements.test.ts`: retain exact SAA assertions; add feature metadata/copy/link/date tests and review the announcement count change.
- Modify `frontend/src/contents/updates/__tests__/latest-articles.test.ts`: reviewed 53-item/current-home-order expectations, retaining blog/date/note/content checks and adding pre-announcement compatibility.
- Modify `frontend/src/contents/updates/__tests__/routes.test.ts`: add actual three-locale home/full-route rendering and link acceptance for the new entry; keep existing pre-announcement and SEO/sealed-locale tests.
- Modify `docs/aidd/tasks/latest-content-announcements.json`: append approved scope/date/acceptance/history; allow this plan; preserve task identity, limits and earlier approval records.
- Create this plan only during planning. During implementation, place new raw outputs, review snapshots and browser evidence under a new ignored `tmp/pr349-feature-announcement-20261113/` directory; preserve all previous evidence directories.
- Read-only reuse: `types.ts`, `aggregate.ts`, `index.ts`, all components/styles/dictionaries, AIDD engine/profile, package manifests/lockfiles, existing browser helpers. If these need correction, stop and report scope/repair implications.

## Review Focus

1. Build before the announcement date: preserve the historical 52-item view and exclude only the future feature entry (Task 1 date tests).
2. Incomplete or hidden translation/link destination: exclude the announcement consistently across all locales, never fall back silently (Task 1 mutation tests).
3. A new announcement moving older content below the fold: retain every old item and exact SAA copy while changing only the approved order (Task 1 inventory assertions).
4. Complete English/Japanese prose on narrow screens: no truncation, horizontal overflow or inaccessible second link (Task 2 browser checks).
5. Preview mistaken for production or announcement date mistaken for release date: exact approved prose/date semantics, unchanged SEO and separate publication reporting (Tasks 1-3).

## Task 0: Preserve current work and bind the approved scope

**Interfaces:** Consumes the approved plan, existing task `latest-content-announcements-b-v2-2026-11-12` and bundle `tmp/latest-content-announcements-evidence`. Produces a recorded before-image manifest and approved scope; no product behavior changes.

- [ ] Obtain explicit approval of this plan before any step below; record it in the new local ledger.
- [ ] Recheck computer/path/branch/HEAD/index, dirty/untracked/ignored protected inputs and any concurrent operation. Reconcile interruptions; do not remove active markers.
- [ ] Create an external, non-temporary backup containing all affected files, original dirty/untracked/Serena/rule files, and mutable task/bundle metadata and engine. Verify readback hashes and an independent recovery copy; preserve earlier full backups and evidence. Stop if the destination or recovery verification is unsafe.
- [ ] Validate the existing successful revision-8 baseline/candidate seals and repair history through the supported inspection path; the added plan is expected source drift, not a reason to reset the task or rewrite sealed metadata. No dependency reinstall or completed repair20 rerun solely for planning.
- [ ] Append contract acceptance for the new feature/date and the 53-item post-announcement state. Explicitly label prior 52-item acceptance as the pre-announcement/historical state; do not erase earlier repair17/18 evidence or claims. Keep actual20/CLI3/maxRepairs3 and no21 authorization.

## Task 1: Add the announcement through TDD

**Interfaces:** Consumes `Announcement[]`, `aggregateUpdates(input: AggregateInput): UpdateInventory`, `selectHomeUpdates(items: UpdateItem[]): UpdateItem[]`, and `selectLatestArticles(items: UpdateItem[]): UpdateItem[]`. Produces one additional eligible `feature/new` item in each locale; no interface changes.

- [ ] Add failing tests for `latest-articles-and-updates`: exact metadata, all complete locale titles/summaries/labels above, paths `['/', '/updates']`, absent `corrects`/`updateNotes`, `announced` date label, and `not-applicable` notes.
- [ ] Change the existing SAA-only test to check exactly the two approved IDs and locate the SAA entry by ID, retaining every current exact SAA translation/date/link and question51-60/public-path assertion. Rename only this misleading identity to `contains the exact approved SAA and feature announcements`.
- [ ] Update the current inventory test to 53 items and the exact home order above; retain all blog IDs, dates, notes, noIndex checks and cross-locale equality. Rename it to `selects 002/008/015 with full current notes from the same 53-item three-locale inventory`. Also assert removing the feature item from the new inventory produces the complete old ordered inventory, not merely a matching count.
- [ ] Add fixed-date cases for 2026-11-12 (52 items, feature absent, original top three), 2026-11-13 (53, new top three), and 2026-11-14 (same feature date/New classification). Clone the feature fixture and test unpublished, missing locale text, empty labels and a sealed/missing destination: each must exclude that entry across all locales with the existing diagnostic. Retain all generic unsafe-link, invalid-date, correction-cycle and duplicate-ID cases.
- [ ] Add three-locale route tests at `UPDATES_BUILD_DATE=2026-11-13`: home/full page each contains the feature exactly once with complete escaped text, `data-event-kind="new"`, announced date, and both localized destinations. Scope note/correction assertions to this card; it has no missing-note or correction relationship UI. Keep the existing 2026-11-12 route tests intact.
- [ ] Run the focused tests using existing pinned Node from repo root, with working directory `frontend`: `& $node ./node_modules/vitest/vitest.mjs run src/contents/updates/__tests__/announcements.test.ts src/contents/updates/__tests__/latest-articles.test.ts src/contents/updates/__tests__/routes.test.ts`. Set `$node` to the absolute existing `tmp/latest-content-announcements-toolchain/node-v22.13.0-win-x64/node.exe` path before changing working directory. Expected RED: only the intentionally absent new entry/count/order assertions fail; retain output. Diagnose and stop on unrelated failures.
- [ ] Append the exact approved entry to `announcements.ts`; do not modify the SAA object, aggregation logic, cards or styles.
- [ ] Run the same focused command. Expected GREEN: all tests pass, including historical date and safety cases. Run the full frontend suite with the same pinned Node and existing Vitest runner; preserve the 22 inherited pending identities and every old required assertion. New tests must pass, not skip.

## Task 2: Reviewed AIDD revision and overall acceptance

**Interfaces:** Consumes Task 1's final source, contract and original assertion identities. Produces independently reviewed, sealed baseline/candidate and browser evidence for the exact new source.

- [ ] Use `superpowers:requesting-code-review` for protected test/contract review. Supply complete diffs, exact SAA before/after proof, plan approval, copy equivalence, original assertion coverage and the two test-name migrations. Do not treat changed expected counts as removal of coverage.
- [ ] From repo root run `& $node tools/aidd/cli.mjs review-rebaseline tmp/latest-content-announcements-evidence docs/aidd/tasks/latest-content-announcements.json 'Approved three-language feature announcement dated 2026-11-13; retain SAA and prior history'`; capture stdout/stderr in the new evidence directory. Bind review to current sourceHash/previousTaskHash and complete changes.
- [ ] Populate only the two explicit one-to-one rename mappings under the review snapshot's `assertionReplacements.vitest`, using exact keys read from archived `identities.json` and exact corresponding new identities. Map the old SAA-only title and old 52-item title to the two new names above. No deleted, merged, weakened or newly skipped assertions; reviewer must approve these mappings before rebaseline. Do not alter the engine or sealed historical files.
- [ ] On independent approval and unchanged hashes, run `& $node tools/aidd/cli.mjs rebaseline tmp/latest-content-announcements-evidence <approved-review-json>`. Verify previous engine/task/profile/contract/seals are archived and repair history retained.
- [ ] Run `& $node tools/aidd/cli.mjs verify tmp/latest-content-announcements-evidence baseline`, then `candidate` only after baseline succeeds. Both must pass the unchanged seven checks: npm ci, Harness, lint, typecheck, Vitest, build including locale seal, and HTML language. Current pre-change reference is Harness32, Vitest385passed/22pending; new test totals must be reported from actual outputs, not guessed. No extra CA, new skip, timeout/profile change or repair21.
- [ ] Validate exported candidate HTML: all three complete 53-item inventories, new home order, unchanged latest blogs and SAA, both destinations, current notes, existing canonical/hreflang/robots, unchanged 78 blog sitemap URLs and three updates routes without fabricated lastModified. No new URL or SEO production edit is planned.
- [ ] Against that candidate output, run browser acceptance for ja/en/zh, home/full updates, widths390/639/640/768/1023/1024/1440 (42 cases). Verify complete new summary text and both links, no overflow/clamping, unchanged panel styles/spacing, New/date labels, and retained old content. At390/768/1440 capture all three locales/routes (18 screenshots), Tab/focus and Enter navigation to both localized destinations. A link returning to the current home/updates page is intentional; do not invent anchors.
- [ ] Reuse reviewed color/contrast and keyboard helpers without lowering thresholds. Create fresh evidence outputs, never overwrite repair20 results. Update helper inventory expectations explicitly to 53; compare old unaffected cards by stable ID rather than assuming unchanged preview positions or card heights. Long prose may legitimately increase card/section height while widths, gaps and typography stay unchanged. Any helper defect requiring corrective iteration stops for a repair decision.
- [ ] Run final independent technical/content review and `superpowers:verification-before-completion`; verify current source matches the validated candidate, preserved-work hashes match the backup, no active operation remains, and all old evidence is intact. Report build warnings and inherited pending tests explicitly. Record human acceptance of this new candidate separately.

## Task 3: Update only the existing PR after applicable approval

- [ ] Confirm current publication authorization still covers this completed plan. Recheck PR349 head/base, remote, Actions and Preview side effects before pushing; stop if another change or production-triggering branch is involved.
- [ ] Check the exact diff and selectively stage only the announcement, the three listed test files, task contract and this plan. Commit with `feat: announce latest articles and content updates`. Do not stage `.gitignore`, `.serena`, root rules or evidence; verify committed blobs match the tested source.
- [ ] Push non-force to the existing feature branch and update PR349 in English with the actual new commit, announcement creation-date semantics, 53-item effect and fresh verification. Do not open another PR, merge, enable auto-merge, manually retry deployment or deploy production.
- [ ] Check Frontend CI, AIDD CI and Vercel Preview for that exact commit; preserve status/log evidence and clearly report capability limits. A new failure stops for diagnosis/report, not an unapproved repair21. Preview success is not production release.
- [ ] Report commit, PR, local/remote results, backup/recovery evidence, preserved work, actual repair count20/CLI3 and remaining human/release gates. Production release requires separate explicit authorization and verification; do not rewrite the announcement date as a release date.

## Planning self-review

- Approved design/date/three-language copy maps to Task 1; preservation and history to Task 0; all test identities and safety protections to Tasks 1-2; final PR boundary to Task 3.
- Each of the five review-focus conditions has a named test or verification step. No schema/component/engine/dependency change is needed.
- The two destination paths use the existing localization interface and the exact inventory IDs match the current source/tests.
- This document is a plan awaiting approval. No product/test/contract edits, test execution, commit, push or deployment were performed as part of writing it.
