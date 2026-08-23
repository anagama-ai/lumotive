## 1. PocketBase account and mail configuration

- [x] 1.1 Add `pb_migrations/1700000290_editor_manage_rule.js` to set the `editors` auth collection's `manageRule` to admin-only and restore the previous rule on rollback
- [x] 1.2 Add `pb_migrations/1700000291_outbound_mail.js` to configure the public application URL and reset-email template from `SITE_URL`, configure mail from `RESEND_API_KEY`, and apply `MAIL_SENDER_NAME` and `MAIL_SENDER_ADDRESS` only when present
- [x] 1.3 Keep the backend startable with mail variables absent, preserve existing sender settings when sender overrides are absent, and validate required values only when the mail path is called rather than at module import
- [x] 1.4 Add `pb_hooks/mail_resend.pb.js` to send through the mail provider's HTTPS API when `RESEND_API_KEY` is present and throw when the provider does not accept the message, while retaining PocketBase's SMTP path as the no-key fallback
- [x] 1.5 Add `pb_migrations/1700000292_password_reset_limit.js` with a per-requester reset-request allowance and a down migration restoring the prior limits
- [x] 1.6 Add `pb_hooks/editor_account_options.pb.js` and `src/lib/editor-accounts.server.ts` (`loadEditorAccountOptions`) so server routes can read the collection's supported roles and password minimum without exposing the collection API to ordinary editors
- [x] 1.7 Document `RESEND_API_KEY`, `SITE_URL`, `MAIL_SENDER_NAME`, and `MAIL_SENDER_ADDRESS` in `.env.example` and `README.md`, including mail-off and sender-preservation behavior when values are absent

## 2. Admin account administration

- [x] 2.1 Add `/admin/users` server load behavior that refuses missing or non-admin sessions and lists editor email, role, creation date, and verification state without returning password data
- [x] 2.2 Add the account screen using existing admin classes, with create-invitation, role-change, resend-invitation, and delete controls and an indication of the signed-in account
- [x] 2.3 Add the admin-only `Users` navigation entry and expose the authenticated account id and role from the admin layout without weakening its existing authentication guard
- [x] 2.4 Implement account creation from email and role only, validate malformed or duplicate email and unsupported role, generate an undisclosed cryptographic password, and request the set-password email
- [x] 2.5 Report invitation-send failure as “account created, email failed” and keep a resend action rather than rolling back the created account or reporting complete success
- [x] 2.6 Implement role change, invitation resend, and delete actions, mapping backend field failures to the existing form error pattern
- [x] 2.7 Repeat the admin authorization check in every action, refuse self-demotion and self-deletion, and refuse deleting or demoting the last admin based on a fresh admin count
- [x] 2.8 Remove every administrator-chosen password field and action; never return a generated or submitted password in form data or errors

## 3. Forgot-password and reset routes

- [x] 3.1 Add a forgot-password link to the admin sign-in screen and create `/admin/forgot` with a form that validates email shape before requesting reset mail
- [x] 3.2 Return identical confirmation wording and status for known and unknown valid email addresses without exposing account existence
- [x] 3.3 Add `/admin/reset/[token]` with a form that accepts a new password twice and validates matching entries and the enforced minimum length
- [x] 3.4 Confirm the reset server-side, direct a successful holder to sign in, refuse used, expired, or altered tokens with guidance to request another link, and never echo password fields

## 4. Behavioral checks

- [x] 4.1 Add or update `src/routes/admin/users/page.server.test.js` for admin-only load and every action, invitation creation and failure reporting, role changes, resend, delete, self-lockout guards, last-admin guards, and password non-disclosure
- [x] 4.2 Add forgot-password action tests for malformed email and indistinguishable known and unknown account responses
- [x] 4.3 Add reset action tests for matching and minimum-length validation, successful confirmation, invalid or used tokens, and password non-disclosure
- [x] 4.4 Run the focused route tests, `npm run check`, and `npm run build`; confirm the build succeeds with runtime mail variables absent
