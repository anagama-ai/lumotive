# Page 19 — /partners

Approved content package rev. 2026-10-07 (v2), page 19 of 21, "Company ›
Partners". URL confirmed as **/partners**, unchanged.

**Status: implemented and QA-verified.** Awaiting screenshot review before
page 20.

## What shipped

One reversible migration, `1787712000_partners_page19.js`. Six staging strips
become the five approved blocks.

| # | id | Type | Marker | What changed |
| --- | --- | --- | --- | --- |
| 1 | `e95fe8b0` | `heroBand` | KEEP AS IS | Subline is the package's sentence; one printed action |
| 2 | `c5fe1eab` | `logosLabelled` | CHANGE · MERGES CUSTOMERS AND MODULE PARTNERS · #121, #122 | "Module and Solution Providers"; no descriptor, no links, larger marks |
| 3 | `3138ddf9` | `logosLabelled` | CHANGE · MERGES TECHNOLOGY AND COMPONENT PARTNERS · #135, #136 | "Technology Partners"; absorbs the Software partner strip; **Fortsense removed** |
| — | `e8ed2bab` | — | — | "Software partner" strip, emptied by the merge |
| 4 | `7c333883` | `logosLabelled` | KEEP AS IS | "Distribution Partners"; alignment only |
| 5 | `daf9e626` | `ctaSpectrum` | NEW · CLOSING CTA | "Build With Us" → `/contact?inquiry=partnership` |

**Hero.** Two corrections against the printed page despite KEEP AS IS, both
from the page-01 copy rule: the subline opens "We work with" where staging
opened "Lumotive works with" and adds the serial comma, and the hero carries
the one printed action. Staging's "Explore the ecosystem" is not on the
approved page.

**No external links in main.** Only `/contact` and
`/contact?inquiry=partnership`, which satisfies "no external links" on the
provider strip and the page-01 site-wide removal.

## Logo size — Webvizio #135

The marks each shipped inside a canvas that was mostly empty: measured, content
filled **15% to 52%** of the file, so the CSS caps were sizing padding rather
than the logo. All fourteen PNGs are **cropped to their own content** — lossless
crop, no scaling, no stretching. Blocks 2 and 3 also take `layout: "centered"`,
so three marks and seven marks centre rather than hanging off the left of a
five-column grid. Rendered mark heights are now up to 64px.

## Light panels, not dark

Staging set the customers and component strips on the dark panel, where they
were close to invisible: every partner mark here is a coloured or near-black
wordmark drawn for a light background, and unlike the investor logos on /about
**none of them has a white variant in this repository**. Inverting artwork is
not ours to do, so both strips take the same light panel the Distribution
Partners strip has always used, which also gives the three partner strips one
treatment.

## The two reported contrast failures — fixed

Both were the descriptor line on the light logo strips, `--color-muted` at the
lead size, measuring **3.34:1** against a 4.5:1 floor. `logosLabelled`'s
`.intro` now takes Slate Text, the correction the rest of the site carries. The
dark panel keeps its own white-at-70%, which clears the floor. `/partners`
reports **zero contrast failures** at all four widths.

A second defect found while verifying: on a phone the two-column grid cell is
narrower than the 11rem image cap, so a wide mark spilled into its neighbour —
one measured overlap at 390px in the Distribution strip. The cap is now
`min(11rem, 100%)`. Zero overlaps at every width.

## Held — nothing invented in its place

Two named partners have **no logo in this repository** and none is fabricated:

1. **Leopard Imaging**, first in the Module and Solution Providers order. Its
   absence is why Webvizio **#121 stays open**; the strip ships with the three
   marks that exist, in the package's relative order.
2. **onsemi**, first in the Technology Partners order. The strip ships with the
   other seven, in the package's order.

Both are a one-entry data edit once the artwork arrives.

### Electronic Photonics — unblocked

Package page 04 lists the logo as a pending input, and earlier handoffs
recorded this strip as blocked on it because the file is named
`ephotonics.png`. **The artwork itself was checked**: it is a wordmark reading
"≡ PHOTONICS", with the E set as three bars, and it carries none of the
"e-Photonics" spelling page 01 removes. Only the CMS label did, and that label
is now "Electronic Photonics". The mark is kept and the pending input becomes a
swap rather than a blocker.

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, no tap target under 44px, every inner column on one edge
  (16 / 24 / 24 / 80), **zero overlapping logos** in all three strips, every
  mark inside its panel.
- **Copy:** five headings in the package's order. The fourteen logo alts read
  Namuga, Hokuyo, Electronic Photonics, Lumentum, Vertilite, Gpixel, ADAPS,
  Lattice, SolidVue, MulticoreWare, EDOM Technology, Uniquest, Restar, Macnica.
  **No Fortsense.**
- **Links:** `/contact` and `/contact?inquiry=partnership`, both 200; no
  external links in main.
- **Migration:** applies, reverts to the previous six sections, re-applies.
- `svelte-check` 592 files, 0 errors; production build clean.
- **Regression:** pages 05 to 18 all answer 200 and report zero contrast
  failures, `/about`'s investor panel included.

## Blockers

1. **Leopard Imaging logo** — Webvizio #121 stays open.
2. **onsemi logo.**
3. **Electronic Photonics logo** — downgraded from blocker to optional swap;
   see above.
4. `static/lumotive/logos/fortsense.png` is now unreferenced. Left in place
   rather than deleted, since removal from the site is what page 01 asks for.
