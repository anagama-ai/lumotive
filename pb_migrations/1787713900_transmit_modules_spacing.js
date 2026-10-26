// /dev-kits/transmit-modules spacing pass. The four light sections between
// the hero and the closing CTA move from `md` (80px a side, plus incidental
// heading and grid margins: 172–210px between content groups) to the new
// `compact` rhythm (40px a side on phones, 56px from 768px, with those outer
// margins dropped). The illumination cards reserve two title lines from
// 768px so every description starts at the same height. Hero and closing CTA
// unchanged. Guarded on the prior values; reverses exactly.
const COMPACT = ['d25f8a16', 'c3e07b94', 'a7b91de3', 'e6482fc1']
const ILLUMINATION = 'a7b91de3'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'transmit-modules' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const [from, to] = forward ? ['md', 'compact'] : ['compact', 'md']
	let changed = false
	for (const id of COMPACT) {
		const section = sections.find((s) => s && s.id === id)
		if (!section) continue
		if (section.spacingTop === from) { section.spacingTop = to; changed = true }
		if (section.spacingBottom === from) { section.spacingBottom = to; changed = true }
	}
	const illumination = sections.find((s) => s && s.id === ILLUMINATION)
	if (illumination) {
		if (forward && illumination.titleLines == null) { illumination.titleLines = '2'; changed = true }
		else if (!forward && illumination.titleLines === '2') { delete illumination.titleLines; changed = true }
	}
	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
