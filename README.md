# PocketBase + SvelteKit marketing site boilerplate

A working starter for client marketing sites with PocketBase v0.39.11 as the content backend, SvelteKit 2 and Svelte 5 on the frontend, and a white-label editor UI. The built-in PocketBase dashboard is reserved for developers.

## Run locally

Install dependencies, then run the two processes in separate terminals:

```sh
npm run pb
```

```sh
npm run dev
```

Open:

- Site: http://localhost:5173
- Editor UI: http://localhost:5173/admin
- Developer dashboard: http://127.0.0.1:8090/_/

## Reach it over Tailscale

Both processes listen on `127.0.0.1` only. Tailscale publishes them to the tailnet:

```sh
tailscale serve --bg --https=5443 http://127.0.0.1:5173
tailscale serve --bg --https=5444 http://127.0.0.1:8090
```

- Site and editor UI: https://mac-studio.tailf993b3.ts.net:5443
- PocketBase API and dashboard: https://mac-studio.tailf993b3.ts.net:5444

`vite.config.ts` sets `server.allowedHosts` to `.ts.net` so Vite accepts the tailnet
`Host` header, and binds `127.0.0.1` because Tailscale proxies to IPv4 loopback.
Nothing is exposed to the public internet or the local LAN.

Turn it off with `tailscale serve --https=5443 off` and `--https=5444 off`.

## Seeded credentials

| Access | Email | Password |
| --- | --- | --- |
| Editor UI | `editor@example.com` | `changeme123` |
| PocketBase superuser | `admin@example.com` | `changeme123` |

Change both passwords before using this project outside local development.

## Collections

- `pages` — editors compose pages from reusable sections, organize them with `parent` and `path`, and set `ogImage`, `canonical`, and `noindex`
- `posts` — editors write draft or published articles, choose a `coverImage`, and set `ogImage`, `canonical`, and `noindex`
- `globals` — editors manage header, footer, code-injection, and `seo` settings; `seo.defaultOgImage` supplies the site-wide fallback image
- `media` — editors upload files, maintain their alt text, and record the stored width and height
- `editors` — admins manage editor accounts and assign roles
- `redirects` — admins maintain redirects from old paths to current destinations
- `forms` — editors configure forms shown in page sections and their notification settings
- `form_submissions` — editors review the submissions stored for each form
- `content_versions` — editors inspect version history for pages and posts


## Google reviews

### What it does

The reviews feature imports Google reviews from DataForSEO into the `reviews` collection. It publishes a filtered public JSON payload. Configuration lives at `/admin/reviews`.

### Getting a Place ID

