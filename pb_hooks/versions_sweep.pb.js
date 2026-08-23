"use strict";

cronAdd("content-version-retention", "0 3 * * *", function () {
	var lib;

	try {
		lib = require(`${__hooks}/versions_lib.js`);

		var versions = $app.findRecordsByFilter(
			"content_versions",
			"",
			"collection,record,-created,-id",
			0,
			0
		);
		var group = [];
		var groupKey = "";

		for (var i = 0; i < versions.length; i++) {
			var key = JSON.stringify([
				versions[i].getString("collection"),
				versions[i].getString("record")
			]);

			if (group.length && key !== groupKey) {
				lib.sweepVersionGroup($app, group);
				group = [];
			}

			groupKey = key;
			group.push(versions[i]);
		}

		if (group.length) {
			lib.sweepVersionGroup($app, group);
		}
	} catch (error) {
		if (lib) {
			lib.logVersionError("retention sweep", error, "versions_sweep");
		} else {
			console.log("[versions_sweep] retention sweep failed: " + String(error));
		}
	}
});
