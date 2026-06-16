"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

type Locale = "ja" | "en" | "zh";

type NotFoundLink = {
  href: string;
  label: string;
  description: string;
};

type NotFoundContent = {
  eyebrow: string;
  title: string;
  description: string;
  links: NotFoundLink[];
  nextStepTitle: string;
  nextStepDescription: string;
};

const notFoundContent: Record<Locale, NotFoundContent> = {
  ja: {
    eyebrow: "404 Not Found",
    title: "ページが見つかりません",
    description:
      "URLが変更されたか、ページが削除された可能性があります。下のリンクから、AWS資格ロードマップラボの主要コンテンツへ戻れます。",
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
    nextStepTitle: "学習を続けるなら",
    nextStepDescription:
      "AWSサービスの違いで迷った場合は用語集、試験対策を進めたい場合は模擬問題、学習の全体像を確認したい場合はトップページから再開してください。",
  },
  en: {
    eyebrow: "404 Not Found",
    title: "Page not found",
    description:
      "The page may have moved, been deleted, or the URL may be incorrect. Use the links below to return to the main AWS Cert Roadmap Lab pages.",
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
        description: "Send feedback, report an issue, or contact the site owner.",
      },
      {
        href: "/en/disclaimer",
        label: "Disclaimer",
        description: "Review the notice for non-official learning content.",
      },
    ],
    nextStepTitle: "Continue learning",
    nextStepDescription:
      "If you are not sure where to go next, return to the home page first. From there, you can explore AWS terms, service comparisons, architecture diagrams, and exam-focused learning content.",
  },
  zh: {
    eyebrow: "404 Not Found",
    title: "找不到頁面",
    description:
      "此頁面可能已移動、刪除，或網址輸入有誤。你可以從下方連結回到 AWS Cert Roadmap Lab 的主要頁面。",
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
        description: "回報錯誤、提出建議或聯絡站長。",
      },
      {
        href: "/zh/disclaimer",
        label: "免責聲明",
        description: "確認本站為非官方學習內容。",
      },
    ],
    nextStepTitle: "繼續學習",
    nextStepDescription:
      "如果你不確定下一步要去哪裡，請先返回首頁。你可以從首頁進入 AWS 術語、服務比較、架構圖與考試學習內容。",
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
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {content.eyebrow}
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {content.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {content.links.map((link) => (
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