import {createHash} from 'node:crypto';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {writeFile,mkdtemp,rm,symlink} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fixture} from './fixtures/content-coexistence/evidence.mjs';
import {reportFromFiles} from '../content-coexistence-report.mjs';
test('hasNoWriteTransport: regular-file boundary, no raw trust fields',async t=>{
 const root=await mkdtemp(join(tmpdir(),'coexistence-'));t.after(()=>rm(root,{force:true,recursive:true}));
 const f=fixture();const e=join(root,'e.json'),p=join(root,'t.json'), link=join(root,'link');
 const register=JSON.stringify(f.pins());
 const opts={trustedRegisterSHA256:createHash('sha256').update(register).digest('hex'),now:()=>new Date(f.pins().now)};
 await writeFile(e,JSON.stringify(f.evidence));await writeFile(p,register);
 if(process.platform!=='linux'){
  assert.deepEqual((await reportFromFiles(e,p,opts)).reasons,['INVALID_LOCAL_EVIDENCE_FILE']);
  return;
 }
 const r=await reportFromFiles(e,p,opts);
 const stale=await reportFromFiles(e,p,{...opts,now:()=>new Date('2026-11-24T01:11:00.000Z')});
 assert.deepEqual(stale.reasons,['STALE_OBSERVATION_OR_APPROVAL']);
 assert.equal(r.decision,'SHADOW_ELIGIBLE');assert.equal(r.executable,false);
 assert.doesNotMatch(JSON.stringify(r),/synthetic-target|equalityDigest|archive-|inv-|observation-/);
 assert.equal((await reportFromFiles(e,p)).decision,'HOLD');
 assert.equal((await reportFromFiles(e,p,{...opts,trustedRegisterSHA256:'a'.repeat(64)})).decision,'HOLD');
 await symlink(e,link);assert.equal((await reportFromFiles(link,p,opts)).decision,'HOLD');
 assert.equal((await reportFromFiles(root,p,opts)).decision,'HOLD');
 await writeFile(e,'not-json');
 assert.equal((await reportFromFiles(e,p,opts)).decision,'HOLD');
 assert.equal((await reportFromFiles('https://example.invalid/e',p,opts)).decision,'HOLD');
});
