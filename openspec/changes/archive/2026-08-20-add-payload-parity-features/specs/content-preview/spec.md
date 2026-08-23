## Purpose

This capability lets editors review draft content and unsaved page changes in context while keeping all unpublished content hidden from visitors.

## ADDED Requirements

### Requirement: Draft content at normal public URLs
An editor SHALL be able to view a draft page or draft post at the same public URL the content uses when published.

#### Scenario: Editor views a draft page
- **WHEN** an editor requests the normal public URL of a draft page
- **THEN** the site SHALL display that draft page to the editor

#### Scenario: Editor views a draft post
- **WHEN** an editor requests the normal public URL of a draft post
- **THEN** the site SHALL display that draft post to the editor

### Requirement: Draft content remains hidden from visitors
A visitor MUST NOT be able to view draft content, and the site SHALL respond as if no content exists at the requested URL without revealing that a draft record exists.

#### Scenario: Visitor requests a draft URL
- **WHEN** a visitor requests the normal public URL of a draft page or draft post
- **THEN** the site SHALL return its not-found response and MUST NOT include any draft content

#### Scenario: Draft and nonexistent URLs are indistinguishable
- **WHEN** a visitor requests a URL matching draft content and a URL matching no content
- **THEN** both requests SHALL produce the same not-found status and public-facing presentation, with no indication that either URL has a draft record

### Requirement: Live preview beside the page editing form
The page editor SHALL display a live preview of the page beside the editing form so the editor can review the page while editing it.

#### Scenario: Editor opens a page for editing
- **WHEN** an editor opens the page editing form
- **THEN** the editor UI SHALL display the page's live preview beside the form

### Requirement: Unsaved edits appear in live preview
The live preview SHALL reflect current edits without requiring the editor to save the page.

#### Scenario: Editor changes a field without saving
- **WHEN** an editor changes a page field and has not saved the page
- **THEN** the live preview SHALL display the changed value while the stored page remains unchanged

### Requirement: Selectable preview widths
The live preview SHALL offer mobile, tablet, and desktop widths of 375x667, 768x1024, and 1440x900 respectively, and SHALL let the editor switch among them.

#### Scenario: Editor switches preview width
- **WHEN** an editor selects mobile, tablet, or desktop preview
- **THEN** the live preview SHALL use 375x667, 768x1024, or 1440x900 respectively without requiring a save

#### Scenario: Editor switches repeatedly between widths
- **WHEN** an editor switches from one preview width to another while unsaved edits are present
- **THEN** the live preview SHALL retain those unsaved edits and display them at the newly selected width

### Requirement: Section structure changes appear in live preview
Adding, removing, or reordering a section SHALL be reflected in the live preview without requiring the editor to save the page.

#### Scenario: Editor adds a section
- **WHEN** an editor adds a section to the page
- **THEN** the live preview SHALL display the new section in its current position

#### Scenario: Editor removes a section
- **WHEN** an editor removes a section from the page
- **THEN** the live preview SHALL stop displaying that section

#### Scenario: Editor reorders sections
- **WHEN** an editor changes the order of sections on the page
- **THEN** the live preview SHALL display the sections in the new order

### Requirement: Preview access depends only on the viewer's session
Access to draft content SHALL depend only on the viewer's authenticated editor session. The editor UI MUST NOT provide a shareable preview link, token, or other credential that grants a visitor access to draft content.

#### Scenario: Editor shares a draft URL with a visitor
- **WHEN** an editor copies a draft content's normal public URL and a visitor requests that URL without an authenticated editor session
- **THEN** the visitor SHALL receive the same not-found response as for nonexistent content

#### Scenario: Editor session ends while viewing a draft
- **WHEN** a viewer's authenticated editor session ends and the viewer requests the draft URL again
- **THEN** the site SHALL treat the viewer as a visitor and SHALL return the not-found response
