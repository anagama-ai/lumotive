# Lumotive website redesign — current progress

Handoff for a fresh OMP session. Written after page 12 and its refinement.

## Where the work is

| | |
| --- | --- |
| Repository | `C:\Users\patri\brands\lumotive-pb` |
| Branch | `feedback-20261007-v2` (**not pushed**) |
| Approved content | `C:\Users\patri\Downloads\Lumotive_Website__Final_Content_Feedback_from_Apurva_20261007_v2.pdf`, rev. 2026-10-07 (v2), 21 pages |
| Second worktree | `C:\Users\patri\brands\lumotive-home-wt` on `staging-home-page05` at `0b2ff9f` — leave it alone, it is PR #1's branch |
| Local servers | PocketBase on 8090 and Vite dev on 5173, both already running and **not** omp-managed |

### Git status

Working tree is clean **except one intentional file**:

```
 M vite.config.ts
```

See "Uncommitted Vite fix" below. Do not commit it onto a page branch.

### Latest commits (newest first)

```
3a205ea fix(dev-kits): let "Find Your Dev Kit" introduce all three kit families
7c9110a feat(dev-kits): apply the approved page 12 hub page
61d77e8 feat(automotive): add the approved page 11 Sense Automotive page
0f0d764 fix(nav): follow the approved site map in the Sense dropdown
beca66f feat(robotics): add the approved page 10 Sense Robotics page
e2c4539 docs(sense): record the page 9 finalisation audit and the providers blocker scope
85ec479 fix(sense): refine the HDR section
ff2dae6 feat(sense): apply the approved page 9 sections and copy
16e4d1d fix(applications): tighten the eight application cards
0233a62 feat(applications): apply the approved page 8 sections and copy
ce671d2 docs(handoff): record PR #2 scope and its dependency on PR #1
1c9ca49 docs(handoff): record page 05-08 implementation status
6fecc22 feat(lcm-chips): add the approved page 7 page and the /lm10 redirect
895a64d fix(platform): finish approved page 6 layout, CTAs and contrast
93d5e0d feat(footer): follow the approved site map and prepare the LinkedIn icon
```

All thirteen page commits are **local only**.

## Pages 5 to 12 — complete and verified

Every page: approved copy applied word for word, section order and markers
followed, existing components reused, one or more **reversible** migrations,
QA at 390 / 768 / 1024 / 1280 / 1440 / 1920, committed locally.

| Page | Route | Migrations | Handoff doc |
| --- | --- | --- | --- |
| 05 | `/` home | earlier range | `handoff/page-05-home-staging-deploy.md` |
| 06 | `/platform` | `1787707400`, `1787708200`–`1787708900` | `handoff/page-06-platform.md` |
| 07 | `/lcm-chips` (replaces `/lm10`, 308 redirect) | `1787709000`–`1787709400` | `handoff/page-07-lcm-chips.md` |
| 08 | `/applications` | `1787709500`, `1787709600` | `handoff/page-08-applications.md` |
| 09 | `/sense` | `1787709700`, `1787709800` | `handoff/page-09-sense.md` |
| 10 | `/sense/robotics` | `1787709900` | `handoff/page-10-robotics.md` |
| — | Sense nav rebuild | `1787710000` | — |
| 11 | `/sense/automotive` | `1787710100` | `handoff/page-11-automotive.md` |
| 12 | `/dev-kits` | `1787710200`, `1787710300` | `handoff/page-12-dev-kits.md` |

QA standard met on all of them: no horizontal overflow, no broken image, zero
contrast failures, no tap target under 44px, inner columns on one edge, every
migration round-trips, `svelte-check` 589 files 0 errors, production build
clean.

**A reported `/dev-kits` 404 was investigated and was not a defect.** Route,
page record, migrations and both servers were verified healthy, and the
production build serves the route. The cause was a stale HMR module in the
reporter's browser tab crashing hydration. Fix is a hard refresh. The three
`/dev-kits/*` links do legitimately 404 until pages 13 to 15 exist.

### Global rules enforced on every page

No availability, launch timing, roadmap or generation dates. No operating
temperature. No 1550 nm, FMCW or Tx-Rx. No klux. No downloads — request via the
contact form. "Physical AI" at most once per page and never in a headline.
"lidar" lowercase. Every page ends with its own specific CTA. No external links
on customer or provider logos.

## Next task — PDF page 13, Transmit Modules

Build `/dev-kits/transmit-modules`. It is already linked from the TX10 card on
`/dev-kits` and currently 404s.

1. Read page 13 of the PDF and transcribe the approved copy, section order and
   markers exactly. Beware column-interleaved text — page 10 needed manual
   reconstruction.
2. Reuse existing section types. `cardsMediaCards` now supports `columns`,
   `density`, `note` and `label`; `cardsTextCards` supports `columns 2|3|4|5`,
   `casing`, `note`, `outro`, `statement`, `conclusion` and `steps`.
3. One new reversible migration, next number **`1787710400`**. Follow the shape
   of `1787709900_sense_robotics_page10.js`: read `sections` via
   `record.getString('sections')` and `JSON.parse`, never `record.get`, which
   yields JSONRaw junk in the JSVM.
