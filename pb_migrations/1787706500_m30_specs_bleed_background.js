// /m30 specifications (id "1f5d84ab") get a full-bleed background image
// (the dev-kits bench photo already in static) behind the centered table.
// Width moves to "full" so the image reaches both edges.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '1f5d84ab'
const MEDIA = { kind: 'url', value: '/lumotive/img/hero-devkits.jpg' }

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

const update = (app, mutate) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'm30' })
	} catch {
		return
	}
	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section) return
	mutate(section)
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) =>
		update(app, (section) => {
			section.media = MEDIA
			section.width = 'full'
		}),
	(app) =>
		update(app, (section) => {
			if (section.media && section.media.value === MEDIA.value) delete section.media
			section.width = 'contained'
		})
)
