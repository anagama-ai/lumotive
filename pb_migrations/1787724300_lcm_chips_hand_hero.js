// /lcm-chips hero: the LS20 held between finger and thumb, widened on its own
// black so the chip sits in the right third.
const FROM = '/lumotive/img/lcm-ls20-hero.webp'
const TO = '/lumotive/img/lcm-chip-in-hand-hero.webp'

const swap = (app, from, to) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = "lcm-chips"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const hero = sections.find((s) => s.id === 'b7c41d08')
	if (hero?.media?.value !== from) return
	hero.media.value = to
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => swap(app, FROM, TO), (app) => swap(app, TO, FROM))
