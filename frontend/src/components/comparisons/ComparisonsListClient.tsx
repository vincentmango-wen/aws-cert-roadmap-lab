/**
 * ComparisonsListClient.tsx
 *
 * 一覧ページ本体 (locale 引数で全文言切替). server component として動作する
 * (interactivity 不要 / 既存 ja 一覧と同じ静的 layout).
 */
import Link from "next/link";
import {
  type ComparisonCategory,
  comparisonDetailLabelsByLocale,
  createComparisonPath,
  createLocalizedPath,
} from "@/app/(site)/comparisons/comparison-detail-data";
import type { ComparisonsPageData } from "@/app/(site)/comparisons/comparisons-page-data";
import { isExistingTerm } from "@/lib/termGuards";
import type { Comparison } from "@/types/comparison";

/**
 * comparison.category (string) を locale 別ラベルに変換する.
 * ComparisonCategory に含まれない値はそのまま返す (将来の category 追加時の防御).
 */
function getCategoryLabel(
  categoryLabels: Record<ComparisonCategory, string>,
  category: string,
): string {
  if (category in categoryLabels) {
    return categoryLabels[category as ComparisonCategory];
  }
  return category;
}

type ComparisonsListClientProps = ComparisonsPageData;

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
    lambda: "Lambda",
    "api-gateway": "API Gateway",
    cloudfront: "CloudFront",
    ec2: "EC2",
    vpc: "VPC",
    elb: "ELB",
    route53: "Route 53",
    "secrets-manager": "Secrets Manager",
    "systems-manager": "Systems Manager",
    kms: "KMS",
    bedrock: "Bedrock",
    sagemaker: "SageMaker",
  };

  return serviceNameMap[service] ?? service.toUpperCase();
}

function ComparisonCard({
  comparison,
  locale,
  labels,
}: {
  comparison: Comparison;
  locale: ComparisonsListClientProps["locale"];
  labels: ComparisonsListClientProps["labels"];
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {getCategoryLabel(labels.categoryLabels, comparison.category)}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {labels.levelLabels[comparison.level]}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {labels.priorityLabels[comparison.priority]}
        </span>
      </div>

      <h2 className="text-xl font-bold text-slate-900">
        <Link
          href={createComparisonPath(locale, comparison.slug)}
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
          {labels.targetServicesLabel}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {comparison.services.map((service) =>
            isExistingTerm(service) ? (
              <Link
                key={service}
                href={createLocalizedPath(locale, `/terms/${service}`)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                {formatServiceName(service)}
              </Link>
            ) : (
              <span
                key={service}
                className="rounded-lg border border-slate-100 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-400"
              >
                {formatServiceName(service)}
              </span>
            ),
          )}
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
          href={createComparisonPath(locale, comparison.slug)}
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          {labels.detailLinkLabel}
        </Link>
      </div>
    </article>
  );
}

export function ComparisonsListClient({
  locale,
  labels,
  comparisons,
  recommendedComparisons,
  categories,
}: ComparisonsListClientProps) {
  // detailLabels is intentionally not consumed here; preserved on page-data for
  // forward-compat consumers (e.g., shared headers).
  void comparisonDetailLabelsByLocale;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
          {labels.heroEyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {labels.heroTitle}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">
          {labels.heroDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={createLocalizedPath(locale, "/terms")}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-blue-50"
          >
            {labels.termsCta}
          </Link>
          <Link
            href={createLocalizedPath(locale, "/questions")}
            className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.questionsCta}
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {labels.recommendedSectionTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {labels.recommendedSectionDescription}
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {labels.publishedCountPrefix}
            {comparisons.length}
            {labels.publishedCountSuffix}
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {recommendedComparisons.map((comparison) => (
            <Link
              key={comparison.comparisonId}
              href={createComparisonPath(locale, comparison.slug)}
              className="rounded-2xl border border-blue-100 bg-blue-50 p-5 transition hover:-translate-y-1 hover:bg-blue-100"
            >
              <p className="text-sm font-semibold text-blue-700">
                {getCategoryLabel(labels.categoryLabels, comparison.category)}
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
        <h2 className="text-2xl font-bold text-slate-900">
          {labels.categoriesTitle}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase()}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              {getCategoryLabel(labels.categoryLabels, category)}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-10">
        {categories.map((category) => {
          const categoryComparisons = comparisons.filter(
            (comparison) => comparison.category === category,
          );
          const categoryLabel = getCategoryLabel(
            labels.categoryLabels,
            category,
          );

          return (
            <div key={category} id={category.toLowerCase()}>
              <div className="mb-5 border-b border-slate-200 pb-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {categoryLabel}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {labels.categoryDescription(categoryLabel)}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {categoryComparisons.map((comparison) => (
                  <ComparisonCard
                    key={comparison.comparisonId}
                    comparison={comparison}
                    locale={locale}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">
          {labels.usageTitle}
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">
              {labels.usageStep1Title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {labels.usageStep1Body}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">
              {labels.usageStep2Title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {labels.usageStep2Body}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">
              {labels.usageStep3Title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {labels.usageStep3Body}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href={createLocalizedPath(locale, "/questions")}
            className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {labels.usageCtaLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
