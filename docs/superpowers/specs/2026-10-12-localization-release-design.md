# Localization Release Design

- Created: 2026-10-12
- Status: Awaiting document review after Fumi agreed to the design in conversation
- Scope: Preparing and deploying the `/en` and `/zh` release for `aws-cert-roadmap-lab`
- Related: #334 ACR-014, #305 P5-095, #323 ACR-013, #319 ACR-009

## 1. Purpose

Keep the Google AdSense resubmission on hold, complete the English and Traditional Chinese pages, and publish them to production. Enable the language-switching UI at release and make each language version available to search engines.

This release does not wait for an AdSense resubmission or its crawl grace period. Localization quality, URL reachability, SEO metadata, and successful CI are the release criteria.

## 2. Success criteria

1. The `/en` and `/zh` routes included in the release exist, and their generated HTML does not contain `noindex`.
2. Internal links between released routes do not return 404, and each locale's sitemap contains only existing URLs.
3. Language relationships are recorded reciprocally in sitemap hreflang entries. `x-default`, for unsupported languages, points to the Japanese version.
4. LanguageSwitcher works on desktop and mobile, and the selected language is identifiable visually and by screen readers.
5. `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` all succeed.
6. After production deployment, every public sitemap URL returns HTTP 200 and the released pages are indexable.

## 3. Current state and constraints

The GitHub branch tips checked on 2026-10-12 were `28ee0b0` for `master` and `bfd59e1` for `dev`. `dev` was 27 commits behind `master` and had no unique commits. The local branch at the start of work was `master`.

The previous work's shared question-detail page refactor remains uncommitted. Do not include it in the design-document commit. Preserve its content and review it as a separate change. Do not modify the pre-existing untracked `.claude/` directory either.

The release is currently gated by `LOCALIZED_ROUTES_PUBLISHED` being `false` in `frontend/src/i18n/release-gate.ts`. Setting it to `true` enables language switching, the localized sitemap, and locale-aware robots controls.

### 3.1 Verification of ACR-014 prerequisites

| Condition | Findings as of 2026-10-12 | Action |
|---|---|---|
| Remaining Japanese in Footer | #319 is closed. The current Footer uses dictionaries and localized links. | Regression-test the current rendering. |
| Japanese-derived vocabulary in `/zh/privacy` | Expressions such as “配信” and “目安” remain. These original-language specimens identify the terms needing review. | Proofread as Traditional Chinese. |
| `/en/roadmap` and `/zh/roadmap` | The pages are missing, although home and other pages link to them. #305 is open. | Create both language versions and complete #305. |
| Robots controls on six pages | They use `createLocaleAwareRobots()`. | Check index settings in generated HTML with the release flag enabled. |
| hreflang / `x-default` | Sitemap generation has language alternates, but they are gated. Current sitemap generation has no `x-default`. | Make the sitemap the single hreflang source of truth. |
| Page metadata alternates | `enableLanguageAlternates` is specified in only 2 of 46 `createPageMetadata` calls. | Avoid maintaining both HTML and sitemap versions; verify sitemap completeness. |
| Open Graph locale alternates | Settings differ between pages. | Retain each page's `og:locale` and decide whether to add `alternateLocale` based on social-sharing requirements. Do not make it a prerequisite for Google search publication. |

## 4. Design approach

### 4.1 Separate the release from AdSense resubmission

- Keep the resubmission, 14–28-day crawl grace period, and submission-date decision in #323 ACR-013 on hold.
- Preserve the completed production-reachability and static-HTML verification records in #323.
- #334 ACR-014 covers localization readiness, the LanguageSwitcher UX review, and the release go criteria.
- #334 currently excludes actually enabling the flag. Update its acceptance criteria and its division of responsibility with #323 to match the goal Fumi agreed to.

### 4.2 Source of truth for hreflang

