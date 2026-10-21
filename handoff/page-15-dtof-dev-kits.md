# Page 15 — /dev-kits/dtof

Approved content package rev. 2026-10-07, page 15 of 21, "Sense › Dev Kits
› dToF Dev Kits". First built against v2; **v3 pass applied 2026-10-21**.
Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Still held for Lumotive: the
NM120 POWER and INTERFACE tiles and "Modular by Design" (F2–F4), the HDR
demo (F5), outdoor icons (F7). In-page playback of the tracking video is
unverified (F6 / S19). See "Blockers (after v3)".

## v3 pass (2026-10-21)

**Copy.** The v2→v3 text diff of page 15 is empty, and the orange "PENDING
INPUT FROM LUMOTIVE — LEAVE OUT UNTIL SUPPLIED" box is unchanged in v3, as
are both page-04 items (Stella-120 power figure; "sensor head outputs MIPI"
confirmation). So the POWER and INTERFACE tiles and all of "Modular by
Design" stay out; nothing `[X]`, no MIPI claim, no "<17 W". Every live
heading, tile, card, caption, action and the caveat matches v3 verbatim, in
the printed order.

**Simon's annotations, mapped by position:**

| # | Position | Content | Outcome |
| --- | --- | --- | --- |
| A1 | Hero "Banner: NM120 (not MD42, #161)" | IMG_0031, NM120 with heatsink, transparent PNG 1920×1955 | Not in the repo (best match 0.62). **Now the hero.** |
| A2 | "Photo: NM120 enclosed unit" | IMG_0032, transparent PNG 963×1017 | Already in the repo twice: `nm120-sensor.jpg` (live, white-backed) and `nm120-module.png` (transparent, unused, identical alpha). **Approved M30 treatment applied.** |
| A3 | HDR block | "Check with Elyar for new HDR demo" | A question, not an asset. HDR block stays copy-only (F5). |

MD180 has no annotation and the PDF prints no photo slot in its section, so
it stays eyebrow, heading, line, four tiles and one action. Simon's MD180
photo (page 12) is not assigned here and was not added.

**Migration** `1787714400_dtof_v3.js`:

- **Hero (`a7c0d613`).** `hero-nm120-heatsink.webp`, 2880×1200, 39 KB: the
  cut-out composed on white, device at 67% of the height, centred at 81.5% of
  the width. Proportions were solved so the device is whole and right of the
  headline at 1024–1920 and whole at 768. New opt-in `mediaAnchor: "100%"`
  on `HeroFullHeight` (horizontal object-position at every width) keeps the
  right edge in frame. Phones reuse the page-14 options:
  `mobileMediaScale: "1.8"` and `mobileMediaPosition: "94%"` fill the band
  with the device as a backdrop, so no white backdrop shows as a band.
- **NM120 opener (`d903b4f2`).** `nm120-sensor.webp`, the existing
  transparent original at the same 963×1017 canvas (64 KB), with
  `mediaFrame: "panel"`: white panel from 768px, none on phones.
- The old JPGs stay for the down path. Reverts exactly.

### v3 QA

- **Hero device, whole** (band px): 1920 `1312–1818 × 99–635` (headline ends
  1070) · 1440 `975–1362 × 101–511` (940) · 1280 `838–1206` (800) · 1024
  `627–957` (headline 644, body 600) · 768 `239–679 × 115–581`. Phones show
  the device filling the band behind the copy, by design.
- **Hero contrast** (text hidden, 99th percentile of the background /
  brightest pixel): body 7.77/6.83 (390), 7.75/7.12 (430), 8.84 (768), 5.95
  (1024), 7.11 (1280), 7.38 (1440), 8.04 (1920); headline ≥ 4.47 (large text,
  3:1); eyebrow ≥ 9.35. Before, on phones, the old hero's brightest pixel put
  the body at 3.57 and the headline at 3.77; top-edge luminance on phones
  drops from 0.165 to 0.025.
- **NM120 photo, whole, no crop:** 268×284 at 390, 298×315 at 430, 337×356
  at 768, 457×483 at 1024, 600×634 at 1440, 710×750 at 1920, aspect 0.947
  (canvas 0.947). White panel from 768px, transparent on phones. Same sizes
  as before the change.
