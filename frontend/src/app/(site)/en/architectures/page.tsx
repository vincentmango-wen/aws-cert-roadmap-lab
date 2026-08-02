import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ArchitecturesListClient } from "@/components/architectures/ArchitecturesListClient";
import {
  architecturesPageMetadataByLocale,
  getArchitecturesPageData,
} from "../../architectures/architectures-page-data";

export const metadata: Metadata = createPageMetadata(
  architecturesPageMetadataByLocale.en,
);

export default function EnglishArchitecturesPage() {
  return <ArchitecturesListClient {...getArchitecturesPageData("en")} />;
}
