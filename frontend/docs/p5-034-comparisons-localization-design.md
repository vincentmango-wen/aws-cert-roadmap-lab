# P5-034 比較記事多言語化 — 設計書

- 起票日: 2026-06-21
- 対象 issue: P5-034〜P5-041（#210〜#217）+ P5-042〜P5-057（#261〜#276）
- 想定 PR: 1 本（基盤 + 22 ローカライズ + 内部リンク多言語化）
- 先行参考実装: P5-030〜P5-033（用語多言語化 / terms.{en,zh}.json）
- 既存資産: 11 本 × 日本語 MDX (`frontend/contents/comparisons/*.mdx`)

## 0. 設計上のゴールと制約

### 0-1. Issue 完了条件（必須）

1. `/en/comparisons/[slug]` と `/zh/comparisons/[slug]` が 11 slug すべてで表示される
2. 関連用語・関連問題リンクが **同一言語内で遷移する**（P5-041）
3. 日本語 URL（`/comparisons/[slug]`）は既存のまま維持
4. `npm run typecheck` と `npm run build` が pass
5. 11 本一覧ページ（`/en/comparisons` / `/zh/comparisons`）も併せて公開

### 0-2. 設計指針（優先度順）

1. **terms 多言語化と命名・配置を揃える**（学習コスト削減 / レビュー観点の流用）
2. **後段 22 並列 agent が独立に翻訳できる粒度に分割する**（comparisons.ts を取り合わない構造）
3. **既存日本語ページを壊さない**（rename ではなく拡張）
4. **本文（content）が大きいので per-locale 単独ファイルに切り出す**（JSON に push しない / 既存 MDX renderer を流用）

## 1. ファイル/ディレクトリ構造

### 1-1. 結論: ハイブリッド設計（メタ JSON + 本文 MDX）

terms は `terms.{ja,en,zh}.json` 1 ファイルに本文も含めて全用語を入れている。比較記事は **本文が長く既存の MDX renderer 資産を流用したい**ため、以下のハイブリッドを採用する。

| 種別 | 配置 | 採用理由 |
|---|---|---|
| メタデータ（title/description/category/services/tags/level/priority/examScopes/publishedAt 等） | `frontend/contents/comparisons/comparisons.{ja,en,zh}.json` | terms と並列、SSoT 化、22 並列 agent が触る範囲が小さい |
| 本文 MDX | `frontend/contents/comparisons/{ja,en,zh}/<slug>.mdx` | 既存 MDX 構造を維持 / page.tsx の MarkdownContent renderer をそのまま再利用 / 行単位で agent が編集しても衝突しにくい |

#### ディレクトリ構造（最終形）

```
frontend/contents/comparisons/
├── comparisons.ja.json                # メタデータ ja（11 件）
├── comparisons.en.json                # メタデータ en（11 件）
├── comparisons.zh.json                # メタデータ zh（11 件 / 繁体字）
├── ja/                                # 既存 MDX を移動（履歴は git mv で保全）
│   ├── s3-vs-ebs-vs-efs.mdx
│   ├── rds-vs-dynamodb.mdx
│   └── ...（11 件）
├── en/                                # 22 並列で agent が新規作成
│   ├── s3-vs-ebs-vs-efs.mdx
│   └── ...（11 件）
└── zh/                                # 22 並列で agent が新規作成
    ├── s3-vs-ebs-vs-efs.mdx
    └── ...（11 件）
```

#### 旧パス（`frontend/contents/comparisons/*.mdx`）の扱い

`git mv frontend/contents/comparisons/<slug>.mdx frontend/contents/comparisons/ja/<slug>.mdx` でリネーム保全。`page.tsx` の `getComparisonsDirectory()` ディレクトリ探索ロジックを **`{ja,en,zh}` サブディレクトリ前提**に置き換える（後述）。

### 1-2. メタデータ JSON のスキーマ

`comparisons.{ja,en,zh}.json` は以下の配列。**slug / comparisonId / category / examScopes / services / tags / priority / level / published / publishedAt / updatedAt は全 locale 共通**にし、`title / description` のみ翻訳する。

