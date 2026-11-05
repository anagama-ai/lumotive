// Copy the /partners "Module and solution providers" logos below /sense
// "Start building" and the /dev-kits dToF row, and set every /dev-kits kit
// row to three columns now that kit cards stack their image above the copy.
const SOURCE = { slug: 'partners', id: 'c5fe1eab' }
const COPIES = [
	{ slug: 'sense', after: 'c83f1b77', id: 'c5fe1eac' },
	{ slug: 'dev-kits', after: 'a90f62b3', id: 'c5fe1ead' }
]
const KIT_ROWS = ['8d3b05e6', 'a90f62b3']

const editPage = (app, slug, edit) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
	const sections = JSON.parse(page.getString('sections') || '[]')
	page.set('sections', edit(sections) ?? sections)
	app.save(page)
}

migrate(
	(app) => {
		const partners = JSON.parse(app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: SOURCE.slug }).getString('sections') || '[]')
		const source = partners.find((s) => s.id === SOURCE.id)
		if (!source) throw new Error('Partners providers section not found')
		for (const { slug, after, id } of COPIES) {
			editPage(app, slug, (sections) => {
				if (sections.some((s) => s.id === id)) return
				const index = sections.findIndex((s) => s.id === after)
				sections.splice(index < 0 ? sections.length : index + 1, 0, { ...JSON.parse(JSON.stringify(source)), id })
			})
		}
		editPage(app, 'dev-kits', (sections) => {
			for (const s of sections) if (KIT_ROWS.includes(s.id)) s.columns = '3'
		})
	},
	(app) => {
		for (const { slug, id } of COPIES) editPage(app, slug, (sections) => sections.filter((s) => s.id !== id))
		editPage(app, 'dev-kits', (sections) => {
			for (const s of sections) if (KIT_ROWS.includes(s.id)) delete s.columns
		})
	}
)
