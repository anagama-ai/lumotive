## Why

Clients want to see a major revision against real content before it goes live. That needs staging to hold production's data, the client to review it there, and the reviewed content to move to production — without touching customer records or, later, orders.

Nothing here does that today. There is no deployment tooling of any kind in this repository: no `Dockerfile`, no CI workflow, no scripts beyond `dev`, `build`, and `pb`. Data movement between environments would be a manual `pb_data` copy, which is how order history gets destroyed.

Two facts about PocketBase decide the design.

**Everything lives in one SQLite file.** Pages, editors, and customer records share `pb_data/data.db`. So promotion cannot be a file copy — copying staging over production would discard every record production accumulated during the review, which for a store means orders.

**Records can be created with an explicit id.** This is what makes selective promotion viable at all: a page copied from staging keeps its id, so relations to media still resolve. Verified in this repository — a deleted page was restored under its original id and every reference held.

So promotion writes content records into production's live database and leaves everything else alone. Production stays up, and customer data is never in scope rather than being carefully preserved.

## What Changes

- A version-controlled configuration file classifies every collection as promoted, preserved, or scrubbed. The tooling refuses to run when a collection is missing from it, so a newly added collection cannot be silently skipped or silently overwritten.
- A refresh operation copies production into staging using PocketBase's own backup and restore endpoints rather than a file copy, then removes customer data according to the scrub list.
- Refresh records a **manifest**: a content hash per promoted record. This is the baseline for reporting what changed later.
- A promote operation copies promoted collections from staging into production's live database, upsert-only, ids preserved, media files before the records that reference them.
- Promote takes a production backup before its first write and reports the backup key as the rollback handle.
- Promote **never blocks on divergence.** Production must remain editable during a review window, because urgent fixes cannot wait for a revision to finish. Instead, promote reports exactly which production records changed since the manifest and were overwritten, so an overwritten fix can be recovered.
- Staging's editor UI shows an advisory banner when production has diverged from the manifest, so the person preparing the revision knows staging needs updating.
- Preserved collections are asserted unchanged across a promote. A promote that alters a preserved row is a bug, and the tooling proves it did not happen rather than assuming.

## Capabilities

### New Capabilities

- `environment-promotion`: classifying collections, refreshing staging from production, promoting reviewed content to production, and reporting divergence.

### Modified Capabilities

None.

## Impact

Affected specs:

- `openspec/specs/environment-promotion/spec.md` (new)

Affected code:

- New scripts and a classification configuration file
- A small addition to the editor UI for the divergence banner
- `README.md`, and `.env.example` for the credentials each operation needs

Deliberately out of scope, to keep this reviewable:

- Dokploy configuration, container images, systemd units, and reverse-proxy configuration
- The merge-triggered automation that will call promote. The operation is built to be callable and safe first; wiring it to a git event is a separate change
- Commerce collections. None exist yet. The classification file is the seam that lets them be added later without changing the tooling

Data safety, which is the whole point of the change:

- Promote writes to a live production database. An upsert-only contract and a preserved-collection assertion are what stand between a revision and a data-loss incident.
- Refresh moves production data onto a less-guarded staging host, so scrubbing customer records is part of the operation rather than a follow-up chore.

Recovery:

- Production's existing version history records a promote as an ordinary record update, so an overwritten page is recoverable per-record through the editor UI, independently of the backup.

## Assumptions

- Recorded because it materially shapes scope: the classification file lives in the repository rather than in PocketBase settings, so a change to it is reviewed like code and travels with the branch that needs it.
- Divergence is measured against a manifest of content hashes rather than record timestamps. `globals`, `redirects`, and `editors` carry no `created` or `updated` fields, so a timestamp-based comparison would silently ignore `globals` — the collection holding header, footer, SEO, and code injection, which is exactly what an urgent production fix tends to touch.