```jsonc
[
  {
    "comparisonId": "cmp-001",
    "slug": "s3-vs-ebs-vs-efs",
    "title": "Differences between S3, EBS, and EFS",       // ← locale 別
    "description": "Compare AWS storage services...",      // ← locale 別
    "category": "Storage",                                 // 共通
    "level": "beginner",                                   // 共通
    "examScopes": ["CLF-C02", "SAA-C03"],                  // 共通
    "services": ["s3", "ebs", "efs"],                      // 共通
    "tags": ["storage", "comparison", "clf", "saa"],       // 共通
    "priority": "high",                                    // 共通
    "published": true,                                     // 共通（後述）
    "publishedAt": "2026-06-01",                           // 共通
    "updatedAt": "2026-06-21",                             // 共通
    "locale": "en"                                         // ← terms 同様、判別用
  },
  ...
]
```

#### `published` の取り扱い

11 本すべてを 1 PR で en/zh 公開する前提のため、本フェーズでは `published: true` を 3 言語で揃える。将来翻訳が間に合わない記事が出たら **locale 別の published フィルタ**（terms は全件 published のため未使用 / 本ファイルは将来拡張対応）。

#### 旧 `src/contents/comparisons/comparisons.ts` の扱い

互換性を残すため `comparisons.ja.json` を読み込み直して **同じ `publishedComparisons` 配列を export する薄い再 export ファイルに変える**。`termGuards.ts` / `comparisons/page.tsx` 一覧 / `internalLinks.ts` が `@/contents/comparisons/comparisons` を import しているため、ここを壊さないのが最優先。

```ts
// frontend/src/contents/comparisons/comparisons.ts (新)
import comparisonsJaData from "../../../contents/comparisons/comparisons.ja.json";
import type { Comparison } from "../../types/comparison";

export const comparisons: Comparison[] = comparisonsJaData as Comparison[];
export const publishedComparisons = comparisons.filter((c) => c.published);
```

## 2. 型 / Comparison interface の拡張

### 2-1. 既存型は維持し、`locale` のみ optional 追加

```ts
// frontend/src/types/comparison.ts
export type ComparisonLevel = "beginner" | "intermediate" | "advanced";
export type ComparisonPriority = "high" | "medium" | "low";
export type ComparisonExamScope = "CLF-C02" | "SAA-C03";
export type ComparisonLocale = "ja" | "en" | "zh";        // 新規

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
  locale?: ComparisonLocale;                              // 新規（optional）
};

// 本文付き型（page.tsx 内 ComparisonArticle と統合）
export type ComparisonArticle = Comparison & {
  content: string;
};
```

`locale` を optional にしておくことで、既存 `comparisons.ts` の 11 件配列（locale なし）と JSON データ（locale あり）の両方を同じ型で扱える。

## 3. ルート設計

### 3-1. 3 言語 × 2 階層 = 6 ルート

| URL | ファイル | generateStaticParams | 内容 |
|---|---|---|---|
| `/comparisons` | `app/(site)/comparisons/page.tsx`（既存修正）| - | ja 一覧 |
| `/comparisons/[comparisonSlug]` | `app/(site)/comparisons/[comparisonSlug]/page.tsx`（既存修正） | ja の slug 11 件 | ja 詳細 |
| `/en/comparisons` | `app/(site)/en/comparisons/page.tsx`（新規） | - | en 一覧 |
| `/en/comparisons/[comparisonSlug]` | `app/(site)/en/comparisons/[comparisonSlug]/page.tsx`（新規） | en の slug 11 件 | en 詳細 |
| `/zh/comparisons` | `app/(site)/zh/comparisons/page.tsx`（新規） | - | zh 一覧 |
| `/zh/comparisons/[comparisonSlug]` | `app/(site)/zh/comparisons/[comparisonSlug]/page.tsx`（新規） | zh の slug 11 件 | zh 詳細 |

### 3-2. 詳細ページ — locale 引数で分岐する共通実装パターン

terms の `term-detail-data.ts` パターンを踏襲し、**3 言語の詳細ページは全て薄いラッパー**にし、ロジックは `comparison-detail-data.ts` に集約する。

