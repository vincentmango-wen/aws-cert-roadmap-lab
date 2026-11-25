import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compareBuilds, inventoryFromRoots} from '../content-shadow-build.mjs';
import {mkdtemp, mkdir, writeFile, symlink, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const old='2026-11-25T15:00:01.000Z', next='2026-11-25T15:00:02.000Z';
const key='zh/blog/clf-iam-basics.html';
const file=(body)=>({bytes:Buffer.byteLength(body),sha256:createHash('sha256').update(body).digest('hex')});
const sitemap=(t,link='/a')=>`<urlset><url><loc>https://shadow.invalid${link}</loc><lastmod>${t}</lastmod></url></urlset>`;
const inventory=(time,article='before',locator='/a')=>{
 const body=sitemap(time,locator), asset=file('abc');
 return {exported:new Map([[key,file(article)],[key.replace(/html$/u,"txt"),file(article)],['sitemap.xml',file(body)],['_next/static/a.js',asset]]),
   compiled:new Map([['_next/static/a.js',asset]]), sitemap:body,
   window:[Date.parse(time)-100,Date.parse(time)+100],inputDigest:'a'.repeat(64), buildId:'fixture'};
};
const compare=(a,b,kind='content')=>compareBuilds(a,b,{kind,expectedBuildId:'fixture',approvedFallbacks:new Set(['/a'])});
test('timestamps only are counted in both directions, never mislabeled NOOP',()=>{
 const a=inventory(old),b=inventory(next);
 const r=compare(a,b,'replay');
 assert.equal(r.decision,'SITEMAP_ONLY');
 assert.equal(r.executable,false);
 assert.deepEqual(r.forward,[{key:'sitemap.xml',bytes:Buffer.byteLength(b.sitemap)}]);
 assert.deepEqual(r.rollback,[{key:'sitemap.xml',bytes:Buffer.byteLength(a.sitemap)}]);
 assert.equal(r.counts.forward.bytes,Buffer.byteLength(b.sitemap));
 assert.equal(compare(a,a,'replay').decision,'NOOP');
});
test('reports exact body deltas or holds without fallback',()=>{
 const a=inventory(old),b=inventory(next,'after');
 const r=compare(a,b);
 assert.equal(r.decision,'SHADOW_ELIGIBLE');
 assert.deepEqual(r.forward,[{key:'sitemap.xml',bytes:Buffer.byteLength(b.sitemap)},{key,bytes:5},{key:key.replace(/html$/u,'txt'),bytes:5}]);
 for(const [mutate,reason] of [
  [b=>b.compiled.set('_next/static/a.js',file('bad')),'COMPILE_EXPORT_MISMATCH'],
  [b=>{b.compiled.set('_next/static/a.js',file('bad'));b.exported.set('_next/static/a.js',file('bad'));},'ASSET_MANIFEST_DRIFT'],
  [b=>b.exported.set('new-route.txt',file('new')),'ROUTE_PAYLOAD_KEYSET_DRIFT'],
  [b=>b.inputDigest='b'.repeat(64),'UNAPPROVED_BUILD_INPUT_DRIFT'],
  [b=>b.window=[Date.parse(old),Date.parse(old)],'UNPROVEN_SITEMAP_CHANGE'],
  [b=>{b.sitemap=sitemap(next,'/other');b.exported.set('sitemap.xml',file(b.sitemap));},'UNPROVEN_SITEMAP_CHANGE'],
  [b=>{b.sitemap=b.sitemap.replace('</url>','<alt>changed hreflang</alt></url>');b.exported.set('sitemap.xml',file(b.sitemap));},'UNPROVEN_SITEMAP_CHANGE'],
  [b=>b.exported.set('sitemap.xml',file('unsealed')),'MALFORMED_BUILD_EVIDENCE'],
 ]){
  const b=inventory(next,'after');mutate(b);
  const r=compare(a,b);assert.equal(r.decision,'HOLD');assert.deepEqual(r.reasons,[reason]);assert.deepEqual(r.forward,[]);
 }
});
test('same-width dates on a known route are not assumed to be fallback drift',()=>{
 const a=inventory(old,'before','/known'),b=inventory(next,'after','/known');
 assert.deepEqual(compare(a,b).reasons,['UNPROVEN_SITEMAP_CHANGE']);
});
test('rejects symlinks and missing compiled output',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'shadow-fixture-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const out=join(dir,'out'),compiled=join(dir,'static');
 await mkdir(out);await mkdir(compiled);
 await writeFile(join(out,'sitemap.xml'),sitemap(old));await symlink(join(out,'sitemap.xml'),join(out,'bad'));
 await assert.rejects(inventoryFromRoots(out,compiled),/regular file/);
});
