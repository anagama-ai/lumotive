// /sense/automotive: keep the widened hero's right edge (the car) in frame.
// /platform: the Sense and Connect cards link to their pages.
const CARD_LINKS = {
	'Lumotive Sense': ['Explore Sense', '/sense'],
	'Lumotive Connect': ['Explore Connect', '/connect']
}

const editSection = (app, slug, id, edit) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
	const sections = JSON.parse(page.getString('sections') || '[]')
	const section = sections.find((s) => s.id === id)
	if (!section) return
	edit(section)
	page.set('sections', sections)
	app.save(page)
}

const apply = (app, forward) => {
	editSection(app, 'automotive', 'd81f4a60', (hero) => {
		if (forward) hero.mediaAnchor = '100%'
		else delete hero.mediaAnchor
	})
	editSection(app, 'platform', 'd38e36da', (section) => {
		for (const card of section.cards || []) {
			const target = CARD_LINKS[card.title]
			if (!target) continue
			const [label, url] = target
			if (forward) {
				card.link = { type: 'custom', newTab: false, label, url }
				Object.assign(card, { linkLabel: label, linkUrl: url, linkNewTab: false })
			} else if (card.linkUrl === url) {
				for (const key of ['link', 'linkLabel', 'linkUrl', 'linkNewTab']) delete card[key]
			}
		}
	})
}

migrate((app) => apply(app, true), (app) => apply(app, false))
