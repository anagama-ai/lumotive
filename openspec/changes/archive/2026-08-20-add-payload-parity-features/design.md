## Context

See `proposal.md` — Why. This document covers only the technical decisions.

Current state that shapes the approach:

- PocketBase 0.39.11 runs as a single process with SQLite at `pb_data`. Schema lives in
  `pb_migrations/*.js`, applied on `serve`. There is no `pb_hooks/` directory yet.
- SvelteKit 2 with `adapter-node` renders every public page server-side per request. There is no
  build step for content, which is the property the whole experiment exists to preserve.
- `src/lib/sections.ts` is the single source of truth for section shapes. The admin form renderer
  (`SectionField.svelte`) and the public renderer (`Sections.svelte`) both derive from it. Any new
  field kind must be added there first, or the two sides drift.
- `src/hooks.server.ts` already loads editor auth from the `pb_auth` cookie and attaches an
  authenticated client to `event.locals`, so preview and role checks have a session to read.
- Access control today is entirely in PocketBase API rules. Nothing is enforced only in the UI.

Constraints:

- PocketBase's JS hook VM is goja: ES5, CommonJS, no `fetch`, `fs`, or `Buffer`, no npm. Hooks must
  stay small and dependency-free.
- PocketBase is pre-1.0 and does not guarantee backward compatibility, so we avoid undocumented
  surfaces — notably the admin UI extension APIs, which the changelog states are intentionally
  undocumented.
- One PocketBase instance, one writer. No horizontal scaling.

## Goals / Non-Goals

**Goals:**

- Enforce every access rule in PocketBase API rules so a direct API call cannot bypass the UI.
- Keep the public read path to a single indexed query per page, preserving instant publish.
- Add no data migration. Existing seeded content must keep rendering unchanged.
- Keep new dependencies to the minimum, and only where hand-rolling would be a security risk.
- Keep `sections.ts` the only place a section shape is defined.

**Non-Goals:**

- No customization of PocketBase's own dashboard. It stays a developer tool.
- No caching layer, queue, or background worker beyond PocketBase's built-in cron.
- No multi-instance or high-availability design. Out of PocketBase's supported topology.
- No abstraction layer over PocketBase. Collections are used directly.

## Decisions

### D1. Rich text: Tiptap in the browser, allowlist sanitize on the server

Tiptap (ProseMirror) with StarterKit plus Underline, Link, and Image extensions covers the exact
feature set the spec requires, and its `getHTML()` output matches the HTML we already store, so no
content migration is needed. ProseMirror parses into a fixed schema and silently drops nodes and
marks it does not know, which handles the common case of pasted junk.

That is not a security boundary. A hostile or careless editor can post arbitrary HTML straight to
the API, and the public site renders stored rich text with `{@html}`. So the save path also runs a
server-side allowlist sanitizer restricted to the supported elements and attributes. Rich text is
sanitized on write, not on read, so the public path stays cheap.

Alternatives: Lexical is what the Payload reference uses, but its tooling is React-oriented and it
would be the heavier integration in Svelte. Quill's native format is its own Delta document, which
would force a storage change. A hand-rolled `contenteditable` was rejected because `execCommand` is
deprecated and it would make HTML sanitization entirely our problem.

We take a maintained sanitizer as a dependency rather than writing one. Hand-rolled HTML
sanitization is the canonical example of a corner that must not be cut.

### D2. Images: PocketBase thumbs, no image pipeline

The `media.file` field declares a fixed thumb set and the public site requests a variant by
appending the `thumb` query parameter to the file URL. PocketBase generates and caches variants on
demand. This replaces Payload's four generated WebP derivatives with zero code and no storage
plugin.

Widths mirror the Payload reference so page weight is comparable: a small admin thumbnail, plus
card, tablet, and desktop widths. Exact dimensions are tunable later without touching specs.

### D3. Image field value: a tagged object, with legacy strings still read as URLs

The `image` field kind currently stores a bare URL string. New saves write
`{ kind: "media", value: "<record id>" }` or `{ kind: "url", value: "https://…" }`. A value that is
still a plain string is read as a URL.

This keeps seeded content working with no migration and no ambiguity. The rejected alternative was
sniffing whether a string looks like a record id or a URL — it works today but is a guess, and
guesses in a render path fail silently.

### D4. Versioning in a PocketBase hook, not in the save action

`content_versions` stores the collection name, record id, a JSON snapshot, and the acting editor.
Both the snapshot and the 50-per-record trim live in `pb_hooks/versions.pb.js`, using the update
event's access to the pre-update record state.

Putting this in the hook rather than the SvelteKit form action means history is recorded for every
write path — the admin UI, a direct API call, a future import script — instead of only the one screen
we remember to wire up. Retention is an invariant of the data, so it belongs with the data.

This introduces `pb_hooks/` to the project. Hooks stay small and ES5 because of the goja VM.

### D5. Role gating expressed in API rules

Publishing permission is encoded in the `pages` and `posts` update rules, along the lines of "the
acting editor holds the admin role, or the record is currently a draft and this request does not
publish it". Editor management and redirect management gate on the admin role the same way.

