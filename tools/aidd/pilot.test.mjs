import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import childProcess from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createTask, beginRepair, readStatus, verify, replay, parseVitest, manifest } from './pilot.mjs';
import * as pilot from './pilot.mjs';

test('ignored traversal avoids root tmp directory warnings and preserves literal root names', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, '.gitignore'), '/tmp/\nroot*/\n-leading/\nfrontend/tmp/\n');
  const retained = ['root[1]/cache.txt', 'root space/cache.txt', '-leading/cache.txt', 'frontend/tmp/cache.txt'];
  for (const name of ['tmp/sentinel.txt', ...retained]) {
    fs.mkdirSync(path.dirname(path.join(f.root, name)), { recursive: true });
    fs.writeFileSync(path.join(f.root, name), 'synthetic traversal fixture');
  }
  fs.symlinkSync(path.join(f.dir, 'absent-target'), path.join(f.root, 'tmp', 'broken-directory'), process.platform === 'win32' ? 'junction' : 'dir');
  const control = childProcess.spawnSync('git', ['-C', f.root, 'ls-files', '--others', '--ignored', '--exclude-standard', '-z'], { maxBuffer: 20 * 1024 * 1024 });
  assert.ifError(control.error);
  assert.equal(control.status, 0);
  assert.ok(control.stdout.toString().includes('tmp/sentinel.txt'));
  if (process.platform === 'win32') assert.match(control.stderr.toString(), /tmp\/broken-directory/, 'control must detect actual traversal of the broken junction');
  const run = childProcess.execFileSync;
  const scans = [];
  const spy = t.mock.method(childProcess, 'execFileSync', (command, args, options) => {
    if (command !== 'git' || !args.includes('ls-files')) return run(command, args, options);
    const result = childProcess.spawnSync(command, args, { ...options, stdio: 'pipe' });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr.toString());
    scans.push({ ignored: args.includes('--ignored'), stdout: result.stdout.toString(), stderr: result.stderr.toString() });
    return result.stdout;
  });
  syncBuiltinESMExports();
  try {
    manifest(f.root, f.profile);
    assert.equal(scans.length, 2);
    console.info('Git traversal probe', JSON.stringify({ platform: process.platform, controlStderr: control.stderr.toString(), candidateStderr: scans.map(scan => scan.stderr) }));
    for (const scan of scans) assert.equal(scan.stderr, '', 'neither Git query may visit the excluded broken tmp junction');
    const ignored = scans.find(scan => scan.ignored).stdout.split('\0').filter(Boolean);
    for (const name of retained) assert.ok(ignored.includes(name), name);
    assert.equal(ignored.some(name => name.startsWith('tmp/')), false);
  } finally {
    spy.mock.restore();
    syncBuiltinESMExports();
  }
});

test('ignored traversal retains dotenv under special literal root names', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, '.gitignore'), '.env\n');
  for (const name of ['root[1]', 'root space', '-leading']) {
    const dir = path.join(f.root, name);
    fs.mkdirSync(dir);
    const file = path.join(dir, '.env');
    fs.writeFileSync(file, 'SYNTHETIC_ONLY=1');
    assert.throws(() => manifest(f.root, f.profile), /Unrecorded dotenv input/, name);
    fs.unlinkSync(file);
  }
});

