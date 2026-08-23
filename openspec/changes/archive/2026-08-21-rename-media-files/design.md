## Context

See proposal.md — Why.

Three facts about the current system shape every decision below.

**The storage layer has no rename operation.** There is no rename call in the PocketBase JS SDK's typings. A stored filename is assigned when bytes are written and is not editable in place.

**Replacing a file field's value on an existing record does rename it, in effect.** This was verified against the running instance during earlier work: submitting new bytes for a media record's file field left the record's identity untouched, stored the bytes under the new filename, and removed the previous file. So a rename does not require deleting and recreating the record, and content that references the record by identity is unaffected.

**The storage layer appends its own uniqueness suffix.** The single existing media file is stored as `1217498009571643_j1bqfevmbs_j0pc30fmnj.eight640_result.webp`; it acquired a second suffix when it was re-stored. An editor's chosen name therefore cannot be the whole filename.

The variant address already embeds the stored filename, and the resize route already refuses an address whose filename does not match the record's current one — that guard was added and verified earlier. Renaming therefore inherits correct retirement of old addresses without new work in the serving path.

## Goals / Non-Goals

**Goals:**

- Rename without changing the image, the record's identity, or any referencing content.
- Make editor input safe before it reaches a path or a URL.
- Keep the serving path unchanged; renaming should exercise guards that already exist rather than add new ones.

**Non-Goals:**

- Preserving previously published external addresses. Naming is part of the address, so a rename retires the old one. No redirect from old variant address to new is built.
- Bulk renaming. One item at a time.
- Renaming at upload. Worth doing and deliberately out of scope here; this change is about images already stored.
- Any re-encoding. A rename moves bytes, it does not process them.
- Guaranteeing a clean filename. The storage layer's suffix is not removable.

## Decisions

### D1: Rename by re-submitting the same bytes to the same record

Read the stored bytes, then update the record's file field with those bytes under the new name. The record's identity, alt text, and dimensions are untouched, and the storage layer removes the previous file.

Alternatives considered:

- **Delete the record and create a new one.** Rejected outright: the new record would have a new identity, so every page, post, and rich-text body referencing the image would break. This is the difference between a rename and a data-loss event.
- **Manipulate the stored file on disk directly.** Rejected: it desynchronises the database's filename from storage, and it cannot work once storage moves to an object store.

The cost of D1 is that a rename spends a read and a write of the full image. For a capped image that is acceptable, and renaming is a rare editorial action rather than a hot path.

### D2: Treat editor input as a stem; derive the extension from the stored image

The submitted value names the file; it does not type it. The extension comes from what the bytes actually are.

This is a security decision, not an ergonomic one. If editor input set the extension, an editor could store image bytes under a name suggesting a different type, and any consumer that trusts an extension over content would be misled. Deriving the extension from the stored image keeps the served type and the name consistent by construction.

### D3: Sanitise to an explicit allowlist rather than blocking known-bad input

Reduce the submitted stem to a bounded set of safe characters and a bounded length, rather than stripping a list of dangerous ones.

Alternatives considered:

- **Denylist.** Rejected. The value crosses two different interpreters — a filesystem path and a URL path segment — and a denylist has to anticipate every construct either treats specially. An allowlist cannot be outflanked by an input nobody thought of.

The value already passes a safe-segment check in the cache layer, which rejects anything outside a conservative character set. Sanitising to that same shape at the write boundary keeps the two ends consistent, so a name that can be stored is always a name that can be addressed.

### D4: A rejected rename must be a no-op

Validate fully before writing anything. An editor who submits an unusable name must be told, and must find the image exactly as it was.

The failure mode being avoided is a partial rename: bytes written under a new name while the record still points at the old, or the reverse. Either leaves an image that cannot be served. Validation before any write makes the bad path unreachable rather than recoverable.

### D5: Leave the variant cache alone

Do not purge cache entries under the old filename.

They are addressed by the old name, which the serving path no longer honours, so they cannot be served. They are regenerable derivatives, so losing them costs nothing but a re-encode. Purging would mean walking a cache directory in response to an editorial action, which is more machinery and more failure surface than doing nothing. The pre-existing decision to treat the cache as disposable is what makes this the right answer.

### D6: Reuse the existing filename-match guard rather than adding invalidation

The resize route already loads the record and refuses to serve when the requested filename is not the record's current one. That check was added to stop a deleted image being served from cache, and it retires renamed addresses for free.

This is worth stating because the obvious alternative — tracking previous filenames so old addresses can be redirected or explicitly invalidated — adds state that buys nothing. A not-found response is the correct answer for an address that no longer identifies anything.

## Risks / Trade-offs

- **A published external address stops working** → accepted and documented as breaking in the proposal. Mitigation is editorial: rename before publicising an image, not after.
- **A rename spends a full read and write of the image** → acceptable for a capped image on a rare editorial action. It also passes through the same bounded conversion admission as any other image work, so it cannot monopolise the converter.
- **Two media items can be given the same stem** → harmless, because the storage layer's suffix keeps stored filenames distinct. Worth noting so nobody adds a uniqueness constraint that the suffix already makes unnecessary.
- **An editor expects the exact name they typed** → they will see a suffix. Mitigation is to show the resulting stored filename after the rename rather than echoing the submitted value, which is why that is a requirement rather than a nicety.
- **A rename racing an in-flight variant generation for the same image** → the generation holds bytes it already read and will write a cache entry under the old name. That entry is then unreachable, which is the same benign outcome as any other retired entry.

## Migration Plan

No migration. No schema change, and existing media keep their filenames until an editor renames one.

Rollback is reverting the code. Any image renamed while the feature was live keeps its new name, which is valid regardless: the record, its references, and its addresses are all internally consistent. Nothing needs undoing.
