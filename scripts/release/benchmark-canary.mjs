// Stage 1 only: there is deliberately no production or build-execution mode.
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const names = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID',
];
const prefix = 'synthetic-376-canary-';
const modes = new Map([['', 'pass'], ['--test-failure', 'fail'], ['--test-timeout', 'timeout']]);
const args = process.argv.slice(2);
const mode = args.length === 0 ? 'pass' : args.length === 1 && args[0] !== '' && modes.get(args[0]);

function report(canary, exitCode) {
  process.stdout.write(JSON.stringify({ stage: 'synthetic-only', canary, benchmark: 'HOLD', executable: false }) + '\n');
  process.exitCode = exitCode;
}

if (!mode) {
  report('REJECTED', 2);
} else {
  try {
    // Construct rather than filter: inherited values and workflow control files are excluded.
    const env = Object.fromEntries(names.map((name) => [name, prefix + randomUUID()]));
    const fixture = `
      const { writeSync } = require('node:fs');
      const names = ${JSON.stringify(names)};
      const values = names.map(name => process.env[name]);
      if (process.platform === 'linux' && Object.keys(process.env).length !== names.length) process.exit(42);
      if (process.env.AWS376_TEST_PARENT_SENTINEL ||
          values.some(value => !value?.startsWith(${JSON.stringify(prefix)}))) process.exit(43);
      writeSync(1, 'simulated build stdout ' + JSON.stringify(values) + '\\n');
      writeSync(2, 'simulated stderr ::warning::' + JSON.stringify(values) + '\\n');
      if (process.argv[1] === 'timeout') setTimeout(() => {}, 60_000);
      else if (process.argv[1] === 'fail') process.exit(44);
    `;
    // Discard both streams at process creation, including annotations and errors.
    // Do not interpolate or serialize spawn diagnostics; they may contain command details.
    const result = spawnSync(process.execPath, ['-e', fixture, mode], {
      env, stdio: 'ignore', shell: false, timeout: 1_500, killSignal: 'SIGKILL',
    });
    if (result.error?.code === 'ETIMEDOUT') report('TIMEOUT', 1);
    else if (result.error || result.status !== 0) report('FAIL', 1);
    else report('PASS', 0);
  } catch {
    report('FAIL', 1);
  }
}
