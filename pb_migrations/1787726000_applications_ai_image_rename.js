// The AI computing card image was replaced under its old filename, and the CDN
// kept serving the cached original. A new filename makes caches fetch it fresh.
const FROM = '/lumotive/img/applications-ai-computing.webp'
const TO = '/lumotive/img/applications-ai-computing-servers.webp'

const apply = (app, from, to) => {
	const page = app.findFirstRecordByFilter('pages', 'path = "applications"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	for (const section of sections) {
		for (const card of section.cards ?? []) {
			if (card.media?.value === from) card.media.value = to
		}
	}
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => apply(app, FROM, TO), (app) => apply(app, TO, FROM))
