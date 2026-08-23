## Purpose

Define role-based editorial permissions so contributors can prepare drafts while only administrators control publication, editor accounts, roles, and redirects.

## Requirements

### Requirement: Supported editorial roles
The system SHALL support exactly two editorial roles: admin and editor. Every authenticated editor SHALL hold one of these roles.

#### Scenario: Authenticated editor has a supported role
- **WHEN** an authenticated editor accesses the admin UI
- **THEN** the editor's permissions SHALL be determined by either the admin role or the editor role

### Requirement: Editor-role draft authoring
An editor-role user SHALL be able to create draft content and edit content that is currently draft.

#### Scenario: Editor creates draft content
- **WHEN** an editor-role user creates content with draft status
- **THEN** the content SHALL be created as draft

#### Scenario: Editor updates draft content
- **WHEN** an editor-role user saves changes to content that is currently draft
- **THEN** the changes SHALL be saved and the content SHALL remain draft

### Requirement: Editor-role publication restrictions
An editor-role user MUST NOT publish content, unpublish content, or modify content that is currently published.

#### Scenario: Editor attempts to publish draft content
- **WHEN** an editor-role user attempts to change draft content to published
- **THEN** the request MUST be rejected and the content MUST remain draft

#### Scenario: Editor attempts to unpublish content
- **WHEN** an editor-role user attempts to change published content to draft
- **THEN** the request MUST be rejected and the content MUST remain published

#### Scenario: Editor attempts to modify published content
- **WHEN** an editor-role user attempts to change content that is currently published without changing its status
- **THEN** the request MUST be rejected and the published content MUST remain unchanged

### Requirement: Editor-role administration restrictions
An editor-role user MUST NOT create, edit, or delete another editor account and MUST NOT change the role of any editor account, including their own.

#### Scenario: Editor attempts to manage another editor
- **WHEN** an editor-role user attempts to create, edit, or delete another editor account
- **THEN** the request MUST be rejected and no editor account MUST be created, changed, or deleted

#### Scenario: Editor attempts to change a role
- **WHEN** an editor-role user attempts to change any editor account's role
- **THEN** the request MUST be rejected and the role MUST remain unchanged

### Requirement: Editor-role redirect restrictions
An editor-role user MUST NOT create, edit, or delete redirects.

#### Scenario: Editor attempts to manage a redirect
- **WHEN** an editor-role user attempts to create, edit, or delete a redirect
- **THEN** the request MUST be rejected and no redirect MUST be created, changed, or deleted

### Requirement: Admin-role permissions
An admin-role user SHALL be able to create and edit draft content, publish content, unpublish content, modify published content, create, edit, and delete editor accounts, change editor account roles, and create, edit, and delete redirects.

#### Scenario: Admin manages content publication
- **WHEN** an admin-role user creates or edits draft content, publishes content, unpublishes content, or modifies published content
- **THEN** the requested content operation SHALL be permitted

#### Scenario: Admin manages editor accounts and roles
- **WHEN** an admin-role user creates, edits, or deletes an editor account or changes an editor account's role
- **THEN** the requested account operation SHALL be permitted

#### Scenario: Admin manages redirects
- **WHEN** an admin-role user creates, edits, or deletes a redirect
- **THEN** the requested redirect operation SHALL be permitted

### Requirement: Content API authorization
The content API MUST enforce all role restrictions independently of the admin UI. Removing or bypassing a UI restriction MUST NOT grant an editor-role user permission to perform an admin-only operation.

#### Scenario: Direct API request bypasses hidden UI control
- **WHEN** an editor-role session sends a direct API request to publish content after the admin UI has hidden the publish control
- **THEN** the content API MUST reject the request and the content MUST remain draft

#### Scenario: Direct API request targets another restricted operation
- **WHEN** an editor-role session sends a direct API request to unpublish or modify published content, manage an editor account or role, or manage a redirect
- **THEN** the content API MUST reject the request and the targeted record MUST remain unchanged

### Requirement: Role-aware admin UI
The admin UI SHALL hide or disable every action that the current editor's role cannot perform, and an editor-role user SHALL NOT be shown an actionable control for an operation that the content API will reject because of their role.

#### Scenario: Editor views restricted actions
- **WHEN** an editor-role user views controls for publication, published content, editor administration, role changes, or redirect management
- **THEN** each prohibited action SHALL be hidden or disabled and SHALL NOT be actionable

