export type BlogCategory =
  | "CLF"
  | "SAA"
  | "無料枠"
  | "サーバーレス"
  | "ポートフォリオ"
  | "AWS Services";

export type BlogPostMeta = {
  postId: string;
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  targetKeywords: string[];
  author: string;
  eyeCatch?: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};