# Latest Content and Announcements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task; use superpowers:subagent-driven-development only if delegation is separately authorized. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved B design v2: one trilingual timeline combining current learning articles with manually maintained question-bank and feature announcements.

**Architecture:** Build a locale-independent eligible inventory, then localize the same sorted items for all three pages and home previews. Read existing article metadata and actual localized bodies without fallback; keep announcements in a small separate registry. Capture the Asia/Taipei date once before Next's build workers start.

**Tech Stack:** Existing Next.js 16.2.6, React 19.2.4, TypeScript, Tailwind, Vitest, Node build scripts and static export. No new dependency or service.

**Spec:** The approved B detailed design v2 and approved first SAA announcement are reproduced below as the implementation contract. User approval of that design authorizes this planning stage only. This plan awaits coordinating reviewer 柚子 and explicit user approval before execution.

## Global Constraints

- Work in `C:\Users\vince\Desktop\project\aws-cert-roadmap-lab`, FUMI. Planning baseline is master at `6c66041341b92310a48a784598ea8fc4be38a62b`.
- Preserve `.gitignore`, all `.serena/` files, ignored `AGENT.md` and `AGENTS.md`, and concurrent work. No restoration of old updates-center code or another backup audit is part of this plan.
- Follow AGENT.md: design → explicit approval → plan → implementation with TDD → overall testing → review. Material design changes require renewed approval.
- Planning changes only this document. All commands below are **pending execution**, not evidence of passing tests or installed tools.
- No toolchain installation, product tests/build, feature implementation, commit, push, PR, merge or deployment is authorized by the planning turn.
- No new database, backend, login, subscription, crawler, schedule, polling, dependency, AWS infrastructure, issue #348 work or unrelated learning-content correction.
- Three repairs remain a task-wide ceiling under existing rules; baseline/Harness fixes and interrupted corrections count. Do not reset history. A fourth needs explicit approval.
- Native execution is recommended because tasks share the same types and aggregate contract. No agents are dispatched by this plan; execution method remains subject to approval.

## Review Focus

1. Midnight during a multi-worker build must not change eligibility between pages: Task 1 tests one captured date inherited by all workers.
2. Missing translations must not silently become Japanese content: Task 2 tests missing/empty bodies and fallback-prone metadata APIs.
3. Duplicate IDs and malformed correction graphs must not produce unstable cards or broken history: Task 3 tests duplicates, dangling/self/cyclic corrections.
4. Future updated dates must not expose an article using its older publication date: Task 2 tests omission rather than fallback.
5. A public-looking link may be sealed or absent from the actual export: Tasks 3 and 6 test eligibility and exported destinations.

## Approved design snapshot

### Content, dates and eligibility

- Title: `最新內容與公告` / `最新コンテンツとお知らせ` / `Latest Content and Announcements`.
- One mixed list with five reader categories: blog, architecture, comparison, question-bank announcement, feature announcement. Articles show Published or Updated; announcements show Announced, with localized labels.
- Approved zh introduction: `依文章發布或更新日期與公告日期，查看最近的學習內容、題庫與網站功能消息。文章清單顯示目前版本，並非完整修訂歷史。` Translate the same meaning into ja/en during implementation; translation review is required.
- Article `publishedAt` is required. Dates must be real calendar dates in `YYYY-MM-DD` form. Missing `updatedAt` or equality with publication means Published; a later valid update means Updated. Invalid dates, update-before-publication or conflicting explicit metadata exclude the item and produce internal diagnostics. Resolve unexpected diagnostics before release acceptance, not by substituting today.
- Future publication, announcement or effective update dates omit the item entirely. Do not fall back to an older publication date. Existing article routes remain unchanged.
- Today is Asia/Taipei, captured once for the entire build. Changes become visible only after rebuilding and deploying, without scheduled publication.
- Sort descending effective date; on equal date, announcements precede articles; within each source group, sort qualified stable IDs ascending using deterministic code-point comparison, not localized titles.
- Article identity uses type plus existing ID; slug supplies its route. Each article has one card representing its current version. This is not a complete revision archive; existing correction text remains intact.
- Source article dates from existing registry/JSON/MDX, without duplicate date storage. Blog registry dates are authoritative; explicitly conflicting MDX dates produce diagnostics.
- Eligibility requires actual ja/en/zh entries and nonempty actual localized bodies, publication flags, consistent identity/date data, and open locale gates. Do not call a fallback result a translation. Any locale's `noIndex` excludes the automatic recommendation; this is a recommendation policy, not a redefinition of publication.
- All locales have identical IDs, dates, order and home-preview selection. Missing translation, unpublished state or date mismatch excludes the whole item and reports a diagnostic.

