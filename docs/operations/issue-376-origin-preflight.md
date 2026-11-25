# Issue 376: Read-only S3 origin preflight

This review introduces an offline, fail-closed planner and S3 metadata interpreter, not a deployment path. It does not change workflow triggers, branch settings, frontend files, release permissions, or production. Keep this PR unmerged until the owner reviews the evidence. The private hosted trial validated a single-edit replay with synthetic values; its output cannot stand in for the current production artifact.

## Collect and compare

1. Verify the existing identity and associate the live site alias with its actual CloudFront behavior, S3 origin and origin path. Pin the intended bucket owner and current, candidate and rollback receipts independently; HEAD alone is not a release receipt.
2. Limit sampling to already approved candidate/protected keys. Use HeadObject with checksum mode and expected bucket owner, recording only the verified representation and serving fields. Never use an ETag as a content digest or treat a 403 or unbound 404 as missing. Stop on unknown keys, missing or composite full-object SHA-256, unsupported serving headers, mismatched route/alias mapping, stale receipts or unresolved protection. Do not fetch bodies or broaden permissions as an automatic fallback.
3. Compare the reviewed candidate with independently pinned origin snapshots and the protected roster using the offline planner. Report paths, object and byte bounds, reason codes and whether the result is HOLD, NOOP or shadow-eligible. Do not use a normalizer to hide a write: output-affecting changes must match the reviewed scope and verified bytes. The sample Chinese home/update-card dependencies require exact attribution to the reviewed article, not a directory allowlist.
4. Report mixed-generation and rollback evidence separately. Before any production cutover, verify actual build inputs, real viewer aliases, a scoped write/rollback rehearsal and exclusivity. This PR does not implement a writer or grant IAM access.

## Keep review separate from production

The existing frontend writer can run on `master` pushes affecting `frontend/**` or its own workflow, or through manual dispatch. This proposed PR targets `dev`, changes neither path, and adds no workflow or credential use. Confirm the exact change list and legacy writer state again before any promotion. Vercel integration is independent. Before replacing the legacy workflow or running a new production writer, obtain separately approved cutover and reconcile any in-flight executions. The new writer must bind the approved ref, immutable artifact and release attempt; selecting a branch/tag in manual dispatch is not approval.