```ts
// frontend/src/app/(site)/comparisons/comparison-detail-data.ts（新規）
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

### 3-3. 一覧ページ — `comparisons-page-data.ts` に集約

```ts
// frontend/src/app/(site)/comparisons/comparisons-page-data.ts（新規）
export const comparisonsPageMetadataByLocale: Record<ComparisonLocale, PageMetadataInput>;
export function getComparisonsPageData(locale: ComparisonLocale): {
  labels: ComparisonsListLabels;
  comparisons: ComparisonArticle[];
  recommendedComparisons: ComparisonArticle[];
  categories: string[];
};

// 一覧 UI は既存 page.tsx から `ComparisonsListClient.tsx` を抽出 + locale 対応
```

### 3-4. MarkdownContent renderer の扱い

`comparisons/[comparisonSlug]/page.tsx` 内の `MarkdownContent` / `renderInline` / `renderTable` を **`frontend/src/components/comparisons/MarkdownContent.tsx`** に切り出して 3 ルートから共通利用。**ロジック変更なし、純粋な移動のみ**で diff 最小化。

## 4. ロケール解決ヘルパー

### 4-1. terms と完全に揃える

terms の `term-detail-data.ts` の以下関数を 1:1 で `comparison-detail-data.ts` に複製:

| terms 関数 | comparisons 対応 |
|---|---|
| `getTerms(locale)` | `getComparisons(locale)` |
| `getTermById(locale, id)` | `getComparisonBySlug(locale, slug)` |
| `getTermStaticParams(locale)` | `getComparisonStaticParams(locale)` |
| `createTermDetailPath(locale, id)` | `createComparisonPath(locale, slug)` |
| `createTermDetailMetadataInput(locale, id)` | `createComparisonDetailMetadataInput(locale, slug)` |
| `termDetailLabelsByLocale` | `comparisonDetailLabelsByLocale` |
| `levelLabelsByLocale` | `levelLabelsByLocale`（comparisons 用に再定義 / terms と同じ key 集合だが namespace 分離） |

`createLocalizedPath(locale, path)` は既存 `i18n/locales.ts` の同名関数があるためそれを再利用。

### 4-2. MDX 本文の読み込み

`page.tsx` 内の `getComparisonsDirectory()` を以下に置き換える:

```ts
// frontend/src/app/(site)/comparisons/comparison-content-loader.ts（新規 / Node-only）
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
  // 既存と同じ探索パターン
}

export function loadComparisonContent(locale: ComparisonLocale, slug: string): string {
  // mdx ファイルを読み、frontmatter を剥がし content 部分のみ返す
  // 既存 page.tsx の parseComparisonFile を流用、ただし frontmatter は使わず content のみ
}
```

メタデータは JSON、本文は MDX という分離のため、本 loader は **content のみ抽出**する。

### 4-3. ラベル翻訳

`getLevelLabel` / `getPriorityLabel` を `comparison-detail-data.ts` の `levelLabelsByLocale` / `priorityLabelsByLocale` で置き換え。`formatServiceName` は **言語非依存**のため共通関数のまま再利用。

### 4-4. categoryLabels（カテゴリの多言語化）

一覧の `Storage / Database / Networking / ...` カテゴリ表示は terms の `categoryLabelsByLocale` をそのまま import 流用。アンカーリンク（`#storage`）の id は **小文字英語固定**を維持し、表示ラベルのみ言語切替（UX 一貫性 + URL 安定性）。

## 5. 関連用語 / 関連問題 リンクの同言語遷移戦略（P5-041）

### 5-1. 同言語遷移の必須化

詳細ページ内のリンクは **必ず `createLocalizedPath(locale, ...)` 経由**で構築。直接 `/terms/${id}` のような hard-coded path は禁止。

| リンク種別 | 対応 |
|---|---|
| 用語チップ（`comparison.services` の各 service） | `createTermDetailPath(locale, service)` = `/{locale}/terms/${service}`（terms ヘルパー流用） |
| 関連比較カード（同 category / services 重複） | `createComparisonPath(locale, item.slug)` = `/{locale}/comparisons/${item.slug}` |
| 「比較一覧へ戻る」CTA | `createLocalizedPath(locale, "/comparisons")` |
| 「AWS用語集を見る」CTA | `createLocalizedPath(locale, "/terms")` |
| 「模擬問題を解く」CTA | `createLocalizedPath(locale, "/questions")` |
| パンくず「ホーム」 | `createLocalizedPath(locale, "/")` |

