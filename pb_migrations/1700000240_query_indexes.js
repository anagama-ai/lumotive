migrate(
	(app) => {
		const versions = app.findCollectionByNameOrId("content_versions")
		const invalid = app.findRecordsByFilter(
			versions,
			'collection != "pages" && collection != "posts"',
			"",
			1,
			0
		)[0]
		if (invalid) {
			throw new Error(
				`content_versions ${invalid.id} has unsupported collection ${JSON.stringify(invalid.getString("collection"))}`
			)
		}

		const temporaryName = "collection_select_tmp"
		versions.fields.add(
			new SelectField({
				name: temporaryName,
				values: ["pages", "posts"],
				maxSelect: 1,
				required: true
			})
		)
		app.save(versions)

		for (const record of app.findAllRecords(versions)) {
			record.set(temporaryName, record.getString("collection"))
			app.save(record)
		}

		versions.fields.removeByName("collection")
		versions.fields.getByName(temporaryName).setName("collection")
		app.save(versions)

		const posts = app.findCollectionByNameOrId("posts")
		posts.indexes = [
			...posts.indexes,
			"CREATE INDEX idx_posts_published_feed ON posts (publishedAt DESC, created DESC) WHERE status = 'published'"
		]
		app.save(posts)

		const pages = app.findCollectionByNameOrId("pages")
		pages.indexes = [
			...pages.indexes,
			"CREATE INDEX idx_pages_sitemap ON pages (path) WHERE status = 'published' AND noindex = FALSE"
		]
		app.save(pages)

		const submissions = app.findCollectionByNameOrId("form_submissions")
		submissions.indexes = [
			...submissions.indexes,
			"CREATE INDEX idx_form_submissions_form_created ON form_submissions (form, created DESC)"
		]
		app.save(submissions)
	},
	(app) => {
		const versions = app.findCollectionByNameOrId("content_versions")
		const temporaryName = "collection_text_tmp"
		versions.fields.add(new TextField({ name: temporaryName }))
		app.save(versions)

		for (const record of app.findAllRecords(versions)) {
			record.set(temporaryName, record.getString("collection"))
			app.save(record)
		}

		versions.fields.removeByName("collection")
		versions.fields.getByName(temporaryName).setName("collection")
		app.save(versions)

		const posts = app.findCollectionByNameOrId("posts")
		posts.indexes = posts.indexes.filter(
			(index) =>
				index !==
				"CREATE INDEX idx_posts_published_feed ON posts (publishedAt DESC, created DESC) WHERE status = 'published'"
		)
		app.save(posts)

		const pages = app.findCollectionByNameOrId("pages")
		pages.indexes = pages.indexes.filter(
			(index) =>
				index !==
				"CREATE INDEX idx_pages_sitemap ON pages (path) WHERE status = 'published' AND noindex = FALSE"
		)
		app.save(pages)

		const submissions = app.findCollectionByNameOrId("form_submissions")
		submissions.indexes = submissions.indexes.filter(
			(index) =>
				index !==
				"CREATE INDEX idx_form_submissions_form_created ON form_submissions (form, created DESC)"
		)
		app.save(submissions)
	}
)
