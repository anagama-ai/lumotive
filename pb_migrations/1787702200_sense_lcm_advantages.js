// Webvizio #72: "Remove sections 01-03, replace with 6 bullet points from
// technology page." In the "From platform to sensing system" timeline on /sense
// (id "28be79eb", anchor "paths") the stage numbers are positional — the
// component prints stageIndex + 1 — so 01/02/03 are the Platform, Sensing
// solution and Core product stages, and 04 is Development paths. This migration
// drops those three stages together with the four item rows nested under them
// and keeps the Development paths stage untouched, with its Development and
// Evaluation Kits group and the TX10 / M30 / NM120 items. Nothing stores the
// stage number, so Development paths renumbers to 01 on its own; the ticket
// asks for no number to be preserved and no field is added to hold one.
//
// The six points take the place of the removed stages as a cardsIconCards
// section directly above the timeline. Copy is not invented: the cards are this
// port's own /platform capabilities section (id "b89bead0"), which is the
// technology page's "Key Advantages of LCM Optical Beamforming" list — same six
// points, same order, same titles, body copy, icons and accents. Every icon
// already ships, and cardsIconCards is already used on /sense for "The
// problem", so no block type, component, CSS or media file is touched.
//
// The timeline's heading and intro move onto that section and become the
// heading and context for the six points. They are cleared on the timeline so
// the same heading is not shown a second time above Development paths; the
// component renders both conditionally, so the stripped timeline just starts at
// its stage row. The "paths" anchor stays on the timeline and nothing links to
// the new section, so no inbound link changes.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const TIMELINE_ID = '28be79eb'
const SECTION_ID = 'c7f4a1e9'

const HEADING = 'From platform to sensing system'
const INTRO =
	'Built on the LCM™ programmable optics platform and powered by the LM10 beamforming chip, Lumotive Sense gives you multiple ways to evaluate, develop, and build the sensing system that’s right for your application.'

const REMOVED_ROWS = [
	{ index: 0, row: { level: 'stage', title: 'Platform' } },
	{
		index: 1,
		row: {
			body: '<p>A common semiconductor platform for software-defined light control across sensing, switching, and communications.</p>',
			level: 'item',
			media: { kind: 'url', value: '/lumotive/img/icon-lcm-platform-on-dark.png' },
			title: 'LCM™ Programmable Optics Platform'
		}
	},
	{
		index: 2,
		row: {
			body: '<p>Evaluate the underlying LCM technology and programmable beam-steering capabilities.</p>',
			level: 'item',
			media: { kind: 'url', value: '/lumotive/img/icon-lcm-kit-on-dark.png' },
			title: 'LCM Evaluation and Development Kit'
		}
	},
	{ index: 3, row: { level: 'stage', title: 'Sensing solution' } },
	{
		index: 4,
		row: {
			body: '<p>Programmable 3D sensing for Physical AI and autonomous systems.</p>',
			level: 'item',
			media: { kind: 'url', value: '/lumotive/img/sense-architecture-wafer.png' },
			title: 'Lumotive Sense'
		}
	},
	{ index: 5, row: { level: 'stage', title: 'Core product' } },
	{
		index: 6,
		row: {
			body: '<p>The semiconductor foundation for Lumotive Sense, enabling programmable beam steering without moving parts.</p>',
			level: 'item',
			media: { kind: 'url', value: '/lumotive/img/lm10-chip-clean.png' },
			title: 'LM10 Beamforming Chip'
		}
	}
]

const ADVANTAGES_SECTION = {
	id: SECTION_ID,
	type: 'cardsIconCards',
	heading: HEADING,
	intro: INTRO,
	cards: [
		{
			accent: 'accent1',
			body: '<p>Control light electronically, without mechanical steering components, motors, or moving assemblies.</p>',
			media: { kind: 'url', value: '/lumotive/img/icon-solid-state.png' },
			title: 'Solid-state optical control'
		},
		{
			accent: 'accent2',
			body: '<p>Support wide fields of view with precise, software-controlled beam positioning — up to 160° native steering, and greater than 180° with expansion optics in supported designs.</p>',
			media: { kind: 'url', value: '/lumotive/img/icon-beam-steering.png' },
			title: 'Wide-angle beam steering'
		},
		{
			accent: 'accent3',
			body: '<p>Program beam direction, lensing, collimation, multiple beams, adaptive optics, and custom phase or intensity patterns.</p>',
			media: { kind: 'url', value: '/lumotive/img/icon-software-defined.png' },
			title: 'Software-defined optical functions'
		},
		{
			accent: 'accent1',
			body: '<p>Scale from compact sensing systems to optical communications, switching, computing, displays, and other light-based applications.</p>',
			media: { kind: 'url', value: '/lumotive/img/icon-scalability.png' },
			title: 'Scalability across applications'
		},
		{
			accent: 'accent2',
			body: '<p>Support optical architectures spanning visible through infrared wavelengths, with compatibility across different light sources, sensing methods, and system designs.</p>',
			media: { kind: 'url', value: '/lumotive/img/icon-wavelengths.png' },
			title: 'Multiple wavelengths and architectures'
		},
		{
			accent: 'accent3',
			body: '<p>Control light through subwavelength metasurface pixels engineered to shape optical phase at the semiconductor surface.</p>',
			media: { kind: 'url', value: '/lumotive/img/icon-metamaterials.png' },
			title: 'Powered by metamaterials'
		}
	],
	designVersion: 'iconCards',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'none',
	anchor: ''
}

const matches = (row, target) =>
	Boolean(row) && row.level === target.level && row.title === target.title

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

const findSensePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' })
	} catch {
		return null
	}
}

const findTimeline = (sections) => {
	const section = sections.find((entry) => entry && entry.id === TIMELINE_ID)
	if (!section || section.type !== 'timeline' || !Array.isArray(section.rows)) return null
	return section
}

migrate(
	(app) => {
		const record = findSensePage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findTimeline(sections)
		if (!section) return

		section.rows = section.rows.filter(
			(row) => !REMOVED_ROWS.some((entry) => matches(row, entry.row))
		)
		section.heading = ''
		section.intro = ''

		if (!sections.some((entry) => entry && entry.id === SECTION_ID)) {
			const timeline = sections.findIndex((entry) => entry && entry.id === TIMELINE_ID)
			const index = timeline === -1 ? sections.length : timeline
			sections.splice(index, 0, ADVANTAGES_SECTION)
		}

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findSensePage(app)
		if (!record) return

		const sections = readSections(record).filter((entry) => !entry || entry.id !== SECTION_ID)
		const section = findTimeline(sections)
		if (!section) return

		for (const entry of REMOVED_ROWS) {
			if (section.rows.some((row) => matches(row, entry.row))) continue
			section.rows.splice(Math.min(entry.index, section.rows.length), 0, entry.row)
		}
		section.heading = HEADING
		section.intro = INTRO

		record.set('sections', sections)
		app.save(record)
	}
)
