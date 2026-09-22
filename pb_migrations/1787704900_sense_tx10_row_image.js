// The Sense development-paths timeline showed /lumotive/img/tx10-module.png for
// the TX10 row. The dev-kits card already moved to the supplied TX10 product
// shot; this row now matches it.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '28be79eb'
const ROW_TITLE = 'TX10 Development Kit'

const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/tx10-module.png' }
const NEW_MEDIA = { kind: 'url', value: '/lumotive/img/tx10-dev-kit.webp' }

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

const applyMedia = (app, expected, media) => {
	const record = findSensePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || !Array.isArray(section.rows)) return

	const row = section.rows.find((entry) => entry && entry.title === ROW_TITLE)
	if (!row || !row.media || row.media.value !== expected.value) return

	row.media = { kind: media.kind, value: media.value }

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyMedia(app, OLD_MEDIA, NEW_MEDIA)
	},
	(app) => {
		applyMedia(app, NEW_MEDIA, OLD_MEDIA)
	}
)