### Announcements and history

- Manual fields: stable ID, question-bank or feature category, date, published flag, ja/en/zh titles and summaries, shared unprefixed target paths with localized link labels, optional `corrects` ID.
- No manual article announcements in v1. Question-bank announcements require at least one actual public same-locale link. Feature announcements may have no links and then render as plain text without a fabricated button.
- Typo/format/link repair retains ID/date. Substantive correction adds a new announcement referencing the original; retain the original and display its correction link. Retirement is a new announcement. Never bump dates to promote an item.
- Link targets must be actual public localized routes, not unpublished or sealed content. Validate again against the built export.

### Pages and presentation

- Routes: `/updates`, `/en/updates`, `/zh/updates`. Full list, without pagination, filters or search.
- Home preview immediately after Blog and before Portfolio Architecture, using the first three items from the same combined list. No reserved announcement quota and no pinning.
- Add a Footer siteInfo link. Language switching stays on the corresponding updates page.
- Localized empty state; zh: `目前尚無可顯示的內容或公告`.
- Reuse white-card styling: mobile single column, desktop home three columns. Use semantic headings, readable text labels, `<time dateTime>`, descriptive links and visible focus. No horizontal overflow or nested main landmarks.
- Reuse canonical, hreflang, html-lang and sitemap release-gate policies. Do not use build time as a content modification date.

### Exact approved first announcement

Only one initial manual announcement: `saa-c03-051-060`, category `question-bank`, date `2026-11-09`, published true, link target `/questions/saa` localized using existing routing. This is ten questions (051–060) translated into three languages, not thirty distinct questions. The announcement date is the approved publication date, not the implementation date.

| Locale | Title | Summary |
| --- | --- | --- |
| zh | 新增 10 道 SAA-C03 情境題 | 新增 10 道 SAA-C03 情境題，提供繁體中文、日文與英文版本，附四個選項、正確答案及逐項解析。 |
| ja | SAA-C03のシナリオ問題を10問追加 | SAA-C03のシナリオ問題を10問追加しました。日本語・英語・繁体字中国語で、4つの選択肢、正解、各選択肢の解説を確認できます。 |
| en | 10 new SAA-C03 scenario questions | Added 10 SAA-C03 scenario questions in Japanese, English, and Traditional Chinese, with four choices, the correct answer, and explanations for each choice. |

Use descriptive localized link labels meaning “View SAA-C03 questions”; reviewers verify translations. Automatic articles include all eligible current articles, not a fixed historic set of six candidates.

## File map and shared interfaces

All paths below are relative to the repository root. New files are proposed, not already implemented.

