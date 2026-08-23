## ADDED Requirements

### Requirement: Admit documented request bodies
The deployed runtime MUST allow request bodies large enough to carry the documented upload batch limit, including request framing, so an upload within that limit can reach the application.

#### Scenario: Upload batch is within the documented limit
- **WHEN** an editor sends an upload whose selected files are within the documented upload batch limit
- **THEN** the deployed runtime SHALL allow the request body to reach the application rather than reject it at the runtime boundary

### Requirement: Report admin action results through toasts
Top-level success and failure messages returned by admin form actions MUST be reported as transient toast messages through one shared toast layer mounted in the admin shell. Each toast MUST be dismissible, MUST auto-expire, and SHALL be announced through an ARIA live region. Field-level errors SHALL remain beside their fields; list-shaped results, including per-file upload outcomes and bulk action result lists, and state banners driven by loaded data SHALL remain inline. Public-site form errors SHALL remain inline because public routes do not mount the toast layer.

#### Scenario: Admin form action returns a result message
- **WHEN** an admin form action returns a top-level success or failure message
- **THEN** the admin shell SHALL present the message as a transient toast
- **AND** the toast SHALL be dismissible and auto-expire
- **AND** the toast SHALL be announced through an ARIA live region

#### Scenario: Contextual or list-shaped admin feedback is produced
- **WHEN** admin feedback is a field-level error, a list-shaped result, or a state banner driven by loaded data
- **THEN** the feedback SHALL remain in its page rather than be replaced by a toast

#### Scenario: Public-site form returns an error
- **WHEN** a form on a public-site route returns an error
- **THEN** the error SHALL remain inline because the public-site route has no toast layer

## MODIFIED Requirements

### Requirement: Protect admin access
A visitor without an authenticated editor session SHALL be redirected to the editor sign-in screen when requesting an admin screen. An authenticated editor who lacks the admin role MUST be refused access to admin-only screens, and an authorization failure raised by an admin-only page load SHALL be rendered by the admin error boundary within the admin shell rather than replacing the shell with a separate error page.

#### Scenario: Unauthenticated visitor requests an admin screen
- **WHEN** a visitor without an authenticated editor session requests an admin screen
- **THEN** the visitor SHALL be redirected to the editor sign-in screen

#### Scenario: Non-admin editor requests an admin-only screen
- **WHEN** an authenticated editor without the admin role requests an admin-only screen
- **THEN** access SHALL be refused
- **AND** the authorization failure SHALL be rendered by the admin error boundary within the admin shell
- **AND** the admin shell SHALL NOT be replaced with a separate error page
