## Why

This boilerplate proves PocketBase can back a client marketing site, but it only covers the
minimum: pages with four section types, posts, globals, and a white-label admin. A real client
site needs the editorial features our Payload platform already provides — draft preview, a media
library, contact forms, version history, and role-gated publishing. Without them the boilerplate
cannot replace Payload for any live client, so the experiment stalls at "interesting demo".

Now is the right time because the audit of the Payload reference
(`nextjs-payload-boilerplate`) showed the gap is much smaller than expected: only two page blocks
are actually registered there, localization runs a single locale, and there is no frontend search
or scheduled publishing. Most of what remains is admin UI work on top of PocketBase primitives
(files with on-the-fly thumbnails, cron, SMTP, API rules) that already exist.

## What Changes

- **Draft preview and split-screen live preview.** An authenticated editor can view unpublished
  pages and posts at their real public URLs, and see a live-updating preview beside the section
  editor at mobile, tablet, and desktop widths.
- **Media library.** A new admin screen uploads, lists, replaces, and deletes files with alt text.
  Section image fields and the post cover field gain a picker. Thumbnails use PocketBase's
  built-in `?thumb=` parameter, so no image pipeline is added.
- **Rich text editing.** The `prose` section and post body replace raw HTML textareas with a
  WYSIWYG editor covering the same feature set the Payload reference enables: headings, bold,
  italic, underline, links, ordered and unordered lists, blockquote, horizontal rule, and inline
  images. Storage stays HTML, so existing content needs no migration.
- **Contact forms.** A form builder defines fields, a `form` section places a form on any page,
  submissions are stored, and a notification email is sent through PocketBase SMTP.
- **Version history.** Every page and post save snapshots the previous record. Editors can view
  and restore prior versions. Retention is capped at 50 per document, matching the Payload
  reference.
- **Role-gated publishing.** The existing `editor` role loses the ability to publish, unpublish,
  change published content, manage other editors, and manage redirects. Those stay with `admin`.
- **URL redirects.** An admin screen manages `from` to `to` redirects, applied before page lookup.
- **SEO and discovery.** Pages and posts gain OG image, canonical URL, and noindex fields. The
  site gains generated `sitemap.xml`, `robots.txt`, and an RSS feed.
- **Page hierarchy.** Pages gain an optional parent, producing nested URLs and breadcrumbs. Slugs
  auto-generate from the title instead of today's random `page-xxxx`.
- **List management.** Page and post lists gain sortable columns and bulk publish/unpublish.

Explicitly out of scope, because the Payload reference does not use them or PocketBase covers them
already: localization (Payload runs one locale), frontend site search (no Payload UI exists),
scheduled publishing (absent from Payload), magic-link auth (PocketBase OTP is a config toggle),
and an audit log (PocketBase already logs authenticated writes).

No change is marked **BREAKING**. Section `image` fields accept either a media record id or a
plain URL, so seeded content keeps working. The seeded editor holds the `admin` role and so keeps
every permission it has today.

## Capabilities

### New Capabilities
- `content-preview`: viewing unpublished pages and posts, and live preview beside the editor
- `content-versioning`: snapshotting, listing, and restoring prior versions of pages and posts
- `editorial-roles`: which role may publish, manage editors, and manage redirects
- `media-library`: uploading, browsing, selecting, and serving resized media
- `rich-text-editing`: WYSIWYG authoring of the prose section and post body
- `forms`: defining forms, placing them on pages, storing submissions, notifying by email
- `page-hierarchy`: parent pages, nested URLs, breadcrumbs, and slug generation
- `seo-and-discovery`: per-record SEO metadata plus generated sitemap, robots, and RSS
- `content-list-management`: sorting and bulk status changes in admin list screens

### Modified Capabilities

None. This repository has no existing specs under `openspec/specs/`, so every capability above is
introduced by this change.

## Impact

- **Database schema** — `pb_migrations/`: new `redirects`, `forms`, `form_submissions`, and
  `content_versions` collections. New fields on `pages` (parent, ogImage, canonical, noindex) and
  `posts` (ogImage, canonical, noindex). Revised API rules on `pages`, `posts`, `redirects`, and
  `editors` to gate publishing by role.
- **Shared contract** — `src/lib/sections.ts`: new field kinds (`media`, `richtext`, `form`) and a
  new `form` section type. Both the admin form renderer and the public section renderer consume
  this file, so it changes first and both sides follow.
- **Admin UI** — `src/routes/admin/`: new `media`, `redirects`, `forms`, and version-history
  screens; changes to the page and post editors, both list screens, and the layout navigation.
- **Public site** — `src/routes/(site)/`: preview-aware loaders, breadcrumbs, a form section with
  a submit action, and new `sitemap.xml`, `robots.txt`, and `rss.xml` routes.
- **Request handling** — `src/hooks.server.ts`: redirect lookup before routing.
- **Dependencies** — one new dependency for the rich text editor. Everything else uses PocketBase
  built-ins.
- **Operations** — notification email requires SMTP configured in PocketBase settings. Forms must
  store the submission even when email delivery fails.
- **Documentation** — `README.md`: new collections, new screens, the SMTP prerequisite, and the
  role model.
