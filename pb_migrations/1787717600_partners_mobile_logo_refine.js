// /partners phone logo refinement (below 768px). Only these three panels opt
// into LogosLabelled's compact mobile rhythm and logo caps. Hero, content and
// tablet/desktop presentation stay unchanged. Preserve explicit CMS choices.
const SECTION_IDS = ['c5fe1eab', '3138ddf9', '7c333883']

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'partners' })
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
	for (const section of sections) {
		if (!section || !SECTION_IDS.includes(section.id) || section.type !== 'logosLabelled') continue
		if (forward && section.compactMobile === undefined) {
			section.compactMobile = true
			changed = true
		} else if (!forward && section.compactMobile === true) {
			delete section.compactMobile
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
