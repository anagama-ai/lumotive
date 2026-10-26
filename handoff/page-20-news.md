# Page 20 — /news

Approved content package rev. 2026-10-07, page 20 of 21, "Company › News &
Events". URL **/news**, unchanged. First built against v2; **v3 pass applied
2026-10-21**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented; focused checks run.** Open: card images, the follow
block inputs, Events posts and the four News posts (N1–N5), four dead source
links (N7), and the PocketBase rate limit (S27).

## v3 pass (2026-10-21)

**Copy and assets.** The v2→v3 text diff of page 20 is empty and Simon left
**no annotations** on it, so no content or asset is supplied for this page.
Nothing was added: no Leopard, LI140/ON140 or VISION 2026 post (N1), no card
image, no follow block. The page's printed placeholders (`[Date]`,
`[Post title]`, `[press contact]`) are not published.

**One layout fix.** The newsroom hero and the post column used the wider
shell with their own gutters, so at 1440 they sat at 28px while the header
logo (and every other page) aligns at 80px; at 768/1024 they were 4px off.
Both now use the header's `container`: logo, heading, featured story, tabs
and grid share one edge at every width (16 / 24 / 24 / 80 / 210 at 390 /
768 / 1024 / 1440 / 1920). At 1440 the column narrows from 1384 to 1280px,
as on the CMS pages. No other change.

### v3 QA (focused)

- **Layout, 360 / 390 / 430 / 768 / 1024 / 1440 / 1920:** no overflow, no
  broken image, no tap target under 44px; grid 1 → 2 → 3 columns.
- **Filtering:** All 112 posts (13 pages), Press releases 53 (6), In the news
  59 (7), Events 0, which lands on the "No Matching News" empty state. Active
  tab carries `aria-current`. Search `q=Hokuyo` returns 6. `page=2`, `page=13`
  and `category=Media Coverage&page=7` render; an out-of-range `page=99`
  shows the empty state rather than an error.
- **Post links:** all 112 `/posts/…` answer 200 when requested at a normal
  pace. A rapid crawl returned 500s: the server log showed PocketBase
  answering **429 Too Many Requests** to the site's own server-side calls
  (see S27). Not a page defect, but a deployment risk.
- **Source links** ("Read the original article at …", 112 posts): 91 answer
  200; 18 refuse automated checks (403/401/timeouts from Forbes, WSJ,
  bizjournals, photonics.com, EE Times and similar), so they are unverified
  rather than broken; **4 are dead** (N7):
  - `media-company-case-study-lumotive` → investvancouver.ca PDF (host does
    not resolve)
  - `media-lumotive-powers-e-photonics-launch-…-spain` → morningstar.com (404)
  - `media-lumotive-unveils-md41-development-kit-…` → finance.yahoo.com (404)
  - `media-newest-breakthrough-in-agv-amr-3d-sensing-…-chinese` →
    2cm.com.tw (404)
  Not changed: replacing or removing a source link is a content decision.
- `npm run check` 0 errors, 0 warnings. Screenshots:
  `%TEMP%\lumotive-review\news\news-{390,768,1440}.png`.

## What shipped in the v2 build (history)

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

## Final checklist — Page 20 assets and inputs

**Page 20 is not modified by this audit.** Nothing below has been applied: the
layout, the content, the filters, the featured story, the cards, the pagination
and the search are all exactly as committed in `cb6fcd3` and `91cacf9`.

### 1. The 72 posts with no card image, audited

Every one of the 72 was checked against the 40 announcement visuals already in
the repository, matching on the announcement each post covers. Three groups
came out of it.

**(a) 35 posts can reuse a verified Lumotive announcement visual.** These are
media pieces covering an announcement whose own press release already carries
its visual in `static/lumotive/news/`, so the image is Lumotive's own and
already published on this site. The reuse pattern is one announcement visual
serving its press release and the coverage of that same announcement, which is
what the dev note means by "press releases use the announcement visual".

| Announcement visual | Posts it would serve |
| --- | --- |
| $45M Series B | 7 |
| Amazon and ITHCA investment | 5 |
| 2D photonic beamforming semiconductor | 3 |
| CES 2024 | 4 |
| Hokuyo (commercial release and partnership) | 3 |
| EDOM distribution | 2 |
| Open Development Platform | 2 |
| Oman and Taiwan expansion | 2 |
| Namuga (Stella-2 and alliance) | 2 |
| 180° dToF at 30 FPS, Electronic Photonics, MD41, SkyWater, Fast Company | 1 each |

**This still needs Lumotive's sign-off**, for two reasons: reusing an
announcement visual on third-party coverage is an editorial choice, not a
mechanical one, and a few of the pairings are the same *story* rather than the
same *release* (for example the CES 2024 group). The mapping is recorded here
so it is one data edit per post once approved. **Nothing has been applied.**

**(b) 24 media pieces have no Lumotive visual of their own.** These are
opinion, interview, award-nomination and market-analysis pieces with no
matching announcement — for example "The Programmable Optics Revolution",
"Sam Heidari: Focus on the Journey", "The 2024 GSA Award Nominees Revealed",
"Startups Bring Optical Metamaterials to AI Data Centers". The dev note's
fallback is "the article image or a related product shot". **Needed from
Lumotive:** either the publisher's article image where rights allow, or a
nominated product photograph per piece. No product shot has been assigned,
because choosing which product represents an unrelated opinion piece is not a
mechanical decision and inventing the association is exactly what the package
forbids.

**(c) 13 press releases from 2019 to 2021 have no visual at all.** The oldest
announcements predate the current visual set: Meta-Lidar platform, the
Mini-Lidar and Early Access programmes, the JMP Efficient Fifty and Built In
listings, the Yole webinar, Himax and TowerJazz. **Needed from Lumotive:** the
original announcement visual for each, or a decision to let these cards run
without one.

### 2. Rules this audit held to

- **No invented imagery and no placeholders.** Nothing was generated, and no
  stock or stand-in image was assigned.
- **No unrelated product photograph was attached** to make a card look
  complete. A card with no image renders as type, date, title and summary, and
  picks up the image the moment one is attached to the post.
- **No post content changed.** Titles, excerpts, categories, publication dates,
  slugs and source links are untouched.

### 3. Inputs still owed by Lumotive

| # | Input | Blocks |
| --- | --- | --- |
| 1 | **Official LinkedIn URL** | The "Stay Up to Date" block stays unpublished until it is confirmed. The same URL also unblocks the footer icon and the follow line on /about and /culture. |
| 2 | **Press contact email**, or confirmation to drop the line | "Media inquiries: [press contact]" is a bracketed placeholder, which page 01 says never to publish. Either value finishes the block. |
| 3 | **Other social channels to show**, or confirmation that LinkedIn is the only one | Named in the package's own pending box for this page. |
| 4 | **Sign-off on the 35 announcement-visual reuses** in (a) | Applying the recorded mapping. |
| 5 | **Article images or nominated product shots** for the 24 pieces in (b) | Those cards shipping with an image. |
| 6 | **Original visuals for the 13 early press releases** in (c), or a decision to leave them without | Those cards shipping with an image. |
| 7 | **First Events post** | The Events tab is live and empty until one is filed. |

Items 1 to 3 are the whole of the held "Stay Up to Date" block. Items 4 to 6
are the whole of the card-image gap: **35 solvable from assets already here,
37 needing new material.**
