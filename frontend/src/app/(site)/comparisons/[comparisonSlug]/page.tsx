import fs from "fs";
import path from "path";
import { Fragment, type ReactElement, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { isExistingTerm } from "@/lib/termGuards";

export const dynamic = "force-static";
export const dynamicParams = false;

type ComparisonPageProps = {
  params: Promise<{
    comparisonSlug: string;
  }>;
};

type ComparisonStaticParams = {
  comparisonSlug: string;
};

type FrontmatterValue = string | boolean | string[];

type ComparisonArticle = {
  comparisonId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  examScopes: string[];
  services: string[];
  tags: string[];
  priority: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  content: string;
};

function getComparisonsDirectory(): string | null {
  const candidates = [
    path.join(process.cwd(), "contents", "comparisons"),
    path.join(process.cwd(), "src", "contents", "comparisons"),
    path.join(process.cwd(), "frontend", "contents", "comparisons"),
    path.join(process.cwd(), "frontend", "src", "contents", "comparisons"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseFrontmatterValue(value: string): FrontmatterValue {
  const trimmed = value.trim();

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();

    if (!inner) {
      return [];
    }

    return inner
      .split(",")
      .map((item) => stripQuotes(item))
      .filter((item) => item.length > 0);
  }

  return stripQuotes(trimmed);
}

function parseFrontmatter(
  frontmatterText: string,
): Record<string, FrontmatterValue> {
  const parsed: Record<string, FrontmatterValue> = {};
  const lines = frontmatterText.split(/\r?\n/);

  let currentListKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const listItemMatch = line.match(/^\s*-\s+(.+)$/);

    if (listItemMatch && currentListKey) {
      const currentValue = parsed[currentListKey];
      const nextValue = stripQuotes(listItemMatch[1]);

      if (Array.isArray(currentValue)) {
        currentValue.push(nextValue);
      } else {
        parsed[currentListKey] = [nextValue];
      }

      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyValueMatch) {
      continue;
    }

    const key = keyValueMatch[1];
    const rawValue = keyValueMatch[2];

    if (rawValue.trim() === "") {
      parsed[key] = [];
      currentListKey = key;
      continue;
    }

    parsed[key] = parseFrontmatterValue(rawValue);
    currentListKey = null;
  }

  return parsed;
}

function getString(
  value: FrontmatterValue | undefined,
  fallbackValue: string,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  return fallbackValue;
}

function getBoolean(
  value: FrontmatterValue | undefined,
  fallbackValue: boolean,
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return fallbackValue;
}

function getStringArray(value: FrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => item.length > 0);
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return [];
}

function removeLeadingH1(content: string, title: string): string {
  const lines = content.split(/\r?\n/);
  const firstContentLineIndex = lines.findIndex(
    (line) => line.trim().length > 0,
  );

  if (firstContentLineIndex === -1) {
    return content;
  }

  const firstLine = lines[firstContentLineIndex].trim();
  const h1Match = firstLine.match(/^#\s+(.+)$/);

  if (!h1Match) {
    return content;
  }

  const h1Text = h1Match[1].trim();

  if (h1Text === title || h1Text.length > 0) {
    lines.splice(firstContentLineIndex, 1);
  }

  return lines.join("\n").trim();
}

function parseComparisonFile(filePath: string): ComparisonArticle {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const fallbackSlug = path.basename(filePath, ".mdx");

  const frontmatterMatch = rawFile.match(
    /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/,
  );

  const frontmatterText = frontmatterMatch?.[1] ?? "";
  const rawContent = frontmatterMatch?.[2]?.trim() ?? rawFile.trim();
  const frontmatter = parseFrontmatter(frontmatterText);

  const slug = getString(frontmatter.slug, fallbackSlug);
  const title = getString(frontmatter.title, slug);
  const content = removeLeadingH1(rawContent, title);

  return {
    comparisonId: getString(frontmatter.comparisonId, slug),
    slug,
    title,
    description: getString(
      frontmatter.description,
      "AWSサービスの違いを比較する記事です。",
    ),
    category: getString(frontmatter.category, "AWS"),
    level: getString(frontmatter.level, "beginner"),
    examScopes: getStringArray(frontmatter.examScopes),
    services: getStringArray(frontmatter.services),
    tags: getStringArray(frontmatter.tags),
    priority: getString(frontmatter.priority, "medium"),
    published: getBoolean(frontmatter.published, true),
    publishedAt: getString(frontmatter.publishedAt, ""),
    updatedAt: getString(frontmatter.updatedAt, ""),
    content,
  };
}

function getAllComparisons(): ComparisonArticle[] {
  const comparisonsDirectory = getComparisonsDirectory();

  if (!comparisonsDirectory) {
    return [];
  }

  return fs
    .readdirSync(comparisonsDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) =>
      parseComparisonFile(path.join(comparisonsDirectory, fileName)),
    )
    .sort((firstComparison, secondComparison) =>
      firstComparison.title.localeCompare(secondComparison.title, "ja"),
    );
}

function getPublishedComparisons(): ComparisonArticle[] {
  return getAllComparisons().filter((comparison) => comparison.published);
}

function getComparisonBySlug(slug: string): ComparisonArticle | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const comparison = getPublishedComparisons().find(
    (item) => item.slug === slug,
  );

  return comparison ?? null;
}

