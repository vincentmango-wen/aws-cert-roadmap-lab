import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const frontend = fileURLToPath(new URL("../../", import.meta.url));
const generate = path.join(frontend, "scripts", "write-not-found-artifacts.mjs");
const setHtmlLang = path.join(frontend, "scripts", "set-html-lang.mjs");
const panels = [
  ["404.html", "ja", "ページが見つかりません", ["/", "/terms", "/questions"]],
  ["en/404.html", "en", "Page not found", ["/en", "/en/terms", "/en/questions"]],
  ["zh/404.html", "zh-Hant", "找不到頁面", ["/zh", "/zh/terms", "/zh/questions"]],
];
const destinations = [
  "index.html", "terms.html", "questions.html",
  "en.html", "en/terms.html", "en/questions.html",
  "zh.html", "zh/terms.html", "zh/questions.html",
];

function prepare(t) {
  const cwd = mkdtempSync(path.join(tmpdir(), "not-found-artifacts-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  for (const file of ["404.html", ...destinations]) {
    const target = path.join(cwd, "out", file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, '<html lang="ja"><head></head><body>Next export fixture</body></html>');
  }
  return cwd;
}

function invoke(script, cwd, ...args) {
  return execFileSync(process.execPath, [script, ...args], { cwd, stdio: "pipe" });
}

test("export produces reachable locale-correct 404 documents without script or remote resources", (t) => {
  const cwd = prepare(t);
  invoke(generate, cwd);
  invoke(setHtmlLang, cwd);
  invoke(setHtmlLang, cwd, "--check");
  for (const [file, lang, heading, links] of panels) {
    const html = readFileSync(path.join(cwd, "out", file), "utf8");
    assert.ok(html.startsWith(`<!doctype html>\n<html lang="${lang}">`), file);
    assert.ok(html.includes(`<h1>${heading}</h1>`), file);
    assert.equal((html.match(/<h1>/g) ?? []).length, 1, file);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(html, /<main id="main" tabindex="-1">/);
    assert.match(html, /<svg[^>]+aria-hidden="true"[^>]+focusable="false"/);
    assert.deepEqual([...html.matchAll(/<a\b[^>]* href="([^"]+)"/g)].map((m) => m[1]), ["#main", ...links]);
    assert.match(html, /class="primary"/);
    assert.match(html, /:focus-visible/);
    assert.doesNotMatch(html, /<script\b|@font-face|@import|https?:\/\/|<link\b/i);
  }
  const before = panels.map(([file]) => readFileSync(path.join(cwd, "out", file), "utf8"));
  invoke(generate, cwd);
  assert.deepEqual(panels.map(([file]) => readFileSync(path.join(cwd, "out", file), "utf8")), before);
  assert.match(readFileSync(path.join(cwd, "out", "zh.html"), "utf8"), /^<html lang="zh">/);
});

test("missing exported destinations stop the build before replacing the fallback", (t) => {
  const cwd = prepare(t);
  rmSync(path.join(cwd, "out", "en", "questions.html"));
  assert.throws(() => invoke(generate, cwd), (error) => {
    assert.match(String(error.stderr), /en\/questions\.html/);
    return true;
  });
  assert.match(readFileSync(path.join(cwd, "out", "404.html"), "utf8"), /Next export fixture/);
});
