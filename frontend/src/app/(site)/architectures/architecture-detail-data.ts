/**
 * Localized architecture metadata and helpers (single source of truth). Match comparison-detail-data.ts
 * naming and placement so all three locale pages use thin wrappers of the same shape. Read metadata from
 * frontend/contents/architectures/architectures.{ja,en,zh}.json and MDX bodies through
 * architecture-content-loader.ts.
 */
import architecturesEnData from "../../../../contents/architectures/architectures.en.json";
import architecturesJaData from "../../../../contents/architectures/architectures.ja.json";
import architecturesZhData from "../../../../contents/architectures/architectures.zh.json";
import type { PageMetadataInput } from "@/lib/seo";
import type {
  Architecture,
  ArchitectureArticle,
  ArchitectureCategory,
  ArchitectureLevel,
  ArchitectureLocale,
  ArchitectureMeta,
} from "@/types/architecture";
import {
  createLocalizedPath,
  type Pathname,
} from "@/i18n/locales";
import { loadArchitectureContent } from "./architecture-content-loader";

export { createLocalizedPath } from "@/i18n/locales";

export type ArchitectureStaticParams = {
  architectureSlug: string;
};

export type ArchitectureDetailLabels = {
  breadcrumbLabel: string;
  homeLabel: string;
  architecturesLabel: string;
  backToArchitecturesLabel: string;
  termsCtaLabel: string;
  questionsCtaLabel: string;
  diagramTitle: string;
  diagramAltSuffix: string;
  usedServicesTitle: string;
  usedServicesDescription: string;
  nextLearningTitle: string;
  nextLearningDescription: string;
  relatedArchitecturesTitle: string;
  publishedAtLabel: string;
  updatedAtLabel: string;
  unsetLabel: string;
  notFoundTitle: string;
  notFoundDescription: string;
  defaultDescription: string;
};

export const architectureDetailLabelsByLocale: Record<
  ArchitectureLocale,
  ArchitectureDetailLabels
> = {
  ja: {
    breadcrumbLabel: "パンくず",
    homeLabel: "ホーム",
    architecturesLabel: "構成図",
    backToArchitecturesLabel: "構成図一覧へ戻る",
    termsCtaLabel: "AWS用語集を見る",
    questionsCtaLabel: "模擬問題を解く",
    diagramTitle: "構成図",
    diagramAltSuffix: "の構成図",
    usedServicesTitle: "使用AWSサービス",
    usedServicesDescription:
      "サービス名をクリックすると、用語詳細ページで復習できます。",
    nextLearningTitle: "他のAWS構成図も確認する",
    nextLearningDescription:
      "SAA対策では、AWSサービスを単体ではなく構成パターンとして理解することが重要です。",
    relatedArchitecturesTitle: "関連構成図",
    publishedAtLabel: "公開日",
    updatedAtLabel: "更新日",
    unsetLabel: "未設定",
    notFoundTitle: "構成図が見つかりません",
    notFoundDescription: "指定されたAWS構成図は見つかりませんでした。",
    defaultDescription: "AWS構成パターンを解説する記事です。",
  },
  en: {
    breadcrumbLabel: "Breadcrumb",
    homeLabel: "Home",
    architecturesLabel: "Architectures",
    backToArchitecturesLabel: "Back to architectures",
    termsCtaLabel: "View AWS glossary",
    questionsCtaLabel: "Go to practice questions",
    diagramTitle: "Architecture diagram",
    diagramAltSuffix: " architecture diagram",
    usedServicesTitle: "AWS services used",
    usedServicesDescription:
      "Click a service name to review it on the term detail page.",
    nextLearningTitle: "Explore more AWS architectures",
    nextLearningDescription:
      "For the SAA exam, understanding AWS as architecture patterns matters more than memorizing individual services.",
    relatedArchitecturesTitle: "Related architectures",
    publishedAtLabel: "Published",
    updatedAtLabel: "Updated",
    unsetLabel: "Not set",
    notFoundTitle: "Architecture not found",
    notFoundDescription:
      "The specified AWS architecture article was not found.",
    defaultDescription: "An article explaining an AWS architecture pattern.",
  },
  zh: {
    breadcrumbLabel: "麵包屑",
    homeLabel: "首頁",
    architecturesLabel: "架構圖",
    backToArchitecturesLabel: "返回架構圖列表",
    termsCtaLabel: "查看 AWS 術語集",
    questionsCtaLabel: "前往模擬題",
    diagramTitle: "架構圖",
    diagramAltSuffix: " 架構圖",
    usedServicesTitle: "使用的 AWS 服務",
    usedServicesDescription:
      "點擊服務名稱可在術語詳細頁面複習。",
    nextLearningTitle: "查看其他 AWS 架構圖",
    nextLearningDescription:
      "SAA 認證考試重視「以架構模式理解 AWS」,而非單純記憶個別服務。",
    relatedArchitecturesTitle: "相關架構圖",
    publishedAtLabel: "發布日期",
    updatedAtLabel: "更新日期",
    unsetLabel: "未設定",
    notFoundTitle: "找不到架構圖",
    notFoundDescription: "找不到指定的 AWS 架構圖文章。",
    defaultDescription: "說明 AWS 架構模式的文章。",
  },
};

export const levelLabelsByLocale: Record<
  ArchitectureLocale,
  Record<ArchitectureLevel, string>
> = {
  ja: {
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
  },
  en: {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  },
  zh: {
    beginner: "初級",
    intermediate: "中級",
    advanced: "進階",
  },
};

/**
 * Localized architecture category labels. Keys cover the nine fixed English category values in
 * architectures.{ja,en,zh}.json. Generate anchors such as #static-hosting using
 * category.toLowerCase().replace(/\s+/g, "-"); shared English keys keep URLs stable across locales.
 */
