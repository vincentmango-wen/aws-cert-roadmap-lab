# P5-042 構成図記事多言語化 — 設計書（Phase 5-G）

- 起票日: 2026-06-21
- ブランチ: `feat/p5-042-phase5g-architectures-localization`（base = `dev`）
- 想定 PR: 1 本（基盤 + 20 ローカライズ + SVG 多言語化 + parity test）
- 先行参考実装: **P5-034 比較記事多言語化 PR #277（commit 32b5c6f）** — 同型 hybrid 構造（メタ JSON + 本文 MDX + locale 解決ヘルパー）
- 先行設計書: `frontend/docs/p5-034-comparisons-localization-design.md`
- 対象記事: **10 本**（slug 一覧は §7 Phase B 表）

---

## 0. 設計上のゴールと制約

### 0-1. Issue 完了条件（必須）

1. 全 10 記事を ja / en / zh の 3 言語化する
2. `/en/architectures/[slug]` と `/zh/architectures/[slug]` が **10 slug すべて**で表示される
3. 日本語 URL（`/architectures/[slug]` / `/architectures`）は **既存のまま維持**
4. `npm run typecheck` と `npm run build` が pass する
5. **parity invariant test** を追加する（3 言語の slug / architectureId / 共通メタ / MDX / SVG 存在の構造担保）
6. SVG 内の日本語テキストを en / zh 版で置換する（per-locale SVG ファイル + locale 切替）
7. 10 本一覧ページ（`/en/architectures` / `/zh/architectures`）も併せて公開する

### 0-2. 設計指針（優先度順）

1. **P5-034 比較記事多言語化と命名・配置・ヘルパー構造を 1:1 で揃える**（学習コスト削減 / レビュー観点の流用 / 既に dev に merge 済みの実証済みパターン）
2. **後段 20 並列 agent が独立に翻訳できる粒度に分割する**（共有 JSON を取り合わない per-slug 単位ファイル構造）
3. **既存日本語ページ・既存日本語 SVG を壊さない**（rename ではなく拡張 / 日本語は既存ファイル名のまま）
4. **本文 SSoT を MDX に統一する**（現状の `architectures.ts` `sections[]` インライン本文 → MDX body に移行 / 既存だが wiring 切れの 10 本 MDX を活かす）

### 0-3. comparisons との構造差分（重要 — 設計判断の根拠）

P5-034 をそのまま流用できない箇所を先に明示する。

| 観点 | comparisons（P5-034）| architectures（本 P5-042）| 対応方針 |
|---|---|---|---|
| 既存本文 SSoT | MDX（`contents/comparisons/*.mdx`）が page から参照されていた | **`architectures.ts` の `sections[]` 配列がインライン本文 SSoT**。`contents/architectures/*.mdx` 10 本は存在するが **page から参照されていない（wiring 切れ）** | 本文 SSoT を MDX に統一。`architectures.ts` のリッチでない `sections[]` ではなく、**より詳細な既存 MDX 本文**を ja 本文の正本にする |
| 図の描画 | mermaid をテキストで本文内描画 | **`diagramPath` で per-slug の SVG を `<img>` 描画**（`mermaid: true` フラグは立つが詳細ページは SVG 画像を表示）| SVG を per-locale ファイル化し `diagramPath` を locale 別に切替（§6）|
| id フィールド | `comparisonId`（cmp-NNN）| `architectureId`（arc-NNN）| 命名だけ差し替え。構造は同一 |
| category 数 | 6（Storage 等）| **9**（Static Hosting / Serverless / Three Tier / High Availability / Batch / Networking / Integration / Container / Monitoring）| `architectureCategoryLabelsByLocale` を 9 key で再定義（§5）|
| 記事数 | 11 | **10** | parity test の件数のみ差分 |

---

## 1. ファイル / ディレクトリ構造

### 1-1. 結論: ハイブリッド設計（メタ JSON + 本文 MDX）

P5-034 と同型。メタデータは locale 別 JSON 3 本に集約、本文は locale 別 MDX に切り出す。

| 種別 | 配置 | 採用理由 |
|---|---|---|
| メタデータ（architectureId / slug / title / description / category / level / examScopes / services / tags / diagramPath / mermaid / published / publishedAt / updatedAt / locale）| `frontend/contents/architectures/architectures.{ja,en,zh}.json` | comparisons と並列の SSoT 化。20 並列 agent が触る範囲が 1 件のみで衝突しない |
| 本文 MDX | `frontend/contents/architectures/{ja,en,zh}/<slug>.mdx` | 既存 MDX 構造を活用。MarkdownContent renderer を comparisons から共通利用。行単位 agent 編集で衝突しにくい |

#### ディレクトリ構造（最終形）

