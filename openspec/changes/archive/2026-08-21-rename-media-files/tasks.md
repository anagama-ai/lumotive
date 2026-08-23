## 1. Sanitisation boundary

- [x] 1.1 Add a filename-stem sanitiser that reduces submitted text to an allowlisted character set, matching the conservative safe-segment shape the variant cache already enforces, so a name that can be stored is always a name that can be addressed
- [x] 1.2 Bound the sanitised stem's length, and strip leading dots, path separators, relative path segments, and control characters
- [x] 1.3 Make the sanitiser report an empty result distinctly from a valid one, so a stem that neutralises to nothing can be rejected rather than silently becoming a blank name
- [x] 1.4 Derive the stored extension from the stored image rather than from submitted text, so submitted text can never change how a served file is interpreted
- [x] 1.5 Strip any trailing extension and remove all remaining dots, so submitted text cannot produce a double extension such as `evil.php.webp`. Added during verification: 1.4 alone left the foreign extension embedded in the stem

## 2. Rename action

- [x] 2.1 Add a rename action on the media library that takes a media item and a submitted name
- [x] 2.2 Validate before writing anything: reject a caller who is not an authenticated editor, a missing item, and a stem that sanitises to nothing, each with a reason
- [x] 2.3 Read the stored image bytes for the item through the server's own client rather than a browser-reachable address
- [x] 2.4 Update the media record's file field with the same bytes under the new filename, leaving the record's identity, alt text, and recorded dimensions untouched
- [~] 2.5 DROPPED, not implemented. Taking the rename through the bounded conversion admission was a planning error: a rename performs no image conversion, and the spec requires the stored bytes to be byte-for-byte identical, which forbids one. There is no converter to monopolise, so the guard would protect nothing
- [x] 2.6 Return the resulting stored filename so the editor sees what was actually stored rather than what was submitted
- [x] 2.7 Ensure a rejected rename writes nothing: no bytes stored, no record field changed

## 3. Media library UI

- [x] 3.1 Add a rename control for each media item, pre-filled with the current stored filename's stem
- [x] 3.2 Show the resulting stored filename after a successful rename, including the suffix the storage layer appends
- [x] 3.3 Report a rejected rename with its reason, leaving the displayed filename unchanged
- [x] 3.4 Keep the form working without client-side scripting, consistent with the other media actions
- [x] 3.5 Warn in the control's hint text that renaming retires previously published addresses for that image
- [x] 3.6 Move the per-item controls out of the card and into a panel opened by clicking the image, and outline an image with no alt text. Added on request during implementation. The panel is reached by URL fragment rather than a scripted dialog, so 3.4 still holds
- [x] 3.7 Keep the current alt text visible on the card. Required by the shipped `Browse media items` requirement, which 3.6 would otherwise have broken

## 4. Documentation

- [x] 4.1 Document renaming in the media section of `README.md`: that the new name appears in public image addresses, that the storage layer appends a suffix, and that previously published addresses for that image stop resolving
- [x] 4.2 Correct the documented example: PocketBase also lowercases the name and converts hyphens to underscores, so `northwind-hero` is stored as `northwind_hero_<suffix>.webp`, not `northwind-hero_<suffix>.webp`

## 5. Verification

- [x] 5.1 Rename an image and confirm the record keeps its identity, alt text, and recorded dimensions
- [x] 5.2 Confirm the stored bytes are byte-for-byte identical before and after, by comparing a checksum
- [x] 5.3 Confirm a page referencing the renamed image still displays it
- [x] 5.4 Request a variant at the new address and confirm it serves; request the pre-rename address and confirm a not-found response
- [x] 5.5 Warm a variant under the old name, rename, then request that same old address and confirm the cached entry is not served
- [x] 5.6 Submit a name containing path separators and relative path segments; confirm the stored filename contains none of them and no file is written outside media storage
- [x] 5.7 Submit a name that sanitises to nothing; confirm rejection and that the item is completely unchanged
- [x] 5.8 Submit a name carrying an extension that differs from the stored image's format; confirm the stored extension matches the image and the served type is unchanged
- [x] 5.9 Submit an over-long name; confirm the stored filename is within the permitted length
- [x] 5.10 Rename two items to the same stem; confirm both remain distinct and both still serve
- [x] 5.11 Attempt a rename with no editor session; confirm rejection and no change
- [x] 5.12 Run the type check and the production build
- [x] 5.13 Confirm every rejected input is either renamed to a safe name or refused with a reason, never a silent no-op
- [x] 5.14 Confirm the card shows thumbnail, filename, and current alt text, and that an image with no alt text is outlined
