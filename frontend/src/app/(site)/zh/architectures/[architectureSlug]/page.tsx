import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import {
  createArchitectureDetailMetadataInput,
  getArchitectureBySlug,
  getArchitectureStaticParams,
} from "../../../architectures/architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";

type PageProps = {
  params: Promise<{
    architectureSlug: string;
  }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArchitectureStaticParams("zh");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { architectureSlug } = await params;

  return createPageMetadata(
    createArchitectureDetailMetadataInput("zh", architectureSlug),
  );
}

export default async function ChineseArchitectureDetailPage({
  params,
}: PageProps) {
  const { architectureSlug } = await params;
  const architecture = getArchitectureBySlug("zh", architectureSlug);

  if (!architecture) {
    notFound();
  }

  return (
    <ArchitectureDetailContent locale="zh" architecture={architecture} />
  );
}
