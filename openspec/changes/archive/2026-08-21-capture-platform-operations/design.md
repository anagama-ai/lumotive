## Context

See proposal.md — Why. Editor session handling, request rate limiting, and scheduled backups are already shipped and running, but their load-bearing behaviour is not captured as a contract. This change documents that current behaviour and expects no code change; any code change would be a defect correction discovered during verification, not implementation of a new feature.

Editors authenticate through the application and hold their session in the `pb_auth` cookie. Invalid or expired tokens do not establish an editor identity, anonymous public requests do not receive a session cookie, unauthenticated admin requests are redirected to sign-in, and non-admin editors are refused access to admin-only screens. The cookie is `httpOnly`, uses `SameSite=Lax`, applies to `/`, and is marked secure when the request protocol is HTTPS.

The built-in limiter is enabled for password authentication and form submissions; its currently verified settings are 10 authentication attempts per 300 seconds per guest and 20 form submissions per 60 seconds. Scheduled backups run daily at 03:00 with seven cron backups retained. Backup storage is currently local because S3 is disabled, and `cronMaxKeep` prunes only cron-generated backups: backups created through the API are not auto-pruned and share the database volume.

## Goals / Non-Goals

**Goals**

- Record the observable security boundary for editor authentication and session handling.
- Record that password authentication and form submissions are subject to finite, enforced limits, with an outer proxy remaining responsible for the first line of request control.
- Record the schedule, retention scope, storage risk, and recovery coverage of backups without implying guarantees the running system does not provide.
- Make future verification capable of detecting a regression in any of those behaviours.

**Non-Goals**

- Redesign authentication, authorization, rate-limit values, backup tooling, or storage architecture.
- Specify what an authenticated role may do; that remains the responsibility of `editorial-roles`.
- Specify PocketBase superuser or dashboard authentication.
- Claim that a database backup alone is a complete disaster-recovery plan.

## Decisions

### D1. Capture rather than redesign

**Decision and rationale.** This change captures the contract of the running system before changing it. The existing behaviour is already relied upon by the admin surface and by environment promotion, so documenting and verifying that baseline creates an explicit point from which a later redesign can be evaluated. Keeping reconciliation separate also makes any observed mismatch visible instead of allowing a redesign to obscure whether the old protections were preserved.

**Rejected alternatives.** Redesigning authentication in this change is rejected because it would combine specification discovery with a security-sensitive behaviour change, expand the review surface, and destroy the stable observational baseline. Leaving the behaviour undocumented until a future redesign is also rejected because the current system remains load-bearing now, and an unspecified protection can regress before that redesign exists.

### D2. Put the authentication boundary at session establishment

**Decision and rationale.** `platform-operations` owns becoming an authenticated editor and holding or clearing the resulting session. `editorial-roles` begins after an editor identity has been established and owns what that identity's role may do. This division separates authentication and session integrity from authorization policy while still allowing admin-only outcomes to verify that the boundary is enforced.

**Rejected alternatives.** Folding session handling into `editorial-roles` is rejected because it would make role policy responsible for proving identity and would blur failures of authentication with failures of authorization. Specifying PocketBase's superuser or dashboard authentication is rejected because that is provider-owned operational access, not the editor-facing session issued and consumed by this application.

### D3. Treat cookie properties as requirements

**Decision and rationale.** The session cookie's `httpOnly`, `SameSite=Lax`, path, and protocol-dependent secure properties are part of the security contract. `httpOnly` is especially load-bearing because editor-supplied code injection is rendered into the public document: a third-party snippet can execute in the site's browser context, and a script-readable editor session cookie would therefore be exposed to that snippet. These flags constrain how the credential can be read and transmitted, so a future change must not silently relax them.

**Rejected alternatives.** Treating cookie flags as incidental framework defaults is rejected because defaults can change without any authentication flow appearing broken. Specifying only that “a cookie exists” is rejected because it would permit a functionally valid but script-readable or inappropriately transmitted credential.

### D4. Make the secure flag protocol-dependent

**Decision and rationale.** The cookie is marked secure when the request reaching the application is HTTPS and is left usable for intentional plain-HTTP development. This preserves local sign-in without weakening HTTPS deployments. A deployment behind a TLS-terminating proxy must ensure that the application receives a trusted representation of the original HTTPS scheme, or the application will observe plain HTTP and emit a cookie without the secure flag.

**Rejected alternatives.** Marking the cookie secure unconditionally is rejected because browsers will not return it over plain HTTP, breaking the supported local flow. Leaving it insecure unconditionally is rejected because production sessions would then be eligible for transmission over HTTP. Assuming TLS termination is sufficient without preserving the originating protocol is rejected because the application cannot apply the correct flag to information it does not receive or trust.

### D5. Specify finite rate limits, not exact tuning values

**Decision and rationale.** The contract requires password authentication and form submissions to have finite, enforced request bounds and requires over-limit requests to be refused. The currently verified numbers remain deployment configuration and verification evidence, not permanent API promises. This keeps the security property stable while allowing operators to tune thresholds as traffic and abuse patterns change.

**Rejected alternatives.** Pinning 10 per 300 seconds and 20 per 60 seconds in normative requirements is rejected because every legitimate tuning change would require a specification change, review, and acceptance update even though the protected behaviour is unchanged. Omitting bounds entirely is rejected because “rate limited” without a finite, enforced ceiling cannot detect a disabled or ineffective limiter.

### D6. Treat the built-in limiter as defence in depth

