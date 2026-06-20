import type { Metadata } from "next";
import { createHreflangAlternates } from "@/i18n/seo/hreflang";

export const supportedSeoLocales = ["ja", "en", "zh"] as const;

export type SeoLocale = (typeof supportedSeoLocales)[number];

const DEFAULT_SEO_LOCALE: SeoLocale = "ja";

const openGraphLocaleByLocale = {
  ja: "ja_JP",
  en: "en_US",
  zh: "zh_TW",
} satisfies Record<SeoLocale, string>;

export const siteConfig = {
  name: "AWS資格ロードマップラボ",
  shortName: "AWS Cert Roadmap Lab",
  description:
    "AWS Cloud Practitioner / SAAの学習内容を、用語集・比較・模擬問題・構成図で体系的に整理する学習サイトです。",
  defaultPath: "/",
  defaultOgImage: "/images/assets/og-image.png",
  englishOgImage: "/images/assets/og-image-en.svg",
  chineseOgImage: "/images/assets/og-image-zh.png",
};

export type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  enableLanguageAlternates?: boolean;
  locale?: SeoLocale;
};

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

export function isSupportedSeoLocale(value: string): value is SeoLocale {
  return supportedSeoLocales.some((locale) => locale === value);
}

export function resolveSeoLocaleFromPath(path: PageMetadataInput["path"]): SeoLocale {
  if (path === "/en" || path.startsWith("/en/")) {
    return "en";
  }

  if (path === "/zh" || path.startsWith("/zh/")) {
    return "zh";
  }

  return DEFAULT_SEO_LOCALE;
}

export function getDefaultOgImageForLocale(locale: SeoLocale): string {
  if (locale === "en") {
    return siteConfig.englishOgImage;
  }

  return siteConfig.defaultOgImage;
}

function resolveSiteNameForLocale(locale: SeoLocale): string {
  if (locale === "en") {
    return siteConfig.shortName;
  }

  return siteConfig.name;
}

export function createPageMetadata(input: PageMetadataInput): Metadata {
  const locale = input.locale ?? resolveSeoLocaleFromPath(input.path);
  const siteName = resolveSiteNameForLocale(locale);
  const canonicalUrl = createAbsoluteUrl(input.path);
  const imagePath = input.image ?? getDefaultOgImageForLocale(locale);
  const ogImageUrl = createAbsoluteUrl(imagePath);
  const imageAlt = input.imageAlt ?? `${input.title} - ${siteName}`;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: canonicalUrl,
      ...(input.enableLanguageAlternates === true
        ? {
            languages: createHreflangAlternates(input.path),
          }
        : {}),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: openGraphLocaleByLocale[locale],
      type: input.type ?? "website",
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImageUrl],
    },
    robots: input.noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function createNotFoundMetadata(): Metadata {
  return createPageMetadata({
    title: "ページが見つかりません",
    description:
      "お探しのページは見つかりませんでした。AWS資格ロードマップラボのトップページ、用語集、模擬問題、構成図から学習を続けられます。",
    path: "/404",
    noIndex: true,
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
} satisfies Record<string, PageMetadataInput>;