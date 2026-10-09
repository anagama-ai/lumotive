// "Why Lumotive is different" on /sense (cardsComparisonCards, id "bb989678"):
// the Lumotive column label becomes "Lumotive Sense powered by LCM™" and the
// four Traditional-lidar rows get their own icons so every row carries a unique
// one. All four icons already ship in static/lumotive/img.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'bb989678'
const OLD_LABEL = 'Lumotive Sense (LCM™)'
const NEW_LABEL = 'Lumotive Sense powered by LCM™'

const TRADITIONAL_ICONS = {
	Sensor: '/lumotive/img/icon-multiple-sensors.png',
	'Fixed FOV': '/lumotive/img/icon-fixed-fov.png',
	'Static scan': '/lumotive/img/icon-poor-adaptability.png',
	Compromises: '/lumotive/img/icon-blind-spots.png'
}

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const findPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' })
	} catch {
		return null
	}
}

const apply = (app, fromLabel, toLabel, addIcons) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsComparisonCards' || !Array.isArray(section.cards)) return

	for (const card of section.cards) {
		if (!card) continue
		if (card.eyebrow === fromLabel) card.eyebrow = toLabel
		const icon = TRADITIONAL_ICONS[card.title]
		if (!icon) continue
		if (addIcons) card.media = { kind: 'url', value: icon }
		else if (card.media && card.media.value === icon) delete card.media
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, OLD_LABEL, NEW_LABEL, true),
	(app) => apply(app, NEW_LABEL, OLD_LABEL, false)
)
