#!/usr/bin/env node
/**
 * verify-locale-seal.mjs
 *
 * ACR-012 (#322) invariant 第 3 層 = ビルド成果物検査。
 *
 * CI (`.github/workflows/deploy-frontend.yml`) は `npm test` を実行していない（#314）ため、
 * vitest の invariant だけでは本番デプロイのゲートにならない。本スクリプトを
 * `npm run build` のチェーンに組み込むことで、封印漏れがあればデプロイ前にビルドが落ちる。
 *
 * 封印モード（LOCALIZED_ROUTES_PUBLISHED === false）での検査内容:
 *   1. out/sitemap.xml の <loc> に /en /zh prefix が 1 件も無い
 *      + hreflang="en" / "zh-Hant" / "x-default" が 1 件も無い
 *   2. out/en/**, out/zh/**（+ out/en.html, out/zh.html）の全 HTML が
 *      `<meta name="robots" content="noindex, nofollow"` を含む
 *      （`createPageMetadata` を経由しない 6 枚は存在確認も個別に行う）
 *   3. ja 面の HTML に href="/en... / href="/zh... が 1 件も無い
 *      （LanguageSwitcher / ヘッダ言語リンク漏れの実効チェック）
 *   4. ja 面の主要ページが index, follow を保持している（過剰封印ガード）
 *   5. out/sitemap.xml の <loc> 総数が 150 件以上（sitemap 空洞化ガード）
 *
 * 解封モード（true）では 1〜3 を skip し、4・5 のみ実行する。
 *
 * 検査対象が 0 件で「何も検査せず成功」になる vacuous pass を避けるため、
 * 封印モードでは en/zh HTML と ja 面 HTML の枚数にも下限を置く。
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, "..");
const outDir = path.join(frontendRoot, "out");
const releaseGatePath = path.join(frontendRoot, "src", "i18n", "release-gate.ts");

/**
 * sitemap 空洞化ガードの下限。
 *
 * 封印モードの実測は ja 202 件。下限を大きく下回る値（例: 150）にすると
 * 「ja の URL が数十件まとめて欠落した」ケースを素通ししてしまうため、
 * 実測から少しだけ余裕を取った値にする。ja コンテンツを意図的に減らしたときは
 * ここも一緒に下げること（下げ忘れてビルドが落ちるのは正しい挙動）。
 */
const MIN_SITEMAP_URLS = 195;

/**
 * vacuous pass ガードの下限。
 * 検査対象の列挙が壊れて 0 件になると「1 枚も違反が無い」で緑になってしまうため、
 * 実測値（en/zh 424 枚 / ja 面 217 枚）から十分低い値を置く。
 */
const MIN_SEALED_HTML_FILES = 100;
const MIN_JAPANESE_HTML_FILES = 100;

/**
 * `createPageMetadata` を経由せず素の `Metadata` リテラルを書いている 6 枚。
 * 封印が最も漏れやすい箇所なので、存在確認込みで個別に検査する（#322 リスク欄）。
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
 * 過剰封印ガード。封印は en/zh だけに効くべきで、ja 面の主要ページは
 * `index, follow` を保ったままでなければならない。
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
 * release-gate.ts からフラグを読み取る。
 * 定数がリネームされてチェックが黙って無効化されるのを防ぐため、
 * マッチしなかったら例外で落とす。
 */
