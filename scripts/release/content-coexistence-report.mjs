import {constants} from 'node:fs';
import {open} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {invalidLocalReport,planContentCoexistence} from './plan-content-coexistence.mjs';

const limit=64*1024*1024;
async function read(path){
 if(process.platform!=='linux'||typeof path!=='string'||!path||path.includes(':')||path.includes('\\')||path.split('/').includes('..'))throw Error('unsupported local path');
 const parts=resolve(path).split('/').filter(Boolean);
 if(!parts.length)throw Error('unsupported local path');
 const file=parts.pop(), nofollow=constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK;
 let dir=await open('/',nofollow|constants.O_DIRECTORY);
 try{
  for(const part of parts){
   const next=await open('/proc/self/fd/'+dir.fd+'/'+part,nofollow|constants.O_DIRECTORY);
   await dir.close();dir=next;
  }
  const handle=await open('/proc/self/fd/'+dir.fd+'/'+file,nofollow);
  try{
   const stat=await handle.stat({bigint:true});
   if(!stat.isFile()||stat.nlink!==1n||stat.size>BigInt(limit))throw Error('not a bounded local regular file');
   const body=await handle.readFile();
   const last=await handle.stat({bigint:true});
   if(BigInt(body.length)!==stat.size||last.size!==stat.size||last.mtimeNs!==stat.mtimeNs||last.ctimeNs!==stat.ctimeNs)throw Error('changed during read');
   const text=body.toString('utf8');
   if(!Buffer.from(text).equals(body))throw Error('non-UTF8 evidence');
   return {value:JSON.parse(text),inode:stat.dev+'/'+stat.ino};
  }finally{await handle.close();}
 }finally{await dir.close();}
}
/** The trust file must come from the independently verified register, never the evidence bundle. */
export async function reportFromFiles(evidencePath,trustPath){
 try{
  const [inputs,trust]=await Promise.all([read(evidencePath),read(trustPath)]);
  if(inputs.inode===trust.inode)return invalidLocalReport();
  return planContentCoexistence(inputs.value,trust.value);
 }catch{return invalidLocalReport();}
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 const report=process.argv.length===4?await reportFromFiles(...process.argv.slice(2)):invalidLocalReport();
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
 if(report.decision==='HOLD')process.exitCode=2;
}
