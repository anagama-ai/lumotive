## 1. Dependency and shared contract

- [x] 1.1 Add `sharp` as a dependency and confirm it loads in the SvelteKit server process
- [x] 1.2 Create the shared media delivery contract in one module: the permitted width list `320, 640, 768, 1024, 1440, 1920`, the output format, and the functions that build a variant path from a record id, stored filename, width, and format
- [x] 1.3 Create the cache module holding exactly two operations, a keyed read and a keyed write, writing under a cache directory outside `pb_data`, and add that directory to `.gitignore`

## 2. Resize route

- [x] 2.1 Add the public route serving `/media/<id>/<filename>/<width>.<format>`, reading the stored image through PocketBase
- [x] 2.2 Reject any width outside the permitted list with a not-found response, producing and storing nothing (design D6)
- [x] 2.3 Clamp the requested width down to the stored image's width so no variant is ever enlarged
- [x] 2.4 Encode variants as WebP, compare the encoded bytes against the stored image, and serve the stored image when it is smaller (design D12)
- [x] 2.5 Serve variant responses with immutable long-lived public cache directives and the correct content type for the bytes actually returned
- [x] 2.6 Return the cached variant on a repeat request without re-encoding
- [x] 2.7 Deduplicate concurrent first requests for the same variant key so one encode serves all waiters (design D7)
- [x] 2.8 Write cache entries to a temporary path and rename into place, so a partial file is never served
- [x] 2.9 Bound simultaneous conversions to two across the route (design D11)
- [x] 2.10 Measure and use the stored image's dimensions when the record has none recorded (design D13)

## 3. Move every consumer off the thumb parameter

- [x] 3.1 Rewrite `mediaSrc` and `resolveMedia` in `src/lib/media.ts` to build route URLs, and add a helper producing width candidates and their pixel widths for responsive markup
- [x] 3.2 Move the hero section image onto the route with responsive width candidates and intrinsic width and height attributes
- [x] 3.3 Move the blog cover image onto the route with responsive width candidates and intrinsic width and height attributes
- [x] 3.4 Move the Open Graph image onto a sized variant in all three public metadata call sites, including the site-level default sharing image
- [x] 3.5 Move rich-text inserted images onto a sized variant, and make previously stored rich-text image markup resolve to a variant as well
- [x] 3.6 Move the media library grid and the media picker previews onto the route
- [x] 3.7 Confirm no `?thumb=` reference remains anywhere in `src`

## 4. Schema migration

- [x] 4.1 Write an additive migration adding `width` and `height` to `media`
- [x] 4.2 In the same migration, clear `thumbs` on the `media.file` field, with a down step restoring the previous four declared sizes
- [x] 4.3 Verify the migration applies to a fresh data directory and to the existing one, and that its down step restores the prior state

## 5. Upload normalization

- [x] 5.1 Normalize each accepted upload once before storing: apply orientation metadata to the pixels then discard it, strip remaining metadata including location data, and cap width at 1920 without enlarging anything smaller
- [x] 5.2 Record the stored image's pixel width and height on the media record
- [x] 5.3 Pass GIF uploads through unmodified so animation survives (design D10)
- [x] 5.4 Keep the existing type and size validation ahead of normalization, so a rejected upload still creates no media item

## 6. Multi-file upload

- [x] 6.1 Accept multiple files in one submission, creating a media item per accepted file
- [x] 6.2 Make alt text optional at upload while keeping it editable from the library afterwards
- [x] 6.3 Add a drag-and-drop target on the media library that accepts dropped image files, keeping the plain file input working without client-side scripting
- [x] 6.4 Queue conversions so at most two files are converted at a time, and report progress across a multi-file upload
- [x] 6.5 Report per-file outcomes so one rejected file does not hide the files that succeeded

## 7. Alt text completeness

- [x] 7.1 Report the number of media items with no alt text in the library, and show nothing when every item has alt text

## 8. Verification

- [x] 8.1 Re-run the recorded regression: upload the 522x480 WebP and confirm every permitted width returns bytes no larger than the 85 KB stored file, and that none is upscaled beyond 522 pixels
- [x] 8.2 Confirm an unlisted width returns a not-found response and writes no cache entry
- [x] 8.3 Confirm a cold variant requested concurrently is encoded once and every request receives the complete image
- [x] 8.4 Confirm an uploaded image wider than 1920 is stored at 1920, a narrower one is stored unchanged, and location metadata is gone from both
- [x] 8.5 Confirm an animated GIF retains its frames after upload
- [x] 8.6 Confirm the Open Graph image and a rich-text image both resolve to variants and not to stored files
- [x] 8.7 Confirm hero and blog cover emit multiple width candidates with intrinsic dimensions
- [x] 8.8 Upload six files in one interaction, confirming all six are stored and no more than two convert at once
- [x] 8.9 Confirm replacing a media item's image changes its variant addresses, and that the previous address is not served for the new content
- [x] 8.10 Confirm media records predating this change serve variants correctly with no backfill
- [x] 8.11 Run the type check and the production build

## 9. Documentation

- [x] 9.1 Document the permitted widths, the output format, and the variant URL shape in `README.md`
- [x] 9.2 Document that the 1920 cap is applied at upload and the submitted master is not retained
- [x] 9.3 Document the cache directory, that it is disposable and lives outside `pb_data`, and that PocketBase backups do not include it
- [x] 9.4 Document that sharp is a native dependency whose build platform must match the deployment image
- [x] 9.5 Document the later R2 move: a storage sync plus a PocketBase settings change for originals, and that the variant cache is never migrated
