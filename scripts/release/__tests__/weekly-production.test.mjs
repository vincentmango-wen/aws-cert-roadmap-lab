import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { releaseWindow, qualify, claimWindow, newestSuccess, isApproved } from '../weekly-production.mjs';

const repo = 'vincentmango-wen/aws-cert-roadmap-lab';
const merged = 'a'.repeat(40), head = 'b'.repeat(40), previous = 'c'.repeat(40);
const date = '2026-11-29T14:00:00Z';
const event = { action: 'closed', number: 42, pull_request: { merged: true, merged_at: date,
  merge_commit_sha: merged, head: { ref: 'dev', repo: { full_name: repo }, sha: head },
  base: { ref: 'master', repo: { full_name: repo } } } };
const candidate = { event, repository: repo, ref: 'refs/heads/master', sha: merged, now: date,
  parents: [previous, head], master: merged, paths: ['frontend/contents/example.mdx'],
  approval: true, checks: true, attempt: '1' };

test('Sunday 22:00–22:29 Taipei only, including date rollover', () => {
  assert.equal(releaseWindow(date), '2026-11-29');
  assert.equal(releaseWindow('2026-11-29T14:29:59Z'), '2026-11-29');
  for (const t of ['2026-11-29T13:59:59Z','2026-11-29T14:30:00Z','2026-11-27T14:00:00Z','invalid','2026-02-30T14:00:00Z']) assert.equal(releaseWindow(t), null);
  assert.equal(releaseWindow('2027-01-03T14:00:00Z'), '2027-01-03');
});

test('only a current, reviewed, green, same-repo dev release with real frontend changes qualifies', () => {
  assert.equal(qualify(candidate)?.window, '2026-11-29');
  for (const override of [{ repository: 'fork/repo' }, { ref: 'refs/heads/dev' }, { sha: previous },
    { master: previous }, { parents: [previous] }, { parents: [previous, merged] },
    { approval: false }, { checks: false }, { paths: [] }, { paths: ['docs/a.md'] },
    { now: '2026-12-06T14:00:00Z' }, { attempt: '2' }, { event: { ...event, action: 'synchronize' } },
    { event: { ...event, pull_request: { ...event.pull_request, merged: false } } },
    { event: { ...event, pull_request: { ...event.pull_request, head: { ...event.pull_request.head, ref: 'fix/376' } } } },
    { event: { ...event, pull_request: { ...event.pull_request, head: { ...event.pull_request.head, repo: { full_name: 'other/repo' } } } } }]) {
    assert.equal(qualify({ ...candidate, ...override }), null);
  }
});

test('only the latest same-repo dev PR CI for the reviewed SHA and time interval can pass', () => {
  const opened = '2026-11-29T12:00:00Z', ran = '2026-11-29T13:00:00Z';
  const ok = { id: 5, event: 'pull_request', head_sha: head, head_branch: 'dev', head_repository: { full_name: repo },
    created_at: ran, updated_at: ran, pull_requests: [{ number: 42 }], status: 'completed', conclusion: 'success' };
  const pass = (runs, sha = head) => newestSuccess(runs, 42, sha, opened, date);
  assert.equal(pass([ok]), true);
  assert.equal(pass([{ ...ok, pull_requests: [] }]), true);
  assert.equal(pass([ok, { ...ok, id: 6, status: 'in_progress', conclusion: null }]), false);
  for (const override of [{ conclusion: 'failure' }, { event: 'push' }, { head_branch: 'feature' },
    { head_repository: { full_name: 'other/repo' } }, { pull_requests: [{ number: 43 }] },
    { updated_at: '2026-11-29T14:01:00Z' }, { created_at: '2026-11-29T11:59:59Z' }]) {
    assert.equal(pass([{ ...ok, ...override }]), false);
  }
  assert.equal(pass([ok], merged), false);
});

test('the merger must have approved the exact head before merge without unresolved changes requested', () => {
  const review = { id: 12, user: { login: 'maintainer' }, commit_id: head, state: 'APPROVED',
    author_association: 'OWNER', submitted_at: '2026-11-29T13:00:00Z' };
  const approve = reviews => isApproved(reviews, head, 'contributor', 'maintainer', date);
  assert.equal(approve([review]), true);
  for (const override of [{ commit_id: merged }, { state: 'DISMISSED' }, { author_association: 'NONE' },
    { submitted_at: '2026-11-29T14:01:00Z' }, { user: { login: 'contributor' } }]) {
    assert.equal(approve([{ ...review, ...override }]), false);
  }
  assert.equal(approve([review, { ...review, id: 13, state: 'CHANGES_REQUESTED', user: { login: 'other' } }]), false);
});

test('same calendar window and another candidate compete for one atomic claim; uncertainty never proceeds', async () => {
  const tags = new Set();
  const create = async (ref) => tags.has(ref) ? 422 : (tags.add(ref), 201);
  const claims = await Promise.all([claimWindow(create, '2026-11-29', merged), claimWindow(create, '2026-11-29', head)]);
  assert.deepEqual(claims.sort(), [false, true]);
  assert.equal(await claimWindow(async () => 403, '2026-11-29', merged), false);
  await assert.rejects(claimWindow(async () => { throw Error('unknown response'); }, '2026-11-29', merged));
});

test('workflow has no manual/push deployment path; schedule has no write credentials', () => {
  const y = readFileSync(new URL('../../../.github/workflows/deploy-frontend.yml', import.meta.url), 'utf8');
  assert.match(y, /cron: '0 14 \* \* 0'/);
  assert.match(y, /pull_request:\n    types: \[closed\]/);
  assert.doesNotMatch(y, /^  (push|workflow_dispatch):/m);
  const [readOnly, writer] = y.split(/^  deploy-frontend:/m);
  assert.doesNotMatch(readOnly, /id-token: write|contents: write|aws s3|AWS_ROLE_ARN/);
  assert.match(writer, /environment:[\s\S]*aws-production/);
  assert.match(writer, /AWS_WEEKLY_RELEASE_ENABLED/);
  assert.ok(writer.indexOf('weekly-production.mjs claim') < writer.indexOf('configure-aws-credentials'));
  assert.ok(writer.indexOf('configure-aws-credentials') < writer.indexOf('aws s3 sync'));
});
