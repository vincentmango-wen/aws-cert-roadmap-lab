import termsEnData from "../../../../contents/terms/terms.en.json";
import termsJaData from "../../../../contents/terms/terms.ja.json";
import termsZhData from "../../../../contents/terms/terms.zh.json";
import type { PageMetadataInput } from "@/lib/seo";
import type { TermSummary, TermsListLocale } from "./TermsListClient";

type TermSource = Omit<TermSummary, "priority"> & {
  priority?: TermSummary["priority"];
  locale?: TermsListLocale;
};

type TermsPageData = {
  terms: TermSummary[];
  locale: TermsListLocale;
};

const termsDataByLocale: Record<TermsListLocale, TermSource[]> = {
  ja: termsJaData as TermSource[],
  en: termsEnData as TermSource[],
  zh: termsZhData as TermSource[],
};

export const termsPageMetadataByLocale: Record<
  TermsListLocale,
  PageMetadataInput
> = {
  ja: {
    title: "AWS用語集",
    description:
      "IAM、S3、EC2、Lambda、VPC、RDS、DynamoDBなど、AWS主要サービスを初学者向けに整理した用語集です。",
    path: "/terms",
    keywords: ["AWS 用語集", "AWS サービス", "Cloud Practitioner"],
  },
  en: {
    title: "AWS Glossary",
    description:
      "A beginner-friendly AWS glossary covering IAM, S3, EC2, Lambda, VPC, RDS, DynamoDB, CloudFront, and other core AWS services.",
    path: "/en/terms",
    keywords: [
      "AWS glossary",
      "AWS services",
      "Cloud Practitioner",
      "Solutions Architect Associate",
    ],
  },
  zh: {
    title: "AWS術語集",
    description:
      "面向初學者的AWS術語集，整理IAM、S3、EC2、Lambda、VPC、RDS、DynamoDB、CloudFront等主要AWS服務。",
    path: "/zh/terms",
    keywords: ["AWS 術語集", "AWS 服務", "Cloud Practitioner", "SAA"],
  },
};

function resolvePriority(term: TermSource): TermSummary["priority"] {
  if (term.priority) {
    return term.priority;
  }

  if (term.examScopes.includes("CLF-C02") && term.level === "beginner") {
    return "CLF重要";
  }

  if (term.examScopes.includes("SAA-C03")) {
    return "SAA重要";
  }

  return "学習対象";
}

function createTerms(locale: TermsListLocale): TermSummary[] {
  return termsDataByLocale[locale].map((term) => ({
    termId: term.termId,
    name: term.name,
    shortName: term.shortName,
    category: term.category,
    level: term.level,
    examScopes: term.examScopes,
    priority: resolvePriority(term),
    oneLine: term.oneLine,
  }));
}

export function getTermsPageData(locale: TermsListLocale): TermsPageData {
  return {
    terms: createTerms(locale),
    locale,
  };
}