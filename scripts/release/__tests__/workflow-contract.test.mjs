import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { readPinnedInputs, summarize } from '../weekly-shadow.mjs';

const head = 'a'.repeat(40);
const dev = 'b'.repeat(40);
const event = (master_sha = head, dev_sha = dev) => ({ inputs: { master_sha, dev_sha } });

test('manual shadow requires full SHA pins and rejects stale refs without resolving user strings', () => {
  const refs = { master: head, dev };
  assert.deepEqual(readPinnedInputs(event(), refs), refs);
  assert.throws(() => readPinnedInputs(event(), { ...refs, master: 'c'.repeat(40) }), /changed/);
  assert.throws(() => readPinnedInputs(event(head, '$(echo nope)'), refs), /full Git SHAs/);
  assert.throws(() => readPinnedInputs(event('master', dev), refs), /full Git SHAs/);
});

test('report summary never prints untrusted paths or reasons and cannot claim deployment', () => {
  const rendered = summarize({ decision: 'hold', reason: '<untrusted>', base: head, head: dev, tree: null,
    changedPaths: ['\n::error::surprise'], baseline: {state:'unknown'}, mutations:{git:0,github:0,aws:0} });
  assert.match(rendered, /1 changed path/);
  assert.doesNotMatch(rendered, /untrusted|surprise|::error::/);
  assert.match(rendered, /not a delivery or merge decision/);
  assert.throws(() => summarize({ decision: 'invalid' }), /invalid shadow result/);
});

test('workflow source remains manual-only and uses no write permissions or deployment surface', () => {
  const yaml = readFileSync(new URL('../../../.github/workflows/weekly-release-shadow.yml', import.meta.url), 'utf8');
  assert.match(yaml, /^on:\n  workflow_dispatch:/m);
  assert.match(yaml, /^permissions:\n  contents: read$/m);
  assert.match(yaml, /persist-credentials: false/);
  assert.match(yaml, /fetch-depth: 0/);
  assert.match(yaml, /github\.sha/);
  assert.doesNotMatch(yaml, /^\s*(schedule|push|pull_request|pull_request_target|workflow_run|workflow_call|environment|id-token):/m);
  assert.doesNotMatch(yaml, /:\s*write\b|\$\{\{\s*(?:secrets|inputs)\.|configure-aws|\baws\s/);
  for (const command of ['lint','typecheck','build','check:html-lang','check:locale-seal']) assert.ok(yaml.includes('npm run '+command), command);
  assert.ok(yaml.includes('npm test -- --maxWorkers=2'));
});