test('ignored enumeration excludes root tmp before filtering but retains nested and similar paths', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, '.gitignore'), '/tmp/\n/tmp-other/\nfrontend/tmp/\n');
  for (const name of ['tmp/store/cache.txt', 'tmp/deep/.env', 'tmp-other/cache.txt', 'frontend/tmp/cache.txt']) {
    fs.mkdirSync(path.dirname(path.join(f.root, name)), { recursive: true });
    fs.writeFileSync(path.join(f.root, name), 'synthetic fixture');
  }
  const runGit = childProcess.execFileSync;
  const ignoredResults = [];
  const spy = t.mock.method(childProcess, 'execFileSync', (command, args, options) => {
    const result = runGit(command, args, options);
    if (command === 'git' && args.includes('--ignored')) ignoredResults.push(result.toString().split('\0').filter(Boolean));
    return result;
  });
  syncBuiltinESMExports();
  try {
    const inputs = manifest(f.root, f.profile);
    assert.ok(Object.hasOwn(inputs, 'source.txt'));
    assert.equal(ignoredResults.length, 1);
    assert.equal(ignoredResults[0].some(name => name.startsWith('tmp/')), false, 'root tmp must be absent from raw Git output, not merely filtered afterwards');
    assert.ok(ignoredResults[0].includes('tmp-other/cache.txt'));
    assert.ok(ignoredResults[0].includes('frontend/tmp/cache.txt'));
  } finally {
    spy.mock.restore();
    syncBuiltinESMExports();
  }
});

test('ignored enumeration retains non-tmp dotenv protection at exact root and nested boundaries', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, '.gitignore'), '.env\n.env.*\n');
  for (const name of ['.env', 'tmp-other/.env', 'nested/tmp/.env', 'frontend/tmp/.env.local']) {
    const file = path.join(f.root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'SYNTHETIC_FIXTURE_ONLY=1');
    assert.throws(() => manifest(f.root, f.profile), /Unrecorded dotenv input/, name);
    fs.unlinkSync(file);
  }
  fs.writeFileSync(path.join(f.root, '.env.example'), 'SYNTHETIC_EXAMPLE=');
  assert.doesNotThrow(() => manifest(f.root, f.profile));
});

test('ignored enumeration still rejects hidden frontend sources including nested tmp', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, '.gitignore'), 'frontend/\n');
  for (const name of ['frontend/hidden.ts', 'frontend/tmp/hidden.ts', 'frontend/tmp-other/hidden.json']) {
    const file = path.join(f.root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'synthetic fixture');
    assert.throws(() => manifest(f.root, f.profile), /Ignored source inputs require review/, name);
    fs.unlinkSync(file);
  }
});

test('ignored enumeration does not hide tracked ignored sources or sensitive inputs', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, '.gitignore'), '/tmp/\n*.pem\n');
  fs.mkdirSync(path.join(f.root, 'tmp'));
  fs.writeFileSync(path.join(f.root, 'tmp', 'tracked.txt'), 'tracked fixture');
  execFileSync('git', ['-C', f.root, 'add', '-f', 'tmp/tracked.txt']);
  assert.ok(Object.hasOwn(manifest(f.root, f.profile), 'tmp/tracked.txt'), 'tracked query must remain unchanged');
  fs.writeFileSync(path.join(f.root, 'synthetic.pem'), 'NOT A REAL CERTIFICATE OR KEY');
  execFileSync('git', ['-C', f.root, 'add', '-f', 'synthetic.pem']);
  assert.throws(() => manifest(f.root, f.profile), /Sensitive input refused/);
});

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

