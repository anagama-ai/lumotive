migrate(
	(app) => {
		app.save(
			new Collection({
				type: "base",
				name: "pages",
				listRule: 'status = "published" || @request.auth.id != ""',
				viewRule: 'status = "published" || @request.auth.id != ""',
				createRule: '@request.auth.id != ""',
				updateRule: '@request.auth.id != ""',
				deleteRule: '@request.auth.id != ""',
				fields: [
					{ type: "text", name: "title", required: true },
					{ type: "text", name: "slug", required: true },
					{ type: "select", name: "status", maxSelect: 1, values: ["draft", "published"] },
					{ type: "json", name: "sections" },
					{ type: "text", name: "seoTitle" },
					{ type: "text", name: "seoDescription" },
					{ type: "autodate", name: "created", onCreate: true, onUpdate: false },
					{ type: "autodate", name: "updated", onCreate: true, onUpdate: true }
				],
				indexes: ["CREATE UNIQUE INDEX idx_pages_slug ON pages (slug)"]
			})
		)

		app.save(
			new Collection({
				type: "base",
				name: "posts",
				listRule: 'status = "published" || @request.auth.id != ""',
				viewRule: 'status = "published" || @request.auth.id != ""',
				createRule: '@request.auth.id != ""',
				updateRule: '@request.auth.id != ""',
				deleteRule: '@request.auth.id != ""',
				fields: [
					{ type: "text", name: "title", required: true },
					{ type: "text", name: "slug", required: true },
					{ type: "select", name: "status", maxSelect: 1, values: ["draft", "published"] },
					{ type: "text", name: "excerpt" },
					{ type: "editor", name: "body" },
					{ type: "file", name: "cover", maxSelect: 1 },
					{ type: "date", name: "publishedAt" },
					{ type: "autodate", name: "created", onCreate: true, onUpdate: false },
					{ type: "autodate", name: "updated", onCreate: true, onUpdate: true }
				],
				indexes: ["CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)"]
			})
		)

		app.save(
			new Collection({
				type: "base",
				name: "globals",
				listRule: "",
				viewRule: "",
				createRule: '@request.auth.id != ""',
				updateRule: '@request.auth.id != ""',
				deleteRule: '@request.auth.id != ""',
				fields: [
					{ type: "text", name: "key", required: true },
					{ type: "json", name: "data" }
				],
				indexes: ["CREATE UNIQUE INDEX idx_globals_key ON globals (key)"]
			})
		)

		app.save(
			new Collection({
				type: "base",
				name: "media",
				listRule: "",
				viewRule: "",
				createRule: '@request.auth.id != ""',
				updateRule: '@request.auth.id != ""',
				deleteRule: '@request.auth.id != ""',
				fields: [
					{ type: "file", name: "file", maxSelect: 1, required: true },
					{ type: "text", name: "alt" }
				]
			})
		)

		app.save(
			new Collection({
				type: "auth",
				name: "editors",
				listRule: '@request.auth.role = "admin"',
				viewRule: 'id = @request.auth.id || @request.auth.role = "admin"',
				createRule: '@request.auth.role = "admin"',
				updateRule: 'id = @request.auth.id || @request.auth.role = "admin"',
				deleteRule: '@request.auth.role = "admin"',
				fields: [
					{ type: "text", name: "name" },
					{ type: "select", name: "role", maxSelect: 1, values: ["admin", "editor"] }
				],
				passwordAuth: { enabled: true, identityFields: ["email"] }
			})
		)
	},
	(app) => {
		for (const name of ["pages", "posts", "globals", "media", "editors"]) {
			app.delete(app.findCollectionByNameOrId(name))
		}
	}
)
