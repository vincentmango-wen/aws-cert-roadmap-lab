import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const engineDir = path.dirname(fileURLToPath(import.meta.url));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(temporary, file);
};
const matches = (name, rules) => rules.some(rule => rule.endsWith('/') ? name.startsWith(rule) : name === rule);
const safePath = (root, relative) => {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw Error('Unsafe relative path');
  const dest = path.resolve(root, relative);
  if (!dest.startsWith(path.resolve(root) + path.sep)) throw Error('Path outside root');
  return dest;
};
const jsonHash = value => hash(JSON.stringify(value));
const same = (a, b) => jsonHash(a) === jsonHash(b);
const manifestDiff = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => a[k] !== b[k]);

export function manifest(root, profile) {
  const files = execFileSync('git', ['-C', root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], { maxBuffer: 20 * 1024 * 1024 }).toString().split('\0').filter(Boolean);
  const ignored = execFileSync('git', ['-C', root, 'ls-files', '--others', '--ignored', '--exclude-standard', '-z'], { maxBuffer: 20 * 1024 * 1024 }).toString().split('\0').filter(Boolean);
  // Environment files are deliberately not copied or hashed. Refuse to run with hidden dotenv inputs.
  const secretName = name => /(^|\/)\.env($|\.)/.test(name) && !/\.example$/.test(name);
  if ([...files, ...ignored].some(name => !name.includes('node_modules/') && !name.startsWith('tmp/') && secretName(name))) throw Error('Unrecorded dotenv input: remove from verification workspace, do not copy secrets');
  const hiddenSources = ignored.filter(name => name.startsWith('frontend/') && !matches(name, profile.generated) && /\.(tsx?|[cm]?js|json|mdx?|css)$/.test(name));
  if (hiddenSources.length) throw Error('Ignored source inputs require review: ' + hiddenSources.slice(0, 5).join(', '));
  const result = {};
  for (const name of [...new Set(files)].sort()) {
    if (matches(name, profile.generated)) continue;
    const file = safePath(root, name);
    if (!fs.existsSync(file)) continue; // deletion is represented by absence
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw Error(`Unsupported input: ${name}`);
    if (/(^|\/)(credentials|.*\.(pem|key|p12|pfx))$/i.test(name)) throw Error(`Sensitive input refused: ${name}`);
    result[name] = hash(fs.readFileSync(file));
  }
  return result;
}

