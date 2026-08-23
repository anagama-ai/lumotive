migrate(
	(app) => {
		const editors = app.findCollectionByNameOrId("editors")
		app.save(
			new Collection({
				type: "base",
				name: "content_versions",
				listRule: '@request.auth.id != ""',
				viewRule: '@request.auth.id != ""',
				createRule: null,
				updateRule: null,
				deleteRule: null,
				fields: [
					{ type: "text", name: "collection" },
					{ type: "text", name: "record" },
					{ type: "json", name: "snapshot" },
					{
						type: "relation",
						name: "editor",
						collectionId: editors.id,
						maxSelect: 1
					},
					{ type: "autodate", name: "created", onCreate: true, onUpdate: false }
				],
				indexes: [
					'CREATE INDEX idx_content_versions_record ON content_versions ("collection", "record")'
				]
			})
		)
	},
	(app) => {
		app.delete(app.findCollectionByNameOrId("content_versions"))
	}
)
