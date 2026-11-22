# PR 349 Dates and Change Notes Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` after explicit execution approval. Use `superpowers:test-driven-development` during implementation and `superpowers:verification-before-completion` before reporting results. Delegation requires applicable authorization. Steps use checkboxes for tracking.

**Goal:** Remove the approved 40 English/Traditional Chinese article noIndex flags, select the three newest eligible home articles by recorded dates, and display publication/update dates, permanent New/Update event labels and complete current correction notes on both home sections and the full updates pages.

**Architecture:** Extend the existing shared updates inventory instead of creating a second eligibility pipeline. Extract curated correction sections from existing localized Markdown into a restricted presentation model, normalize date/event/note state once, and reuse presentation components across the three locales and surfaces. Keep the article category and approved home styling.

**Tech Stack:** Next.js 16.2.6, React 19.2.4, TypeScript, Vitest, existing AIDD CLI; recommended direct parser dependencies `unified` 11.0.5 and `remark-parse` 11.0.0 (already installed transitively, declaration requires reviewed lockfile change).

**Spec:** User feedback in [PR 349 comment](https://github.com/vincentmango-wen/aws-cert-roadmap-lab/pull/349#issuecomment-6842305277), subsequent accepted direction recorded below, and [original implementation plan](2026-11-12-latest-content-and-announcements.md). The later direction supersedes fixed article selection and applies to both home and full updates pages. Root `AGENT.md` remains canonical.

## Approval and global constraints

- Status: **implementation explicitly approved on 2026-11-13; execution in progress**. On 2026-11-13 the user accepted the corrected mock and said: “我確認過了 我覺得可以 請進行計畫 繁中和英文的noindex也照舊把它撤除吧”. The accepted scope includes removing the 40 flags listed below, date-based newest-first selection, publication/update dates, New/Update without expiry, full correction bullets, explicit missing-note disclosure, and both home/full-page coverage. Mock acceptance authorizes this plan revision, not skipping its approval gate.
- This revision explicitly replaces the earlier plan's requirement to preserve the 40 target flags, exclude blog-006–025 and select 002/026/001. The new expected selection is **002/008/015**. Do not execute the obsolete expectations.
- Remove only the `noIndex: true` frontmatter line from the 40 enumerated files. Preserve all Japanese files, registry values, article bodies, publication/update dates and other content restrictions. Keep the common eligibility checks and locale gate; no blanket override of noIndex in application code.
- The user's corrected example is **June 7, not June 9**. Do not change article dates to match an example or continue investigating June 9.
- Preserve Japanese/English/Traditional Chinese routes and common eligibility. Preserve Hero → Latest Articles → Updates → Learning → Certification → Portfolio, teal articles, amber updates, panel radius 24px, card radius 16px/padding 24px, vertical panel padding 32/40/48px at 640/1024px, horizontal padding 16/24/32px, maximum width 1152px and 80px section gaps. Card/section height may grow with complete notes.
- No expiry window, new content translation project, AWS claim rewrite, issue 348, date backfill, article-page renderer rewrite, new correction anchors, deployment configuration or infrastructure changes.
- Actual repair history is **12** (CLI 3 plus authorized exceptions 4–12). There is no authorization for repair 13. Keep the task ID, bundle and all old evidence; do not reset counts. Expected TDD RED is recorded separately, never used to conceal a baseline/Harness defect.
- This planning round permits only this document. No product changes, dependency installation, tests/build, contract edits, commit/push, PR comment, merge or deployment.

## Accepted presentation and implementation decisions for plan review

1. Use effective date `updatedAt ?? publishedAt` descending, then stable article ID ascending for equal dates. Filter eligible blogs before taking three. Date-only metadata cannot establish an order within a day.
2. An article is Update when its update date is later than publication or at least one locale has a valid correction entry matching that same-day version; all locales share the event label, while incomplete note parity uses the missing-note policy below. Otherwise New means first publication, not recently published. Display the update date plus original publication date for Update, publication date for New. Invalid dates remain invalid rather than falling back.
3. Parse the existing localized correction sections with the two direct dependencies above. Show the complete latest-version entry, including all bullets and its supporting source paragraph/links; retain historical entries in article bodies. No excerpt, generated summary, arbitrary line clamp or collapsed disclosure.
4. Missing historical notes remain eligible and display localized “This version has no update notes.” Malformed sections, unmatched versions or incomplete locale notes produce actionable diagnostics and display missing-note disclosure consistently across locales, never another locale's text or an older version's notes. A new hard publishing gate/legacy allowlist is **not** part of this plan; adopting that stronger policy requires a separate decision. Existing content-authoring rules still require substantive corrections to have equivalent notes in all languages.
5. Announcements receive an explicitly authored `eventKind`, independent of category/title. Use `new` for the current SAA 051–060 addition as shown in the accepted corrected mock. An announcement marked `update` must contain localized update notes; an existing `corrects` relationship must agree with `update`. Do not infer future classifications from title keywords.

The presentation and 40-file removal direction are accepted. Parser dependencies, diagnostic handling and execution details are submitted with this revised plan for confirmation; they are not permission to begin implementation. If a technical recommendation is rejected, revise its task. Material design changes return to explicit design approval.

## Read-only findings and source references

Observed checkout: FUMI, `C:\Users\vince\Desktop\project\aws-cert-roadmap-lab`, branch `codex/home-articles-updates-20261112`, HEAD `f7fe4f5d0ebddeb069df13d8d4ca5ae5c3506a6f`. The older `Desktop\專案` path does not exist. Before this document, working changes were `.gitignore` and untracked `.serena/`; root rules are ignored local files. Preserve them.

- Home `blogPreviews` are hard-coded: `frontend/src/app/(site)/page.tsx:59`, `en/page.tsx:76`, `zh/page.tsx:103`. They currently choose blog-001, blog-002 and blog-003 without visible dates.
- Registry `frontend/src/contents/blog/blogPosts.ts` supplies shared dates/identity; localized MDX supplies display content and flags. `frontend/src/contents/updates/article-sources.ts:21` combines metadata, and `aggregate.ts:21–30` checks all locales, noIndex, calendar validity and dates. A published article is not necessarily eligible for recommendation.
- June 7 corresponds to **20 articles, blog-006 through blog-025** (registry date fields at lines 118 through 460). All 60 localized MDX files exist, are published and agree with their registry dates. Japanese has no `noIndex: true`; English and Chinese each have `noIndex: true` in all 20. The existing common eligibility rule therefore excludes all 20 with `not-recommended`, not because June 7 is too old. The exact article the user saw cannot be uniquely identified from the date alone.

| June 7 article IDs | Recorded updatedAt |
| --- | --- |
| 006, 010, 012, 014, 022, 023 | 2026-08-02 |
| 007, 009, 011, 013, 016–021, 024, 025 | 2026-08-20 |
| 008 (`clf-aws-pricing-basics`), 015 (`saa-decoupling-sqs-sns-eventbridge`) | 2026-11-09 |

- Example pre-change evidence: `frontend/contents/blog/zh/clf-aws-pricing-basics.mdx:18–20` and its English counterpart record noIndex and dates. The user has now included removal of the enumerated flags in this scope; this is a content eligibility change alongside sorting, not a reason to weaken the generic eligibility rule.
- Pre-change inventory has 51 article candidates, 31 eligible articles and one announcement per locale. A read-only in-memory removal of only the 40 flags produced **51 eligible articles + one announcement = 52 items per locale**, no existing eligibility diagnostics and identical IDs/order across locales, as of 2026-11-13. All 26 blogs become eligible. Expected latest articles are **blog-002, blog-008, blog-015**, all Update dated November 9. blog-026 is fourth under stable-ID ties; do not promote it to manufacture a New badge.
- Seven content groups have correction sections in all three languages: blog-002, blog-008, blog-015, arc-007, cmp-003, cmp-009, cmp-011, all dated November 9. All seven become eligible after removal. The 18 other newly eligible updated blogs lack recorded correction sections; display missing-note disclosure rather than inventing history. Before removal, five eligible groups had notes and 17 other eligible updated articles lacked them.
- Correction structure is localized H2 (`訂正内容`, `Corrections`, `更正說明`), H3 ISO date, complete bullet(s), then source paragraph/links. Example: `frontend/contents/blog/zh/aws-free-tier-portfolio.mdx:176`. `UpdateCard.tsx:21` currently renders announcement relationship links, not these body notes.
- `frontend/src/app/(site)/blog/blog-detail-data.ts:133` sorts by publication only; do not reuse it as the new updated-date selector. The article body renderer has no automatic heading IDs, so do not promise correction-anchor links.

### Exact 40-file removal manifest

Source: `frontend/src/contents/blog/blogPosts.ts` maps postId to slug; each file below was read at HEAD `f7fe4f5`. Column line numbers locate the current `noIndex: true` line and are evidence, not permission to edit by line number without checking content. Each row names two exact files; no glob-based removal is authorized.

| ID | English file | Traditional Chinese file | Current line in both |
| --- | --- | --- | --- |
| blog-006 | `frontend/contents/blog/en/clf-shared-responsibility-model.mdx` | `frontend/contents/blog/zh/clf-shared-responsibility-model.mdx` | 18 |
| blog-007 | `frontend/contents/blog/en/clf-aws-global-infrastructure.mdx` | `frontend/contents/blog/zh/clf-aws-global-infrastructure.mdx` | 18 |
| blog-008 | `frontend/contents/blog/en/clf-aws-pricing-basics.mdx` | `frontend/contents/blog/zh/clf-aws-pricing-basics.mdx` | 18 |
| blog-009 | `frontend/contents/blog/en/clf-iam-basics.mdx` | `frontend/contents/blog/zh/clf-iam-basics.mdx` | 18 |
| blog-010 | `frontend/contents/blog/en/clf-monitoring-cloudwatch-basics.mdx` | `frontend/contents/blog/zh/clf-monitoring-cloudwatch-basics.mdx` | 18 |
| blog-011 | `frontend/contents/blog/en/saa-multi-az-high-availability.mdx` | `frontend/contents/blog/zh/saa-multi-az-high-availability.mdx` | 19 |
| blog-012 | `frontend/contents/blog/en/saa-vpc-public-private-subnet.mdx` | `frontend/contents/blog/zh/saa-vpc-public-private-subnet.mdx` | 19 |
| blog-013 | `frontend/contents/blog/en/saa-s3-cloudfront-oac-design.mdx` | `frontend/contents/blog/zh/saa-s3-cloudfront-oac-design.mdx` | 19 |
| blog-014 | `frontend/contents/blog/en/saa-database-selection-rds-dynamodb.mdx` | `frontend/contents/blog/zh/saa-database-selection-rds-dynamodb.mdx` | 19 |
| blog-015 | `frontend/contents/blog/en/saa-decoupling-sqs-sns-eventbridge.mdx` | `frontend/contents/blog/zh/saa-decoupling-sqs-sns-eventbridge.mdx` | 19 |
| blog-016 | `frontend/contents/blog/en/s3-beginner-object-storage.mdx` | `frontend/contents/blog/zh/s3-beginner-object-storage.mdx` | 18 |
| blog-017 | `frontend/contents/blog/en/lambda-beginner-serverless.mdx` | `frontend/contents/blog/zh/lambda-beginner-serverless.mdx` | 18 |
| blog-018 | `frontend/contents/blog/en/apigateway-beginner-http-api.mdx` | `frontend/contents/blog/zh/apigateway-beginner-http-api.mdx` | 18 |
| blog-019 | `frontend/contents/blog/en/dynamodb-beginner-nosql.mdx` | `frontend/contents/blog/zh/dynamodb-beginner-nosql.mdx` | 18 |
| blog-020 | `frontend/contents/blog/en/cloudfront-beginner-cdn.mdx` | `frontend/contents/blog/zh/cloudfront-beginner-cdn.mdx` | 18 |
| blog-021 | `frontend/contents/blog/en/aws-portfolio-serverless-architecture.mdx` | `frontend/contents/blog/zh/aws-portfolio-serverless-architecture.mdx` | 19 |
| blog-022 | `frontend/contents/blog/en/aws-budgets-cost-guardrail.mdx` | `frontend/contents/blog/zh/aws-budgets-cost-guardrail.mdx` | 18 |
| blog-023 | `frontend/contents/blog/en/github-actions-oidc-deploy.mdx` | `frontend/contents/blog/zh/github-actions-oidc-deploy.mdx` | 19 |
| blog-024 | `frontend/contents/blog/en/serverless-contact-api-flow.mdx` | `frontend/contents/blog/zh/serverless-contact-api-flow.mdx` | 19 |
| blog-025 | `frontend/contents/blog/en/lambda-cloudwatch-logs-check.mdx` | `frontend/contents/blog/zh/lambda-cloudwatch-logs-check.mdx` | 18 |

History explains the distinction: commit `928312c` (PR #298) introduced the localized flags; `256c7cd` and `28ee0b0` (PR #337) restored Japanese indexing, while `794aca1` (PR #338) reopened the global locale gate. None removed these 40 localized flags. A read-only remote check on 2026-11-13 12:31 Asia/Taipei found PR #349 open/unmerged at `f7fe4f5`, master `6c66041`, no auto-merge, successful CI/Preview; all 11 remote branch tips retained 40 flags. Recheck before future publication rather than treating that observation as current forever.

### Expected presentation after implementation

| Surface / item | Publication | Update / announcement | Badge and notes |
| --- | --- | --- | --- |
| Latest articles 1: blog-002, free-tier portfolio | 2026-06-01 | 2026-11-09 | Update; full existing bullet and three source links |
| Latest articles 2: blog-008, pricing basics | 2026-06-07 | 2026-11-09 | Update; full existing bullet and three source links |
| Latest articles 3: blog-015, decoupling | 2026-06-07 | 2026-11-09 | Update; both full existing bullets and five source links |
| Home Updates 1: announcement:saa-c03-051-060 | Not an article date | 2026-11-09 | New; existing announcement summary, no false missing-update warning |
| Home Updates 2: architecture:arc-007 | Preserve registry date | 2026-11-09 | Update; complete existing SQS correction and two source links |
| Home Updates 3: architecture:arc-011 | 2026-11-09 | No later version | New; no false missing-update warning |
| Full updates page | Preserve recorded dates | Same effective-date rules | All 52 entries, same shared labels/notes for the same ID; missing notes disclosed for updated entries without current notes |

Titles/text are read from each locale's existing source, never translated on the fly. The three latest article cards all have notes; do not put a missing-note message on them. The complete paragraphs and source links are in `frontend/contents/blog/{ja,en,zh}/aws-free-tier-portfolio.mdx`, `clf-aws-pricing-basics.mdx`, and `saa-decoupling-sqs-sns-eventbridge.mdx`; their full text, including qualifications, must survive rendering. New/Update describes the event, not a recency window.

## File map and interfaces

All paths below are relative to the repository; only this plan is edited now.

| Files | Responsibility |
| --- | --- |
| `frontend/src/contents/updates/types.ts` | Add event/date/correction model without renaming announcement relationship fields |
| `frontend/src/contents/updates/corrections.ts` (new) | Parse localized correction sections and validate safe display nodes |
| `frontend/src/contents/updates/article-sources.ts` | Carry parsed localized notes and original blog category |
| `frontend/src/contents/updates/aggregate.ts` | Normalize version/date/event/note state, parity and diagnostics |
| `frontend/src/contents/updates/index.ts` | Export `selectLatestArticles(items: UpdateItem[]): UpdateItem[]` |
| `frontend/src/contents/updates/announcements.ts` | Explicit reviewed event classification and future note schema |
| `frontend/src/components/updates/ChangeDetails.tsx` (new) | Shared dates, badge and complete note presentation |
| `frontend/src/components/updates/UpdateCard.tsx` | Consume shared details on home Updates and full Updates pages |
| `frontend/src/app/(site)/page.tsx`, `en/page.tsx`, `zh/page.tsx` | Replace fixed previews using inventory; retain article markup/style and localized CTA |
| `frontend/src/i18n/dictionaries/ja.ts`, `en.ts`, `zh.ts` | Equivalent badge/date/missing-note labels and dictionary type |
| `frontend/package.json`, `frontend/package-lock.json` | Reviewed direct parser dependency declarations only |
| The exact 40 MDX files in the removal manifest | Delete only the true noIndex frontmatter line; preserve all other bytes |
| `frontend/src/contents/blog/__tests__/localized-blog-indexing.test.ts` (new) | Exact-scope source checks, actual metadata/robots and sitemap coverage for all target locales |
| `frontend/src/contents/updates/__tests__/{corrections,latest-articles}.test.ts` (new) | Parser, selection and real-source regression coverage |
| Existing `__tests__/{article-sources,aggregate,announcements}.test.ts` in that directory | Extend source/parity/event tests, retain old assertions |
| `frontend/src/components/updates/__tests__/updates.test.tsx` | Extend shared-card rendering coverage, retain old assertions |
| `docs/aidd/tasks/latest-content-announcements.json` | Future reviewed exact scope/acceptance revision, append current repair-history clarification |

Planned types (declare in `types.ts`; no raw HTML/JSX evaluation):

```ts
type EventKind = "new" | "update";
type NoteInline =
  | { type: "text" | "code"; value: string }
  | { type: "strong" | "emphasis"; children: NoteInline[] }
  | { type: "link"; href: string; children: NoteInline[] };
type NoteBlock =
  | { type: "paragraph"; children: NoteInline[] }
  | { type: "list"; ordered: boolean; items: NoteBlock[][] };
type CorrectionEntry = { date: string; blocks: NoteBlock[] };
type ParsedCorrections = { entries: CorrectionEntry[]; errors: string[] };
type ChangeNotes =
  | { status: "available"; entry: CorrectionEntry }
  | { status: "missing" }
  | { status: "not-applicable" };
```

`ArticleTranslation` gains `correctionNotes?: ParsedCorrections` and `blogCategory?: string` (existing absent fields mean no notes). `UpdateItem` gains required `eventKind`/`changeNotes`, optional article `publishedAt`/`updatedAt`/`blogCategory`. Existing `corrects`/`corrections` remain relationship IDs. `Announcement` gains required `eventKind`, and each localized translation may carry `updateNotes: NoteBlock[]`; updates require nonempty equivalent-language notes. Input fixtures may need fields added; their prior assertions and identities must remain.

## Review focus

1. Same-day correction vs unchanged same-day publication: event classification must not confuse them (Task 2).
2. A correction heading inside a fenced example or an older dated entry: never presented as current notes (Task 1).
3. Scoped noIndex removal vs unrelated restrictions: only the 40 target files change; other noIndex, unpublished, future-date and locale restrictions remain effective (Task 0/2).
4. A very long bullet/source URL on a narrow card: complete text, safe links and keyboard access remain usable (Task 3/4).
5. One locale missing a current correction while dates agree: no translation fallback, misleading note or divergent badge (Task 2).

## Task 0: Restore the approved localized article indexing

**Files:** Only the 40 MDX manifest entries and new `frontend/src/contents/blog/__tests__/localized-blog-indexing.test.ts`; contract review is handled by the execution gate below. No production SEO helper, sitemap generator, locale switch or registry change is planned.

**Interfaces:** Test the existing `loadBlogContent(locale, slug)`, `createBlogDetailMetadataInput(locale, slug)`, `createPageMetadata(input)`, `getBlogSitemapRoutes()` and default `sitemap()` exports. Match the established imports in `blog-indexing-policy.test.ts`; do not replace them with a test-only model of expected robots behavior.

- [ ] Complete approval, recoverable backup and reviewed baseline preparation before editing. Derive an exact 40-path set from the manifest; assert each file contains exactly one `noIndex: true` in frontmatter. Store before-image hashes for all content files, registry, SEO helpers, locale gate and sitemap generator, including the 20 Japanese counterparts. Unexpected state stops this task.
- [ ] Write RED tests for every target slug and en/zh: frontmatter has no noIndex key after removal; actual page metadata has `robots.index === true` and `robots.follow === true`; the base `/blog/<slug>` appears once in the route template set, and `/en/blog/<slug>` and `/zh/blog/<slug>` each appear exactly once in the final sitemap with existing canonical/alternate conventions and unchanged lastModified. Verify all 20 Japanese counterparts retain their metadata and routes. The complete blog sitemap contains 26 blogs × 3 locales = 78 unique detail paths, with the same 78 paths as the verified baseline; the current generator expands the 26 Japanese route templates to all three locales even while 40 localized pages are noindex.
- [ ] Run the new focused file and retain behavioral RED from current false robots/missing sitemap paths. Add negative fixtures for an unrelated `noIndex: true`, unpublished, future-dated and sealed/missing route candidate: the existing recommendation gate must continue rejecting each. Assert `createPageMetadata` still returns index false for an unrelated noIndex input. Keep existing locale-seal tests and skips; do not change the global gate or turn off restriction checks to pass.
- [ ] Delete only the identified true noIndex line from each manifest file. Preserve line endings, all remaining frontmatter/body bytes and dates. Do not set the flag false globally, alter registry values, clear other file flags or change Japanese sources.
- [ ] Run focused tests to GREEN; compare each target against its before-image with exactly that line removed. Hash-check all other content sources, Japanese counterparts, registry and SEO/gate implementation files unchanged. Record the exact set of 40 modified content paths. Any unexpected SEO-helper change requires diagnosis and revised scope approval, not an opportunistic fix.

## Task 1: Extract correction entries without altering article bodies

**Interfaces:** `parseCorrectionNotes(body: string, locale: Locale): ParsedCorrections` in `corrections.ts`; consumes plain MDX source as data, produces only the restricted types above.

- [ ] After the approval/baseline gate below, add `corrections.test.ts`: `parses complete localized current entry` asserts the full free-tier bullet and all three source URLs survive in each locale; `retains separate dated entries` asserts older/newer entries remain distinct; `ignores headings in code fences`; `rejects invalid/duplicate dates`; `reports unsupported nodes and unsafe links` checks HTML/JSX, javascript/data/protocol-relative links and unsupported structures are diagnosed, never executed or silently stripped. Allow HTTP(S) and safe site-local paths; reject traversal and control-character URLs.
- [ ] Run the focused Vitest file with the approved toolchain and save intentional RED assertions. Do not count a dependency/setup crash as the required behavioral RED.
- [ ] Implement AST parsing with the approved direct dependencies. Find the exact localized H2 until the next H2, group H3 dates, preserve all paragraphs/lists and inline semantics. Unsupported syntax marks the entry unavailable with a diagnostic; an absent section is an empty successful parse. Do not use nested frontmatter metadata: the existing frontmatter loader does not support that schema.
- [ ] Extend `article-sources.test.ts` to assert localized note extraction/category and unchanged metadata conflict/noIndex behavior; run RED before modifying the reader. Carry source paths in diagnostics at the reader boundary.
- [ ] Run the two focused files to GREEN and review diff. Beyond Task 0's exact flag removals, do not modify MDX, rewrite notes or synthesize correction dates.

## Task 2: Normalize events and select the latest eligible articles

**Interfaces:** Existing `aggregateUpdates(input: AggregateInput): UpdateInventory` returns extended `UpdateItem`; `selectLatestArticles(items: UpdateItem[]): UpdateItem[]` filters `category === "blog"`, orders by effective date descending/ID ascending and returns at most three without mutating input.

- [ ] Add RED assertions in `aggregate.test.ts`: same publication/update day without notes → New; same day with matching valid notes in all locales → Update; later update → Update with both dates; no updatedAt → publication; malformed updatedAt stays excluded; future versions remain excluded. New/Update never expires when `today` advances.
- [ ] Add note-state tests: exact updated date selects the entire matching entry; older-only or future note does not substitute; empty/malformed/unknown-date entry yields missing disclosure plus diagnostic; one locale missing current entry yields missing disclosure for all three. Same-day unaligned notes yield a consistent Update event plus missing disclosure/diagnostic, not a false assertion of untouched publication. All-locales absent notes on same day stays New. Preserve old history and distinct announcement correction links.
- [ ] Extend announcement tests: missing explicit kind is diagnosed; `update` requires notes in all locales; `corrects` with `new` is rejected; missing/cyclic correction targets still fail. Set the agreed SAA classification to `new`. Validate note nodes/links through the same safe model as article notes.
- [ ] Add `latest-articles.test.ts`: interleave announcements/architecture and four eligible blogs, assert explicit newest three IDs, stable same-day tie, fewer-than-three/empty and immutable input. Add real-source assertions for 2026-11-13 after Task 0: 52 items per locale with identical ordered IDs; expected latest IDs `blog:blog-002`, `blog:blog-008`, `blog:blog-015`, all Update, each with full current notes; blog-026 fourth. All blog-006–025 qualify after removal. Independently assert all 20 registry publication dates remain June 7 and no target en/zh frontmatter retains the removed key. A synthetic eligible June 7 article outranks an eligible June 1 article; unrelated noIndex/unpublished/future/missing-locale fixtures still do not consume a slot.
- [ ] Run those focused tests to show RED; implement normalization/selector, then GREEN. Preserve mixed timeline sorting and existing public-path/locale/identity/date gates. A parser issue adds diagnostics, not a silent removal of otherwise eligible articles.

## Task 3: Render shared full details on all approved surfaces

**Interfaces:** `ChangeDetails({ item, locale }: { item: UpdateItem; locale: Locale })` renders semantic dates, event label, complete safe note blocks or missing-note disclosure. It owns no sorting or fetching. `not-applicable` renders no missing-note warning. Existing article title/category/CTA and UpdateCard relationship links remain separate.

- [ ] Extend `updates.test.tsx` with RED cases for all three locales: New publication; Update publication + update `<time dateTime>`; same-day Update; full multi-bullet text/source URLs; missing disclosure; no expiry; distinct announcement date; retained original/correction links. Use exact source bullet text, not a substring that would pass truncation. Test unknown/unsafe nodes cannot render executable markup.
- [ ] Implement `ChangeDetails.tsx` with escaped React text, semantic lists/links, accessible badge text and no whole-card anchor wrapping nested links. Add dictionary labels and type definitions consistently. Preserve paragraph/list meaning and full URLs' targets; use wrapping rather than ellipsis. No raw `dangerouslySetInnerHTML` or MDX compilation.
- [ ] Replace each home fixed `blogPreviews` with `selectLatestArticles(getUpdatesInventory().itemsByLocale[locale])`; compute a page inventory once and reuse it for Updates. Render localized title/summary, existing blog category and CTA target from the normalized item. Use the same details component in article cards and UpdateCard; full updates pages already consume UpdateCard.
- [ ] Run focused tests to GREEN. Confirm source date fields remain unchanged and article/updates layouts retain the approved styling and heading hierarchy. Review any current fixed-preview test expectation before replacing it; retain unrelated assertions.

## Task 4: Whole-candidate verification, review and PR 349 delivery

- [ ] Complete the protected-test/contract review and rebaseline procedure below. Use the existing Node 22.13.0/npm 10.9.2 toolchain; no silent system-Node substitution.
- [ ] Run all seven AIDD checks for the revised baseline and candidate. Independently record lint, typecheck, full Vitest results/skips, static build, locale seal and HTML language results from that candidate. The previous 242 pass/22 pending and 26 Harness tests are historical reference, not current proof; no new skips or assertion removal.
- [ ] Inspect the actual generated HTML for all 40 en/zh detail pages: robots allows index/follow, no contradictory noindex directive, correct locale/canonical/alternates; inspect exported sitemap XML for all 40 target localized paths and unchanged dates. Compare unrelated existing routes/robots restrictions with the before-build manifest. Expected blog URL set remains 78; no other content family gains authorization. Module-level assertions alone are insufficient evidence of the exported result.
- [ ] Extend the existing browser acceptance evidence for ja/en/zh home and full updates at widths 390, 768, 1440 and boundary widths 639, 640, 1023, 1024. Assert expected IDs/order, dates, labels, full bullets, source URLs, missing notes, no overflow/overlap and no truncation. Include long translated bullet and long URL fixtures, plus 200% text zoom. Allow only content-driven height changes; preserve panel padding/radius/gaps/colors and unrelated home sections.
- [ ] Use a fresh browser context per independent scenario; preserve state within each keyboard flow. Retain the prior duplicate-header/footer-link regression fixtures and unchanged 30-second navigation/network-idle limit. Tab/Enter through every article, source and timeline relationship link; verify visible focus, semantic headings/time/list elements and text contrast.
- [ ] Review the complete diff, TDD evidence, three-language equivalence, screenshots, retained assertions, source/export manifests, exactly scoped noIndex removals, preserved unrelated flags/dates and repair ledger using applicable review skills. Human acceptance of the final implementation remains separate from accepted design and agent/automated review.
- [ ] Only after applicable publication authorization: selectively stage approved paths, update the **existing branch and PR 349**, rewrite its description around final behavior and actual verification, and inspect resulting CI/Preview status. No new PR, force push, master push, auto-merge, merge or production deployment. Preview authentication limits must be disclosed rather than bypassed. No commit or external PR update occurs during this planning round.

## Protection and AIDD execution gate

- Before future changes, recheck machine/path/branch/HEAD, index, untracked/ignored local files and running processes. Stop on unknown concurrent drift. Record hashes and recoverable before-images outside the affected files, including `.gitignore`, the whole `.serena/` (including ignored local configuration), root rule files, relevant product/tests/lockfile and evidence. Test backup readability, manifest completeness and recovery into a separate directory before modifying originals.
- Keep the existing external backup `C:/Users/vince/Desktop/aws-home-sections-backup-2026-11-12T15-03-32-338Z`, `tmp/home-top-sections-implementation-20261112/` and `tmp/latest-content-announcements-evidence/` intact. This turn does not reverify that old backup or claim new backup creation.
- The existing contract's dated note records an earlier repair count of 10. Retain it as history and append the later actual-12 record from `tmp/home-top-sections-implementation-20261112/final-verification.json:296`; do not overwrite history or increase `maxRepairs: 3`.
- This plan is new scope drift relative to the sealed candidate. After approval, review an exact contract revision adding this plan, `frontend/package-lock.json`, the new localized indexing test and each of the 40 explicit MDX paths, in addition to the already allowed updates/home/dictionary/package paths. Do not authorize the whole contents directory. Update acceptance to require 52-item parity, 002/008/015 selection and actual SEO output; review dependency changes and protected files before rebaselining. Do not run the old contract and mislabel known planned drift as an unexpected defect.
- Keep task `latest-content-announcements-b-v2-2026-11-12` and bundle `tmp/latest-content-announcements-evidence`. First review/rebaseline the approved plan/contract/dependency preparation and establish a passing baseline with existing assertions before feature work. After TDD, independently review changed protected tests and the final source snapshot, then review/rebaseline and verify baseline/candidate again as required. Do not invent a new task/bundle to bypass history.
- Keep all original test identities/assertions. Where a fixed-preview or real-source exclusion expectation is genuinely superseded, use documented one-to-one `assertionReplacements` reviewed against the accepted design; preserve generic noIndex exclusion checks using explicit negative fixtures. No weakening, deletions or new skips. The prior unimplemented plan's 002/026/001 and preserved-40-flags assertions are superseded in this document, not new tests to add. A review is bound to its source manifest and previous task hash; source drift invalidates it and requires fresh review.
- Use `review-rebaseline` to prepare the review record, obtain the applicable independent review, then `rebaseline`; do not treat generating a JSON file as approval. Save outputs under a new ignored evidence subdirectory, leaving prior passing/failing runs untouched.

Future command templates (from repository root, after approval; `$node` is the explicit existing toolchain executable):

```powershell
$node = Join-Path (Get-Location) 'tmp/latest-content-announcements-toolchain/node-v22.13.0-win-x64/node.exe'
$env:PATH = (Split-Path $node) + ';' + $env:PATH
Push-Location frontend
try {
  # Run the task's focused command separately for RED and GREEN; stop on unexpected failure.
  & $node node_modules/vitest/vitest.mjs run src/contents/blog/__tests__/localized-blog-indexing.test.ts
  & $node node_modules/vitest/vitest.mjs run src/contents/updates/__tests__/corrections.test.ts
  & $node node_modules/vitest/vitest.mjs run src/contents/updates/__tests__/article-sources.test.ts
  & $node node_modules/vitest/vitest.mjs run src/contents/updates/__tests__/aggregate.test.ts src/contents/updates/__tests__/announcements.test.ts src/contents/updates/__tests__/latest-articles.test.ts
  & $node node_modules/vitest/vitest.mjs run src/components/updates/__tests__/updates.test.tsx
} finally { Pop-Location }
& $node tools/aidd/cli.mjs review-rebaseline tmp/latest-content-announcements-evidence docs/aidd/tasks/latest-content-announcements.json 'Approved PR349 dates and notes scope; retain all original evidence'
# Save and independently review the generated record before:
& $node tools/aidd/cli.mjs rebaseline tmp/latest-content-announcements-evidence PATH_TO_REVIEWED_RECORD
& $node tools/aidd/cli.mjs verify tmp/latest-content-announcements-evidence baseline
& $node tools/aidd/cli.mjs verify tmp/latest-content-announcements-evidence candidate
```

All focused test commands must end with the named tests passing and zero failures after their recorded intentional RED. Baseline/candidate must complete every required check successfully. Any unexpected baseline/Harness/test failure pauses implementation for diagnosis; if correction would be attempt 13, report cause, exact proposed correction and risk and obtain explicit authorization before editing. Plan approval alone does not grant that exception.

## Verification matrix and expected evidence

| Layer | Cases / exact expected outcome | Owner |
| --- | --- | --- |
| Source scope | Exactly 40 enumerated en/zh lines removed; all other content bytes/dates and Japanese files unchanged | Task 0 before-image comparison |
| Actual SEO | 40 target metadata objects + 40 exported pages allow indexing; blog sitemap remains 78 paths; unchanged canonical/locale/date semantics | Task 0 tests + Task 4 export inspection |
| Restriction regression | Unrelated noIndex remains noindex; unpublished/future/missing locale/closed path remains ineligible; locale gate and existing seal tests preserved | Task 0/2 and full suite |
| Three-language inventory | 52 identical ordered IDs per locale; 26 eligible blogs; latest 002/008/015; all three Update; home Updates remains SAA/arc-007/arc-011 | Task 2 |
| Date/event semantics | Published and updated dates shown correctly; same-day correction vs first publication; no expiry; stable ID ties; no invalid-date fallback | Task 2/3 |
| Full correction fidelity | All three surfaces use identical current entry per ID/locale; complete bullet wording, paragraphs and source links; 002/008 one bullet + three links, 015 two bullets + five links | Task 1/3/4 |
| Missing/history/parity | Missing-note disclosure for updated articles lacking current notes; no invented history or cross-language fallback; old entries not substituted | Task 1/2/3 |
| Parser/link safety | Code fences, invalid/duplicate dates, HTML/JSX, unsupported nodes, unsafe schemes/control characters/traversal diagnosed and never executed | Task 1/3 |
| Responsive/accessibility | Three locales × home/full updates × seven widths; long text/URLs, 200% text zoom, all links keyboard operable, visible focus, contrast, time/list/heading semantics | Task 4 |
| Whole candidate | All seven AIDD checks, unchanged skip allowance, reviewed test/contract/lockfile changes, retained actual-12 ledger, independent review | Task 4 |

## Planning verification and handoff

Self-review covers accepted requirements → Tasks 0–4, exact 40-file manifest, interface consistency, all five review-focus cases, source references, removal of obsolete flag-preservation expectations, preservation and approval boundaries. This document is the only planned write in this round. Product tests/build are deliberately deferred until execution approval; no current-candidate pass claim is made.

Recommended execution is native task-by-task implementation because the parser, normalization and shared rendering depend on one data model; independent final review remains required. Remaining gate: user confirmation of this revised executable plan, including direct parser dependencies/lockfile review and missing-note diagnostic handling. The approved mock, 40-file removal direction and expected three cards do not need to be reopened. No repair 13 exception or new publication/merge/production permission is granted by this document. Coordinator review is not a substitute for plan approval.