function snapshot(root, dest, files) {
  for (const [name, digest] of Object.entries(files)) {
    const content = fs.readFileSync(safePath(root, name));
    if (hash(content) !== digest) throw Error('Input changed while snapshotting');
    const target = safePath(dest, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

function event(bundle, type, detail) {
  fs.appendFileSync(path.join(bundle, 'events.jsonl'), JSON.stringify({ time: new Date().toISOString(), type, ...detail }) + '\n');
}

export function createTask({ root, bundle, profile, contract }) {
  root = fs.realpathSync(root); bundle = path.resolve(bundle);
  if (fs.existsSync(bundle)) throw Error('Task bundle already exists; reuse it to preserve repair count');
  if (!contract.id || !contract.goal || contract.maxRepairs !== 3 || !Array.isArray(contract.allowed) || !Array.isArray(contract.humanAcceptance)) throw Error('Invalid contract');
  if (!profile.checks?.length || !Array.isArray(profile.generated) || !Array.isArray(profile.protected)) throw Error('Invalid profile');
  const common = execFileSync('git', ['-C', root, 'rev-parse', '--path-format=absolute', '--git-common-dir']).toString().trim();
  const registry = path.join(common, 'aidd-pilot', hash(contract.id) + '.json');
  if (fs.existsSync(registry)) throw Error('Task ID already registered; reuse the existing bundle (including after worktree/run changes)');
  const initial = manifest(root, profile);
  if (bundle.startsWith(root + path.sep)) {
    const relative = path.relative(root, bundle).replaceAll('\\', '/');
    if (!relative.startsWith('tmp/')) throw Error('Bundle must be outside source or under ignored tmp/');
    execFileSync('git', ['-C', root, 'check-ignore', relative]);
  }
  fs.mkdirSync(bundle, { recursive: true });
  write(path.join(bundle, 'contract.json'), contract);
  write(path.join(bundle, 'profile.json'), profile);
  write(path.join(bundle, 'initial-manifest.json'), initial);
  const engine = {};
  for (const name of ['pilot.mjs', 'cli.mjs']) {
    const content = fs.readFileSync(path.join(engineDir, name));
    fs.mkdirSync(path.join(bundle, 'engine'), { recursive: true });
    fs.writeFileSync(path.join(bundle, 'engine', name), content);
    engine[name] = hash(content);
  }
  write(path.join(bundle, 'task.json'), { root, contractHash: jsonHash(contract), profileHash: jsonHash(profile), initialHash: jsonHash(initial), engine, repairs: [], state: 'CREATED', baseline: null, latest: null });
  fs.mkdirSync(path.dirname(registry), { recursive: true });
  fs.writeFileSync(registry, JSON.stringify({ id: contract.id, bundle }), { flag: 'wx' });
  event(bundle, 'created', { task: contract.id });
  return readStatus(bundle);
}

function loadTask(bundle) {
  const task = read(path.join(bundle, 'task.json'));
  const profile = read(path.join(bundle, 'profile.json'));
  const contract = read(path.join(bundle, 'contract.json'));
  const initial = read(path.join(bundle, 'initial-manifest.json'));
  if (jsonHash(profile) !== task.profileHash || jsonHash(contract) !== task.contractHash || jsonHash(initial) !== task.initialHash) throw Error('Contract/profile/baseline drift');
  for (const [name, digest] of Object.entries(task.engine)) {
    if (hash(fs.readFileSync(path.join(bundle, 'engine', name))) !== digest || hash(fs.readFileSync(path.join(engineDir, name))) !== digest) throw Error('Verifier drift: review and re-establish baseline');
  }
  return { task, profile, contract, initial };
}

export function beginRepair(bundle, detail) {
  const { task } = loadTask(bundle);
  if (task.replayedFrom) throw Error('Replay bundles are verification-only; repairs belong to the original task');
  if (fs.existsSync(path.join(bundle, 'active.json'))) throw Error('INTERRUPTED: inspect existing process before repair');
  if (task.state === 'STOP_UNCONFIRMED') throw Error('STOP_UNCONFIRMED: human process reconciliation required before any repair');
  if (task.repairs.length >= 3) throw Error('REPAIR_LIMIT: fourth repair requires human authorization; no reset command');
  if (!detail.problem?.trim() || !detail.hypothesis?.trim() || !detail.expected?.trim()) throw Error('Repair requires problem, hypothesis and expected outcome');
  task.repairs.push({ number: task.repairs.length + 1, time: new Date().toISOString(), ...detail });
  task.state = 'REPAIRING';
  write(path.join(bundle, 'task.json'), task);
  event(bundle, 'repair-started', task.repairs.at(-1));
  return task;
}

export function parseVitest(report, root, expected) {
  if (report.success !== true || !Array.isArray(report.testResults)) throw Error('Invalid or failed Vitest report');
  const assertions = {};
  for (const suite of report.testResults) {
    if (!suite.name || !Array.isArray(suite.assertionResults)) throw Error('Invalid Vitest suite report');
    const name = path.relative(root, suite.name).replaceAll('\\', '/');
    if (name.startsWith('../') || path.isAbsolute(name)) throw Error('Test identity outside source');
    for (const assertion of suite.assertionResults) {
      if (!assertion.fullName || !['passed', 'pending', 'skipped', 'todo'].includes(assertion.status)) throw Error('Unknown or failed assertion status');
      const key = `${name}::${assertion.fullName}`;
      if (key in assertions) throw Error('Duplicate test identity');
      assertions[key] = assertion.status;
    }
  }
  if (!Object.keys(assertions).length) throw Error('Empty Vitest report');
  const sorted = Object.fromEntries(Object.entries(assertions).sort(([a], [b]) => a.localeCompare(b)));
  if (expected && !same(sorted, expected)) throw Error('Test identity/status differs from baseline; review required');
  return sorted;
}

async function runCheck(root, runDir, check) {
  if (!/^[a-z0-9-]+$/.test(check.id) || !Number.isFinite(check.timeoutMs) || check.timeoutMs <= 0) throw Error('Invalid check');
  const report = path.join(runDir, `${check.id}.json`);
  const npm = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  const args = check.args.map(arg => arg.replaceAll('{npm}', npm).replaceAll('{report}', report));
  const cwd = check.cwd === '.' ? root : safePath(root, check.cwd);
  // Do not inherit tokens or arbitrary build variables into verification.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => ['path', 'systemroot', 'windir', 'comspec', 'temp', 'tmp', 'home', 'userprofile', 'localappdata', 'appdata'].includes(key.toLowerCase())));
  env.PATH = path.dirname(process.execPath) + path.delimiter + (env.PATH || env.Path || '');
  env.NEXT_TELEMETRY_DISABLED = '1';
  env.CI = '1';
  const out = fs.openSync(path.join(runDir, `${check.id}.stdout.log`), 'w');
  const err = fs.openSync(path.join(runDir, `${check.id}.stderr.log`), 'w');
  const started = Date.now();
  const result = await new Promise(resolve => {
    let settled = false;
    const child = spawn(process.execPath, args, { cwd, env, stdio: ['ignore', out, err], windowsHide: true });
    const finish = result => { if (!settled) { settled = true; clearTimeout(timer); resolve(result); } };
    const timer = setTimeout(() => {
      child.kill(); // only this process; descendants are intentionally NOT claimed stopped
      finish({ exitCode: null, timedOut: true, state: 'STOP_UNCONFIRMED', pid: child.pid });
    }, check.timeoutMs);
    child.on('error', error => finish({ exitCode: null, error: error.message }));
    child.on('close', (exitCode, signal) => finish({ exitCode, signal }));
  });
  fs.closeSync(out); fs.closeSync(err);
  return { id: check.id, command: [process.execPath, ...args], cwd, startedAt: new Date(started).toISOString(), elapsedMs: Date.now() - started, ...result };
}

function seal(runDir) {
  const files = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (file !== path.join(runDir, 'seal.json')) files[path.relative(runDir, file).replaceAll('\\', '/')] = hash(fs.readFileSync(file));
    }
  }
  walk(runDir); write(path.join(runDir, 'seal.json'), files);
  return hash(fs.readFileSync(path.join(runDir, 'seal.json')));
}

function checkSeal(bundle, run, expectedHash) {
  const dir = safePath(path.join(bundle, 'runs'), run);
  if (hash(fs.readFileSync(path.join(dir, 'seal.json'))) !== expectedHash) throw Error('Seal drift');
  const files = read(path.join(dir, 'seal.json'));
  for (const [name, digest] of Object.entries(files)) if (hash(fs.readFileSync(safePath(dir, name))) !== digest) throw Error('Evidence drift');
  return dir;
}

export async function verify(bundle, phase) {
  bundle = path.resolve(bundle);
  const { task, profile, contract, initial } = loadTask(bundle);
  if (!['baseline', 'candidate'].includes(phase)) throw Error('Expected baseline or candidate');
  if (fs.existsSync(path.join(bundle, 'active.json'))) throw Error('INTERRUPTED: do not overlap runs; inspect and reconcile active.json manually');
  if (task.state === 'STOP_UNCONFIRMED') throw Error('STOP_UNCONFIRMED: process-tree status requires human reconciliation');
  if (phase === 'baseline' && task.baseline) throw Error('Baseline already frozen; cannot silently replace');
  if (phase === 'candidate' && !task.baseline) throw Error('Passing baseline required');
  if (process.versions.node !== profile.node) throw Error(`Node ${profile.node} required; actual ${process.versions.node}`);
  const npmVersion = profile.npm ? read(path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'package.json')).version : null;
  if (profile.npm && npmVersion !== profile.npm) throw Error(`npm ${profile.npm} required; actual ${npmVersion}`);
  if (task.baseline) checkSeal(bundle, task.baseline.run, task.baseline.seal);
  const before = manifest(task.root, profile);
  const changed = manifestDiff(initial, before);
  const forbidden = changed.filter(name => matches(name, profile.protected) || /(^|\/)(__tests__|__mocks__)\//.test(name) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(name) || !matches(name, contract.allowed));
  if (forbidden.length) {
    task.state = 'NEEDS_DECISION'; task.reason = { forbidden };
    write(path.join(bundle, 'task.json'), task); event(bundle, 'blocked', task.reason);
    return { state: task.state, forbidden };
  }
  const run = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
  const runDir = path.join(bundle, 'runs', run);
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(bundle, 'active.json'), JSON.stringify({ run, pid: process.pid }), { flag: 'wx' });
  task.state = 'VERIFYING'; write(path.join(bundle, 'task.json'), task);
  event(bundle, 'verification-started', { run, phase });
  const checks = [];
  let state = phase === 'baseline' ? 'BASELINE_READY' : 'AUTO_VERIFIED_AWAITING_HUMAN';
  let identities = {};
  let reason;
  try {
    write(path.join(runDir, 'before.json'), before);
    snapshot(task.root, path.join(runDir, 'source'), before);
    write(path.join(runDir, 'environment.json'), { node: process.versions.node, npm: npmVersion, platform: process.platform, arch: process.arch, dependencyLock: before['frontend/package-lock.json'] ?? null, contract: task.contractHash, profile: task.profileHash, engine: task.engine, variables: { CI: '1', NEXT_TELEMETRY_DISABLED: '1' }, limitations: ['No secrets or ambient environment values recorded', 'Dependencies are rebuilt by the profile install check', 'Local results do not imply Ubuntu CI or deployment readiness'] });
    for (const check of profile.checks) {
      const result = await runCheck(task.root, runDir, check); checks.push(result);
      write(path.join(runDir, 'checks.json'), checks);
      if (result.timedOut) { state = 'STOP_UNCONFIRMED'; break; }
      if (result.exitCode !== 0) { state = phase === 'baseline' ? 'BLOCKED_BASELINE' : 'CHECKS_FAILED'; break; }
      if (check.report === 'vitest') {
        const prior = task.replayExpected?.[check.id] ?? (task.baseline ? read(path.join(bundle, 'runs', task.baseline.run, 'identities.json'))[check.id] : undefined);
        identities[check.id] = parseVitest(read(path.join(runDir, `${check.id}.json`)), task.root, prior);
      }
    }
  } catch (error) { reason = error.message; if (state !== 'STOP_UNCONFIRMED') state = 'VERIFICATION_BLOCKED'; }
  try {
    const after = manifest(task.root, profile);
    write(path.join(runDir, 'after.json'), after);
    if (!same(before, after) && state !== 'STOP_UNCONFIRMED') state = 'INPUT_DRIFT';
  } catch (error) {
    reason = [reason, error.message].filter(Boolean).join('; ');
    write(path.join(runDir, 'after-error.json'), { error: error.message });
    if (state !== 'STOP_UNCONFIRMED') state = 'VERIFICATION_BLOCKED';
  }
  write(path.join(runDir, 'identities.json'), identities);
  const result = { run, phase, state, reason, repairs: task.repairs.length, checks, humanAcceptance: contract.humanAcceptance.map(item => ({ item, status: 'pending' })) };
  write(path.join(runDir, 'result.json'), result);
  const digest = seal(runDir);
  task.latest = { run, seal: digest }; task.state = state;
  if (state === 'BASELINE_READY') task.baseline = task.latest;
  write(path.join(bundle, 'task.json'), task);
  event(bundle, 'verification-ended', { run, state });
  fs.unlinkSync(path.join(bundle, 'active.json'));
  return result;
}

