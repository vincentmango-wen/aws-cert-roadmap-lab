#!/usr/bin/env node
/**
 * verify-locale-seal.mjs
 *
 * ACR-012 (#322), invariant layer 3: inspect build artifacts. CI (.github/workflows/deploy-frontend.yml)
 * does not run npm test (#314), so Vitest invariants alone cannot gate production deployments. Chaining
 * this script into npm run build catches sealing leaks before deployment.
 *
 * Checks in sealed mode (LOCALIZED_ROUTES_PUBLISHED === false):
 * 1. No /en or /zh loc prefixes, or en / zh-Hant / x-default hreflang entries, in out/sitemap.xml.
 * 2. All HTML under out/en and out/zh, plus out/en.html and out/zh.html, contains a noindex, nofollow
 * robots meta tag. Individually check the existence of the six pages that bypass createPageMetadata.
 * 3. No internal /en or /zh links in Japanese HTML, checking LanguageSwitcher and header-link leaks.
 * 4. Major Japanese pages retain index, follow to prevent over-sealing.
 * 5. The sitemap loc count meets the configured minimum (see MIN_SITEMAP_URLS below).
 *
 * Published mode (true) skips checks 1-3 and runs 4-5 only. Minimum en/zh and Japanese HTML counts
 * prevent a vacuous pass when enumeration finds no pages.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, "..");
const outDir = path.join(frontendRoot, "out");
const releaseGatePath = path.join(frontendRoot, "src", "i18n", "release-gate.ts");

/**
 * Minimum sitemap size. Sealed mode measured 202 Japanese URLs. A much lower threshold (such as 150)
 * would miss dozens of absent URLs, so allow only a small margin. Lower this threshold when
 * intentionally reducing Japanese content; a build failure otherwise is expected.
 */
const MIN_SITEMAP_URLS = 195;

/**
 * Minimum counts to prevent vacuous passes when broken enumeration finds no pages. These are safely
 * below the measured 424 en/zh pages and 217 Japanese pages.
 */
const MIN_SEALED_HTML_FILES = 100;
const MIN_JAPANESE_HTML_FILES = 100;

/**
 * Six pages with raw Metadata literals rather than createPageMetadata. These are most vulnerable to
 * sealing leaks, so check them individually, including existence (#322 risks).
 */
const METADATA_LITERAL_PAGES = [
  "en/contact.html",
  "en/privacy.html",
  "zh/contact.html",
  "zh/privacy.html",
  "zh/disclaimer.html",
  "zh.html",
];

/**
 * Over-sealing guard: only en/zh should be sealed; major Japanese pages must retain index, follow.
 */
const JAPANESE_INDEXABLE_PAGES = [
  "index.html",
  "questions.html",
  "about.html",
  "terms.html",
  "terms-of-service.html",
  "roadmap.html",
  "architectures.html",
  "comparisons.html",
];

const SEALED_ROBOTS_META = /<meta name="robots" content="noindex,\s*nofollow"/;
const INDEXABLE_ROBOTS_META = /<meta name="robots" content="index,\s*follow"/;
const LOCALE_HREF = /href="\/(en|zh)(\/|"|#|\?)/;

const errors = [];

function fail(message) {
  errors.push(message);
}

/**
 * Read the flag from release-gate.ts. Throw if it does not match so renaming the constant cannot
 * silently disable validation.
 */
function readReleaseGateFlag() {
  if (!existsSync(releaseGatePath)) {
    throw new Error(
      `[verify-locale-seal] Release gate not found: ${releaseGatePath}`,
    );
  }

  const source = readFileSync(releaseGatePath, "utf8");
  const match = source.match(/LOCALIZED_ROUTES_PUBLISHED\s*:\s*boolean\s*=\s*(true|false)/);

  if (!match) {
    throw new Error(
      "[verify-locale-seal] Could not read LOCALIZED_ROUTES_PUBLISHED from release-gate.ts." +
        " Update this script's regular expression if the constant name or type annotation changes.",
    );
  }

  return match[1] === "true";
}

function listHtmlFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const files = [];

  for (const entry of readdirSync(dir)) {
    const absolutePath = path.join(dir, entry);

    if (statSync(absolutePath).isDirectory()) {
      files.push(...listHtmlFiles(absolutePath));
      continue;
    }

    if (entry.endsWith(".html")) {
      files.push(absolutePath);
    }
  }

  return files;
}

/**
 * Normalize paths relative to out/ into pathnames such as /en/....
 */
function toRelative(absolutePath) {
  return path.relative(outDir, absolutePath).split(path.sep).join("/");
}

function isSealedHtml(relativePath) {
  return (
    relativePath === "en.html" ||
    relativePath === "zh.html" ||
    relativePath.startsWith("en/") ||
    relativePath.startsWith("zh/")
  );
}

