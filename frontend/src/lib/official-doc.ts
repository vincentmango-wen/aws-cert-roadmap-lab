/**
 * Shared officialDocs URL validation. Check the scheme and allowlist before JSON url strings reach
 * anchor href attributes. Used by QuestionPlayer.tsx and terms/[termId]/page.tsx. Allow only HTTPS
 * (reject javascript, data, vbscript, etc.) and the two official AWS domains. Update this source when
 * the Step3 batch needs additional domains; keep any documented script copies synchronized.
 */
import type { OfficialDoc } from "@/types/official-doc";

const ALLOWED_PREFIXES = [
  "https://aws.amazon.com/",
  "https://docs.aws.amazon.com/",
] as const;

/**
 * Return true only for allowlisted URLs. Parse failures, unlisted domains and non-HTTPS schemes all
 * return false.
 */
export function isValidOfficialDocUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_PREFIXES.some((prefix) => url.startsWith(prefix));
  } catch {
    return false;
  }
}

/**
 * Return only allowlisted officialDocs entries. Undefined or empty input returns an empty array.
 */
export function filterValidOfficialDocs(
  docs: OfficialDoc[] | undefined,
): OfficialDoc[] {
  if (!docs || docs.length === 0) return [];
  return docs.filter((doc) => isValidOfficialDocUrl(doc.url));
}
