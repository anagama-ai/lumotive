// Home hero: keep existing media and shades beneath the Vimeo background.
const VIDEO_URL = 'https://vimeo.com/1040214357'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const section = sections.find((s) => s && s.id === '460c4c1f')
	if (!section) return
	if (forward) {
		if (section.videoUrl !== undefined) return
		section.videoUrl = VIDEO_URL
	} else {
		if (section.videoUrl !== VIDEO_URL) return
		delete section.videoUrl
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
