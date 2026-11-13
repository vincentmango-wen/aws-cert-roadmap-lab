import { afterAll, describe, expect, it } from "vitest";
import { loadBlogContent } from "../../../app/(site)/blog/blog-content-loader";
import { createBlogDetailMetadataInput } from "../../../app/(site)/blog/blog-detail-data";
import sitemap, { getBlogSitemapRoutes } from "../../../app/sitemap";
import { createPageMetadata } from "../../../lib/seo";

const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
process.env.NEXT_PUBLIC_SITE_URL = "https://www.aws-cert-roadmap-lab.com";
afterAll(() => {
  if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
});

const cases = [
  ["clf-shared-responsibility-model", "2026-08-02"],
  ["clf-aws-global-infrastructure", "2026-08-20"],
  ["clf-aws-pricing-basics", "2026-11-09"],
  ["clf-iam-basics", "2026-08-20"],
  ["clf-monitoring-cloudwatch-basics", "2026-08-02"],
  ["saa-multi-az-high-availability", "2026-08-20"],
  ["saa-vpc-public-private-subnet", "2026-08-02"],
  ["saa-s3-cloudfront-oac-design", "2026-08-20"],
  ["saa-database-selection-rds-dynamodb", "2026-08-02"],
  ["saa-decoupling-sqs-sns-eventbridge", "2026-11-09"],
  ["s3-beginner-object-storage", "2026-08-20"],
  ["lambda-beginner-serverless", "2026-08-20"],
  ["apigateway-beginner-http-api", "2026-08-20"],
  ["dynamodb-beginner-nosql", "2026-08-20"],
  ["cloudfront-beginner-cdn", "2026-08-20"],
  ["aws-portfolio-serverless-architecture", "2026-08-20"],
  ["aws-budgets-cost-guardrail", "2026-08-02"],
  ["github-actions-oidc-deploy", "2026-08-02"],
  ["serverless-contact-api-flow", "2026-08-20"],
  ["lambda-cloudwatch-logs-check", "2026-08-20"],
] as const;

describe.each(["en", "zh", "ja"] as const)("%s approved blog indexing", (locale) => {
  it.each(cases)("allows indexing of %s without changing recorded dates", (slug, updatedAt) => {
    const loaded = loadBlogContent(locale, slug);
    expect(loaded?.frontmatter.noIndex).toBe(false);
    const input = createBlogDetailMetadataInput(locale, slug);
    expect(input.publishedTime).toBe("2026-06-07");
    expect(input.modifiedTime).toBe(updatedAt);
    const metadata = createPageMetadata(input);
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    const pathname = `${locale === "ja" ? "" : `/${locale}`}/blog/${slug}`;
    expect(metadata.alternates?.canonical).toBe(`https://www.aws-cert-roadmap-lab.com${pathname}`);
    expect(getBlogSitemapRoutes().filter((entry) => entry.pathname === `/blog/${slug}`)).toHaveLength(1);
    const entries = sitemap().filter((entry) => new URL(entry.url).pathname === pathname);
    expect(entries).toHaveLength(1);
    expect(new Date(entries[0].lastModified!).toISOString().slice(0, 10)).toBe(updatedAt);
    expect(entries[0].alternates?.languages).toMatchObject({
      ja: `https://www.aws-cert-roadmap-lab.com/blog/${slug}`,
      en: `https://www.aws-cert-roadmap-lab.com/en/blog/${slug}`,
      "zh-Hant": `https://www.aws-cert-roadmap-lab.com/zh/blog/${slug}`,
    });
  });
});

it("retains 78 unique localized blog URLs and restrictions on other content", () => {
  const entries = sitemap().filter((entry) => new URL(entry.url).pathname.includes("/blog/"));
  expect(entries).toHaveLength(78);
  expect(new Set(entries.map((entry) => entry.url)).size).toBe(78);
  expect(createPageMetadata({ title: "Private", description: "Private", path: "/en/private", noIndex: true }).robots)
    .toMatchObject({ index: false, follow: true });
  expect(createPageMetadata(createBlogDetailMetadataInput("zh", "not-a-real-article")).robots)
    .toMatchObject({ index: false });
});
