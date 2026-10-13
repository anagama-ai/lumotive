# Page 16 — /connect

Approved content package rev. 2026-10-07 (v2), page 16 of 21, "Connect ›
Optical Circuit Switching". Branch `feedback-20261007-v2`.

**Status: rebuilt in place and QA-verified.** Awaiting screenshot review before
page 17.

## What shipped

One reversible migration, `1787711400_connect_page16.js`. **The route and the
record are unchanged** — this is "CHANGE · REBUILT ON THE CURRENT LUMOTIVE.COM
OCS PAGE", not a new page.

| # | id | Type | Marker | Section |
| --- | --- | --- | --- | --- |
| 1 | `ffa907ea` | `heroSplit` | CHANGE | Lumotive Connect / Optical Circuit Switching / "Solid-state and at scale." |
| 2 | `d8c4ff1d` | `splitDefault` | CHANGE | Electronic Switches Are Hitting Their Limits. + the existing video |
| 3 | `d32ef2bd` | `cardsTextCards` | CHANGE | Send Light, Not Signals. — four benefits |
| 4 | `4c81e9a7` | `cardsTextCards` | NEW | Today's Optical Switches Are Mechanical. — four MEMS limits + closing line |
| 5 | `b0f3d514` | `statsLightTraits` | CHANGE | Switching at Semiconductor Scale + 50 μs / 10k × 10k |
| 6 | `df99bb2e` | `cardsTextCards` | CHANGE | …its six traits |
| 7 | `6e2a71c9` | `ctaSplitLinks` | NEW | 2D Beamforming for High-Port-Count Switching |
| 8 | `e856b692` | `cardsSpecPanels` | KEEP AS IS | From Compact to Hyperscale. |
| 9 | `93c4b0fe` | `cardsTextCards` | NEW | Where Lumotive Connect Applies |
| 10 | `9bb14000` | `ctaFabric` | CHANGE | Architecting the Next AI Data Center? |

The hero uses **`hero-connect.jpg`**, verified as the OCS ports-and-lasers
photograph the package names ("current lumotive.com hero") — optical patch
cables and transceiver ports in a data-center aisle.

Actions carry the page-03 inquiry value for this page, **`ocs`**, and the
labels take the package's sentence case: "Talk to our OCS team", "Learn about
LCM". The announcement action points at the real post,
`/posts/lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor`;
no date and no generation label appear, per the dev note.

### Removed — not in the approved composition

All four are restored verbatim by the down path.

| id | Section | Why |
| --- | --- | --- |
| `f4b9c1d7` | standalone video | The package sets the video beside block 2's copy, so the two are merged. |
| `2a71fb29` | A programmable optical fabric for the AI era | Its subject — pixels mapped to ports, each programmable in position, size, steering and lensing — **is** approved block 5, in the package's own words. |
| `835c0cd5` | How it works | Same subject, likewise folded into block 5. |
| `2e561f30` | Built for AI infrastructure | The approved page carries "Where Lumotive Connect Applies" in this role, with the package's own two use cases. |

### What this means for commit `67f8f02`

All four repairs remain in the components. Two are **still exercised on this
page**: the outlined CTA action (block 10) and the spec-panel label contrast
(block 8). The other two — the peel swap's dwell, its narrow-viewport and
reduced-motion fallbacks, and the icon quad's title rhythm — belonged to
sections the approved composition does not carry, so they no longer have
anything to act on *here*. **The swap repairs still serve `/platform`**, the
other page using that section, verified unchanged.

### One shared-component change

`cardsSpecPanels` now emits `data-align`, so block 8 can opt into the header
container like every other section. Without it that one section sat at the
viewport edge while the other nine aligned at 80px.

## Discrepancy worth a decision

**"From Compact to Hyperscale." is marked KEEP AS IS, but the package prints a
heading and an introduction that differ from staging.** The page-01 copy rule
is absolute — "Copy in these pages is final. Use it word for word" — so the
printed copy wins and the section's graphics, spec lists and layout are
untouched. If the marker was meant literally, reverting the two strings is a
two-field change.

| | |
| --- | --- |
| Staging | "From compact to hyperscale" / "Lumotive supports reference architectures across the AI infrastructure stack, from compact scale-up systems inside the rack to large scale-out optical fabrics across the cluster." |
| Package | "From Compact to Hyperscale." / "Two reference architectures cover both ends of the AI infrastructure stack: scale-up inside the rack, scale-out across the cluster. Both use the same Lumotive LCM optical engine, tiled, packaged, and scaled differently." |

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, no tap target under 44px, **every inner column on one
  edge** (16 / 24 / 24 / 80).
- **Reduced motion at 1440:** clean probe, and **no heading or card sits under
  0.9 opacity** — nothing hidden.
- **Copy:** nine headings in the package's order, each matching character for
  character.
- **Links:** `/contact?inquiry=ocs`, `/platform` and the announcement post all
  200. No external links in main.
- **Migration:** applies, reverts to the previous ten sections, re-applies.
- `svelte-check` 589 files, 0 errors; production build clean. `/platform`,
  `/applications`, `/sense` and `/dev-kits` all still report a clean probe.

## Outstanding assets

1. **2D beamforming visual** (shared with Platform) — package page 04 lists it
   as a new asset, so block 7 ships as copy and actions only.
2. **Use-case images** for block 9, "AI data center" and "satellite and
   airborne links". No satellite or airborne asset exists here, and one
   illustrated card beside a bare one reads worse than neither, so both are
   omitted.
3. **Citation link for the Google figures.** The dev note asks for Google's
   public publication to be cited. The copy attributes the 40% and 30% figures
   to Google by name, but no URL has been supplied, so none is invented.
4. **Icons.** The six existing icons no longer match the approved card titles
   on blocks 3 and 6, and none exists for "Compact", so both blocks ship as
   text cards rather than pairing approved titles with mismatched art. The icon
   files remain in the repository.
