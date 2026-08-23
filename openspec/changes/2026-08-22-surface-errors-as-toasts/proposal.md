## Why

Production ran with adapter-node's default 512 KiB request-body limit, so uploads the media specification promises to accept were rejected with a bare 413 error page before the server action ran. Role and load failures likewise replaced the admin UI with separate full-page error screens, while ordinary admin action results remained as persistent page-owned notices.

## What Changes

- Raise the production runtime request-body limit to 32 MiB, above the documented 30 MiB upload-batch limit with room for multipart overhead.
- Define the 10 MiB file limit and 30 MiB batch limit once for browser and server use, and reject oversized browser selections through a toast before sending a request.
- Report top-level admin form-action successes and failures as dismissible, auto-expiring toast messages announced through an ARIA live region from one shared layer mounted in the admin shell.
- Keep field-level errors, list-shaped action results, and state banners driven by loaded data inline; keep public-site form errors inline because public routes have no toast layer.
- Render failed admin page loads through the admin error boundary inside the admin shell and keep admin-only authorization checks in the guarded page loads rather than throwing from the admin layout.

## Capabilities

### Modified Capabilities

- `media-library`: adds shared file and batch limits, browser pre-flight rejection through the admin toast layer, and in-shell handling for request-size failures.
- `platform-operations`: requires the deployed runtime to admit documented upload batches, admin action results to use the shared toast layer, and admin page-load failures to remain within the admin shell.

## Impact

- Runtime image configuration sets `BODY_SIZE_LIMIT=33554432`; the documented request-size limits do not change.
- Upload browser and server paths share `src/lib/uploads.ts`, and an oversized browser selection reports through the shared admin toast layer without sending a request.
- The admin shell mounts one toast layer for top-level form-action results, while contextual and list-shaped feedback remains inline.
- The admin route retains its error boundary, while admin-only page loads retain their own role guards and the admin layout stops throwing the role failure outside its shell.
- Focused upload, toast, and admin error-path checks cover the changed behavior; no new dependency or infrastructure service is introduced.
