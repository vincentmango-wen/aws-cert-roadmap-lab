import type { Metadata } from "next";
import Link from "next/link";
import {
  architectureCategoryLabels,
  architectureLevelLabels,
  awsServiceLabels,
  publishedArchitectures,
} from "@/contents/architectures/architectures";
import { createPageMetadata, pageSeo } from "@/lib/seo";
import { isExistingTerm } from "@/lib/termGuards";

export const metadata: Metadata = createPageMetadata(pageSeo.architectures);

export default function ArchitecturesPage() {
  const totalCount = publishedArchitectures.length;
  const categories = Array.from(
    new Set(publishedArchitectures.map((architecture) => architecture.category)),
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">Architecture</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          AWS構成図ギャラリー
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          SAAで理解したいAWS構成パターンを、使用サービス・設計ポイント・試験観点で整理します。
          サービス単体の暗記ではなく、構成としてAWSを理解するための入口です。
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">掲載構成</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {totalCount}件
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">対象試験</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              CLF / SAA
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">学習テーマ</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              設計理解
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-950">カテゴリ</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              {architectureCategoryLabels[category]}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {publishedArchitectures.map((architecture) => (
          <article
            key={architecture.architectureId}
            className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {architectureCategoryLabels[architecture.category]}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {architectureLevelLabels[architecture.level]}
              </span>
              {architecture.examScopes.map((examScope) => (
                <span
                  key={`${architecture.architectureId}-${examScope}`}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  {examScope}
                </span>
              ))}
            </div>

            <h3 className="mt-4 text-xl font-bold leading-8 text-slate-950">
              <Link
                href={`/architectures/${architecture.slug}`}
                className="hover:text-blue-700"
              >
                {architecture.title}
              </Link>
            </h3>

            <p className="mt-3 flex-1 text-sm leading-7 text-slate-700">
              {architecture.description}
            </p>

            <div className="mt-5">
              <h4 className="text-sm font-bold text-slate-900">使用AWSサービス</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {architecture.services.map((service) =>
                  isExistingTerm(service) ? (
                    <Link
                      key={`${architecture.architectureId}-${service}`}
                      href={`/terms/${service}`}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {awsServiceLabels[service] ?? service}
                    </Link>
                  ) : (
                    <span
                      key={`${architecture.architectureId}-${service}`}
                      className="rounded-full border border-slate-100 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-400"
                    >
                      {awsServiceLabels[service] ?? service}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-bold text-slate-900">
                試験ポイントタグ
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {architecture.tags.map((tag) => (
                  <span
                    key={`${architecture.architectureId}-${tag}`}
                    className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/architectures/${architecture.slug}`}
                className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                詳細を見る
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold text-slate-950">
          構成図で見るポイント
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">可用性</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              障害時もサービスを継続しやすい構成かを確認します。
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">耐障害性</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              単一障害点を減らす設計になっているかを確認します。
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">コスト</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              固定費と従量課金の違いを意識して構成を見ます。
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <h3 className="font-bold text-slate-950">セキュリティ</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              公開範囲、IAM、ネットワーク分離、暗号化を確認します。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}