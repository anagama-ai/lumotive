## Purpose

Provide editors with a managed image library while preserving existing URL-based images and serving appropriately sized public assets.

## ADDED Requirements

### Requirement: Upload media with alt text
The editor UI SHALL allow an editor to upload an image file and provide alt text for the resulting media item.

#### Scenario: Upload an image
- **WHEN** an editor selects an accepted image file, provides alt text, and submits the upload
- **THEN** a media item SHALL be created with that file and alt text

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
The editor UI SHALL allow an editor to change a media item's alt text and delete a media item.

#### Scenario: Edit alt text
- **WHEN** an editor saves new alt text for a media item
- **THEN** subsequent views of that media item SHALL show the new alt text

#### Scenario: Delete an unreferenced media item
- **WHEN** an editor deletes a media item that is not referenced by a page
- **THEN** that media item SHALL no longer appear in the media library or be publicly readable

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
The public site SHALL allow a media image to be requested at specified width and height dimensions so that a page can receive a resized version instead of the full-size original.

#### Scenario: Request a resized image
- **WHEN** a visitor requests an available media image with width and height dimensions
- **THEN** the response SHALL contain that image resized to fit within the requested dimensions

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
