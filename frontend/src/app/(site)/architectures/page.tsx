import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ArchitecturesListClient } from "@/components/architectures/ArchitecturesListClient";
import {
  architecturesPageMetadataByLocale,
  getArchitecturesPageData,
} from "./architectures-page-data";

export const metadata: Metadata = createPageMetadata(
  architecturesPageMetadataByLocale.ja,
);

export default function ArchitecturesPage() {
  return <ArchitecturesListClient {...getArchitecturesPageData("ja")} />;
}
