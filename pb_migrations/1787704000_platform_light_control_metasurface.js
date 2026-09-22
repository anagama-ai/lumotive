// The platform's first peel-swap card names the technology as "Metasurface
// light control", but the intended heading is "Light Control Metasurface".
// The component applies titleCase() when rendering, so the corrected stored
// title keeps the requested sentence-case spelling.
//
// Only that card's title changes. Every other card and section field remains
// untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'ace8d391'

const OLD_TITLE = 'Metasurface light control'
const NEW_TITLE = 'Light Control Metasurface'

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const findPlatformPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return null
	}
}

const applyTitle = (app, expectedTitle, title) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsPeelSwap' || !Array.isArray(section.cards)) return

	const card = section.cards.find((entry) => entry && entry.title === expectedTitle)
	if (!card) return

	card.title = title

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyTitle(app, OLD_TITLE, NEW_TITLE)
	},
	(app) => {
		applyTitle(app, NEW_TITLE, OLD_TITLE)
	}
)
