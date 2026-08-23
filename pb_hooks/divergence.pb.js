"use strict";

var BOOKKEEPING_FIELDS = {
	created: true,
	updated: true,
	collectionId: true,
	collectionName: true,
	expand: true
};

function canonicalize(value) {
	if (Array.isArray(value)) {
		return value.map(canonicalize);
	}
	if (value instanceof Date) {
		return value.toJSON();
	}
	if (!value || typeof value !== "object") {
		return value;
	}

	var result = {};
	Object.keys(value)
		.sort(function (left, right) {
			return left < right ? -1 : left > right ? 1 : 0;
		})
		.forEach(function (key) {
			result[key] = canonicalize(value[key]);
		});
	return result;
}

function fingerprintRecord(record) {
	var content = {};
	Object.keys(record).forEach(function (key) {
		if (!Object.prototype.hasOwnProperty.call(BOOKKEEPING_FIELDS, key)) {
			content[key] = record[key];
		}
	});
	return $security.sha256(JSON.stringify(canonicalize(content)));
}

function findState(key) {
	try {
		return $app.findFirstRecordByFilter("promotion_state", "key = '" + key + "'");
	} catch (_) {
		return null;
	}
}

function writeDivergence(data) {
	var record = findState("divergence");
	if (!record) {
		record = new Record($app.findCollectionByNameOrId("promotion_state"));
		record.set("key", "divergence");
	}
	record.set("data", data);
	$app.save(record);
}

function readProductionRecords(baseUrl, collection, token) {
	var records = [];
	var page = 1;

	while (true) {
		var request = {
			url:
				baseUrl.replace(/\/+$/, "") +
				"/api/collections/" +
				encodeURIComponent(collection) +
				"/records?page=" +
				page +
				"&perPage=500&sort=id",
			method: "GET",
			timeout: 30
		};
		if (token) {
			request.headers = { Authorization: "Bearer " + token };
		}

		var response = $http.send(request);
		if (response.statusCode !== 200 || !response.json || !Array.isArray(response.json.items)) {
			throw new Error("Production record read failed.");
		}

		records = records.concat(response.json.items);
		if (page >= response.json.totalPages) {
			return records;
		}
		page++;
	}
}

cronAdd("production-divergence", "*/5 * * * *", function () {
	var baseUrl = $os.getenv("PROMOTE_PROD_URL");
	if (!baseUrl) {
		return;
	}

	try {
		var checkedAt = new Date().toISOString();
		var manifestRecord = findState("manifest");
		var manifest = manifestRecord ? manifestRecord.get("data") : null;
		if (
			!manifest ||
			typeof manifest !== "object" ||
			!manifest.collections ||
			typeof manifest.collections !== "object" ||
			Array.isArray(manifest.collections)
		) {
			writeDivergence({
				diverged: false,
				collections: [],
				counts: {},
				checkedAt: checkedAt,
				status: "no_manifest"
			});
			return;
		}

		var token = $os.getenv("PROMOTE_PROD_TOKEN");
		var affected = [];
		var counts = {};
		Object.keys(manifest.collections)
			.sort()
			.forEach(function (collection) {
				var baseline = manifest.collections[collection] || {};
				var current = {};
				readProductionRecords(baseUrl, collection, token).forEach(function (record) {
					current[record.id] = fingerprintRecord(record);
				});

				var count = 0;
				Object.keys(current).forEach(function (id) {
					if (
						!Object.prototype.hasOwnProperty.call(baseline, id) ||
						current[id] !== baseline[id]
					) {
						count++;
					}
				});
				Object.keys(baseline).forEach(function (id) {
					if (!Object.prototype.hasOwnProperty.call(current, id)) {
						count++;
					}
				});

				if (count) {
					affected.push(collection);
					counts[collection] = count;
				}
			});

		writeDivergence({
			diverged: affected.length > 0,
			collections: affected,
			counts: counts,
			checkedAt: checkedAt,
			status: "checked"
		});
	} catch (_) {
		console.log("[divergence] production comparison failed.");
	}
});
