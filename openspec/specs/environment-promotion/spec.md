# environment-promotion

## Purpose
Define safe, observable contracts for refreshing staging from production and promoting reviewed content back to production. Protect customer and operational data while keeping production available, preserving record relationships, and reporting rather than blocking on production divergence.

## Requirements

### Requirement: Classify every collection
A version-controlled configuration SHALL assign every collection exactly one disposition: promoted, preserved, scrubbed, or derived. A derived collection is one the system itself writes as a consequence of promotion, so it is never copied between environments and is expected to gain records. Before a refresh or promote begins, the operation MUST verify every collection present in either environment is classified and MUST refuse to run if a collection is unclassified or has more than one disposition.

#### Scenario: Unclassified collection blocks an operation
- **WHEN** either environment contains a collection absent from the classification configuration
- **THEN** the operation SHALL be refused before changing either environment
- **AND** the refusal SHALL name the unclassified collection

#### Scenario: Collection has conflicting dispositions
- **WHEN** the classification configuration assigns two dispositions to one collection
- **THEN** the configuration SHALL be rejected before changing either environment
- **AND** the refusal SHALL name the collection with conflicting dispositions

### Requirement: Refresh staging from production
A refresh SHALL replace staging's data as a whole with production's current data, subject only to the required staging scrub, so that staging subsequently serves production's content. A refresh MUST NOT write to production.

#### Scenario: Refresh replaces prior staging data
- **WHEN** staging contains data that differs from production and a refresh succeeds
- **THEN** staging SHALL no longer serve its prior data
- **AND** staging SHALL serve the refreshed production content subject to the configured scrub

#### Scenario: Refresh leaves production unchanged
- **WHEN** a refresh completes
- **THEN** production SHALL have the same data as before the refresh began

### Requirement: Scrub customer data on refresh
After a refresh, collections classified as scrubbed MUST NOT retain their production values on staging. Scrubbing SHALL affect only scrubbed collections and MUST NOT alter collections classified as promoted.

#### Scenario: Scrubbed data does not remain on staging
- **WHEN** production contains customer data in a scrubbed collection and a refresh succeeds
- **THEN** that collection SHALL be empty or contain only anonymised values on staging
- **AND** its production values SHALL NOT remain accessible on staging

#### Scenario: Promoted content is not scrubbed
- **WHEN** a refresh includes records from a promoted collection
- **THEN** those records SHALL retain the values copied from production

### Requirement: Record a manifest at refresh
A successful refresh SHALL record a content fingerprint for every promoted record. These fingerprints SHALL form the baseline used by later divergence reporting and MUST cover promoted records regardless of whether their collections carry timestamps.

#### Scenario: Manifest covers all promoted records
- **WHEN** a refresh succeeds with promoted records in collections both with and without timestamps
- **THEN** the resulting manifest SHALL contain a content fingerprint for every promoted record
- **AND** no promoted record SHALL be omitted because its collection lacks timestamps

### Requirement: Promote reviewed content
A promote SHALL upsert records from every promoted collection on staging into production so that production subsequently serves the reviewed content.

#### Scenario: Staging page edit reaches production
- **WHEN** a reviewed page is edited on staging and a promote succeeds
- **THEN** production SHALL serve the page with the reviewed staging changes

#### Scenario: New staging record reaches production
- **WHEN** a promoted record exists on staging but not in production and a promote succeeds
- **THEN** production SHALL contain that record

### Requirement: Promotion preserves record identity
A promoted record MUST keep its identifier when created or updated in production so that references between promoted records continue to resolve.

#### Scenario: Referenced image remains resolvable
- **WHEN** a page and the media record it references are promoted
- **THEN** both records SHALL retain their staging identifiers in production
- **AND** the production page SHALL display the referenced image

### Requirement: Promote is upsert-only
A promote MUST NOT delete any production record. A record that exists in production but not in staging SHALL be left in place and reported as absent from staging, never removed.

#### Scenario: Production-only record is retained
- **WHEN** a promoted collection contains a record in production that is absent from staging
- **THEN** the promote SHALL leave that production record unchanged
- **AND** the promote report SHALL identify the record as absent from staging
- **AND** no production record SHALL be deleted

### Requirement: Media travels before its references
For each promoted media record, its stored file MUST be present in production before any promoted record referencing it is upserted. Promoted content MUST NOT point at a missing stored file at any point in the promote.

#### Scenario: Promoted media references resolve
- **WHEN** a promote includes media and content that references that media
- **THEN** every promoted media reference in production SHALL resolve to a served image after the promote
- **AND** each stored media file SHALL be present before its referencing content is promoted

### Requirement: Preserved collections are provably untouched
A promote MUST leave every preserved collection with the same row count and contents it had before the promote began. The operation SHALL assert this outcome rather than assume it, and any mismatch MUST cause the promote to be reported as failed.

#### Scenario: Customer and submission records remain unchanged
- **WHEN** production contains customer and submission records in preserved collections and a promote runs
- **THEN** those collections SHALL have the same row counts and contents after the promote as before it began
- **AND** the operation SHALL report a failure if its preserved-collection assertion detects any difference

