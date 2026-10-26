// LCM Chips v4 (PDF page 07): Simon supplied `lcm-programmable-eyes.gif` for
// "From Fixed Sensors to Programmable Eyes" with "This is one visual". It
// replaces both printed panels (system loop and SVG scan timeline), so it
// goes in as one visual between the introduction and the numbered steps.
// Per page 03 the GIF is converted to a looping MP4 with a poster frame
// (1000x604: the GIF's last row is plain background, cropped for H.264).
// The approved steps, note and outro are unchanged. The alt text describes
// the animation in the package's own placeholder terms.
// Guarded on absent keys; down removes exactly these keys.
const ABSENT = undefined
const PAGE = 'lcm-chips'
const SECTION_ID = '9f08c3d6'
const FIELDS = {
	media: { kind: 'url', value: '/lumotive/video/lcm-programmable-eyes.mp4' },
	mediaPoster: { kind: 'url', value: '/lumotive/img/lcm-programmable-eyes-poster.webp' },
	mediaAlt:
		'Looping system animation: the laser fires into the LCM chip, which steers the beam through the transmit optics to one region of the field of view at a time, while the receive lens and time-of-flight sensor read out that region; a scan timeline plots angle against time.',
	videoAspect: '1000 / 604'
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
	let changed = false
	for (const [key, value] of Object.entries(FIELDS)) {
		if (forward && section[key] === ABSENT) {
			section[key] = value
			changed = true
		} else if (!forward && same(section[key], value)) {
			delete section[key]
			changed = true
		}
	}
	if (!changed) return
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
