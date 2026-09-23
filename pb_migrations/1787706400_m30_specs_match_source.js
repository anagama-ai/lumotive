// /m30 specifications (id "1f5d84ab") match the source table line for line:
// the two Range Performance qualifiers sit under their label, the QVGA line
// sits under VGA in the value column, and the three disclaimers are separate
// lines below the table.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '1f5d84ab'

const OLD_INTRO =
	'Specifications subject to change. † Lidar performance is software-defined through Lumotive’s Open Lidar API and can vary based on configuration. †† All other specifications are measured at the default resolution of QVGA.'
const NEW_INTRO =
	'Specifications subject to change\n† Lidar performance is software-defined through Lumotive’s Open Lidar API and can vary based on configuration\n†† All other specifications are measured at the default resolution of QVGA'

const OLD_RESOLUTIONS = { label: 'Supported Resolutions†', value: 'VGA (640×480)', description: 'QVGA†† (320×240)' }
const NEW_RESOLUTIONS = { label: 'Supported Resolutions†', value: 'VGA (640×480)\nQVGA†† (320×240)' }

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

const apply = (app, fromIntro, toIntro, fromRes, toRes) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'm30' })
	} catch {
		return
	}
	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || !Array.isArray(section.stats)) return

	if (section.intro === fromIntro) section.intro = toIntro
	const idx = section.stats.findIndex((s) => s && s.label === fromRes.label && s.value === fromRes.value)
	if (idx !== -1) section.stats[idx] = toRes

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, OLD_INTRO, NEW_INTRO, OLD_RESOLUTIONS, NEW_RESOLUTIONS),
	(app) => apply(app, NEW_INTRO, OLD_INTRO, NEW_RESOLUTIONS, OLD_RESOLUTIONS)
)
