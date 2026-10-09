// /m30 "M30 Key Features" (splitDefault, id "7b3e4c18") switches from the
// white-background JPEG to a transparent PNG cutout of the same photo
// (background removed with Higgsfield image_background_remover).
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '7b3e4c18'
const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/m30-dev-golf-ball.jpg' }
const NEW_MEDIA = { kind: 'url', value: '/lumotive/img/m30-dev-golf-ball.png' }

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

const applyMedia = (app, expected, media) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'm30' })
	} catch {
		return
	}
	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || !section.media || section.media.value !== expected.value) return

	section.media = { kind: media.kind, value: media.value }
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => applyMedia(app, OLD_MEDIA, NEW_MEDIA),
	(app) => applyMedia(app, NEW_MEDIA, OLD_MEDIA)
)
