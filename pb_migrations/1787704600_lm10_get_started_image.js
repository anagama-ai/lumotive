// The "Get started with LM10" panel reused /lumotive/img/tx10-module.png, the
// same TX10 render shown elsewhere. The client supplied a shot of the LM10
// module with its metasurface and flex cable, which matches the evaluation and
// system-development story this panel tells.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '6fe4abe3'

const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/tx10-module.png' }
const NEW_MEDIA = { kind: 'url', value: '/lumotive/img/lm10-evaluate-kit.webp' }

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
