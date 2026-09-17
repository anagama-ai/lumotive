// Webvizio #84: the five-card Laser -> LCM Beam Steering -> Scene (ROI
// Highlighted) -> ToF Receiver -> 3D Output flow diagram was cut from
// /applications. Only that one block (section id "ade2dbe9") goes; the
// splitDefault above it and the "Scalable across 3D sensing markets" cards
// below it stay untouched, and the shared cardsFlowDiagram block type is still
// used by the editor elsewhere.
//
// `record.get('sections')` on a json field yields Go-side JSONRaw, which turns
// into junk in the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'ade2dbe9'
const SECTION_INDEX = 3

const FLOW_DIAGRAM_SECTION = {
	id: SECTION_ID,
	type: 'cardsFlowDiagram',
	cards: [
		{
			title: 'Laser',
			media: { kind: 'url', value: '/lumotive/img/flow-laser.png' },
			accent: 'accent1'
		},
		{
			title: 'LCM Beam Steering',
			media: { kind: 'url', value: '/lumotive/img/flow-lcm.png' },
			accent: 'accent1'
		},
		{
			title: 'Scene (ROI Highlighted)',
			media: { kind: 'url', value: '/lumotive/img/flow-scene-roi.png' },
			accent: 'accent3'
		},
		{
			title: 'ToF Receiver',
			media: { kind: 'url', value: '/lumotive/img/flow-tof-receiver.png' },
			accent: 'accent2'
		},
		{
			title: '3D Output',
			media: { kind: 'url', value: '/lumotive/img/flow-3d-output.png' },
			accent: 'accent2'
		}
	],
	designVersion: 'flowDiagram',
	background: 'none',
	width: 'contained',
	spacingTop: 'none',
	spacingBottom: 'md',
	anchor: ''
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
		const next = sections.filter((section) => !section || section.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findApplicationsPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((section) => section && section.id === SECTION_ID)) return

		const index = Math.min(SECTION_INDEX, sections.length)
		sections.splice(index, 0, FLOW_DIAGRAM_SECTION)
		record.set('sections', sections)
		app.save(record)
	}
)
