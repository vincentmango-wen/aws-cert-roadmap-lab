// Interpret bounded S3 evidence offline. This module never contacts AWS.
import { createHash } from 'node:crypto';

const unknown = reason => ({ state: 'unknown', reason });
const safeText = value => typeof value === 'string' && value.trim() === value && value.length > 0 && value.length <= 1024 && !/[\x00-\x1f\x7f]/.test(value);
const record = value => value !== null && typeof value === 'object' &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const validLength = response => record(response) && Object.hasOwn(response, 'ContentLength') &&
  Number.isSafeInteger(response.ContentLength) && response.ContentLength >= 0;

function inspectServingMetadata(response, allowAbsentCacheControl) {
  // S3 reports omitted x-amz-meta-* entries explicitly. Do not treat a partial
  // or malformed inventory as an empty inventory.
  if ('MissingMeta' in response && response.MissingMeta !== 0) return undefined;
  if (['WebsiteRedirectLocation', 'ContentDisposition', 'ContentLanguage', 'Expires', 'ExpiresString']
    .some(field => field in response)) return undefined;
  if ('Metadata' in response && (!record(response.Metadata) || Reflect.ownKeys(response.Metadata).length !== 0)) return undefined;
  if (!Object.hasOwn(response, 'ContentType') || !safeText(response.ContentType)) return undefined;
  for (const field of ['CacheControl', 'ContentEncoding']) {
    if (field in response && (!Object.hasOwn(response, field) || !safeText(response[field]))) return undefined;
  }
  if (!allowAbsentCacheControl && !Object.hasOwn(response, 'CacheControl')) return undefined;
  return {
    contentType: response.ContentType,
    contentEncoding: response.ContentEncoding ?? null,
    cacheControl: response.CacheControl ?? null,
    variants: {},
  };
}

export function classifyHead(observation) {
  if (!observation || observation.status !== 200) return unknown('HEAD_NOT_AUTHORITATIVE');
  const { head } = observation;
  if (!validLength(head)) return unknown('HEAD_INVALID');
  const encoded = head.ChecksumSHA256;
  if (head.ChecksumType !== 'FULL_OBJECT' || typeof encoded !== 'string' || !/^[A-Za-z0-9+/]{43}=$/.test(encoded)) {
    return unknown('FULL_OBJECT_SHA256_REQUIRED');
  }
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length !== 32 || bytes.toString('base64') !== encoded) return unknown('FULL_OBJECT_SHA256_REQUIRED');
  const metadata = inspectServingMetadata(head, false);
  if (!metadata) return unknown('SERVING_METADATA_UNPROVEN');
  return { state: 'present', sha256: bytes.toString('hex'), bytes: head.ContentLength, checksumType: 'full-object', metadata };
}

export function classifyGet(observation) {
  // Only a trusted collector can assert provenance: one direct full S3
  // response without range/part selection, header overrides or projection.
  if (!observation || observation.status !== 200 || observation.directFullResponse !== true) {
    return unknown('GET_NOT_AUTHORITATIVE');
  }
  const { get, body } = observation;
  if (!validLength(get) || 'ContentRange' in get || 'PartsCount' in get ||
      ('DeleteMarker' in get && get.DeleteMarker !== false) ||
      !Buffer.isBuffer(body) || body.length !== get.ContentLength) return unknown('GET_INVALID');
  const metadata = inspectServingMetadata(get, true);
  if (!metadata) return unknown('SERVING_METADATA_UNPROVEN');
  return { state: 'present', sha256: createHash('sha256').update(body).digest('hex'), bytes: body.length,
    checksumType: 'locally-computed-full-object', metadata };
}
