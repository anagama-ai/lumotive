## ADDED Requirements

### Requirement: Rich-text images are served resized
An image embedded in published rich text SHALL be served as a resized variant of the media image rather than the stored image, so that an article body never delivers the stored file.

#### Scenario: Published rich-text image is a variant
- **WHEN** a visitor views published rich text containing an image chosen from the media library
- **THEN** the rendered image SHALL reference a resized variant of that media image
- **AND** it SHALL NOT reference the stored image

#### Scenario: Existing rich-text image content keeps working
- **WHEN** a visitor views published rich text stored before this change whose image references a media image
- **THEN** the rendered image SHALL reference a resized variant of that media image

## MODIFIED Requirements

### Requirement: Supported formatting set
The visual editor SHALL support headings at levels 1 through 4, bold, italic, underline, hyperlink, ordered list, unordered list, blockquote, horizontal rule, and an inline image chosen from the media library. Apart from plain paragraphs, line breaks, and removing formatting, the visual editor MUST NOT expose additional formatting features. An inserted inline image SHALL reference a resized variant of the chosen media image.

#### Scenario: Apply supported text formatting
- **WHEN** an editor selects content and applies a heading level 1 through 4, bold, italic, underline, hyperlink, ordered list, unordered list, or blockquote
- **THEN** the visual editor displays the selected supported formatting

#### Scenario: Insert a horizontal rule
- **WHEN** an editor inserts a horizontal rule
- **THEN** the visual editor displays the horizontal rule at the selected position

#### Scenario: Insert an inline image
- **WHEN** an editor chooses a media item for insertion into rich text
- **THEN** the visual editor displays that media item as an inline image at the selected position
- **AND** the inserted image SHALL reference a resized variant of that media item

#### Scenario: Remove formatting
- **WHEN** an editor removes formatting from a selection
- **THEN** the selected content remains as plain text without its previously applied formatting
