import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyHead } from '../s3-origin-observation.mjs';

const sample = { ContentLength: 47, ContentType: 'text/html', CacheControl: 'no-cache', ETag: '"abc"', ChecksumSHA256: Buffer.alloc(32, 7).toString('base64'), ChecksumType: 'FULL_OBJECT' };
test('retains full-object SHA-256 and serving metadata without interpreting the ETag as a checksum', () => {
  const o=classifyHead({ status: 200, head: sample });
  assert.equal(o.state,'present');
  assert.equal(o.sha256, '07'.repeat(32));
  assert.equal(o.bytes,47);
  assert.deepEqual(o.metadata,{contentType:'text/html',contentEncoding:null,cacheControl:'no-cache',variants:{}});
});
test('missing or composite checksums, malformed data and permission errors remain unknown', () => {
  for (const head of [{...sample,ChecksumType:'COMPOSITE'}, {...sample,ChecksumType:undefined}, {...sample,ChecksumSHA256:'bad'}, {...sample,ContentLength:-1}]) assert.equal(classifyHead({status:200,head}).state,'unknown');
  for(const status of [403,404,405,500]) assert.equal(classifyHead({status}).state,'unknown');
});
test('missing or unsupported serving headers are not defaulted to acceptable values', () => {
  for(const head of [{...sample,CacheControl:undefined},{...sample,ContentType:''},{...sample,ContentEncoding:'\ninvalid'}, {...sample,WebsiteRedirectLocation:'/other'}, {...sample,Metadata:{custom:'yes'}}]) assert.equal(classifyHead({status:200,head}).state,'unknown');
});
