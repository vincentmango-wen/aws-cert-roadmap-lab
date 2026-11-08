import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const locales = ['en', 'ja', 'zh'];
const choices = ['A', 'B', 'C', 'D'];
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const text = value => typeof value === 'string' && value.trim().length > 0;
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sorted = values => [...values].sort();
const requireValue = (ok, message) => { if (!ok) throw Error('Content: ' + message); };
const matches = (file, rules) => rules.some(rule => rule.endsWith('/') ? file.startsWith(rule) : file === rule);

export function validateContentContract(contract, profile) {
  if (contract.content === undefined) return;
  const c = contract.content;
  requireValue(c && /^[a-f0-9]{40}$/.test(c.baseCommit), 'full baseCommit SHA required');
  const operations = ['read', 'write', 'verify', 'commit', 'push', 'draft-pr'];
  requireValue(Array.isArray(c.allowedOperations) && c.allowedOperations.includes('verify') &&
    c.allowedOperations.every(x => operations.includes(x)) && new Set(c.allowedOperations).size === c.allowedOperations.length, 'invalid allowed operation');
  requireValue(Array.isArray(c.deliverables) && c.deliverables.length > 0, 'deliverables required');
  const ids = new Set(), files = new Set(), additions = new Set();
  for (const d of c.deliverables) {
    requireValue(text(d.id) && !ids.has(d.id), 'duplicate or missing deliverable ID'); ids.add(d.id);
    requireValue(['article', 'questions'].includes(d.kind), 'unknown deliverable kind');
    requireValue(locales.includes(d.sourceLocale) && Number.isSafeInteger(d.sourceRevision) && d.sourceRevision > 0, 'invalid source revision/locale');
    requireValue(d.locales && equal(sorted(Object.keys(d.locales)), locales), 'all three locales required');
    for (const locale of locales) {
      const version = d.locales[locale], file = version?.path;
      requireValue(version?.sourceRevision === d.sourceRevision, 'stale locale source revision');
      requireValue(text(file) && !file.includes('\\') && !file.includes(':') && !path.isAbsolute(file) &&
        file.split('/').every(part => part && part !== '.' && part !== '..') && !files.has(file), 'unsafe or duplicate deliverable path');
      requireValue(matches(file, contract.allowed) && !matches(file, profile.generated), 'deliverable path outside allowed source scope');
      requireValue(d.kind === 'questions' ? file.endsWith('.json') : /\.mdx?$/.test(file), 'deliverable extension mismatch');
      files.add(file);
    }
    if (d.kind === 'questions') {
      requireValue(Array.isArray(d.addedIds) && d.addedIds.length > 0, 'explicit addedIds required');
      for (const id of d.addedIds) {
        requireValue(text(id) && !additions.has(id), 'duplicate or missing added ID'); additions.add(id);
      }
    }
  }
}

