"use strict";

onRecordUpdateRequest(function (e) {
	var lib;

	try {
		lib = require(`${__hooks}/versions_lib.js`);
		// `editor` is a relation to `editors`, so only an editor may be attributed. A
		// superuser or automation writing here would fail the relation and lose the snapshot.
		if (e.auth && e.auth.collection().name === "editors") {
			e.record.set("versionEditorId", e.auth.id);
		}
	} catch (error) {
		if (lib) {
			lib.logVersionError("recording the acting editor", error);
		} else {
			console.log("[versions] recording the acting editor failed: " + String(error));
		}
	}

	e.next();
}, "pages", "posts");

onRecordUpdate(function (e) {
	e.next();

	var lib;

	try {
		lib = require(`${__hooks}/versions_lib.js`);

		var collectionName = e.record.collection().name;
		var recordId = e.record.id;
		var version = new Record(e.app.findCollectionByNameOrId("content_versions"));

		version.set("collection", collectionName);
		version.set("record", recordId);
		version.set("snapshot", lib.versionSnapshot(e.record.original()));

		var editorId = e.record.getString("versionEditorId");
		if (editorId) {
			version.set("editor", editorId);
		}

		e.app.runInTransaction((txApp) => {
			txApp.save(version);
			lib.trimVersions(txApp, collectionName, recordId, version.id);
		});
	} catch (error) {
		if (lib) {
			lib.logVersionError("snapshot or retention trim", error);
		} else {
			console.log("[versions] snapshot or retention trim failed: " + String(error));
		}
	}
}, "pages", "posts");

onRecordDelete(function (e) {
	e.next();

	var lib;

	try {
		lib = require(`${__hooks}/versions_lib.js`);
		lib.deleteVersions(e.app, e.record.collection().name, e.record.id);
	} catch (error) {
		if (lib) {
			lib.logVersionError("loading snapshots for deletion", error);
		} else {
			console.log("[versions] loading snapshots for deletion failed: " + String(error));
		}
	}
}, "pages", "posts");
