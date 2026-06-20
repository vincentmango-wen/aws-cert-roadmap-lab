import type { Metadata } from "next";
import termsData from "../../../../../contents/terms/terms.json";
import { createPageMetadata } from "@/lib/seo";
import { isExistingComparison, isExistingArchitecture } from "@/lib/termGuards";
import { filterValidOfficialDocs } from "@/lib/official-doc";
import { formatSlugLabel } from "@/lib/format-slug-label";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { OfficialDoc } from "@/types/official-doc";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { termId } = await params;
  const term = getTermById(termId);

  if (!term) {
    return createPageMetadata({
      title: "AWS用語が見つかりません",
      description:
        "指定されたAWS用語は見つかりませんでした。AWS用語集から主要サービスを確認できます。",
      path: `/terms/${termId}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${term.name}とは？`,
    description:
      term.oneLine ??
      term.summary ??
      `${term.name}の概要、用途、Cloud Practitioner / SAAの試験ポイントを初学者向けに解説します。`,
    path: `/terms/${term.termId}`,
    keywords: [
      term.name,
      term.shortName,
      term.category,
      "AWS",
      "Cloud Practitioner",
      "SAA",
    ],
    modifiedTime: term.updatedAt,
  });
}

const terms = termsData as unknown as AwsTerm[];

type TermStaticParams = {
  termId: string;
};

export function generateStaticParams(): TermStaticParams[] {
  return terms.map((term) => ({
    termId: term.termId,
  }));
}


type TermCategory =
  | "Compute"
  | "Storage"
  | "Database"
  | "Networking"
  | "Security"
  | "Monitoring"
  | "Integration"
  | "Analytics"
  | "Management";

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

type ExamScope = "CLF-C02" | "SAA-C03";

type AwsTerm = {
  termId: string;
  name: string;
  shortName: string;
  category: TermCategory;
  level: DifficultyLevel;
  examScopes: ExamScope[];
  summary: string;
  oneLine: string;
  useCases: string[];
  examPoints: string[];
  saaPoints?: string[];
  /** 客観的な実務での使いどころ・よくある誤解を記述する枠（体験談・一人称感想は入れない）。\n\n 区切りで複数段落。 */
  practicalNote?: string;
  /** 公式ドキュメントへの外部リンク配列。空または未定義の場合はセクション非表示。 */
  officialDocs?: OfficialDoc[];
  relatedServices?: string[];
  comparisonSlugs?: string[];
  architectureSlugs?: string[];
  tags?: string[];
  costNotes?: string[];
  securityNotes?: string[];
  updatedAt: string;
};

type PageProps = {
  params: Promise<{
    termId: string;
  }>;
};



const levelLabels: Record<DifficultyLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const categoryLabels: Record<TermCategory, string> = {
  Compute: "コンピューティング",
  Storage: "ストレージ",
  Database: "データベース",
  Networking: "ネットワーク",
  Security: "セキュリティ",
  Monitoring: "監視・ログ",
  Integration: "アプリケーション統合",
  Analytics: "分析",
  Management: "管理",
};

function getTermById(termId: string): AwsTerm | undefined {
  return terms.find((term) => term.termId === termId);
}

function getRelatedTerms(termIds: string[] | undefined): AwsTerm[] {
  if (!termIds || termIds.length === 0) {
    return [];
  }

  return termIds
    .map((termId) => getTermById(termId))
    .filter((term): term is AwsTerm => term !== undefined);
}

function getAdjacentTerms(currentTermId: string): {
  previousTerm: AwsTerm | undefined;
  nextTerm: AwsTerm | undefined;
} {
  const currentIndex = terms.findIndex((term) => term.termId === currentTermId);

  if (currentIndex === -1) {
    return {
      previousTerm: undefined,
      nextTerm: undefined,
    };
  }

  return {
    previousTerm: terms[currentIndex - 1],
    nextTerm: terms[currentIndex + 1],
  };
}

