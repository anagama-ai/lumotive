// Sense › Dev Kits (/dev-kits), approved content package rev. 2026-10-07,
// page 12. Two refinements after visual review.
//
// 1. "FIND YOUR DEV KIT" NOW INTRODUCES ALL THREE FAMILIES. The three kit
//    sections each carried their family name in `eyebrow`, and the shared
//    heading sat on the first of them. Because a section's eyebrow prints
//    above its heading, the page read "TRANSMIT MODULES" and then "Find Your
//    Dev Kit", which made the heading look like it belonged to the transmit
//    family alone.
//
//    The family names move from `eyebrow` to the new `label` field, which
//    cardsMediaCards prints directly above its own grid rather than above the
//    section heading. The heading therefore comes first and introduces all
//    three families, and each family keeps its own label with its own cards.
//
// 2. SPACING BETWEEN THE BENEFITS AND THE KITS. "Why Start With a Lumotive
//    Kit" closed on "md" (5rem) and the transmit section opened on "md", so
//    160px separated them, more than the page needed between a short benefit
//    row and the block it introduces. The benefits section closes on "sm"
//    (2.5rem) instead, bringing the gap to 120px. The spacing scale steps
//    none / sm / md / lg, so 120px is the nearest value below the 128px that
//    an exact 20% reduction would give; it is a 25% reduction in practice.
//
// Nothing else changes: the approved copy, the card layouts and their four
// spec lines, every link and destination, the typography and the existing hero
// image are all untouched, and no other page is read or written.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'dev-kits'

const WHY_ID = '5b7e01d4'

// Each kit family section, with the label it should print above its own grid.
const FAMILIES = [
	{ id: '2c84f7a1', label: 'Transmit modules' },
	{ id: '8d3b05e6', label: 'iToF dev kits' },
	{ id: 'a90f62b3', label: 'dToF dev kits' }
]

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

const findPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path: PAGE_PATH })
	} catch {
		return null
	}
}

const apply = (app, { useLabel, whySpacingBottom }) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)

	for (const family of FAMILIES) {
		const section = sections.find((entry) => entry && entry.id === family.id)
		if (!section || section.type !== 'cardsMediaCards') return

		if (useLabel) {
			section.label = family.label
			delete section.eyebrow
		} else {
			section.eyebrow = family.label
			delete section.label
		}
	}

	const why = sections.find((entry) => entry && entry.id === WHY_ID)
	if (!why) return
	why.spacingBottom = whySpacingBottom

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, { useLabel: true, whySpacingBottom: 'sm' })
	},
	(app) => {
		apply(app, { useLabel: false, whySpacingBottom: 'md' })
	}
)
