import type { Metadata } from "next";
import type { ReactElement } from "react";
import { createPageMetadata } from "@/lib/seo";
import { BlogListContent } from "@/components/blog/BlogListContent";
import {
  blogPageMetadataByLocale,
  getBlogPageData,
} from "../../blog/blog-page-data";

export const metadata: Metadata = createPageMetadata(blogPageMetadataByLocale.en);

export default function EnglishBlogPage(): ReactElement {
  return <BlogListContent {...getBlogPageData("en")} />;
}
