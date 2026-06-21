import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import {
  blogDetailLabelsByLocale,
  createBlogDetailMetadataInput,
  getBlogPostBySlug,
  getBlogStaticParams,
} from "../../../blog/blog-detail-data";

type PageProps = {
  params: Promise<{
    postSlug: string;
  }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogStaticParams("en");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { postSlug } = await params;
  return createPageMetadata(createBlogDetailMetadataInput("en", postSlug));
}

export default async function EnglishBlogPostPage({ params }: PageProps) {
  const { postSlug } = await params;
  const post = getBlogPostBySlug("en", postSlug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostContent
      locale="en"
      post={post}
      labels={blogDetailLabelsByLocale.en}
    />
  );
}
