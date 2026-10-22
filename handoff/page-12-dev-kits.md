# Page 12 — /dev-kits

Approved content package rev. 2026-10-07, page 12 of 21, "Sense › Dev Kits & Reference Designs". First built against v2; **v3 pass applied 2026-10-20**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Two open items for review: the iToF row's photos (one image-treatment decision) and the Module and Solution Providers strip (a missing logo plus a decision). The hero family photo is also still to be supplied.

## v3 pass (2026-10-20)

**Copy.** The v2→v3 diff of page 12 has one change, "Skip the beamforming design", which was already live from `1787712600`. Every live string was matched programmatically against the v3 page text and found verbatim. Section order and kit categorisation match the PDF:
- Transmit modules: TX10.
- iToF: ON140, LI140, M30.
- dToF: NM120, MD180.
- Reference-design caveat under the dToF row.

All actions are pages or contact requests (`kit-recommendation`, `md180`); there are no downloads.

**Simon's four notes on page 12** (all transparent PNG cut-outs, checked against the repository):

| Note | Slot | Repository | Used |
| --- | --- | --- | --- |
| A1 [IMG_9290](https://lumotive.com/wp-content/uploads/2026/05/IMG_9290-1-copy-2.png) | TX10 | same picture as `tx10-module-closeup.jpg`, flattened on white | **Yes**, as `kit-tx10.webp` |
| A2 [IMG_7224](https://lumotive.com/wp-content/uploads/2024/10/IMG_7224-Edit-1-copy-2.png) | M30 | same picture as `m30-dev-kit-contents.jpg` (`/dev-kits/itof`) | **No**, held (see iToF row) |
| A3 [IMG_0032](https://lumotive.com/wp-content/uploads/2026/04/IMG_0032-1-copy-1.png) | NM120 | same picture as `nm120-sensor.jpg`, flattened on white | **Yes**, as `kit-nm120.webp` |
| A4 [IMG_9388](https://lumotive.com/wp-content/uploads/2026/04/IMG_9388-1-copy-2.png) | MD180 | not in the repo | **Yes**, as `kit-md180.webp` |

**Why new files rather than the existing JPGs.** The existing copies are flattened on white. The page-03 kit card prints "Photo on light grey panel", and a white rectangle would show inside a grey panel. So the transparent originals are kept: trimmed to their alpha bounds plus 2%, at most 900px, WebP q86 with alpha (TX10 54 KB, NM120 81 KB, MD180 47 KB). They are a different rendition of the same photos, not duplicates.

**Kit-card treatment.**
- New opt-in `mediaFrame: "panel"` on `cardsMediaCards`, exposed in the editor spec.
- It places the product contained on a Cool Field panel inside the card padding, rather than a full-bleed 16:9 crop.
- The panel is a fixed 224px tall (192px below 768px), so the single TX10 card and the dToF pair frame their products at one size.
- Every other media-card grid is unchanged (checked below).

**Image decision by row.** Page 12's own specification prints a photo on every kit card, so the Robotics text-only decision was not copied over:
- **Transmit modules (TX10):** complete, so it has its photo.
- **dToF (NM120, MD180):** complete, so both have photos.
- **iToF (ON140, LI140, M30): text-only — temporary layout decision (D6, 2026-10-21).** Only M30 is supplied. All three iToF cards stay text-only until the ON140 and LI140 photos arrive; then all three go on the grey panel together. The M30 photo (A2) is held, not lost.

**Meta.** `seoDescription` now carries the hero sentence (global rule 14), so page 12 drops out of S11.

**Migration** `1787713700_dev_kits_v3.js` (reversible, guarded) sets `mediaFrame` and card `media` on `2c84f7a1` and `a90f62b3`, plus `seoDescription`.

### v3 QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, every inner column on one edge (16 / 24 / 24 / 80), no tap target under 44px.
  - Grids: Why 1 → 2 → 4; Transmit 1 → 2 (single card, half row); iToF 1 → 2 → 3; dToF 1 → 2.
  - Equal card heights per row: dToF 542/542 at 1440, iToF 320×3 at 1440.
- **Product crops:** all three products sit whole and centred on the grey panel at every width, with no cropping (`object-contain` with 1.25rem inner padding). NM120's wider footprint and MD180's taller one both fit.
- **Links and anchors:** `/dev-kits/transmit-modules`, `/dev-kits/itof`, `/dev-kits/dtof`, `/contact?inquiry=kit-recommendation` and `/contact?inquiry=md180` all answer 200. `#why`, `#find-your-dev-kit`, `#itof` and `#dtof` resolve. No `download` attribute, PDF link or "download" wording.
- **Contrast:** automated scan of Why, Transmit, iToF and dToF, zero failures. The panel is decorative; product images carry `alt=""` and the card title names the kit.
- **Shared-component regression:** no other page renders `.kit-panel`. The full-bleed photo grids still load: `/applications` 7, `/sense` 3, `/platform` 2. `/sense/robotics` and `/sense/automotive` media cards are unchanged and text-only. No overflow.
- **Migration:** revert restored every page record byte-identically to the pre-migration snapshot; reapply changed only `dev-kits`.
- `npm run check` 592 files, 0 errors, 0 warnings; `npm run build` passed with the dev server stopped.
- **Screenshots** (outside the project): `%TEMP%\lumotive-review\dev-kits\`
  - `desktop-1440-01…06`, `mobile-390-01…06`;
  - `mobile-390-05b-dtof-md180`;
  - `tablet-1024/768-find-your-dev-kit`.

## What shipped in the v2 build (history)

One reversible migration, `1787710200_dev_kits_page12.js`. The revert restores
the previous four sections **byte-identically**.

| # | id | Type | Marker | Section |
| --- | --- | --- | --- | --- |
| 1 | `1b368f3c` | `heroBand` | CHANGE · HUB PAGE | Development Kits and Reference Designs |
| 2 | `5b7e01d4` | `cardsTextCards` | NEW | Why Start With a Lumotive Kit — four across |
| 3 | `2c84f7a1` | `cardsMediaCards` | NEW | Find Your Dev Kit · Transmit Modules |
| 4 | `8d3b05e6` | `cardsMediaCards` | NEW | iToF Dev Kits |
| 5 | `a90f62b3` | `cardsMediaCards` | NEW | dToF Dev Kits + reference design caveat |
| 6 | `116c9e28` | `ctaDefault` | CHANGE | Tell Us Your Spec. We Will Match the Kit. |

### Find Your Dev Kit

"REPLACES TABLE AND CARDS". Built as one section per family, joined by spacing
so the heading prints once, which keeps each row sized to its own family
instead of padding every family to a common width: Transmit Modules carries
TX10; iToF carries ON140, LI140 and M30; dToF carries NM120 and MD180.

Each card follows the page-03 kit card spec — name, one line, four spec lines,
link to the category page. Specifications are the package's character for
character, including MD180 substituting a frame rate row for a resolution row.

| Kit | Destination |
| --- | --- |
| TX10 | `/dev-kits/transmit-modules` |
| ON140, LI140, M30 | `/dev-kits/itof` |
| NM120 | `/dev-kits/dtof` |
| MD180 | `/contact?inquiry=md180` |

The reference design caveat sits under the last family, the only place the
package prints it on this page.

### Removed

- `4bf76360` — the old three development kit cards, replaced outright by Find
  Your Dev Kit, and still linking to `/tx10`, `/m30` and `/nm120`, all retired
  by the site map.
- `e91c47a5` — "Shipping today on the LCM platform", the Hokuyo and Namuga
  customer products. The approved composition does not carry it, the Module and
  Solution Providers component is what now names those builders, and it carried
  external links on customer logos, which page 01 removes site-wide.

Both restored verbatim by the down path.

### Rendering changes

- `cardsMediaCards` gains an optional `note`, a small trailing line under the
  grid, for the reference design caveat. Slate rather than muted slate, which
  falls under 4.5:1 at the spec size.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, no tap target under 44px, every inner
  column on one edge. Grids: Why 1 → 2 → 4; Transmit 1 → 2 (a single card, so
  it holds a half row); iToF 1 → 2 → 3; dToF 1 → 2.
- **Copy:** four headings in the package's order; the six kit names render
  TX10, ON140, LI140, M30, NM120, MD180; the caveat renders verbatim.
- **Compliance:** no "TX10-DK", no "What Is TX10?", no "download", no klux, no
  operating temperature, no 1550 nm or FMCW, and **zero external links** in
  main, which is the page-01 removal of external links on customer and provider
  logos.
- **Links:** `/contact?inquiry=kit-recommendation` and
  `/contact?inquiry=md180` both 200. The three `/dev-kits/*` category links 404
  — approved destinations from pages 13, 14 and 15.
- **Migration:** applies, reverts and re-applies deterministically; the revert
  is byte-identical to the pre-migration record.
- `svelte-check` and the production build both clean.

## Blockers (after v3)

1. **Module and Solution Providers — not built on `/dev-kits`.** The PDF prints it between Find Your Dev Kit and the closing CTA: Leopard Imaging, Namuga, Hokuyo, Electronic Photonics, no external links.
   - The **Leopard Imaging logo is missing** (client asset, SE5/PA2).
   - The existing "≡ PHOTONICS" mark carries no "e-Photonics" spelling (checked on page 19), so it is now a confirmation (PA4).
   - **Decision SE6/D4:** ship the strip now with 3 of 4 logos, as `/partners` already does, or wait for Leopard?
   - Webvizio #121/#122 stay open.
2. **iToF kit photos (D3).** ON140 and LI140 photos are not supplied. M30 is supplied and held under the D6 decision (above) until the other two arrive.
3. **Hero kit family photo (D1).** Not annotated or supplied. The incumbent bench photograph `hero-devkits.jpg` stays; the PDF's grey box reads "Kit family photo".

Resolved by v3:
- the TX10, NM120 and MD180 photos;
- the meta description;
- the `/dev-kits/*` 404s (pages 13–15 built).

## v4 pass (2026-10-22): implemented and verified on the local site

v4 has no copy change on page 12. `wscgr` linked `Lineup.png` at the hub hero and `ON140.png` / `LI140.png` at iToF cards 1 and 2; Simon's M30 (IMG_7224), TX10, NM120 and MD180 notes are carried over from v3. Migration `1787716500_dev_kits_v4_media.js` is guarded and reversible. Copy, kit order, links and the compact phone hero are unchanged.

**Hero (`1b368f3c`), D1.**
- **Image:** the five-kit lineup cut-out is laid whole on the right of a white 2880×1200 banner (`hero-devkits-lineup.webp`, 74 KB), composed the way the dToF hero composes its NM120: product right, `mediaAnchor: "100%"`, phones `mobileMediaPosition: "100%"`. It replaces `hero-devkits.jpg` (dark bench photo).
- **Placement:** at 1440 / 1024 / 768 the whole lineup sits inside the band. At 1440 it starts right of the headline. At 1024 and 768 it sits behind the copy's right-hand side under the shade, as the dToF hero's NM120 does. On phones it is a dim backdrop on the right.
- **Phone shade:** the white banner is brighter behind the phone copy than the old photo; with the previous `strong` shade, phone body text measured 3.22–3.66:1 at the brightest backdrop pixel. Phones now take the existing `max` shade (as other white-backed heroes do, S26). Tablet and desktop shades are unchanged.
- **Hero readability**, measured at the brightest backdrop pixel under each text line with the text hidden (a screenshot measure, not an accessibility sign-off):

  | Width | Eyebrow | Heading | Body |
  | --- | --- | --- | --- |
  | 1440 | 8.76 | 8.49 | 7.40 |
  | 1024 | 8.23 | 10.41 | 6.69 |
  | 768 | 7.80 | 9.81 | 4.66 |
  | 430 | 8.45 | 10.53 | 6.73 |
  | 390 | 7.78 | 9.18 | 6.93 |
  | 360 | 7.08 | 11.04 | 7.02 |

- **Band heights:** 624 / 612 / 612 / 441 / 469 / 509px at 1440 / 1024 / 768 / 430 / 390 / 360. The phone compact hero is unchanged; it follows the copy.

**Find Your Dev Kit, iToF row (`8d3b05e6`): D3, D6 closed.**
- **Photos:** ON140, LI140 and M30 were added together on the light-grey kit panel (`mediaFrame: "panel"`), matching TX10 / NM120 / MD180, which ends the temporary text-only row.
- **Reused assets:** ON140 and LI140 use the cut-outs made from `wscgr`'s files for `/sense/robotics` (`kit-on140.webp`, `kit-li140.webp`). M30 is the existing `m30-dev-kit-contents.webp`, which is Simon's IMG_7224, the photo linked on this page. Robotics uses Simon's different M30 shot (`M30_thumb`, the bare module), as linked there; each page follows its own annotation.

**Verification (local site, headless Chromium).**
- **Kit panels:** at 1440 / 1024 / 768 / 390 / 360 all six photos load and are contained (`object-fit: contain`, never cropped). Panels are one height per breakpoint (224px from 768, 192px on phones), and the panels in each row match in width.
- **Links:** all answer 200 (`/contact?inquiry=kit-recommendation`, `/dev-kits/transmit-modules`, `/dev-kits/itof`, `/dev-kits/dtof`, `/contact?inquiry=md180`).
- **Overflow:** none at any width.
- **Database:** the migration was applied, reverted (all page records byte-identical) and re-applied.
- **Screenshots:** `%TEMP%\lumotive-review\dev-kits-v4\` (`hero-{1440,1024,768,430,390,360}.png`, `find-your-dev-kit-{1440,768,390}.png`; `before-devkits-hero-*.png` and `ref-dtof-hero-*.png` for comparison).

**Still open:** D4 (Module and Solution Providers: Leopard logo, SE5/SE6).

## TX10 card width (2026-10-22): narrow-card request, superseded the same day

> **Superseded** by "TX10 full width" below: the client corrected the instruction and the PDF layout is restored. The `columns: "3"` option this section describes was removed from the code; `1787716700` moves the section to `columns: "1"`.

At the client's request, the single TX10 card under "Transmit modules" (`2c84f7a1`) now takes the width of one iToF card below it at every breakpoint, left-aligned with ON140. The PDF prints the TX10 card wider, across the row; this is the requested deviation. It uses a new opt-in `columns: "3"` on CardsMediaCards (the three-up track at any card count) set by `1787716600_dev_kits_tx10_card_width.js`, guarded and reversible; no other section carries it. Copy, link (`/dev-kits/transmit-modules`), spacing, the panel height and the uncropped (`contain`) photo are unchanged.

Measured (card left / width, local site):

| Width | TX10 | ON140 | Kit panel (TX10 = ON140) |
| --- | --- | --- | --- |
| 1440 | 80 / 411 | 80 / 411 | 363×224 |
| 1280 | 24 / 395 | 24 / 395 | 347×224 |
| 1024 | 24 / 309 | 24 / 309 | 261×224 |
| 768 | 24 / 348 | 24 / 348 | 300×224 |
| 390 | 16 / 358 (full width) | 16 / 358 | 310×192 |
| 360 | 16 / 328 (full width) | 16 / 328 | 280×192 |

The dToF cards (NM120, MD180) keep their two-up widths. No overflow at any width. Screenshots: `%TEMP%\lumotive-review\dev-kits-v4\tx10-width-{1440,1024,768,390}.png`.

## TX10 full width (2026-10-22): PDF layout restored

The client corrected the earlier narrow-card instruction. The single TX10 card under "Transmit modules" (`2c84f7a1`) again spans the full content width, as PDF page 12 prints it: on desktop from ON140's left edge to M30's right edge (the three iToF cards plus their gaps), and full width on tablet and phones.
- **Supersedes** the narrow-card request (`1787716600`).
- **Migration:** `1787716700_dev_kits_tx10_full_width.js` changes `columns: "3"` to `columns: "1"`, guarded and reversible.
- **Code:** CardsMediaCards replaces the now-unused `columns: "3"` option with `columns: "1"` (one card per row at every width). No other section uses either value.
- **Unchanged:** copy, link (`/dev-kits/transmit-modules`), spacing and panel height. The photo stays contained and centred.

Measured on the local site:

| Width | TX10 left–right | iToF row edges | Kit panel | Product drawn / centre offset |
| --- | --- | --- | --- | --- |
| 1440 | 80–1360 | ON140 left 80, M30 right 1360 | 1232×224 | 201×184 / 0 |
| 1280 | 24–1256 | 24, 1256 | 1184×224 | 201×184 / 0 |
| 1024 | 24–1000 | 24, 1000 | 928×224 | 201×184 / 0 |
| 768 | 24–744 (full width) | iToF is two-up here; the row spans 24–744 | 672×224 | 201×184 / 0 |
| 390 | 16–374 (full width) | 16–374 | 310×192 | 166×152 / 0 |
| 360 | 16–344 (full width) | 16–344 | 280×192 | 166×152 / 0 |

- **Other cards:** unchanged. NM120 / MD180 stay two-up (628px each at 1440).
- **Overflow:** none at any width.
- **Screenshots:** `%TEMP%\lumotive-review\dev-kits-v4\tx10-full-width-{1440,768,390}.png`.
