/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		// Site-wide code injection executes in every visitor's browser. Other globals
		// remain editor-writable because they are rendered as text or structured data.
		const globals = app.findCollectionByNameOrId('globals')
		const codeInjectionIsAdminOnly =
			'(key != "code_injection" && @request.auth.id != "") || @request.auth.role = "admin"'
		globals.createRule = codeInjectionIsAdminOnly
		globals.updateRule = codeInjectionIsAdminOnly
		globals.deleteRule = codeInjectionIsAdminOnly
		app.save(globals)

		// Keep known-file delivery public, but require authentication to browse the
		// complete upload library.
		const media = app.findCollectionByNameOrId('media')
		media.listRule = '@request.auth.id != ""'
		app.save(media)
	},
	(app) => {
		const globals = app.findCollectionByNameOrId('globals')
		globals.createRule = '@request.auth.id != ""'
		globals.updateRule = '@request.auth.id != ""'
		globals.deleteRule = '@request.auth.id != ""'
		app.save(globals)

		const media = app.findCollectionByNameOrId('media')
		media.listRule = ''
		app.save(media)
	}
)
