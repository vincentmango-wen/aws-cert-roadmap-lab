import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createBlogDetailMetadataInput } from "../../../app/(site)/blog/blog-detail-data";
import { loadBlogContent } from "../../../app/(site)/blog/blog-content-loader";
import { getBlogSitemapRoutes } from "../../../app/sitemap";
import { createPageMetadata } from "../../../lib/seo";
import architecturesJa from "../../../../contents/architectures/architectures.ja.json";
import comparisonsJa from "../../../../contents/comparisons/comparisons.ja.json";
import termsJa from "../../../../contents/terms/terms.ja.json";
import { blogPosts } from "../blogPosts";

type JsonSlugEntry = { slug?: string; published?: boolean };
type TermEntry = { termId?: string; published?: boolean };

const FRONTEND_ROOT = path.resolve(__dirname, "../../../../");
const JA_BLOG_DIR = path.join(FRONTEND_ROOT, "contents", "blog", "ja");
const EXPECTED_SITE_URL = "https://www.aws-cert-roadmap-lab.com";

process.env.NEXT_PUBLIC_SITE_URL = EXPECTED_SITE_URL;

const targetBatches = [
  {
    name: "aws-services",
    displayName: "AWSサービス基礎",
    slugs: [
      "cloudfront-beginner-cdn",
      "apigateway-beginner-http-api",
      "dynamodb-beginner-nosql",
      "lambda-beginner-serverless",
      "s3-beginner-object-storage",
    ],
  },
  {
    name: "saa-design",
    displayName: "SAA設計",
    slugs: [
      "saa-decoupling-sqs-sns-eventbridge",
      "saa-multi-az-high-availability",
      "saa-s3-cloudfront-oac-design",
    ],
  },
  {
    name: "clf-basics",
    displayName: "CLF基礎",
    slugs: ["clf-iam-basics", "clf-aws-global-infrastructure"],
  },
  {
    name: "implementation",
    displayName: "実装・ポートフォリオ",
    slugs: [
      "serverless-contact-api-flow",
      "lambda-cloudwatch-logs-check",
      "aws-portfolio-serverless-architecture",
    ],
  },
] as const;

const targetSlugs = targetBatches.flatMap((batch) => batch.slugs);

function readJaMdx(slug: string): string {
  return fs.readFileSync(path.join(JA_BLOG_DIR, `${slug}.mdx`), "utf8");
}

function extractBody(rawFile: string): string {
  return (
    rawFile.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/)?.[1] ??
    rawFile
  );
}

function countMatches(content: string, pattern: RegExp): number {
  return [...content.matchAll(pattern)].length;
}

function extractMarkdownLinks(content: string): string[] {
  return [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(
    (match) => match[1],
  );
}

const publishedSlugs = (entries: JsonSlugEntry[]): Set<string> =>
  new Set(
    entries
      .filter((entry) => entry.published !== false)
      .map((entry) => entry.slug)
      .filter(
        (slug): slug is string => typeof slug === "string" && slug.length > 0,
      ),
  );

const existingBlogSlugs = new Set(
  fs
    .readdirSync(JA_BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, "")),
);
const existingComparisonSlugs = publishedSlugs(
  comparisonsJa as JsonSlugEntry[],
);
const existingArchitectureSlugs = publishedSlugs(
  architecturesJa as JsonSlugEntry[],
);
const existingTermIds = new Set(
  (termsJa as TermEntry[])
    .filter((entry) => entry.published !== false)
    .map((entry) => entry.termId)
    .filter(
      (termId): termId is string =>
        typeof termId === "string" && termId.length > 0,
    ),
);