Use [Google's Place ID finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder). CID and keyword lookups are available as fallbacks, but Place ID is the reliable option.

### Location coordinate

Enter the coordinate as `latitude,longitude`. Read the pair from the business's Google Maps URL, usually after the `@` symbol.

Nothing is geocoded automatically. The alternative required a third-party geocoding service with a one-request-per-second policy. That is a poor fit for a boilerplate cloned across many sites.

### Cost

DataForSEO bills per task. An incremental import is the default and is cheap. A full import requests the maximum depth and costs materially more. A full import is a deliberate choice, not a routine one.

### Two phases

Requesting an import submits a task and returns immediately. A scheduled job collects the result minutes later. Nothing blocks for a minute, and a restart while the import is in flight does not lose the task.

Scheduled collection needs `REVIEWS_COLLECT_URL`, `REVIEWS_SCHEDULER_SECRET`, `PB_SUPERUSER_EMAIL`, and `PB_SUPERUSER_PASSWORD` set, and stays off until they are; manual imports from the admin screen work without them.

### Imports never delete

Imports only create or update records. They never delete them. A review removed or edited on Google's side persists as last imported. This is the limitation of an import that only ever upserts.

### Dormant without credentials

Without both DataForSEO credentials, the screen reports that reviews are not configured and disables the import controls. No import can run.

### One import at a time

Only one import can be in flight. A second request is refused. A crashed import is reclaimed rather than wedging the feature.

## Media

### Delivery

Public images are served by the application at `/media/<recordId>/<storedFilename>/<width>.webp`. The permitted widths are 320, 640, 768, 1024, 1440, and 1920. Any other width returns 404. The output is WebP.

Variants are generated on the first request, cached, and then served with immutable caching headers. PocketBase's own `?thumb=` parameter is deliberately not used. It cannot encode WebP and re-encodes images as PNG. It also upscales images smaller than the requested width, which made it serve more bytes than the original.

### Uploads

Uploads accept several JPEG, PNG, WebP, or GIF files at once. Files can be chosen or dropped onto the upload card. Uploads do not ask for alt text. Add it per image from the library grid afterwards. The library shows how many images still lack it.

The 1920 pixel cap is applied at upload and is destructive. Every non-GIF upload is reduced to at most 1920 pixels wide. EXIF orientation is applied to the pixels and then stripped. Remaining metadata, including GPS location, is removed. An image narrower than 1920 pixels is never enlarged.

The submitted original is not retained and cannot be recovered. If a client uploads a wider master, it is gone after upload. GIFs are stored unmodified so animation survives, and are therefore not capped.

### Library

Each card has a selection checkbox. `Select all` and `Clear selection` manage the images shown, and `Delete selected` removes them in bulk.

Media can be deleted while a page still references it. The public page then omits the image.

Editors can rename a stored image from the media library at `/admin/media`. Click an image to open its settings, then enter a name stem, not a whole filename. The extension comes from the stored image rather than the name entered, and dots are removed so a name like `report.pdf` cannot become a second extension. PocketBase then normalises what remains: it lowercases the name, converts hyphens to underscores, and appends an unavoidable random suffix. Entering `northwind-hero` therefore stores something like `northwind_hero_eg15patmsc.webp`. Because the stored name can differ from what was typed, the media library shows the filename that was actually stored rather than the text entered. That filename appears in the image's public variant addresses.

Renaming preserves the image bytes, alt text, recorded dimensions, and identity. Pages, posts, and rich-text bodies that use the image keep working.

Renaming retires the previous addresses. Any previously shared or externally cached link to the image stops resolving and returns 404. Rename an image before publicising it, not after. Cached variants under the old name are no longer served and need no manual clearing.

### Variant cache

The variant cache lives at `.cache/media` in the project root, outside `pb_data`, and is gitignored. It is disposable. Every entry can be rebuilt from the stored image, so deleting it is safe and it never needs migrating.

The cache sits outside `pb_data` on purpose. PocketBase backups archive `pb_data` and must not carry regenerable files.

Variant addresses include the stored filename. It changes when an image is replaced or renamed, so a cached variant can never be served stale. No cache invalidation exists.

## Editor UI

The editor UI at `/admin` includes:

- Pages, with reusable sections and version history
- Posts
- A media library
- Forms and each form's submissions
- Redirects
- Site settings

Page and post lists are sortable and support bulk publish and unpublish actions.

Posts now match pages with a search title and search description alongside the social sharing image, canonical URL, and search-exclusion flag. An empty post search title falls back to the post title. An empty post search description falls back to the excerpt.

The Pages list and media library load one page at a time.

### Site settings

Site settings has five pages in this order. Each page saves only its own settings record.

| Section | URL |
| --- | --- |
| Site meta | `/admin/settings/site-meta` |
| Header | `/admin/settings/header` |
| Footer | `/admin/settings/footer` |
| Search and sharing | `/admin/settings/sharing` |
| Custom code | `/admin/settings/code` |

`/admin/settings` redirects to `/admin/settings/site-meta`, the first page.

Site meta stores the business address, phone number, social accounts as label-and-URL rows, and two logos. The light-background logo is used on the public site. The dark-background logo is used in the content manager sidebar because that surface is dark.

## Custom code

Site settings provides four custom-code slots:

- `head` — inside the page `<head>`
- `bodyStart` — immediately after the opening `<body>`, before the site header
- `footer` — inside the site footer, after its text and navigation
- `bodyEnd` — immediately before the closing `</body>`

## Roles

| Role | Access |
| --- | --- |
| `admin` | Full editor access, including publishing, editor and role management, and redirects |
| `editor` | Cannot publish or unpublish, modify published content, manage editors or roles, or manage redirects |

These restrictions are enforced by PocketBase API rules, not just hidden in the UI. A direct API call that exceeds an editor's role is rejected too.

## Add a section type

1. Add its field specification to `src/lib/sections.ts`.
2. Add its renderer in `src/lib/components/sections/`.
3. Register the renderer in `Sections.svelte`.

The shared specification drives the editor form and keeps stored section fields aligned with the frontend renderer.

Field kinds are `text`, `textarea`, `richtext`, `url`, `media`, `form`, and `list`. A `richtext` field gets the visual editor and is sanitized on save against the allowlist in `src/lib/richtext.ts`. A `media` field stores `{ kind, value }`; a bare string is legacy content and is read as a URL.

## Discovery routes

`sitemap.xml`, `robots.txt`, and `rss.xml` are generated per request. Publishing is reflected immediately, with no rebuild.

## Outbound email

Editor invitations, password resets, and form notifications use Resend's HTTPS API when `RESEND_API_KEY` is set. The deployment host drops outbound SMTP connections and PocketBase reports those timeouts asynchronously, which can make a dropped message look successful; HTTPS delivery makes failures visible to the request.

Set `SITE_URL` to the public site origin used in set-password links. Set `MAIL_SENDER_NAME` and `MAIL_SENDER_ADDRESS` for the sender identity. If either sender variable is unset, the migration leaves that existing PocketBase sender setting untouched. Mail is off when `RESEND_API_KEY` is unset; the stored SMTP settings remain available as a manual fallback.

## Deploying

Run PocketBase with a persistent volume mounted at `pb_data` so content and uploads survive restarts. Run the SvelteKit Node server beside PocketBase and point it at the PocketBase service URL.

`sharp` ships a platform-specific binary. The image that builds the app must match the image that runs it. A platform mismatch appears as a runtime failure in the resize route, not at build time.

### Public origin behind a proxy

Set adapter-node's `ORIGIN` to the public site origin, for example `ORIGIN=https://example.com`. Alternatively, set both `PROTOCOL_HEADER=x-forwarded-proto` and `HOST_HEADER=x-forwarded-host` and configure the proxy to send those headers.

Without this configuration, a site served over HTTPS can publish `Sitemap: http://example.com/sitemap.xml` in `robots.txt` and `http://` locations in `sitemap.xml`.

### Request size limit

The Docker image sets `BODY_SIZE_LIMIT=33554432`. Adapter-node otherwise defaults to 512 KiB, which rejects a normal image upload with a bare 413 before the app sees it. Keep this value above the 30 MiB upload batch limit in `src/lib/uploads.ts`.

### PocketBase security

Set a 32-character `PB_ENCRYPTION` value before saving sensitive settings. PocketBase uses it to encrypt settings stored in `_params` at rest.

A migration enables PocketBase's built-in rate limiter for password authentication and form submissions. Keep a reverse proxy in front as a second layer.

The seed migration creates the PocketBase superuser and editor. It uses `PB_SEED_SUPERUSER_PASSWORD` and `PB_SEED_EDITOR_PASSWORD` when provided; each otherwise falls back to `changeme123`. Leaving that development default on a public deployment is a live vulnerability.

### Backups

A migration configures built-in backups daily at 03:00 and retains seven scheduled backups. Configure the backup destination separately for each deployment. After moving file storage to S3, PocketBase's built-in backups no longer contain files.

### Environment promotion

`refresh` copies production into staging and scrubs customer data. `promote` copies reviewed content from staging into production's live database. Data moves down freely. Only content moves up.

`promotion.config.json` classifies every collection separately for each operation. A run is refused if any collection is missing instead of guessing. `users` is preserved on promote but scrubbed on refresh. That is why dispositions are per operation.

The revision workflow is: refresh, let the client review staging, then promote. Production remains editable throughout. An urgent production fix during the review window is expected and permitted. There is no lock that prevents production edits during a review. The content freeze is an honour system. If an editor changes production content after a refresh, promote overwrites it and reports what it overwrote rather than refusing to run. Refresh again before promoting when a review has run long.

The scripts use the `PROMOTE_PROD_*` and `PROMOTE_STAGING_*` variables in `.env.example`. The superuser email and password values are operation secrets. The running site never uses them.

Every promote reports the backup key it created before writing. Use that key for a whole-database rollback when the complete promote must be undone. Use per-record version history in the editor UI when only one overwritten page needs recovery.

PocketBase's scheduled retention covers only cron-created backups. Promote-created backups have distinguishable names and are pruned by the script's own policy. Neither retention policy can evict the other's backups.

After file storage moves to S3, PocketBase backups no longer contain uploaded files. Restoring a backup does not recover media. This is a real gap in the rollback story after that move and needs separate object-storage recovery.

### Scaling

Raise `ulimit -n` for the expected connection volume and set `GOMEMLIMIT` for the PocketBase process. Image conversion runs in the SvelteKit process, is memory-bound per operation, and is deliberately capped at two concurrent conversions. Give the app process memory headroom independently of PocketBase.

### Moving media to R2

Stored originals live in PocketBase. Move them by syncing `pb_data/storage` to the bucket root, then enable S3 in Dashboard → Settings → Files storage. Object keys must be `<collectionId>/<recordId>/<filename>`, not under a `storage/` prefix, or existing files return 404. Stop writes and do a final sync before switching. Anything uploaded between the copy and the switch would otherwise be missed.

After the switch, PocketBase's built-in backups no longer contain image files.

The variant cache is independent and needs no migration. Point it at the new location and let it regenerate.
