# Final QA handoff: Lumotive site, pages 05–21

2026-10-22. For **Josh** (repository, staging, deployment) and **Claudia** (content and client sign-off).

This page is the short version. The full working list is `v3-outstanding-items.md` (IDs such as S21 or N7 refer to it). The staging procedure and PR evidence are in `v4-final-review.md`.

## State

- **Branch:** `feedback-20261007-v2`, local only. **Nothing has been pushed, merged or deployed.** Staging still runs `origin/main` (`f203fc1`).
- **Latest commits:** the v4 review (`0bc7fe9`) plus the follow-up commits on top of it (`git log 0bc7fe9..`).
- **Not committed:** `vite.config.ts`, a Windows-only dev-server fix (S25), kept out of every commit on purpose.
- **Local checks:** `npm run check` 0 errors and 0 warnings; `npm run build` exits 0.
- **PR #1** (Home, `staging-home-page05` at `0b2ff9f`) is unchanged and not merged.

## Verified on the local site

| Area | Result | ID |
|---|---|---|
| Content | Every v4 input built and checked against the PDF | group 1 |
| Video embeds | Every Vimeo and YouTube embed plays in the page and pauses, in a visible Edge window | S19 |
| Text over images and video | Hero text on 15 pages at 390/768/1024/1440 and Home video text over 24 frames at 390/768/1440: 496 measurements, none under 4.5:1 (body) or 3:1 (headings). Lowest 4.66:1 (Dev Kits body, 768). **Approved 2026-10-22** | S26 |
| Platform card swap | The stretch where both cards faded out is gone (was 96px, now 0px) | P6 |
| Navigation | Phone menu closes on Escape and returns focus; desktop menus unchanged | S16 |
| Server load | Site-wide settings cached for 60 s for signed-out visitors (one request a minute instead of four per page); editors always see live data; settings saves show immediately | S27 |
| Migrations | All 102 new migrations apply to a copy of an `origin/main` database and roll back to the exact starting state | S23 |
| Admin Site settings | Footer and Header forms now load and save what the site shows (copyright, link columns, legal and social links; menu, dropdowns with descriptions, third-level links, buttons). Saving unchanged kept the content and the public HTML identical; edits appeared for signed-out visitors on the next page load. When the LinkedIn URL arrives (S1), an editor can add it under Footer → Social links | S29 |
| Press links | 21 checked: 12 work, 1 paywalled, 5 block automated checks, **3 dead** | N7 |

These checks ran in Chromium and Edge on Windows only. The contrast figures are screenshot measurements, not an accessibility audit.

## Josh: needed before staging

1. **PR #1 and the rollback fix (S21).** A rollback of `1787707500` would have put two 404 links on the Home cards. It is fixed on this branch (`24e660b`, one file, `down` only). PR #1 still has the old file. **Choose:** add the same fix to `staging-home-page05` before merging (recommended), or approve merging PR #1 as is and shipping the fix with the next PR before any rollback.
2. **Approve and merge PR #1**, then choose the PR shape for pages 06–21 (S22; options in `v4-final-review.md`).
3. **Staging database backup plus a CMS edit freeze (S23).** We then run `node scripts/staging-migration-dry-run.mjs --backup <backup>`, which applies, compares and rolls back on a copy. Only a run on real staging data shows staging edits that would make migrations skip.
4. **Deployment settings (S24):** confirm `DOKPLOY_URL`, `DOKPLOY_API_KEY`, `DOKPLOY_PB_APP_ID`, `DOKPLOY_WEB_APP_ID` and `ORIGIN`. The deploy job skips silently if the app IDs are empty.
5. **Network layout (S27):** whether PocketBase is reachable only through the web container. That decides the rest of the rate-limit fix (exempt the web container, or forward visitor IPs).
6. **Pipedrive (S3):** admin access, or a hand-off to Lumotive's admin, for the three hidden form fields; then one agreed test submission on staging (S28).
7. **More than one web container?** The settings cache is per container; a save clears only the container that handled it, the others within 60 s. Tell us if staging or production runs more than one.

## Before production launch (ours)

