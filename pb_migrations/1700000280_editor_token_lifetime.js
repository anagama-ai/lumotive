/// <reference path="../pb_data/types.d.ts" />

// Signing out cannot revoke a PocketBase auth token, so a copied token stays usable
// until it expires. The lifetime is therefore the only bound on that exposure.
// Sessions refresh on every request, so this is an idle timeout, not a forced re-login.
const ONE_DAY = 86400;
const POCKETBASE_DEFAULT = 432000;

migrate(
	(app) => {
		const editors = app.findCollectionByNameOrId('editors');
		editors.authToken.duration = ONE_DAY;
		app.save(editors);
	},
	(app) => {
		const editors = app.findCollectionByNameOrId('editors');
		editors.authToken.duration = POCKETBASE_DEFAULT;
		app.save(editors);
	}
);
