## Purpose

Define the editor-visible contract for navigating and independently maintaining site-wide settings across a sectioned settings surface.

## ADDED Requirements

### Requirement: Settings sections and order

The site settings surface SHALL contain exactly five sections in this order: Site meta, Header, Footer, Search and sharing, and Custom code. Each section SHALL have its own address within the settings area.

#### Scenario: Editor sees the complete settings group

- **WHEN** an authenticated editor opens any site settings section
- **THEN** the settings surface shows exactly Site meta, Header, Footer, Search and sharing, and Custom code in that order
- **AND** each section is available at a distinct address within the settings area

### Requirement: Default settings landing

Opening the site settings group without selecting a section SHALL land the editor on the Site meta section rather than display an empty surface or an error.

#### Scenario: Editor opens the settings group

- **WHEN** an authenticated editor opens site settings without selecting a section
- **THEN** the Site meta section is displayed
- **AND** the editor does not encounter an empty surface or an error

### Requirement: Shared section navigation

Every site settings section SHALL display the same ordered section navigation. The navigation SHALL mark the section currently open as current and SHALL NOT mark another section as current.

#### Scenario: Navigation identifies the open section

- **WHEN** an authenticated editor opens each site settings section in turn
- **THEN** every section displays the same five navigation entries in the defined order
- **AND** only the entry for the open section is marked as current

### Requirement: Per-section save isolation

Saving a site settings section SHALL update only that section's stored record and SHALL NOT alter the stored record of any other section.

#### Scenario: Saving the header preserves unrelated settings

- **WHEN** an authenticated editor changes and saves the Header section
- **THEN** the Header section's stored record reflects the change
- **AND** the stored records for Site meta, Footer, Search and sharing, and Custom code retain their prior values

### Requirement: Settings may start unset

A site settings section whose stored record does not yet exist SHALL still render an editable form. The first successful save of that section SHALL create its stored record without requiring another settings record to exist.

#### Scenario: Editor opens an unset section

- **WHEN** an authenticated editor opens a section that has no stored record
- **THEN** the section renders an editable form instead of returning an error

#### Scenario: Editor saves an unset section

- **WHEN** an authenticated editor successfully saves a section that has no stored record
- **THEN** a stored record is created for that section
- **AND** no stored record is created or changed for another section

### Requirement: Editor authentication

The site settings surface SHALL be available only to authenticated editors. An unauthenticated visitor who requests a settings section SHALL be directed to sign in and SHALL NOT receive the section content.

#### Scenario: Unauthenticated visitor requests settings

- **WHEN** an unauthenticated visitor requests a site settings section
- **THEN** the visitor is directed to the editor sign-in surface
- **AND** the requested settings content is not shown