export function readStatus(bundle) {
  try {
    const { task, profile } = loadTask(bundle);
    if (fs.existsSync(path.join(bundle, 'active.json'))) return { ...task, state: 'INTERRUPTED' };
    if (task.baseline) checkSeal(bundle, task.baseline.run, task.baseline.seal);
    if (task.latest) {
      const dir = checkSeal(bundle, task.latest.run, task.latest.seal);
      if (['BASELINE_READY', 'AUTO_VERIFIED_AWAITING_HUMAN'].includes(task.state) && !same(manifest(task.root, profile), read(path.join(dir, 'after.json')))) return { ...task, state: 'INPUT_DRIFT' };
    }
    return task;
  } catch (error) { return { state: 'EVIDENCE_INVALID', reason: error.message }; }
}

export async function replay(bundle, run, destination) {
  bundle = path.resolve(bundle); destination = path.resolve(destination);
  const { task, profile, contract } = loadTask(bundle);
  const ref = [task.latest, task.baseline].find(item => item?.run === run);
  if (!ref) throw Error('Replay requires sealed latest or baseline run');
  const dir = checkSeal(bundle, run, ref.seal);
  if (fs.existsSync(destination)) throw Error('Replay destination must not exist');
  const root = path.join(destination, 'source');
  fs.mkdirSync(root, { recursive: true });
  snapshot(path.join(dir, 'source'), root, read(path.join(dir, 'before.json')));
  execFileSync('git', ['init', '-q', root]);
  // The snapshot may contain tracked files that now match .gitignore. Recreate
  // their tracked status in this NEW disposable repository, never the caller's.
  execFileSync('git', ['-C', root, '-c', 'core.autocrlf=false', 'add', '--force', '--all']);
  if (!same(manifest(root, profile), read(path.join(dir, 'before.json')))) throw Error('Replay source manifest differs from sealed input');
  const newBundle = path.join(destination, 'evidence');
  createTask({ root, bundle: newBundle, profile, contract });
  // Install is a normal profile check, so interruption/timeout uses the same latch.
  const replayTask = read(path.join(newBundle, 'task.json'));
  replayTask.repairs = task.repairs;
  replayTask.replayExpected = read(path.join(dir, 'identities.json'));
  replayTask.replayedFrom = { bundle, run, seal: ref.seal };
  write(path.join(newBundle, 'task.json'), replayTask);
  const baseline = await verify(newBundle, 'baseline');
  if (baseline.state !== 'BASELINE_READY') return baseline;
  // A replay proves the same source checks, not human acceptance.
  return verify(newBundle, 'candidate');
}