- **Site meta settings (S30):** business address, phone, social accounts and the light logo are saved but shown nowhere on the public site. Waiting for Claudia's decision (see her list); not needed for the walkthrough. The footer's LinkedIn icon is set under Footer → Social links.
- **New-tab links:** existing link settings are kept, but the Footer and Header forms cannot switch a link to open in a new tab. None do today.
- **Safari, iOS Safari and Android Chrome (S20):** never tested. This covers the videos, the self-hosted looping animations (iOS autoplay and Low Power Mode), the LCM Explorer (including the no-WebGL-2 path), the menus, the sideways-scrolling figures, and a look at text over images on real screens.
- **Press links (N7):** a person opens the 5 blocked links (Forbes ×2, bizjournals ×3).
- **`vite.config.ts` (S25):** commit it on its own or drop it.

## Claudia: client decisions and supplies

Nothing below blocks a staging deploy: missing items ship left out, not as placeholders. They do block sign-off of the affected sections. Full list: `v3-outstanding-items.md`, group 2.

- **New from this QA, News (N7):** three "Read the original article" links are dead (Morningstar e-Photonics release, Yahoo Finance MD41 story, 2cm.com.tw AGV/AMR story). Replacement URLs, or approval to remove those links. The Invest Vancouver PDF works again.
- **Privacy Policy (S2), client dependency:** the footer link leads to a 404 (see the audit below). Needed: approved policy text, or written approval to port lumotive.com's current policy ("Last modified: March 26, 2026") as it stands. We will not write legal copy.
- **Site meta settings (S30), decision:** wire address, phone, social accounts and the light logo into the site, or remove them from the admin form.
- **Blocking supplies:** LinkedIn company URL (S1), NM120 power figure, MIPI wording and internals photo (F2–F4), Leopard Imaging and onsemi logos (SE5, PA3), the final investor list (AB3), News post copy and press contact (N1, N2, N3).
- **Decisions:** status labels (S8), provider strip with 3 of 4 logos (SE6), the v4 readings (LCM Chips GIF labels, Automotive diagram, iToF scan modes; L2, AU2/AU3, I6), Explorer intro copy (S6 c), Google citation (C6), and the smaller confirmations listed in group 2.
- **Reviews:** heading letter spacing (S18, Webvizio #138), hero framing (AB6, PA1, CU1). Do not close any Webvizio task until it is verified on staging.

## Privacy Policy audit (2026-10-22)

Checked on the local site (dev server and local database).

| Check | Result |
|---|---|
| Footer link | "Privacy Policy" under the copyright line on every page checked (`/`, `/contact`, `/dev-kits/dtof`), `href="/privacy-policy"`, same tab. Visible at 1440 (88×20px) and 390 (88×44px, meets the 44px tap target) |
| Destination | **404.** No `pages` record, no SvelteKit route and no redirect for `/privacy-policy` (or `/privacy`); `/privacy-policy/` redirects to it. Staging (`staging-lumotive.filebx.net/privacy-policy`) also 404s |
| Rendering | The site's 404 page: "404 / The page you were looking for could not be found. / Back home". No horizontal overflow at 1440 or 390. It shows without the site header and footer, so the only way on is "Back home" |
| Content | None on the site. lumotive.com/privacy-policy/ is live ("Last modified: March 26, 2026") but has not been approved for this site, so nothing was copied |
| Owner | Lumotive via Claudia (S2). Once text is approved, adding it is a page record plus one migration |

**For the walkthrough:** clicking Privacy Policy shows the 404. Either skip that link or say it is waiting on S2.

Also seen: in the dev server, `/lcm-explorer/` (without `index.html`) 404s. This is expected: every site link uses `/lcm-explorer/index.html`, which loads (200), and the production server resolves the folder.

## Evidence

Screenshots and measurements are in `%TEMP%\lumotive-review\qa-final\` (playback, links, P6, menus, hero and video contrast with `contrast-results.json`). The migration rehearsal report is in `%TEMP%\lumotive-staging-rehearsal\run-B\dry-run\`. These are temporary folders on this machine; copy them somewhere permanent if they are needed for sign-off.
