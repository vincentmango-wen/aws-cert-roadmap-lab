import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const SHA = /^[0-9a-f]{40}$/u;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MDX = /^frontend\/contents\/(?:architectures|blog|comparisons)\/(?:ja|en|zh)\/[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/u;
const BANK = /^frontend\/contents\/questions\/(?:clf-c02|saa-c03|aif-c01)\.(?:ja|en|zh)\.json$/u;
const REGISTRY = /^(?:frontend\/contents\/(?:architectures\/architectures|comparisons\/comparisons)\.(?:ja|en|zh)\.json|frontend\/contents\/terms\/terms(?:\.(?:ja|en|zh))?\.json)$/u;
const DIAGRAM = /^frontend\/public\/images\/architectures\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\.(?:ja|en|zh))?\.svg$/u;
const READ_ENV = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')));
Object.assign(READ_ENV, { GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0',
  GIT_NO_REPLACE_OBJECTS: '1', GIT_NO_LAZY_FETCH: '1', LC_ALL: 'C' });

function utcMillis(value) {
  if (typeof value !== 'string' || !ISO_UTC.test(value)) return NaN;
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return NaN;
  const normalized = new Date(ms).toISOString();
  return value.endsWith('.000Z') || value.length === 24
    ? (normalized === value ? ms : NaN)
    : (normalized === value.replace(/Z$/u, '.000Z') ? ms : NaN);
}

function isSha(value) {
  return typeof value === 'string' && SHA.test(value);
}

/** Offline classifier only. Inputs describe pinned observations, never grant authorization. */
export function planWeeklyRelease({ repoPath, master, dev, nowUtc, openRelease = null, lastSuccessful = null } = {}) {
  const base = isSha(master) ? master : null;
  const defaultHead = isSha(dev) ? dev : null;
  let baseline = { state: 'unknown' };
  const report = (decision, reason, head = defaultHead, tree = null, changedPaths = []) => ({
    decision, reason, base, head, tree, changedPaths, baseline,
    mutations: { git: 0, github: 0, aws: 0 },
  });
  const now = utcMillis(nowUtc);
  if (typeof repoPath !== 'string' || !repoPath || !base || !defaultHead || !Number.isFinite(now)) {
    return report('hold', 'invalid-input');
  }
  const cwd = resolve(repoPath);
  const git = (...argv) => spawnSync('git', ['--no-optional-locks', ...argv], {
    cwd, env: READ_ENV, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 15_000,
  });
  const read = (...argv) => {
    const result = git(...argv);
    if (result.status !== 0) throw new Error('git-read');
    return result.stdout;
  };
  const commit = (sha) => isSha(sha) && git('cat-file', '-t', sha).stdout?.trim() === 'commit';
  const treeOf = (sha) => read('rev-parse', sha + '^{tree}').trim();
  const ancestor = (a, b) => {
    const result = git('merge-base', '--is-ancestor', a, b);
    if (result.status !== 0 && result.status !== 1) throw new Error('git-ancestry');
    return result.status === 0;
  };
  const classify = (sha) => {
    const raw = read('diff', '--raw', '-z', '--no-renames', '--no-ext-diff', '--no-textconv',
      '--ignore-submodules=none', base, sha, '--');
    const fields = raw ? raw.split('\0').slice(0, -1) : [];
    const changedPaths = [];
    let eligible = true;
    for (let i = 0; i < fields.length; i += 2) {
      const meta = /^:(000000|100644) (000000|100644) [0-9a-f]+ [0-9a-f]+ [AMD]$/u.test(fields[i]);
      const path = fields[i + 1];
      if (!path) throw new Error('git-diff-format');
      changedPaths.push(path);
      // Exact published file families only. Module/config and unclassified files need separate review.
      const supported = [MDX, BANK, REGISTRY, DIAGRAM].some((rule) => rule.test(path));
      if (!meta || !supported) eligible = false;
    }
    changedPaths.sort();
    return { changedPaths, eligible };
  };

  try {
    if (!commit(base) || !commit(defaultHead)) return report('hold', 'unresolved-commit');
    if (lastSuccessful && commit(lastSuccessful.sha) && isSha(lastSuccessful.tree)
        && treeOf(lastSuccessful.sha) === lastSuccessful.tree) {
      baseline = { state: 'reported-unverified', sha: lastSuccessful.sha, tree: lastSuccessful.tree };
    }
    if (!ancestor(base, defaultHead)) return report('hold', 'master-not-dev-ancestor');
    if (openRelease !== null) {
      const created = utcMillis(openRelease?.createdAt);
      if (openRelease?.base !== base || !commit(openRelease.head)
          || !['pending', 'verified'].includes(openRelease.verificationState)
          || !Number.isFinite(created) || created > now || now - created >= WEEK_MS) {
        return report('hold', 'open-release-stale-or-unverified');
      }
      const head = openRelease.head;
      const tree = treeOf(head);
      if (openRelease.tree !== tree || !ancestor(base, head) || !ancestor(head, defaultHead)) {
        return report('hold', 'open-release-overlap-or-identity-mismatch');
      }
      const { changedPaths, eligible } = classify(head);
      if (!eligible || !changedPaths.length) return report('hold', 'open-release-not-eligible', head, tree, changedPaths);
      return report('reuse', head === defaultHead ? 'same-immutable-tuple' : 'dev-progress-deferred',
        head, tree, changedPaths);
    }
    const tree = treeOf(defaultHead);
    const { changedPaths, eligible } = classify(defaultHead);
    if (!changedPaths.length) return report('noop', 'source-tree-unchanged', defaultHead, tree);
    if (!eligible) return report('hold', 'unclassified-or-excluded-path', defaultHead, tree, changedPaths);
    return report('propose', 'frozen-source-candidate', defaultHead, tree, changedPaths);
  } catch {
    return report('hold', 'git-evidence-unavailable');
  }
}
