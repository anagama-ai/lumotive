## Why

Every site built from this template otherwise requires the PocketBase developer dashboard to add an editor account, but that dashboard is not reachable in the deployed topology. The template needs a site-owned administration and password-recovery flow so account work remains possible without exposing the backend dashboard.

## What Changes

- Add an admin-only account administration screen that lists editor accounts, creates accounts as emailed invitations, changes roles, resends set-password mail, and deletes accounts.
- Prevent self-demotion, self-deletion, deletion or demotion of the last admin, and every account-management action by an editor-role user.
- Configure generic, environment-driven outbound account mail over an encrypted authenticated transport reachable from the deployment host, with a provider API path that reports failed sends to the caller.
- Add a forgot-password request and a tokenized, site-owned password-reset screen with account-enumeration resistance and request rate limiting.
- Ensure administrators never choose or view another account's password; invitations reuse the password-reset mechanism.

## Capabilities

### New Capabilities

- `editor-password-recovery`: defines outbound account-mail transport and sender identity, forgot-password requests, tokenized password reset, invitation-on-create and resend behavior, anti-enumeration, and rate limiting.

### Modified Capabilities

- `editorial-roles`: adds the admin account-management surface, invitation-based creation, role and delete operations, and guards that preserve administrative access.

## Impact

- New routes at `/admin/users`, `/admin/forgot`, and `/admin/reset/[token]`, plus an admin-only navigation entry and focused server-action tests.
- PocketBase migrations add the auth-collection management grant, environment-driven mail settings, the site-owned reset link template, and reset-request rate limiting.
- A mail hook sends through the provider's HTTPS API when `RESEND_API_KEY` is present while retaining PocketBase SMTP settings as the fallback when it is absent.
- Runtime configuration uses `RESEND_API_KEY`, `SITE_URL`, `MAIL_SENDER_NAME`, and `MAIL_SENDER_ADDRESS`; unset sender variables leave existing PocketBase sender settings unchanged.
- No new dependency, public-site change, backend reachability change, deployment, or infrastructure work.
