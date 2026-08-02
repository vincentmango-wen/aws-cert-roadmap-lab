import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import {
  createComparisonDetailMetadataInput,
  getComparisonBySlug,
  getComparisonStaticParams,
} from "../../../comparisons/comparison-detail-data";
import { ComparisonDetailContent } from "@/components/comparisons/ComparisonDetailContent";

type PageProps = {
  params: Promise<{
    comparisonSlug: string;
  }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getComparisonStaticParams("zh");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { comparisonSlug } = await params;

  return createPageMetadata(
    createComparisonDetailMetadataInput("zh", comparisonSlug),
  );
}

export default async function ChineseComparisonDetailPage({
  params,
}: PageProps) {
  const { comparisonSlug } = await params;
  const comparison = getComparisonBySlug("zh", comparisonSlug);

  if (!comparison) {
    notFound();
  }

  return <ComparisonDetailContent locale="zh" comparison={comparison} />;
}
