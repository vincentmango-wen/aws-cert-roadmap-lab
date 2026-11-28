import { readFileSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = 'vincentmango-wen/aws-cert-roadmap-lab';
const SHA = /^[a-f0-9]{40}$/u;
const WINDOW = /^\d{4}-\d{2}-\d{2}$/u;
const format = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
  weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

export function releaseWindow(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value)) return null;
  const instant = new Date(value);
  if (!Number.isFinite(+instant) || instant.toISOString() !== value.replace(/(\d{2}:\d{2}:\d{2})Z$/u, '$1.000Z')) return null;
  const p = Object.fromEntries(format.formatToParts(instant).map(x => [x.type, x.value]));
  return p.weekday === 'Sun' && p.hour === '22' && Number(p.minute) < 30 ? [p.year, p.month, p.day].join('-') : null;
}

function identity({ event, repository, ref, sha, now, attempt }) {
  const p = event?.pull_request;
  const window = releaseWindow(p?.merged_at);
  if (repository !== REPO || ref !== 'refs/heads/master' || event?.action !== 'closed' ||
      p?.merged !== true || p?.base?.ref !== 'master' || p?.head?.ref !== 'dev' ||
      p?.head?.repo?.full_name !== REPO || p?.base?.repo?.full_name !== REPO ||
      !Number.isSafeInteger(event.number) || event.number < 1 || !SHA.test(p?.head?.sha) ||
      !SHA.test(sha) || sha !== p.merge_commit_sha || attempt !== '1' ||
      !window || window !== releaseWindow(now)) return null;
  return { sha, window, number: event.number, head: p.head.sha };
}

export function qualify(input) {
  const candidate = identity(input);
  if (!candidate || input.master !== candidate.sha || input.parents?.length !== 2 ||
      !SHA.test(input.parents[0]) || input.parents[1] !== candidate.head ||
      !input.paths?.some(path => path.startsWith('frontend/')) ||
      input.approval !== true || input.checks !== true) return null;
  return candidate;
}

export function newestSuccess(runs, number, sha, openedAt, mergedAt) {
  const opened = Date.parse(openedAt), merged = Date.parse(mergedAt);
  const run = runs.filter(r => r.event === 'pull_request' && r.head_sha === sha &&
    r.head_branch === 'dev' && r.head_repository?.full_name === REPO &&
    Date.parse(r.created_at) >= opened && Date.parse(r.created_at) <= merged &&
    Array.isArray(r.pull_requests) &&
    (!r.pull_requests.length || r.pull_requests.some(p => p.number === number)))
    .sort((a, b) => b.id - a.id)[0];
  return run?.status === 'completed' && run?.conclusion === 'success' && Date.parse(run.updated_at) <= merged;
}