| Files | Responsibility |
| --- | --- |
| `frontend/scripts/build-with-updates-date.mjs` (new), `frontend/package.json` (modify) | Capture date and launch Next build; retain existing HTML-language and locale-seal post-build commands |
| `frontend/src/contents/updates/types.ts` (new) | Shared candidate, announcement, diagnostic and localized item types |
| `frontend/src/contents/updates/dates.ts` (new) | Strict calendar-date validation and build-date access |
| `frontend/src/contents/updates/article-sources.ts` (new) | Read original article metadata and localized bodies, without fallback |
| `frontend/src/contents/updates/announcements.ts` (new) | Approved initial manual record only |
| `frontend/src/contents/updates/aggregate.ts` (new) | Eligibility, diagnostics, history relationships, sorting and localization |
| `frontend/src/contents/updates/index.ts` (new) | Server-side facade joining source reads with the pure aggregate |
| `frontend/src/components/updates/UpdateCard.tsx`, `UpdatesSection.tsx`, `UpdatesPage.tsx` (new) | Shared card, home preview and full-list presentation |
| `frontend/src/i18n/dictionaries/{ja,en,zh}.ts` (modify); `index.ts` only if exports require it | Typed updates copy, navigation label and Footer siteInfo link key |
| `frontend/src/app/(site)/{page.tsx,en/page.tsx,zh/page.tsx}` (modify) | Home placement and shared first-three selection |
| `frontend/src/app/(site)/{updates/page.tsx,en/updates/page.tsx,zh/updates/page.tsx}` (new) | Thin locale-specific full pages and metadata |
| `frontend/src/app/sitemap.ts` (modify) | Add static `/updates` route through existing localized sitemap helpers |
| `frontend/src/contents/updates/__tests__/{dates,article-sources,aggregate,announcements,build-date,routes}.test.ts` (new) | Pure, source, build-wrapper and integration contracts |
| `frontend/src/components/updates/__tests__/updates.test.tsx` (new) | SSR markup contracts with existing react-dom/server and Vitest |
| `docs/aidd/tasks/latest-content-announcements.json` (new, only after contract approval) | Task-specific acceptance contract and original evidence identity |

Read-only integration references: `blog/blog-detail-data.ts` and `blog/blog-content-loader.ts`, architecture/comparison detail-data and content-loader files under `frontend/src/app/(site)/`; existing content JSON, `frontend/src/contents/blog/blogPosts.ts`, `frontend/src/types/{blog,architecture,comparison}.ts`, `frontend/src/i18n/{locales,release-gate}.ts`, `frontend/src/lib/seo.ts`, `frontend/src/components/layout/Footer.tsx`. Do not change legacy article loaders or content to make this new view pass.

Define `Locale = 'ja' | 'en' | 'zh'`, `ArticleKind = 'blog' | 'architecture' | 'comparison'`, `AnnouncementKind = 'question-bank' | 'feature'`, and `DateLabel = 'published' | 'updated' | 'announced'` in types.ts, reusing existing Locale where exported.

- `ArticleCandidate`: kind, id, slug and `translations: Partial<Record<Locale, ArticleTranslation>>`; each translation carries title, summary, publishedAt, optional updatedAt, published, noIndex, bodyPresent and explicit-date-conflict evidence.
- `Announcement`: id, category, date, published, `translations: Record<Locale, {title: string; summary: string}>`, `links: Array<{path: string; labels: Record<Locale, string>}>`, optional corrects.
- `UpdateItem`: qualified id, category, date, dateLabel, title, summary, localized links and optional correction relationship IDs. Card anchors use stable announcement IDs so both directions can link within each locale's full page.
- `Diagnostic`: code, qualified id, optional locale and source path; never include credentials or whole content bodies.
- `UpdateInventory`: `itemsByLocale: Record<Locale, UpdateItem[]>`, diagnostics. Identical ordered IDs/dates across locales is an invariant.
- `aggregateUpdates(input: {articles: ArticleCandidate[]; announcements: Announcement[]; today: string; isPublicPath: (path: string, locale: Locale) => boolean}): UpdateInventory` is pure.
- `readArticleCandidates(): ArticleCandidate[]` reads actual sources. `getUpdatesInventory(): UpdateInventory` combines them with announcements and the captured date. `selectHomeUpdates(items: UpdateItem[]): UpdateItem[]` returns `items.slice(0, 3)`.

## Task 0: Execution authorization and source protection

- [ ] Obtain 柚子 review and explicit user plan approval. Approval of this document must specifically acknowledge the proposed package build-entry/script changes; these are AIDD-protected files.
- [ ] Before implementation, record fresh HEAD, index, status and hashes of existing dirty/ignored rule and Serena files. Protect concurrent work; do not stage it, clean it, reset it or silently change checkout/branch. Resolve branch strategy before an authorized commit.
- [ ] Confirm the installed toolchain against AIDD's Node 22.13.0/npm 10.9.2 requirements. Source presence is not installation evidence. If unavailable, stop for the separate tooling scope; do not install it as an incidental step.
- [ ] Prepare and obtain approval of the new task contract and unique task ID using the existing schema. Preserve all repair evidence. The contract must map acceptance below to checks; do not invent a quota reset or reuse another task's identity.
- [ ] Initialize local evidence and run the unchanged baseline only after execution/installation is authorized. A failing baseline blocks feature implementation. Protected build-entry changes need reviewed rebaseline under the existing CLI rules before candidate verification; do not edit the profile, remove assertions or relax checks. If existing rebaseline rules cannot accommodate the change, stop and report rather than bypass protection.

