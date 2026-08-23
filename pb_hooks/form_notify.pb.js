"use strict";

onRecordAfterCreateSuccess(function (e) {
	e.next();

	var lib;

	try {
		lib = require(`${__hooks}/forms_lib.js`);

		var form = e.app.findRecordById("forms", e.record.getString("form"));
		var formName = form.getString("name");
		var body = lib.submissionBody(form, e.record);
		var settings = e.app.settings();
		var recipients = lib.parseRecipients(e.app, form.id);

		for (var i = 0; i < recipients.length; i++) {
			var address = recipients[i];

			try {
				var message = lib.buildSubmissionMessage(formName, body, settings, address);
				e.app.newMailClient().send(message);
			} catch (error) {
				console.log("[form_notify] email to " + address + " failed: " + String(error));
			}
		}
	} catch (error) {
		console.log("[form_notify] notification setup failed: " + String(error));
	}
}, "form_submissions");