function expectInternalLinkExists(slug: string, href: string): void {
  if (href.startsWith("/blog/")) {
    const target = href.replace(/^\/blog\//, "").replace(/\/$/, "");
    expect(
      existingBlogSlugs.has(target),
      `${slug} links to missing blog page ${href}`,
    ).toBe(true);
    return;
  }

  if (href.startsWith("/comparisons/")) {
    const target = href.replace(/^\/comparisons\//, "").replace(/\/$/, "");
    expect(
      existingComparisonSlugs.has(target),
      `${slug} links to missing comparison page ${href}`,
    ).toBe(true);
    return;
  }

  if (href.startsWith("/architectures/")) {
    const target = href.replace(/^\/architectures\//, "").replace(/\/$/, "");
    expect(
      existingArchitectureSlugs.has(target),
      `${slug} links to missing architecture page ${href}`,
    ).toBe(true);
    return;
  }

  if (href.startsWith("/terms/")) {
    const target = href.replace(/^\/terms\//, "").replace(/\/$/, "");
    expect(
      existingTermIds.has(target),
      `${slug} links to missing term page ${href}`,
    ).toBe(true);
    return;
  }

  expect(
    [
      "/blog",
      "/terms",
      "/questions",
      "/questions/clf",
      "/questions/saa",
      "/roadmap",
    ].includes(href),
    `${slug} links to unsupported internal path ${href}`,
  ).toBe(true);
}

describe("blog indexing policy for Search Console noindex remediation", () => {
  const sitemapPathnames = getBlogSitemapRoutes().map(
    (route) => route.pathname,
  );

  for (const batch of targetBatches) {
    describe(`${batch.displayName} batch`, () => {
      for (const slug of batch.slugs) {
        it(`${slug} has indexable Japanese MDX, metadata, sitemap, official links, and valid internal links`, () => {
          const rawFile = readJaMdx(slug);
          const body = extractBody(rawFile);
          const loaded = loadBlogContent("ja", slug);
          const metadataInput = createBlogDetailMetadataInput("ja", slug);
          const metadata = createPageMetadata(metadataInput);
          const officialDocLinks = extractMarkdownLinks(body).filter((href) =>
            href.startsWith("https://docs.aws.amazon.com/"),
          );
          const internalLinks = extractMarkdownLinks(body).filter((href) =>
            href.startsWith("/"),
          );

          expect(
            rawFile,
            `${slug} still has noIndex in ja MDX`,
          ).not.toMatch(/^noIndex:\s*true\s*$/m);
          expect(loaded, `${slug} did not load`).not.toBeNull();
          expect(loaded?.frontmatter.published, `${slug} is not published`).toBe(
            true,
          );
          expect(
            loaded?.frontmatter.noIndex,
            `${slug} frontmatter remains noIndex`,
          ).toBe(false);
          expect(
            metadataInput.noIndex,
            `${slug} metadata remains noIndex`,
          ).toBe(false);
          expect(
            String(metadata.alternates?.canonical),
            `${slug} canonical is not the production HTTPS www self URL`,
          ).toBe(`${EXPECTED_SITE_URL}/blog/${slug}`);
          expect(
            sitemapPathnames,
            `${slug} missing from blog sitemap routes`,
          ).toContain(`/blog/${slug}`);

          expect(
            countMatches(body, /^##\s+/gm),
            `${slug} needs enough second-level sections`,
          ).toBeGreaterThanOrEqual(7);
          expect(body.length, `${slug} body is still too thin`).toBeGreaterThanOrEqual(
            5200,
          );
          expect(
            officialDocLinks.length,
            `${slug} needs at least two AWS docs links`,
          ).toBeGreaterThanOrEqual(2);
          expect(
            internalLinks.length,
            `${slug} needs at least two internal links`,
          ).toBeGreaterThanOrEqual(2);
          expect(
            body,
            `${slug} needs an explicit misconception or failure section`,
          ).toMatch(/誤解|失敗|つまずき|注意/);

          for (const href of internalLinks) {
            expectInternalLinkExists(slug, href);
          }
        });
      }
    });
  }

  it("target registry entries no longer carry noIndex", () => {
    for (const slug of targetSlugs) {
      const post = blogPosts.find((entry) => entry.slug === slug);
      expect(post, `registry entry missing for ${slug}`).toBeDefined();
      expect(post?.noIndex, `registry noIndex remains for ${slug}`).not.toBe(
        true,
      );
    }
  });
});
