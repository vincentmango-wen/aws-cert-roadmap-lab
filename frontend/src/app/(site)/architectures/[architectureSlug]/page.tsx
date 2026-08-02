import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import {
  createArchitectureDetailMetadataInput,
  getArchitectureBySlug,
  getArchitectureStaticParams,
} from "../architecture-detail-data";
import { ArchitectureDetailContent } from "@/components/architectures/ArchitectureDetailContent";

export const dynamic = "force-static";
export const dynamicParams = false;

type PageProps = {
  params: Promise<{
    architectureSlug: string;
  }>;
};

export function generateStaticParams() {
  return getArchitectureStaticParams("ja");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { architectureSlug } = await params;

  return createPageMetadata(
    createArchitectureDetailMetadataInput("ja", architectureSlug),
  );
}

export default async function ArchitectureDetailPage({ params }: PageProps) {
  const { architectureSlug } = await params;
  const architecture = getArchitectureBySlug("ja", architectureSlug);

  if (!architecture) {
    notFound();
  }

  return (
    <ArchitectureDetailContent locale="ja" architecture={architecture} />
  );
}
