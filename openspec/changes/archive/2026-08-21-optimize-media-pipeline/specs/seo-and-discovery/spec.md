## MODIFIED Requirements

### Requirement: Public metadata
The public representation of a page or post SHALL emit title, description, social sharing image, and configured canonical URL metadata. When a search title is absent, the title metadata SHALL use the record's title. When the record has no social sharing image, the social sharing metadata SHALL use the site-level default sharing image. Social sharing image metadata MUST reference a resized variant of the media image rather than the stored image, so that a crawler is never served the stored file.

#### Scenario: Record supplies all metadata
- **WHEN** a visitor requests a page or post with a search title, description, social sharing image, and canonical URL
- **THEN** the public response SHALL emit metadata containing those configured values

#### Scenario: Record metadata uses fallbacks
- **WHEN** a visitor requests a page or post without a search title or social sharing image
- **THEN** the public response SHALL use the record's title and the site-level default sharing image in its metadata

#### Scenario: Record is excluded from indexing
- **WHEN** a visitor or crawler requests a page or post flagged as excluded from search engines
- **THEN** the public response SHALL emit a directive telling search engines not to index the record

#### Scenario: Social sharing image is a resized variant
- **WHEN** a visitor requests a page or post whose social sharing image is a media image
- **THEN** the emitted social sharing metadata SHALL reference a resized variant of that image
- **AND** it SHALL NOT reference the stored image

#### Scenario: Default sharing image is a resized variant
- **WHEN** a visitor requests a page or post that falls back to the site-level default sharing image
- **THEN** the emitted social sharing metadata SHALL reference a resized variant of that image