function main() {
  const localizedRoutesPublished = readReleaseGateFlag();
  const mode = localizedRoutesPublished ? "released" : "sealed";

  if (!existsSync(outDir)) {
    throw new Error(`[verify-locale-seal] out/ does not exist: ${outDir}`);
  }

  // --- sitemap ---
  const sitemapPath = path.join(outDir, "sitemap.xml");

  if (!existsSync(sitemapPath)) {
    fail(`out/sitemap.xml does not exist: ${sitemapPath}`);
  } else {
    const sitemapXml = readFileSync(sitemapPath, "utf8");
    const locs = [...sitemapXml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);

    if (locs.length < MIN_SITEMAP_URLS) {
      fail(
        `Sitemap contains only ${locs.length} <loc> entries (minimum ${MIN_SITEMAP_URLS}).` +
          " Check whether excessive sealing filters have removed sitemap entries.",
      );
    }

    if (!localizedRoutesPublished) {
      const sealedLocs = locs.filter((loc) => /\/(en|zh)(\/|$)/.test(loc.replace(/^https?:\/\/[^/]+/, "")));

      if (sealedLocs.length > 0) {
        fail(
          `Sitemap contains ${sealedLocs.length} en/zh URLs while sealed.` +
            ` Examples: ${sealedLocs.slice(0, 3).join(", ")}`,
        );
      }

      for (const hreflang of ["en", "zh-Hant", "x-default"]) {
        if (sitemapXml.includes(`hreflang="${hreflang}"`)) {
          fail(`Sitemap still contains hreflang="${hreflang}" while sealed.`);
        }
      }
    }

    console.log(`[verify-locale-seal] sitemap <loc>: ${locs.length} entries`);
  }

  // --- HTML ---
  const htmlFiles = listHtmlFiles(outDir).map((absolutePath) => ({
    absolutePath,
    relativePath: toRelative(absolutePath),
  }));

  if (htmlFiles.length === 0) {
    fail("No HTML files found in out/.");
  }

  const sealedHtmlFiles = htmlFiles.filter((file) => isSealedHtml(file.relativePath));
  const japaneseHtmlFiles = htmlFiles.filter((file) => !isSealedHtml(file.relativePath));

  if (!localizedRoutesPublished) {
    // Prevent vacuous passes: broken enumeration returning zero pages would bypass all checks.
    if (sealedHtmlFiles.length < MIN_SEALED_HTML_FILES) {
      fail(
        `Found only ${sealedHtmlFiles.length} en/zh HTML files (minimum ${MIN_SEALED_HTML_FILES}).` +
          " out/ may be stale or file enumeration may be broken.",
      );
    }

    if (japaneseHtmlFiles.length < MIN_JAPANESE_HTML_FILES) {
      fail(
        `Found only ${japaneseHtmlFiles.length} Japanese HTML files (minimum ${MIN_JAPANESE_HTML_FILES}).`,
      );
    }

    const indexableSealedFiles = sealedHtmlFiles.filter((file) => {
      const html = readFileSync(file.absolutePath, "utf8");

      return !SEALED_ROBOTS_META.test(html);
    });

    if (indexableSealedFiles.length > 0) {
      fail(
        `Sealed en/zh HTML files missing <meta name="robots" content="noindex, nofollow">:` +
          ` ${indexableSealedFiles.length}.` +
          ` Examples: ${indexableSealedFiles.slice(0, 5).map((f) => f.relativePath).join(", ")}`,
      );
    }

    // Individually check the six pages bypassing createPageMetadata, including existence, because they are most prone to sealing leaks.
    for (const relativePath of METADATA_LITERAL_PAGES) {
      const absolutePath = path.join(outDir, relativePath);

      if (!existsSync(absolutePath)) {
        fail(`HTML file required for sealing validation is missing: out/${relativePath}`);
        continue;
      }

      if (!SEALED_ROBOTS_META.test(readFileSync(absolutePath, "utf8"))) {
        fail(
          `out/${relativePath} is not noindex, nofollow.` +
            " Check that it uses createLocaleAwareRobots().",
        );
      }
    }

    const leakingJapaneseFiles = japaneseHtmlFiles.filter((file) => {
      const html = readFileSync(file.absolutePath, "utf8");

      return LOCALE_HREF.test(html);
    });

    if (leakingJapaneseFiles.length > 0) {
      fail(
        `${leakingJapaneseFiles.length} Japanese HTML files still contain internal en/zh links.` +
          ` Examples: ${leakingJapaneseFiles.slice(0, 5).map((f) => f.relativePath).join(", ")}`,
      );
    }

    console.log(
      `[verify-locale-seal] noindex checks: ${sealedHtmlFiles.length} files / ` +
        `Japanese-page link checks: ${japaneseHtmlFiles.length} files`,
    );
  }

  // --- Over-sealing guard (runs in both sealed and published modes) ---
  for (const relativePath of JAPANESE_INDEXABLE_PAGES) {
    const absolutePath = path.join(outDir, relativePath);

    if (!existsSync(absolutePath)) {
      fail(`Major Japanese page is missing: out/${relativePath}`);
      continue;
    }

    if (!INDEXABLE_ROBOTS_META.test(readFileSync(absolutePath, "utf8"))) {
      fail(
        `out/${relativePath} does not retain content="index, follow".` +
          " Check that Japanese pages were not accidentally sealed.",
      );
    }
  }

  if (errors.length > 0) {
    console.error(`\n[verify-locale-seal] FAILED (mode=${mode})`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(`[verify-locale-seal] OK (mode=${mode})`);
}

main();
