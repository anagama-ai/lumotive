## Purpose

Lets an editor take ownership of their password through emailed, single-use links so an administrator never knows or hands over that password, while defining reliable outbound transport for editor account mail.

## Requirements

### Requirement: Configured outbound mail transport
The site SHALL send editor account mail through an encrypted, authenticated transport reachable from the deployment host, and the transport credential SHALL be supplied by the runtime environment rather than stored in the repository or any committed file.

#### Scenario: Transport is configured at start-up
- **WHEN** the content backend starts with the transport credential present in its environment
- **THEN** outbound editor account mail SHALL be sent over an encrypted, authenticated connection to the mail provider

#### Scenario: A send that the provider does not accept is reported
- **WHEN** the provider refuses a message or is unreachable
- **THEN** the failure SHALL be surfaced to the caller that triggered the send rather than being reported as a successful delivery

#### Scenario: Credential is absent
- **WHEN** the content backend starts with no transport credential in its environment
- **THEN** the backend SHALL still start and serve content, and mail SHALL remain unavailable rather than being sent unauthenticated or in clear text

#### Scenario: Credential never appears in the repository
- **WHEN** the repository and its build output are searched for the transport credential
- **THEN** the credential SHALL NOT be present in either location

### Requirement: Sender identity
Every editor account message SHALL use one configured sender address on a domain authorized to send for the site, with a display name identifying the site. Runtime sender overrides SHALL be optional.

#### Scenario: Message carries the configured sender
- **WHEN** the site sends editor account mail
- **THEN** the message SHALL use the configured sender address and display name

#### Scenario: Sender overrides are absent
- **WHEN** the content backend starts without runtime sender-name or sender-address overrides
- **THEN** its existing sender name and address SHALL remain unchanged rather than being replaced with invented defaults

### Requirement: Password reset request from the sign-in screen
The editor sign-in screen SHALL offer a way to recover a forgotten password, leading to a form that accepts an email address and, when that address belongs to an editor account, sends a password-reset email containing a link to the site's own reset screen.

#### Scenario: Request for an existing account
- **WHEN** a visitor submits the email address of an existing editor account
- **THEN** a password-reset email containing a reset link SHALL be sent to that address

#### Scenario: Request for an unknown address
- **WHEN** a visitor submits an email address that belongs to no editor account
- **THEN** no mail SHALL be sent to that address and no account SHALL be created

#### Scenario: Malformed address is rejected
- **WHEN** a visitor submits a value that is not a valid email address
- **THEN** the request SHALL be rejected before any reset mail is requested and the email field SHALL be identified

### Requirement: Reset requests cannot enumerate accounts
The response to a password-reset request MUST NOT reveal whether the submitted address belongs to an editor account. The visible outcome, wording, and status MUST be identical for known and unknown addresses.

#### Scenario: Responses are indistinguishable
- **WHEN** a visitor submits an address that has an account and separately submits an address that has none
- **THEN** both submissions MUST produce the same confirmation message and response status, and neither MUST indicate whether an account exists

### Requirement: Tokenized password reset screen
A password-reset email SHALL link to a screen on the site where the holder sets a new password by entering it twice. The link SHALL be time limited and single use, and MUST NOT depend on the content backend's developer dashboard being reachable.

#### Scenario: Holder sets a new password
- **WHEN** the holder of a valid unused reset link submits a new password twice and the entries match and meet the minimum length
- **THEN** the account's password SHALL be replaced, the holder SHALL be able to sign in with it, and the previous password SHALL stop working

#### Scenario: Entries do not match or are too short
- **WHEN** the holder submits entries that differ or a password below the enforced minimum length
- **THEN** the submission MUST be rejected with the failing field identified and the account's password MUST remain unchanged

#### Scenario: Link is already used, expired, or altered
- **WHEN** a reset link is submitted after it has been used, after it has expired, or with an altered token
- **THEN** the request MUST be refused, no password MUST be changed, and the visitor SHALL be told to request a new link

#### Scenario: Reset screen never requires the old password
- **WHEN** the holder of a valid reset link uses the reset screen
- **THEN** the screen MUST NOT require the previous password

#### Scenario: Submitted password is never echoed
- **WHEN** a password-reset submission is rejected and the form is shown again with errors
- **THEN** no submitted password value SHALL appear in the response

### Requirement: New account invitation
When an administrator creates an editor account, the account SHALL be created with a password that no person has been shown, and the new editor SHALL be sent a set-your-password email carrying a reset link.

#### Scenario: Account creation sends the invitation
- **WHEN** an administrator creates an editor account with an email address and a role
- **THEN** the account SHALL exist with the chosen role, a set-your-password email SHALL be sent to that address, and no password SHALL be displayed to the administrator

#### Scenario: New editor sets their password before first sign-in
- **WHEN** the new editor opens the emailed link and sets a password
- **THEN** the editor SHALL be able to sign in with it and no administrator SHALL have known that password at any point

#### Scenario: Invitation mail fails to send
- **WHEN** account creation succeeds but the invitation email cannot be sent
- **THEN** the administrator SHALL be told that the account was created and the email failed and SHALL be offered a way to send it again

### Requirement: Resending the invitation
An administrator SHALL be able to send the set-your-password email again for any account other than their own without learning or choosing that account's password.

#### Scenario: Administrator resends the email
- **WHEN** an administrator resends the set-your-password email for another account
- **THEN** a new reset link SHALL be sent to that account's address and the account's current password SHALL remain unchanged until the holder uses the link

### Requirement: Rate-limited reset requests
Password-reset requests SHALL be rate limited per requester so the endpoint cannot be used to send repeated mail to an address.

#### Scenario: Requests exceed the limit
- **WHEN** password-reset requests from one requester exceed the configured allowance within the configured window
- **THEN** further requests SHALL be refused for the remainder of the window and no additional mail SHALL be sent
