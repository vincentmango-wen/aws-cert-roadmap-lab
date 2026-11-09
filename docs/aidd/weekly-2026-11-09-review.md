# Weekly implementation readiness and reconciliation review

Checked: 2026-11-09 (Asia/Taipei). This is preparation evidence, not a completed weekly delivery.

## Baseline evidence

Base: origin/master `66e5f13`. Branch: `codex/aws-week-20261109`.
Task: `aws-weekly-2026-11-09`; bundle: `tmp/weekly-evidence`.

Run `1794191236841-5b989a`: install, Harness, lint, typecheck, Vitest, build and HTML language checks all exited zero. Harness: 21 passed, zero failed/skipped. Overall result was **INPUT_DRIFT**, not BASELINE_READY: the implementation plan was added during verification. This was an execution sequencing mistake by the implementing agent. Preserve the entire run and rerun the same bundle after documentation is stable. No product content changed; repairs remain 0. Individual command success must not be reported as a valid overall baseline.

## AIDD capability gap (independent read-only review)

The approved task explicitly requires changing necessary article tests. `tools/aidd/pilot.mjs` rejects all changed test files against the initial manifest even when their paths are allowed. The CLI has no rebaseline/reconcile operation. A successful baseline cannot be replaced, and candidate Vitest assertion identities must match it. The current engineering contract also lacks the `content` section needed to verify the ten exact additions, and its path list omitted architecture SVGs. Both omissions must be corrected before authoring; they do not justify bypassing the frozen agreement.

**Recommended bounded extension for review:** add an explicit reviewed-revision/rebaseline operation to AIDD. It must retain the same task ID, registry and complete repair history, preserve old run seals and contract/profile/manifests, record exact old/new hashes and approved changed paths, reject active or STOP_UNCONFIRMED runs, and require a new full baseline. Rebaselining must never bless removed/skipped existing assertions automatically. Human acceptance remains pending. Add negative fixtures for count reset, source drift, evidence loss, unauthorised path changes and concurrent runs. No scheduling, deployment or general supervisor functionality.

The user explicitly approved this minimal Harness extension in this chat. Implementation and independent review are in progress. Do not overwrite frozen JSON/hash files, delete the task registry, create another task ID to evade it, or report candidate acceptance without the gate.

Alternative: a separately reviewed human reconciliation with the same preservation requirements. Current CLI cannot execute it. Deferring the weekly batch until this exists preserves the requested verification standard.

## Concrete next contract revision (not activated)

- Retain `id: aws-weekly-2026-11-09`, maxRepairs 3 and all current restrictions.
- Add `frontend/public/images/architectures/` to allowed paths, as required by the approved diagram deliverable.
- Set `content.baseCommit` to the full SHA of origin/master at `66e5f13`.
- Declare sourceLocale zh and sourceRevision 1 for every deliverable; ja/en revisions must match.
- Blog: `frontend/contents/blog/{zh,ja,en}/lambda-sqs-safe-retries-idempotency.mdx`; proposed registry ID blog-026.
- Architecture: `frontend/contents/architectures/{zh,ja,en}/step-functions-human-approval.mdx`; proposed registry ID arc-011; SVG filenames follow existing ja unsuffixed, .en and .zh conventions.
- Comparison: `frontend/contents/comparisons/{zh,ja,en}/step-functions-standard-vs-express.mdx`; final ID must be checked against all existing comparison IDs before activation.
- Questions: `frontend/contents/questions/saa-c03.{zh,ja,en}.json`; proposed exact added IDs saa-051 through saa-060, subject to final historical/archived identity check.
- These are proposed paths and IDs, not produced artifacts. Final contract must carry explicit per-locale paths rather than brace notation.

## Official-source findings for implementation

These findings were independently researched before editing; they are not post-edit semantic acceptance.

