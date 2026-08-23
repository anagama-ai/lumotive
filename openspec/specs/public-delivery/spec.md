# public-delivery

## Purpose
Define the public behaviour for resolving redirects without disturbing valid content or the protected editor surface. Define a bounded public post list that exposes only published posts in a stable, newest-first order.

## Requirements

### Requirement: Redirect a request that would otherwise be not-found
A public retrieval request that would otherwise receive a not-found response SHALL be redirected when its path matches an active redirect with a usable destination. The response SHALL be a permanent redirect carrying the configured destination.

#### Scenario: Resolve an active public redirect
- **WHEN** a public retrieval request would otherwise be not-found and matches an active redirect with a usable destination
- **THEN** the response SHALL be a permanent redirect carrying that destination

### Requirement: Only unmatched requests are redirected
Redirect resolution SHALL apply only when the request would otherwise be not-found. An existing page MUST NOT be intercepted by a redirect row whose source matches that page.

#### Scenario: Existing page wins over a redirect row
- **WHEN** a visitor requests an existing page whose path also matches a redirect row
- **THEN** the existing page SHALL be returned
- **AND** the redirect row SHALL have no effect on the response

### Requirement: Only safe read methods are redirected
Redirect resolution SHALL apply only to safe retrieval requests. A request using any non-retrieval method MUST NOT be redirected, even when its path matches an active redirect.

#### Scenario: Non-retrieval request matches a redirect
- **WHEN** a visitor makes a non-retrieval request whose path matches an active redirect
- **THEN** the request SHALL NOT receive a redirect response
- **AND** normal response handling for that method SHALL continue

### Requirement: Path forms are matched tolerantly
A stored redirect source SHALL match the requested path whether either form includes or omits a leading slash or a trailing slash. An editor MAY therefore enter the source path with either slash form without changing its public effect.

#### Scenario: Stored and requested slash forms differ
- **WHEN** a public retrieval request would otherwise be not-found and an active redirect source differs from the requested path only by leading or trailing slashes
- **THEN** the response SHALL be a permanent redirect carrying the configured destination

### Requirement: Only active redirects apply
Only a redirect marked active SHALL affect a public request. A matching inactive redirect MUST leave the request not-found.

#### Scenario: Matching redirect is inactive
- **WHEN** a public retrieval request would otherwise be not-found and matches only an inactive redirect
- **THEN** the response SHALL remain not-found
- **AND** no redirect SHALL occur

### Requirement: A non-match preserves the original response
When no active redirect matches a request that would otherwise be not-found, the original not-found response SHALL be returned unaltered.

#### Scenario: No redirect matches
- **WHEN** a request produces a not-found response and no active redirect matches its path
- **THEN** the visitor SHALL receive the original not-found response unaltered

### Requirement: A redirect cannot capture the editor UI
Redirect resolution MUST NOT apply to editor UI paths, regardless of whether a redirect row matches. This exclusion is a privilege boundary, not a convenience: redirect data MUST NOT shadow, capture, or hijack the editor surface. The exclusion MUST be insensitive to letter case, so a case variant of an editor path cannot slip past it.

#### Scenario: Redirect row matches an editor UI path
- **WHEN** a redirect row has a source that matches an editor UI path
- **THEN** the redirect row SHALL have no effect on requests to that path
- **AND** the editor UI SHALL retain control of the response

#### Scenario: A case variant of an editor path is still excluded
- **WHEN** a redirect row's source differs from an editor UI path only in letter case
- **THEN** the redirect row SHALL have no effect on requests to that variant
- **AND** the response SHALL NOT be a redirect to the row's destination

#### Scenario: A path merely beginning with the same letters still redirects
- **WHEN** a redirect row's source begins with the same letters as the editor surface but is not an editor UI path
- **THEN** the redirect SHALL apply normally

### Requirement: An empty destination is not a redirect
A matching redirect row without a usable destination MUST NOT produce a redirect. The request SHALL retain the not-found response it would otherwise receive.

#### Scenario: Matching row has no usable destination
- **WHEN** a public retrieval request would otherwise be not-found and matches a row with no usable destination
- **THEN** the response SHALL remain not-found
- **AND** no redirect SHALL occur

### Requirement: Public post list ordering
The public post list SHALL order posts by publication date from newest to oldest.

#### Scenario: Posts have different publication dates
- **WHEN** a visitor views a public post list containing published posts with different publication dates
- **THEN** the posts SHALL appear from newest to oldest by publication date

### Requirement: Only published posts are listed
The public post list SHALL include published posts only. A draft post MUST NOT appear in the list.

#### Scenario: Published and draft posts exist
- **WHEN** a visitor views the public post list while both published and draft posts exist
- **THEN** published posts SHALL be eligible to appear
- **AND** draft posts SHALL NOT appear

### Requirement: The list is paginated and bounded
The public post list SHALL return a bounded number of posts per page and MUST NOT grow with the total number of posts. The work required to serve one page MUST remain bounded independently of the total number of posts.

#### Scenario: Request a later page from a large post collection
- **WHEN** a visitor requests a later page from a collection containing more posts than fit on one page
- **THEN** the response SHALL contain only the bounded subset assigned to that page
- **AND** increasing the total number of posts SHALL NOT increase the maximum number returned or the work required to serve one page

### Requirement: A hostile page parameter is bounded
A non-numeric, negative, zero, or absurdly large requested page value SHALL resolve to a valid page within the supported bounds rather than being passed through unchanged.

#### Scenario: Page value is non-numeric
- **WHEN** a visitor requests the public post list with a non-numeric page value
- **THEN** the request SHALL resolve to the first valid page

#### Scenario: Page value is absurdly large
- **WHEN** a visitor requests the public post list with an absurdly large page value
- **THEN** the request SHALL resolve to the maximum supported page
