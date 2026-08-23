## Why

Four editor-facing capabilities are implemented and running but have no behaviour contract: the sectioned site-settings surface, site identity details, the four code-injection slots, and search metadata on posts. Nothing describes what they must do, so nothing protects them. A future change can silently regress any of them and every gate will still pass — which is exactly how the media pipeline shipped a sixteen-times byte regression behind a green build.

This change is a **capture of shipped behaviour**, not a proposal for new work. The implementation already exists and is verified; what is missing is the specification. Writing it now closes the gap between the code and the contract while the behaviour is still fresh and testable, rather than reconstructing it later from reading the implementation.

## What Changes

- Introduce `site-settings`: the settings surface is a group of sections rather than one page, each at its own address, each saving only its own stored record.
- Introduce `site-identity`: business address, telephone number, social accounts, and two logos distinguished by the background they are used against, plus the content manager using the dark-background logo for its own brand mark.
- Introduce `code-injection`: four named slots and the exact document position each one renders at.
- Modify `seo-and-discovery`: posts gain a search title and a search description with defined fallbacks, matching what pages already had.

No behaviour changes. No code changes. Every requirement written here describes something already observable in the running application, and each one is confirmed against it rather than inferred from source.

## Capabilities

### New Capabilities

- `site-settings`: The sectioned settings surface — which sections exist, that each has its own address, that opening the group lands on a section, and that saving one section cannot alter another's stored record.
- `site-identity`: Site-wide identity an editor maintains — postal address, telephone number, social accounts, and a logo for light backgrounds plus one for dark backgrounds, including where each logo is consumed.
- `code-injection`: Editor-supplied markup injected into every public page at four defined positions, and the behaviour when a slot has never been saved.

### Modified Capabilities

- `seo-and-discovery`: The per-record discovery settings and public metadata requirements currently describe a search title and description for pages only. Posts now carry both, with the search title falling back to the post title and the search description falling back to the post excerpt.

## Impact

Affected specs:

- `openspec/specs/site-settings/spec.md` (new)
- `openspec/specs/site-identity/spec.md` (new)
- `openspec/specs/code-injection/spec.md` (new)
- `openspec/specs/seo-and-discovery/spec.md` (modified)

Affected code: none. The following already implement this behaviour and are the reference for verifying each requirement:

- `src/routes/admin/settings/+layout.svelte`, `+page.server.ts`, and the five section directories under `src/routes/admin/settings/`
- `src/routes/admin/settings/site-meta/+page.server.ts` and `+page.svelte`
- `src/routes/admin/+layout.server.ts` and `+layout.svelte` for the brand mark
- `src/routes/(site)/+layout.svelte` and `src/lib/components/site/Footer.svelte` for the injection positions
- `src/routes/admin/posts/[id]/+page.server.ts` and `src/routes/(site)/blog/[slug]/+page.svelte` for post search metadata
- `pb_migrations/1700000210_post_seo_fields.js` for the post fields

Stored data: the `site_meta` global and the `code_injection` global both hold free-form JSON, so a slot or field that has never been saved reads as absent. Requirements must therefore state the unset behaviour rather than assume a value exists.
