// Home page, approved content package rev. 2026-10-07, page 05 of 21.
// CHANGE · MATCHES APPLICATIONS PAGE — the "When light becomes programmable"
// section (cardsPeelBento, id "677cf547"), updated in place. No new section is
// created and the surrounding sections are untouched.
//
// The six Sense/Connect/Defense market cards become the approved four
// application areas, in the approved order, with the approved one-line bodies
// and a new "See all applications" action under the grid. The heading already
// matches once `titleCase` renders it, so it is left alone.
//
// Imagery: only two of the four areas have an approved Lumotive asset, so only
// those two carry one. The grey "Image" boxes in the package are descriptions,
// not assets, and nothing is invented for Defense or Optical Communications;
// those two render as the component's solid surface panels until Lumotive
// supplies artwork. Both reused files are already on the page today:
//   3D Sensing               -> market-robot-dog.jpg  (page 08: quadruped robot)
//   Optical Circuit Switching -> connect-optical.jpg   (page 08: data center)
//
// Status labels: page 05 and page 08 show "In production", "In development"
// and "Active programs" above each title. Global rule 1 forbids product
// availability and roadmap statements anywhere on the site, and the package
// contains no explicit exception for these labels, so they are omitted pending
// a decision. The `eyebrow` field is cleared rather than repurposed, so adding
// them later is a one-line change per card.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '677cf547'

const NEXT = {
	intro: 'One semiconductor platform for sensing, switching, communications, and more.',
	linkLabel: 'See all applications',
	linkUrl: '/applications',
	cards: [
		{
			accent: 'accent1',
			body: '<p>Robots, vehicles, and smart infrastructure.</p>',
			media: { kind: 'url', value: '/lumotive/img/market-robot-dog.jpg' },
			title: '3D Sensing'
		},
		{
			accent: 'accent1',
			body: '<p>AI data center networks.</p>',
			media: { kind: 'url', value: '/lumotive/img/connect-optical.jpg' },
			title: 'Optical Circuit Switching'
		},
		{
			accent: 'accent1',
			body: '<p>Sensing and optical systems.</p>',
			title: 'Defense'
		},
		{
			accent: 'accent1',
			body: '<p>Satellite, airborne, and terrestrial links.</p>',
			title: 'Optical Communications'
		}
	]
}

const PREV = {
	intro:
		'LCM opens new possibilities across sensing, switching, communications, defense, medical, computing, displays, and more.',
	linkLabel: '',
	linkUrl: '',
	cards: [
		{
			accent: 'accent1',
			body: '<p>Adaptive sensing for robotics, humanoids, automation, and other intelligent machines</p>',
			eyebrow: 'Sense',
			media: { kind: 'url', value: '/lumotive/img/market-robot-dog.jpg' },
			title: '3D sensing'
		},
		{
			accent: 'accent1',
			body: '<p>Surround sensing for automotive, robotaxi, trucking, and heavy equipment</p>',
			eyebrow: 'Sense',
			media: { kind: 'url', value: '/lumotive/img/market-passenger-adas.jpg' },
			title: 'Mobility'
		},
		{
			accent: 'accent1',
			body: '<p>Programmable sensing for traffic, parking, perimeter security, public spaces, and industrial monitoring</p>',
			eyebrow: 'Sense',
			media: { kind: 'url', value: '/lumotive/img/market-perimeter-security.jpg' },
			title: 'Smart infrastructure & surveillance'
		},
		{
			accent: 'accent2',
			body: '<p>Optical circuit switching for AI infrastructure</p>',
			eyebrow: 'Connect',
			title: 'AI data centers'
		},
		{
			accent: 'accent2',
			body: '<p>Beam control for satellite, airborne, terrestrial, and other optical links</p>',
			eyebrow: 'Connect',
			media: { kind: 'url', value: '/lumotive/img/connect-optical.jpg' },
			title: 'Optical communications'
		},
		{
			accent: 'accent3',
			body: '<p>Solid-state optical control for sensing, communications, and advanced optical systems</p>',
			eyebrow: 'Defense',
			title: 'Defense'
		}
	]
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

const apply = (app, state) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsPeelBento') return

	section.intro = state.intro
	section.cards = JSON.parse(JSON.stringify(state.cards))
	if (state.linkLabel) {
		section.linkLabel = state.linkLabel
		section.linkUrl = state.linkUrl
	} else {
		delete section.linkLabel
		delete section.linkUrl
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, NEXT)
	},
	(app) => {
		apply(app, PREV)
	}
)
