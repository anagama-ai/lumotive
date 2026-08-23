## MODIFIED Requirements

### Requirement: Per-record discovery settings
Pages and posts SHALL each support a search title, a search description, a social sharing image, a canonical URL, and a flag that excludes the record from search engines. The site SHALL support a site-level default sharing image.

#### Scenario: Editor configures discovery settings
- **WHEN** an editor saves a page or post with a social sharing image, canonical URL, and search-engine exclusion flag
- **THEN** the saved record SHALL retain those values for its public metadata and generated discovery files

#### Scenario: Post retains search settings
- **WHEN** an editor saves a post with a search title and a search description
- **THEN** the saved post SHALL retain both values

### Requirement: Public metadata
The public representation of a page or post SHALL emit title, description, social sharing image, and configured canonical URL metadata. When a search title is absent, the title metadata SHALL use the record's title. When a search description is absent, the description metadata SHALL use the record's own summary text. When the record has no social sharing image, the social sharing metadata SHALL use the site-level default sharing image. Social sharing image metadata MUST reference a resized variant of the media image rather than the stored image, so that a crawler is never served the stored file.

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

#### Scenario: Post supplies search metadata
- **WHEN** a visitor requests a post with a search title and a search description
- **THEN** the public response SHALL emit those values as its title and description metadata

#### Scenario: Post search metadata uses fallbacks
- **WHEN** a visitor requests a post without a search title or a search description
- **THEN** the public response SHALL use the post's title and summary text as its title and description metadata
