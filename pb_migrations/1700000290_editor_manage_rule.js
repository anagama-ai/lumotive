migrate(
	(app) => {
		const editors = app.findCollectionByNameOrId("editors")
		editors.manageRule = '@request.auth.role = "admin"'
		app.save(editors)

		for (const editor of app.findAllRecords(editors)) {
			if (editor.getBool("emailVisibility")) continue
			editor.set("emailVisibility", true)
			app.save(editor)
		}
	},
	(app) => {
		const editors = app.findCollectionByNameOrId("editors")
		editors.manageRule = null
		app.save(editors)
	}
)
