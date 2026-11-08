import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createTask, beginRepair, readStatus, verify, replay, parseVitest, manifest } from './pilot.mjs';

function fixture(t, script = 'console.log("ok")') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aidd-fixture-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const root = path.join(dir, 'repo');
  const bundle = path.join(dir, 'bundle');
  fs.mkdirSync(root);
  execFileSync('git', ['init', '-q', root]);
  fs.writeFileSync(path.join(root, '.gitignore'), 'out/\n');
  fs.writeFileSync(path.join(root, 'source.txt'), 'existing dirty content');
  fs.writeFileSync(path.join(root, 'check.mjs'), script);
  const profile = { node: process.versions.node, protected: ['check.mjs', '.gitignore'], checks: [{ id: 'fixture', args: ['check.mjs'], cwd: '.', timeoutMs: 5000 }], generated: ['out/'] };
  const contract = { id: 'fixture-task', goal: 'Exercise pilot', allowed: ['source.txt', 'new.txt'], humanAcceptance: ['Inspect result'], maxRepairs: 3 };
  return { dir, root, bundle, profile, contract };
}

test('successful checks preserve dirty source and leave human acceptance pending; bundle replays', async t => {
  const f = fixture(t);
  createTask(f);
  assert.equal((await verify(f.bundle, 'baseline')).state, 'BASELINE_READY');
  fs.writeFileSync(path.join(f.root, 'new.txt'), 'untracked task input');
  const result = await verify(f.bundle, 'candidate');
  assert.equal(result.state, 'AUTO_VERIFIED_AWAITING_HUMAN');
  assert.equal(fs.readFileSync(path.join(f.root, 'source.txt'), 'utf8'), 'existing dirty content');
  const dest = path.join(f.dir, 'replay');
  const replayed = await replay(f.bundle, result.run, dest);
  assert.equal(replayed.state, 'AUTO_VERIFIED_AWAITING_HUMAN');
  assert.equal(fs.readFileSync(path.join(dest, 'source', 'new.txt'), 'utf8'), 'untracked task input');
  assert.throws(() => beginRepair(path.join(dest, 'evidence'), { problem: 'fork', hypothesis: 'retry', expected: 'pass' }), /verification-only/i);
});

test('shared repair count persists across runs and blocks fourth attempt', async t => {
  const f = fixture(t); createTask(f);
  for (let n = 1; n <= 3; n++) assert.equal(beginRepair(f.bundle, { problem: 'failure', hypothesis: 'bounded fix', expected: 'pass' }).repairs.length, n);
  assert.throws(() => beginRepair(f.bundle, { problem: 'fourth', hypothesis: 'retry', expected: 'pass' }), /REPAIR_LIMIT/);
  assert.equal(readStatus(f.bundle).repairs.length, 3);
  assert.throws(() => createTask(f), /exist/i);
  assert.throws(() => createTask({ ...f, bundle: path.join(f.dir, 'another-bundle') }), /registered/i);
});

test('protected verifier edits and out-of-scope changes block candidate', async t => {
  const f = fixture(t); createTask(f); await verify(f.bundle, 'baseline');
  fs.writeFileSync(path.join(f.root, 'check.mjs'), 'process.exit(0)');
  assert.equal((await verify(f.bundle, 'candidate')).state, 'NEEDS_DECISION');
});

test('source drift during verification blocks success, generated output does not', async t => {
  const bad = fixture(t, 'import fs from "node:fs"; fs.writeFileSync("source.txt", "changed");');
  createTask(bad);
  assert.equal((await verify(bad.bundle, 'baseline')).state, 'INPUT_DRIFT');
  const good = fixture(t, 'import fs from "node:fs"; fs.mkdirSync("out", {recursive:true}); fs.writeFileSync("out/result", "generated");');
  createTask(good);
  assert.equal((await verify(good.bundle, 'baseline')).state, 'BASELINE_READY');
});

test('nonzero baseline never becomes success and missing evidence invalidates status', async t => {
  const f = fixture(t, 'process.exit(7)'); createTask(f);
  assert.equal((await verify(f.bundle, 'baseline')).state, 'BLOCKED_BASELINE');
  const good = fixture(t); createTask(good);
  const run = await verify(good.bundle, 'baseline');
  fs.unlinkSync(path.join(good.bundle, 'runs', run.run, 'fixture.stdout.log'));
  assert.equal(readStatus(good.bundle).state, 'EVIDENCE_INVALID');
});

