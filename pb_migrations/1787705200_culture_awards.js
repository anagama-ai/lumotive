// The live /culture page includes an "Awards and Recognition" block, but the
// rebuilt page stops after its culture principles. Add the eight verified
// industry awards immediately before the closing careers CTA. CardsAwardCards
// owns the external-link treatment, so each award only needs its title, year
// and destination URL.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const CTA_SECTION_ID = '8c3ed872'
const SECTION_ID = 'f70b28d5'

const AWARDS_SECTION = {
	id: SECTION_ID,
	type: 'cardsAwardCards',
	eyebrow: 'Awards and recognition',
	heading: 'Recognized across the industry',
	cards: [
		{
			title: 'CES 2025 Innovation Awards',
			year: '2025',
			linkUrl: 'https://www.ces.tech/innovation-awards/2025/ylm-10lx-3d-lidar-sensor/'
		},
		{
			title: 'Laser Focus World 2024 Innovators Awards',
			year: '2024',
			linkUrl: 'https://www.laserfocusworld.com/home/article/55130256/2024-innovators-awards-meet-the-honorees'
		},
		{
			title: 'GSA Awards 2024 Startup to Watch Finalist',
			year: '2024',
			linkUrl: 'https://www.gsaglobal.org/the-2024-gsa-award-nominees-revealed/'
		},
		{
			title: 'CES 2024 Innovation Awards',
			year: '2024',
			linkUrl: 'https://www.ces.tech/innovation-awards/honorees/2024/honorees/l/lumotive-lm10-chip.aspx'
		},
		{
			title: 'Fast Company Next Big Things in Tech 2023',
			year: '2023',
			linkUrl: 'https://www.fastcompany.com/90979340/next-big-things-tech-transportation-2023'
		},
		{
			title: 'CES 2022 Innovation Awards',
			year: '2022',
			linkUrl: 'https://lumotive.reportablenews.com/pr/consumer-technology-association-recognizes-lumotive-with-two-ces-2022-innovation-awards'
		},
		{
			title: 'SPIE 2022 PRISM Award',
			year: '2022',
			linkUrl: 'https://www.businesswire.com/news/home/20220126005964/en/2022-SPIE-and-Photonics-Media-Prism-Awards-Celebrate-Innovative-Photonics-Technologies'
		},
		{
			title: 'Business Intelligence 2022 Excellence in AI',
			year: '2022',
			linkUrl: 'https://www.bintelligence.com/posts/6-people-26-companies-and-65-products-awarded-for-excellence-in-artificial-intelligence'
		}
	],
	designVersion: 'awardCards',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	anchor: 'awards'
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

		const cta = sections.findIndex((entry) => entry && entry.id === CTA_SECTION_ID)
		if (cta === -1) return
		sections.splice(cta, 0, AWARDS_SECTION)

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
