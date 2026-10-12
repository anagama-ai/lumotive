# Page 10 — /sense/robotics

Approved content package rev. 2026-10-07 (v2), page 10 of 21, "Sense ›
Robotics". Branch `feedback-20261007-v2`.

**Status: implemented and QA-verified.** New page.

## What shipped

One reversible migration, `1787709900_sense_robotics_page10.js`. The page is
created as a child of `/sense`, so `computePath` resolves it to
`sense/robotics`, the URL the page-01 site map gives it. The footer and the
header's Applications submenu already linked there and had been answering 404
since the footer was rebuilt; both now resolve.

| # | id | Type | Section |
| --- | --- | --- | --- |
| 1 | `4c1a8e02` | `heroBand` | Adaptive 3D Sensing for Robots and Humanoids |
| 2 | `7d3e52b9` | `splitDefault` | Robots Carry Too Many Sensors |
| 3 | `9a0b7f31` | `cardsTextCards` | One Sensor, Three Jobs — three virtual sensors |
| 4 | `2e6c48da` | `cardsTextCards` | The four closing benefits |
| 5 | `b5f91c67` | `cardsTextCards` | Proven With a Major U.S. Robotics OEM — eight blocks |
| 6 | `18d4a7e5` | `cardsTextCards` | Built for Every Kind of Robot — six cards |
| 7 | `c90e36b4` | `cardsMediaCards` | Kits for Robotics — the kit card component |
| 8 | `6f24b8c1` | `cardsTextCards` | Design Your Own Sensor With Lumotive |
| 9 | `a73d519f` | `ctaDefault` | Put a Programmable Sensor on Your Robot |

Section 5 is built as blocks, which is what the package's "BLOCKS, NOT A TABLE"
marker asks for, and the dev note keeping the customer unnamed is satisfied by
the approved copy itself. Section 4 joins section 3 through spacing rather than
a repeated heading, as the package prints it.

The kit cards follow the page-03 component spec: name, one line, four spec
lines and a link to the category page, four across desktop, two tablet, one
mobile. M30 and LI140 and ON140 link to iToF, NM120 to dToF, assigned by
product type.

Both CTAs carry the page-02 inquiry parameter `?inquiry=robotics`.

### Rendering changes

- `cardsTextCards` gains `columns: "4"` (1 → 2 → 4), for the eight proof blocks
  and the four design steps.
- `CardsMediaCards` card bodies gain bullet styling, since the global
  stylesheet only styles lists inside `.prose` and the kit cards carry four
  spec lines each.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, every inner column on one edge. Grids step
  as specified: virtual sensors and robot kinds 1 → 2 → 3; proof, kits and
  design steps 1 → 2 → 4.
- **Headings** render in the package's order, all eight.
- **Compliance:** "Physical AI" **0** occurrences; no klux, no 1550 nm or FMCW,
  no operating temperature, no "download" anywhere on the page.
- **Links:** `/sense` 200, `/contact?inquiry=robotics` 200, the `#kits` anchor
  resolves. `/dev-kits/itof` and `/dev-kits/dtof` 404 — approved destinations
  from pages 14 and 15.
- **Migration:** applies, reverts and re-applies. After the revert
  `/sense/robotics` returns 404; after re-apply, 200.
- `svelte-check` and the production build both clean.

### One pre-existing finding, not changed

`Breadcrumbs.svelte` renders its links at 23px. This page is the first child
page on the site, so it is the first to show breadcrumbs at all. The links sit
in a list with a 0.5rem gap, giving 31px centre-to-centre, which clears WCAG
2.5.8's spacing exception, and the component is shared with any future child
page. Left as is rather than restyled from inside a page task; raise it if the
client wants a larger breadcrumb target.

## Blockers

1. **Hero image** — "AMR and humanoid in a warehouse, depth overlay". Not
   supplied; the band ships without one rather than with a stand-in. Adding
   `media` to `4c1a8e02` restores the image band with no further change.
2. **Three-panel AMR demo video** beside the virtual sensors. Package page 04
   lists the clean flash / LCM / stereo point-cloud renders and Vimeo
   1053591397 as new assets for Robotics; none is in this repository. The
   approved caption that belongs to it is held back with it, rather than
   published as a caption for nothing.
3. **All four kit photographs** — the package marks them "from the Q4 flyer",
   and page 04 lists the kit photos at full resolution as a new asset. Two of
   the four products, **LI140 and ON140, have no photograph here at all**, so a
   half-illustrated kit row would read worse than a uniform one. All four
   omitted; adding `media` per card later is data-only.
4. **Module and Solution Providers component** — still pending across package
   pages **09, 10, 12 and 19** until the Leopard Imaging and Electronic
   Photonics logos arrive. See `handoff/page-09-sense.md` for the full scope.
   The approved sentence naming those four providers is copy, not the logo
   component, and does ship, on section `6f24b8c1`.
5. **`/dev-kits/itof` and `/dev-kits/dtof`** 404 until pages 14 and 15 are
   built. The links carry the approved destinations and need no change.

## Copy reconstruction to confirm

The package prints several of this page's blocks as multi-column layouts, and
the PDF text layer extracts them column-interleaved. Every fragment is
accounted for exactly once and each result reads as a complete sentence, but
two headings are worth eyeballing against the rendered page before sign-off:

- The three virtual sensors read **"Localization"**, **"Cliff and obstacle"**
  and **"Object avoidance"**. Reading the extraction row-major across three
  columns gives exactly that split, and each pairs with the right body (centre
  slice, ledges and low obstacles, everything else). The alternative reading,
  "Cliff and obstacle avoidance" plus a bare "Object", leaves the third card
  with a heading that does not match its body.
- The kit card order is **M30, NM120, LI140, ON140**, taken from the heading
  row. The photo captions above them are listed in a different order
  (NM120, LI140, ON140, M30), which is why the photographs, when they arrive,
  must be matched to products by name rather than by position.
