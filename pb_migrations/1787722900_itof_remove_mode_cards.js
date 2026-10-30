// Remove the redundant mode cards; retain the scan diagram and supporting copy.
migrate((app) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'itof' }) }
	catch { return }
	const sections = JSON.parse(page.getString('sections') || '[]')
	const section = sections.find((s) => s.id === '7f50b3ec')
	if (!section || !Array.isArray(section.cards) || !section.cards.length) return
	section.cards = []
	page.set('sections', sections)
	app.save(page)
}, () => {})
