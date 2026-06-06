import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const termsPath = path.join(projectRoot, "frontend", "contents", "terms", "terms.json");
const additionsPath = path.join(projectRoot, "frontend", "contents", "terms", "p4-010-additional-terms.json");

const requiredFields = [
  "termId",
  "name",
  "shortName",
  "category",
  "level",
  "examScopes",
  "summary",
  "oneLine",
  "useCases",
  "examPoints",
  "updatedAt"
];

const allowedCategories = new Set([
  "Compute",
  "Storage",
  "Database",
  "Networking",
  "Security",
  "Monitoring",
  "Integration",
  "Analytics",
  "Management"
]);

const allowedLevels = new Set(["beginner", "intermediate", "advanced"]);

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON: ${filePath}\n${error.message}`);
  }
}

function validateTerm(term, index, sourceName) {
  for (const field of requiredFields) {
    if (!(field in term)) {
      throw new Error(`${sourceName}[${index}] is missing required field: ${field}`);
    }
  }

  if (typeof term.termId !== "string" || term.termId.trim() === "") {
    throw new Error(`${sourceName}[${index}].termId must be a non-empty string`);
  }

  if (!/^[a-z0-9-]+$/.test(term.termId)) {
    throw new Error(`${sourceName}[${index}].termId must use lowercase letters, numbers, and hyphens only: ${term.termId}`);
  }

  if (!allowedCategories.has(term.category)) {
    throw new Error(`${sourceName}[${index}].category is invalid: ${term.category}`);
  }

  if (!allowedLevels.has(term.level)) {
    throw new Error(`${sourceName}[${index}].level is invalid: ${term.level}`);
  }

  if (!Array.isArray(term.examScopes) || term.examScopes.length === 0) {
    throw new Error(`${sourceName}[${index}].examScopes must be a non-empty array`);
  }

  if (!Array.isArray(term.useCases) || term.useCases.length === 0) {
    throw new Error(`${sourceName}[${index}].useCases must be a non-empty array`);
  }

  if (!Array.isArray(term.examPoints) || term.examPoints.length === 0) {
    throw new Error(`${sourceName}[${index}].examPoints must be a non-empty array`);
  }
}

function validateTermList(terms, sourceName) {
  if (!Array.isArray(terms)) {
    throw new Error(`${sourceName} must be an array`);
  }

  terms.forEach((term, index) => validateTerm(term, index, sourceName));

  const seen = new Set();

  for (const term of terms) {
    if (seen.has(term.termId)) {
      throw new Error(`${sourceName} has duplicate termId: ${term.termId}`);
    }

    seen.add(term.termId);
  }
}

const existingTerms = readJson(termsPath);
const additionalTerms = readJson(additionsPath);

validateTermList(existingTerms, "terms.json");
validateTermList(additionalTerms, "p4-010-additional-terms.json");

const mergedByTermId = new Map();

for (const term of existingTerms) {
  mergedByTermId.set(term.termId, term);
}

for (const term of additionalTerms) {
  mergedByTermId.set(term.termId, term);
}

const mergedTerms = Array.from(mergedByTermId.values()).sort((a, b) => {
  return a.termId.localeCompare(b.termId);
});

validateTermList(mergedTerms, "merged terms");

if (mergedTerms.length < 50) {
  throw new Error(`P4-010 is not complete. Expected at least 50 terms, but got ${mergedTerms.length}.`);
}

fs.writeFileSync(termsPath, `${JSON.stringify(mergedTerms, null, 2)}\n`, "utf8");

console.log(`P4-010 completed: ${existingTerms.length} terms + ${additionalTerms.length} additions => ${mergedTerms.length} unique terms`);
console.log(`Updated: ${termsPath}`);