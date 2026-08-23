## Why

Public image delivery is measurably worse than serving the untouched upload. PocketBase's built-in thumb engine cannot encode WebP, so it decodes a WebP upload and re-encodes it as PNG, and it has no enlargement guard, so it upscales images smaller than the requested width. Measured against a real 522x480 WebP upload of 85 KB, the hero request `?thumb=1600x0` returns a 1600x1471 PNG of 1340 KB: sixteen times the bytes for a blurrier picture. Two other call sites request no size at all and serve the full original, including the Open Graph image that social crawlers fetch and the images embedded in article bodies.

None of this was caught during the build because the existing `media-library` requirement "Serve resized public images" only obliges the response to contain a resized image. It says nothing about the result being smaller than the original, about refusing to upscale, or about the encoded format. The API returned 200, the image rendered, and the bytes were wrong.

## What Changes

- **BREAKING** Remove the declared thumb sizes from the `media.file` field and stop using PocketBase's `?thumb=` parameter anywhere. Its WebP-to-PNG re-encoding and unguarded upscaling cannot be configured away, and leaving the parameter available means a future call site can silently reintroduce the defect.
- Normalize every upload once, on the way in: apply and then strip EXIF orientation, remove remaining metadata including GPS coordinates, and cap the stored image at 1920 pixels wide without enlarging anything smaller. Record the resulting pixel dimensions on the media record.
- **BREAKING** The stored original is the capped image. A wider master is not retained and cannot be recovered after upload.
- Serve public images from an application-owned route that resizes on demand and caches the result. Widths are restricted to a fixed list, requested widths are clamped to the source width so upscaling is impossible, and output is WebP.
- Cache variants as disposable files outside `pb_data`, addressed by a path that includes the stored filename. Because PocketBase appends a random token to every stored filename, a replaced image produces a different path, so cached entries can never be stale and no invalidation logic is required.
- Serve variants with immutable caching headers, deduplicate concurrent generation of the same variant, and write cache files atomically.
- Emit `srcset` for public images so a phone stops downloading desktop-width files.
- Fix the two call sites that serve full originals: the Open Graph image and images embedded in rich text.
- Accept multiple files in one upload interaction, including by dragging them onto the library, and process them through a queue that converts at most two at a time. Sharp's memory cost is per operation, so unbounded concurrency is the realistic failure mode.
- Surface a count of media items missing alt text, because bulk upload makes empty alt text the default outcome rather than a deliberate one.
- Pass GIF uploads through unmodified. Resizing a GIF discards every frame after the first, so animation is preserved at the cost of leaving GIFs uncapped.

## Capabilities

### New Capabilities

None. Public image delivery already belongs to `media-library`.

### Modified Capabilities

- `media-library`: Uploads gain normalization, recorded dimensions, multi-file queued intake, and an alt-text completeness signal. The loose "Serve resized public images" requirement is replaced by an enforceable delivery contract covering the permitted widths, the prohibition on upscaling, the output format, caching semantics, and the rejection of unlisted widths.
- `seo-and-discovery`: The Open Graph image must resolve to a sized variant instead of the stored original.
- `rich-text-editing`: An image inserted into rich text must reference a sized variant instead of the stored original.

## Impact

Affected code:

- `src/routes/admin/media/+page.server.ts` — upload action gains normalization and multi-file intake
- `src/routes/admin/media/+page.svelte` — drag-and-drop target, queue feedback, alt-text count
- `src/lib/media.ts` — `mediaSrc` and `resolveMedia` emit route URLs and `srcset` instead of `?thumb=`
- New public route serving `/media/<id>/<filename>/<width>.webp`
- New single-purpose module owning cache reads and writes
- `src/lib/components/sections/Hero.svelte`, `src/routes/(site)/blog/[slug]/+page.svelte`, the three `ogImage` call sites, and `src/lib/components/admin/RichText.svelte`
- `src/lib/components/admin/MediaPicker.svelte` and the media library grid, which currently request `400x300` thumbs
- Additive migration adding `width` and `height` to `media`, and clearing `thumbs` on the `media.file` field

Dependencies:

- Adds `sharp`. It is a native binary, so the deployment image must match the build platform.

Operational:

- Variant cache lives outside `pb_data` so PocketBase backups do not archive regenerable files.
- Existing media records need no backfill. Variants generate on first request, and records missing recorded dimensions can be measured on demand.
- Moving originals to R2 later remains a storage sync plus a PocketBase settings change. The variant cache is derived and is never migrated.
