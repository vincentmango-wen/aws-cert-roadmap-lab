import type { ReactNode } from "react";
import Script from "next/script";

/**
 * コンテンツルート専用 layout（route group: (site)）。
 * AdSense スクリプトをここで注入することで、root layout 配下の 404 画面には
 * adsbygoogle.js を読み込まない構造を実現する。
 *
 * Google AdSense ポリシー準拠:
 * 「コンテンツを含まない画面（404 等）に広告コードを配置してはならない」
 * 対処: root layout から AdSense を除き、コンテンツルートのみで注入。
 */

const ADSENSE_CLIENT_ID_PREFIX = "ca-pub-";

function getGoogleAdSenseClientId(): string | null {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID?.trim();

  if (typeof clientId !== "string") {
    return null;
  }

  if (!clientId.startsWith(ADSENSE_CLIENT_ID_PREFIX)) {
    return null;
  }

  if (clientId.length <= ADSENSE_CLIENT_ID_PREFIX.length) {
    return null;
  }

  return clientId;
}

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteGroupLayout({
  children,
}: SiteLayoutProps): React.JSX.Element {
  const googleAdSenseClientId = getGoogleAdSenseClientId();

  return (
    <>
      {children}
      {googleAdSenseClientId !== null ? (
        <Script
          id="google-adsense-review-code"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
            googleAdSenseClientId,
          )}`}
          strategy="beforeInteractive"
          async
          crossOrigin="anonymous"
        />
      ) : null}
    </>
  );
}
