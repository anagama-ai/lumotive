// Hero and CTA copy currently spans the viewport because these sections are
// stored at full width. Their visual backgrounds live on the outer section,
// so contain only the inner content without boxing the background treatment.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const TARGETS = [
	{ slug: 'home', id: '460c4c1f' },
	{ slug: 'home', id: 'c5839355' },
	{ slug: 'about', id: 'efd6f4b0' },
	{ slug: 'contact', id: '9ab67cf3' },
	{ slug: 'platform', id: 'a85debcc' },
	{ slug: 'platform', id: '1f667bfa' },
	{ slug: 'sense', id: 'd9bf96da' },
	{ slug: 'sense', id: '3327d913' },
	{ slug: 'lm10', id: '36a3598b' },
	{ slug: 'lm10', id: '8a2ba126' },
	{ slug: 'connect', id: 'ffa907ea' },
	{ slug: 'connect', id: '9bb14000' },
	{ slug: 'applications', id: 'acb2f280' },
	{ slug: 'applications', id: '9a19b24a' },
	{ slug: 'culture', id: '8c3ed872' },
	{ slug: 'partners', id: 'daf9e626' },
	{ slug: 'm30', id: '5a1c9f20' },
	{ slug: 'm30', id: '8f21c5be' },
	{ slug: 'tx10', id: 'b41d7c05' },
	{ slug: 'tx10', id: '4f2a61cb' },
	{ slug: 'nm120', id: 'a7c0d613' },
	{ slug: 'nm120', id: '9d5e3c80' }
]

const FULL_WIDTH = 'full'
const CONTAINED_WIDTH = 'contained'

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

const findPage = (app, slug) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
	} catch {
		return null
	}
}

const applyWidth = (app, expected, width) => {
	for (const target of TARGETS) {
		const record = findPage(app, target.slug)
		if (!record) continue

		const sections = readSections(record)
		const section = sections.find((entry) => entry && entry.id === target.id)
		if (!section || section.width !== expected) continue

		section.width = width
		record.set('sections', sections)
		app.save(record)
	}
}

migrate(
	(app) => {
		applyWidth(app, FULL_WIDTH, CONTAINED_WIDTH)
	},
	(app) => {
		applyWidth(app, CONTAINED_WIDTH, FULL_WIDTH)
	}
)
