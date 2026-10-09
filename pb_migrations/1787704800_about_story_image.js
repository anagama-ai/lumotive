// The About story split showed /lumotive/img/about-story-bleed.png, an abstract
// render. The client asked for the LCM die on its flex cable, the same file the
// LM10 "How it works" panel now uses.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '4e30aac9'

const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/about-story-bleed.png' }
const NEW_MEDIA = { kind: 'url', value: '/lumotive/img/lm10-metasurface-module.webp' }

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

const findAboutPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'about' })
	} catch {
		return null
	}
}

const applyMedia = (app, expected, media) => {
	const record = findAboutPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'splitDefault') return
	if (!section.media || section.media.value !== expected.value) return

	section.media = { kind: media.kind, value: media.value }

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
