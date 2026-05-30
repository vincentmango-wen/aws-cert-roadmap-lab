"use client";

import Link from "next/link";
import { useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  { label: "ホーム", href: "/" },
  { label: "用語集", href: "/terms" },
  { label: "比較", href: "/comparisons" },
  { label: "模擬問題", href: "/questions" },
  { label: "構成図", href: "/architectures" },
  { label: "ブログ", href: "/blog" },
  { label: "ロードマップ", href: "/roadmap" },
  { label: "問い合わせ", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-white"
          onClick={closeMenu}
        >
          AWS資格ロードマップラボ
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-sky-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-white lg:hidden"
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          メニュー
        </button>
      </div>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-slate-800 bg-slate-950 px-6 py-4 lg:hidden"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-3 text-sm font-medium text-slate-300">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 transition hover:bg-slate-900 hover:text-sky-300"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}