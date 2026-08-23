## ADDED Requirements

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
