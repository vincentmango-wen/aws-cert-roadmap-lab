import type { Metadata } from "next";
import { createPageMetadata } from "../../../lib/seo";
import { TermsListClient } from "./TermsListClient";
import { getTermsPageData, termsPageMetadataByLocale } from "./terms-page-data";

export const metadata: Metadata = createPageMetadata(
  termsPageMetadataByLocale.ja,
);

export default function TermsPage() {
  return <TermsListClient {...getTermsPageData("ja")} />;
}
