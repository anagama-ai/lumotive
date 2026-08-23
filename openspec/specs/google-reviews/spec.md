# google-reviews

## Purpose
Provide editors with a non-blocking way to import Google reviews from a configured business source and publish a safe, filtered public payload. Preserve review identity across imports while making import availability, progress, and outcomes explicit.

## Requirements

### Requirement: Configure the review source
The editor UI SHALL require an editor to supply exactly one business lookup identifier—Place ID, CID, or business keyword—together with a location coordinate. The configuration SHALL be rejected when the chosen identifier is absent, when more than one identifier is supplied, or when the location coordinate is absent. A complete source configuration MUST exist before an import can be requested.

#### Scenario: Save a complete source configuration
- **WHEN** an editor supplies one business lookup identifier and a location coordinate
- **THEN** the source configuration SHALL be saved

#### Scenario: Chosen identifier is absent
- **WHEN** an editor chooses a business lookup identifier type but supplies no value for it
- **THEN** the source configuration SHALL be rejected with a reason identifying the missing value

#### Scenario: More than one identifier is supplied
- **WHEN** an editor supplies values for more than one business lookup identifier
- **THEN** the source configuration SHALL be rejected with a reason stating that exactly one identifier is required

#### Scenario: Location coordinate is absent
- **WHEN** an editor supplies one business lookup identifier without a location coordinate
- **THEN** the source configuration SHALL be rejected with a reason identifying the missing coordinate

#### Scenario: Import is requested before configuration
- **WHEN** an editor requests an import without a complete source configuration
- **THEN** the request SHALL be refused with a reason
- **AND** no external import task SHALL be started

### Requirement: Request an import
Requesting an import SHALL start an external task, record the import as pending, and return before waiting for the third-party result. The editor SHALL be told that the import is under way. An incremental import SHALL be the default because a full import costs materially more, and a full import MUST require a deliberate, clearly labelled choice.

#### Scenario: Request the default incremental import
- **WHEN** an editor requests an import without deliberately choosing a full import
- **THEN** an incremental external task SHALL be started
- **AND** a pending import SHALL be recorded before the request returns
- **AND** the editor SHALL be told that the import is under way

#### Scenario: Request a full import
- **WHEN** an editor deliberately chooses the clearly labelled full-import option and requests an import
- **THEN** a full external task SHALL be started
- **AND** a pending import SHALL be recorded before the request returns

#### Scenario: Request returns before collection
- **WHEN** an external task has been accepted but its result is not yet available
- **THEN** the import request SHALL return without waiting for that result
- **AND** the pending import SHALL remain available for scheduled collection

### Requirement: Only one import in flight
The system MUST permit at most one pending import at a time. A request made while an import is pending SHALL be refused with a reason and MUST NOT start another external task.

#### Scenario: Request while an import is pending
- **WHEN** an editor requests an import while another import is pending
- **THEN** the request SHALL be refused with a reason stating that an import is already under way
- **AND** no second external task SHALL be started
- **AND** the existing pending import SHALL remain unchanged

### Requirement: Collect a finished import
A scheduled collection step SHALL find a pending import and check its external result. When the result is ready, collection SHALL store its reviews and complete the pending import. When the result is not ready, collection SHALL leave the pending import intact for a later attempt. Collection MUST be idempotent so that collecting the same finished task more than once does not duplicate reviews.

#### Scenario: Finished result is ready
- **WHEN** scheduled collection finds a pending import whose result is ready
- **THEN** the returned reviews SHALL be stored
- **AND** the import SHALL no longer be pending

#### Scenario: Result is not ready
- **WHEN** scheduled collection finds a pending import whose result is not ready
- **THEN** no reviews SHALL be stored from that unfinished result
- **AND** the import SHALL remain pending for a later collection attempt

#### Scenario: Finished task is collected twice
- **WHEN** scheduled collection processes the same finished external task more than once
- **THEN** the later collection SHALL create no duplicate reviews
- **AND** the stored review count SHALL be the same as after the first collection

### Requirement: Deduplicate by review identity
Each imported review SHALL be matched by its Google review identity. A matching stored review SHALL be updated in place, a previously unseen review SHALL be created, and an import MUST NOT delete any stored review.

#### Scenario: Import a previously stored review
- **WHEN** an import contains a review whose Google review identity is already stored
- **THEN** the stored review SHALL be updated in place
- **AND** no second review with that identity SHALL be created

#### Scenario: Import a previously unseen review
- **WHEN** an import contains a review whose Google review identity is not stored
- **THEN** one stored review with that identity SHALL be created

#### Scenario: Re-import identical data
- **WHEN** the same imported review data is collected again
- **THEN** the stored review count SHALL change by zero

#### Scenario: Import omits a stored review
- **WHEN** an import result does not contain a review that is already stored
- **THEN** the omitted stored review SHALL remain stored

### Requirement: Incremental import stops at known reviews
An incremental import SHALL request progressively deeper review pages and SHALL stop once it reaches a review whose Google review identity is already stored. A full import SHALL request all available reviews regardless of whether it encounters a stored review.

