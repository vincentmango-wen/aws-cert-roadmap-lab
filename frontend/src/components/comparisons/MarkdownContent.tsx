/**
 * MarkdownContent.tsx
 *
 * comparisons 詳細ページ用の軽量 Markdown / MDX renderer.
 * 旧 frontend/src/app/(site)/comparisons/[comparisonSlug]/page.tsx 内の同名コンポーネントから
 * ロジック変更なしで切り出した (P5-034 で 3 ルートから共通利用するため).
 */
import { Fragment, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import { resolveInternalLink } from "@/lib/comparisonInternalLinks";
import type { ComparisonLocale } from "@/types/comparison";

function renderInline(text: string, locale: ComparisonLocale): ReactNode[] {
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
      const resolved = resolveInternalLink(locale, linkHref);

      if (resolved.isExternal) {
        nodes.push(
          <a
            key={`inline-${matchIndex}`}
            href={resolved.href}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
          >
            {linkText}
          </a>,
        );
      } else {
        nodes.push(
          <Link
            key={`inline-${matchIndex}`}
            href={resolved.href}
            className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
          >
            {linkText}
          </Link>,
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

function renderTable(
  block: string,
  blockIndex: number,
  locale: ComparisonLocale,
): ReactElement {
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
                {renderInline(cell, locale)}
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
                  {renderInline(cell, locale)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MarkdownContent({
  content,
  locale,
}: {
  content: string;
  locale: ComparisonLocale;
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
                {renderInline(headingText, locale)}
              </h2>
            );
          }

          if (headingLevel === 3) {
            return (
              <h3
                key={`heading-${blockIndex}`}
                className="text-xl font-bold text-slate-900"
              >
                {renderInline(headingText, locale)}
              </h3>
            );
          }

          return (
            <h4
              key={`heading-${blockIndex}`}
              className="text-lg font-bold text-slate-900"
            >
              {renderInline(headingText, locale)}
            </h4>
          );
        }

        const isTable =
          lines.length >= 2 &&
          lines[0].startsWith("|") &&
          lines[1].includes("---");

        if (isTable) {
          return renderTable(block, blockIndex, locale);
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
                  {renderInline(line.replace(/^- /, ""), locale)}
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
                  {renderInline(line.replace(/^\d+\.\s+/, ""), locale)}
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
                {renderInline(line, locale)}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