The admin UI additionally hides controls the current role cannot use, but that is ergonomics. The
rule is the enforcement, which is what makes the "direct API request is rejected" scenario pass.

These rule expressions are the highest-risk detail in this change. They must be verified with
direct API calls per role, not by clicking the UI.

### D6. Redirects resolved only on a miss

Redirect lookup happens when a page lookup finds nothing, not on every request. A site with no
broken links pays nothing; a 404 pays one extra indexed query. The rejected alternative — checking
the redirects table on every request — adds a query to every page view to serve a rare case.

### D7. Live preview reuses the real public renderer

The section editor holds an iframe pointing at the page's own URL, and posts the in-editor section
state into it. The public page applies posted state only when it is framed and an editor session is
present.

The point is that preview and production are the same renderer, so preview cannot drift. Rendering
sections a second time inside the admin would guarantee drift, which is the failure mode that makes
a preview feature worthless.

### D8. Forms reuse the section field-spec pattern; email is sent from a hook

A form's fields are stored as a JSON array using the same field-spec shape as `sections.ts`, so the
existing recursive spec-driven field renderer in the admin is reused rather than duplicated. One
mental model covers both sections and forms.

Notification email is sent from a PocketBase hook on submission create, using PocketBase's built-in
mail client. That decouples delivery from the visitor's HTTP response, which is exactly what the
"submission is stored even when email fails" requirement needs. It also means no email service
dependency.

Server-side validation runs in the submit action before the record is created, independent of any
browser validation.

### D9. Generated files are request-time routes

`sitemap.xml`, `robots.txt`, and `rss.xml` are server routes that query PocketBase per request and
set an explicit content type and cache header. No build step, consistent with the rest of the
system: publishing a page makes it appear immediately.

### D10. Page paths are denormalized to one indexed column

A page keeps a single-segment `slug` plus a `parent` relation, and also stores its full computed
`path` in a unique indexed field. Public lookup is one query on `path`.

The alternative — walking the tree per request — costs one query per URL segment on every page
view, and cannot resolve a nested URL without descending from the root. Reads massively outnumber
writes here, so the write side absorbs the cost: changing a page's slug or parent recomputes `path`
for that page and its descendants. Cycle prevention is checked before the write.

This is the only place in the design where we accept extra write complexity for read simplicity,
and it is worth stating that it is deliberate.

### D11. Additive migrations only

Every schema change is a new migration file with a working down function. No existing field changes
type, and no existing record is rewritten. The seeded content and the seeded admin editor keep
working untouched.

## Risks / Trade-offs

- **ProseMirror's schema is mistaken for security** → Server-side allowlist sanitizing on write is
  the actual boundary. The editor schema is convenience only. Both are required; neither is
  sufficient alone.
- **Role-gating rule expressions are subtly wrong and silently permissive** → Verify each rule with
  direct API calls as both roles, including the publish, unpublish, and edit-published cases. UI
  verification is not acceptable evidence for this item.
- **Recomputing descendant paths misses a branch, orphaning URLs** → Bound the recursion, and verify
  with a three-level tree by reparenting a middle node and checking every descendant URL.
- **A failed version-trim hook grows `content_versions` without bound** → The trim is an invariant,
  so back it with a periodic sweep rather than trusting a single code path.
- **`pb_hooks/` code is ES5 goja with no npm and different failure modes than app code** → Keep
  hooks minimal: snapshot, trim, send mail. Anything requiring libraries stays in SvelteKit.
- **Two new dependencies in a project whose selling point is being small** → Both serve the rich
  text path only, and one of them exists specifically because hand-rolling it would be unsafe.
- **SMTP is not configured, so notification email silently does nothing** → Submissions are stored
  regardless, and the README documents SMTP as a prerequisite for notifications specifically.
- **Deleted media leaves references behind** → Defined as rendering nothing rather than erroring, so
  a missing image never takes a page down.
- **Nine capabilities in one change is a large surface** → The capabilities are independent; the
  task breakdown sequences the shared contract and schema first, then parallel feature work.

## Migration Plan

1. Additive migrations create `redirects`, `forms`, `form_submissions`, and `content_versions`, and
   add the new fields to `pages` and `posts`. Existing records take zero values.
2. A follow-up migration backfills `path` for existing pages from their current slugs, so every
   current URL keeps resolving.
3. Revised API rules for role gating land with the schema, before the UI that depends on them.
4. `pb_hooks/` is added for versioning and form notification email.
5. `sections.ts` gains the new field kinds, then admin and public UI work proceeds against it.

Rollback: run the migration down functions and remove `pb_hooks/`. New fields are additive, so the
previous application version ignores them and keeps rendering. The one exception is `path`, which
the new public lookup depends on — rolling back the app without rolling back the data is safe,
because the old lookup uses `slug`, which is untouched.

## Open Questions

- Exact thumb dimensions for the media variant set. Tunable after measuring real page weight;
  changes no spec, approach, or task.
- Whether the version-history UI should later extend to `globals`. Out of scope here, and adding it
  later requires no rework of these decisions.
