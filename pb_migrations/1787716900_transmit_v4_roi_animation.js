// Transmit Modules v4 (PDF page 13, "#154 + #155 merged"). Simon's
// RandomScanOrderWarehouse.gif fills the printed "Animation: non-sequential
// ROI pulses (up, down, center); point cloud sharpens continuously" slot of
// Programmable Illumination for a Dynamic World (`a7b91de3`). Converted to a
// looping H.264 MP4 (1280x922, the GIF's 12 frames at 300 ms, 3.6 s) with a
// poster from its final frame, shown with the shared LoopVideo (plays on
// screen, pauses off screen, reduced motion keeps the poster, labelled
// Play/Pause control). Capped at 40rem, about the printed half-width slot.
// The flood-illumination slot stays empty: that animation is not supplied
// and the ROI animation is not repeated in its place. Copy and the five cards
// are unchanged. Guarded on absent keys; down removes exactly these values.
const PAGE = 'transmit-modules'
const SECTION_ID = 'a7b91de3'
const FIELDS = {
	media: { kind: 'url', value: '/lumotive/video/tx10-random-scan-order.mp4' },
	mediaPoster: { kind: 'url', value: '/lumotive/img/tx10-random-scan-order-poster.webp' },
	mediaAlt:
		'Animation: the LCM transmit module pulses light into regions of a warehouse scene in a non-sequential order, and the point cloud fills in and sharpens with each pulse.',
	videoAspect: '1280 / 922',
	mediaMaxWidth: '40rem'
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE })
	} catch {
		return
	}
	let sections
	try {
		sections = JSON.parse(record.getString('sections') || '[]')
	} catch {
		return
	}
	if (!Array.isArray(sections)) return
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section) return
	if (forward) {
		if (Object.keys(FIELDS).some((key) => section[key] !== undefined)) return
		Object.assign(section, FIELDS)
	} else {
		if (!Object.entries(FIELDS).every(([key, value]) => same(section[key], value))) return
		for (const key of Object.keys(FIELDS)) delete section[key]
	}
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
