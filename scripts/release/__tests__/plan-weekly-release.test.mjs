import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { planWeeklyRelease } from '../plan-weekly-release.mjs';

const utc = '2026-11-23T01:17:00Z';
const content = 'frontend/contents/blog/zh/fixture.mdx';
const zero = { git: 0, github: 0, aws: 0 };

function fixture(t) {
  const repoPath = mkdtempSync(join(tmpdir(), 'weekly-release-test-'));
  t.after(() => rmSync(repoPath, { recursive: true }));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: repoPath, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  function commit(changes, message = 'fixture change') {
    for (const [path, text] of Object.entries(changes)) {
      const target = join(repoPath, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, text);
    }
    git('add', '--all');
    git('commit', '--quiet', '--allow-empty', '-m', message);
    return git('rev-parse', 'HEAD');
  }
  git('init', '--initial-branch=master', '--quiet');
  git('config', 'user.name', 'Offline Fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  const master = commit({ [content]: '# initial\n' });
  git('switch', '-c', 'dev');
  const state = () => [git('show-ref'), git('ls-files', '--stage'), git('status', '--porcelain=v1')];
  function plan(dev, extras = {}) {
    const before = state();
    const result = planWeeklyRelease({ repoPath, master, dev, nowUtc: utc, ...extras });
    assert.deepEqual(state(), before);
    assert.deepEqual(result.mutations, zero);
    return result;
  }
  const tree = (sha) => git('rev-parse', sha + '^{tree}');
  const release = (sha, extras = {}) => ({
    base: master, head: sha, tree: tree(sha), createdAt: utc, verificationState: 'verified', ...extras,
  });
  return { master, repoPath, commit, git, plan, release, tree };
}

test('backsynced-master-is-noop', (t) => {
  const f = fixture(t);
  assert.equal(f.plan(f.commit({})).decision, 'noop');
  assert.deepEqual(f.plan(f.master).changedPaths, []);
});

test('one-eligible-edit-is-propose', (t) => {
  const f = fixture(t);
  const dev = f.commit({ [content]: '# next\n' });
  const result = f.plan(dev);
  assert.equal(result.decision, 'propose');
  assert.equal(result.base, f.master);
  assert.equal(result.head, dev);
  assert.equal(result.tree, f.tree(dev));
  assert.deepEqual(result.changedPaths, [content]);
});

test('excluded-and-mixed-hold', (t) => {
  const f = fixture(t);
  for (const path of ['infra/config.yml', '.github/workflows/test.yml', 'backend/app.py',
    'frontend/src/config/site.ts', 'frontend/package.json', 'frontend/contents/blog/.env', 'unknown.txt']) {
    assert.equal(f.plan(f.commit({ [path]: 'excluded\n', [content]: path })).decision, 'hold', path);
  }
});

test('non-regular-or-hostile-paths-hold', (t) => {
  const f = fixture(t);
  const symlink = 'frontend/contents/blog/zh/link.mdx';
  symlinkSync('../../../package.json', join(f.repoPath, symlink));
  assert.equal(f.plan(f.commit({})).decision, 'hold');
  assert.equal(f.plan(f.commit({ ['frontend/contents/blog/zh/malformed\nname.mdx']: 'x' })).decision, 'hold');
  assert.equal(f.plan(f.commit({ ['frontend/contents/blog/zh/malformed.mdx\n']: 'x' })).decision, 'hold');
});

test('diverged-or-conflicted-holds', (t) => {
  const f = fixture(t);
  const dev = f.commit({ [content]: '# dev\n' });
  f.git('switch', 'master');
  const master = f.commit({ [content]: '# master\n' });
  assert.equal(f.plan(dev, { master }).decision, 'hold');
});

test('duplicates-and-overlap', (t) => {
  const f = fixture(t);
  const a = f.commit({ [content]: '# a\n' });
  const b = f.commit({ [content]: '# b\n' });
  assert.equal(f.plan(b, { openRelease: f.release(b) }).decision, 'reuse');
  f.git('switch', '-c', 'side', f.master);
  const side = f.commit({ [content]: '# parallel\n' });
  assert.equal(f.plan(b, { openRelease: f.release(side) }).decision, 'hold');
  assert.notEqual(a, b);
});

test('dev-progress-defers-without-mutating-frozen-head', (t) => {
  const f = fixture(t);
  const a = f.commit({ [content]: '# a\n' });
  const b = f.commit({ ['.github/workflows/task.yml']: 'new unrelated next-batch change' });
  const report = f.plan(b, { openRelease: f.release(a) });
  assert.equal(report.decision, 'reuse');
  assert.equal(report.head, a);
  assert.equal(report.tree, f.tree(a));
  assert.deepEqual(report.changedPaths, [content]);
});

test('base-or-age-stale', (t) => {
  const f = fixture(t);
  const a = f.commit({ [content]: '# a\n' });
  const released = f.release(a);
  for (const details of [
    { nowUtc: '2026-11-30T01:17:00Z' },
    { nowUtc: '2026-11-30T01:17:01Z' },
    { nowUtc: '2026-11-22T01:17:00Z' },
    { openRelease: f.release(a, { tree: f.tree(f.master) }) },
    { openRelease: f.release(a, { verificationState: 'expired' }) },
    { openRelease: f.release(a, { verificationState: 'tampered' }) },
  ]) assert.equal(f.plan(a, { openRelease: released, ...details }).decision, 'hold');
  assert.equal(f.plan(a, { openRelease: released, nowUtc: '2026-11-30T01:16:59Z' }).decision, 'reuse');
  f.git('switch', 'master');
  const master = f.commit({});
  assert.equal(f.plan(a, { master, openRelease: released }).decision, 'hold');
});

test('unknown-last-deployed', (t) => {
  const f = fixture(t);
  const dev = f.commit({ [content]: '# next\n' });
  assert.deepEqual(f.plan(dev).baseline, { state: 'unknown' });
  assert.deepEqual(f.plan(dev, { lastSuccessful: { sha: f.master, tree: f.tree(f.master) } }).baseline,
    { state: 'reported-unverified', sha: f.master, tree: f.tree(f.master) });
});

test('malformed-ref-invalid', (t) => {
  const f = fixture(t);
  for (const value of ['HEAD', '--help', 'f'.repeat(40), f.master.slice(0, 12), f.tree(f.master), null]) {
    assert.equal(f.plan(value).decision, 'hold');
  }
  assert.equal(f.plan(f.master, { nowUtc: '2026-02-30T01:17:00Z' }).decision, 'hold');
});

test('known-release-cannot-be-a-noop-or-historic-unreviewed-tree', (t) => {
  const f = fixture(t);
  const noop = f.commit({});
  const future = f.commit({ [content]: '# later\n' });
  assert.equal(f.plan(future, { openRelease: f.release(noop) }).decision, 'hold');
});

test('known editorial allowlist rejects unrelated runtime and registry-shaped impostors', (t) => {
  const f = fixture(t);
  const known = [
    'frontend/contents/questions/aif-c01.zh.json',
    'frontend/contents/terms/terms.json',
    'frontend/contents/architectures/architectures.en.json',
    'frontend/contents/comparisons/comparisons.ja.json',
    'frontend/contents/architectures/en/fixture.mdx',
    'frontend/public/images/architectures/fixture.zh.svg',
  ];
  assert.deepEqual(f.plan(f.commit(Object.fromEntries(known.map((path) => [path, 'known'])))).changedPaths,
    known.sort());
  assert.equal(f.plan(f.git('rev-parse', 'HEAD')).decision, 'propose');
  for (const path of ['frontend/contents/questions/package.json', 'frontend/contents/questions/aif-c01.fr.json',
    'frontend/contents/blog/zh/new/deep.mdx', 'frontend/contents/comparisons/fr/fixture.mdx',
    'frontend/contents/terms/tsconfig.json', 'frontend/contents/blog/blogPosts.ts']) {
    assert.equal(f.plan(f.commit({ [path]: 'unsupported' })).decision, 'hold', path);
  }
});