```
frontend/contents/architectures/
├── architectures.ja.json               # メタデータ ja（10 件）
├── architectures.en.json               # メタデータ en（10 件）
├── architectures.zh.json               # メタデータ zh（10 件 / 繁体字）
├── ja/                                 # 既存 MDX 10 本を git mv で移動（履歴保全）
│   ├── static-site-s3-cloudfront.mdx
│   ├── serverless-api-basic.mdx
│   └── ...（10 件）
├── en/                                 # 20 並列で agent が新規作成
│   ├── static-site-s3-cloudfront.mdx
│   └── ...（10 件）
└── zh/                                 # 20 並列で agent が新規作成
    ├── static-site-s3-cloudfront.mdx
    └── ...（10 件）
```

#### 旧パス（`frontend/contents/architectures/*.mdx`）の扱い

`git mv frontend/contents/architectures/<slug>.mdx frontend/contents/architectures/ja/<slug>.mdx` で 10 本を ja 配下に移動し履歴保全。**本文は原則改変しない**（task の「やらないこと」遵守 / frontmatter も移動時点では維持）。loader 側で frontmatter を剥がして本文だけ読む。

**例外（CR1-M1 / 2026-06-21）**: 本文 SSoT を MDX 化したことで parity invariant (7) `h1 === title || title.startsWith(h1)` を満たす必要があり、ja MDX 2 本（`cloudwatch-monitoring-basic.mdx` / `private-subnet-vpc-endpoint.mdx`）の **先頭 H1 のみを JSON title に揃えた**。詳細・before/after は §10 を参照。

### 1-2. メタデータ JSON のスキーマ

`architectures.{ja,en,zh}.json` は以下の配列。**architectureId / slug / category / level / examScopes / services / tags / mermaid / published / publishedAt / updatedAt は全 locale 共通**にし、`title / description / diagramPath` のみ locale 別にする。

```jsonc
[
  {
    "architectureId": "arc-001",
    "slug": "static-site-s3-cloudfront",
    "title": "S3 + CloudFront 静的Webサイト構成",                 // ← locale 別
    "description": "S3に配置した静的サイトを...",                  // ← locale 別
    "category": "Static Hosting",                                // 共通
    "level": "beginner",                                         // 共通
    "examScopes": ["CLF-C02", "SAA-C03"],                        // 共通
    "services": ["s3", "cloudfront", "iam", "acm", "route53"],   // 共通
    "tags": ["静的サイト", "CDN", "HTTPS", "OAC", "低コスト"],     // ⚠ §6-3 参照（locale 別）
    "diagramPath": "/images/architectures/static-site-s3-cloudfront.svg", // ← locale 別（§6）
    "mermaid": true,                                             // 共通
    "published": true,                                           // 共通
    "publishedAt": "2026-06-01",                                 // 共通
    "updatedAt": "2026-06-21",                                   // 共通
    "locale": "ja"                                               // ← 判別用
  }
]
```

> **`tags` の扱い（comparisons と差分）**: comparisons の tags は英語スラグ（`storage` 等）で locale 共通だったが、architectures の既存 tags は **日本語混在**（`静的サイト` / `CDN` / `低コスト`）。本フェーズでは tags も **title / description と同様 locale 別翻訳対象**とする（parity test の SHARED_FIELDS から tags は除外 / §8-4）。en / zh で自然な訳語に翻訳する。

#### `published` の扱い

10 本すべてを 1 PR で en / zh 公開する前提のため、`published: true` を 3 言語で揃える。将来翻訳が遅延する記事が出たら locale 別 published フィルタへ拡張（comparisons と同方針）。

#### 旧 `src/contents/architectures/architectures.ts` の扱い（compat 層）

`termGuards.ts`（`import { publishedArchitectures }`）/ 既存 ja 一覧・詳細 page が `@/contents/architectures/architectures` を import しているため、**ここを壊さないのが最優先**。

`architectures.ts` を **ja JSON を読み直して同じ `publishedArchitectures` / `architectures` を再 export する薄い compat 層**に書き換える。comparisons.ts と同型。

```ts
// frontend/src/contents/architectures/architectures.ts (新 / compat 層)
import architecturesJaData from "../../../contents/architectures/architectures.ja.json";
import type { ArchitectureMeta } from "../../types/architecture";

export const architectures: ArchitectureMeta[] = architecturesJaData as ArchitectureMeta[];
export const publishedArchitectures = architectures.filter((a) => a.published);

// 既存 export（型 / ラベル）の互換維持:
// architectureLevelLabels / architectureCategoryLabels / awsServiceLabels は
// 型・ラベル定義として src/types/architecture.ts へ移設し、ここから re-export する。
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

> **`sections?` フィールドの扱い**: 本文 SSoT を MDX に移すため、JSON 側に `sections` は **入れない**（重複 SSoT を作らない）。型 `ArchitectureMeta.sections?` は optional のまま残す（compat / 既存 import 互換）が、JSON データには含めない。詳細 page は MDX 本文（`ArchitectureArticle.content`）を描画する形に移行する。

---

## 2. 型 / Architecture interface の拡張

### 2-1. 型を `src/types/architecture.ts` に集約（新規）

現状 `architectures.ts` がデータ + 型 + ラベルを兼ねている。compat 層化に伴い、型・ラベルを `src/types/architecture.ts` に切り出す（comparisons の `src/types/comparison.ts` と対称）。

```ts
// frontend/src/types/architecture.ts（新規 / 既存定義を移設）
export type ArchitectureLevel = "beginner" | "intermediate" | "advanced";
export type ExamScope = "CLF-C02" | "SAA-C03";
export type ArchitectureLocale = "ja" | "en" | "zh";   // 新規

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
  sections?: ArchitectureSection[];      // optional 維持（JSON には含めない）
  locale?: ArchitectureLocale;           // 新規（optional）
};

