## Purpose

This capability gives published content complete discovery metadata and keeps crawler-facing indexes and feeds accurate as editors change the site.

## ADDED Requirements

### Requirement: Per-record discovery settings
Pages and posts SHALL each support a social sharing image, a canonical URL, and a flag that excludes the record from search engines. The site SHALL support a site-level default sharing image.

#### Scenario: Editor configures discovery settings
- **WHEN** an editor saves a page or post with a social sharing image, canonical URL, and search-engine exclusion flag
- **THEN** the saved record SHALL retain those values for its public metadata and generated discovery files

### Requirement: Public metadata
The public representation of a page or post SHALL emit title, description, social sharing image, and configured canonical URL metadata. When a search title is absent, the title metadata SHALL use the record's title. When the record has no social sharing image, the social sharing metadata SHALL use the site-level default sharing image.

#### Scenario: Record supplies all metadata
- **WHEN** a visitor requests a page or post with a search title, description, social sharing image, and canonical URL
- **THEN** the public response SHALL emit metadata containing those configured values

#### Scenario: Record metadata uses fallbacks
- **WHEN** a visitor requests a page or post without a search title or social sharing image
- **THEN** the public response SHALL use the record's title and the site-level default sharing image in its metadata

#### Scenario: Record is excluded from indexing
- **WHEN** a visitor or crawler requests a page or post flagged as excluded from search engines
- **THEN** the public response SHALL emit a directive telling search engines not to index the record

### Requirement: Sitemap
The site SHALL publish a valid machine-readable sitemap containing every published page and post, with each entry's public URL and last modification time. The sitemap MUST exclude every draft record and every record flagged as excluded from search engines.

#### Scenario: Eligible content is listed
- **WHEN** the site contains published pages and posts that are not excluded from search engines
- **THEN** the sitemap SHALL list each eligible record with its public URL and last modification time

#### Scenario: Ineligible content is omitted
- **WHEN** a page or post is a draft or is flagged as excluded from search engines
- **THEN** the sitemap MUST NOT list that record

#### Scenario: Publishing updates the sitemap
- **WHEN** an editor changes a page from draft to published
- **THEN** the page SHALL appear in the sitemap without requiring a redeploy

### Requirement: Crawler instructions
The site SHALL publish a valid robots file that identifies the sitemap for crawlers.

#### Scenario: Crawler requests instructions
- **WHEN** a crawler requests the robots file
- **THEN** the response SHALL point the crawler to the sitemap

### Requirement: Post feed
The site SHALL publish a valid RSS feed containing all published posts in newest-first order. Every feed item SHALL contain the post's title, public link, publication date, and summary, and draft posts MUST be excluded.

#### Scenario: Feed contains published posts
- **WHEN** the site contains multiple published posts
- **THEN** the RSS feed SHALL list them newest first with a title, public link, publication date, and summary for each post

#### Scenario: Feed excludes drafts
- **WHEN** a post is a draft
- **THEN** the RSS feed MUST NOT list that post

#### Scenario: Post changes update the feed
- **WHEN** an editor publishes or changes a post
- **THEN** the RSS feed SHALL reflect the change without requiring a redeploy

### Requirement: Generated file responses
Each generated discovery file SHALL be well formed and served with the content type required by its format: the sitemap as XML, the robots file as plain text, and the RSS feed as RSS XML. Each file SHALL reflect current content without requiring a redeploy.

#### Scenario: Generated files use their format content types
- **WHEN** a client requests the sitemap, robots file, or RSS feed
- **THEN** each response SHALL use the content type required by its respective format

#### Scenario: Empty site remains valid
- **WHEN** the site has no published pages or posts
- **THEN** the sitemap, robots file, and RSS feed SHALL each return a valid, well-formed response rather than an error
