// The approved content package, page 02 ("Other Behaviors"), asks for a
// Featured checkbox on the News CMS: the home page shows the three most recent
// published posts marked Featured, and fills with the latest press releases
// when fewer than three are marked.
//
// This adds that field. It is a plain boolean, so existing posts read as not
// featured and nothing changes until an editor ticks the box.
const COLLECTION = 'posts'
const FIELD = 'featured'

migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId(COLLECTION)
		if (collection.fields.find((field) => field.name === FIELD)) return

		collection.fields.add(
			new Field({
				name: FIELD,
				type: 'bool',
				required: false,
				presentable: false
			})
		)
		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId(COLLECTION)
		const field = collection.fields.find((entry) => entry.name === FIELD)
		if (!field) return

		collection.fields.removeById(field.id)
		app.save(collection)
	}
)