// 本文付き型（詳細 page で使用）
export type ArchitectureArticle = ArchitectureMeta & { content: string };

// 既存ラベル定義（ja 用 / compat）はここに移設し architectures.ts から re-export
export const architectureLevelLabels: Record<ArchitectureLevel, string> = { /* 既存値 */ };
export const architectureCategoryLabels: Record<ArchitectureCategory, string> = { /* 既存値 */ };
export const awsServiceLabels: Record<string, string> = { /* 既存値 */ };
```

`locale` を optional にすることで、compat 層の配列（locale なしでも可 / JSON は locale あり）と JSON データを同一型で扱える。

---

## 3. ルート設計

### 3-1. 3 言語 × 2 階層 = 6 ルート

| URL | ファイル | generateStaticParams | 内容 |
|---|---|---|---|
| `/architectures` | `app/(site)/architectures/page.tsx`（既存修正）| - | ja 一覧 |
| `/architectures/[architectureSlug]` | `app/(site)/architectures/[architectureSlug]/page.tsx`（既存修正）| ja の slug 10 件 | ja 詳細 |
| `/en/architectures` | `app/(site)/en/architectures/page.tsx`（新規）| - | en 一覧 |
| `/en/architectures/[architectureSlug]` | `app/(site)/en/architectures/[architectureSlug]/page.tsx`（新規）| en の slug 10 件 | en 詳細 |
| `/zh/architectures` | `app/(site)/zh/architectures/page.tsx`（新規）| - | zh 一覧 |
| `/zh/architectures/[architectureSlug]` | `app/(site)/zh/architectures/[architectureSlug]/page.tsx`（新規）| zh の slug 10 件 | zh 詳細 |

全 route に `export const dynamic = "force-static"` / `export const dynamicParams = false` を付ける（comparisons と同一 / 全 slug がビルド成功する必要）。

### 3-2. 詳細ページ — locale 引数で分岐する共通実装パターン

comparisons の `comparison-detail-data.ts` を 1:1 で踏襲し、3 言語の詳細ページは **薄いラッパー**にしてロジックを `architecture-detail-data.ts` に集約する。

```ts
// frontend/src/app/(site)/architectures/architecture-detail-data.ts（新規）
import type { ArchitectureArticle, ArchitectureLocale } from "@/types/architecture";

export function getArchitectures(locale): ArchitectureMeta[];
export function getPublishedArchitectures(locale): ArchitectureMeta[];
export function getArchitectureMetaBySlug(locale, slug): ArchitectureMeta | null;
export function getArchitectureBySlug(locale, slug): ArchitectureArticle | null;   // メタ + MDX 本文
export function getArchitectureStaticParams(locale): { architectureSlug: string }[];
export function createArchitecturePath(locale, slug): Pathname;
export function createArchitectureDetailMetadataInput(locale, slug): PageMetadataInput;
export const architectureDetailLabelsByLocale: Record<ArchitectureLocale, ArchitectureDetailLabels>;
export const levelLabelsByLocale: Record<ArchitectureLocale, Record<ArchitectureLevel, string>>;
export const architectureCategoryLabelsByLocale: Record<ArchitectureLocale, Record<ArchitectureCategory, string>>;
export function formatArchitectureCategoryLabel(locale, category): string;
export function resolveDiagramPath(locale, meta): string | undefined;   // §6 SVG locale 切替
```

en / zh の薄いラッパー（comparisons の en page と同型）:

```ts
// frontend/src/app/(site)/en/architectures/[architectureSlug]/page.tsx（新規）
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

### 3-3. 一覧ページ — `architectures-page-data.ts` に集約

```ts
// frontend/src/app/(site)/architectures/architectures-page-data.ts（新規）
export const architecturesPageMetadataByLocale: Record<ArchitectureLocale, PageMetadataInput>;
export function getArchitecturesPageData(locale): {
  labels: ArchitecturesListLabels;
  architectures: ArchitectureMeta[];
  categories: ArchitectureCategory[];
};
```

一覧 UI は既存 `architectures/page.tsx` から `ArchitecturesListClient.tsx`（locale 引数化）へ抽出。ja page は薄いラッパーに置換。

### 3-4. 本文 renderer の扱い

詳細 page は本文 MDX を描画する形に移行する。**comparisons が既に持つ `MarkdownContent`（`@/components/comparisons/MarkdownContent`）を再利用する**（renderInline / renderTable 含む / mermaid コードブロックは comparisons 同様にコードブロック描画）。

