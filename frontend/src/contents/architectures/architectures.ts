/**
 * Compatibility re-export after P5-042 moved the source of truth to
 * frontend/contents/architectures/architectures.ja.json. Reload Japanese JSON and export the same
 * publishedArchitectures array to preserve @/contents/architectures/architectures imports. Older
 * components (termGuards, lists, internalLinks) use only the Japanese array. For localized data, use
 * getArchitectures(locale) / getPublishedArchitectures(locale) from
 * src/app/(site)/architectures/architecture-detail-data.ts.
 */
import architecturesJaData from "../../../contents/architectures/architectures.ja.json";
import type { ArchitectureMeta } from "../../types/architecture";

export const architectures: ArchitectureMeta[] =
  architecturesJaData as ArchitectureMeta[];

export const publishedArchitectures = architectures.filter(
  (architecture) => architecture.published,
);

// Preserve existing import paths: re-export types and labels moved to src/types/architecture.ts.
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
