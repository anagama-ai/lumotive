## Why

Three pieces of security and operational behaviour are implemented and running, and none of them has a contract.

**Editor authentication.** Signing in, signing out, and the `pb_auth` session cookie carry the whole admin surface. A security audit hardened them — the cookie became `httpOnly`, its `secure` flag became protocol-dependent, and an invalid token stopped populating an editor identity. Not one of those properties is written down. A future change can revert any of them and every spec still passes.

**Request rate limiting.** PocketBase's built-in limiter is enabled by migration: 10 password-authentication attempts per 300 seconds per guest, and 20 form submissions per 60 seconds. Verified firing — the eleventh login attempt in a window returns 429. Nothing records that this is intended, so nothing stops it being switched off as an inconvenience during debugging.

**Scheduled backups.** A migration configures a daily backup at 03:00 retaining seven. This is the only thing standing between a bad migration and permanent data loss, and it is currently an undocumented side effect of a migration named after rate limits.

This change writes the contract for behaviour that already exists. It is reconciliation, not a feature.

The trigger is concrete: `add-environment-promotion` treats a backup as its rollback handle. Making an operation depend on backups while backups have no specified behaviour is how a rollback turns out not to exist at the moment it is needed.

## What Changes

- Requirements describing editor sign-in, sign-out, and session handling: what a valid session grants, what an invalid or expired token must not grant, and the cookie properties that are load-bearing rather than incidental.
- Requirements describing the rate limits: which operations are limited, that exceeding a limit is refused rather than served slowly, and that the limiter is a second layer behind a reverse proxy rather than the only one.
- Requirements describing scheduled backups: that they run unattended on a schedule, that retention is bounded, and that retention is scoped to scheduled backups so it cannot silently evict or be evicted by backups taken for other reasons.
- A statement of what a backup does **not** contain once file storage moves to S3, because that changes what a restore actually recovers.

No behaviour changes. Where verification finds the implementation and the requirement disagree, the disagreement is resolved rather than papered over.

## Capabilities

### New Capabilities

- `platform-operations`: editor authentication and session handling, request rate limiting, and scheduled backups.

### Modified Capabilities

None. `editorial-roles` covers what a role may do once authenticated; it does not cover becoming authenticated, and that boundary is left where it is.

## Impact

Affected specs:

- `openspec/specs/platform-operations/spec.md` (new)

Affected code:

- None expected. Any change is a defect found while verifying a requirement against the running system.

Risk of not doing this:

- The audit's cookie hardening is one careless edit from being undone, and the edit would look harmless.
- `add-environment-promotion` inherits a rollback guarantee that nothing currently guarantees.

## Assumptions

- Recorded because it bounds scope: superuser and dashboard authentication are PocketBase's own concern and are not specified here. Only the editor-facing session this application issues and consumes is in scope.
- Rate limit values are treated as configurable rather than fixed. The requirement is that limiting is in force and bounded, not that a particular number is sacred.
