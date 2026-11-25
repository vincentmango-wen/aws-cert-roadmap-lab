import assert from 'node:assert/strict';
import {test} from 'node:test';
import {fixture,hash,article} from './fixtures/content-coexistence/evidence.mjs';
import {planContentCoexistence} from '../plan-content-coexistence.mjs';
const call=(f)=>planContentCoexistence(f.evidence,f.pins());
const held=(f)=>{const r=call(f);assert.equal(r.decision,'HOLD');assert.deepEqual(r.changed,[]);assert.equal(r.executable,false);assert.equal(r.counts.forward.objects,0);assert.equal(r.counts.meetsBudget,null);};
test('needsExactArtifactForNoop and positive report returns exact forward and rollback body counts',()=>{
 let f=fixture();
 let r=call(f);
 assert.equal(r.decision,'SHADOW_ELIGIBLE');assert.equal(r.executable,false);
 assert.deepEqual(r.changed,[{key:article,reason:'body',bytes:6,direction:'forward'},{key:article,reason:'body',bytes:6,direction:'rollback'}]);
 assert.equal(r.counts.forward.objects,1);assert.equal(r.counts.rollback.bytes,6);assert.equal(r.counts.meetsBudget,true);
 f.evidence.proposed=f.a;assert.equal(call(f).decision,'NOOP');
 f=fixture(); f.b.commit=f.a.commit;f.b.tree=f.a.tree;f.b.export=structuredClone(f.a.export);
 f.b.export.at(-1).sha256=hash('generated clocks');held(f);
 f=fixture(); f.b.artifactDigest=f.a.artifactDigest;held(f);
});
test('holdsOnRouteOrPolicyDrift and neverOffersFallbackOnHold',()=>{
 for(const mutate of [
  f=>f.b.routeFingerprint=hash('trailing slash alias'),f=>f.b.routeSchemaFingerprint=hash('Flight shape'),
  f=>f.b.environment.lockDigest=hash('other lock'),f=>f.b.export.push(f.part('new.txt','flight','new')),
  f=>f.b.export[1].effectiveKey='retarget.html',f=>f.b.export.pop(),f=>f.evidence.policy.sourcePath='some.md',
  f=>{f.b.export.at(-1).sha256=hash('unexplained sitemap');f.evidence.policy.allowedPaths.push({key:'sitemap.xml',role:'sitemap'});},
  f=>{f.b.export.at(-1).key='random.html';},
 ]){const f=fixture();mutate(f);held(f);}
});
test('countsMetadataOnlyMutableChange and does not treat bytes as equality to change',()=>{
 const f=fixture();f.b.export[1]=structuredClone(f.a.export[1]);f.b.export[1].metadata.cacheControl='no-cache';
 const r=call(f);assert.equal(r.decision,'SHADOW_ELIGIBLE');
 assert.deepEqual(r.changed[0],{key:article,reason:'metadata',bytes:6,direction:'forward'});
});
test('approved expected sitemap drift is exact, mutable rollback is not silently derived from guessed data',()=>{
 const f=fixture();f.b.export.at(-1).sha256=hash('reviewed sitemap drift');
 f.evidence.policy.allowedPaths.push({key:'sitemap.xml',role:'sitemap'});
 f.evidence.policy.sitemap={beforeSHA:f.a.export.at(-1).sha256,afterSHA:f.b.export.at(-1).sha256,
 expectedLastmodChanges:46,observedLastmodChanges:46,otherXMLChanges:0,routeSetDigest:hash('route set'),timeDerivedKeysDigest:hash('46 keys')};
 assert.equal(call(f).decision,'SHADOW_ELIGIBLE');
 f.evidence.policy.sitemap.observedLastmodChanges=45;held(f);
});

test('reverse bound to exact prior active receipt; historical artifacts retained, never reverse targets',()=>{
 const f=fixture();
 // A positive forward should identify the verified live A receipt as the sole reverse.
 const base=planContentCoexistence(f.evidence,{...f.pins(),rollbackId:f.a.id});
 assert.equal(base.decision,'SHADOW_ELIGIBLE');
 assert.equal(base.executable,false);
 assert.equal(base.counts.retainsStatic,2);
 assert.deepEqual(base.changed.filter(x=>x.direction==='rollback'),[{key:article,reason:'body',bytes:6,direction:'rollback'}]);
 // Even if digest metadata looks like A, a different independently pinned historical receipt is not A.
 f.rb.artifactDigest=f.a.artifactDigest;
 f.rb.compilerDigest=f.a.compilerDigest;
 f.rb.exportDigest=f.a.exportDigest;
 const equalLooking=planContentCoexistence(f.evidence,{...f.pins(),rollbackId:f.rb.id});
 assert.equal(equalLooking.decision,'HOLD');
 assert.deepEqual(equalLooking.reasons,['ROLLBACK_NOT_EXACT_PRIOR_ACTIVE']);
 assert.deepEqual(equalLooking.changed,[]);
 assert.equal(equalLooking.executable,false);
});

test('reverse mismatch is blocked even when independently pinned and on a forward-approved key',()=>{
 const f=fixture();
 f.rb.buildId='different-rollback-build';
 f.rb.environment.runtimeDigest=hash('different runtime');
 f.rb.export[1]=f.part(article,'document','unreviewed reverse body');
 const r=planContentCoexistence(f.evidence,{...f.pins(),rollbackId:f.rb.id});
 assert.equal(r.decision,'HOLD');
 assert.deepEqual(r.changed,[]);
 assert.equal(r.counts.forward.objects,0);
 assert.equal(r.counts.rollback.objects,0);
 assert.deepEqual(r.reasons,['ROLLBACK_NOT_EXACT_PRIOR_ACTIVE']);
 assert.equal(r.executable,false);
 // It remains a retained historical generation, so a legitimate A reverse can still be estimated.
 const good=planContentCoexistence(f.evidence,{...f.pins(),rollbackId:f.a.id});
 assert.equal(good.decision,'SHADOW_ELIGIBLE');
 assert.equal(good.counts.retainsStatic,2);
 assert.deepEqual(good.changed.filter(x=>x.direction==='rollback'),[{key:article,reason:'body',bytes:6,direction:'rollback'}]);
});