function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "blue" | "green" | "orange";
}) {
  const variantClassName: Record<"default" | "blue" | "green" | "orange", string> = {
    default: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${variantClassName[variant]}`}
    >
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 text-slate-700">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyMessage({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
      {children}
    </p>
  );
}

export const dynamicParams = false;

export default async function TermDetailPage({ params }: PageProps) {
  const { termId } = await params;
  const term = getTermById(termId);

  if (!term) {
    notFound();
  }

  const relatedTerms = getRelatedTerms(term.relatedServices);
  const { previousTerm, nextTerm } = getAdjacentTerms(term.termId);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate-500" aria-label="パンくず">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue-700">
              ホーム
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/terms" className="hover:text-blue-700">
              用語集
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-800">{term.name}</li>
        </ol>
      </nav>

      <header className="mt-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap gap-2">
          <Badge variant="blue">{term.category}</Badge>
          <Badge variant="green">{categoryLabels[term.category]}</Badge>
          <Badge variant="orange">{levelLabels[term.level]}</Badge>
          {term.examScopes.map((examScope) => (
            <Badge key={examScope}>{examScope}</Badge>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            {term.shortName}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {term.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {term.oneLine}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/terms"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
          >
            用語一覧に戻る
          </Link>
          <Link
            href="/questions"
            className="rounded-2xl bg-blue-700 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            関連する模擬問題へ進む
          </Link>
        </div>
      </header>

      <main className="mt-10 grid gap-6">
        <Section title="一言でいうと">
          <p className="text-lg leading-8">{term.oneLine}</p>
        </Section>

        <Section title="概要">
          <p className="whitespace-pre-line leading-8">{term.summary}</p>
        </Section>

        <Section title="主な用途">
          <BulletList items={term.useCases} />
        </Section>

        <Section title="CLF-C02 試験ポイント">
          <BulletList items={term.examPoints} />
        </Section>

        <Section title="SAA-C03 試験ポイント">
          {term.saaPoints && term.saaPoints.length > 0 ? (
            <BulletList items={term.saaPoints} />
          ) : (
            <EmptyMessage>
              この用語には、まだSAA-C03向けポイントが登録されていません。
            </EmptyMessage>
          )}
        </Section>

        {/* 実際の使いどころ: 客観的な実務文脈・よくある誤解の枠（体験談・一人称感想は入れない）。
            practicalNote が存在する用語のみ表示。存在しない場合はセクションごと非表示。 */}
        {term.practicalNote ? (
          <Section title="実際の使いどころ">
            <p className="whitespace-pre-line leading-8">{term.practicalNote}</p>
          </Section>
        ) : null}

        {/* 公式ドキュメント: officialDocs が存在かつ allowlist を通過した件が1件以上の場合のみ表示。 */}
        {(() => {
          const validDocs = filterValidOfficialDocs(term.officialDocs);
          return validDocs.length > 0 ? (
            <Section title="公式ドキュメント">
              <ul className="space-y-2">
                {validDocs.map((doc) => (
                  <li key={doc.url}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-700 underline hover:text-blue-900"
                    >
                      {doc.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null;
        })()}

        <section className="grid gap-6 lg:grid-cols-2">
          <Section title="コスト注意点">
            {term.costNotes && term.costNotes.length > 0 ? (
              <BulletList items={term.costNotes} />
            ) : (
              <EmptyMessage>
                この用語には、まだコスト注意点が登録されていません。
              </EmptyMessage>
            )}
          </Section>

          <Section title="セキュリティ注意点">
            {term.securityNotes && term.securityNotes.length > 0 ? (
              <BulletList items={term.securityNotes} />
            ) : (
              <EmptyMessage>
                この用語には、まだセキュリティ注意点が登録されていません。
              </EmptyMessage>
            )}
          </Section>
        </section>

        <Section title="関連サービス">
          {relatedTerms.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedTerms.map((relatedTerm) => (
                <Link
                  key={relatedTerm.termId}
                  href={`/terms/${relatedTerm.termId}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="font-bold text-slate-950">{relatedTerm.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {relatedTerm.oneLine}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyMessage>
              この用語には、まだ関連サービスが登録されていません。
            </EmptyMessage>
          )}
        </Section>

        <section className="grid gap-6 lg:grid-cols-2">
          {/* 関連比較記事: 実在する slug のみ表示。1件もなければ EmptyMessage */}
          <Section title="関連する比較記事">
            {(() => {
              const existingSlugs = term.comparisonSlugs?.filter(isExistingComparison) ?? [];
              return existingSlugs.length > 0 ? (
                <div className="space-y-3">
                  {existingSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/comparisons/${slug}`}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {formatSlugLabel(slug)}
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyMessage>
                  この用語には、まだ関連比較記事が登録されていません。
                </EmptyMessage>
              );
            })()}
          </Section>

          {/* 関連構成図: 実在する slug のみ表示。1件もなければ EmptyMessage */}
          <Section title="関連する構成図">
            {(() => {
              const existingSlugs = term.architectureSlugs?.filter(isExistingArchitecture) ?? [];
              return existingSlugs.length > 0 ? (
                <div className="space-y-3">
                  {existingSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/architectures/${slug}`}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {formatSlugLabel(slug)}
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyMessage>
                  この用語には、まだ関連構成図が登録されていません。
                </EmptyMessage>
              );
            })()}
          </Section>
        </section>

        <Section title="タグ">
          {term.tags && term.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {term.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : (
            <EmptyMessage>
              この用語には、まだタグが登録されていません。
            </EmptyMessage>
          )}

          <p className="mt-6 text-sm text-slate-500">
            最終更新日：{term.updatedAt}
          </p>
        </Section>

        <nav
          className="grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2"
          aria-label="前後の用語"
        >
          {previousTerm ? (
            <Link
              href={`/terms/${previousTerm.termId}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            >
              <p className="text-sm text-slate-500">前の用語</p>
              <p className="mt-1 font-bold">{previousTerm.name}</p>
            </Link>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500">
              前の用語はありません。
            </div>
          )}

          {nextTerm ? (
            <Link
              href={`/terms/${nextTerm.termId}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            >
              <p className="text-sm text-slate-500">次の用語</p>
              <p className="mt-1 font-bold">{nextTerm.name}</p>
            </Link>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-right text-sm text-slate-500">
              次の用語はありません。
            </div>
          )}
        </nav>
      </main>
    </div>
  );
}