import Link from "next/link";
import type { ReactElement } from "react";
import { Fredoka } from "next/font/google";
import { NotFoundIllustration } from "@/components/ui/NotFoundIllustration";

const fredoka = Fredoka({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

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
          {/* イラスト */}
          <NotFoundIllustration
            balloonLine1="下のリンクから"
            balloonLine2="学べるよ！"
          />

          {/* eyebrow — マスコット底と水平を合わせる */}
          <p className="mt-[-2px] text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            404 Not Found
          </p>

          {/* POP 表題 */}
          <h1
            className={`${fredoka.className} mt-3 text-5xl text-[#0284c7] sm:text-6xl`}
          >
            Coming Soon
          </h1>

          {/* JA 副題 */}
          <p className="mt-2 text-lg font-semibold text-slate-800">
            このページは準備中です
          </p>

          {/* 説明文 */}
          <p className="mt-4 text-base leading-7 text-slate-600">
            URLが変更されたか、まだ整備されていないページです。下のリンクから学習を続けてください。
          </p>
        </div>

        {/* リンクカード */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <span className="text-base font-semibold text-slate-950 group-hover:text-sky-700">
                {link.label}
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                {link.description}
              </span>
            </Link>
          ))}
        </div>

        {/* 次の学習へバナー */}
        <div className="mt-10 rounded-2xl bg-sky-50 p-5">
          <h2 className="text-base font-semibold text-slate-950">
            次はどこへ？
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            用語集・模擬問題・ブログから学習を再開できます。迷ったらトップページへどうぞ。
          </p>
        </div>
      </section>
    </main>
  );
}
