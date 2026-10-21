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
