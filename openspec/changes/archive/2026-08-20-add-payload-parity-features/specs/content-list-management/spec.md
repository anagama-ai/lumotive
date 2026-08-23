## Purpose

This capability gives editors predictable control over page and post lists, including ordering, multi-selection, and permission-safe bulk status changes.

## ADDED Requirements

### Requirement: Sort content lists
The editor UI SHALL allow an editor to sort page and post lists by title, status, or last-modified time in ascending or descending order. The chosen field and direction SHALL remain active while the editor navigates within that list screen.

#### Scenario: Sort a content list
- **WHEN** an editor chooses a supported sort field and direction on a page or post list
- **THEN** the records SHALL appear in that order

#### Scenario: Retain the chosen sort
- **WHEN** an editor chooses a sort and then navigates within the same list screen
- **THEN** the chosen sort field and direction SHALL remain active

### Requirement: Select multiple records
The editor UI SHALL allow an editor to select multiple records, select all records shown in the current page or post list, and clear the selection.

#### Scenario: Select records individually
- **WHEN** an editor selects multiple records
- **THEN** every chosen record SHALL remain selected for a bulk action

#### Scenario: Select all records
- **WHEN** an editor invokes select-all
- **THEN** every record shown in the current list SHALL be selected

#### Scenario: Clear the selection
- **WHEN** an editor clears the selection
- **THEN** no record SHALL remain selected

### Requirement: Change status in bulk
An editor SHALL be able to publish or unpublish every selected record in one action. The outcome SHALL state how many records changed and, if any record fails, SHALL report the result for each selected record so the editor can determine its true status.

#### Scenario: Complete a bulk status change
- **WHEN** an authorized editor publishes or unpublishes selected records and every change succeeds
- **THEN** every selected record SHALL have the requested status
- **AND** the editor SHALL be told how many records changed

#### Scenario: Reject a forbidden bulk status change
- **WHEN** an editor whose role does not permit the requested publish or unpublish action attempts it in bulk
- **THEN** the action SHALL be rejected before any selected record changes
- **AND** no selected record SHALL be partially updated

#### Scenario: Invoke a bulk action with no selection
- **WHEN** an editor invokes a bulk action with no records selected
- **THEN** no record SHALL change
- **AND** the editor SHALL be told that no records were selected

#### Scenario: Report a partial failure
- **WHEN** a bulk status action fails after one or more selected records have been processed
- **THEN** the editor SHALL receive a per-record result for every selected record
- **AND** the reported changed count SHALL match the records that actually changed
