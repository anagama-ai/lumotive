# PR #2 — Platform + LCM Chips + footer

**Status: held local. Not pushed, no PR opened.**
Reason: PR #2 cannot be based on `origin/main` until PR #1 merges. Evidence and
the exact sequence to run afterwards are below.

## Intended contents

Six commits, in this order:

| Commit | Subject |
| --- | --- |
| `f13cdb6` | feat(platform): apply approved page 6 copy, 2D beamforming and chip cards |
| `6ae222c` | fix(platform): correct approved page 6 manufacturing copy and chip cards |
| `93d5e0d` | feat(footer): follow the approved site map and prepare the LinkedIn icon |
| `895a64d` | fix(platform): finish approved page 6 layout, CTAs and contrast |
| `6fecc22` | feat(lcm-chips): add the approved page 7 page and the /lm10 redirect |
| `1c9ca49` | docs(handoff): record page 05-08 implementation status |

No homepage commits. No page-08 Applications work — page 08 is review-only and
carries nothing implemented.

The footer (`93d5e0d`) is included here, not in PR #1, because its Platform
group links "LCM chips" to `/lcm-chips`. That route only exists once `6fecc22`
ships, so the two must land together.

## Blocker: PR #2 depends on PR #1

The container-alignment system that pages 06 and 07 are built on was introduced
by the **homepage** commit `9e35892` / `0b2ff9f`, which is in PR #1.

Verified by cherry-picking the six commits onto a throwaway branch cut from
`origin/main`:

- `895a64d` **conflicts** on `src/lib/components/sections/CtaDefault.svelte` and
  `src/lib/components/sections/HeroFullHeight.svelte`. Both of this change's
  edits extend expressions that `9e35892` introduced — `CtaDefault`'s `stacked`
  variable and the hero's container-alignment branch. Neither symbol exists on
  `origin/main`.
- Even with the conflicts resolved by hand, `src/app.css` on `origin/main`
  contains **0** `data-align` rules; the branch has **7**, all added by
  `9e35892`. Without them the `align: "container"` field is inert, so the
  **16** sections across the site that set it would silently render
  full-shell. Page 06's `1787708400_platform_container_alignment.js` and every
  aligned page-07 section would do nothing visible.

Splitting the shared CSS and component hunks out of `9e35892` would mean
rewriting an approved, already-reviewed commit that is sitting in an open PR.
Not worth it, and it would make PR #1 and PR #2 conflict with each other.

The probe worktree and branch were deleted; nothing was pushed.

## Migration compatibility

Numbering is already correct for either merge order. Homepage migrations occupy
`1787707300`–`1787707900`; this PR adds `1787707400` (page 6 base, interleaved
by design), `1787708000`–`1787708300`, and `1787708400`–`1787709400`.

PocketBase applies unapplied migrations in filename order and records each, so
a lower-numbered homepage migration arriving after a higher-numbered one still
runs. Nothing in this set reads homepage content or depends on homepage
records. `1787707400` sitting numerically between two homepage migrations is
harmless; contiguity is not required.

The only real coupling is the code-level one above, not the data.

## Sequence once PR #1 merges

```sh
git fetch origin
git worktree add -b staging-platform-lcm-chips ../lumotive-pr2-wt origin/main
cd ../lumotive-pr2-wt
git cherry-pick -x f13cdb6 6ae222c 93d5e0d 895a64d 6fecc22 1c9ca49
npm ci && npm run check && npm run build
git push -u origin staging-platform-lcm-chips
```

Then open PR #2 against `main`. Expect the cherry-picks to apply cleanly, since
the two conflicting files will then carry `9e35892`'s versions.

Branch protection on `main` requires one approving review from someone other
than the last pusher, so `josh-scalestorm` has to approve PR #2 as well.

## Readiness of the included pages

Both pages are ready for staging review. Neither ships unapproved content.

- **Page 06 Platform** — implemented and QA-verified at 390 / 768 / 1024 /
  1440. Pending: the #125 traditional-optics graphic, the 1D-to-2D animation,
  the LCM Explorer bundle and poster (needs integration, not an asset swap),
  the LM10 photo, and the manual Vimeo playback check. None blocks review.
- **Page 07 LCM Chips** — implemented and QA-verified at 390 / 768 / 1024 /
  1280 / 1440 / 1920. The unapproved hero substitute has been removed, so the
  earlier release blocker is cleared. Pending: the chip-in-hand hero
  photograph, the LM10 and LS20 column photos, and the "How LCM fits" two-panel
  media and its integration. None blocks review.
- **Footer** — ready, and correct once page 07 ships. The LinkedIn company URL
  is still an open Lumotive input; `Footer.svelte` renders the icon as soon as
  `globals.seo.socialChannels` gains an entry.

## Known 404s on the deployed result

These are approved destinations whose pages are not built yet. They are
expected, not defects:

- `/dev-kits/transmit-modules`, `/dev-kits/itof`, `/dev-kits/dtof` — package
  pages 13-15, linked from page 07's Start Building blocks.
- `/sense/robotics`, `/sense/automotive` — pages 10 and 11, linked from the
  header.
- `/privacy-policy` — linked from the footer; the package does not specify it.

## Webvizio

No task has been closed. `#125` stays open until the replacement graphic
arrives. The tasks this work resolves should be closed only after the client
has reviewed them on staging.
