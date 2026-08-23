## Why

Stored image filenames are machine-generated and unreadable, and they leak into public image URLs. The one image currently in the library is stored as `1217498009571643_j1bqfevmbs_j0pc30fmnj.eight640_result.webp`, which reached that state by accumulating a second random suffix when it was re-uploaded. Every public variant URL embeds that string, so search engines and anyone reading a URL see it.

Two consequences. An editor browsing the library cannot tell one image from another by name. And image filenames carry modest but real search weight, which a site built for clients should not simply discard.

Editors need to give a stored image a meaningful name after it has been uploaded, not only at the moment of upload, because the useful name is often only obvious once the image is placed in a page.

## What Changes

- An editor can change the stored filename of an existing media item from the media library. The new name appears in every public variant URL for that image from then on.
- The record keeps its identity. Every page, post, and rich-text body that references the image continues to reference it, because content stores the media item's identity rather than its filename.
- **BREAKING** for consumers outside the site: any previously published variant URL for a renamed image stops resolving. A social crawler, an external CDN, or a hotlinker holding an old URL receives a not-found response. This is inherent to putting the filename in the address and is accepted.
- Cached variants generated under the old filename become unreferenced and are no longer served, because a variant address is only honoured when it matches the record's current filename.
- The editor-supplied name is treated as a **stem**, not a literal filename. The file extension is derived from the stored image rather than from editor input, and the storage layer appends its own uniqueness suffix. An editor asking for `northwind-hero` gets something of the form `northwind-hero_a1b2c3d4.webp`.
- A rename preserves the image bytes, its alt text, and its recorded dimensions. Renaming is not an opportunity to re-encode.

## Capabilities

### New Capabilities

None. Renaming is media management, which `media-library` already owns.

### Modified Capabilities

- `media-library`: The `Manage media items` requirement currently covers changing alt text and deleting an item. It gains renaming the stored file. Two further requirements need statements about what a rename means for addresses: `Serve variants at stable addresses` already says an address changes when stored content changes, and a rename changes the address without changing the content, so that requirement's meaning must be stated precisely rather than left to inference.

## Impact

Affected specs:

- `openspec/specs/media-library/spec.md`

Affected code:

- The media library screen and its server actions, which gain a rename action and the field to drive it
- The sanitisation boundary that converts editor input into a safe filename stem

Data and storage:

- No schema change. The stored filename already lives on the media record; only its value changes.
- No migration. Existing media keep their current names until an editor renames them.
- The variant cache needs no migration or purge. Cache entries are addressed by filename, so entries under an old name simply stop being requested; they are regenerable and disposable by design.

Security surface, which is the part most likely to be got wrong:

- Editor input becomes part of a filesystem path and a URL path segment. Path traversal, separators, control characters, leading dots, and absurd lengths must all be neutralised before the value reaches storage.
- The extension must be taken from the stored image, never from editor input, so that renaming cannot change how a served file is interpreted.
