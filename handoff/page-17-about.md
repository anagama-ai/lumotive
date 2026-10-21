# Page 17 — /about

Approved content package rev. 2026-10-07, page 17 of 21, "Company ›
About". First built against v2; **v3 pass applied 2026-10-21**. Branch
`feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Open: award badges (AB2), the
final investor list and Hokuyo (AB3), the LinkedIn follow line (AB4 / S1)
and the Sajid Husain bio wording (AB5).

## v3 pass (2026-10-21)

**Copy.** The v2→v3 text diff of page 17 is empty; every live heading,
award, name, title, action and line matches v3 in the printed order. No
copy changed.

**Simon's one annotation:**

| # | Position | Simon's file | Outcome |
| --- | --- | --- | --- |
| A1 | Hero, "KEEP AS IS · Existing: hero-about.jpg" | [IV2.26.18-196-scaled.jpg](https://lumotive.com/wp-content/uploads/2023/04/IV2.26.18-196-scaled.jpg) (2560×1707, engineer at an optical bench) | **Hero**, as `hero-about-bench.webp` (2400×1600, 89 KB). Replaces `hero-about.jpg`, which is kept for the down path. |

Why the swap is consistent with KEEP AS IS: lumotive.com/about serves this
exact file as its hero background today (Elementor `post-806.css`,
element `0cffcc6`). The "existing" hero the package means is Simon's
photograph; the local `hero-about.jpg` is a different dark-lab image. This
closes AB1.

**Migration** `1787714700_about_v3.js`: hero media, plus the existing
phone-only `mobileShade: "strong"`. The new photo is brighter than the old
one; at 390px the body line measured 4.24:1 (brightest pixel) over the
shirt with the standard shade. No component change.

### v3 QA

- **Hero contrast** (text hidden, 99th percentile / brightest pixel, per line
  box): body 6.94/6.38 (390), 7.90/7.53 (430), 7.32/7.05 (768), 8.79/7.95
  (1024), 9.08/8.89 (1440), 9.07/8.91 (1920); headline ≥ 9.63; eyebrow ≥ 8.91;
  "Meet the team" ≥ 12.62. Before the phone shade: body 4.64/4.24 at 390.
- **Framing:** the band (about 1.9:1 at 1440, 2.5:1 at 1920) crops the 3:2
  photo top and bottom, so desktop shows the hand, optics and shirt; the
  face is cropped at the chin, as in the original. No overflow at 390–1920.
- **Page:** 24 images, none broken, all load on scroll; no heading under 0.9
  opacity with or without reduced motion; no tap target under 44px;
  `/platform`, `/culture` and both hero images answer 200.
- **Migration:** revert restored every page record byte-identically;
  re-apply changed only `about` section `3998f57f` (`media`, `mobileShade`).
  `npm run check` 592 files, 0 errors, 0 warnings. No source change, so no
  build was run.
- **Screenshots:** `%TEMP%\lumotive-review\about\hero-390…1920.png`.

### Outstanding (after v3)

1. **AB2** — official award badges (names and links are live).
2. **AB3** — final investor list; whether Hokuyo belongs (see below).
3. **AB4** — LinkedIn follow line, held for the URL (S1).
4. **AB5** — "beamforming" inside Sajid Husain's bio: OK?

## What shipped in the v2 build (history)

One reversible migration, `1787711700_about_page17.js`. Route and record
unchanged; the page keeps its id.

| # | id | Type | Marker | What changed |
| --- | --- | --- | --- | --- |
| 1 | `3998f57f` | `heroBand` | KEEP AS IS | Copy, actions and `hero-about.jpg` already matched; container alignment only |
| 2 | `4e30aac9` | `splitDefault` | KEEP AS IS | Heading trimmed to the printed "Lumotive Is Pioneering the Era of Programmable Optics"; mission copy and image untouched |
| — | `48ae11f0` | `statsCentered` | REMOVE | Founded / Patents / Raised stats block deleted |
| 3 | `718e83f2` | `cardsAwardCards` | CHANGE · #132 | New heading; five approved awards, no years |
| 4 | `f9d1f9ab` | `cardsTeamCards` | FIX · #133 | Apurva Jain's title; Clement/Axel and Diane/Sajid swapped |
| 5 | `7d5fdafa` | `cardsTeamCards` | CHANGE · HEADING ONLY | Already renders "Board of Directors"; alignment only |
| 6 | `aadb4f18` | `logosGridOnDark` | NEW | Heading becomes "Investors", introduction dropped |
| 7 | `efd6f4b0` | `ctaDefault` | NEW | "Work With Us" replaces the generic closing CTA |

**Awards strip.** Five awards in the package's order — CES Innovation Awards ·
Fast Company: Next Big Things in Tech · Laser Focus World Innovators Award ·
SPIE Prism Award · GSA Startup to Watch. No years in copy, which collapses the
three separate CES entries staging listed into one. Each keeps its award
announcement link, already on the page, which is what the dev note asks for.

**Leadership order** is now Sam · Gleb · Apurva · **Clement** · Rakinder ·
**Diane** · **Axel** · **Sajid** · Larry, which is #133's two swaps applied
literally. Biographies and headshots untouched.

**Investors.** The board block's dev note removes "Backed by Strategic
Investors"; the new block carries it under the approved "Investors" heading
with the introduction dropped, per "Logos only. No funding amounts."

**Container alignment.** Every section opts in. This page predated that work:
all eight sections sat at the viewport edge while the header and footer aligned
at 80px, so /about was the one page where the two did not line up.

**Terminology.** Claudia's rename needs no wording change: "beam steering"
appears nowhere on this page.

### Component changes

- `cardsAwardCards`: gains `data-align`; prints no year line when a card has no
  year; widens to five across for a five-award strip; the eyebrow moves to Deep
  Laser Blue (Laser Blue measured 4.15:1 at 12px).
- `cardsTeamCards` and `logosLabelled` (which backs `logosGridOnDark`): gain
  `data-align`.
- `cardsTeamCards` contrast: role and section eyebrows and the "Learn more"
  action move to Deep Laser Blue, and the biography dialog's close control
  moves from Muted Slate to Slate Text. All four measured under 4.5:1.

## Judgement call — the investor list

The package prints six named logos and then "**[Full list from staging]**", and
package page 04 lists the final investor logo list as a pending input. The nine
logos already on this page **are** that staging list, so they stay and the
section ships under its approved heading: nothing is invented and nothing
already public is withdrawn.

Two things to confirm with Lumotive:

1. The **final list** itself. Swapping entries is a data-only edit to this one
   section.
2. The package's printed order is Gates Frontier · Amazon · Samsung Ventures ·
   Swisscom Ventures · **Hokuyo** · MetaVC Partners. Hokuyo is a customer and
   module builder, not an investor in the staging list, so the existing order
   is kept rather than guessing. 

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, no tap target under 44px, every inner column on one edge
  (16 / 24 / 24 / 80).
- **Copy:** headings render "Pioneering the Era of Programmable Optics",
  "Lumotive Is Pioneering the Era of Programmable Optics", "Recognized for
  Pioneering the Era of Programmable Optics", "Leadership Team", "Board of
  Directors", "Investors", "Work With Us". Apurva Jain's new title renders. The
  stats block is gone. No funding amounts in the investor block.
- **Links:** `/platform`, `/culture` and the `#leadership` anchor all resolve;
  the five award links and the Lever careers board are external and expected.
- **Migration:** applies, reverts to the previous eight sections, re-applies.
- `svelte-check` 589 files, 0 errors; production build clean.
- **Regression:** pages 05 to 16 all answer 200, and `/platform`, `/lcm-chips`,
  `/applications`, `/sense`, `/sense/robotics`, `/sense/automotive`,
  `/dev-kits`, all three kit pages and `/connect` report zero contrast
  failures. `/connect` still serves the full-width band hero at 1440px.

## Blockers

1. **Official award badges.** Package page 04 lists them as a new asset. The
   strip ships as the approved names and their announcement links; adding
   `media` per card later is data-only.
2. **LinkedIn follow line.** The package prints "Follow Lumotive on LinkedIn
   for news, research, and openings." under the closing CTA. The LinkedIn URL
   is still the unresolved input recorded in `1787708000_footer_sitemap.js`,
   which is why the footer icon is also held back. **One URL unblocks both**;
   the line is held rather than published without a destination.
3. **Final investor logo list** — see above.
4. **"See open roles"** points at the Lever careers board, the destination
   already used on `/culture`. When page 18 gives `/culture` its Open Roles
   section this becomes a one-field change.
