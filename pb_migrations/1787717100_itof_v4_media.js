// iToF Dev Kits v4 (PDF page 14). Copy, section order, inquiry links, the M30
// opener photo and panel, the M30 demo video and the spacing refinements are
// unchanged. Guarded on the prior values of every touched key; down restores
// them exactly (sections keep their alphabetical key order).
// - Hero (`5a1c9f20`), I1: wscgr's LI140-ON140-M30.png three-kit cut-out laid
//   whole on the right of a white 2880x1200 banner (hero-itof-kits.webp),
//   composed and framed as the Dev Kits hero: `mediaAnchor: "100%"`, phones
//   `mobileMediaPosition: "100%"` with the `max` shade for the white banner.
//   At 768-1023px the body's first line ends over the light end of the
//   gradient (3.73:1 at the brightest backdrop pixel), so tablets take the
//   existing `strong` shade. The framing keys made for the old M30 photo
//   (mediaScale, mediaShift, mobileMediaScale, the 25% phone position) are
//   dropped with it.
// - Better Data, Safer Robots (`d4e09a21`), I4: Vimeo 1053591397 plays in
//   the page between the introduction and the two cards (`videoLayout:
//   "above"`), where the package prints the comparison slide. The approved
//   "Watch the comparison" link stays.
// - LI140 and ON140 openers (`f27b6c40`, `2b6e85d1`), I7: the cut-outs made
//   for /sense/robotics, set on M30's 1200x805 opener canvas, right-hand on
//   the same white panel (`mediaFrame: "panel"`).
// - High-Resolution Depth Across a Wide Field (`31ae7d06`), I5: the depth map
//   and point cloud under the copy, 28rem tall, full width on phones.
// - ON140 (`5d92c6ba`), I5: the same frame under the three feature cards,
//   before the closing line, as printed; 46rem wide (the same 28rem height).
// - Software-Defined Scanning (`7f50b3ec`), I6: Simon's static strip of all
//   five modes (margins trimmed) above the five mode cards, across the
//   container. Below a 75rem readable width it scrolls sideways with a hint.
//   No tabs and no animation: the supplied art is one still image.
const PAGE = 'itof'
const ABSENT = undefined
const url = (value) => ({ kind: 'url', value })
const DEPTH_ALT =
	'Warehouse shelving captured by LCM-based iToF across the full field of view: the depth map on the left and the point cloud on the right.'
const CHANGES = {
	'5a1c9f20': {
		media: [url('/lumotive/img/m30-dev-hero.jpg'), url('/lumotive/img/hero-itof-kits.webp')],
		mediaScale: ['1.04', ABSENT],
		mediaShift: ['20%', ABSENT],
		mobileMediaScale: ['1.2', ABSENT],
		mobileMediaPosition: ['25%', '100%'],
		mediaAnchor: [ABSENT, '100%'],
		mobileShade: [ABSENT, 'max'],
		tabletShade: [ABSENT, 'strong']
	},
	d4e09a21: {
		videoUrl: [ABSENT, 'https://vimeo.com/1053591397'],
		videoLayout: [ABSENT, 'above']
	},
	f27b6c40: {
		media: [ABSENT, url('/lumotive/img/itof-li140-opener.webp')],
		mediaAlt: [ABSENT, 'LI140 integrated RGB-D sensor head'],
		mediaFrame: [ABSENT, 'panel'],
		mediaPosition: [ABSENT, 'right']
	},
	'31ae7d06': {
		media: [ABSENT, url('/lumotive/img/itof-wide-field-depth.webp')],
		mediaAlt: [ABSENT, DEPTH_ALT],
		mediaLayout: [ABSENT, 'below'],
		mediaMaxHeight: [ABSENT, '28rem']
	},
	'7f50b3ec': {
		media: [ABSENT, url('/lumotive/img/itof-scan-modes.webp')],
		mediaAlt: [
			ABSENT,
			'Top-down scan diagrams of the five modes on one distance scale, each scanning 105° horizontally: Balanced to 4.5 m, High frame rate to 2.5 m, Max range to 7 m, AMR mode with a 3 m wide field plus a 6° center slice to 10 m, and Object interaction at very short range.'
		],
		mediaMinWidth: [ABSENT, '75rem'],
		mediaHint: [ABSENT, 'Scroll sideways to see all five modes.']
	},
	'2b6e85d1': {
		media: [ABSENT, url('/lumotive/img/itof-on140-opener.webp')],
		mediaAlt: [ABSENT, 'ON140 bench-top evaluation kit'],
		mediaFrame: [ABSENT, 'panel'],
		mediaPosition: [ABSENT, 'right']
	},
	'5d92c6ba': {
		media: [ABSENT, url('/lumotive/img/itof-wide-field-depth.webp')],
		mediaAlt: [ABSENT, DEPTH_ALT],
		mediaPlacement: [ABSENT, 'afterGrid'],
		mediaMaxWidth: [ABSENT, '46rem']
	}
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const sorted = (section) => Object.fromEntries(Object.keys(section).sort().map((key) => [key, section[key]]))

const apply = (app, from, to) => {
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
	const byId = new Map(sections.map((section, index) => [section && section.id, index]))
	// All or nothing: every touched key must hold its expected prior value.
	for (const [id, fields] of Object.entries(CHANGES)) {
		if (!byId.has(id)) return
		const section = sections[byId.get(id)]
		for (const [key, pair] of Object.entries(fields)) {
			if (!same(section[key], pair[from])) return
		}
	}
	for (const [id, fields] of Object.entries(CHANGES)) {
		const index = byId.get(id)
		const section = { ...sections[index] }
		for (const [key, pair] of Object.entries(fields)) {
			if (pair[to] === ABSENT) delete section[key]
			else section[key] = pair[to]
		}
		sections[index] = sorted(section)
	}
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, 0, 1),
	(app) => apply(app, 1, 0)
)
