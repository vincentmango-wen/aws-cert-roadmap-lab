# P5-034 Comparison Article Localization — Design Document

- Created: 2026-06-21
- Target issues: P5-034–P5-041 (#210–#217) + P5-042–P5-057 (#261–#276)
- Expected PRs: 1 (foundation + 22 localizations + localized internal links)
- Reference implementation: P5-030–P5-033 (glossary localization / terms.{en,zh}.json)
- Existing assets: 11 Japanese MDX articles (`frontend/contents/comparisons/*.mdx`)

## 0. Design Goals and Constraints

### 0-1. Issue completion criteria (required)

1. `/en/comparisons/[slug]` and `/zh/comparisons/[slug]` render for all 11 slugs.
2. Related-term and related-question links **navigate within the same language** (P5-041).
3. Japanese URLs (`/comparisons/[slug]`) remain unchanged.
4. `npm run typecheck` and `npm run build` pass.
5. Publish the 11-article list pages (`/en/comparisons` / `/zh/comparisons`) as well.

### 0-2. Design principles (in priority order)

1. **Align naming and placement with glossary localization** (reduce learning overhead / reuse review criteria).
2. **Split work finely enough for 22 downstream parallel agents to translate independently** (a structure without contention over comparisons.ts).
3. **Do not break existing Japanese pages** (extend rather than rename).
4. **Extract large article bodies (content) into standalone per-locale files** (do not put them in JSON / reuse the existing MDX renderer).

## 1. File/Directory Structure

### 1-1. Decision: hybrid design (metadata JSON + body MDX)

The glossary stores all terms, including body text, in a single `terms.{ja,en,zh}.json` file per language. Comparison articles have **long bodies, and the existing MDX renderer should be reused**, so adopt the following hybrid structure.

| Type | Location | Rationale |
|---|---|---|
| Metadata (title/description/category/services/tags/level/priority/examScopes/publishedAt, etc.) | `frontend/contents/comparisons/comparisons.{ja,en,zh}.json` | Parallel to terms, a single source of truth (SSoT), and a small editing scope for 22 parallel agents |
| Body MDX | `frontend/contents/comparisons/{ja,en,zh}/<slug>.mdx` | Preserve the existing MDX structure / reuse the MarkdownContent renderer from page.tsx as-is / reduce conflicts when agents edit line by line |

#### Directory structure (final)

```
frontend/contents/comparisons/
├── comparisons.ja.json                # ja metadata (11 entries)
├── comparisons.en.json                # en metadata (11 entries)
├── comparisons.zh.json                # zh metadata (11 entries / Traditional Chinese)
├── ja/                                # Move existing MDX here (preserve history with git mv)
│   ├── s3-vs-ebs-vs-efs.mdx
│   ├── rds-vs-dynamodb.mdx
│   └── ... (11 files)
├── en/                                # Created by agents working in 22-way parallelism
│   ├── s3-vs-ebs-vs-efs.mdx
│   └── ... (11 files)
└── zh/                                # Created by agents working in 22-way parallelism
    ├── s3-vs-ebs-vs-efs.mdx
    └── ... (11 files)
```

#### Handling old paths (`frontend/contents/comparisons/*.mdx`)

Preserve rename history with `git mv frontend/contents/comparisons/<slug>.mdx frontend/contents/comparisons/ja/<slug>.mdx`. Replace the directory lookup logic in `page.tsx`'s `getComparisonsDirectory()` with logic that **assumes `{ja,en,zh}` subdirectories** (described below).

### 1-2. Metadata JSON schema

`comparisons.{ja,en,zh}.json` contains the following array. **slug / comparisonId / category / examScopes / services / tags / priority / level / published / publishedAt / updatedAt are shared across all locales**; translate only `title / description`.

```jsonc
[
  {
    "comparisonId": "cmp-001",
    "slug": "s3-vs-ebs-vs-efs",
    "title": "Differences between S3, EBS, and EFS",       // ← Locale-specific
    "description": "Compare AWS storage services...",      // ← Locale-specific
    "category": "Storage",                                 // Shared
    "level": "beginner",                                   // Shared
    "examScopes": ["CLF-C02", "SAA-C03"],                  // Shared
    "services": ["s3", "ebs", "efs"],                      // Shared
    "tags": ["storage", "comparison", "clf", "saa"],       // Shared
    "priority": "high",                                    // Shared
    "published": true,                                     // Shared (see below)
    "publishedAt": "2026-06-01",                           // Shared
    "updatedAt": "2026-06-21",                             // Shared
    "locale": "en"                                         // ← Discriminator, as with terms
  },
  ...
]
```

#### Handling `published`

Since all 11 articles are to be published in en/zh in one PR, align `published: true` across all three languages in this phase. If an article's translation is not ready in the future, use **locale-specific published filtering** (unused for terms because all entries are published / this file allows for future extension).

#### Handling the old `src/contents/comparisons/comparisons.ts`

For compatibility, load `comparisons.ja.json` and **turn this into a thin re-export file that exports the same `publishedComparisons` array**. `termGuards.ts` / the `comparisons/page.tsx` list / `internalLinks.ts` import `@/contents/comparisons/comparisons`, so preserving this contract is the top priority.

```ts
// frontend/src/contents/comparisons/comparisons.ts (new)
import comparisonsJaData from "../../../contents/comparisons/comparisons.ja.json";
import type { Comparison } from "../../types/comparison";

export const comparisons: Comparison[] = comparisonsJaData as Comparison[];
export const publishedComparisons = comparisons.filter((c) => c.published);
```

## 2. Type / Comparison Interface Extensions

### 2-1. Keep existing types and add only optional `locale`

```ts
// frontend/src/types/comparison.ts
export type ComparisonLevel = "beginner" | "intermediate" | "advanced";
export type ComparisonPriority = "high" | "medium" | "low";
export type ComparisonExamScope = "CLF-C02" | "SAA-C03";
export type ComparisonLocale = "ja" | "en" | "zh";        // New

export type Comparison = {
  comparisonId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: ComparisonLevel;
  examScopes: ComparisonExamScope[];
  services: string[];
  tags: string[];
  priority: ComparisonPriority;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  locale?: ComparisonLocale;                              // New (optional)
};

// Type including the body (consolidate with ComparisonArticle in page.tsx)
export type ComparisonArticle = Comparison & {
  content: string;
};
```

Making `locale` optional allows both the existing 11-entry array in `comparisons.ts` (without locale) and JSON data (with locale) to use the same type.

## 3. Route Design

### 3-1. 3 languages × 2 levels = 6 routes

| URL | File | generateStaticParams | Content |
|---|---|---|---|
| `/comparisons` | `app/(site)/comparisons/page.tsx` (modify existing) | - | ja list |
| `/comparisons/[comparisonSlug]` | `app/(site)/comparisons/[comparisonSlug]/page.tsx` (modify existing) | 11 ja slugs | ja detail |
| `/en/comparisons` | `app/(site)/en/comparisons/page.tsx` (new) | - | en list |
| `/en/comparisons/[comparisonSlug]` | `app/(site)/en/comparisons/[comparisonSlug]/page.tsx` (new) | 11 en slugs | en detail |
| `/zh/comparisons` | `app/(site)/zh/comparisons/page.tsx` (new) | - | zh list |
| `/zh/comparisons/[comparisonSlug]` | `app/(site)/zh/comparisons/[comparisonSlug]/page.tsx` (new) | 11 zh slugs | zh detail |

### 3-2. Detail pages — shared implementation branching on a locale argument

Follow the glossary's `term-detail-data.ts` pattern: make **all three language detail pages thin wrappers** and consolidate the logic in `comparison-detail-data.ts`.

```ts
// frontend/src/app/(site)/comparisons/comparison-detail-data.ts (new)
import type { ComparisonArticle, ComparisonLocale } from "@/types/comparison";

export function getComparisons(locale: ComparisonLocale): ComparisonArticle[];
export function getPublishedComparisons(locale: ComparisonLocale): ComparisonArticle[];
export function getComparisonBySlug(locale: ComparisonLocale, slug: string): ComparisonArticle | null;
export function getComparisonStaticParams(locale: ComparisonLocale): { comparisonSlug: string }[];
export function createComparisonPath(locale: ComparisonLocale, slug: string): `/${string}`;
export function createComparisonDetailMetadataInput(locale: ComparisonLocale, slug: string): PageMetadataInput;
export const comparisonDetailLabelsByLocale: Record<ComparisonLocale, ComparisonDetailLabels>;
export const levelLabelsByLocale: Record<ComparisonLocale, Record<ComparisonLevel, string>>;
export const priorityLabelsByLocale: Record<ComparisonLocale, Record<ComparisonPriority, string>>;
```

### 3-3. List pages — consolidate in `comparisons-page-data.ts`

```ts
// frontend/src/app/(site)/comparisons/comparisons-page-data.ts (new)
export const comparisonsPageMetadataByLocale: Record<ComparisonLocale, PageMetadataInput>;
export function getComparisonsPageData(locale: ComparisonLocale): {
  labels: ComparisonsListLabels;
  comparisons: ComparisonArticle[];
  recommendedComparisons: ComparisonArticle[];
  categories: string[];
};

// Extract the list UI from the existing page.tsx into `ComparisonsListClient.tsx` and add locale support.
```

### 3-4. Handling the MarkdownContent renderer

Extract `MarkdownContent` / `renderInline` / `renderTable` from `comparisons/[comparisonSlug]/page.tsx` into **`frontend/src/components/comparisons/MarkdownContent.tsx`** for shared use by the three routes. Minimize the diff with **a pure move, without any logic changes**.

## 4. Locale Resolution Helpers

### 4-1. Match terms exactly

Replicate the following functions from the glossary's `term-detail-data.ts` one-to-one in `comparison-detail-data.ts`:

| terms function | comparisons equivalent |
|---|---|
| `getTerms(locale)` | `getComparisons(locale)` |
| `getTermById(locale, id)` | `getComparisonBySlug(locale, slug)` |
| `getTermStaticParams(locale)` | `getComparisonStaticParams(locale)` |
| `createTermDetailPath(locale, id)` | `createComparisonPath(locale, slug)` |
| `createTermDetailMetadataInput(locale, id)` | `createComparisonDetailMetadataInput(locale, slug)` |
| `termDetailLabelsByLocale` | `comparisonDetailLabelsByLocale` |
| `levelLabelsByLocale` | `levelLabelsByLocale` (redefine for comparisons / same key set as terms, separate namespace) |

Reuse the existing `createLocalizedPath(locale, path)` function of the same name in `i18n/locales.ts`.

### 4-2. Loading MDX bodies

Replace `getComparisonsDirectory()` in `page.tsx` with:

```ts
// frontend/src/app/(site)/comparisons/comparison-content-loader.ts (new / Node-only)
import fs from "fs";
import path from "path";

const LOCALE_DIRS: Record<ComparisonLocale, string> = {
  ja: "ja",
  en: "en",
  zh: "zh",
};

function getComparisonsDirectory(locale: ComparisonLocale): string {
  const candidates = [
    path.join(process.cwd(), "contents", "comparisons", LOCALE_DIRS[locale]),
    path.join(process.cwd(), "frontend", "contents", "comparisons", LOCALE_DIRS[locale]),
  ];
  // Same lookup pattern as before
}

export function loadComparisonContent(locale: ComparisonLocale, slug: string): string {
  // Read the mdx file, strip frontmatter, and return only content.
  // Reuse parseComparisonFile from the existing page.tsx, but use only content, not frontmatter.
}
```

Since metadata is in JSON and the body is in MDX, this loader **extracts content only**.

### 4-3. Label translation

Replace `getLevelLabel` / `getPriorityLabel` with `levelLabelsByLocale` / `priorityLabelsByLocale` in `comparison-detail-data.ts`. Reuse `formatServiceName` as a shared function because it is **language-independent**.

### 4-4. categoryLabels (category localization)

For the list's `Storage / Database / Networking / ...` category display, import and reuse the glossary's `categoryLabelsByLocale` unchanged. Keep anchor link IDs (`#storage`) **fixed in lowercase English**, changing only the display labels by language (UX consistency + URL stability).

## 5. Same-Language Navigation for Related Terms / Related Questions (P5-041)

### 5-1. Require same-language navigation

Construct detail-page links **through `createLocalizedPath(locale, ...)` without exception**. Direct hard-coded paths such as `/terms/${id}` are prohibited.

| Link type | Implementation |
|---|---|
| Term chips (each service in `comparison.services`) | `createTermDetailPath(locale, service)` = `/{locale}/terms/${service}` (reuse the terms helper) |
| Related comparison cards (same category / overlapping services) | `createComparisonPath(locale, item.slug)` = `/{locale}/comparisons/${item.slug}` |
| "Back to comparison list" CTA | `createLocalizedPath(locale, "/comparisons")` |
| "View the AWS glossary" CTA | `createLocalizedPath(locale, "/terms")` |
| "Try practice questions" CTA | `createLocalizedPath(locale, "/questions")` |
| "Home" breadcrumb | `createLocalizedPath(locale, "/")` |

### 5-2. Fallback policy for unpublished destinations

#### 5-2-a. Links to terms (service tags)

Already checked by `isExistingTerm(service)`. All terms are published in three languages, so **the check returns the same result for all three languages** (if a term exists, its detail page exists in every language). Reuse the existing guard unchanged.

#### 5-2-b. Related comparison cards

In this phase, align `isExistingComparisonForLocale(locale, slug)` to **share `comparisonSlugSet` across all of `{ja, en, zh}`** (all 11 entries are published in three languages).

```ts
// Modify frontend/src/lib/termGuards.ts
const comparisonSlugSetByLocale: Record<Locale, Set<string>> = {
  ja: comparisonSlugSet,
  en: comparisonSlugSet,   // ← Changed (previously: empty set)
  zh: comparisonSlugSet,   // ← Changed (previously: empty set)
};
```

Leave room to set the corresponding entry in `comparisons.en.json` / `comparisons.zh.json` to `published: false` and extend `publishedComparisons` to locale-specific filtering if a comparison article's translation is not ready in the future.

#### 5-2-c. Navigation to questions (practice questions)

The "Try practice questions" CTA is a fixed link to `/questions`. Whether a questions page exists per locale is handled in a separate issue (the P5-040 series); this phase only generates a same-language URL with `createLocalizedPath(locale, "/questions")` (a design that avoids a 404 even when only the ja destination exists). Follow the same behavior as terms.

#### 5-2-d. Cross-links with architectures

There are currently no comparisons → architectures links in this phase, so they are out of scope. Navigation from the glossary's `comparisonArticles` / `architectureArticles` sections automatically leads to en/zh detail pages by switching `isExistingComparisonForLocale` to the new logic (5-2-b) **within the terms-side changes** (no additional implementation required).

## 6. Translation Guidelines

Rules for the 22 downstream parallel translation agents. Each agent owns **1 slug × 1 locale = 1 file**; metadata JSON additions are **consolidated serially by the editor** (prevent races between parallel agents).

### 6-1. Refer to `terms.{en,zh}.json` as the terminology SSoT

- **Use `name` / `shortName` in `terms.{en,zh}.json` as the authoritative source** for all official AWS service names / shortName values / abbreviations.
- Example: en Application Load Balancer → "Application Load Balancer" (`name` in terms.en.json) / shortName "ALB" / use the full name on first occurrence in the body, then ALB thereafter.
- Localized zh specimen: Network ACL → "網路 ACL" / shortName "NACL".
- If a service in the body is absent from terms.{en,zh}.json, check **the language-specific wording in official AWS documentation** and report the decision to the editor (do not invent a translation independently).

### 6-2. Follow `p5-032-aws-terminology-rules.md`

- Follow the existing terminology rules (naming, katakana notation, half-width/full-width proper nouns) **in all three languages**.
- Follow the usage patterns in terms.{en,zh}.json when deciding whether to omit "AWS" / "Amazon" prefixes.

### 6-3. Translation length guidelines

| Section | Character-count tolerance |
|---|---|
| title (list card heading) | Within ±50% of the original ja text (en tends to be longer; zh is approximately the same as ja) |
| description (card body) | Within ±50% of the original ja text |
| Body H2 / H3 headings | Prioritize natural translations (no character-count limit) |
| Comparison table cells | Prefer concise wording to retain the apparent cell width of the original ja text |
| Body paragraphs | Prioritize natural translation. Split paragraphs if they become verbose. Do not alter meaning. |

### 6-4. Tone

- **en**: Neutral, practical, technical-explanatory tone. Avoid "you" / "we"; a mix of imperatives and passive voice is acceptable. Use American English spelling (color / center / organization). Aim for technical English close to AWS Docs.
- **zh**: **Traditional Chinese only (Taiwan / zh-Hant / zh_TW)**. No Simplified Chinese. Use standard Taiwan terminology (localized specimens: "啟用", "設定", "連線"; prohibited mainland specimens: "启用", "连接"). Use a polite written register, preferring third-person nouns such as "使用者" / "開發者" over "您".

### 6-5. Prohibited generic AI phrasing (all languages)

The following are prohibited as **bland expressions frequently produced by AI translation**. Reviewers must return work containing them for revision.

#### Japanese specimens (do not introduce these when revising retained ja MDX)

- "いかがでしたか", "ぜひ参考にしてみてください", "皆さんも試してみてください"
- "劇的に", "圧倒的に", "革命的な", "真の", "本物の" (unsupported intensifiers)
- "〇〇することができます" (→ "〇〇できます")
- "〇〇と言われています" (hearsay without an identified source)
- "これからは誰もが AWS を使いこなす時代" (formulaic future prediction)

#### English specimens

- "In conclusion, ..." / "It's important to note that ..." / "In today's fast-paced cloud landscape ..."
- "Whether you're a beginner or an expert, ..." (hedged symmetry)
- "Stay tuned for more!" / "Hope you enjoyed this article!"
- Overuse of "leverage" (→ use / take advantage of)
- "seamless" / "robust" / "powerful" / "cutting-edge" (unsupported adjectives)
- "in the realm of" / "in the world of" (wordy introductions)

#### Traditional Chinese specimens

- "綜上所述", "總而言之", "希望本文對您有所幫助", "歡迎留言交流"
- "在當今快速發展的雲端時代", "無論您是初學者還是專家"
- "強大的", "無縫的", "革命性的" (unsupported adjectives)
- "廣大的使用者", "全方位的解決方案" (formulaic vocabulary)

### 6-6. Elements not to translate

- **Official AWS service names ("Amazon S3" / "AWS Lambda", etc.)**: Keep the original; do not translate.
- **Code block contents**: Do not translate (retain the original, including `# ...` comments. To prevent Japanese comments from appearing in English/Chinese, translate comments in the original ja body text).
- **Exam codes `CLF-C02` / `SAA-C03`**: Do not translate.
- **MDX frontmatter key names** (`comparisonId`, etc.): Do not modify (remove frontmatter itself because metadata JSON manages it).

### 6-7. Preserve MDX structure

- **Maintain the heading hierarchy (H1–H4) and paragraph count** of the existing MDX. Do not reorder sections or remove headings.
- Preserve the **number of columns, number of rows, and row order in comparison tables** (translate values and items one-to-one).
- **Do not modify** the URL in links `[text](url)` (the processor will convert them later in P5-041 internal-link localization).
- Keep the contents of inline code ` `xxx` ` unchanged.
- Translate emphasis `**xxx**` with the same meaning.

### 6-8. Remove frontmatter from MDX

New `{en,zh}/<slug>.mdx` files **must not contain frontmatter** (metadata JSON is the SSoT). Frontmatter in `ja/<slug>.mdx` is also scheduled for eventual removal, but retain it in this PR (for compatibility).

The loader strips frontmatter when present and otherwise reads the file as content unchanged.

## 7. Implementation Order

### Phase A: Foundation (serial / single agent / P5-034)

Preparation the editor **must complete before translation starts**. Establish the prerequisites for 22 parallel agents.

1. **A-1**: Add `ComparisonLocale` + `Comparison.locale?` + the `ComparisonArticle` type definition to `frontend/src/types/comparison.ts`.
2. **A-2**: Move the existing 11 articles under ja with `git mv frontend/contents/comparisons/*.mdx frontend/contents/comparisons/ja/` (preserve history).
3. **A-3**: Mechanically extract frontmatter from each ja MDX file to generate `frontend/contents/comparisons/comparisons.ja.json` (manually or with a simple script). Verify the 11-entry array exactly matches the existing `comparisons.ts`.
4. **A-4**: Create 11 entries in `frontend/contents/comparisons/comparisons.en.json` with **untranslated placeholders only for title/description** (e.g., `"title": "[EN] Differences between S3, EBS, and EFS"`). Copy all other fields from ja JSON.
5. **A-5**: Create placeholders in `comparisons.zh.json` in the same way (`"[ZH] ..."`).
6. **A-6**: Add only `frontend/contents/comparisons/{en,zh}/.gitkeep` (empty directories). Agents create each mdx file in Phase B.
7. **A-7**: Rewrite `frontend/src/contents/comparisons/comparisons.ts` as a JSON re-export (preserve the `publishedComparisons` API).
8. **A-8**: Create `frontend/src/app/(site)/comparisons/comparison-detail-data.ts` (new) — the full set of locale resolution helpers.
9. **A-9**: Create `frontend/src/app/(site)/comparisons/comparison-content-loader.ts` (new) — MDX body loader.
10. **A-10**: Create `frontend/src/app/(site)/comparisons/comparisons-page-data.ts` (new) — list-page data.
11. **A-11**: Create `frontend/src/components/comparisons/MarkdownContent.tsx` (new) — extract MarkdownContent / renderInline / renderTable from `page.tsx`.
12. **A-12**: Create `frontend/src/components/comparisons/ComparisonDetailContent.tsx` (new) — parameterize the detail-page body by locale (same pattern as the glossary's `TermDetailContent.tsx`).
13. **A-13**: Create `frontend/src/components/comparisons/ComparisonsListClient.tsx` (new) — parameterize the list UI by locale.
14. **A-14**: Replace the existing `frontend/src/app/(site)/comparisons/page.tsx` with a thin ja wrapper calling `ComparisonsListClient`.
15. **A-15**: Replace the existing `frontend/src/app/(site)/comparisons/[comparisonSlug]/page.tsx` with a thin ja wrapper calling `ComparisonDetailContent`.
16. **A-16**: Create `frontend/src/app/(site)/en/comparisons/page.tsx` (new) + `frontend/src/app/(site)/en/comparisons/[comparisonSlug]/page.tsx` (new).
17. **A-17**: Create `frontend/src/app/(site)/zh/comparisons/page.tsx` (new) + `frontend/src/app/(site)/zh/comparisons/[comparisonSlug]/page.tsx` (new).
18. **A-18**: Align `comparisonSlugSetByLocale` in `frontend/src/lib/termGuards.ts` to `comparisonSlugSet` for all three languages (linked to P5-041).
19. **A-19**: At the end of Phase A, confirm `npm run typecheck && npm run build` both pass. Reach a state where all six routes build and render **with placeholder translations still in place**.

At the end of Phase A, **the pre-localization framework is complete**. It is acceptable for "[EN] / [ZH]" placeholders to appear on screen.

### Phase B: 22 parallel localizations (Localize × 22 / independent agents)

Assignment unit for each agent = **1 slug × 1 locale = 1 file**. There are two responsibilities:

1. Create `frontend/contents/comparisons/{en|zh}/<slug>.mdx` (translate the MDX body).
2. Update only `title` / `description` in **one corresponding entry** in `frontend/contents/comparisons/comparisons.{en|zh}.json`.

#### Preventing races between parallel agents

For JSON updates, **agents return a patch containing only the corresponding entry's object rather than overwriting the whole JSON file**. The editor applies all 22 patches sequentially at the end of Phase B (parallel agents → serial editor merge).

Alternative: have each agent create `frontend/contents/comparisons/{en|zh}/<slug>.meta.json` (a small single-entry file); at the end of Phase B, the editor merges all 22 files to generate `comparisons.{en|zh}.json`. **This approach is recommended** (eliminates races entirely).

#### Slug list for 22 parallel assignments

| # | slug | en agent | zh agent |
|---|---|---|---|
| 1 | s3-vs-ebs-vs-efs | P5-042 | P5-053 |
| 2 | rds-vs-dynamodb | P5-043 | P5-054 |
| 3 | sns-vs-sqs-vs-eventbridge | P5-044 | P5-055 |
| 4 | iam-user-vs-role-vs-policy | P5-045 | P5-056 |
| 5 | cloudwatch-vs-cloudtrail-vs-config | P5-046 | P5-057 |
| 6 | alb-vs-nlb-vs-cloudfront | P5-047 | P5-058 |
| 7 | multi-az-vs-read-replica | P5-048 | P5-059 |
| 8 | security-group-vs-nacl | P5-049 | P5-060 |
| 9 | api-gateway-vs-alb-vs-cloudfront | P5-050 | P5-061 |
| 10 | secrets-manager-vs-parameter-store | P5-051 | P5-062 |
| 11 | route53-vs-cloudfront-vs-global-accelerator | P5-052 | P5-063 |

Note: The issue numbers above are example assignments (actual numbers are determined individually from #261–#276 while resolving numbering inconsistencies).

### Phase C: Validate localized internal links (Links / P5-041)

1. **C-1**: Verify that the `termGuards.ts` change from Phase A-18 works on related-term chips for all ja/en/zh comparison articles (on an actual browser/device or in unit tests).
2. **C-2**: Use grep / eslint-style static checks to confirm all detail-page links use `createLocalizedPath` (check for hard-coded `/terms/${...}`).
3. **C-3**: Verify the three suggested related comparison cards appear in the same language.
4. **C-4**: Verify breadcrumb links work within the same language.

### Phase D: Tests

1. **D-1**: `npm run typecheck` passes.
2. **D-2**: `npm run build` passes.
3. **D-3**: Start the dev server → visually inspect the three routes `/comparisons/s3-vs-ebs-vs-efs` / `/en/comparisons/s3-vs-ebs-vs-efs` / `/zh/comparisons/s3-vs-ebs-vs-efs` (sample any one slug).
4. **D-4**: Add one invariant test — verify that the slug sets in `comparisons.{ja,en,zh}.json` match exactly across three languages (prevent forgetting to add a translation in only one language later).

```ts
// frontend/src/contents/comparisons/__tests__/comparisons-locale-parity.test.ts
import comparisonsJa from "../../../../contents/comparisons/comparisons.ja.json";
import comparisonsEn from "../../../../contents/comparisons/comparisons.en.json";
import comparisonsZh from "../../../../contents/comparisons/comparisons.zh.json";

describe("comparisons locale parity", () => {
  it("ja/en/zh have the same slug set", () => {
    const jaSlugs = new Set(comparisonsJa.map((c) => c.slug));
    const enSlugs = new Set(comparisonsEn.map((c) => c.slug));
    const zhSlugs = new Set(comparisonsZh.map((c) => c.slug));
    expect(enSlugs).toEqual(jaSlugs);
    expect(zhSlugs).toEqual(jaSlugs);
  });

  it("ja/en/zh have the same comparisonId mapping", () => {
    // Each slug's comparisonId matches across three languages.
  });

  it("ja/en/zh have the same services list per slug", () => {
    // Ensure related-term navigation does not break.
  });

  it("every en/zh mdx file exists for each slug", () => {
    // Use fs to check that contents/comparisons/{en,zh}/${slug}.mdx exists.
  });
});
```

## 8. Test Strategy

### 8-1. Required

- `npm run typecheck`
- `npm run build` (all slugs must build successfully because dynamicParams = false)

### 8-2. Recommended additions (invariants)

- `comparisons-locale-parity.test.ts` from §D-4
- One unit test confirming the MDX loader correctly reads MDX without frontmatter
- Snapshot test for `createComparisonPath(locale, slug)`

### 8-3. Manual checks

- Visually inspect lists in three languages / details in three languages × any one slug = six pages.
- Switching en→ja / zh→ja with the same slug should navigate to the same article (language-switch UI integration is a separate issue / verify by entering URLs directly in this phase).

## 9. Fixed Requirements (Recap)

- Preserve existing Japanese URLs `/comparisons/[slug]`.
- Align naming and placement with glossary localization.
- Do not allow parallel writes to comparisons.ts (merge per-slug files).
- All reviewers check the prohibited generic AI phrasing list (§6-5).

## 10. Numbering and Related Tickets

- This design document: P5-034 (foundation)
- 22 parallel assignments: Manage P5-042–P5-063 using the table in §7 Phase B (actual issue numbers: #261–#276 + the remaining six assigned separately).
- Internal-link validation: P5-041 (§5 of this document / implementation completed in Phase A-18 + Phase C).

## 11. PSP Measurement Fields (Fill in on Ticket Completion)

```yaml
psp:
  actual-duration: TBD             # h
  bug-count: TBD
  code-volume:
    files-changed: TBD             # Expected ~40 files (foundation ~15 + 22 mdx + 3 metadata JSON + 1 test)
    lines-added: TBD
    lines-deleted: TBD
task-category: design + impl + content   # Consider combining multiple coefficients for this mixed category.
```

## 12. Open Questions

1. Confirm whether **language-switch UI (hreflang / footer language switcher)** belongs in a separate issue (follow the approach used during glossary localization, if implemented).
2. Confirm whether **language-specific OG image generation** is in scope for this phase (locale support in `createPageMetadata` is unverified / add in Phase A-12 if needed).
3. Check for **AWS service names in the 11 articles that are absent from `terms.{en,zh}.json`** (exhaustively grep before agents start translating).
4. Decide whether **future comparison articles** must be published in all three languages at once, or whether ja-first publication with delayed en/zh translation is allowed (the latter requires switching `published` in §1-2 to locale-specific management).
