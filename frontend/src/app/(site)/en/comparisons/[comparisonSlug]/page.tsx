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
  return getComparisonStaticParams("en");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { comparisonSlug } = await params;

  return createPageMetadata(
    createComparisonDetailMetadataInput("en", comparisonSlug),
  );
}

export default async function EnglishComparisonDetailPage({
  params,
}: PageProps) {
  const { comparisonSlug } = await params;
  const comparison = getComparisonBySlug("en", comparisonSlug);

  if (!comparison) {
    notFound();
  }

  return <ComparisonDetailContent locale="en" comparison={comparison} />;
}
