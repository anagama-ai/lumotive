migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId("posts")
		collection.fields.add(
			new TextField({ name: "seoTitle" }),
			new TextField({ name: "seoDescription" })
		)
		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId("posts")
		collection.fields.removeByName("seoTitle")
		collection.fields.removeByName("seoDescription")
		app.save(collection)
	}
)
