#!/usr/bin/env bash
set -euo pipefail

REPO="vincentmango-wen/aws-cert-roadmap-lab"

gh auth status >/dev/null

gh label create "phase:5" --color "5319E7" --description "Phase 5: Global SEO and localization" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Must" --color "B60205" --description "Required" --repo "$REPO" 2>/dev/null || true
gh label create "priority:Should" --color "D93F0B" --description "Important" --repo "$REPO" 2>/dev/null || true
gh label create "size:S" --color "C2E0C6" --description "1-2 hours" --repo "$REPO" 2>/dev/null || true
gh label create "size:M" --color "FBCA04" --description "Half a day" --repo "$REPO" 2>/dev/null || true
gh label create "size:L" --color "F9D0C4" --description "One day" --repo "$REPO" 2>/dev/null || true

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
Advance English/Chinese support, international SEO, competitive differentiation and country-level traffic verification as part of Phase 5 global SEO and localization.

## In scope
- Meet the acceptance criteria defined in the WBS
- Preserve existing Japanese URLs
- Use /en for English and /zh for Chinese
- Preserve the static delivery architecture

## Out of scope
- Cognito login
- Learning-history persistence
- Payment functionality
- Production translation-API integration
- Content migration to DynamoDB

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

create_issue "P5-000" "Phase 5-A: Competitor analysis and strategy" "Document global competitors and SEO hypotheses" "Must" "M" "Phase 4" "Document competitor categories, target keywords and excluded keywords for English- and Chinese-language markets"
create_issue "P5-000-1" "Phase 5-A: Competitor analysis and strategy" "Prioritize multilingual content" "Must" "S" "P5-000" "Select the first 20-30 pages to translate"
create_issue "P5-000-2" "Phase 5-A: Competitor analysis and strategy" "Write differentiation messaging" "Must" "S" "P5-000" "Define English and Chinese site descriptions, meta descriptions and Open Graph wording"
create_issue "P5-000-3" "Phase 5-A: Competitor analysis and strategy" "Document prohibited claims" "Must" "S" "P5-000" "Document prohibited claims such as exam dumps, real exam questions and guaranteed passes in README or docs"
create_issue "P5-000-4" "Phase 5-A: Competitor analysis and strategy" "Create English SEO keyword list" "Should" "S" "P5-000" "List at least 20 target English long-tail keywords"
create_issue "P5-000-5" "Phase 5-A: Competitor analysis and strategy" "Create Chinese SEO keyword list" "Should" "S" "P5-000" "List at least 20 target Traditional Chinese keywords"

create_issue "P5-001" "Phase 5-B: Localization foundation" "Finalize localization policy" "Must" "S" "P5-000" "Define target languages, URLs, translation scope and future expansion policy"
create_issue "P5-002" "Phase 5-B: Localization foundation" "Design localized URLs" "Must" "S" "P5-001" "Define URL rules for /en and /zh"
create_issue "P5-003" "Phase 5-B: Localization foundation" "Design i18n directory structure" "Must" "S" "P5-002" "Define the structure under src/i18n"
create_issue "P5-004" "Phase 5-B: Localization foundation" "Implement locale definitions" "Must" "S" "P5-003" "Handle ja, en and zh with type safety"
create_issue "P5-005" "Phase 5-B: Localization foundation" "Create UI dictionaries" "Must" "M" "P5-004" "Retrieve localized Header, Footer, CTA, search and filter labels"
create_issue "P5-006" "Phase 5-B: Localization foundation" "Implement language switcher" "Must" "M" "P5-005" "Switch among Japanese, English and Chinese using the same content ID"
create_issue "P5-007" "Phase 5-B: Localization foundation" "Create localized routing foundation" "Must" "L" "P5-004" "Generate static pages under /en/... and /zh/..."
create_issue "P5-008" "Phase 5-B: Localization foundation" "Configure html lang" "Must" "S" "P5-007" "Output lang attributes for ja, en and zh"

create_issue "P5-009" "Phase 5-C: Multilingual SEO foundation" "Design canonical and hreflang metadata" "Must" "M" "P5-007" "Define canonical and hreflang output for each localized page"
create_issue "P5-010" "Phase 5-C: Multilingual SEO foundation" "Create localized metadata helpers" "Must" "M" "P5-009" "Generate title, description and Open Graph metadata by locale"
create_issue "P5-011" "Phase 5-C: Multilingual SEO foundation" "Generate localized sitemap" "Must" "M" "P5-009" "Include Japanese, English and Chinese URLs in the sitemap"
create_issue "P5-012" "Phase 5-C: Multilingual SEO foundation" "Configure x-default" "Should" "S" "P5-009" "Output x-default in hreflang"
create_issue "P5-013" "Phase 5-C: Multilingual SEO foundation" "Define localized Open Graph policy" "Should" "S" "P5-010" "Select pages that need localized Open Graph images"
create_issue "P5-014" "Phase 5-C: Multilingual SEO foundation" "Create and configure English Open Graph images" "Should" "M" "P5-013" "Display English Open Graph images on English pages"
create_issue "P5-015" "Phase 5-C: Multilingual SEO foundation" "Create and configure Chinese Open Graph images" "Should" "M" "P5-013" "Display Chinese Open Graph images on Chinese pages"

create_issue "P5-016" "Phase 5-D: Common-page localization" "Translate homepage into English" "Must" "M" "P5-005" "Display the /en homepage"
create_issue "P5-017" "Phase 5-D: Common-page localization" "Translate homepage into Chinese" "Must" "M" "P5-005" "Display the /zh homepage"
create_issue "P5-018" "Phase 5-D: Common-page localization" "Translate About into English" "Must" "S" "P5-007" "Display /en/about"
create_issue "P5-019" "Phase 5-D: Common-page localization" "Translate About into Chinese" "Must" "S" "P5-007" "Display /zh/about"
create_issue "P5-020" "Phase 5-D: Common-page localization" "Translate Privacy into English" "Must" "S" "P5-007" "Display /en/privacy"
create_issue "P5-021" "Phase 5-D: Common-page localization" "Translate Privacy into Chinese" "Must" "S" "P5-007" "Display /zh/privacy"
create_issue "P5-022" "Phase 5-D: Common-page localization" "Translate Disclaimer into English" "Must" "S" "P5-007" "Display /en/disclaimer"
create_issue "P5-023" "Phase 5-D: Common-page localization" "Translate Disclaimer into Chinese" "Must" "S" "P5-007" "Display /zh/disclaimer"
create_issue "P5-024" "Phase 5-D: Common-page localization" "Translate Contact into English" "Should" "M" "P5-007" "Display /en/contact with a clear contact flow"
create_issue "P5-025" "Phase 5-D: Common-page localization" "Translate Contact into Chinese" "Should" "M" "P5-007" "Display /zh/contact with a clear contact flow"
create_issue "P5-026" "Phase 5-D: Common-page localization" "Localize the 404 page" "Should" "M" "P5-007" "Verify English and Chinese 404 pages"

echo "DONE: Phase 5-A through 5-D issues created or skipped."