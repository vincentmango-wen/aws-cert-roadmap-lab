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
  return getBlogStaticParams("zh");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { postSlug } = await params;
  return createPageMetadata(createBlogDetailMetadataInput("zh", postSlug));
}

export default async function ChineseBlogPostPage({ params }: PageProps) {
  const { postSlug } = await params;
  const post = getBlogPostBySlug("zh", postSlug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostContent
      locale="zh"
      post={post}
      labels={blogDetailLabelsByLocale.zh}
    />
  );
}
