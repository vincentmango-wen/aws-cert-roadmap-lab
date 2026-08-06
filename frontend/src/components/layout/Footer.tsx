"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import {
  createLocalizedPath,
  getLocaleFromPathname,
} from "@/i18n/locales";
import type { FooterSectionKey, NavigationKey } from "@/i18n/dictionaries";

type ExternalFooterLink = {
  labelKey: NavigationKey;
  href: string;
};

const PORTFOLIO_EXTERNAL_LINKS: ExternalFooterLink[] = [
  {
    labelKey: "github",
    href: "https://github.com/vincentmango-wen/aws-cert-roadmap-lab",
  },
  { labelKey: "note", href: "https://note.com/fumi_ai_202507" },
  { labelKey: "x", href: "https://x.com/fumikun_gengen" },
];

const INTERNAL_SECTION_ORDER: FooterSectionKey[] = [
  "learning",
  "siteInfo",
  "portfolio",
];

function isExternalPortfolioKey(key: NavigationKey): boolean {
  return PORTFOLIO_EXTERNAL_LINKS.some((link) => link.labelKey === key);
}

export function Footer(): ReactElement {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname ?? "/");
  const dictionary = getDictionary(currentLocale);
  const labels = dictionary.footer;

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={createLocalizedPath(currentLocale, "/")}
              className="inline-flex text-base font-bold !text-slate-950 underline-offset-4 hover:underline"
            >
              {dictionary.site.name}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              {labels.description}
            </p>
          </div>

          {INTERNAL_SECTION_ORDER.map((sectionKey) => {
            const section = labels.sections[sectionKey];

            return (
              <section
                key={sectionKey}
                aria-labelledby={`footer-${sectionKey}`}
              >
                <h2
                  id={`footer-${sectionKey}`}
                  className="text-sm font-semibold text-slate-950"
                >
                  {section.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {section.linkKeys.map((linkKey) => {
                    const label = dictionary.navigation[linkKey];

                    if (isExternalPortfolioKey(linkKey)) {
                      const external = PORTFOLIO_EXTERNAL_LINKS.find(
                        (link) => link.labelKey === linkKey,
                      );

                      if (!external) {
                        return null;
                      }

                      return (
                        <li key={linkKey}>
                          <a
                            href={external.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-600 underline-offset-4 transition hover:text-slate-950 hover:underline"
                          >
                            {label}
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={linkKey}>
                        <Link
                          href={createLocalizedPath(currentLocale, `/${linkKey}`)}
                          className="text-sm text-slate-600 underline-offset-4 transition hover:text-slate-950 hover:underline"
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                  {sectionKey === "siteInfo" && currentLocale === "ja" ? (
                    <li>
                      <Link
                        href="/terms-of-service"
                        className="text-sm text-slate-600 underline-offset-4 transition hover:text-slate-950 hover:underline"
                      >
                        利用規約
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs leading-6 text-slate-500">
            {labels.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
