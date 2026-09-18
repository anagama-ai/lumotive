// Webvizio #86: /applications keeps its "Software-defined 3D sensing for
// Physical AI" split (id "ebb6cf90", image right) and gains a matching one
// directly below it for Automotive / Safety Cocoon, mirrored with the image on
// the left.
//
// Same section type and presentation as the section above — splitDefault,
// designVersion "default", background "none", width "contained", md / md
// spacing — so the pair reads as one alternating unit, exactly as /tx10 and
// /m30 already alternate their splits. No component or schema change is
// needed: SplitDefault already renders mediaPosition "left".
//
// The image is the project's existing automotive photograph,
// /lumotive/img/market-passenger-adas.jpg, already shipped and used by the
// markets cards further down this page. No asset is added.
//
// The body is placeholder copy supplied with the ticket and approved by Josh
// as a stand-in, and the CTA repeats the first section's "Explore Lumotive
// Sense" -> /sense. No performance claim or number is stated anywhere in it.
//
// The anchor is "safety-cocoon": "automotive" is already taken by a card
// anchor in the markets section (id "357cf90c") and would collide in the DOM.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const AFTER_ID = 'ebb6cf90'
const SECTION_ID = 'b3ce5d47'

const SECTION = {
	id: SECTION_ID,
	type: 'splitDefault',
	eyebrow: 'Lumotive Sense',
	heading: 'Automotive Safety Cocoon',
	body: '<p>Lumotive Sense enables programmable 3D sensing around the vehicle, supporting adaptable perception for automotive and autonomous mobility applications.</p>',
	media: { kind: 'url', value: '/lumotive/img/market-passenger-adas.jpg' },
	mediaPosition: 'left',
	link: { label: 'Explore Lumotive Sense', newTab: false, type: 'custom', url: '/sense' },
	linkLabel: 'Explore Lumotive Sense',
	linkUrl: '/sense',
	linkNewTab: false,
	designVersion: 'default',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	anchor: 'safety-cocoon'
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

const findApplicationsPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'applications' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findApplicationsPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((entry) => entry && entry.id === SECTION_ID)) return

		const after = sections.findIndex((entry) => entry && entry.id === AFTER_ID)
		if (after === -1) return
		sections.splice(after + 1, 0, SECTION)

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findApplicationsPage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((entry) => entry && entry.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	}
)
