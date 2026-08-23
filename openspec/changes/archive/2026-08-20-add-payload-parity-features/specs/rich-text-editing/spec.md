## Purpose

Provide visual rich-text authoring for prose sections and post bodies while preserving HTML compatibility and preventing unsafe markup from reaching the public site.

## ADDED Requirements

### Requirement: Visual rich-text authoring
The editor UI SHALL allow an editor to author a prose section and a post body in a visual editor that displays formatting as it will appear to a visitor, without requiring the editor to write markup.

#### Scenario: Author formatted prose visually
- **WHEN** an editor creates or edits a prose section
- **THEN** the editor UI displays the content and its formatting visually without exposing a raw-markup authoring field

#### Scenario: Author a formatted post body visually
- **WHEN** an editor creates or edits a post body
- **THEN** the editor UI displays the content and its formatting visually without exposing a raw-markup authoring field

### Requirement: Supported formatting set
The visual editor SHALL support headings at levels 1 through 4, bold, italic, underline, hyperlink, ordered list, unordered list, blockquote, horizontal rule, and an inline image chosen from the media library. Apart from plain paragraphs, line breaks, and removing formatting, the visual editor MUST NOT expose additional formatting features.

#### Scenario: Apply supported text formatting
- **WHEN** an editor selects content and applies a heading level 1 through 4, bold, italic, underline, hyperlink, ordered list, unordered list, or blockquote
- **THEN** the visual editor displays the selected supported formatting

#### Scenario: Insert a horizontal rule
- **WHEN** an editor inserts a horizontal rule
- **THEN** the visual editor displays the horizontal rule at the selected position

#### Scenario: Insert an inline image
- **WHEN** an editor chooses a media item for insertion into rich text
- **THEN** the visual editor displays that media item as an inline image at the selected position

#### Scenario: Remove formatting
- **WHEN** an editor removes formatting from a selection
- **THEN** the selected content remains as plain text without its previously applied formatting

### Requirement: Link destinations
Link editing SHALL accept both site-relative paths and absolute URLs as hyperlink destinations.

#### Scenario: Save a site-relative link
- **WHEN** an editor assigns a site-relative path to a hyperlink
- **THEN** the hyperlink retains that site-relative path when saved and reopened

#### Scenario: Save an absolute link
- **WHEN** an editor assigns an absolute URL to a hyperlink
- **THEN** the hyperlink retains that absolute URL when saved and reopened

### Requirement: HTML storage and backward compatibility
Rich text SHALL be stored as HTML. The visual editor MUST load HTML authored before this capability was introduced and MUST preserve its supported content and formatting when that record is saved.

#### Scenario: Reopen and save existing HTML content
- **WHEN** an editor opens content authored before this change that contains supported HTML and saves it without changing the rich text
- **THEN** the visual editor displays the existing content and formatting correctly and the save does not corrupt that content or formatting

### Requirement: Unedited public rendering stability
The public rendering of prose content SHALL remain unchanged when that content has not been re-edited after this capability is introduced.

#### Scenario: Render prose that has not been re-edited
- **WHEN** a visitor views prose content that was stored before this change and has not subsequently been re-edited
- **THEN** the visitor sees the same content and formatting as before this change

### Requirement: Safe stored markup
Saved rich text MUST be restricted to text and the HTML elements `p`, `br`, `h1`, `h2`, `h3`, `h4`, `strong`, `em`, `u`, `a`, `ol`, `ul`, `li`, `blockquote`, `hr`, and `img`. The only permitted HTML attributes SHALL be `href` on `a`, and `src` and `alt` on `img`. Unsupported elements, unsupported attributes, executable URL schemes, and other executable markup MUST NOT be persisted or rendered as active markup on the public site.

#### Scenario: Reject an executable element
- **WHEN** rich text submitted for saving contains a script element
- **THEN** the script element is not persisted or is rendered only as inert text and cannot execute for a visitor

#### Scenario: Reject an event-handler attribute
- **WHEN** rich text submitted for saving contains an event-handler attribute on an otherwise supported element
- **THEN** the event-handler attribute is not persisted or is rendered only as inert text and cannot execute for a visitor

#### Scenario: Reject an executable link destination
- **WHEN** rich text submitted for saving contains a hyperlink with an executable URL scheme
- **THEN** the executable destination is not persisted or is rendered only as inert text and cannot execute for a visitor
