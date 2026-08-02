import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const DEFAULT_SITE_URL = "http://localhost:3000";

function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return siteUrl.replace(/\/$/, "");
}

/**
 * robots.txt。
 *
 * **`Disallow: /en/` `Disallow: /zh/` を絶対に追加しないこと**（ACR-012 / #322）。
 *
 * en/zh の封印は各ページの `<meta name="robots" content="noindex, nofollow">` で行っている。
 * `Disallow` はクロール自体を止めるため、Googlebot が `/en/questions/clf-001` を取得できず、
 * そのページの noindex メタを **読めなくなる**。結果、外部リンク等で発見された URL が
 * 「情報なし」の URL-only エントリとしてインデックスに残りうる。これは clean な noindex より
 * 厳密に悪く、AdSense が罰した「中身の無いページ」そのものになる。
 * 正しい順序は「まず noindex でクロールさせて落とす」。
 *
 * また `Disallow: /*.txt$` のような広いパターンは `/ads.txt` を巻き込み AdSense の検証を壊す。
 *
 * 将来 Search Console で en/zh が全件「noindex タグにより除外」になった後に、
 * クロールバジェット節約目的で `Disallow` を足すのは任意。現時点では不要。
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