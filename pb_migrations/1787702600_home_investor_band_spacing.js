// Vibe spacing note: the investor logo strip on / sat directly against the
// applications bento above it — the section carried spacingTop "none", so its
// .lumo-inner had zero top padding and the marquee started 0px below the card
// grid. It now uses "md", the scale's default step (5rem, the same value every
// other section on the page uses), which is the only field this migration
// touches.
//
// The section is the home page's logosSceneBand (id "7fa60e69", heading "Backed
// by Gates Frontier, Amazon and Samsung Ventures"). Its nine logos, heading,
// marquee animation, full width, background and spacingBottom "none" are
// untouched, as is every other section. The padding comes from the shared
// .lumo-inner rule, so it scales with the existing responsive behaviour rather
// than adding a breakpoint.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '7fa60e69'

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

const findHomePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
	} catch {
		return null
	}
}

const applySpacingTop = (app, value) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'logosSceneBand') return

	section.spacingTop = value

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applySpacingTop(app, 'md')
	},
	(app) => {
		applySpacingTop(app, 'none')
	}
)
