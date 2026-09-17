// Webvizio #79: the "One platform, many possible systems" section on /dev-kits
// (cardsDesignSpace, id "b38e0a8c") is cut, together with its intro copy and
// the four-tile design-space diagram. Only that section goes; the hero, the
// product cards and their links, the customer-products section from #80 and the
// Contact Us CTA stay. The shared cardsDesignSpace block type and every media
// asset remain available. Nothing links to its "design-space" anchor.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'b38e0a8c'
const SECTION_INDEX = 1

const DESIGN_SPACE_SECTION = {
	anchor: 'design-space',
	background: 'none',
	cards: [
		{ accent: 'accent1', eyebrow: 'Component-level evaluation', title: 'LCM Evaluation Kit' },
		{ accent: 'accent2', eyebrow: 'Transmit subsystem', title: 'TX10 Development Kit' },
		{ accent: 'accent3', eyebrow: 'Compact lidar module', title: 'M30 Development Kit' },
		{ accent: 'accent1', eyebrow: 'Complete lidar system', title: 'NM120 Development Kit' }
	],
	designVersion: 'designSpace',
	heading: 'One platform, many possible systems',
	id: SECTION_ID,
	intro: 'LM10 supports a broad range of lidar architectures across field of view, range, beam profile, laser source, receiver type and form factor. Lumotive development kits are ready-to-evaluate configurations within that broader design space, not the limits of the platform. Start with the level that fits your development needs, then adapt the system around your application and performance requirements.',
	spacingBottom: 'md',
	spacingTop: 'md',
	type: 'cardsDesignSpace',
	width: 'contained'
}

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

const findDevKitsPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findDevKitsPage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((section) => !section || section.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findDevKitsPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((section) => section && section.id === SECTION_ID)) return

		const index = Math.min(SECTION_INDEX, sections.length)
		sections.splice(index, 0, DESIGN_SPACE_SECTION)
		record.set('sections', sections)
		app.save(record)
	}
)
