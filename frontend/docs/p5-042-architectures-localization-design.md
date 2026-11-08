# P5-042 Architecture Diagram Article Localization — Design Document (Phase 5-G)

- Created: 2026-06-21
- Branch: `feat/p5-042-phase5g-architectures-localization` (base = `dev`)
- Expected PRs: 1 (foundation + 20 localizations + SVG localization + parity test)
- Reference implementation: **P5-034 comparison article localization PR #277 (commit 32b5c6f)** — the same hybrid structure (metadata JSON + body MDX + locale resolution helpers)
- Reference design: `frontend/docs/p5-034-comparisons-localization-design.md`
- Target articles: **10** (slug list in the §7 Phase B table)

---

## 0. Design Goals and Constraints

### 0-1. Issue completion criteria (required)

1. Localize all 10 articles into ja / en / zh.
2. `/en/architectures/[slug]` and `/zh/architectures/[slug]` render for **all 10 slugs**.
3. Japanese URLs (`/architectures/[slug]` / `/architectures`) **remain unchanged**.
4. `npm run typecheck` and `npm run build` pass.
5. Add a **parity invariant test** (structural guarantees for matching slugs / architectureId / shared metadata / MDX / SVG existence across three languages).
6. Replace Japanese text within SVGs in the en / zh versions (per-locale SVG files + locale switching).
7. Publish the 10-article list pages (`/en/architectures` / `/zh/architectures`) as well.

### 0-2. Design principles (in priority order)

1. **Align naming, placement, and helper structure one-to-one with P5-034 comparison article localization** (reduce learning overhead / reuse review criteria / a proven pattern already merged into dev).
2. **Split work finely enough for 20 downstream parallel agents to translate independently** (per-slug files that avoid contention over shared JSON).
3. **Do not break existing Japanese pages or Japanese SVGs** (extend rather than rename / keep existing Japanese filenames).
4. **Unify the body SSoT in MDX** (migrate the current inline `sections[]` body in `architectures.ts` to MDX bodies / use the 10 existing MDX files whose wiring is disconnected).

### 0-3. Structural differences from comparisons (important: rationale for design decisions)

First identify where P5-034 cannot be reused unchanged.

| Aspect | comparisons (P5-034) | architectures (this P5-042) | Approach |
|---|---|---|---|
| Existing body SSoT | The page referenced MDX (`contents/comparisons/*.mdx`) | **The `sections[]` array in `architectures.ts` is the inline body SSoT**. Ten `contents/architectures/*.mdx` files exist but **are not referenced by the page (disconnected wiring)**. | Unify the body SSoT in MDX. Make the **more detailed existing MDX body** the authoritative ja body, rather than the less rich `sections[]` in `architectures.ts`. |
| Diagram rendering | Mermaid rendered as text in the body | **A per-slug SVG is rendered with `<img>` via `diagramPath`** (`mermaid: true` is set, but the detail page displays an SVG image). | Create per-locale SVG files and switch `diagramPath` by locale (§6). |
| ID field | `comparisonId` (cmp-NNN) | `architectureId` (arc-NNN) | Change only the naming; the structure is identical. |
| Category count | 6 (Storage, etc.) | **9** (Static Hosting / Serverless / Three Tier / High Availability / Batch / Networking / Integration / Container / Monitoring) | Redefine `architectureCategoryLabelsByLocale` with nine keys (§5). |
| Article count | 11 | **10** | Only the count in the parity test differs. |

---

## 1. File / Directory Structure

### 1-1. Decision: hybrid design (metadata JSON + body MDX)

The same structure as P5-034. Consolidate metadata into three locale-specific JSON files and extract bodies into locale-specific MDX files.

| Type | Location | Rationale |
|---|---|---|
| Metadata (architectureId / slug / title / description / category / level / examScopes / services / tags / diagramPath / mermaid / published / publishedAt / updatedAt / locale) | `frontend/contents/architectures/architectures.{ja,en,zh}.json` | An SSoT parallel to comparisons. Each of the 20 parallel agents handles only one entry, avoiding conflicts. |
| Body MDX | `frontend/contents/architectures/{ja,en,zh}/<slug>.mdx` | Use the existing MDX structure. Share the MarkdownContent renderer from comparisons. Line-level agent edits are less likely to conflict. |

#### Directory structure (final)

```
frontend/contents/architectures/
├── architectures.ja.json               # ja metadata (10 entries)
├── architectures.en.json               # en metadata (10 entries)
├── architectures.zh.json               # zh metadata (10 entries / Traditional Chinese)
├── ja/                                 # Move 10 existing MDX files with git mv (preserve history)
│   ├── static-site-s3-cloudfront.mdx
│   ├── serverless-api-basic.mdx
│   └── ... (10 files)
├── en/                                 # Created by agents working in 20-way parallelism
│   ├── static-site-s3-cloudfront.mdx
│   └── ... (10 files)
└── zh/                                 # Created by agents working in 20-way parallelism
    ├── static-site-s3-cloudfront.mdx
    └── ... (10 files)
```

