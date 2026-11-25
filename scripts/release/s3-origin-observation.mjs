// Interpret bounded S3 HeadObject evidence offline. This module never contacts AWS.
const safeText = value => typeof value === 'string' && value.trim() === value && value.length > 0 && value.length <= 1024 && !/[\x00-\x1f\x7f]/.test(value);

export function classifyHead(observation) {
  if (!observation || observation.status !== 200) return { state: 'unknown', reason: 'HEAD_NOT_AUTHORITATIVE' };
  const head = observation.head;
  if (!head || !Number.isSafeInteger(head.ContentLength) || head.ContentLength < 0) {
    return { state: 'unknown', reason: 'HEAD_INVALID' };
  }
  const encoded = head.ChecksumSHA256;
  if (head.ChecksumType !== 'FULL_OBJECT' || typeof encoded !== 'string' || !/^[A-Za-z0-9+/]{43}=$/.test(encoded)) {
    return { state: 'unknown', reason: 'FULL_OBJECT_SHA256_REQUIRED' };
  }
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length !== 32 || bytes.toString('base64') !== encoded) {
    return { state: 'unknown', reason: 'FULL_OBJECT_SHA256_REQUIRED' };
  }
  if (!safeText(head.ContentType) || !safeText(head.CacheControl) ||
      (head.ContentEncoding !== undefined && !safeText(head.ContentEncoding)) ||
      head.WebsiteRedirectLocation !== undefined || head.ContentDisposition !== undefined ||
      head.ContentLanguage !== undefined || head.Expires !== undefined ||
      (head.Metadata !== undefined && (!head.Metadata || typeof head.Metadata !== 'object' || Array.isArray(head.Metadata) || Object.keys(head.Metadata).length !== 0))) {
    return { state: 'unknown', reason: 'SERVING_METADATA_UNPROVEN' };
  }
  return { state: 'present', sha256: bytes.toString('hex'), bytes: head.ContentLength, checksumType: 'full-object',
    metadata: { contentType: head.ContentType, contentEncoding: head.ContentEncoding ?? null, cacheControl: head.CacheControl, variants: {} } };
}