function contentFixture(t, collections) {
  const f = fixture(t);
  const sample = id => ({ questionId: id, exam: 'SAA-C03', category: 'Resilient', domain: '2.2', difficulty: 'easy', published: false,
    question: 'Original scenario', choices: ['A', 'B', 'C', 'D'].map(choiceId => ({ choiceId, text: 'Choice ' + choiceId })),
    correctChoiceId: 'B', explanation: 'Reason', choiceExplanations: { A: 'No', B: 'Yes', C: 'No', D: 'No' }, practicalNote: 'Test recovery', officialDocs: [{ label: 'AWS', url: 'https://docs.aws.amazon.com/example' }] });
  const files = {};
  for (const locale of ['zh', 'ja', 'en']) {
    files[locale] = { path: `content/questions.${locale}.json`, sourceRevision: 1 };
    fs.mkdirSync(path.join(f.root, 'content'), { recursive: true });
    fs.writeFileSync(path.join(f.root, files[locale].path), JSON.stringify(collections?.[locale] || [sample('old-1')]));
  }
  execFileSync('git', ['-C', f.root, '-c', 'core.autocrlf=false', 'add', '.']);
  execFileSync('git', ['-C', f.root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'baseline']);
  f.contract.allowed.push('content/');
  f.contract.content = { baseCommit: execFileSync('git', ['-C', f.root, 'rev-parse', 'HEAD']).toString().trim(), allowedOperations: ['read', 'write', 'verify'],
    deliverables: [{ id: 'questions', kind: 'questions', sourceLocale: 'zh', sourceRevision: 1, locales: files, addedIds: ['new-1'] },
      { id: 'article', kind: 'article', sourceLocale: 'zh', sourceRevision: 1, locales: Object.fromEntries(['zh', 'ja', 'en'].map(locale => [locale, { path: `content/article.${locale}.md`, sourceRevision: 1 }])) }] };
  f.add = () => {
    for (const locale of ['zh', 'ja', 'en']) {
      fs.writeFileSync(path.join(f.root, files[locale].path), JSON.stringify([sample('old-1'), sample('new-1')]));
      fs.writeFileSync(path.join(f.root, `content/article.${locale}.md`), '# Original article\n\nText');
    }
  };
  return f;
}

test('real repository question source references are accepted without rewriting product data', async t => {
  for (const exam of ['clf-c02', 'saa-c03']) {
    const collections = Object.fromEntries(['zh', 'ja', 'en'].map(locale => [locale,
      JSON.parse(fs.readFileSync(new URL(`../../frontend/contents/questions/${exam}.${locale}.json`, import.meta.url)))]));
    const f = contentFixture(t, collections); createTask(f);
    assert.equal((await verify(f.bundle, 'baseline')).state, 'BASELINE_READY');
  }
});

test('content additions use frozen Git baseline IDs and leave semantic acceptance pending on replay', async t => {
  const f = contentFixture(t); createTask(f);
  assert.equal((await verify(f.bundle, 'baseline')).state, 'BASELINE_READY');
  f.add();
  const result = await verify(f.bundle, 'candidate');
  assert.equal(result.state, 'AUTO_VERIFIED_AWAITING_HUMAN');
  const report = JSON.parse(fs.readFileSync(path.join(f.bundle, 'runs', result.run, 'content.json')));
  assert.deepEqual(report.deliverables[0].addedIds, ['new-1']);
  assert.equal(report.semanticReview, 'pending');
  assert.equal(report.baseCommit, f.contract.content.baseCommit);
  assert.equal((await replay(f.bundle, result.run, path.join(f.dir, 'content-replay'))).state, 'AUTO_VERIFIED_AWAITING_HUMAN');
  fs.appendFileSync(path.join(f.root, 'content/article.ja.md'), '\nchanged');
  assert.equal(readStatus(f.bundle).state, 'INPUT_DRIFT');
});

test('content contract rejects stale translations, unsafe paths, reused IDs and invalid base before registration', t => {
  const mutations = [
    c => { c.content.deliverables[0].locales.ja.sourceRevision = 0; },
    c => { delete c.content.deliverables[0].locales.en; },
    c => { c.content.deliverables[0].locales.en.path = '../escape.json'; },
    c => { c.content.deliverables[0].addedIds = ['old-1']; },
    c => { c.content.deliverables[0].addedIds = ['new-1', 'new-1']; },
    c => { c.content.baseCommit = '0'.repeat(40); },
    c => { c.content.allowedOperations = ['deploy']; },
  ];
  for (const mutate of mutations) {
    const f = contentFixture(t); mutate(f.contract);
    assert.throws(() => createTask(f), /content|base|revision|locale|path|operation|existing|duplicate/i);
    assert.equal(fs.existsSync(f.bundle), false);
  }
});

