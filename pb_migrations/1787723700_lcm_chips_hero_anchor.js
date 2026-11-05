// The rebuilt /lcm-chips hero sits the chip in the right third; anchor the
// crop to the right edge so narrower bands keep the chip whole.
const setAnchor = (app, value) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = "lcm-chips"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const hero = sections.find((s) => s.id === 'b7c41d08')
	if (!hero) return
	if (value) hero.mediaAnchor = value
	else delete hero.mediaAnchor
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => setAnchor(app, '100%'), (app) => setAnchor(app, null))
