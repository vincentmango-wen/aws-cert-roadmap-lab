import Link from "next/link";
import type { ReactElement } from "react";
import type { BlogPostMeta } from "@/types/blog";
import type { Locale } from "@/i18n/locales";
import { createLocalizedPath } from "@/i18n/locales";
import type { BlogListLabels } from "@/app/(site)/blog/blog-page-data";

type BlogListContentProps = {
  locale: Locale;
  labels: BlogListLabels;
  posts: BlogPostMeta[];
};

export function BlogListContent({
  locale,
  labels,
  posts,
}: BlogListContentProps): ReactElement {
  const homePath = createLocalizedPath(locale, "/");
  const roadmapPath = createLocalizedPath(locale, "/roadmap");
  const termsPath = createLocalizedPath(locale, "/terms");
  const questionsPath = createLocalizedPath(locale, "/questions");

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <nav
            className="text-sm text-slate-500"
            aria-label={labels.breadcrumbAriaLabel}
          >
            <Link href={homePath} className="hover:text-slate-900">
              {labels.homeLabel}
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-900">
              {labels.blogLabel}
            </span>
          </nav>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              {labels.heroEyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {labels.heroTitle}
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {labels.heroDescription}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-3xl font-bold text-slate-950">
                {posts.length}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {labels.publishedCountLabel}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-3xl font-bold text-slate-950">
                {labels.clfTitle}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {labels.clfDescription}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-3xl font-bold text-slate-950">
                {labels.saaTitle}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {labels.saaDescription}
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
                {labels.latestSectionTitle}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {labels.latestSectionDescription}
              </p>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={createLocalizedPath(locale, `/blog/${post.slug}`)}
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
                    {labels.readArticleLabel}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-lg font-bold text-slate-950">
                {labels.emptyTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {labels.emptyDescription}
              </p>
            </div>
          )}
        </section>

        <section className="mt-12 rounded-3xl bg-slate-950 p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold">{labels.introTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {labels.introBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={roadmapPath}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                {labels.roadmapCtaLabel}
              </Link>
              <Link
                href={termsPath}
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                {labels.termsCtaLabel}
              </Link>
              <Link
                href={questionsPath}
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                {labels.questionsCtaLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
