/**
 * blog.ts
 *
 * ブログ記事のメタデータ型。
 *
 * `category` は MDX frontmatter の値をそのまま受ける `string` 型として扱う。
 * 3 locale (ja / en / zh) で異なるカテゴリラベルが存在し、union に列挙すると
 * locale 追加・カテゴリ追加のたびに型が肥大化するため、architectures の
 * `formatArchitectureCategoryLabel` パターンに揃え、表示ラベル/フィルタは
 * runtime のヘルパーで吸収する方針 (P5-050 architecture レビュー M-3).
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
