import assert from 'node:assert/strict';
import {test} from 'node:test';
import {fixture,hash} from './fixtures/content-coexistence/evidence.mjs';
import {validateEvidence,reconcileInventories} from '../coexistence-evidence.mjs';
const validate=(f)=>validateEvidence(f.evidence,f.pins());
test('rejectsSelfAttestation and exact independent fixture passes',()=>{
 const f=fixture(),pin=f.pins();
 assert.equal(validate(f).ok,true);
 f.evidence.proposed.tree='f'.repeat(40);
 assert.equal(validateEvidence(f.evidence,pin).ok,false);
 assert.equal(validateEvidence(f.evidence,undefined).ok,false);
});
test('rejectsUnknownEffectiveInput and distinguishes absent from present-empty',()=>{
 const f=fixture(); f.b.environment.values.UNKNOWN={state:'absent'};
 assert.equal(validate(f).ok,false);
 delete f.b.environment.values.UNKNOWN;
 f.b.environment.values.NEXT_PUBLIC_API_BASE_URL={state:'present',equalityDigest:hash('empty'),empty:true};
 assert.equal(validate(f).ok,false);
});
test('rejectsExpiredOrCrossTargetReceipt; rejectsUnpinnedGeneration and invalid order',()=>{
 const f=fixture(),t=f.pins();
 assert.equal(validateEvidence(f.evidence,{...t,now:'2026-11-24T01:50:00.000Z'}).ok,false);
 assert.equal(validateEvidence(f.evidence,{...t,targetId:'other'}).ok,false);
 f.evidence.protected.shift(); assert.equal(validateEvidence(f.evidence,t).ok,false);
 f.evidence.protected.push(f.a); assert.equal(validate(f).ok,false);
});
test('holdsOnMissingCompileOrExportKey and holdsOnEqualLengthMutation',()=>{
 const f=fixture();f.b.compilerStatic=[];
 assert.equal(reconcileInventories(validate(f).evidence).ok,false);
 f.b.compilerStatic=structuredClone(f.a.compilerStatic);
 f.b.export[0].sha256=hash('different bytes');assert.equal(reconcileInventories(validate(f).evidence).ok,false);
});
test('holdsOnUnknownOrConflictingStoredRepresentation and keeps complete oldest object',()=>{
 const f=fixture(); let r=reconcileInventories(validate(f).evidence);
 assert.equal(r.ok,true);assert.ok(r.protectedKeys.includes('_next/static/chunks/older.js'));
 f.evidence.snapshot.objects[0].checksumType='composite';
 assert.equal(reconcileInventories(validate(f).evidence).ok,false);
 f.evidence.snapshot.objects[0].checksumType='full-object';
 delete f.evidence.snapshot.objects[0].metadata.cacheControl;
 assert.equal(reconcileInventories(validate(f).evidence).ok,false);
});
test('blocked unknown historic object, same-byte Cache-Control drift, duplicate effective collision',()=>{
 const f=fixture(); f.old.compilerStatic[1].metadata.cacheControl='public';
 assert.equal(reconcileInventories(validate(f).evidence).ok,false);
 f.old.compilerStatic[1].metadata.cacheControl='no-store';
 f.evidence.snapshot.objects=f.evidence.snapshot.objects.filter(e=>!e.key.endsWith('older.js'));
 assert.equal(reconcileInventories(validate(f).evidence).ok,false);
 f.b.export.push({...f.b.export[1],key:'retargeted.html'});
 assert.equal(reconcileInventories(validate(f).evidence).ok,false);
});
