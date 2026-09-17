// Webvizio #82: the "Compare the offerings" section on /dev-kits (heading,
// "Evaluation level and best fit, side by side." intro and the five-row
// comparison table) was cut. Only that section (id "d089a7c6") goes; the
// individual product sections above it and the Contact Us CTA from #83 stay,
// and the shared cardsComparisonTable block type remains available to editors.
// Nothing links to its "compare" anchor, so no inbound links break.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'd089a7c6'
const SECTION_INDEX = 3

const COMPARISON_SECTION = {
	anchor: 'compare',
	background: 'none',
	cards: [
		{
			accent: 'accent1',
			body: '<p>Best for: optical engineers and module developers.</p>',
			eyebrow: 'Optical beamforming component',
			title: 'LCM Evaluation and Development Kit'
		},
		{
			accent: 'accent2',
			body: '<p>Best for: lidar module makers and system developers.</p>',
			eyebrow: 'Transmit subsystem',
			title: 'TX10 Development Kit'
		},
		{
			accent: 'accent3',
			body: '<p>Best for: OEM evaluation, prototyping and application testing.</p>',
			eyebrow: 'Complete lidar module',
			title: 'M30 Development Kit'
		},
		{
			accent: 'accent1',
			body: '<p>Best for: robotics, industrial automation, navigation and security.</p>',
			eyebrow: 'Complete lidar system',
			title: 'NM120 Development Kit'
		},
		{
			accent: 'accent2',
			body: '<p>Best for: teams building custom lidar products.</p>',
			eyebrow: 'Custom system development',
			title: 'Reference Designs'
		}
	],
	designVersion: 'comparisonTable',
	heading: 'Compare the offerings',
	id: SECTION_ID,
	intro: 'Evaluation level and best fit, side by side.',
	spacingBottom: 'md',
	spacingTop: 'md',
	type: 'cardsComparisonTable',
	width: 'contained'
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
		const next = sections.filter((section) => !section || section.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findDevKitsPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((section) => section && section.id === SECTION_ID)) return

		const index = Math.min(SECTION_INDEX, sections.length)
		sections.splice(index, 0, COMPARISON_SECTION)
		record.set('sections', sections)
		app.save(record)
	}
)
