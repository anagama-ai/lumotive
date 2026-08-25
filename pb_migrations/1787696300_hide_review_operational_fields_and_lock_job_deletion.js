/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		// Public review responses need display content, not import-internal metadata.
		// importedAt stays visible because the editor-triggered importer reads it for
		// deduplication through a non-superuser client.
		const reviews = app.findCollectionByNameOrId('reviews')
		const hiddenFields = [
			'ownerAnswer',
			'ownerTimeAgo',
			'ownerPublishedAt',
			'originalReviewText',
			'originalLanguage',
			'importTaskId'
		]
		for (const name of hiddenFields) {
			reviews.fields.getByName(name).hidden = true
		}
		app.save(reviews)

		// Editors can run imports, but only administrators may destroy job history.
		const reviewJobs = app.findCollectionByNameOrId('review_jobs')
		reviewJobs.deleteRule = '@request.auth.role = "admin"'
		app.save(reviewJobs)
	},
	(app) => {
		const reviews = app.findCollectionByNameOrId('reviews')
		const hiddenFields = [
			'ownerAnswer',
			'ownerTimeAgo',
			'ownerPublishedAt',
			'originalReviewText',
			'originalLanguage',
			'importTaskId'
		]
		for (const name of hiddenFields) {
			reviews.fields.getByName(name).hidden = false
		}
		app.save(reviews)

		const reviewJobs = app.findCollectionByNameOrId('review_jobs')
		reviewJobs.deleteRule = '@request.auth.id != ""'
		app.save(reviewJobs)
	}
)
