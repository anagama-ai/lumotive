// Platform page (/platform), approved content package rev. 2026-10-07, page 06
// of 21. Three changes, all content:
//
// 1. CHANGE · MANUFACTURING LINE — cardsPeelSwap (id "ace8d391"). The two card
//    bodies take the approved sentences word for word. The second one is the
//    manufacturing line the marker is named after: it now names CMOS nodes and
//    LCoS packaging instead of describing "established semiconductor
//    manufacturing principles" in the abstract. Heading, intro, card titles,
//    accents, the beam-steering video and the peel choreography are untouched.
//
// 2. NEW · 2D BEAMFORMING — a new splitDefault section inserted directly after
//    the flow-panel graphic (id "cac52f89"), matching the page-06 order. Copy,
//    the Dr. David R. Smith quote and the "Read the announcement" link are from
//    the package; the link resolves to the 2026-03-19 press release, the News
//    post that carries that announcement. Per the dev note there is no date and
//    no generation label for the 2D chip.
//    The approved 1D-vs-2D animation has not been supplied, so the section ships
//    without media. Adding `media` later restores the two-column layout with no
//    further change.
//
// 3. NEW · CHIP CARDS — a new cardsTextCards section inserted directly after
//    the "Dynamic scanning" panel (id "97a0771d"). Two cards, LM10 and LS20,
//    with the approved three lines each, and one shared "Explore LCM chips"
//    action under the grid. Per the dev note there is no availability and no
//    generation label on this page, so "Gen 1"/"Gen 2" do not appear.
//    The LM10 photo is a pending Lumotive input, so the cards ship without
//    photos rather than with a placeholder.
//
// Not touched here, and tracked as blockers: the #125 traditional-optics
// graphic (new artwork not supplied), the Interactive LCM Explorer section (the
// explorer bundle and its poster frame are not supplied), and the footer, which
// is a global component shared by all 21 pages.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SWAP_ID = 'ace8d391'
const FLOW_ID = 'cac52f89'
const SCANNING_ID = '97a0771d'

const BEAMFORMING_ID = 'b2d10f47'
const CHIPS_ID = 'c0a71d35'

const SWAP_BODY_NEXT = [
	'<p>LCM chips use engineered metasurfaces to control light at the surface of a semiconductor.</p>',
	'<p>Scalable, mature manufacturing: standard, well-established CMOS nodes and LCoS packaging.</p>'
]
const SWAP_BODY_PREV = [
	'<p>LCM chips use engineered metasurfaces to control photons at the surface of a semiconductor device, enabling precise control over how light is steered, shaped, and directed.</p>',
	'<p>Designed around established semiconductor manufacturing principles, LCM technology brings programmable optical control into chip-based systems that can scale across sensing, switching, communications, and other light-based applications.</p>'
]

const beamformingSection = () => ({
	anchor: 'beamforming',
	background: 'none',
	body:
		'<p>Our LM10 and LS20 chips steer light along one axis, reaching any angle in 40 \u00b5s, with up to 160\u00b0 native field of view. That is the foundation of today\u2019s LCM-based lidar.</p>' +
		'<p>We have demonstrated the world\u2019s first programmable 2D photonic beamforming chip: one semiconductor device that forms and steers beams across two axes, with no moving parts. The same chip can take on the work of mirrors, lenses, and beam splitters.</p>' +
		'<p>2D beamforming opens a path to high-port-count optical circuit switching, optical communications, optical computing, and advanced 3D sensing.</p>' +
		'<blockquote><p>\u201cAn important milestone for the field.\u201d</p><p>Dr. David R. Smith, Duke University</p></blockquote>',
	designVersion: 'default',
	eyebrow: 'Beamforming in one and two dimensions',
	heading: 'From 1D to 2D beamforming',
	id: BEAMFORMING_ID,
	linkLabel: 'Read the announcement',
	linkNewTab: false,
	linkUrl: '/posts/lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor',
	mediaPosition: 'right',
	spacingBottom: 'md',
	spacingTop: 'md',
	type: 'splitDefault',
	width: 'contained'
})

const chipsSection = () => ({
	anchor: 'lcm-chips',
	background: 'subtle',
	cards: [
		{
			accent: 'accent1',
			body:
				'<p>Beam steering module</p>' +
				'<p>160\u00b0 native steering, 0.4\u00b0 steps</p>' +
				'<p>Industrial, robotics, IoT, smart infrastructure</p>',
			title: 'LM10'
		},
		{
			accent: 'accent2',
			body:
				'<p>System-on-chip with integrated ASIC driver and scan controller</p>' +
				'<p>160\u00b0 native steering, 0.1\u00b0 steps</p>' +
				'<p>Automotive, industrial, robotics, IoT, smart infrastructure</p>',
			title: 'LS20'
		}
	],
	designVersion: 'textCards',
	eyebrow: 'LCM chips',
	heading: 'Two chips, one platform',
	id: CHIPS_ID,
	linkLabel: 'Explore LCM chips',
	linkNewTab: false,
	linkUrl: '/lcm-chips',
	spacingBottom: 'md',
	spacingTop: 'md',
	type: 'cardsTextCards',
	width: 'contained'
})

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

const findPlatformPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return null
	}
}

const indexOfSection = (sections, id) => sections.findIndex((entry) => entry && entry.id === id)

const setSwapBodies = (sections, bodies) => {
	const swap = sections[indexOfSection(sections, SWAP_ID)]
	if (!swap || swap.type !== 'cardsPeelSwap' || !Array.isArray(swap.cards)) return
	for (let i = 0; i < bodies.length && i < swap.cards.length; i++) {
		if (swap.cards[i]) swap.cards[i].body = bodies[i]
	}
}

// Insert after the anchor section, but only once: a re-run must not duplicate.
const insertAfter = (sections, anchorId, section) => {
	if (indexOfSection(sections, section.id) !== -1) return
	const at = indexOfSection(sections, anchorId)
	if (at === -1) return
	sections.splice(at + 1, 0, section)
}

const removeSection = (sections, id) => {
	const at = indexOfSection(sections, id)
	if (at !== -1) sections.splice(at, 1)
}

migrate(
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		setSwapBodies(sections, SWAP_BODY_NEXT)
		insertAfter(sections, FLOW_ID, beamformingSection())
		insertAfter(sections, SCANNING_ID, chipsSection())

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		setSwapBodies(sections, SWAP_BODY_PREV)
		removeSection(sections, BEAMFORMING_ID)
		removeSection(sections, CHIPS_ID)

		record.set('sections', sections)
		app.save(record)
	}
)
