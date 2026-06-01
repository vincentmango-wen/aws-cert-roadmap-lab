import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { blogPosts } from "../../../contents/blog/blogPosts";

type BlogPostPageParams = {
  postSlug: string;
};

type BlogPostPageProps = {
  params: Promise<BlogPostPageParams>;
};

export const dynamicParams = false;

export function generateStaticParams(): BlogPostPageParams[] {
  return blogPosts
    .filter((post) => post.published)
    .map((post) => ({
      postSlug: post.slug,
    }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { postSlug } = await params;

  const post = blogPosts.find(
    (blogPost) => blogPost.slug === postSlug && blogPost.published,
  );

  if (!post) {
    return {
      title: "記事が見つかりません | AWS資格ロードマップラボ",
      description: "指定されたブログ記事は見つかりませんでした。",
    };
  }

  return {
    title: `${post.title} | AWS資格ロードマップラボ`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps): Promise<ReactElement> {
  const { postSlug } = await params;

  const post = blogPosts.find(
    (blogPost) => blogPost.slug === postSlug && blogPost.published,
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-slate-50">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="text-sm text-slate-500" aria-label="パンくず">
          <Link href="/" className="hover:text-slate-900">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-slate-900">
            ブログ
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-900">{post.title}</span>
        </nav>

        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            {post.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {post.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>公開日：{post.publishedAt}</span>
            <span>/</span>
            <span>更新日：{post.updatedAt}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <p className="text-sm font-bold text-slate-500">この記事について</p>
          <p className="mt-4 leading-8 text-slate-700">
            この記事本文はMDXファイルとして管理しています。
            現在の詳細ページでは、まず記事メタデータを表示しています。
            MDX本文の表示処理は、次の修正でMDX読み込み処理と接続します。
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">学習ポイント</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              <li>・AWS資格学習と実装をつなげて理解する</li>
              <li>・Cloud Practitionerで問われる基本サービスを整理する</li>
              <li>・SAAにつながる構成パターンを意識する</li>
              <li>・ポートフォリオとして説明できる観点を押さえる</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-white">
          <h2 className="text-xl font-bold">次に学ぶ内容</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            ブログ記事だけでなく、AWS用語集・サービス比較・模擬問題・構成図を組み合わせると、
            資格知識と実装イメージをつなげて理解できます。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              ブログ一覧へ戻る
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
        </section>
      </article>
    </main>
  );
}