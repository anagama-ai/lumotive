## 1. Verify redirect resolution

This change documents shipped behaviour, so the work is proving each requirement against the running system. The spec was written from verified facts rather than live observation, so nothing here may be assumed.

- [x] 1.1 Create an active redirect and confirm a request to its source receives a permanent redirect carrying the destination
- [x] 1.2 Confirm an existing page wins over a redirect row sharing its path, so a live page can never be intercepted
- [x] 1.3 Confirm a non-retrieval method is not redirected
- [x] 1.4 Confirm tolerant path matching: a stored path matches a request whose leading or trailing slash differs. Exercise each of the four forms
- [x] 1.5 Confirm an inactive redirect has no effect and the request stays not-found
- [x] 1.6 Confirm a request matching nothing receives the original not-found response, unaltered
- [x] 1.7 Prove a redirect row cannot capture an editor UI path. DEFECT FOUND AND FIXED: the exclusion was case-sensitive, so a row with source `/Admin/login` returned 308 to an editor-chosen destination. Fixed in `src/hooks.server.ts` by comparing the guarded prefix lowercased; case variants now stay 404 while a legitimate path such as `/administration-guide` still redirects
- [x] 1.8 Confirm a matching row with an empty destination leaves the request not-found rather than redirecting to nowhere
- [x] 1.9 Test a redirect whose destination is itself, and one pointing at a second redirect, and record what happens. RECORDED: a self-referential row returns 308 to itself indefinitely and a client stops only at its own redirect limit; a two-step chain resolves correctly to the final destination. Nothing rejects a loop at write time

## 2. Verify the public post list

- [x] 2.1 Confirm posts are ordered newest-first by publication date
- [x] 2.2 Confirm a draft post never appears
- [x] 2.3 Confirm the list is bounded per page, and that a later page returns the expected slice
- [x] 2.4 Confirm work per page does not grow with total posts: seed enough posts to span several pages and confirm one page still returns a bounded set
- [x] 2.5 Confirm a non-numeric page value resolves to a valid page
- [x] 2.6 Confirm an absurdly large page value is bounded rather than passed through
- [x] 2.7 Confirm negative and zero page values resolve to a valid page

## 3. Reconcile

- [x] 3.1 For every requirement that does not hold, decide whether the requirement or the code is wrong, and correct whichever is wrong. Never weaken a requirement to match a defect
- [x] 3.2 Remove any data seeded for verification, restoring the prior state
- [x] 3.3 Run the type check and the production build after any code correction

## 4. Findings raised for decision

- [x] 4.1 RESOLVED in `src/routes/admin/redirects/+page.server.ts`: a destination matching its own source is rejected on save, across slash variants. The same validation was also made case-insensitive for admin paths, which previously let a row save cleanly and then never resolve. Was: a self-referential redirect is accepted at write time and produces an endless 308 loop for visitors. Rejecting a row whose destination equals its source, or detecting a cycle on save, would prevent an editor breaking a URL with no warning
