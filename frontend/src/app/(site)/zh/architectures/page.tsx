import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ArchitecturesListClient } from "@/components/architectures/ArchitecturesListClient";
import {
  architecturesPageMetadataByLocale,
  getArchitecturesPageData,
} from "../../architectures/architectures-page-data";

export const metadata: Metadata = createPageMetadata(
  architecturesPageMetadataByLocale.zh,
);

export default function ChineseArchitecturesPage() {
  return <ArchitecturesListClient {...getArchitecturesPageData("zh")} />;
}
