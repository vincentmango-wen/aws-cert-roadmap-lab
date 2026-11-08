#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTask, beginRepair, readStatus, verify, replay } from './pilot.mjs';

const [command, bundleArg, ...args] = process.argv.slice(2);
try {
  if (!bundleArg) throw Error('Usage: node tools/aidd/cli.mjs init|verify|repair|status|replay BUNDLE [arguments]');
  const bundle = path.resolve(bundleArg);
  let result;
  if (command === 'init') {
    const root = path.resolve(args[0] || '.');
    const contract = JSON.parse(fs.readFileSync(path.join(root, 'docs/aidd/task.json'), 'utf8'));
    const profile = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'profile.json'), 'utf8'));
    result = createTask({ root, bundle, contract, profile });
  } else if (command === 'verify') result = await verify(bundle, args[0]);
  else if (command === 'repair') result = beginRepair(bundle, { problem: args[0], hypothesis: args[1], expected: args[2] });
  else if (command === 'status') result = readStatus(bundle);
  else if (command === 'replay') result = await replay(bundle, args[0], args[1]);
  else throw Error('Unknown command');
  console.log(JSON.stringify(result, null, 2));
  if (!['CREATED', 'REPAIRING', 'BASELINE_READY', 'AUTO_VERIFIED_AWAITING_HUMAN'].includes(result.state)) process.exitCode = 1;
} catch (error) {
  console.error(error.message); process.exitCode = 1;
}
