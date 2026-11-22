import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { planWeeklyRelease } from './plan-weekly-release.mjs';

const REPOSITORY = 'https://github.com/vincentmango-wen/aws-cert-roadmap-lab.git';
const SHA = /^[a-f0-9]{40}$/u;
const isSha = (value) => typeof value === 'string' && SHA.test(value);

export function readPinnedInputs(event, observed) {
  const { master_sha: master, dev_sha: dev } = event?.inputs ?? {};
  if (!isSha(master) || !isSha(dev)) throw new Error('Supply exact full Git SHAs');
  if (master !== observed?.master || dev !== observed?.dev) throw new Error('Pinned source refs changed or are unavailable');
  return { master, dev };
}

export function summarize(result) {
  if (!['propose', 'hold', 'noop', 'reuse'].includes(result?.decision) || !isSha(result.base)
      || !isSha(result.head) || (result.tree !== null && !isSha(result.tree)) || !Array.isArray(result.changedPaths)) {
    throw new Error('invalid shadow result');
  }
  return [
    '## Read-only release shadow',
    '',
    `- Decision: \`${result.decision}\``,
    `- Source: \`${result.base}\` → \`${result.head}\``,
    `- Candidate tree: \`${result.tree ?? 'unverified'}\``,
    `- ${result.changedPaths.length} changed path(s)`,
    '- Open PR state was not queried; source-only classification.',
    '- Deployment baseline: unknown; not a delivery or merge decision.',
    '- Branch, release, and deployment changes: none.',
    '',
  ].join('\n');
}

function run() {
  const scriptSource = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (!isSha(process.env.GITHUB_SHA) || scriptSource !== process.env.GITHUB_SHA) throw new Error('Unexpected checked-out workflow SHA');
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const remote = execFileSync('git', ['ls-remote', '--exit-code', '--heads', REPOSITORY,
    'refs/heads/master', 'refs/heads/dev'], {
    encoding:'utf8', timeout:30_000, maxBuffer:8192, env:{...process.env,GIT_TERMINAL_PROMPT:'0'},
  });
  const refs = {};
  for (const row of remote.trim().split('\n')) {
    const match = /^([a-f0-9]{40})\trefs\/heads\/(master|dev)$/u.exec(row);
    if (!match || refs[match[2]]) throw new Error('Unexpected remote refs');
    refs[match[2]] = match[1];
  }
  const pins = readPinnedInputs(event, refs);
  if (scriptSource !== pins.master) throw new Error('Must run the pinned master workflow revision');
  if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], {encoding:'utf8'}).trim() !== 'false'
      || execFileSync('git', ['cat-file', '-t', pins.dev], {encoding:'utf8'}).trim() !== 'commit') {
    throw new Error('Complete pinned Git history is unavailable');
  }
  const result = planWeeklyRelease({ repoPath:'.', ...pins, nowUtc:new Date().toISOString() });
  if (['git-evidence-unavailable', 'unresolved-commit', 'invalid-input'].includes(result.reason)) throw new Error('Unable to read the complete pinned source');
  const summary = summarize(result);
  if (process.env.SHADOW_PREFLIGHT === '1') process.stdout.write('Pinned source preflight passed.\n');
  else if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  else process.stdout.write(summary);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) run();
