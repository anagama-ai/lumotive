// /lcm-chips hero (b7c41d08): split -> full-width band, a layout change
// requested by the client on 2026-10-21 (not in the v3 package, which shows
// the chip photo beside the copy). Same chip-in-hand photo, copy, actions and
// inquiry links (`lcm-chips`, `chips-flyer`); the existing band overlay and
// the compact, content-driven phone hero apply.
// Framing: the chip sits at ~48% of the photo, under the copy. From 1024px
// `mediaScale` 1.6 with `mediaShift` 25% moves it to ~72% of the band; the
// shift stays inside the scaled photo's own overhang (30%), so no backdrop
// strip is uncovered. Tablets (768-1023) crop the photo's sides, and
// `mediaAnchor` 0% keeps its left edge so the chip moves right, clear of the
// eyebrow. Phones crop harder: `mobileMediaPosition` 15% puts the chip in
// the right third of the band, beside the short headline lines, under the
// existing phone-only strong shade (body measured 3.01:1 at the brightest
// backdrop pixel at 360 with the standard shade, 4.02 with strong).
// Guarded on the prior values; reverses exactly.
const ABSENT = undefined
const HERO_ID = 'b7c41d08'
const CHANGES = [
	['type', 'heroSplit', 'heroBand'],
	['designVersion', 'split', 'band'],
	['mediaScale', ABSENT, '1.6'],
	['mediaShift', ABSENT, '25%'],
	['mediaAnchor', ABSENT, '0%'],
	['mobileMediaPosition', ABSENT, '15%'],
	['mobileShade', ABSENT, 'strong']
]

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'lcm-chips' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const hero = sections.find((s) => s && s.id === HERO_ID)
	const [typeBefore, typeAfter] = [CHANGES[0][1], CHANGES[0][2]]
	if (!hero || hero.type !== (forward ? typeBefore : typeAfter)) return
	for (const [key, before, after] of CHANGES) {
		const [from, to] = forward ? [before, after] : [after, before]
		if (hero[key] !== from) continue
		if (to === ABSENT) delete hero[key]
		else hero[key] = to
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
