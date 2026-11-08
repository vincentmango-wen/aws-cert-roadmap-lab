#!/usr/bin/env bash
set -euo pipefail

REPO="vincentmango-wen/aws-cert-roadmap-lab"

gh auth status >/dev/null

gh label create "phase:5" --color "5319E7" --description "Phase 5: Global SEO and localization" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Must" --color "B60205" --description "Required" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Should" --color "D93F0B" --description "Important" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Could" --color "0E8A16" --description "If capacity permits" --repo "$REPO" 2>/dev/null || true
gh label create "size:S" --color "C2E0C6" --description "1-2 hours" --repo "$REPO" 2>/dev/null || true
gh label create "size:M" --color "FBCA04" --description "Half a day" --repo "$REPO" 2>/dev/null || true
gh label create "size:L" --color "F9D0C4" --description "One day" --repo "$REPO" 2>/dev/null || true
gh label create "size:XL" --color "D4C5F9" --description "Two days or more" --repo "$REPO" 2>/dev/null || true

create_issue() {
  local id="$1"
  local phase="$2"
  local title="$3"
  local priority="$4"
  local size="$5"
  local dependency="$6"
  local done="$7"

  if gh issue list --repo "$REPO" --state all --search "$id in:title" --json number --jq '.[0].number // empty' | grep -q .; then
    echo "SKIP: $id already exists"
    return 0
  fi

  body="$(mktemp)"
  cat > "$body" <<BODY
## Phase
$phase

## Task ID
$id

## Task name
$title

## Priority
$priority

## Estimate
$size

## Dependencies
$dependency

## Acceptance criteria
- $done

## Purpose
Advance English/Chinese support, international SEO and country-level traffic verification as part of Phase 5 global SEO and localization.

## In scope
- Meet the acceptance criteria defined in the WBS
- Preserve existing Japanese URLs
- Use /en for English and /zh for Chinese
- Preserve static content management based on Markdown, MDX and JSON

## Out of scope
- Cognito login
- Learning-history persistence
- Payment functionality
- Production translation-API integration
- Content migration to DynamoDB
- WAF adoption

## Verification
- npm run typecheck
- npm run build
- Verify the target URLs render

## Completion checklist
- Acceptance criteria are met
- Existing Japanese pages remain functional
- Target /en or /zh pages can be verified
- The build succeeds
BODY

  gh issue create \
    --repo "$REPO" \
    --title "[$id] $title" \
    --body-file "$body" \
    --label "enhancement" \
    --label "phase:5" \
    --label "priority:$priority" \
    --label "size:$size"

  rm -f "$body"
}

# Phase 5-E: AWS terminology localization
create_issue "P5-027" "Phase 5-E: AWS terminology localization" "Split AWS terminology into localized datasets" "Must" "L" "P5-004" "Create terms.ja.json, terms.en.json and terms.zh.json"
create_issue "P5-028" "Phase 5-E: AWS terminology localization" "Localize the terminology list" "Must" "M" "P5-027" "Display /en/terms and /zh/terms"
create_issue "P5-029" "Phase 5-E: AWS terminology localization" "Localize term detail pages" "Must" "L" "P5-027" "Display /en/terms/s3 and /zh/terms/s3"
create_issue "P5-030" "Phase 5-E: AWS terminology localization" "Translate 30 key AWS terms into English" "Must" "XL" "P5-027" "Provide at least 30 English term entries"
create_issue "P5-031" "Phase 5-E: AWS terminology localization" "Translate 30 key AWS terms into Chinese" "Must" "XL" "P5-027" "Provide at least 30 Chinese term entries"
create_issue "P5-032" "Phase 5-E: AWS terminology localization" "Define AWS terminology conventions" "Must" "M" "P5-030" "Document rules for official AWS names, abbreviations, Chinese terms and English terms"
create_issue "P5-033" "Phase 5-E: AWS terminology localization" "Localize related links on term pages" "Should" "M" "P5-029" "Keep related comparison and architecture navigation in the same language"

# Phase 5-F: Comparison-article localization
create_issue "P5-034" "Phase 5-F: Comparison-article localization" "Create localized comparison MDX structure" "Should" "M" "P5-007" "Create contents/comparisons/en and contents/comparisons/zh"
create_issue "P5-035" "Phase 5-F: Comparison-article localization" "Translate S3/EBS/EFS comparison into English" "Should" "M" "P5-034" "Display /en/comparisons/s3-vs-ebs-vs-efs"
create_issue "P5-036" "Phase 5-F: Comparison-article localization" "Translate S3/EBS/EFS comparison into Chinese" "Should" "M" "P5-034" "Display /zh/comparisons/s3-vs-ebs-vs-efs"
create_issue "P5-037" "Phase 5-F: Comparison-article localization" "Translate RDS/DynamoDB comparison into English" "Should" "M" "P5-034" "Display /en/comparisons/rds-vs-dynamodb"
create_issue "P5-038" "Phase 5-F: Comparison-article localization" "Translate RDS/DynamoDB comparison into Chinese" "Should" "M" "P5-034" "Display /zh/comparisons/rds-vs-dynamodb"
create_issue "P5-039" "Phase 5-F: Comparison-article localization" "Translate IAM User/Role/Policy comparison into English" "Should" "M" "P5-034" "Display the English page"
create_issue "P5-040" "Phase 5-F: Comparison-article localization" "Translate IAM User/Role/Policy comparison into Chinese" "Should" "M" "P5-034" "Display the Chinese page"
create_issue "P5-041" "Phase 5-F: Comparison-article localization" "Localize internal comparison links" "Should" "M" "P5-035" "Keep related term and question navigation in the same language"

