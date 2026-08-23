migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId("media")
		const field = collection.fields.getByName("file")
		field.thumbs = ["400x300", "768x0", "1024x0", "1600x0"]
		field.maxSize = 10485760
		field.mimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId("media")
		const field = collection.fields.getByName("file")
		field.thumbs = []
		field.maxSize = 0
		field.mimeTypes = []
		app.save(collection)
	}
)
