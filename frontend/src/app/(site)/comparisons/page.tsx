import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ComparisonsListClient } from "@/components/comparisons/ComparisonsListClient";
import {
  comparisonsPageMetadataByLocale,
  getComparisonsPageData,
} from "./comparisons-page-data";

export const metadata: Metadata = createPageMetadata(
  comparisonsPageMetadataByLocale.ja,
);

export default function ComparisonsPage() {
  return <ComparisonsListClient {...getComparisonsPageData("ja")} />;
}
