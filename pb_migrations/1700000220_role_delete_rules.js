migrate(
	(app) => {
		for (const name of ["pages", "posts"]) {
			const collection = app.findCollectionByNameOrId(name)
			collection.deleteRule =
				'@request.auth.id != "" && (@request.auth.role = "admin" || status = "draft")'
			app.save(collection)
		}
	},
	(app) => {
		for (const name of ["pages", "posts"]) {
			const collection = app.findCollectionByNameOrId(name)
			collection.deleteRule = '@request.auth.id != ""'
			app.save(collection)
		}
	}
)
