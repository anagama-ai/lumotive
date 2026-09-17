// Webvizio #80 (customer-products step): adds a compact customer-products
// section to /dev-kits, between the offerings cards and the Contact Us CTA,
// linking out to the two shipping LCM-powered customer products.
//
// Both products and both URLs come from Lumotive's own references, not guessed:
//   * Lumotive's site navigation lists "Customer Products" -> "Hokuyo
//     YLM-10LX" linking https://www.hokuyo-aut.jp/search/single.php?serial=250
//     (verified: Hokuyo's YLM-10LX product page) and "Namuga Stella" linking
//     https://namuga.com/eng/business/mobility.php (verified live: Namuga's
//     Vehicle/Mobility page).
//   * Lumotive's press release "NAMUGA Unveils Stella-2: Compact, Solid-State
//     Lidar Powered by Lumotive, at Embedded Vision Summit" names the product
//     Stella-2, so that is the product name used here.
//
// Links are marked external: each opens in a new tab and its label names the
// manufacturer domain, and the section intro says so.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const OFFERINGS_ID = '4bf76360'
const SECTION_ID = 'e91c47a5'

const HOKUYO_URL = 'https://www.hokuyo-aut.jp/search/single.php?serial=250'
const NAMUGA_URL = 'https://namuga.com/eng/business/mobility.php'

const CUSTOMER_PRODUCTS_SECTION = {
	id: SECTION_ID,
	type: 'cardsTextCards',
	eyebrow: 'Customer products',
	heading: 'Shipping today on the LCM platform',
	intro: 'Hokuyo and Namuga build LCM-powered lidar you can buy today. Both links open the manufacturer’s own site in a new tab.',
	cards: [
		{
			eyebrow: 'Hokuyo',
			title: 'YLM-10LX',
			link: { type: 'custom', url: HOKUYO_URL, label: 'View on hokuyo-aut.jp', newTab: true },
			linkLabel: 'View on hokuyo-aut.jp',
			linkUrl: HOKUYO_URL,
			linkNewTab: true,
			accent: 'accent1'
		},
		{
			eyebrow: 'Namuga',
			title: 'Stella-2',
			link: { type: 'custom', url: NAMUGA_URL, label: 'View on namuga.com', newTab: true },
			linkLabel: 'View on namuga.com',
			linkUrl: NAMUGA_URL,
			linkNewTab: true,
			accent: 'accent2'
		}
	],
	designVersion: 'textCards',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	anchor: 'customer-products'
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

const findDevKitsPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findDevKitsPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((entry) => entry && entry.id === SECTION_ID)) return

		const offerings = sections.findIndex((entry) => entry && entry.id === OFFERINGS_ID)
		const index = offerings === -1 ? sections.length : offerings + 1
		sections.splice(index, 0, CUSTOMER_PRODUCTS_SECTION)

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findDevKitsPage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((entry) => !entry || entry.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	}
)