#### Scenario: Admin views permitted actions
- **WHEN** an admin-role user views controls for publication, published content, editor administration, role changes, or redirect management
- **THEN** the permitted actions SHALL be available

### Requirement: Existing admin compatibility
An existing editor account that already holds the admin role SHALL retain every permission it had before this capability is introduced.

#### Scenario: Existing admin continues working
- **WHEN** an editor account holding the admin role before this capability authenticates after the capability is introduced
- **THEN** the account SHALL retain its existing permissions, including content, editor-account, role, and redirect management permissions

### Requirement: Editor account administration surface
The admin UI SHALL provide an account administration screen through which an admin-role user can list editor accounts, create an editor account as an emailed invitation, change an account's role, send an account's set-your-password email again, and delete an account without using the content backend's developer dashboard. An admin-role user MUST NOT be able to choose or view another account's password.

#### Scenario: Admin lists editor accounts
- **WHEN** an admin-role user opens the account administration screen
- **THEN** every editor account SHALL be listed with its email address, role, and creation date, and no password value SHALL be disclosed

#### Scenario: Admin creates an editor account
- **WHEN** an admin-role user submits an unused email address and a supported role
- **THEN** the editor account SHALL be created with that email and role, no password field SHALL have been requested from the administrator, and the new editor SHALL be sent a set-your-password email

#### Scenario: Admin changes an account's role
- **WHEN** an admin-role user changes another account's role to the other supported role
- **THEN** the account's role SHALL be updated and the account's subsequent permissions SHALL follow the new role

#### Scenario: Admin sends the set-your-password email again
- **WHEN** an admin-role user resends the set-your-password email for another account
- **THEN** a new reset link SHALL be sent to that account's address, and the account's current password SHALL remain unchanged until the holder uses the link

#### Scenario: Admin cannot set another account's password
- **WHEN** an admin-role user attempts to set or replace another account's password directly
- **THEN** the admin UI MUST offer no such control and the request MUST be refused

#### Scenario: Admin deletes an editor account
- **WHEN** an admin-role user deletes another editor account
- **THEN** the account SHALL be removed, SHALL no longer appear in the account list, and SHALL no longer authenticate

#### Scenario: Editor-role user cannot reach the surface
- **WHEN** an editor-role user views the admin UI or requests the account administration screen directly
- **THEN** the navigation entry SHALL NOT be shown, the screen SHALL NOT be served, and no account data SHALL be returned

#### Scenario: Editor-role user submits an account action directly
- **WHEN** an editor-role session submits any account creation, role change, invitation resend, or deletion request directly
- **THEN** the request MUST be rejected and no editor account MUST be created, changed, or deleted

### Requirement: Administrative access lockout guards
The system MUST refuse any account operation that would leave the site without an administrator or would strip the acting administrator of their own administrative access, even when the operation is otherwise permitted by role.

#### Scenario: Admin attempts to demote their own account
- **WHEN** an admin-role user attempts to change their own account's role to the editor role
- **THEN** the request MUST be rejected, the account MUST retain the admin role, and the reason MUST be reported

#### Scenario: Admin attempts to delete their own account
- **WHEN** an admin-role user attempts to delete their own account
- **THEN** the request MUST be rejected and the account MUST remain

#### Scenario: Operation would remove the last administrator
- **WHEN** an admin-role user attempts to delete or demote the only account holding the admin role
- **THEN** the request MUST be rejected and that account MUST retain both its existence and the admin role

### Requirement: Account creation input validation
The system MUST reject an invalid account submission and MUST report which field failed without creating or modifying an account.

#### Scenario: Email address is malformed
- **WHEN** an admin-role user submits an account whose email address is not a valid address
- **THEN** the submission MUST be rejected, the email field MUST be identified, and no account MUST be created

#### Scenario: Email address is already in use
- **WHEN** an admin-role user submits an account using an email address that already belongs to an editor account
- **THEN** the submission MUST be rejected, the conflict MUST be reported, and the existing account MUST remain unchanged

#### Scenario: Role is not a supported value
- **WHEN** an admin-role user submits an account with a role that is not one of the supported editorial roles
- **THEN** the submission MUST be rejected and no account MUST be created
