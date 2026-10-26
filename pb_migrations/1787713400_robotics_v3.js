// v3 page 10 (/sense/robotics). No v2→v3 text change on this page. This pass:
//   1. Hero (4c1a8e02): Simon's A1 AGV-AMR photo. It is byte-for-byte the
//      same picture as the existing /lumotive/img/market-agv.jpg, so that file
//      is reused rather than duplicated.
//   2. The four closing benefits (2e6c48da) become the printed bullet list
//      under "One Sensor, Three Jobs" instead of four title-only cards.
//   3. Design Your Own (6f24b8c1) shows the printed 01–04 step numerals, and
//      the Integrate card loses an extra "your" the v2 build had added:
//      "…compute board or body, with no separate sensor box."
// Kit photos are deliberately NOT added: only M30 (A2) and NM120 (A3) are
// supplied, and the four cards stay uniform until LI140/ON140 arrive.
// "Elyar's video" (A4) is a lead, not a file; nothing is substituted.
// Every change is guarded on the prior value and reverses exactly.
const PAGE = 'robotics'
const HERO_ID = '4c1a8e02'
const BENEFITS_ID = '2e6c48da'
const STEPS_ID = '6f24b8c1'
const HERO_MEDIA = '/lumotive/img/market-agv.jpg'
const BENEFIT_TITLES = ['Fewer sensors to buy', 'Fewer parts to maintain', 'Simpler calibration', 'Lower total power']
const BENEFITS_CARDS = {
	align: 'container',
	anchor: '',
	background: 'none',
	cards: [
		{ accent: 'accent1', title: 'Fewer sensors to buy' },
		{ accent: 'accent2', title: 'Fewer parts to maintain' },
		{ accent: 'accent3', title: 'Simpler calibration' },
		{ accent: 'accent1', title: 'Lower total power' }
	],
	columns: '4',
	designVersion: 'textCards',
	id: BENEFITS_ID,
	spacingBottom: 'md',
	spacingTop: 'sm',
	type: 'cardsTextCards',
	width: 'contained'
}
const BENEFITS_LIST = {
	align: 'container',
	anchor: '',
	background: 'none',
	body: '<ul>' + BENEFIT_TITLES.map((title) => `<li>${title}</li>`).join('') + '</ul>',
	designVersion: 'default',
	id: BENEFITS_ID,
	spacingBottom: 'md',
	spacingTop: 'sm',
	type: 'splitDefault',
	width: 'contained'
}
const INTEGRATE_BEFORE = '<p>Place the LCM transmitter and receiver directly on your robot’s compute board or your body, with no separate sensor box.</p>'
const INTEGRATE_AFTER = '<p>Place the LCM transmitter and receiver directly on your robot’s compute board or body, with no separate sensor box.</p>'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false

	const hero = sections.find((s) => s && s.id === HERO_ID && s.type === 'heroBand')
	if (hero) {
		if (forward && hero.media == null) {
			hero.media = { kind: 'url', value: HERO_MEDIA }
			changed = true
		} else if (!forward && hero.media && hero.media.kind === 'url' && hero.media.value === HERO_MEDIA) {
			delete hero.media
			changed = true
		}
	}

	const at = sections.findIndex((s) => s && s.id === BENEFITS_ID)
	if (at !== -1) {
		const current = sections[at]
		const titles = Array.isArray(current.cards) ? current.cards.map((c) => c && c.title) : []
		if (forward && current.type === 'cardsTextCards' && JSON.stringify(titles) === JSON.stringify(BENEFIT_TITLES)) {
			sections[at] = BENEFITS_LIST
			changed = true
		} else if (!forward && current.type === 'splitDefault' && current.body === BENEFITS_LIST.body) {
			sections[at] = BENEFITS_CARDS
			changed = true
		}
	}

	const steps = sections.find((s) => s && s.id === STEPS_ID && s.type === 'cardsTextCards')
	if (steps && Array.isArray(steps.cards)) {
		const integrate = steps.cards.find((c) => c && c.title === 'Integrate')
		if (forward) {
			if (steps.numbered == null) { steps.numbered = 'true'; changed = true }
			if (integrate && integrate.body === INTEGRATE_BEFORE) { integrate.body = INTEGRATE_AFTER; changed = true }
		} else {
			if (steps.numbered === 'true') { delete steps.numbered; changed = true }
			if (integrate && integrate.body === INTEGRATE_AFTER) { integrate.body = INTEGRATE_BEFORE; changed = true }
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
