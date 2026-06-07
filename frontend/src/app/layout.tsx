import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteLayout } from "../components/layout/SiteLayout";
import { createAbsoluteUrl, siteConfig } from "../lib/seo";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const assetBasePath = "/images/assets";

export const viewport: Viewport = {
  themeColor: "#1B2530",
};

export const metadata: Metadata = {
  metadataBase: new URL(createAbsoluteUrl("/")),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  manifest: `${assetBasePath}/site.webmanifest`,
  icons: {
    icon: [
      {
        url: `${assetBasePath}/favicon.svg`,
        type: "image/svg+xml",
      },
      {
        url: `${assetBasePath}/favicon.ico`,
        sizes: "any",
      },
      {
        url: `${assetBasePath}/favicon-16.png`,
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: `${assetBasePath}/favicon-32.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `${assetBasePath}/favicon-48.png`,
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: `${assetBasePath}/favicon-64.png`,
        sizes: "64x64",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: `${assetBasePath}/apple-touch-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: `${assetBasePath}/icon-mark.svg`,
        color: "#1B2530",
      },
    ],
  },
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