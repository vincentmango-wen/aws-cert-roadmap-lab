# Issue 376: Read-only S3 origin preflight

This review introduces an offline, fail-closed planner and S3 metadata interpreter, not a deployment path. It does not change the legacy writer or manual shadow, branch settings, frontend files, release permissions, or production. Keep this PR unmerged until the owner reviews the evidence. The private hosted trial validated a single-edit replay with synthetic values; its output cannot stand in for the current production artifact.

## Collect and compare

1. Verify the existing identity and associate the live site alias with its actual CloudFront behavior, S3 origin and origin path. Pin the intended bucket owner and current, candidate and rollback receipts independently; HEAD alone is not a release receipt.
2. Limit sampling to already approved candidate/protected keys. Use HeadObject with checksum mode and expected bucket owner, recording only the verified representation and serving fields. Never use an ETag as a content digest or treat a 403 or unbound 404 as missing. Stop on unknown keys, missing or composite full-object SHA-256, unsupported serving headers, mismatched route/alias mapping, stale receipts or unresolved protection. Do not fetch bodies or broaden permissions as an automatic fallback. If a separate bounded full-GET scope is approved, follow the collection contract below.
3. Compare the reviewed candidate with independently pinned origin snapshots and the protected roster using the offline planner. Report paths, object and byte bounds, reason codes and whether the result is HOLD, NOOP, SITEMAP_ONLY or shadow-eligible. Do not use a normalizer to hide a write: output-affecting changes must match the reviewed scope and verified bytes. The sample Chinese home/update-card dependencies require exact attribution to the reviewed article, not a directory allowlist.
4. Report mixed-generation and rollback evidence separately. Before any production cutover, verify actual build inputs, real viewer aliases, a scoped write/rollback rehearsal and exclusivity. This PR does not implement a writer or grant IAM access.

## Full-GET evidence collection contract

- For each approved key, a trusted collector must pin the expected owner and intended object identity, confirm HTTP 200, enforce the approved size limit, and supply the untransformed raw body and complete modeled metadata from the same direct S3 response. Do not use a CDN, request ranges or parts, apply response-header overrides, decompress the body, or project out fields. Use an immutable version when available. A conditional ETag can guard against a content change but does not bind metadata revisions or create a cross-key snapshot.
- The offline interpreter requires exact body length and computes SHA-256 from those bytes. Missing optional `CacheControl` and `ContentEncoding` fields are recorded as `null` only after a complete GET proves absence; they are not default headers or a statement about CDN cache behavior. HEAD still requires an explicit cache value and a valid full-object checksum. A nonzero or malformed [`MissingMeta`](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html), unsupported serving metadata or incomplete evidence leaves the object unknown.
- The interpreter performs no requests and is not a source of release identity, approval or provenance. The caller's `directFullResponse` assertion is a trusted collection precondition, not proof that arbitrary JSON or a manually assembled receipt came from S3. Do not combine HEAD metadata with GET bytes or persist the body in audit evidence. Keep current, candidate, and rollback verification separate.

## Keep review separate from production

The existing frontend writer can run on `master` pushes affecting `frontend/**` or its own workflow, or through manual dispatch. This proposed PR targets `dev`, changes neither writer path, and adds only the credential-free PR fixture check described below. Confirm the exact change list and legacy writer state again before any promotion. Vercel integration is independent. Before replacing the legacy workflow or running a new production writer, obtain separately approved cutover and reconcile any in-flight executions. The new writer must bind the approved ref, immutable artifact and release attempt; selecting a branch/tag in manual dispatch is not approval.

## PR fixture: build and compare only

`content-coexistence-shadow.yml` runs only on PR #382 from the existing same-repository topic into `dev`. It checks out the exact event head with a read-only token not retained in Git configuration. There is no manual dispatch, schedule, deployment environment, OIDC, AWS credential, deployment job, or artifact publishing. Its summary contains reviewed object keys, body counts and actual body bytes for forward and reverse comparison; it contains no site output, live origin details, or input configuration values.

The runner archives the tracked frontend into a disposable directory, verifies the reviewed npm lockfile, installs with lifecycle scripts disabled, and builds the unchanged fixture twice then one exact Traditional Chinese IAM article body edit. All arms share the same synthetic public inputs, local font stand-in, Taipei build day, fixed Next.js 16.2.6 compatibility ID and runtime. The production Next config and content are never edited. It compares SHA-256 and lengths for every export; both compiler static inventories must match the corresponding released export and each other. Unreviewed dependency output, missing or added route/payload keys, malformed file evidence, or an unapproved build-input change stops the check; there is no full-sync fallback.

Sitemap-only replay is `SITEMAP_ONLY`, not `NOOP`; the report includes one would-upload object with the full generated XML length. A sitemap change is allowed only when the exact XML otherwise matches, changes are only to independently reviewed fallback URL `lastmod` fields within their respective actual build windows, and the dated route set and alternates are otherwise byte-identical. Known content dates and other XML are not normalized away. The same check applies if the article edit also changes the sitemap. `NOOP` is reserved for a replay with byte-identical inventories. None of these decisions executes or authorizes an upload. The output does not estimate serving-metadata differences or claim a production savings threshold from the fixture.

To reproduce in a checkout with the approved dependency lockfile:

```sh
node --test scripts/release/__tests__/*.test.mjs
node scripts/release/run-content-shadow-build.mjs
# For a previously populated npm cache:
node scripts/release/run-content-shadow-build.mjs --offline
```

## Formal evidence handoff remains separate and read-only

The PR fixture does not read S3 or obtain standing live-baseline data. A separate authorized trusted collector must provide actual active/candidate/protected generation receipts, source/patch policy, exact immutable build artifacts and compile/export evidence, target and route/config/schema bindings, and a fresh complete origin observation with raw full-object SHA-256/length and modeled serving metadata. The candidate must be produced under the pinned formal environment; fixture data cannot substitute for it. The provenance and approval register, including receipt/policy/observation digests, protected roster, rollback binding, expiry and permitted age, must be pinned independently of the evidence bundle and materialized as a separate protected local file. Do not accept it from a PR, an arbitrary dispatch argument, or a bundle self-pin.

Run the existing Linux-only offline file reader from a trusted revision, once both of those files are present in a protected directory:

```sh
node scripts/release/content-coexistence-report.mjs /protected/evidence.json /protected/independent-trust.json "$REGISTER_SHA256"
```

The operator must supply the exact raw SHA-256 of the register from a separately authenticated owner-controlled source, never derive it from a file supplied with an untrusted bundle. The CLI uses bounded regular files (no symlinks), checks that out-of-band register pin, reapplies the age and approval check to the actual machine clock, exits with status 2 on HOLD, and never downloads or writes an object. Formal SITEMAP_ONLY requires identical source commit/tree, a separately pinned same-source policy, and exact observed and candidate sitemap body digests; the trusted collector must establish the timestamp-only XML proof. This PR does not wire live receipts or any provider credentials to GitHub Actions. A future routine CI read-only formal path requires a reviewed independently trusted receipt handoff; deployment, IAM changes, writer exclusivity, and scheduling remain separate decisions.
