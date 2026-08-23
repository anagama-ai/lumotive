# platform-operations

## Purpose
Define the operational contract for editor authentication, layered request limiting, and recoverable backups. These requirements capture behaviour that is already relied upon by the editor and public surfaces, including the boundaries of backup retention and coverage.

## Requirements

### Requirement: Editor sign-in
The editor UI SHALL establish an authenticated editor session only when supplied credentials are valid. Invalid credentials MUST NOT establish a session or grant access to the editor UI.

#### Scenario: Sign in with valid credentials
- **WHEN** an editor submits valid credentials
- **THEN** an authenticated editor session SHALL be established
- **AND** the editor UI SHALL be accessible

#### Scenario: Reject invalid credentials
- **WHEN** a visitor submits invalid editor credentials
- **THEN** no authenticated editor session SHALL be established
- **AND** the editor UI SHALL remain inaccessible

### Requirement: Protect the session cookie
The session cookie MUST NOT be readable by client-side scripts, MUST be restricted to same-site navigation, and MUST be marked for secure transport when the request that established it arrived over a secure protocol. Preventing script access is load-bearing because the public site renders editor-supplied injected code; if the session cookie were script-readable, any injected third-party snippet could read it.

#### Scenario: Client-side script attempts to read the session
- **WHEN** client-side script inspects the cookies available to it after editor sign-in
- **THEN** the editor session cookie SHALL NOT be readable by that script

#### Scenario: Session established over a secure protocol
- **WHEN** an editor session is established through a secure protocol
- **THEN** the session cookie SHALL be marked for secure transport

#### Scenario: Cross-site request attempts to carry the session
- **WHEN** a cross-site request attempts to carry the editor session cookie
- **THEN** the cookie SHALL be restricted to same-site navigation

### Requirement: Invalid sessions grant nothing
An expired, malformed, or forged session token MUST NOT produce an authenticated editor identity or grant any editor capability.

#### Scenario: Expired or malformed token
- **WHEN** a request carries an expired or malformed session token
- **THEN** the request SHALL be treated as anonymous
- **AND** no editor capability SHALL be granted

#### Scenario: Forged token
- **WHEN** a request carries a forged session token
- **THEN** the request SHALL be treated as anonymous
- **AND** the request SHALL NOT reach an admin screen
- **AND** no editor action SHALL be performed

### Requirement: Sign-out clears the session from the browser
Signing out SHALL clear the editor session cookie so the browser stops presenting it and the editor UI is no longer reachable from that browser.

The session token is self-contained and is NOT invalidated server-side by signing out. A token captured before sign-out therefore continues to grant the editor UI until it expires. The token lifetime is consequently the control that bounds this exposure, and it MUST be set deliberately rather than left at an inherited default.

#### Scenario: Access after sign-out from the same browser
- **WHEN** an editor signs out and then requests the editor UI
- **THEN** the request SHALL be treated as unauthenticated and redirected to sign-in

#### Scenario: Sign-out clears the session cookie
- **WHEN** an editor signs out
- **THEN** the response SHALL instruct the browser to discard the session cookie

#### Scenario: A token captured before sign-out still works until expiry
- **WHEN** a session token captured before sign-out is replayed after sign-out and before its expiry
- **THEN** it SHALL still grant the editor UI
- **AND** this is the accepted consequence of a self-contained token, bounded only by the configured token lifetime

### Requirement: Anonymous requests stay cacheable
A response to a visitor who has no editor session MUST NOT create or return an editor session cookie, preserving the response's suitability for shared caching.

#### Scenario: Anonymous visitor requests a public page
- **WHEN** a visitor with no editor session requests a public page
- **THEN** the response SHALL NOT include an editor session cookie

### Requirement: Protect admin access
A visitor without an authenticated editor session SHALL be redirected to the editor sign-in screen when requesting an admin screen. An authenticated editor who lacks the admin role MUST be refused access to admin-only screens.

#### Scenario: Unauthenticated visitor requests an admin screen
- **WHEN** a visitor without an authenticated editor session requests an admin screen
- **THEN** the visitor SHALL be redirected to the editor sign-in screen

#### Scenario: Non-admin editor requests an admin-only screen
- **WHEN** an authenticated editor without the admin role requests an admin-only screen
- **THEN** access SHALL be refused

