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
  return getArchitectureStaticParams("en");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { architectureSlug } = await params;

  return createPageMetadata(
    createArchitectureDetailMetadataInput("en", architectureSlug),
  );
}

export default async function EnglishArchitectureDetailPage({
  params,
}: PageProps) {
  const { architectureSlug } = await params;
  const architecture = getArchitectureBySlug("en", architectureSlug);

  if (!architecture) {
    notFound();
  }

  return (
    <ArchitectureDetailContent locale="en" architecture={architecture} />
  );
}
