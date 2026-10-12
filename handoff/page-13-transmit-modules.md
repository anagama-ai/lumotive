# Page 13 — /dev-kits/transmit-modules

Approved content package rev. 2026-10-07 (v2), page 13 of 21, "Sense › Dev Kits
› Transmit Modules". Branch `feedback-20261007-v2`.

**Status: implemented and QA-verified.**

## What shipped

Two reversible migrations.

### `1787710400_transmit_modules_page13.js`

A move and a rewrite, not an addition. The existing `/tx10` record is renamed
to `/dev-kits/transmit-modules`, parented to the Dev Kits hub, and its sections
are swapped for the page-13 set, so the page keeps its id and version history.
`/tx10` then has no page, which is what lets the redirect resolve it.

| # | id | Type | Marker | Section |
| --- | --- | --- | --- | --- |
| 1 | `b41d7c05` | `heroBand` | CHANGE · TRANSMIT MODULE TEMPLATE | LCM-Based iToF Transmit Module |
| 2 | `d25f8a16` | `statsLightTraits` (`specTiles`) | CHANGE · KEY NUMBERS | Four spec tiles |
| 3 | `c3e07b94` | `cardsTextCards` | CHANGE · #151, #157 | What TX10 Lets You Do |
| 4 | `a7b91de3` | `cardsTextCards` | CHANGE · #154 + #155 MERGED | Programmable Illumination for a Dynamic World |
| 5 | `e6482fc1` | `cardsTextCards` | NEW | Kits Built on TX10 |
| 6 | `f0d3a5b8` | `ctaSplitLinks` (stacked) | CHANGE · CLOSING CTA | Pair TX10 With Your iToF Sensor |

**REMOVE · THREE SECTIONS** is satisfied by the swap: "What Is TX10?"
(Webvizio #150), "TX10 Reference Design Advantages" and the "TX10-DK" section
are gone. The down path restores all ten previous sections verbatim.

The key numbers row ships with no heading, because the package prints none over
it; "KEY NUMBERS" is the editorial marker, not copy.

Section 4's two illumination animations are omitted (see Blockers), so it ships
as heading, intro and the five approved benefits.

**Navigation.** The Sense dropdown gains "Transmit modules" as a child of Dev
kits, entry 2.4.1 of the approved site map. iToF and dToF Dev Kits are 2.4.2
and 2.4.3 and stay out until pages 14 and 15 supply their routes, so the menu
never points at a 404. Each is a one-entry addition to
`NEXT_DEV_KIT_CHILDREN`.

### `1787710500_tx10_to_transmit_modules_redirect.js`

`/tx10` → `/dev-kits/transmit-modules`, **308**. The second of the five
redirects page 02 lists; the remaining three wait on pages 14, 15 and the
`/products` destination.

### Rendering changes

- `ctaSplitLinks` gains an optional `caveat`, a small trailing line under the
  action row in stacked mode, for the reference design caveat. White at 75% on
  the dark panel, matching the existing `note`.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, every inner column on one edge. Grids:
  capabilities 1 → 2 → 4; benefits 1 → 2 → 3 → 5; kits 1 → 2.
- **Copy:** headings render "LCM-Based iToF Transmit Module", "What TX10 Lets
  You Do", "Programmable Illumination for a Dynamic World", "Kits Built on
  TX10", "Pair TX10 With Your iToF Sensor". The four spec tiles read "Up to
  35 W", "910 nm", "Up to 105°" with "~0.5° steps", "Python reference".
- **Compliance:** no "TX10-DK", no "What Is TX10?", no "two paths", no
  "download", no klux, no operating temperature, no 1550 nm / FMCW / Tx-Rx, no
  dates, no "Physical AI" on this page, lidar never capitalised, and **zero
  external links** in main.
- **Links:** `/dev-kits`, both `/contact?inquiry=` targets and the `/tx10` 308
  all resolve. `/dev-kits/itof` 404s — the approved destination from page 14.
- **Tap targets:** one 23px item, the breadcrumb "Dev Kits & Reference
  Designs". Same accepted condition as `/sense/robotics`: the 0.5rem gap gives
  31px centre-to-centre, clearing WCAG 2.5.8's spacing exception.
- **Migrations:** apply, revert and re-apply deterministically. The revert
  restores the ten previous sections **byte-identically**, clears the parent,
  and removes the menu child.
- `svelte-check` 589 files, 0 errors; production build clean.
- Pages 05 to 12 all still answer 200.

## Blockers

1. **Hero animation (Webvizio #129).** The package replaces the static hero
   image with an animation labelling the Tx optics. The asset has not been
   supplied, so the page keeps `tx10-hero.jpg`, which the package itself names
   here as the existing image. Swapping `media` on `b41d7c05` is a one-field
   change. Webvizio **#129 stays open**.
2. **The two illumination animations** in "Programmable Illumination for a
   Dynamic World": flood illumination beside non-sequential ROI pulses with a
   continuously sharpening point cloud. Neither has been supplied, and one
   panel beside an empty one reads worse than both omitted.
3. **`/dev-kits/itof`** 404s until page 14. Both kit cards carry the approved
   destination and need no change.
4. **ON140 and LI140 photographs** do not exist in this repository. The kit
   cards are text cards here, which is what the package shows on this page, so
   nothing is missing from the approved layout.
