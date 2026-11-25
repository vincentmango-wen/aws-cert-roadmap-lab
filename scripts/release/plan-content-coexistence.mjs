import {digest,exact,IAM_PATH,reconcileInventories,same,seal,validateEvidence} from './coexistence-evidence.mjs';

const footprint = new Map([
 ['zh.html','document'], ['zh.txt','flight'], ['zh/__next.!KHNpdGUp.zh.__PAGE__.txt','flight'], ['zh/__next._full.txt','flight'],
 ['zh/blog/clf-iam-basics.html','document'], ['zh/blog/clf-iam-basics.txt','flight'],
 ['zh/blog/clf-iam-basics/__next.!KHNpdGUp.zh.blog.$d$postSlug.__PAGE__.txt','flight'],
 ['zh/blog/clf-iam-basics/__next._full.txt','flight'],
 ['zh/updates.html','document'], ['zh/updates.txt','flight'],
 ['zh/updates/__next.!KHNpdGUp.zh.updates.__PAGE__.txt','flight'], ['zh/updates/__next._full.txt','flight'],
 ['sitemap.xml','sitemap'],
]);
const proofFields=['patchDigest','outsideDiffDigest','frontmatterDigest','bodyBeforeDigest','bodyAfterDigest'];
const policyFields=['version','caseId','sourcePath','approvedCommit','approvedTree','baseTree',...proofFields,'allowedPaths','sitemap','control'];
const utcSort = (a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b));
const count = (rows) => ({objects:rows.length,bytes:rows.reduce((n,x)=>n+x.bytes,0)});
function result(decision,reasons=[],changed=[],extra={}){
 return {decision,executable:false,changed,counts:{
   forward:count(changed.filter(x=>x.direction==='forward')),
   rollback:count(changed.filter(x=>x.direction==='rollback')),
   retainsStatic:extra.retainsStatic??0,
   control:extra.control??null,
   meetsBudget:extra.meetsBudget??null,
 },reasons};
}
const held = (...reasons) => result('HOLD',reasons);
function policyMap(p,v) {
 const {active:a,proposed:b,approvedSource:x}=v;
 const sameSource=a.commit===b.commit&&a.tree===b.tree;
 if(!exact(p,policyFields)||p.version!==1||p.caseId!=='iam-zh-body-v1'||p.sourcePath!==IAM_PATH
   ||p.approvedCommit!==b.commit||p.approvedTree!==b.tree||p.baseTree!==a.tree
   ||x.candidateCommit!==b.commit||x.candidateTree!==b.tree||x.baseTree!==a.tree||!sameSource&&(a.tree===b.tree||a.commit===b.commit)
   ||!proofFields.every(k=>digest(p[k])&&p[k]===x[k])||(p.bodyBeforeDigest===p.bodyAfterDigest)!==sameSource
   ||!exact(p.control,['objects','bytes'])||![p.control.objects,p.control.bytes].every(v=>Number.isSafeInteger(v)&&v>0)
   ||!Array.isArray(p.allowedPaths)||!p.allowedPaths.length)return null;
 const allowed=new Map();
 for(const entry of p.allowedPaths){
  if(!exact(entry,['key','role'])||!footprint.has(entry.key)||footprint.get(entry.key)!==entry.role||allowed.has(entry.key))return null;
  allowed.set(entry.key,entry.role);
 }
 const s=p.sitemap;
 if(s!==null&&(!exact(s,['beforeSHA','afterSHA','expectedLastmodChanges','observedLastmodChanges','otherXMLChanges','routeSetDigest','timeDerivedKeysDigest'])
    ||![s.beforeSHA,s.afterSHA,s.routeSetDigest,s.timeDerivedKeysDigest].every(digest)||s.beforeSHA===s.afterSHA
    ||s.expectedLastmodChanges!==46||s.observedLastmodChanges!==s.expectedLastmodChanges||s.otherXMLChanges!==0
    ||!allowed.has('sitemap.xml')))return null;
 if(s===null&&allowed.has('sitemap.xml'))return null;
 if(sameSource&&(s===null||allowed.size!==1||!allowed.has('sitemap.xml')))return null;
 return {allowed,sameSource};
}
function measureDelta(from,to,allowed,sitemap,direction){
 const f=[...from].filter(([,e])=>e.role!=='static'), t=[...to].filter(([,e])=>e.role!=='static');
 if(f.length!==t.length||f.some(([k,e])=>!to.has(k)||to.get(k).key!==e.key||to.get(k).role!==e.role))return null;
 const changes=[];
 for(const [key,row] of t){
  const old=from.get(key);
  if(same(old,row))continue;
  if(allowed.get(key)!==row.role||row.key!==key)return null;
  if(row.role==='sitemap'){
   const [before,after]=direction==='forward'?[sitemap?.beforeSHA,sitemap?.afterSHA]:[sitemap?.afterSHA,sitemap?.beforeSHA];
   if(old.sha256!==before||row.sha256!==after||seal(old.metadata)!==seal(row.metadata))return null;
  }
  const body=old.sha256!==row.sha256||old.bytes!==row.bytes;
  const metadata=seal(old.metadata)!==seal(row.metadata);
  changes.push({key,reason:body?(metadata?'both':'body'):'metadata',bytes:row.bytes,direction});
 }
 return changes.sort((a,b)=>utcSort(a.key,b.key));
}
export function planContentCoexistence(bundle,trustedContext){
 try{
  const validated=validateEvidence(bundle,trustedContext);
  if(!validated.ok)return held(...validated.reasons);
  const v=validated.evidence;
  const inventory=reconcileInventories(v);
  if(!inventory.ok)return held(...inventory.reasons);
  const retained=inventory.protectedKeys.length;
  if(v.identical)return result('NOOP',[],[],{retainsStatic:retained});
  if(v.active.artifactDigest===v.proposed.artifactDigest)return held('INCONSISTENT_ARTIFACT_IDENTITY');
  const policy=policyMap(v.policy,v);
  if(!policy)return held('UNKNOWN_OR_UNREVIEWED_POLICY');
  const {allowed,sameSource}=policy;
  const forward=measureDelta(inventory.active,inventory.proposed,allowed,v.policy.sitemap,'forward');
  const rollback=measureDelta(inventory.proposed,inventory.rollback,allowed,v.policy.sitemap,'rollback');
  if(!forward||!rollback||sameSource&&(forward.length!==1||rollback.length!==1))return held('UNEXPLAINED_MUTABLE_CHANGE_OR_MISSING_KEY');
  const totals=count(forward);
  if(!Number.isSafeInteger(totals.bytes)||!Number.isSafeInteger(count(rollback).bytes))return held('INVALID_BYTE_TOTAL');
  const control=v.policy.control;
  // Integer arithmetic, so threshold boundaries are not rounded into a pass.
  const meetsBudget=BigInt(totals.objects)*20n<=BigInt(control.objects)&&BigInt(totals.bytes)*20n<=BigInt(control.bytes);
  return result(sameSource?'SITEMAP_ONLY':'SHADOW_ELIGIBLE',[],[...forward,...rollback],{retainsStatic:retained,control,meetsBudget});
 }catch{return held('INVALID_EVIDENCE');}
}
export function invalidLocalReport(){return held('INVALID_LOCAL_EVIDENCE_FILE');}
