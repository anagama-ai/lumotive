migrate(
	(app) => {
		for (const name of ["pages", "posts"]) {
			const collection = app.findCollectionByNameOrId(name)
			collection.createRule =
				'@request.auth.id != "" && (@request.auth.role = "admin" || @request.body.status:isset = false || @request.body.status = "draft")'
			collection.updateRule =
				'@request.auth.id != "" && (@request.auth.role = "admin" || (status = "draft" && (@request.body.status:isset = false || @request.body.status = "draft")))'
			app.save(collection)
		}

		const editors = app.findCollectionByNameOrId("editors")
		editors.listRule = '@request.auth.role = "admin"'
		editors.createRule = '@request.auth.role = "admin"'
		editors.updateRule =
			'@request.auth.role = "admin" || (id = @request.auth.id && @request.body.role:isset = false)'
		editors.deleteRule = '@request.auth.role = "admin"'
		app.save(editors)

		const redirects = app.findCollectionByNameOrId("redirects")
		redirects.listRule = ""
		redirects.viewRule = ""
		redirects.createRule = '@request.auth.role = "admin"'
		redirects.updateRule = '@request.auth.role = "admin"'
		redirects.deleteRule = '@request.auth.role = "admin"'
		app.save(redirects)
	},
	(app) => {
		for (const name of ["pages", "posts"]) {
			const collection = app.findCollectionByNameOrId(name)
			collection.createRule = '@request.auth.id != ""'
			collection.updateRule = '@request.auth.id != ""'
			app.save(collection)
		}

		const editors = app.findCollectionByNameOrId("editors")
		editors.listRule = '@request.auth.role = "admin"'
		editors.viewRule = 'id = @request.auth.id || @request.auth.role = "admin"'
		editors.createRule = '@request.auth.role = "admin"'
		editors.updateRule = 'id = @request.auth.id || @request.auth.role = "admin"'
		editors.deleteRule = '@request.auth.role = "admin"'
		app.save(editors)

		const redirects = app.findCollectionByNameOrId("redirects")
		redirects.listRule = ""
		redirects.viewRule = ""
		redirects.createRule = '@request.auth.role = "admin"'
		redirects.updateRule = '@request.auth.role = "admin"'
		redirects.deleteRule = '@request.auth.role = "admin"'
		app.save(redirects)
	}
)