- **Anchors and redirect:** all eight section anchors exist; `/nm120` →
  **308** `/dev-kits/dtof#nm120`, landing with the NM120 heading in view;
  `#md180` lands with its heading in view.
- **Actions:** `nm120-datasheet`, `nm120-embed`, `md180`, `dtof-evaluation`
  (hero and CTA) — all contact requests, all 200. No `download` attribute,
  no PDF link. `/dev-kits` and `/platform` 200.
- **Caveat:** present once, under the closing CTA "Take Solid-State dToF
  Outdoors", verbatim.
- **Compliance:** none of "beam steering", MD42, klux, temperature, 1550,
  FMCW, Tx-Rx, `[X]`, MIPI, availability, download, "Physical AI", "new era",
  "Modular by Design", Stella-120, "17 W" in the rendered page.
- **Tracking video** (`1102359216`): content matches the copy. The Vimeo
  thumbnail shows the basketball dribble at 90°/10 fps, 40°/22 fps and
  10°/80 fps. **In-page playback is unverified:** embedded, the player
  showed Vimeo's "We couldn't verify the security of your connection", and
  so did the direct player URL in the same session. The cause is not
  established. The page-14 clip played in-page earlier the same day.
- **Layout and contrast:** no horizontal overflow at 390, 430, 768, 1024,
  1280, 1440, 1920; no broken image; light-section contrast scan 64 elements,
  0 failures at 1440 and 390. Only tap target under 44px: the 23px
  breadcrumb (accepted condition). Section spacing unchanged from v2.
- **Regression:** heroes on `/dev-kits/itof` (still framed on desktop, 25%
  and 1.2 on phones), `/dev-kits/transmit-modules`, `/sense`,
  `/sense/robotics`, `/sense/automotive` and `/dev-kits` keep their crop and
  heights; none is anchored. The only other panel frame is the iToF M30.
- **Migration:** revert restored every page record byte-identically;
  re-apply changed only `dtof`. `npm run check` 592 files, 0 errors,
  0 warnings; `npm run build` passed, dev server stopped.
- **Screenshots** (outside the project): `%TEMP%\lumotive-review\dtof\`
  - `desktop-1440-01-hero` … `08-cta-footer`, `mobile-390-01-hero` … `08-cta-footer`;
  - `desktop-1920-01-hero`, `tablet-1024-01-hero`/`03-nm120`,
    `tablet-768-01-hero`/`03-nm120`, `mobile-430-01-hero`/`03-nm120`;
  - `before\` — the previous hero and NM120 photo at 1440 and 390.

### Blockers (after v3)

1. **Stella-120 power figure (F2) + MIPI confirmation (F3)** — restore the
   POWER and INTERFACE tiles and "Modular by Design" (held copy below).
2. **NM120 internals photo (F4)** for "Modular by Design".
3. **HDR demo (F5)** — Simon: "Check with Elyar for new HDR demo". Whether
   the `/sense` "Lumotive HDR" clip (Vimeo 1235957120) also serves this page
   is Lumotive's call; not embedded here meanwhile.
4. **Tracking video in-page playback (F6 / S19)** — re-test in a normal
   browser on staging.
5. **Outdoor application icons (F7, Webvizio #160).**

Resolved by v3: the hero banner (#161, A1) and the NM120 enclosed-unit photo
treatment (A2). The site-wide "beam steering" audit (old blocker 6) was done
in `1787712600`.

## What shipped in the v2 build (history)

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

## QA (v2)

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

## Blockers (v2, superseded by "Blockers (after v3)" above)

1. **MIPI confirmation + Stella-120 power figure** — see above. Unblocks two
   spec tiles and the whole "Modular by Design" section.
2. **HDR demo visual** (main pulse against low-power pulse, coloured by
   intensity). Package page 04 lists it as a new asset shared with `/sense`, so
   the HDR block ships as its approved heading and copy only.
3. **NM120 internals photograph** (enclosure removed, head and compute board
   separate).
4. **Outdoor application icons**, Webvizio **#160**. The application row uses
   the same accent-ruled cards pages 13 and 14 use. **#160 stays open.**
5. **Vimeo playback** for `1102359216` needs a check in a normal browser; the
   headless session got Vimeo's security screen. Cause not established.
6. **Site-wide "beam steering" audit** — done in `1787712600`.