export function isApproved(reviews, head, author, merger, mergedAt) {
  const latest = new Map();
  for (const r of [...reviews].sort((a, b) => a.id - b.id)) {
    const user = r.user?.login;
    if (user && user !== author && Date.parse(r.submitted_at) <= Date.parse(mergedAt) &&
        ['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(r.state)) latest.set(user, r);
  }
  return latest.get(merger)?.state === 'APPROVED' &&
    latest.get(merger)?.commit_id === head &&
    ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(latest.get(merger)?.author_association) &&
    ![...latest.values()].some(r => r.state === 'CHANGES_REQUESTED' && r.commit_id === head);
}

export async function claimWindow(create, window, sha) {
  if (!WINDOW.test(window) || !SHA.test(sha)) return false;
  return await create('refs/tags/aws-weekly-release/' + window, sha) === 201;
}

const COMPARE_FIRST_PAGE = '/compare/master...dev?page=1&per_page=1';

async function api(path, json, request = fetch) {
  const r = await request('https://api.github.com/repos/' + REPO + path, {
    method: json ? 'POST' : 'GET',
    headers: { authorization: 'Bearer ' + process.env.GH_TOKEN,
      accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: json ? JSON.stringify(json) : undefined, redirect: 'error',
    signal: AbortSignal.timeout(15_000),
  });
  if (json) return r.status;
  // GitHub's compare file inventory is on page one (max 300); Link paginates commits only.
  // Other evidence (reviews/checks) still stops on incomplete pagination.
  if (!r.ok || (path !== COMPARE_FIRST_PAGE && r.headers.get('link')?.includes('rel="next"')))
    throw new Error('GitHub evidence incomplete: HTTP ' + r.status);
  return r.json();
}

export async function inspectCandidate(request = fetch) {
  const { files } = await api(COMPARE_FIRST_PAGE, undefined, request);
  if (!Array.isArray(files) || files.some(file => typeof file?.filename !== 'string')) return 'inconclusive';
  if (files.some(file => file.filename.startsWith('frontend/'))) return 'pending';
  return files.length >= 300 ? 'inconclusive' : 'none-observed';
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
const report = line => appendFileSync(process.env.GITHUB_STEP_SUMMARY, line + '\n');
const output = line => appendFileSync(process.env.GITHUB_OUTPUT, line + '\n');

async function run(mode) {
  if (process.env.GITHUB_REPOSITORY !== REPO || !process.env.GH_TOKEN) throw new Error('Untrusted repository or unavailable token');
  if (mode === 'prepare') {
    if (process.env.GITHUB_EVENT_NAME !== 'schedule' || process.env.GITHUB_REF !== 'refs/heads/master' ||
        !releaseWindow(new Date().toISOString())) return report('Outside the Sunday release window; no action.');
    report('Source preview only. This does not verify the served version; reconcile the last successful production evidence before skipping.');
    const candidate = await inspectCandidate();
    report({
      pending: 'Frontend changes observed. A maintainer must open/review the dev → master release PR; no deployment started.',
      'none-observed': 'No frontend changes observed in this preview; no deployment started.',
      inconclusive: 'Changed-file evidence is missing or at the GitHub cap. Check the exact Git revisions separately; no deployment started.',
    }[candidate]);
    return;
  }
  if (!['gate', 'claim'].includes(mode) || process.env.GITHUB_EVENT_NAME !== 'pull_request') throw new Error('Unexpected release entry point');
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const input = { event, repository: process.env.GITHUB_REPOSITORY, ref: process.env.GITHUB_REF,
    sha: process.env.GITHUB_SHA, now: new Date().toISOString(), attempt: process.env.GITHUB_RUN_ATTEMPT };
  const c = identity(input);
  if (!c) {
    if (mode === 'gate') return report('Not an eligible Sunday dev → master merge; no deployment.');
    throw new Error('Release window closed or invalid release event');
  }
  if (git('rev-parse', 'HEAD').trim() !== c.sha) throw new Error('Checkout does not match the merged revision');
  const parents = git('show', '-s', '--format=%P', c.sha).trim().split(' ');
  if (parents.length !== 2 || parents[1] !== c.head) throw new Error('A standard merge commit from the reviewed dev head is required');
  const paths = git('diff', '--name-only', '-z', '--no-renames', parents[0], c.sha, '--').split('\0').filter(Boolean);
  if (!paths.some(p => p.startsWith('frontend/'))) {
    if (mode === 'gate') return report('No frontend changes in the merge; no deployment.');
    throw new Error('No frontend changes');
  }
  const needsAidd = paths.some(p => p.startsWith('tools/aidd/') || p === 'docs/aidd/task.json' || p === '.github/workflows/aidd-ci.yml');
  const ci = name => api('/actions/workflows/' + name + '/runs?event=pull_request&head_sha=' + c.head + '&per_page=100');
  const [pull, reviews, frontend, aidd] = await Promise.all([api('/pulls/' + c.number),
    api('/pulls/' + c.number + '/reviews?per_page=100'), ci('ci.yml'),
    needsAidd ? ci('aidd-ci.yml') : Promise.resolve(null)]);
  if (pull.merged !== true || pull.merge_commit_sha !== c.sha || pull.head?.sha !== c.head ||
      pull.merged_at !== event.pull_request.merged_at) throw new Error('Pull request identity changed');
  const master = (await api('/git/ref/heads/master')).object?.sha;
  input.now = new Date().toISOString();
  const passed = qualify({ ...input, parents, paths, master,
    approval: isApproved(reviews, c.head, pull.user?.login, pull.merged_by?.login, pull.merged_at),
    checks: newestSuccess(frontend.workflow_runs, c.number, c.head, pull.created_at, pull.merged_at) &&
      (!needsAidd || newestSuccess(aidd.workflow_runs, c.number, c.head, pull.created_at, pull.merged_at)) });
  if (!passed) {
    if (mode === 'gate') return report('Approval, checks, current master or window not verified; no deployment.');
    throw new Error('Release evidence changed; no deployment');
  }
  if (mode === 'gate') {
    report('Eligible merged revision. Production remains subject to the activation flag and protected environment.');
    return output('eligible=true');
  }
  if (process.env.WEEKLY_RELEASE_ENABLED !== 'true' ||
      !await claimWindow((ref, sha) => api('/git/refs', { ref, sha }), c.window, c.sha)) {
    throw new Error('Release disabled or window already claimed/unavailable; no deployment');
  }
  report('Claimed the weekly slot: ' + c.window + '. Never delete this marker to retry automatically.');
  // Recheck after claiming. A changed head or a closed window burns the slot, rather than publishing stale output.
  if ((await api('/git/ref/heads/master')).object?.sha !== c.sha || releaseWindow(new Date().toISOString()) !== c.window)
    throw new Error('Master or release window changed after claim; no deployment');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run(process.argv[2]).catch(error => { console.error(error.message); process.exitCode = 1; });
}
