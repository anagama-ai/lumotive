## Why

Two public-facing behaviours ship with no contract.

**Redirects.** An editor can manage redirects, and `editorial-roles` says who is allowed to. Nothing says what a redirect *does*. The implementation is more particular than anyone would guess from the admin screen: it only engages on a 404, only for `GET` and `HEAD`, never inside `/admin`, matches a requested path against four variants covering leading and trailing slashes, honours only rows marked active, and answers 308. A request that matches nothing keeps its original 404.

Every one of those is a decision someone could reasonably change while believing it harmless. And redirects are on the promoted list in `add-environment-promotion`, so they are about to start moving between environments with no stated behaviour to verify after they land.

**The blog index.** The public post list exists, paginates twelve at a time, orders newest-first by publication date, shows only published posts, and clamps a requested page number into a sane range. That last detail was added deliberately — an unbounded page parameter and an unbounded list query were both real findings — and none of it is recorded.

This change writes the contract for behaviour that already exists.

## What Changes

- Requirements describing redirect resolution: when it applies, the path forms it matches, that only active redirects take effect, the response it returns, and that a non-match preserves the original not-found response.
- A requirement that redirect resolution never shadows the editor UI, because a redirect row pointing at an admin path would otherwise be able to capture it.
- Requirements describing the public post list: ordering, page size, that unpublished posts never appear, and that a hostile or absurd page parameter is bounded rather than passed through.
- A requirement that the post list stays bounded as posts accumulate, so the page cannot degrade into fetching everything.

No behaviour changes. Where verification finds implementation and requirement disagree, the disagreement is resolved rather than papered over.

## Capabilities

### New Capabilities

- `public-delivery`: resolving redirects for public requests, and serving the public post list.

### Modified Capabilities

None. `seo-and-discovery` owns the generated sitemap, feed, and crawler directives; `page-hierarchy` owns public page URLs. Neither covers redirect resolution or the post list, and this change does not disturb them.

## Impact

Affected specs:

- `openspec/specs/public-delivery/spec.md` (new)

Affected code:

- None expected. Any change is a defect found while verifying a requirement against the running system.

Interaction worth stating:

- Redirect resolution runs on the 404 path, so it sits behind every public request that misses. Its cost and its correctness are therefore a property of the whole public surface, not of one screen.

## Assumptions

- Recorded because it bounds scope: the admin screens for managing redirects belong to the existing editorial and list-management capabilities. Only the public resolution behaviour is specified here.
- The page size of twelve is treated as a stated bound rather than an inviolable constant. The requirement is that the list is paginated and bounded, not that the number never changes.
