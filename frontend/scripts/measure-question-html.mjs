/**
 * 模擬問題詳細ページ (out/questions/{clf,saa}-NNN.html) について
 * 「クローラーが見える可視テキスト」を計測し、thin content の再発を検知する。
 *
 * 背景: 2026-08-02 の AdSense 落選理由「有用性の低いコンテンツ」。
 * 解説 (explanation / choiceExplanations / practicalNote / officialDocs) が
 * `isSubmitted` ゲートに隠れて静的 HTML の DOM に出力されていなかったことが主因。
 * 一度直しても再びゲートの内側へ戻れば無言で thin content に戻るため、
 * ビルド成果物そのものを検査するゲートとして本スクリプトを置く。
 *
 * 使い方:
 *   node scripts/measure-question-html.mjs            # 検査モード (違反があれば exit 1)
 *   node scripts/measure-question-html.mjs --report   # 実測値の人間可読レポート (常に exit 0)
 *
 * 実行前に `npm run build` が必要 (out/ を読む)。
 *
 * 注意: 可視テキストの絶対値は空白正規化の方法で数十字ぶれる。
 * 他所で計測した絶対値と突き合わせず、必ず本スクリプトで before/after を測ること。
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const OUT_DIR = path.resolve(process.cwd(), "out");
const CONTENTS_DIR = path.resolve(process.cwd(), "contents/questions");
const REPORT_MODE = process.argv.includes("--report");

/** ja の設問 SSoT。検査モードの verbatim 包含チェックに使う。 */
const JA_QUESTION_SOURCES = ["clf-c02.ja.json", "saa-c03.ja.json"];

/** 完了条件 B: ja 全ページの可視テキスト下限。 */
const MIN_VISIBLE_CHARS = 1500;
/** 完了条件 B: ja 全ページの boilerplate 比率上限 (未満であること)。 */
const MAX_BOILERPLATE_RATIO = 0.4;

/**
 * officialDocs の allowlist。
 *
 * SSoT は `src/lib/official-doc.ts` の `ALLOWED_PREFIXES`。
 * TypeScript を .mjs から import できないためロジックのみ複製している。
 * allowlist を増やす場合は両方を更新すること。
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
 * HTML から head/script/style/noscript/svg/コメントを除去し、
 * タグ除去 → エンティティ復元 → 空白正規化して可視テキストを返す。
 *
 * `<script>` を除去するのは、RSC flight payload (self.__next_f.push) の
 * 文字列リテラルを「クローラーに見えているテキスト」と数えないため。
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

/** JSON 側の改行・連続空白と HTML 側のインデントを同じ土俵に載せる。 */
function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

/** 同一グループ内の全文字列に共通する接頭辞長 + 接尾辞長を boilerplate とみなす。 */
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

/** `questions/clf-001.html` 形式 (= 詳細ページ) だけを拾い、locale を判定する。 */
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

/** 静的 HTML に verbatim で載っていなければならないフィールドを列挙する。 */
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

/** locale ごとに boilerplate を算出し、ページ行に merge する。 */
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
    // `open` は属性としてのみ検出する。`\bopen\b` だと Tailwind の `group-open:` バリアント
    // （class="group-open:rotate-180" 等）にも一致して偽陽性で CI を落とすため、
    // 直前の空白と直後の属性境界を必須にしている。
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
