## 1. Verify authentication and session

This change documents shipped behaviour, so the work is proving each requirement against the running system. The spec was written from verified facts rather than live observation, so nothing here may be assumed.

- [x] 1.1 Sign in with valid credentials and confirm the session grants the editor UI; sign in with invalid credentials and confirm it does not
- [x] 1.2 Confirm the session cookie is not readable by client-side script
- [x] 1.3 Confirm the session cookie is restricted to same-site navigation
- [x] 1.4 Confirm the secure flag is set when the request arrives over a secure protocol, and absent over plain local HTTP. PARTIAL: absent over plain HTTP confirmed. The secure-protocol half could NOT be observed here, because the only TLS entry point is a tailnet proxy that terminates TLS and forwards plain HTTP while `ORIGIN` and the forwarded-proto headers are unset, so the app never sees `https:`. Code condition verified by reading `src/hooks.server.ts`; the flag is a deployment obligation, recorded in 4.2
- [x] 1.5 Present a forged token with a garbage signature and confirm it yields no authenticated editor, reaches no admin screen, and performs no editor action
- [x] 1.6 Present an expired token and confirm the same
- [x] 1.7 Sign out, then confirm the previous session no longer grants the editor UI. FINDING: sign-out clears the cookie, but replaying the captured token still returns 200 because the token is self-contained and not invalidated server-side. The requirement over-claimed and was corrected in the spec; token lifetime is 5 days and is the only control
- [x] 1.8 Request a public page anonymously and confirm no session cookie is set, so the response stays cacheable
- [x] 1.9 Confirm an unauthenticated admin request redirects to sign-in
- [x] 1.10 Confirm an admin-only screen refuses a non-admin editor

## 2. Verify rate limiting

- [x] 2.1 Exceed the authentication limit from one guest and confirm the request is explicitly refused rather than served slowly
- [x] 2.2 Confirm the limit resets after its window
- [x] 2.3 Exceed the form-submission limit and confirm the same refusal
- [x] 2.4 Confirm a legitimate rate of use is never refused

## 3. Verify backups

- [x] 3.1 Confirm a scheduled backup is produced without operator action, and that it restores
- [x] 3.2 Confirm scheduled backup retention is capped
- [x] 3.3 Prove retention is scoped to scheduled backups: create backups by other means, exceed the retention count, and confirm they are neither evicted by scheduled retention nor counted toward it. This is the requirement most likely to be wrong and it is the one `add-environment-promotion` depends on
- [x] 3.4 Confirm a backup restores the database and, while files are stored locally, the uploaded files
- [x] 3.5 Record what a backup covers once file storage is external, without switching this deployment to external storage

## 4. Reconcile

- [x] 4.1 For every requirement that does not hold, decide whether the requirement or the code is wrong, and correct whichever is wrong. Never weaken a requirement to match a defect
- [x] 4.2 Where a requirement could not be exercised without an unacceptable change, record what was not proven rather than marking it verified
- [x] 4.3 Run the type check and the production build after any code correction

## 5. Findings raised for decision

- [x] 5.1 RESOLVED: token lifetime reduced from 5 days to 1 in `pb_migrations/1700000280_editor_token_lifetime.js`. Sessions refresh on each request, so this is an idle timeout, not a forced re-login. Was 5 days. Sign-out cannot invalidate it, so a captured token stays usable for up to 5 days. Shortening it is a one-line collection setting and is a security-versus-convenience decision for the operator, not a change to make unilaterally
- [x] 5.2 CLOSED, already documented in `README.md` under Deploying. The secure flag on the session cookie is inert behind a TLS-terminating proxy until `ORIGIN`, or both `PROTOCOL_HEADER` and `HOST_HEADER`, are configured. Already documented in `README.md`; worth a deployment checklist item
