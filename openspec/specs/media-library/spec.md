## Purpose

Provide editors with a managed image library while preserving existing URL-based images and serving appropriately sized public assets.

## Requirements

### Requirement: Upload media with alt text
The editor UI SHALL allow an editor to upload one or more image files in a single interaction, including by dragging files onto the library. Alt text SHALL NOT be required at upload and SHALL be editable from the library afterwards, so that uploading several files at once does not require describing them first.

#### Scenario: Upload an image
- **WHEN** an editor selects an accepted image file and submits the upload
- **THEN** a media item SHALL be created with that file and empty alt text
- **AND** the editor SHALL be able to add alt text to it afterwards

#### Scenario: Upload several images at once
- **WHEN** an editor submits several accepted image files in one interaction
- **THEN** a media item SHALL be created for each accepted file

#### Scenario: Drag files onto the library
- **WHEN** an editor drags accepted image files onto the media library
- **THEN** a media item SHALL be created for each accepted file

### Requirement: Validate uploads at the trust boundary
The server MUST accept only JPEG, PNG, WebP, and GIF image uploads no larger than 10 MiB. The server MUST enforce both the detected file type and file size regardless of browser-side checks, and a rejected upload SHALL report the reason without creating a media item.

#### Scenario: Reject an unsupported file type
- **WHEN** an editor uploads a file whose detected type is not JPEG, PNG, WebP, or GIF
- **THEN** the upload SHALL be rejected with a message identifying the unsupported file type
- **AND** no media item SHALL be created

#### Scenario: Reject an oversized image
- **WHEN** an editor uploads an image larger than 10 MiB
- **THEN** the upload SHALL be rejected with a message identifying the maximum file size
- **AND** no media item SHALL be created

### Requirement: Browse media items
The editor UI SHALL display the media library as a browsable collection in which every media item shows a thumbnail, filename, and alt text.

#### Scenario: View the media library
- **WHEN** an editor opens the media library
- **THEN** every listed media item SHALL show its thumbnail, filename, and current alt text

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

### Requirement: Delete several media items at once
The editor UI SHALL allow an editor to select more than one media item and delete the selection in a single action, and SHALL offer selecting every item shown and clearing the selection. Selecting the same item more than once SHALL count as selecting it once. A bulk delete SHALL report an outcome for each selected item and the exact number of items deleted, so that one failure neither hides the deletions that succeeded nor overstates them.

#### Scenario: Delete a selection of media items
- **WHEN** an editor selects several media items and deletes the selection
- **THEN** exactly those media items SHALL no longer appear in the media library or be publicly readable
- **AND** the reported deleted count SHALL equal the number of items removed

#### Scenario: Select every item shown and then clear the selection
- **WHEN** an editor selects every media item shown and then clears the selection
- **THEN** no media item SHALL be selected
- **AND** no media item SHALL be deleted

#### Scenario: One item in the selection cannot be deleted
- **WHEN** an editor deletes a selection in which one item cannot be deleted
- **THEN** the remaining selected items SHALL still be deleted
- **AND** the response SHALL identify the item that was not deleted
- **AND** the reported deleted count SHALL exclude it

#### Scenario: Delete with nothing selected
- **WHEN** an editor invokes the bulk delete with no media item selected
- **THEN** no media item SHALL be deleted
- **AND** the editor SHALL be told that nothing was selected

#### Scenario: Requester is not permitted to delete media
- **WHEN** a requester who is not an authenticated editor invokes the bulk delete
- **THEN** the request SHALL be rejected before any media item is deleted
- **AND** no media item SHALL be deleted

#### Scenario: Selection includes a media item a page references
- **WHEN** an editor deletes a selection that includes a media item referenced by a page
- **THEN** that media item SHALL be deleted
- **AND** the referencing page SHALL continue to render, omitting the unavailable image

### Requirement: Select media for content images
The editor UI SHALL allow an editor to select a media item for every section image field and for a post's cover image instead of requiring a typed URL.

#### Scenario: Select a section image
- **WHEN** an editor chooses a media item for a section image field and saves the page
- **THEN** the saved field SHALL reference the selected media item

#### Scenario: Select a post cover image
- **WHEN** an editor chooses a media item for a post's cover image and saves the post
- **THEN** the saved cover image SHALL reference the selected media item

### Requirement: Preserve URL-based image content
An image field SHALL accept either a media item reference or a plain URL string. The public site SHALL render both forms, and saving existing content SHALL preserve a plain URL string unless an editor replaces it.

#### Scenario: Render a referenced media item
- **WHEN** a visitor views published content whose image field references an available media item
- **THEN** the public site SHALL render that media item's image

#### Scenario: Render a plain image URL
- **WHEN** a visitor views published content whose image field contains a plain URL string
- **THEN** the public site SHALL render the image from that URL

#### Scenario: Save existing URL-based content
- **WHEN** an editor saves content with an existing plain URL image value unchanged
- **THEN** the saved image field SHALL retain that plain URL string

### Requirement: Serve resized public images
The public site SHALL serve a media image resized to a requested width, so that a page receives an appropriately sized image instead of the stored one. A served variant SHALL be encoded as WebP, except where serving the stored image unchanged would deliver fewer bytes.

#### Scenario: Request a resized image
- **WHEN** a visitor requests an available media image at a permitted width
- **THEN** the response SHALL contain that image resized to the requested width

#### Scenario: Variant format is independent of the stored format
- **WHEN** a visitor requests a variant of a stored image whose stored format is not WebP
- **THEN** the response SHALL contain a WebP image

### Requirement: Enforce media access permissions
Original and resized media files SHALL be publicly readable without authentication. Uploading media, editing alt text, and deleting media SHALL require an editor to be authenticated.

#### Scenario: Visitor reads media
- **WHEN** a visitor requests an available original or resized media image
- **THEN** the image SHALL be returned without requiring authentication

#### Scenario: Visitor attempts to modify media
- **WHEN** a visitor attempts to upload, edit, or delete a media item
- **THEN** the operation SHALL be denied and no media data SHALL change

#### Scenario: Authenticated editor modifies media
- **WHEN** an editor uploads, edits, or deletes a media item
- **THEN** the requested operation SHALL be permitted subject to the media validation requirements

### Requirement: Handle deletion of referenced page media
Deleting a media item that is referenced by a page SHALL succeed. After deletion, the public page SHALL omit that image without showing a broken image, while rendering the page's remaining content.

#### Scenario: Delete media referenced by a page
- **WHEN** an editor deletes a media item that a page image field still references
- **THEN** the public page SHALL omit the unavailable image without showing a broken image
- **AND** the page's remaining content SHALL continue to render

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
