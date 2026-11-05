// /dev-kits/dtof "Modular by Design": the NM120 internals photo replaces the placeholder.
const FROM = { media: { kind: 'url', value: '/lumotive/img/placeholder-nm120-internals.svg' }, mediaAlt: 'Placeholder: NM120 internals without enclosure, sensor head and compute board shown separately.' }
const TO = { media: { kind: 'url', value: '/lumotive/img/nm120-internals.webp' }, mediaAlt: 'NM120 sensor head without its enclosure: the receive lens, the LCM transmitter, and the driver board on one plate.' }

const apply = (app, values) => {
	const page = app.findFirstRecordByFilter('pages', 'path = "dev-kits/dtof"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	Object.assign(sections.find((s) => s.id === '6d2a9c41'), values)
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => apply(app, TO), (app) => apply(app, FROM))
