import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('bounded CI fixture has no production credentials, schedule or writer transport',()=>{
 const read=(p)=>readFileSync(new URL(p,import.meta.url),'utf8');
 const workflow=read('../../../.github/workflows/content-coexistence-shadow.yml');
 const runner=read('../run-content-shadow-build.mjs');
 assert.match(workflow,/\n  pull_request:/u);
 assert.match(workflow,/github\.event\.pull_request\.number == 382/u);
 assert.match(workflow,/head\.repo\.full_name == github\.repository/u);
 assert.match(workflow,/head\.sha/u);
 assert.match(workflow,/permissions:\n  contents: read\n/u);
 assert.match(workflow,/persist-credentials: false/u);
 assert.match(workflow,/GITHUB_STEP_SUMMARY/u);
 assert.doesNotMatch(workflow,/\b(?:push|schedule|workflow_dispatch|pull_request_target|secrets|vars|environment|id-token|write|upload-artifact|aws-actions)\s*:/u);
 assert.doesNotMatch(runner,/\b(?:aws-sdk|aws s3|CloudFront|Vercel|fetch\(|https\.request|process\.env\.AWS)/iu);
 assert.match(runner,/const env=\{PATH:process\.env\.PATH,HOME:work,TMPDIR:work/u);
 assert.match(runner,/\['ci','--ignore-scripts'/u);
});