#### Handling old paths (`frontend/contents/architectures/*.mdx`)

Move the 10 files under ja with `git mv frontend/contents/architectures/<slug>.mdx frontend/contents/architectures/ja/<slug>.mdx`, preserving history. **Do not modify bodies in principle** (honor the task's out-of-scope items / retain frontmatter at the time of the move). The loader strips frontmatter and reads only the body.

**Exception (CR1-M1 / 2026-06-21)**: Moving the body SSoT to MDX requires satisfying parity invariant (7), `h1 === title || title.startsWith(h1)`, so **only the leading H1 in two ja MDX files** (`cloudwatch-monitoring-basic.mdx` / `private-subnet-vpc-endpoint.mdx`) **was aligned with the JSON title**. See §10 for details and before/after examples.

### 1-2. Metadata JSON schema

`architectures.{ja,en,zh}.json` contains the following array. **architectureId / slug / category / level / examScopes / services / tags / mermaid / published / publishedAt / updatedAt are shared across all locales**; only `title / description / diagramPath` are locale-specific.

```jsonc
// Localized ja content specimens are intentionally retained in this schema example.
[
  {
    "architectureId": "arc-001",
    "slug": "static-site-s3-cloudfront",
    "title": "S3 + CloudFront 静的Webサイト構成",                 // ← Locale-specific
    "description": "S3に配置した静的サイトを...",                  // ← Locale-specific
    "category": "Static Hosting",                                // Shared
    "level": "beginner",                                         // Shared
    "examScopes": ["CLF-C02", "SAA-C03"],                        // Shared
    "services": ["s3", "cloudfront", "iam", "acm", "route53"],   // Shared
    "tags": ["静的サイト", "CDN", "HTTPS", "OAC", "低コスト"],     // ⚠ See §6-3 (locale-specific)
    "diagramPath": "/images/architectures/static-site-s3-cloudfront.svg", // ← Locale-specific (§6)
    "mermaid": true,                                             // Shared
    "published": true,                                           // Shared
    "publishedAt": "2026-06-01",                                 // Shared
    "updatedAt": "2026-06-21",                                   // Shared
    "locale": "ja"                                               // ← Discriminator
  }
]
```

> **Handling `tags` (different from comparisons)**: Tags in comparisons were English slugs (`storage`, etc.) shared across locales, whereas existing architecture tags **include Japanese** (localized specimens: `静的サイト` / `CDN` / `低コスト`). In this phase, tags are also **translated per locale, like title / description** (exclude tags from the parity test's SHARED_FIELDS / §8-4). Translate naturally into en / zh.

#### Handling `published`

Since all 10 articles are to be published in en / zh in one PR, align `published: true` across all three languages. Extend to locale-specific published filtering if translations are delayed in the future (same policy as comparisons).

#### Handling the old `src/contents/architectures/architectures.ts` (compatibility layer)

`termGuards.ts` (`import { publishedArchitectures }`) / existing ja list and detail pages import `@/contents/architectures/architectures`, so **preserving this contract is the top priority**.

Rewrite `architectures.ts` as **a thin compatibility layer loading ja JSON and re-exporting the same `publishedArchitectures` / `architectures`**. Use the same structure as comparisons.ts.

```ts
// frontend/src/contents/architectures/architectures.ts (new / compatibility layer)
import architecturesJaData from "../../../contents/architectures/architectures.ja.json";
import type { ArchitectureMeta } from "../../types/architecture";

export const architectures: ArchitectureMeta[] = architecturesJaData as ArchitectureMeta[];
export const publishedArchitectures = architectures.filter((a) => a.published);

// Preserve compatibility for existing exports (types / labels):
// Move architectureLevelLabels / architectureCategoryLabels / awsServiceLabels
// into src/types/architecture.ts as type/label definitions, and re-export them here.
export type {
  ArchitectureMeta,
  ArchitectureLevel,
  ArchitectureCategory,
  ArchitectureSection,
  ExamScope,
} from "../../types/architecture";
export {
  architectureLevelLabels,
  architectureCategoryLabels,
  awsServiceLabels,
} from "../../types/architecture";
```

> **Handling `sections?`**: Since the body SSoT moves to MDX, **do not include** `sections` in JSON (avoid duplicate SSoTs). Keep `ArchitectureMeta.sections?` optional (compatibility / existing imports), but omit it from JSON data. Migrate detail pages to render the MDX body (`ArchitectureArticle.content`).

---

## 2. Type / Architecture Interface Extensions

### 2-1. Consolidate types in `src/types/architecture.ts` (new)

Currently `architectures.ts` contains data + types + labels. As it becomes a compatibility layer, extract types and labels into `src/types/architecture.ts` (symmetrical with comparisons' `src/types/comparison.ts`).

```ts
// frontend/src/types/architecture.ts (new / move existing definitions here)
export type ArchitectureLevel = "beginner" | "intermediate" | "advanced";
export type ExamScope = "CLF-C02" | "SAA-C03";
export type ArchitectureLocale = "ja" | "en" | "zh";   // New

export type ArchitectureCategory =
  | "Static Hosting"
  | "Serverless"
  | "Three Tier"
  | "High Availability"
  | "Batch"
  | "Networking"
  | "Integration"
  | "Container"
  | "Monitoring";

export type ArchitectureSection = { title: string; body: string };

export type ArchitectureMeta = {
  architectureId: string;
  slug: string;
  title: string;
  description: string;
  category: ArchitectureCategory;
  level: ArchitectureLevel;
  examScopes: ExamScope[];
  services: string[];
  tags: string[];
  diagramPath?: string;
  mermaid: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  sections?: ArchitectureSection[];      // Keep optional (not included in JSON)
  locale?: ArchitectureLocale;           // New (optional)
};

// Type including the body (used by detail pages)
export type ArchitectureArticle = ArchitectureMeta & { content: string };

// Move existing label definitions here (ja / compatibility) and re-export from architectures.ts.
export const architectureLevelLabels: Record<ArchitectureLevel, string> = { /* Existing values */ };
export const architectureCategoryLabels: Record<ArchitectureCategory, string> = { /* Existing values */ };
export const awsServiceLabels: Record<string, string> = { /* Existing values */ };
```

Making `locale` optional allows the compatibility layer's array (locale may be absent / JSON includes locale) and JSON data to use the same type.

---

## 3. Route Design

### 3-1. 3 languages × 2 levels = 6 routes

| URL | File | generateStaticParams | Content |
|---|---|---|---|
| `/architectures` | `app/(site)/architectures/page.tsx` (modify existing) | - | ja list |
| `/architectures/[architectureSlug]` | `app/(site)/architectures/[architectureSlug]/page.tsx` (modify existing) | 10 ja slugs | ja detail |
| `/en/architectures` | `app/(site)/en/architectures/page.tsx` (new) | - | en list |
| `/en/architectures/[architectureSlug]` | `app/(site)/en/architectures/[architectureSlug]/page.tsx` (new) | 10 en slugs | en detail |
| `/zh/architectures` | `app/(site)/zh/architectures/page.tsx` (new) | - | zh list |
| `/zh/architectures/[architectureSlug]` | `app/(site)/zh/architectures/[architectureSlug]/page.tsx` (new) | 10 zh slugs | zh detail |

Add `export const dynamic = "force-static"` / `export const dynamicParams = false` to every route (same as comparisons / all slugs must build successfully).

### 3-2. Detail pages — shared implementation branching on a locale argument

Follow comparisons' `comparison-detail-data.ts` one-to-one: make the three language detail pages **thin wrappers** and consolidate logic in `architecture-detail-data.ts`.

```ts
// frontend/src/app/(site)/architectures/architecture-detail-data.ts (new)
import type { ArchitectureArticle, ArchitectureLocale } from "@/types/architecture";

export function getArchitectures(locale): ArchitectureMeta[];
export function getPublishedArchitectures(locale): ArchitectureMeta[];
export function getArchitectureMetaBySlug(locale, slug): ArchitectureMeta | null;
export function getArchitectureBySlug(locale, slug): ArchitectureArticle | null;   // Metadata + MDX body
export function getArchitectureStaticParams(locale): { architectureSlug: string }[];
export function createArchitecturePath(locale, slug): Pathname;
export function createArchitectureDetailMetadataInput(locale, slug): PageMetadataInput;
export const architectureDetailLabelsByLocale: Record<ArchitectureLocale, ArchitectureDetailLabels>;
export const levelLabelsByLocale: Record<ArchitectureLocale, Record<ArchitectureLevel, string>>;
export const architectureCategoryLabelsByLocale: Record<ArchitectureLocale, Record<ArchitectureCategory, string>>;
export function formatArchitectureCategoryLabel(locale, category): string;
export function resolveDiagramPath(locale, meta): string | undefined;   // §6 SVG locale switching
```

en / zh thin wrappers (same pattern as the en comparisons page):

```ts
// frontend/src/app/(site)/en/architectures/[architectureSlug]/page.tsx (new)
export function generateStaticParams() { return getArchitectureStaticParams("en"); }
export async function generateMetadata({ params }) {
  const { architectureSlug } = await params;
  return createPageMetadata(createArchitectureDetailMetadataInput("en", architectureSlug));
}
export default async function EnglishArchitectureDetailPage({ params }) {
  const { architectureSlug } = await params;
  const architecture = getArchitectureBySlug("en", architectureSlug);
  if (!architecture) notFound();
  return <ArchitectureDetailContent locale="en" architecture={architecture} />;
}
```

### 3-3. List pages — consolidate in `architectures-page-data.ts`

```ts
// frontend/src/app/(site)/architectures/architectures-page-data.ts (new)
export const architecturesPageMetadataByLocale: Record<ArchitectureLocale, PageMetadataInput>;
export function getArchitecturesPageData(locale): {
  labels: ArchitecturesListLabels;
  architectures: ArchitectureMeta[];
  categories: ArchitectureCategory[];
};
```

Extract the list UI from the existing `architectures/page.tsx` into `ArchitecturesListClient.tsx` (parameterized by locale). Replace the ja page with a thin wrapper.

### 3-4. Handling the body renderer

Migrate the detail page to render the MDX body. **Reuse comparisons' existing `MarkdownContent` (`@/components/comparisons/MarkdownContent`)** (including renderInline / renderTable / render Mermaid code blocks as code blocks, as comparisons does).

> **Decision**: Do not create an architectures-specific renderer (minimal implementation / global §2). Sharing comparisons' MarkdownContent is appropriate because it already covers Markdown tables / inline syntax. Consider splitting it if architectures-specific rendering requirements arise in the future.

### 3-5. Detail-page body components

```
frontend/src/components/architectures/ArchitectureDetailContent.tsx (new / parameterized by locale)
frontend/src/components/architectures/ArchitecturesListClient.tsx (new / parameterized by locale)
```

Move the existing JSX structure in `architectures/[architectureSlug]/page.tsx` (breadcrumbs / header / architecture SVG / AWS services used / body / CTA) into `ArchitectureDetailContent`, localizing:

- Breadcrumbs (Home / Architectures / title) → `architectureDetailLabelsByLocale[locale]` + `createLocalizedPath(locale, ...)`
- Category / level badges → `architectureCategoryLabelsByLocale` / `levelLabelsByLocale`
- Architecture SVG → `resolveDiagramPath(locale, meta)` (§6) + localized alt text
- "AWS services used" heading, description, and service chips → labels + same-language navigation through `createTermDetailPath(locale, service)` (§4)
- Body → render `architecture.content` (MDX) with `MarkdownContent`. If MDX is empty (before translation), leave an empty section rather than adding a `sections` fallback (do not fail the build).
- "Back to architecture list" / "Explore other AWS architectures" CTAs → labels + `createLocalizedPath(locale, "/architectures")`

---

## 4. Locale Resolution Helpers & Same-Language Navigation (Internal Links)

### 4-1. Match comparisons exactly

| comparisons function | architectures equivalent |
|---|---|
| `getComparisons(locale)` | `getArchitectures(locale)` |
| `getComparisonMetaBySlug(locale, slug)` | `getArchitectureMetaBySlug(locale, slug)` |
| `getComparisonBySlug(locale, slug)` | `getArchitectureBySlug(locale, slug)` |
| `getComparisonStaticParams(locale)` | `getArchitectureStaticParams(locale)` |
| `createComparisonPath(locale, slug)` | `createArchitecturePath(locale, slug)` |
| `createComparisonDetailMetadataInput(...)` | `createArchitectureDetailMetadataInput(...)` |
| `comparisonDetailLabelsByLocale` | `architectureDetailLabelsByLocale` |
| `formatCategoryLabel(locale, category)` | `formatArchitectureCategoryLabel(locale, category)` |

Reuse `createLocalizedPath` / `Pathname` from the existing `@/i18n/locales` (as comparisons does).

### 4-2. Require same-language navigation

Detail-page links **must use `createLocalizedPath(locale, ...)`**. Hard-coded `/terms/${id}` / `/architectures/...` paths are prohibited.

| Link type | Implementation |
|---|---|
| AWS service chips | `createLocalizedPath(locale, /terms/${service})` (reuse the terms helper / check publication with the existing `isExistingTerm`) |
| "Back to architecture list" CTA | `createLocalizedPath(locale, "/architectures")` |
| "Home" breadcrumb | `createLocalizedPath(locale, "/")` |
| "Architectures" breadcrumb | `createLocalizedPath(locale, "/architectures")` |

### 4-3. Extend locale-specific publication support in termGuards

Align `architectureSlugSetByLocale` to `architectureSlugSet` for all three languages (same change as comparisons in P5-034):

```ts
// Modify frontend/src/lib/termGuards.ts
const architectureSlugSetByLocale: Record<Locale, Set<string>> = {
  ja: architectureSlugSet,
  en: architectureSlugSet,   // ← Changed (previously: empty set)
  zh: architectureSlugSet,   // ← Changed (previously: empty set)
};
```

This automatically enables same-language navigation from the "Related architectures" sections in terms / comparisons to en / zh detail pages (no additional implementation required / update termGuards comments as well).

### 4-4. MDX body loader

Create `architecture-content-loader.ts` as a one-to-one copy of comparisons' `comparison-content-loader.ts`. **No logic differences** (strip frontmatter + strip leading H1 + validate slugs + return null when a file is missing).

```ts
// frontend/src/app/(site)/architectures/architecture-content-loader.ts (new / Node-only)
export function loadArchitectureContent(locale, slug, title): string | null;
export function listArchitectureContentSlugs(locale): string[];
```

Look up `contents/architectures/{ja,en,zh}/<slug>.mdx` (the same two candidate paths as comparisons).

---

## 5. Category Label Localization (9 Categories)

Architectures has nine categories (comparisons has six). Define `architectureCategoryLabelsByLocale` in `architecture-detail-data.ts`.

| category (shared English key / shared anchor ID) | ja (existing localized labels) | en | zh (localized Traditional Chinese / Taiwan standard) |
|---|---|---|---|
| Static Hosting | 静的サイト | Static Hosting | 靜態網站託管 |
| Serverless | サーバーレス | Serverless | 無伺服器 |
| Three Tier | 3層構成 | Three Tier | 三層架構 |
| High Availability | 高可用性 | High Availability | 高可用性 |
| Batch | バッチ | Batch | 批次處理 |
| Networking | ネットワーク | Networking | 網路 |
| Integration | アプリ連携 | Integration | 應用整合 |
| Container | コンテナ | Container | 容器 |
| Monitoring | 運用監視 | Monitoring | 維運監控 |

> Use existing `architectureCategoryLabels` values unchanged for ja labels (do not break them). Keep category values and anchor IDs **fixed in English** for URL stability, switching only display labels by locale (follow comparisons §4-4). Finalize zh translations in the §7 Phase A translation task (Taiwan-standard terminology / no Simplified Chinese).

Redefine `level` labels identically to comparisons' `levelLabelsByLocale` in a separate namespace (localized specimens: beginner/intermediate/advanced → ja: 初級/中級/上級, en: Beginner/Intermediate/Advanced, zh: 初級/中級/進階).

---

## 6. SVG Localization (Per-Locale SVG Files + Locale Switching)

### 6-1. Decision: per-locale SVG files

Existing SVGs (`/images/architectures/<slug>.svg`) directly embed Japanese text (localized specimens: `S3を直接公開せず、CloudFront OAC経由で...` / `ポイント：S3は非公開...`). Because SVGs are rendered at build time with `<img src={diagramPath}>`, provide locale-specific SVG files and switch `diagramPath`.

### 6-2. File naming convention

| locale | SVG path | Handling |
|---|---|---|
| ja | `/images/architectures/<slug>.svg` | **Keep existing files unchanged** (do not rename / preserve history and existing links). |
| en | `/images/architectures/<slug>.en.svg` | Create new files (replace Japanese text with English). |
| zh | `/images/architectures/<slug>.zh.svg` | Create new files (replace Japanese text with Traditional Chinese). |

Actual files: `frontend/public/images/architectures/<slug>.en.svg` / `<slug>.zh.svg` (ja already exists).

> Why not rename ja to `<slug>.ja.svg`: preserve existing Japanese pages, links, and history (principle 0-2 #3). Accept asymmetric naming with no suffix for ja and suffixes only for en/zh.

### 6-3. Locale switching logic for diagramPath

Store the ja `diagramPath` (without a suffix) unchanged in JSON; resolve locales in a helper. This simplifies metadata JSON generation and consolidates the SVG naming convention's SSoT in one place, `resolveDiagramPath`.

```ts
// architecture-detail-data.ts
const DIAGRAM_SUFFIX_BY_LOCALE: Record<ArchitectureLocale, string> = {
  ja: "",
  en: ".en",
  zh: ".zh",
};

/**
 * Return the locale-specific SVG path.
 * Starting from meta.diagramPath (the unsuffixed ja path, e.g., /images/architectures/foo.svg),
 * insert a suffix immediately before the extension: en → foo.en.svg / zh → foo.zh.svg.
 * Return undefined if diagramPath is unset (hide the SVG section).
 */
export function resolveDiagramPath(
  locale: ArchitectureLocale,
  meta: ArchitectureMeta,
): string | undefined {
  if (!meta.diagramPath) return undefined;
  const suffix = DIAGRAM_SUFFIX_BY_LOCALE[locale];
  if (suffix === "") return meta.diagramPath;
  return meta.diagramPath.replace(/\.svg$/, `${suffix}.svg`);
}
```

> **Alternative (rejected)**: Store locale-specific full paths in JSON's `diagramPath`. This would distribute the SSoT across three JSON files and risk inconsistent suffix naming, so use the centralized helper. The parity test verifies that `diagramPath` (the unsuffixed base) matches across three languages, then checks file existence using the resolved paths (§8-4).

### 6-4. Rules for SVG text replacement (Phase B agents / SVG owners)

- **Do not change structure (rect / path / circle / viewBox / coordinates / colors)**. Translate **only text nodes** inside `<text>` elements.
- **Keep official AWS service names unchanged** (`Amazon S3` / `CloudFront` / `IAM`, etc.; English notation in both en/zh).
- Replace Japanese descriptions and mixed-language labels with the locale's translations (localized specimens: `S3を直接公開せず...` / `ポイント：...`; mixed label example: `Browser Access`).
- If longer text overflows the diagram, **reduce font-size or insert line breaks** (do not move coordinates or change rect widths / reviewers visually inspect overflow).
- Keep the existing `font-family` (`Arial, sans-serif`). If there is a concern that Arial cannot render Traditional Chinese, **append only** a fallback such as `"Noto Sans TC", sans-serif` to `font-family` (do not remove existing declarations).
- **Do not touch** ja SVGs (preserve existing files).

> **Delivery format note**: This project's SVGs are embedded in HTML (`<img src>`) and rendered by the browser, so they are an exception to the "PNG is authoritative" principle in `.claude/rules/engineering-asset-delivery.md` (direct SVG use is allowed as website UI). PNG conversion is unnecessary.

---

## 7. Implementation Order

### Phase A: Foundation (serial / single agent / main P5-042 work)

Establish the prerequisites for 20 parallel agents. The editor completes these before translation begins.

1. **A-1**: `frontend/src/types/architecture.ts` (new) — move types + labels from `architectures.ts` + add `ArchitectureLocale` / `ArchitectureArticle`.
2. **A-2**: `git mv frontend/contents/architectures/*.mdx frontend/contents/architectures/ja/` (10 files / preserve history / no content changes).
3. **A-3**: Generate `architectures.ja.json` — extract **metadata only, not bodies**, from ja MDX frontmatter + existing `architectures.ts` (verify it matches the existing 10 metadata entries in `architectures.ts` / omit `sections` / keep `tags` in ja).
4. **A-4**: Create placeholders in `architectures.en.json` (`title`/`description`/`tags` use temporary values such as `[EN] ...` / copy the rest from ja / `locale: "en"`).
5. **A-5**: Create placeholders in `architectures.zh.json` in the same way (`[ZH] ...` / `locale: "zh"`).
6. **A-6**: Add `frontend/contents/architectures/{en,zh}/.gitkeep` (empty directories / MDX comes in Phase B).
7. **A-7**: Rewrite `frontend/src/contents/architectures/architectures.ts` as a JSON re-export (compatibility layer), preserving `publishedArchitectures` / `architectures` / label re-exports.
8. **A-8**: `architecture-detail-data.ts` (new) — full set of locale resolution helpers + `architectureDetailLabelsByLocale` + `levelLabelsByLocale` + `architectureCategoryLabelsByLocale` (nine categories) + `resolveDiagramPath`.
9. **A-9**: `architecture-content-loader.ts` (new) — copy the comparisons loader one-to-one.
10. **A-10**: `architectures-page-data.ts` (new) — list-page data + `architecturesPageMetadataByLocale`.
11. **A-11**: `frontend/src/components/architectures/ArchitectureDetailContent.tsx` (new) — move JSX from the existing detail page + parameterize by locale + SVG locale switching + render the body with `MarkdownContent`.
12. **A-12**: `frontend/src/components/architectures/ArchitecturesListClient.tsx` (new) — parameterize the list UI by locale.
13. **A-13**: Replace existing `architectures/page.tsx` with a thin ja wrapper calling `ArchitecturesListClient`.
14. **A-14**: Replace existing `architectures/[architectureSlug]/page.tsx` with a thin ja wrapper calling `ArchitectureDetailContent`.
15. **A-15**: `en/architectures/page.tsx` + `en/architectures/[architectureSlug]/page.tsx` (new).
16. **A-16**: `zh/architectures/page.tsx` + `zh/architectures/[architectureSlug]/page.tsx` (new).
17. **A-17**: Align `architectureSlugSetByLocale` in `frontend/src/lib/termGuards.ts` to `architectureSlugSet` for all three languages + update comments.
18. **A-18**: SVG placeholders — create 20 `en`/`zh` SVGs **as copies of ja SVGs** (`<slug>.en.svg` / `<slug>.zh.svg`). Keep text in ja (replace with translations in Phase B). This prevents `<img>` 404s in the A-19 build.
19. **A-19**: Confirm `npm run typecheck && npm run build` both pass. Reach a state where all six routes render and every SVG displays **with placeholder translations still in place**.

At the end of Phase A, the pre-localization framework is complete. It is acceptable for `[EN]` / `[ZH]` to appear on screen.

### Phase B: Parallel localization (Localize × 20 + SVG / independent agents)

Assignment unit = **1 slug × 1 locale**. Each agent owns:

1. Create `frontend/contents/architectures/{en|zh}/<slug>.mdx` (translate the MDX body / no frontmatter).
2. Output `title` / `description` / `tags` to `frontend/contents/architectures/<slug>.{en|zh}.meta.json` (a small single-entry file / see parallel safety).
3. Replace text with translations in `frontend/public/images/architectures/<slug>.{en|zh}.svg` (overwrite the A-18 copy / follow §6-4).

#### Preventing races between parallel agents (important)

Direct additions to JSON are **prohibited**. Agents **must never open/write** `architectures.{en|zh}.json`. Instead, output **a small file per slug and locale**, `<slug>.en.meta.json` / `<slug>.zh.meta.json` (a schema-typed object containing only `title`/`description`/`tags`).

```jsonc
// Example: frontend/contents/architectures/static-site-s3-cloudfront.en.meta.json
{ "title": "...", "description": "...", "tags": ["...", "..."] }
```

At the end of Phase B, **the editor serially** reads the 20 meta.json files and merges `title`/`description`/`tags` into the corresponding entries (matched by slug) in `architectures.{en,zh}.json` (parallel agents → serial editor merge). Delete meta.json files after merging (or add them to `.gitignore`).

This ensures none of the 20 agents ever edit shared JSON concurrently, preventing contention over JSON files (principle 0-2 #2).

#### Slug list for 20 parallel assignments (10 slugs × 2 locales)

| # | slug | en agent | zh agent |
|---|---|---|---|
| 1 | static-site-s3-cloudfront | en | zh |
| 2 | serverless-api-basic | en | zh |
| 3 | three-tier-vpc | en | zh |
| 4 | high-availability-web-app | en | zh |
| 5 | eventbridge-lambda-batch | en | zh |
| 6 | private-subnet-vpc-endpoint | en | zh |
| 7 | sqs-lambda-async-processing | en | zh |
| 8 | sns-sqs-fanout | en | zh |
| 9 | ecs-fargate-web-app | en | zh |
| 10 | cloudwatch-monitoring-basic | en | zh |

Each agent's deliverables = one MDX + one meta.json + one SVG (= three files / no conflicts).

### Phase C: Validate localized internal links

1. **C-1**: Verify that the A-17 `termGuards.ts` change works in the "Related architectures" sections of ja/en/zh terms.
2. **C-2**: All detail-page links use `createLocalizedPath` (grep for hard-coded `/terms/${...}` / `/architectures/...`).
3. **C-3**: Verify breadcrumbs / CTA links work within the same language.

### Phase D: Tests

1. **D-1**: `npm run typecheck` passes.
2. **D-2**: `npm run build` passes.
3. **D-3**: Visually inspect the three routes `/architectures/static-site-s3-cloudfront` / `/en/architectures/...` / `/zh/architectures/...` + SVG rendering on the dev server (any one slug).
4. **D-4**: Add a parity invariant test (§8-4).

---

## 8. Test Strategy

### 8-1. Required

- `npm run typecheck`
- `npm run build` (all slugs must build successfully because `dynamicParams = false`)

### 8-2. Parity invariant test (new / follow comparisons-locale-parity.test.ts)

Location: `frontend/src/contents/architectures/__tests__/architectures-locale-parity.test.ts`

Invariants to verify:

1. **(1) Matching slug sets**: The slug sets in ja/en/zh JSON match exactly (10 entries).
2. **(2) Matching architectureId**: For a given slug, `architectureId` matches across ja/en/zh.
3. **(3) Matching shared metadata**: For a given slug, `services` / `category` / `level` / `examScopes` / `mermaid` / `published` / `publishedAt` / `updatedAt` match across ja/en/zh (**exclude `tags` from SHARED_FIELDS because they are translated per locale** / §1-2).
4. **(4) MDX existence**: For every slug, `fs.existsSync = true` for `contents/architectures/{ja,en,zh}/<slug>.mdx`.
5. **(5) SVG existence**: For every slug, `fs.existsSync = true` for `public/images/architectures/<slug>.svg` (ja) / `<slug>.en.svg` / `<slug>.zh.svg` (structurally detect missing SVG translations and naming errors).
6. **(6) diagramPath consistency**: `diagramPath` (based on the unsuffixed ja path) matches across all three JSON languages, and `resolveDiagramPath(locale, meta)` matches the file path checked for existence in `(5)`.
7. **(7) Leading MDX H1 consistency**: Same as comparisons (6) — the leading H1 matches the JSON title or `title.startsWith(h1Text)` (the format must allow the loader's `removeLeadingH1` to strip it).

> **Why (3) excludes tags**: In comparisons, tags were shared English slugs and therefore included in SHARED_FIELDS, whereas architecture tags include Japanese and are translated by locale (§1-2). Including tags in SHARED_FIELDS would require all three languages to match and prevent translation, so exclude them. Optionally add a lightweight separate it to check matching tag counts (`tags.length` is identical across three languages).

### 8-3. Recommended additions

- One unit test confirming `architecture-content-loader` correctly reads MDX without frontmatter (same pattern as comparisons).
- Snapshot tests for `createArchitecturePath(locale, slug)` / `resolveDiagramPath(locale, meta)`.

### 8-4. Manual checks

- Visually inspect lists in three languages / details in three languages × any one slug = six pages + verify SVGs switch by locale.
- Enter en→ja / zh→ja URLs directly and verify the same slug leads to the same article (language-switch UI integration is a separate issue).

---

## 9. Rationale for Parallel Safety (Why Phase 4 Parallel Translation Avoids JSON Contention)

| Mechanism | Effect |
|---|---|
| Agents **never open/write** shared JSON (`architectures.{en,zh}.json`). | The structure prevents races from 20 agents writing the same file concurrently. |
| Each agent's JSON deliverable is **a small `<slug>.{en,zh}.meta.json` file per slug and locale** (schema-typed: only `title`/`description`/`tags`). | Each agent has a unique output file (no filename collisions). A fixed schema allows the merge step to consolidate files mechanically. |
| MDX uses `{en,zh}/<slug>.mdx`, **one file per agent**. | No conflicts in MDX bodies either. |
| SVG uses `<slug>.{en,zh}.svg`, **one file per agent**. | No conflicts in SVG translations either. |
| Shared JSON is consolidated **serially by the editor at the end of Phase B**. | A single process sequentially merges 20 meta.json files into two language-specific JSON files, then runs parity tests to detect omissions. |

= **Each agent writes exactly three unique files: one MDX + one meta.json + one SVG**. Agents neither read nor write shared JSON. This is the core of the design that prevents Phase 4 parallel translation from contending over JSON files.

---

## 10. Fixed Requirements (Recap)

- Preserve existing Japanese URLs `/architectures/[slug]` / `/architectures`.
- Do not rename or modify existing Japanese SVGs (`<slug>.svg`).
- **Do not modify bodies** in existing `contents/architectures/<slug>.mdx` files (move under `ja/` with git mv / task out-of-scope item).
  - **Exception (recorded in CR1-M1 / 2026-06-21)**: Moving the body SSoT to MDX required satisfying the loader `removeLeadingH1` stripping condition (`h1 === title` or `title.startsWith(h1)`), so **only the leading H1 of two ja MDX files was aligned with the JSON title** to satisfy parity invariant (7). The loader strips the body's H1 before rendering, so page display is unaffected. Modified localized specimens:
    - `contents/architectures/ja/cloudwatch-monitoring-basic.mdx`:
      - before: `# CloudWatchで見るサーバーレス運用監視構成`
      - after: `# CloudWatch サーバーレス運用監視構成` (matches JSON title)
    - `contents/architectures/ja/private-subnet-vpc-endpoint.mdx`:
      - before: `# VPC EndpointでAWSサービスへプライベート接続する構成`
      - after: `# VPC Endpoint プライベート接続構成` (matches JSON title)
  - ja MDX bodies outside these two changes (including content other than H1) are **unchanged**.
  - If future changes are needed for ja MDX H1 consistency, **explicitly record before/after values** in this section (do not make silent changes).
- Align naming, placement, and helpers one-to-one with comparisons (P5-034).
- Prevent parallel writes to shared JSON (merge per-slug meta.json files).
- Do not address the wiring design for Mermaid rendering (task out-of-scope item / this phase renders SVG images only).
- Reviewers check the prohibited generic AI phrasing list (follow comparisons §6-5 / each of ja/en/zh).

---

## 11. Open Questions

1. **Existing `architectures.ts` `sections[]` bodies vs. existing MDX bodies**: Unify the authoritative ja body in MDX (MDX is more detailed). Keep `sections[]` only as a compatibility type; include it in neither JSON nor detail pages. In Phase A-3, clearly separate metadata in JSON from bodies in MDX.
2. **Traditional Chinese fonts**: Whether to allow adding a Noto Sans TC fallback if SVG `font-family: Arial` produces missing-glyph boxes (§6-4 / decide based on actual browser/device inspection).
3. **Add architectures to language-switch UI (hreflang / footer language switcher)**: Follow whether terms / comparisons support it (possibly a separate issue / outside this phase's scope).
4. Check for **AWS services absent from terms.{en,zh}.json** in architecture services / bodies (exhaustively grep before agents start translating / refer to the terminology SSoT).
5. Decide whether **future architecture diagram articles** must be published in all three languages at once or may be published in ja first with delayed translations (the latter requires extending `published` to locale-specific management).

---

## 12. PSP Measurement Fields (Fill in on Ticket Completion)

```yaml
psp:
  actual-duration: TBD             # h
  bug-count: TBD
  code-volume:
    files-changed: TBD             # Expected ~50 (foundation ~15 + 20 mdx + 20 svg + 3 metadata JSON + 1 test + 1 type file)
    lines-added: TBD
    lines-deleted: TBD
task-category: design + impl + content   # Consider combining multiple coefficients for this mixed category.
estimate-vs-actual:
  estimated: TBD
  actual: TBD
  deviation-pct: TBD
```

## 13. Numbering and Related Work

- This design document: P5-042 (Phase 5-G foundation)
- Predecessor: P5-034 comparison article localization PR #277 (commit 32b5c6f / merged into dev)
- Reference design: `frontend/docs/p5-034-comparisons-localization-design.md`
- Terminology rules: `frontend/docs/p5-032-aws-terminology-rules.md`
- Related files (foundation):
  - `frontend/src/types/architecture.ts` (new)
  - `frontend/src/contents/architectures/architectures.ts` (convert to compatibility layer)
  - `frontend/src/app/(site)/architectures/architecture-detail-data.ts` (new)
  - `frontend/src/app/(site)/architectures/architecture-content-loader.ts` (new)
  - `frontend/src/app/(site)/architectures/architectures-page-data.ts` (new)
  - `frontend/src/components/architectures/ArchitectureDetailContent.tsx` (new)
  - `frontend/src/components/architectures/ArchitecturesListClient.tsx` (new)
  - `frontend/src/lib/termGuards.ts` (extend locale-specific sets)