Google Search Central describes HTML, HTTP headers, and sitemaps as ways to indicate localized pages, and states that combining methods provides no search benefit. This project therefore uses the existing localized sitemap as its single hreflang source of truth.

- Each locale version in the sitemap lists itself and the corresponding versions in other locales.
- Japanese-only pages, such as `/terms-of-service`, are limited to `availableLocales: ["ja"]`.
- Do not generate sitemap URLs or alternates for a language without a corresponding URL.
- Align sitemap generation and verification so `x-default` points to Japanese.
- Duplicating `alternates.languages` in HTML across all pages is not a release condition. Replace the relevant #334 checklist item with completeness verification of the chosen sitemap method.

Reference: [Google Search Central: Localized Versions of your Pages](https://developers.google.com/search/docs/specialty/international/localized-versions)

### 4.3 Routes and language switching

- Implement `/en/roadmap` and `/zh/roadmap` from #305 to satisfy existing links in home pages, navigation, and elsewhere.
- Verify `LanguageSwitcher` in a browser: desktop rendering, mobile drawer rendering, current-language identification, keyboard focus, and accessible names.
- During UI review, change the release flag locally only. Keep production gated until preparation is complete.

## 5. Work sequence

1. Preserve the uncommitted question-detail refactor and separate it for review rather than mixing it with the design document.
2. Reconfirm that `dev` is 27 commits behind `master` with no unique commits, then incorporate the latest `master` into the working base according to repository practices.
3. Update #334's acceptance criteria and record the status of the six items, LanguageSwitcher UX findings, and separation from the AdSense resubmission gate.
4. Implement `/en/roadmap` and `/zh/roadmap` to resolve #305 and the missing link destinations.
5. Proofread `/zh/privacy` and audit routes, links, and page-content coverage across every locale included in the release.
6. Establish the sitemap as the single hreflang source of truth. Verify existing URLs only, reciprocal alternates including self-references, and `x-default`. Also verify robots controls in generated HTML with the release flag enabled.
7. Pass all four quality gates locally with the release flag enabled, and inspect LanguageSwitcher and representative pages in a browser.
8. Collect the changes in a PR from `dev` to `master` and obtain Fumi's approval before production publication. Updating `master` triggers production deployment.
9. After deployment, verify HTTP 200 responses for released URLs, the sitemap, hreflang, robots, and language switching, and record the Search Console state. Do not resubmit to AdSense.

## 6. Scope

### Included

- The `LOCALIZED_ROUTES_PUBLISHED` release gate
- Translation, reachability, and internal links for `/en` and `/zh` routes
- Missing localized roadmap routes in #305
- #334's release-unblocking conditions and LanguageSwitcher UX review
- Localized sitemap, hreflang, `x-default`, and robots controls
- CI and post-deployment publication verification

### Excluded

- AdSense resubmission, choosing a submission date, and the 14–28-day crawl grace period
- New product features such as authentication or billing
- Duplicate hreflang implementations in HTML and the sitemap
- Site-wide refactoring not directly related to this localization release

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Starting from old `dev` could lose 27 commits from `master` | Recheck branch tips at the start and align work on the latest `master`. |
| The sitemap lists nonexistent locale URLs | Compare every public sitemap URL with generated output and verify HTTP 200 responses. |
| Some pages retain `noindex` after enabling the flag | Inspect generated HTML for representative URLs, including pages using `createLocaleAwareRobots()`. |
| AdSense resubmission conditions unnecessarily delay localization publication | Record #323's resubmission decision separately from the localization release decision. |
| Uncommitted changes from the previous turn are lost or mixed into the design commit | Preserve existing changes and include only this design document in the current commit. |

## 8. Open questions

- Propose changes to the bodies and statuses of #334 and #323 during implementation planning. Do not update GitHub at this stage.
- Decide whether `openGraph.alternateLocale` is needed for social display during implementation planning. It is not part of the search-publication gate.
- Determine the exact production URL list for each language during implementation, using build output and the sitemap.
