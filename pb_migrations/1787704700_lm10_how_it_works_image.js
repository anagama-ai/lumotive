// The "How it works" dark panel on /lm10 showed /lumotive/img/tx10-module-closeup.jpg,
// a TX10 module render, next to copy about the metasurface itself. The client
// supplied a shot of the bare LCM die on its flex cable, which is what the copy
// describes. The new file carries transparency, so it sits on the dark panel
// without a white box.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '15569607'

const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/tx10-module-closeup.jpg' }
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

const findLm10Page = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'lm10' })
	} catch {
		return null
	}
}

const applyMedia = (app, expected, media) => {
	const record = findLm10Page(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'splitDarkPanel') return
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
