## 1. Upload request limits

- [x] 1.1 Add `src/lib/uploads.ts` with the shared 10 MiB `MAX_FILE_SIZE` and 30 MiB `MAX_BATCH_SIZE` constants
- [x] 1.2 Use the shared constants in server upload validation so unsupported types, oversized files, and oversized batches are rejected before media records are created
- [x] 1.3 Use the shared constants in file-selection and drop handling, report an oversized selection through the admin toast layer, and send no upload request
- [x] 1.4 Set `BODY_SIZE_LIMIT=33554432` in the production runtime image so a documented upload batch plus multipart framing reaches the server action

## 2. Toast and error surfaces

- [x] 2.1 Mount one shared toast layer in the admin shell for top-level form-action success and failure messages, with manual dismissal, automatic expiry, and ARIA live announcements
- [x] 2.2 Replace persistent top-level admin action-result banners with transient toasts while retaining field-level errors, list-shaped results, and state banners driven by loaded data in place
- [x] 2.3 Keep public-site form errors inline because public routes do not mount the toast layer
- [x] 2.4 Add `src/routes/admin/+error.svelte` inside the existing admin shell for authorization, request-size, and fallback page-load errors
- [x] 2.5 Preserve human-readable admin error messages and identify a request-size rejection without replacing the admin shell with a separate error page
- [x] 2.6 Remove the duplicate admin-role throw from `src/routes/admin/+layout.server.ts` while retaining its signed-out redirect and the independent load and action guards on `/admin/users` and `/admin/redirects`

## 3. Behavioral checks

- [x] 3.1 Cover individual and combined upload limits, browser pre-flight rejection through a toast, and the guarantee that an oversized selection sends no request
- [x] 3.2 Cover successful and failed admin action toasts, dismissal, automatic expiry, ARIA live announcements, and the feedback categories that remain inline
- [x] 3.3 Cover admin authorization failures inside the admin shell and the retained page-level role guards
- [x] 3.4 Verify the runtime body ceiling admits the documented 30 MiB upload batch with request-framing headroom