4. Set every section's `align: "container"`, matching pages 05 to 12.
5. Ship no asset you were not given. Omit rather than placeholder.
6. QA desktop and mobile, run `npm run check` and `npm run build`, commit
   locally only.

Then pages 14 `/dev-kits/itof` and 15 `/dev-kits/dtof`, which complete the
three destinations page 12 links to.

## Pending assets — nothing placeholdered

Each is omitted, documented in its page handoff, and data-only to add later.

- **Module and Solution Providers component — not built.** Blocked on the
  **Leopard Imaging** logo (absent from the repository) and the **Electronic
  Photonics** logo (open Lumotive input; the existing `ephotonics.png` carries
  the "e-Photonics" spelling the package removes). Blocks package pages **09,
  10, 12 and 19**. One delivery unblocks all four. Webvizio **#121** and
  **#122** resolve through it.
- **LCM Explorer bundle and poster** — needs integration and cross-browser
  testing, not a file swap. Budget real time.
- Mirrors and prisms graphic (Webvizio **#125**), 1D to 2D animation, LM10
  photo, chip-in-hand hero, LM10/LS20 column photos, "How LCM fits" two-panel
  media.
- 5 of the 8 Applications card images.
- Page 10: hero, AMR video, 4 kit photographs.
- Page 11: hero, cocoon graphic, 180 degree point cloud, dust and rain images.
- Page 12: kit family photograph for the hero (the page keeps its incumbent
  bench photograph meanwhile) and **all six kit photographs** — LI140, ON140
  and MD180 have no asset in the repository at all.
- **AMR animation confirmation:** verify `vimeo.com/1174547871/6e198e52ae`
  ("Lumotive - AGV AMR", 57s) is the approved animation. Its poster is a
  captioned marketing explainer, not the described ROI and point cloud piece.
- **Vimeo playback** for `1040582713` (page 06) needs a check on a normal
  network.

## Client decisions outstanding

- **Q19 — application status labels.** "In production", "In development",
  "Active programs", "Exploring" conflict with global rule 1. **Labels stay
  omitted** until Apurva settles it.
- **Page 08 to 09 moves.** Package page 08 marks three sections as moving "to
  Sense", but page 09's composition shows none of them. Not added; the copy is
  preserved in `1787709500`'s down path. Awaiting confirmation.
- **Page 10 copy to eyeball.** Virtual-sensor headings were reconstructed from
  column-interleaved PDF text as "Localization", "Cliff and obstacle" and
  "Object avoidance".
- Do **not** close any Webvizio task until the client verifies it.

## PR #1 and deployment dependencies

- **PR #1** — <https://github.com/scale-storm/lumotive-pb/pull/1>, branch
  `staging-home-page05` at `0b2ff9f`, homepage only, 6 cherry-picked commits.
- **Blocked on review.** The `main` ruleset requires 1 approving review from
  someone other than the last pusher. The credential in use is
  `kamburcito-tech` (write); the only other collaborator is `josh-scalestorm`
  (admin). Self-approval returns 422. **Someone else must approve.**
- `main` deploys only to <https://staging-lumotive.filebx.net/>.
- **PR #2** (Platform, LCM Chips, Footer) **cannot be opened until PR #1
  merges.** `895a64d` conflicts on `CtaDefault.svelte` and
  `HeroFullHeight.svelte`, and `origin/main`'s `src/app.css` has 0 `data-align`
  rules against 7 on this branch — all from homepage commit `9e35892` — which
  would leave `align: "container"` inert on 16 sections. Sequence is recorded
  in `handoff/pr2-platform-lcm-chips-footer.md`: branch off updated
  `origin/main`, then cherry-pick
  `f13cdb6 6ae222c 93d5e0d 895a64d 6fecc22 1c9ca49`.
- Nothing has been pushed, merged or deployed beyond the one authorised staging
  attempt.

## Uncommitted Vite fix

`vite.config.ts` carries `server.watch.ignored: ['**/build/**',
'**/.svelte-kit/output/**']`, which clears the Windows EBUSY watcher crash when
a build runs beside the dev server. Verified: Vite 8.2.2 concatenates user
patterns onto its defaults, dev plus a concurrent build are clean, HMR intact.

**Deliberately left uncommitted** so it does not ride along in a page commit.
It needs its own commit, or a decision to drop it. Watch for `git add -A`,
which has swept it into a page commit once before and required a history
rebuild.

## Conventions worth keeping

- Approved copy is binding, word for word, including capitalization. Never
  invent copy, specs or imagery.
- `casing: "exact"` is scoped to card titles only — the package title-cases
  section headings and sentence-cases cards.
- Contrast is corrected with existing tokens only: values and labels to Optical
  Ink, links to Laser Blue, section links to Deep Laser Blue, captions to Slate
  Text. The accent cycle survives on decorative bars.
- Where only some images in a set exist, **all** are omitted — uniform beats
  part-illustrated.
- Unapproved substitute imagery is removed; a real, on-topic incumbent asset is
  kept and tracked as an upgrade.
