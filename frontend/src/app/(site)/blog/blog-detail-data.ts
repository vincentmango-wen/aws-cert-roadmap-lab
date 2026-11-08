/**
 * Localized blog metadata and helpers (single source of truth). Match architecture-detail-data.ts naming
 * and placement so all three locale pages use thin wrappers of the same shape. The
 * @/contents/blog/blogPosts registry stores shared metadata for 25 posts (postId, slug, publishedAt,
 * category, etc.). loadBlogContent(locale, slug) reads localized title, description, tags and
 * targetKeywords from MDX frontmatter to override registry values. Japanese MDX must exist; en/zh use
 * registry values until translated.
 */
import type { PageMetadataInput } from "@/lib/seo";
import type { BlogPostMeta } from "@/types/blog";
import { blogPosts } from "@/contents/blog/blogPosts";
import {
  createLocalizedPath,
  type Locale,
  type Pathname,
} from "@/i18n/locales";
import { loadBlogContent } from "./blog-content-loader";

export type BlogPost = BlogPostMeta & {
  content: string;
};

export type BlogStaticParams = {
  postSlug: string;
};

export type BlogDetailLabels = {
  breadcrumbAriaLabel: string;
  homeLabel: string;
  blogLabel: string;
  publishedAtLabel: string;
  updatedAtLabel: string;
  authorLabel: string;
  unsetLabel: string;
  nextSectionTitle: string;
  nextSectionDescription: string;
  backToListLabel: string;
  termsCtaLabel: string;
  questionsCtaLabel: string;
  notFoundTitle: string;
  notFoundDescription: string;
  defaultDescription: string;
};

export const blogDetailLabelsByLocale: Record<Locale, BlogDetailLabels> = {
  ja: {
    breadcrumbAriaLabel: "パンくず",
    homeLabel: "ホーム",
    blogLabel: "ブログ",
    publishedAtLabel: "公開日",
    updatedAtLabel: "更新日",
    authorLabel: "著者",
    unsetLabel: "未設定",
    nextSectionTitle: "次に学ぶ内容",
    nextSectionDescription:
      "ブログ記事だけでなく、AWS用語集・サービス比較・模擬問題・構成図を組み合わせると、資格知識と実装イメージをつなげて理解できます。",
    backToListLabel: "ブログ一覧へ戻る",
    termsCtaLabel: "AWS用語集を見る",
    questionsCtaLabel: "模擬問題を解く",
    notFoundTitle: "記事が見つかりません",
    notFoundDescription: "指定されたブログ記事は見つかりませんでした。",
    defaultDescription: "AWS資格学習に関する記事です。",
  },
  en: {
    breadcrumbAriaLabel: "Breadcrumb",
    homeLabel: "Home",
    blogLabel: "Blog",
    publishedAtLabel: "Published",
    updatedAtLabel: "Updated",
    authorLabel: "Author",
    unsetLabel: "Not set",
    nextSectionTitle: "What to learn next",
    nextSectionDescription:
      "Combine blog posts with the AWS glossary, service comparisons, practice questions, and architecture gallery to connect exam knowledge with implementation.",
    backToListLabel: "Back to blog list",
    termsCtaLabel: "View AWS glossary",
    questionsCtaLabel: "Go to practice questions",
    notFoundTitle: "Article not found",
    notFoundDescription: "The specified blog article was not found.",
    defaultDescription: "An article on AWS certification learning.",
  },
  zh: {
    breadcrumbAriaLabel: "麵包屑",
    homeLabel: "首頁",
    blogLabel: "部落格",
    publishedAtLabel: "發布日期",
    updatedAtLabel: "更新日期",
    authorLabel: "作者",
    unsetLabel: "未設定",
    nextSectionTitle: "接下來學什麼",
    nextSectionDescription:
      "結合部落格文章與 AWS 術語集、服務比較、模擬題、架構圖,把考試知識和實作體驗連結起來理解。",
    backToListLabel: "返回部落格列表",
    termsCtaLabel: "查看 AWS 術語集",
    questionsCtaLabel: "前往模擬題",
    notFoundTitle: "找不到文章",
    notFoundDescription: "找不到指定的部落格文章。",
    defaultDescription: "AWS 認證學習相關文章。",
  },
};

/**
 * Return localized published-blog metadata. Starting with the registry's 25 posts, read MDX frontmatter
 * with loadBlogContent(locale, slug) and override title, description, tags, targetKeywords and noIndex.
 * Missing en/zh MDX retains Japanese registry values in scaffold mode, automatically switching to
 * localized values as Phase 2 translations arrive.
 */
export function getPublishedBlogPosts(locale: Locale): BlogPostMeta[] {
  return blogPosts
    .filter((post) => post.published)
    .map((post) => {
      const loaded = loadBlogContent(locale, post.slug);

      if (!loaded) {
        return post;
      }

      const { frontmatter } = loaded;

      return {
        ...post,
        title: frontmatter.title || post.title,
        description: frontmatter.description || post.description,
        category: frontmatter.category || post.category,
        tags: frontmatter.tags.length > 0 ? frontmatter.tags : post.tags,
        targetKeywords:
          frontmatter.targetKeywords.length > 0
            ? frontmatter.targetKeywords
            : post.targetKeywords,
        noIndex: frontmatter.noIndex,
      } satisfies BlogPostMeta;
    })
    .sort((firstPost, secondPost) =>
      secondPost.publishedAt.localeCompare(firstPost.publishedAt),
    );
}

/**
 * Get a localized article (metadata and MDX body). Return null if MDX is unavailable so the build does
 * not fail.
 */
export function getBlogPostBySlug(
  locale: Locale,
  slug: string,
): BlogPost | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const meta = getPublishedBlogPosts(locale).find(
    (post) => post.slug === slug,
  );

  if (!meta) {
    return null;
  }

  const loaded = loadBlogContent(locale, slug);

  // Fall back to Japanese MDX, which is expected to exist.
  // Until en/zh translations exist, display the Japanese body as a scaffold-mode fallback.
  const fallback =
    loaded === null && locale !== "ja"
      ? loadBlogContent("ja", slug)
      : loaded;

  return {
    ...meta,
    content: fallback?.content ?? "",
  };
}

export function getBlogStaticParams(locale: Locale): BlogStaticParams[] {
  // As with architectures and comparisons, generate static parameters from
  // the localized published-post list. Even without en/zh MDX, getPublishedBlogPosts
  // returns the registry's 25 posts, generating the same slug set for every locale.
  // This scaffold fallback switches automatically to localized content as Phase 2 translations arrive.
  return getPublishedBlogPosts(locale).map((post) => ({ postSlug: post.slug }));
}

export function createBlogPostPath(locale: Locale, slug: string): Pathname {
  return createLocalizedPath(locale, `/blog/${slug}`);
}

export function createBlogDetailMetadataInput(
  locale: Locale,
  slug: string,
): PageMetadataInput {
  const labels = blogDetailLabelsByLocale[locale];
  const post = getBlogPostBySlug(locale, slug);

  if (!post) {
    return {
      title: labels.notFoundTitle,
      description: labels.notFoundDescription,
      path: createBlogPostPath(locale, slug),
      noIndex: true,
    };
  }

  return {
    title: post.title,
    description: post.description,
    path: createBlogPostPath(locale, post.slug),
    keywords: ["AWS", "AWS資格", "AWSブログ", ...post.targetKeywords],
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    noIndex: post.noIndex,
  };
}
