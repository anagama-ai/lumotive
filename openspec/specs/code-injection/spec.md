# code-injection

## Purpose
Define how privileged editor-supplied markup is preserved and emitted at four document positions throughout the public site.

## Requirements

### Requirement: Site-wide injection positions
The site SHALL provide four independent injection slots on every public page. Configured content SHALL render inside the document head, immediately after the opening body tag and before the site header, inside the site footer alongside its content so that it inherits footer styling, or after the site footer and before the closing body tag, according to the selected slot.

#### Scenario: All four positions apply across public pages
- **WHEN** distinct markers are configured in all four slots and a visitor requests the home page and another public page
- **THEN** the head marker appears between the opening and closing head tags on both pages
- **AND** the body-start marker appears after the opening body tag and before the site header on both pages
- **AND** the footer marker appears within the site footer on both pages
- **AND** the closing-body marker appears after the site footer and before the closing body tag on both pages

#### Scenario: Footer and closing-body slots remain distinct
- **WHEN** the footer slot and the closing-body slot contain different markers
- **THEN** the footer marker appears between the opening and closing footer tags
- **AND** the closing-body marker appears after the closing footer tag and before the closing body tag

### Requirement: Verbatim preservation and emission
The site SHALL store and emit injection content exactly as typed, including leading, trailing, and internal whitespace. It SHALL NOT trim, normalize, reformat, escape, encode, or otherwise alter the supplied markup.

#### Scenario: Significant whitespace and markup are unchanged
- **WHEN** an authenticated editor saves multiline markup containing distinctive indentation, line breaks, spaces, and markup punctuation
- **THEN** reopening that slot shows the same content character for character
- **AND** every public page contains the same character sequence at the selected document position rather than an escaped or reformatted representation

### Requirement: Unset slots are empty by default
A slot that has never been saved SHALL be treated as empty. A fresh installation SHALL emit no injection content by default, and an unset slot SHALL produce no placeholder, visible text, or page error.

#### Scenario: Public page renders with no stored injection
- **WHEN** a visitor requests a public page while all injection slots are unset
- **THEN** the page renders successfully
- **AND** no injection content or placeholder is emitted at any of the four positions

#### Scenario: One unset slot does not affect configured slots
- **WHEN** one injection slot has never been saved and another slot contains markup
- **THEN** the unset slot emits nothing and causes no error
- **AND** the configured slot still emits its markup at its defined position

### Requirement: Editing is privileged while output is public
Changing injection content is a privileged capability because editor-supplied markup is emitted as executable public-page content and can run scripts for every visitor. Only an authenticated editor SHALL be permitted to alter any injection slot, while configured output SHALL be delivered to visitors whether or not they are authenticated.

#### Scenario: Unauthenticated visitor cannot edit injection content
- **WHEN** an unauthenticated visitor attempts to access the injection editing surface
- **THEN** the visitor is required to authenticate and cannot alter any slot

#### Scenario: Public visitor receives configured output
- **WHEN** an unauthenticated visitor requests a public page with configured injection content
- **THEN** the response includes that content at its selected document position