### 5-2. リンク先が未公開のフォールバック方針

#### 5-2-a. terms へのリンク（service タグ）

`isExistingTerm(service)` で判定済み。terms は 3 言語全件 published のため、**3 言語とも同じ判定結果**になる（terms に存在すれば 3 言語で必ず詳細ページが存在する）。よって既存ガードのまま流用可。

#### 5-2-b. 関連比較カード

`isExistingComparisonForLocale(locale, slug)` を本フェーズで **`{ja, en, zh}` すべてで `comparisonSlugSet` 共通**に揃える（11 件すべて 3 言語公開のため）。

```ts
// frontend/src/lib/termGuards.ts 修正
const comparisonSlugSetByLocale: Record<Locale, Set<string>> = {
  ja: comparisonSlugSet,
  en: comparisonSlugSet,   // ← 変更（旧: 空セット）
  zh: comparisonSlugSet,   // ← 変更（旧: 空セット）
};
```

将来翻訳が間に合わない比較記事が出た場合は、`comparisons.en.json` / `comparisons.zh.json` の対応エントリを `published: false` にし、`publishedComparisons` を locale 別フィルタに拡張する余地を残す。

#### 5-2-c. questions（模擬問題）への遷移

CTA「模擬問題を解く」は `/questions` への固定リンク。questions ページが locale 別に存在するかは別 issue（P5-040 系）で扱い、本フェーズでは `createLocalizedPath(locale, "/questions")` で同言語 URL を生成するに留める（リンク先が ja のみでも 404 にならない設計）。terms 同等の挙動を踏襲。

#### 5-2-d. architectures との相互リンク

本フェーズの comparisons → architectures リンクは現在無いため対象外。terms の `comparisonArticles` / `architectureArticles` セクション側からの遷移は **terms 側の修正範囲**で `isExistingComparisonForLocale` を新ロジック（5-2-b）に切替えれば自動的に en/zh 詳細に飛ぶようになる（追加実装不要）。

## 6. 翻訳ガイドライン

後段 22 並列の翻訳 agent が守る規律。各 agent は **1 slug × 1 locale = 1 ファイル**を担当し、メタ JSON への追記は **エディタが直列で集約**する（agent 並列の race 防止）。

### 6-1. 用語の SSoT として `terms.{en,zh}.json` を参照

- AWS サービス公式名 / shortName / 略称は **すべて `terms.{en,zh}.json` の `name` / `shortName` を正本として参照する**
- 例: en の Application Load Balancer → "Application Load Balancer" (terms.en.json `name`) / shortName "ALB" / 本文中 1 回目はフル名、2 回目以降は ALB
- zh の Network ACL → "網路 ACL" / shortName "NACL"
- terms.{en,zh}.json に存在しないサービスが本文に出てきた場合は **AWS 公式ドキュメントの言語別表記**を確認し、決定後にエディタへ報告（独断で訳語を作らない）

### 6-2. `p5-032-aws-terminology-rules.md` 順守

- 既存の用語ルール（命名、カナ表記、固有名詞の半角/全角）を **3 言語とも**踏襲
- 「AWS」「Amazon」プレフィックスの省略可否は terms.{en,zh}.json の使用パターンに合わせる

### 6-3. 翻訳長さの目安

| セクション | 字数許容差 |
|---|---|
| title（一覧カード見出し） | 原文 ja の ±50% 以内（en は冗長気味、zh は ja とほぼ同等） |
| description（カード本文） | 原文 ja の ±50% 以内 |
| 本文 H2 / H3 見出し | 自然な訳語優先（字数制約なし） |
| 比較表セル | 原文 ja のセル幅感を保つため簡潔表現を優先 |
| 本文段落 | 自然な訳優先。冗長化したら段落分割可。意味の改変は禁止 |

### 6-4. トーン

