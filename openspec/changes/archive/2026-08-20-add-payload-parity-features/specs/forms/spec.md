## Purpose

This capability lets editors build reusable forms, place them on public pages, and safely collect, review, and notify recipients about visitor submissions.

## ADDED Requirements

### Requirement: Form definition management
An editor SHALL be able to create a form with a name and an ordered field list. For each field, the editor SHALL be able to choose its type, set its label, and choose whether it is required. The editor SHALL be able to reorder and remove fields.

#### Scenario: Create a named form with fields
- **WHEN** an editor creates a named form and adds fields with labels, types, and required settings
- **THEN** the saved form SHALL preserve its name and the complete ordered field definitions

#### Scenario: Reorder and remove fields
- **WHEN** an editor reorders the fields and removes one field from a form
- **THEN** the saved form SHALL preserve the new order and SHALL no longer contain the removed field

### Requirement: Supported field types
The field type choices SHALL be single-line text, email, multi-line text, number, single-select, and checkbox. An editor choosing single-select SHALL be able to define the option list available to visitors.

#### Scenario: Configure every supported field type
- **WHEN** an editor adds one field of each supported type and defines options for the single-select field
- **THEN** the form SHALL preserve all six field types and the defined single-select options

### Requirement: Page placement and confirmation
An editor SHALL be able to place a form on any page as a section and SHALL be able to configure the confirmation message for that placement.

#### Scenario: Place a form on a page
- **WHEN** an editor adds a form section to a page, selects a form, and sets its confirmation message
- **THEN** that page SHALL display the selected form and SHALL associate the configured confirmation message with its successful submissions

### Requirement: Visitor submission confirmation
A visitor SHALL be able to submit a displayed form. After an accepted submission, the visitor SHALL see the confirmation message configured for that form section.

#### Scenario: Submit valid values
- **WHEN** a visitor submits values that satisfy the displayed form's validation rules
- **THEN** the submission SHALL be accepted and the visitor SHALL see the configured confirmation message

### Requirement: Submission storage and editor access
Every accepted submission SHALL be stored with its submitted values, the form it belongs to, and its arrival time. An authenticated editor SHALL be able to view those details.

#### Scenario: Review an accepted submission
- **WHEN** an authenticated editor views submissions after a visitor submission has been accepted
- **THEN** the editor SHALL be able to see the submitted values, the associated form, and the submission arrival time

### Requirement: Server-enforced validation
The server MUST validate submissions independently of browser validation. A submission with a missing required value or a malformed value for an email field SHALL be rejected with an error that identifies every offending field, and no part of a rejected submission SHALL be stored.

#### Scenario: Missing required value
- **WHEN** a submission omits a value for a required field
- **THEN** the server SHALL reject the submission, identify that required field in the error, and SHALL store no submission record or submitted values

#### Scenario: Browser validation is bypassed
- **WHEN** a direct submission request bypasses the browser entirely and supplies `not-an-email` for an email field
- **THEN** the server SHALL reject the request, identify the email field in the error, and SHALL store no submission record or submitted values

### Requirement: Submission notification
When a submission is accepted, a notification email SHALL be sent to every configured recipient.

#### Scenario: Notify configured recipients
- **WHEN** a valid submission is accepted and outbound email is available
- **THEN** every configured recipient SHALL be sent a notification email for that submission

### Requirement: Email failure cannot lose a submission
Email delivery MUST NOT determine whether a valid submission is stored or reported as successful. If outbound email fails, is unavailable, or is unconfigured, the accepted submission SHALL remain stored and the visitor SHALL still see the configured confirmation message.

#### Scenario: Outbound email is unavailable or unconfigured
- **WHEN** a visitor submits a valid form while outbound email is unavailable or has not been configured
- **THEN** the submission SHALL be stored with all required submission details, the visitor SHALL see the configured confirmation message, and no email-delivery error SHALL be shown to the visitor

### Requirement: Submission privacy
Form submissions MUST NOT be readable by visitors and SHALL be readable only by an authenticated editor.

#### Scenario: Visitor attempts to read submissions directly
- **WHEN** an unauthenticated visitor requests a submission or a list of submissions directly
- **THEN** the request SHALL be denied without exposing submission values or metadata

### Requirement: Form deletion
A form that is referenced by any page section MUST NOT be deleted; the rejected deletion SHALL identify the pages that still reference it, and those sections SHALL continue to display the form. Deleting an unreferenced form SHALL permanently delete all of its existing submissions.

#### Scenario: Delete a form still displayed on a page
- **WHEN** an editor attempts to delete a form that a page section still references
- **THEN** deletion SHALL be rejected, the referencing page SHALL be identified, the existing submissions SHALL remain stored, and the page SHALL continue to display the form

#### Scenario: Delete an unreferenced form with submissions
- **WHEN** an editor deletes a form that no page section references and that has existing submissions
- **THEN** the form and all submissions belonging to it SHALL be permanently deleted
