"use strict";

function parseFormJSON(record, field, fallback) {
	var raw = record.getString(field);
	return raw ? JSON.parse(raw) : fallback;
}

function submissionValue(value) {
	if (value === null || typeof value === "undefined") {
		return "";
	}
	if (typeof value === "object") {
		return JSON.stringify(value);
	}
	return String(value);
}

function submissionBody(form, submission) {
	var fields = parseFormJSON(form, "fields", []);
	var values = parseFormJSON(submission, "values", {});
	var lines = ["New submission for " + form.getString("name"), ""];
	var listed = {};

	for (var i = 0; i < fields.length; i++) {
		var key = String(fields[i].name || fields[i].id || "");
		if (key && Object.prototype.hasOwnProperty.call(values, key)) {
			lines.push(String(fields[i].label || key) + ": " + submissionValue(values[key]));
			listed[key] = true;
		}
	}

	for (var valueKey in values) {
		if (Object.prototype.hasOwnProperty.call(values, valueKey) && !listed[valueKey]) {
			lines.push(valueKey + ": " + submissionValue(values[valueKey]));
		}
	}

	return lines.join("\n");
}

function parseRecipients(app, formId) {
	var records = app.findRecordsByFilter(
		"form_recipients",
		"form = {:form}",
		"",
		1,
		0,
		{ form: formId }
	);
	var value = records.length ? records[0].getString("addresses") : "";

	var candidates = value.split(/[,\r\n]+/);
	var recipients = [];
	var seen = {};

	for (var i = 0; i < candidates.length; i++) {
		var address = candidates[i].replace(/^\s+|\s+$/g, "");
		var key = "$" + address.toLowerCase();
		if (address && !seen[key]) {
			seen[key] = true;
			recipients.push(address);
		}
	}

	return recipients;
}

function buildSubmissionMessage(formName, body, settings, recipient) {
	return new MailerMessage({
		from: {
			address: settings.meta.senderAddress,
			name: settings.meta.senderName
		},
		to: [{ address: recipient }],
		subject: "New submission: " + formName,
		text: body
	});
}

module.exports = {
	submissionBody: submissionBody,
	parseRecipients: parseRecipients,
	buildSubmissionMessage: buildSubmissionMessage
};