## Task 1: Strict dates and one build-wide clock

**Files:** dates.ts, types.ts, build-with-updates-date.mjs, package.json; dates.test.ts and build-date.test.ts.

**Interfaces:** `isCalendarDate(value: string): boolean`; `getUpdatesBuildDate(): string`. Wrapper exports `captureBuildDate(now: Date): string` and a testable launch function accepting a child-process runner; execute only when invoked as CLI.

- [ ] Write failing date tests: 2024-02-29 accepted; 2026-02-29, 2026-02-30, month 13, non-padded strings and timestamps rejected. Assert invalid production build-date input fails explicitly.
- [ ] Write failing wrapper tests with a fake runner: `2026-11-11T15:59:59Z` captures 2026-11-11 and `16:00:00Z` captures 2026-11-12. A simulated clock crossing midnight after launch must leave every child's `UPDATES_BUILD_DATE` identical; propagate nonzero child exit.
- [ ] Pending red command from frontend: `npm test -- src/contents/updates/__tests__/dates.test.ts src/contents/updates/__tests__/build-date.test.ts`. Confirm intended missing behavior, not an unrelated setup failure.
- [ ] Implement strict date helpers and wrapper. Compute date once using Intl with `Asia/Taipei` and formatToParts; spawn installed Next's CLI via the current Node executable with `shell: false`, inherited environment plus the captured variable. Resolve the CLI from the installed package, not a global executable. Do not write the date to a tracked file or expose it as public content.
- [ ] Replace only `next build` in package build with `node scripts/build-with-updates-date.mjs`; retain `&& node scripts/set-html-lang.mjs && node scripts/verify-locale-seal.mjs`. No dependency/lockfile edits. Production rendering requires the valid captured variable; local dev can capture once per process, explicitly not a production publication clock. Pure tests inject today directly.
- [ ] Repeat the targeted command for green, then refactor without changing the contract. Record the protected-file diff for review/rebaseline. Tests must not actually invoke Next build during the wrapper unit test.

## Task 2: Article source adapter and trilingual eligibility

**Files:** article-sources.ts, aggregate.ts, types.ts; article-sources.test.ts and aggregate.test.ts.

**Interfaces:** `readArticleCandidates()` and the article branch of `aggregateUpdates()` defined above. Metadata adapters must preserve absence rather than synthesize translations.

- [ ] Write fixture-based failing tests covering each article type: real nonempty bodies in all locales, one missing/empty body, one unpublished locale, one noIndex locale, inconsistent IDs/slugs/dates, and localized title/summary absence. All rejected records must be absent in all three lists with a diagnostic.
- [ ] Write date/ordering assertions: missing/equal update gives published; later update gives updated; update-before-publication and invalid publication excluded; future publication/update excluded without fallback. Reverse input order and localized titles; output IDs must remain stable. Reject duplicate qualified IDs, while equal raw IDs in different article kinds remain distinct.
- [ ] Add blog fixture asserting registry date is used and a conflicting explicit MDX date excludes the record. Add architecture/comparison fixtures proving missing localized JSON or MDX cannot invoke a Japanese fallback. Parse any explicit source publication/noIndex metadata rather than losing it through body-stripping loaders.
- [ ] Pending red command: `npm test -- src/contents/updates/__tests__/article-sources.test.ts src/contents/updates/__tests__/aggregate.test.ts`.
- [ ] Implement reads from the existing registry/raw localized JSON and actual MDX sources. Reuse low-level body loaders where they preserve needed information; use existing gray-matter for explicit frontmatter inspection. Do not use fallback-prone getPublishedBlogPosts/getPublishedArchitectures as eligibility evidence. Use a joint three-locale candidate check, then derive localized cards from the same accepted records.
- [ ] Repeat targeted tests for green. Record real-source diagnostics for later acceptance; do not fix unrelated article content or alter existing article routing in this task.

