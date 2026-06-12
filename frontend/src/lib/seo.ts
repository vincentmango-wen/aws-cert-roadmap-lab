import type { Metadata } from "next";

export const siteConfig = {
  name: "AWS資格ロードマップラボ",
  shortName: "AWS Cert Roadmap Lab",
  description:
    "AWS Cloud Practitioner / SAAの学習内容を、用語集・比較・模擬問題・構成図で体系的に整理する学習サイトです。",
  defaultPath: "/",
  defaultOgImage: "/images/ogp/default-ogp.png",
};

export const supportedLocales = ["ja", "en", "zh"] as const;

export type SiteLocale = (typeof supportedLocales)[number];

export type HrefLang = "ja" | "en" | "zh-Hant" | "x-default";

export type AbsolutePath = "/" | `/${string}`;

export type LocalizedText =
  | string
  | {
      ja: string;
      en: string;
      zh: string;
    };

export type LocalizedStringArray =
  | string[]
  | {
      ja: string[];
      en: string[];
      zh: string[];
    };

export type LocaleConfig = {
  locale: SiteLocale;
  label: string;
  htmlLang: string;
  hrefLang: Exclude<HrefLang, "x-default">;
  pathPrefix: "" | "/en" | "/zh";
  openGraphLocale: "ja_JP" | "en_US" | "zh_TW";
};

export const defaultLocale: SiteLocale = "ja";

export const localeConfigs = {
  ja: {
    locale: "ja",
    label: "日本語",
    htmlLang: "ja",
    hrefLang: "ja",
    pathPrefix: "",
    openGraphLocale: "ja_JP",
  },
  en: {
    locale: "en",
    label: "English",
    htmlLang: "en",
    hrefLang: "en",
    pathPrefix: "/en",
    openGraphLocale: "en_US",
  },
  zh: {
    locale: "zh",
    label: "繁體中文",
    htmlLang: "zh-Hant",
    hrefLang: "zh-Hant",
    pathPrefix: "/zh",
    openGraphLocale: "zh_TW",
  },
} satisfies Record<SiteLocale, LocaleConfig>;

export type PageMetadataInput = {
  title: LocalizedText;
  description: LocalizedText;
  path: AbsolutePath;
  image?: LocalizedText;
  keywords?: LocalizedStringArray;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  locale?: SiteLocale;
  siteName?: LocalizedText;
  includeLanguageAlternates?: boolean;
  includeXDefault?: boolean;
};

export type LocalizedPageMetadataInput = Omit<PageMetadataInput, "locale"> & {
  locale: SiteLocale;
};

