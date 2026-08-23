"use strict";

cronAdd("google-reviews-collect", "*/5 * * * *", function () {
	try {
		var url = $os.getenv("REVIEWS_COLLECT_URL");
		var secret = $os.getenv("REVIEWS_SCHEDULER_SECRET");
		if (!url || !secret) {
			return;
		}

		var response = $http.send({
			url: url,
			method: "POST",
			headers: { "X-Reviews-Scheduler-Secret": secret },
			timeout: 30
		});

		if (response.statusCode >= 200 && response.statusCode < 300) {
			console.log("[reviews_collect] collection request completed.");
		} else {
			console.log("[reviews_collect] collection request failed with HTTP " + response.statusCode + ".");
		}
	} catch (_) {
		console.log("[reviews_collect] collection request failed.");
	}
});
