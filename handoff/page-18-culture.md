# Page 18 — /culture

Approved content package rev. 2026-10-07 (v2), page 18 of 21, "Company ›
Culture & Careers". URL confirmed from the page header and the page-01 site map:
**/culture**, unchanged.

**Status: implemented and QA-verified.** Awaiting screenshot review before
page 19.

## What shipped

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
