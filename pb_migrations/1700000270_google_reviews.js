migrate(
	(app) => {
		app.save(
			new Collection({
				type: "base",
				name: "reviews",
				listRule: "",
				viewRule: "",
				createRule: null,
				updateRule: null,
				deleteRule: null,
				fields: [
					{ type: "text", name: "reviewId", required: true },
					{ type: "text", name: "reviewerName" },
					{ type: "number", name: "rating" },
					{ type: "text", name: "reviewText" },
					{ type: "date", name: "publishedAt" },
					{ type: "text", name: "timeAgo" },
					{ type: "text", name: "reviewerProfileUrl" },
					{ type: "text", name: "reviewerImageUrl" },
					{ type: "number", name: "reviewerReviewCount" },
					{ type: "number", name: "reviewerPhotoCount" },
					{ type: "bool", name: "reviewerIsLocalGuide" },
					{ type: "text", name: "ratingType" },
					{ type: "number", name: "ratingMax" },
					{ type: "number", name: "votesCount" },
					{ type: "text", name: "ownerAnswer" },
					{ type: "text", name: "ownerTimeAgo" },
					{ type: "date", name: "ownerPublishedAt" },
					{ type: "text", name: "reviewUrl" },
					{ type: "text", name: "originalReviewText" },
					{ type: "text", name: "originalLanguage" },
					{ type: "date", name: "importedAt" },
					{ type: "text", name: "importTaskId" }
				],
				indexes: [
					"CREATE UNIQUE INDEX idx_reviews_review_id ON reviews (reviewId)",
					"CREATE INDEX idx_reviews_rating_published ON reviews (rating, publishedAt DESC)"
				]
			})
		)

		const reviewConfig = new Collection({
			type: "base",
			name: "review_config",
			listRule: '@request.auth.id != ""',
			viewRule: '@request.auth.id != ""',
			createRule: '@request.auth.id != ""',
			updateRule: '@request.auth.id != ""',
			deleteRule: '@request.auth.id != ""',
			fields: [
				{
					type: "select",
					name: "lookupType",
					maxSelect: 1,
					values: ["place_id", "cid", "keyword"]
				},
				{ type: "text", name: "placeId" },
				{ type: "text", name: "cid" },
				{ type: "text", name: "keyword" },
				{ type: "text", name: "locationCoordinate" },
				{
					type: "select",
					name: "frequency",
					maxSelect: 1,
					values: ["manual", "7d", "14d", "30d"]
				}
			]
		})
		app.save(reviewConfig)

		const config = new Record(reviewConfig)
		config.set("lookupType", "place_id")
		config.set("frequency", "manual")
		app.save(config)

		app.save(
			new Collection({
				type: "base",
				name: "review_jobs",
				listRule: '@request.auth.id != ""',
				viewRule: '@request.auth.id != ""',
				createRule: '@request.auth.id != ""',
				updateRule: '@request.auth.id != ""',
				deleteRule: '@request.auth.id != ""',
				fields: [
					{
						type: "select",
						name: "state",
						maxSelect: 1,
						values: ["submitting", "pending", "succeeded", "failed"]
					},
					{
						type: "select",
						name: "mode",
						maxSelect: 1,
						values: ["incremental", "full"]
					},
					{ type: "text", name: "taskId" },
					{ type: "text", name: "activeKey" },
					{ type: "date", name: "startedAt" },
					{ type: "date", name: "finishedAt" },
					{ type: "number", name: "requestedDepth" },
					{ type: "number", name: "created_count" },
					{ type: "number", name: "updated_count" },
					{ type: "text", name: "reason" }
				],
				indexes: [
					"CREATE UNIQUE INDEX idx_review_jobs_active ON review_jobs (activeKey) WHERE activeKey != ''"
				]
			})
		)
	},
	(app) => {
		app.delete(app.findCollectionByNameOrId("review_jobs"))
		app.delete(app.findCollectionByNameOrId("review_config"))
		app.delete(app.findCollectionByNameOrId("reviews"))
	}
)