#### Scenario: Incremental import reaches a known review
- **WHEN** an incremental import encounters a review whose Google review identity is already stored
- **THEN** it SHALL stop requesting deeper review pages

#### Scenario: Incremental import has not reached a known review
- **WHEN** an incremental import completes its current page without encountering a stored review and more reviews are available
- **THEN** it SHALL request a deeper review page

#### Scenario: Full import encounters a known review
- **WHEN** a full import encounters a review whose Google review identity is already stored
- **THEN** it SHALL continue requesting the remaining available reviews

### Requirement: Record import outcome
The editor UI SHALL show when the latest import attempt ran and whether it is pending, succeeded, or failed. A failed attempt MUST record an explicit failure and a reason, and that state MUST be distinguishable from a source for which no import has ever run.

#### Scenario: Latest import succeeds
- **WHEN** a pending import is collected successfully
- **THEN** the editor SHALL see that the latest import succeeded
- **AND** the editor SHALL see when that attempt ran

#### Scenario: Latest import fails
- **WHEN** an import request or collection attempt fails
- **THEN** the editor SHALL see an explicit failed state
- **AND** the editor SHALL see a reason for the failure and when the attempt ran

#### Scenario: Import has never run
- **WHEN** an editor views a configured review source for which no import has ever been requested
- **THEN** the editor SHALL see a never-run state
- **AND** the state SHALL NOT be presented as a failure

### Requirement: Remain dormant without credentials
When the external service credentials are not configured, the feature SHALL report itself unavailable and SHALL refuse import requests instead of attempting an import that fails obscurely. Credentials MUST NOT appear in any editor-facing message or public response.

#### Scenario: Credentials are not configured
- **WHEN** an editor views or requests importing while the external service credentials are absent
- **THEN** the feature SHALL report that importing is unavailable
- **AND** no external import task SHALL be started

#### Scenario: An import error occurs with credentials configured
- **WHEN** an import fails while external service credentials are configured
- **THEN** the editor-facing failure reason SHALL NOT contain either credential
- **AND** no public response SHALL contain either credential

### Requirement: Restrict importing to editors
Requesting an import MUST require an authenticated editor because the action spends money against an external account. An anonymous request SHALL be rejected and MUST NOT start an external task.

#### Scenario: Anonymous requester attempts an import
- **WHEN** an anonymous requester attempts to start an import
- **THEN** the request SHALL be rejected
- **AND** no external import task SHALL be started

#### Scenario: Authenticated editor requests an import
- **WHEN** an authenticated editor with complete configuration and available credentials requests an import while none is pending
- **THEN** the import request SHALL be accepted

### Requirement: Publish display-worthy reviews
The public payload SHALL contain only reviews whose numeric rating is at least 4 and whose review text remains non-empty after trimming whitespace. Its average rating SHALL be the arithmetic mean of every stored review carrying a numeric rating, including reviews excluded from the public list, and SHALL be null when no stored review carries a numeric rating. The public payload MUST exclude import bookkeeping and raw third-party payloads.

#### Scenario: Review meets the publication rule
- **WHEN** the public payload is requested with a stored review rated at least 4 and containing non-empty review text
- **THEN** that review SHALL be included in the published reviews

#### Scenario: Review rating is too low
- **WHEN** the public payload is requested with a stored review rated below 4
- **THEN** that review SHALL be excluded from the published reviews

#### Scenario: Review text is empty after trimming
- **WHEN** the public payload is requested with a stored review whose review text contains only whitespace
- **THEN** that review SHALL be excluded from the published reviews

#### Scenario: Average includes an unpublished review
- **WHEN** a stored review has a numeric rating but is excluded from the published reviews
- **THEN** its rating SHALL still contribute to the published average rating

#### Scenario: No review has a numeric rating
- **WHEN** the public payload is requested and no stored review carries a numeric rating
- **THEN** the published average rating SHALL be null

#### Scenario: Public payload excludes private import data
- **WHEN** the public payload is requested after an import
- **THEN** it SHALL NOT contain import bookkeeping
- **AND** it SHALL NOT contain any raw third-party payload

### Requirement: Treat imported content as untrusted
Reviewer names, review text, and every URL received from the third party MUST be treated as untrusted input at the trust boundary. A URL SHALL be published or used by the public site only when it is a well-formed absolute HTTP or HTTPS URL; any other value SHALL be omitted and MUST NOT be rendered as a link or fetched as an image. Imported names and review text SHALL be rendered as plain text and MUST NOT be interpreted as markup by the public site.

#### Scenario: Imported URL is not a valid absolute HTTP or HTTPS URL
- **WHEN** an imported review contains a URL that is not a well-formed absolute HTTP or HTTPS URL
- **THEN** that URL SHALL be omitted from the public payload
- **AND** the public site SHALL NOT render it as a link or fetch it as an image

#### Scenario: Imported text contains markup
- **WHEN** an imported reviewer name or review text contains markup-like content
- **THEN** the public site SHALL render that content as plain text
- **AND** the content SHALL NOT create markup or execute code
