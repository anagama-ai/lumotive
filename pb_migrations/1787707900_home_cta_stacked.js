// Home page closing CTA (ctaSplitLinks, id "c5839355"), approved content
// package rev. 2026-10-07, page 05 of 21.
//
// The reference shows one left-aligned column — heading, paragraph, then the
// actions beneath — with a prominent "Talk to our team" button followed by
// "Browse dev kits →". The stored section becomes `mode: "stacked"`, which
// CtaDefault renders as that single column; the two-column CTAs on /contact
// and /culture leave `mode` unset and are unchanged.
//
// Vertical space drops from the "xl" step (9rem) to "lg" (7rem) for the more
// compact block the reference shows. Copy, both link labels and both
// destinations are untouched: they already match the approved page.
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

const apply = (app, mode, spacing) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'ctaSplitLinks') return

	if (mode) section.mode = mode
	else delete section.mode
	section.spacingTop = spacing
	section.spacingBottom = spacing

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, 'stacked', 'lg')
	},
	(app) => {
		apply(app, null, 'xl')
	}
)
