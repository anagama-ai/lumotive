## Purpose

This capability preserves recoverable page and post history so editors can inspect prior states, restore content safely, and undo mistaken changes without exposing history to visitors.

## Requirements

### Requirement: Snapshot on save
Each successful save of an existing page or post SHALL create exactly one snapshot containing the record state that existed immediately before the save.

#### Scenario: Save an existing record
- **WHEN** an editor successfully saves an existing page or post
- **THEN** exactly one snapshot SHALL contain the record state from immediately before that save

### Requirement: Snapshot history listing
The editor UI SHALL list a page's or post's snapshots in newest-first order, and each entry SHALL show when the snapshot was created and which editor created it.

#### Scenario: View snapshot history
- **WHEN** an editor opens the snapshot history for a page or post with multiple snapshots
- **THEN** the snapshots SHALL appear newest first
- **AND** each snapshot SHALL show its creation time and the editor who created it

### Requirement: Restore snapshot content
An editor who is permitted to save a page or post SHALL be able to restore any retained snapshot, and a successful restore SHALL replace the current editor-controlled content with the content stored in that snapshot.

#### Scenario: Restore a retained snapshot
- **WHEN** an editor restores a retained snapshot for a page or post they are permitted to save
- **THEN** the current editor-controlled content SHALL match the content stored in that snapshot

### Requirement: Preserve pre-restore state
Each successful snapshot restore SHALL create exactly one snapshot of the page's or post's state immediately before the restore is applied, allowing that restore to be undone without losing the replaced state.

#### Scenario: Undo remains possible after restore
- **WHEN** an editor successfully restores a snapshot
- **THEN** exactly one new snapshot SHALL contain the record state from immediately before the restore
- **AND** that new snapshot SHALL be available for a later restore

### Requirement: Per-record retention limit
Snapshot retention SHALL be limited to the 50 newest snapshots for each page or post. When creation of a snapshot would exceed that limit, the oldest snapshot for that record SHALL be discarded.

#### Scenario: Create a fifty-first snapshot
- **WHEN** a page or post already has 50 snapshots and a new snapshot is created
- **THEN** the new snapshot SHALL be retained
- **AND** the oldest snapshot for that record SHALL be discarded
- **AND** exactly 50 snapshots SHALL remain for that record

### Requirement: Delete history with its record
Deleting a page or post SHALL delete every snapshot belonging to that record.

#### Scenario: Delete a versioned record
- **WHEN** an editor deletes a page or post that has snapshots
- **THEN** all snapshots belonging to the deleted record SHALL be deleted

### Requirement: Restrict snapshot access
Snapshots MUST NOT be readable by visitors, whether requested individually or as a list.

#### Scenario: Visitor requests snapshot history
- **WHEN** a visitor requests a page's or post's snapshot list or an individual snapshot
- **THEN** access SHALL be denied without returning snapshot content or metadata

### Requirement: Deterministic unchanged saves
A successful save of an existing page or post SHALL create exactly one snapshot even when the submitted editor-visible state is identical to the current state.

#### Scenario: Save without observable changes
- **WHEN** an editor successfully saves an existing page or post without changing any editor-visible state
- **THEN** exactly one snapshot SHALL be created containing the unchanged pre-save state