- **en**: 中立・実務的・技術解説調。"you" / "we" は使わず、命令形と受動態の混在 OK。米国英語綴り（color / center / organization）。技術英語として AWS Docs に近いトーン
- **zh**: **繁体字（台湾向け / zh-Hant / zh_TW）固定**。簡体字混入は禁止。「啟用」「設定」「連線」など台湾標準用語を使う（大陸用語「启用」「连接」は禁止）。語気は丁寧な書面体、「您」より「使用者」「開發者」など客体名詞優先

### 6-5. スロップ表現禁止リスト（全言語共通）

以下は **AI 翻訳が頻発する没個性表現**として禁止。検出されたら reviewer が差し戻す。

#### 日本語スロップ（既存 ja MDX 維持時の改稿で混入させない）

- 「いかがでしたか」「ぜひ参考にしてみてください」「皆さんも試してみてください」
- 「劇的に」「圧倒的に」「革命的な」「真の」「本物の」（根拠なき強調語）
- 「〇〇することができます」（→「〇〇できます」）
- 「〇〇と言われています」（出典不明の伝聞調）
- 「これからは誰もが AWS を使いこなす時代」（テンプレ未来予測）

#### 英語スロップ

- "In conclusion, ..." / "It's important to note that ..." / "In today's fast-paced cloud landscape ..."
- "Whether you're a beginner or an expert, ..." (hedged symmetry)
- "Stay tuned for more!" / "Hope you enjoyed this article!"
- "leverage" の濫用（→ use / take advantage of）
- "seamless" / "robust" / "powerful" / "cutting-edge"（根拠なき形容詞）
- "in the realm of" / "in the world of"（冗長導入）

#### 繁体字スロップ

- 「綜上所述」「總而言之」「希望本文對您有所幫助」「歡迎留言交流」
- 「在當今快速發展的雲端時代」「無論您是初學者還是專家」
- 「強大的」「無縫的」「革命性的」（無根拠形容詞）
- 「廣大的使用者」「全方位的解決方案」（テンプレ語彙）

### 6-6. 翻訳しない要素

- AWS サービスの **正式名称（"Amazon S3" / "AWS Lambda" 等）**: 翻訳せず原文維持
- **コードブロック内容**: 翻訳しない（コメント `# ...` も含めて原文維持。日本語コメントが英語/中国語に紛れ込むのを避けるため、原文 ja の本文中コメントは原文翻訳）
- **試験コード `CLF-C02` / `SAA-C03`**: 翻訳しない
- **MDX frontmatter のキー名**（`comparisonId` 等）: 触らない（メタ JSON で管理するため frontmatter 自体を削除）

### 6-7. MDX 構造の保全

- 既存 MDX の **見出し階層（H1 〜 H4）と段落数を維持**。順序入れ替えや見出し削除は禁止
- **比較表のカラム数・行数・行順**は維持（数値・項目を 1:1 で訳す）
- リンク `[text](url)` の url は **触らない**（後段の P5-041 リンク多言語化で processor が変換）
- インラインコード ` `xxx` ` の中身は原文維持
- 強調 `**xxx**` は同意味で訳す

### 6-8. frontmatter は MDX から削除

新規 `{en,zh}/<slug>.mdx` には frontmatter を **含めない**（メタ JSON 側が SSoT のため）。`ja/<slug>.mdx` も将来的には削除予定だが、本 PR では維持（互換性のため）。

ローダーは frontmatter があれば剥がし、無ければそのまま content として読む。

## 7. 実装順序

### Phase A: 基盤（Foundation / シリアル / 単一 agent / P5-034）

エディタが **着工前に完遂すべき準備**。22 並列 agent が触る前提を作る。