test('content replay preserves its effective phase through a second replay generation', async t => {
  for (const phase of ['baseline', 'candidate']) {
    const f = contentFixture(t); createTask(f);
    let source = await verify(f.bundle, 'baseline');
    if (phase === 'candidate') { f.add(); source = await verify(f.bundle, 'candidate'); }
    const child = path.join(f.dir, 'child');
    assert.equal((await replay(f.bundle, source.run, child)).state, 'AUTO_VERIFIED_AWAITING_HUMAN');
    const childBundle = path.join(child, 'evidence');
    const childTask = JSON.parse(fs.readFileSync(path.join(childBundle, 'task.json')));
    // These runs have wrapper phases opposite to their effective content phase.
    const selected = phase === 'candidate' ? childTask.baseline : childTask.latest;
    const result = await replay(childBundle, selected.run, path.join(f.dir, 'grandchild'));
    assert.equal(result.state, 'AUTO_VERIFIED_AWAITING_HUMAN', phase);
    assert.equal(JSON.parse(fs.readFileSync(path.join(f.dir, 'grandchild/evidence/runs', result.run, 'content.json'))).phase, phase);
  }
});

test('content validation rejects missing, duplicate, replaced and undeclared added IDs', async t => {
  for (const mode of ['missing', 'duplicate', 'replacement', 'extra']) {
    const f = contentFixture(t); createTask(f); await verify(f.bundle, 'baseline'); f.add();
    const file = path.join(f.root, 'content/questions.en.json');
    const qs = JSON.parse(fs.readFileSync(file));
    if (mode === 'missing') qs.pop();
    if (mode === 'duplicate') qs.push(qs[1]);
    if (mode === 'replacement') qs.shift();
    if (mode === 'extra') qs.push({ ...qs[1], questionId: 'undeclared' });
    fs.writeFileSync(file, JSON.stringify(qs));
    assert.equal((await verify(f.bundle, 'candidate')).state, 'VERIFICATION_BLOCKED', mode);
  }
});

test('content validation rejects malformed choices, answer drift, empty explanations and missing articles', async t => {
  for (const mode of ['choice', 'answer', 'explanation', 'article']) {
    const f = contentFixture(t); createTask(f); await verify(f.bundle, 'baseline'); f.add();
    const file = path.join(f.root, 'content/questions.ja.json');
    const qs = JSON.parse(fs.readFileSync(file));
    if (mode === 'choice') qs[1].choices[3].choiceId = 'A';
    if (mode === 'answer') qs[1].correctChoiceId = 'A';
    if (mode === 'explanation') qs[1].choiceExplanations.C = '';
    if (mode === 'article') fs.unlinkSync(path.join(f.root, 'content/article.en.md'));
    fs.writeFileSync(file, JSON.stringify(qs));
    assert.equal((await verify(f.bundle, 'candidate')).state, 'VERIFICATION_BLOCKED', mode);
  }
});

test('CLI selects a reviewed contract and protects its source path; traversal is rejected', t => {
  const f = contentFixture(t);
  const selected = 'reviewed.json';
  fs.writeFileSync(path.join(f.root, selected), JSON.stringify(f.contract));
  const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
  const result = JSON.parse(execFileSync(process.execPath, [cli, 'init', f.bundle, f.root, selected], { stdio: 'pipe' }));
  assert.equal(result.state, 'CREATED');
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.bundle, 'contract.json'))).id, f.contract.id);
  assert.ok(JSON.parse(fs.readFileSync(path.join(f.bundle, 'profile.json'))).protected.includes(selected));
  const other = path.join(f.dir, 'outside-bundle');
  assert.throws(() => execFileSync(process.execPath, [cli, 'init', other, f.root, '../reviewed.json'], { stdio: 'pipe' }), /relative path/);
  assert.equal(fs.existsSync(other), false);
});

