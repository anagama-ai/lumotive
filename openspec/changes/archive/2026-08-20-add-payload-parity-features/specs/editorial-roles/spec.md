## Purpose

Define role-based editorial permissions so contributors can prepare drafts while only administrators control publication, editor accounts, roles, and redirects.

## ADDED Requirements

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
