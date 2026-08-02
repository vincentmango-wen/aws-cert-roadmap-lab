import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ComparisonsListClient } from "@/components/comparisons/ComparisonsListClient";
import {
  comparisonsPageMetadataByLocale,
  getComparisonsPageData,
} from "../../comparisons/comparisons-page-data";

export const metadata: Metadata = createPageMetadata(
  comparisonsPageMetadataByLocale.en,
);

export default function EnglishComparisonsPage() {
  return <ComparisonsListClient {...getComparisonsPageData("en")} />;
}
