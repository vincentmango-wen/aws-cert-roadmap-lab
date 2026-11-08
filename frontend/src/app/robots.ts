import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const DEFAULT_SITE_URL = "http://localhost:3000";

function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return siteUrl.replace(/\/$/, "");
}

/**
 * robots.txt. Never add Disallow: /en/ or Disallow: /zh/ (ACR-012 / #322). Locale sealing uses each
 * page's noindex, nofollow robots meta tag. Disallow would prevent Googlebot from fetching pages such as
 * /en/questions/clf-001 and reading noindex. URLs found through external links could remain indexed as
 * information-free URL-only entries, recreating the empty-page issue flagged by AdSense. Allow crawling
 * with noindex first so pages can be removed.
 *
 * Broad patterns such as Disallow: /*.txt$ also block /ads.txt and break AdSense verification. Once
 * Search Console confirms every en/zh page is excluded by noindex, Disallow could optionally reduce
 * crawling. It is unnecessary now.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}