test('content baseline tampering invalidates evidence; baseline rejects premature additions', async t => {
  const f = contentFixture(t); createTask(f); f.add();
  assert.equal((await verify(f.bundle, 'baseline')).state, 'VERIFICATION_BLOCKED');
  const file = path.join(f.bundle, 'content-baseline.json');
  const data = JSON.parse(fs.readFileSync(file)); data.sets.questions.ids.push('invented');
  fs.writeFileSync(file, JSON.stringify(data));
  assert.equal(readStatus(f.bundle).state, 'EVIDENCE_INVALID');
});

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
  const helper = fixture(t);
  fs.mkdirSync(path.join(helper.root, '__tests__'));
  fs.writeFileSync(path.join(helper.root, '__tests__', 'article-contract.ts'), 'original helper');
  helper.contract.allowed.push('__tests__/');
  createTask(helper); await verify(helper.bundle, 'baseline');
  fs.writeFileSync(path.join(helper.root, '__tests__', 'article-contract.ts'), 'weakened helper');
  assert.equal((await verify(helper.bundle, 'candidate')).state, 'NEEDS_DECISION');
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

test('reviewed rebaseline retains task identity, all repairs and original evidence', async t => {
  const f = fixture(t); createTask(f);
  const original = await verify(f.bundle, 'baseline');
  for (let i = 0; i < 3; i++) beginRepair(f.bundle, { problem: 'fixture', hypothesis: 'bounded', expected: 'pass' });
  fs.writeFileSync(path.join(f.root, 'new.txt'), 'reviewed addition');
  const review = pilot.prepareRebaseline(f.bundle, f.contract, 'Reviewed fixture change');
  const result = pilot.rebaseline(f.bundle, review);
  assert.equal(result.state, 'CREATED');
  assert.equal(result.repairs.length, 3);
  assert.equal(result.revisions.length, 1);
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.bundle, 'contract.json'))).id, 'fixture-task');
  assert.ok(fs.existsSync(path.join(f.bundle, 'runs', original.run, 'seal.json')));
  assert.equal((await verify(f.bundle, 'baseline')).state, 'BASELINE_READY');
  assert.throws(() => beginRepair(f.bundle, { problem: 'fourth', hypothesis: 'retry', expected: 'pass' }), /REPAIR_LIMIT/);
  fs.unlinkSync(path.join(f.bundle, 'runs', original.run, 'fixture.stdout.log'));
  assert.equal(readStatus(f.bundle).state, 'EVIDENCE_INVALID');
});

test('rebaseline rejects stale reviews, omitted changes, changed identity and unsafe states', async t => {
  const f = fixture(t); createTask(f); await verify(f.bundle, 'baseline');
  fs.writeFileSync(path.join(f.root, 'new.txt'), 'one');
  const review = pilot.prepareRebaseline(f.bundle, f.contract, 'review');
  const originalTask = fs.readFileSync(path.join(f.bundle, 'task.json'), 'utf8');
  for (const invalid of [{ ...f.contract, allowed: 'source.txt' }, { ...f.contract, humanAcceptance: 'review' }, { ...f.contract, allowed: [''] }]) {
    assert.throws(() => pilot.prepareRebaseline(f.bundle, invalid, 'review'), /Contract/);
    assert.equal(fs.readFileSync(path.join(f.bundle, 'task.json'), 'utf8'), originalTask);
    assert.equal(fs.existsSync(path.join(f.bundle, 'active.json')), false);
  }
  for (const modified of [
    { ...review, previousTaskHash: 'stale' }, { ...review, sourceHash: 'stale' },
    { ...review, changes: [] }, { ...review, contract: { ...f.contract, id: 'reset' } },
    { ...review, contract: { ...f.contract, maxRepairs: 4 } },
  ]) assert.throws(() => pilot.rebaseline(f.bundle, modified));
  fs.writeFileSync(path.join(f.root, 'new.txt'), 'two');
  assert.throws(() => pilot.rebaseline(f.bundle, review), /review|source|change/i);
  fs.writeFileSync(path.join(f.bundle, 'active.json'), '{}');
  assert.throws(() => pilot.rebaseline(f.bundle, review), /INTERRUPTED/);
  fs.unlinkSync(path.join(f.bundle, 'active.json'));
  const taskFile = path.join(f.bundle, 'task.json');
  const state = JSON.parse(fs.readFileSync(taskFile));
  for (const altered of [{ ...state, state: 'STOP_UNCONFIRMED' }, { ...state, replayedFrom: {} }]) {
    fs.writeFileSync(taskFile, JSON.stringify(altered));
    assert.throws(() => pilot.prepareRebaseline(f.bundle, f.contract, 'review'), /STOP_UNCONFIRMED|verification-only/);
  }
});