> **判断**: architectures 専用の renderer を新規作成しない（最小構成 / グローバル §2）。comparisons の MarkdownContent が markdown table / inline 記法を既にカバーしているため共通利用が妥当。将来 architectures 固有の描画要件が出たら分離を検討。

### 3-5. 詳細ページ本体コンポーネント

```
frontend/src/components/architectures/ArchitectureDetailContent.tsx（新規 / locale 引数化）
frontend/src/components/architectures/ArchitecturesListClient.tsx（新規 / locale 引数化）
```

既存 `architectures/[architectureSlug]/page.tsx` の JSX 構造（パンくず / header / 構成図 SVG / 使用 AWS サービス / 本文 / CTA）を `ArchitectureDetailContent` に移設し、以下を locale 化:

- パンくず（ホーム / 構成図 / タイトル）→ `architectureDetailLabelsByLocale[locale]` + `createLocalizedPath(locale, ...)`
- カテゴリ / レベルバッジ → `architectureCategoryLabelsByLocale` / `levelLabelsByLocale`
- 構成図 SVG → `resolveDiagramPath(locale, meta)`（§6）+ alt 文言を locale 化
- 「使用AWSサービス」見出し・説明・サービスチップ → labels 化 + `createTermDetailPath(locale, service)` で同言語遷移（§4）
- 本文 → `architecture.content`（MDX）を `MarkdownContent` で描画。MDX が空（翻訳前）なら `sections` フォールバックは設けず空セクション（build を落とさない）
- CTA「構成図一覧へ戻る」「他のAWS構成図も確認する」→ labels 化 + `createLocalizedPath(locale, "/architectures")`

---

## 4. ロケール解決ヘルパー & 同言語遷移（内部リンク）

### 4-1. comparisons と完全に揃える

| comparisons 関数 | architectures 対応 |
|---|---|
| `getComparisons(locale)` | `getArchitectures(locale)` |
| `getComparisonMetaBySlug(locale, slug)` | `getArchitectureMetaBySlug(locale, slug)` |
| `getComparisonBySlug(locale, slug)` | `getArchitectureBySlug(locale, slug)` |
| `getComparisonStaticParams(locale)` | `getArchitectureStaticParams(locale)` |
| `createComparisonPath(locale, slug)` | `createArchitecturePath(locale, slug)` |
| `createComparisonDetailMetadataInput(...)` | `createArchitectureDetailMetadataInput(...)` |
| `comparisonDetailLabelsByLocale` | `architectureDetailLabelsByLocale` |
| `formatCategoryLabel(locale, category)` | `formatArchitectureCategoryLabel(locale, category)` |

`createLocalizedPath` / `Pathname` は既存 `@/i18n/locales` を再利用（comparisons と同じ）。

### 4-2. 同言語遷移の必須化

詳細ページ内のリンクは **必ず `createLocalizedPath(locale, ...)` 経由**。hard-coded `/terms/${id}` / `/architectures/...` は禁止。

| リンク種別 | 対応 |
|---|---|
| 使用AWSサービスチップ | `createLocalizedPath(locale, /terms/${service})`（terms ヘルパー流用 / 既存 `isExistingTerm` で公開判定）|
| 「構成図一覧へ戻る」CTA | `createLocalizedPath(locale, "/architectures")` |
| パンくず「ホーム」 | `createLocalizedPath(locale, "/")` |
| パンくず「構成図」 | `createLocalizedPath(locale, "/architectures")` |

### 4-3. termGuards の locale 別 published 拡張

`architectureSlugSetByLocale` を 3 言語とも `architectureSlugSet` に揃える（comparisons の P5-034 と同型の変更）:

```ts
// frontend/src/lib/termGuards.ts 修正
const architectureSlugSetByLocale: Record<Locale, Set<string>> = {
  ja: architectureSlugSet,
  en: architectureSlugSet,   // ← 変更（旧: 空セット）
  zh: architectureSlugSet,   // ← 変更（旧: 空セット）
};
```

これにより terms / comparisons 側の「関連構成図」セクションから en / zh 詳細への同言語遷移が自動的に有効化される（追加実装不要 / termGuards コメントも併せて更新）。

### 4-4. 本文 MDX ローダー

comparisons の `comparison-content-loader.ts` を 1:1 で複製した `architecture-content-loader.ts` を新規作成する。**ロジック差分なし**（frontmatter strip + leading H1 strip + slug バリデーション + ファイル不在時 null）。

```ts
// frontend/src/app/(site)/architectures/architecture-content-loader.ts（新規 / Node-only）
export function loadArchitectureContent(locale, slug, title): string | null;
export function listArchitectureContentSlugs(locale): string[];
```

ディレクトリ探索は `contents/architectures/{ja,en,zh}/<slug>.mdx`（comparisons と同じ 2 候補パス探索）。

---

## 5. category ラベルの多言語化（9 軸）

architectures は 9 category（comparisons は 6）。`architecture-detail-data.ts` に `architectureCategoryLabelsByLocale` を定義する。

