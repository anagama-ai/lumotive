## ADDED Requirements

### Requirement: Rename a stored image
The editor UI SHALL allow an editor to change the stored filename of an existing media item. A rename SHALL preserve the media item's identity, its image bytes, its alt text, and its recorded dimensions, so that every page, post, and rich-text body referencing the item continues to reference the same image.

The editor-supplied value SHALL be treated as a name stem rather than a complete filename. The file extension SHALL be derived from the stored image and MUST NOT be taken from editor input. The stored filename MAY therefore differ from the submitted stem, and the editor SHALL be shown the resulting stored filename.

#### Scenario: Rename an image
- **WHEN** an editor submits a new name for a media item
- **THEN** that media item's stored filename SHALL reflect the submitted name
- **AND** the item SHALL keep the same identity, alt text, and recorded dimensions

#### Scenario: Referencing content survives a rename
- **WHEN** an editor renames a media item that a published page references
- **THEN** that page SHALL continue to display the same image

#### Scenario: Image bytes are unchanged by a rename
- **WHEN** an editor renames a media item
- **THEN** the stored image SHALL be byte-for-byte the image that was stored before the rename

#### Scenario: Extension comes from the stored image
- **WHEN** an editor submits a new name that carries an extension differing from the stored image's format
- **THEN** the stored filename's extension SHALL be the one matching the stored image
- **AND** the submitted extension SHALL NOT determine how the file is served

#### Scenario: Editor sees the resulting filename
- **WHEN** a rename completes
- **THEN** the editor SHALL be shown the filename that was actually stored

### Requirement: Reject unsafe filename input
A submitted name becomes part of both a stored path and a public address, so the server MUST neutralise it before use. The server MUST reject or neutralise path separators, relative path segments, control characters, and leading dots, and MUST bound the length. A submitted name that is empty once neutralised SHALL be rejected and the media item SHALL be left unchanged.

#### Scenario: Reject a traversal attempt
- **WHEN** an editor submits a name containing path separators or relative path segments
- **THEN** the stored filename MUST NOT contain them
- **AND** no file SHALL be written outside the media storage location

#### Scenario: Reject a name that neutralises to nothing
- **WHEN** an editor submits a name consisting only of characters that are removed
- **THEN** the rename SHALL be rejected with a reason
- **AND** the media item's stored filename SHALL be unchanged

#### Scenario: Bound an excessive length
- **WHEN** an editor submits a name longer than the permitted length
- **THEN** the stored filename SHALL be within the permitted length

#### Scenario: A rejected rename changes nothing
- **WHEN** a rename is rejected
- **THEN** the media item's stored filename, alt text, and dimensions SHALL be unchanged
- **AND** the stored image SHALL remain readable at its existing address

### Requirement: Renaming retires the previous variant addresses
A variant address identifies a media item together with a stored filename, so renaming an image SHALL change every variant address for that image. Addresses formed from the previous filename SHALL cease to resolve, including where a variant for that address was already produced and cached.

This is an accepted consequence of naming being part of the address: a consumer outside the site holding a previously published address will no longer receive the image.

#### Scenario: New addresses serve the image after a rename
- **WHEN** a visitor requests a permitted variant of a renamed media item using its current filename
- **THEN** the response SHALL contain that image at the requested width

#### Scenario: Previous addresses stop resolving
- **WHEN** a visitor requests a variant using the media item's filename from before a rename
- **THEN** the response SHALL be a not-found response

#### Scenario: A cached variant under the previous name is not served
- **WHEN** a variant was produced and cached before a rename, and that same address is requested after the rename
- **THEN** the response SHALL be a not-found response

## MODIFIED Requirements

### Requirement: Manage media items
The editor UI SHALL allow an editor to change a media item's alt text, change its stored filename, and delete a media item.

#### Scenario: Edit alt text
- **WHEN** an editor saves new alt text for a media item
- **THEN** subsequent views of that media item SHALL show the new alt text

#### Scenario: Edit the stored filename
- **WHEN** an editor saves a new filename for a media item
- **THEN** subsequent views of that media item SHALL show the new stored filename

#### Scenario: Delete an unreferenced media item
- **WHEN** an editor deletes a media item that is not referenced by a page
- **THEN** that media item SHALL no longer appear in the media library or be publicly readable

### Requirement: Serve variants at stable addresses
Every variant SHALL be addressable by a location that changes whenever the stored image's content or its stored filename changes, and variant responses SHALL carry directives permitting long-lived public caching. A variant response MUST NOT represent an image other than the stored content its address identifies, and MUST NOT be served for an address whose filename is no longer the media item's current one.

#### Scenario: Variant response is cacheable
- **WHEN** a visitor requests an available variant
- **THEN** the response SHALL permit long-lived public caching

#### Scenario: Replacing an image changes its variant addresses
- **WHEN** a media item's stored image is replaced with different content
- **THEN** its variants SHALL be addressed by different locations than before the replacement

#### Scenario: Renaming an image changes its variant addresses
- **WHEN** a media item's stored filename changes while its image content stays the same
- **THEN** its variants SHALL be addressed by different locations than before the rename