## Task 3: Manual announcements, correction graph and mixed inventory

**Files:** announcements.ts, aggregate.ts, index.ts; announcements.test.ts and aggregate.test.ts.

**Interfaces:** Announcement and UpdateInventory above. Public-path resolver combines existing locale release gates with known published source routes; actual export validation remains Task 6.

- [ ] Add failing tests for the exact initial ID/date/category and all six approved title/summary strings. Assert the registry has exactly one initial record, ten question identities 051–060 exist in each source locale, and localized SAA index destinations resolve.
- [ ] Add failing cases: question announcement without a public link, one sealed locale, unknown destination, missing title/summary/link label, malformed/future date, unpublished announcement, feature with no links, duplicate ID. Required invalid announcement data produces diagnostics and exclusion; feature without links remains valid.
- [ ] Add history tests: a new valid correction keeps the original date/body/card; original exposes the correction link and correction references the original. Reject self-reference, missing target and cycles with diagnostics. Multiple valid corrections retain chronological history; a future/unpublished correction must not create a visible broken link on the original.
- [ ] Add mixed sort tests: same-day announcement precedes article; qualified IDs break ties independent of input order and locale. Assert each locale's ID/date sequence is equal and home equals the full list's first three, including zero, one and more than three entries.
- [ ] Pending red command: `npm test -- src/contents/updates/__tests__/announcements.test.ts src/contents/updates/__tests__/aggregate.test.ts`.
- [ ] Implement the approved single announcement, minimal graph validation and joint aggregation. Distinguish expected future/unpublished omissions from actionable content diagnostics in evidence. All actionable diagnostics must be resolved or explicitly reviewed before release; never print them into public copy.
- [ ] Repeat for green; expose getUpdatesInventory and selectHomeUpdates without client-side fetches or database access.

## Task 4: Shared cards, translated copy and home insertion

**Files:** UpdateCard.tsx, UpdatesSection.tsx, UpdatesPage.tsx, dictionary files, three existing home pages; updates.test.tsx.

**Interfaces:** `UpdateCard({item, locale}: {item: UpdateItem; locale: Locale})`; `UpdatesSection({items, locale}: {items: UpdateItem[]; locale: Locale})`; `UpdatesPage({items, locale}: {items: UpdateItem[]; locale: Locale})`. Home passes selectHomeUpdates; full page passes all items.

- [ ] Write failing SSR tests with renderToStaticMarkup: localized category/date labels, exact zh introduction and empty state, semantic time, unique headings/anchors, correct localized links, visible correction relationships, and linkless feature without a button or empty anchor.
- [ ] Add home composition assertions that the section follows Blog and precedes Portfolio Architecture in all three page modules and has exactly the selected IDs, without pinning or category quotas. Prefer rendered structural assertions over brittle whole-page snapshots.
- [ ] Pending red command: `npm test -- src/components/updates/__tests__/updates.test.tsx`.
- [ ] Implement shared components and typed dictionary copy. Use existing layout/color/spacing patterns, mobile one-column and desktop home three-column classes, focus styling and descriptive links. Render section/article landmarks within the existing page main. Add Footer siteInfo navigation key through dictionaries; modify Footer only if its existing generic mapping cannot handle that key, and review that extra diff.
- [ ] Insert the shared section into the three home pages. Repeat targeted tests for green. Styling tests do not substitute for manual browser acceptance in Task 6.

## Task 5: Full routes, locale switching and SEO

**Files:** three new updates page.tsx files, sitemap.ts; routes.test.ts.

**Interfaces:** Thin locale wrappers use getUpdatesInventory, UpdatesPage and existing createPageMetadata, localized URL and sitemap helper APIs. Use existing language-switch path mapping rather than new locale routing.

