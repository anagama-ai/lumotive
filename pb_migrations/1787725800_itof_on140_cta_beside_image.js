// /dev-kits/itof: the ON140 depth-map image and its closing lines move into the
// ON140 CTA, which sets them in two columns beside the two actions.
const CARDS = '5d92c6ba'
const CTA = '9a30fe52'
const MOVED = {
	media: { kind: 'url', value: '/lumotive/img/itof-wide-field-depth.webp' },
	mediaAlt: 'Warehouse shelving captured by LCM-based iToF across the full field of view: the depth map on the left and the point cloud on the right.',
	conclusion: 'Plus everything LCM-based iToF does: software-defined ROIs and virtual sensors, HDR for bright targets, and reduced multipath and interference.',
	outro: 'In the kit: pre-assembled bench-top system with AF0130 receiver, TX10 transmitter, and USB3 adapter.',
}
const CARD_ONLY = { mediaMaxWidth: '46rem', mediaPlacement: 'afterGrid' }

const apply = (app, forward) => {
	const page = app.findFirstRecordByFilter('pages', 'path = "dev-kits/itof"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const cards = sections.find((s) => s.id === CARDS)
	const cta = sections.find((s) => s.id === CTA)
	const ctaFields = { media: MOVED.media, mediaAlt: MOVED.mediaAlt, body: `<p>${MOVED.conclusion}</p>`, caveat: MOVED.outro }
	if (forward) {
		for (const key of [...Object.keys(MOVED), ...Object.keys(CARD_ONLY)]) delete cards[key]
		Object.assign(cta, ctaFields)
	} else {
		Object.assign(cards, MOVED, CARD_ONLY)
		for (const key of Object.keys(ctaFields)) delete cta[key]
	}
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => apply(app, true), (app) => apply(app, false))
