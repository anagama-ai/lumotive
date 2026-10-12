# Page 07 — /lcm-chips

Approved content package rev. 2026-10-07 (v2), page 07 of 21,
"Platform › LCM Chips · CHANGE · REPLACES THE LM10 PAGE".
Branch `feedback-20261007-v2`. Not committed, not pushed, not deployed.

## Completed

The `/lm10` page record was renamed rather than duplicated, so the page keeps its
id, version history, and place in the tree, and `/lm10` stops resolving — which is
what lets the redirect fire. Migration `1787709000_lcm_chips_page.js`; its down path
restores the LM10 title, slug, path and sections verbatim.

| Package section | Type | Anchor |
| --- | --- | --- |
| Hero "LCM Beam Steering Chips" + "Talk to our team" / "Request the LM10 and LS20 flyer" | `heroBand` | — |
| "Product Overview" + the four spec tiles | `statsLightTraits` · `specTiles` | `#overview` |
| "LM10 and LS20 at a Glance", eleven rows, two columns | `cardsSpecComparison` | `#at-a-glance` |
| "From Fixed Sensors to Programmable Eyes" + the four-step transmit path | `cardsIconQuad` | `#how-lcm-fits` |
| The five software-defined capabilities | `cardsTextCards` | — |
| "Three Design Choices, Decoupled" + closing line | `cardsSpecComparison` | `#decoupled` |
| "Works With Your Architecture" + "New to metasurfaces? Explore how LCM steers light →" | `cardsTextCards` | `#architecture` |
| Start Building blocks + reference design caveat | `cardsTextCards` | `#start-building` |

Global rules honored: Gen 1 / Gen 2 labels appear here and only here; no
availability, dates, roadmap or generation dates; no operating temperature; no
1550 nm, fiber lasers, FMCW or Tx/Rx; no klux; no downloads (the flyer is a contact
request); lidar lowercase in body copy; the page ends with its own Start Building
action rather than a generic contact section; meta description set from the hero
sentence.

Hero actions carry the page-02 inquiry parameters `?inquiry=lcm-chips` and
`?inquiry=chips-flyer`. Both resolve 200 today; the form's hidden fields that read
them are page-02 work.

### Redirect

`1787709100_lm10_to_lcm_chips_redirect.js` adds `/lm10` → `/lcm-chips` to the
existing `redirects` collection. `hooks.server.ts` catches the 404 on GET/HEAD and
answers 308. Verified: `/lm10` → `308 /lcm-chips`. This is the first of the five
redirects on package page 02; the other four (`/tx10`, `/m30`, `/nm120`,
`/products`) wait on the pages that supply their destinations.

### Layout corrections (`1787709200_lcm_chips_layout_corrections.js`)

Review against the PDF after the first pass. No copy changed; every string is
byte-identical, capitalization included.

1. **Hero is the approved split**, `heroBand` → new `heroSplit`: copy left, chip
   photo right, instead of the photo painted as a full-bleed background. Staging
   type, amber eyebrow, white pill and arrow link are unchanged — only the
   arrangement differs. With no media the copy keeps the full column rather than
   holding a half-width gap open.
2. **Product Overview specifications sit in four distinct compact cards**:
   `rounded-card`, `bg-surface`, `border-border`, padding tightened from the
   standard 2rem to 1.5rem for a tile of three short lines. Label above, value
   below, qualifier under that.
3. **Comparison table kept.** Neither column photo exists in this repository, so
   neither card sets `media` and no empty photo frame renders.
4. **"From Fixed Sensors to Programmable Eyes" regrouped.** The four numbered
   steps are one compact numbered list (new `steps` design version on
   `cardsTextCards`, capped at `max-w-3xl`) instead of a four-up card grid, so the
   signal path reads as a sequence rather than four mostly empty boxes. The
   package's two captions are now two separate elements on that section rather
   than one merged paragraph above the capability cards; that paragraph is
   removed and the capability section keeps only its five cards.

### Focused pass (`1787709300_lcm_chips_capabilities_and_contrast.js`)

Second review against the PDF. Again no copy changes: the migration sets
presentation flags and moves two captions between fields.

1. **Capabilities are five across on wide screens**, as the package prints them,
   instead of the 3 + 2 the default three-up grid produced. New `columns: "5"`
   on `cardsTextCards` steps 1 → 2 → 3 → 5 (base → `sm` → `lg` → `xl`), so no
   breakpoint leaves a one-card orphan row. Verified at 390, 768, 1024, 1280,
   1440 and 1920 with no horizontal overflow at any width.