| Existing content | Required correction | Official evidence |
|---|---|---|
| comparisons/*/route53-vs-cloudfront-vs-global-accelerator.mdx | CloudFront static IPs are optional request/approval/configuration, not unavailable and not default. All-edge price class prerequisite. | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/request-static-ips.html |
| Same CloudFront comparison | Recheck current per-IP billing; do not repeat historical monthly package prices. Current IPv4 list price read as USD 0.005/IP-hour, IPv6 free; BYOIP still has IPAM considerations. | https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/ |
| comparisons/*/api-gateway-vs-alb-vs-cloudfront.mdx | Built-in API cache is REST API support; HTTP API lacks it. | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html |
| blog/{en,zh}/saa-decoupling-sqs-sns-eventbridge.mdx and SQS terms | Standard queues can duplicate/reorder; FIFO ordering is per message group, not exactly-once business side effects. | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html ; https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html |
| comparisons/*/sns-vs-sqs-vs-eventbridge.mdx | SNS FIFO to Standard SQS does not preserve consumer ordering. | https://docs.aws.amazon.com/sns/latest/dg/fifo-topic-message-ordering.html |
| Same messaging comparison | Scope non-ordering statements to default/Classic buses; September 2026 Custom bus differs. | https://aws.amazon.com/about-aws/whats-new/2026/09/eventbridge-relaunches-custom-event-buses/ ; https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html |
| Free Tier Blog/pricing articles and clf-001 choice A explanation | Distinguish account creation cohort, Free/Paid plans, quotas and credit expiry; do not apply twelve months to every account. | https://aws.amazon.com/free/free-tier-faqs/ ; https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html |
| trusted-advisor term and clf-028/030/043 practicalNote | Update categories/access qualifications and legacy-plan migration wording; retirement 2027-01-01, GovCloud exception. This is a later maintenance milestone, not this week's deadline. | https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html ; https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html ; https://docs.aws.amazon.com/awssupport/latest/user/get-started-with-aws-trusted-advisor.html |

Free Tier unresolved source inconsistency: the FAQ General Q6 says six-month credit expiry, while Free Plan Q8 states twelve months after upgrade; it also references the October 2026 signup experience. Do not invent one reconciliation. Explain account-specific expiry shown in Credits/Settings Portal and flag the source ambiguity. Check legacy 2025-07-15 eligibility separately.

## Deduplication and remaining work

Read-only inspection of `C:/Users/vince/Downloads/aws-content-pilot-001-delivery.zip` found recovery-plan Blog, DynamoDB restore-validation architecture and pilot-saa-recovery-01–10. Topic-level separation is established; detailed question equivalence/originality review remains pending. Never count maintenance as one of the three new articles.

At the initial review checkpoint no weekly articles/questions had been authored. The execution evidence below supersedes that initial status. The original checkout and sealed ZIP remain untouched. GitHub connector returned unavailable; browser inspection confirmed zero open PRs at preparation time.

## Follow-up execution evidence

- Same-bundle baseline rerun `1794191731310-a860eb` reached BASELINE_READY with all seven profile checks exiting zero. Harness 21 passed; frontend 127 passed, 22 inherited skipped, zero failed. Build and HTML language checks passed. Earlier INPUT_DRIFT run preserved.
- Rebaseline initial fixtures: three expected failures before implementation, then three passed. Independent review found malformed contract-array validation and interrupted-switch diagnostics; repair 1 recorded using the original frozen engine.
- Article mutation suite: after a no-op entry point, five negative cases failed and one positive passed; implementation then joined the full frontend run: 22 test files passed, 136 passed, 22 inherited skipped, zero failed. No new skip was introduced.
- Current task stays in this existing worktree. Per the user's subsequent instruction, future new AWS work should use the desktop original repo directly; do not relocate or recreate this task.

## Reviewed revision and explicit repair exceptions

- Same task `aws-weekly-2026-11-09`, same bundle `tmp/weekly-evidence`. Reviewed revision `revision-1` seal `6a523089956be357f504dac3fd51c1669b65e84fc19673e48109e1673b2f125f` archives the old configuration, engine, sources and run seals. The original INPUT_DRIFT run is retained.
- New baseline `1794194520222-f7abc4` reached BASELINE_READY; seal `7c2f2e05b93dfdf279214a62c50dca6648264aa8ff9c98f5365389a1956a3941`. The same complete seven-check profile ran. Harness has 26 tests; the frontend retains all previous assertions and its 22 inherited skips.
- Repair 3 covered the article-review correction: the broker must conditionally update decision/delivery records, not have read-only access. Callback decision persistence and delivery acknowledgement are separate. The initial clarification in ignored draft files preceded its repair record; this ordering is disclosed in that record. Independent follow-up found the IAM contradiction resolved and all three SVG graphs equivalent.
- The sealed CLI repair history remains **3/3**. It was not reset or manually extended. The following two additional operations were separately and narrowly authorized by the user and recorded here, outside the CLI's fixed budget.
- Fourth repair: the user explicitly agreed to replace only tilde code fences with triple-backtick fences in the new Blog and architecture, three locales each. Chrome demonstrated literal tilde text because the existing renderer recognizes backticks. Only those twelve delimiter lines changed; JSON and renderer were unchanged. Related content tests: 11 files, 74 passed. Six code blocks were checked in Chrome at mobile and desktop sizes and parsed as JSON.
- Fifth repair: the user explicitly selected “核准這一次題庫品質修正”. Only question choices were shuffled consistently and the correct-choice wording in 054/057/058 was shortened with matching translations. Original question files, first blind artifact and first blind review were retained. IDs, technical conditions and explanation prose were preserved; explanations and answer letters were remapped together. Questions 052/059 remain normal-difficulty introductory scenarios by the agreed scope.
- These are one-time exceptions, not permission for additional repair attempts. A later new defect requires another explicit decision.

## Produced content and independent acceptance

Three logical articles, each in zh/ja/en (nine MDX files), with original case studies and official-source dates:

| ID | Slug | Scope |
|---|---|---|
| blog-026 | lambda-sqs-safe-retries-idempotency | Business idempotency, crash window, partial batch failure, bounded redrive |
| arc-011 | step-functions-human-approval | 48-hour Standard callback, rejection/expiry, compensation, token/IAM boundaries |
| cmp-014 | step-functions-standard-vs-express | Duration, execution semantics, integration limits, history and cost arithmetic |

Architecture has three localized SVGs, all A–I nodes and ten identical connections. The text and diagrams describe a logical design; no AWS resources were deployed and no live 48-hour execution was claimed. Independent technical and translation review found no remaining blocking article issue after the scoped IAM correction.

Maintenance covers 27 existing content files: CloudFront optional static IPs and pricing; REST versus HTTP API caching; Standard/FIFO/SNS/EventBridge ordering; Free Tier account cohorts and plans; Trusted Advisor access and Support migration. Three-language publication metadata was synchronized during integration. Historical IDs and question answers remain unchanged. Maintenance is not counted as new content. Source ambiguity in Free Tier expiry remains explicitly documented; the 2027-01-01 Support transition is a later milestone with GovCloud exception.

Ten original SAA questions `saa-051`–`saa-060` are integrated into each locale, retaining the previous 50 questions. Existing and archived pilot question sets were read for duplication: these questions focus on callback access, SQS consumer KMS access, IAM boundaries, batch retry, business idempotency, approval waits, mapping concurrency, payload references, workflow cost selection and long polling. They do not reproduce the archived recovery scenarios.

### Blind-answer evidence

Reviewers were started with fresh context and supplied only question stems/choices. They did not read keys or explanations before recording answers and rationale. A separate non-blind reviewer checked every language's conditions, options, explanations, practical notes and metadata.

| Artifact | SHA-256 | Outcome |
|---|---|---|
| First answer-free zh set | f186f80772692af70a94747689417eff9388d0c668b7bbf0de20964c9853b926 | 10/10 matching, no double answer; repetitive answer order and three long correct options flagged |
| Revised answer-free zh set | be9567ff84428d04f27e4d981358d0ca19e932cbacab4cd29955fb62784f16a5 | New independent reviewer: 10/10 matching, no second correct answer or material ambiguity |
| Revised complete zh draft | cd0076fcded8cd3b9ddf5fce759ec2031f05d95ed1557cdd9aff4244d56b25cf | Semantic translation review passed |
| Revised complete ja draft | 4773afaba832553e74d9a11b1430bec98da35ef2595fb720499ab4584e9e0a5f | Semantic translation review passed |
| Revised complete en draft | d48278221d3f3900f3b4591c8891ad040c24e079fbb9da0f83a6803cbd2e7420 | Semantic translation review passed |

Final reviewer selections for 051–060: C, A, D, B, B, C, A, D, C, B; distribution A2/B3/C3/D2. Both raw blind reviews and the pre/post drafts are retained in the local task artifacts, not replaced by this summary. Integration verified the three complete draft hashes before appending them.

### Browser verification

Chrome local development server on 127.0.0.1:3109, stopped after inspection. Checked desktop 1440×900 and mobile 390×844. All three new article types were inspected in all three languages: titles/content, six JSON/ASL code blocks, three SVGs and comparison tables. Code text remains valid JSON; mobile wrapping is the existing renderer's behavior. Tables use their existing horizontal scrolling container, without document-wide overflow. Three-language SVG mobile screenshots showed every branch and note without clipping. SVG XML/graph review was independent of the browser review. Temporary viewport override was reset. This is local rendering acceptance, not production or Vercel acceptance.

## Delivery checkpoint

This committed review is prepared before the final candidate run so that the report itself is included in the verified source manifest. The final run ID/seal, exact commit SHA and remote CI conclusions belong in the PR description and delivery response; do not infer their outcome from this checkpoint.

GitHub Chrome inspection: no repository webhooks, no classic protection rules, no rulesets. Installed Apps include Vercel and Render; app installation alone does not establish a deployed service. Vercel project environment settings explicitly track master for Production and all unassigned branches for Preview. The checked repository AWS deployment workflow triggers only on master push (or manual dispatch), not this codex branch. No merge, auto-merge or production deployment is authorized.

Remaining delivery checks: complete candidate profile and source/evidence seal verification; final branch/base and integration review; commit and safe push/draft PR; CI conclusion for that exact SHA. The sealed evidence bundle remains local and must not be committed. Human acceptance remains separate from automated checks.

## PR 347 review correction cycle, authorized 2026-11-09

The user approved the reviewed 34-file text/policy correction and necessary reviewed rebaseline, with commit and push to the same draft PR. This is a post-submission PR correction cycle. The original sealed 3/3 repair history and the fourth/fifth one-time exceptions above remain unchanged. No CLI reset, new task ID, extra automatic repair allowance, merge, auto-merge or production deployment is authorized.

The user's clarification is retained verbatim:

> 我同意
>
> 另外3次上限修復僅為PR提交
> 提交後可以做為另一個迴圈至該PR修正提出為止
>
> 還有我的回饋請幫我整理後在同一個PR上面做comment以作為紀錄

This does not establish three new attempts per cycle or unlimited resets. Material scope additions still require a concrete decision. The coordinating chat owns the feedback comment; this execution will not duplicate it.

Scope: nine new article locale files lose internal translation/revision prose and redundant routine verification dates while retaining applicability, fictional-design caveats and pricing/quota conditions. Seven existing articles in three locales (21 files) gain correction notes tied to the actual pre-PR diff and the same official sources. Dated pricing and unresolved Free Tier source observations remain. No historical correction entries are fabricated. The policy and its docs index add two files; this task contract and this review add two, for 34 files total. Article source revisions advance to 2 with matching locales; question revisions remain unchanged.

The reviewed contract adds only docs/seo/content-policy.md and docs/README.md to its allowed paths. The same task, bundle, engine, profile, assertions, inherited skips and repair records are retained. Full baseline and candidate verification are required after the reviewed rebaseline. This record is prepared before those runs; final seals and exact-SHA CI results will be reported separately.

Architecture rendering is tracked separately in [issue 348](https://github.com/vincentmango-wen/aws-cert-roadmap-lab/issues/348). The shared renderer treats Mermaid as code and splits blocks at blank lines; 30 existing locale files contain Mermaid. This was confirmed from source and local exported HTML, not from attachment pixels. The screenshot was available only as Library OCR/description; the remote Preview redirected to Vercel login. No Mermaid, renderer or SVG change belongs to this correction. Render hosting is excluded by the user's explicit instruction.

Independent text review identified that the Japanese decoupling article already avoided the blanket ordering claim before this PR. Its correction note now uses truthful clarification/addition wording in all three locales. Follow-up review found no remaining blocking text issue; all 30 article URL sets are preserved.

Reviewed revision-2 was created without resetting history. Initial baseline attempt `1794205610516-b320a9` stopped before executing checks: the baseline phase requires the original 50 question IDs, whereas the submitted PR contains the 60-ID candidate. This failure is retained. The authorized necessary rebaseline therefore stages the original base-commit question files temporarily, runs the full baseline, restores the exact backed-up 60-question bytes, checks SHA-256, then runs the full candidate. No Harness or final question-file change is made. The backups and restoration manifest remain in ignored task artifacts; errors use a finally restoration path. If interrupted externally, restoration must be checked before any subsequent operation.

Feedback was recorded by the coordinating chat in [the PR review comment](https://github.com/vincentmango-wen/aws-cert-roadmap-lab/pull/347#issuecomment-6733711086); this execution does not duplicate that comment. A direct local build initially failed to fetch the existing Fredoka font under restricted network access; this is not recorded as a passing build.

The network-authorized direct build subsequently passed. Full staged baseline `1794209437169-6edfc1` then reached BASELINE_READY with all seven checks exiting zero. The finally restoration returned all three 60-question files to their original SHA-256 values: zh `41f9cae770e26f653ed32e46e289258cb1c1546ef848613210f511126caa5bd5`, ja `3c95fcae84924641e5eead18aa201513accfd5b54bc128ff6d2e57a8869fb9b3`, en `b00ce51762d2c01f57ab2f0bb08775ea9ed0dcb701388986947c85c7fc0e5943`. The final candidate must validate the restored 60-question state separately.

This correction cycle's browser attempt to the local exported site on 127.0.0.1:3110 timed out. The previous delivery's visual evidence remains historical, not proof of this changed text. Current exported HTML and three-language text checks are separate from screenshot acceptance; desktop/mobile visual confirmation remains pending unless subsequently reported with fresh evidence.

### Resumed verification checkpoint

After reconnection, all 34 modified files were retained, no active verification marker existed, and each restored question file still contained 60 questions with its recorded SHA-256. The baseline was not repeated.

The local static preview service was restarted and its actual exported `.html` paths were opened successfully. In-app browser checks covered all 30 changed article pages at desktop 1440x900 and mobile 390x844 viewport settings: all 21 existing pages displayed their localized correction heading, all nine new pages omitted the removed editorial prose, and none showed document-wide horizontal overflow. Screenshots were inspected for API Gateway correction notes in all three languages at both sizes, plus mobile examples of the cleaned zh Blog scope, ja architecture fictional-design caveat and en comparison pricing/quota reminder. The temporary viewport override was reset. These are local exported-page checks; they do not claim remote Preview or production acceptance.

Candidate `1794218785945-997973` did not pass. Dependency installation exited zero; Harness exceeded its unchanged 180000 ms limit after reporting tests 1 through 19 as passed. The run records 180565 ms, `timedOut: true`, child PID 18088, and STOP_UNCONFIRMED; seal `9f6d1aab89561c6430363fd44f3a62add500d1312a1231b808e254008c6e3bff`. Remaining candidate checks were not executed. The earlier successful baseline is not a substitute for this candidate.

Sandboxed process inspection lacked CIM access. The escalated read-only query for the timed-out Node process and related processes was explicitly rejected by the user. No alternate inspection route, process termination, state reset, timeout change, new run, commit or push was attempted after that rejection. Human reconciliation of process-tree status is required before continuing; all failed-run evidence, the successful baseline, revision archives and repair history remain intact.

The user subsequently requested “請提交推送” with filesystem/network restrictions disabled. The renewed process inspection found PID 18088 absent and no related AIDD, npm, Vitest or Next test processes. PID 6192 had been reused by conhost.exe, created at 2026-11-09 19:39:09 +08:00, after the timed-out run; it was not terminated. No active marker remained. To continue the authorized submission, the current task state is reconciled to BASELINE_READY with a preserved pre-reconciliation task copy and an appended event. The failed latest run, successful baseline, all seals, revisions and original 3/3 repairs are retained. The next candidate uses the unchanged profile, including the 180-second Harness limit; no successful result is presumed here.