### Requirement: Derived collections grow without disturbing untouched history
A derived collection records the consequences of promotion, so a promote MAY add records to it. Where the system enforces a retention limit on that history, a promote MAY also cause the oldest records beyond that limit to be removed for the content it wrote. A promote MUST NOT add to, remove from, or alter the derived history belonging to content it did not write. The operation SHALL assert this, and SHALL report how many derived records were added and how many were removed by retention, because those counts are the audit trail of what the promote changed.

#### Scenario: Version history grows as promoted records are written
- **WHEN** a promote writes promoted records that the system records version history for
- **THEN** the derived history collection MAY contain more records than before the promote began
- **AND** the promote SHALL NOT be reported as failed for that growth alone
- **AND** the promote SHALL report how many records were added

#### Scenario: Retention may trim history for written content
- **WHEN** a promote writes a record whose history already stands at the retention limit
- **THEN** the oldest history record for that content MAY be removed
- **AND** the promote SHALL NOT be reported as failed for that removal
- **AND** the resulting history for that content SHALL NOT exceed the retention limit

#### Scenario: History of untouched content is inviolate
- **WHEN** a promote runs against production containing history for content the promote does not write
- **THEN** that history SHALL be unchanged afterwards, with no record added, removed, or altered
- **AND** the operation SHALL report a failure if any of it differs

### Requirement: Production stays available during a promote
A promote SHALL operate against the live production environment without requiring production to stop. Production MUST continue serving requests throughout the promote.

#### Scenario: Public request succeeds during promotion
- **WHEN** a visitor requests a public page while a promote is in progress
- **THEN** production SHALL return a successful page response

### Requirement: Back up before the first write
A promote MUST capture a completed, restorable production backup before its first production write and SHALL report the backup identifier. If the backup does not complete, the promote MUST abort without writing to production.

#### Scenario: Backup completes before writing
- **WHEN** a promote is ready to write reviewed content to production
- **THEN** a restorable production backup SHALL complete before the first write
- **AND** the promote output SHALL report the backup identifier

#### Scenario: Backup failure prevents all writes
- **WHEN** the required production backup fails or does not complete
- **THEN** the promote SHALL fail before any production write occurs
- **AND** production data SHALL remain unchanged

### Requirement: Report divergence without blocking
A promote SHALL compare production with the refresh manifest and report every production record that changed since that manifest and is about to be overwritten. Divergence alone MUST NOT abort or prevent the promote; the reviewed staging value SHALL overwrite the divergent production value, and the overwritten value SHALL remain recoverable from production's per-record version history.

#### Scenario: Divergent production record is reported and overwritten
- **WHEN** a promoted production record was edited after the manifest and staging contains a different reviewed value for it
- **THEN** the promote SHALL report that record and the production change that is about to be overwritten
- **AND** the promote SHALL overwrite it with the reviewed staging value
- **AND** the promote SHALL succeed despite the divergence
- **AND** the overwritten production value SHALL remain recoverable from that record's version history

### Requirement: Warn on staging when production has diverged
The staging editor UI SHALL advise editors when production has changed since the refresh manifest, so a person preparing a revision knows staging is stale. This advice SHALL be advisory only and MUST NOT prevent editing on staging or promoting reviewed content.

#### Scenario: Divergence advice is shown
- **WHEN** production has diverged from the refresh manifest
- **THEN** the staging editor UI SHALL advise that production has changed since staging was refreshed
- **AND** editing and promotion SHALL remain available

#### Scenario: No divergence advice without divergence
- **WHEN** production has not diverged from the refresh manifest
- **THEN** the staging editor UI SHALL NOT show divergence advice

### Requirement: Operations are single-flight
Two promotes, or a promote and a refresh, MUST NOT run against the same environment at the same time. A second conflicting operation SHALL be refused while the first remains in progress.

#### Scenario: Second promote is refused
- **WHEN** a promote is already in progress against an environment and another promote targets that environment
- **THEN** the second promote SHALL be refused without making changes

#### Scenario: Refresh conflicts with an active promote
- **WHEN** a promote is already in progress and a refresh targets an environment involved in that promote
- **THEN** the refresh SHALL be refused without making changes

### Requirement: Dry run
A refresh or promote SHALL support a dry run that reports every change the operation would make without making any change. After a dry run, both environments MUST be byte-for-byte unchanged.

#### Scenario: Dry run reports without changing data
- **WHEN** a refresh or promote is executed as a dry run
- **THEN** its report SHALL identify every change the corresponding operation would make
- **AND** staging SHALL be byte-for-byte unchanged
- **AND** production SHALL be byte-for-byte unchanged

### Requirement: Credentials never leak
Credentials for either environment MUST NOT appear in operation output, logs, or reports, including when an operation fails.

#### Scenario: Failed operation does not disclose credentials
- **WHEN** a refresh or promote fails while using credentials for either environment
- **THEN** its output, logs, and reports SHALL contain no credential value
