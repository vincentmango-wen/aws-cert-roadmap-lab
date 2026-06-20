"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { Fredoka } from "next/font/google";
import { NotFoundIllustration } from "@/components/ui/NotFoundIllustration";

const fredoka = Fredoka({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

type Locale = "ja" | "en" | "zh";

type NotFoundLink = {
  href: string;
  label: string;
  description: string;
};

type NotFoundContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  balloonLine1: string;
  balloonLine2: string;
  svgAriaLabel: string;
  links: NotFoundLink[];
  nextStepTitle: string;
  nextStepDescription: string;
};

const notFoundContent: Record<Locale, NotFoundContent> = {
  ja: {
    eyebrow: "404 Not Found",
    title: "Coming Soon",
    subtitle: "このページは準備中です",
    description:
      "このページはまだ整備されていないか、URLが変更された可能性があります。下のリンクから学習を続けてください。",
    balloonLine1: "下のリンクから",
    balloonLine2: "学べるよ！",
    svgAriaLabel:
      "ロードマップの道の上にComing Soonのピンが立っており、雲のキャラクターが手を振っている",
    links: [
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
    ],
    nextStepTitle: "次はどこへ？",
    nextStepDescription:
      "用語集・模擬問題・ブログから学習を再開できます。迷ったらトップページへどうぞ。",
  },
  en: {
    eyebrow: "404 Not Found",
    title: "Coming Soon",
    subtitle: "This page is coming soon.",
    description:
      "This page is still being built, or the URL may have changed. Use the links below to keep learning.",
    balloonLine1: "Learn from the",
    balloonLine2: "links below!",
    svgAriaLabel:
      "A road map path with a Coming Soon pin, and a cloud character waving its hand.",
    links: [
      {
        href: "/en",
        label: "Back to home",
        description: "Restart from the English landing page.",
      },
      {
        href: "/en/about",
        label: "About this site",
        description: "Learn why this AWS learning site was built.",
      },
      {
        href: "/en/contact",
        label: "Contact",
        description: "Send feedback or report an issue.",
      },
      {
        href: "/en/disclaimer",
        label: "Disclaimer",
        description: "Review the notice for non-official learning content.",
      },
    ],
    nextStepTitle: "Where to next?",
    nextStepDescription:
      "Return to the home page to explore AWS terms, service comparisons, and exam-ready questions.",
  },
  zh: {
    eyebrow: "404 Not Found",
    title: "Coming Soon",
    subtitle: "此頁面準備中。",
    description:
      "此頁面尚未建置完成，或網址可能已更動。請從下方連結繼續學習。",
    balloonLine1: "從下方連結",
    balloonLine2: "開始學習！",
    svgAriaLabel:
      "一條路線圖小路上立著「準備中」的旗幟，旁邊有雲朵角色揮手。",
    links: [
      {
        href: "/zh",
        label: "返回首頁",
        description: "從繁體中文首頁重新開始學習。",
      },
      {
        href: "/zh/about",
        label: "關於本站",
        description: "了解這個 AWS 學習網站的製作背景。",
      },
      {
        href: "/zh/contact",
        label: "聯絡我們",
        description: "回報錯誤或提出建議。",
      },
      {
        href: "/zh/disclaimer",
        label: "免責聲明",
        description: "確認本站為非官方學習內容。",
      },
    ],
    nextStepTitle: "接下來去哪？",
    nextStepDescription:
      "回到首頁，可以繼續瀏覽 AWS 術語、服務比較與考試題目。",
  },
};

function detectLocale(pathname: string | null): Locale {
  if (pathname === null) {
    return "ja";
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "en";
  }

  if (pathname === "/zh" || pathname.startsWith("/zh/")) {
    return "zh";
  }

  return "ja";
}

export default function NotFound(): ReactElement {
  const pathname = usePathname();
  const locale = detectLocale(pathname);
  const content = notFoundContent[locale];

  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          {/* イラスト */}
          <NotFoundIllustration
            balloonLine1={content.balloonLine1}
            balloonLine2={content.balloonLine2}
          />

          {/* eyebrow */}
          <p className="mt-[-2px] text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {content.eyebrow}
          </p>

          {/* POP 表題 */}
          <h1
            className={`${fredoka.className} mt-3 text-5xl text-[#0284c7] sm:text-6xl`}
          >
            {content.title}
          </h1>

          {/* ロケール別副題 */}
          <p className="mt-2 text-lg font-semibold text-slate-800">
            {content.subtitle}
          </p>

          {/* 説明文 */}
          <p className="mt-4 text-base leading-7 text-slate-600">
            {content.description}
          </p>
        </div>

        {/* リンクカード */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {content.links.map((link) => (
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
            {content.nextStepTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {content.nextStepDescription}
          </p>
        </div>
      </section>
    </main>
  );
}
