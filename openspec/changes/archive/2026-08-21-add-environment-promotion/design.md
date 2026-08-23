## Context

See [proposal.md — Why](./proposal.md#why) for the motivation.

PocketBase v0.39.11 stores every application, authentication, and system collection in one SQLite database at `pb_data/data.db`. The same database therefore contains revision content, editor accounts, form data, and the `users` collection reserved for future customers. Media file bytes are separate under `pb_data/storage/`, while media records and their relations remain in SQLite.

PocketBase exposes superuser-only HTTP endpoints that create, list, restore, and delete whole-instance backups. Its record API accepts an explicit id on create and runs the normal validation and hooks. In this repository, record updates create `content_versions` entries through a hook. Only `pages`, `posts`, `media`, and `users` have both `created` and `updated` fields; `globals`, `redirects`, and `editors` have neither. In particular, `globals` contains the header, footer, SEO, and code-injection settings that an urgent production edit may change.

## Goals / Non-Goals

**Goals**

- Refresh staging from a whole production backup, scrub customer data before declaring staging ready, and record a stable baseline for the review.
- Promote only explicitly classified content into production by id-preserving, upsert-only writes while production remains live.
- Keep preserved collections unchanged and verify that outcome instead of trusting the write list.
- Report every promoted production record that diverged from the refresh baseline, without blocking an urgent release.
- Transfer media bytes before publishing records that reference them.
- Produce explicit backup, divergence, preservation, and completion reports that an operator can use for recovery.

**Non-goals**

- Swapping database files, deleting production records, or reconciling staging deletions into production.
- Dokploy, containers, systemd, reverse-proxy configuration, or other hosting topology.
- The merge-triggered automation that will eventually invoke promotion.
- Commerce collections or commerce-specific retention policy.
- Keeping staging continuously synchronized with production during a review.
- Making production read-only while a revision is reviewed or promoted.

## Decisions

### D1. Upsert rows into production's live database instead of swapping a file or database

Promote SHALL create or update only records in collections classified as promoted. It SHALL write to production's running PocketBase instance, SHALL NOT delete records, and SHALL leave production serving throughout the operation.

**Rationale:** PocketBase puts all collections in one SQLite file. A database-level replacement cannot select pages and media while retaining form submissions, customer records, and future orders accumulated during the review. Row-level upserts are therefore the boundary that makes content movement independent of preserved production activity.

**Rejected alternatives:** Swapping staging's `pb_data` directory or `data.db` into production was rejected because it replaces every collection and the file store as one unit. Restoring a staging backup over production was rejected for the same reason: PocketBase restore is whole-instance restore, so it would discard everything production accumulated after refresh, including orders in a store. Temporarily stopping production does not make either replacement selective and was also rejected.

### D2. Preserve record ids when creating records

A record created by promote SHALL use the staging record's PocketBase id. Updates SHALL target that same id.

**Rationale:** Stable ids are the join keys for relations between promoted records. Explicit ids let a selectively promoted page, global, post, or editor continue to refer to the corresponding media and related content without rewriting the object graph. PocketBase v0.39.11 accepts an explicit id on create, so no surrogate mapping is needed.

**Rejected alternatives:** Letting production assign new ids and maintaining an old-to-new id map was rejected because every relation-bearing field would then need schema-aware rewriting, including nested content. Copying records under new ids without rewriting relations was rejected because relations would dangle and media references would resolve to missing or wrong records.

### D3. Write records and media through PocketBase's REST API instead of SQLite

Promote SHALL use authenticated PocketBase record endpoints for creates and updates, including multipart file writes for media. It SHALL NOT issue SQL against `data.db`.

**Rationale:** The REST API applies PocketBase validation, relation handling, file-storage behavior, and repository hooks. Direct SQL could create a media row without placing its file in storage and would bypass application invariants. REST updates also trigger the existing versioning hook, so overwritten records receive production `content_versions` entries. That version history gives an operator a per-record rollback path for an urgent production fix overwritten by promote.

**Rejected alternatives:** Direct SQLite writes were rejected because they bypass validation and hooks, couple the tool to PocketBase's internal schema, and cannot correctly complete file-storage operations by themselves. Copying only media files beside direct row inserts was rejected because it reimplements PocketBase's file naming and lifecycle rules and still skips hooks. A separate custom write endpoint was rejected because the existing authenticated REST API already owns these invariants.

### D4. Classify every collection in a version-controlled repository file

One repository file SHALL assign every collection reported by PocketBase to exactly one disposition: promoted, preserved, or scrubbed. Refresh and promote SHALL perform a closed-world check before mutation: an unclassified live collection, a duplicate classification, or a configured collection that no longer exists SHALL refuse the run.

**Rationale:** The classification is data-loss policy. Keeping it in the repository makes changes reviewable with code and binds a revision to the policy under which it moves. Requiring an exact match against the live collection inventory makes a newly added collection visible before any data movement occurs.

**Rejected alternatives:** Storing dispositions in PocketBase settings was rejected because restoring one environment over another could replace the policy being used and because policy changes would not receive normal code review. A default `preserved` disposition was rejected because a new content collection would be silently skipped. A default `promoted` disposition was rejected because a new customer or order collection would be silently overwritten. Both defaults fail invisibly, which is more dangerous than refusing an incomplete classification.

### D5. Measure divergence with a manifest of content hashes instead of timestamps

A successful refresh SHALL persist a manifest keyed by collection and record id for every promoted record. Each entry SHALL hash a canonical representation of user-controlled record content; transport metadata and server-maintained autodate fields SHALL be excluded, while media entries SHALL include the stored file content digest. Promote SHALL compare the current production representation with that baseline before overwriting a target record and SHALL report missing or changed baselines as divergence. The manifest SHALL be replaced only after restore and scrub have completed successfully.

**Rationale:** Hashes compare the content that promotion can overwrite and work uniformly for every promoted collection. `globals`, `redirects`, and `editors` have no `created` or `updated` fields. A timestamp strategy would therefore make `globals`—including header, footer, SEO, and code injection—completely invisible even though it is a likely location for an urgent production fix.

**Rejected alternatives:** Comparing `updated` timestamps was rejected because several promoted collections have no such field and timestamps describe write time rather than content identity. Adding autodate fields to those collections by migration was rejected as an unnecessary schema change once a manifest provides a uniform comparison, though it remains the viable alternative if the product later requires independently queryable modification times. Comparing staging and production only at promote time was rejected because it cannot distinguish review edits from production divergence since refresh.

### D6. Report divergence and continue instead of blocking promotion

Divergence SHALL be included in the promote report and SHALL NOT abort, pause, or require production to match the manifest. The report SHALL identify each overwritten divergent record by collection and id and SHALL include enough before/after hashes to correlate it with version history.

**Rationale:** Production must remain editable during a review because urgent fixes cannot wait for a revision. The existing versioning hook records the production value before an update, making an overwritten content fix recoverable per record. That recovery path makes overwrite-with-reporting an explicit, supportable trade rather than a silent loss.

**Rejected alternatives:** Refusing promotion when production differs from the manifest was rejected because it turns any urgent fix into a release blocker. Automatically merging two changed records was rejected because collection fields and nested content have no general conflict-free merge rule. Silently taking staging was rejected because the operator would not know which urgent fixes require recovery.

### D7. Materialize media files before writing records that reference them

Promote SHALL complete each media record and its file transfer through PocketBase before upserting any promoted record that references that media id. Media failures SHALL prevent dependent records from being written and SHALL be reported.

**Rationale:** Preserved ids make a relation resolvable only after the target record and stored file both exist. File-first dependency ordering prevents a newly promoted page or global from becoming publicly visible with a relation whose URL points at absent bytes.

**Rejected alternatives:** Writing pages, posts, or globals before media was rejected because it creates a live interval with broken images and can leave that state permanently if the later file transfer fails. Creating a media row first and copying its bytes out of band later was rejected because the row can be readable while its file is missing. Ignoring media failures and continuing was rejected because it converts a bounded transfer error into published broken content.

### D8. Create a PocketBase backup before the first production write and report its key

Promote SHALL call production's PocketBase backup endpoint after all preflight checks and before its first record or file write. A failed backup SHALL refuse promotion. The final and partial-failure reports SHALL include the backup key as the full-instance rollback handle.

**Rationale:** The backup is the last complete production state before any multi-record operation begins. Using PocketBase's endpoint keeps the database and current local file storage in the format PocketBase itself restores and avoids a live filesystem copy of SQLite.

**Rejected alternatives:** Taking no backup and relying only on version history was rejected because not every file operation or newly created record has a convenient per-record reversal. Copying `pb_data` while PocketBase is live was rejected because application-level backup already provides the supported consistency boundary. Taking the backup after writes start was rejected because it would not represent a known pre-promotion state.

Once file storage moves to S3, a PocketBase backup will no longer contain the media bytes. At that point this rollback design MUST be revised to pair the database backup with bucket versioning or a storage snapshot; the reported PocketBase key alone will no longer restore the whole promoted state.

### D9. Assert preserved collections are unchanged after promotion

Immediately before the first production write, promote SHALL snapshot every preserved collection as a count plus canonical content hashes keyed by record id. After all promoted writes finish, it SHALL read those collections again and compare both counts and contents. Any difference SHALL mark the promote as failed integrity verification and SHALL be included in the report; it SHALL NOT be dismissed merely because no preserved collection appeared in the intended write list.

**Rationale:** The assertion tests the safety property that matters rather than trusting implementation intent. It catches an incorrect classification lookup, a broad request, or an accidental write path that unit-level reasoning about the promote list could miss.

**Rejected alternatives:** Trusting the configured promote list was rejected because a bug can ignore or misapply that list. Comparing counts alone was rejected because an update can corrupt a row without changing cardinality, and a delete plus create can preserve the count. Sampling preserved rows was rejected because the one unsampled row can be the order or customer record that matters.

Production remains live, so a legitimate concurrent write to a preserved collection can also make this assertion fail. That is an intentional conservative failure signal: the report distinguishes observed preserved-state change from proof that promote caused it, and no automatic rollback or deletion follows from the assertion alone.

### D10. Use an atomic same-host lock and treat topology-wide single flight as advisory

Refresh and promote SHALL contend on one lock per production/staging environment pair. The tool SHALL acquire it with an exclusive-create filesystem operation, write diagnostic operation and owner metadata, and release it in a `finally` path. The create itself, not a prior existence check, SHALL decide the winner.

**Rationale:** Exclusive creation is atomic for callers sharing the same local filesystem, needs no schema change, and prevents a refresh and promote—or two promotes—from interleaving when invoked from the intended single operation host. Owner metadata makes a crash-left lock diagnosable without pretending that metadata provides synchronization.

**Rejected alternatives:** A check-then-create lock file was rejected because two callers can both pass the check. An in-memory mutex was rejected because separate processes do not share it and a restart loses it. A PocketBase lock record or new lock collection was rejected because the change requires no schema addition and a record-level check-then-write would still need an atomic uniqueness mechanism.

The guarantee is atomic only on one shared filesystem. Two independent hosts can each acquire their own lock and run concurrently, so single flight across hosts is advisory in this change. If invocation later moves to multiple automation hosts, it MUST gain one shared atomic coordinator—such as a database uniqueness constraint or deployment-platform concurrency control—before claiming a distributed guarantee.

### D11. Restore the whole production backup to staging and then scrub customer data

Refresh SHALL use PocketBase's backup and restore HTTP endpoints to replace staging with the complete production backup. It SHALL then delete every collection classified as scrubbed, verify that those collections contain no retained customer records, and only then write the manifest and report staging ready.

**Rationale:** PocketBase restore operates on a whole backup; it has no selective-collection restore mode. Restoring first preserves the exact relation graph and file storage needed for a realistic review. Scrubbing immediately afterwards is the explicit privacy boundary for data that must not remain on the less-guarded staging environment.

**Rejected alternatives:** A selective PocketBase restore was rejected because the endpoint does not provide one. Unpacking the backup and editing SQLite before restore was rejected because it bypasses PocketBase, couples the tool to backup internals, and must also reconcile file storage. Exporting and recreating only selected records through REST was rejected because it is no longer a restore, is slower and more failure-prone for the complete relation graph, and would need separate handling for every system dependency.

There is an unavoidable exposure window from completion of the whole restore until scrub verification succeeds. During that interval, customer data exists at rest on staging and may be reachable under staging's existing network controls. Refresh SHALL remain failed/not-ready until verification passes, but isolation of the staging host during that window belongs to deployment operations and is outside this change.

## Risks / Trade-offs

### R1. An urgent production fix can be overwritten

A production editor may change a record after refresh, and promote deliberately overwrites that divergence. The manifest report identifies the affected collection and id, while the production version entry provides the targeted recovery path. If the hook or report is unavailable, recovery falls back to the pre-write backup with a much larger blast radius.

### R2. A failed scrub can leave customer data on staging

The whole production database reaches staging before scrub runs. A crash, permission failure, incomplete classification, or failed deletion can leave form submissions, users, or future customer records there. The operation never records a fresh manifest or declares staging ready until scrub verification passes, but an operator must still isolate or reset the staging instance because readiness state does not erase exposed data.

### R3. Staging editor changes can become production editor accounts

Refresh seeds staging with the production-derived editor set. An editor created or changed on staging during the review is then part of the promoted editor state and can become a production editor account on promote, including its access implications. Classification review, divergence reporting, and the promote report make the change visible; they do not replace deliberate editor-account review.

### R4. An interrupted promote leaves a partially promoted revision

REST upserts and media transfers span multiple requests and are not one SQLite transaction. A process or network failure can therefore leave early records updated while later records remain old. Id-preserving upserts make a retry converge, the report identifies the last completed work, and the pre-write backup plus version history provide rollback options, but visitors may observe the mixed state until retry or recovery completes.

### R5. A long review makes the manifest increasingly stale

When a revision runs for weeks, production may accumulate many legitimate changes. Hash comparison still detects them, but the divergence report grows and promote still overwrites target records. Operators must review the report and recover or reapply urgent fixes; the manifest is evidence, not a freshness guarantee or merge engine.

### R6. Whole-database refresh cost grows with the site

Backup creation, transfer, restore, file extraction, scrub, and hash generation scale with the complete database and local media store, including preserved data that staging later deletes. As orders and media grow, refresh becomes slower and the customer-data exposure window becomes longer. A future selective export or storage-native snapshot design may be justified once measured refresh time or backup size breaches an operational limit.

### R7. Preserved-state verification can fail on legitimate live traffic

A form submission or future order created while promote runs changes a preserved collection between snapshots. The assertion correctly reports that preserved state changed but cannot attribute the writer, so it can fail integrity verification even when promote never addressed that collection. This favors detection over a false claim of proof; investigation uses the report, and the tool never rolls back a legitimate live write automatically.

## Migration Plan

There is no PocketBase schema change and no data backfill.

1. Before the first real refresh or promote, the repository SHALL contain the reviewed classification file covering all 16 current collections exactly once. The operation host SHALL have distinct staging and production base URLs, superuser credentials for the required backup and record endpoints, a persistent writable state location for the manifest and same-host lock, and access to media bytes through PocketBase's API. Preflight SHALL prove the live collection inventory matches the classification and that the source and destination are not the same instance.
2. Rehearse the first promotion against disposable infrastructure. Create a production backup, restore it into a disposable production target, run refresh into a disposable staging target, make representative edits including a media replacement and a production-side divergent `globals` edit, then promote. Verify preserved counts and hashes, media availability, id stability, divergence reporting, version entries, interrupted-run retry, and restoration of the reported backup into another disposable target. No rehearsal step writes to real production.
3. Run the first real refresh in an attended window. Preserve a pre-refresh staging backup if the current staging state must be recoverable. If restore or scrub fails, production is unchanged; rollback means isolating staging and either restoring that staging backup or repeating refresh from a fresh production backup until scrub verification succeeds. A failed refresh SHALL NOT replace the last successful manifest.
4. Run the first real promote only after reviewing its preflight inventory and planned record set. Before the first write, cancellation means no production rollback is needed. The mandatory PocketBase backup is then the pre-promotion full-instance handle.
5. If promote fails after writes begin, first choose targeted recovery from production version history for overwritten records or rerun the id-preserving upserts to complete the same revision. Full backup restore is emergency recovery: because it also rewinds preserved collections, the operator must first account for and replay any orders, submissions, or other live writes created after the backup. With current local storage the backup covers media; after an S3 move, database restore must be paired with the separate object-storage recovery mechanism described in D8.
6. Rolling back this change's code or configuration requires no down migration. Disable its invocation and revert the repository files. Generated manifests and reports may be retained as audit evidence; removing them changes no PocketBase data.

## Open Questions

None. The data boundary, dispositions, live-write behavior, manifest baseline, divergence policy, media ordering, backup point, preserved-state verification, lock guarantee, scrub sequence, and deployment exclusions are settled sufficiently for implementation. Future S3 rollback and multi-host coordination are explicit change triggers, not unresolved choices in this scope.
