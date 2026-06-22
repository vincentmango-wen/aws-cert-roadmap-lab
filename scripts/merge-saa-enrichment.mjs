#!/usr/bin/env node
// Merge SAA enrichment drafts into saa-c03.ja.json
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const draftFiles = [
  ".drafts/2026-06-22-saa-enrich-batch-1.md",
  ".drafts/2026-06-22-saa-enrich-batch-2.md",
  ".drafts/2026-06-22-saa-enrich-batch-3.md",
];
const targetFile = "frontend/contents/questions/saa-c03.ja.json";

function extractJsonBlocks(md) {
  const blocks = [];
  const re = /```json\s*\n([\s\S]*?)\n```/g;
  let m;
  while ((m = re.exec(md))) {
    blocks.push(m[1]);
  }
  return blocks;
}

const enrichment = new Map();
for (const f of draftFiles) {
  const full = path.join(ROOT, f);
  const md = fs.readFileSync(full, "utf8");
  const blocks = extractJsonBlocks(md);
  if (blocks.length === 0) throw new Error(`No JSON block in ${f}`);
  // Use the first block (the data block); subsequent blocks if any are ignored
  for (const block of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch (e) {
      // Skip non-array blocks (e.g. examples)
      continue;
    }
    if (!Array.isArray(parsed)) continue;
    for (const item of parsed) {
      if (item && item.questionId && item.practicalNote && item.officialDocs) {
        enrichment.set(item.questionId, {
          practicalNote: item.practicalNote,
          officialDocs: item.officialDocs,
        });
      }
    }
  }
}

console.log(`Extracted enrichment for ${enrichment.size} questions`);

const targetPath = path.join(ROOT, targetFile);
const questions = JSON.parse(fs.readFileSync(targetPath, "utf8"));

let added = 0;
let missing = [];
for (const q of questions) {
  const e = enrichment.get(q.questionId);
  if (e) {
    q.practicalNote = e.practicalNote;
    q.officialDocs = e.officialDocs;
    added++;
  } else {
    missing.push(q.questionId);
  }
}

console.log(`Added enrichment to ${added}/${questions.length} questions`);
if (missing.length) {
  console.log(`Missing: ${missing.join(", ")}`);
}

fs.writeFileSync(targetPath, JSON.stringify(questions, null, 2) + "\n", "utf8");
console.log(`Wrote ${targetFile}`);

// Verify
const verify = JSON.parse(fs.readFileSync(targetPath, "utf8"));
const allHave = verify.every((q) => q.practicalNote && q.officialDocs);
console.log(`Verify all have practicalNote+officialDocs: ${allHave}`);
if (!allHave) {
  const bad = verify.filter((q) => !q.practicalNote || !q.officialDocs).map((q) => q.questionId);
  console.log(`Bad: ${bad.join(", ")}`);
  process.exit(1);
}
