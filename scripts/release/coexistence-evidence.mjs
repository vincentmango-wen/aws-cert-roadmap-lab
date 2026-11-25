import {createHash} from 'node:crypto';

const verified = new WeakSet();
const effectiveValues = ['NEXT_PUBLIC_API_BASE_URL','NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_GA_MEASUREMENT_ID','NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID'];
export const IAM_PATH = 'frontend/contents/blog/zh/clf-iam-basics.mdx';
const record = (v) => v!==null && typeof v==='object' && [Object.prototype,null].includes(Object.getPrototypeOf(v));
export const exact = (v,keys) => record(v) && Reflect.ownKeys(v).length===keys.length && keys.every(k=>Object.hasOwn(v,k) && Object.hasOwn(Object.getOwnPropertyDescriptor(v,k),'value'));
export const digest = (v) => typeof v==='string' && /^[a-f0-9]{64}$/u.test(v);
const git = (v) => typeof v==='string' && /^[a-f0-9]{40}$/u.test(v);
const token = (v) => typeof v==='string' && /^[a-zA-Z0-9][a-zA-Z0-9._~-]{0,127}$/u.test(v);
const text = (v) => typeof v==='string' && v.length>0 && v.length<1025 && /^[ -~]+$/u.test(v) && v.trim()===v;
function ordered(v) {
 if(Array.isArray(v)) {
  if(Object.keys(v).length!==v.length)throw new Error('noncanonical array');
  return v.map(ordered);
 }
 if(record(v)){
  if(Reflect.ownKeys(v).some(k=>typeof k!=='string'||!Object.hasOwn(Object.getOwnPropertyDescriptor(v,k),'value'))) throw new Error('noncanonical object');
  return Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered(v[k])]));
 }
 if(v===null||typeof v==='string'||typeof v==='boolean'||Number.isSafeInteger(v)&&!Object.is(v,-0)) return v;
 throw new Error('noncanonical value');
}
export const seal = (v) => createHash('sha256').update(JSON.stringify(ordered(v))).digest('hex');
const fail = (...reasons) => ({ok:false,reasons});
const utc = (v) => {
 if(typeof v!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/u.test(v))return NaN;
 const n=Date.parse(v);return Number.isFinite(n)&&new Date(n).toISOString()===v?n:NaN;
};
export const siteKey = (k) => typeof k==='string'&&k.length>0&&Buffer.byteLength(k)<=1024&&k.normalize('NFC')===k
  && Buffer.from(k).toString('utf8')===k && !/[\\%?#:\x00-\x1F\x7F-\x9F]/u.test(k) && k.split('/').every(x=>x&&x!=='.'&&x!=='..');
const clockDate = (v) => typeof v==='string'&&Number.isFinite(utc(v+'T00:00:00.000Z'));
const envKeys=['node','npm','next','platform','runner','lockDigest','runtimeDigest','clockPolicyDigest','taipeiDate','values'];
function environment(e) {
 return exact(e,envKeys)&&[e.node,e.npm,e.next,e.platform,e.runner].every(token)&&e.next==='16.2.6'
  && [e.lockDigest,e.runtimeDigest,e.clockPolicyDigest].every(digest)&&clockDate(e.taipeiDate)&&exact(e.values,effectiveValues)
  && Object.values(e.values).every(v=>exact(v,['state'])&&v.state==='absent'
   ||exact(v,['state','equalityDigest','empty'])&&v.state==='present'&&digest(v.equalityDigest)&&typeof v.empty==='boolean');
}
const keys=['version','id','sequence','invocationId','commit','tree','artifactDigest','compilerDigest','exportDigest','buildId','environment','targetId','routeFingerprint','configFingerprint','routeSchemaFingerprint','compilerStatic','export'];
function receipt(r){
 return exact(r,keys)&&r.version===1&&[r.id,r.invocationId,r.buildId,r.targetId].every(token)
 &&Number.isSafeInteger(r.sequence)&&r.sequence>=0&&git(r.commit)&&git(r.tree)&&environment(r.environment)
 && [r.artifactDigest,r.compilerDigest,r.exportDigest,r.routeFingerprint,r.configFingerprint,r.routeSchemaFingerprint].every(digest)
 &&Array.isArray(r.compilerStatic)&&r.compilerStatic.length>0&&Array.isArray(r.export)&&r.export.length>0;
}
const trustKeys=['version','targetId','now','approvalExpires','maxAgeMs','activeReceiptDigest','candidateReceiptDigest','protectedRoster','rollbackId','snapshotDigest','policyDigest','approvedSource'];
const snapshotKeys=['version','targetId','observedAt','activeId','activeArtifact','configFingerprint','routeFingerprint','pending','objects'];
const sourceHashes=['patchDigest','outsideDiffDigest','frontmatterDigest','bodyBeforeDigest','bodyAfterDigest'];
const sourceKeys=['path','baseTree','candidateCommit','candidateTree',...sourceHashes];
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** The caller supplies the trusted register independently. A digest is binding, not a signature. */
export function validateEvidence(bundle,trustedContext){
 try {
  const t=trustedContext;
  if(!exact(t,trustKeys)||t.version!==1||!token(t.targetId)||!token(t.rollbackId)
    ||![t.activeReceiptDigest,t.candidateReceiptDigest,t.snapshotDigest,t.policyDigest].every(digest)
    ||!Number.isSafeInteger(t.maxAgeMs)||t.maxAgeMs<=0
    ||!exact(t.approvedSource,sourceKeys)||t.approvedSource.path!==IAM_PATH
    ||![t.approvedSource.baseTree,t.approvedSource.candidateTree,t.approvedSource.candidateCommit].every(git)
    ||!sourceHashes.every(k=>digest(t.approvedSource[k])))return fail('INVALID_TRUST_REGISTER');
  if(!exact(bundle,['version','active','proposed','snapshot','protected','policy'])||bundle.version!==1)return fail('INVALID_EVIDENCE');
  const {active,proposed,snapshot,protected:history,policy}=bundle;
  if(!receipt(active)||!receipt(proposed))return fail('INVALID_RECEIPT');
  if(seal(active)!==t.activeReceiptDigest||seal(proposed)!==t.candidateReceiptDigest||seal(policy)!==t.policyDigest)return fail('UNPINNED_RECEIPT_OR_POLICY');
  if(active.targetId!==t.targetId||proposed.targetId!==t.targetId)return fail('CROSS_TARGET_RECEIPT');
  if(!exact(snapshot,snapshotKeys)||snapshot.version!==1||!Array.isArray(snapshot.objects)||snapshot.pending!==false
    ||snapshot.targetId!==t.targetId||snapshot.activeId!==active.id||snapshot.activeArtifact!==active.artifactDigest
    ||snapshot.configFingerprint!==active.configFingerprint||snapshot.routeFingerprint!==active.routeFingerprint
    ||seal(snapshot)!==t.snapshotDigest)return fail('INCOMPLETE_OR_UNPINNED_SNAPSHOT');
  const now=utc(t.now), asOf=utc(snapshot.observedAt), expires=utc(t.approvalExpires);
  if(![now,asOf,expires].every(Number.isFinite)||asOf>now||now-asOf>t.maxAgeMs||expires<=now)return fail('STALE_OBSERVATION_OR_APPROVAL');
  if(!Array.isArray(history)||history.length<2||!Array.isArray(t.protectedRoster)||t.protectedRoster.length!==history.length)return fail('INCOMPLETE_ROSTER');
  const seen=new Set(), runs=new Set();
  for(let i=0;i<history.length;i++){
    const previous=history[i],pin=t.protectedRoster[i];
    if(!receipt(previous)||previous.targetId!==t.targetId||seen.has(previous.id)||runs.has(previous.invocationId)
       ||i>0&&previous.sequence<=history[i-1].sequence||!exact(pin,['id','sequence','digest'])
       ||pin.id!==previous.id||pin.sequence!==previous.sequence||pin.digest!==seal(previous))return fail('UNPINNED_OR_UNORDERED_GENERATION');
    seen.add(previous.id);runs.add(previous.invocationId);
  }
  if(seal(history.at(-1))!==t.activeReceiptDigest)return fail('INCOMPLETE_ROSTER');
  // This bounded A→B report may reverse only to the exact independently pinned A receipt.
  // Other verified historical releases still contribute protected static objects, not rollback authority.
  if(t.rollbackId!==active.id)return fail('ROLLBACK_NOT_EXACT_PRIOR_ACTIVE');
  const identical=t.activeReceiptDigest===t.candidateReceiptDigest;
  if(!identical&&(seen.has(proposed.id)||runs.has(proposed.invocationId)||proposed.sequence!==active.sequence+1))return fail('OUT_OF_ORDER_OR_OVERLAPPING_CANDIDATE');
  if(seal(active.environment)!==seal(proposed.environment)||active.buildId!==proposed.buildId
     ||['routeFingerprint','configFingerprint','routeSchemaFingerprint'].some(k=>active[k]!==proposed[k]))return fail('RUNTIME_ROUTE_OR_CONFIG_DRIFT');
  const evidence=freeze(structuredClone({active,proposed,snapshot,history,policy,approvedSource:t.approvedSource,identical}));
  verified.add(evidence);
  return {ok:true,evidence,reasons:[]};
 } catch {return fail('INVALID_EVIDENCE');}
}

const metadata = (m) => exact(m,['contentType','contentEncoding','cacheControl','variants'])&&text(m.contentType)
 &&[m.contentEncoding,m.cacheControl].every(v=>v===null||text(v))&&record(m.variants)
 &&Reflect.ownKeys(m.variants).every(k=>typeof k==='string'&&/^[a-z0-9][a-z0-9-]*$/u.test(k)&&(m.variants[k]===null||text(m.variants[k])));
export const same = (a,b) => a.sha256===b.sha256&&a.bytes===b.bytes&&seal(a.metadata)===seal(b.metadata);
const roles=new Set(['static','document','flight','sitemap','other']);
const validBytes=(e)=>digest(e.sha256)&&Number.isSafeInteger(e.bytes)&&e.bytes>=0&&!Object.is(e.bytes,-0)&&metadata(e.metadata);
function index(rows, compiler) {
 const map=new Map(),source=new Set();
 for(const e of rows){
  if(!exact(e,['key','effectiveKey','role','sha256','bytes','metadata'])||!siteKey(e.key)||!siteKey(e.effectiveKey)
   ||!roles.has(e.role)||!validBytes(e)||source.has(e.key)||map.has(e.effectiveKey)
   ||compiler&&e.role!=='static'||e.key.startsWith('_next/static/')!==(e.role==='static')
   ||e.effectiveKey.startsWith('_next/static/')!==(e.role==='static'))return null;
  source.add(e.key);map.set(e.effectiveKey,e);
 }
 return map;
}
export function reconcileInventories(evidence){
 if(!verified.has(evidence))return fail('UNVERIFIED_EVIDENCE');
 try{
  const inventories=new Map(), protectedStatic=new Map();
  for(const r of [...evidence.history,evidence.proposed]){
   const compiled=index(r.compilerStatic,true),exported=index(r.export,false);
   if(!compiled||!exported)return fail('INVALID_OR_COLLIDING_INVENTORY');
   if([...exported.values()].filter(e=>e.role==='static').length!==compiled.size
      ||[...compiled].some(([k,e])=>!exported.has(k)||exported.get(k).role!=='static'||exported.get(k).key!==e.key||!same(e,exported.get(k))))return fail('COMPILE_EXPORT_MISMATCH');
   inventories.set(r.id,exported);
   if(r===evidence.proposed)continue;
   for(const [k,e] of compiled){
    if(protectedStatic.has(k)&&!same(e,protectedStatic.get(k)))return fail('PROTECTED_KEY_COLLISION');
    protectedStatic.set(k,e);
   }
  }
  const active=inventories.get(evidence.active.id),proposed=inventories.get(evidence.proposed.id);
  const aStatic=[...active].filter(([,v])=>v.role==='static'), bStatic=[...proposed].filter(([,v])=>v.role==='static');
  if(aStatic.length!==bStatic.length||aStatic.some(([k,e])=>!proposed.has(k)||proposed.get(k).role!=='static'||proposed.get(k).key!==e.key||!same(e,proposed.get(k))))return fail('STATIC_SET_OR_METADATA_DRIFT');
  const expected=new Map([...active,...protectedStatic]);
  const observed=new Map();
  for(const e of evidence.snapshot.objects){
   if(!exact(e,['key','state','sha256','bytes','metadata','checksumType','representation','version'])
     ||e.state!=='present'||e.checksumType!=='full-object'||e.representation!=='origin'||!text(e.version)
     ||!siteKey(e.key)||!validBytes(e)||observed.has(e.key))return fail('AMBIGUOUS_TARGET_OBSERVATION');
   observed.set(e.key,e);
  }
  if(expected.size!==observed.size||[...expected].some(([k,e])=>!observed.has(k)||!same(e,observed.get(k))))return fail('UNRECONCILED_TARGET');
  return {ok:true,active,proposed,rollback:active,protectedKeys:[...protectedStatic.keys()].sort(),observationFingerprint:seal(evidence.snapshot),reasons:[]};
 }catch{return fail('INVALID_INVENTORY');}
}
