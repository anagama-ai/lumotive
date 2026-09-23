// /m30: the "Ideal industries" text cards (cardsTextCards, id "6a04b9d7") become
// a cardsApplicationBento whose cards are copied from the /sense applications
// bento (id "2a6b5ed9") as it stands when this runs; the M30 heading and intro
// are kept. The "Next Generation Hardware, Defined By Software" wide image
// (mediaVideoEmbed, id "4e8b05f3") is removed.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const INDUSTRIES_ID = '6a04b9d7'
const WIDE_IMAGE_ID = '4e8b05f3'
const SENSE_BENTO_ID = '2a6b5ed9'

const TEXT_CARDS = [
	{ title: 'Automotive', accent: 'accent1' },
	{ title: 'Industrial', accent: 'accent2' },
	{ title: 'Commercial', accent: 'accent3' }
]

const WIDE_IMAGE_SECTION = {
	id: WIDE_IMAGE_ID,
	type: 'mediaVideoEmbed',
	heading: 'Next Generation Hardware, Defined By Software',
	mode: 'image',
	items: [{ media: { kind: 'url', value: '/lumotive/img/m30-dev-hardware-software.png' } }],
	designVersion: 'videoEmbed',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	anchor: 'hardware-software'
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

const findPage = (app, slug) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const sense = findPage(app, 'sense')
		const record = findPage(app, 'm30')
		if (!sense || !record) return

		const bento = readSections(sense).find((s) => s && s.id === SENSE_BENTO_ID)
		if (!bento || !Array.isArray(bento.cards)) return

		const sections = readSections(record)
		const industries = sections.find((s) => s && s.id === INDUSTRIES_ID)
		if (industries) {
			industries.type = 'cardsApplicationBento'
			industries.designVersion = 'applicationBento'
			industries.cards = JSON.parse(JSON.stringify(bento.cards))
		}

		const idx = sections.findIndex((s) => s && s.id === WIDE_IMAGE_ID)
		if (idx !== -1) sections.splice(idx, 1)

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findPage(app, 'm30')
		if (!record) return

		const sections = readSections(record)
		const industries = sections.find((s) => s && s.id === INDUSTRIES_ID)
		if (industries) {
			industries.type = 'cardsTextCards'
			industries.designVersion = 'textCards'
			industries.cards = TEXT_CARDS
		}

		if (!sections.some((s) => s && s.id === WIDE_IMAGE_ID)) {
			const after = sections.findIndex((s) => s && s.id === '2d9a71c4')
			sections.splice(after === -1 ? sections.length : after + 1, 0, WIDE_IMAGE_SECTION)
		}

		record.set('sections', sections)
		app.save(record)
	}
)
