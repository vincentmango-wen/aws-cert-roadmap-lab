import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const OUT_DIR = path.resolve(process.cwd(), "out");
const CHECK_MODE = process.argv.includes("--check");

const htmlLangByLocale = {
  ja: "ja",
  en: "en",
  zh: "zh",
};

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function collectHtmlFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      const childFiles = await collectHtmlFiles(entryPath);
      files.push(...childFiles);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function detectLocaleFromOutPath(filePath) {
  const relativePath = toPosixPath(path.relative(OUT_DIR, filePath));

  if (relativePath === "en.html" || relativePath.startsWith("en/")) {
    return "en";
  }

  if (relativePath === "zh.html" || relativePath.startsWith("zh/")) {
    return "zh";
  }

  return "ja";
}

function replaceHtmlLang(html, htmlLang, filePath) {
  const htmlTagPattern = /<html\b([^>]*)>/i;
  const htmlTagMatch = html.match(htmlTagPattern);

  if (!htmlTagMatch) {
    throw new Error(`html tag was not found: ${filePath}`);
  }

  const currentHtmlTag = htmlTagMatch[0];
  const currentAttributes = htmlTagMatch[1] ?? "";
  const langAttributePattern = /\slang=(["']).*?\1/i;

  const nextHtmlTag = langAttributePattern.test(currentHtmlTag)
    ? currentHtmlTag.replace(langAttributePattern, ` lang="${htmlLang}"`)
    : `<html lang="${htmlLang}"${currentAttributes}>`;

  return html.replace(htmlTagPattern, nextHtmlTag);
}

async function main() {
  const outDirExists = await pathExists(OUT_DIR);

  if (!outDirExists) {
    throw new Error(
      "out directory was not found. Run `npm run build` before checking html lang.",
    );
  }

  const htmlFiles = await collectHtmlFiles(OUT_DIR);

  if (htmlFiles.length === 0) {
    throw new Error("HTML files were not found in out directory.");
  }

  const mismatches = [];
  let changedCount = 0;

  for (const htmlFile of htmlFiles) {
    const locale = detectLocaleFromOutPath(htmlFile);
    const htmlLang = htmlLangByLocale[locale];
    const currentHtml = await readFile(htmlFile, "utf8");
    const nextHtml = replaceHtmlLang(currentHtml, htmlLang, htmlFile);

    if (currentHtml === nextHtml) {
      continue;
    }

    const relativePath = toPosixPath(path.relative(OUT_DIR, htmlFile));

    if (CHECK_MODE) {
      mismatches.push({
        file: relativePath,
        expectedLang: htmlLang,
      });
      continue;
    }

    await writeFile(htmlFile, nextHtml, "utf8");
    changedCount += 1;
  }

  if (CHECK_MODE && mismatches.length > 0) {
    console.error("html lang check failed.");
    for (const mismatch of mismatches) {
      console.error(
        `- ${mismatch.file}: expected <html lang="${mismatch.expectedLang}">`,
      );
    }
    process.exit(1);
  }

  if (CHECK_MODE) {
    console.log(`html lang check passed. checked ${htmlFiles.length} files.`);
    return;
  }

  console.log(
    `html lang update completed. checked ${htmlFiles.length} files, changed ${changedCount} files.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});