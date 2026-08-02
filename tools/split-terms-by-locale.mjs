import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const repositoryRootPath = resolve(currentDirPath, "..");

const termsDirectoryPath = resolve(
  repositoryRootPath,
  "frontend",
  "contents",
  "terms",
);

const sourceTermsFilePath = resolve(termsDirectoryPath, "terms.json");

const outputFiles = {
  ja: resolve(termsDirectoryPath, "terms.ja.json"),
  en: resolve(termsDirectoryPath, "terms.en.json"),
  zh: resolve(termsDirectoryPath, "terms.zh.json"),
};

const requiredStringFields = [
  "termId",
  "name",
  "shortName",
  "category",
  "level",
  "summary",
  "oneLine",
  "updatedAt",
];

const requiredArrayFields = [
  "examScopes",
  "useCases",
  "examPoints",
];

function readJsonFile(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const rawContent = readFileSync(filePath, "utf8");

  try {
    return JSON.parse(rawContent);
  } catch (error) {
    throw new Error(`Invalid JSON: ${filePath}\n${error.message}`);
  }
}

function writeJsonFile(filePath, data) {
  const parentDirectoryPath = dirname(filePath);

  if (!existsSync(parentDirectoryPath)) {
    mkdirSync(parentDirectoryPath, { recursive: true });
  }

  const jsonContent = `${JSON.stringify(data, null, 2)}\n`;
  writeFileSync(filePath, jsonContent, "utf8");
}

function assertNonEmptyString(value, fieldName, termId) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Invalid term field: termId=${termId || "(unknown)"}, field=${fieldName}`,
    );
  }
}

function assertArray(value, fieldName, termId) {
  if (!Array.isArray(value)) {
    throw new Error(
      `Invalid term field: termId=${termId || "(unknown)"}, field=${fieldName} must be an array`,
    );
  }
}

function validateTermShape(term) {
  const termId = typeof term.termId === "string" ? term.termId : "";

  for (const fieldName of requiredStringFields) {
    assertNonEmptyString(term[fieldName], fieldName, termId);
  }

  for (const fieldName of requiredArrayFields) {
    assertArray(term[fieldName], fieldName, termId);
  }

  const optionalArrayFields = [
    "saaPoints",
    "relatedServices",
    "comparisonSlugs",
    "architectureSlugs",
    "tags",
    "costNotes",
    "securityNotes",
  ];

  for (const fieldName of optionalArrayFields) {
    if (term[fieldName] !== undefined && !Array.isArray(term[fieldName])) {
      throw new Error(
        `Invalid optional array field: termId=${termId}, field=${fieldName}`,
      );
    }
  }
}

function validateTerms(terms, label) {
  if (!Array.isArray(terms)) {
    throw new Error(`${label} must be an array`);
  }

  if (terms.length < 30) {
    throw new Error(`${label} must contain at least 30 terms. current=${terms.length}`);
  }

  const seenTermIds = new Set();

  for (const term of terms) {
    validateTermShape(term);

    if (seenTermIds.has(term.termId)) {
      throw new Error(`Duplicate termId found in ${label}: ${term.termId}`);
    }

    seenTermIds.add(term.termId);
  }
}

function cloneTermsForLocale(terms, locale) {
  return terms.map((term) => ({
    ...term,
    locale,
  }));
}

function getTermIds(terms) {
  return terms.map((term) => term.termId);
}

function assertSameTermIds(baseTermIds, targetTermIds, label) {
  if (baseTermIds.length !== targetTermIds.length) {
    throw new Error(
      `Term count mismatch: base=${baseTermIds.length}, ${label}=${targetTermIds.length}`,
    );
  }

  for (let index = 0; index < baseTermIds.length; index += 1) {
    if (baseTermIds[index] !== targetTermIds[index]) {
      throw new Error(
        `termId order mismatch at index=${index}: base=${baseTermIds[index]}, ${label}=${targetTermIds[index]}`,
      );
    }
  }
}

function main() {
  const sourceTerms = readJsonFile(sourceTermsFilePath);

  validateTerms(sourceTerms, "terms.json");

  const localizedTerms = {
    ja: cloneTermsForLocale(sourceTerms, "ja"),
    en: cloneTermsForLocale(sourceTerms, "en"),
    zh: cloneTermsForLocale(sourceTerms, "zh"),
  };

  for (const [locale, terms] of Object.entries(localizedTerms)) {
    validateTerms(terms, `terms.${locale}.json`);
    writeJsonFile(outputFiles[locale], terms);
  }

  const baseTermIds = getTermIds(localizedTerms.ja);

  for (const [locale, filePath] of Object.entries(outputFiles)) {
    const generatedTerms = readJsonFile(filePath);
    validateTerms(generatedTerms, `generated terms.${locale}.json`);
    assertSameTermIds(baseTermIds, getTermIds(generatedTerms), `terms.${locale}.json`);
  }

  console.log("Generated localized term files:");
  console.log(`- ${outputFiles.ja}`);
  console.log(`- ${outputFiles.en}`);
  console.log(`- ${outputFiles.zh}`);
  console.log(`Total terms: ${baseTermIds.length}`);
}

main();