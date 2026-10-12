# Page 11 — /sense/automotive

Approved content package rev. 2026-10-07 (v2), page 11 of 21, "Sense ›
Automotive". Branch `feedback-20261007-v2`.

**Status: implemented and QA-verified.** New page, plus the two navigation
entries that were waiting on it.

## What shipped

One reversible migration, `1787710100_sense_automotive_page11.js`. The page is
a child of `/sense`, so `computePath` resolves `sense/automotive`, the URL the
page-01 site map gives it. The footer has linked there since the footer rebuild
and had been answering 404; it now resolves.

| # | id | Type | Section |
| --- | --- | --- | --- |
| 1 | `d81f4a60` | `heroBand` | Solid-State Surround Sensing for Vehicles and Heavy Equipment |
| 2 | `b47c9e13` | `splitDefault` | Near-Field Blind Spots Need Too Many Sensors |
| 3 | `3e05d7b2` | `splitDefault` | A Programmable Cocoon Around the Vehicle + four bullets |
| 4 | `9c2a6f85` | `splitDefault` | First Solid-State 180° dToF Lidar at 30 FPS |
| 5 | `6a1b38fc` | `cardsTextCards` | Built for Real-World Conditions — five across |
| 6 | `70e9c54d` | `cardsTextCards` | Beyond Passenger Vehicles — three cards |
| 7 | `f2764b90` | `cardsMediaCards` | Evaluate Solid-State dToF — NM120 and MD180 |
| 8 | `c58e02a7` | `ctaSplitLinks` | Build Your Safety Cocoon With Us |

The industry-first link goes to the News post, per the dev note, and the page
carries no date: the target is the 2026-04-09 press release
"Lumotive's LCM Optical Semiconductor Platform Enables First Solid-State 180°
dTOF LiDAR at 30 FPS", which is the exact announcement the heading names.

The dev note on section 7 removes the roadmap section and keeps software and
compute partners unnamed; the approved copy already satisfies both, and
"roadmap" appears nowhere on the page.

Actions carry the page-02 inquiry parameters `automotive` and `md180`.

### Content moved from Applications

Package page 08 moves "Automotive Safety Cocoon" off `/applications` to this
page. Its destination is section `3e05d7b2`, which carries **page 11's own
approved copy** for that subject rather than the older Applications wording —
page 11 is the authority for what this page says, and its version is longer and
more specific. The superseded Applications copy stays recoverable in the down
path of `1787709500_applications_page8.js`.

### Navigation

Both entries that `1787710000_header_sense_menu.js` deliberately held back are
now live, in the same migration that creates the page so the two can never be
out of step:

- The **Sense** dropdown gains Automotive between Robotics and Dev kits,
  completing the approved group: Overview · Robotics · Automotive · Dev kits.
- The **Applications** group's Automotive entry moves off the `/applications`
  placeholder onto `/sense/automotive`.

The down path removes the Sense entry and returns the Applications entry to
`/applications`, verified by round-tripping.

### Rendering changes

- `ctaSplitLinks` gains an optional `note`, printed before the secondary action,
  which is how the package sets "Designing at the chip level? Explore LCM
  chips →".
- `.cta-text-link` takes the 2.75rem minimum height the other standalone
  actions carry; it had been a 25px tap target. This also fixes the same link
  on the home page's stacked CTA.
- `.split-body` gains bullet styling, since the global stylesheet only styles
  lists inside `.prose` and the safety cocoon section carries four bullets.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, every inner column on one edge. Grids step
  1 → 2 → 3 → 5 for the five conditions, 1 → 2 → 3 for Beyond Passenger
  Vehicles, 1 → 2 for the two kits.
- **Headings** render in the package's order, all eight. The safety cocoon
  bullets render as four list items.
- **Compliance:** "Physical AI" **0**; no klux, no 1550 nm or FMCW, no
  "roadmap", no "download".
- **Links:** `/sense`, both `/contact?inquiry=` targets, the News post and
  `/lcm-chips` all 200. `/dev-kits/dtof` 404 — approved destination from
  page 15.
- **Navigation:** every header link resolves 200 at both 1440 and 390, with no
  dangling fragment.
- **Migration round-trip:** after revert the route 404s, the Sense group drops
  back to three entries and the Applications entry returns to `/applications`;
  after re-apply, all three are correct again.
- `svelte-check` and the production build both clean.

### Two defects caught during QA and fixed

- The Evaluate section was set to four columns, which put its two kit cards in
  a half-empty row from `lg` upward. The flag is removed, so two cards sit
  two-up.
- The CTA's secondary link was a 25px tap target, below the 44px floor the rest
  of the site meets. Fixed in `CtaDefault`, which also corrects the home page.

## Blockers

All four are approved visuals that have not been supplied. Each omitted visual
leaves its section as a single reading column rather than a half-empty split;
adding `media` later restores the two-column layout with no further change.

1. **Hero image** — vehicle with near-field coverage rings.
2. **Safety cocoon top-down graphic** — vehicle with 10 m / 20 m / 50 m coverage
   rings from corner sensors. Listed as a new asset on package page 04.
3. **180° point cloud or video** beside the industry-first section.
4. **Heavy dust and rain multi-return images** (first object, second object,
   combined) for Built for Real-World Conditions. Also new assets on page 04.

Plus, unchanged from earlier pages:

5. **`/dev-kits/dtof`** 404 until package page 15 is built. The link carries the
   approved destination and needs no change.
6. **Module and Solution Providers** still pending across pages 09, 10, 12
   and 19. Page 11 does not use the component.
