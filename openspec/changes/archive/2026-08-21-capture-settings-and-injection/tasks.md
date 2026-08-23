## 1. Confirm the captured requirements hold

This change captures shipped behaviour, so there is no feature to build. The work is proving that each newly written requirement is true of the running application, and fixing the code where it is not. A requirement that cannot be demonstrated is either wrong or describes a defect; in both cases it must be resolved rather than left standing.

Three requirements were specified from source rather than observed, because confirming them needs a write and the authoring pass was read-only. They are the ones most worth exercising first.

- [x] 1.1 Confirm per-section save isolation: save each settings section in turn and verify the other four sections' stored records are byte-identical before and after. This was specified from source, and it is the requirement with the most value, because a single save rewriting every settings record is the defect the split was meant to remove
- [x] 1.2 Confirm a settings section whose stored record does not exist yet renders, and that saving it creates that record
- [x] 1.3 Confirm the body-start and footer injection slots render at their specified positions. Both are currently unset, so their placement was specified from source; save a distinctive marker into each and locate it in the rendered document
- [x] 1.4 Confirm injected content is stored and emitted exactly as typed, including leading, trailing, and internal whitespace

## 2. Confirm the observed requirements still hold

- [x] 2.1 Confirm the five settings sections exist in the specified order, each at its own address, and that opening the settings group lands on a section
- [x] 2.2 Confirm every section shows the same navigation and marks only the open section as current
- [x] 2.3 Confirm a settings section requires an authenticated editor and reveals nothing without one
- [x] 2.4 Confirm the site identity fields persist: a multi-line address keeping its line breaks, a trimmed telephone number, and social account rows with an entirely blank row discarded
- [x] 2.5 Confirm both logos persist independently, and that each accepts a library reference and a plain address
- [x] 2.6 Confirm the content manager brand mark uses the dark-background logo when one is set, and falls back to its existing mark when none is
- [x] 2.7 Confirm an unreadable logo value is rejected and stores nothing
- [x] 2.8 Confirm all four injection slots render on more than one public page, and that an unset slot renders nothing without error
- [x] 2.9 Confirm the footer slot renders inside the footer element rather than after it, in a way that would fail if it were swapped with the closing-body slot
- [x] 2.10 Confirm a post retains a search title and search description, emits them when set, and falls back to its title and excerpt when not

## 3. Resolve the recorded discrepancy

- [x] 3.1 RESOLVED, no code change. What follows the closing-body slot is SvelteKit's own hydration script and comment markers, not editor content. The slot is the last author-controlled content before the closing body tag, so the requirement's observable wording is accurate and stands

## 4. Reconcile any failure

- [x] 4.1 For each requirement that does not hold, decide whether the requirement is wrong or the code is, then correct whichever is wrong. Do not weaken a requirement to match a defect
- [x] 4.2 Re-run the type check and the production build after any code correction
