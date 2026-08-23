migrate(
	(app) => {
		try {
			app.findFirstRecordByFilter("globals", "key = {:key}", { key: "seo" })
		} catch {
			const record = new Record(app.findCollectionByNameOrId("globals"))
			record.set("key", "seo")
			record.set("data", { defaultOgImage: "" })
			app.save(record)
		}
	},
	(app) => {
		try {
			app.delete(app.findFirstRecordByFilter("globals", "key = {:key}", { key: "seo" }))
		} catch {}
	}
)
