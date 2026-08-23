migrate(
	(app) => {
		app.save(
			new Collection({
				type: "base",
				name: "promotion_state",
				listRule: '@request.auth.id != ""',
				viewRule: '@request.auth.id != ""',
				createRule: '@request.auth.id != ""',
				updateRule: '@request.auth.id != ""',
				deleteRule: '@request.auth.id != ""',
				fields: [
					{ type: "text", name: "key", required: true },
					{ type: "json", name: "data" }
				],
				indexes: ["CREATE UNIQUE INDEX idx_promotion_state_key ON promotion_state (key)"]
			})
		)
	},
	(app) => {
		app.delete(app.findCollectionByNameOrId("promotion_state"))
	}
)
