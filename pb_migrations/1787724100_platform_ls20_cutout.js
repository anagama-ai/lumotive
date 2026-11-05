// /platform LS20 card: the sharpened transparent cutout instead of the photo on black.
const FROM = '/lumotive/img/platform-ls20.webp'
const TO = '/lumotive/img/lcm-ls20-chip-crop.png'

const swap = (app, from, to) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = "platform"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const card = sections.find((s) => s.id === 'c0a71d35')?.cards?.find((c) => c.title === 'LS20')
	if (card?.media?.value !== from) return
	card.media.value = to
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => swap(app, FROM, TO), (app) => swap(app, TO, FROM))
