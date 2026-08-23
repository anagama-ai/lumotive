## 1. Schema

- [x] 1.1 Add a migration creating the `reviews` collection with the imported review fields, a unique index on the Google review id, and indexes on the fields the public payload sorts and filters by
- [x] 1.2 In the same migration create the import-configuration and import-job storage: the business lookup identifier and its type, the editor-supplied location coordinate, the scheduled frequency, and the fields recording an import's state, outcome, and reason
- [x] 1.3 Add the partial unique index that permits at most one active import job, per design D3 — this index IS the single-flight mechanism, so it must exist before any code relies on it
- [x] 1.4 Set API rules: reviews readable publicly, writable only by the server; configuration and job records never publicly readable, since they carry operational state
- [x] 1.5 Write the down step and confirm it reverses cleanly on a database that already holds imported reviews

## 2. DataForSEO client

- [x] 2.1 Add a client module exposing task submission and task retrieval, reading credentials from the environment and refusing to act when either is absent
- [x] 2.2 Build the request body per the verified contract: exactly one lookup identifier, the location coordinate, fixed language and sort, and a depth clamped to the permitted range
- [x] 2.3 Map provider failure to a typed result rather than throwing an opaque error: a task status code at or above the failure threshold, a malformed response, and a transport failure must each be distinguishable
- [x] 2.4 Add a request timeout so a hung provider call cannot occupy the collection step indefinitely
- [x] 2.5 Ensure no credential value can appear in any returned error or log line

## 3. Import module

- [x] 3.1 Add the start path: acquire the single-flight slot by inserting the active job BEFORE submitting the paid provider task, then record the returned task id
- [x] 3.2 Refuse a start when the slot is already held, without submitting a task, and return a reason the editor can read
- [x] 3.3 Add the collect path: find the pending job, retrieve the task, and leave the job pending when the result is not yet ready
- [x] 3.4 Make collection idempotent — collecting the same finished task twice must not duplicate reviews
- [x] 3.5 Upsert by Google review id: update in place when present, create when not, and never delete
- [x] 3.6 Implement the incremental depth ladder with an early stop once an already-stored review is reached; implement full import as a single maximum-depth request
- [x] 3.7 Record the terminal outcome and release the slot: on success the counts and timestamp, on failure an explicit failure with its reason, distinguishable from never having run
- [x] 3.8 Add the stale-job policy from design D3: a job abandoned in the submitting state records a failure before releasing the slot, so a crash cannot wedge the feature permanently
- [x] 3.9 Sanitise at the trust boundary per design D8: reject a reviewer-supplied URL that is not a well-formed absolute HTTP(S) URL, and ensure imported text is stored as text and never interpreted as markup

## 4. Scheduled collection

- [x] 4.1 Add a `pb_hooks` cron following the existing `versions_sweep.pb.js` pattern, invoking the internal collection endpoint
- [x] 4.2 Add the internal endpoint, authenticated by the scheduler secret from design D2, never reachable anonymously and never echoing either secret
- [x] 4.3 Have the scheduled path also start a due import according to the configured frequency, reusing the same acquisition path as a manual start
- [x] 4.4 Treat a manual start and a scheduled start as equivalent contenders for the single-flight slot

## 5. Admin screen

- [x] 5.1 Add `/admin/reviews` and its nav entry, following the pattern the media and pages screens already use
- [x] 5.2 Add the configuration form: lookup type, its identifier, the location coordinate with a hint on reading lat/long from Google Maps, and the frequency
- [x] 5.3 Validate that the identifier matching the chosen lookup type is present before allowing an import to be requested
- [x] 5.4 Add the import controls: incremental as the default action, and a full import that is separately and clearly labelled as costing materially more
- [x] 5.5 Show import state: when it last ran, the outcome, and the failure reason when there is one
- [x] 5.6 Show the dormant state plainly when credentials are absent, and prevent requesting an import in that state
- [x] 5.7 List the imported reviews with enough detail to tell them apart, paginated
- [x] 5.8 Restrict the whole screen and its actions to an authenticated editor, keeping the forms working without client-side scripting like the other admin screens

## 6. Public endpoint

- [x] 6.1 Add the public JSON endpoint under the public site routes
- [x] 6.2 Apply the display filter: rating of at least 4 and non-empty review text
- [x] 6.3 Compute the average over every review carrying a numeric rating, not only the published ones, and return the specified empty value when none do
- [x] 6.4 Return only the nine public fields; exclude import bookkeeping and the raw provider payload
- [x] 6.5 Bound the response — the public payload must not grow without limit as reviews accumulate
- [x] 6.6 Set the cache headers

## 7. Documentation

- [x] 7.1 Document the two credentials and the scheduler secret in `.env.example`, following the existing commented-and-explained style
- [x] 7.2 Document in `README.md`: obtaining a Place ID, where to read the location coordinate, that a full import costs materially more per run, that imports never delete a review so a review removed on Google's side persists, and that the feature is dormant without credentials

## 8. Verification

- [x] 8.1 Apply the migration to a fresh database and to the live one, and confirm the down step reverses both
- [x] 8.2 Prove single flight: attempt two concurrent starts and confirm exactly one task is submitted and the other is refused with a reason
- [x] 8.3 Prove the slot is acquired before submission — a refused start must make no provider request
- [x] 8.4 Prove idempotent collection: collect the same finished task twice and confirm the stored review count is unchanged the second time
- [x] 8.5 Prove dedupe: re-import identical data and confirm the stored count changes by zero and existing records are updated in place
- [x] 8.6 Prove the incremental early stop requests fewer reviews than a full import when prior reviews exist
- [x] 8.7 Prove a failed import records an explicit failure with a reason, and that this is distinguishable from never having run
- [x] 8.8 Prove a not-yet-ready result leaves the job pending and a later attempt completes it
- [x] 8.9 Prove the stale-job policy releases a wedged slot and records a failure
- [x] 8.10 Prove an anonymous request cannot start an import and cannot reach the internal collection endpoint
- [x] 8.11 Prove no credential or scheduler secret appears in any editor-facing message, public response, or log line
- [x] 8.12 Prove URL rejection at the boundary using a malformed and a non-HTTP(S) reviewer URL
- [x] 8.13 Prove imported markup is not interpreted by the public site. Proven at the data layer: a script tag imported into review text is served inside a JSON string with `content-type: application/json`, so it is inert. NOTE: this change is data-only by design, so no page renders review text yet; whichever component eventually renders it must escape, which Svelte does by default
- [x] 8.14 Prove the public filter and the average: seed ratings above, at, and below the threshold plus one with empty text, and confirm which appear and what the average is
- [x] 8.15 Prove the dormant state with credentials removed
- [x] 8.16 Run the type check and the production build

## 9. Findings raised for decision

- [x] 9.1 CLOSED, handled and documented. An absent provider rating is stored as `0`, because a PocketBase number field cannot hold null. The public endpoint now treats a rating below 1 as absent, which is correct for Google's 1-5 scale, but any future consumer of the stored field must apply the same rule or it will read an unrated review as a zero-star one
- [x] 9.2 CLOSED, keeping it. The provider stub at `scripts/dev/dataforseo-stub.mjs` exists so the two-phase import can be exercised without a paid account, via `DATAFORSEO_BASE_URL`. Keep it if that is useful; it is dev-only and unreferenced by application code
