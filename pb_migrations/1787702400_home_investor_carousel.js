// Webvizio #65: "Replace with investor carousel (item 61)." On / the quote and
// stats scene — the Bill Gates testimonialsPeelScene (id "e14b646e") together
// with the statsSceneBand it carries (id "353e0b25": 160+ patents, $100M+
// raised, 3 CES awards) — is dropped, and the investor carousel takes its
// place.
//
// The carousel is not recreated: it is the page's own logosSceneBand
// (id "7fa60e69", heading "Backed by Gates Frontier, Amazon and Samsung
// Ventures", nine investor logos), rendered by LogosSceneBand -> LogosMarquee.
// It is the only investor carousel in the project, so this migration moves that
// exact record instead of adding a second copy; no logo, heading, component or
// asset changes, and no new section type is introduced.
//
// Sections.svelte attaches a scene band to the peel scene directly above it
// (isPeel(previous)), so the band travels from the "One chip. Boundless
// applications." scene (id "a20efeab") to the "When light becomes
// programmable" bento (id "677cf547"), landing in the slot the quote scene
// used to hold, just above the closing CTA. This matches lumotive.com, where
// the investor carousel appears once, low on the home page. Every remaining
// section keeps its own type, copy, width and none/none spacing, so the page
// rhythm is unchanged apart from the removed scene.
//
// Positions are resolved from section ids, never fixed indexes.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const BAND_ID = '7fa60e69'
const QUOTE_ID = 'e14b646e'
const STATS_ID = '353e0b25'
const SOLUTIONS_ID = 'a20efeab'
const BENTO_ID = '677cf547'
const CTA_ID = 'c5839355'

const QUOTE_SECTION = {
	anchor: '',
	background: 'none',
	designVersion: 'peelScene',
	id: QUOTE_ID,
	quotes: [
		{
			author: 'Bill Gates',
			quote: 'Lumotive’s technological vision and innovative use of metamaterials hold great promise for products that help mobilize and automate the world.'
		}
	],
	spacingBottom: 'none',
	spacingTop: 'none',
	type: 'testimonialsPeelScene',
	width: 'full'
}

const STATS_SECTION = {
	anchor: '',
	background: 'none',
	designVersion: 'sceneBand',
	id: STATS_ID,
	spacingBottom: 'none',
	spacingTop: 'none',
	stats: [
		{ label: 'Patents', suffix: '+', value: '160' },
		{ label: 'Raised', prefix: '$', suffix: 'M+', value: '100' },
		{ label: 'CES awards', value: '3' }
	],
	type: 'statsSceneBand',
	width: 'full'
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

const findHomePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
	} catch {
		return null
	}
}

const indexOfId = (sections, id) => sections.findIndex((entry) => entry && entry.id === id)

// Insert after the section with `afterId`, or at the end when it is absent.
const insertAfter = (sections, afterId, ...items) => {
	const index = indexOfId(sections, afterId)
	const at = index === -1 ? sections.length : index + 1
	sections.splice(at, 0, ...items)
}

migrate(
	(app) => {
		const record = findHomePage(app)
		if (!record) return

		const sections = readSections(record)
		const band = sections.find((entry) => entry && entry.id === BAND_ID)
		if (!band) return

		const next = sections.filter(
			(entry) => entry && entry.id !== BAND_ID && entry.id !== QUOTE_ID && entry.id !== STATS_ID
		)
		insertAfter(next, BENTO_ID, band)

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findHomePage(app)
		if (!record) return

		const sections = readSections(record)
		const band = sections.find((entry) => entry && entry.id === BAND_ID)
		if (!band) return

		const next = sections.filter((entry) => entry && entry.id !== BAND_ID)
		insertAfter(next, SOLUTIONS_ID, band)

		if (indexOfId(next, QUOTE_ID) === -1 && indexOfId(next, STATS_ID) === -1) {
			const cta = indexOfId(next, CTA_ID)
			const at = cta === -1 ? next.length : cta
			next.splice(at, 0, QUOTE_SECTION, STATS_SECTION)
		}

		record.set('sections', next)
		app.save(record)
	}
)
