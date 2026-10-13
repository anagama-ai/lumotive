# Page 15 — /dev-kits/dtof

Approved content package rev. 2026-10-07 (v2), page 15 of 21, "Sense › Dev Kits
› dToF Dev Kits". Branch `feedback-20261007-v2`.

**Status: implemented and QA-verified.** Awaiting screenshot review before
page 16.

## What shipped

Two reversible migrations.

### `1787711200_dtof_dev_kits_page15.js`

"NEW · CATEGORY PAGE, REPLACES NM120 PAGE". Same shape as pages 13 and 14: the
`/nm120` record is renamed to `/dev-kits/dtof`, parented to the Dev Kits hub,
sections swapped for the page-15 set. The page keeps its id and version
history; the down path restores all seven previous sections **byte-identically**.

Thirteen sections in the package's order: hero · "Three Design Choices,
Decoupled" · NM120 at `#nm120` (opener, four spec tiles, four signature
features, HDR block, tracking video, outdoor application row, action pair) ·
MD180 at `#md180` (opener, four tiles, single action) · closing CTA with the
reference design caveat.

**Reused, not re-added.** The tracking video is the existing staging embed
`vimeo.com/1102359216`, which the package marks "Existing video"; it moves from
its own full-width section into the split that carries the approved heading and
copy beside it. The hero banner is the existing NM120 photograph — which is
what **Webvizio #161** asks for, the banner showing NM120 and not MD42 — and
the NM120 section takes the second existing NM120 photograph, so the two are
distinct.

**Inquiry values:** `nm120-datasheet`, `nm120-embed`, `md180`,
`dtof-evaluation` — the page-03 list for this page in full. No datasheet
download anywhere; the datasheet is a contact request, per the dev note.

**Terminology.** Page 15's approved copy uses neither "beam steering" nor
"beamforming", so no wording changed. "Beam width" and "scan angles" are
standalone terms and stay as printed.

**Navigation.** The Sense dropdown gains "dToF dev kits", entry 2.4.3,
completing the three Dev Kits children. Every menu destination now answers 200.

### `1787711300_nm120_to_dtof_redirect.js`

`/nm120` → `/dev-kits/dtof#nm120`, **308**, carrying the fragment the site map
spells out. Fourth of the five page-02 redirects; only `/products` remains, and
it has no page to replace.

### No shared-component changes

Everything reuses what pages 12 to 14 established: `heroBand` with its band
hero, `cardsTextCards` with `columns` and `casing: "exact"`, `splitDefault`
(including its `videoUrl` art column and its no-media single-column variant),
`statsLightTraits` on `specTiles`, and `ctaSplitLinks` stacked in both the
light per-kit tone and the dark page tone.

## Held back — pending input from Lumotive

Package page 15 prints an orange **pending input** box over the NM120 section,
and package page 04 lists both items: the **Stella-120 sensor head power
figure**, and confirmation that **"NM120 sensor head outputs MIPI" can be
stated publicly**. Three things therefore do not ship:

1. **The POWER tile.** Its value is `[X] W`, a bracketed placeholder, which
   page 01 says never to publish.
2. **The INTERFACE tile.** Its value and qualifier, "MIPI / sensor head; GigE
   with compute", are exactly the claim awaiting confirmation.
3. **"Modular by Design", in full.** Its heading, its introduction and its
   "Your compute" card all rest on the same claim, and approved copy cannot be
   reworded around it. Its photograph has not been supplied either.

The NM120 spec block therefore ships **four tiles rather than six**, which sets
as one even row. One confirmation plus one photograph restores everything. The
held copy, recorded here so nothing is lost:

> **Modular by Design** — Use NM120 as a complete lidar, or take it apart. The
> sensor head outputs MIPI, so you can pair it with your own compute and embed
> it directly in your platform or a custom enclosure.
> **Complete lidar** — Sensor head plus compute, GigE out.
> **Your compute** — Sensor head only, MIPI out.
> **Your enclosure** — Embed the internals in your platform.
> Caption: Built on Namuga's Stella-120, the same sensor head customers build
> into products.
> Image: NM120 internals without enclosure, sensor head and compute board shown
> separately (supplied by Lumotive).
>
> Spec tiles: **INTERFACE** MIPI — sensor head; GigE with compute ·
> **POWER** [X] W — sensor head; <17 W total with compute.

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, every inner column on one edge.
- **Copy:** seven headings in the package's order; the four NM120 tiles read
  "72 m / 32 m at 10%", "120° × 90°", "256 × 192", "30 Hz full frame / 900 Hz
  in ROIs"; the four MD180 tiles read "185° × 110°", "50 m", "30 Hz", "GigE /
  integrated compute".
- **Compliance:** no "beam steering", no MD42, no downloads, no klux, no
  operating temperature, no 1550 nm / FMCW / Tx-Rx, no dates, **no availability
  wording** (the MD180 dev note), no `[X]` placeholder, **no MIPI claim**, no
  "Physical AI", no "new era".
- **Links:** `#nm120` and `#md180` resolve to real sections; `/nm120` 308s with
  its fragment; `/dev-kits`, `/platform` and all four `/contact?inquiry=`
  targets 200. No external links in main.
- **Tap targets:** one 23px item, the breadcrumb — the accepted condition from
  `/sense/robotics`.
- **Migrations:** apply, revert, re-apply. The revert restores the seven
  previous sections byte-identically, clears the parent, drops the menu child
  and removes the redirect.
- `svelte-check` 589 files, 0 errors; production build clean. Pages 05 to 14
  all still answer 200 and the three earlier redirects still 308.

## Blockers

1. **MIPI confirmation + Stella-120 power figure** — see above. Unblocks two
   spec tiles and the whole "Modular by Design" section.
2. **HDR demo visual** (main pulse against low-power pulse, coloured by
   intensity). Package page 04 lists it as a new asset shared with `/sense`, so
   the HDR block ships as its approved heading and copy only.
3. **NM120 internals photograph** (enclosure removed, head and compute board
   separate).
4. **Outdoor application icons**, Webvizio **#160**. The application row uses
   the same accent-ruled cards pages 13 and 14 use. **#160 stays open.**
5. **Vimeo playback** for `1102359216` needs a check on a normal network; this
   environment blocks the player, as it does for the other Vimeo embeds.
6. **Site-wide "beam steering" audit** still owed — thirteen occurrences
   outside page 14, listed in `handoff/page-14-itof-dev-kits.md`.
