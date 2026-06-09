import Link from "next/link";
import type { ReactElement } from "react";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: "学習コンテンツ",
    links: [
      { label: "AWS用語集", href: "/terms" },
      { label: "サービス比較", href: "/comparisons" },
      { label: "模擬問題", href: "/questions" },
      { label: "構成図", href: "/architectures" },
      { label: "ブログ", href: "/blog" },
      { label: "ロードマップ", href: "/roadmap" },
    ],
  },
  {
    title: "サイト情報",
    links: [
      { label: "運営者情報", href: "/about" },
      { label: "問い合わせ", href: "/contact" },
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "免責事項", href: "/disclaimer" },
    ],
  },
  {
    title: "ポートフォリオ",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/vincentmango-wen/aws-cert-roadmap-lab",
        external: true,
      },
      {
        label: "note",
        href: "https://note.com/fumi_ai_202507",
        external: true,
      },
      {
        label: "X",
        href: "https://x.com/fumikun_gengen",
        external: true,
      },
    ],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }): ReactElement {
  if (link.external === true) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-600 underline-offset-4 transition hover:text-slate-950 hover:underline"
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      className="text-sm text-slate-600 underline-offset-4 transition hover:text-slate-950 hover:underline"
    >
      {link.label}
    </Link>
  );
}

export function Footer(): ReactElement {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex text-base font-bold !text-slate-950 underline-offset-4 hover:underline"
            >
              AWS資格ロードマップラボ
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              AWS Cloud Practitioner / Solutions Architect Associate の学習内容を、用語・比較・問題・構成図で整理する学習サイトです。
            </p>
          </div>

          {footerSections.map((section) => (
            <section key={section.title} aria-labelledby={`footer-${section.title}`}>
              <h2 id={`footer-${section.title}`} className="text-sm font-semibold text-slate-950">
                {section.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.href}`}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs leading-6 text-slate-500">
            © 2026 AWS資格ロードマップラボ. This site is an independent learning project and is not affiliated with Amazon Web Services.
          </p>
        </div>
      </div>
    </footer>
  );
}