- [ ] Write failing route tests: all three wrappers pass their actual locale and identical ordered IDs/dates; home selections match. Verify canonical `/updates`, `/en/updates`, `/zh/updates`, corresponding hreflang and translated metadata titles/descriptions. Assert siteInfo links and language switching preserve `/updates`.
- [ ] Add sitemap tests: updates appears once per eligible locale, sealing removes disallowed locales, no build-time lastModified is fabricated. Leave lastModified absent for this index rather than treating the build date as a content edit.
- [ ] Pending red command: `npm test -- src/contents/updates/__tests__/routes.test.ts`.
- [ ] Implement wrappers and add `/updates` to getStaticRoutes through existing gate-aware sitemap helpers. Preserve existing SEO behavior and route policies; do not rewrite the global sitemap or article metadata.
- [ ] Repeat for green and review all changed route/dictionary imports for server-only filesystem code leaking into client bundles.

## Task 6: Overall verification and review handoff

**Files:** acceptance/evidence records in the approved local AIDD bundle; only task-scoped fixes after diagnosis and repair registration.

- [ ] Use verification-before-completion. After the required protected-file review/rebaseline, run the task's full unchanged AIDD candidate verification. Its seven checks are install, Harness, lint, typecheck, Vitest, build including locale seal, and HTML lang. Keep stdout/stderr, exit codes, assertions, skips, manifests and repair count. Baseline success cannot stand in for candidate success.
- [ ] Inspect all six exported home/full pages using the captured build date. Check identical full-list IDs/dates/order, first-three equality, exact approved announcement, actual exported link destinations and correction anchors. Any stale diagnostics, absent target or locale fallback blocks release acceptance.
- [ ] Inspect desktop 1440×900 and mobile 390×844 in all three locales: placement, readable cards, no horizontal overflow, keyboard focus/link activation, headings, empty-state fixture and plain-text feature fixture. Check exported html lang, canonical/hreflang, sitemap entries and gate behavior. Do not claim SSR tests prove visual or keyboard behavior.
- [ ] Recheck protected existing dirty files and Serena/rule hashes against Task 0; report any concurrent change without overwriting it. Review git diff --check, changed-file list, index and task scope. No broad staging.
- [ ] Use requesting-code-review, and receiving-code-review for feedback. Deliver diff, exact candidate SHA or uncommitted state, fresh checks, diagnostic inventory, screenshots/visual observations, repair history and limitations to 柚子 and the user. Automated review does not grant human acceptance.
- [ ] Stop for human acceptance and explicit applicable Git authorization. Commit/push/PR are not implicit in plan approval. Before any authorized push/PR, inspect remote/head/base, CI and Preview side effects; draft PR does not prevent deployment. Preserve exact-head checks after authorized submission. Do not auto-merge; merge and production deployment require their own applicable authorization.

## Pending command reference

Run targeted Task 1–5 commands from `frontend` only during authorized implementation. Red means the new assertion fails for its intended reason; green means all selected tests pass. No command in this section has been executed for this plan.

| Working directory | Command | Required result |
| --- | --- | --- |
| root | `node tools/aidd/cli.mjs init <approved-bundle> . docs/aidd/tasks/latest-content-announcements.json` | Approved task initialized; no reused/reset repair identity |
| root | `node tools/aidd/cli.mjs verify <approved-bundle> baseline` | BASELINE_READY, all seven checks pass |
| root | `node tools/aidd/cli.mjs review-rebaseline <approved-bundle> docs/aidd/tasks/latest-content-announcements.json "Reviewed build date entry and updates acceptance"` | Review snapshot only; inspect before applying under existing policy |
| root | `node tools/aidd/cli.mjs rebaseline <approved-bundle> <reviewed-snapshot-path>` | Reviewed revision retained with full prior evidence; then successful baseline |
| root | `node tools/aidd/cli.mjs verify <approved-bundle> candidate` | AUTO_VERIFIED_AWAITING_HUMAN, seven checks pass, no unexpected assertion/skip drift |
| root | `node tools/aidd/cli.mjs status <approved-bundle>` | Evidence intact, human acceptance still pending |
| frontend | `npm run lint` / `npm run typecheck` / `npm test` | Zero errors and expected test assertions pass; normally covered by AIDD, not gratuitously repeated |
| frontend | `npm run build` / `npm run check:html-lang` / `npm run check:locale-seal` | Static export and checks pass; normally covered by candidate build/checks |
| root | `git diff --check` | No new whitespace errors |

