# P4-020 Search Console Error Review Log

## 1. Task information

| Item | Details |
|---|---|
| Task ID | P4-020 |
| Task name | Search Console error review |
| Initial version | 2026-06-09 (work had stopped with every item still Not checked) |
| Observation update | 2026-08-09 (indexing report reviewed, DNS/CloudFront fixed, and revalidation started) |
| Target site | https://www.aws-cert-roadmap-lab.com |
| Target property | https://www.aws-cert-roadmap-lab.com/ |
| Dependency | P4-005 Google Search Console registration |
| Completion criterion | Search Console errors reviewed |
| Related Issues | #133 (this task) / #323 (AdSense resubmission gate; references this document as the section D deliverable) |

**Role of this document**: Following the 2026-08-02 production deployment (PR #328), maintain this as an observation log for deciding whether AdSense resubmission is appropriate.
Whether the site's HTML includes explanations and whether Google has crawled that HTML are separate questions. Do not resubmit until evidence of the latter is available.

---

## 2. Review scope

| Check | Result | Action needed | Notes |
|---|---|---|---|
| Summary | **Checked** | Monitor | Checked on 2026-08-09: 48 indexed, 160 not indexed; report last updated 2026-08-05. |
| Page indexing | **Checked** | **In progress** | Five nonzero exclusion reasons. Section 3.3 records counts and validation status. |
| Sitemap | **Success** | None | Last read 2026-08-06; 202 URLs discovered; status Success. |
| URL inspection: home | **Checked** | None | www URL indexed. User-declared and Google-selected canonicals both use www. |
| URL inspection: glossary | Not checked | Undetermined | `/terms` |
| URL inspection: practice questions | **Checked** | **Monitor** | `/questions/clf-001` has not been crawled, but its 2026-08-09 live test found it indexable. Indexing requested for this one representative URL only. |
| URL inspection: architecture list | Not checked | Undetermined | `/architectures` |
| URL inspection: blog list | Not checked | Undetermined | `/blog` |
| HTTPS | **Checked** | None | Fetched all 202 sitemap URLs over HTTPS; all returned 200 (section 10). |
| Mobile usability | **Not applicable** | None | Search Console retired the Mobile Usability report in 2023-12. Use PageSpeed Insights / Lighthouse instead. |

---

## 3. Search Console findings

### 3.1 Summary

Reviewed Page indexing for the domain property on 2026-08-09. The report was last updated on 2026-08-05.

| Item | Result |
|---|---|
| Nonzero exclusion reasons | 5 |
| Indexed pages | **48** |
| Pages not indexed | **160** |
| URLs discovered in sitemap | **202** |
| Crawled - currently not indexed | **0** |

---

### 3.2 Sitemap review

| Item | Result |
|---|---|
| sitemap URL | https://www.aws-cert-roadmap-lab.com/sitemap.xml |
| Status | **Success** (resubmitted 2026-08-02) |
| Discovered URLs | **202** |
| Last read | **2026-08-06** |
| Errors | None |

Site-side measurement (2026-08-02): **202** total `<loc>` entries, including **0** URLs containing `/en/` or `/zh/`. This matches Phase 3's Japanese-only policy.

---

### 3.3 Reasons for non-indexing

Observed on 2026-08-09. After the DNS/CloudFront fix, revalidation was started that day for eligible categories.

| Reason | Count | Response |
|---|---:|---|
| Not found (404) | **6** | All six URLs now return 200 or apex→www 301. Continue validation started on 2026-07-04. |
| Page with redirect | **2** | Normalize HTTP/apex to HTTPS/www. New validation started on 2026-08-09. |
| Excluded by noindex tag | **1** | The blog post now serves `index, follow`. Validation started on 2026-08-09. |
| Blocked by robots.txt | **0 (no corresponding row)** | No action needed. |
| Alternate page with proper canonical tag | **1** | Redirect apex to www with 301. New validation started on 2026-08-09. |
| Crawled - currently not indexed | **0** | The current direct indicator of thin content is zero. |
| Discovered - currently not indexed | **150** | Observe weekly without bulk requests. Indexing requested only for representative `/questions/clf-001`. |

---

## 4. Important URL inspections

| URL | Google indexing status | Crawlability | Indexing request | Action needed |
|---|---|---|---|---|
| https://www.aws-cert-roadmap-lab.com/ | **Indexed** | **Fetched successfully** (last crawl 2026-08-01) | Not requested | Both user-declared and Google-selected canonicals use www. No action needed. |
| https://www.aws-cert-roadmap-lab.com/terms | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/questions | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/questions/clf-001 | **Discovered - currently not indexed** | **Indexable in live test** (2026-08-09 13:35) | **Requested 2026-08-09** | Added to priority crawl queue. Check the last crawl date weekly. |
| https://www.aws-cert-roadmap-lab.com/architectures | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/comparisons | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/blog | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/about | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/contact | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/privacy | Not checked | Not checked | Not requested | Undetermined |
| https://www.aws-cert-roadmap-lab.com/disclaimer | Not checked | Not checked | Not requested | Undetermined |

**Note**: Actual URL paths use `/questions/clf-001`, not `/questions/clf-c02/q001`. The example path in #323's verification procedure differs from actual routing; use the path documented here.

---

## 5. Issues found

| ID | Problem | Severity | Possible cause | Response | Status |
|---|---|---|---|---|---|
| GSC-002 | The representative practice question has not been crawled, so Google has not fetched its HTML containing explanations. | High | Discovered through the sitemap but not yet crawled | Wait for crawling to catch up. No code change needed. | **Monitoring. Do not resubmit until resolved.** |
| GSC-003 | URL inspection used only Test live URL; the crawled HTML snapshot has not been checked. | Medium | Missed procedural step | Use View crawled page → HTML to inspect explanation text visually for at least two URLs. | Not addressed; mandatory weekly check. |
| GSC-004 | Missing figures in 3.1 / 3.3 meant no day-zero indexing baseline. | Medium | Not recorded during 2026-08-02 work | Captured 48 indexed, 160 not indexed, and the breakdown on 2026-08-09. | **Resolved** |
| GSC-005 | `scripts/sweep-sitemap-status.sh` was not tracked in Git and existed only on the SMB share, preventing reproducible weekly reachability checks during the grace period. | Medium | Reachability scripts were uncommitted | Added macOS Bash compatibility and optional DoH; completed a real scan of 202 URLs. | **Resolved** |
| GSC-006 | Apex reached an old Heroku IP and failed TLS. | High | Cloudflare apex DNS and CloudFront Function normalization were inconsistent | Set apex CNAME to CloudFront and deployed the apex→www 301 Function to LIVE. | **Resolved; Search Console validation in progress** |
| GSC-007 | One noindex report disagreed with current HTML. | Medium | Search Console's 2026-07-25 crawl retained the old state | Verified current `index, follow` and www canonical; validation started 2026-08-09. | **Validating** |
| GSC-008 | This PC's ordinary DNS path resolved the CloudFront CNAME to the old IP. | Low | Local-network UDP/53 cache; Cloudflare/Google DoH and DNS/TCP were correct | Added `CURL_DOH_URL` to the reachability script; use DoH/TCP as the authority for publication checks. | **Mitigated** |

---

## 6. Response decisions

| Decision | Details |
|---|---|
| Immediate fix | GSC-006 DNS/CloudFront normalization deployed on 2026-08-09. |
| Monitor | GSC-002 last crawl date, GSC-006 revalidation, GSC-007 noindex revalidation, and 150 Discovered - currently not indexed URLs. |
| No action | Mobile usability: the report itself has been retired. |

---

## 7. Completion assessment

| Item | Assessment |
|---|---|
| Reviewed Search Console summary | **Complete** (2026-08-09 measurements recorded in 3.1). |
| Checked sitemap.xml status | **Complete** (resubmitted 2026-08-02; status Success). |
| Reviewed indexing errors | **Complete** (reasons, counts, and validation status recorded in 3.3). |
| Inspected important URLs | **Partially complete** (home and representative question checked; continue weekly because the question remains uncrawled). |
| Decided whether fixes are needed | **Complete** (fixed DNS/CloudFront and started Search Console revalidation). |
| Recorded findings | **Complete** (this document updated 2026-08-09). |

---

## 8. Next review

| Item | Details |
|---|---|
| Next review date | 2026-08-16 (day 14) |
| Reason | Check redirect/canonical/noindex validation started 2026-08-09 and priority-crawl results for the representative URL. |
| Items to check | ① Indexed/not-indexed counts ② Validation status for four categories ③ Last crawl date of `/questions/clf-001` ④ Explanation text in crawled HTML |

---

## 9. Production deployment record (starting date)

| Item | Details |
|---|---|
| Production deployment date (**grace-period starting date**) | **2026-08-02** |
| Changes | AdSense resubmission preparation Phases 1–3 (#320 / #321 / #322) |
| PR | #328（dev → master） |
| master commit | `b12236b` |
| Deployment | `deploy-frontend.yml` run 30746201014 = success |
| Notes | Initial run 30745446674 was canceled after hanging at Configure AWS credentials for over 20 minutes. Rerun with `gh workflow run deploy-frontend.yml --ref master`. |

---

## 10. Reachability and static HTML observations (2026-08-02, rechecked 2026-08-09)

Command-based measurements of **what the site serves**, distinct from Google's observations in sections 2–4.

### 10.1 Reachability sweep

| Item | Result |
|---|---|
| Sitemap URLs | **202** (141 before deployment) |
| URLs returning HTTP 200 | **202** |
| Non-200 URLs | **0** |
| URLs containing `/en/` or `/zh/` | **0** (consistent with Phase 3's Japanese-only policy) |

The reachability gate (#323 B) passed. The cause of the first rejection, almost all URLs returning 404, has not recurred.
After the DNS change on 2026-08-09, a new scan explicitly using Cloudflare DoH again found **202/202 returning 200 and zero non-200 responses**.

### 10.2 Static practice-question HTML (`/questions/clf-001`, without executing JS)

| Check | Observed value | Assessment |
|---|---:|---|
| HTML size | 61,667 bytes | — |
| Occurrences of Japanese “解説” (explanation) | 8 | OK |
| Occurrences of Japanese “選択肢ごとの解説” (explanation by choice) | 2 | OK |
| Occurrences of Japanese “実務での使いどころ” (practical use cases) | 2 | OK |
| Links to `docs.aws.amazon.com` | 4 | OK |
| `<details>` elements | 1 | OK (collapsing preserves UX) |
| `<details open>` | **0** | OK (closed initially; not cloaking) |
| `application/ld+json` | 2 | OK (Quiz structured data plus existing JSON-LD) |
| `<meta name="robots">` | `index, follow` | OK (no excessive gating for ja) |

Before deployment, every explanation-related occurrence count was **0**. Phase 1's goal of making explanations visible to crawlers is achieved on the site side.

### 10.2.1 Sampling (three CLF + three SAA questions, 2026-08-02)

Checking one page does not guarantee coverage across all 100 pages. Six questions were sampled from the beginning, middle, and end.

| URL | HTTP | bytes | Explanation | Choice explanations | Practical use cases | AWS docs links | `<details open>` |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/questions/clf-001` | 200 | 61,667 | 8 | 2 | 2 | 4 | 0 |
| `/questions/clf-025` | 200 | 51,502 | 8 | 2 | 2 | 8 | 0 |
| `/questions/clf-050` | 200 | 51,710 | 8 | 2 | 2 | 8 | 0 |
| `/questions/saa-001` | 200 | 54,909 | 8 | 2 | 2 | 8 | 0 |
| `/questions/saa-025` | 200 | 52,229 | 8 | 2 | 2 | 8 | 0 |
| `/questions/saa-050` | 200 | 58,706 | 8 | 2 | 2 | 4 | 0 |

All six questions contain all four explanation elements, and none has `<details open>`. Section C of #323 passed.

### 10.3 Change in unique text volume (measured from build output)

| Metric | Before | After |
|---|---:|---:|
| Average unique text across 100 ja practice-question pages | 335 characters | **1,760 characters** |
| Boilerplate ratio | 62.5% | **24.1%** |
| CLF correct-answer bias toward A | 90% | **26%** (corrected in #312; closed) |

---

## 11. Weekly records during the crawl grace period

**Starting date: 2026-08-02 / earliest resubmission: 2026-08-16 (14 days) / recommended: 2026-08-23–2026-08-30 (21–28 days)**

| Measurement date | Days elapsed | Indexed | Not indexed | Crawled - not indexed | Last practice-question crawl | Explanations in crawled HTML |
|---|---:|---:|---:|---:|---|---|
| 2026-08-02 | 0 | Not captured | Not captured | Not captured | **Before deployment date** | Not checked (live fetch only) |
| 2026-08-09 | 7 | **48** | **160** | **0** | Not applicable (`/questions/clf-001` not crawled) | No (no crawled HTML; live test finds it indexable) |
| 2026-08-16 | 14 | | | | | |
| 2026-08-23 | 21 | | | | | |
| 2026-08-30 | 28 | | | | | |

Recording procedure (about five minutes each time):

1. Search Console → Pages (Indexing) → record Indexed and Not indexed counts.
2. From the non-indexed breakdown, record Crawled - currently not indexed.
3. Enter `https://www.aws-cert-roadmap-lab.com/questions/clf-001` in the top URL inspection bar.
4. Under Page indexing, record the **last crawl date**.
5. Open View crawled page → **HTML** and search for the literal Japanese text “実務での使いどころ” (practical use cases). Record Yes if found.

---

## 12. Resubmission gate assessment (as of 2026-08-09)

| Gate | Condition | Current status | Assessment |
|---|---|---|---|
| A. Production deployment | Phases 1–3 merged to master and deployed successfully | PR #328 / run 30746201014 success | **Passed** |
| B. Reachability | Every sitemap URL returns 200; non-200 = 0 | 202/202 return 200 | **Passed** |
| C. Static HTML | Explanations, choice explanations, practicalNote, and official documentation are rendered without JS | All checks OK as in 10.2 | **Passed** |
| D. Search Console observations | Sections 3.1 / 3.3 / 4 contain actual measurements | 48 indexed, 160 not indexed, home and representative-question inspections recorded | **Passed** |
| E. Crawl grace period | At least 14 days since the start, and **practice-question last crawl date is on or after deployment** | Seven days elapsed; representative question not crawled | **Not met** |
| F. Resubmission | All gates A–E pass | — | **Not permitted** |

### Conclusion

**Do not resubmit to AdSense at this stage.**

Gate E is the reason. The representative question page has not been crawled, and there is no evidence that Google fetched the HTML containing explanations.
The original assessment was that requesting review in this state would lead to a third rejection for the same reason (low-value content), without the Phase 1–3 fixes being considered.
Repeated rejection also has the operational disadvantage of longer review intervals.

Resubmit only when **both** conditions are met:

1. At least 14 days have passed since 2026-08-02 (21–28 days recommended).
2. Section 11 shows a practice-question last crawl date on or after deployment and **Yes** for explanations in crawled HTML.

If condition 2 is not met, wait even beyond 28 days. **Evidence that Google has seen the new HTML**, rather than elapsed days, is the resubmission condition.

---

## 13. Indexing remediation and revalidation record: 2026-08-09

### 13.1 CloudFront / DNS

- Added apex→www 301 normalization to CloudFront Function `aws-cert-url-rewrite` and deployed it to LIVE.
- The LIVE Function is `DEPLOYED`, with ETag `E1F83G8C2ARO7P`. After the query re-encoding fix, repository and LIVE code SHA-256 matched: `7c8c52f8e6260f11a0610354a17a1cef6297bfde8c236083735e4ea99d3a36b0`.
- Distribution `EHIV14NX361T7` is `Deployed`; viewer-request association unchanged.
- Cloudflare apex was set to CNAME `d25a018o7xkwid.cloudfront.net`, DNS only, TTL Auto. `www` and ACM validation CNAMEs were unchanged.
- Cloudflare/Google DoH and DNS/TCP resolved four CloudFront IPs: `3.166.205.31`, `3.166.205.36`, `3.166.205.73`, `3.166.205.87`.
- Only this PC's ordinary UDP/53 path returned the old IP, so publication checks treated DoH/TCP as authoritative.

### 13.2 Public URLs

- Apex HTTPS returned 301 to www while preserving the path and query string.
- Queries containing `%2F`, `+`, valueless parameters, and duplicate parameters were confirmed to carry over to www without double encoding. CloudFront's event representation normalizes parameter order and the trailing `=` on valueless parameters.
- Apex HTTP ultimately reached HTTPS/www with a 200 response.
- The www home page and all seven representative URLs flagged by Search Console returned 200.
- The reported noindex URL's current HTML had `index, follow` and a www canonical.
- Ran `CURL_DOH_URL=https://cloudflare-dns.com/dns-query bash scripts/sweep-sitemap-status.sh`; all 202 sitemap URLs returned 200, with zero non-200 responses.

### 13.3 Search Console

- Started new validation on 2026-08-09 for two Page with redirect URLs.
- Started new validation on 2026-08-09 for one Alternate page with proper canonical tag URL.
- Started validation on 2026-08-09 for one Excluded by noindex tag URL.
- Continued the existing 2026-07-04 validation for six 404 URLs.
- Confirmed `/questions/clf-001` is indexable in the live test and requested indexing for that one representative URL only. No bulk request for 150 URLs was made.

### 13.4 Next actions

On 2026-08-16, check each validation status, indexed/not-indexed counts, and `/questions/clf-001` last crawl date and crawled HTML. Do not resubmit to AdSense until section 12 gate E passes. The recommended resubmission window is 2026-08-23–2026-08-30, but evidence that Google fetched HTML containing explanations takes priority over elapsed days.
