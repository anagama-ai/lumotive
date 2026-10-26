// Automotive v4 (PDF page 11). Copy unchanged.
// - A Programmable Cocoon Around the Vehicle (`3e05d7b2`): Simon's
//   lumotive-fov-regions diagram (side and top views of near / mid / far
//   fields, 10 / 20 / 50 m, with their specs), self-hosted as
//   automotive-fov-regions.webp at its full 2560px. It is a wide infographic
//   with small labels, so it sits under the copy at the container width
//   (`mediaLayout: "below"`) rather than in the printed half-width slot.
// - First Solid-State 180° dToF Lidar (`9c2a6f85`): Simon's IMG_9388, which
//   is the MD180 photo already self-hosted as kit-md180.webp, on the right
//   on the white product panel, capped in height so it never outgrows the
//   copy.
// - Built for Real-World Conditions: unchanged ("Disregard" withdraws only
//   the dust/rain image row).
// Alt text transcribes what each image shows. Guarded on absent keys; down
// removes exactly these values.
const PAGE = 'automotive'
const CHANGES = {
	'3e05d7b2': {
		media: { kind: 'url', value: '/lumotive/img/automotive-fov-regions.webp' },
		mediaLayout: 'below',
		mediaAlt:
			'Coverage diagram from one sensor, in side and top views. Near field: ground plane, 10 m, 180° × 30°, 50 Hz, detects curbs, floor changes and close-proximity obstacles. Mid field: collision avoidance, 20 m, 180° × 60°, 10 Hz, detects surrounding objects in blind spots. Far field: long-range slice, 50 m, 180° × 10°, 10 Hz, detects oncoming traffic and supports localization.'
	},
	'9c2a6f85': {
		media: { kind: 'url', value: '/lumotive/img/kit-md180.webp' },
		mediaPosition: 'right',
		mediaFrame: 'panel',
		mediaMaxHeight: '22rem',
		mediaAlt: 'MD180 solid-state 180° dToF lidar'
	}
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
	let changed = false
	for (const [id, fields] of Object.entries(CHANGES)) {
		const section = sections.find((entry) => entry && entry.id === id)
		if (!section) continue
		if (forward && Object.keys(fields).some((key) => section[key] !== undefined)) continue
		if (!forward && !Object.entries(fields).every(([key, value]) => same(section[key], value))) continue
		for (const [key, value] of Object.entries(fields)) {
			if (forward) section[key] = value
			else delete section[key]
		}
		changed = true
	}
	if (!changed) return
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