export type PageSeoConfig = {
  title: string;
  description: string;
  path: AbsolutePath;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export type PageMetadataOverrides = Partial<
  Omit<LocalizedPageMetadataInput, "locale">
>;

export function isSupportedLocale(value: string): value is SiteLocale {
  return supportedLocales.includes(value as SiteLocale);
}

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!url) {
    return "http://localhost:3000";
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function createAbsoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();

  if (!path) {
    return siteUrl;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function stripLocalePrefix(path: AbsolutePath): AbsolutePath {
  if (path === "/") {
    return "/";
  }

  for (const locale of supportedLocales) {
    const prefix = localeConfigs[locale].pathPrefix;

    if (!prefix) {
      continue;
    }

    if (path === prefix) {
      return "/";
    }

    if (path.startsWith(`${prefix}/`)) {
      const strippedPath = path.slice(prefix.length);

      return strippedPath === "" ? "/" : (strippedPath as AbsolutePath);
    }
  }

  return path;
}

export function getLocalizedPath(
  path: AbsolutePath,
  locale: SiteLocale,
): AbsolutePath {
  const basePath = stripLocalePrefix(path);
  const prefix = localeConfigs[locale].pathPrefix;

  if (!prefix) {
    return basePath;
  }

  if (basePath === "/") {
    return prefix as AbsolutePath;
  }

  return `${prefix}${basePath}` as AbsolutePath;
}

export function createLanguageAlternates(
  path: AbsolutePath,
  options?: {
    includeXDefault?: boolean;
  },
): Partial<Record<HrefLang, string>> {
  const basePath = stripLocalePrefix(path);

  const alternates: Partial<Record<HrefLang, string>> = {
    ja: createAbsoluteUrl(getLocalizedPath(basePath, "ja")),
    en: createAbsoluteUrl(getLocalizedPath(basePath, "en")),
    "zh-Hant": createAbsoluteUrl(getLocalizedPath(basePath, "zh")),
  };

  if (options?.includeXDefault) {
    alternates["x-default"] = createAbsoluteUrl(getLocalizedPath(basePath, "ja"));
  }

  return alternates;
}

export function getOpenGraphLocale(
  locale: SiteLocale,
): LocaleConfig["openGraphLocale"] {
  return localeConfigs[locale].openGraphLocale;
}

export function createOpenGraphAlternateLocales(locale: SiteLocale): string[] {
  return supportedLocales
    .filter((supportedLocale) => supportedLocale !== locale)
    .map((supportedLocale) => localeConfigs[supportedLocale].openGraphLocale);
}

export function resolveLocalizedText(
  value: LocalizedText,
  locale: SiteLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  return value[locale] ?? value[defaultLocale];
}

export function resolveLocalizedStringArray(
  value: LocalizedStringArray | undefined,
  locale: SiteLocale,
): string[] | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value[locale] ?? value[defaultLocale];
}

function createMetadataCore(
  input: LocalizedPageMetadataInput & {
    includeLanguageAlternates: boolean;
  },
): Metadata {
  const title = resolveLocalizedText(input.title, input.locale);
  const description = resolveLocalizedText(input.description, input.locale);
  const siteName = resolveLocalizedText(
    input.siteName ?? siteConfig.name,
    input.locale,
  );
  const canonicalPath = getLocalizedPath(input.path, input.locale);
  const canonicalUrl = createAbsoluteUrl(canonicalPath);
  const imagePath = resolveLocalizedText(
    input.image ?? siteConfig.defaultOgImage,
    input.locale,
  );
  const ogImageUrl = createAbsoluteUrl(imagePath);
  const keywords = resolveLocalizedStringArray(input.keywords, input.locale);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      ...(input.includeLanguageAlternates
        ? {
            languages: createLanguageAlternates(input.path, {
              includeXDefault: input.includeXDefault,
            }),
          }
        : {}),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteName}`,
        },
      ],
      locale: getOpenGraphLocale(input.locale),
      alternateLocale: createOpenGraphAlternateLocales(input.locale),
      type: input.type ?? "website",
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: input.noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function createPageMetadata(input: PageMetadataInput): Metadata {
  return createMetadataCore({
    ...input,
    locale: input.locale ?? defaultLocale,
    includeLanguageAlternates: input.includeLanguageAlternates ?? false,
  });
}

export function createLocalizedPageMetadata(
  input: LocalizedPageMetadataInput,
): Metadata {
  return createMetadataCore({
    ...input,
    includeLanguageAlternates: input.includeLanguageAlternates ?? true,
  });
}

export function createNotFoundMetadata(
  locale: SiteLocale = defaultLocale,
): Metadata {
  return createLocalizedPageMetadata({
    locale,
    title: {
      ja: "ページが見つかりません",
      en: "Page Not Found",
      zh: "找不到頁面",
    },
    description: {
      ja: "お探しのページは見つかりませんでした。AWS資格ロードマップラボのトップページ、用語集、模擬問題、構成図から学習を続けられます。",
      en: "The page you are looking for was not found. Continue learning from the AWS Cert Roadmap Lab home page, glossary, practice questions, or architecture guides.",
      zh: "找不到您要尋找的頁面。您可以回到 AWS Cert Roadmap Lab 首頁、術語集、模擬題或架構圖解繼續學習。",
    },
    path: "/404",
    noIndex: true,
    includeLanguageAlternates: false,
  });
}

export function formatSlugForTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === "aws") {
        return "AWS";
      }

      if (word.toLowerCase() === "s3") {
        return "S3";
      }

      if (word.toLowerCase() === "saa") {
        return "SAA";
      }

      if (word.toLowerCase() === "clf") {
        return "CLF";
      }

      if (word.toLowerCase() === "api") {
        return "API";
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const pageSeo = {
  home: {
    title: "AWS資格ロードマップラボ",
    description:
      "AWS Cloud Practitioner / SAAの学習を、用語集・比較・模擬問題・構成図で進められる初心者向け学習サイトです。",
    path: "/",
    keywords: [
      "AWS",
      "Cloud Practitioner",
      "SAA",
      "AWS資格",
      "AWS学習",
      "AWS構成図",
    ],
  },
  roadmap: {
    title: "AWS学習ロードマップ",
    description:
      "AWS Cloud PractitionerからSolutions Architect Associateまでの学習順序を、初学者向けに整理したロードマップです。",
    path: "/roadmap",
    keywords: ["AWS 学習ロードマップ", "Cloud Practitioner", "SAA"],
  },
  terms: {
    title: "AWS用語集",
    description:
      "IAM、S3、EC2、Lambda、VPC、RDS、DynamoDBなど、AWS主要サービスを初学者向けに整理した用語集です。",
    path: "/terms",
    keywords: ["AWS 用語集", "AWS サービス", "Cloud Practitioner"],
  },
  questions: {
    title: "AWS模擬問題",
    description:
      "AWS Cloud Practitioner向けの模擬問題を解きながら、正解理由と関連AWSサービスを確認できます。",
    path: "/questions",
    keywords: ["AWS 模擬問題", "CLF-C02", "Cloud Practitioner 問題"],
  },
  clfQuestions: {
    title: "CLF-C02模擬問題一覧",
    description:
      "AWS Cloud Practitioner CLF-C02の試験対策に使える4択形式の模擬問題一覧です。",
    path: "/questions/clf",
    keywords: ["CLF-C02", "AWS Cloud Practitioner", "模擬問題"],
  },
  comparisons: {
    title: "AWSサービス比較",
    description:
      "S3 / EBS / EFS、RDS / DynamoDB、SNS / SQS / EventBridgeなど、試験で混同しやすいAWSサービスの違いを比較します。",
    path: "/comparisons",
    keywords: ["AWS 比較", "AWS サービス 違い", "SAA"],
  },
  architectures: {
    title: "AWS構成図ギャラリー",
    description:
      "S3 + CloudFront、API Gateway + Lambda + DynamoDB、3層Webアプリなど、SAA対策に役立つAWS構成図を解説します。",
    path: "/architectures",
    keywords: ["AWS 構成図", "SAA", "サーバーレス", "CloudFront"],
  },
  blog: {
    title: "AWS学習ブログ",
    description:
      "AWS資格、サーバーレス、無料枠、ポートフォリオ開発に関する学習記事をまとめたブログです。",
    path: "/blog",
    keywords: ["AWS ブログ", "AWS資格", "サーバーレス", "ポートフォリオ"],
  },
  contact: {
    title: "お問い合わせ",
    description:
      "AWS資格ロードマップラボへのお問い合わせ、記事内容の誤り報告、ポートフォリオに関する連絡はこちらから送信できます。",
    path: "/contact",
    keywords: ["お問い合わせ", "AWS資格ロードマップラボ"],
  },
  about: {
    title: "運営者情報",
    description:
      "AWS資格ロードマップラボの運営者情報、制作背景、学習目的、ポートフォリオとしての位置づけを紹介します。",
    path: "/about",
    keywords: ["運営者情報", "AWS ポートフォリオ"],
  },
  privacy: {
    title: "プライバシーポリシー",
    description:
      "AWS資格ロードマップラボにおける個人情報、Cookie、アクセス解析、広告配信に関する方針を記載しています。",
    path: "/privacy",
    keywords: ["プライバシーポリシー", "個人情報保護"],
  },
  disclaimer: {
    title: "免責事項",
    description:
      "AWS資格ロードマップラボで提供するAWS資格学習情報、模擬問題、構成図、記事内容に関する免責事項です。",
    path: "/disclaimer",
    keywords: ["免責事項", "AWS資格"],
  },
} satisfies Record<string, PageSeoConfig>;

export type PageSeoKey = keyof typeof pageSeo;

export const localizedPageSeo = {
  home: {
    ja: pageSeo.home,
    en: {
      title: "AWS Cert Roadmap Lab",
      description:
        "A beginner-friendly AWS learning site for Cloud Practitioner and SAA preparation with glossaries, comparisons, practice questions, and architecture diagrams.",
      path: "/",
      keywords: [
        "AWS",
        "AWS Cloud Practitioner",
        "AWS SAA",
        "AWS glossary",
        "AWS architecture diagrams",
      ],
    },
    zh: {
      title: "AWS 證照學習路線圖實驗室",
      description:
        "面向初學者的 AWS 學習網站，透過術語集、服務比較、模擬題與架構圖，輔助準備 Cloud Practitioner 與 SAA。",
      path: "/",
      keywords: [
        "AWS",
        "AWS Cloud Practitioner",
        "AWS SAA",
        "AWS 術語集",
        "AWS 架構圖",
      ],
    },
  },
  roadmap: {
    ja: pageSeo.roadmap,
    en: {
      title: "AWS Learning Roadmap",
      description:
        "A beginner-friendly roadmap from AWS Cloud Practitioner to Solutions Architect Associate.",
      path: "/roadmap",
      keywords: [
        "AWS learning roadmap",
        "AWS Cloud Practitioner",
        "AWS SAA",
      ],
    },
    zh: {
      title: "AWS 學習路線圖",
      description:
        "從 AWS Cloud Practitioner 到 Solutions Architect Associate 的初學者學習路線圖。",
      path: "/roadmap",
      keywords: ["AWS 學習路線圖", "AWS Cloud Practitioner", "AWS SAA"],
    },
  },
  terms: {
    ja: pageSeo.terms,
    en: {
      title: "AWS Glossary",
      description:
        "A beginner-friendly glossary of core AWS services such as IAM, S3, EC2, Lambda, VPC, RDS, DynamoDB, and CloudFront.",
      path: "/terms",
      keywords: ["AWS glossary", "AWS services", "Cloud Practitioner"],
    },
    zh: {
      title: "AWS 術語集",
      description:
        "整理 IAM、S3、EC2、Lambda、VPC、RDS、DynamoDB、CloudFront 等 AWS 核心服務的初學者術語集。",
      path: "/terms",
      keywords: ["AWS 術語集", "AWS 服務", "Cloud Practitioner"],
    },
  },
  questions: {
    ja: pageSeo.questions,
    en: {
      title: "AWS Practice Questions",
      description:
        "Practice AWS Cloud Practitioner questions and review explanations with related AWS services.",
      path: "/questions",
      keywords: [
        "AWS practice questions",
        "CLF-C02",
        "AWS Cloud Practitioner questions",
      ],
    },
    zh: {
      title: "AWS 模擬題",
      description:
        "練習 AWS Cloud Practitioner 模擬題，並透過詳解與相關 AWS 服務加深理解。",
      path: "/questions",
      keywords: ["AWS 模擬題", "CLF-C02", "AWS Cloud Practitioner 題目"],
    },
  },
  clfQuestions: {
    ja: pageSeo.clfQuestions,
    en: {
      title: "CLF-C02 Practice Questions",
      description:
        "Multiple-choice practice questions for AWS Cloud Practitioner CLF-C02 preparation.",
      path: "/questions/clf",
      keywords: [
        "CLF-C02",
        "AWS Cloud Practitioner",
        "AWS practice exam",
      ],
    },
    zh: {
      title: "CLF-C02 模擬題列表",
      description:
        "適合 AWS Cloud Practitioner CLF-C02 備考使用的四選一模擬題列表。",
      path: "/questions/clf",
      keywords: ["CLF-C02", "AWS Cloud Practitioner", "AWS 模擬題"],
    },
  },
  comparisons: {
    ja: pageSeo.comparisons,
    en: {
      title: "AWS Service Comparisons",
      description:
        "Compare AWS services that are easy to confuse in exams, such as S3 / EBS / EFS, RDS / DynamoDB, and SNS / SQS / EventBridge.",
      path: "/comparisons",
      keywords: ["AWS comparisons", "AWS service differences", "AWS SAA"],
    },
    zh: {
      title: "AWS 服務比較",
      description:
        "比較考試中容易混淆的 AWS 服務，例如 S3 / EBS / EFS、RDS / DynamoDB、SNS / SQS / EventBridge。",
      path: "/comparisons",
      keywords: ["AWS 比較", "AWS 服務差異", "AWS SAA"],
    },
  },
  architectures: {
    ja: pageSeo.architectures,
    en: {
      title: "AWS Architecture Diagram Gallery",
      description:
        "Learn AWS architecture patterns for SAA preparation, including S3 + CloudFront, API Gateway + Lambda + DynamoDB, and three-tier web apps.",
      path: "/architectures",
      keywords: [
        "AWS architecture diagrams",
        "AWS SAA",
        "serverless",
        "CloudFront",
      ],
    },
    zh: {
      title: "AWS 架構圖集",
      description:
        "學習 SAA 備考常見 AWS 架構模式，包括 S3 + CloudFront、API Gateway + Lambda + DynamoDB 與三層 Web 應用程式。",
      path: "/architectures",
      keywords: ["AWS 架構圖", "AWS SAA", "Serverless", "CloudFront"],
    },
  },
  blog: {
    ja: pageSeo.blog,
    en: {
      title: "AWS Learning Blog",
      description:
        "Articles about AWS certification, serverless architecture, Free Tier usage, and portfolio development.",
      path: "/blog",
      keywords: [
        "AWS blog",
        "AWS certification",
        "serverless",
        "AWS portfolio",
      ],
    },
    zh: {
      title: "AWS 學習部落格",
      description:
        "整理 AWS 證照、Serverless、免費方案與作品集開發相關的學習文章。",
      path: "/blog",
      keywords: ["AWS 部落格", "AWS 證照", "Serverless", "AWS 作品集"],
    },
  },
  contact: {
    ja: pageSeo.contact,
    en: {
      title: "Contact",
      description:
        "Contact AWS Cert Roadmap Lab for questions, content corrections, feedback, or portfolio-related inquiries.",
      path: "/contact",
      keywords: ["contact", "AWS Cert Roadmap Lab"],
    },
    zh: {
      title: "聯絡我們",
      description:
        "如有問題、內容修正建議、回饋或作品集相關聯絡，請透過此頁聯絡 AWS Cert Roadmap Lab。",
      path: "/contact",
      keywords: ["聯絡我們", "AWS Cert Roadmap Lab"],
    },
  },
  about: {
    ja: pageSeo.about,
    en: {
      title: "About",
      description:
        "Learn about the background, purpose, and portfolio positioning of AWS Cert Roadmap Lab.",
      path: "/about",
      keywords: ["about", "AWS portfolio"],
    },
    zh: {
      title: "關於本站",
      description:
        "介紹 AWS Cert Roadmap Lab 的製作背景、學習目的與作品集定位。",
      path: "/about",
      keywords: ["關於本站", "AWS 作品集"],
    },
  },
  privacy: {
    ja: pageSeo.privacy,
    en: {
      title: "Privacy Policy",
      description:
        "Privacy policy for personal information, cookies, analytics, and advertising on AWS Cert Roadmap Lab.",
      path: "/privacy",
      keywords: ["privacy policy", "personal information"],
    },
    zh: {
      title: "隱私權政策",
      description:
        "記載 AWS Cert Roadmap Lab 關於個人資料、Cookie、流量分析與廣告投放的方針。",
      path: "/privacy",
      keywords: ["隱私權政策", "個人資料保護"],
    },
  },
  disclaimer: {
    ja: pageSeo.disclaimer,
    en: {
      title: "Disclaimer",
      description:
        "Disclaimer for AWS certification learning information, practice questions, architecture diagrams, and articles on AWS Cert Roadmap Lab.",
      path: "/disclaimer",
      keywords: ["disclaimer", "AWS certification"],
    },
    zh: {
      title: "免責聲明",
      description:
        "AWS Cert Roadmap Lab 關於 AWS 證照學習資訊、模擬題、架構圖與文章內容的免責聲明。",
      path: "/disclaimer",
      keywords: ["免責聲明", "AWS 證照"],
    },
  },
} satisfies Record<PageSeoKey, Record<SiteLocale, PageSeoConfig>>;

export function getPageSeoConfig(
  pageKey: PageSeoKey,
  locale: SiteLocale = defaultLocale,
): PageSeoConfig {
  return localizedPageSeo[pageKey]?.[locale] ?? pageSeo[pageKey];
}

export function createPageMetadataByKey(
  pageKey: PageSeoKey,
  locale: SiteLocale = defaultLocale,
  overrides: PageMetadataOverrides = {},
): Metadata {
  const seo = getPageSeoConfig(pageKey, locale);

  return createLocalizedPageMetadata({
    ...seo,
    ...overrides,
    locale,
    title: overrides.title ?? seo.title,
    description: overrides.description ?? seo.description,
    path: overrides.path ?? seo.path,
  });
}