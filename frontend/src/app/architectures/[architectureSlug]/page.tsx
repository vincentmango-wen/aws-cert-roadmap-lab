import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  architectureCategoryLabels,
  architectureLevelLabels,
  awsServiceLabels,
  publishedArchitectures,
  type ArchitectureMeta,
} from "../../../contents/architectures/architectures";

export const dynamic = "force-static";
export const dynamicParams = false;

type PageProps = {
  params: Promise<{
    architectureSlug: string;
  }>;
};

function getArchitectureBySlug(slug: string): ArchitectureMeta | undefined {
  return publishedArchitectures.find(
    (architecture) => architecture.slug === slug,
  );
}

export function generateStaticParams(): Array<{ architectureSlug: string }> {
  return publishedArchitectures.map((architecture) => ({
    architectureSlug: architecture.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { architectureSlug } = await params;
  const architecture = getArchitectureBySlug(architectureSlug);

  if (!architecture) {
    return {
      title: "構成図が見つかりません | AWS資格ロードマップラボ",
      description: "指定されたAWS構成図は見つかりませんでした。",
    };
  }

  return {
    title: `${architecture.title} | AWS資格ロードマップラボ`,
    description: architecture.description,
  };
}

export default async function ArchitectureDetailPage({ params }: PageProps) {
  const { architectureSlug } = await params;
  const architecture = getArchitectureBySlug(architectureSlug);

  if (!architecture) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate-500" aria-label="パンくず">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-900">
              ホーム
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/architectures" className="hover:text-slate-900">
              構成図
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-900">{architecture.title}</li>
        </ol>
      </nav>

      <article className="space-y-10">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
              {architectureCategoryLabels[architecture.category]}
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              {architectureLevelLabels[architecture.level]}
            </span>

            {architecture.examScopes.map((examScope) => (
              <span
                key={examScope}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {examScope}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {architecture.title}
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-slate-700">
            {architecture.description}
          </p>

          {architecture.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {architecture.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {architecture.diagramPath ? (
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-950">構成図</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={architecture.diagramPath}
              alt={`${architecture.title}の構成図`}
              className="w-full rounded-2xl border border-slate-200 bg-white"
            />
          </section>
        ) : null}

        {architecture.services.length > 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">使用AWSサービス</h2>
            <p className="mt-2 text-sm text-slate-600">
              サービス名をクリックすると、用語詳細ページへ移動します。
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {architecture.services.map((service) => (
                <Link
                  key={service}
                  href={`/terms/${service}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                >
                  {awsServiceLabels[service] ?? service}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {architecture.sections && architecture.sections.length > 0 ? (
            <div className="space-y-8">
              {architecture.sections.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 className="border-b border-slate-200 pb-3 text-2xl font-bold text-slate-950">
                    {section.title}
                  </h2>
                  <p className="whitespace-pre-line leading-8 text-slate-700">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          ) : (
            <p className="leading-8 text-slate-700">
              {architecture.description}
            </p>
          )}
        </section>

        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-xl font-bold">他のAWS構成図も確認する</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              SAA対策では、AWSサービスを単体ではなく構成パターンとして理解することが重要です。
            </p>
          </div>

          <Link
            href="/architectures"
            className="inline-flex justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            構成図一覧へ戻る
          </Link>
        </section>
      </article>
    </main>
  );
}
