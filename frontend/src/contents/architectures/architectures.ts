/**
 * architectures.ts (compat re-export)
 *
 * P5-042 で SSoT を `frontend/contents/architectures/architectures.ja.json` に移行した後の互換層。
 * 既存の `@/contents/architectures/architectures` import を維持するために、ja JSON を読み直して
 * 同じ `publishedArchitectures` 配列を export する。
 *
 * - 多言語化前のコンポーネント (termGuards / 一覧 / internalLinks 等) は ja 配列のみで動作する
 * - locale 別データが必要な場合は `src/app/(site)/architectures/architecture-detail-data.ts` の
 *   `getArchitectures(locale)` / `getPublishedArchitectures(locale)` を使う
 */
import architecturesJaData from "../../../contents/architectures/architectures.ja.json";
import type { ArchitectureMeta } from "../../types/architecture";

export const architectures: ArchitectureMeta[] =
  architecturesJaData as ArchitectureMeta[];

export const publishedArchitectures = architectures.filter(
  (architecture) => architecture.published,
);

// 既存 import 経路の互換維持 — 型・ラベルは src/types/architecture.ts に移設して re-export
export type {
  ArchitectureMeta,
  Architecture,
  ArchitectureArticle,
  ArchitectureLevel,
  ArchitectureCategory,
  ArchitectureSection,
  ArchitectureLocale,
  ExamScope,
} from "../../types/architecture";
export {
  architectureLevelLabels,
  architectureCategoryLabels,
  awsServiceLabels,
} from "../../types/architecture";
