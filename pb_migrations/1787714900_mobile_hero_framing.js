// Phone hero pass, pages 05-21. Images, copy, actions and desktop/tablet are
// unchanged; every value below acts below 768px only.
// - `compactMobile` leaves the three heroes that carried it (Sense, iToF,
//   dToF): HeroFullHeight now takes that compact form on every phone hero,
//   so the field no longer exists. Their rendering is unchanged.
// - Framing and shade, chosen per photograph at 360/390/430 so the subject
//   stays in frame and, with the copy hidden, the backdrop behind each line
//   holds 4.5:1 at its 99th-percentile brightest pixel (3:1 for headings),
//   preferring the lighter standard shade wherever it holds:
//     platform     chip              shade strong (chip highlights at 3.9:1)
//     applications beam fan          shade strong
//     sense        robot at the right  100%, shade strong
//     robotics     AGV fleet           0% (already strong)
//     automotive   car whole           shade strong
//     dev-kits     camera board        shade strong
//     transmit     TX10 module         65% (already strong; white backdrop,
//                                       best of 12 framings tried)
//     connect      left beam fan       0%
//     about        optics and engineer 75%, standard shade (was strong)
//     partners     light burst         100%
//     contact      building at right   25%, shade strong
//   Home (video), Culture, iToF and dToF framing already hold; unchanged.
// Guarded on the prior values; reverses exactly.
const ABSENT = undefined
const CHANGES = [
	['platform', 'a85debcc', 'mobileShade', ABSENT, 'strong'],
	['applications', 'acb2f280', 'mobileShade', ABSENT, 'strong'],
	['sense', 'd9bf96da', 'compactMobile', 'true', ABSENT],
	['sense', 'd9bf96da', 'mobileMediaPosition', ABSENT, '100%'],
	['sense', 'd9bf96da', 'mobileShade', ABSENT, 'strong'],
	['robotics', '4c1a8e02', 'mobileMediaPosition', ABSENT, '0%'],
	['automotive', 'd81f4a60', 'mobileShade', ABSENT, 'strong'],
	['dev-kits', '1b368f3c', 'mobileShade', ABSENT, 'strong'],
	['transmit-modules', 'b41d7c05', 'mobileMediaPosition', ABSENT, '65%'],
	['itof', '5a1c9f20', 'compactMobile', 'true', ABSENT],
	['dtof', 'a7c0d613', 'compactMobile', 'true', ABSENT],
	['connect', 'ffa907ea', 'mobileMediaPosition', ABSENT, '0%'],
	['about', '3998f57f', 'mobileMediaPosition', ABSENT, '75%'],
	['about', '3998f57f', 'mobileShade', 'strong', ABSENT],
	['partners', 'e95fe8b0', 'mobileMediaPosition', ABSENT, '100%'],
	['contact', 'ad9c07fe', 'mobileMediaPosition', ABSENT, '25%'],
	['contact', 'ad9c07fe', 'mobileShade', ABSENT, 'strong']
]

const apply = (app, forward) => {
	for (const slug of [...new Set(CHANGES.map(([s]) => s))]) {
		let page
		try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug }) }
		catch { continue }
		let sections
		try { sections = JSON.parse(page.getString('sections') || '[]') }
		catch { continue }
		if (!Array.isArray(sections)) continue
		let changed = false
		for (const [pageSlug, id, key, before, after] of CHANGES) {
			if (pageSlug !== slug) continue
			const section = sections.find((s) => s && s.id === id)
			if (!section) continue
			const [from, to] = forward ? [before, after] : [after, before]
			if (section[key] !== from) continue
			if (to === ABSENT) delete section[key]
			else section[key] = to
			changed = true
		}
		if (!changed) continue
		page.set('sections', sections)
		app.save(page)
	}
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
