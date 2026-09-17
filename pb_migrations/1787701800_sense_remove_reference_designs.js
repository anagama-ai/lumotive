// Webvizio #71: on /sense the "From platform to sensing system" timeline
// (id "28be79eb") loses the Reference Designs block — the group row and the one
// item nested under it ("M30 Lidar Module Reference Design"), which would
// otherwise be orphaned. The Development and Evaluation Kits group and its
// three items, every other timeline row, and the rest of the page are left
// exactly as they are; no component, CSS or media is touched, so styling,
// spacing and responsive behaviour are unchanged and the remaining group
// reflows naturally.
//
// Rows are matched on level + title, not position.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '28be79eb'

const GROUP_ROW = {
	body: '<p>Start with proven system architecture to accelerate your development.</p>',
	level: 'group',
	media: { kind: 'url', value: '/lumotive/img/icon-reference-designs.png' },
	title: 'Reference Designs'
}

const ITEM_ROW = {
	body: '<p>Technical documentation and design guidance for developing a compact lidar module based on the LM10.</p><ul><li>System architecture</li><li>Recommended component configuration</li><li>Schematics and design guidance</li><li>Integration considerations</li></ul><p><em>Provided as a documentation package, not a physical development board.</em></p>',
	level: 'item',
	media: { kind: 'url', value: '/lumotive/img/reference-design-docs.png' },
	title: 'M30 Lidar Module Reference Design'
}

const REMOVED = [
	{ index: 12, row: GROUP_ROW },
	{ index: 13, row: ITEM_ROW }
]

const matches = (row, target) =>
	Boolean(row) && row.level === target.level && row.title === target.title

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

const findSensePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' })
	} catch {
		return null
	}
}

const findTimeline = (sections) => {
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'timeline' || !Array.isArray(section.rows)) return null
	return section
}

migrate(
	(app) => {
		const record = findSensePage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findTimeline(sections)
		if (!section) return

		const next = section.rows.filter((row) => !REMOVED.some((entry) => matches(row, entry.row)))
		if (next.length === section.rows.length) return

		section.rows = next
		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findSensePage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findTimeline(sections)
		if (!section) return

		for (const entry of REMOVED) {
			if (section.rows.some((row) => matches(row, entry.row))) continue
			section.rows.splice(Math.min(entry.index, section.rows.length), 0, entry.row)
		}

		record.set('sections', sections)
		app.save(record)
	}
)
