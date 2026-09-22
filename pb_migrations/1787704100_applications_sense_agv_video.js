// The /applications "Software-defined 3D sensing for Physical AI" split uses
// sense-agv.jpg, which matches the approved Vimeo source "Lumotive - AGV AMR".
// Add that video to this split while preserving the existing image as the
// component's fallback. No other section field or page content changes.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'ebb6cf90'
const HEADING = 'Software-defined 3D sensing for Physical AI'
const IMAGE_URL = '/lumotive/img/sense-agv.jpg'
const VIDEO_URL = 'https://vimeo.com/1174547871/6e198e52ae'

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

const findTargetSection = (sections) => {
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (
		!section ||
		section.type !== 'splitDefault' ||
		section.heading !== HEADING ||
		!section.media ||
		section.media.value !== IMAGE_URL
	) return null
	return section
}

migrate(
	(app) => {
		const record = findApplicationsPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findTargetSection(sections)
		if (!section || section.videoUrl === VIDEO_URL) return
		if ('videoUrl' in section) return

		section.videoUrl = VIDEO_URL
		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findApplicationsPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findTargetSection(sections)
		if (!section || section.videoUrl !== VIDEO_URL) return

		delete section.videoUrl
		record.set('sections', sections)
		app.save(record)
	}
)
