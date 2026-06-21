"use client";

import Link from "next/link";
import { useMemo, useState, type ReactElement } from "react";
import type { BlogPostMeta } from "../../types/blog";

type BlogListClientProps = {
  posts: BlogPostMeta[];
};

type CategoryFilter = string;

function formatDate(dateText: string): string {
  const [year, month, day] = dateText.split("-");

  if (!year || !month || !day) {
    return dateText;
  }

  return `${year}.${month}.${day}`;
}

export function BlogListClient({
  posts,
}: BlogListClientProps): ReactElement {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("すべて");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const categories = useMemo<CategoryFilter[]>(() => {
    const uniqueCategories = Array.from(
      new Set(posts.map((post) => post.category)),
    );

    return ["すべて", ...uniqueCategories];
  }, [posts]);

  const allTags = useMemo<string[]>(() => {
    return Array.from(new Set(posts.flatMap((post) => post.tags))).sort(
      (firstTag, secondTag) => firstTag.localeCompare(secondTag, "ja"),
    );
  }, [posts]);

  const filteredPosts = useMemo<BlogPostMeta[]>(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "すべて" || post.category === selectedCategory;
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);

      return matchesCategory && matchesTag;
    });
  }, [posts, selectedCategory, selectedTag]);

  function handleCategoryClick(category: CategoryFilter): void {
    setSelectedCategory(category);
  }

  function handleTagClick(tag: string): void {
    setSelectedTag((currentTag) => (currentTag === tag ? "" : tag));
  }

  function handleResetClick(): void {
    setSelectedCategory("すべて");
    setSelectedTag("");
  }

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              カテゴリで探す
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              CLF、SAA、無料枠、サーバーレス、ポートフォリオの観点で記事を絞り込めます。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={
                    isSelected
                      ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-base font-bold text-slate-950">タグ</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={
                      isSelected
                        ? "rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    }
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {(selectedCategory !== "すべて" || selectedTag) && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-700">
                表示条件：
                <span className="font-semibold">
                  {selectedCategory !== "すべて"
                    ? selectedCategory
                    : "全カテゴリ"}
                </span>
                {selectedTag ? (
                  <>
                    {" / "}
                    <span className="font-semibold">#{selectedTag}</span>
                  </>
                ) : null}
              </p>
              <button
                type="button"
                onClick={handleResetClick}
                className="text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                条件をリセット
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">記事一覧</h2>
            <p className="mt-1 text-sm text-slate-600">
              {filteredPosts.length}件の記事を表示中
            </p>
          </div>
          <Link
            href="/roadmap"
            className="text-sm font-semibold text-blue-700 underline underline-offset-4"
          >
            学習ロードマップを見る
          </Link>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <article
                key={post.postId}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {post.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    公開日：{formatDate(post.publishedAt)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    更新日：{formatDate(post.updatedAt)}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold leading-8 text-slate-950">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {post.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <button
                      key={`${post.postId}-${tag}`}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    記事を読む
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-base font-semibold text-slate-900">
              条件に一致する記事がありません。
            </p>
            <p className="mt-2 text-sm text-slate-600">
              カテゴリまたはタグの絞り込み条件を変更してください。
            </p>
            <button
              type="button"
              onClick={handleResetClick}
              className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              条件をリセット
            </button>
          </div>
        )}
      </section>
    </div>
  );
}