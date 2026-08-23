migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId("media")
		collection.fields.add(
			new NumberField({ name: "width", required: false, onlyInt: true }),
			new NumberField({ name: "height", required: false, onlyInt: true })
		)
		const field = collection.fields.getByName("file")
		field.thumbs = []
		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId("media")
		collection.fields.removeByName("width")
		collection.fields.removeByName("height")
		const field = collection.fields.getByName("file")
		field.thumbs = ["400x300", "768x0", "1024x0", "1600x0"]
		app.save(collection)
	}
)
