## 1. Shared contract and dependencies

- [x] 1.1 Add the `media`, `richtext`, and `form` field kinds and the `form` section type to `src/lib/sections.ts`, and change the `image` kind's stored value to the tagged object from design D3 while still reading a bare string as a URL
- [x] 1.2 Add the rich text editor and the server-side HTML sanitizer dependencies, and record the allowed element and attribute set in one shared module both the editor config and the sanitizer read from
- [x] 1.3 Add a `siteDefaultOgImage` field to the `header` or a new `seo` global so the SEO fallback in `seo-and-discovery` has a source

## 2. Schema, rules, and backfill

- [x] 2.1 Write an additive migration creating `redirects` with `from`, `to`, and an active flag, with a unique index on `from`
- [x] 2.2 Write an additive migration creating `forms` (name, fields JSON, confirmation message, notification recipients) and `form_submissions` (form relation, values JSON, created), with submissions readable only to authenticated editors
- [x] 2.3 Write an additive migration creating `content_versions` with collection name, record id, snapshot JSON, and acting editor, denying all visitor read access
- [x] 2.4 Write an additive migration adding `parent`, `path`, `ogImage`, `canonical`, and `noindex` to `pages`, with a unique index on `path`
- [x] 2.5 Write an additive migration adding `ogImage`, `canonical`, and `noindex` to `posts`
- [x] 2.6 Declare the thumb size set on the `media.file` field per design D2
- [x] 2.7 Write a backfill migration setting `path` for every existing page from its current slug, so all current URLs keep resolving
- [x] 2.8 Revise the `pages` and `posts` update and create rules so the editor role cannot publish, unpublish, or modify published records, per design D5
- [x] 2.9 Revise the `editors` and `redirects` rules so only the admin role may manage them
- [x] 2.10 Verify every rule from 2.8 and 2.9 with direct API calls as each role, covering publish, unpublish, and edit-published — UI clicking is not acceptable evidence for this task

## 3. PocketBase hooks

- [x] 3.1 Create `pb_hooks/versions.pb.js` snapshotting the pre-update state of `pages` and `posts` into `content_versions` on every update, from any write path
- [x] 3.2 Extend the hook to trim `content_versions` to the newest 50 per record, and to delete a record's versions when the record is deleted
- [x] 3.3 Add a scheduled sweep that enforces the 50-version cap independently of the update hook, per the risk noted in design
- [x] 3.4 Create `pb_hooks/form_notify.pb.js` sending the notification email on `form_submissions` create using the built-in mail client, failing without affecting the stored submission

## 4. Media library

- [x] 4.1 Build the `/admin/media` screen: upload with alt text, list with thumbnails, edit alt text, delete
- [x] 4.2 Enforce the image type allowlist and size cap server-side, returning a reason on rejection
- [x] 4.3 Add a media picker control and wire it to the `media` field kind in the admin field renderer
- [x] 4.4 Replace the post cover field's absence with a media picker in the post editor
- [x] 4.5 Resolve both tagged media values and legacy URL strings in the public section renderer, requesting a sized variant for media items and rendering nothing when a referenced item is missing

## 5. Rich text

- [x] 5.1 Build the WYSIWYG control supporting exactly the feature set in `rich-text-editing`, including remove-formatting and links accepting relative and absolute targets
- [x] 5.2 Wire the control to the `richtext` field kind and to the post body, replacing both HTML textareas
- [x] 5.3 Sanitize rich text against the shared allowlist in every save path that writes it, and verify that a script element and an event-handler attribute submitted directly to the API are not persisted
- [x] 5.4 Confirm content authored before this change opens unchanged and survives a save without corruption

## 6. Draft and live preview

- [x] 6.1 Make the public page and post loaders return draft records when an editor session is present, and keep returning not-found to visitors
- [x] 6.2 Add the preview pane to the page editor with mobile, tablet, and desktop widths and a width switcher
- [x] 6.3 Post in-editor section state into the preview frame and apply it in the public renderer only when framed with an editor session, so unsaved edits, reorders, additions, and removals appear without saving