function questionMap(data) {
  requireValue(Array.isArray(data) && data.length > 0, 'nonempty question array required');
  const result = new Map();
  for (const q of data) {
    requireValue(q && text(q.questionId) && !result.has(q.questionId), 'duplicate or missing question ID');
    requireValue(['exam', 'category', 'domain', 'difficulty', 'question', 'explanation', 'practicalNote'].every(key => text(q[key])) && typeof q.published === 'boolean', 'question metadata/text missing');
    requireValue(Array.isArray(q.choices) && q.choices.length === 4 && q.choices.every(c => c && text(c.text)) &&
      equal(sorted(q.choices.map(c => c.choiceId)), choices), 'invalid choice IDs/text');
    requireValue(choices.includes(q.correctChoiceId), 'invalid answer key');
    requireValue(q.choiceExplanations && equal(sorted(Object.keys(q.choiceExplanations)), choices) &&
      Object.values(q.choiceExplanations).every(text), 'missing choice explanation');
    requireValue(Array.isArray(q.officialDocs) && q.officialDocs.length > 0 &&
      q.officialDocs.every(d => text(d?.label) && text(d?.url) && /^https:\/\//.test(d.url)), 'official source references required');
    result.set(q.questionId, q);
  }
  return result;
}

function parity(maps) {
  const reference = maps.zh;
  for (const locale of locales) {
    requireValue(equal(sorted(maps[locale].keys()), sorted(reference.keys())), 'locale question ID sets differ');
    for (const [id, q] of reference) {
      const other = maps[locale].get(id);
      for (const field of ['exam', 'category', 'domain', 'difficulty', 'published', 'correctChoiceId'])
        requireValue(q[field] === other[field], `${id}: locale ${field} mismatch`);
      for (const field of ['relatedServices', 'relatedTerms', 'relatedComparisons', 'tags'])
        requireValue(equal(sorted(q[field] ?? []), sorted(other[field] ?? [])), `${id}: locale ${field} mismatch`);
    }
  }
}

export function captureContentBaseline(root, contract, profile) {
  validateContentContract(contract, profile);
  if (!contract.content) return null;
  const baseCommit = contract.content.baseCommit;
  try {
    execFileSync('git', ['-C', root, 'cat-file', '-e', baseCommit + '^{commit}'], { stdio: 'pipe' });
    execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', baseCommit, 'HEAD'], { stdio: 'pipe' });
  } catch { throw Error('Content: base commit must exist and be an ancestor of HEAD'); }
  const sets = {};
  for (const d of contract.content.deliverables.filter(d => d.kind === 'questions')) {
    const maps = {}, sourceHashes = {};
    for (const locale of locales) {
      let raw;
      try { raw = execFileSync('git', ['-C', root, 'show', `${baseCommit}:${d.locales[locale].path}`], { maxBuffer: 20 * 1024 * 1024, stdio: 'pipe' }); }
      catch { throw Error('Content: baseline question file missing'); }
      maps[locale] = questionMap(JSON.parse(raw)); sourceHashes[locale] = digest(raw);
    }
    parity(maps);
    const ids = sorted(maps.zh.keys());
    requireValue(d.addedIds.every(id => !ids.includes(id)), 'added ID already exists in baseline');
    sets[d.id] = { ids, sourceHashes };
  }
  return { baseCommit, sets };
}

export function verifyContent(root, contract, baseline, phase, manifest) {
  if (!contract.content) return null;
  const report = { baseCommit: baseline.baseCommit, phase, semanticReview: 'pending',
    limitations: ['Structure and answer-key parity only; translation meaning, technical facts, unique answers, visuals and difficulty require independent/human review'], deliverables: [] };
  for (const d of contract.content.deliverables) {
    const maps = {}, versions = {};
    for (const locale of locales) {
      const file = d.locales[locale].path;
      if (d.kind === 'article' && phase === 'baseline' && !fs.existsSync(path.join(root, file))) continue;
      requireValue(Object.hasOwn(manifest, file), 'deliverable missing from source manifest: ' + file);
      const raw = fs.readFileSync(path.join(root, file));
      requireValue(raw.toString('utf8').trim().length > 0, 'empty deliverable: ' + file);
      versions[locale] = { path: file, sourceRevision: d.locales[locale].sourceRevision, sha256: digest(raw) };
      if (d.kind === 'questions') maps[locale] = questionMap(JSON.parse(raw));
    }
    if (d.kind === 'questions') {
      parity(maps);
      const expected = sorted([...baseline.sets[d.id].ids, ...(phase === 'candidate' ? d.addedIds : [])]);
      requireValue(equal(sorted(maps.zh.keys()), expected), 'question IDs must equal baseline plus declared additions for this phase');
    }
    report.deliverables.push({ id: d.id, kind: d.kind, sourceLocale: d.sourceLocale, sourceRevision: d.sourceRevision,
      addedIds: d.kind === 'questions' && phase === 'candidate' ? d.addedIds : [], versions });
  }
  return report;
}
