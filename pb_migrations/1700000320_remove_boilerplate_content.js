migrate((app) => {
	const removeBySlug = (collection, slug) => {
		for (const record of app.findRecordsByFilter(collection, "slug = {:slug}", "", 1, 0, { slug })) {
			app.delete(record)
		}
	}

	removeBySlug("pages", "draft-example")
	removeBySlug("posts", "designing-for-decisions")
	removeBySlug("posts", "a-brand-system-your-team-can-use")
}, () => {
	// Forward-only content migration.
})
