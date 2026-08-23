## Context

See proposal.md — Why. The application uses `@sveltejs/adapter-node` from `vite.config.ts`, and the runtime image did not set `BODY_SIZE_LIMIT`, leaving production at the adapter's 512 KiB default. That rejection happens while the adapter reads the request body, before an upload or page-save action can return ordinary admin feedback.

The media specification permits files up to 10 MiB, and the upload screen accepts several files at once. File-size constants had been repeated between browser and server paths. Top-level admin form-action results were rendered by each page as persistent notices, while errors thrown from the admin layout escaped the shell that should provide their context.

## Goals / Non-Goals

**Goals:**
- Let documented upload batches reach the server action in the deployed runtime.
- Keep browser and server enforcement on the same 10 MiB file and 30 MiB batch limits.
- Reject predictable oversized selections before network work and report the rejection through the admin toast layer.
- Report top-level admin form-action successes and failures as transient, accessible toast messages from one shared layer.
- Preserve contextual inline feedback and the admin shell around route-load failures without weakening page authorization.

**Non-Goals:**
- Changing accepted image formats, the documented upload limits, or the request-size policy.
- Removing server-side validation because browser checks exist.
- Moving field-level errors, list-shaped action results, state banners driven by loaded data, or public-site form errors into toasts.
- Changing which roles may use admin-only screens.
- A custom request parser, upload streaming protocol, or new dependency.

## Decisions

**Set `BODY_SIZE_LIMIT=33554432` in the runtime image.** Adapter-node reads this environment variable before SvelteKit actions run. A 32 MiB ceiling admits the 30 MiB batch limit plus multipart framing while remaining bounded; setting it in the production image fixes the deployed process rather than adding an application setting the adapter cannot consult in time.

**Define both upload limits in `src/lib/uploads.ts`.** The module exports `MAX_FILE_SIZE = 10 * 1024 * 1024` and `MAX_BATCH_SIZE = 30 * 1024 * 1024`. Browser selection handling and server upload validation import those values so neither path can drift to a second number or interpretation.

**Use one shared toast layer for top-level admin action feedback.** The admin shell mounts the layer once. Admin pages send their top-level form-action success and failure messages to it rather than rendering persistent page-owned banners. Toasts are dismissible, auto-expire, and are announced through an ARIA live region.

**Reject oversized browser selections before submitting the form.** Selection and drop handling checks every file against `MAX_FILE_SIZE` and the combined selection against `MAX_BATCH_SIZE`. A failure reports the applicable limit through the shared toast layer and sends no request. Server validation remains authoritative for bypassed or non-browser requests.

**Keep contextual and durable feedback inline.** Field-level errors remain beside their fields. Per-file upload outcomes, bulk action result lists, and other list-shaped results remain in their pages. State banners driven by loaded data also stay in place. Public-site form errors remain inline because public routes do not mount the admin toast layer.

**Render failed admin page loads with `src/routes/admin/+error.svelte`.** The boundary renders inside the existing admin shell, preserves specific human-readable 403 messages, identifies a 413 as a request-size failure, and provides a bounded fallback for other route errors. Keeping the boundary under `/admin` lets SvelteKit retain the navigation and page context for errors raised by admin child routes; these page-load failures are not converted to toasts.

**Keep authentication in the admin layout and admin-only role checks in their page loads.** The layout continues to redirect signed-out visitors, but it no longer throws the admin-role 403 before a child route can resolve inside the shell. The `/admin/users` and `/admin/redirects` loads already enforce their own admin-role guards, and their actions retain the same independent checks, so moving the duplicate layout check changes error placement rather than authorization policy.

## Risks / Trade-offs

- **Browser checks can be bypassed** → The server continues to enforce file type, per-file size, and batch size before creating media records.
- **Transient messages can disappear before a user revisits them** → Toasts remain dismissible, auto-expiring action feedback; contextual field errors and list-shaped results remain inline.
- **The process accepts larger request bodies than before** → The ceiling remains fixed at 32 MiB, only 2 MiB above the documented batch limit for request framing.
- **A future admin-only page omits its own role guard** → Admin-only pages must follow the existing users and redirects pattern; the shared layout remains an authentication boundary, not an admin-role authorization boundary.

## Migration Plan

Deploy the application and runtime image together so the shared upload limits, shared admin toast layer, admin error boundary, and `BODY_SIZE_LIMIT=33554432` take effect in one release. No data migration, dependency installation, or backend configuration change is required.