2. **Card titles keep the package's own capitalization.** New `casing: "exact"`
   stops the site-wide AP-style headline pass. The record already held
   "Software-defined range"; only the renderer was publishing
   "Software-Defined Range". The same flag is set on the numbered steps, whose
   labels are sentence case in the package too ("LCM beam steering", "ToF sensor
   and receive lens"). **Section headings are deliberately excluded** — the
   package title-cases those and sentence-cases the cards beneath them, so
   "From Fixed Sensors to Programmable Eyes" stays title case while its step
   labels do not.
3. **The LCM-based lidar column is emphasised.** New `emphasis: "true"` on a
   `cardsSpecComparison` column gives it a Laser Blue wash at 6%
   (`bg-brand-blue/6`, the same token `CardsComparisonCards` uses) and sets its
   values in the medium weight. The section argues for that column and read as
   two equal lists without it.
4. **Captions reordered.** "The field of view is illuminated in discrete regions
   of interest (ROIs)." now sits directly under the numbered steps, and the
   scan-timeline caption follows it. They remain two separate elements.

### Contrast

Measured in the browser with alpha and `oklab()` backgrounds composited on a
canvas, against the WCAG 2.1 AA floor (4.5:1, or 3:1 for large text). Every
probe on the page now passes:

| Element | Before | After | Fix |
| --- | --- | --- | --- |
| Spec tile value (amber) | 1.80 | 18.22 | Value takes Optical Ink; the accent cycle moves to a decorative rule above it |
| Spec tile label / qualifier (muted slate) | 4.0 / 4.0 | 18.22 / 7.54 | Optical Ink label, Slate Text qualifier |
| Glance column label (green "Gen 2") | 3.37 | 16.57 | Optical Ink; the emphasised column is marked by its wash instead |
| Step number (amber "3") | 1.80 | 4.57 | Laser Blue for every number |
| Card link (green / amber) | 3.37 / 1.80 | 4.57 | Laser Blue for every card link, which is also DESIGN.md's rule that accents never take the action colour |
| Section link | 4.33 | 5.64 | Deep Laser Blue |
| Captions and notes (muted slate) | 3.8 | 6.85 | Slate Text |

All replacements are existing palette tokens: `--color-ink`, `--color-text`,
`--color-brand-blue`, `--color-brand-blue-dark`. No new colors. The section-link
change also lifts `/platform`'s "Explore LCM chips" from 4.33 to 5.64.

Method: a 4×4 canvas paints the element's background stack over white and reads
the composited pixel, so `oklab()` fills and alpha washes are measured as
rendered. A first sweep that parsed the computed colour string directly
mis-read the `bg-brand-blue/6` wash and reported a false failure on the
emphasised column; the canvas method replaced it.

Two defects were found by this pass and fixed:

- `.section-link` in `CardsTextCards` had been lost to an earlier edit, so the
  shared action was rendering unstyled — inherited slate, weight 400, no 2.75rem
  minimum. Restored, and it now measures 44px tall at weight 650 on both
  `/lcm-chips` and `/platform`.
- `casing: "exact"` initially applied to section headings as well, which
  flattened "From Fixed Sensors to Programmable Eyes" to sentence case. The
  package title-cases section headings and sentence-cases the cards beneath
  them, so the flag is now scoped to card titles only.

### Code added for this page

- `HeroSplit.svelte` + `heroSplit` spec and dispatcher entry.
- `CardsSpecComparison.svelte` + `cardsSpecComparison` spec and dispatcher entry.
  Row-labelled comparison: each card is one column and its `body` lists that
  column's values as `<li>Label: Value</li>`, the spec-pair convention
  `CardsSpecPanels` already used. Desktop renders a real `<table>` with
  `scope="col"` / `scope="row"`; below `md` it renders one stacked card per column
  with its photo on top, which is the package's dev note for this table.
- `specTiles` design version on `StatsCentered`, for the Product Overview cards.
- `steps` design version, the five-up `columns: "5"`, `casing: "exact"`, and
  optional `note` and `outro` fields on `cardsTextCards`. `note` also carries the
  reference design caveat and the "New to metasurfaces?" lead-in. All are unset
  on every pre-existing section.
- `emphasis` column field on `cardsSpecComparison`.
- `CardsIconQuad` headings reserve two lines at the 4-up breakpoint, so a wrapping
  title no longer drops its body a line below its siblings. Also corrects the same
  misalignment on `/connect`. No longer used by this page, kept because the fix
  stands on its own.

## Verification

- `/lcm-chips` 200, all eight sections render, page title "LCM Chips".
- `/lm10` 308 → `/lcm-chips`.
- `/platform` "Explore LCM chips →" 200. Footer "LCM chips" 200. Header "LM10 chip"
  308 → `/lcm-chips`.
- Desktop 1440 and mobile 390 inspected in a live browser. Mobile: no horizontal
  overflow, the hero stacks to copy-then-photo, the four spec cards go two-up, the
  glance table renders as two stacked cards with eleven rows each, the numbered
  list stays one block, both captions stay separate, no tap target under 44px.
- Capability grid walked at 390 / 768 / 1024 / 1280 / 1440 / 1920: 1, 2, 3, 5, 5,
  5 columns, no overflow at any width.
- Rendered headings and card titles read back from the DOM and compared with the
  package: seven section headings in title case, four step labels and five
  capability titles in the package's sentence case.
- Contrast measured for every text role on the page with composited backgrounds;
  all pass AA. `/platform` re-checked for regression: chip cards, headings and the
  shared action unchanged apart from the link's improved contrast.
- `npm run check`: 589 files, 0 errors, 0 warnings. Impeccable detector: no
  findings in any touched component.

## Pending inputs

Omitted rather than published as placeholders, per the package rule.

1. **Chip-in-hand hero photograph. RESOLVED AS PENDING — no substitute ships.**
   The approved page-07 hero shows a chip held in a hand in the right column.
   It is not in `static/lumotive/img` and the `media` collection is empty
   (0 records), so it has never been supplied to this repository.
   **Outstanding as an asset.**

   `1787709200` had put `/lumotive/img/lm10-metasurface-module.webp` in the
   slot so the split layout would not ship half empty. That was an
   **unapproved substitute** and has now been removed by
   `1787709400_lcm_chips_hero_pending_photo.js`, per the package rule "Leave it
   out rather than publish a placeholder".

   `HeroSplit` drops the photo column when `media` is empty and gives the copy
   the full width, so the hero now reads as a deliberate copy-led band with no
   hole in it — verified at 1440 and 390. **No unapproved imagery ships.**
   When the approved photograph arrives, set `media` on section `b7c41d08` and
   the two-column layout returns with no further change.
2. **Matching LM10 and LS20 column photos** for "LM10 and LS20 at a Glance". The
   package lists the LS20 shot as supplied and the LM10 shot as pending; neither
   is in this repository, so both columns ship without a photo header and no
   empty frame renders. Setting `media` on either card in section `5d2b71ae`
   restores the photo header with no further change. Same pending LM10 photo as
   page 06.
3. **"How LCM fits in your lidar" two-panel integration.** Two media panels are
   specified and neither is supplied:
   - the **looping system animation** (deck GIF converted to looping MP4/WebM
     with a poster frame per package page 03), showing laser → LCM → transmit
     optics → scene in ROIs, and receive lens → ToF sensor;
   - the **SVG scan timeline** (angle vs time, bars lighting in sequence, synced
     to the animation, labelled for dwell time, beam width, frame rate and scan
     sequence) — rebuilt as SVG, not a slide screenshot.
   Section `9f08c3d6` renders no media slot at all, so nothing empty is left
   behind. When both arrive this is an integration, not a drop-in: the section
   needs its two-panel layout, the caption in `note` paired with the animation
   and the caption in `outro` paired with the timeline, and the timeline synced
   to the animation's scan sequence.

The package's "Reference: source slide (not for publishing)" is a dev note, not an
asset: the slide header, logo and confidentiality line are deliberately absent and
LCM is shown on the transmit path only.

## Dependencies on other pages

- **Start Building links.** `/dev-kits/transmit-modules`, `/dev-kits/itof` and
  `/dev-kits/dtof` resolve 404 today. They are the approved destinations from the
  page-01 site map and are supplied by package pages 13, 14 and 15. The links carry
  the correct destination and need no change — the same situation `/lcm-chips`
  itself was in while page 06 waited. Do not repoint them at `/dev-kits`.

  **Transmit-modules URL spelling: resolved, no change needed.** The site-map
  table on package page 01 prints the cell as `/dev-kits/transmit- modules`, with
  a space after the hyphen. That is a column-wrap artifact of the table cell, not
  a URL. Two other places in the package print the path on one unbroken line and
  both read `/dev-kits/transmit-modules`: the redirect list on page 02
  (`/tx10 → /dev-kits/transmit-modules`) and the expanded navigation tree, item
  2.4.1. The implemented link already uses `/dev-kits/transmit-modules`, which is
  correct. Pages 12 and 13 must create the page at that exact path.
- **Contact form hidden fields** (`inquiry`, source page, campaign) are package
  page 02. Until they land, this page's `?inquiry=` parameters are inert.
- **Navigation.** The header still carries the pre-package menu, where the Sense
  group's "LM10 chip" points at `/lm10` and redirects. The page-02 rebuild moves
  "LCM Chips" to the Platform group and drops that entry. The footer already
  follows the new site map and links `/lcm-chips` directly.
- **`/sense/robotics`, `/sense/automotive`, `/privacy-policy`** remain 404 from the
  footer and header; pages 10, 11 and a legal page that the package does not
  specify.

## Status

Page 07 is implemented and verified, with the PDF's layout, section order,
capitalization and AA contrast all checked in the browser at 390, 768, 1024,
1280, 1440 and 1920.

**The release blocker is cleared:** the unapproved hero substitute has been
removed and no unapproved imagery ships. The page is ready for staging review
as an approved-copy, approved-layout page whose optional photography and two
media panels are still pending.

Outstanding, none of which blocks review: the chip-in-hand hero photograph, the
LM10 and LS20 column photos, the "How LCM fits in your lidar" two-panel media
and its integration, and the three Start Building destinations that pages 13–15
supply. The transmit-modules URL spelling is resolved.
