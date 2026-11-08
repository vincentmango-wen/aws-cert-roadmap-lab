/**
 * Measure crawler-visible text in practice-question detail pages (out/questions/{clf,saa}-NNN.html) to
 * detect thin-content regressions.
 *
 * Background: the 2026-08-02 AdSense rejection cited low-value content. Explanations (explanation /
 * choiceExplanations / practicalNote / officialDocs) were hidden behind the isSubmitted gate and absent
 * from the static HTML DOM. Inspect the build artifacts so moving them behind that gate cannot silently
 * reintroduce the defect.
 *
 * Usage:
 *   node scripts/measure-question-html.mjs           # Check mode: exit 1 on violations.
 *   node scripts/measure-question-html.mjs --report  # Human-readable measurements: always exit 0.
 * Run npm run build first; this script reads out/.
 * Whitespace normalization can shift absolute text counts by dozens of characters. Use this script for
 * both before/after measurements rather than comparing counts from other tools.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const OUT_DIR = path.resolve(process.cwd(), "out");
const CONTENTS_DIR = path.resolve(process.cwd(), "contents/questions");
const REPORT_MODE = process.argv.includes("--report");

/**
 * Japanese question source of truth, used for verbatim inclusion checks in check mode.
 */
const JA_QUESTION_SOURCES = ["clf-c02.ja.json", "saa-c03.ja.json"];

/**
 * Acceptance criterion B: minimum visible text on every Japanese page.
 */
const MIN_VISIBLE_CHARS = 1500;
/**
 * Acceptance criterion B: exclusive upper bound on boilerplate ratio for every Japanese page.
 */
const MAX_BOILERPLATE_RATIO = 0.4;

/**
 * officialDocs allowlist. The source of truth is ALLOWED_PREFIXES in src/lib/official-doc.ts. Only the
 * logic is duplicated because .mjs cannot import TypeScript here. Update both copies when expanding the
 * allowlist.
 */
const ALLOWED_OFFICIAL_DOC_PREFIXES = [
  "https://aws.amazon.com/",
  "https://docs.aws.amazon.com/",
];

function isValidOfficialDocUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_OFFICIAL_DOC_PREFIXES.some((prefix) =>
      url.startsWith(prefix),
    );
  } catch {
    return false;
  }
}

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

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

/**
 * Remove head/script/style/noscript/svg and comments from HTML, then strip tags, decode entities and
 * normalize whitespace to obtain visible text. Removing scripts prevents RSC flight payload
 * (self.__next_f.push) string literals from being counted as crawler-visible text.
 */
function extractVisibleText(html) {
  let text = html;
  text = text.replace(/<head[\s\S]*?<\/head>/gi, " ");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/<[^>]+>/g, " ");
  return normalizeWhitespace(decodeHtmlEntities(text));
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&");
}

/**
 * Normalize JSON newlines/repeated spaces and HTML indentation consistently.
 */
function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Treat the common prefix length plus common suffix length of all strings in a group as boilerplate.
 */
function commonPrefixLength(strings) {
  if (strings.length < 2) return 0;
  const limit = Math.min(...strings.map((s) => s.length));

  for (let i = 0; i < limit; i += 1) {
    const char = strings[0][i];
    if (!strings.every((s) => s[i] === char)) return i;
  }

  return limit;
}

function commonSuffixLength(strings) {
  if (strings.length < 2) return 0;
  const limit = Math.min(...strings.map((s) => s.length));

  for (let i = 1; i <= limit; i += 1) {
    const char = strings[0][strings[0].length - i];
    if (!strings.every((s) => s[s.length - i] === char)) return i - 1;
  }

  return limit;
}

