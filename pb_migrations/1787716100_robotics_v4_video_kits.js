// Robotics v4 (PDF page 10).
// - One Sensor, Three Jobs: Simon's Vimeo 1237762150 ("Lumotive: One Sensor,
//   Three Jobs") goes in the section's benefits split (`2e6c48da`), on the
//   right of the four bullets, under the three virtual-sensor cards. This is
//   the existing two-section layout, now with the printed video column.
// - Kits for Robotics (`c90e36b4`): all four photos together on the page-03
//   kit panel (`mediaFrame: "panel"`, contained, never cropped), matched by
//   product name: M30 = Simon's M30_thumb (white background removed),
//   NM120 = the existing kit-nm120 cut-out (Simon's IMG_0032), LI140 and
//   ON140 = wscgr's v4 cut-outs.
// Guarded on absent keys; down removes exactly these values.
const PAGE = 'robotics'
const SPLIT_ID = '2e6c48da'
const KITS_ID = 'c90e36b4'
const VIDEO_URL = 'https://vimeo.com/1237762150'
const PHOTOS = {
	M30: '/lumotive/img/kit-m30.webp',
	NM120: '/lumotive/img/kit-nm120.webp',
	LI140: '/lumotive/img/kit-li140.webp',
	ON140: '/lumotive/img/kit-on140.webp'
}

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
	const split = sections.find((entry) => entry && entry.id === SPLIT_ID)
	if (split) {
		if (forward && split.videoUrl === undefined && split.mediaPosition === undefined) {
			split.videoUrl = VIDEO_URL
			split.mediaPosition = 'right'
			changed = true
		} else if (!forward && split.videoUrl === VIDEO_URL) {
			delete split.videoUrl
			delete split.mediaPosition
			changed = true
		}
	}
	const kits = sections.find((entry) => entry && entry.id === KITS_ID)
	if (kits && Array.isArray(kits.cards)) {
		if (forward && kits.mediaFrame === undefined) {
			kits.mediaFrame = 'panel'
			changed = true
		} else if (!forward && kits.mediaFrame === 'panel') {
			delete kits.mediaFrame
			changed = true
		}
		for (const card of kits.cards) {
			const src = card && PHOTOS[card.title]
			if (!src) continue
			const media = { kind: 'url', value: src }
			if (forward && (card.media === undefined || card.media === null)) {
				card.media = media
				changed = true
			} else if (!forward && JSON.stringify(card.media) === JSON.stringify(media)) {
				delete card.media
				changed = true
			}
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
