/**
 * Blog metadata types. category accepts the raw MDX frontmatter string. Labels vary across ja/en/zh, so
 * a union would grow with every locale/category. Follow formatArchitectureCategoryLabel: runtime helpers
 * handle display labels and filters (P5-050 architecture review M-3).
 */
export type BlogPostMeta = {
  postId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  targetKeywords: string[];
  author: string;
  eyeCatch?: string;
  noIndex?: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};
