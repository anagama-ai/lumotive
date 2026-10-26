// S26 hero contrast fixes, measured with the copy hidden against the backdrop
// under each line (99th percentile and brightest pixel; a screenshot measure,
// not an accessibility sign-off). Shade only: images, framing and copy are
// unchanged.
// - Phones, `mobileShade: max` (new heaviest phone shade):
//   Home video: some frames put the body at 3.36:1 (p99) with the standard
//     shade and 3.30:1 (brightest) with `strong`; `max` holds ≥ 7.06:1 over
//     the sampled frames.
//   Transmit (white-backed TX10 photo, was `strong`): 3.84 → ≥ 7.25:1.
//   LCM Chips (was `strong`): 4.02 → ≥ 7.40:1 at 360.
//   Applications (was `strong`): 4.42 at 430 → ≥ 7.80:1.
//   Automotive (was `strong`): 4.28 → ≥ 7.63:1.
// - Phones, `mobileShade: strong` on About (standard since the phone-hero
//   pass): 4.47 → ≥ 5.07:1.
// - Tablets 768-1023px, `tabletShade: strong` (new; the phone `strong`
//   gradient): Transmit 3.81 → ≥ 6.26, Culture 4.55 → ≥ 6.75, Contact 4.69 →
//   ≥ 7.71, Home video ≥ 4.21 → ≥ 9.79 (brightest pixel, 768-1000px).
const ABSENT = undefined
const CHANGES = [
	['home', '460c4c1f', 'mobileShade', ABSENT, 'max'],
	['home', '460c4c1f', 'tabletShade', ABSENT, 'strong'],
	['transmit-modules', 'b41d7c05', 'mobileShade', 'strong', 'max'],
	['transmit-modules', 'b41d7c05', 'tabletShade', ABSENT, 'strong'],
	['lcm-chips', 'b7c41d08', 'mobileShade', 'strong', 'max'],
	['culture', '6c524b47', 'tabletShade', ABSENT, 'strong'],
	['applications', 'acb2f280', 'mobileShade', 'strong', 'max'],
	['automotive', 'd81f4a60', 'mobileShade', 'strong', 'max'],
	['about', '3998f57f', 'mobileShade', ABSENT, 'strong'],
	['contact', 'ad9c07fe', 'tabletShade', ABSENT, 'strong']
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
