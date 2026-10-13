# Page 20 — /news

Approved content package rev. 2026-10-07 (v2), page 20 of 21, "Company › News &
Events". URL confirmed from the page header and the page-01 site map:
**/news**, unchanged.

**Status: implemented and QA-verified.** Awaiting screenshot review before
page 21.

## What shipped

`/news` is a route, not a CMS sections page, so **no migration was needed** —
no PocketBase data changed. The 112 published posts, their categories,
publication dates, excerpts, slugs and images are untouched, and every existing
`/news?category=…` link still resolves because the tabs keep the stored
category values and only change their labels.

| Marker | Block | What changed |
| --- | --- | --- |
| CHANGE · SHORT HERO | Hero | Heading becomes "News and Events"; the lead paragraph is dropped, which is what makes it short |
| NEW · FEATURED STORY, LATEST ON TOP | Featured story | New: large image, type, date, title, summary, "Read more" |
| CHANGE · FILTER TABS | Tabs | The four approved tabs in the package's order |
| CHANGE · POST GRID, NEWEST FIRST | Grid | Cards gain the post image and the "Type · date" line |
| NEW · FOLLOW BLOCK | — | **Held**, see below |

### Featured story

The newest post marked `featured` in the CMS, falling back to the newest post
overall when none is marked. It leads the **unfiltered first page only** — on a
filtered page, a search or page two it would be a second copy of a post the
reader is already scrolling past — and it is excluded from the grid beneath it
so the same story never appears twice.

### Filter tabs

All · Press releases · In the news · Events, in the package's order. The link
value stays the category as the collection stores it, so the labels change
without breaking a single existing URL:

| Tab | Category | Posts |
| --- | --- | --- |
| All | — | 112 |
| Press releases | `Press Releases` | 53 |
| In the news | `Media Coverage` | 59 |
| **Events** | `Events` | **0** |

**Events has no posts yet.** The tab is rendered because the package prints it,
and it lands on the page's existing empty state rather than a blank screen. It
starts working the moment a post is filed under that category; nothing was
invented to fill it.

Card and featured type labels are singular, as the package prints them
("PRESS RELEASE"), and "Media Coverage" reads "In the news" to match its tab.

### Kept, not in the approved mock

The **search form** and the **pagination** are not drawn on page 20, and the
package issues no REMOVE for either. Both are working functionality over 112
posts — thirteen pages of them — so both stay.

## Held — pending input

**The follow block is not published.** The package's NEW · FOLLOW BLOCK is
"Stay Up to Date" over three items, and its own orange box says "Other social
channels to show; press contact email (or remove that line)" is pending from
Lumotive. Of the three:

- the LinkedIn line needs the LinkedIn URL, still the unresolved input recorded
  in `1787708000_footer_sitemap.js`, which also holds back the footer icon and
  the same line on /about and /culture;
- "Media inquiries: **[press contact]**" is a bracketed placeholder, which page
  01 says never to publish;
- other social channels are pending by name.

That leaves a heading and one sentence with nothing to act on, so the block
waits rather than shipping dead. **One LinkedIn URL plus one press address
publishes it**, and the same URL unblocks three other pages.

## Missing assets

**72 of 112 posts have no card image**, against a dev note that says every card
needs one.

| Type | Posts | With image |
| --- | --- | --- |
| Press Releases | 53 | 40 |
| Media Coverage | 59 | **0** |

The dev note's sources are "press releases use the announcement visual; media
coverage uses the article image or a related product shot". **Nothing was
invented and no placeholder was used**: a card with no image renders as its
type, date, title and summary, and gains the image the moment one is attached
to the post. The gap is most visible on the "In the news" tab, where no card
has an image at all.

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, no tap target under 44px. The grid steps 1 → 2 → 3 and
  the featured story 1 → 2 columns.
- **Links:** all four tabs 200, the featured story 200, the card links 200, and
  pagination reports thirteen pages across 112 posts.
- **Accessibility:** heading order h1 → h2 → h3 with no level skipped, the
  active tab carries `aria-current="page"`, card and featured images are
  decorative with `alt=""` because the whole card is the link and the title is
  the accessible name, and the result count stays an `aria-live` region.
- `svelte-check` 592 files, 0 errors; production build clean.
- **Regression:** pages 05 to 19 all answer 200 and report zero contrast
  failures.

## Blockers

1. **72 post images** — see above.
2. **LinkedIn URL and press contact address** — the follow block waits on both.
3. **Events posts** — the tab is live and empty until the first one is filed.
