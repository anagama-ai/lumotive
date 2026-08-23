migrate(
	(app) => {
		for (const name of ["media", "forms"]) {
			const collection = app.findCollectionByNameOrId(name)
			collection.fields.add(
				new AutodateField({ name: "created", onCreate: true, onUpdate: false }),
				new AutodateField({ name: "updated", onCreate: true, onUpdate: true })
			)
			app.save(collection)
		}
	},
	(app) => {
		for (const name of ["media", "forms"]) {
			const collection = app.findCollectionByNameOrId(name)
			collection.fields.removeByName("created")
			collection.fields.removeByName("updated")
			app.save(collection)
		}
	}
)