Angle-bracket paths denote the user-approved task bundle/snapshot chosen at execution, not literal command arguments. Rebaseline snapshot output must be saved and inspected exactly as documented by the CLI. If any operation leaves INTERRUPTED or STOP_UNCONFIRMED, preserve markers/evidence and reconcile before retrying.

## Acceptance and remaining gates

| Acceptance | Evidence owner |
| --- | --- |
| One fixed Taipei build date; real dates and future exclusion | Task 1 unit tests; Task 2 aggregate tests; Task 6 exported pages |
| All eligible articles, genuine translations, no Japanese fallback/noIndex recommendation | Task 2 fixtures and real-source diagnostic review |
| Single approved SAA announcement; public links and preserved correction history | Task 3 tests; Task 6 export link checks |
| One mixed order and identical three-item home selection in all locales | Tasks 3–5 tests; Task 6 exported-page comparison |
| Full pages, footer and language switch; accessible responsive display | Tasks 4–5 SSR tests; Task 6 desktop/mobile and keyboard review |
| Canonical/hreflang/html-lang/sitemap respect existing gates | Task 5 tests and Task 6 full verification |
| Existing work intact; no scope expansion or unauthorized release | Tasks 0 and 6 manifests/diff and explicit approval records |

Primary risks: existing metadata may produce previously hidden diagnostics; package/scripts changes require protected-file review; toolchain availability is unverified; build font/network dependencies can fail independently; SSR checks cannot establish visual acceptance. Stop and report these with evidence rather than silently broadening scope, weakening checks or revising the approved design.

Plan self-review: checked design coverage, file responsibilities, cross-task signatures, all five Review Focus cases, exact announcement copy, and separation of implementation/testing/review/release gates. No feature code or product verification is claimed by this document. Next action is 柚子 review and explicit user approval of this plan, not implementation.

## Approved home presentation addendum and publication scope (2026-11-12)

The user subsequently accepted the article-first teal/amber design, then the responsive spacing/corner mockups, explicitly requested a PR, and separately confirmed the implementation plan. The earlier planning-only restrictions above describe their original stage; this authorization permits implementation and, after validation/review, commit/push on a dedicated feature branch and PR creation. No merge, auto-merge or production deployment is authorized. Vercel Preview may run under existing rules.

Apply to Japanese, English and Traditional Chinese home pages: Hero → Latest Articles → Latest Content and Announcements → Learning Categories → Certification entry points → Portfolio Architecture. Move existing sections without changing text, item counts/order, links or selection logic. Latest Articles remains three fixed previews.

Both panel roots use24px corners and top/bottom padding32px below640px,40px at640–1023px,48px at1024px and above. Preserve maximum width1152px, horizontal padding16/24/32px, main-section gaps80px, article inner gaps32px, updates inner gaps24px, and card corners16px/padding24px. Hero is unchanged. No outer border or overflow clipping.

Article palette: section#DDF5EE, cards#FFFFFF, card borders/eyebrow/focus#0F766E, headings/hover#134E4A, body#334155, links/pill text#115E59, pill background#CCFBF1. Preserve delivered amber palette and full updates/blog page behavior. Verify keyboard focus and contrast on the actual surfaces.

Implementation sequence: capture before-images and full pre-change AIDD verification; retain existing SSR checks and demonstrate failing new three-locale order tests; demonstrate browser RED against the previous export; edit only three home files and UpdatesSection; demonstrate GREEN; review protected-test/contract changes and rebaseline with all historical assertions preserved; run full AIDD and browser verification at390/639/640/768/1023/1024/1440px; independent final review; selectively commit the authorized feature and required tests/docs and open a PR. Keep non-task .gitignore, .serena, AGENT.md/AGENTS.md and local toolchains/evidence out of commits.

Retain actual repairs10 (CLI3 plus authorized exceptions4–10). Exception10 only strengthens label-color, card-style and focus-clipping acceptance; user separately authorized it after review. No eleventh repair is authorized. Keep historical evidence; an unexpected issue needing another correction must stop for a decision. Successful local checks do not establish remote CI or human acceptance.
