import { stat, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("out");
const pagePaths = { ja: "404.html", en: "en/404.html", zh: "zh/404.html" };

// Static, trusted copy only. Do not add viewer input to these documents.
const copy = Object.freeze({
  zh: { lang: 'zh-Hant', title: '找不到頁面', description: '網址可能已更動，或頁面已被移除。請從下方連結繼續學習。',
    skip: '跳至主要內容', home: '/zh', homeLabel: '返回首頁', terms: '/zh/terms', termsLabel: '瀏覽術語', questions: '/zh/questions', questionsLabel: '練習試題' },
  en: { lang: 'en', title: 'Page not found', description: 'The address may have changed, or the page may have been removed. Continue learning with the links below.',
    skip: 'Skip to main content', home: '/en', homeLabel: 'Back to home', terms: '/en/terms', termsLabel: 'Explore terms', questions: '/en/questions', questionsLabel: 'Practice questions' },
  ja: { lang: 'ja', title: 'ページが見つかりません', description: 'URLが変更されたか、ページが削除された可能性があります。下のリンクから学習を続けてください。',
    skip: '本文へ移動', home: '/', homeLabel: 'トップへ戻る', terms: '/terms', termsLabel: '用語集を見る', questions: '/questions', questionsLabel: '模擬問題を解く' },
});

function renderPanel(locale) {
  if (!Object.hasOwn(copy, locale)) throw new RangeError('Unsupported locale');
  const c = copy[locale];
  // All content is static; no request URL or origin error is interpolated into HTML.
  return `<!doctype html>
<html lang="${c.lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${c.title} | AWS Cert Roadmap Lab</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f4f7fb;color:#172b46;font-family:system-ui,sans-serif;line-height:1.65}
main{width:min(42rem,calc(100% - 2rem));margin:clamp(1rem,7vh,5rem) auto;padding:clamp(1.25rem,4vw,3rem);background:white;border:1px solid #d5deeb;border-radius:1.25rem}
.mark{width:4rem;height:4rem;color:#52749b}h1{font-size:clamp(1.5rem,5vw,2rem);line-height:1.4;overflow-wrap:anywhere;margin:.5rem 0 1rem}
.code{font-size:.9rem;letter-spacing:.12em;color:#465b76;margin:.75rem 0}p{max-width:36rem}a{color:#134a7b;text-underline-offset:.2em}
.primary{display:block;width:fit-content;max-width:100%;padding:.75rem 1.25rem;background:#174f7e;color:white;border-radius:.65rem;font-weight:650;text-decoration:none;margin:1.5rem 0 1rem}
nav{display:flex;gap:.5rem 1.5rem;flex-wrap:wrap}nav a{padding:.6rem 0;min-height:44px}
:focus-visible{outline:3px solid #a64b00;outline-offset:4px}.skip{position:absolute;left:1rem;top:-8rem;background:white;padding:.75rem}.skip:focus{top:1rem}
</style></head>
<body><a class="skip" href="#main">${c.skip}</a>
<main id="main" tabindex="-1">
<svg class="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M10 52h44M20 48V12h28l-7 9 7 9H20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
<p class="code">404</p><h1>${c.title}</h1><p>${c.description}</p>
<a href="${c.home}" class="primary">${c.homeLabel}</a>
<nav><a href="${c.terms}">${c.termsLabel}</a><a href="${c.questions}">${c.questionsLabel}</a></nav>
</main></body></html>`;
}

function exportFileFor(href) {
  return href === "/" ? "index.html" : href.slice(1) + ".html";
}

async function requireExport(relativePath) {
  const file = await stat(path.join(outDir, relativePath), { throwIfNoEntry: false });
  if (!file?.isFile()) {
    throw new Error(`Expected static export: out/${relativePath}`);
  }
}

const locales = Object.keys(pagePaths);
await requireExport(pagePaths.ja); // Do not write outside a successful Next export.
for (const locale of locales) {
  const { home, terms, questions } = copy[locale];
  for (const href of [home, terms, questions]) {
    await requireExport(exportFileFor(href));
  }
}
for (const locale of locales) {
  await writeFile(path.join(outDir, pagePaths[locale]), renderPanel(locale) + "\n", "utf8");
}
