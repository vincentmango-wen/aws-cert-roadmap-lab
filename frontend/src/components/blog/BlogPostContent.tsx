import { Fragment, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import { createLocalizedPath } from "@/i18n/locales";
import type { BlogPost, BlogDetailLabels } from "@/app/(site)/blog/blog-detail-data";

type BlogPostContentProps = {
  locale: Locale;
  post: BlogPost;
  labels: BlogDetailLabels;
};

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
        <strong
          key={`inline-${matchIndex}`}
          className="font-bold text-slate-950"
        >
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

function MarkdownContent({ content }: { content: string }): ReactElement {
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
                <li
                  key={`ul-${blockIndex}-${lineIndex}`}
                  className="leading-7"
                >
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
                <li
                  key={`ol-${blockIndex}-${lineIndex}`}
                  className="leading-7"
                >
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

export function BlogPostContent({
  locale,
  post,
  labels,
}: BlogPostContentProps): ReactElement {
  const blogListPath = createLocalizedPath(locale, "/blog");
  const homePath = createLocalizedPath(locale, "/");
  const termsPath = createLocalizedPath(locale, "/terms");
  const questionsPath = createLocalizedPath(locale, "/questions");

  return (
    <main className="bg-slate-50">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="text-sm text-slate-500"
          aria-label={labels.breadcrumbAriaLabel}
        >
          <Link href={homePath} className="hover:text-slate-900">
            {labels.homeLabel}
          </Link>
          <span className="mx-2">/</span>
          <Link href={blogListPath} className="hover:text-slate-900">
            {labels.blogLabel}
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
            <span>
              {labels.publishedAtLabel}：
              {post.publishedAt || labels.unsetLabel}
            </span>
            <span>/</span>
            <span>
              {labels.updatedAtLabel}：
              {post.updatedAt || labels.unsetLabel}
            </span>
            <span>/</span>
            <span>
              {labels.authorLabel}：{post.author}
            </span>
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
          <h2 className="text-xl font-bold">{labels.nextSectionTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {labels.nextSectionDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={blogListPath}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              {labels.backToListLabel}
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
        </section>
      </article>
    </main>
  );
}