**Decision and rationale.** The application-level limiter protects the two named operations, but the specification also places a request-control obligation on the deployment's reverse proxy. The proxy can reject abusive traffic before it consumes application resources and provides an independently configured layer if the built-in limiter is misconfigured, disabled, or bypassed by deployment topology.

**Rejected alternatives.** Treating the built-in limiter as sufficient is rejected because it is reached only after traffic enters the application boundary and shares the application's configuration and failure modes. Relying only on the proxy is rejected because the application would lose operation-specific protection and local or alternate deployments could bypass the edge configuration.

### D7. Scope backup retention explicitly

**Decision and rationale.** `cronMaxKeep` governs only cron-generated backups. It does not prune API-created backups, which can therefore accumulate without bound on the same volume as the database. The contract must state that scheduled retention is scoped rather than implying a global seven-backup ceiling. The chosen operational direction is a separate, explicit retention policy for API-created backups, independent of cron retention; until that policy is implemented, unbounded API-backup growth remains a documented risk rather than a guarantee invented by this reconciliation change.

**Rejected alternatives.** Distinguishable naming is rejected as the primary control because it helps inventory and selection but never deletes anything or bounds storage. Moving backups off-box is rejected as the retention mechanism because it reduces the shared-volume failure mode but still permits unbounded cost and accumulation, and off-box backup storage is not currently enabled. Applying cron retention to all backups is rejected because it could silently delete manually created rollback points whose lifecycle is intentionally different. Off-box storage can complement, but not replace, a separate lifecycle policy.

### D8. State backup coverage as storage changes

**Decision and rationale.** The specification states what a backup covers under the active storage arrangement rather than promising that “restore” always recovers the whole site. With local file storage, database and locally managed file data can be covered together; once uploaded files move to S3, the database backup no longer contains those files. Recovery after that move therefore depends on a separately verified S3 protection and restore path.

**Rejected alternatives.** Promising complete recovery from a database backup is rejected because that promise becomes false as soon as files live off-box. Omitting coverage from the contract is rejected because a technically successful restore that silently lacks uploaded files is an operational failure. Blocking the planned S3 move to preserve single-archive coverage is rejected because storage architecture and recovery composition can change safely when each component's coverage is explicit and tested.

## Risks / Trade-offs

- A future refactor can silently remove `httpOnly`, relax `SameSite`, widen the cookie path, or misapply the secure flag while sign-in still appears to work. Verification must inspect the actual `Set-Cookie` attributes, not infer them from configuration.
- The built-in limiter can be disabled to simplify debugging and accidentally remain disabled. Verification must exercise an over-limit request in a controlled environment and confirm refusal, while deployment review independently confirms the proxy layer.
- API-created backups can fill the volume they are meant to protect, exhausting space for both new backups and the live database. Operations must monitor volume growth until the separate API-backup retention policy exists.
- After files move to S3, a database restore can report success while uploaded files remain absent. Restore drills must verify database records and file availability as separate recovery components.
- A requirement recorded without direct evidence can create more confidence than no requirement at all. Every normative behaviour needs reproducible evidence from the running system or an explicitly tracked verification failure before reconciliation is accepted.
- Protocol detection can be wrong behind a TLS-terminating proxy, producing a non-secure cookie for an HTTPS visitor. Deployment verification must inspect the browser-visible cookie through the real proxy path, not only on localhost.
- Separating exact limiter values from the normative contract permits operational tuning but makes configuration drift less visible in the spec. Deployment evidence must therefore record the effective finite values even though the specification does not freeze them.
- Local backups share a failure domain with the database volume. Retention controls reduce exhaustion risk but do not protect against loss of that volume; off-box recovery remains a separate operational concern.

## Migration Plan

There is no schema change and no expected code change. Reconciliation is completed by building a requirement-to-evidence record against the running system:

1. Establish an editor session through the normal sign-in flow, inspect the returned `pb_auth` cookie for `httpOnly`, `SameSite=Lax`, path `/`, and the secure flag under both plain HTTP and the real HTTPS proxy path, then sign out and confirm the session no longer authenticates.
2. Present an expired token and a token with an invalid signature and confirm neither establishes an editor identity. Request a public page without a cookie and confirm that no `Set-Cookie` header is emitted.
3. Request protected admin screens anonymously and confirm redirection to sign-in. Request an admin-only screen as a non-admin editor and confirm refusal, while leaving role-specific permissions to the `editorial-roles` evidence set.
4. In a controlled, non-production window, exceed the effective password-authentication bound and the form-submission bound and confirm over-limit requests are refused. Record the effective finite values as evidence without promoting those values into normative requirements. Separately inspect and exercise the reverse proxy's applicable request controls through the deployed edge.
5. Inspect the effective backup schedule, destination, and cron retention value. Confirm that scheduled backups are pruned to the configured bound while an API-created backup is not selected by cron retention. Perform any creation, pruning, deletion, or restore exercise only in a disposable environment so verification cannot endanger the current database.
6. Verify that backup list, create, restore, and delete operations reject non-superusers. Restore a representative backup into a disposable instance and compare the recovered database and file inventory with the declared coverage. Repeat the coverage drill when file storage moves to S3, including the independent S3 recovery path.

If implementation and requirement disagree, reconciliation stops at that requirement. The discrepancy is investigated as a defect or an incorrect current-state observation, resolved explicitly, and the check is rerun. The requirement is not weakened merely to make the current implementation pass, and no disagreement is hidden as documentation wording.

## Open Questions

None. The scope, current behaviour, capability boundary, and follow-on direction for API-created backup retention are settled; any failed verification is a discrepancy to resolve under the migration plan, not an open design question.
