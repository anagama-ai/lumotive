migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId("pages")
		collection.fields.add(
			new RelationField({
				name: "parent",
				collectionId: collection.id,
				maxSelect: 1
			}),
			new TextField({ name: "path" }),
			new JSONField({ name: "ogImage" }),
			new TextField({ name: "canonical" }),
			new BoolField({ name: "noindex" })
		)
		collection.indexes = [
			...collection.indexes.filter(
				(index) => index !== "CREATE UNIQUE INDEX idx_pages_slug ON pages (slug)"
			),
			"CREATE UNIQUE INDEX idx_pages_parent_slug ON pages (parent, slug)",
			"CREATE UNIQUE INDEX idx_pages_path ON pages (path) WHERE path != ''"
		]
		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId("pages")
		for (const name of ["parent", "path", "ogImage", "canonical", "noindex"]) {
			collection.fields.removeByName(name)
		}
		collection.indexes = [
			...collection.indexes.filter(
				(index) =>
					index !== "CREATE UNIQUE INDEX idx_pages_parent_slug ON pages (parent, slug)" &&
					index !== "CREATE UNIQUE INDEX idx_pages_path ON pages (path) WHERE path != ''"
			),
			"CREATE UNIQUE INDEX idx_pages_slug ON pages (slug)"
		]
		app.save(collection)
	}
)
