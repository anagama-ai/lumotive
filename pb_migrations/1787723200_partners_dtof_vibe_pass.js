// Vibe review pass. /partners: Hokuyo leaves Module and solution providers
// (c5fe1eab). /dev-kits/dtof: the MD180 Interface tile (8c0416ae) becomes
// Resolution in Degrees, 0.7 x 0.7 degrees (its GigE note goes with it); the
// HDR (91e6c3a8) and tracking (5f0ab728) players take 2/3 of the row
// (`mediaSpan: wide`). Guarded on the exact prior values; down restores them.
const HOKUYO = { media: { kind: 'url', value: '/lumotive/logos/hokuyo.png' }, name: 'Hokuyo' }
const INTERFACE = { description: 'integrated compute', label: 'Interface', value: 'GigE' }
const RESOLUTION = { description: '', label: 'Resolution in Degrees', value: '0.7 x 0.7 degrees' }
const WIDE = ['91e6c3a8', '5f0ab728']

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const load = (app, slug) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug }) } catch { return }
	const sections = JSON.parse(page.getString('sections') || '[]')
	return Array.isArray(sections) ? { page, sections } : undefined
}
const save = (app, { page, sections }) => {
	page.set('sections', sections)
	app.save(page)
}

const partners = (app, forward) => {
	const found = load(app, 'partners')
	const section = found?.sections.find((s) => s && s.id === 'c5fe1eab')
	if (!section || !Array.isArray(section.logos)) return
	const at = section.logos.findIndex((logo) => logo && logo.name === 'Hokuyo')
	if (forward) {
		if (at < 0) return
		section.logos.splice(at, 1)
	} else {
		// Hokuyo sat after Namuga.
		const namuga = section.logos.findIndex((logo) => logo && logo.name === 'Namuga')
		if (at >= 0 || namuga < 0) return
		section.logos.splice(namuga + 1, 0, HOKUYO)
	}
	save(app, found)
}

const dtof = (app, forward) => {
	const found = load(app, 'dtof')
	if (!found) return
	const [from, to] = forward ? [INTERFACE, RESOLUTION] : [RESOLUTION, INTERFACE]
	const specs = found.sections.find((s) => s && s.id === '8c0416ae')
	const tile = specs?.stats?.findIndex((stat) => same(stat, from)) ?? -1
	if (tile >= 0) specs.stats[tile] = { ...to }
	for (const section of found.sections) {
		if (!section || !WIDE.includes(section.id)) continue
		if (forward) section.mediaSpan = 'wide'
		else delete section.mediaSpan
	}
	save(app, found)
}

migrate(
	(app) => { partners(app, true); dtof(app, true) },
	(app) => { partners(app, false); dtof(app, false) }
)
