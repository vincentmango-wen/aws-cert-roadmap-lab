import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { blogPosts } from "../../contents/blog/blogPosts";
import { createPageMetadata, pageSeo } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata(pageSeo.blog);

export default function BlogPage(): ReactElement {
  const publishedPosts = blogPosts
    .filter((post) => post.published)
    .sort((firstPost, secondPost) =>
      secondPost.publishedAt.localeCompare(firstPost.publishedAt),
    );

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-500" aria-label="パンくず">
            <Link href="/" className="hover:text-slate-900">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-900">ブログ</span>
          </nav>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              AWS Learning Blog
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              AWS学習ブログ
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              AWS資格、サーバーレス、無料枠ポートフォリオに関する記事をまとめています。
              Cloud Practitionerの基礎から、SAAにつながる構成図・設計パターンまで、
              初学者が実装と試験対策をつなげて理解できる内容を掲載します。
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-3xl font-bold text-slate-950">
                {publishedPosts.length}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                公開記事
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-3xl font-bold text-slate-950">CLF</p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Cloud Practitioner対策
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-3xl font-bold text-slate-950">SAA</p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                構成図・設計パターン
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                最新記事
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                AWS資格学習とポートフォリオ実装に役立つ記事を掲載しています。
              </p>
            </div>
          </div>

          {publishedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publishedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {post.category}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {post.publishedAt}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-8 text-slate-950 group-hover:text-blue-700">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">
                    {post.description}
                  </p>

                  {post.tags.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className="mt-6 text-sm font-semibold text-blue-700">
                    記事を読む →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-lg font-bold text-slate-950">
                公開記事がありません
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                `published: true` の記事を追加してください。
              </p>
            </div>
          )}
        </section>

        <section className="mt-12 rounded-3xl bg-slate-950 p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold">
              まずはAWSの全体像から学びたい方へ
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              ブログ記事とあわせて、AWS用語集、サービス比較、模擬問題、構成図を順番に見ると、
              資格知識と実装イメージをつなげて理解できます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/roadmap"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                学習ロードマップを見る
              </Link>
              <Link
                href="/terms"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                AWS用語集を見る
              </Link>
              <Link
                href="/questions"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                模擬問題を解く
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}