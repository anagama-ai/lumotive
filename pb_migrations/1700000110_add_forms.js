migrate(
	(app) => {
		app.save(
			new Collection({
				type: "base",
				name: "forms",
				listRule: "",
				viewRule: "",
				createRule: '@request.auth.id != ""',
				updateRule: '@request.auth.id != ""',
				deleteRule: '@request.auth.id != ""',
				fields: [
					{ type: "text", name: "name", required: true },
					{ type: "json", name: "fields" },
					{ type: "text", name: "confirmation" },
					{ type: "text", name: "recipients" }
				]
			})
		)

		const forms = app.findCollectionByNameOrId("forms")
		app.save(
			new Collection({
				type: "base",
				name: "form_submissions",
				listRule: '@request.auth.id != ""',
				viewRule: '@request.auth.id != ""',
				createRule: "",
				updateRule: '@request.auth.role = "admin"',
				deleteRule: '@request.auth.role = "admin"',
				fields: [
					{
						type: "relation",
						name: "form",
						collectionId: forms.id,
						maxSelect: 1,
						required: true,
						cascadeDelete: true
					},
					{ type: "json", name: "values" },
					{ type: "autodate", name: "created", onCreate: true, onUpdate: false }
				]
			})
		)
	},
	(app) => {
		app.delete(app.findCollectionByNameOrId("form_submissions"))
		app.delete(app.findCollectionByNameOrId("forms"))
	}
)
