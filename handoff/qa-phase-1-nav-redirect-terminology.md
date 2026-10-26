# Final QA, phase 1 — header, /products, terminology

Commit `c4e34d3`, branch `feedback-20261007-v2`. Local only; nothing pushed.

Three migrations, all data, no component touched:

| Migration | What |
| --- | --- |
| `1787712400_header_approved_sitemap.js` | Header rebuilt to the approved site map |
| `1787712500_products_to_dev_kits_redirect.js` | `/products` → `/dev-kits` |
| `1787712600_beamforming_terminology.js` | "beam steering" → "beamforming", 14 strings |

## C1 — header

Only the Sense group had ever been brought to the approved menu. The
consequence the audit found: **/lcm-chips, shipped as package page 07, was
unreachable from the header entirely.** Platform was a bare link with nowhere
to hang its children, Applications sat beside Platform rather than inside it as
site map entry 1.3, and Company offered a "Careers" jump to the Lever board
instead of the approved four.

The menu is now:

```
Platform   LCM Technology /platform · LCM Chips /lcm-chips · Applications /applications
Sense      Overview · Robotics · Automotive · Dev Kits & Reference Designs
             └ Transmit modules · iToF dev kits · dToF dev kits
Connect    /connect — direct link, no dropdown
Company    About · Culture & Careers · Partners · News & Events
Contact    the button, unchanged
```

The component already rendered three levels from this shape — the Sense group
had been proving it — so this is purely the `globals.header` record. The small
descriptive line under each new entry is chrome rather than approved copy, so
each one is that page's own approved hero subline: "Software-defined light
control, built on optical semiconductor technology" from /platform,
"Solid-state beamforming on a semiconductor" from /lcm-chips, "One
semiconductor platform, many ways to put light to work" from /applications.

**One approved behaviour is still missing, and it is a component change rather
than data.** Page 02 has a click on the top-level label navigate to its URL;
the component renders that label as a plain `<details>` summary. Nothing is
unreachable, because each group's first child carries the group's own URL —
LCM Technology is /platform, Overview is /sense, About is /about. Recorded for
a later pass rather than faked.

## C2 — /products

Fifth of the five redirects on page 02 and the only one still missing. Nothing
had to be renamed first: this repository has never had a /products record, so
the path had been answering 404 since launch. All five now answer 308:

```
/lm10   → /lcm-chips                  /m30    → /dev-kits/itof#m30
/tx10   → /dev-kits/transmit-modules  /nm120  → /dev-kits/dtof#nm120
/products → /dev-kits
```

## C3 — beamforming

A **phrase** substitution, not a word one. Standalone uses are legitimate and
stay: "160° native steering", "90° steering", "mechanical steering" on the
traditional-optics comparison, "steering range", "Steering-direction
divergence", the "Steer" capability card. Case is preserved, so "Beam steering
module" became "Beamforming module".

Fourteen strings across six pages — /about (one leadership biography),
/platform, /applications, /sense, /lcm-chips, /dev-kits,
/dev-kits/transmit-modules — including the two `seoDescription` values the
rendered-page sweep could not see.

### Two things for Claudia

1. **The held clause.** /platform still reads "Digital beam steering, enabled
   by optical beamforming with Lumotive LCMs, lights the way for the future of
   lidar and 3D sensing." Substituting mechanically gives "Digital beamforming,
   enabled by optical beamforming", which is worse than what it replaces, and
   fixing it properly means rewriting the clause. **Needs a wording decision.**

2. **A biography was edited.** Sajid Husain's /about bio said "one-dimensional
   and two-dimensional beam steering technologies" and now says "beamforming
   technologies". Applied for consistency, but it is a person's own bio — say
   the word and it reverts in one field.

Also deliberately untouched: the media value `/lumotive/video/beam-steering.mp4`
is a file path, not copy.

**The approved package still prints "beam steering" in several of these
places.** Claudia's instruction supersedes it, which is why the printed copy
and the live copy now differ on this phrase alone.

## Verification

- All three migrations revert cleanly and re-apply; CMS round-trips byte-identical.
- All 17 header destinations answer 200. All five redirects answer 308 to the right target.
- Rendered copy across all 17 routes carries no "beam steering" except the one held clause.
- Desktop dropdowns and the mobile accordion both render all three levels; the
  footer's fourteen nav links now match the header's exactly.
- 390 / 768 / 1024 / 1440: no overflow, no new contrast failure, no broken image.
- `svelte-check` 592 files, 0 errors. Production build clean.

Pre-existing and unchanged: the three third-level nav rows (Transmit modules,
iToF, dToF) are 34px tall on desktop hover, under the 44px target guide. They
shipped with the Sense group and are styling, not data.

## Still open from the audit

- **C4** homepage — 6 contrast failures, two 25px links (`.posts-link`,
  `.section-link`), `logosMarquee` missing `data-align`. That page belongs to PR #1.
- **C5** `/privacy-policy` 404s from the footer on every page.
- **C6** no meta description on `/`, `/platform`, `/applications`, `/sense`,
  `/dev-kits`; no `og:image` anywhere; `/news` absent from `sitemap.xml`.
- **M1** /platform — a ~100px band where both swap cards sit under 0.5 opacity.
- **M3** approved inquiry values `media` and `careers` are never linked to.