test('interrupted verification cannot be silently resumed or reset', async t => {
  const f = fixture(t); createTask(f);
  fs.writeFileSync(path.join(f.bundle, 'active.json'), JSON.stringify({ pid: 999999, run: 'interrupted' }));
  assert.equal(readStatus(f.bundle).state, 'INTERRUPTED');
  await assert.rejects(verify(f.bundle, 'baseline'), /INTERRUPTED/);
});

test('timeout fails closed without claiming process-tree termination', async t => {
  const f = fixture(t, 'setInterval(() => {}, 1000)'); f.profile.checks[0].timeoutMs = 100;
  createTask(f);
  assert.equal((await verify(f.bundle, 'baseline')).state, 'STOP_UNCONFIRMED');
  assert.throws(() => beginRepair(f.bundle, { problem: 'timeout', hypothesis: 'retry', expected: 'pass' }), /STOP_UNCONFIRMED/);
  await assert.rejects(verify(f.bundle, 'baseline'), /STOP_UNCONFIRMED/);
});

test('missing Vitest report preserves after manifest and blocks success', async t => {
  const f = fixture(t); f.profile.checks[0].report = 'vitest'; createTask(f);
  const result = await verify(f.bundle, 'baseline');
  assert.equal(result.state, 'VERIFICATION_BLOCKED');
  assert.ok(fs.existsSync(path.join(f.bundle, 'runs', result.run, 'after.json')));
});

test('source changes after passing evidence invalidate status', async t => {
  const f = fixture(t); createTask(f); await verify(f.bundle, 'baseline');
  fs.writeFileSync(path.join(f.root, 'new.txt'), 'new untracked source');
  assert.equal(readStatus(f.bundle).state, 'INPUT_DRIFT');
});

test('damaged baseline invalidates a later passing candidate status', async t => {
  const f = fixture(t); createTask(f); const base = await verify(f.bundle, 'baseline');
  await verify(f.bundle, 'candidate');
  fs.unlinkSync(path.join(f.bundle, 'runs', base.run, 'identities.json'));
  assert.equal(readStatus(f.bundle).state, 'EVIDENCE_INVALID');
});

test('replay keeps original assertion requirements instead of blessing newly skipped tests', async t => {
  const f = fixture(t);
  const marker = path.join(f.dir, 'external-marker'); fs.writeFileSync(marker, 'present');
  fs.writeFileSync(path.join(f.root, 'check.mjs'), `import fs from 'node:fs'; import path from 'node:path';
    fs.writeFileSync(process.argv[2], JSON.stringify({success:true,testResults:[{name:path.resolve('example.test.ts'),assertionResults:[{fullName:'must execute',status:fs.existsSync(${JSON.stringify(marker)})?'passed':'pending'}]}]}));`);
  f.profile.checks[0].args.push('{report}'); f.profile.checks[0].report = 'vitest';
  createTask(f); const original = await verify(f.bundle, 'baseline');
  assert.equal(original.state, 'BASELINE_READY');
  fs.unlinkSync(marker);
  assert.equal((await replay(f.bundle, original.run, path.join(f.dir, 'replay'))).state, 'VERIFICATION_BLOCKED');
});

test('replay retains tracked inputs that match ignore rules', async t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, '.gitignore'), 'tracked-input.txt\n');
  fs.writeFileSync(path.join(f.root, 'tracked-input.txt'), 'must remain a source input');
  execFileSync('git', ['-C', f.root, 'add', '-f', 'tracked-input.txt']);
  createTask(f); const base = await verify(f.bundle, 'baseline');
  const dest = path.join(f.dir, 'replay');
  await replay(f.bundle, base.run, dest);
  assert.deepEqual(manifest(path.join(dest, 'source'), f.profile), manifest(f.root, f.profile));
});

test('Vitest identity parser blocks empty, missing, duplicate and unexpected skipped assertions', () => {
  const report = status => ({ success: true, testResults: [{ name: '/repo/a.test.ts', assertionResults: [{ fullName: 'suite works', status }] }] });
  const baseline = parseVitest(report('passed'), '/repo');
  assert.throws(() => parseVitest({}, '/repo'), /report/i);
  assert.throws(() => parseVitest({ success: true, testResults: [] }, '/repo'), /empty/i);
  assert.throws(() => parseVitest(report('pending'), '/repo', baseline), /identity|status/i);
  const dup = report('passed'); dup.testResults.push(dup.testResults[0]);
  assert.throws(() => parseVitest(dup, '/repo'), /duplicate/i);
  const skipped = parseVitest(report('pending'), '/repo');
  assert.deepEqual(parseVitest(report('pending'), '/repo', skipped), skipped);
});
