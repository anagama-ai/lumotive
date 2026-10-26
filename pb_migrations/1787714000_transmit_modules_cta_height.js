// /dev-kits/transmit-modules closing CTA ("Pair TX10 with your iToF sensor",
// f0d3a5b8) made shorter. Section padding moves from `lg` (112px a side) to
// `md` (80px, -29%) at every width, and the opt-in `compactMobile` takes
// phones (<768px) to 72px a side (-36%). Text, buttons, links and the caveat
// are unchanged. Guarded on the prior values; reverses exactly.
const SECTION_ID = 'f0d3a5b8'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'transmit-modules' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const cta = sections.find((s) => s && s.id === SECTION_ID)
	if (!cta) return
	const [from, to] = forward ? ['lg', 'md'] : ['md', 'lg']
	let changed = false
	if (cta.spacingTop === from) { cta.spacingTop = to; changed = true }
	if (cta.spacingBottom === from) { cta.spacingBottom = to; changed = true }
	if (forward && cta.compactMobile == null) { cta.compactMobile = 'true'; changed = true }
	else if (!forward && cta.compactMobile === 'true') { delete cta.compactMobile; changed = true }
	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
