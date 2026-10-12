# Page 12 — /dev-kits

Approved content package rev. 2026-10-07 (v2), page 12 of 21, "Sense › Dev Kits
& Reference Designs". Branch `feedback-20261007-v2`.

**Status: implemented and QA-verified**, except the Module and Solution
Providers component, which stays blocked on two logos.

## What shipped

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

## Blockers

1. **Module and Solution Providers component — not built.** Still blocked on
   the **Leopard Imaging** logo (absent from this repository) and the
   **Electronic Photonics** logo (an open Lumotive input; the existing
   `ephotonics.png` carries the "e-Photonics" spelling the package removes).
   Blocks package pages **09, 10, 12 and 19**; one delivery unblocks all four.
   Webvizio **#121 and #122** resolve through it and stay open.
2. **Kit family photo** for the hero. The page keeps its incumbent dev kit bench
   photograph — a real Lumotive asset showing kit hardware — rather than being
   stripped to a bare band. The package asks for a family shot of the kits
   together, which is an upgrade on it. Swapping `media` on `1b368f3c` is a
   one-field change.
3. **All six kit photographs.** Package page 04 lists the kit photos at full
   resolution as a new asset, and **LI140, ON140 and MD180 have no photograph
   in this repository at all**, so the rows ship uniform rather than half
   illustrated. Adding `media` per card later is data-only.
4. **`/dev-kits/transmit-modules`, `/dev-kits/itof`, `/dev-kits/dtof`** 404
   until pages 13, 14 and 15 are built. The links carry the approved
   destinations and need no change.
