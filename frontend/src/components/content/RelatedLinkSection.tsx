import Link from 'next/link';
import type { InternalLinkItem, InternalLinkSection } from '@/types/internalLinks';

type RelatedLinksSectionProps = {
  sections: InternalLinkSection[];
  className?: string;
};

function getTypeLabel(type: InternalLinkItem['type']): string {
  switch (type) {
    case 'term':
      return '用語';
    case 'comparison':
      return '比較';
    case 'question':
      return '問題';
    case 'architecture':
      return '構成図';
    case 'blog':
      return '記事';
    case 'roadmap':
      return 'ロードマップ';
    case 'external':
      return '外部';
    default:
      return '関連';
  }
}

export function RelatedLinksSection({
  sections,
  className = '',
}: RelatedLinksSectionProps) {
  const visibleSections = sections.filter((section) => section.links.length > 0);

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <section
      className={`mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
      aria-labelledby="related-links-heading"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold text-blue-700">次に学ぶ</p>
        <h2
          id="related-links-heading"
          className="mt-1 text-2xl font-bold tracking-tight text-slate-900"
        >
          関連コンテンツ
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          このページで学んだ内容を、用語・比較・問題・構成図につなげて確認できます。
        </p>
      </div>

      <div className="space-y-6">
        {visibleSections.map((section) => (
          <div key={section.title}>
            <div className="mb-3">
              <h3 className="text-base font-bold text-slate-900">{section.title}</h3>
              {section.description ? (
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {section.description}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {section.links.map((link) => (
                <Link
                  key={`${section.title}-${link.href}`}
                  href={link.href}
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                        {getTypeLabel(link.type)}
                      </span>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-900 group-hover:text-blue-700">
                        {link.label}
                      </p>
                      {link.description ? (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {link.description}
                        </p>
                      ) : null}
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}