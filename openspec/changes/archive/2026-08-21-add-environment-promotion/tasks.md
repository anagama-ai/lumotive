## 1. Classification config

- [x] 1.1 Add a version-controlled configuration file assigning every collection exactly one disposition: promoted, preserved, or scrubbed
- [x] 1.2 Classify the collections that exist today: promoted are `pages`, `posts`, `media`, `globals`, `redirects`; preserved are `editors`, `users`, `forms`, `form_recipients`, `content_versions`, and every `_*` system collection; scrubbed are `form_submissions` and `users`
- [x] 1.3 Resolve the overlap 1.2 exposes: `users` is preserved on a promote and scrubbed on a refresh, so disposition is per-operation, not global. Model it so a collection cannot be promoted and preserved at once, while still allowing preserved-on-promote plus scrubbed-on-refresh
- [x] 1.4 Enforce the closed world: load both environments' collection lists and refuse to run when any collection is unclassified, naming it. No default disposition
- [x] 1.5 Add scrub semantics per collection: delete every row, or null named fields, so a collection can be emptied or anonymised

## 2. Shared foundations

- [x] 2.1 Add a client that authenticates as superuser against a named environment, reading credentials and base URL from the environment
- [x] 2.2 Ensure no credential value can reach stdout, a log line, or a report, including inside an error
- [x] 2.3 Add single-flight locking per environment, covering promote-versus-promote and promote-versus-refresh
- [x] 2.4 Add a dry-run mode that reports every intended change and writes nothing
- [x] 2.5 Add a content-fingerprint function over a record's promoted fields, stable across environments and independent of `created`/`updated`, which three promoted collections do not have

## 3. Refresh

- [x] 3.1 Create a production backup through the backup endpoint and download it
- [x] 3.2 Restore it into staging through the restore endpoint, and confirm staging serves production's content afterwards
- [x] 3.3 Assert the operation made no write to production
- [x] 3.4 Apply the scrub list immediately after restore, and verify each scrubbed collection is empty or anonymised
- [x] 3.5 Narrow the exposure window between restore and scrub as far as the endpoints allow, and record in the design what remains
- [x] 3.6 Write the manifest: a fingerprint for every promoted record, stored so a later promote and the staging UI can both read it
- [x] 3.7 Handle the editor-account consequence: after a restore, staging's editor accounts are production's. Decide and implement whether refresh reseeds a staging-only editor, and document it either way

## 4. Promote

- [x] 4.1 Preflight: verify both environments reachable, verify the classification is complete, and verify staging's schema matches production's
- [x] 4.2 Create a production backup before any write; abort without writing if it did not complete; report its key as the rollback handle
- [x] 4.3 Compare production against the manifest, and report every promoted record that changed since it and is about to be overwritten. Report and continue — never abort for divergence
- [x] 4.4 Promote media in two steps: upload each stored file to production first, then upsert the media records that reference them
- [x] 4.5 Upsert the remaining promoted collections, preserving record ids so relations keep resolving
- [x] 4.6 Never delete: a record present in production but absent from staging is left in place and reported
- [x] 4.7 Capture preserved-collection row counts and fingerprints before and after, and fail the run if any differ
- [x] 4.8 Verify promoted media references resolve to a served image after the promote
- [x] 4.9 Report a summary: created, updated, left in place, overwritten-after-divergence, and the backup key
- [x] 4.10 Prune promote-created backups on a retention policy of their own. PocketBase's `cronMaxKeep` applies only to cron-generated backups, so every promote otherwise leaves a zip on disk forever, on the same volume as the database it exists to rescue
- [x] 4.11 Name promote-created backups distinguishably from scheduled ones, so pruning one can never evict the other

## 5. Divergence banner

- [x] 5.1 Add an advisory banner to the staging editor UI when production has diverged from the manifest, naming the affected collections
- [x] 5.2 Read divergence from a staging-local record rather than querying production from the browser, so no production credential reaches the client
- [x] 5.3 Populate that record on a schedule, reusing the existing `pb_hooks` cron pattern
- [x] 5.4 Prefer anonymous reads of production where the list rule already allows it, so the common case needs no production credential at all
- [x] 5.5 Keep it advisory: it must never block editing or promoting
- [x] 5.6 Show nothing when there is no divergence

## 6. Documentation

- [x] 6.1 Document the two operations, the classification file, and the credentials each needs, in `README.md` and `.env.example`
- [x] 6.2 Document the revision workflow: refresh, review, promote, and that production stays editable throughout with overwrites reported rather than blocked
- [x] 6.3 Document recovery: the backup key for whole-database rollback, and per-record version history for a single overwritten page
- [x] 6.4 Document that once file storage moves to S3, backups no longer contain files, so the rollback handle no longer covers media

## 7. Verification

- [x] 7.1 Rehearse against two throwaway instances before any real data, and record the rehearsal as the acceptance run
- [x] 7.2 Prove an unclassified collection blocks both operations and is named
- [x] 7.3 Prove refresh leaves production unwritten, and that staging then serves production's content
- [x] 7.4 Prove every scrubbed collection is empty or anonymised on staging after a refresh
- [x] 7.5 Prove the manifest covers promoted records in `globals` and `redirects`, which carry no timestamps
- [x] 7.6 Prove a page edited on staging reaches production, and a page new on staging is created there
- [x] 7.7 Prove ids are preserved and a promoted page still resolves its promoted image
- [x] 7.8 Prove media files land before referencing records: no promoted reference 404s at any point
- [x] 7.9 Prove upsert-only: a production-only record survives a promote and is reported
- [x] 7.10 Prove preserved collections are identical across a promote, by count and fingerprint, with rows deliberately added to them first
- [x] 7.11 Prove production keeps serving during a promote by requesting a public page throughout. Proven: 40/40 visitor-rate reads returned 200 across a promote that updated a record
- [x] 7.12 Prove a failed backup aborts before the first write
- [x] 7.12a Prove promote-created backups are pruned and that pruning never removes a scheduled backup. Proven: promote backups held at 5 across repeated runs while a scheduled-style backup survived every prune
- [x] 7.13 Prove divergence is reported and the promote still succeeds: edit production after the manifest, then promote
- [x] 7.14 Prove the overwritten value is recoverable from production's version history
- [x] 7.15 Prove a second concurrent run is refused
- [x] 7.16 Prove a dry run leaves both environments unchanged, by fingerprinting everything before and after
- [x] 7.17 Prove no credential appears in the output of a successful run or a failed one
- [x] 7.18 Prove the banner appears only when production has diverged, and never blocks a save
