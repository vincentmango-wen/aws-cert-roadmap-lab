import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import {
  createComparisonDetailMetadataInput,
  getComparisonBySlug,
  getComparisonStaticParams,
} from "../comparison-detail-data";
import { ComparisonDetailContent } from "@/components/comparisons/ComparisonDetailContent";

type ComparisonPageProps = {
  params: Promise<{
    comparisonSlug: string;
  }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getComparisonStaticParams("ja");
}

export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { comparisonSlug } = await params;

  return createPageMetadata(
    createComparisonDetailMetadataInput("ja", comparisonSlug),
  );
}

export default async function ComparisonDetailPage({
  params,
}: ComparisonPageProps) {
  const { comparisonSlug } = await params;
  const comparison = getComparisonBySlug("ja", comparisonSlug);

  if (!comparison) {
    notFound();
  }

  return <ComparisonDetailContent locale="ja" comparison={comparison} />;
}
