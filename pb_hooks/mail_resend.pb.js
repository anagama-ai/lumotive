"use strict";

// Deliver mail through Resend's HTTPS API instead of SMTP. The deployment host
// drops outbound SMTP and PocketBase reports the timeout only after the caller
// has already seen success. Skipping e.next() replaces the SMTP send entirely.
onMailerSend(function (e) {
	var key = $os.getenv("RESEND_API_KEY");
	if (!key) {
		e.next();
		return;
	}

	var addresses = function (list) {
		var out = [];
		for (var i = 0; i < (list || []).length; i++) {
			var entry = list[i];
			if (entry && entry.address) out.push(entry.address);
		}
		return out;
	};

	var from = e.message.from || {};
	var payload = {
		from: from.name ? from.name + " <" + from.address + ">" : from.address,
		to: addresses(e.message.to),
		subject: e.message.subject || ""
	};
	if (e.message.html) payload.html = e.message.html;
	if (e.message.text) payload.text = e.message.text;
	var cc = addresses(e.message.cc);
	if (cc.length) payload.cc = cc;
	var bcc = addresses(e.message.bcc);
	if (bcc.length) payload.bcc = bcc;

	var response = $http.send({
		url: "https://api.resend.com/emails",
		method: "POST",
		headers: {
			Authorization: "Bearer " + key,
			"content-type": "application/json"
		},
		body: JSON.stringify(payload),
		timeout: 20
	});

	if (response.statusCode < 200 || response.statusCode > 299) {
		throw new Error(
			"resend rejected the message: " + response.statusCode + " " + String(response.raw || "")
		);
	}
});
