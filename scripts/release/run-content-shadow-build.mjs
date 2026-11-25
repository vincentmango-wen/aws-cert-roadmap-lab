import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {homedir,tmpdir} from 'node:os';
import {join} from 'node:path';
import {copyFile,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {IAM_PATH,seal} from './coexistence-evidence.mjs';
import {compareBuilds,hold,inventoryFromRoots} from './content-shadow-build.mjs';

const pinnedLock='54aee460f1e169652ee72a23dfe0b2263f904d9bd553747bedfb74fd8339664a';
const buildId='shadow-376-iam-v1';
const marker='初學者首先要釐清 IAM User、IAM Group、IAM Role、IAM Policy 這四者的差異。';
const replacement='初學者可以先比較 IAM User、IAM Group、IAM Role 和 IAM Policy 的差異。';
const sha=(body)=>createHash('sha256').update(body).digest('hex');
const operation=(cmd,args,opts)=>execFileSync(cmd,args,opts);
const git=(...args)=>operation('git',args,{encoding:'utf8'}).trim();
const clockDate=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format();
const args=process.argv.slice(2);
const offline=args.length===1&&args[0]==='--offline';
let stage='INVALID_ARGUMENTS',work,report;
try{
 if(args.length&&!offline)throw Error('unsupported arguments');
 stage='INVALID_SOURCE_PROOF';
 const revision=git('rev-parse','--verify','HEAD');
 const sourceTree=git('rev-parse',`${revision}:frontend`);
 if(!/^[a-f0-9]{40}$/u.test(revision)||!/^[a-f0-9]{40}$/u.test(sourceTree))throw Error('invalid git identities');
 work=await mkdtemp(join(tmpdir(),'content-shadow-'));
 const archive=operation('git',['archive',revision,'frontend'],{maxBuffer:96*1024*1024});
 operation('tar',['-xf','-','-C',work],{input:archive});
 const frontend=join(work,'frontend');
 const configPath=join(frontend,'next.config.ts'), source=join(work,IAM_PATH);
 const lockPath=join(frontend,'package-lock.json');
 stage='UNAPPROVED_LOCKFILE';
 if(sha(await readFile(lockPath))!==pinnedLock)throw Error('reviewed lockfile changed');
 stage='FIXTURE_CONFIGURATION_DRIFT';
 const config=await readFile(configPath,'utf8');
 if(config.split('  output: "export",').length!==2||config.includes('generateBuildId'))throw Error('unexpected Next config');
 const fixedConfig=config.replace('  output: "export",',`  output: "export",\n  generateBuildId: async () => "${buildId}",`);
 await writeFile(configPath,fixedConfig);
 const before=await readFile(source,'utf8');
 const end=before.indexOf('\n---\n',4);
 if(!before.startsWith('---\n')||end<0||before.slice(end).split(marker).length!==2||before.slice(0,end).includes(marker))
  throw Error('fixture must edit an exact reviewed body marker only');
 const after=before.replace(marker,replacement);
 const font=join(work,'fixture.woff2'), mocked=join(work,'mock-fredoka.cjs');
 const publicInputs={
  NEXT_PUBLIC_API_BASE_URL:'https://api.shadow.invalid',NEXT_PUBLIC_SITE_URL:'https://shadow.invalid',
  NEXT_PUBLIC_GA_MEASUREMENT_ID:'G-SHADOW376',NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID:'ca-pub-0000000000000000',
 };
 const env={PATH:process.env.PATH,HOME:work,TMPDIR:work,TZ:'UTC',NEXT_TELEMETRY_DISABLED:'1'};
 if(offline)env.npm_config_cache=join(homedir(),'.npm');
 const run=(cmd,argv,more={})=>operation(cmd,argv,{cwd:frontend,env:{...env,...more},stdio:['ignore',2,2]});
 stage='LOCKED_DEPENDENCY_INSTALL_FAILED';
 run('npm',['ci','--ignore-scripts','--no-audit','--no-fund',...(offline?['--offline']:[])]);
 stage='FIXTURE_CONFIGURATION_DRIFT';
 if(sha(await readFile(lockPath))!==pinnedLock||JSON.parse(await readFile(join(frontend,'node_modules/next/package.json'),'utf8')).version!=='16.2.6')
  throw Error('installed toolchain mismatch');
 // The bundled, local font bytes are a synthetic stand-in. No request is made to Google Fonts.
 await copyFile(join(frontend,'node_modules/next/dist/next-devtools/server/font/geist-latin.woff2'),font);
 const css=`/* latin */\n@font-face{font-family:'Fredoka';font-weight:700;font-style:normal;font-display:swap;src:url(${font}) format('woff2');}`;
 await writeFile(mocked,'module.exports = '+JSON.stringify({'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap':css})+';\n');
 const date=clockDate(), inputDigest=seal({sourceTree,config:sha(fixedConfig),lock:pinnedLock,date,
  node:process.version,next:'16.2.6',platform:process.platform,arch:process.arch,font:sha(await readFile(font)),publicInputs});
 async function arm(expected){
  if(await readFile(source,'utf8')!==expected||await readFile(configPath,'utf8')!==fixedConfig||sha(await readFile(lockPath))!==pinnedLock)
   throw Error('arm sources changed unexpectedly');
  for(const path of ['.next','out'])await rm(join(frontend,path),{recursive:true,force:true});
  const start=Date.now();
  if(clockDate()!==date)throw Error('different Taipei build date');
  run('npm',['run','build'],{...publicInputs,NEXT_FONT_GOOGLE_MOCKED_RESPONSES:mocked});
  const end=Date.now();
  if(clockDate()!==date)throw Error('unstable Taipei build date');
  const evidence=await inventoryFromRoots(join(frontend,'out'),join(frontend,'.next/static'));
  return {...evidence,inputDigest,window:[start,end],buildId:(await readFile(join(frontend,'.next/BUILD_ID'),'utf8')).trim()};
 }
 stage='BUILD_OR_INVENTORY_FAILED';
 const baseline=await arm(before), replay=await arm(before);
 await writeFile(source,after);
 const candidate=await arm(after);
 report={sourceRevision:revision,sourceScope:IAM_PATH,
  purpose:'offline fixture; only export body bytes; no serving metadata or live baseline',
  replay:compareBuilds(baseline,replay,{kind:'replay',expectedBuildId:buildId}),
  candidate:compareBuilds(baseline,candidate,{kind:'content',expectedBuildId:buildId})};
 if(report.replay.decision==='HOLD'||report.candidate.decision==='HOLD')process.exitCode=2;
}catch{
 report={replay:hold(stage),candidate:hold(stage)};process.exitCode=2;
}finally{
 if(work)await rm(work,{recursive:true,force:true});
}
process.stdout.write(JSON.stringify(report,null,2)+'\n');
