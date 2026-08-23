## Why

Client marketing sites want their Google reviews on the page, and Google's own review data is not directly fetchable at a useful volume. The Payload platform already solves this: `acorn-technologies` imports reviews from DataForSEO into a `google-reviews` collection, dedupes on the Google review id, and exposes a filtered public payload. That mechanism works and is in production. This boilerplate has no equivalent, so every PocketBase site would start from nothing.

This change ports that capability, with three deliberate departures from the Payload original — two of them fixing defects found while reading it.

**The import becomes two-phase.** DataForSEO is task-based: the Payload version posts a task then polls in-process, up to 12 attempts five seconds apart, so an editor's request can block for a minute and a restart mid-poll loses the task entirely. Here, posting and collecting are separate: the editor's action returns immediately, and a scheduled job collects the result.

**Geocoding is dropped.** Payload derives the required `location_coordinate` by geocoding the business address through OpenStreetMap Nominatim on every Site Meta save. Nominatim's usage policy caps callers at one request per second and requires an identifying User-Agent; a boilerplate cloned across many client sites is a poor fit for that. The editor supplies the coordinate directly instead, which removes a third-party dependency and a failure path from an unrelated save.

**Two Payload defects are not carried across.** Its sync writes success metadata but never writes an error status, so the status panel renders an "Error" state that cannot occur — a failed sync is indistinguishable from one that never ran. And nothing prevents the daily job and a manual run from overlapping. Both are fixed here rather than reproduced.

## What Changes

- A new `reviews` collection stores imported Google reviews, keyed by the Google review id so re-importing updates in place instead of duplicating.
- A new `/admin/reviews` screen lists imported reviews, holds the import configuration, and offers a manual import.
- Import configuration covers the business lookup (one of Place ID, CID, or business keyword), the location coordinate, and how often the scheduled import runs.
- Importing is two-phase: requesting an import posts a DataForSEO task and records its id; a scheduled job collects the finished result and upserts reviews. Neither phase blocks on the other.
- An incremental import walks increasing depths and stops once it reaches a review it already has. A full import requests everything. Importing never deletes a stored review.
- Import state is recorded and shown to the editor: when it last ran, what happened, and — unlike the Payload original — an explicit failure with its reason.
- Only one import may be in flight at a time. A second request while one is running is refused rather than run concurrently.
- A public JSON endpoint serves display-worthy reviews with the same rule the Payload version uses: a rating of at least 4 and non-empty review text.
- DataForSEO credentials are read from the environment. With no credentials configured, the feature stays dormant and says so rather than failing obscurely.

## Capabilities

### New Capabilities

- `google-reviews`: importing Google reviews from DataForSEO, storing them, and publishing a filtered public view.

### Modified Capabilities

None. Reviews configuration lives on the new `/admin/reviews` screen rather than in site settings, so no existing capability changes.

## Impact

Affected specs:

- `openspec/specs/google-reviews/spec.md` (new)

Affected code:

- A new PocketBase migration creating the `reviews` collection and the collection holding import configuration and state
- A new DataForSEO client and import module in the SvelteKit server
- A new `/admin/reviews` route, plus a nav entry
- A new public endpoint
- A scheduled job in `pb_hooks`, alongside the existing version-retention cron
- `.env.example` and `README.md`

External dependency:

- DataForSEO's `business_data/google/reviews` task endpoints, over HTTP Basic auth. No new npm package: the existing `fetch` is sufficient.

Cost, which is worth stating plainly because it is real money:

- DataForSEO bills per task. A full import requesting maximum depth costs materially more than an incremental one, so the default must be incremental and a full import must be a deliberate, clearly-labelled choice.

Sequencing note:

- The active `capture-settings-and-injection` change specifies that site settings has exactly five sections in a fixed order. Putting reviews configuration on its own screen keeps this change independent of that one, so the two can land in either order without conflicting.

Security surface:

- Credentials must never reach the browser or appear in an editor-facing error.
- The import writes third-party text and URLs into records the public site renders, so reviewer names, review text, and any supplied URL are untrusted input.
- Triggering an import spends money against an external account, so it must be restricted to an authenticated editor and must not be reachable by an anonymous request.