## 7. Forms

- [x] 7.1 Build the `/admin/forms` screens: create and name a form, define fields with type, label, and required flag, reorder and remove fields, set the confirmation message and notification recipients
- [x] 7.2 Build the public form section renderer and its submit action
- [x] 7.3 Implement server-side validation of required values and email format, rejecting with per-field errors and storing nothing, and verify with a request that bypasses the browser
- [x] 7.4 Build the submissions viewing screen for authenticated editors
- [x] 7.5 Implement the defined behavior for deleting a form that has submissions and is still placed on a page

## 8. Page hierarchy

- [x] 8.1 Add the parent selector to the page editor and reject any selection creating a cycle, with an explanatory error
- [x] 8.2 Compute `path` on save and recompute it for all descendants when a slug or parent changes, bounding the recursion
- [x] 8.3 Switch the public page lookup to the single indexed `path` query and keep the home page at `/`
- [x] 8.4 Render breadcrumbs linking each ancestor
- [x] 8.5 Generate slugs from the title on create, keep them editable, enforce sibling uniqueness deterministically, and handle an empty title without producing an empty or colliding slug
- [x] 8.6 Reject deleting a page while it has children, naming the obstacle
- [x] 8.7 Verify a three-level tree by reparenting a middle node and checking every descendant URL

## 9. Redirects

- [x] 9.1 Build the `/admin/redirects` screen, restricted to the admin role
- [x] 9.2 Apply redirects only when a page lookup finds nothing, per design D6

## 10. SEO and discovery

- [x] 10.1 Add the social image, canonical, and exclude-from-search controls to the page and post editors
- [x] 10.2 Emit the metadata on public pages with fallbacks to the record title and the site default image, and emit the noindex directive when set
- [x] 10.3 Add the `sitemap.xml` route listing published records with modification times, excluding drafts and excluded records
- [x] 10.4 Add the `robots.txt` route pointing at the sitemap
- [x] 10.5 Add the `rss.xml` route listing published posts newest first
- [x] 10.6 Set the correct content type on each generated file and confirm an empty site still produces valid output

## 11. Roles and list management in the admin UI

- [x] 11.1 Hide or disable every admin-only control and screen for the editor role, so no control is shown that will fail
- [x] 11.2 Add version history to the page and post editors: list snapshots newest first with time and acting editor, and restore one
- [x] 11.3 Add sortable title, status, and last-modified columns to the page and post lists, persisting the chosen sort while on the screen
- [x] 11.4 Add multi-select with select-all and clear-selection to both lists
- [x] 11.5 Add bulk publish and unpublish reporting how many records changed, doing nothing on an empty selection, and reporting per-record outcomes on partial failure
- [x] 11.6 Confirm a role that cannot publish cannot publish in bulk, and that the attempt is rejected rather than partially applied

## 12. Verification

- [x] 12.1 Apply all migrations against a fresh `pb_data` and confirm the seeded content and seeded admin editor still work unchanged
- [x] 12.2 Apply all migrations against the existing `pb_data` and confirm every existing page URL still resolves after the `path` backfill
- [x] 12.3 Drive the full editor journey in a browser: upload media, place it in a section, author rich text, preview a draft, publish, and confirm the live page
- [x] 12.4 Submit a form as a visitor with email delivery unavailable and confirm the submission is stored and success is shown
- [x] 12.5 Run the type check and the production build
- [x] 12.6 Re-verify the role matrix by direct API call as a final gate

## 13. Documentation

- [x] 13.1 Document the new collections, the new admin screens, and the role model in `README.md`
- [x] 13.2 Document SMTP configuration as the prerequisite for form notification email, and state that submissions are stored without it
- [x] 13.3 Update the add-a-section instructions to cover the new field kinds
