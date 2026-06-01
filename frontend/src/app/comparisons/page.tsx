import type { Metadata } from "next";
import Link from "next/link";
import { publishedComparisons } from "../../contents/comparisons/comparisons";
import type {
  Comparison,
  ComparisonLevel,
  ComparisonPriority,
} from "../../types/comparison";

export const metadata: Metadata = {
  title: "AWSサービス比較 | AWS Cert Roadmap Lab",
  description:
    "AWS資格試験で混同しやすいS3、EBS、EFS、RDS、DynamoDB、SNS、SQS、EventBridgeなどの違いを比較して学べるページです。",
};

const priorityOrder: Record<ComparisonPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

const levelLabels: Record<ComparisonLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const priorityLabels: Record<ComparisonPriority, string> = {
  high: "優先度 高",
  medium: "優先度 中",
  low: "優先度 低",
};

const sortedComparisons = [...publishedComparisons].sort((a, b) => {
  const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  return a.title.localeCompare(b.title, "ja");
});

const categories = Array.from(
  new Set(sortedComparisons.map((comparison) => comparison.category)),
);

const recommendedComparisons = sortedComparisons
  .filter((comparison) => comparison.priority === "high")
  .slice(0, 3);

function formatServiceName(service: string): string {
  const serviceNameMap: Record<string, string> = {
    s3: "S3",
    ebs: "EBS",
    efs: "EFS",
    rds: "RDS",
    dynamodb: "DynamoDB",
    sns: "SNS",
    sqs: "SQS",
    eventbridge: "EventBridge",
    iam: "IAM",
    cloudwatch: "CloudWatch",
    cloudtrail: "CloudTrail",
    config: "AWS Config",
  };

  return serviceNameMap[service] ?? service.toUpperCase();
}

function ComparisonCard({ comparison }: { comparison: Comparison }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {comparison.category}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {levelLabels[comparison.level]}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {priorityLabels[comparison.priority]}
        </span>
      </div>

      <h2 className="text-xl font-bold text-slate-900">
        <Link
          href={`/comparisons/${comparison.slug}`}
          className="hover:text-blue-700"
        >
          {comparison.title}
        </Link>
      </h2>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {comparison.description}
      </p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          対象サービス
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {comparison.services.map((service) => (
            <Link
              key={service}
              href={`/terms/${service}`}
              className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              {formatServiceName(service)}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {comparison.examScopes.map((examScope) => (
            <span
              key={examScope}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
            >
              {examScope}
            </span>
          ))}
        </div>

        <Link
          href={`/comparisons/${comparison.slug}`}
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          詳細を見る →
        </Link>
      </div>
    </article>
  );
}

export default function ComparisonsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
          AWS Service Comparisons
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          AWSサービス比較
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">
          AWS資格試験で混同しやすいサービスを、用途・試験ポイント・実務での使い分けから整理します。
          単体の暗記ではなく、「どの場面でどのサービスを選ぶか」を理解するためのページです。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/terms"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-blue-50"
          >
            用語集を見る
          </Link>
          <Link
            href="/questions"
            className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            模擬問題を解く
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              おすすめ比較
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              初学者が最初に読んでおきたい比較です。
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            公開中：{sortedComparisons.length}件
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {recommendedComparisons.map((comparison) => (
            <Link
              key={comparison.comparisonId}
              href={`/comparisons/${comparison.slug}`}
              className="rounded-2xl border border-blue-100 bg-blue-50 p-5 transition hover:-translate-y-1 hover:bg-blue-100"
            >
              <p className="text-sm font-semibold text-blue-700">
                {comparison.category}
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                {comparison.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {comparison.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">カテゴリ</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase()}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-10">
        {categories.map((category) => {
          const categoryComparisons = sortedComparisons.filter(
            (comparison) => comparison.category === category,
          );

          return (
            <div key={category} id={category.toLowerCase()}>
              <div className="mb-5 border-b border-slate-200 pb-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {category}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {category}カテゴリで混同しやすいAWSサービスを比較します。
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {categoryComparisons.map((comparison) => (
                  <ComparisonCard
                    key={comparison.comparisonId}
                    comparison={comparison}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">
          比較ページの使い方
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">1. 用語を確認する</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              まずは各AWSサービスの概要を用語集で確認します。
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">2. 違いを比較する</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              似ているサービスの違いを、用途・試験ポイント・設計観点で整理します。
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">3. 問題で確認する</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              最後に模擬問題を解いて、サービスの使い分けを確認します。
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/questions"
            className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            模擬問題へ進む
          </Link>
        </div>
      </section>
    </main>
  );
}