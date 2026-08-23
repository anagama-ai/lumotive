## Purpose

Site identity defines the shared business details and imagery that an editor maintains once for consistent use throughout the public site and content manager.

## ADDED Requirements

### Requirement: Business postal address preserves its structure

The system SHALL allow an editor to store a business postal address as multi-line text and SHALL preserve its line breaks when the address is stored and shown again.

#### Scenario: Save a multi-line postal address

- **WHEN** an editor saves a postal address containing a street line, locality line, and country line separated by line breaks
- **THEN** the stored postal address retains the same line breaks
- **AND** the address is shown again as the same three lines

### Requirement: Telephone numbers are trimmed

The system SHALL allow an editor to store a telephone number and SHALL remove whitespace surrounding the number before storing it.

#### Scenario: Save a telephone number with surrounding whitespace

- **WHEN** an editor saves `  +61 2 5550 1234  ` as the telephone number
- **THEN** the stored telephone number is `+61 2 5550 1234`
- **AND** whitespace within the telephone number is preserved

### Requirement: Social accounts are repeatable pairs

The system SHALL allow an editor to store zero or more social accounts, with each account represented by a platform name paired with a profile address. The system SHALL discard an entirely blank account row rather than storing it.

#### Scenario: Save multiple social accounts with a blank row

- **WHEN** an editor saves complete account rows for Instagram and LinkedIn together with a row whose platform name and profile address are both blank
- **THEN** both complete social accounts are stored as their platform-name and profile-address pairs
- **AND** the entirely blank row is not stored

### Requirement: Logos are distinguished by background context

The system SHALL allow an editor to choose one logo for use on light backgrounds and a separate logo for use on dark backgrounds. The system MUST preserve which background context each chosen logo belongs to.

#### Scenario: Choose different logos for light and dark backgrounds

- **WHEN** an editor chooses one image as the logo for light backgrounds and another image as the logo for dark backgrounds
- **THEN** the first image remains associated with light backgrounds
- **AND** the second image remains associated with dark backgrounds

### Requirement: Logo values support library and address forms

Each contextual logo SHALL accept either a reference to an image in the media library or a plain image address. The system SHALL render an available image supplied in either form.

#### Scenario: Render a media-library logo

- **WHEN** a contextual logo refers to an available image in the media library
- **THEN** the referenced image is rendered as that contextual logo

#### Scenario: Render a logo from a plain image address

- **WHEN** a contextual logo contains a reachable plain image address
- **THEN** the image at that address is rendered as that contextual logo

### Requirement: Content manager branding uses the dark-background logo

The content manager SHALL use the logo chosen for dark backgrounds as its brand image on its dark brand surface. When no logo for dark backgrounds is set, the content manager SHALL render its existing default brand mark instead of an empty space or broken image.

#### Scenario: Render the chosen dark-background logo

- **WHEN** an editor has chosen an available logo for dark backgrounds and opens the content manager
- **THEN** that logo is rendered as the content manager's brand image

#### Scenario: Render the fallback brand mark

- **WHEN** no logo for dark backgrounds is set and an editor opens the content manager
- **THEN** the content manager renders its existing default brand mark
- **AND** it does not render an empty space or broken image in place of the mark

### Requirement: Unreadable logo values are rejected atomically

The system SHALL reject a site identity save when either submitted logo value cannot be read. It SHALL store none of the site identity changes from that submission.

#### Scenario: Reject a save containing an unreadable logo value

- **WHEN** an editor submits changed site identity information with an unreadable value for either contextual logo
- **THEN** the save is rejected with an error identifying the affected logo context
- **AND** none of the submitted site identity changes are stored
