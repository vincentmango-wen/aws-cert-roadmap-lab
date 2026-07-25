/**
 * ComparisonDetailContent.tsx
 *
 * locale 別の比較記事詳細ページ本体. ja/en/zh いずれの route からも薄いラッパーで呼ばれる.
 */
import Link from "next/link";
import {
  comparisonDetailLabelsByLocale,
  createComparisonPath,
  createLocalizedPath,
  formatCategoryLabel,
  getPublishedComparisons,
  levelLabelsByLocale,
  priorityLabelsByLocale,
} from "@/app/(site)/comparisons/comparison-detail-data";
import { MarkdownContent } from "@/components/comparisons/MarkdownContent";
import {
  isExistingComparisonForLocale,
  isExistingTerm,
} from "@/lib/termGuards";
import type { ComparisonArticle, ComparisonLocale } from "@/types/comparison";

type ComparisonDetailContentProps = {
  locale: ComparisonLocale;
  comparison: ComparisonArticle;
};

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

export function ComparisonDetailContent({
  locale,
  comparison,
}: ComparisonDetailContentProps) {
  const labels = comparisonDetailLabelsByLocale[locale];
  const levelLabels = levelLabelsByLocale[locale];
  const priorityLabels = priorityLabelsByLocale[locale];

  const relatedComparisons = getPublishedComparisons(locale)
    .filter((item) => item.slug !== comparison.slug)
    .filter(
      (item) =>
        item.category === comparison.category ||
        item.services.some((service) =>
          comparison.services.includes(service),
        ),
    )
    .slice(0, 3);

  return (
    <main className="bg-slate-50">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="text-sm text-slate-500"
          aria-label={labels.breadcrumbLabel}
        >
          <Link
            href={createLocalizedPath(locale, "/")}
            className="hover:text-slate-900"
          >
            {labels.homeLabel}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={createLocalizedPath(locale, "/comparisons")}
            className="hover:text-slate-900"
          >
            {labels.comparisonsLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-900">
            {comparison.title}
          </span>
        </nav>

        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {formatCategoryLabel(locale, comparison.category)}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {levelLabels[comparison.level]}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {priorityLabels[comparison.priority]}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {comparison.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {comparison.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>
              {labels.publishedAtLabel}:{" "}
              {comparison.publishedAt || labels.unsetLabel}
            </span>
            <span>/</span>
            <span>
              {labels.updatedAtLabel}:{" "}
              {comparison.updatedAt || labels.unsetLabel}
            </span>
          </div>

          {comparison.examScopes.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {comparison.examScopes.map((examScope) => (
                <span
                  key={examScope}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {examScope}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {comparison.services.length > 0 ? (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-slate-950">
              {labels.comparisonTargetServicesTitle}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {labels.comparisonTargetServicesDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {comparison.services.map((service) =>
                isExistingTerm(service) ? (
                  <Link
                    key={service}
                    href={createLocalizedPath(locale, `/terms/${service}`)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {formatServiceName(service)}
                  </Link>
                ) : (
                  <span
                    key={service}
                    className="rounded-full border border-slate-100 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                  >
                    {formatServiceName(service)}
                  </span>
                ),
              )}
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <MarkdownContent content={comparison.content} locale={locale} />
        </section>

        <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-white">
          <h2 className="text-xl font-bold">{labels.nextLearningTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {labels.nextLearningDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={createLocalizedPath(locale, "/comparisons")}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              {labels.backToComparisonsLabel}
            </Link>
            <Link
              href={createLocalizedPath(locale, "/terms")}
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {labels.termsCtaLabel}
            </Link>
            <Link
              href={createLocalizedPath(locale, "/questions")}
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {labels.questionsCtaLabel}
            </Link>
          </div>
        </section>

        {relatedComparisons.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-950">
              {labels.relatedComparisonsTitle}
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {relatedComparisons.map((item) =>
                isExistingComparisonForLocale(locale, item.slug) ? (
                  <Link
                    key={item.slug}
                    href={createComparisonPath(locale, item.slug)}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                  >
                    <p className="text-xs font-semibold text-blue-700">
                      {formatCategoryLabel(locale, item.category)}
                    </p>
                    <h3 className="mt-2 font-bold leading-7 text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </Link>
                ) : (
                  <div
                    key={item.slug}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      {formatCategoryLabel(locale, item.category)}
                    </p>
                    <h3 className="mt-2 font-bold leading-7 text-slate-700">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
