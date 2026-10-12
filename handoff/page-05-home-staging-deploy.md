# Page 05 — Home: staging deploy

Approved content package rev. 2026-10-07 (v2), page 05 (Home).
Target: `https://staging-lumotive.filebx.net/` (confirmed by the client as the
only environment this repository's `main` branch deploys to; production is not
affected).

## Status: pushed, awaiting review approval. Not deployed.

Pull request **#1** — https://github.com/scale-storm/lumotive-pb/pull/1
Branch `staging-home-page05` at **`0b2ff9f`**, six commits ahead of
`origin/main` (`f203fc1`).

The merge is blocked by the repository ruleset on `main`, not by anything in
the change. See "Blocker" below.

## Scope

Homepage only. Six commits cherry-picked cleanly from `feedback-20261007-v2`
onto `origin/main`, in a separate worktree so no Platform, LCM Chips or
Applications work was touched:

```
0b2ff9f feat(home): apply approved page 5 sections and shared container alignment
746e330 fix(home): refine hero alignment and spacing
20cab70 fix(home): keep the hero heading on one line on desktop
0e27323 fix(home): apply approved page 5 solution card copy and links
6f65677 chore(migrations): renumber the page 5 migration above origin/main
552d694 fix(home): apply approved page 5 hero and CTA copy
```

20 files, +987 / −17. Six migrations, all homepage: `1787707300`,
`1787707500`, `1787707600`, `1787707700`, `1787707800`, `1787707900`.

Deliberately **excluded**: page 06 Platform, page 07 LCM Chips, the
`/lm10 → /lcm-chips` redirect, page 08 Applications. The platform migration
`1787707400` sits numerically between two homepage migrations and is skipped;
PocketBase does not require contiguous numbering, so the gap is harmless.

Leakage check on the branch diff: no Platform, LCM, chips or footer files.

### Included dependency

`1787707600_posts_featured_field.js` adds the `Featured` field to the posts
collection. It is required by the "Latest From Lumotive" section (package page
02) and is included on the client's instruction. It is a CMS schema change
visible to editors site-wide, not a homepage-only edit.

## Deferred: footer

Page 05 of the package carries `CHANGE · FOOTER FOLLOWS NEW SITE MAP; LINKEDIN
ICON ADDED`. That change is implemented on `feedback-20261007-v2` as
`93d5e0d` (`1787708000_footer_sitemap.js` plus `Footer.svelte`) but is
**deliberately held back from this deploy**, on the client's instruction.

Reason: the new footer's Platform group links "LCM chips" to `/lcm-chips`,
which does not exist until page 07 ships. Deploying the footer alone would put
a 404 link on every page of staging.

Consequence to record: **the homepage on staging is page-05 complete except
for its footer**, which still shows the old site map ("LCM platform", no
LinkedIn icon). Ship `93d5e0d` together with the page-07 work, not before.

The LinkedIn company URL is still an open Lumotive input regardless; see
`handoff/page-06-platform.md`.

## Checks run before push

- `svelte-check`: 587 files, 0 errors, 0 warnings.
- `npm run build` (adapter-node, the same build the image runs): clean.
- Merge into `main` was fast-forward only; no force-push, no rebase of pushed
  history.

## Blocker

`git push origin main` was rejected: `GH013 — Changes must be made through a
pull request`. The branch was pushed and PR #1 opened instead.

The merge API then returned **405**:

> Repository rule violations found — New changes require approval from someone
> other than the last pusher.

The `main` ruleset requires `required_approving_review_count: 1` with
`require_last_push_approval: true`. The credential available here is
`kamburcito-tech` (write). GitHub refuses a self-approval
(422, "Can not approve your own pull request"). The only other collaborator is
`josh-scalestorm` (admin).

**To finish: `josh-scalestorm` approves and merges PR #1.** Merging to `main`
triggers `publish.yml`, which builds both images and deploys them to Dokploy.
The deploy job's last step prints the live host and fails the run on a bad
release.

Nothing about the change needs to alter. No ruleset change is being requested.

## After the merge

1. Watch the `Publish container images` run to `done`.
2. Verify on `https://staging-lumotive.filebx.net/`:
   - hero reads "LCM™ chips steer and shape laser light electronically, on the
     surface of a semiconductor, with no moving parts" — the old "no mirrors,
     no lenses" wording must be gone;
   - the closing CTA's second action reads "Browse dev kits" and points at
     `/dev-kits`, not the 404 `/products`;
   - solution cards read "One Chip. Boundless Applications." with the approved
     Sense and Connect copy;
   - "Latest From Lumotive" renders three featured posts with images and an
     "All news →" link, and shows no dates;
   - "When Light Becomes Programmable" renders with its four application areas;
   - footer still shows the old site map — expected, see Deferred above.
3. Confirm `/platform` and `/lm10` are unchanged and `/lcm-chips` still 404s,
   which proves the deploy carried homepage scope only.