function readReleaseGateFlag() {
  if (!existsSync(releaseGatePath)) {
    throw new Error(
      `[verify-locale-seal] release gate が見つかりません: ${releaseGatePath}`,
    );
  }

  const source = readFileSync(releaseGatePath, "utf8");
  const match = source.match(/LOCALIZED_ROUTES_PUBLISHED\s*:\s*boolean\s*=\s*(true|false)/);

  if (!match) {
    throw new Error(
      "[verify-locale-seal] release-gate.ts から LOCALIZED_ROUTES_PUBLISHED を読み取れませんでした。" +
        " 定数名 / 型注釈を変更した場合は本スクリプトの正規表現も更新すること。",
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

/** out/ からの相対パスを `/en/...` 形式の pathname に正規化する。 */
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
    throw new Error(`[verify-locale-seal] out/ が存在しません: ${outDir}`);
  }

  // --- sitemap ---
  const sitemapPath = path.join(outDir, "sitemap.xml");

  if (!existsSync(sitemapPath)) {
    fail(`out/sitemap.xml が存在しません: ${sitemapPath}`);
  } else {
    const sitemapXml = readFileSync(sitemapPath, "utf8");
    const locs = [...sitemapXml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);

    if (locs.length < MIN_SITEMAP_URLS) {
      fail(
        `sitemap の <loc> が ${locs.length} 件しかありません（下限 ${MIN_SITEMAP_URLS}）。` +
          " 封印フィルタが効きすぎて sitemap が空洞化していないか確認すること。",
      );
    }

    if (!localizedRoutesPublished) {
      const sealedLocs = locs.filter((loc) => /\/(en|zh)(\/|$)/.test(loc.replace(/^https?:\/\/[^/]+/, "")));

      if (sealedLocs.length > 0) {
        fail(
          `封印中なのに sitemap に en/zh の URL が ${sealedLocs.length} 件あります。` +
            ` 例: ${sealedLocs.slice(0, 3).join(", ")}`,
        );
      }

      for (const hreflang of ["en", "zh-Hant", "x-default"]) {
        if (sitemapXml.includes(`hreflang="${hreflang}"`)) {
          fail(`封印中なのに sitemap に hreflang="${hreflang}" が残っています。`);
        }
      }
    }

    console.log(`[verify-locale-seal] sitemap <loc>: ${locs.length} 件`);
  }

  // --- HTML ---
  const htmlFiles = listHtmlFiles(outDir).map((absolutePath) => ({
    absolutePath,
    relativePath: toRelative(absolutePath),
  }));

  if (htmlFiles.length === 0) {
    fail("out/ に HTML が 1 枚もありません。");
  }

  const sealedHtmlFiles = htmlFiles.filter((file) => isSealedHtml(file.relativePath));
  const japaneseHtmlFiles = htmlFiles.filter((file) => !isSealedHtml(file.relativePath));

  if (!localizedRoutesPublished) {
    // vacuous pass ガード: 列挙が壊れて 0 件になると全検査が素通りする。
    if (sealedHtmlFiles.length < MIN_SEALED_HTML_FILES) {
      fail(
        `en/zh の HTML が ${sealedHtmlFiles.length} 枚しか見つかりません（下限 ${MIN_SEALED_HTML_FILES}）。` +
          " out/ が古い / 列挙ロジックが壊れている可能性があります。",
      );
    }

    if (japaneseHtmlFiles.length < MIN_JAPANESE_HTML_FILES) {
      fail(
        `ja 面の HTML が ${japaneseHtmlFiles.length} 枚しか見つかりません（下限 ${MIN_JAPANESE_HTML_FILES}）。`,
      );
    }

    const indexableSealedFiles = sealedHtmlFiles.filter((file) => {
      const html = readFileSync(file.absolutePath, "utf8");

      return !SEALED_ROBOTS_META.test(html);
    });

    if (indexableSealedFiles.length > 0) {
      fail(
        `封印中なのに <meta name="robots" content="noindex, nofollow"> を持たない en/zh HTML が` +
          ` ${indexableSealedFiles.length} 枚あります。` +
          ` 例: ${indexableSealedFiles.slice(0, 5).map((f) => f.relativePath).join(", ")}`,
      );
    }

    // createPageMetadata を経由しない 6 枚は封印が最も漏れやすい。存在確認込みで個別検査する。
    for (const relativePath of METADATA_LITERAL_PAGES) {
      const absolutePath = path.join(outDir, relativePath);

      if (!existsSync(absolutePath)) {
        fail(`封印検査対象の HTML が存在しません: out/${relativePath}`);
        continue;
      }

      if (!SEALED_ROBOTS_META.test(readFileSync(absolutePath, "utf8"))) {
        fail(
          `out/${relativePath} が noindex, nofollow ではありません。` +
            " createLocaleAwareRobots() 経由になっているか確認すること。",
        );
      }
    }

    const leakingJapaneseFiles = japaneseHtmlFiles.filter((file) => {
      const html = readFileSync(file.absolutePath, "utf8");

      return LOCALE_HREF.test(html);
    });

    if (leakingJapaneseFiles.length > 0) {
      fail(
        `ja 面の HTML に en/zh への内部リンクが ${leakingJapaneseFiles.length} 枚残っています。` +
          ` 例: ${leakingJapaneseFiles.slice(0, 5).map((f) => f.relativePath).join(", ")}`,
      );
    }

    console.log(
      `[verify-locale-seal] noindex 検査: ${sealedHtmlFiles.length} 枚 / ` +
        `ja 面リンク検査: ${japaneseHtmlFiles.length} 枚`,
    );
  }

  // --- 過剰封印ガード（封印モード / 解封モードの両方で実行する）---
  for (const relativePath of JAPANESE_INDEXABLE_PAGES) {
    const absolutePath = path.join(outDir, relativePath);

    if (!existsSync(absolutePath)) {
      fail(`ja 面の主要ページが存在しません: out/${relativePath}`);
      continue;
    }

    if (!INDEXABLE_ROBOTS_META.test(readFileSync(absolutePath, "utf8"))) {
      fail(
        `out/${relativePath} が content="index, follow" を保持していません。` +
          " ja 面を巻き添えで封印していないか確認すること。",
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
