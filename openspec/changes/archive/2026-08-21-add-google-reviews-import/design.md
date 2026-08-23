## Context

See [proposal.md — Why](./proposal.md#why) for the motivation.

PocketBase v0.39.11 is the system of record, and SvelteKit server code already mediates editor and public application behavior. PocketBase hooks already schedule maintenance work with `cronAdd` in `pb_hooks/versions_sweep.pb.js`. DataForSEO's Google reviews API is asynchronous: `task_post` returns a task id, and `task_get/{taskId}` later returns the result or a provider failure. DataForSEO credentials are HTTP Basic credentials supplied through `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`.

The feature has no existing records to migrate. Its configuration belongs only on `/admin/reviews`, and its public surface is JSON data rather than a page section or visitor-facing component.

## Goals / Non-Goals

**Goals**

- Post DataForSEO tasks without holding an editor request open, then collect them after they finish.
- Survive process restarts between task submission and collection.
- Guarantee that manual and scheduled starts cannot create overlapping paid tasks.
- Upsert reviews by their stable Google review id and expose only the specified public JSON shape.
- Keep import configuration, progress, success, and explicit failure information visible on `/admin/reviews`.
- Treat all provider content as untrusted before it reaches stored public data.

**Non-goals**

- Geocoding an address or calling Nominatim; the editor supplies `location_coordinate` directly.
- Adding review configuration to site settings.
- Adding a page section type or any visitor-facing rendering component.
- Mirroring deletions from Google. Imports update or create records and never delete them.
- Retaining a verbatim archive of DataForSEO responses.

## Decisions

### D1. Use a durable two-phase import instead of in-process polling

An import start first acquires the single-flight slot, posts one DataForSEO task, stores the returned task id and request parameters in a `review_import_jobs` PocketBase record, and returns immediately. A later collection invocation reads that durable job, calls `task_get/{taskId}`, and either upserts the result or records a terminal failure. The job record is the pending-task state, so either PocketBase or SvelteKit can restart without losing the provider task id or its status.

**Rationale:** DataForSEO is already task-based. Persisting the boundary between submission and collection makes the workflow match the provider protocol, keeps the editor action fast, and makes recovery depend on stored state rather than one process staying alive.

**Rejected alternative:** Copy the Payload implementation and poll in the request for up to roughly 60 seconds. That holds an editor request open while no useful local work occurs, and a restart during polling loses the only reference to the submitted task. Retrying the request could then spend money on a duplicate task.

### D2. Run collection in a SvelteKit server endpoint triggered by a PocketBase cron

`pb_hooks` owns scheduling, following the established `cronAdd` precedent in `pb_hooks/versions_sweep.pb.js`, and uses `$http.send` to invoke a non-public SvelteKit collection endpoint. The endpoint authenticates the scheduler call, loads the pending job from PocketBase, calls DataForSEO, validates and normalizes the response, and writes the result. Scheduled import starts and pending-task collection use the same SvelteKit import module as manual starts.

The DataForSEO credentials therefore MUST be present in the SvelteKit server environment, not the PocketBase process. A scheduler authentication secret MUST be available to both processes; it is separate from the DataForSEO credentials and the endpoint never returns either secret.

**Rationale:** The hook stays small and does what the repository already uses it for: scheduling. DataForSEO response validation, error mapping, and sanitising untrusted review data fit more naturally in the typed SvelteKit server, next to the manual trigger and public JSON implementation. This avoids maintaining the same import rules in both PocketBase JSVM code and application server code.

**Rejected alternative:** Perform submission, collection, parsing, and writes directly in a `pb_hooks` cron using JSVM and `$http.send`. That would avoid the internal scheduler endpoint and would require the DataForSEO credentials only in PocketBase, but it would move the largest and least trusted parsing path into a less suitable runtime and split manual and scheduled behavior across implementations. A SvelteKit endpoint triggered by an external hosting cron was also rejected because it discards the repository's existing PocketBase scheduling precedent and adds a deployment-specific scheduler dependency.

### D3. Enforce single flight with a database uniqueness constraint

Every active job has `active_key = 'google-reviews'`. The migration creates a partial unique index that permits only one `review_import_jobs` record with that active key. Starting an import creates a `submitting` job with the active key before calling `task_post`; if the insert conflicts, the start is refused without making a paid provider request. Success or explicit failure clears the active key after recording the terminal state and reason. Both the manual trigger and scheduled start MUST call this same acquisition path.

**Rationale:** The unique index is the atomic check. Two processes can race, but PocketBase's database accepts only one insert, so the losing path cannot post a task. Acquiring before `task_post` also closes the more expensive race between a successful provider post and persisting its id. A crash in `submitting` leaves a visible stale job rather than allowing an overlapping task; the stale-job policy records a failure before releasing the slot.

**Rejected alternative:** Query for an active job and then create one if none exists. That check-then-create sequence is advisory: a manual click and the scheduled cron can both observe no job and both submit, which is the overlap the Payload version leaves unhandled. An in-memory mutex was rejected because it neither coordinates multiple processes nor survives a restart.

### D4. Dedupe solely on the Google review id

The `reviews` collection stores the provider's Google review id in a required, indexed, unique field. Each collected item is upserted by that field: a matching record is updated in place, and a missing one is created. No secondary fuzzy match participates in identity.

**Rationale:** The Google review id identifies the review itself and lets a database constraint prevent duplicates even when imports overlap with retries or later updates.

**Rejected alternative:** Match on reviewer name plus publication date, with or without rating. Names are not unique, dates can be rounded or reformatted, reviewers can change names, and one reviewer can leave more than one review. Such a compound heuristic can merge distinct reviews or duplicate one review after metadata changes.

### D5. Use the 10/20/50 incremental depth ladder and make full depth opt-in

Incremental import requests depths 10, then 20, then 50. It stops as soon as a returned review id is already stored or a response contains fewer reviews than requested. A full import explicitly requests the maximum supported depth of 4490. The server clamps every submitted depth to `1..4490` regardless of the caller.

**Rationale:** DataForSEO charges per task and requested work. Most scheduled runs need only the newest handful of reviews, so small requests usually find the existing boundary cheaply. Escalating only when necessary bounds routine cost while still handling bursts larger than ten or twenty reviews. Full depth is useful for initial or deliberate reconciliation but can cost materially more, so it is never the default and must be clearly labelled as a paid full import.

**Rejected alternative:** Request depth 4490 on every run. It is simpler but repeatedly pays for old data that the unique-id upsert already holds. A single fixed small depth was rejected because a burst larger than that window could leave newer reviews unimported without revealing that the stored boundary was never reached.

### D6. Store an editor-supplied coordinate instead of geocoding

`/admin/reviews` accepts `location_coordinate` directly and sends it with the selected lookup key. Saving unrelated site content never performs a location lookup.

**Rationale:** Public Nominatim usage is limited to one request per second and requires an identifying User-Agent. A boilerplate cloned across many independent sites cannot safely assume that every deployment will coordinate that shared policy or configure a compliant identity. Direct entry also removes an external network call and failure mode from an unrelated save.

**Rejected alternative:** Copy the Payload behavior and geocode a business address through Nominatim when site metadata is saved. Besides the policy mismatch, an unavailable geocoder would make a site-settings save fail for a reviews concern. A different geocoding provider was rejected because the API requires a coordinate, not because this feature needs address search; adding another provider and credential would not improve the import itself.

### D7. Do not persist the raw third-party payload

The importer stores only the normalized review, reviewer, owner-response, business, and import metadata fields needed for administration and the public contract. It does not store the verbatim DataForSEO item or task result.

**Rationale:** Raw payloads are valuable for replaying a parser against an exact response and diagnosing provider changes after the fact. Against that, they grow on every stored review, duplicate normalized values, can silently expand when the provider adds fields, and retain third-party personal data the site does not use. Data minimization and predictable storage outweigh replay convenience for a boilerplate. Import failures retain a sanitized reason and provider status metadata, which is enough for routine diagnosis without retaining the response body.

**Rejected alternative:** Keep the raw payload as the Payload implementation does. That improves forensic debugging and offline replay, but it creates an open-ended personal-data and storage obligation for information outside the product contract. Temporary application logs are not a substitute archive and MUST NOT log full review payloads either.

### D8. Validate and sanitise provider data at import, before persistence

The SvelteKit import module validates the task envelope and each accepted review before writing. It coerces only documented numeric and boolean fields, applies field length limits, stores reviewer text as plain text rather than HTML, and rejects malformed required identity fields. Reviewer-supplied and provider-supplied URLs are parsed and retained only when they are absolute `http:` or `https:` URLs; unsupported schemes and malformed URLs become `null` rather than public links. The public endpoint selects already-normalized fields, while Svelte rendering still uses ordinary contextual escaping if a consumer later displays them.

**Rationale:** Sanitising once at the trust boundary gives the admin UI, public endpoint, and future consumers the same safe record. Waiting until render would require every consumer to remember identical rules and would leave unsafe URL values available through JSON or editor tooling. URL protocol validation is especially important because reviewer profile, image, and review links are third-party input even when DataForSEO transports them.

**Rejected alternative:** Store provider values unchanged and sanitise only in a visitor component. This feature intentionally has no rendering component, so there is no single render boundary to own the rule, and a public JSON consumer could turn a `javascript:` or malformed URL into a link. Escaping all text into HTML at import was also rejected because it corrupts the stored value and risks double escaping; the stored contract is plain text.

### D9. Record every terminal failure with a sanitized reason

A job has explicit `submitting`, `pending`, `succeeded`, and `failed` states. Any provider task status code `>= 50000`, invalid response, missing result, credential/configuration error, stale task timeout, or write failure records `failed`, a sanitized reason, and the failure time before the active slot is released. Reasons MUST exclude credentials and full provider payloads.

**Rationale:** Operators need to distinguish “never run,” “still waiting,” “last run succeeded,” and “last run failed.” Durable reasons make retry decisions possible after a restart and prevent a status panel from implying success or inactivity when paid work actually failed.

**Rejected alternative:** Copy the Payload behavior, which writes success metadata but no reachable error state. There, a failure is indistinguishable from an import that has never run, leaving editors without an actionable status and allowing repeated paid retries without understanding the first failure. Logging alone was rejected because logs are transient, deployment-specific, and not available in `/admin/reviews`.

## Risks / Trade-offs

### R1. A configuration or retry mistake can spend substantial money

Every DataForSEO task is billable, and a maximum-depth request can cost materially more than an incremental request. A loop bug, exposed trigger, or overlapping schedule could multiply that cost quickly. The hard single-flight index, authenticated triggers, server-side depth clamp, 10/20/50 default, explicit full-import action, and early-stop rules reduce the blast radius; they do not make provider work free.

### R2. A provider task can remain pending forever or be abandoned

DataForSEO may never publish a terminal result, or the task id may become unusable. Without a bound, that job would hold the single-flight slot forever. Collection therefore treats a job older than the configured operational timeout as a recorded failure and releases the slot. A provider result that appears after that point is ignored unless an operator deliberately retries it, avoiding an automatic second paid task while state is ambiguous.

### R3. DataForSEO can change its response schema

The task envelope or review fields can drift without a local deployment. Strict validation should fail the job explicitly rather than write partially mis-mapped records, but that favors availability of existing data over importing new data. Because raw payloads are not retained, diagnosis depends on sanitized structural error details and a fresh provider response rather than replaying the original body.

### R4. Imported reviews contain third-party personal data

Reviewer names, profile/image URLs, and review text may be personal data. Keeping only contract fields reduces retention, but it does not remove obligations to answer a subject deletion request. Operators must be able to identify and delete a review by Google review id and must account for the fact that a later import could recreate it; imports may need to remain disabled while a deletion or suppression requirement is resolved.

### R5. Google-side edits and deletions are not fully mirrored

An edited review is updated only if it appears in a later fetched window. A review deleted on Google's side is never removed locally because imports deliberately never delete, and an old edited review may remain stale when incremental import stops at a newer known id. Full import can refresh reviews that still exist but still does not prove which stored records Google deleted. Reflecting remote deletions would require a separate reconciliation and deletion policy outside this change.

## Migration Plan

1. Add an up migration that creates `reviews`, `review_import_settings`, and `review_import_jobs`. `reviews` has a required unique Google review-id index. `review_import_settings` holds the singleton `/admin/reviews` configuration. `review_import_jobs` holds durable task state and includes the partial unique active-key index used for single flight.
2. Deploy the migration before enabling the admin route, cron trigger, or public endpoint. The settings record starts unconfigured, so no scheduled task is posted until an editor supplies valid configuration and credentials are available.
3. No backfill runs and no existing collection or record is changed. The first import creates only records in the new collections.
4. The down migration drops the new indexes and all three new collections. Rolling back application code without running the down migration leaves imported reviews inert but preserved. Running the down migration deletes reviews already imported along with their import history and configuration; export or retain the new collections before that step if the data must survive rollback.

## Open Questions

None. The provider protocol, runtime boundary, durable state model, security boundary, cost controls, data-retention choice, and settled product scope are sufficient to implement the change without reopening two-phase import, editor-supplied coordinates, the data-only public surface, or `/admin/reviews` configuration ownership.
