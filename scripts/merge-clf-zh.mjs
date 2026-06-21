#!/usr/bin/env node
// Merge CLF ZH drafts (batch-1..5) into clf-c02.zh.json
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const draftFiles = [
  ".drafts/2026-06-22-clf-zh-batch-1.md",
  ".drafts/2026-06-22-clf-zh-batch-2.md",
  ".drafts/2026-06-22-clf-zh-batch-3.md",
  ".drafts/2026-06-22-clf-zh-batch-4.md",
  ".drafts/2026-06-22-clf-zh-batch-5.md",
];
const targetFile = "frontend/contents/questions/clf-c02.zh.json";

function extractJsonBlocks(md) {
  const blocks = [];
  const re = /```json\s*\n([\s\S]*?)\n```/g;
  let m;
  while ((m = re.exec(md))) {
    blocks.push(m[1]);
  }
  return blocks;
}

const merged = [];
for (const f of draftFiles) {
  const full = path.join(ROOT, f);
  const md = fs.readFileSync(full, "utf8");
  const blocks = extractJsonBlocks(md);
  if (blocks.length === 0) throw new Error(`No JSON block in ${f}`);
  let parsedArr = null;
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block);
      if (Array.isArray(parsed)) {
        parsedArr = parsed;
        break;
      }
    } catch (e) {
      // skip
    }
  }
  if (!parsedArr) throw new Error(`No JSON array block in ${f}`);
  console.log(`[${f}] ${parsedArr.length} questions`);
  merged.push(...parsedArr);
}

// Verify length === 50
if (merged.length !== 50) {
  throw new Error(`Expected 50 questions, got ${merged.length}`);
}

// Verify clf-001..clf-050 sequential
for (let i = 0; i < 50; i++) {
  const expected = `clf-${String(i + 1).padStart(3, "0")}`;
  if (merged[i].questionId !== expected) {
    throw new Error(`Index ${i}: expected ${expected}, got ${merged[i].questionId}`);
  }
}

// Simplified Chinese leakage check
const simplifiedChars = ["软", "实", "数", "网", "话", "电"];
const serialized = JSON.stringify(merged);
const hits = [];
for (const ch of simplifiedChars) {
  const count = (serialized.match(new RegExp(ch, "g")) || []).length;
  if (count > 0) hits.push(`${ch}: ${count}`);
}
if (hits.length > 0) {
  console.warn(`[WARN] Simplified Chinese chars detected: ${hits.join(", ")}`);
} else {
  console.log("[OK] No simplified Chinese chars detected");
}

const outPath = path.join(ROOT, targetFile);
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + "\n", "utf8");
console.log(`[OK] Wrote ${merged.length} questions to ${targetFile}`);
