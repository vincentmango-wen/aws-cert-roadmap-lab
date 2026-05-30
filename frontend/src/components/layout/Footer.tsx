import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

const footerLinks: FooterLink[] = [
  { label: "運営者情報", href: "/about" },
  { label: "問い合わせ", href: "/contact" },
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "免責事項", href: "/disclaimer" },
  { label: "GitHub", href: "/github" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-base font-bold text-white">
            AWS資格ロードマップラボ
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            AWS Cloud Practitioner / Solutions Architect Associate の学習内容を、
            用語・比較・問題・構成図で整理するポートフォリオ学習サイトです。
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">サイト情報</p>
          <nav className="mt-3 grid gap-2 text-sm text-slate-400">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-sky-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-800 px-6 py-4">
        <p className="mx-auto w-full max-w-6xl text-xs text-slate-500">
          © 2026 AWS資格ロードマップラボ. This site is an independent learning
          portfolio and is not affiliated with Amazon Web Services.
        </p>
      </div>
    </footer>
  );
}