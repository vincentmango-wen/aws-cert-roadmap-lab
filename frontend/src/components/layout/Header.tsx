"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactElement } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "ホーム", href: "/" },
  { label: "用語集", href: "/terms" },
  { label: "比較", href: "/comparisons" },
  { label: "模擬問題", href: "/questions" },
  { label: "構成図", href: "/architectures" },
  { label: "ブログ", href: "/blog" },
  { label: "ロードマップ", href: "/roadmap" },
  { label: "問い合わせ", href: "/contact" },
];

function isActivePath(pathname: string | null, href: string): boolean {
  if (pathname === null) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header(): ReactElement {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        メインコンテンツへ移動
      </a>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 flex-col text-slate-950"
          aria-label="AWS資格ロードマップラボのトップページへ移動"
        >
          <span className="truncate text-base font-bold tracking-tight sm:text-lg">
            AWS資格ロードマップラボ
          </span>
          <span className="hidden text-xs text-slate-500 sm:inline">
            Cloud Practitioner / SAA 学習サイト
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="メインナビゲーション">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 lg:hidden"
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">{isOpen ? "メニューを閉じる" : "メニューを開く"}</span>
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
        <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="スマートフォン用ナビゲーション">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={[
                  "rounded-lg px-3 py-3 text-sm font-medium transition",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}