async function collectHtmlFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "_next") continue;
      files.push(...(await collectHtmlFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

/**
 * Select only detail pages such as questions/clf-001.html and determine their locale.
 */
function toQuestionPage(filePath) {
  const relativePath = toPosixPath(path.relative(OUT_DIR, filePath));
  const match = relativePath.match(
    /^(?:(en|zh)\/)?questions\/((?:clf|saa)-\d+)\.html$/,
  );

  if (!match) return null;

  return {
    file: relativePath,
    locale: match[1] ?? "ja",
    questionId: match[2],
  };
}

async function loadJaQuestions() {
  const byId = new Map();

  for (const fileName of JA_QUESTION_SOURCES) {
    const filePath = path.join(CONTENTS_DIR, fileName);
    const questions = JSON.parse(await readFile(filePath, "utf8"));

    for (const question of questions) {
      byId.set(question.questionId, question);
    }
  }

  return byId;
}

/**
 * List fields that must appear verbatim in static HTML.
 */
function expectedVerbatimFields(question) {
  const fields = [];

  if (question.explanation) {
    fields.push({ name: "explanation", value: question.explanation });
  }

  if (question.practicalNote) {
    fields.push({ name: "practicalNote", value: question.practicalNote });
  }

  for (const [choiceId, value] of Object.entries(
    question.choiceExplanations ?? {},
  )) {
    fields.push({ name: `choiceExplanations.${choiceId}`, value });
  }

  for (const doc of question.officialDocs ?? []) {
    if (!isValidOfficialDocUrl(doc.url)) continue;
    fields.push({ name: `officialDocs.label(${doc.url})`, value: doc.label });
  }

  const correctChoice = (question.choices ?? []).find(
    (choice) => choice.choiceId === question.correctChoiceId,
  );

  if (correctChoice) {
    fields.push({
      name: `choices.${question.correctChoiceId}.text`,
      value: correctChoice.text,
    });
  }

  return fields;
}

/**
 * Calculate boilerplate per locale and merge it into the page rows.
 */
function buildGroups(pages) {
  const groups = new Map();

  for (const page of pages) {
    if (!groups.has(page.locale)) groups.set(page.locale, []);
    groups.get(page.locale).push(page);
  }

  const result = [];

  for (const [locale, items] of [...groups.entries()].sort()) {
    const sorted = [...items].sort((a, b) =>
      a.questionId.localeCompare(b.questionId),
    );
    const texts = sorted.map((item) => item.text);
    const boilerplateChars =
      sorted.length > 1
        ? commonPrefixLength(texts) + commonSuffixLength(texts)
        : 0;

    const rows = sorted.map((item) => ({
      ...item,
      boilerplateChars,
      uniqueChars: Math.max(0, item.chars - boilerplateChars),
      boilerplateRatio: item.chars > 0 ? boilerplateChars / item.chars : 1,
    }));

    result.push({ locale, boilerplateChars, rows });
  }

  return result;
}

function formatPercent(ratio) {
  return `${(ratio * 100).toFixed(1)}%`;
}

function printReport(groups) {
  console.log(`out: ${OUT_DIR}`);
  console.log(
    `question detail pages: ${groups.reduce((sum, g) => sum + g.rows.length, 0)}`,
  );

  const headers = ["locale", "pages", "avg", "min", "max", "boiler", "unique", "boiler%"];
  const widths = [8, 7, 8, 8, 8, 8, 8, 9];
  const line = (cells) => cells.map((c, i) => String(c).padEnd(widths[i])).join("");

  console.log("");
  console.log("== summary ==");
  console.log(line(headers));
  console.log("-".repeat(widths.reduce((a, b) => a + b, 0)));

  for (const group of groups) {
    const chars = group.rows.map((row) => row.chars);
    const avg = Math.round(chars.reduce((a, b) => a + b, 0) / chars.length);
    console.log(
      line([
        group.locale,
        group.rows.length,
        avg,
        Math.min(...chars),
        Math.max(...chars),
        group.boilerplateChars,
        Math.max(0, avg - group.boilerplateChars),
        formatPercent(avg > 0 ? group.boilerplateChars / avg : 1),
      ]),
    );
  }

  const pageHeaders = ["file", "chars", "boiler", "unique", "boiler%"];
  const pageWidths = [34, 9, 9, 9, 9];
  const pageLine = (cells) =>
    cells.map((c, i) => String(c).padEnd(pageWidths[i])).join("");

  for (const group of groups) {
    console.log("");
    console.log(`== pages (${group.locale}) ==`);
    console.log(pageLine(pageHeaders));
    console.log("-".repeat(pageWidths.reduce((a, b) => a + b, 0)));

    for (const row of group.rows) {
      console.log(
        pageLine([
          row.file,
          row.chars,
          row.boilerplateChars,
          row.uniqueChars,
          formatPercent(row.boilerplateRatio),
        ]),
      );
    }
  }
}

function checkThresholds(group, violations) {
  for (const row of group.rows) {
    if (row.chars < MIN_VISIBLE_CHARS) {
      violations.push(
        `${row.file}: visible text ${row.chars} chars (expected >= ${MIN_VISIBLE_CHARS})`,
      );
    }

    if (row.boilerplateRatio >= MAX_BOILERPLATE_RATIO) {
      violations.push(
        `${row.file}: boilerplate ratio ${formatPercent(row.boilerplateRatio)} (expected < ${formatPercent(MAX_BOILERPLATE_RATIO)})`,
      );
    }
  }
}

function checkVerbatim(group, questionsById, violations) {
  for (const row of group.rows) {
    const question = questionsById.get(row.questionId);

    if (!question) {
      violations.push(`${row.file}: questionId is missing from contents JSON`);
      continue;
    }

    for (const field of expectedVerbatimFields(question)) {
      if (row.text.includes(normalizeWhitespace(field.value))) continue;
      violations.push(
        `${row.file}: ${field.name} is not present in the static HTML`,
      );
    }
  }
}

function checkDetails(pages, jaPages, violations) {
  for (const page of jaPages) {
    if (/<details[\s>]/i.test(page.html)) continue;
    violations.push(`${page.file}: <details> element was not found`);
  }

  for (const page of pages) {
    // Detect open only as an attribute. A word-boundary match also catches Tailwind group-open: variants
    // such as class="group-open:rotate-180", causing false-positive CI failures.
    // Require preceding whitespace and a following attribute boundary.
    if (!/<details\b[^>]*?\sopen(?=[\s>=/])/i.test(page.html)) continue;
    violations.push(
      `${page.file}: <details open> must not be emitted (explanation must ship collapsed)`,
    );
  }
}

async function main() {
  if (!(await pathExists(OUT_DIR))) {
    throw new Error(
      "out directory was not found. Run `npm run build` before measuring question html.",
    );
  }

  const htmlFiles = await collectHtmlFiles(OUT_DIR);
  const pages = [];

  for (const htmlFile of htmlFiles) {
    const meta = toQuestionPage(htmlFile);
    if (!meta) continue;

    const html = await readFile(htmlFile, "utf8");
    const text = extractVisibleText(html);
    pages.push({ ...meta, html, text, chars: text.length });
  }

  if (pages.length === 0) {
    throw new Error(
      "question detail pages were not found in out directory. Run `npm run build` first.",
    );
  }

  const groups = buildGroups(pages);

  if (REPORT_MODE) {
    printReport(groups);
    return;
  }

  const jaGroup = groups.find((group) => group.locale === "ja");

  if (!jaGroup) {
    throw new Error("ja question detail pages were not found in out directory.");
  }

  const questionsById = await loadJaQuestions();
  const violations = [];

  checkVerbatim(jaGroup, questionsById, violations);
  checkThresholds(jaGroup, violations);
  checkDetails(
    pages,
    pages.filter((page) => page.locale === "ja"),
    violations,
  );

  const renderedJaIds = new Set(jaGroup.rows.map((row) => row.questionId));

  for (const questionId of questionsById.keys()) {
    if (renderedJaIds.has(questionId)) continue;
    violations.push(`questions/${questionId}.html: page was not generated`);
  }

  if (violations.length > 0) {
    console.error("question html check failed.");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    console.error(
      `\n${violations.length} violation(s). Run \`node scripts/measure-question-html.mjs --report\` for the measured numbers.`,
    );
    process.exit(1);
  }

  console.log(
    `question html check passed. checked ${jaGroup.rows.length} ja pages (boilerplate ${jaGroup.boilerplateChars} chars).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
