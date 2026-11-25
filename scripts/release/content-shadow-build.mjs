import {createHash} from 'node:crypto';
import {lstat,readdir,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {digest,siteKey} from './coexistence-evidence.mjs';

const page='zh/blog/clf-iam-basics';
// This fixture proves one reviewed case only. The live-evidence planner owns its separate policy.
const allowed=new Set([
 'zh.html','zh.txt','zh/__next.!KHNpdGUp.zh.__PAGE__.txt','zh/__next._full.txt',
 page+'.html',page+'.txt',page+'/__next.!KHNpdGUp.zh.blog.$d$postSlug.__PAGE__.txt',page+'/__next._full.txt',
 'zh/updates.html','zh/updates.txt','zh/updates/__next.!KHNpdGUp.zh.updates.__PAGE__.txt','zh/updates/__next._full.txt',
]);
// Exact fallback routes observed on the pinned fixture. Unknown changes require review.
const fallbackRoutes=['','/about','/architectures','/blog','/comparisons','/comparisons/aws-compute-ec2-lambda-ecs',
 '/contact','/disclaimer','/privacy','/questions','/questions/aif','/questions/clf','/questions/saa','/roadmap','/terms'];
const fallbackPaths=new Set(['/',...fallbackRoutes.slice(1),'/terms-of-service',
 ...['/en','/zh'].flatMap(locale=>fallbackRoutes.map(path=>locale+path))]);
const sha=(v)=>createHash('sha256').update(v).digest('hex');
const staticKey=(v)=>v.startsWith('_next/static/');
const row=(body)=>({bytes:body.length,sha256:sha(body)});
const equal=(a,b)=>!!a&&!!b&&a.bytes===b.bytes&&a.sha256===b.sha256;
const sort=(a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b));
const count=(rows)=>({objects:rows.length,bytes:rows.reduce((n,r)=>n+r.bytes,0)});
function result(decision, reasons=[], forward=[], rollback=[], lastmodChanges=0){
 return {mode:'synthetic-fixture',decision,executable:false,forward,rollback,
  counts:{forward:count(forward),rollback:count(rollback)},sitemapLastmodChanges:lastmodChanges,reasons};
}
export const hold=(reason)=>result('HOLD',[reason]);

async function walk(dir,prefix='',map=new Map(),state={files:0}){
 const info=await lstat(dir);
 if(!info.isDirectory())throw Error('expected regular directory');
 for(const name of await readdir(dir)){
  const key=prefix+name, path=join(dir,name), stat=await lstat(path);
  if(!siteKey(key))throw Error('invalid export key');
  if(stat.isDirectory())await walk(path,key+'/',map,state);
  else {
   if(!stat.isFile()||stat.nlink!==1)throw Error('expected regular file');
   if(++state.files>30_000||stat.size>32*1024*1024)throw Error('export inventory limit exceeded');
   const body=await readFile(path);
   if(body.length!==stat.size)throw Error('file size drift');
   map.set(key,row(body));
  }
 }
 return map;
}

export async function inventoryFromRoots(exportRoot,compilerStaticRoot){
 const exported=await walk(exportRoot),compiled=await walk(compilerStaticRoot,'_next/static/');
 if(!compiled.size||!exported.has('sitemap.xml'))throw Error('missing compile or export evidence');
 const input=await readFile(join(exportRoot,'sitemap.xml'));
 const sitemap=new TextDecoder('utf-8',{fatal:true}).decode(input);
 if(!equal(exported.get('sitemap.xml'),row(Buffer.from(sitemap))))throw Error('sitemap body does not bind to export');
 return {compiled,exported,sitemap};
}

const validRows=(map)=>map instanceof Map&&map.size>0&&[...map].every(([key,v])=>siteKey(key)&&
 Number.isSafeInteger(v?.bytes)&&v.bytes>=0&&digest(v.sha256));
const validWindow=(w)=>Array.isArray(w)&&w.length===2&&w.every(Number.isSafeInteger)&&
 w[0]<=w[1]&&w[1]-w[0]<=15*60*1000;
const valid=(a)=>validRows(a?.compiled)&&validRows(a.exported)&&validWindow(a.window)&&digest(a.inputDigest)
 &&typeof a.sitemap==='string'&&equal(a.exported.get('sitemap.xml'),row(Buffer.from(a.sitemap)));
