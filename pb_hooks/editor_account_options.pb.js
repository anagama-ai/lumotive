"use strict";

// PocketBase's collection metadata API is superuser-only. Expose only the
// non-secret constraints the editor UI needs so they stay aligned with the
// auth collection instead of being duplicated in SvelteKit.
// PocketBase enforces 71 characters for auth passwords when the field's max is 0.
routerAdd("GET", "/api/editor-account-options", function (e) {
	var editors = e.app.findCollectionByNameOrId("editors");
	var role = editors.fields.getByName("role");
	var password = editors.fields.getByName("password");

	return e.json(200, {
		roles: role.values,
		passwordMinimum: password.min,
		passwordMaximum: password.max || 71
	});
});