1. **A-1**: `frontend/src/types/comparison.ts` に `ComparisonLocale` 追加 + `Comparison.locale?` 追加 + `ComparisonArticle` 型定義
2. **A-2**: `git mv frontend/contents/comparisons/*.mdx frontend/contents/comparisons/ja/` で既存 11 本を ja 配下に移動（履歴保全）
3. **A-3**: 各 ja MDX から frontmatter を機械抽出し `frontend/contents/comparisons/comparisons.ja.json` を生成（手動 or 簡易 script）。既存 `comparisons.ts` と完全一致する 11 件配列であることを確認
4. **A-4**: `frontend/contents/comparisons/comparisons.en.json` を **タイトル/description だけ未翻訳プレースホルダ**（例: `"title": "[EN] Differences between S3, EBS, and EFS"`）で 11 件作成。それ以外のフィールドは ja JSON からコピー
5. **A-5**: `comparisons.zh.json` も同様にプレースホルダ作成（`"[ZH] ..."`）
6. **A-6**: `frontend/contents/comparisons/{en,zh}/.gitkeep` を置くだけ（空ディレクトリ）。各 mdx は Phase B で agent が作成
7. **A-7**: `frontend/src/contents/comparisons/comparisons.ts` を JSON 再 export 版に書き換え（`publishedComparisons` API 維持）
8. **A-8**: `frontend/src/app/(site)/comparisons/comparison-detail-data.ts`（新規）作成 — locale 解決ヘルパー一式
9. **A-9**: `frontend/src/app/(site)/comparisons/comparison-content-loader.ts`（新規）作成 — MDX 本文ローダー
10. **A-10**: `frontend/src/app/(site)/comparisons/comparisons-page-data.ts`（新規）作成 — 一覧ページデータ
11. **A-11**: `frontend/src/components/comparisons/MarkdownContent.tsx`（新規）作成 — `page.tsx` から MarkdownContent / renderInline / renderTable を抽出
12. **A-12**: `frontend/src/components/comparisons/ComparisonDetailContent.tsx`（新規）作成 — 詳細ページ本体を locale 引数化（terms の `TermDetailContent.tsx` と同パターン）
13. **A-13**: `frontend/src/components/comparisons/ComparisonsListClient.tsx`（新規）作成 — 一覧 UI を locale 引数化
14. **A-14**: 既存 `frontend/src/app/(site)/comparisons/page.tsx` を `ComparisonsListClient` 呼び出しの薄い ja ラッパーに置換
15. **A-15**: 既存 `frontend/src/app/(site)/comparisons/[comparisonSlug]/page.tsx` を `ComparisonDetailContent` 呼び出しの薄い ja ラッパーに置換
16. **A-16**: `frontend/src/app/(site)/en/comparisons/page.tsx`（新規）+ `frontend/src/app/(site)/en/comparisons/[comparisonSlug]/page.tsx`（新規）作成
17. **A-17**: `frontend/src/app/(site)/zh/comparisons/page.tsx`（新規）+ `frontend/src/app/(site)/zh/comparisons/[comparisonSlug]/page.tsx`（新規）作成
18. **A-18**: `frontend/src/lib/termGuards.ts` の `comparisonSlugSetByLocale` を 3 言語とも `comparisonSlugSet` に揃える（P5-041 連動）
19. **A-19**: Phase A 末で `npm run typecheck && npm run build` 全 pass を確認。**プレースホルダ翻訳のまま** 6 ルート全てがビルド・表示できる状態に到達

Phase A 完了時点で、**ローカライズ前のフレームが完成**。プレースホルダ「[EN] / [ZH]」が画面に出ても OK。

### Phase B: 22 並列ローカライズ（Localize × 22 / 各 agent 独立）

各 agent への割り当て単位 = **1 slug × 1 locale = 1 ファイル**。担当範囲は以下 2 種:

1. `frontend/contents/comparisons/{en|zh}/<slug>.mdx` の新規作成（本文 MDX 翻訳）
2. `frontend/contents/comparisons/comparisons.{en|zh}.json` の **対応エントリ 1 件**を `title` / `description` だけ更新

#### agent 並列時の race 防止策

JSON 更新は **agent が JSON 全体を上書きせず、対応エントリの 1 オブジェクトだけを返す patch 形式**にする。エディタが Phase B 末に 22 件分の patch を順次適用する（agent 並列 → エディタ直列マージ）。

代替案: agent には `frontend/contents/comparisons/{en|zh}/<slug>.meta.json`（1 件単位の小ファイル）を作らせ、Phase B 末にエディタが 22 件をマージして `comparisons.{en|zh}.json` を生成する。**こちらを採用推奨**（race 完全排除）。

#### 22 並列の slug 一覧

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

※ 上記の Issue 番号は割り当て例（実際の番号は #261〜#276 + ねじれ吸収で個別決定）。

