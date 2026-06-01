import Link from "next/link";
import type { ReactElement } from "react";

const primaryLinks = [
  {
    href: "/",
    label: "トップへ戻る",
    description: "サイトの入口から学習を再開する",
  },
  {
    href: "/terms",
    label: "用語集を見る",
    description: "AWS主要サービスの概要を確認する",
  },
  {
    href: "/questions",
    label: "模擬問題を解く",
    description: "Cloud Practitioner向けの問題演習に進む",
  },
  {
    href: "/blog",
    label: "ブログを見る",
    description: "AWS学習記事から読み直す",
  },
];

export default function NotFound(): ReactElement {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            404 Not Found
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            ページが見つかりません
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            URLが変更されたか、ページが削除された可能性があります。
            下のリンクから、AWS資格ロードマップラボの主要コンテンツへ戻れます。
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
            >
              <span className="text-base font-semibold text-slate-950 group-hover:text-blue-700">
                {link.label}
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                {link.description}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-blue-50 p-5">
          <h2 className="text-base font-semibold text-slate-950">
            学習を続けるなら
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            AWSサービスの違いで迷った場合は用語集、試験対策を進めたい場合は模擬問題、
            学習の全体像を確認したい場合はトップページから再開してください。
          </p>
        </div>
      </section>
    </main>
  );
}