const identical=(a,b)=>a.size===b.size&&[...a].every(([k,v])=>equal(v,b.get(k)));
const select=(m,p)=>new Map([...m].filter(([k])=>p(k)));
function timestampsOnly(a,b,approvedFallbacks){
 // Require exact equality of every other byte in the generated XML, including URL and hreflang order.
 const tag=/<lastmod>(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z)<\/lastmod>/gu;
 const split=(s)=>{
  const times=[],seen=new Set();
  const skeleton=s.replace(/<url>([\s\S]*?)<\/url>/gu,(_,entry)=>{
   const loc=[...entry.matchAll(/<loc>([^<]+)<\/loc>/gu)],mod=[...entry.matchAll(tag)];
   if(loc.length!==1||seen.has(loc[0][1])||mod.length>1)throw Error('invalid sitemap record');
   const url=new URL(loc[0][1]);seen.add(loc[0][1]);
   if(mod.length)times.push({url,time:mod[0][1]});
   return '<url>'+entry.replace(tag,'<lastmod>TIME</lastmod>')+'</url>';
  });
  return {times,skeleton};
 };
 const x=split(a.sitemap),y=split(b.sitemap);
 if(x.skeleton!==y.skeleton||x.times.length!==y.times.length)return 0;
 const belongs=(t,w)=>{const m=Date.parse(t);return Number.isFinite(m)&&new Date(m).toISOString()===t&&m>=w[0]&&m<=w[1];};
 let n=0;
 for(let i=0;i<x.times.length;i++){
  const {url,time}=x.times[i], next=y.times[i].time;
  if(time===next)continue;
  if(url.origin!=='https://shadow.invalid'||url.search||url.hash||!approvedFallbacks.has(url.pathname)
    ||!belongs(time,a.window)||!belongs(next,b.window))return 0;
  n++;
 }
 return n;
}

/** Local measured bodies only: no production identities, headers or execution. */
export function compareBuilds(a,b,{kind,expectedBuildId,approvedFallbacks=fallbackPaths}={}){
 try{
  if(!valid(a)||!valid(b)||!['content','replay'].includes(kind)||typeof expectedBuildId!=='string'||!expectedBuildId)
   return hold('MALFORMED_BUILD_EVIDENCE');
  if(a.inputDigest!==b.inputDigest||a.buildId!==expectedBuildId||b.buildId!==expectedBuildId)
   return hold('UNAPPROVED_BUILD_INPUT_DRIFT');
  for(const x of [a,b])if(!identical(x.compiled,select(x.exported,staticKey)))return hold('COMPILE_EXPORT_MISMATCH');
  if(!identical(a.compiled,b.compiled))return hold('ASSET_MANIFEST_DRIFT');
  if(a.exported.size!==b.exported.size||[...a.exported.keys()].some(k=>!b.exported.has(k)))return hold('ROUTE_PAYLOAD_KEYSET_DRIFT');
  const changed=[...a.exported.keys()].filter(k=>!equal(a.exported.get(k),b.exported.get(k))).sort(sort);
  if(changed.some(k=>k!=='sitemap.xml'&&(kind==='replay'||!allowed.has(k))))return hold('UNAPPROVED_DEPENDENCY_DRIFT');
  const lastmodChanges=changed.includes('sitemap.xml')?timestampsOnly(a,b,approvedFallbacks):0;
  if(changed.includes('sitemap.xml')&&!lastmodChanges)return hold('UNPROVEN_SITEMAP_CHANGE');
  const articleChanged=changed.includes(page+'.html')&&changed.includes(page+'.txt');
  if(kind==='content'&&!articleChanged)return hold('MISSING_APPROVED_FIXTURE_CHANGE');
  const toRows=(m)=>changed.map(key=>({key,bytes:m.get(key).bytes}));
  return result(!changed.length?'NOOP':kind==='replay'?'SITEMAP_ONLY':'SHADOW_ELIGIBLE',[],
   toRows(b.exported),toRows(a.exported),lastmodChanges);
 }catch{return hold('MALFORMED_BUILD_EVIDENCE');}
}