export const architectureCategoryLabelsByLocale: Record<
  ArchitectureLocale,
  Record<ArchitectureCategory, string>
> = {
  ja: {
    "Static Hosting": "静的サイト",
    Serverless: "サーバーレス",
    "Three Tier": "3層構成",
    "High Availability": "高可用性",
    Batch: "バッチ",
    Networking: "ネットワーク",
    Integration: "アプリ連携",
    Container: "コンテナ",
    Monitoring: "運用監視",
  },
  en: {
    "Static Hosting": "Static Hosting",
    Serverless: "Serverless",
    "Three Tier": "Three Tier",
    "High Availability": "High Availability",
    Batch: "Batch",
    Networking: "Networking",
    Integration: "Integration",
    Container: "Container",
    Monitoring: "Monitoring",
  },
  zh: {
    "Static Hosting": "靜態網站託管",
    Serverless: "無伺服器",
    "Three Tier": "三層架構",
    "High Availability": "高可用性",
    Batch: "批次處理",
    Networking: "網路",
    Integration: "應用整合",
    Container: "容器",
    Monitoring: "維運監控",
  },
};

/**
 * Return the localized label for a known ArchitectureCategory; otherwise preserve the category value as
 * a defensive fallback for future categories.
 */
export function formatArchitectureCategoryLabel(
  locale: ArchitectureLocale,
  category: string,
): string {
  const labels = architectureCategoryLabelsByLocale[locale];
  if (category in labels) {
    return labels[category as ArchitectureCategory];
  }
  return category;
}

const architecturesDataByLocale: Record<ArchitectureLocale, Architecture[]> = {
  ja: architecturesJaData as Architecture[],
  en: architecturesEnData as Architecture[],
  zh: architecturesZhData as Architecture[],
};

export function getArchitectures(
  locale: ArchitectureLocale,
): Architecture[] {
  return architecturesDataByLocale[locale];
}

/**
 * Phase A scaffold mode: fall back to Japanese JSON when en/zh arrays are empty, keeping Next.js output:
 * export builds working. Automatically use the localized array once Phase B translations exist. This
 * temporary fallback satisfies design principle 0-2 #3 (preserve Japanese pages) and Step 10 (passing
 * builds). architectures-locale-parity.test.ts switches between scaffold/full modes based on whether
 * en/zh arrays are empty.
 *
 * TODO(CR1-L2): This became a dead path after Phase B. It only rescues empty en/zh arrays, but all three
 * locales now have 10 articles. Consider removing it next phase.
 */
function getArchitecturesWithFallback(
  locale: ArchitectureLocale,
): Architecture[] {
  const list = architecturesDataByLocale[locale];
  if (list.length === 0) {
    return architecturesDataByLocale.ja;
  }
  return list;
}

export function getPublishedArchitectures(
  locale: ArchitectureLocale,
): Architecture[] {
  return getArchitecturesWithFallback(locale).filter(
    (architecture) => architecture.published,
  );
}

export function getArchitectureMetaBySlug(
  locale: ArchitectureLocale,
  slug: string,
): Architecture | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const found = getPublishedArchitectures(locale).find(
    (architecture) => architecture.slug === slug,
  );

  return found ?? null;
}

/**
 * Get a localized architecture article (metadata and MDX body). Use an empty body if MDX is missing so
 * the build does not fail.
 */
export function getArchitectureBySlug(
  locale: ArchitectureLocale,
  slug: string,
): ArchitectureArticle | null {
  const meta = getArchitectureMetaBySlug(locale, slug);

  if (!meta) {
    return null;
  }

  const content = loadArchitectureContent(locale, slug, meta.title) ?? "";

  return {
    ...meta,
    content,
  };
}

export function getArchitectureStaticParams(
  locale: ArchitectureLocale,
): ArchitectureStaticParams[] {
  return getPublishedArchitectures(locale).map((architecture) => ({
    architectureSlug: architecture.slug,
  }));
}

export function createArchitecturePath(
  locale: ArchitectureLocale,
  slug: string,
): Pathname {
  return createLocalizedPath(locale, `/architectures/${slug}`);
}

export function createArchitectureDetailMetadataInput(
  locale: ArchitectureLocale,
  slug: string,
): PageMetadataInput {
  const labels = architectureDetailLabelsByLocale[locale];
  const meta = getArchitectureMetaBySlug(locale, slug);

  if (!meta) {
    return {
      title: labels.notFoundTitle,
      description: labels.notFoundDescription,
      path: createArchitecturePath(locale, slug),
      noIndex: true,
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    path: createArchitecturePath(locale, meta.slug),
    keywords: ["AWS", ...meta.services, ...meta.tags],
    type: "article",
    publishedTime: meta.publishedAt,
    modifiedTime: meta.updatedAt,
    locale,
  };
}

/**
 * Return a localized SVG path. Starting from meta.diagramPath (the unsuffixed Japanese path, e.g.
 * /images/architectures/foo.svg), insert .en or .zh before the extension. Return undefined when
 * diagramPath is absent, hiding the SVG section. This function is the single source of truth for design
 * section 6-3.
 */
const DIAGRAM_SUFFIX_BY_LOCALE: Record<ArchitectureLocale, string> = {
  ja: "",
  en: ".en",
  zh: ".zh",
};

export function resolveDiagramPath(
  locale: ArchitectureLocale,
  meta: ArchitectureMeta,
): string | undefined {
  if (!meta.diagramPath) return undefined;
  const suffix = DIAGRAM_SUFFIX_BY_LOCALE[locale];
  if (suffix === "") return meta.diagramPath;
  return meta.diagramPath.replace(/\.svg$/, `${suffix}.svg`);
}
