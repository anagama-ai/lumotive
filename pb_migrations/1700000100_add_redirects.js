migrate(
	(app) => {
		app.save(
			new Collection({
				type: "base",
				name: "redirects",
				listRule: "",
				viewRule: "",
				createRule: '@request.auth.role = "admin"',
				updateRule: '@request.auth.role = "admin"',
				deleteRule: '@request.auth.role = "admin"',
				fields: [
					{ type: "text", name: "from", required: true },
					{ type: "text", name: "to", required: true },
					{ type: "bool", name: "active" }
				],
				indexes: ['CREATE UNIQUE INDEX idx_redirects_from ON redirects ("from")']
			})
		)
	},
	(app) => {
		app.delete(app.findCollectionByNameOrId("redirects"))
	}
)
