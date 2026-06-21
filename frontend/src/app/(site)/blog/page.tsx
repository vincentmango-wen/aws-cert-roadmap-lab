import type { Metadata } from "next";
import type { ReactElement } from "react";
import { createPageMetadata } from "@/lib/seo";
import { BlogListContent } from "@/components/blog/BlogListContent";
import { blogPageMetadataByLocale, getBlogPageData } from "./blog-page-data";

export const metadata: Metadata = createPageMetadata(blogPageMetadataByLocale.ja);

export default function BlogPage(): ReactElement {
  return <BlogListContent {...getBlogPageData("ja")} />;
}
