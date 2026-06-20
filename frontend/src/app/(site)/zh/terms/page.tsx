import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { TermsListClient } from "../../terms/TermsListClient";
import {
  getTermsPageData,
  termsPageMetadataByLocale,
} from "../../terms/terms-page-data";

export const metadata: Metadata = createPageMetadata(
  termsPageMetadataByLocale.zh,
);

export default function ChineseTermsPage() {
  return <TermsListClient {...getTermsPageData("zh")} />;
}