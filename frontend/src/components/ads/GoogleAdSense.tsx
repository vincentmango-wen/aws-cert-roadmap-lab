import type { JSX } from "react";
import Script from "next/script";

const ADSENSE_CLIENT_ID_PREFIX = "ca-pub-";

function isGoogleAdSenseClientId(value: string | undefined): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();

  return (
    trimmedValue.startsWith(ADSENSE_CLIENT_ID_PREFIX) &&
    trimmedValue.length > ADSENSE_CLIENT_ID_PREFIX.length
  );
}

export function GoogleAdSense(): JSX.Element | null {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  if (!isGoogleAdSenseClientId(clientId)) {
    return null;
  }

  const trimmedClientId = clientId.trim();

  return (
    <Script
      id="google-adsense-review-code"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        trimmedClientId,
      )}`}
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
    />
  );
}