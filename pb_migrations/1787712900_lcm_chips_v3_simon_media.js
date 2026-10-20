// v3 page 07. Simon's annotations identify the LS20-in-hand hero and the
// LM10 comparison photo. The printed LS20 comparison image matches the
// existing isolated-chip asset; it is not the hero's hand-held photograph.
// "Robotics deck:" is only a lead for the system animation and SVG timeline.
const HERO_ID = 'b7c41d08'
const COMPARISON_ID = '5d2b71ae'
const DECOUPLING_ID = '84f1b7e2'
const PHOTOS = [
	{ card: 'LM10', path: '/lumotive/img/platform-lm10.webp' },
	{ card: 'LS20', path: '/lumotive/img/lcm-platform-chip.jpg' }
]
const HERO_PHOTO = '/lumotive/img/platform-ls20.webp'
const PREVIOUS_OUTRO = 'Optimize range, resolution, or coverage without trading one against another.'
const APPROVED_OUTRO = 'Raise range, resolution, or coverage without trading one against another.'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'lcm-chips' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	const hero = sections.find((section) => section && section.id === HERO_ID)
	if (hero && hero.type === 'heroSplit') {
		if (forward && hero.media == null) {
			hero.media = { kind: 'url', value: HERO_PHOTO }
			changed = true
		} else if (!forward && hero.media?.kind === 'url' && hero.media.value === HERO_PHOTO) {
			delete hero.media
			changed = true
		}
	}
	const comparison = sections.find((section) => section && section.id === COMPARISON_ID)
	if (comparison && comparison.type === 'cardsSpecComparison' && Array.isArray(comparison.cards)) {
		for (const { card: name, path } of PHOTOS) {
			const card = comparison.cards.find((entry) => entry && entry.title === name)
			if (!card) continue
			if (forward && card.media == null) {
				card.media = { kind: 'url', value: path }
				changed = true
			} else if (!forward && card.media?.kind === 'url' && card.media.value === path) {
				delete card.media
				changed = true
			}
		}
	}
	const decoupling = sections.find((section) => section && section.id === DECOUPLING_ID)
	if (decoupling && decoupling.type === 'cardsSpecComparison') {
		const from = forward ? PREVIOUS_OUTRO : APPROVED_OUTRO
		if (decoupling.outro === from) {
			decoupling.outro = forward ? APPROVED_OUTRO : PREVIOUS_OUTRO
			changed = true
		}
	}
	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
