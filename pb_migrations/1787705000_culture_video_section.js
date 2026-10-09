// The live /culture page places Lumotive's YouTube culture video directly
// beneath its opening copy. Add the same bare video before the closing CTA;
// MediaVideoEmbed suppresses its heading block when heading and intro are empty.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const CTA_ID = '8c3ed872'
const SECTION_ID = 'c1d7e2a4'

const SECTION = {
	id: SECTION_ID,
	type: 'mediaVideoEmbed',
	heading: '',
	intro: '',
	mode: 'video',
	items: [],
	videoUrl: 'https://www.youtube.com/watch?v=AcLAbtIxN64',
	designVersion: 'videoEmbed',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	anchor: 'video'
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

const findCulturePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'culture' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findCulturePage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((entry) => entry && entry.id === SECTION_ID)) return

		const cta = sections.findIndex((entry) => entry && entry.id === CTA_ID)
		if (cta === -1) return
		sections.splice(cta, 0, SECTION)

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findCulturePage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((entry) => !entry || entry.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	}
)
