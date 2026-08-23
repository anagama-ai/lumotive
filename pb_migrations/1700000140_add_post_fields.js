migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId("posts")
		collection.fields.removeByName("cover")
		collection.fields.add(
			new JSONField({ name: "coverImage" }),
			new JSONField({ name: "ogImage" }),
			new TextField({ name: "canonical" }),
			new BoolField({ name: "noindex" })
		)
		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId("posts")
		for (const name of ["coverImage", "ogImage", "canonical", "noindex"]) {
			collection.fields.removeByName(name)
		}
		collection.fields.add(new FileField({ name: "cover", maxSelect: 1 }))
		app.save(collection)
	}
)
