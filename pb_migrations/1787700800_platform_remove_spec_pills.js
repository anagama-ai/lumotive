// Webvizio #74: the "Designed for broad optical system requirements" section on
// /platform (statsSpecPills, id "10abf783") and its six spec badges — aperture,
// wavelengths, switching, polarization, optical control and manufacturing — are
// cut. Only that section goes; the capabilities icon cards above and the
// dynamic-scanning split below keep their md/md spacing, and the shared
// statsSpecPills block type stays available. Nothing links to its "specs"
// anchor, so no inbound link breaks.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '10abf783'
const SECTION_INDEX = 5

const SPEC_PILLS_SECTION = {
	anchor: 'specs',
	background: 'none',
	designVersion: 'specPills',
	heading: 'Designed for broad optical system requirements',
	id: SECTION_ID,
	spacingBottom: 'md',
	spacingTop: 'md',
	stats: [
		{ label: 'Aperture', value: 'Up to 30 cm aperture' },
		{ label: 'Wavelengths', value: 'Visible to MWIR' },
		{ label: 'Switching', value: '50 μs switching' },
		{ label: 'Polarization', value: 'Polarization flexible' },
		{ label: 'Optical control', value: 'Programmable phase and intensity' },
		{ label: 'Manufacturing', value: 'CMOS-based scalability' }
	],
	type: 'statsSpecPills',
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

const findPlatformPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((section) => !section || section.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((section) => section && section.id === SECTION_ID)) return

		const index = Math.min(SECTION_INDEX, sections.length)
		sections.splice(index, 0, SPEC_PILLS_SECTION)
		record.set('sections', sections)
		app.save(record)
	}
)