### Phase C: 内部リンク多言語化検証（Links / P5-041）

1. **C-1**: Phase A-18 で行った `termGuards.ts` 修正が効いていることを ja/en/zh 全比較記事の関連用語チップで確認（実機 or unit test）
2. **C-2**: 詳細ページ内の全リンクが `createLocalizedPath` 経由になっていることを grep / eslint 風静的検査で確認（hard-coded `/terms/${...}` が無いか）
3. **C-3**: 関連比較カードの 3 件サジェストが同言語で出ることを確認
4. **C-4**: パンくずリンクが同言語で動くか確認

### Phase D: テスト

1. **D-1**: `npm run typecheck` pass
2. **D-2**: `npm run build` pass
3. **D-3**: dev server 起動 → `/comparisons/s3-vs-ebs-vs-efs` / `/en/comparisons/s3-vs-ebs-vs-efs` / `/zh/comparisons/s3-vs-ebs-vs-efs` の 3 ルートを目視確認（任意 1 slug でサンプル）
4. **D-4**: invariant test を 1 件追加 — `comparisons.{ja,en,zh}.json` の slug 集合が 3 言語完全一致することを検証（後段で 1 言語だけ翻訳追加忘れを防ぐ）

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
    // 各 slug の comparisonId が 3 言語で一致
  });

  it("ja/en/zh have the same services list per slug", () => {
    // 関連用語遷移が壊れないことを担保
  });

  it("every en/zh mdx file exists for each slug", () => {
    // contents/comparisons/{en,zh}/${slug}.mdx の存在を fs で確認
  });
});
```

## 8. テスト戦略

### 8-1. 必須

- `npm run typecheck`
- `npm run build`（dynamicParams = false のため全 slug がビルド成功する必要あり）

### 8-2. 追加推奨（invariant 系）

- §D-4 の `comparisons-locale-parity.test.ts`
- MDX ローダーが frontmatter なし MDX を正しく読めることの unit test 1 件
- `createComparisonPath(locale, slug)` のスナップショット test

### 8-3. 手動確認

- 一覧 3 言語 / 詳細 3 言語 × 任意 1 slug = 6 ページ目視
- en→ja / zh→ja 切り替え時に slug が同一なら同じ記事に飛ぶ（言語切替 UI 連動は別 issue / 本フェーズでは URL 直叩きで確認）

## 9. 守るべき固定事項（再掲）

- 既存日本語 URL `/comparisons/[slug]` を維持
- terms 多言語化と命名・配置を揃える
- comparisons.ts への並列書き込みを発生させない（per-slug 単位ファイルでマージ）
- スロップ表現禁止リスト（§6-5）を全 reviewer がチェックする

## 10. 採番・関連チケット

- 本設計書: P5-034（基盤）
- 22 並列: P5-042〜P5-063 を本書 §7 Phase B の表で運用（実際の Issue 番号は #261〜#276 + 残 6 件は別途）
- 内部リンク検証: P5-041（本書 §5 / 実装は Phase A-18 + Phase C で完了）

## 11. PSP 計測フィールド（チケット完了時に追記）

```yaml
psp:
  actual-duration: TBD             # h
  bug-count: TBD
  code-volume:
    files-changed: TBD             # 想定 ~40 ファイル（基盤 ~15 + 22 mdx + meta json 3 + テスト 1）
    lines-added: TBD
    lines-deleted: TBD
task-category: design + impl + content   # 混合のため複数係数併用検討
```

## 12. 残課題（open questions）

1. **言語切替 UI（hreflang / footer 言語スイッチャ）**は別 issue かを確認（terms 多言語化時の対応有無で踏襲）
2. **OG image の言語別生成**は本フェーズで対応するかを確認（`createPageMetadata` が locale 対応済みかは未確認 / 必要なら Phase A-12 で追加）
3. 11 本に出てくる **AWS サービス名で `terms.{en,zh}.json` に未登録のもの**が混入していないか（agent 翻訳開始前に grep で網羅確認）
4. **将来追加される比較記事**を 3 言語同時公開する運用ルールにするか、ja 先行 + en/zh 遅延翻訳を許す運用にするか（後者の場合は §1-2 の `published` を locale 別管理に切替が必要）
