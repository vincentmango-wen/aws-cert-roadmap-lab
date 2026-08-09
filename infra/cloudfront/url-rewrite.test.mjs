import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('./url-rewrite.js', import.meta.url), 'utf8');
const handler = new vm.Script(`${source}\nhandler`).runInNewContext();

function request(host, uri, querystring = {}) {
  return {
    headers: { host: { value: host } },
    uri,
    querystring
  };
}

test('apexのトップページをwwwへ301リダイレクトする', () => {
  const response = handler({ request: request('aws-cert-roadmap-lab.com', '/') });

  assert.equal(response.statusCode, 301);
  assert.equal(response.statusDescription, 'Moved Permanently');
  assert.equal(response.headers.location.value, 'https://www.aws-cert-roadmap-lab.com/');
});

test('apexのパスとquery stringをLocationへ保持する', () => {
  const response = handler({
    request: request('AWS-CERT-ROADMAP-LAB.COM', '/blog/example', {
      ref: { value: 'search%20console' },
      tag: { multiValue: [{ value: 'seo' }, { value: 'gsc' }] }
    })
  });

  assert.equal(
    response.headers.location.value,
    'https://www.aws-cert-roadmap-lab.com/blog/example?ref=search%20console&tag=seo&tag=gsc'
  );
});

test('percent encoding・plus・値なし・重複queryを再エンコードしない', () => {
  const response = handler({
    request: request('aws-cert-roadmap-lab.com', '/blog/example', {
      flag: { value: '' },
      encoded: { value: '%2F' },
      plus: { value: 'a+b' },
      dup: { multiValue: [{ value: '1' }, { value: '2' }] }
    })
  });

  assert.equal(
    response.headers.location.value,
    'https://www.aws-cert-roadmap-lab.com/blog/example?flag=&encoded=%2F&plus=a+b&dup=1&dup=2'
  );
});

test('wwwのトップページをindex.htmlへ書き換える', () => {
  const requestValue = request('www.aws-cert-roadmap-lab.com', '/');
  const result = handler({ request: requestValue });

  assert.equal(result.uri, '/index.html');
});

test('wwwの拡張子なしパスへhtml拡張子を付ける', () => {
  const requestValue = request('www.aws-cert-roadmap-lab.com', '/terms/cloudformation');
  const result = handler({ request: requestValue });

  assert.equal(result.uri, '/terms/cloudformation.html');
});

test('拡張子付き静的ファイルは変更しない', () => {
  const requestValue = request('www.aws-cert-roadmap-lab.com', '/sitemap.xml');
  const result = handler({ request: requestValue });

  assert.equal(result.uri, '/sitemap.xml');
});
