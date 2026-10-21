# Page 07 — /lcm-chips

Approved content package rev. 2026-10-07 (v3), PDF page 07 of 21. Local branch `feedback-20261007-v2`; no push, merge, or deploy. Home and Platform v3 records and assets were preserved.

## v3 copy and placement

The v2→v3 PDF text diff changes the hero heading “LCM Beam Steering Chips” to **“LCM Beamforming Chips”**, its first sentence to “Solid-state beamforming on a semiconductor,” the LM10 architecture to “Beamforming module,” step 2 to “LCM beamforming,” and the Start Building transmit-module sentence to “Add LCM beamforming…”. All five had already been applied to this page by `1787712600_beamforming_terminology.js`; standalone “steers” and “steering” in other approved sentences and spec labels remain. The live H1 renders “LCM Beamforming Chips”.

The one remaining v3 copy delta is **“Raise range, resolution, or coverage without trading one against another.”** Migration `1787712900_lcm_chips_v3_simon_media.js` replaces the old “Optimize…” in the `outro` of the **Three Design Choices, Decoupled** section (`84f1b7e2`). The renderer places it visibly **below that section's three-row comparison table and before Works With Your Architecture**, as printed on v3 page 07. It was not moved to the hero or the LM10/LS20 spec table. The rest of the eight-section content and order remain unchanged.

## Approved photography, mapped by slot

| Slot | Source and evidence | Local media reference |
| --- | --- | --- |
| Split hero `b7c41d08` | Simon's sticky note at PDF page 07 y≈321 points directly at the **chip-in-hand hero** to [LS20-web.jpg](https://lumotive.com/wp-content/uploads/2026/10/LS20-web.jpg). This is explicit hero approval, not an inference from a comparison photo. The source was visually inspected as a hand-held LS20. | Existing local `/lumotive/img/platform-ls20.webp` (1920×1280) from the page-06 pass, sourced from that same URL. |
| LM10 comparison `5d2b71ae`, left/Gen 1 | Simon's sticky note at y≈1151 points to the LM10 placeholder: [LM10-thumb2.jpg](https://lumotive.com/wp-content/uploads/2023/08/LM10-thumb2.jpg). Visual inspection confirmed the LM10 flex-module photo. | Existing local `/lumotive/img/platform-lm10.webp` (537×402) from page 06. |
| LS20 comparison `5d2b71ae`, right/Gen 2 | The PDF's right-hand comparison column **prints an isolated LS20 chip on black**, distinct from the hand-held hero. The repository already contains that visually matching chip image. No comment incorrectly repurposes the hand-held hero image for this column. | Existing `/lumotive/img/lcm-platform-chip.jpg` (1127×1008), visually matched to the printed LS20 column. |

The reversible migration adds these three `media` URL values only if the respective slots were empty, and removes only those exact values on rollback. It also guards the exact old/new sentence. The existing `HeroSplit` and `CardsSpecComparison` components already support media and the approved split/mobile-stacked layouts; no new Svelte component or duplicate asset was needed. Browser inspection showed the hero photo and both column photos loaded in the intended columns. Their source framing differs (LM10 on white, LS20 on black) because those are the approved/printed photos; no unapproved visual was substituted to make them match.

## Source dependency versus integration work

**Client source still needed:** the actual looping system-animation file/GIF from the “Robotics deck” (the v3 annotation at y≈2274 is a lead, not a URL or delivered file), with its intended ROI/angle/time sequence. Repository and local Downloads inspection found no matching deck GIF, clip, or scan-sequence source. The page 07 diagram shows laser → LCM → transmit optics → scene in ROIs and receive lens → ToF sensor; LCM belongs on the transmit path only. No slide screenshot or unrelated video is approved to fill this slot.