### Requirement: Limit authentication attempts
Password authentication attempts from one unauthenticated guest MUST be subject to a bounded, configurable request threshold. Once that threshold is crossed within its configured window, further attempts SHALL receive an explicit rejection rather than being delayed and eventually accepted.

#### Scenario: Authentication threshold is crossed
- **WHEN** one unauthenticated guest exceeds the configured password-authentication threshold within its window
- **THEN** further authentication attempts SHALL be explicitly rejected
- **AND** no rejected attempt SHALL become a slow successful sign-in

### Requirement: Limit form submissions
Public form submissions from one requester MUST be subject to a bounded, configurable request threshold. Once that threshold is crossed within its configured window, further submissions SHALL receive an explicit rejection rather than being delayed and eventually accepted.

#### Scenario: Form-submission threshold is crossed
- **WHEN** one requester exceeds the configured public form-submission threshold within its window
- **THEN** further form submissions SHALL be explicitly rejected
- **AND** no rejected submission SHALL become a slow successful submission

### Requirement: Deploy rate limiting in layers
The built-in request limiter MUST remain a second layer of protection and MUST NOT be the only limit exposed to public traffic. A production deployment SHALL place a rate-limiting reverse proxy in front of the application.

#### Scenario: Public traffic reaches a production deployment
- **WHEN** authentication or form-submission traffic reaches a production deployment
- **THEN** a rate-limiting reverse proxy SHALL apply an outer limit before the request reaches the application
- **AND** the application's own request limiter SHALL remain enabled

### Requirement: Run restorable backups unattended
The service SHALL produce backups on a configured schedule without operator action. A scheduled backup MUST be restorable as a recovery source.

#### Scenario: Scheduled time arrives
- **WHEN** the configured backup time arrives without operator intervention
- **THEN** a scheduled backup SHALL be produced

#### Scenario: Restore a scheduled backup
- **WHEN** an operator restores a completed scheduled backup into a recovery environment
- **THEN** the data covered by that backup SHALL be recovered

### Requirement: Bound scheduled backup retention
Scheduled backup retention MUST be capped so that scheduled backups cannot grow without limit on their storage volume.

#### Scenario: Scheduled backups exceed the retention cap
- **WHEN** creation of a scheduled backup would exceed the configured scheduled-backup retention cap
- **THEN** older scheduled backups SHALL be removed until the scheduled set is within the cap

### Requirement: Scope retention to scheduled backups
Scheduled backup retention MUST apply only to backups created by the schedule. A backup created for another reason MUST NOT be evicted by scheduled retention and MUST NOT count toward the scheduled retention cap. Such backups therefore require their own lifecycle; without one, they accumulate on the same volume as the database.

#### Scenario: Scheduled retention prunes while an independent backup exists
- **WHEN** scheduled backup retention removes older scheduled backups while a backup created for another reason exists
- **THEN** the independently created backup SHALL remain available
- **AND** only scheduled backups SHALL be eligible for removal by scheduled retention

#### Scenario: Independent backup does not consume scheduled retention
- **WHEN** the scheduled backup set reaches its retention cap while independently created backups also exist
- **THEN** the full permitted set of scheduled backups SHALL remain available
- **AND** the independently created backups SHALL NOT count toward that cap

#### Scenario: Independent backups have no separate lifecycle
- **WHEN** backups created outside the schedule continue to be added without a separate lifecycle removing them
- **THEN** scheduled retention SHALL NOT remove any of those backups
- **AND** those backups SHALL accumulate on the same volume as the database

### Requirement: State backup coverage
A backup SHALL cover the database and, while uploaded files are stored locally, those uploaded files. When uploaded files are stored by an external file service, a backup SHALL cover the database but SHALL NOT cover those files, and restoring that backup SHALL NOT recover them.

#### Scenario: Restore while uploaded files are stored locally
- **WHEN** an operator restores a backup created while uploaded files were stored locally
- **THEN** the database SHALL be recovered
- **AND** the locally stored uploaded files covered by the backup SHALL be recovered

#### Scenario: Restore while uploaded files are stored externally
- **WHEN** an operator restores a backup created while uploaded files were stored by an external file service
- **THEN** the database SHALL be recovered
- **AND** the externally stored uploaded files SHALL NOT be recovered from that backup
