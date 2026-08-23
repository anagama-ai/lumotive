migrate(
	(app) => {
		for (const record of app.findRecordsByFilter("pages", "", "", 0, 0)) {
			if (!record || record.getString("path")) continue
			record.set("path", record.getString("slug"))
			app.save(record)
		}
	},
	(app) => {
		for (const record of app.findRecordsByFilter("pages", "", "", 0, 0)) {
			if (!record || record.getString("path") !== record.getString("slug")) continue
			record.set("path", "")
			app.save(record)
		}
	}
)
