import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { TermDetailContent } from "../../../terms/TermDetailContent";
import {
  createTermDetailMetadataInput,
  getTermById,
  getTermStaticParams,
} from "../../../terms/term-detail-data";

type PageProps = {
  params: Promise<{
    termId: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getTermStaticParams("zh");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { termId } = await params;

  return createPageMetadata(createTermDetailMetadataInput("zh", termId));
}

export default async function ChineseTermDetailPage({ params }: PageProps) {
  const { termId } = await params;
  const term = getTermById("zh", termId);

  if (!term) {
    notFound();
  }

  return <TermDetailContent locale="zh" term={term} />;
}