import type { ReactNode } from "react";

/**
 * Layout for content routes only (the (site) route group). Inject AdSense here rather than in the root
 * layout so 404 pages do not load adsbygoogle.js. This follows the AdSense policy against placing ad
 * code on content-free screens.
 *
 * Static export turns next/script into preload links and a runtime queue rather than an actual script
 * element, which the AdSense review crawler cannot detect. Emit a plain async script tag instead.
 *
 * Do not return a head wrapper: Next.js static export leaves an empty head inside body, violating HTML5
 * placement rules. React 19 automatically hoists async scripts into the document head, so a Fragment is
 * sufficient.
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
      {googleAdSenseClientId !== null ? (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
            googleAdSenseClientId,
          )}`}
          crossOrigin="anonymous"
        />
      ) : null}
      {children}
    </>
  );
}
