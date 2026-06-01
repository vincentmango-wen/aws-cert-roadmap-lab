import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { BlogListClient } from "../../components/blog/BlogListClient";
import { blogPosts } from "../../contents/blog/blogPosts";

export const metadata: Metadata = {
  title: "AWS学習ブログ | AWS資格ロードマップラボ",
  description:
    "AWS資格、サーバーレス、無料枠、ポートフォリオ作成に関する初心者向け学習記事をまとめています。",
};

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
                公開予定記事
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
        <BlogListClient posts={publishedPosts} />

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