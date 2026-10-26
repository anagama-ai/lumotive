# Page 18 — /culture

Approved content package rev. 2026-10-07, page 18 of 21, "Company ›
Culture & Careers". URL **/culture**, unchanged. First built against v2;
**v3 pass applied 2026-10-21**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Open: the LinkedIn follow line
(CU2 / S1), the Lever selection (CU3), and one confirmation on the hero
source (below).

## v3 pass (2026-10-21)

**Copy.** The v2→v3 text diff of page 18 is empty; all six headings, the
hero line and action, the four-sites sentence, the testimonials and the
closing CTA match v3 in the printed order. No copy changed.

**Simon's annotations:**

| # | Position | Simon's file | Outcome |
| --- | --- | --- | --- |
| A1 | Hero, "KEEP AS IS · Existing: hero-culture.jpg" | [IMG_4516-1-copy-scaled.jpg](https://lumotive.com/wp-content/uploads/2025/04/IMG_4516-1-copy-scaled.jpg) (2560×1707, team around an LCM camera on a tripod) | **Hero**, as `hero-culture-team.webp` (2400×1600, 176 KB). Replaces the local `hero-culture.jpg` (a dark office stand-in, not a Lumotive photo), which is kept for the down path. |
| A2 | "The Lumotive Way video" | YouTube AcLAbtIxN64 | Already embedded beside block 2; unchanged. **Plays in-page**: clicking the player started it, `currentTime` 5.6 → 8.6 s, no error. |

**One thing for Claudia to confirm (CU1).** Unlike About, Simon's photo is
not lumotive.com/culture's current hero: that page's hero is
`IMG_4575-1-scaled.jpg` (team group holding a Lumotive box), and IMG_4516 is
its closing "Browse Open Positions" band. Simon placed IMG_4516 on the hero
slot, so it ships there; swapping to IMG_4575 is a one-value change.

**Migration** `1787714800_culture_v3.js`: hero media plus three existing
framing options, no component change. With the standard framing the bright
photo put the body line at 3.21:1 (390) and 3.96:1 (768). `mediaAnchor: 0%`
moves the light-blue shirt out from under it on tablets,
`mobileMediaPosition: 100%` and `mobileShade: strong` handle phones. From
1024px the band is wider than the 3:2 photo, so desktop is not reframed.

### v3 QA

- **Hero contrast** (text hidden, 99th percentile / brightest pixel, per line
  box), body: 9.60/9.32 (360), 9.01/8.69 (390), 8.52/7.97 (430), 8.55/6.82
  (600), 7.33/6.74 (767), 5.52/4.55 (768), 5.87/5.12 (834), 6.30/4.55 (912),
  6.70/4.77 (1000), 7.84/6.36 (1024), 8.46/8.06 (1440), 8.82/8.50 (1920).
  Headline ≥ 8.40, eyebrow ≥ 8.76. 768–1000 is the tightest band.
- **Page at 390 / 768 / 1024 / 1440:** no overflow; 9 images, none broken;
  no heading under 0.9 opacity; no tap target under 44px; six live Lever
  roles. `/culture`, `/api/open-roles`, both hero files and the Lever board
  answer 200.
- **Migration:** revert restored the record byte-identically; re-apply
  changed only `culture` section `6c524b47`. `npm run check` 0 errors,
  0 warnings. No source change, so no build.
- **Screenshots:** `%TEMP%\lumotive-review\culture\hero-390…1920.png`.

## What shipped in the v2 build (history)

One reversible migration, `1787711900_culture_page18.js`. Route and record
unchanged.

| # | id | Type | Marker | What changed |
| --- | --- | --- | --- | --- |
| 1 | `6c524b47` | `heroBand` | KEEP AS IS | Subline trimmed to the printed sentence; single printed action |
| 2 | `979b8fc6` | `splitDefault` | CHANGE · HEADING PLUS VIDEO MOVED UP | New heading and the four-sites sentence; The Lumotive Way video moves in beside it |
| — | `c1d7e2a4` | `mediaVideoEmbed` | — | The standalone video block the move empties |
| 3 | `58fa454f` | `cardsIconCards` | KEEP AS IS | "How We Work"; alignment only |
| 4 | `b4a91c73` | `testimonialsPeelScene` | KEEP AS IS · RESTORE FROM STAGING | Staging quotes carousel, now carrying the approved "In Their Words" heading |
| 5 | `c0a74e31` | `openRoles` | NEW · LIVE FROM LEVER | See below |
| — | `f70b28d5` | `cardsAwardCards` | REMOVE · AWARDS | Deleted; awards live on About |
| 6 | `8c3ed872` | `ctaSplitLinks` | NEW · CLOSING CTA | "Help Us Make Light Programmable" with the single printed action |

**Hero.** Two corrections against the printed page despite the KEEP AS IS
marker, both from the page-01 copy rule: the subline is the package's sentence,
where staging ran on with a clause the package does not print, and the hero
carries the one printed action. Staging's "Explore our values" second action is
not on the approved page.

## Open Roles is live, not a placeholder

The package prints `[Role title]` and `[Team] · [Location]`, which page 01 says
never to publish, and its dev note asks for "the latest four to six roles from
the Lever careers board. **If no feed is possible, keep only the button.**"

**A feed is possible.** Lever publishes Lumotive's board as an unauthenticated
JSON feed; verified returning ten live postings. So:

- **`/api/open-roles`** (new server route) fetches it server-side — same
  origin, no key, one shared 15-minute cache — and returns the **six most
  recent** roles as title, "Team · Location" and the posting URL.
- **`openRoles`** (new section) server-renders the "See all open roles" button
  and fetches the roles on top of it. A feed outage, a blocked network or a
  visitor without JavaScript all land on exactly the fallback the dev note
  describes: the button alone.
- **Every role links to its own Lever posting**, so existing job links keep
  working. The whole card is the link, the decorative "View role" arrow is
  `aria-hidden`, and the accessible name is the role title plus its team and
  location.

Grid steps 1 → 2 → 3 across the breakpoints; cards are 196px tall, well over
the 44px target floor.

## Other component changes

- `testimonialsPeelScene` gains a heading and `data-align`; it had been
  rendering a carousel with no heading at all.
- `cardsIconCards` eyebrow moves to Deep Laser Blue — Laser Blue measured
  4.15:1 at 12px, under the floor, which was the page's only contrast failure.

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, no tap target under 44px, every inner column on one edge
  (16 / 24 / 24 / 80).
- **Copy:** six headings in the package's order — "Seeking Ambitious Problem
  Solvers", "Build the Technology That Shapes Light, and the Future", "How We
  Work", "In Their Words", "Open Roles", "Help Us Make Light Programmable". The
  awards section is gone.
- **Links:** `/api/open-roles` answers 200 with six roles; every role and both
  board buttons carry `rel="noopener noreferrer"`.
- **Heading order:** h1 → h2 → h3 throughout, no level skipped.
- **Migration:** applies, reverts to the previous seven sections, re-applies.
- `svelte-check` 592 files, 0 errors; production build clean.
- **Regression:** pages 05 to 17 all answer 200 and report zero contrast
  failures. `/partners` keeps its two pre-existing failures, which are page 19.

## Blockers

1. **LinkedIn follow line.** The package prints "Follow Lumotive on LinkedIn
   for news, research, and openings." under the closing CTA. The LinkedIn URL
   is still the unresolved input recorded in `1787708000_footer_sitemap.js`,
   which also holds back the footer icon and the same line on /about. **One URL
   unblocks all three.**
2. **Lever feed shape is Lumotive's to confirm.** The six roles shown are the
   six most recently created postings. If Lumotive wants a different selection
   — a department filter, or featured roles — it is a change to the endpoint's
   sort and filter, not to the section.
