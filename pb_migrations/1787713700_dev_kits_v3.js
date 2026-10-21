// v3 page 12 (/dev-kits). The only v2→v3 copy change ("Skip the beamforming
// design") already shipped in 1787712600; the live copy matches v3 verbatim.
// Simon's four kit photos (A1 TX10, A2 M30, A3 NM120, A4 MD180) are
// transparent cut-outs. The page-03 kit card prints "Photo on light grey
// panel", so they are saved as trimmed transparent WebPs and shown with the
// new `mediaFrame: "panel"` treatment on the two family rows that are complete:
//   Transmit modules (2c84f7a1): TX10
//   dToF dev kits    (a90f62b3): NM120, MD180
// The iToF row (8d3b05e6) stays text-only: only M30 is supplied, ON140 and
// LI140 are not, and showing one of three is an open review decision.
// Also sets the meta description from the hero (global rule 14).
// Every change is guarded on the prior value and reverses exactly.
const PAGE = 'dev-kits'
const ROWS = {
	'2c84f7a1': { TX10: '/lumotive/img/kit-tx10.webp' },
	a90f62b3: { NM120: '/lumotive/img/kit-nm120.webp', MD180: '/lumotive/img/kit-md180.webp' }
}
const META = 'Evaluate LCM at the transmit, module, or system level. Start with a kit, or use a reference design as the foundation for your own product.'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	for (const [id, photos] of Object.entries(ROWS)) {
		const row = sections.find((s) => s && s.id === id && s.type === 'cardsMediaCards')
		if (!row || !Array.isArray(row.cards)) continue
		if (forward) {
			if (row.mediaFrame == null) { row.mediaFrame = 'panel'; changed = true }
			for (const card of row.cards) {
				const path = card && photos[card.title]
				if (path && card.media == null) { card.media = { kind: 'url', value: path }; changed = true }
			}
		} else {
			if (row.mediaFrame === 'panel') { delete row.mediaFrame; changed = true }
			for (const card of row.cards) {
				const path = card && photos[card.title]
				if (path && card.media && card.media.kind === 'url' && card.media.value === path) { delete card.media; changed = true }
			}
		}
	}
	if (changed) page.set('sections', sections)
	const description = page.getString('seoDescription')
	if (forward && !description) { page.set('seoDescription', META); changed = true }
	else if (!forward && description === META) { page.set('seoDescription', ''); changed = true }
	if (changed) app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
