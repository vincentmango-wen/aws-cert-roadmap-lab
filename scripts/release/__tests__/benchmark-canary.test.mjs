import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../benchmark-canary.mjs', import.meta.url));
const line = (state) => JSON.stringify({stage:'synthetic-only', canary:state, benchmark:'HOLD', executable:false});
const launch = (...args) => spawnSync(process.execPath, [cli,...args], {
  encoding:'utf8', timeout:6_000,
  env:{...process.env, AWS376_TEST_PARENT_SENTINEL:'synthetic-parent-must-not-leak',
    NEXT_PUBLIC_SITE_URL:'synthetic-parent-site-must-not-leak'},
});
for (const [name,args,status,state] of [
  ['success', [], 0, 'PASS'],
  ['child failure', ['--test-failure'], 1, 'FAIL'],
  ['timeout', ['--test-timeout'], 1, 'TIMEOUT'],
  ['unknown mode', ['--real'], 2, 'REJECTED'],
]) test(name+' emits only the fixed schema and no child or parent content', () => {
  const result=launch(...args);
  assert.equal(result.status,status,result.error?.code);
  assert.ok(result.stdout===line(state)+'\n', 'stdout must be the fixed result');
  assert.ok(result.stderr==='', 'stderr must be empty');
});
test('workflow is manual only, with read-only auth, fixed invocation, and no real-input or deployment paths', () => {
  const yaml=readFileSync(new URL('../../../.github/workflows/benchmark-frontend-synthetic.yml', import.meta.url),'utf8');
  assert.match(yaml,/^on:\n  workflow_dispatch:\s*\{\}$/m);
  assert.match(yaml,/^permissions:\n  contents: read\n\n/m);
  assert.match(yaml,/^    if: github\.event_name == 'workflow_dispatch' && github\.ref == 'refs\/heads\/master' && github\.repository == 'vincentmango-wen\/aws-cert-roadmap-lab'$/m);
  assert.match(yaml,/persist-credentials: false/);
  assert.match(yaml,/node-version: '20\.20\.2'/);
  assert.equal([...yaml.matchAll(/^\s*(?:- )?run: (.+)$/gm)].map(m=>m[1]).join('\n'),'node scripts/release/benchmark-canary.mjs\nnode --test scripts/release/__tests__/benchmark-canary.test.mjs');
  assert.equal([...yaml.matchAll(/^\s*(?:- )?uses: (.+)$/gm)].map(m=>m[1]).length,2);
  for (const m of yaml.matchAll(/^\s*(?:- )?uses: (.+)$/gm)) assert.match(m[1],/^actions\/(?:checkout|setup-node)@[a-f0-9]{40}$/);
  assert.doesNotMatch(yaml,/secrets\.|vars\.|NEXT_PUBLIC|id-token|persist-credentials: true|(^|\s)(push|pull_request|schedule|workflow_call|cache|environment):|upload-artifact|download-artifact|aws-actions|aws s3|CloudFront|::add-mask|\$\{\{/im);
});
