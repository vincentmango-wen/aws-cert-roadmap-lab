"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactElement } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import {
  createLocalizedPath,
  getLocaleFromPathname,
  removeLocalePrefix,
} from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";

type NavItem = {
  label: Record<Locale, string>;
  href: string;
};

type HeaderText = {
  skipLink: string;
  siteName: string;
  tagline: string;
  homeAriaLabel: string;
  mainNavigationAriaLabel: string;
  mobileNavigationAriaLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
};

const headerText: Record<Locale, HeaderText> = {
  ja: {
    skipLink: "メインコンテンツへ移動",
    siteName: "AWS資格ロードマップラボ",
    tagline: "Cloud Practitioner / SAA 学習サイト",
    homeAriaLabel: "AWS資格ロードマップラボのトップページへ移動",
    mainNavigationAriaLabel: "メインナビゲーション",
    mobileNavigationAriaLabel: "スマートフォン用ナビゲーション",
    openMenuLabel: "メニューを開く",
    closeMenuLabel: "メニューを閉じる",
  },
  en: {
    skipLink: "Skip to main content",
    siteName: "AWS Cert Roadmap Lab",
    tagline: "Cloud Practitioner / SAA learning site",
    homeAriaLabel: "Go to AWS Cert Roadmap Lab home page",
    mainNavigationAriaLabel: "Main navigation",
    mobileNavigationAriaLabel: "Mobile navigation",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  zh: {
    skipLink: "跳到主要內容",
    siteName: "AWS證照路線圖實驗室",
    tagline: "Cloud Practitioner / SAA 學習網站",
    homeAriaLabel: "前往AWS證照路線圖實驗室首頁",
    mainNavigationAriaLabel: "主要導覽",
    mobileNavigationAriaLabel: "手機版導覽",
    openMenuLabel: "開啟選單",
    closeMenuLabel: "關閉選單",
  },
};

const navItems: NavItem[] = [
  {
    label: {
      ja: "ホーム",
      en: "Home",
      zh: "首頁",
    },
    href: "/",
  },
  {
    label: {
      ja: "用語集",
      en: "Terms",
      zh: "術語集",
    },
    href: "/terms",
  },
  {
    label: {
      ja: "比較",
      en: "Comparisons",
      zh: "服務比較",
    },
    href: "/comparisons",
  },
  {
    label: {
      ja: "模擬問題",
      en: "Questions",
      zh: "模擬題",
    },
    href: "/questions",
  },
  {
    label: {
      ja: "構成図",
      en: "Architectures",
      zh: "架構圖",
    },
    href: "/architectures",
  },
  {
    label: {
      ja: "ブログ",
      en: "Blog",
      zh: "部落格",
    },
    href: "/blog",
  },
  {
    label: {
      ja: "ロードマップ",
      en: "Roadmap",
      zh: "學習路線圖",
    },
    href: "/roadmap",
  },
  {
    label: {
      ja: "問い合わせ",
      en: "Contact",
      zh: "聯絡我們",
    },
    href: "/contact",
  },
];

function isActivePath(pathname: string, href: string): boolean {
  const contentPathname = removeLocalePrefix(pathname);

  if (href === "/") {
    return contentPathname === "/";
  }

  return contentPathname === href || contentPathname.startsWith(`${href}/`);
}

export function Header(): ReactElement {
  const pathname = usePathname();
  const currentPathname = pathname ?? "/";
  const currentLocale = getLocaleFromPathname(currentPathname);
  const text = headerText[currentLocale];
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  const menuButtonLabel = isOpen ? text.closeMenuLabel : text.openMenuLabel;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {text.skipLink}
      </a>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href={createLocalizedPath(currentLocale, "/")}
          onClick={closeMenu}
          className="flex min-w-0 flex-col text-slate-950"
          aria-label={text.homeAriaLabel}
        >
          <span className="truncate text-base font-bold tracking-tight sm:text-lg">
            {text.siteName}
          </span>
          <span className="hidden text-xs text-slate-500 sm:inline">{text.tagline}</span>
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          <nav className="flex items-center gap-1" aria-label={text.mainNavigationAriaLabel}>
            {navItems.map((item) => {
              const active = isActivePath(currentPathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={createLocalizedPath(currentLocale, item.href)}
                  className={[
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label[currentLocale]}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 lg:hidden"
          aria-label={menuButtonLabel}
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">{menuButtonLabel}</span>
          <span className="flex h-5 w-5 flex-col justify-center gap-1.5" aria-hidden="true">
            <span
              className={[
                "block h-0.5 w-5 rounded-full bg-current transition",
                isOpen ? "translate-y-2 rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-5 rounded-full bg-current transition",
                isOpen ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-5 rounded-full bg-current transition",
                isOpen ? "-translate-y-2 -rotate-45" : "",
              ].join(" ")}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={[
          "border-t border-slate-200 bg-white lg:hidden",
          isOpen ? "block" : "hidden",
        ].join(" ")}
      >
        <nav
          className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6"
          aria-label={text.mobileNavigationAriaLabel}
        >
          {navItems.map((item) => {
            const active = isActivePath(currentPathname, item.href);

            return (
              <Link
                key={item.href}
                href={createLocalizedPath(currentLocale, item.href)}
                onClick={closeMenu}
                className={[
                  "rounded-lg px-3 py-3 text-sm font-medium transition",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {item.label[currentLocale]}
              </Link>
            );
          })}

          <div className="mt-2 border-t border-slate-200 pt-3">
            <LanguageSwitcher onNavigate={closeMenu} />
          </div>
        </nav>
      </div>
    </header>
  );
}