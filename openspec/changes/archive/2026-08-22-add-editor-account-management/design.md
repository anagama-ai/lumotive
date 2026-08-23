## Context

See proposal.md — Why. The `editors` auth collection already defines the `admin` and `editor` roles, but the deployed content backend and its developer dashboard are internal-only. Browser-facing account work therefore has to pass through SvelteKit server routes and the server-side PocketBase client. Account mail also has to work from hosts where ordinary outbound SMTP is not reliable.

The feature spans the admin UI, server actions, PocketBase collection rules and settings, a mail hook, and runtime environment configuration. The reusable template cannot embed a site name, public origin, or sender address.

## Goals / Non-Goals

**Goals:**
- Remove the developer dashboard from normal editor-account administration.
- Keep passwords known only to their holders by using one emailed reset flow for invitation and recovery.
- Preserve administrative access under every account action.
- Make transport failures observable and keep credentials and site identity runtime-driven.

**Non-Goals:**
- Email verification, multi-factor authentication, or session-management changes.
- A second invitation token or account-activation model.
- Public browser access to PocketBase or its developer dashboard.
- Deployment, provider account setup, domain verification, or new dependencies.

## Decisions

**Use `/admin/users` with server-rendered forms and repeat the admin guard in the load and every action.** The route follows the existing admin list-and-form conventions and uses `locals.pb`; no browser-side PocketBase client is introduced. A layout guard is insufficient evidence of authorization because SvelteKit runs actions before layout loads. Each create, role-change, resend, and delete action therefore refuses missing sessions and non-admin roles before reading or changing account data.

**Keep lockout guards in the actions and count administrators immediately before a destructive write.** The account-store rules cannot express self-demotion, self-deletion, or a cross-record “last administrator” invariant. The route refuses self-demotion and self-deletion and refreshes the admin count before deleting or demoting an admin. This is the smallest policy layer that protects every UI request while leaving the auth collection rules as the underlying authorization boundary.

**Set `manageRule` on the `editors` auth collection.** PocketBase 0.39 treats an administrator updating another auth record's password as though the account holder were changing their own password unless `manageRule` authorizes the administrator. The observed response without the rule is `oldPassword: "Cannot be blank."`; setting `editors.manageRule = '@request.auth.role = "admin"'` is the narrow collection-level grant that makes administrator-driven auth-record management work. Migration `1700000290_editor_manage_rule.js` applies the rule and its down migration restores the prior value. The site-owned admin UI still provides no control or action that lets an administrator choose another person's password.

**Use password reset as the invitation mechanism rather than adding a second token system.** PocketBase already provides expiring, single-use password-reset tokens. Account creation generates an unguessable password that is never logged, returned, or displayed, then requests the ordinary reset email. The same `/admin/reset/[token]` route handles first-time setup and forgotten passwords, so expiry, token consumption, validation, and resend behavior have one security-critical implementation rather than two.

**Send provider mail over HTTPS and make a rejected send fail loudly.** Tests from the deployment host showed connections to the provider's ordinary and alternate SMTP ports timing out. PocketBase reports that failure asynchronously after the reset-request caller has already received success, which can silently drop an invitation. `pb_hooks/mail_resend.pb.js` intercepts mail when `RESEND_API_KEY` is present, calls the provider's authenticated HTTPS API, and throws when the provider refuses or cannot accept the message so the initiating action can report the failure. PocketBase's SMTP settings remain documented as the fallback path when no API key is present, but mail stays off rather than attempting an unauthenticated send.

**Configure public identity and mail settings from runtime environment in migration `1700000291_outbound_mail.js`.** `SITE_URL` supplies the public origin used for `meta.appURL` and the emailed `/admin/reset/{TOKEN}` link. `MAIL_SENDER_NAME` and `MAIL_SENDER_ADDRESS` override the existing sender fields only when set; absent overrides leave the existing PocketBase sender settings untouched. `RESEND_API_KEY` remains a runtime secret and is never written into a migration, database setting, generated artifact, or client response. The migration also installs reset-email wording that is correct for both invitation and recovery.

**Validate environment at the call site, not at module import.** The Docker build imports server modules without the deployment runtime environment. A module-level throw for a missing mail or site variable therefore breaks the image build before a request can run. Helpers read dynamic private environment values and validate the values only when an action actually needs to send mail or construct a public reset link; startup and builds remain valid when mail is intentionally unconfigured.

**Use the backend's reset-request limiter.** Migration `1700000292_password_reset_limit.js` installs a per-requester allowance for the password-reset endpoint. A backend rule applies no matter which server route invokes the endpoint, survives process restarts, and avoids another application-side counter.

**Return one forgot-password outcome for known and unknown accounts.** `/admin/forgot` validates only email shape, requests reset mail, and returns the same confirmation wording and status whether the account exists. Account-not-found behavior and backend reset-request errors do not reveal membership in the editor collection. Transport failure observability remains available to authenticated invitation actions; the public forgot-password response cannot safely distinguish it without becoming an enumeration side channel.

## Risks / Trade-offs

- **Two administrators concurrently remove each other's access** → Counting immediately before each write narrows but does not eliminate the race. Accepted for the template's low-frequency operator workflow; a backend transaction or hook is warranted only if concurrent administration becomes real usage.
- **Mail is unavailable when the API credential is absent** → The site and backend still start, existing sender settings remain intact, and an admin can resend after configuration is restored. This is preferable to a half-configured transport that reports success while dropping mail.
- **Invitation creation succeeds but its send fails** → The action reports both facts and leaves a resend control, avoiding a rollback that could hide a valid account or a success message that hides a lost invitation.
- **Email access grants password-reset capability** → This is inherent to emailed recovery; expiring, single-use tokens limit replay.
- **A generated password exists briefly before first setup** → It is produced from a cryptographic source, never disclosed, and replaced when the holder consumes the reset link.

## Migration Plan

Apply `1700000290_editor_manage_rule.js`, `1700000291_outbound_mail.js`, and `1700000292_password_reset_limit.js` in order. Each migration is idempotent and restores the prior rule or settings in its down migration. Existing editor accounts and passwords are not rewritten. Runtime operators may add `RESEND_API_KEY`, `SITE_URL`, `MAIL_SENDER_NAME`, and `MAIL_SENDER_ADDRESS` without changing the image; when sender overrides are absent, the current PocketBase sender identity is preserved.