**Implementation after that delivery:** convert a deck GIF to a looping MP4/WebM with a poster, rebuild the angle-versus-time scan timeline as authored SVG (not a slide image), label dwell time, beam width, frame rate and scan sequence, synchronize its bars to the actual animation sequence, and add the two-panel responsive layout with each of the already-stored captions adjacent to its intended panel. The `9f08c3d6` section currently shows the approved numbered steps, capability cards and two separate captions without empty media frames. Coding a disconnected or speculative SVG now would misrepresent synchronization; **the SVG is implementation work, not a separate required client-supplied SVG file**. Once the animation/timing source arrives, the interactive integration and motion/reduced-motion checks remain to be done.

## Existing page architecture and route

`1787709000_lcm_chips_page.js` replaced the old LM10 record in place. `1787709100_lm10_to_lcm_chips_redirect.js` maps `/lm10` to `/lcm-chips`. The comparison component renders an 11-row semantic table with `scope` headers at desktop widths and two 11-row stacked cards on mobile. Its separate Decoupling table has three rows. Earlier layout/contrast fixes (`1787709200`, `1787709300`, `1787709400`) remain in place. Hero CTAs request `lcm-chips` or `chips-flyer` through `/contact`, not a download. Start Building links target the three approved dev-kit routes. No availability or temperature rows were added.

## v3 verification

Desktop 1440 and mobile 390 browser passes: the H1 and approved hero image rendered; LM10 and LS20 photos appeared above the correct comparison columns/cards; the desktop comparison had 11 rows, and each mobile card had 11 rows; no horizontal overflow or broken visible images. The “Raise…” sentence was read from the DOM and its position measured after the Decoupling table and before the next section. Both hero CTA endpoints, `/platform`, and all three dev-kit destinations returned 200. `HEAD /lm10` returned **308** with `Location: /lcm-chips`. This is a Chromium check, not a Safari/Edge/iOS claim.

Migration applied to the local PocketBase database; only the `lcm-chips` page record differed from the pre-migration snapshot (`.local/lcm-v3-pre-migration.db`). Rollback restored every page record exactly to that snapshot; reapply again changed only `lcm-chips`, so Home and Platform v3 content is preserved. `npm run check`: 592 files, 0 errors, 0 warnings. `npm run build`: passed with the dev watcher stopped. No source asset remains missing for the hero or either comparison column; the animation/timeline integration is the page-07 outstanding work.

## Client-requested layout change: full-width hero (2026-10-21)

**Requested by the client on 2026-10-21; not part of the v3 package**, which
shows the chip photo beside the copy. Migration
`1787715100_lcm_chips_band_hero.js` (reversible, guarded) turns hero
`b7c41d08` from `heroSplit` into the shared `heroBand`. No component change.

- **Unchanged:** the chip-in-hand photo (`platform-ls20.webp`), eyebrow,
  heading, body, "Talk to our team" → `/contact?inquiry=lcm-chips` and
  "Request the LM10 and LS20 flyer" → `/contact?inquiry=chips-flyer`.
- **Overlay and phone spacing:** the existing band overlay; phones get the
  compact, content-driven hero shared by every band (no fixed height:
  501 / 501 / 462px at 360 / 390 / 430).
- **Framing:** from 1024px `mediaScale` 1.6 + `mediaShift` 25% put the chip
  at about 72% of the band, right of the copy (the shift stays inside the
  scaled photo's overhang, so no backdrop strip shows); tablets keep the
  photo's left edge (`mediaAnchor` 0%), chip above and right of the heading;
  phones `mobileMediaPosition` 15% with the existing phone-only strong shade,
  chip in the right third beside the headline.
- **Checks, 360 / 390 / 430 / 768 / 1024 / 1440 / 1920:** no overflow, no
  text outside the band, both actions ≥ 44px. Screenshot contrast measure
  (text hidden; 99th percentile / brightest backdrop pixel): body
  6.09/4.02 (360), 6.11/4.53 (390), 7.35/6.22 (430), ≥ 8.92/7.86 from 768;
  headline ≥ 9.94, eyebrow ≥ 10.59. Not an accessibility sign-off (S26); the
  360px body low (4.02, where the finger edge meets the line ends) joins the
  S26 list.
- **Revert:** `migrate down` restores the split hero byte-identically.


