import fs from "fs";
import path from "path";
import { Fragment, type ReactElement, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

type BlogPostPageProps = {
  params: Promise<{
    postSlug: string;
  }>;
};

type BlogPostStaticParams = {
  postSlug: string;
};

type FrontmatterValue = string | boolean | string[];

type BlogPost = {
  postId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  targetKeywords: string[];
  author: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  content: string;
};

function getBlogDirectory(): string | null {
  const candidates = [
    path.join(process.cwd(), "contents", "blog"),
    path.join(process.cwd(), "src", "contents", "blog"),
    path.join(process.cwd(), "frontend", "contents", "blog"),
    path.join(process.cwd(), "frontend", "src", "contents", "blog"),
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

function parseBlogPostFile(filePath: string): BlogPost {
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
    postId: getString(frontmatter.postId, slug),
    slug,
    title,
    description: getString(
      frontmatter.description,
      "AWS資格学習に関する記事です。",
    ),
    category: getString(frontmatter.category, "AWS"),
    tags: getStringArray(frontmatter.tags),
    targetKeywords: getStringArray(frontmatter.targetKeywords),
    author: getString(frontmatter.author, "AWS資格ロードマップラボ"),
    published: getBoolean(frontmatter.published, true),
    publishedAt: getString(frontmatter.publishedAt, ""),
    updatedAt: getString(frontmatter.updatedAt, ""),
    content,
  };
}

function getAllBlogPosts(): BlogPost[] {
  const blogDirectory = getBlogDirectory();

  if (!blogDirectory) {
    return [];
  }

  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => parseBlogPostFile(path.join(blogDirectory, fileName)))
    .sort((firstPost, secondPost) =>
      secondPost.publishedAt.localeCompare(firstPost.publishedAt),
    );
}

function getPublishedBlogPosts(): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.published);
}

function getBlogPostBySlug(slug: string): BlogPost | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const post = getPublishedBlogPosts().find(
    (blogPost) => blogPost.slug === slug,
  );

  return post ?? null;
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

export function generateStaticParams(): BlogPostStaticParams[] {
  return getPublishedBlogPosts().map((post) => ({
    postSlug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const post = getBlogPostBySlug(postSlug);

  if (!post) {
    return createPageMetadata({
      title: "記事が見つかりません",
      description: "指定されたブログ記事は見つかりませんでした。",
      path: `/blog/${postSlug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: ["AWS", "AWS資格", "AWSブログ", ...post.targetKeywords],
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps): Promise<ReactElement> {
  const { postSlug } = await params;
  const post = getBlogPostBySlug(postSlug);

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
            <span>公開日：{post.publishedAt || "未設定"}</span>
            <span>/</span>
            <span>更新日：{post.updatedAt || "未設定"}</span>
            <span>/</span>
            <span>著者：{post.author}</span>
          </div>

          {post.tags.length > 0 ? (
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
          ) : null}
        </header>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <MarkdownContent content={post.content} />
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