function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
  };

  return labels[level] ?? level;
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    high: "優先度 高",
    medium: "優先度 中",
    low: "優先度 低",
  };

  return labels[priority] ?? priority;
}

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
  };

  return serviceNameMap[service] ?? service.toUpperCase();
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g;

  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const matchStart = match.index ?? 0;

    if (matchStart > lastIndex) {
      nodes.push(text.slice(lastIndex, matchStart));
    }

    const fullMatch = match[0];
    const linkText = match[2];
    const linkHref = match[3];
    const inlineCode = match[4];
    const boldText = match[5];

    if (linkText && linkHref) {
      if (linkHref.startsWith("/")) {
        nodes.push(
          <Link
            key={`inline-${matchIndex}`}
            href={linkHref}
            className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
          >
            {linkText}
          </Link>,
        );
      } else {
        nodes.push(
          <a
            key={`inline-${matchIndex}`}
            href={linkHref}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
          >
            {linkText}
          </a>,
        );
      }
    } else if (inlineCode) {
      nodes.push(
        <code
          key={`inline-${matchIndex}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-900"
        >
          {inlineCode}
        </code>,
      );
    } else if (boldText) {
      nodes.push(
        <strong key={`inline-${matchIndex}`} className="font-bold text-slate-950">
          {boldText}
        </strong>,
      );
    } else {
      nodes.push(fullMatch);
    }

    lastIndex = matchStart + fullMatch.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderTable(block: string, blockIndex: number): ReactElement {
  const rows = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  const headerCells = rows[0]
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());

  const bodyRows = rows.slice(2).map((row) =>
    row
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim()),
  );

  return (
    <div key={`table-${blockIndex}`} className="my-8 overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {headerCells.map((cell, cellIndex) => (
              <th
                key={`header-${cellIndex}`}
                className="border border-slate-200 bg-slate-100 px-4 py-3 font-semibold text-slate-900"
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="border border-slate-200 px-4 py-3 text-slate-700"
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarkdownContent({
  content,
}: {
  content: string;
}): ReactElement {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  return (
    <div className="space-y-7">
      {blocks.map((block, blockIndex) => {
        const lines = block.split(/\r?\n/).map((line) => line.trim());

        if (block.startsWith("```")) {
          const code = block
            .replace(/^```[A-Za-z0-9_-]*\r?\n?/, "")
            .replace(/\r?\n?```$/, "");

          return (
            <pre
              key={`code-${blockIndex}`}
              className="overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100"
            >
              <code>{code}</code>
            </pre>
          );
        }

        const headingMatch = block.match(/^(#{1,4})\s+(.+)$/);

        if (headingMatch && lines.length === 1) {
          const headingLevel = headingMatch[1].length;
          const headingText = headingMatch[2].trim();

          if (headingLevel <= 2) {
            return (
              <h2
                key={`heading-${blockIndex}`}
                className="border-b border-slate-200 pb-3 text-2xl font-bold text-slate-950"
              >
                {renderInline(headingText)}
              </h2>
            );
          }

          if (headingLevel === 3) {
            return (
              <h3
                key={`heading-${blockIndex}`}
                className="text-xl font-bold text-slate-900"
              >
                {renderInline(headingText)}
              </h3>
            );
          }

          return (
            <h4
              key={`heading-${blockIndex}`}
              className="text-lg font-bold text-slate-900"
            >
              {renderInline(headingText)}
            </h4>
          );
        }

        const isTable =
          lines.length >= 2 &&
          lines[0].startsWith("|") &&
          lines[1].includes("---");

        if (isTable) {
          return renderTable(block, blockIndex);
        }

        const isUnorderedList = lines.every((line) => line.startsWith("- "));

        if (isUnorderedList) {
          return (
            <ul
              key={`ul-${blockIndex}`}
              className="list-disc space-y-2 pl-6 text-slate-700"
            >
              {lines.map((line, lineIndex) => (
                <li key={`ul-${blockIndex}-${lineIndex}`} className="leading-7">
                  {renderInline(line.replace(/^- /, ""))}
                </li>
              ))}
            </ul>
          );
        }

        const isOrderedList = lines.every((line) => /^\d+\.\s+/.test(line));

        if (isOrderedList) {
          return (
            <ol
              key={`ol-${blockIndex}`}
              className="list-decimal space-y-2 pl-6 text-slate-700"
            >
              {lines.map((line, lineIndex) => (
                <li key={`ol-${blockIndex}-${lineIndex}`} className="leading-7">
                  {renderInline(line.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p
            key={`paragraph-${blockIndex}`}
            className="leading-8 text-slate-700"
          >
            {lines.map((line, lineIndex) => (
              <Fragment key={`line-${blockIndex}-${lineIndex}`}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function generateStaticParams(): ComparisonStaticParams[] {
  return getPublishedComparisons().map((comparison) => ({
    comparisonSlug: comparison.slug,
  }));
}

export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { comparisonSlug } = await params;
  const comparison = getComparisonBySlug(comparisonSlug);

  if (!comparison) {
    return createPageMetadata({
      title: "比較記事が見つかりません",
      description: "指定されたAWSサービス比較記事は見つかりませんでした。",
      path: `/comparisons/${comparisonSlug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: comparison.title,
    description: comparison.description,
    path: `/comparisons/${comparison.slug}`,
    keywords: [
      "AWS",
      "AWS比較",
      "AWSサービス",
      ...comparison.services,
      ...comparison.tags,
    ],
    type: "article",
    publishedTime: comparison.publishedAt,
    modifiedTime: comparison.updatedAt,
  });
}

export default async function ComparisonDetailPage({
  params,
}: ComparisonPageProps): Promise<ReactElement> {
  const { comparisonSlug } = await params;
  const comparison = getComparisonBySlug(comparisonSlug);

  if (!comparison) {
    notFound();
  }

  const relatedComparisons = getPublishedComparisons()
    .filter((item) => item.slug !== comparison.slug)
    .filter(
      (item) =>
        item.category === comparison.category ||
        item.services.some((service) => comparison.services.includes(service)),
    )
    .slice(0, 3);

  return (
    <main className="bg-slate-50">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="text-sm text-slate-500" aria-label="パンくず">
          <Link href="/" className="hover:text-slate-900">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link href="/comparisons" className="hover:text-slate-900">
            比較
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-900">
            {comparison.title}
          </span>
        </nav>

        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {comparison.category}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {getLevelLabel(comparison.level)}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {getPriorityLabel(comparison.priority)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {comparison.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {comparison.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>公開日：{comparison.publishedAt || "未設定"}</span>
            <span>/</span>
            <span>更新日：{comparison.updatedAt || "未設定"}</span>
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
              比較対象サービス
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              サービス名をクリックすると、用語詳細ページで復習できます。
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {comparison.services.map((service) =>
                isExistingTerm(service) ? (
                  <Link
                    key={service}
                    href={`/terms/${service}`}
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
          <MarkdownContent content={comparison.content} />
        </section>

        <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-white">
          <h2 className="text-xl font-bold">次に学ぶ内容</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            比較で違いを理解したら、関連用語と模擬問題で知識を確認してください。
            資格試験では「似ているサービスの使い分け」が問われます。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/comparisons"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              比較一覧へ戻る
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

        {relatedComparisons.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-950">関連比較</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {relatedComparisons.map((item) => (
                <Link
                  key={item.slug}
                  href={`/comparisons/${item.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                  <p className="text-xs font-semibold text-blue-700">
                    {item.category}
                  </p>
                  <h3 className="mt-2 font-bold leading-7 text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}