| category（共通英語 key / 共通アンカー id）| ja（既存）| en | zh（繁体字 / 台湾標準）|
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

> ja ラベルは既存 `architectureCategoryLabels` の値をそのまま使う（破壊しない）。category 値・アンカー id は **英語固定**で URL 安定性を保ち、表示ラベルのみ locale 切替（comparisons §4-4 の方針を踏襲）。zh 訳語は §7 Phase A の翻訳タスクで確定（台湾標準用語を採用 / 簡体字禁止）。

`level` ラベルは comparisons の `levelLabelsByLocale` と同一（beginner/intermediate/advanced → ja: 初級/中級/上級, en: Beginner/Intermediate/Advanced, zh: 初級/中級/進階）を再定義（namespace 分離）。

---

## 6. SVG localization（per-locale SVG ファイル + locale 切替）

### 6-1. 結論: per-locale SVG ファイル方式

現状 SVG（`/images/architectures/<slug>.svg`）には日本語テキストが直接埋め込まれている（例: `S3を直接公開せず、CloudFront OAC経由で...` / `ポイント：S3は非公開...`）。SVG はビルド時に `<img src={diagramPath}>` で描画されるため、locale 別の SVG ファイルを用意し `diagramPath` を切り替える。

### 6-2. ファイル命名規則

| locale | SVG パス | 扱い |
|---|---|---|
| ja | `/images/architectures/<slug>.svg` | **既存ファイルをそのまま維持**（リネームしない / 履歴・既存リンク保全）|
| en | `/images/architectures/<slug>.en.svg` | 新規作成（日本語テキストを英語に置換）|
| zh | `/images/architectures/<slug>.zh.svg` | 新規作成（日本語テキストを繁体字に置換）|

実体ファイル: `frontend/public/images/architectures/<slug>.en.svg` / `<slug>.zh.svg`（ja は既存）。

> ja を `<slug>.ja.svg` にリネームしない理由: 既存日本語ページ・既存リンク・履歴を壊さない（指針 0-2 #3）。ja のみ無印、en/zh のみサフィックス付きの非対称命名を許容する。

### 6-3. diagramPath の locale 切替ロジック

JSON には ja の `diagramPath`（無印）をそのまま入れ、locale 別解決はヘルパーで行う。これにより JSON のメタ生成が単純化し、SVG ファイル命名規則の SSoT が `resolveDiagramPath` 1 箇所に集約される。

