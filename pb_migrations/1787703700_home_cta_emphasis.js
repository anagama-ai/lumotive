// Homepage CTA refinement: the closing "Build with programmable optics."
// section on / (ctaSplitLinks, id "c5839355") gets more room and a slightly
// larger heading.
//
// Vertical padding moves from "lg" (7rem) to "xl" (9rem) — a new step on the
// shared spacing scale, opt-in per section, so no other section shifts. The
// heading moves from the split layout's default --text-heading to
// --text-statement through the new headingSize field; both are existing type
// tokens and the jump is one step.
//
// Copy, both links, the two-column layout, the panel background image and its
// gradient, colours, alignment and full width are untouched, as are the CTA
// sections on /contact and /culture, which leave both fields unset and keep
// lg spacing with the heading scale.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'c5839355'

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

const apply = (app, spacing, headingSize) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'ctaSplitLinks') return

	section.spacingTop = spacing
	section.spacingBottom = spacing
	if (headingSize) section.headingSize = headingSize
	else delete section.headingSize

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, 'xl', 'statement')
	},
	(app) => {
		apply(app, 'lg', null)
	}
)
