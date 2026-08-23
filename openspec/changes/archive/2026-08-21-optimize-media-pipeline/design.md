## Context

See proposal.md — Why for the motivation and the measured numbers.

Three constraints shape everything below.

**PocketBase cannot encode WebP.** Its thumb engine decodes a WebP upload and re-encodes as PNG because Go has no native WebP encoder (pocketbase discussion #2647, issue #825; partial support landed in v0.27.1 with PNG output as the documented behavior). This is not configurable.

**PocketBase's thumb engine has no enlargement guard.** Measured against a 522x480 WebP of 85 KB, requesting the four declared thumb sizes produced 400x300 PNG at 148 KB, 768x706 at 496 KB, 1024x942 at 736 KB, and 1600x1471 at 1340 KB. Every declared size upscaled, and every one was larger than the original.

**Requesting an undeclared size returns the original.** The documented fallback is silent. `?thumb=1920x0` and `?thumb=800x600` both returned the untouched 85 KB WebP with no error, which is why two call sites requesting no size at all went unnoticed.

Current state: `media.file` declares thumbs `400x300`, `768x0`, `1024x0`, `1600x0`. Only three are ever requested. `ogImage` and rich-text images request none. Nothing emits `srcset`. Originals are stored uncapped on local disk.

## Goals / Non-Goals

**Goals:**

- Never deliver more bytes than the stored image for any request.
- Make upscaling structurally impossible rather than merely avoided.
- Keep the later move to R2 a configuration change, not a migration.
- Require no backfill of existing media records.

**Non-Goals:**

- AVIF output. Deferred, and additive later because the format is part of the URL.
- Retaining a pre-cap master. Explicitly rejected in D9.
- Moving originals off local disk. R2 stays a documented later step.
- Any change to how media is picked, referenced, or permission-checked.

## Decisions

### D1: Convert in the SvelteKit upload path, not inside PocketBase

Encoding must happen in the Node process, because that is the only place a native image library can run.

Alternatives considered:

- **PocketBase JS hooks.** Impossible. Hooks run in a Go-hosted JS interpreter with no native modules, so no image codec is reachable.
- **A custom Go build of PocketBase.** Technically possible via `pocketbase.New()`, but WebP encoding needs cgo and libwebp. That forfeits the single static binary, adds a per-site Go build pipeline, and puts us on the hook for tracking upstream releases. Rejected as disproportionate.

### D2: Abandon the thumb engine entirely rather than work around it

`field.thumbs` is cleared and no `?thumb=` call site remains.

Alternatives considered:

- **Normalize uploads to JPEG so the engine behaves.** Works for format, but the engine still upscales, so it also needs stored dimensions and clamping at every call site. It gives up WebP on the wire, and it forces per-image alpha handling to avoid flattening transparent logos onto black. More moving parts than owning the resize, for a worse result.
- **Keep the engine for the admin grid only.** Leaves the trap loaded. Any future call site can silently reintroduce a 16x regression, exactly as happened here.

Clearing the declared thumbs is what makes the defect unreachable rather than merely unused.

### D3: Generate variants on demand and cache them, rather than pre-generating a stored ladder

Alternatives considered:

- **Eager ladder at upload.** Requires a variants schema or a multi-file field, a backfill of existing media, cleanup on delete, and it moves conversion cost into the upload request. With multi-file upload that is roughly five sharp operations per file in one POST.
- **No variants, just the capped original.** Cheapest, but a phone still downloads a 1920px file and there is no `srcset`.

On-demand pays for a variant once, only for widths actually requested, needs no schema for variants, and needs no backfill.

### D4: Address variants by a path containing the stored filename

PocketBase already appends a random token to every stored filename, so the token changes whenever the bytes change.

This makes the cache content-addressed, which removes an entire subsystem: no invalidation, no purge, no cache versioning, no delete hooks. A stale entry cannot be served because changed content has a different address. Old entries become unreferenced garbage instead of wrong answers, which is also why deletion needs no cache cleanup for correctness.

### D5: Put the output format in the URL, not in content negotiation

Rejected: reading `Accept` and returning WebP or AVIF from one URL. That requires `Vary: Accept`, which fragments CDN cache entries across browser variations and weakens the immutable-caching win. Explicit per-format URLs inside `<picture>` let the browser choose, keep one cache key per artifact, and make adding AVIF later purely additive.

### D6: Treat the width list as a security boundary

Widths are restricted to 320, 640, 768, 1024, 1440, 1920 and anything else is a 404.

Without this, `/media/<id>/<file>/<n>.webp` is an unauthenticated endpoint that runs an image decode and writes a file for any integer an attacker supplies. That is both CPU exhaustion and unbounded disk growth. The list is not tuning; it is the reason the route is safe to expose.

Note the symmetry with what we are removing: we end up declaring a size list much like `field.thumbs`. The difference is that ours is enforced with a 404, clamped to the source width, and emits the format we asked for, where PocketBase's silently served the original and upscaled.

### D7: Deduplicate in-flight generation, and write cache files atomically

Sharp's memory cost is per operation. Ten simultaneous first requests for a cold hero mean ten concurrent decodes, and that — not CPU — is the realistic out-of-memory failure. A map from cache key to in-flight promise reduces it to one.

Writes go to a temporary path and are renamed into place. Without that, a crash mid-write leaves a truncated image at a valid address, and immutable caching headers mean it is served that way indefinitely.

### D8: Keep cache I/O in one module, outside `pb_data`

Explicitly **not** a storage driver interface, an adapter pattern, or configurable backends. One file with a read path and a write path, because that is where those two operations belong regardless of whether R2 ever happens. The consequence is that swapping to R2 edits one file instead of hunting filesystem calls through a route.

The directory lives outside `pb_data` so PocketBase backups do not archive hundreds of regenerable derivatives, and so a restore does not resurrect a stale cache.

No eviction is built. Roughly 40 images at 6 widths is about 240 files and 15 to 25 MB, which is not worth a policy. Deleting by modification time is available later if it ever matters.

### D9: Cap at 1920 on the way in, and never enlarge anything smaller

The cap exists because clients upload whatever their phone or camera produced. A 24 megapixel original is common, and without a cap every one of those is stored forever, included in every backup, and read in full on each cache miss. Capping once at intake bounds all three at the point where the cost is paid a single time.

The cap is one-directional. An image narrower than 1920 is stored at its own width, never stretched to meet the ceiling. This is the same defect being removed from the serving path: PocketBase upscaled a 522 pixel image to 1600 and charged 16x the bytes for it. Enlarging on intake would bake that waste into storage permanently instead of merely serving it.

The trade is that the stored image is the capped image. A wider master is not retained and cannot be recovered. Accepted deliberately: 1920 covers full-width heroes on ordinary displays, and the alternative is keeping two copies of every upload to serve a case that marketing pages do not have. 1920 was chosen over 2560, and the cost is less headroom for 2x pixel density on a full-bleed hero.

Note that the cap and the serving clamp are independent guards. Variants are clamped to the source width regardless, so a client who somehow bypassed the cap still could not cause an upscale.

### D10: GIFs pass through untouched

Resizing a GIF through sharp reads only the first frame, silently converting an animation to a still. Passing GIFs through preserves animation at the cost of leaving them uncapped. The existing 10 MiB field limit remains the only bound on a GIF, and that is accepted.

### D11: Bound concurrent conversion at two

Applies to both upload intake and cache misses, for the memory reason in D7. Multi-file upload makes this load-bearing rather than theoretical: six dropped files must all succeed without six simultaneous decodes.

### D12: Never return more bytes than the stored image

A hyper-compressed WebP source can re-encode larger than it started, especially when no downscale is needed. Rather than let that edge case reintroduce the exact pathology being fixed, the encoded result is compared against the stored image and the smaller one wins.

This is why the spec's WebP requirement carries an exception instead of being absolute. Getting these two requirements to coexist is what surfaced the conflict.

### D13: Record dimensions on the media record

Width and height are recorded at upload. They serve the clamp, and they let public markup carry intrinsic `width` and `height` so images stop causing layout shift.

Existing records have no dimensions. Rather than backfill, they are measured on demand when first needed, which keeps this change free of a data migration.

## Risks / Trade-offs

- **Sharp is a native binary; the deployment image may not match the build platform** → pin the platform in the container build and verify the resize route in the deployed image, not only locally. This is the standard sharp-in-Alpine failure.
- **Per-conversion memory spikes exhaust a small VM** → D11 bounds concurrency, and the existing 10 MiB input limit bounds each operation's size.
- **The destructive cap is irreversible per upload** → documented in the README as a stated property, not a surprise. Mitigation is the generous ceiling, not recoverability.
- **Uncapped GIFs remain possible** → bounded only by the 10 MiB field limit. Accepted per D10.
- **Social networks hold cached Open Graph URLs from before the change** → the old PocketBase file URLs keep working, since only the emitted metadata changes and originals stay in place.
- **Empty alt text becomes the common case once bulk upload exists** → the missing-alt count is the mitigation, and it is a visible signal rather than an enforced gate. If it proves insufficient, blocking publish is a later change.
- **The cache directory grows unbounded in principle** → bounded in practice by the fixed width list times the media count; see D8.

## Migration Plan

Deploy order matters, because clearing declared thumbs makes every existing `?thumb=` URL return an original.

1. Add the resize route, the cache module, and the width list. Nothing consumes them yet.
2. Move every consumer off `?thumb=` and onto the route: hero, blog cover, the three `ogImage` sites, rich text, the media grid, and the picker.
3. Only then run the migration that clears `thumbs` on `media.file` and adds `width` and `height`.
4. Add normalization to the upload path, then multi-file intake and the queue.

Reversing steps 2 and 3 leaves a window where the site serves full originals everywhere.

Rollback: the migration's down step restores the previous declared thumbs, and reverting the consumer changes restores `?thumb=` URLs. Cached variants and recorded dimensions are inert after a rollback — one is a cache, the other an unread column — so no data is stranded.

No backfill runs. Existing media generate variants on first request, and dimensions are measured on demand per D13.

## Open Questions

- Whether the variant cache should later move to R2 alongside the originals, or stay on local disk with a CDN in front. Deferrable because D8 confines the decision to one module and D3 means there is nothing to migrate.
- Whether AVIF is worth adding once WebP is proven in production. Deferrable because D5 makes format an additive URL dimension.
