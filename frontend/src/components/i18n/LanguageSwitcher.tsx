"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import {
  createLocalizedPath,
  getHtmlLang,
  getLocaleFromPathname,
  getLocaleConfig,
  locales,
  type Locale,
} from "@/i18n/locales";

type LanguageSwitcherProps = {
  onNavigate?: () => void;
};

type LanguageSwitcherText = {
  ariaLabel: string;
  current: string;
  switchTo: (language: string) => string;
};

const languageSwitcherText: Record<Locale, LanguageSwitcherText> = {
  ja: {
    ariaLabel: "表示言語を選択",
    current: "現在の表示言語",
    switchTo: (language: string) => `${language}へ切り替え`,
  },
  en: {
    ariaLabel: "Select display language",
    current: "Current language",
    switchTo: (language: string) => `Switch to ${language}`,
  },
  zh: {
    ariaLabel: "選擇顯示語言",
    current: "目前顯示語言",
    switchTo: (language: string) => `切換到${language}`,
  },
};

export function LanguageSwitcher({ onNavigate }: LanguageSwitcherProps): ReactElement {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const text = languageSwitcherText[currentLocale];

  return (
    <nav
      aria-label={text.ariaLabel}
      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1"
    >
      {locales.map((locale) => {
        const config = getLocaleConfig(locale);
        const isCurrent = locale === currentLocale;
        const href = createLocalizedPath(locale, pathname);

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={getHtmlLang(locale)}
            lang={getHtmlLang(locale)}
            onClick={onNavigate}
            aria-current={isCurrent ? "page" : undefined}
            title={
              isCurrent
                ? `${config.nativeLabel} - ${text.current}`
                : text.switchTo(config.nativeLabel)
            }
            className={[
              "inline-flex h-8 min-w-10 items-center justify-center rounded-full px-3 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
              isCurrent
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-white hover:text-slate-950",
            ].join(" ")}
          >
            <span aria-hidden="true">{config.shortLabel}</span>
            <span className="sr-only">
              {isCurrent
                ? `${config.nativeLabel} - ${text.current}`
                : text.switchTo(config.nativeLabel)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}