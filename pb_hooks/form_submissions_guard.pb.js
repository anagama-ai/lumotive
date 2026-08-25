"use strict";

// Public form submissions are allowed only for forms linked from published
// pages, and may contain only fields declared by that form.
onRecordCreateRequest(function (e) {
	var formId = e.record.getString("form");
	var form;

	try {
		form = e.app.findRecordById("forms", formId);
	} catch {
		throw new BadRequestError("This form is no longer available.");
	}

	var pages = e.app.findRecordsByFilter("pages", 'status = "published"', "", 500, 0);
	var linked = false;

	for (var i = 0; i < pages.length && !linked; i++) {
		var sections;
		try {
			sections = JSON.parse(pages[i].getString("sections") || "[]");
		} catch {
			sections = [];
		}
		for (var j = 0; j < sections.length; j++) {
			var section = sections[j];
			if (section && section.type === "form" && String(section.formId) === formId) {
				linked = true;
				break;
			}
		}
	}

	if (!linked) {
		throw new BadRequestError("This form is no longer available.");
	}

	var fields = JSON.parse(form.getString("fields") || "[]");
	var declared = {};
	for (var k = 0; k < fields.length; k++) {
		var name = String(fields[k].name || "");
		if (name) declared[name] = true;
	}

	var values = JSON.parse(e.record.getString("values") || "{}");
	for (var key in values) {
		if (Object.prototype.hasOwnProperty.call(values, key) && !declared[key]) {
			throw new BadRequestError("Unexpected field: " + key);
		}
	}

	e.next();
}, "form_submissions");
