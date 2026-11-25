import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
export const hash = (x) => createHash('sha256').update(x).digest('hex');
const ordered = (v) => Array.isArray(v) ? v.map(ordered) : v && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered(v[k])])) : v;
export const seal = (v) => hash(JSON.stringify(ordered(v)));
const iso = '2026-11-24T01:00:00.000Z';
const meta = {contentType:'text/plain', contentEncoding:null, cacheControl:'no-store', variants:{}};
export const samplePath = 'frontend/contents/blog/zh/clf-iam-basics.mdx';
export const article = 'zh/blog/clf-iam-basics.html';
const staticKey = '_next/static/chunks/fixed.js';
const part = (key, role, val) => ({key, effectiveKey:key, role, sha256:hash(val), bytes:Buffer.byteLength(val), metadata:{...meta,variants:{}}});
const id = (n) => n.repeat(40);
function receipt(idChar, sequence) {
  return {version:1,id:idChar, sequence, invocationId:'inv-'+idChar, commit:id('1'), tree:id('2'),
    artifactDigest:hash('archive-'+idChar), compilerDigest:hash('compiler-'+idChar),
    exportDigest:hash('export-'+idChar), buildId:'stable-test',
    environment:{node:'22.13.0',npm:'11.19.1',next:'16.2.6',platform:'linux-x64',runner:'offline-fixture',
      lockDigest:hash('lock'), runtimeDigest:hash('stable-inputs'), clockPolicyDigest:hash('fixed-day'),
      taipeiDate:'2026-11-24', values:Object.fromEntries(['NEXT_PUBLIC_API_BASE_URL','NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_GA_MEASUREMENT_ID','NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID'].map(k=>[k,{state:'absent'}]))},
    targetId:'synthetic-target', routeFingerprint:hash('routes'), configFingerprint:hash('config'), routeSchemaFingerprint:hash('schema'),
    compilerStatic:[part(staticKey,'static','static body')], export:[part(staticKey,'static','static body'),
      part(article,'document','before'),part('sitemap.xml','sitemap','old sitemap')],
  };
}
export function fixture() {
  const old=receipt('older',6), rb=receipt('rollback',7), a=receipt('active',8), b=receipt('proposal',9);
  old.compilerStatic.push(part('_next/static/chunks/older.js','static','older'));
  old.export.push(old.compilerStatic.at(-1));
  b.commit=id('3'); b.tree=id('4');
  b.export[1]=part(article,'document','after!');
  const objects=Object.values(Object.assign({},...([old,rb,a].map(r=>Object.fromEntries(r.export.map(e=>[e.effectiveKey,e]))))))
    .map(e=>({key:e.effectiveKey,state:'present',sha256:e.sha256,bytes:e.bytes,metadata:structuredClone(e.metadata),checksumType:'full-object',representation:'origin',version:'observation-'+e.effectiveKey}));
  const evidence={version:1, active:a, proposed:b, snapshot:{version:1,targetId:a.targetId,observedAt:iso,
    activeId:a.id, activeArtifact:a.artifactDigest, configFingerprint:a.configFingerprint, routeFingerprint:a.routeFingerprint,
    pending:false, objects}, protected:[old,rb,a], policy:{version:1,caseId:'iam-zh-body-v1',sourcePath:samplePath,
      approvedCommit:b.commit,approvedTree:b.tree,baseTree:a.tree,patchDigest:hash('reviewed-sample'),
      outsideDiffDigest:hash('outside'),frontmatterDigest:hash('unchanged-frontmatter'),
      bodyBeforeDigest:hash('before'),bodyAfterDigest:hash('after'),
      allowedPaths:[{key:article,role:'document'}],sitemap:null,
      control:{objects:8687,bytes:108281595}}};
  function pins() {
    return {version:1,targetId:a.targetId, now:'2026-11-24T01:01:00.000Z', approvalExpires:'2026-11-24T01:10:00.000Z', maxAgeMs:120000,
     activeReceiptDigest:seal(evidence.active), candidateReceiptDigest:seal(evidence.proposed),
     protectedRoster:evidence.protected.map(r=>({id:r.id,sequence:r.sequence,digest:seal(r)})), rollbackId:a.id,
     snapshotDigest:seal(evidence.snapshot), policyDigest:seal(evidence.policy), approvedSource:{...Object.fromEntries(
      ['patchDigest','outsideDiffDigest','frontmatterDigest','bodyBeforeDigest','bodyAfterDigest'].map(k=>[k,evidence.policy[k]])),
      path:samplePath,baseTree:evidence.policy.baseTree,candidateCommit:evidence.policy.approvedCommit,candidateTree:evidence.policy.approvedTree}};
  }
  assert.equal(evidence.active.targetId,'synthetic-target');
  return {evidence,pins,a,b,old,rb,part};
}
