import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getHtmlLang, isPrefixedLocale, prefixedLocales } from "@/i18n/locales";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return prefixedLocales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  return (
    <div data-locale={locale} data-html-lang={getHtmlLang(locale)}>
      {children}
    </div>
  );
}