# Phase 5-G: Architecture-article localization
create_issue "P5-042" "Phase 5-G: Architecture-article localization" "Create localized architecture MDX structure" "Should" "M" "P5-007" "Create contents/architectures/en and contents/architectures/zh"
create_issue "P5-043" "Phase 5-G: Architecture-article localization" "Translate S3 + CloudFront static-site architecture into English" "Should" "M" "P5-042" "Display the English architecture article"
create_issue "P5-044" "Phase 5-G: Architecture-article localization" "Translate S3 + CloudFront static-site architecture into Chinese" "Should" "M" "P5-042" "Display the Chinese architecture article"
create_issue "P5-045" "Phase 5-G: Architecture-article localization" "Translate API Gateway + Lambda + DynamoDB architecture into English" "Should" "M" "P5-042" "Display the English architecture article"
create_issue "P5-046" "Phase 5-G: Architecture-article localization" "Translate API Gateway + Lambda + DynamoDB architecture into Chinese" "Should" "M" "P5-042" "Display the Chinese architecture article"
create_issue "P5-047" "Phase 5-G: Architecture-article localization" "Translate three-tier web architecture into English" "Could" "M" "P5-042" "Display the English architecture article"
create_issue "P5-048" "Phase 5-G: Architecture-article localization" "Translate three-tier web architecture into Chinese" "Could" "M" "P5-042" "Display the Chinese architecture article"
create_issue "P5-049" "Phase 5-G: Architecture-article localization" "Verify localized SVG diagram labels" "Should" "M" "P5-043" "Replace Japanese SVG wording in English and Chinese versions"

# Phase 5-H: Blog localization
create_issue "P5-050" "Phase 5-H: Blog localization" "Create localized blog MDX structure" "Should" "M" "P5-007" "Create contents/blog/en and contents/blog/zh"
create_issue "P5-051" "Phase 5-H: Blog localization" "Translate the AWS Cloud Practitioner introduction into English" "Should" "M" "P5-050" "Display the English blog article"
create_issue "P5-052" "Phase 5-H: Blog localization" "Translate the AWS Cloud Practitioner introduction into Chinese" "Should" "M" "P5-050" "Display the Chinese blog article"
create_issue "P5-053" "Phase 5-H: Blog localization" "Translate the AWS Free Tier portfolio article into English" "Should" "M" "P5-050" "Display the English blog article"
create_issue "P5-054" "Phase 5-H: Blog localization" "Translate the AWS Free Tier portfolio article into Chinese" "Should" "M" "P5-050" "Display the Chinese blog article"
create_issue "P5-055" "Phase 5-H: Blog localization" "Translate the S3 + CloudFront publishing article into English" "Should" "M" "P5-050" "Display the English blog article"
create_issue "P5-056" "Phase 5-H: Blog localization" "Translate the S3 + CloudFront publishing article into Chinese" "Should" "M" "P5-050" "Display the Chinese blog article"

# Phase 5-I: CLF-question localization
create_issue "P5-057" "Phase 5-I: CLF-question localization" "Create localized CLF question datasets" "Could" "M" "P5-027" "Create clf-c02.ja.json, clf-c02.en.json and clf-c02.zh.json"
create_issue "P5-058" "Phase 5-I: CLF-question localization" "Translate 30 CLF questions into English" "Could" "XL" "P5-057" "Display at least 30 English questions"
create_issue "P5-059" "Phase 5-I: CLF-question localization" "Translate 30 CLF questions into Chinese" "Could" "XL" "P5-057" "Display at least 30 Chinese questions"
create_issue "P5-060" "Phase 5-I: CLF-question localization" "Localize the question UI" "Could" "L" "P5-057" "Localize answers, correct/incorrect results, explanations, next-question controls and other UI"
create_issue "P5-061" "Phase 5-I: CLF-question localization" "Add original-question and non-dump notices" "Must" "S" "P5-058" "State that questions are original, unofficial and not exam dumps"

# Phase 5-J: Verification and production rollout
create_issue "P5-062" "Phase 5-J: Verification and production rollout" "Create translation quality checklist" "Must" "M" "P5-030" "Document terminology consistency, prohibited claims and official-term verification rules"
create_issue "P5-063" "Phase 5-J: Verification and production rollout" "Verify localized pages locally" "Must" "M" "P5-029" "Display major URLs locally"
create_issue "P5-064" "Phase 5-J: Verification and production rollout" "Verify static build" "Must" "S" "P5-063" "Run npm run build successfully and generate out/en and out/zh"
create_issue "P5-065" "Phase 5-J: Verification and production rollout" "Verify production deployment" "Must" "M" "P5-064" "Display /en and /zh through CloudFront"
create_issue "P5-066" "Phase 5-J: Verification and production rollout" "Verify production sitemap" "Must" "S" "P5-065" "Include localized URLs in sitemap.xml"
create_issue "P5-067" "Phase 5-J: Verification and production rollout" "Verify Search Console" "Must" "M" "P5-065" "Complete sitemap submission and review indexable URLs"
create_issue "P5-068" "Phase 5-J: Verification and production rollout" "Verify analytics by country and language" "Must" "S" "P5-065" "Document country/language verification steps in README"
create_issue "P5-069" "Phase 5-J: Verification and production rollout" "Document localization in README" "Should" "M" "P5-065" "Document global SEO and localization policy in README"
create_issue "P5-070" "Phase 5-J: Verification and production rollout" "Review Phase 5 completion" "Must" "M" "P5-067" "Meet acceptance criteria and prepare to proceed to Phase 6"

echo "DONE: Phase 5-E through 5-J issues created or skipped."
