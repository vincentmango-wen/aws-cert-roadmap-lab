import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "../../../lib/seo";
import { TermDetailContent } from "../TermDetailContent";
import {
  createTermDetailMetadataInput,
  getTermById,
  getTermStaticParams,
} from "../term-detail-data";

type PageProps = {
  params: Promise<{
    termId: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getTermStaticParams("ja");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { termId } = await params;

  return createPageMetadata(createTermDetailMetadataInput("ja", termId));
}

export default async function TermDetailPage({ params }: PageProps) {
  const { termId } = await params;
  const term = getTermById("ja", termId);

  if (!term) {
    notFound();
  }

  return <TermDetailContent locale="ja" term={term} />;
}