test('rebaseline interrupted configuration switch is reported with its active latch', async t => {
  const f = fixture(t); createTask(f);
  fs.writeFileSync(path.join(f.bundle, 'active.json'), JSON.stringify({ operation: 'rebaseline' }));
  fs.writeFileSync(path.join(f.bundle, 'contract.json'), '{}');
  const status = readStatus(f.bundle);
  assert.equal(status.state, 'INTERRUPTED');
  assert.match(status.reason, /drift/i);
});

test('rebaseline assertion retention rejects deletion, skip, merged and unknown renames', () => {
  const previous = { old: 'passed', second: 'passed', existingSkip: 'pending' };
  const actual = { renamed: 'passed', second: 'passed', existingSkip: 'pending', added: 'passed' };
  assert.doesNotThrow(() => pilot.retainAssertions(actual, previous, { old: 'renamed' }));
  for (const [next, replacements] of [
    [{ ...actual, renamed: 'pending' }, { old: 'renamed' }],
    [{ second: 'passed', existingSkip: 'pending' }, {}],
    [{ ...actual, added: 'pending' }, { old: 'renamed' }],
    [actual, { old: 'renamed', second: 'renamed' }],
    [actual, { unknown: 'renamed' }], [actual, { old: '' }],
  ]) assert.throws(() => pilot.retainAssertions(next, previous, replacements));
});

test('rebaseline integrates renamed assertions and cannot discard inherited requirements on another revision', async t => {
  const f = fixture(t, `import fs from 'node:fs'; import path from 'node:path';
    fs.writeFileSync(process.argv[2], JSON.stringify({success:true,testResults:[{name:path.resolve('example.test.ts'),assertionResults:JSON.parse(fs.readFileSync('new.txt'))}]}));`);
  f.profile.checks[0].report = 'vitest'; f.profile.checks[0].args.push('{report}');
  fs.writeFileSync(path.join(f.root, 'new.txt'), JSON.stringify([{fullName:'old',status:'passed'}]));
  createTask(f); assert.equal((await verify(f.bundle,'baseline')).state,'BASELINE_READY');
  const next = [{fullName:'renamed',status:'passed'},{fullName:'added',status:'passed'}];
  fs.writeFileSync(path.join(f.root,'new.txt'),JSON.stringify(next));
  const review = pilot.prepareRebaseline(f.bundle,f.contract,'Reviewed rename and new assertion');
  review.assertionReplacements = {fixture:{'example.test.ts::old':'example.test.ts::renamed'}};
  assert.equal(pilot.rebaseline(f.bundle,review).state,'CREATED');
  assert.throws(()=>pilot.prepareRebaseline(f.bundle,f.contract,'Cannot reset pending baseline'),/successful baseline/);
  assert.equal((await verify(f.bundle,'baseline')).state,'BASELINE_READY');
  pilot.rebaseline(f.bundle,pilot.prepareRebaseline(f.bundle,f.contract,'Second reviewed revision'));
  next[0].status='pending'; fs.writeFileSync(path.join(f.root,'new.txt'),JSON.stringify(next));
  assert.equal((await verify(f.bundle,'baseline')).state,'VERIFICATION_BLOCKED');
  assert.throws(()=>pilot.prepareRebaseline(f.bundle,f.contract,'Cannot reset failing requirements'),/successful baseline/);
});
