## ADDED Requirements

### Requirement: Normalize uploaded images on intake
The server MUST normalize an accepted image upload before storing it. Normalization SHALL apply the image's orientation metadata to the pixels and then discard that metadata, SHALL remove remaining embedded metadata including any location data, and SHALL reduce the image to a maximum width of 1920 pixels while preserving its aspect ratio. An image narrower than 1920 pixels MUST NOT be enlarged. The stored image is the normalized image; the originally submitted image is not retained.

#### Scenario: Cap an oversized upload
- **WHEN** an editor uploads an image wider than 1920 pixels
- **THEN** the stored image SHALL be 1920 pixels wide with its aspect ratio preserved

#### Scenario: Leave a small upload at its own size
- **WHEN** an editor uploads an image narrower than 1920 pixels
- **THEN** the stored image SHALL retain the submitted pixel width

#### Scenario: Discard location metadata
- **WHEN** an editor uploads an image containing embedded location metadata
- **THEN** the stored image SHALL NOT contain that location metadata

#### Scenario: Apply rotation metadata to the pixels
- **WHEN** an editor uploads an image whose orientation metadata indicates it is rotated
- **THEN** the stored image SHALL appear in its intended orientation without relying on orientation metadata

### Requirement: Record stored image dimensions
A media item SHALL record the pixel width and height of its stored image so that consumers can size an image without downloading it.

#### Scenario: Dimensions recorded at upload
- **WHEN** an editor uploads an image
- **THEN** the resulting media item SHALL record the stored image's pixel width and height

### Requirement: Preserve animated image uploads
An uploaded GIF SHALL be stored without modification, so that a multi-frame image retains every frame. A stored GIF is therefore not subject to the width cap.

#### Scenario: Upload an animated GIF
- **WHEN** an editor uploads a multi-frame GIF
- **THEN** the stored image SHALL retain every frame of the submitted GIF

### Requirement: Restrict public variant widths
The public site SHALL serve image variants only at the widths 320, 640, 768, 1024, 1440, and 1920. A request for any other width SHALL be refused with a not-found response, and no variant SHALL be produced or stored for it.

#### Scenario: Request a permitted width
- **WHEN** a visitor requests an available media image at a permitted width
- **THEN** the response SHALL contain that image at the requested width

#### Scenario: Reject an unlisted width
- **WHEN** a visitor requests an available media image at a width that is not permitted
- **THEN** the response SHALL be a not-found response
- **AND** no variant SHALL be produced or stored

### Requirement: Never enlarge a variant
A requested variant width greater than the stored image's width SHALL be reduced to the stored image's width. A served variant MUST NOT contain more pixels across than the stored image it derives from.

#### Scenario: Requested width exceeds the stored image
- **WHEN** a visitor requests a permitted variant width larger than the stored image's width
- **THEN** the served image SHALL be no wider than the stored image

### Requirement: Serve variants at stable addresses
Every variant SHALL be addressable by a location that changes whenever the stored image's content changes, and variant responses SHALL carry directives permitting long-lived public caching. A variant response MUST NOT represent an image other than the stored content its address identifies.

#### Scenario: Variant response is cacheable
- **WHEN** a visitor requests an available variant
- **THEN** the response SHALL permit long-lived public caching

#### Scenario: Replacing an image changes its variant addresses
- **WHEN** a media item's stored image is replaced with different content
- **THEN** its variants SHALL be addressed by different locations than before the replacement

### Requirement: Serve repeated and concurrent variant requests consistently
A variant SHALL be produced at most once for a given address and reused for later requests. Simultaneous first requests for the same uncached variant SHALL each receive that variant, and a variant response MUST NOT contain a partially produced image.

#### Scenario: Repeat request reuses the produced variant
- **WHEN** a visitor requests a variant that has already been produced
- **THEN** the response SHALL contain the same image as the earlier response

#### Scenario: Simultaneous first requests
- **WHEN** several visitors request the same uncached variant at the same time
- **THEN** every request SHALL receive that complete variant

### Requirement: Bound simultaneous image conversion
The server SHALL convert at most two images at the same time. Submitting more images than that limit SHALL still process every submitted image.

#### Scenario: Upload more images than the conversion limit
- **WHEN** an editor uploads six images in one interaction
- **THEN** every submitted image SHALL be stored
- **AND** no more than two images SHALL be converted at the same time

### Requirement: Report media items missing alt text
The editor UI SHALL report how many media items have no alt text, so that images uploaded without a description are visible to an editor.

#### Scenario: Library contains images without alt text
- **WHEN** an editor views a media library containing items with no alt text
- **THEN** the UI SHALL report the number of items lacking alt text

#### Scenario: Every image has alt text
- **WHEN** an editor views a media library in which every item has alt text
- **THEN** the UI SHALL NOT report any items lacking alt text

### Requirement: Offer responsive image candidates
Public content images SHALL be published with multiple width candidates and their pixel widths, so that a client can select a width appropriate to its display instead of always receiving the largest.

#### Scenario: Public image offers several widths
- **WHEN** a visitor requests published content containing a media image
- **THEN** the image SHALL be published with more than one width candidate and each candidate's pixel width

### Requirement: Never serve more bytes than the stored image
A variant response MUST NOT be larger in bytes than the stored image it derives from. Where encoding a variant would produce more bytes than the stored image, the stored image SHALL be served instead. Delivering a resized image is never permitted to cost a visitor more bytes than delivering the stored image would have.

#### Scenario: Encoded variant would be larger than the stored image
- **WHEN** a visitor requests a permitted variant whose encoded form would exceed the stored image's size in bytes
- **THEN** the response SHALL contain the stored image
- **AND** the response SHALL NOT exceed the stored image's size in bytes

#### Scenario: Variant of an already compact image
- **WHEN** a visitor requests any permitted variant of a stored image that is already smaller than every permitted width
- **THEN** the response SHALL NOT exceed the stored image's size in bytes

## MODIFIED Requirements

### Requirement: Upload media with alt text
The editor UI SHALL allow an editor to upload one or more image files in a single interaction, including by dragging files onto the library, and to provide alt text for a resulting media item. Alt text SHALL be optional at upload and editable afterwards, so that uploading several files at once does not require describing them first.

#### Scenario: Upload an image
- **WHEN** an editor selects an accepted image file, provides alt text, and submits the upload
- **THEN** a media item SHALL be created with that file and alt text

#### Scenario: Upload several images at once
- **WHEN** an editor submits several accepted image files in one interaction
- **THEN** a media item SHALL be created for each accepted file

#### Scenario: Upload without alt text
- **WHEN** an editor submits an accepted image file without alt text
- **THEN** a media item SHALL be created with empty alt text
- **AND** the editor SHALL be able to add alt text to it afterwards

#### Scenario: Drag files onto the library
- **WHEN** an editor drags accepted image files onto the media library
- **THEN** a media item SHALL be created for each accepted file

### Requirement: Serve resized public images
The public site SHALL serve a media image resized to a requested width, so that a page receives an appropriately sized image instead of the stored one. A served variant SHALL be encoded as WebP, except where serving the stored image unchanged would deliver fewer bytes.

#### Scenario: Request a resized image
- **WHEN** a visitor requests an available media image at a permitted width
- **THEN** the response SHALL contain that image resized to the requested width

#### Scenario: Variant format is independent of the stored format
- **WHEN** a visitor requests a variant of a stored image whose stored format is not WebP
- **THEN** the response SHALL contain a WebP image
