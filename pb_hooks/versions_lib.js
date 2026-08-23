"use strict";

var VERSION_LIMIT = 50;

function logVersionError(action, error, scope) {
	console.log("[" + (scope || "versions") + "] " + action + " failed: " + String(error));
}

function versionSnapshot(record) {
	var snapshot = record.fieldsData();
	var fields = record.collection().fields;

	for (var i = 0; i < fields.length; i++) {
		if (fields[i].type() === "json") {
			var name = fields[i].getName();
			snapshot[name] = JSON.parse(record.getString(name) || "null");
		}
	}

	return snapshot;
}

function trimVersions(app, collectionName, recordId, keepId) {
	var versions = app.findRecordsByFilter(
		"content_versions",
		"collection = {:collection} && record = {:record}",
		"-created,-id",
		0,
		0,
		{ collection: collectionName, record: recordId }
	);
	var excess = versions.length - VERSION_LIMIT;

	for (var i = versions.length - 1; i >= 0 && excess > 0; i--) {
		if (versions[i].id !== keepId) {
			app.delete(versions[i]);
			excess--;
		}
	}
}


function sweepVersionGroup(app, versions) {
	for (var i = versions.length - 1; i >= VERSION_LIMIT; i--) {
		try {
			app.delete(versions[i]);
		} catch (error) {
			logVersionError("deleting snapshot " + versions[i].id, error, "versions_sweep");
		}
	}
}
function deleteVersions(app, collectionName, recordId) {
	var versions = app.findRecordsByFilter(
		"content_versions",
		"collection = {:collection} && record = {:record}",
		"created",
		0,
		0,
		{ collection: collectionName, record: recordId }
	);

	for (var i = 0; i < versions.length; i++) {
		try {
			app.delete(versions[i]);
		} catch (error) {
			logVersionError("deleting snapshot " + versions[i].id, error);
		}
	}
}

module.exports = {
	logVersionError: logVersionError,
	versionSnapshot: versionSnapshot,
	trimVersions: trimVersions,
	sweepVersionGroup: sweepVersionGroup,
	deleteVersions: deleteVersions
};
