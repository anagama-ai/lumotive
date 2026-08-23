migrate(
	(app) => {
		const forms = app.findCollectionByNameOrId("forms")
		const recipients = new Collection({
			type: "base",
			name: "form_recipients",
			listRule: '@request.auth.id != ""',
			viewRule: '@request.auth.id != ""',
			createRule: '@request.auth.id != ""',
			updateRule: '@request.auth.id != ""',
			deleteRule: '@request.auth.id != ""',
			fields: [
				{
					type: "relation",
					name: "form",
					collectionId: forms.id,
					maxSelect: 1,
					required: true,
					cascadeDelete: true
				},
				{ type: "text", name: "addresses" }
			],
			indexes: ["CREATE UNIQUE INDEX idx_form_recipients_form ON form_recipients (form)"]
		})
		app.save(recipients)

		for (const form of app.findRecordsByFilter("forms", 'recipients != ""', "", 0, 0)) {
			const record = new Record(recipients)
			record.set("form", form.id)
			record.set("addresses", form.getString("recipients"))
			app.save(record)
		}

		forms.fields.removeByName("recipients")
		app.save(forms)
	},
	(app) => {
		const forms = app.findCollectionByNameOrId("forms")
		forms.fields.add(new TextField({ name: "recipients" }))
		app.save(forms)

		const recipients = app.findCollectionByNameOrId("form_recipients")
		for (const record of app.findRecordsByFilter(recipients, "", "", 0, 0)) {
			const form = app.findRecordById(forms, record.getString("form"))
			form.set("recipients", record.getString("addresses"))
			app.save(form)
		}

		app.delete(recipients)
	}
)
