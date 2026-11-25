import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as origin from '../s3-origin-observation.mjs';
const { classifyHead } = origin;

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

const body = Buffer.from([0x00, 0x80, 0xff]);
const get = { status: 200, directFullResponse: true, get: { ContentLength: body.length, ContentType: 'text/html' }, body };

test('withheld or malformed user metadata makes HEAD evidence unknown even with a valid digest', () => {
  for (const MissingMeta of [1, -1, 0.5, '0', null, undefined]) {
    assert.equal(classifyHead({ status: 200, head: { ...sample, MissingMeta } }).state, 'unknown');
  }
  assert.equal(classifyHead({ status: 200, head: { ...sample, MissingMeta: 0 } }).state, 'present');
});

test('a trusted full GET hashes raw bytes and represents absent optional serving headers as null', () => {
  assert.equal(typeof origin.classifyGet, 'function');
  const o = origin.classifyGet(get);
  assert.equal(o.state, 'present');
  assert.equal(o.sha256, '5240672d7b51756b829ad0ef8d9468b7a078afa2f410484fd3892dab47becb72');
  assert.equal(o.bytes, 3);
  assert.deepEqual(o.metadata, { contentType: 'text/html', contentEncoding: null, cacheControl: null, variants: {} });
  const explicit = origin.classifyGet({ ...get, get: { ...get.get, CacheControl: 'no-cache', ContentEncoding: 'gzip', MissingMeta: 0 } });
  assert.equal(explicit.metadata.cacheControl, 'no-cache');
  assert.equal(explicit.metadata.contentEncoding, 'gzip');
});

test('GET evidence stays unknown for partial, unbound or length-mismatched observations', () => {
  assert.equal(typeof origin.classifyGet, 'function');
  for (const change of [
    { status: 206 }, { status: 403 }, { status: 412 }, { directFullResponse: undefined }, { body: 'not raw bytes' },
    { body: body.subarray(0, 2) }, { body: Buffer.concat([body, body]) }, { get: { ...get.get, ContentLength: '3' } },
    { get: { ...get.get, ContentRange: 'bytes 0-2/5' } }, { get: { ...get.get, PartsCount: 2 } }, { get: { ...get.get, DeleteMarker: true } },
  ]) assert.equal(origin.classifyGet({ ...get, ...change }).state, 'unknown');
});

test('GET evidence stays unknown for withheld, ambiguous or unmodeled serving metadata', () => {
  assert.equal(typeof origin.classifyGet, 'function');
  for (const extra of [
    ...[1, -1, 0.5, '0', null, undefined].map(MissingMeta => ({ MissingMeta })),
    { ContentType: undefined }, { CacheControl: undefined }, { CacheControl: null }, { ContentEncoding: '' },
    { ContentEncoding: 'gzip\n' }, { ContentDisposition: 'attachment' }, { ContentLanguage: 'en' },
    { Expires: 'tomorrow' }, { ExpiresString: 'malformed' }, { WebsiteRedirectLocation: '/other' },
    { Metadata: { custom: 'yes' } }, { Metadata: null },
  ]) assert.equal(origin.classifyGet({ ...get, get: { ...get.get, ...extra } }).state, 'unknown');
});
