// Platform page (/platform), "Where Software-Defined Light Goes to Work"
// section (cardsMediaCards, id "d38e36da"): opt into the compact card
// density.
//
// With one-line descriptions, the default rhythm read as broken: the global
// h3 bottom margin (24px) and the rich-text paragraph's own top margin (16px)
// stack on the body wrapper's `mt-4`, leaving 56px between a heading and its
// single line, and the shared action sat 48px below the grid.
//
// `density: "compact"` zeroes those two inherited margins and drops the
// action gap to 36px, giving 16px heading-to-description and 36px
// grid-to-button. Copy, type, colour, images, the two-column grid and the
// button styling are untouched, and the other cardsMediaCards sections on
// /dev-kits and /applications do not set the flag, so they are unaffected.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'd38e36da'

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

const apply = (app, density) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsMediaCards') return

	if (density) section.density = density
	else delete section.density

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, 'compact')
	},
	(app) => {
		apply(app, null)
	}
)