```ts
// architecture-detail-data.ts
const DIAGRAM_SUFFIX_BY_LOCALE: Record<ArchitectureLocale, string> = {
  ja: "",
  en: ".en",
  zh: ".zh",
};

/**
 * locale 別の SVG パスを返す。
 * meta.diagramPath（ja の無印パス / 例 /images/architectures/foo.svg）を基準に
 * en → foo.en.svg / zh → foo.zh.svg へ拡張子直前にサフィックスを挿入する。
 * diagramPath 未設定なら undefined（SVG セクション非表示）。
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

> **代替案（不採用）**: JSON の `diagramPath` を locale 別フルパスで持つ案。SSoT が JSON 3 ファイルに分散しサフィックス命名のズレ事故を生むため、ヘルパー集約方式を採用。parity test では「3 言語で `diagramPath`（無印基準）が一致」を検証し、ファイル存在は実パスで検証する（§8-4）。

### 6-4. SVG テキスト置換の規律（Phase B agent / SVG 担当）

- **構造（rect / path / circle / viewBox / 座標 / 色）は一切変更しない**。`<text>` 要素の **テキストノードのみ**を翻訳する
- AWS サービス正式名（`Amazon S3` / `CloudFront` / `IAM` 等）は **翻訳せず原文維持**（en/zh とも英語表記）
- 日本語の説明文（`S3を直接公開せず...` / `ポイント：...` / `Browser Access` 等の混在ラベル）を locale 訳語に置換
- テキスト長が伸びて図からはみ出す場合は **font-size を下げる or 改行**で対応（座標・rect 幅は動かさない / はみ出しは reviewer が目視チェック）
- `font-family` は既存（`Arial, sans-serif`）維持。繁体字が Arial で描画されない懸念があれば `font-family` に `"Noto Sans TC", sans-serif` 等のフォールバックを **末尾追加のみ**で対応（既存指定を消さない）
- ja SVG は **触らない**（既存維持）

> **納品形式の補足**: 本プロジェクトの SVG は HTML 埋込（`<img src>`）でブラウザレンダリングされるため、`.claude/rules/engineering-asset-delivery.md` の「PNG が正本」原則の例外（サイト内 UI として SVG 直接利用が許容されるケース）に該当する。PNG 変換は不要。

---

## 7. 実装順序

### Phase A: 基盤（Foundation / シリアル / 単一 agent / P5-042 本体）

20 並列 agent が触る前提を作る。エディタが着工前に完遂する。

1. **A-1**: `frontend/src/types/architecture.ts`（新規）— 型 + ラベルを `architectures.ts` から移設 + `ArchitectureLocale` / `ArchitectureArticle` 追加
2. **A-2**: `git mv frontend/contents/architectures/*.mdx frontend/contents/architectures/ja/`（10 本 / 履歴保全 / 中身改変なし）
3. **A-3**: `architectures.ja.json` を生成 — **本文ではなくメタのみ**を ja MDX frontmatter + 既存 `architectures.ts` から抽出（既存 `architectures.ts` の 10 件メタと一致確認 / `sections` は入れない / `tags` は ja のまま）
4. **A-4**: `architectures.en.json` をプレースホルダ作成（`title`/`description`/`tags` を `[EN] ...` 等の仮値 / 残りは ja からコピー / `locale: "en"`）
5. **A-5**: `architectures.zh.json` も同様にプレースホルダ作成（`[ZH] ...` / `locale: "zh"`）
6. **A-6**: `frontend/contents/architectures/{en,zh}/.gitkeep` を置く（空ディレクトリ / MDX は Phase B）
7. **A-7**: `frontend/src/contents/architectures/architectures.ts` を JSON 再 export 版（compat 層）に書き換え（`publishedArchitectures` / `architectures` / ラベル re-export 維持）
8. **A-8**: `architecture-detail-data.ts`（新規）— locale 解決ヘルパー一式 + `architectureDetailLabelsByLocale` + `levelLabelsByLocale` + `architectureCategoryLabelsByLocale`（9 軸）+ `resolveDiagramPath`
9. **A-9**: `architecture-content-loader.ts`（新規）— comparisons loader を 1:1 複製
10. **A-10**: `architectures-page-data.ts`（新規）— 一覧ページデータ + `architecturesPageMetadataByLocale`
11. **A-11**: `frontend/src/components/architectures/ArchitectureDetailContent.tsx`（新規）— 既存詳細 page から JSX 移設 + locale 引数化 + SVG locale 切替 + 本文を `MarkdownContent` 描画
12. **A-12**: `frontend/src/components/architectures/ArchitecturesListClient.tsx`（新規）— 一覧 UI を locale 引数化
13. **A-13**: 既存 `architectures/page.tsx` を `ArchitecturesListClient` 呼び出しの薄い ja ラッパーに置換
14. **A-14**: 既存 `architectures/[architectureSlug]/page.tsx` を `ArchitectureDetailContent` 呼び出しの薄い ja ラッパーに置換
15. **A-15**: `en/architectures/page.tsx` + `en/architectures/[architectureSlug]/page.tsx`（新規）
16. **A-16**: `zh/architectures/page.tsx` + `zh/architectures/[architectureSlug]/page.tsx`（新規）
17. **A-17**: `frontend/src/lib/termGuards.ts` の `architectureSlugSetByLocale` を 3 言語とも `architectureSlugSet` に揃える + コメント更新
18. **A-18**: SVG プレースホルダ — `en`/`zh` SVG を **ja SVG のコピー**で 20 本作成（`<slug>.en.svg` / `<slug>.zh.svg`）。テキストは ja のまま（Phase B で翻訳置換）。これにより A-19 のビルドで `<img>` 404 が起きない
19. **A-19**: `npm run typecheck && npm run build` 全 pass を確認。**プレースホルダ翻訳のまま**で 6 ルート全表示・全 SVG 描画できる状態に到達

Phase A 完了時点でローカライズ前のフレーム完成。画面に `[EN]` / `[ZH]` が出ても OK。

### Phase B: 並列ローカライズ（Localize × 20 + SVG / 各 agent 独立）

割り当て単位 = **1 slug × 1 locale**。各 agent の担当範囲:

1. `frontend/contents/architectures/{en|zh}/<slug>.mdx` の新規作成（本文 MDX 翻訳 / frontmatter なし）
2. `frontend/contents/architectures/<slug>.{en|zh}.meta.json`（1 件単位の小ファイル / §並列安全性）に `title` / `description` / `tags` を出力
3. `frontend/public/images/architectures/<slug>.{en|zh}.svg` のテキスト翻訳置換（A-18 のコピーを上書き / §6-4 規律遵守）

#### agent 並列時の race 防止策（重要）

JSON への直接追記を **禁止**する。agent は `architectures.{en|zh}.json` を **絶対に開かない/書かない**。代わりに **1 slug 1 locale 単位の小ファイル** `<slug>.en.meta.json` / `<slug>.zh.meta.json`（`title`/`description`/`tags` のみの schema-typed object）を出力する。

```jsonc
// 例: frontend/contents/architectures/static-site-s3-cloudfront.en.meta.json
{ "title": "...", "description": "...", "tags": ["...", "..."] }
```

Phase B 末に **エディタが直列で** 20 件の meta.json を読み、`architectures.{en,zh}.json` の対応エントリ（slug 一致）に `title`/`description`/`tags` をマージして集約する（agent 並列 → エディタ直列マージ）。マージ後 meta.json は削除（または `.gitignore`）。

これにより 20 agent が共有 JSON を 1 度も同時編集せず、JSON ファイルを取り合わない構造を実現する（指針 0-2 #2）。

#### 20 並列の slug 一覧（10 slug × 2 locale）

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

各 agent の成果物 = MDX 1 本 + meta.json 1 件 + SVG 1 本（= 3 ファイル / 衝突なし）。

### Phase C: 内部リンク多言語化検証

1. **C-1**: A-17 の `termGuards.ts` 修正が効いていることを ja/en/zh の terms「関連構成図」セクションで確認
2. **C-2**: 詳細ページ内の全リンクが `createLocalizedPath` 経由（hard-coded `/terms/${...}` / `/architectures/...` が無いか grep）
3. **C-3**: パンくず / CTA リンクが同言語で動くか確認

### Phase D: テスト

1. **D-1**: `npm run typecheck` pass
2. **D-2**: `npm run build` pass
3. **D-3**: dev server で `/architectures/static-site-s3-cloudfront` / `/en/architectures/...` / `/zh/architectures/...` の 3 ルート + SVG 描画を目視（任意 1 slug）
4. **D-4**: parity invariant test を追加（§8-4）

---

## 8. テスト戦略

### 8-1. 必須

- `npm run typecheck`
- `npm run build`（`dynamicParams = false` のため全 slug がビルド成功する必要）

### 8-2. parity invariant test（追加 / comparisons-locale-parity.test.ts を踏襲）

配置: `frontend/src/contents/architectures/__tests__/architectures-locale-parity.test.ts`

検証する不変条件（invariant）:

1. **(1) slug 集合一致**: ja/en/zh JSON の slug 集合が完全一致（10 件）
2. **(2) architectureId 一致**: 同 slug で `architectureId` が ja/en/zh 一致
3. **(3) 共通メタ一致**: 同 slug で `services` / `category` / `level` / `examScopes` / `mermaid` / `published` / `publishedAt` / `updatedAt` が ja/en/zh 一致（**`tags` は locale 別翻訳のため SHARED_FIELDS から除外** / §1-2）
4. **(4) MDX 存在**: 全 slug について `contents/architectures/{ja,en,zh}/<slug>.mdx` が `fs.existsSync = true`
5. **(5) SVG 存在**: 全 slug について `public/images/architectures/<slug>.svg`（ja）/ `<slug>.en.svg` / `<slug>.zh.svg` が `fs.existsSync = true`（SVG 多言語化の翻訳忘れ・命名ミスを構造検出）
6. **(6) diagramPath 整合**: 3 言語 JSON の `diagramPath`（無印 ja 基準）が一致し、`resolveDiagramPath(locale, meta)` が `(5)` で存在確認したファイルパスと一致する
7. **(7) MDX 先頭 H1 整合**: comparisons (6) と同型 — 先頭 H1 が JSON title と一致 or `title.startsWith(h1Text)`（loader の `removeLeadingH1` が strip できる形であること）

> **(3) tags 除外の根拠**: comparisons では tags が英語スラグ共通だったため SHARED_FIELDS に含めたが、architectures の tags は日本語混在で locale 別翻訳対象（§1-2）。tags を SHARED_FIELDS に入れると 3 言語一致を強制し翻訳を妨げるため除外する。tags の件数一致（`tags.length` が 3 言語で同数）は別 it として軽く検証してもよい（任意）。

### 8-3. 追加推奨

- `architecture-content-loader` が frontmatter なし MDX を正しく読めることの unit test 1 件（comparisons と同型）
- `createArchitecturePath(locale, slug)` / `resolveDiagramPath(locale, meta)` のスナップショット test

### 8-4. 手動確認

- 一覧 3 言語 / 詳細 3 言語 × 任意 1 slug = 6 ページ目視 + SVG が locale 別に切り替わること
- en→ja / zh→ja の URL 直叩きで slug 同一なら同じ記事に飛ぶ（言語切替 UI 連動は別 issue）

---

## 9. 並列安全性の設計理由（Phase 4 並列翻訳が JSON を取り合わない根拠）

| 仕組み | 効果 |
|---|---|
| agent は共有 JSON（`architectures.{en,zh}.json`）を **一切開かない/書かない** | 20 agent が同一ファイルへ同時 write する race が構造的に発生しない |
| agent の JSON 成果物は **1 slug 1 locale 単位の `<slug>.{en,zh}.meta.json` 小ファイル**（schema-typed: `title`/`description`/`tags` のみ）| 各 agent の出力先ファイルが一意（ファイル名衝突なし）。schema を固定することでマージ側が機械的に集約できる |
| MDX も `{en,zh}/<slug>.mdx` で **1 agent 1 ファイル** | MDX 本文も衝突なし |
| SVG も `<slug>.{en,zh}.svg` で **1 agent 1 ファイル** | SVG 翻訳も衝突なし |
| 共有 JSON への集約は **Phase B 末にエディタが直列**で実行 | 20 個の meta.json → 2 個の言語別 JSON へのマージが単一プロセスで順次行われ、最後に parity test で取りこぼし検出 |

= **各 agent の書き込み先は MDX 1 + meta.json 1 + SVG 1 の計 3 ファイルで全て一意**。共有 JSON は読みも書きもしない。これが「Phase 4 並列翻訳が JSON ファイルを取り合わない」設計の核心。

---

## 10. 守るべき固定事項（再掲）

- 既存日本語 URL `/architectures/[slug]` / `/architectures` を維持
- 既存日本語 SVG（`<slug>.svg`）をリネーム・改変しない
- 既存 `contents/architectures/<slug>.mdx` の **本文は改変しない**（git mv で `ja/` 配下に移動 / task「やらないこと」）
  - **例外（CR1-M1 で記録 / 2026-06-21）**: 本文 SSoT を MDX 化したことで loader `removeLeadingH1` の strip 条件 (`h1 === title` または `title.startsWith(h1)`) を満たす必要があり、parity invariant (7) を満たすため **ja MDX 2 本の先頭 H1 のみを JSON title に揃えた**。本文側 H1 は loader が描画前に strip するため、ページ表示への影響はなし。改変対象は以下:
    - `contents/architectures/ja/cloudwatch-monitoring-basic.mdx`:
      - before: `# CloudWatchで見るサーバーレス運用監視構成`
      - after: `# CloudWatch サーバーレス運用監視構成`（JSON title と一致）
    - `contents/architectures/ja/private-subnet-vpc-endpoint.mdx`:
      - before: `# VPC EndpointでAWSサービスへプライベート接続する構成`
      - after: `# VPC Endpoint プライベート接続構成`（JSON title と一致）
  - 上記 2 本以外の ja MDX 本文（H1 以外を含む）は **無改変**
  - 今後 ja MDX の H1 整合のために改変が必要になった場合は、本セクションに **before/after を明示記録** すること（黙って改変しない）
- comparisons（P5-034）と命名・配置・ヘルパーを 1:1 で揃える
- 共有 JSON への並列書き込みを発生させない（per-slug meta.json でマージ）
- mermaid 描画の wiring 設計には踏み込まない（task「やらないこと」/ 本フェーズは SVG 画像描画のみ）
- スロップ表現禁止リスト（comparisons §6-5 を踏襲 / ja/en/zh 各言語）を reviewer がチェック

---

## 11. 残課題（open questions）

1. **既存 `architectures.ts` の `sections[]` 本文 vs 既存 MDX 本文**: ja 本文の正本を MDX 側に統一する（MDX の方が詳細）。`sections[]` は compat 型として残すのみで、JSON にも詳細 page にも載せない。Phase A-3 で「メタは JSON、本文は MDX」を確実に分離する
2. **繁体字フォント**: SVG の `font-family: Arial` で繁体字が tofu 化する場合の Noto Sans TC フォールバック追加可否（§6-4 / 実機確認で判断）
3. **言語切替 UI（hreflang / footer 言語スイッチャ）への architectures 追加**: terms / comparisons の対応有無に合わせる（別 issue の可能性 / 本フェーズ scope 外）
4. **terms.{en,zh}.json に未登録の AWS サービス**が architectures の services / 本文に混入していないか（agent 翻訳開始前に grep で網羅確認 / 用語 SSoT 参照）
5. **将来追加される構成図記事**を 3 言語同時公開とするか ja 先行 + 遅延翻訳を許すか（後者なら `published` を locale 別管理へ拡張）

---

## 12. PSP 計測フィールド（チケット完了時に追記）

```yaml
psp:
  actual-duration: TBD             # h
  bug-count: TBD
  code-volume:
    files-changed: TBD             # 想定 ~50 (基盤 ~15 + 20 mdx + 20 svg + meta json 3 + test 1 + 型 1)
    lines-added: TBD
    lines-deleted: TBD
task-category: design + impl + content   # 混合のため複数係数併用検討
estimate-vs-actual:
  estimated: TBD
  actual: TBD
  deviation-pct: TBD
```

## 13. 採番・関連

- 本設計書: P5-042（Phase 5-G 基盤）
- 先行: P5-034 比較記事多言語化 PR #277（commit 32b5c6f / dev merge 済み）
- 先行設計書: `frontend/docs/p5-034-comparisons-localization-design.md`
- 用語ルール: `frontend/docs/p5-032-aws-terminology-rules.md`
- 関連ファイル（基盤）:
  - `frontend/src/types/architecture.ts`（新規）
  - `frontend/src/contents/architectures/architectures.ts`（compat 層化）
  - `frontend/src/app/(site)/architectures/architecture-detail-data.ts`（新規）
  - `frontend/src/app/(site)/architectures/architecture-content-loader.ts`（新規）
  - `frontend/src/app/(site)/architectures/architectures-page-data.ts`（新規）
  - `frontend/src/components/architectures/ArchitectureDetailContent.tsx`（新規）
  - `frontend/src/components/architectures/ArchitecturesListClient.tsx`（新規）
  - `frontend/src/lib/termGuards.ts`（locale 別 set 拡張）
