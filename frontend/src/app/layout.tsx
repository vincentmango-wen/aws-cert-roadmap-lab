import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteLayout } from "../components/layout/SiteLayout";
import { createAbsoluteUrl, siteConfig } from "../lib/seo";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(createAbsoluteUrl("/")),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: createAbsoluteUrl("/"),
    siteName: siteConfig.name,
    images: [
      {
        url: createAbsoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [createAbsoluteUrl(siteConfig.defaultOgImage)],
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="ja">
      <body>
        <SiteLayout>{children}</SiteLayout>
        <GoogleAnalytics />
      </body>
    </html>
  );
}