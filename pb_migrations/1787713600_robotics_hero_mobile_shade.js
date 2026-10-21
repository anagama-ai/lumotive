// /sense/robotics hero (4c1a8e02), outstanding R6: below 768px the warehouse
// photo put the hero body copy (white 75%) at about 4.2:1. `mobileShade:
// "strong"` swaps in a heavier phone-only shade; image, crop, copy, type,
// height and desktop are unchanged. Guarded; reverses exactly.
const SECTION_ID = '4c1a8e02'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'robotics' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const hero = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'heroBand')
	if (!hero) return
	if (forward && hero.mobileShade == null) hero.mobileShade = 'strong'
	else if (!forward && hero.mobileShade === 'strong') delete hero.mobileShade
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
