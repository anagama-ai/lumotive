// Every split hero becomes the full-bleed band hero /sense uses, with the
// stronger phone shade that keeps white copy legible over bright photos.
// /platform was already a band-styled split with its own shade.
const ALREADY_SHADED = ['a85debcc']

const eachSection = (app, type, edit) => {
	for (const page of app.findAllRecords('pages')) {
		const sections = JSON.parse(page.getString('sections') || '[]')
		const matches = sections.filter((s) => s.type === type)
		if (!matches.length) continue
		matches.forEach(edit)
		page.set('sections', sections)
		app.save(page)
	}
}

migrate(
	(app) =>
		eachSection(app, 'heroSplit', (s) => {
			s.type = 'heroBand'
			s.designVersion = 'band'
			s.mobileShade ||= 'strong'
		}),
	(app) =>
		eachSection(app, 'heroBand', (s) => {
			if (s.id === 'd9bf96da') return // /sense was always a band hero
			s.type = 'heroSplit'
			if (ALREADY_SHADED.includes(s.id)) return
			s.designVersion = 'split'
			delete s.mobileShade
		})
)
